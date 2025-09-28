import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// 导入路由
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import applicationRoutes from './routes/applications.js';
import monitoringRoutes from './routes/monitoring.js';
import analyticsRoutes from './routes/analytics.js';
import evaluationRoutes from './routes/evaluations.js';
import importExportRoutes from './routes/importExport.js';
import configRoutes from './routes/config.js';

// 导入中间件
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';
import { requestLogger, apiStats, slowQueryDetection, errorRateMonitoring } from './middleware/requestLogger.js';
import { logger } from './utils/logger.js';
import { initErrorHandling } from './utils/errorHandler.js';

// 导入服务
import schedulerService from './services/schedulerService.js';

// 导入数据库
import { initDatabase } from './database/connection.js';

// 加载环境变量
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS配置
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// 压缩中间件
app.use(compression());

// 日志中间件
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// 请求日志中间件
app.use(requestLogger);

// API统计中间件
app.use(apiStats);

// 慢查询检测中间件
app.use(slowQueryDetection(1000));

// 错误率监控中间件
app.use(errorRateMonitoring());

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use('/api/', limiter);

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/applications', authenticateToken, applicationRoutes);
app.use('/api/monitoring', monitoringRoutes); // 监控数据不需要认证
app.use('/api/analytics', authenticateToken, analyticsRoutes);
app.use('/api/evaluations', authenticateToken, evaluationRoutes);
app.use('/api/import-export', authenticateToken, importExportRoutes);
app.use('/api/config', authenticateToken, configRoutes);

// 静态文件服务（用于Source Map）
app.use('/sourcemaps', express.static('uploads/sourcemaps'));

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

// Socket.IO连接处理
io.on('connection', (socket) => {
  logger.info(`用户连接: ${socket.id}`);
  
  // 加入项目房间
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    logger.info(`用户 ${socket.id} 加入项目 ${projectId}`);
  });
  
  // 离开项目房间
  socket.on('leave-project', (projectId) => {
    socket.leave(`project-${projectId}`);
    logger.info(`用户 ${socket.id} 离开项目 ${projectId}`);
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    logger.info(`用户断开连接: ${socket.id}`);
  });
});

// 将io实例附加到app，供其他模块使用
app.set('io', io);

// 启动服务器
async function startServer() {
  try {
    // 初始化错误处理
    initErrorHandling();
    
    // 初始化数据库
    await initDatabase();
    logger.info('数据库连接成功');
    
    // 启动定时任务
    schedulerService.startAll();
    logger.info('定时任务启动成功');
    
    // 启动服务器
    server.listen(PORT, () => {
      logger.info(`🚀 服务器启动成功！`);
      logger.info(`📍 端口: ${PORT}`);
      logger.info(`🌐 环境: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📊 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，开始优雅关闭...');
  schedulerService.stopAll();
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('收到SIGINT信号，开始优雅关闭...');
  schedulerService.stopAll();
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

// 启动服务器
startServer();

export default app;
