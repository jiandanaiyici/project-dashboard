import React, { useState } from 'react';
import { Card, Row, Col, Typography, Divider, Tabs, Tag, Select, Button, Space } from 'antd';
import { FileTextOutlined, CalendarOutlined, UserOutlined, AlertOutlined, CheckOutlined } from '@ant-design/icons';
import PortfolioDeliveryStatusCard from '../components/PortfolioDeliveryStatusCard';
import './PortfolioDeliveryStatusDemo.less';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const PortfolioDeliveryStatusDemo = () => {
  const [viewMode, setViewMode] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('currentQuarter');
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 模拟不同时间段的项目组合数据
  const portfolioData = {
    currentQuarter: {
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
      lastUpdated: new Date().toLocaleString('zh-CN')
    },
    lastQuarter: {
      totalProjects: 10,
      inProgressProjects: 4,
      completedProjects: 6,
      atRiskProjects: 1,
      onTimeRate: 90,
      budgetHealth: 88,
      resourceUtilization: 75,
      milestoneHealth: 85,
      overallHealth: 85,
      upcomingMilestones: 2,
      overdueMilestones: 0,
      highPriorityProjects: 3,
      totalTeamMembers: 38,
      lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN')
    },
    currentYear: {
      totalProjects: 28,
      inProgressProjects: 12,
      completedProjects: 15,
      atRiskProjects: 3,
      onTimeRate: 88,
      budgetHealth: 90,
      resourceUtilization: 80,
      milestoneHealth: 82,
      overallHealth: 85,
      upcomingMilestones: 12,
      overdueMilestones: 2,
      highPriorityProjects: 8,
      totalTeamMembers: 42,
      lastUpdated: new Date().toLocaleString('zh-CN')
    }
  };

  // 模拟项目组合详情数据
  const portfolioDetails = [
    {
      id: 1,
      name: '企业资源管理系统升级',
      status: '进行中',
      progress: 65,
      priority: '高',
      health: '健康',
      budgetStatus: '正常',
      manager: '张三',
      members: 12,
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      nextMilestone: '模块测试完成',
      milestoneDate: '2024-05-15'
    },
    {
      id: 2,
      name: '客户关系管理系统重构',
      status: '进行中',
      progress: 45,
      priority: '高',
      health: '需要关注',
      budgetStatus: '超支预警',
      manager: '李四',
      members: 8,
      startDate: '2024-02-01',
      endDate: '2024-07-15',
      nextMilestone: '数据库迁移完成',
      milestoneDate: '2024-05-20'
    },
    {
      id: 3,
      name: '数据分析平台开发',
      status: '进行中',
      progress: 80,
      priority: '中',
      health: '健康',
      budgetStatus: '正常',
      manager: '王五',
      members: 6,
      startDate: '2024-01-01',
      endDate: '2024-04-30',
      nextMilestone: '上线准备',
      milestoneDate: '2024-04-20'
    },
    {
      id: 4,
      name: '移动应用优化',
      status: '风险',
      progress: 30,
      priority: '高',
      health: '风险',
      budgetStatus: '超支',
      manager: '赵六',
      members: 5,
      startDate: '2024-01-10',
      endDate: '2024-05-10',
      nextMilestone: '性能优化完成',
      milestoneDate: '2024-04-30'
    },
    {
      id: 5,
      name: '用户体验提升项目',
      status: '进行中',
      progress: 55,
      priority: '中',
      health: '需要关注',
      budgetStatus: '正常',
      manager: '孙七',
      members: 4,
      startDate: '2024-02-15',
      endDate: '2024-06-15',
      nextMilestone: '原型设计评审',
      milestoneDate: '2024-05-05'
    }
  ];

  // 获取所选时间段的数据
  const currentData = portfolioData[selectedPeriod];

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch(status) {
      case '健康': return '#52c41a';
      case '需要关注': return '#fa8c16';
      case '风险': return '#ff4d4f';
      case '进行中': return '#1890ff';
      case '已完成': return '#52c41a';
      case '计划中': return '#d9d9d9';
      case '正常': return '#52c41a';
      case '超支预警': return '#fa8c16';
      case '超支': return '#ff4d4f';
      case '高': return '#ff4d4f';
      case '中': return '#fa8c16';
      case '低': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 处理刷新数据
  const handleRefresh = () => {
    setLoading(true);
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="portfolio-delivery-status-demo">
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <FileTextOutlined /> 项目组合交付状态管理
        </Title>
        <Paragraph className="page-description">
          实时监控和分析项目组合的整体健康状况、交付进度和资源使用情况，为项目群交付经理提供决策支持。
        </Paragraph>
      </div>

      {/* 控制面板 */}
      <div className="control-panel">
        <Card className="control-card">
          <div className="control-content">
            <Space size="middle">
              <div className="control-item">
                <Text strong>时间周期:</Text>
                <Select 
                  value={selectedPeriod}
                  onChange={setSelectedPeriod}
                  style={{ width: 150, marginLeft: 8 }}
                >
                  <Option value="currentQuarter">当前季度</Option>
                  <Option value="lastQuarter">上一季度</Option>
                  <Option value="currentYear">本年度</Option>
                </Select>
              </div>
              
              <div className="control-item">
                <Text strong>视图模式:</Text>
                <Select 
                  value={viewMode}
                  onChange={setViewMode}
                  style={{ width: 120, marginLeft: 8 }}
                >
                  <Option value="overview">概览视图</Option>
                  <Option value="detail">详细视图</Option>
                </Select>
              </div>
              
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新数据
              </Button>
              
              <Button 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? '收起高级选项' : '显示高级选项'}
              </Button>
            </Space>
          </div>
        </Card>
      </div>

      <Divider />

      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 概览视图 */}
        {viewMode === 'overview' && (
          <>
            {/* 项目组合交付状态概览卡片 */}
            <PortfolioDeliveryStatusCard 
              portfolioData={currentData}
              loading={loading}
              title="项目组合交付状态概览"
            />

            <Divider />

            {/* 关键洞察和建议 */}
            <Card title="关键洞察与建议" className="insights-card">
              <div className="insights-content">
                <div className="insight-item">
                  <AlertOutlined className="insight-icon" />
                  <div className="insight-text">
                    <Text strong>风险项目提醒:</Text>
                    <Text> 当前有{currentData.atRiskProjects}个项目处于风险状态，建议重点关注并及时干预。</Text>
                  </div>
                </div>
                
                <div className="insight-item">
                  <AlertOutlined className="insight-icon" />
                  <div className="insight-text">
                    <Text strong>里程碑预警:</Text>
                    <Text> 有{currentData.overdueMilestones}个里程碑已逾期，{currentData.upcomingMilestones}个里程碑即将到期。</Text>
                  </div>
                </div>
                
                <div className="insight-item">
                  <CheckOutlined className="insight-icon" />
                  <div className="insight-text">
                    <Text strong>资源利用:</Text>
                    <Text> 团队资源利用率为{currentData.resourceUtilization}%，处于合理范围。</Text>
                  </div>
                </div>
                
                <div className="insight-item">
                  <CheckOutlined className="insight-icon" />
                  <div className="insight-text">
                    <Text strong>按时交付:</Text>
                    <Text> 项目按时交付率为{currentData.onTimeRate}%，超过目标值80%。</Text>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* 详细视图 */}
        {viewMode === 'detail' && (
          <>
            {/* 项目详情列表 */}
            <Card title="项目组合详情" className="projects-detail-card">
              <div className="projects-grid">
                {portfolioDetails.map(project => (
                  <Card 
                    key={project.id} 
                    className={`project-detail-card health-${project.health.toLowerCase().replace(/\s+/g, '-')}`}
                    size="small"
                    extra={
                      <Tag color={getStatusColor(project.status)}>
                        {project.status}
                      </Tag>
                    }
                  >
                    <div className="project-header">
                      <Text strong className="project-name">{project.name}</Text>
                      <Tag color={getStatusColor(project.priority)}>
                        优先级: {project.priority}
                      </Tag>
                    </div>
                    
                    <div className="project-metrics">
                      <div className="metric-row">
                        <div className="metric-item">
                          <Text type="secondary">进度</Text>
                          <Text strong>{project.progress}%</Text>
                        </div>
                        <div className="metric-item">
                          <Text type="secondary">状态</Text>
                          <Tag color={getStatusColor(project.health)}>{project.health}</Tag>
                        </div>
                      </div>
                      
                      <div className="metric-row">
                        <div className="metric-item">
                          <Text type="secondary">预算</Text>
                          <Tag color={getStatusColor(project.budgetStatus)}>{project.budgetStatus}</Tag>
                        </div>
                        <div className="metric-item">
                          <Text type="secondary">团队规模</Text>
                          <UserOutlined />
                          <Text strong>{project.members}人</Text>
                        </div>
                      </div>
                    </div>
                    
                    <div className="project-timeline">
                      <div className="timeline-item">
                        <CalendarOutlined />
                        <Text>开始: {project.startDate}</Text>
                      </div>
                      <div className="timeline-item">
                        <CalendarOutlined />
                        <Text>结束: {project.endDate}</Text>
                      </div>
                      <div className="timeline-item">
                        <AlertOutlined />
                        <Text>{project.nextMilestone}: {project.milestoneDate}</Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioDeliveryStatusDemo;