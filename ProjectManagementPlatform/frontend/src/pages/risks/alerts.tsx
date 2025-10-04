import React, { useState } from 'react';
import { Card, Alert, Statistic, Row, Col, Tag, List, Timeline, Progress } from 'antd';
import { 
  ExclamationCircleOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';

const RiskAlertsPage: React.FC = () => {
  // 模拟告警数据
  const alertStats = [
    { title: '高危告警', value: 3, status: 'error', icon: <ExclamationCircleOutlined /> },
    { title: '中危告警', value: 8, status: 'warning', icon: <WarningOutlined /> },
    { title: '低危告警', value: 15, status: 'success', icon: <InfoCircleOutlined /> },
    { title: '已处理', value: 42, status: 'default', icon: <CheckCircleOutlined /> },
  ];

  const recentAlerts = [
    {
      id: '1',
      title: '项目预算超支预警',
      level: 'high',
      time: '2024-01-15 14:30',
      description: '移动端开发项目预算使用率已达95%',
      status: 'pending'
    },
    {
      id: '2', 
      title: '人员工作负载过高',
      level: 'medium',
      time: '2024-01-15 13:15',
      description: '前端团队平均工作负载达到120%',
      status: 'processing'
    },
    {
      id: '3',
      title: '项目进度延迟风险',
      level: 'medium',
      time: '2024-01-15 11:45',
      description: 'CRM系统开发进度落后计划10天',
      status: 'pending'
    },
    {
      id: '4',
      title: '技能缺口告警',
      level: 'low',
      time: '2024-01-15 10:20',
      description: 'React Native技能人员不足，影响移动端项目',
      status: 'resolved'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高危';
      case 'medium': return '中危';
      case 'low': return '低危';
      default: return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'red';
      case 'processing': return 'blue';
      case 'resolved': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解决';
      default: return '未知';
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 告警统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {alertStats.map((stat, index) => (
          <Col xs={12} sm={12} md={6} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ 
                  color: stat.status === 'error' ? '#cf1322' : 
                         stat.status === 'warning' ? '#d48806' : 
                         stat.status === 'success' ? '#389e0d' : '#666'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最新告警列表 */}
        <Col xs={24} lg={16}>
          <Card title="最新告警" extra={<a href="#">查看全部</a>}>
            <List
              itemLayout="vertical"
              dataSource={recentAlerts}
              renderItem={(item) => (
                <List.Item
                  style={{ 
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, marginRight: '12px' }}>{item.title}</h4>
                        <Tag color={getLevelColor(item.level)}>
                          {getLevelText(item.level)}
                        </Tag>
                        <Tag color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Tag>
                      </div>
                      <p style={{ margin: 0, color: '#666', marginBottom: '8px' }}>
                        {item.description}
                      </p>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 风险趋势和处理进度 */}
        <Col xs={24} lg={8}>
          <Card title="处理进度" style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>高危告警处理率</span>
                <span>66%</span>
              </div>
              <Progress percent={66} status="active" strokeColor="#f5222d" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>中危告警处理率</span>
                <span>87%</span>
              </div>
              <Progress percent={87} strokeColor="#fa8c16" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>低危告警处理率</span>
                <span>93%</span>
              </div>
              <Progress percent={93} strokeColor="#52c41a" />
            </div>
          </Card>

          <Card title="最近处理记录">
            <Timeline>
              <Timeline.Item color="green">
                <div style={{ fontSize: '12px' }}>
                  <div>解决了预算超支问题</div>
                  <div style={{ color: '#999' }}>2小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div style={{ fontSize: '12px' }}>
                  <div>正在处理人员负载问题</div>
                  <div style={{ color: '#999' }}>4小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="red">
                <div style={{ fontSize: '12px' }}>
                  <div>发现新的进度风险</div>
                  <div style={{ color: '#999' }}>6小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div style={{ fontSize: '12px' }}>
                  <div>创建技能缺口告警</div>
                  <div style={{ color: '#999' }}>8小时前</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskAlertsPage;
