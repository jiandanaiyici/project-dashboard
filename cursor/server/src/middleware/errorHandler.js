import { logger } from '../utils/logger.js';

// 全局错误处理中间件
export const errorHandler = (err, req, res, next) => {
  logger.error('服务器错误:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 默认错误响应
  let statusCode = 500;
  let message = '服务器内部错误';

  // 处理不同类型的错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = '请求参数验证失败';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = '未授权访问';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = '禁止访问';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = '资源不存在';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = '资源冲突';
  } else if (err.code === '23505') { // PostgreSQL唯一约束违反
    statusCode = 409;
    message = '数据已存在';
  } else if (err.code === '23503') { // PostgreSQL外键约束违反
    statusCode = 400;
    message = '关联数据不存在';
  } else if (err.code === '23502') { // PostgreSQL非空约束违反
    statusCode = 400;
    message = '必填字段缺失';
  }

  // 在开发环境中返回详细错误信息
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  };

  res.status(statusCode).json(errorResponse);
};

// 404处理中间件
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
};

// 异步错误包装器
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 角色权限检查中间件
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未授权访问'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    next();
  };
};
