import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Avatar, Progress, Badge, Tabs, List, Button, Space, Tag } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useMobileDetection } from '@/components/Mobile';

const { TabPane } = Tabs;

const TeamDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useMobileDetection();

  // 团队统计数据
  const teamStats = [
    {
      title: '团队成员',
      value: 45,
      icon: <TeamOutlined />,
      color: '#1890ff',
      change: '+3',
      trend: 'up',
    },
    {
      title: '活跃项目',
      value: 12,
      icon: <TrophyOutlined />,
      color: '#52c41a',
      change: '+2',
      trend: 'up',
    },
    {
      title: '本月完成任务',
      value: 168,
      icon: <CheckCircleOutlined />,
      color: '#fa8c16',
      change: '+23',
      trend: 'up',
    },
    {
      title: '团队效率',
      value: 92.5,
      suffix: '%',
      icon: <ThunderboltOutlined />,
      color: '#722ed1',
      change: '+2.1%',
      trend: 'up',
    },
  ];

  // 团队成员数据
  const teamMembers = [
    {
      id: 1,
      name: '张明',
      role: '前端开发',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      status: 'online',
      taskCount: 8,
      completionRate: 95,
      performance: 'excellent',
    },
    {
      id: 2,
      name: '李华',
      role: '后端开发',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      status: 'busy',
      taskCount: 6,
      completionRate: 88,
      performance: 'good',
    },
    {
      id: 3,
      name: '王芳',
      role: '产品经理',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      status: 'online',
      taskCount: 5,
      completionRate: 92,
      performance: 'excellent',
    },
    {
      id: 4,
      name: '赵强',
      role: 'UI设计师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
      status: 'offline',
      taskCount: 4,
      completionRate: 85,
      performance: 'good',
    },
  ];

  // 部门数据
  const departments = [
    {
      name: '技术部',
      memberCount: 18,
      projectCount: 5,
      progress: 87,
      efficiency: 'high',
    },
    {
      name: '产品部',
      memberCount: 12,
      projectCount: 3,
      progress: 92,
      efficiency: 'high',
    },
    {
      name: '设计部',
      memberCount: 8,
      projectCount: 4,
      progress: 78,
      efficiency: 'medium',
    },
    {
      name: '运营部',
      memberCount: 7,
      projectCount: 2,
      progress: 95,
      efficiency: 'high',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#52c41a';
      case 'busy': return '#fa8c16';
      case 'offline': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线';
      case 'busy': return '忙碌';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'average': return '#fa8c16';
      case 'poor': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '28px', fontWeight: 600 }}>
          团队看板
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>
          实时查看团队状态、成员动态和工作效率
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {teamStats.map((stat, index) => (
          <Col xs={12} sm={12} lg={6} key={index}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ 
                    fontSize: isMobile ? '12px' : '14px', 
                    color: '#666', 
                    marginBottom: '8px' 
                  }}>
                    {stat.title}
                  </div>
                  <div style={{ 
                    fontSize: isMobile ? '20px' : '24px', 
                    fontWeight: 600, 
                    color: '#262626',
                    marginBottom: '4px',
                  }}>
                    {stat.value}{stat.suffix}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: stat.trend === 'up' ? '#52c41a' : '#ff4d4f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {stat.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                    {stat.change}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  color: stat.color,
                  opacity: 0.8,
                }}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="团队概览" key="overview">
          <Row gutter={[24, 24]}>
            {/* 成员列表 */}
            <Col xs={24} lg={14}>
              <Card 
                title="团队成员" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                extra={<Button type="link">查看全部</Button>}
              >
                <List
                  dataSource={teamMembers}
                  renderItem={(member) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge 
                            color={getStatusColor(member.status)} 
                            dot 
                            offset={[-8, 8]}
                          >
                            <Avatar src={member.avatar} size={48} />
                          </Badge>
                        }
                        title={
                          <Space>
                            <span style={{ fontWeight: 500 }}>{member.name}</span>
                            <Tag color={getPerformanceColor(member.performance)}>
                              {member.performance === 'excellent' ? '优秀' : 
                               member.performance === 'good' ? '良好' : '一般'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: '4px' }}>{member.role}</div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              <Space split="·">
                                <span style={{ color: getStatusColor(member.status) }}>
                                  {getStatusText(member.status)}
                                </span>
                                <span>任务: {member.taskCount}</span>
                                <span>完成率: {member.completionRate}%</span>
                              </Space>
                            </div>
                          </div>
                        }
                      />
                      <div style={{ minWidth: '80px' }}>
                        <Progress 
                          type="circle" 
                          size={40} 
                          percent={member.completionRate}
                          format={() => `${member.completionRate}%`}
                          strokeWidth={8}
                          strokeColor={getPerformanceColor(member.performance)}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* 部门统计 */}
            <Col xs={24} lg={10}>
              <Card 
                title="部门概况" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {departments.map((dept, index) => (
                    <div key={index} style={{ 
                      padding: '16px', 
                      background: '#fafafa', 
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{dept.name}</h4>
                        <Tag color={dept.efficiency === 'high' ? 'green' : 'orange'}>
                          {dept.efficiency === 'high' ? '高效' : '一般'}
                        </Tag>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#666',
                      }}>
                        <span>成员: {dept.memberCount}人</span>
                        <span>项目: {dept.projectCount}个</span>
                      </div>
                      
                      <div style={{ marginBottom: '4px', fontSize: '12px', color: '#999' }}>
                        项目进度
                      </div>
                      <Progress 
                        percent={dept.progress} 
                        size="small"
                        strokeColor={dept.efficiency === 'high' ? '#52c41a' : '#fa8c16'}
                      />
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="工作负载" key="workload">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card 
                title="团队工作负载分析" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <ThunderboltOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div>工作负载分析功能开发中...</div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="技能分析" key="skills">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card 
                title="团队技能分析" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <div>技能分析功能开发中...</div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TeamDashboard;