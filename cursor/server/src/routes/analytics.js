import express from 'express';
import { query, validationResult } from 'express-validator';
import { getPgPool, getRedisClient } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';

const router = express.Router();

// 获取仪表盘概览数据
router.get('/dashboard/overview', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('time_range').optional().isIn(['24h', '7d', '30d', '90d']).withMessage('时间范围无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { time_range = '24h' } = req.query;
  const pool = getPgPool();
  const redis = getRedisClient();

  try {
    // 计算时间范围
    let timeInterval;
    switch (time_range) {
      case '24h':
        timeInterval = '1 day';
        break;
      case '7d':
        timeInterval = '7 days';
        break;
      case '30d':
        timeInterval = '30 days';
        break;
      case '90d':
        timeInterval = '90 days';
        break;
      default:
        timeInterval = '1 day';
    }

    // 获取项目统计
    const projectStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        AVG(progress) as avg_progress
      FROM projects
      WHERE created_at >= NOW() - INTERVAL '${timeInterval}'
    `);

    // 获取应用统计
    const applicationStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'production' THEN 1 END) as production_apps,
        COUNT(CASE WHEN status = 'development' THEN 1 END) as development_apps
      FROM applications
      WHERE created_at >= NOW() - INTERVAL '${timeInterval}'
    `);

    // 获取用户统计
    const userStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN last_active >= NOW() - INTERVAL '7 days' THEN 1 END) as recently_active
      FROM users
    `);

    // 获取性能指标统计
    const performanceStatsResult = await pool.query(`
      SELECT 
        metric_name,
        AVG(metric_value) as avg_value,
        MAX(metric_value) as max_value,
        MIN(metric_value) as min_value
      FROM performance_metrics
      WHERE timestamp >= NOW() - INTERVAL '${timeInterval}'
      GROUP BY metric_name
    `);

    // 获取错误统计
    const errorStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_errors,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h,
        COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_errors
      FROM error_logs
      WHERE created_at >= NOW() - INTERVAL '${timeInterval}'
    `);

    // 获取Redis中的实时数据
    const realtimeData = {};
    try {
      const realtimeKeys = await redis.keys('metrics:*:realtime');
      for (const key of realtimeKeys) {
        const appId = key.split(':')[1];
        const metrics = await redis.hGetAll(key);
        realtimeData[appId] = metrics;
      }
    } catch (redisError) {
      logger.warn('获取Redis实时数据失败:', redisError);
    }

    res.json({
      success: true,
      data: {
        projects: projectStatsResult.rows[0],
        applications: applicationStatsResult.rows[0],
        users: userStatsResult.rows[0],
        performance: performanceStatsResult.rows,
        errors: errorStatsResult.rows[0],
        realtime: realtimeData,
        timeRange: time_range
      }
    });
  } catch (error) {
    logger.error('获取仪表盘概览数据失败:', error);
    throw error;
  }
}));

