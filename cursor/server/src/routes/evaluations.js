import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';

const router = express.Router();

// 获取评价列表
router.get('/', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间'),
  query('user_id').optional().isUUID().withMessage('用户ID格式无效'),
  query('project_id').optional().isUUID().withMessage('项目ID格式无效'),
  query('evaluator_id').optional().isUUID().withMessage('评价者ID格式无效')
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
    user_id,
    project_id,
    evaluator_id
  } = req.query;

  const offset = (page - 1) * limit;
  const pool = getPgPool();

  try {
    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (user_id) {
      whereConditions.push(`e.user_id = $${paramIndex++}`);
      queryParams.push(user_id);
    }

    if (project_id) {
      whereConditions.push(`e.project_id = $${paramIndex++}`);
      queryParams.push(project_id);
    }

    if (evaluator_id) {
      whereConditions.push(`e.evaluator_id = $${paramIndex++}`);
      queryParams.push(evaluator_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 查询评价列表
    const evaluationsQuery = `
      SELECT 
        e.id,
        e.technical_skills,
        e.work_attitude,
        e.teamwork,
        e.project_contribution,
        e.knowledge_transfer,
        e.overall_score,
        e.comments,
        e.created_at,
        u.name as user_name,
        u.email as user_email,
        evaluator.name as evaluator_name,
        evaluator.email as evaluator_email,
        p.name as project_name
      FROM evaluations e
      JOIN users u ON e.user_id = u.id
      JOIN users evaluator ON e.evaluator_id = evaluator.id
      JOIN projects p ON e.project_id = p.id
      ${whereClause}
      ORDER BY e.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    queryParams.push(limit, offset);

    const evaluationsResult = await pool.query(evaluationsQuery, queryParams);

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total
      FROM evaluations e
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        evaluations: evaluationsResult.rows,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取评价列表失败:', error);
    throw error;
  }
}));

// 获取单个评价详情
router.get('/:evaluationId', asyncHandler(async (req, res) => {
  const { evaluationId } = req.params;
  const pool = getPgPool();

  try {
    const result = await pool.query(`
      SELECT 
        e.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        evaluator.name as evaluator_name,
        evaluator.email as evaluator_email,
        evaluator.role as evaluator_role,
        p.name as project_name,
        p.status as project_status
      FROM evaluations e
      JOIN users u ON e.user_id = u.id
      JOIN users evaluator ON e.evaluator_id = evaluator.id
      JOIN projects p ON e.project_id = p.id
      WHERE e.id = $1
    `, [evaluationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '评价不存在'
      });
    }

    const evaluation = result.rows[0];

    res.json({
      success: true,
      data: { evaluation }
    });
  } catch (error) {
    logger.error('获取评价详情失败:', error);
    throw error;
  }
}));

// 创建评价
router.post('/', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('user_id').isUUID().withMessage('用户ID格式无效'),
  body('project_id').isUUID().withMessage('项目ID格式无效'),
  body('technical_skills').isInt({ min: 1, max: 5 }).withMessage('技术技能评分必须在1-5之间'),
  body('work_attitude').isInt({ min: 1, max: 5 }).withMessage('工作态度评分必须在1-5之间'),
  body('teamwork').isInt({ min: 1, max: 5 }).withMessage('团队协作评分必须在1-5之间'),
  body('project_contribution').isInt({ min: 1, max: 5 }).withMessage('项目贡献评分必须在1-5之间'),
  body('knowledge_transfer').isInt({ min: 1, max: 5 }).withMessage('知识传承评分必须在1-5之间'),
  body('comments').optional().trim().isLength({ max: 1000 }).withMessage('评价意见不能超过1000字符')
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
    user_id,
    project_id,
    technical_skills,
    work_attitude,
    teamwork,
    project_contribution,
    knowledge_transfer,
    comments = ''
  } = req.body;

  const evaluatorId = req.user.id;
  const pool = getPgPool();

  try {
    // 验证用户是否存在
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1 AND is_active = true', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证项目是否存在
    const projectResult = await pool.query('SELECT id FROM projects WHERE id = $1', [project_id]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '项目不存在'
      });
    }

    // 检查是否已经评价过
    const existingEvaluation = await pool.query(
      'SELECT id FROM evaluations WHERE user_id = $1 AND project_id = $2 AND evaluator_id = $3',
      [user_id, project_id, evaluatorId]
    );

    if (existingEvaluation.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: '您已经评价过此用户在此项目中的表现'
      });
    }

    // 计算综合评分
    const overallScore = (
      technical_skills + work_attitude + teamwork + 
      project_contribution + knowledge_transfer
    ) / 5;

    // 创建评价
    const result = await pool.query(`
      INSERT INTO evaluations (
        user_id, project_id, evaluator_id,
        technical_skills, work_attitude, teamwork,
        project_contribution, knowledge_transfer,
        overall_score, comments
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      user_id, project_id, evaluatorId,
      technical_skills, work_attitude, teamwork,
      project_contribution, knowledge_transfer,
      overallScore, comments
    ]);

    const evaluation = result.rows[0];

    logger.info(`评价创建成功: 用户${user_id}, 项目${project_id}, 评价者${evaluatorId}`);

    res.status(201).json({
      success: true,
      message: '评价创建成功',
      data: { evaluation }
    });
  } catch (error) {
    logger.error('创建评价失败:', error);
    throw error;
  }
}));

