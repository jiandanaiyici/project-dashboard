import express from 'express';
import { body, validationResult } from 'express-validator';
import { getPgPool, getRedisClient } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';

const router = express.Router();

// 获取系统配置
router.get('/', [
  requireRole(['product_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const redis = getRedisClient();
  
  try {
    // 从Redis获取配置
    const configKeys = await redis.keys('config:*');
    const config = {};
    
    for (const key of configKeys) {
      const value = await redis.get(key);
      const configKey = key.replace('config:', '');
      try {
        config[configKey] = JSON.parse(value);
      } catch (e) {
        config[configKey] = value;
      }
    }

    res.json({
      success: true,
      data: { config }
    });
  } catch (error) {
    logger.error('获取系统配置失败:', error);
    throw error;
  }
}));

// 更新系统配置
router.put('/', [
  requireRole(['product_manager', 'delivery_manager']),
  body('config').isObject().withMessage('配置必须是对象')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { config } = req.body;
  const redis = getRedisClient();

  try {
    // 更新配置到Redis
    for (const [key, value] of Object.entries(config)) {
      const configKey = `config:${key}`;
      const configValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await redis.set(configKey, configValue);
    }

    logger.info('系统配置更新成功');

    res.json({
      success: true,
      message: '系统配置更新成功'
    });
  } catch (error) {
    logger.error('更新系统配置失败:', error);
    throw error;
  }
}));

// 获取性能监控配置
router.get('/monitoring', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const redis = getRedisClient();
  
  try {
    const config = await redis.hGetAll('config:monitoring');
    
    // 默认配置
    const defaultConfig = {
      lcp_threshold: 2500,
      fid_threshold: 100,
      cls_threshold: 0.25,
      error_rate_threshold: 0.05,
      availability_threshold: 99.9,
      response_time_threshold: 500,
      alert_enabled: true,
      alert_email: true,
      alert_dingtalk: false,
      alert_wechat: false
    };

    // 合并配置
    const monitoringConfig = { ...defaultConfig };
    for (const [key, value] of Object.entries(config)) {
      if (value !== null && value !== undefined) {
        try {
          monitoringConfig[key] = JSON.parse(value);
        } catch (e) {
          monitoringConfig[key] = value;
        }
      }
    }

    res.json({
      success: true,
      data: { config: monitoringConfig }
    });
  } catch (error) {
    logger.error('获取监控配置失败:', error);
    throw error;
  }
}));

// 更新性能监控配置
router.put('/monitoring', [
  requireRole(['product_manager', 'delivery_manager']),
  body('lcp_threshold').optional().isNumeric().withMessage('LCP阈值必须是数字'),
  body('fid_threshold').optional().isNumeric().withMessage('FID阈值必须是数字'),
  body('cls_threshold').optional().isNumeric().withMessage('CLS阈值必须是数字'),
  body('error_rate_threshold').optional().isNumeric().withMessage('错误率阈值必须是数字'),
  body('availability_threshold').optional().isNumeric().withMessage('可用性阈值必须是数字'),
  body('response_time_threshold').optional().isNumeric().withMessage('响应时间阈值必须是数字'),
  body('alert_enabled').optional().isBoolean().withMessage('告警启用状态必须是布尔值'),
  body('alert_email').optional().isBoolean().withMessage('邮件告警状态必须是布尔值'),
  body('alert_dingtalk').optional().isBoolean().withMessage('钉钉告警状态必须是布尔值'),
  body('alert_wechat').optional().isBoolean().withMessage('企业微信告警状态必须是布尔值')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const config = req.body;
  const redis = getRedisClient();

  try {
    // 更新监控配置到Redis
    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        await redis.hSet('config:monitoring', key, value.toString());
      }
    }

    logger.info('监控配置更新成功');

    res.json({
      success: true,
      message: '监控配置更新成功'
    });
  } catch (error) {
    logger.error('更新监控配置失败:', error);
    throw error;
  }
}));

