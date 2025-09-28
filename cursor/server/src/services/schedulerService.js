import cron from 'cron';
import { getPgPool, getRedisClient } from '../database/connection.js';
import { logger } from '../utils/logger.js';
import notificationService from './notificationService.js';
import sourceMapService from './sourceMapService.js';

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.initScheduledTasks();
  }

  // 初始化定时任务
  initScheduledTasks() {
    // 每小时清理过期的Source Map文件
    this.addJob('cleanup-sourcemaps', '0 0 * * * *', () => {
      this.cleanupExpiredSourceMaps();
    });

    // 每天凌晨2点清理过期的性能数据
    this.addJob('cleanup-metrics', '0 0 2 * * *', () => {
      this.cleanupExpiredMetrics();
    });

    // 每5分钟检查性能告警
    this.addJob('check-performance-alerts', '0 */5 * * * *', () => {
      this.checkPerformanceAlerts();
    });

    // 每10分钟检查错误告警
    this.addJob('check-error-alerts', '0 */10 * * * *', () => {
      this.checkErrorAlerts();
    });

    // 每天上午9点发送日报
    this.addJob('daily-report', '0 0 9 * * *', () => {
      this.sendDailyReport();
    });

    // 每周一上午9点发送周报
    this.addJob('weekly-report', '0 0 9 * * 1', () => {
      this.sendWeeklyReport();
    });

    // 每月1号上午9点发送月报
    this.addJob('monthly-report', '0 0 9 1 * *', () => {
      this.sendMonthlyReport();
    });

    logger.info('定时任务初始化完成');
  }

  // 添加定时任务
  addJob(name, cronTime, onTick) {
    const job = new cron.CronJob(cronTime, onTick, null, true, 'Asia/Shanghai');
    this.jobs.set(name, job);
    logger.info(`定时任务已添加: ${name} (${cronTime})`);
  }

  // 删除定时任务
  removeJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      logger.info(`定时任务已删除: ${name}`);
    }
  }

  // 启动所有任务
  startAll() {
    this.jobs.forEach((job, name) => {
      job.start();
      logger.info(`定时任务已启动: ${name}`);
    });
  }

  // 停止所有任务
  stopAll() {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`定时任务已停止: ${name}`);
    });
  }

  // 清理过期的Source Map文件
  async cleanupExpiredSourceMaps() {
    try {
      await sourceMapService.cleanupExpiredSourceMaps();
      logger.info('Source Map文件清理完成');
    } catch (error) {
      logger.error('Source Map文件清理失败:', error);
    }
  }

  // 清理过期的性能数据
  async cleanupExpiredMetrics() {
    const pool = getPgPool();
    try {
      // 删除30天前的性能指标数据
      const result = await pool.query(`
        DELETE FROM performance_metrics 
        WHERE timestamp < NOW() - INTERVAL '30 days'
      `);

      // 删除90天前的错误日志
      await pool.query(`
        DELETE FROM error_logs 
        WHERE created_at < NOW() - INTERVAL '90 days'
      `);

      logger.info(`性能数据清理完成: 删除了${result.rowCount}条记录`);
    } catch (error) {
      logger.error('性能数据清理失败:', error);
    }
  }

  // 检查性能告警
  async checkPerformanceAlerts() {
    const pool = getPgPool();
    try {
      // 获取所有应用的最新性能指标
      const result = await pool.query(`
        SELECT 
          a.id, a.name,
          pm.metric_name, pm.metric_value, pm.timestamp
        FROM applications a
        JOIN performance_metrics pm ON a.id = pm.application_id
        WHERE pm.timestamp >= NOW() - INTERVAL '10 minutes'
        ORDER BY pm.timestamp DESC
      `);

      // 按应用分组指标
      const appMetrics = {};
      result.rows.forEach(row => {
        if (!appMetrics[row.id]) {
          appMetrics[row.id] = {
            name: row.name,
            metrics: {}
          };
        }
        appMetrics[row.id].metrics[row.metric_name] = row.metric_value;
      });

      // 检查每个应用的性能指标
      for (const [appId, appData] of Object.entries(appMetrics)) {
        const metrics = appData.metrics;
        const alerts = [];

        // LCP告警
        if (metrics.lcp && metrics.lcp > 2500) {
          alerts.push({
            type: 'performance',
            message: 'LCP超过阈值',
            value: metrics.lcp
          });
        }

        // FID告警
        if (metrics.fid && metrics.fid > 100) {
          alerts.push({
            type: 'performance',
            message: 'FID超过阈值',
            value: metrics.fid
          });
        }

        // 错误率告警
        if (metrics.error_rate && metrics.error_rate > 0.05) {
          alerts.push({
            type: 'error',
            message: '错误率超过阈值',
            value: metrics.error_rate
          });
        }

        // 发送告警通知
        if (alerts.length > 0) {
          await this.sendPerformanceAlert(appId, appData.name, alerts);
        }
      }
    } catch (error) {
      logger.error('性能告警检查失败:', error);
    }
  }

  // 检查错误告警
  async checkErrorAlerts() {
    const pool = getPgPool();
    try {
      // 获取最近10分钟的错误统计
      const result = await pool.query(`
        SELECT 
          a.id, a.name,
          el.error_type,
          COUNT(*) as error_count
        FROM applications a
        JOIN error_logs el ON a.id = el.application_id
        WHERE el.created_at >= NOW() - INTERVAL '10 minutes'
        GROUP BY a.id, a.name, el.error_type
        HAVING COUNT(*) > 10
      `);

      // 发送错误告警
      for (const row of result.rows) {
        await this.sendErrorAlert(row.id, row.name, row.error_type, row.error_count);
      }
    } catch (error) {
      logger.error('错误告警检查失败:', error);
    }
  }

  // 发送性能告警
  async sendPerformanceAlert(appId, appName, alerts) {
    try {
      // 获取应用管理员
      const pool = getPgPool();
      const result = await pool.query(`
        SELECT u.email
        FROM applications a
        JOIN projects p ON a.project_id = p.id
        JOIN users u ON p.manager_id = u.id
        WHERE a.id = $1
      `, [appId]);

      if (result.rows.length > 0) {
        const recipients = result.rows.map(row => row.email);
        
        for (const alert of alerts) {
          await notificationService.sendPerformanceAlert(
            appId,
            appName,
            alert.type,
            { [alert.message]: alert.value },
            recipients
          );
        }
      }
    } catch (error) {
      logger.error('发送性能告警失败:', error);
    }
  }

  // 发送错误告警
  async sendErrorAlert(appId, appName, errorType, errorCount) {
    try {
      // 获取应用管理员
      const pool = getPgPool();
      const result = await pool.query(`
        SELECT u.email
        FROM applications a
        JOIN projects p ON a.project_id = p.id
        JOIN users u ON p.manager_id = u.id
        WHERE a.id = $1
      `, [appId]);

      if (result.rows.length > 0) {
        const recipients = result.rows.map(row => row.email);
        
        await notificationService.sendErrorAlert(
          appId,
          appName,
          errorCount,
          errorType,
          recipients
        );
      }
    } catch (error) {
      logger.error('发送错误告警失败:', error);
    }
  }

  // 发送日报
  async sendDailyReport() {
    try {
      const pool = getPgPool();
      
      // 获取日报数据
      const reportData = await this.generateDailyReport(pool);
      
      // 获取所有产品经理和项目经理的邮箱
      const result = await pool.query(`
        SELECT email FROM users 
        WHERE role IN ('product_manager', 'project_manager') 
        AND is_active = true
      `);

      const recipients = result.rows.map(row => row.email);
      
      if (recipients.length > 0) {
        await notificationService.sendEmailNotification(
          recipients,
          '每日系统报告',
          this.formatDailyReport(reportData),
          false
        );
      }

      logger.info('日报发送完成');
    } catch (error) {
      logger.error('日报发送失败:', error);
    }
  }

  // 发送周报
  async sendWeeklyReport() {
    try {
      const pool = getPgPool();
      
      // 获取周报数据
      const reportData = await this.generateWeeklyReport(pool);
      
      // 获取所有产品经理的邮箱
      const result = await pool.query(`
        SELECT email FROM users 
        WHERE role = 'product_manager' 
        AND is_active = true
      `);

      const recipients = result.rows.map(row => row.email);
      
      if (recipients.length > 0) {
        await notificationService.sendEmailNotification(
          recipients,
          '每周系统报告',
          this.formatWeeklyReport(reportData),
          false
        );
      }

      logger.info('周报发送完成');
    } catch (error) {
      logger.error('周报发送失败:', error);
    }
  }

  // 发送月报
  async sendMonthlyReport() {
    try {
      const pool = getPgPool();
      
      // 获取月报数据
      const reportData = await this.generateMonthlyReport(pool);
      
      // 获取所有产品经理的邮箱
      const result = await pool.query(`
        SELECT email FROM users 
        WHERE role = 'product_manager' 
        AND is_active = true
      `);

      const recipients = result.rows.map(row => row.email);
      
      if (recipients.length > 0) {
        await notificationService.sendEmailNotification(
          recipients,
          '每月系统报告',
          this.formatMonthlyReport(reportData),
          false
        );
      }

      logger.info('月报发送完成');
    } catch (error) {
      logger.error('月报发送失败:', error);
    }
  }

  // 生成日报数据
  async generateDailyReport(pool) {
    const today = new Date().toISOString().split('T')[0];
    
    // 项目统计
    const projectStats = await pool.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
      FROM projects
    `);

    // 应用统计
    const appStats = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'production' THEN 1 END) as production_apps
      FROM applications
    `);

    // 错误统计
    const errorStats = await pool.query(`
      SELECT 
        COUNT(*) as total_errors,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as errors_24h
      FROM error_logs
    `);

    return {
      date: today,
      projects: projectStats.rows[0],
      applications: appStats.rows[0],
      errors: errorStats.rows[0]
    };
  }

  // 生成周报数据
  async generateWeeklyReport(pool) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // 项目进展
    const projectProgress = await pool.query(`
      SELECT 
        name, progress, status, updated_at
      FROM projects
      WHERE updated_at >= $1
      ORDER BY updated_at DESC
    `, [weekAgo]);

    // 人员流动
    const personnelMovements = await pool.query(`
      SELECT 
        u.name as user_name,
        pm.movement_type,
        pm.effective_date
      FROM personnel_movements pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.effective_date >= $1
      ORDER BY pm.effective_date DESC
    `, [weekAgo]);

    return {
      week: weekAgo.toISOString().split('T')[0],
      projectProgress: projectProgress.rows,
      personnelMovements: personnelMovements.rows
    };
  }

  // 生成月报数据
  async generateMonthlyReport(pool) {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // 项目完成情况
    const projectCompletion = await pool.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
        AVG(progress) as avg_progress
      FROM projects
      WHERE created_at >= $1
    `, [monthAgo]);

    // 人员效能统计
    const personnelStats = await pool.query(`
      SELECT 
        AVG(overall_score) as avg_score,
        COUNT(*) as total_evaluations
      FROM evaluations
      WHERE created_at >= $1
    `, [monthAgo]);

    // 性能指标统计
    const performanceStats = await pool.query(`
      SELECT 
        metric_name,
        AVG(metric_value) as avg_value,
        MAX(metric_value) as max_value,
        MIN(metric_value) as min_value
      FROM performance_metrics
      WHERE timestamp >= $1
      GROUP BY metric_name
    `, [monthAgo]);

    return {
      month: monthAgo.toISOString().split('T')[0],
      projectCompletion: projectCompletion.rows[0],
      personnelStats: personnelStats.rows[0],
      performanceStats: performanceStats.rows
    };
  }

  // 格式化日报
  formatDailyReport(data) {
    return `
每日系统报告 - ${data.date}

项目统计:
- 总项目数: ${data.projects.total_projects}
- 进行中项目: ${data.projects.active_projects}
- 已完成项目: ${data.projects.completed_projects}

应用统计:
- 总应用数: ${data.applications.total_applications}
- 生产环境应用: ${data.applications.production_apps}

错误统计:
- 总错误数: ${data.errors.total_errors}
- 24小时内错误: ${data.errors.errors_24h}

聚合平台管理系统
    `;
  }

  // 格式化周报
  formatWeeklyReport(data) {
    return `
每周系统报告 - ${data.week}

项目进展:
${data.projectProgress.map(p => `- ${p.name}: ${p.progress}% (${p.status})`).join('\n')}

人员流动:
${data.personnelMovements.map(m => `- ${m.user_name}: ${m.movement_type} (${m.effective_date})`).join('\n')}

聚合平台管理系统
    `;
  }

  // 格式化月报
  formatMonthlyReport(data) {
    return `
每月系统报告 - ${data.month}

项目完成情况:
- 总项目数: ${data.projectCompletion.total_projects}
- 已完成项目: ${data.projectCompletion.completed_projects}
- 平均进度: ${data.projectCompletion.avg_progress?.toFixed(1)}%

人员效能:
- 平均评分: ${data.personnelStats.avg_score?.toFixed(2)}/5.0
- 评价总数: ${data.personnelStats.total_evaluations}

性能指标:
${data.performanceStats.map(p => `- ${p.metric_name}: 平均${p.avg_value?.toFixed(2)}, 最高${p.max_value?.toFixed(2)}, 最低${p.min_value?.toFixed(2)}`).join('\n')}

聚合平台管理系统
    `;
  }
}

export default new SchedulerService();
