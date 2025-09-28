import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { getPgPool } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import { asyncHandler, requireRole } from '../middleware/errorHandler.js';
import * as XLSX from 'xlsx';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

const router = express.Router();

// 配置multer用于文件上传
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
});

// 导入用户数据
router.post('/import/users', [
  requireRole(['product_manager', 'project_manager']),
  upload.single('file')
], asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '请选择要导入的文件'
    });
  }

  const pool = getPgPool();
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  try {
    let data = [];
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    // 根据文件类型解析数据
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileExtension === 'csv') {
      data = await parseCSV(req.file.path);
    } else if (fileExtension === 'json') {
      const fs = await import('fs');
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      data = JSON.parse(fileContent);
    }

    // 验证数据格式
    const requiredFields = ['name', 'email', 'role'];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const missingFields = requiredFields.filter(field => !row[field]);
      
      if (missingFields.length > 0) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: `缺少必填字段: ${missingFields.join(', ')}`
        });
        continue;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: '邮箱格式无效'
        });
        continue;
      }

      // 验证角色
      const validRoles = ['product_manager', 'project_manager', 'delivery_manager', 'developer', 'tester', 'designer'];
      if (!validRoles.includes(row.role)) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: '角色无效'
        });
        continue;
      }

      try {
        // 检查邮箱是否已存在
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [row.email]);
        if (existingUser.rows.length > 0) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: '邮箱已存在'
          });
          continue;
        }

        // 创建用户
        await pool.query(`
          INSERT INTO users (name, email, role, department, skills, phone)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          row.name,
          row.email,
          row.role,
          row.department || null,
          row.skills ? (Array.isArray(row.skills) ? row.skills : row.skills.split(',')) : [],
          row.phone || null
        ]);

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }

    // 清理临时文件
    const fs = await import('fs');
    fs.unlinkSync(req.file.path);

    logger.info(`用户数据导入完成: 成功${results.success}条, 失败${results.failed}条`);

    res.json({
      success: true,
      message: '数据导入完成',
      data: results
    });
  } catch (error) {
    logger.error('用户数据导入失败:', error);
    throw error;
  }
}));

// 导入项目数据
router.post('/import/projects', [
  requireRole(['product_manager', 'project_manager']),
  upload.single('file')
], asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '请选择要导入的文件'
    });
  }

  const pool = getPgPool();
  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  try {
    let data = [];
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

    // 解析文件数据
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileExtension === 'csv') {
      data = await parseCSV(req.file.path);
    } else if (fileExtension === 'json') {
      const fs = await import('fs');
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      data = JSON.parse(fileContent);
    }

    // 验证和导入数据
    const requiredFields = ['name', 'start_date', 'end_date', 'manager_email'];
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const missingFields = requiredFields.filter(field => !row[field]);
      
      if (missingFields.length > 0) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: `缺少必填字段: ${missingFields.join(', ')}`
        });
        continue;
      }

      try {
        // 查找项目经理
        const managerResult = await pool.query('SELECT id FROM users WHERE email = $1', [row.manager_email]);
        if (managerResult.rows.length === 0) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: '项目经理不存在'
          });
          continue;
        }

        const managerId = managerResult.rows[0].id;

        // 创建项目
        const projectResult = await pool.query(`
          INSERT INTO projects (name, description, start_date, end_date, budget, manager_id, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `, [
          row.name,
          row.description || null,
          row.start_date,
          row.end_date,
          row.budget ? parseFloat(row.budget) : null,
          managerId,
          row.status || 'planning'
        ]);

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message
        });
      }
    }

    // 清理临时文件
    const fs = await import('fs');
    fs.unlinkSync(req.file.path);

    logger.info(`项目数据导入完成: 成功${results.success}条, 失败${results.failed}条`);

    res.json({
      success: true,
      message: '数据导入完成',
      data: results
    });
  } catch (error) {
    logger.error('项目数据导入失败:', error);
    throw error;
  }
}));

// 导出用户数据
router.get('/export/users', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('format').optional().isIn(['xlsx', 'csv', 'json']).withMessage('导出格式无效')
], asyncHandler(async (req, res) => {
  const { format = 'xlsx' } = req.query;
  const pool = getPgPool();

  try {
    // 获取用户数据
    const result = await pool.query(`
      SELECT 
        name, email, role, department, skills, phone, 
        last_active, created_at
      FROM users
      WHERE is_active = true
      ORDER BY created_at DESC
    `);

    const users = result.rows.map(user => ({
      ...user,
      skills: Array.isArray(user.skills) ? user.skills.join(',') : user.skills,
      last_active: user.last_active ? new Date(user.last_active).toISOString() : null,
      created_at: user.created_at ? new Date(user.created_at).toISOString() : null
    }));

    let buffer;
    let filename;
    let mimeType;

    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(workbook, worksheet, '用户数据');
      buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      filename = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (format === 'csv') {
      const csvData = convertToCSV(users);
      buffer = Buffer.from(csvData, 'utf8');
      filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'json') {
      buffer = Buffer.from(JSON.stringify(users, null, 2), 'utf8');
      filename = `users_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

    logger.info(`用户数据导出完成: ${users.length}条记录, 格式: ${format}`);
  } catch (error) {
    logger.error('用户数据导出失败:', error);
    throw error;
  }
}));

