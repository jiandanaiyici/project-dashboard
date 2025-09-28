import { logger } from '../utils/logger.js';

// 请求日志中间件
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip, headers } = req;
  const userAgent = headers['user-agent'] || '';

  // 记录请求开始
  logger.info('请求开始', {
    method,
    url,
    ip,
    userAgent,
    timestamp: new Date().toISOString()
  });

  // 监听响应完成
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    
    // 根据状态码选择日志级别
    let logLevel = 'info';
    if (statusCode >= 400 && statusCode < 500) {
      logLevel = 'warn';
    } else if (statusCode >= 500) {
      logLevel = 'error';
    }

    // 记录请求完成
    logger[logLevel]('请求完成', {
      method,
      url,
      ip,
      statusCode,
      duration: `${duration}ms`,
      userAgent,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// API调用统计中间件
export const apiStats = (req, res, next) => {
  const { method, url } = req;
  const apiKey = `${method} ${url.split('?')[0]}`;
  
  // 增加API调用计数
  req.app.locals.apiStats = req.app.locals.apiStats || {};
  req.app.locals.apiStats[apiKey] = (req.app.locals.apiStats[apiKey] || 0) + 1;
  
  next();
};

// 慢查询检测中间件
export const slowQueryDetection = (threshold = 1000) => {
  return (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      if (duration > threshold) {
        logger.warn('慢查询检测', {
          method: req.method,
          url: req.url,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });
      }
    });
    
    next();
  };
};

// 错误率监控中间件
export const errorRateMonitoring = () => {
  return (req, res, next) => {
    const { method, url } = req;
    const apiKey = `${method} ${url.split('?')[0]}`;
    
    // 初始化错误统计
    req.app.locals.errorStats = req.app.locals.errorStats || {};
    req.app.locals.errorStats[apiKey] = req.app.locals.errorStats[apiKey] || {
      total: 0,
      errors: 0,
      lastReset: Date.now()
    };
    
    const stats = req.app.locals.errorStats[apiKey];
    
    // 检查是否需要重置统计（每小时重置一次）
    if (Date.now() - stats.lastReset > 3600000) {
      stats.total = 0;
      stats.errors = 0;
      stats.lastReset = Date.now();
    }
    
    stats.total++;
    
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        stats.errors++;
        
        // 计算错误率
        const errorRate = stats.errors / stats.total;
        
        // 如果错误率超过10%，记录警告
        if (errorRate > 0.1 && stats.total > 10) {
          logger.warn('API错误率过高', {
            api: apiKey,
            errorRate: `${(errorRate * 100).toFixed(2)}%`,
            totalRequests: stats.total,
            errors: stats.errors,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
    
    next();
  };
};
