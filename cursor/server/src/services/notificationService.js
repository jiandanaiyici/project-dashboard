import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

class NotificationService {
  constructor() {
    this.emailTransporter = null;
    this.initEmailTransporter();
  }

  // 初始化邮件传输器
  initEmailTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
      logger.info('邮件服务已初始化');
    } else {
      logger.warn('邮件服务未配置，将跳过邮件通知');
    }
  }

  // 发送邮件通知
  async sendEmailNotification(to, subject, content, isHtml = false) {
    if (!this.emailTransporter) {
      logger.warn('邮件服务未配置，跳过邮件发送');
      return { success: false, message: '邮件服务未配置' };
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        [isHtml ? 'html' : 'text']: content
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      logger.info(`邮件发送成功: ${to} - ${subject}`);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('邮件发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 发送性能告警通知
  async sendPerformanceAlert(applicationId, applicationName, alertType, metrics, recipients) {
    const subject = `性能告警 - ${applicationName}`;
    
    let content = `
应用: ${applicationName}
告警类型: ${this.getAlertTypeText(alertType)}
时间: ${new Date().toLocaleString('zh-CN')}

性能指标:
`;

    Object.entries(metrics).forEach(([key, value]) => {
      content += `- ${key}: ${value}\n`;
    });

    content += `
请及时检查应用性能状况。

聚合平台监控系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 发送错误告警通知
  async sendErrorAlert(applicationId, applicationName, errorCount, errorType, recipients) {
    const subject = `错误告警 - ${applicationName}`;
    
    const content = `
应用: ${applicationName}
错误类型: ${errorType}
错误数量: ${errorCount}
时间: ${new Date().toLocaleString('zh-CN')}

请及时检查应用错误状况。

聚合平台监控系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 发送项目状态变更通知
  async sendProjectStatusChange(projectId, projectName, oldStatus, newStatus, recipients) {
    const subject = `项目状态变更 - ${projectName}`;
    
    const content = `
项目: ${projectName}
状态变更: ${this.getProjectStatusText(oldStatus)} → ${this.getProjectStatusText(newStatus)}
时间: ${new Date().toLocaleString('zh-CN')}

请关注项目进展。

聚合平台管理系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 发送人员流动通知
  async sendPersonnelMovement(userName, movementType, fromProject, toProject, recipients) {
    const subject = `人员流动通知 - ${userName}`;
    
    let content = `
人员: ${userName}
流动类型: ${this.getMovementTypeText(movementType)}
`;

    if (fromProject) {
      content += `原项目: ${fromProject}\n`;
    }
    if (toProject) {
      content += `目标项目: ${toProject}\n`;
    }

    content += `时间: ${new Date().toLocaleString('zh-CN')}

请更新相关项目安排。

聚合平台管理系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 发送评价完成通知
  async sendEvaluationNotification(evaluatorName, userName, projectName, score, recipients) {
    const subject = `评价完成通知 - ${userName}`;
    
    const content = `
评价者: ${evaluatorName}
被评价人: ${userName}
项目: ${projectName}
综合评分: ${score}/5.0
时间: ${new Date().toLocaleString('zh-CN')}

评价已完成，请查看详细信息。

聚合平台管理系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 发送系统维护通知
  async sendMaintenanceNotification(message, recipients) {
    const subject = '系统维护通知';
    
    const content = `
系统维护通知

${message}

维护时间: ${new Date().toLocaleString('zh-CN')}

如有疑问，请联系技术支持。

聚合平台管理系统
    `;

    return await this.sendEmailNotification(recipients, subject, content);
  }

  // 获取告警类型文本
  getAlertTypeText(alertType) {
    const types = {
      'performance': '性能告警',
      'error': '错误告警',
      'availability': '可用性告警',
      'response_time': '响应时间告警',
      'memory': '内存使用告警',
      'cpu': 'CPU使用告警'
    };
    return types[alertType] || alertType;
  }

  // 获取项目状态文本
  getProjectStatusText(status) {
    const statuses = {
      'planning': '规划中',
      'in_progress': '进行中',
      'testing': '测试中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statuses[status] || status;
  }

  // 获取流动类型文本
  getMovementTypeText(movementType) {
    const types = {
      'transfer': '项目调动',
      'promotion': '晋升',
      'demotion': '降级',
      'resignation': '离职',
      'hire': '入职'
    };
    return types[movementType] || movementType;
  }

  // 发送钉钉/企业微信通知（需要集成相应的API）
  async sendDingTalkNotification(webhookUrl, message) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          msgtype: 'text',
          text: {
            content: message
          }
        })
      });

      if (response.ok) {
        logger.info('钉钉通知发送成功');
        return { success: true };
      } else {
        logger.error('钉钉通知发送失败:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      logger.error('钉钉通知发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 发送企业微信通知
  async sendWeChatWorkNotification(webhookUrl, message) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          msgtype: 'text',
          text: {
            content: message
          }
        })
      });

      if (response.ok) {
        logger.info('企业微信通知发送成功');
        return { success: true };
      } else {
        logger.error('企业微信通知发送失败:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      logger.error('企业微信通知发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量发送通知
  async sendBatchNotification(recipients, subject, content, channels = ['email']) {
    const results = [];

    for (const channel of channels) {
      switch (channel) {
        case 'email':
          const emailResult = await this.sendEmailNotification(recipients, subject, content);
          results.push({ channel: 'email', ...emailResult });
          break;
        case 'dingtalk':
          // 需要配置钉钉webhook
          break;
        case 'wechat':
          // 需要配置企业微信webhook
          break;
        default:
          logger.warn(`不支持的通知渠道: ${channel}`);
      }
    }

    return results;
  }

  // 获取通知模板
  getNotificationTemplate(templateType, data) {
    const templates = {
      'performance_alert': `
🚨 性能告警

应用: ${data.applicationName}
告警类型: ${data.alertType}
时间: ${new Date().toLocaleString('zh-CN')}

性能指标:
${Object.entries(data.metrics).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

请及时检查应用性能状况。
      `,
      'error_alert': `
🚨 错误告警

应用: ${data.applicationName}
错误类型: ${data.errorType}
错误数量: ${data.errorCount}
时间: ${new Date().toLocaleString('zh-CN')}

请及时检查应用错误状况。
      `,
      'project_status_change': `
📋 项目状态变更

项目: ${data.projectName}
状态变更: ${data.oldStatus} → ${data.newStatus}
时间: ${new Date().toLocaleString('zh-CN')}

请关注项目进展。
      `,
      'personnel_movement': `
👥 人员流动通知

人员: ${data.userName}
流动类型: ${data.movementType}
${data.fromProject ? `原项目: ${data.fromProject}` : ''}
${data.toProject ? `目标项目: ${data.toProject}` : ''}
时间: ${new Date().toLocaleString('zh-CN')}

请更新相关项目安排。
      `
    };

    return templates[templateType] || '';
  }
}

export default new NotificationService();
