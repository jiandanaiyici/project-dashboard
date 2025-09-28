import { logger } from './logger.js';

// 自定义错误类
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 业务错误类
export class BusinessError extends AppError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

// 验证错误类
export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

// 认证错误类
export class AuthenticationError extends AppError {
  constructor(message = '认证失败') {
    super(message, 401);
  }
}

// 授权错误类
export class AuthorizationError extends AppError {
  constructor(message = '权限不足') {
    super(message, 403);
  }
}

// 资源未找到错误类
export class NotFoundError extends AppError {
  constructor(message = '资源未找到') {
    super(message, 404);
  }
}

// 冲突错误类
export class ConflictError extends AppError {
  constructor(message = '资源冲突') {
    super(message, 409);
  }
}

// 服务器错误类
export class ServerError extends AppError {
  constructor(message = '服务器内部错误') {
    super(message, 500, false);
  }
}

// 数据库错误处理
export const handleDatabaseError = (error) => {
  logger.error('数据库错误:', error);
  
  switch (error.code) {
    case '23505': // 唯一约束违反
      throw new ConflictError('数据已存在');
    case '23503': // 外键约束违反
      throw new BusinessError('关联数据不存在');
    case '23502': // 非空约束违反
      throw new ValidationError('必填字段缺失');
    case '23514': // 检查约束违反
      throw new ValidationError('数据格式不正确');
    case '42P01': // 表不存在
      throw new ServerError('数据库表不存在');
    case '42P07': // 表已存在
      throw new ServerError('数据库表已存在');
    case 'ECONNREFUSED': // 连接被拒绝
      throw new ServerError('数据库连接失败');
    case 'ETIMEDOUT': // 连接超时
      throw new ServerError('数据库连接超时');
    default:
      throw new ServerError('数据库操作失败');
  }
};

// 验证错误处理
export const handleValidationError = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    throw new ValidationError('数据验证失败', errors);
  }
  throw error;
};

// JWT错误处理
export const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    throw new AuthenticationError('无效的访问令牌');
  }
  if (error.name === 'TokenExpiredError') {
    throw new AuthenticationError('访问令牌已过期');
  }
  if (error.name === 'NotBeforeError') {
    throw new AuthenticationError('访问令牌尚未生效');
  }
  throw error;
};

// 文件上传错误处理
export const handleMulterError = (error) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    throw new BusinessError('文件大小超过限制');
  }
  if (error.code === 'LIMIT_FILE_COUNT') {
    throw new BusinessError('文件数量超过限制');
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    throw new BusinessError('意外的文件字段');
  }
  throw new BusinessError('文件上传失败');
};

// Redis错误处理
export const handleRedisError = (error) => {
  logger.error('Redis错误:', error);
  
  if (error.code === 'ECONNREFUSED') {
    throw new ServerError('Redis连接失败');
  }
  if (error.code === 'ETIMEDOUT') {
    throw new ServerError('Redis连接超时');
  }
  if (error.code === 'NOAUTH') {
    throw new ServerError('Redis认证失败');
  }
  throw new ServerError('Redis操作失败');
};

// 网络错误处理
export const handleNetworkError = (error) => {
  logger.error('网络错误:', error);
  
  if (error.code === 'ECONNREFUSED') {
    throw new ServerError('网络连接被拒绝');
  }
  if (error.code === 'ETIMEDOUT') {
    throw new ServerError('网络连接超时');
  }
  if (error.code === 'ENOTFOUND') {
    throw new ServerError('网络地址未找到');
  }
  throw new ServerError('网络操作失败');
};

// 错误响应格式化
export const formatErrorResponse = (error, req) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const response = {
    success: false,
    message: error.message || '服务器内部错误',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // 在开发环境中包含更多调试信息
  if (isDevelopment) {
    response.stack = error.stack;
    response.name = error.name;
    response.statusCode = error.statusCode;
  }

  // 如果是验证错误，包含详细错误信息
  if (error instanceof ValidationError && error.errors) {
    response.errors = error.errors;
  }

  return response;
};

// 错误统计
export const errorStats = {
  total: 0,
  byType: {},
  byEndpoint: {},
  
  record(error, req) {
    this.total++;
    
    // 按错误类型统计
    const errorType = error.name || 'UnknownError';
    this.byType[errorType] = (this.byType[errorType] || 0) + 1;
    
    // 按端点统计
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    this.byEndpoint[endpoint] = this.byEndpoint[endpoint] || { total: 0, errors: 0 };
    this.byEndpoint[endpoint].total++;
    if (error.statusCode >= 400) {
      this.byEndpoint[endpoint].errors++;
    }
  },
  
  getStats() {
    return {
      total: this.total,
      byType: this.byType,
      byEndpoint: this.byEndpoint
    };
  },
  
  reset() {
    this.total = 0;
    this.byType = {};
    this.byEndpoint = {};
  }
};

// 错误监控
export const errorMonitoring = {
  // 记录错误
  recordError(error, req, res) {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode || 500,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
      userId: req.user?.id,
      isOperational: error.isOperational
    };

    // 记录到日志
    logger.error('应用错误', errorInfo);

    // 更新错误统计
    errorStats.record(error, req);

    // 如果是严重错误，发送告警
    if (error.statusCode >= 500) {
      this.sendErrorAlert(errorInfo);
    }
  },

  // 发送错误告警
  async sendErrorAlert(errorInfo) {
    try {
      // 这里可以集成告警系统
      logger.warn('严重错误告警', errorInfo);
    } catch (error) {
      logger.error('发送错误告警失败:', error);
    }
  }
};

// 全局未捕获异常处理
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error) => {
    logger.error('未捕获的异常:', error);
    
    // 记录错误统计
    errorStats.total++;
    errorStats.byType['UncaughtException'] = (errorStats.byType['UncaughtException'] || 0) + 1;
    
    // 优雅关闭
    process.exit(1);
  });
};

// 全局未处理的Promise拒绝处理
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('未处理的Promise拒绝:', { reason, promise });
    
    // 记录错误统计
    errorStats.total++;
    errorStats.byType['UnhandledRejection'] = (errorStats.byType['UnhandledRejection'] || 0) + 1;
  });
};

// 初始化错误处理
export const initErrorHandling = () => {
  handleUncaughtException();
  handleUnhandledRejection();
  logger.info('错误处理系统已初始化');
};