// 导出项目数据
router.get('/export/projects', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('format').optional().isIn(['xlsx', 'csv', 'json']).withMessage('导出格式无效')
], asyncHandler(async (req, res) => {
  const { format = 'xlsx' } = req.query;
  const pool = getPgPool();

  try {
    // 获取项目数据
    const result = await pool.query(`
      SELECT 
        p.name, p.description, p.status, p.start_date, p.end_date,
        p.budget, p.actual_cost, p.progress, p.risk_level, p.quality_score,
        u.name as manager_name, u.email as manager_email,
        p.created_at
      FROM projects p
      LEFT JOIN users u ON p.manager_id = u.id
      ORDER BY p.created_at DESC
    `);

    const projects = result.rows.map(project => ({
      ...project,
      start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : null,
      end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : null,
      created_at: project.created_at ? new Date(project.created_at).toISOString() : null
    }));

    let buffer;
    let filename;
    let mimeType;

    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(projects);
      XLSX.utils.book_append_sheet(workbook, worksheet, '项目数据');
      buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      filename = `projects_${new Date().toISOString().split('T')[0]}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (format === 'csv') {
      const csvData = convertToCSV(projects);
      buffer = Buffer.from(csvData, 'utf8');
      filename = `projects_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'json') {
      buffer = Buffer.from(JSON.stringify(projects, null, 2), 'utf8');
      filename = `projects_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

    logger.info(`项目数据导出完成: ${projects.length}条记录, 格式: ${format}`);
  } catch (error) {
    logger.error('项目数据导出失败:', error);
    throw error;
  }
}));

// 导出性能数据
router.get('/export/performance', [
  requireRole(['product_manager', 'project_manager', 'delivery_manager']),
  body('application_id').isUUID().withMessage('应用ID格式无效'),
  body('start_time').isISO8601().withMessage('开始时间格式无效'),
  body('end_time').isISO8601().withMessage('结束时间格式无效'),
  body('format').optional().isIn(['xlsx', 'csv', 'json']).withMessage('导出格式无效')
], asyncHandler(async (req, res) => {
  const { application_id, start_time, end_time, format = 'xlsx' } = req.query;
  const pool = getPgPool();

  try {
    // 获取性能数据
    const result = await pool.query(`
      SELECT 
        pm.metric_name,
        pm.metric_value,
        pm.metric_unit,
        pm.timestamp,
        a.name as application_name
      FROM performance_metrics pm
      JOIN applications a ON pm.application_id = a.id
      WHERE pm.application_id = $1
        AND pm.timestamp >= $2
        AND pm.timestamp <= $3
      ORDER BY pm.timestamp DESC
    `, [application_id, start_time, end_time]);

    const performanceData = result.rows.map(metric => ({
      ...metric,
      timestamp: new Date(metric.timestamp).toISOString()
    }));

    let buffer;
    let filename;
    let mimeType;

    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(performanceData);
      XLSX.utils.book_append_sheet(workbook, worksheet, '性能数据');
      buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      filename = `performance_${application_id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (format === 'csv') {
      const csvData = convertToCSV(performanceData);
      buffer = Buffer.from(csvData, 'utf8');
      filename = `performance_${application_id}_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'json') {
      buffer = Buffer.from(JSON.stringify(performanceData, null, 2), 'utf8');
      filename = `performance_${application_id}_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    }

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

    logger.info(`性能数据导出完成: ${performanceData.length}条记录, 格式: ${format}`);
  } catch (error) {
    logger.error('性能数据导出失败:', error);
    throw error;
  }
}));

// 辅助函数：解析CSV文件
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fs = require('fs');
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// 辅助函数：转换为CSV格式
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

export default router;
