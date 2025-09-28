import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';
import { requireProjectAccess } from '../middleware/auth.js';

const router = express.Router();

// 获取项目列表
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('status').optional().isIn(['planning', 'in_progress', 'testing', 'completed', 'cancelled']).withMessage('无效的项目状态'),
  query('manager_id').optional().isUUID().withMessage('无效的经理ID'),
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
    status,
    manager_id,
    keyword
  } = req.query;

  const offset = (page - 1) * limit;
  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      whereConditions.push(`p.status = $${paramIndex++}`);
      queryParams.push(status);
    }

    if (manager_id) {
      whereConditions.push(`p.manager_id = $${paramIndex++}`);
      queryParams.push(manager_id);
    }

    if (keyword) {
      whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
      queryParams.push(`%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 查询项目列表
    const projectsQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.status,
        p.start_date,
        p.end_date,
        p.budget,
        p.actual_cost,
        p.progress,
        p.risk_level,
        p.quality_score,
        p.created_at,
        p.updated_at,
        u.name as manager_name,
        u.email as manager_email,
        COUNT(ptm.user_id) as team_size
      FROM projects p
      LEFT JOIN users u ON p.manager_id = u.id
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id
      ${whereClause}
      GROUP BY p.id, u.name, u.email
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const projectsResult = await pool.query(projectsQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM projects p
      LEFT JOIN users u ON p.manager_id = u.id
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    // 为每个项目获取团队成员
    const projects = await Promise.all(projectsResult.rows.map(async (project) => {
      const teamResult = await pool.query(`
        SELECT u.id, u.name, u.email, u.role, ptm.role as project_role
        FROM project_team_members ptm
        JOIN users u ON ptm.user_id = u.id
        WHERE ptm.project_id = $1
      `, [project.id]);

      return {
        ...project,
        team: teamResult.rows
      };
    }));

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取项目列表失败:', error);
    throw error;
  }
}));

// 获取单个项目详情
router.get('/:projectId', requireProjectAccess, asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const pool = getPgPool();

  try {
    // 获取项目基本信息
    const projectResult = await pool.query(`
      SELECT 
        p.*,
        u.name as manager_name,
        u.email as manager_email
      FROM projects p
      LEFT JOIN users u ON p.manager_id = u.id
      WHERE p.id = $1
    `, [projectId]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    const project = projectResult.rows[0];

    // 获取团队成员
    const teamResult = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, ptm.role as project_role, ptm.joined_at
      FROM project_team_members ptm
      JOIN users u ON ptm.user_id = u.id
      WHERE ptm.project_id = $1
      ORDER BY ptm.joined_at
    `, [projectId]);

    // 获取项目应用
    const applicationsResult = await pool.query(`
      SELECT id, name, description, status, version, url, created_at
      FROM applications
      WHERE project_id = $1
      ORDER BY created_at
    `, [projectId]);

    // 获取项目统计信息
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT a.id) as application_count,
        COUNT(DISTINCT ptm.user_id) as team_size,
        COUNT(DISTINCT CASE WHEN a.status = 'production' THEN a.id END) as production_apps
      FROM projects p
      LEFT JOIN applications a ON p.id = a.project_id
      LEFT JOIN project_team_members ptm ON p.id = ptm.project_id
      WHERE p.id = $1
    `, [projectId]);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        project: {
          ...project,
          team: teamResult.rows,
          applications: applicationsResult.rows,
          stats
        }
      }
    });
  } catch (error) {
    logger.error('获取项目详情失败:', error);
    throw error;
  }
}));

// 创建项目
router.post('/', [
  requireRole(['product_manager', 'project_manager']),
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('项目名称长度必须在2-200字符之间'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('项目描述不能超过1000字符'),
  body('start_date').isISO8601().withMessage('开始日期格式无效'),
  body('end_date').isISO8601().withMessage('结束日期格式无效'),
  body('budget').optional().isDecimal().withMessage('预算必须是有效数字'),
  body('team_ids').optional().isArray().withMessage('团队成员ID必须是数组'),
  body('team_ids.*').optional().isUUID().withMessage('团队成员ID格式无效')
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
    name,
    description,
    start_date,
    end_date,
    budget,
    team_ids = []
  } = req.body;

  const managerId = req.user.id;
  const pool = getPgPool();

  try {
    // 开始事务
    await pool.query('BEGIN');

    // 创建项目
    const projectResult = await pool.query(`
      INSERT INTO projects (name, description, start_date, end_date, budget, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, start_date, end_date, budget, managerId]);

    const project = projectResult.rows[0];

    // 添加团队成员
    if (team_ids.length > 0) {
      const teamValues = team_ids.map((userId, index) => 
        `($${index * 2 + 1}, $${index * 2 + 2}, 'member')`
      ).join(', ');

      const teamParams = team_ids.flatMap(userId => [project.id, userId]);

      await pool.query(`
        INSERT INTO project_team_members (project_id, user_id, role)
        VALUES ${teamValues}
      `, teamParams);
    }

    // 提交事务
    await pool.query('COMMIT');

    logger.info(`项目创建成功: ${name} (${project.id})`);

    res.status(201).json({
      success: true,
      message: '项目创建成功',
      data: { project }
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    logger.error('创建项目失败:', error);
    throw error;
  }
}));

