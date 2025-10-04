import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Empty, Tooltip } from 'antd';
import { AlertOutlined, CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined, BarChartOutlined, UserOutlined, FileTextOutlined, FlagOutlined } from '@ant-design/icons';
import './PortfolioDeliveryStatusCard.less';

const PortfolioDeliveryStatusCard = ({ portfolioData, loading = false, title = '项目组合交付状态概览' }) => {
  const [currentTime, setCurrentTime] = useState('');
  
  // 更新当前时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 模拟数据 - 当没有传入数据时使用
  const mockPortfolioData = {
    totalProjects: 12,
    inProgressProjects: 8,
    completedProjects: 3,
    atRiskProjects: 2,
    onTimeRate: 85,
    budgetHealth: 92,
    resourceUtilization: 78,
    milestoneHealth: 75,
    overallHealth: 82,
    upcomingMilestones: 5,
    overdueMilestones: 1,
    highPriorityProjects: 4,
    totalTeamMembers: 42,
    lastUpdated: `${new Date().toLocaleDateString()} ${currentTime}`
  };

  // 使用传入的数据或模拟数据
  const data = portfolioData || mockPortfolioData;

  // 获取健康状态颜色
  const getHealthColor = (value) => {
    if (value >= 85) return '#52c41a'; // 绿色
    if (value >= 65) return '#fa8c16'; // 橙色
    return '#ff4d4f'; // 红色
  };

  // 获取健康状态文本
  const getHealthStatus = (value) => {
    if (value >= 85) return '健康';
    if (value >= 65) return '需要关注';
    return '风险';
  };

  return (
    <Card 
      className="portfolio-delivery-status-card"
      title={title}
      loading={loading}
      extra={
        <Tooltip title="数据更新时间">
          <span className="last-updated">
            更新时间: {data.lastUpdated || `${new Date().toLocaleDateString()} ${currentTime}`}
          </span>
        </Tooltip>
      }
    >
      {loading ? (
        <Empty description="加载中..." />
      ) : (
        <>
          {/* 整体健康度概览 */}
          <div className="overall-health-section">
            <div className="overall-health-score">
              <div className="score-circle" style={{ borderColor: getHealthColor(data.overallHealth) }}>
                <span className="score-text" style={{ color: getHealthColor(data.overallHealth) }}>
                  {data.overallHealth}%
                </span>
                <span className="score-label">整体健康度</span>
              </div>
            </div>
            
            <div className="health-status-tag">
              <Tag color={getHealthColor(data.overallHealth)}>
                {getHealthStatus(data.overallHealth)}
              </Tag>
            </div>
          </div>

          {/* 关键指标卡片 */}
          <Row gutter={[16, 16]} className="key-metrics-section">
            <Col xs={24} sm={12} md={6}>
              <div className="metric-card">
                <div className="metric-header">
                  <ClockCircleOutlined className="metric-icon" />
                  <span className="metric-title">按时交付率</span>
                </div>
                <div className="metric-value">{data.onTimeRate}%</div>
                <Progress 
                  percent={data.onTimeRate} 
                  strokeColor={getHealthColor(data.onTimeRate)} 
                  size="small" 
                  status={data.onTimeRate >= 85 ? 'success' : 'active'}
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="metric-card">
                <div className="metric-header">
                  <BarChartOutlined className="metric-icon" />
                  <span className="metric-title">预算健康度</span>
                </div>
                <div className="metric-value">{data.budgetHealth}%</div>
                <Progress 
                  percent={data.budgetHealth} 
                  strokeColor={getHealthColor(data.budgetHealth)} 
                  size="small" 
                  status={data.budgetHealth >= 85 ? 'success' : 'active'}
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="metric-card">
                <div className="metric-header">
                  <UserOutlined className="metric-icon" />
                  <span className="metric-title">资源利用率</span>
                </div>
                <div className="metric-value">{data.resourceUtilization}%</div>
                <Progress 
                  percent={data.resourceUtilization} 
                  strokeColor={getHealthColor(data.resourceUtilization)} 
                  size="small" 
                  status={data.resourceUtilization >= 85 ? 'success' : 'active'}
                />
              </div>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <div className="metric-card">
                <div className="metric-header">
                  <FlagOutlined className="metric-icon" />
                  <span className="metric-title">里程碑健康度</span>
                </div>
                <div className="metric-value">{data.milestoneHealth}%</div>
                <Progress 
                  percent={data.milestoneHealth} 
                  strokeColor={getHealthColor(data.milestoneHealth)} 
                  size="small" 
                  status={data.milestoneHealth >= 85 ? 'success' : 'active'}
                />
              </div>
            </Col>
          </Row>

          {/* 项目组合概览数据 */}
          <Row gutter={[16, 16]} className="portfolio-overview-section">
            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="总项目数"
                value={data.totalProjects}
                prefix={<FileTextOutlined />}
                suffix="个"
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="进行中项目"
                value={data.inProgressProjects}
                prefix={<ClockCircleOutlined />}
                suffix="个"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="已完成项目"
                value={data.completedProjects}
                prefix={<CheckCircleOutlined />}
                suffix="个"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="风险项目"
                value={data.atRiskProjects}
                prefix={<AlertOutlined />}
                suffix="个"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="即将到期里程碑"
                value={data.upcomingMilestones}
                prefix={<CalendarOutlined />}
                suffix="个"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>

            <Col xs={24} sm={12} md={4}>
              <Statistic
                title="逾期里程碑"
                value={data.overdueMilestones}
                prefix={<AlertOutlined />}
                suffix="个"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default PortfolioDeliveryStatusCard;