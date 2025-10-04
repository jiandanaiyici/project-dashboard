import React, { useState } from 'react';
import { Card, Avatar, Progress, Tag, Tooltip, Popover, Empty } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, AlertOutlined, PieChartOutlined, UserOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import './EnhancedMemberSaturationCard.less';

/**
 * 增强版成员工作饱和度视图卡片
 * 展示团队成员的详细工作量饱和度、项目分配和时间投入信息
 */
const EnhancedMemberSaturationCard = ({ 
  name, 
  role, 
  avatarUrl, 
  saturation, 
  projects = [], 
  tasks = [], 
  totalHours = 0, 
  overtimeHours = 0, 
  availableHours = 0,
  lastUpdated, 
  onClick,
  onProjectClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  // 根据饱和度确定状态类型和颜色
  const getSaturationStatus = () => {
    if (saturation > 80) {
      return { type: 'danger', level: '超载', color: '#ff4d4f', icon: <AlertOutlined /> };
    }
    if (saturation > 60) {
      return { type: 'warning', level: '正常', color: '#fa8c16', icon: <CheckCircleOutlined /> };
    }
    return { type: 'success', level: '空闲', color: '#52c41a', icon: <ClockCircleOutlined /> };
  };

  const status = getSaturationStatus();

  // 为不同项目生成不同颜色
  const getProjectColor = (projectId) => {
    const colors = ['#1890ff', '#722ed1', '#fa8c16', '#52c41a', '#13c2c2', '#eb2f96'];
    return colors[projectId % colors.length];
  };

  // 处理卡片展开/收起
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 项目分配详情弹出框内容
  const getProjectAllocationContent = () => {
    if (!projects || projects.length === 0) {
      return <Empty description="暂无项目分配" />;
    }

    return (
      <div className="project-allocation-details">
        <h4 className="details-title">项目分配详情</h4>
        <div className="project-list">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="project-item"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onProjectClick && onProjectClick(project)}
            >
              <div className="project-header">
                <div className="project-color" style={{ backgroundColor: getProjectColor(project.id) }}></div>
                <span className="project-name">{project.name}</span>
                <Tag color={project.status === 'active' ? 'green' : 'blue'}>
                  {project.status === 'active' ? '进行中' : '已完成'}
                </Tag>
              </div>
              <div className="project-stats">
                <div className="stat-item">
                  <span className="stat-label">投入占比:</span>
                  <span className="stat-value">{project.percentage}%</span>
                </div>
                {project.startDate && (
                  <div className="stat-item">
                    <span className="stat-label">开始日期:</span>
                    <span className="stat-value">{project.startDate}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="stat-item">
                    <span className="stat-label">结束日期:</span>
                    <span className="stat-value">{project.endDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card
      className={`enhanced-member-saturation-card ${status.type}`}
      hoverable
      onClick={onClick}
      extra={
        <Tooltip title={isExpanded ? '收起详情' : '展开详情'}>
          <button 
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </Tooltip>
      }
    >
      {/* 基本信息区域 */}
      <div className="card-header">
        <Avatar 
          src={avatarUrl || undefined}
          icon={<UserOutlined />}
          className="member-avatar"
        />
        <div className="member-info">
          <div className="member-name-role">
            <span className="member-name">{name}</span>
            <span className="member-role">{role}</span>
          </div>
          <div className="member-status">
            <Tag 
              icon={status.icon}
              color={status.type} 
              className="saturation-tag"
            >
              {status.level} ({saturation}%)
            </Tag>
            {lastUpdated && (
              <span className="last-updated">
                更新时间: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 饱和度进度条 */}
      <div className="saturation-progress-section">
        <div className="progress-header">
          <span className="progress-title">工作饱和度</span>
          <span className="progress-value">{saturation}%</span>
        </div>
        <Progress 
          percent={saturation} 
          strokeColor={status.color} 
          strokeWidth={4} 
          showInfo={false}
          status={status.type === 'danger' ? 'exception' : undefined}
          className="saturation-progress"
        />
      </div>

      {/* 关键指标统计 */}
      <div className="key-metrics">
        <div className="metric-item">
          <Tooltip title="总工作时长">
            <div className="metric-content">
              <ClockCircleOutlined className="metric-icon" />
              <div>
                <span className="metric-value">{totalHours}</span>
                <span className="metric-unit">小时</span>
              </div>
            </div>
          </Tooltip>
        </div>
        <div className="metric-item">
          <Tooltip title="加班时长">
            <div className="metric-content">
              <AlertOutlined className="metric-icon overtime-icon" />
              <div>
                <span className="metric-value">{overtimeHours}</span>
                <span className="metric-unit">小时</span>
              </div>
            </div>
          </Tooltip>
        </div>
        <div className="metric-item">
          <Tooltip title="可用工时">
            <div className="metric-content">
              <CheckCircleOutlined className="metric-icon available-icon" />
              <div>
                <span className="metric-value">{availableHours}</span>
                <span className="metric-unit">小时</span>
              </div>
            </div>
          </Tooltip>
        </div>
        <div className="metric-item">
          <Tooltip title="项目数量">
            <div className="metric-content">
              <FileTextOutlined className="metric-icon" />
              <div>
                <span className="metric-value">{projects.length}</span>
                <span className="metric-unit">个</span>
              </div>
            </div>
          </Tooltip>
        </div>
        <div className="metric-item">
          <Tooltip title="任务数量">
            <div className="metric-content">
              <CalendarOutlined className="metric-icon" />
              <div>
                <span className="metric-value">{tasks.length}</span>
                <span className="metric-unit">个</span>
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* 展开详情区域 */}
      {isExpanded && (
        <div className="expanded-details">
          {/* 项目分配概览 */}
          <div className="project-allocation-section">
            <h4 className="section-title">项目分配概览</h4>
            <div className="project-allocation-chart">
              {/* 这里使用简化的项目分配可视化 */}
              <div className="project-allocation-bars">
                {projects.map(project => (
                  <Tooltip 
                    key={project.id} 
                    title={`${project.name}: ${project.percentage}%`}
                  >
                    <div 
                      className={`project-allocation-bar ${hoveredProject === project.id ? 'hovered' : ''}`}
                      style={{
                        width: `${project.percentage}%`,
                        backgroundColor: getProjectColor(project.id)
                      }}
                      onClick={() => onProjectClick && onProjectClick(project)}
                    ></div>
                  </Tooltip>
                ))}
              </div>
              {/* 项目图例 */}
              <div className="project-legend">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className="legend-item"
                    onClick={() => onProjectClick && onProjectClick(project)}
                  >
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: getProjectColor(project.id) }}
                    ></div>
                    <span className="legend-text">{project.name} ({project.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 任务状态概览 */}
          {tasks.length > 0 && (
            <div className="task-status-section">
              <h4 className="section-title">任务状态</h4>
              <div className="task-status-summary">
                <div className="task-status-item">
                  <Tag color="processing">进行中</Tag>
                  <span className="task-count">
                    {tasks.filter(t => t.status === 'inProgress').length}个
                  </span>
                </div>
                <div className="task-status-item">
                  <Tag color="success">已完成</Tag>
                  <span className="task-count">
                    {tasks.filter(t => t.status === 'completed').length}个
                  </span>
                </div>
                <div className="task-status-item">
                  <Tag color="warning">待处理</Tag>
                  <span className="task-count">
                    {tasks.filter(t => t.status === 'pending').length}个
                  </span>
                </div>
                <div className="task-status-item">
                  <Tag color="error">逾期</Tag>
                  <span className="task-count">
                    {tasks.filter(t => t.status === 'overdue').length}个
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 查看详情按钮 */}
          <div className="action-buttons">
            <Popover 
              content={getProjectAllocationContent()} 
              title="项目分配详情" 
              trigger="click"
              placement="bottom"
              arrowPointAtCenter
            >
              <button className="detail-btn">
                <PieChartOutlined /> 查看详细分配
              </button>
            </Popover>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedMemberSaturationCard;