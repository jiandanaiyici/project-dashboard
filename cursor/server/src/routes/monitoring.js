import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getPgPool, getRedisClient } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// 上报性能指标
router.post('/metrics', [
  body('application_id').isUUID().withMessage('应用ID格式无效'),
  body('metrics').isArray().withMessage('指标数据必须是数组'),
  body('metrics.*.name').notEmpty().withMessage('指标名称不能为空'),
  body('metrics.*.value').isNumeric().withMessage('指标值必须是数字'),
  body('metrics.*.unit').optional().isString().withMessage('指标单位必须是字符串'),
  body('timestamp').optional().isISO8601().withMessage('时间戳格式无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { application_id, metrics, timestamp = new Date().toISOString() } = req.body;
  const pool = getPgPool();
  const redis = getRedisClient();

  try {
    // 验证应用是否存在
    const appResult = await pool.query('SELECT id FROM applications WHERE id = $1', [application_id]);
    if (appResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    // 批量插入性能指标
    const insertPromises = metrics.map(metric => {
      return pool.query(`
        INSERT INTO performance_metrics (application_id, metric_name, metric_value, metric_unit, timestamp, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        application_id,
        metric.name,
        metric.value,
        metric.unit || null,
        timestamp,
        JSON.stringify(metric.metadata || {})
      ]);
    });

    await Promise.all(insertPromises);

    // 更新Redis缓存中的实时指标
    const redisKey = `metrics:${application_id}:realtime`;
    const realtimeMetrics = {};
    
    metrics.forEach(metric => {
      realtimeMetrics[metric.name] = {
        value: metric.value,
        unit: metric.unit,
        timestamp: timestamp
      };
    });

    await redis.hSet(redisKey, realtimeMetrics);
    await redis.expire(redisKey, 300); // 5分钟过期

    logger.info(`性能指标上报成功: 应用${application_id}, 指标数量${metrics.length}`);

    res.json({
      success: true,
      message: '性能指标上报成功'
    });
  } catch (error) {
    logger.error('性能指标上报失败:', error);
    throw error;
  }
}));

// 获取实时性能指标
router.get('/metrics/realtime/:applicationId', [
  query('metrics').optional().isString().withMessage('指标名称格式无效')
], asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { metrics } = req.query;
  const redis = getRedisClient();

  try {
    const redisKey = `metrics:${applicationId}:realtime`;
    const realtimeMetrics = await redis.hGetAll(redisKey);

    if (Object.keys(realtimeMetrics).length === 0) {
      return res.json({
        success: true,
        data: {
          metrics: {},
          timestamp: new Date().toISOString()
        }
      });
    }

    // 解析Redis中的数据
    const parsedMetrics = {};
    Object.entries(realtimeMetrics).forEach(([key, value]) => {
      try {
        parsedMetrics[key] = JSON.parse(value);
      } catch (e) {
        parsedMetrics[key] = { value: parseFloat(value), unit: null, timestamp: new Date().toISOString() };
      }
    });

    // 如果指定了特定指标，只返回这些指标
    let filteredMetrics = parsedMetrics;
    if (metrics) {
      const requestedMetrics = metrics.split(',');
      filteredMetrics = {};
      requestedMetrics.forEach(metricName => {
        if (parsedMetrics[metricName]) {
          filteredMetrics[metricName] = parsedMetrics[metricName];
        }
      });
    }

    res.json({
      success: true,
      data: {
        metrics: filteredMetrics,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('获取实时性能指标失败:', error);
    throw error;
  }
}));

// 获取历史性能指标
router.get('/metrics/history/:applicationId', [
  query('start_time').isISO8601().withMessage('开始时间格式无效'),
  query('end_time').isISO8601().withMessage('结束时间格式无效'),
  query('metric_names').optional().isString().withMessage('指标名称格式无效'),
  query('granularity').optional().isIn(['minute', 'hour', 'day']).withMessage('时间粒度无效'),
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('每页数量必须在1-1000之间')
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
    granularity = 'hour',
    page = 1,
    limit = 100
  } = req.query;

  const pool = getPgPool();
  const offset = (page - 1) * limit;

  try {
    // 构建查询条件
    let whereConditions = ['pm.application_id = $1', 'pm.timestamp >= $2', 'pm.timestamp <= $3'];
    let queryParams = [applicationId, start_time, end_time];
    let paramIndex = 4;

    if (metric_names) {
      const metricList = metric_names.split(',');
      whereConditions.push(`pm.metric_name = ANY($${paramIndex++})`);
      queryParams.push(metricList);
    }

    const whereClause = whereConditions.join(' AND ');

    // 根据时间粒度聚合数据
    let timeGroupBy;
    switch (granularity) {
      case 'minute':
        timeGroupBy = "DATE_TRUNC('minute', pm.timestamp)";
        break;
      case 'hour':
        timeGroupBy = "DATE_TRUNC('hour', pm.timestamp)";
        break;
      case 'day':
        timeGroupBy = "DATE_TRUNC('day', pm.timestamp)";
        break;
      default:
        timeGroupBy = "DATE_TRUNC('hour', pm.timestamp)";
    }

    const query = `
      SELECT 
        ${timeGroupBy} as time_bucket,
        pm.metric_name,
        AVG(pm.metric_value) as avg_value,
        MIN(pm.metric_value) as min_value,
        MAX(pm.metric_value) as max_value,
        COUNT(*) as sample_count
      FROM performance_metrics pm
      WHERE ${whereClause}
      GROUP BY time_bucket, pm.metric_name
      ORDER BY time_bucket DESC, pm.metric_name
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(DISTINCT ${timeGroupBy}, pm.metric_name) as total
      FROM performance_metrics pm
      WHERE ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

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
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取历史性能指标失败:', error);
    throw error;
  }
}));

// 上报错误日志
router.post('/errors', [
  body('application_id').isUUID().withMessage('应用ID格式无效'),
  body('error_type').isIn(['javascript', 'promise', 'network', 'resource']).withMessage('错误类型无效'),
  body('error_message').notEmpty().withMessage('错误消息不能为空'),
  body('error_stack').optional().isString().withMessage('错误堆栈必须是字符串'),
  body('filename').optional().isString().withMessage('文件名必须是字符串'),
  body('line_number').optional().isInt({ min: 0 }).withMessage('行号必须是非负整数'),
  body('column_number').optional().isInt({ min: 0 }).withMessage('列号必须是非负整数'),
  body('source_mapping').optional().isObject().withMessage('源码映射必须是对象'),
  body('user_agent').optional().isString().withMessage('用户代理必须是字符串'),
  body('url').optional().isString().withMessage('URL必须是字符串'),
  body('user_id').optional().isUUID().withMessage('用户ID格式无效')
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
    application_id,
    error_type,
    error_message,
    error_stack,
    filename,
    line_number,
    column_number,
    source_mapping,
    user_agent,
    url,
    user_id
  } = req.body;

  const pool = getPgPool();
  const redis = getRedisClient();

  try {
    // 验证应用是否存在
    const appResult = await pool.query('SELECT id FROM applications WHERE id = $1', [application_id]);
    if (appResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    // 插入错误日志
    const result = await pool.query(`
      INSERT INTO error_logs (
        application_id, error_type, error_message, error_stack,
        filename, line_number, column_number, source_mapping,
        user_agent, url, user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, created_at
    `, [
      application_id, error_type, error_message, error_stack,
      filename, line_number, column_number, JSON.stringify(source_mapping || {}),
      user_agent, url, user_id
    ]);

    const errorLog = result.rows[0];

    // 更新Redis中的错误统计
    const errorStatsKey = `errors:${application_id}:stats`;
    await redis.hIncrBy(errorStatsKey, error_type, 1);
    await redis.hIncrBy(errorStatsKey, 'total', 1);
    await redis.expire(errorStatsKey, 3600); // 1小时过期

    // 发送实时错误通知（通过Socket.IO）
    const io = req.app.get('io');
    if (io) {
      io.to(`project-${application_id}`).emit('error_occurred', {
        id: errorLog.id,
        application_id,
        error_type,
        error_message,
        timestamp: errorLog.created_at
      });
    }

    logger.warn(`错误日志记录成功: 应用${application_id}, 类型${error_type}`);

    res.status(201).json({
      success: true,
      message: '错误日志记录成功',
      data: { errorId: errorLog.id }
    });
  } catch (error) {
    logger.error('错误日志记录失败:', error);
    throw error;
  }
}));

// 获取错误统计
router.get('/errors/stats/:applicationId', [
  query('start_time').optional().isISO8601().withMessage('开始时间格式无效'),
  query('end_time').optional().isISO8601().withMessage('结束时间格式无效')
], asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { start_time, end_time } = req.query;
  const pool = getPgPool();
  const redis = getRedisClient();

  try {
    // 构建查询条件
    let whereConditions = ['application_id = $1'];
    let queryParams = [applicationId];
    let paramIndex = 2;

    if (start_time) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      queryParams.push(start_time);
    }

    if (end_time) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      queryParams.push(end_time);
    }

    const whereClause = whereConditions.join(' AND ');

    // 获取错误统计
    const statsQuery = `
      SELECT 
        error_type,
        COUNT(*) as count,
        COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_count
      FROM error_logs
      WHERE ${whereClause}
      GROUP BY error_type
      ORDER BY count DESC
    `;

    const statsResult = await pool.query(statsQuery, queryParams);

    // 获取总错误数
    const totalQuery = `
      SELECT 
        COUNT(*) as total_errors,
        COUNT(CASE WHEN resolved = true THEN 1 END) as resolved_errors,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h
      FROM error_logs
      WHERE ${whereClause}
    `;

    const totalResult = await pool.query(totalQuery, queryParams);
    const totals = totalResult.rows[0];

    // 获取Redis中的实时统计
    const redisKey = `errors:${applicationId}:stats`;
    const realtimeStats = await redis.hGetAll(redisKey);

    res.json({
      success: true,
      data: {
        byType: statsResult.rows,
        totals: {
          total: parseInt(totals.total_errors),
          resolved: parseInt(totals.resolved_errors),
          last24h: parseInt(totals.errors_24h)
        },
        realtime: realtimeStats
      }
    });
  } catch (error) {
    logger.error('获取错误统计失败:', error);
    throw error;
  }
}));

// 获取错误列表
router.get('/errors/:applicationId', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('error_type').optional().isString().withMessage('错误类型格式无效'),
  query('resolved').optional().isBoolean().withMessage('解决状态必须是布尔值'),
  query('start_time').optional().isISO8601().withMessage('开始时间格式无效'),
  query('end_time').optional().isISO8601().withMessage('结束时间格式无效')
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
    page = 1,
    limit = 20,
    error_type,
    resolved,
    start_time,
    end_time
  } = req.query;

  const pool = getPgPool();
  const offset = (page - 1) * limit;

  try {
    // 构建查询条件
    let whereConditions = ['application_id = $1'];
    let queryParams = [applicationId];
    let paramIndex = 2;

    if (error_type) {
      whereConditions.push(`error_type = $${paramIndex++}`);
      queryParams.push(error_type);
    }

    if (resolved !== undefined) {
      whereConditions.push(`resolved = $${paramIndex++}`);
      queryParams.push(resolved === 'true');
    }

    if (start_time) {
      whereConditions.push(`created_at >= $${paramIndex++}`);
      queryParams.push(start_time);
    }

    if (end_time) {
      whereConditions.push(`created_at <= $${paramIndex++}`);
      queryParams.push(end_time);
    }

    const whereClause = whereConditions.join(' AND ');

    // 查询错误列表
    const errorsQuery = `
      SELECT 
        id, error_type, error_message, error_stack,
        filename, line_number, column_number, source_mapping,
        user_agent, url, user_id, resolved, created_at
      FROM error_logs
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const errorsResult = await pool.query(errorsQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM error_logs
      WHERE ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        errors: errorsResult.rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取错误列表失败:', error);
    throw error;
  }
}));

export default router;