// 更新评价
router.put('/:evaluationId', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('technical_skills').optional().isInt({ min: 1, max: 5 }).withMessage('技术技能评分必须在1-5之间'),
  body('work_attitude').optional().isInt({ min: 1, max: 5 }).withMessage('工作态度评分必须在1-5之间'),
  body('teamwork').optional().isInt({ min: 1, max: 5 }).withMessage('团队协作评分必须在1-5之间'),
  body('project_contribution').optional().isInt({ min: 1, max: 5 }).withMessage('项目贡献评分必须在1-5之间'),
  body('knowledge_transfer').optional().isInt({ min: 1, max: 5 }).withMessage('知识传承评分必须在1-5之间'),
  body('comments').optional().trim().isLength({ max: 1000 }).withMessage('评价意见不能超过1000字符')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }

  const { evaluationId } = req.params;
  const updates = req.body;
  const pool = getPgPool();

  try {
    // 检查评价是否存在且评价者是当前用户
    const existingEvaluation = await pool.query(
      'SELECT * FROM evaluations WHERE id = $1 AND evaluator_id = $2',
      [evaluationId, req.user.id]
    );

    if (existingEvaluation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '评价不存在或无权限修改'
      });
    }

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

    // 如果更新了评分，重新计算综合评分
    const scoreFields = ['technical_skills', 'work_attitude', 'teamwork', 'project_contribution', 'knowledge_transfer'];
    const hasScoreUpdate = scoreFields.some(field => updates[field] !== undefined);

    if (hasScoreUpdate) {
      const currentEvaluation = existingEvaluation.rows[0];
      const newScores = {
        technical_skills: updates.technical_skills ?? currentEvaluation.technical_skills,
        work_attitude: updates.work_attitude ?? currentEvaluation.work_attitude,
        teamwork: updates.teamwork ?? currentEvaluation.teamwork,
        project_contribution: updates.project_contribution ?? currentEvaluation.project_contribution,
        knowledge_transfer: updates.knowledge_transfer ?? currentEvaluation.knowledge_transfer
      };

      const newOverallScore = (
        newScores.technical_skills + newScores.work_attitude + newScores.teamwork +
        newScores.project_contribution + newScores.knowledge_transfer
      ) / 5;

      updateFields.push(`overall_score = $${paramIndex++}`);
      updateValues.push(newOverallScore);
    }

    updateValues.push(evaluationId);

    const updateQuery = `
      UPDATE evaluations 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, updateValues);

    logger.info(`评价更新成功: ${evaluationId}`);

    res.json({
      success: true,
      message: '评价更新成功',
      data: { evaluation: result.rows[0] }
    });
  } catch (error) {
    logger.error('更新评价失败:', error);
    throw error;
  }
}));

// 删除评价
router.delete('/:evaluationId', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager'])
], asyncHandler(async (req, res) => {
  const { evaluationId } = req.params;
  const pool = getPgPool();

  try {
    // 检查评价是否存在且评价者是当前用户
    const existingEvaluation = await pool.query(
      'SELECT id FROM evaluations WHERE id = $1 AND evaluator_id = $2',
      [evaluationId, req.user.id]
    );

    if (existingEvaluation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '评价不存在或无权限删除'
      });
    }

    const result = await pool.query('DELETE FROM evaluations WHERE id = $1 RETURNING id', [evaluationId]);

    logger.info(`评价删除成功: ${evaluationId}`);

    res.json({
      success: true,
      message: '评价删除成功'
    });
  } catch (error) {
    logger.error('删除评价失败:', error);
    throw error;
  }
}));

// 获取用户评价统计
router.get('/user/:userId/stats', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const pool = getPgPool();

  try {
    // 验证用户是否存在
    const userResult = await pool.query('SELECT id, name FROM users WHERE id = $1 AND is_active = true', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 获取评价统计
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_evaluations,
        AVG(overall_score) as avg_overall_score,
        AVG(technical_skills) as avg_technical_skills,
        AVG(work_attitude) as avg_work_attitude,
        AVG(teamwork) as avg_teamwork,
        AVG(project_contribution) as avg_project_contribution,
        AVG(knowledge_transfer) as avg_knowledge_transfer,
        MIN(overall_score) as min_overall_score,
        MAX(overall_score) as max_overall_score
      FROM evaluations
      WHERE user_id = $1
    `, [userId]);

    // 获取最近评价
    const recentEvaluationsResult = await pool.query(`
      SELECT 
        e.overall_score,
        e.comments,
        e.created_at,
        p.name as project_name,
        evaluator.name as evaluator_name
      FROM evaluations e
      JOIN projects p ON e.project_id = p.id
      JOIN users evaluator ON e.evaluator_id = evaluator.id
      WHERE e.user_id = $1
      ORDER BY e.created_at DESC
      LIMIT 5
    `, [userId]);

    // 获取评分分布
    const distributionResult = await pool.query(`
      SELECT 
        CASE 
          WHEN overall_score >= 4.5 THEN '优秀'
          WHEN overall_score >= 3.5 THEN '良好'
          WHEN overall_score >= 2.5 THEN '一般'
          WHEN overall_score >= 1.5 THEN '较差'
          ELSE '很差'
        END as score_range,
        COUNT(*) as count
      FROM evaluations
      WHERE user_id = $1
      GROUP BY score_range
      ORDER BY MIN(overall_score) DESC
    `, [userId]);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        stats: {
          totalEvaluations: parseInt(stats.total_evaluations),
          avgOverallScore: parseFloat(stats.avg_overall_score || 0),
          avgTechnicalSkills: parseFloat(stats.avg_technical_skills || 0),
          avgWorkAttitude: parseFloat(stats.avg_work_attitude || 0),
          avgTeamwork: parseFloat(stats.avg_teamwork || 0),
          avgProjectContribution: parseFloat(stats.avg_project_contribution || 0),
          avgKnowledgeTransfer: parseFloat(stats.avg_knowledge_transfer || 0),
          minOverallScore: parseFloat(stats.min_overall_score || 0),
          maxOverallScore: parseFloat(stats.max_overall_score || 0)
        },
        recentEvaluations: recentEvaluationsResult.rows,
        scoreDistribution: distributionResult.rows
      }
    });
  } catch (error) {
    logger.error('获取用户评价统计失败:', error);
    throw error;
  }
}));

export default router;