// 获取项目对比数据
router.get('/projects/comparison', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('project_ids').isString().withMessage('项目ID列表格式无效'),
  query('metrics').optional().isString().withMessage('指标列表格式无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { project_ids, metrics } = req.query;
  const projectIds = project_ids.split(',');
  const pool = getPgPool();

  try {
    // 验证项目ID
    const projectValidationResult = await pool.query(`
      SELECT id, name FROM projects WHERE id = ANY($1)
    `, [projectIds]);

    if (projectValidationResult.rows.length !== projectIds.length) {
      return res.status(400).json({
        success: false,
        message: '部分项目ID无效'
      });
    }

    // 获取项目基本信息
    const projectsResult = await pool.query(`
      SELECT 
        p.id, p.name, p.status, p.progress, p.budget, p.actual_cost,
        p.risk_level, p.quality_score, p.created_at,
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT ptm.user_id) as team_size
      FROM projects p
      LEFT JOIN applications a ON p.id = a.project_id
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id
      WHERE p.id = ANY($1)
      GROUP BY p.id, p.name, p.status, p.progress, p.budget, p.actual_cost, p.risk_level, p.quality_score, p.created_at
    `, [projectIds]);

    // 获取项目性能指标对比
    const performanceComparisonResult = await pool.query(`
      SELECT 
        a.project_id,
        p.name as project_name,
        pm.metric_name,
        AVG(pm.metric_value) as avg_value,
        MAX(pm.metric_value) as max_value,
        MIN(pm.metric_value) as min_value
      FROM performance_metrics pm
      JOIN applications a ON pm.application_id = a.id
      JOIN projects p ON a.project_id = p.id
      WHERE a.project_id = ANY($1)
        AND pm.timestamp >= NOW() - INTERVAL '7 days'
      GROUP BY a.project_id, p.name, pm.metric_name
      ORDER BY a.project_id, pm.metric_name
    `, [projectIds]);

    // 获取项目错误统计对比
    const errorComparisonResult = await pool.query(`
      SELECT 
        a.project_id,
        p.name as project_name,
        el.error_type,
        COUNT(*) as error_count,
        COUNT(CASE WHEN el.created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h
      FROM error_logs el
      JOIN applications a ON el.application_id = a.id
      JOIN projects p ON a.project_id = p.id
      WHERE a.project_id = ANY($1)
        AND el.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY a.project_id, p.name, el.error_type
      ORDER BY a.project_id, el.error_type
    `, [projectIds]);

    // 按项目分组数据
    const comparisonData = projectsResult.rows.map(project => {
      const projectPerformance = performanceComparisonResult.rows
        .filter(row => row.project_id === project.id)
        .reduce((acc, row) => {
          acc[row.metric_name] = {
            avg: parseFloat(row.avg_value),
            max: parseFloat(row.max_value),
            min: parseFloat(row.min_value)
          };
          return acc;
        }, {});

      const projectErrors = errorComparisonResult.rows
        .filter(row => row.project_id === project.id)
        .reduce((acc, row) => {
          acc[row.error_type] = {
            total: parseInt(row.error_count),
            last24h: parseInt(row.errors_24h)
          };
          return acc;
        }, {});

      return {
        ...project,
        performance: projectPerformance,
        errors: projectErrors
      };
    });

    res.json({
      success: true,
      data: {
        projects: comparisonData,
        metrics: metrics ? metrics.split(',') : null
      }
    });
  } catch (error) {
    logger.error('获取项目对比数据失败:', error);
    throw error;
  }
}));

// 获取应用对比数据
router.get('/applications/comparison', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('application_ids').isString().withMessage('应用ID列表格式无效'),
  query('time_range').optional().isIn(['24h', '7d', '30d']).withMessage('时间范围无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { application_ids, time_range = '24h' } = req.query;
  const applicationIds = application_ids.split(',');
  const pool = getPgPool();

  try {
    // 计算时间范围
    let timeInterval;
    switch (time_range) {
      case '24h':
        timeInterval = '1 day';
        break;
      case '7d':
        timeInterval = '7 days';
        break;
      case '30d':
        timeInterval = '30 days';
        break;
      default:
        timeInterval = '1 day';
    }

    // 获取应用基本信息
    const applicationsResult = await pool.query(`
      SELECT 
        a.id, a.name, a.status, a.version, a.url,
        p.name as project_name, p.id as project_id
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = ANY($1)
    `, [applicationIds]);

    // 获取应用性能指标对比
    const performanceResult = await pool.query(`
      SELECT 
        application_id,
        metric_name,
        AVG(metric_value) as avg_value,
        MAX(metric_value) as max_value,
        MIN(metric_value) as min_value,
        COUNT(*) as sample_count
      FROM performance_metrics
      WHERE application_id = ANY($1)
        AND timestamp >= NOW() - INTERVAL '${timeInterval}'
      GROUP BY application_id, metric_name
      ORDER BY application_id, metric_name
    `, [applicationIds]);

    // 获取应用错误统计对比
    const errorResult = await pool.query(`
      SELECT 
        application_id,
        error_type,
        COUNT(*) as total_errors,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h,
        COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_errors
      FROM error_logs
      WHERE application_id = ANY($1)
        AND created_at >= NOW() - INTERVAL '${timeInterval}'
      GROUP BY application_id, error_type
      ORDER BY application_id, error_type
    `, [applicationIds]);

    // 按应用分组数据
    const comparisonData = applicationsResult.rows.map(app => {
      const appPerformance = performanceResult.rows
        .filter(row => row.application_id === app.id)
        .reduce((acc, row) => {
          acc[row.metric_name] = {
            avg: parseFloat(row.avg_value),
            max: parseFloat(row.max_value),
            min: parseFloat(row.min_value),
            samples: parseInt(row.sample_count)
          };
          return acc;
        }, {});

      const appErrors = errorResult.rows
        .filter(row => row.application_id === app.id)
        .reduce((acc, row) => {
          acc[row.error_type] = {
            total: parseInt(row.total_errors),
            last24h: parseInt(row.errors_24h),
            resolved: parseInt(row.resolved_errors)
          };
          return acc;
        }, {});

      return {
        ...app,
        performance: appPerformance,
        errors: appErrors
      };
    });

    res.json({
      success: true,
      data: {
        applications: comparisonData,
        timeRange: time_range
      }
    });
  } catch (error) {
    logger.error('获取应用对比数据失败:', error);
    throw error;
  }
}));