// 更新项目
router.put('/:projectId', [
  requireProjectAccess,
  body('name').optional().trim().isLength({ min: 2, max: 200 }).withMessage('项目名称长度必须在2-200字符之间'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('项目描述不能超过1000字符'),
  body('status').optional().isIn(['planning', 'in_progress', 'testing', 'completed', 'cancelled']).withMessage('无效的项目状态'),
  body('end_date').optional().isISO8601().withMessage('结束日期格式无效'),
  body('budget').optional().isDecimal().withMessage('预算必须是有效数字'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('进度必须在0-100之间'),
  body('risk_level').optional().isIn(['low', 'medium', 'high']).withMessage('风险等级无效')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { projectId } = req.params;
  const updates = req.body;
  const pool = getPgPool();

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
    updateValues.push(projectId);

    const updateQuery = `
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    logger.info(`项目更新成功: ${projectId}`);

    res.json({
      success: true,
      message: '项目更新成功',
      data: { project: result.rows[0] }
    });
  } catch (error) {
    logger.error('更新项目失败:', error);
    throw error;
  }
}));

// 删除项目
router.delete('/:projectId', [
  requireProjectAccess,
  requireRole(['product_manager', 'project_manager'])
], asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const pool = getPgPool();

  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING name', [projectId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    logger.info(`项目删除成功: ${result.rows[0].name} (${projectId})`);

    res.json({
      success: true,
      message: '项目删除成功'
    });
  } catch (error) {
    logger.error('删除项目失败:', error);
    throw error;
  }
}));

// 添加团队成员
router.post('/:projectId/team', [
  requireProjectAccess,
  body('user_id').isUUID().withMessage('用户ID格式无效'),
  body('role').optional().isIn(['member', 'lead', 'architect']).withMessage('无效的团队角色')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { projectId } = req.params;
  const { user_id, role = 'member' } = req.body;
  const pool = getPgPool();

  try {
    // 检查用户是否已在团队中
    const existingMember = await pool.query(
      'SELECT id FROM project_team_members WHERE project_id = $1 AND user_id = $2',
      [projectId, user_id]
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: '用户已在团队中'
      });
    }

    // 添加团队成员
    const result = await pool.query(`
      INSERT INTO project_team_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [projectId, user_id, role]);

    logger.info(`团队成员添加成功: 项目${projectId}, 用户${user_id}`);

    res.status(201).json({
      success: true,
      message: '团队成员添加成功',
      data: { teamMember: result.rows[0] }
    });
  } catch (error) {
    logger.error('添加团队成员失败:', error);
    throw error;
  }
}));

// 移除团队成员
router.delete('/:projectId/team/:userId', requireProjectAccess, asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const pool = getPgPool();

  try {
    const result = await pool.query(
      'DELETE FROM project_team_members WHERE project_id = $1 AND user_id = $2 RETURNING *',
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '团队成员不存在'
      });
    }

    logger.info(`团队成员移除成功: 项目${projectId}, 用户${userId}`);

    res.json({
      success: true,
      message: '团队成员移除成功'
    });
  } catch (error) {
    logger.error('移除团队成员失败:', error);
    throw error;
  }
}));

export default router;
