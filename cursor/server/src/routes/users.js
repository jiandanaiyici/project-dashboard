import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';

const router = express.Router();

// 获取用户列表
router.get('/', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('role').optional().isIn(['product_manager', 'project_manager', 'delivery_manager', 'developer', 'tester', 'designer']).withMessage('无效的角色'),
  query('department').optional().trim().isLength({ max: 100 }).withMessage('部门名称不能超过100字符'),
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
    role,
    department,
    keyword
  } = req.query;

  const offset = (page - 1) * limit;
  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = ['is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    if (role) {
      whereConditions.push(`role = $${paramIndex++}`);
      queryParams.push(role);
    }

    if (department) {
      whereConditions.push(`department = $${paramIndex++}`);
      queryParams.push(department);
    }

    if (keyword) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      queryParams.push(`%${keyword}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // 查询用户列表
    const usersQuery = `
      SELECT 
        id, name, email, role, department, skills, avatar_url, phone,
        last_active, created_at
      FROM users
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const usersResult = await pool.query(usersQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        users: usersResult.rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取用户列表失败:', error);
    throw error;
  }
}));

// 获取单个用户详情
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const pool = getPgPool();

  try {
    const result = await pool.query(`
      SELECT 
        id, name, email, role, department, skills, avatar_url, phone,
        last_active, created_at, updated_at
      FROM users
      WHERE id = $1 AND is_active = true
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = result.rows[0];

    // 获取用户当前参与的项目
    const projectsResult = await pool.query(`
      SELECT 
        p.id, p.name, p.status, p.progress,
        ptm.role as project_role, ptm.joined_at
      FROM project_team_members ptm
      JOIN projects p ON ptm.project_id = p.id
      WHERE ptm.user_id = $1
      ORDER BY ptm.joined_at DESC
    `, [userId]);

    // 获取用户最近的评价
    const evaluationsResult = await pool.query(`
      SELECT 
        e.id, e.overall_score, e.comments, e.created_at,
        p.name as project_name,
        u.name as evaluator_name
      FROM evaluations e
      JOIN projects p ON e.project_id = p.id
      JOIN users u ON e.evaluator_id = u.id
      WHERE e.user_id = $1
      ORDER BY e.created_at DESC
      LIMIT 5
    `, [userId]);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          projects: projectsResult.rows,
          recentEvaluations: evaluationsResult.rows
        }
      }
    });
  } catch (error) {
    logger.error('获取用户详情失败:', error);
    throw error;
  }
}));

// 更新用户信息
router.put('/:userId', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('姓名长度必须在2-100字符之间'),
  body('department').optional().trim().isLength({ max: 100 }).withMessage('部门名称不能超过100字符'),
  body('skills').optional().isArray().withMessage('技能必须是数组'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
  body('avatar_url').optional().isURL().withMessage('头像URL格式无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { userId } = req.params;
  const updates = req.body;
  const pool = getPgPool();

  // 检查权限：只能更新自己的信息，或者管理员可以更新任何人的信息
  if (req.user.id !== userId && !['product_manager', 'project_manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: '无权限更新此用户信息'
    });
  }

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
    updateValues.push(userId);

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND is_active = true
      RETURNING id, name, email, role, department, skills, avatar_url, phone, updated_at
    `;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    logger.info(`用户信息更新成功: ${userId}`);

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: { user: result.rows[0] }
    });
  } catch (error) {
    logger.error('更新用户信息失败:', error);
    throw error;
  }
}));