// 获取趋势数据
router.get('/trends', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('metric').isString().withMessage('指标名称不能为空'),
  query('time_range').isIn(['7d', '30d', '90d']).withMessage('时间范围无效'),
  query('granularity').optional().isIn(['hour', 'day']).withMessage('时间粒度无效'),
  query('application_ids').optional().isString().withMessage('应用ID列表格式无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const {
    metric,
    time_range,
    granularity = 'day',
    application_ids
  } = req.query;

  const pool = getPgPool();

  try {
    // 计算时间范围
    let timeInterval;
    switch (time_range) {
      case '7d':
        timeInterval = '7 days';
        break;
      case '30d':
        timeInterval = '30 days';
        break;
      case '90d':
        timeInterval = '90 days';
        break;
      default:
        timeInterval = '7 days';
    }

    // 构建查询条件
    let whereConditions = ['pm.metric_name = $1', 'pm.timestamp >= NOW() - INTERVAL $2'];
    let queryParams = [metric, timeInterval];
    let paramIndex = 3;

    if (application_ids) {
      const appIds = application_ids.split(',');
      whereConditions.push(`pm.application_id = ANY($${paramIndex++})`);
      queryParams.push(appIds);
    }

    const whereClause = whereConditions.join(' AND ');

    // 根据时间粒度聚合数据
    let timeGroupBy;
    switch (granularity) {
      case 'hour':
        timeGroupBy = "DATE_TRUNC('hour', pm.timestamp)";
        break;
      case 'day':
        timeGroupBy = "DATE_TRUNC('day', pm.timestamp)";
        break;
      default:
        timeGroupBy = "DATE_TRUNC('day', pm.timestamp)";
    }

    const query = `
      SELECT 
        ${timeGroupBy} as time_bucket,
        pm.application_id,
        a.name as application_name,
        AVG(pm.metric_value) as avg_value,
        MAX(pm.metric_value) as max_value,
        MIN(pm.metric_value) as min_value,
        COUNT(*) as sample_count
      FROM performance_metrics pm
      JOIN applications a ON pm.application_id = a.id
      WHERE ${whereClause}
      GROUP BY time_bucket, pm.application_id, a.name
      ORDER BY time_bucket ASC, pm.application_id
    `;

    const result = await pool.query(query, queryParams);

    // 按应用分组数据
    const trendData = {};
    result.rows.forEach(row => {
      const appId = row.application_id;
      if (!trendData[appId]) {
        trendData[appId] = {
          applicationName: row.application_name,
          data: []
        };
      }
      trendData[appId].data.push({
        timestamp: row.time_bucket,
        avg: parseFloat(row.avg_value),
        max: parseFloat(row.max_value),
        min: parseFloat(row.min_value),
        samples: parseInt(row.sample_count)
      });
    });

    res.json({
      success: true,
      data: {
        metric,
        timeRange: time_range,
        granularity,
        trends: trendData
      }
    });
  } catch (error) {
    logger.error('获取趋势数据失败:', error);
    throw error;
  }
}));

// 获取用户分布数据
router.get('/users/distribution', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('dimension').isIn(['role', 'department', 'skills']).withMessage('分布维度无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { dimension } = req.query;
  const pool = getPgPool();

  try {
    let query;
    let queryParams = [];

    switch (dimension) {
      case 'role':
        query = `
          SELECT 
            role,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
          FROM users
          WHERE is_active = true
          GROUP BY role
          ORDER BY count DESC
        `;
        break;
      case 'department':
        query = `
          SELECT 
            COALESCE(department, '未分配') as department,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
          FROM users
          WHERE is_active = true
          GROUP BY department
          ORDER BY count DESC
        `;
        break;
      case 'skills':
        query = `
          SELECT 
            skill,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
          FROM users, UNNEST(skills) as skill
          WHERE is_active = true
          GROUP BY skill
          ORDER BY count DESC
          LIMIT 20
        `;
        break;
    }

    const result = await pool.query(query, queryParams);

    res.json({
      success: true,
      data: {
        dimension,
        distribution: result.rows
      }
    });
  } catch (error) {
    logger.error('获取用户分布数据失败:', error);
    throw error;
  }
}));

export default router;

