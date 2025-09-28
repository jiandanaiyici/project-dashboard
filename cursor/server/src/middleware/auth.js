import jwt from 'jsonwebtoken';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';

// JWT认证中间件
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    // 验证JWT令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 从数据库获取用户信息
    const pool = getPgPool();
    const result = await pool.query(
      'SELECT id, name, email, role, department, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = result.rows[0];
    
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '用户已被禁用'
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    logger.error('认证失败:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的访问令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '访问令牌已过期'
      });
    }

    return res.status(500).json({
      success: false,
      message: '认证过程中发生错误'
    });
  }
};

// 角色权限检查中间件
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: '权限不足'
      });
    }

    next();
  };
};

// 项目权限检查中间件
export const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: '项目ID缺失'
      });
    }

    const pool = getPgPool();
    
    // 检查用户是否有项目访问权限
    const result = await pool.query(`
      SELECT p.id, p.manager_id, ptm.user_id as team_member_id
      FROM projects p
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id AND ptm.user_id = $2
      WHERE p.id = $1
    `, [projectId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    const project = result.rows[0];
    
    // 检查用户是否是项目经理或团队成员
    if (project.manager_id !== userId && !project.team_member_id) {
      return res.status(403).json({
        success: false,
        message: '无权限访问此项目'
      });
    }

    req.project = project;
    next();
  } catch (error) {
    logger.error('项目权限检查失败:', error);
    return res.status(500).json({
      success: false,
      message: '权限检查过程中发生错误'
    });
  }
};

// 应用权限检查中间件
export const requireApplicationAccess = async (req, res, next) => {
  try {
    const applicationId = req.params.applicationId || req.body.applicationId;
    const userId = req.user.id;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: '应用ID缺失'
      });
    }

    const pool = getPgPool();
    
    // 检查用户是否有应用访问权限
    const result = await pool.query(`
      SELECT a.id, a.project_id, p.manager_id, ptm.user_id as team_member_id
      FROM applications a
      JOIN projects p ON a.project_id = p.id
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id AND ptm.user_id = $2
      WHERE a.id = $1
    `, [applicationId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    const application = result.rows[0];
    
    // 检查用户是否是项目经理或团队成员
    if (application.manager_id !== userId && !application.team_member_id) {
      return res.status(403).json({
        success: false,
        message: '无权限访问此应用'
      });
    }

    req.application = application;
    next();
  } catch (error) {
    logger.error('应用权限检查失败:', error);
    return res.status(500).json({
      success: false,
      message: '权限检查过程中发生错误'
    });
  }
};