// 获取人员流动记录
router.get('/:userId/movements', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('movement_type').optional().isIn(['transfer', 'promotion', 'demotion', 'resignation', 'hire']).withMessage('无效的流动类型')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { userId } = req.params;
  const {
    page = 1,
    limit = 10,
    movement_type
  } = req.query;

  const offset = (page - 1) * limit;
  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = ['user_id = $1'];
    let queryParams = [userId];
    let paramIndex = 2;

    if (movement_type) {
      whereConditions.push(`movement_type = $${paramIndex++}`);
      queryParams.push(movement_type);
    }

    const whereClause = whereConditions.join(' AND ');

    // 查询流动记录
    const movementsQuery = `
      SELECT 
        pm.*,
        p1.name as from_project_name,
        p2.name as to_project_name
      FROM personnel_movements pm
      LEFT JOIN projects p1 ON pm.from_project_id = p1.id
      LEFT JOIN projects p2 ON pm.to_project_id = p2.id
      WHERE ${whereClause}
      ORDER BY pm.effective_date DESC, pm.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const movementsResult = await pool.query(movementsQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM personnel_movements
      WHERE ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        movements: movementsResult.rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取人员流动记录失败:', error);
    throw error;
  }
}));

// 创建人员流动记录
router.post('/:userId/movements', [
  requireRole(['product_manager', 'project_manager']),
  body('movement_type').isIn(['transfer', 'promotion', 'demotion', 'resignation', 'hire']).withMessage('无效的流动类型'),
  body('effective_date').isISO8601().withMessage('生效日期格式无效'),
  body('reason').notEmpty().withMessage('流动原因不能为空'),
  body('from_project_id').optional().isUUID().withMessage('源项目ID格式无效'),
  body('to_project_id').optional().isUUID().withMessage('目标项目ID格式无效'),
  body('from_role').optional().isString().withMessage('源角色必须是字符串'),
  body('to_role').optional().isString().withMessage('目标角色必须是字符串')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { userId } = req.params;
  const {
    movement_type,
    effective_date,
    reason,
    from_project_id,
    to_project_id,
    from_role,
    to_role
  } = req.body;

  const pool = getPgPool();

  try {
    // 验证用户是否存在
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1 AND is_active = true', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 创建流动记录
    const result = await pool.query(`
      INSERT INTO personnel_movements (
        user_id, movement_type, effective_date, reason,
        from_project_id, to_project_id, from_role, to_role
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      userId, movement_type, effective_date, reason,
      from_project_id, to_project_id, from_role, to_role
    ]);

    logger.info(`人员流动记录创建成功: 用户${userId}, 类型${movement_type}`);

    res.status(201).json({
      success: true,
      message: '人员流动记录创建成功',
      data: { movement: result.rows[0] }
    });
  } catch (error) {
    logger.error('创建人员流动记录失败:', error);
    throw error;
  }
}));

// 获取人员统计信息
router.get('/stats/overview', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const pool = getPgPool();

  try {
    // 获取总体统计
    const totalStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN last_active >= NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7_days
      FROM users
    `);

    // 获取角色分布
    const roleStatsResult = await pool.query(`
      SELECT 
        role,
        COUNT(*) as count
      FROM users
      WHERE is_active = true
      GROUP BY role
      ORDER BY count DESC
    `);

    // 获取部门分布
    const departmentStatsResult = await pool.query(`
      SELECT 
        COALESCE(department, '未分配') as department,
        COUNT(*) as count
      FROM users
      WHERE is_active = true
      GROUP BY department
      ORDER BY count DESC
    `);

    // 获取最近的人员流动
    const recentMovementsResult = await pool.query(`
      SELECT 
        pm.movement_type,
        pm.effective_date,
        u.name as user_name,
        p1.name as from_project,
        p2.name as to_project
      FROM personnel_movements pm
      JOIN users u ON pm.user_id = u.id
      LEFT JOIN projects p1 ON pm.from_project_id = p1.id
      LEFT JOIN projects p2 ON pm.to_project_id = p2.id
      ORDER BY pm.effective_date DESC
      LIMIT 10
    `);

    // 计算平均在职时间
    const tenureStatsResult = await pool.query(`
      SELECT 
        AVG(EXTRACT(DAYS FROM (NOW() - created_at))) as avg_tenure_days
      FROM users
      WHERE is_active = true
    `);

    const totalStats = totalStatsResult.rows[0];
    const avgTenure = tenureStatsResult.rows[0].avg_tenure_days;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: parseInt(totalStats.total_users),
          activeUsers: parseInt(totalStats.active_users),
          activeLast7Days: parseInt(totalStats.active_last_7_days),
          avgTenureDays: Math.round(avgTenure || 0)
        },
        roleDistribution: roleStatsResult.rows,
        departmentDistribution: departmentStatsResult.rows,
        recentMovements: recentMovementsResult.rows
      }
    });
  } catch (error) {
    logger.error('获取人员统计信息失败:', error);
    throw error;
  }
}));

export default router;
