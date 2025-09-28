import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';
import { requireApplicationAccess } from '../middleware/auth.js';

const router = express.Router();

// 获取应用列表
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('project_id').optional().isUUID().withMessage('项目ID格式无效'),
  query('status').optional().isIn(['development', 'testing', 'staging', 'production', 'deprecated']).withMessage('无效的应用状态'),
  query('keyword').optional().trim().isLength({ max: 200 }).withMessage('搜索关键词不能超过200字符')
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
    page = 1,
    limit = 10,
    project_id,
    status,
    keyword
  } = req.query;

  const offset = (page - 1) * limit;
  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (project_id) {
      whereConditions.push(`a.project_id = $${paramIndex++}`);
      queryParams.push(project_id);
    }

    if (status) {
      whereConditions.push(`a.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (keyword) {
      whereConditions.push(`(a.name ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`);
      queryParams.push(`%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 查询应用列表
    const applicationsQuery = `
      SELECT 
        a.id,
        a.name,
        a.description,
        a.status,
        a.version,
        a.url,
        a.repository_url,
        a.deployment_url,
        a.created_at,
        a.updated_at,
        p.name as project_name,
        p.id as project_id
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const applicationsResult = await pool.query(applicationsQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    // 为每个应用获取性能指标统计
    const applications = await Promise.all(applicationsResult.rows.map(async (app) => {
      const metricsResult = await pool.query(`
        SELECT 
          metric_name,
          AVG(metric_value) as avg_value,
          MAX(metric_value) as max_value,
          MIN(metric_value) as min_value,
          COUNT(*) as sample_count
        FROM performance_metrics
        WHERE application_id = $1 
          AND timestamp >= NOW() - INTERVAL '24 hours'
        GROUP BY metric_name
      `, [app.id]);

      const errorStatsResult = await pool.query(`
        SELECT 
          COUNT(*) as total_errors,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h
        FROM error_logs
        WHERE application_id = $1
      `, [app.id]);

      return {
        ...app,
        metrics: metricsResult.rows,
        errorStats: errorStatsResult.rows[0]
      };
    }));

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取应用列表失败:', error);
    throw error;
  }
}));

// 获取单个应用详情
router.get('/:applicationId', requireApplicationAccess, asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const pool = getPgPool();

  try {
    // 获取应用基本信息
    const appResult = await pool.query(`
      SELECT 
        a.*,
        p.name as project_name,
        p.id as project_id
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      WHERE a.id = $1
    `, [applicationId]);

    if (appResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    const application = appResult.rows[0];

    // 获取最近24小时的性能指标
    const metricsResult = await pool.query(`
      SELECT 
        metric_name,
        AVG(metric_value) as avg_value,
        MAX(metric_value) as max_value,
        MIN(metric_value) as min_value,
        COUNT(*) as sample_count
      FROM performance_metrics
      WHERE application_id = $1 
        AND timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY metric_name
      ORDER BY metric_name
    `, [applicationId]);

    // 获取错误统计
    const errorStatsResult = await pool.query(`
      SELECT 
        error_type,
        COUNT(*) as count,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as count_24h
      FROM error_logs
      WHERE application_id = $1
      GROUP BY error_type
      ORDER BY count DESC
    `, [applicationId]);

    // 获取最近的错误日志
    const recentErrorsResult = await pool.query(`
      SELECT 
        id, error_type, error_message, filename, line_number, created_at
      FROM error_logs
      WHERE application_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [applicationId]);

    res.json({
      success: true,
      data: {
        application: {
          ...application,
          metrics: metricsResult.rows,
          errorStats: errorStatsResult.rows,
          recentErrors: recentErrorsResult.rows
        }
      }
    });
  } catch (error) {
    logger.error('获取应用详情失败:', error);
    throw error;
  }
}));