// 获取通知配置
router.get('/notifications', [
  requireRole(['product_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const redis = getRedisClient();
  
  try {
    const config = await redis.hGetAll('config:notifications');
    
    // 默认配置
    const defaultConfig = {
      smtp_host: '',
      smtp_port: 587,
      smtp_user: '',
      smtp_password: '',
      smtp_from: '',
      dingtalk_webhook: '',
      wechat_webhook: '',
      notification_enabled: true,
      performance_alerts: true,
      error_alerts: true,
      project_alerts: true,
      personnel_alerts: true
    };

    // 合并配置
    const notificationConfig = { ...defaultConfig };
    for (const [key, value] of Object.entries(config)) {
      if (value !== null && value !== undefined) {
        try {
          notificationConfig[key] = JSON.parse(value);
        } catch (e) {
          notificationConfig[key] = value;
        }
      }
    }

    res.json({
      success: true,
      data: { config: notificationConfig }
    });
  } catch (error) {
    logger.error('获取通知配置失败:', error);
    throw error;
  }
}));

// 更新通知配置
router.put('/notifications', [
  requireRole(['product_manager', 'delivery_manager']),
  body('smtp_host').optional().isString().withMessage('SMTP主机必须是字符串'),
  body('smtp_port').optional().isInt({ min: 1, max: 65535 }).withMessage('SMTP端口必须是1-65535之间的整数'),
  body('smtp_user').optional().isString().withMessage('SMTP用户名必须是字符串'),
  body('smtp_password').optional().isString().withMessage('SMTP密码必须是字符串'),
  body('smtp_from').optional().isEmail().withMessage('发件人邮箱格式无效'),
  body('dingtalk_webhook').optional().isURL().withMessage('钉钉Webhook格式无效'),
  body('wechat_webhook').optional().isURL().withMessage('企业微信Webhook格式无效'),
  body('notification_enabled').optional().isBoolean().withMessage('通知启用状态必须是布尔值'),
  body('performance_alerts').optional().isBoolean().withMessage('性能告警状态必须是布尔值'),
  body('error_alerts').optional().isBoolean().withMessage('错误告警状态必须是布尔值'),
  body('project_alerts').optional().isBoolean().withMessage('项目告警状态必须是布尔值'),
  body('personnel_alerts').optional().isBoolean().withMessage('人员告警状态必须是布尔值')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const config = req.body;
  const redis = getRedisClient();

  try {
    // 更新通知配置到Redis
    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        await redis.hSet('config:notifications', key, value.toString());
      }
    }

    logger.info('通知配置更新成功');

    res.json({
      success: true,
      message: '通知配置更新成功'
    });
  } catch (error) {
    logger.error('更新通知配置失败:', error);
    throw error;
  }
}));

// 获取系统状态
router.get('/status', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const pool = getPgPool();
  const redis = getRedisClient();

  try {
    // 检查数据库连接
    const dbStatus = await pool.query('SELECT NOW()');
    const dbConnected = dbStatus.rows.length > 0;

    // 检查Redis连接
    let redisConnected = false;
    try {
      await redis.ping();
      redisConnected = true;
    } catch (error) {
      redisConnected = false;
    }

    // 获取系统统计
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM applications) as total_applications,
        (SELECT COUNT(*) FROM error_logs WHERE created_at >= NOW() - INTERVAL '24 hours') as errors_24h
    `);

    const systemStats = stats.rows[0];

    // 获取系统资源使用情况
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    res.json({
      success: true,
      data: {
        status: {
          database: dbConnected ? 'connected' : 'disconnected',
          redis: redisConnected ? 'connected' : 'disconnected',
          overall: dbConnected && redisConnected ? 'healthy' : 'unhealthy'
        },
        stats: {
          activeUsers: parseInt(systemStats.active_users),
          totalProjects: parseInt(systemStats.total_projects),
          totalApplications: parseInt(systemStats.total_applications),
          errors24h: parseInt(systemStats.errors_24h)
        },
        system: {
          uptime: Math.floor(uptime),
          memoryUsage: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
            external: Math.round(memoryUsage.external / 1024 / 1024) // MB
          },
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    });
  } catch (error) {
    logger.error('获取系统状态失败:', error);
    throw error;
  }
}));

// 重置系统配置
router.post('/reset', [
  requireRole(['product_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const redis = getRedisClient();

  try {
    // 删除所有配置
    const configKeys = await redis.keys('config:*');
    if (configKeys.length > 0) {
      await redis.del(configKeys);
    }

    // 重新设置默认配置
    await redis.hSet('config:monitoring', {
      lcp_threshold: 2500,
      fid_threshold: 100,
      cls_threshold: 0.25,
      error_rate_threshold: 0.05,
      availability_threshold: 99.9,
      response_time_threshold: 500,
      alert_enabled: true,
      alert_email: true,
      alert_dingtalk: false,
      alert_wechat: false
    });

    await redis.hSet('config:notifications', {
      notification_enabled: true,
      performance_alerts: true,
      error_alerts: true,
      project_alerts: true,
      personnel_alerts: true
    });

    logger.info('系统配置重置成功');

    res.json({
      success: true,
      message: '系统配置重置成功'
    });
  } catch (error) {
    logger.error('重置系统配置失败:', error);
    throw error;
  }
}));

export default router;
