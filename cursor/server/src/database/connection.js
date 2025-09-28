import pkg from 'pg';
import redis from 'redis';
import { logger } from '../utils/logger.js';

const { Pool } = pkg;

// PostgreSQL连接池
const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'project_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲超时
  connectionTimeoutMillis: 2000, // 连接超时
});

// Redis客户端
let redisClient = null;

// 初始化Redis连接
async function initRedis() {
  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || null,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis连接错误:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis连接成功');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Redis初始化失败:', error);
    throw error;
  }
}

// 初始化数据库
async function initDatabase() {
  try {
    // 测试PostgreSQL连接
    const client = await pgPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    logger.info('PostgreSQL连接成功');

    // 初始化Redis
    await initRedis();

    // 创建表结构
    await createTables();
    
    logger.info('数据库初始化完成');
  } catch (error) {
    logger.error('数据库初始化失败:', error);
    throw error;
  }
}

// 创建数据库表
async function createTables() {
  const client = await pgPool.connect();
  
  try {
    // 用户表
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'developer',
        department VARCHAR(100),
        skills TEXT[],
        avatar_url VARCHAR(500),
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT true,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 项目表
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'planning',
        start_date DATE,
        end_date DATE,
        manager_id UUID REFERENCES users(id),
        budget DECIMAL(15,2),
        actual_cost DECIMAL(15,2) DEFAULT 0,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        risk_level VARCHAR(20) DEFAULT 'low',
        quality_score DECIMAL(3,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 项目团队成员表
    await client.query(`
      CREATE TABLE IF NOT EXISTS project_team_members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      )
    `);

    // 应用表
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL DEFAULT 'development',
        version VARCHAR(50),
        url VARCHAR(500),
        repository_url VARCHAR(500),
        deployment_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 性能指标表
    await client.query(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(15,4) NOT NULL,
        metric_unit VARCHAR(20),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      )
    `);

    // 错误日志表
    await client.query(`
      CREATE TABLE IF NOT EXISTS error_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
        error_type VARCHAR(50) NOT NULL,
        error_message TEXT NOT NULL,
        error_stack TEXT,
        filename VARCHAR(500),
        line_number INTEGER,
        column_number INTEGER,
        source_mapping JSONB,
        user_agent TEXT,
        url TEXT,
        user_id UUID REFERENCES users(id),
        resolved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 人员评价表
    await client.query(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        evaluator_id UUID REFERENCES users(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        technical_skills INTEGER NOT NULL CHECK (technical_skills >= 1 AND technical_skills <= 5),
        work_attitude INTEGER NOT NULL CHECK (work_attitude >= 1 AND work_attitude <= 5),
        teamwork INTEGER NOT NULL CHECK (teamwork >= 1 AND teamwork <= 5),
        project_contribution INTEGER NOT NULL CHECK (project_contribution >= 1 AND project_contribution <= 5),
        knowledge_transfer INTEGER NOT NULL CHECK (knowledge_transfer >= 1 AND knowledge_transfer <= 5),
        overall_score DECIMAL(3,2) NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 人员流动记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS personnel_movements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        from_project_id UUID REFERENCES projects(id),
        to_project_id UUID REFERENCES projects(id),
        from_role VARCHAR(50),
        to_role VARCHAR(50),
        movement_type VARCHAR(50) NOT NULL,
        reason TEXT,
        effective_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建索引
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id);
      CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_app ON performance_metrics(application_id);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
      CREATE INDEX IF NOT EXISTS idx_error_logs_app ON error_logs(application_id);
      CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_evaluations_user ON evaluations(user_id);
      CREATE INDEX IF NOT EXISTS idx_personnel_movements_user ON personnel_movements(user_id);
    `);

    logger.info('数据库表创建完成');
  } catch (error) {
    logger.error('创建数据库表失败:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 获取PostgreSQL连接池
export function getPgPool() {
  return pgPool;
}

// 获取Redis客户端
export function getRedisClient() {
  return redisClient;
}

// 关闭数据库连接
export async function closeDatabase() {
  try {
    await pgPool.end();
    if (redisClient) {
      await redisClient.quit();
    }
    logger.info('数据库连接已关闭');
  } catch (error) {
    logger.error('关闭数据库连接失败:', error);
  }
}

export { initDatabase };