// 创建应用
router.post('/', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('应用名称长度必须在2-200字符之间'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('应用描述不能超过1000字符'),
  body('project_id').isUUID().withMessage('项目ID格式无效'),
  body('url').optional().isURL().withMessage('应用URL格式无效'),
  body('repository_url').optional().isURL().withMessage('仓库URL格式无效'),
  body('deployment_url').optional().isURL().withMessage('部署URL格式无效')
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
    name,
    description,
    project_id,
    url,
    repository_url,
    deployment_url
  } = req.body;

  const pool = getPgPool();

  try {
    // 验证项目是否存在
    const projectResult = await pool.query('SELECT id FROM projects WHERE id = $1', [project_id]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    // 创建应用
    const result = await pool.query(`
      INSERT INTO applications (name, description, project_id, url, repository_url, deployment_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, project_id, url, repository_url, deployment_url]);

    const application = result.rows[0];

    logger.info(`应用创建成功: ${name} (${application.id})`);

    res.status(201).json({
      success: true,
      message: '应用创建成功',
      data: { application }
    });
  } catch (error) {
    logger.error('创建应用失败:', error);
    throw error;
  }
}));

// 更新应用
router.put('/:applicationId', [
  requireApplicationAccess,
  body('name').optional().trim().isLength({ min: 2, max: 200 }).withMessage('应用名称长度必须在2-200字符之间'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('应用描述不能超过1000字符'),
  body('status').optional().isIn(['development', 'testing', 'staging', 'production', 'deprecated']).withMessage('无效的应用状态'),
  body('version').optional().trim().isLength({ max: 50 }).withMessage('版本号不能超过50字符'),
  body('url').optional().isURL().withMessage('应用URL格式无效'),
  body('repository_url').optional().isURL().withMessage('仓库URL格式无效'),
  body('deployment_url').optional().isURL().withMessage('部署URL格式无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { applicationId } = req.params;
  const updates = req.body;
  const pool = getPgPool();

  try {
    // 构建更新字段
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex++}`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有需要更新的字段'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(applicationId);

    const updateQuery = `
      UPDATE applications 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    logger.info(`应用更新成功: ${applicationId}`);

    res.json({
      success: true,
      message: '应用更新成功',
      data: { application: result.rows[0] }
    });
  } catch (error) {
    logger.error('更新应用失败:', error);
    throw error;
  }
}));

// 删除应用
router.delete('/:applicationId', [
  requireApplicationAccess,
  requireRole(['product_manager', 'project_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const pool = getPgPool();

  try {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING name', [applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    logger.info(`应用删除成功: ${result.rows[0].name} (${applicationId})`);

    res.json({
      success: true,
      message: '应用删除成功'
    });
  } catch (error) {
    logger.error('删除应用失败:', error);
    throw error;
  }
}));

// 获取应用性能趋势
router.get('/:applicationId/metrics/trend', [
  requireApplicationAccess,
  query('start_time').isISO8601().withMessage('开始时间格式无效'),
  query('end_time').isISO8601().withMessage('结束时间格式无效'),
  query('metric_names').optional().isString().withMessage('指标名称格式无效'),
  query('granularity').optional().isIn(['minute', 'hour', 'day']).withMessage('时间粒度无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { applicationId } = req.params;
  const {
    start_time,
    end_time,
    metric_names,
    granularity = 'hour'
  } = req.query;

  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = ['application_id = $1', 'timestamp >= $2', 'timestamp <= $3'];
    let queryParams = [applicationId, start_time, end_time];
    let paramIndex = 4;

    if (metric_names) {
      const metricList = metric_names.split(',');
      whereConditions.push(`metric_name = ANY($${paramIndex++})`);
      queryParams.push(metricList);
    }

    const whereClause = whereConditions.join(' AND ');

    // 根据时间粒度聚合数据
    let timeGroupBy;
    switch (granularity) {
      case 'minute':
        timeGroupBy = "DATE_TRUNC('minute', timestamp)";
        break;
      case 'hour':
        timeGroupBy = "DATE_TRUNC('hour', timestamp)";
        break;
      case 'day':
        timeGroupBy = "DATE_TRUNC('day', timestamp)";
        break;
      default:
        timeGroupBy = "DATE_TRUNC('hour', timestamp)";
    }

    const query = `
      SELECT 
        ${timeGroupBy} as time_bucket,
        metric_name,
        AVG(metric_value) as avg_value,
        MIN(metric_value) as min_value,
        MAX(metric_value) as max_value,
        COUNT(*) as sample_count
      FROM performance_metrics
      WHERE ${whereClause}
      GROUP BY time_bucket, metric_name
      ORDER BY time_bucket ASC, metric_name
    `;

    const result = await pool.query(query, queryParams);

    // 按指标名称分组数据
    const metricsData = {};
    result.rows.forEach(row => {
      const metricName = row.metric_name;
      if (!metricsData[metricName]) {
        metricsData[metricName] = [];
      }
      metricsData[metricName].push({
        timestamp: row.time_bucket,
        avg: parseFloat(row.avg_value),
        min: parseFloat(row.min_value),
        max: parseFloat(row.max_value),
        count: parseInt(row.sample_count)
      });
    });

    res.json({
      success: true,
      data: {
        metrics: metricsData,
        granularity,
        timeRange: {
          start: start_time,
          end: end_time
        }
      }
    });
  } catch (error) {
    logger.error('获取应用性能趋势失败:', error);
    throw error;
  }
}));

export default router;
