import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// 用户注册
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('姓名长度必须在2-100字符之间'),
  body('email').isEmail().normalizeEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码长度至少6位'),
  body('role').optional().isIn(['product_manager', 'project_manager', 'delivery_manager', 'developer', 'tester', 'designer']).withMessage('无效的角色'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('部门名称不能超过100字符'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码')
], asyncHandler(async (req, res) => {
  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { name, email, password, role = 'developer', department, phone, skills = [] } = req.body;

  const pool = getPgPool();

  try {
    // 检查邮箱是否已存在
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: '邮箱已被注册'
      });
    }

    // 加密密码
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 创建用户
    const result = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, department, phone, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, role, department, skills, created_at
    `, [name, email, passwordHash, role, department, phone, skills]);

    const user = result.rows[0];

    logger.info(`新用户注册: ${email}`);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          skills: user.skills,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    logger.error('用户注册失败:', error);
    throw error;
  }
}));

// 用户登录
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('请输入有效的邮箱地址'),
  body('password').notEmpty().withMessage('密码不能为空')
], asyncHandler(async (req, res) => {
  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  const pool = getPgPool();

  try {
    // 查找用户
    const result = await pool.query(`
      SELECT id, name, email, password_hash, role, department, skills, is_active, last_active
      FROM users WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    const user = result.rows[0];

    // 检查用户是否被禁用
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }

    // 更新最后活跃时间
    await pool.query('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    logger.info(`用户登录: ${email}`);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          skills: user.skills,
          lastActive: user.last_active
        }
      }
    });
  } catch (error) {
    logger.error('用户登录失败:', error);
    throw error;
  }
}));

// 获取当前用户信息
router.get('/me', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '访问令牌缺失'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const pool = getPgPool();
    const result = await pool.query(`
      SELECT id, name, email, role, department, skills, avatar_url, phone, last_active, created_at
      FROM users WHERE id = $1 AND is_active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          skills: user.skills,
          avatarUrl: user.avatar_url,
          phone: user.phone,
          lastActive: user.last_active,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
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

    throw error;
  }
}));

// 刷新令牌
router.post('/refresh', asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: '刷新令牌缺失'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const pool = getPgPool();
    const result = await pool.query(`
      SELECT id, email, role FROM users WHERE id = $1 AND is_active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或已被禁用'
      });
    }

    const user = result.rows[0];

    // 生成新的JWT令牌
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '令牌刷新成功',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '无效的刷新令牌'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '刷新令牌已过期'
      });
    }

    throw error;
  }
}));

// 用户登出
router.post('/logout', asyncHandler(async (req, res) => {
  // 在实际应用中，这里可以将令牌加入黑名单
  // 或者使用Redis存储已失效的令牌
  
  logger.info('用户登出');
  
  res.json({
    success: true,
    message: '登出成功'
  });
}));

export default router;
