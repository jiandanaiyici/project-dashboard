import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Space, Button, Select, Input, Avatar, Divider, Tag } from 'antd';
import { UserOutlined, UserAddOutlined, BarChartOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import PersonalWorkloadAssessment from './PersonalWorkloadAssessment';
import './PersonalWorkloadAssessmentDemo.less';

const { Option } = Select;
const { Search } = Input;

/**
 * 个人工作负载评估演示组件
 * 用于展示个人负载评估功能
 */
const PersonalWorkloadAssessmentDemo = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [reloadDemo, setReloadDemo] = useState(0);

  // 模拟用户数据
  const mockUsers = [
    {
      id: '1',
      name: '张三',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      role: '前端开发工程师',
      department: '研发部',
      status: 'high'
    },
    {
      id: '2',
      name: '李四',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      role: '后端开发工程师',
      department: '研发部',
      status: 'medium'
    },
    {
      id: '3',
      name: '王五',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      role: '产品经理',
      department: '产品部',
      status: 'normal'
    },
    {
      id: '4',
      name: '赵六',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
      role: 'UI设计师',
      department: '设计部',
      status: 'high'
    },
    {
      id: '5',
      name: '钱七',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
      role: '测试工程师',
      department: '测试部',
      status: 'medium'
    },
    {
      id: '6',
      name: '孙八',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6',
      role: '数据分析师',
      department: '数据部',
      status: 'normal'
    }
  ];

  // 部门数据
  const departments = [
    { value: 'all', label: '全部部门' },
    { value: '研发部', label: '研发部' },
    { value: '产品部', label: '产品部' },
    { value: '设计部', label: '设计部' },
    { value: '测试部', label: '测试部' },
    { value: '数据部', label: '数据部' }
  ];

  // 过滤用户数据
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchesTab = activeTab === 'all' || user.status === activeTab;
    
    return matchesSearch && matchesDepartment && matchesTab;
  });

  // 刷新演示数据
  const handleReload = () => {
    setReloadDemo(prev => prev + 1);
  };

  // 获取标签配置
  const getStatusTagConfig = (status) => {
    const config = {
      high: { color: 'red', text: '高负载' },
      medium: { color: 'orange', text: '正常负载' },
      normal: { color: 'green', text: '低负载' }
    };
    return config[status] || config.normal;
  };

  return (
    <div className="workload-assessment-demo">
      {/* 页面头部 */}
      <div className="demo-header">
        <h1 className="demo-title">
          <BarChartOutlined className="title-icon" />
          个人工作负载评估
        </h1>
        <p className="demo-description">
          根据工时投入、任务完成情况、缺陷率等指标，评估个人的工作负载情况，及时调整工作分配，避免超期完成任务
        </p>
      </div>

      {/* 工具栏 */}
      <div className="demo-toolbar">
        <div className="toolbar-left">
          <Search
            placeholder="搜索姓名或角色"
            allowClear
            enterButton={<FilterOutlined />}
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Select
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            style={{ width: 150, marginRight: 16 }}
            size="large"
            placeholder="选择部门"
          >
            {departments.map(dept => (
              <Option key={dept.value} value={dept.value}>{dept.label}</Option>
            ))}
          </Select>
        </div>
        <div className="toolbar-right">
          <Button 
            type="primary" 
            icon={<UserAddOutlined />}
            size="large"
          >
            添加成员
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            size="large"
            onClick={handleReload}
            style={{ marginLeft: 8 }}
          >
            刷新数据
          </Button>
        </div>
      </div>

      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="status-tabs"
        items={[
          {
            key: 'all',
            label: `全部 (${filteredUsers.length})`,
          },
          {
            key: 'high',
            label: (
              <span>
                高负载 ({mockUsers.filter(u => u.status === 'high').length})
              </span>
            ),
          },
          {
            key: 'medium',
            label: (
              <span>
                正常负载 ({mockUsers.filter(u => u.status === 'medium').length})
              </span>
            ),
          },
          {
            key: 'normal',
            label: (
              <span>
                低负载 ({mockUsers.filter(u => u.status === 'normal').length})
              </span>
            ),
          },
        ]}
      />

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stat-cards">
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card high-load">
            <div className="stat-card-content">
              <div className="stat-icon">
                <UserOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {mockUsers.filter(u => u.status === 'high').length}
                </div>
                <div className="stat-label">高负载人员</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card medium-load">
            <div className="stat-card-content">
              <div className="stat-icon">
                <UserOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {mockUsers.filter(u => u.status === 'medium').length}
                </div>
                <div className="stat-label">正常负载人员</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card low-load">
            <div className="stat-card-content">
              <div className="stat-icon">
                <UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {mockUsers.filter(u => u.status === 'normal').length}
                </div>
                <div className="stat-label">低负载人员</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 评估列表或详情 */}
      {selectedUser ? (
        // 个人详情视图
        <div className="user-detail-view">
          <Button onClick={() => setSelectedUser(null)} style={{ marginBottom: 16 }}>
            返回列表
          </Button>
          <PersonalWorkloadAssessment
            userId={selectedUser.id}
            userName={selectedUser.name}
            avatarUrl={selectedUser.avatar}
            role={selectedUser.role}
            department={selectedUser.department}
          />
        </div>
      ) : (
        // 列表视图
        <Row gutter={[16, 16]} className="user-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => {
              const statusConfig = getStatusTagConfig(user.status);
              return (
                <Col xs={24} sm={12} lg={8} key={user.id}>
                  <Card
                    hoverable
                    className={`user-card ${user.status}`}
                    onClick={() => setSelectedUser(user)}
                    bodyStyle={{ padding: 16 }}
                    cover={
                      <div className="user-card-header">
                        <Avatar size={64} src={user.avatar} className="user-card-avatar" />
                        <div className="user-card-info">
                          <h3 className="user-card-name">{user.name}</h3>
                          <p className="user-card-role">{user.role}</p>
                          <p className="user-card-dept">{user.department}</p>
                        </div>
                        <Tag color={statusConfig.color} className="user-card-status">
                          {statusConfig.text}
                        </Tag>
                      </div>
                    }
                  >
                    <Button 
                      type="link" 
                      block 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                      }}
                    >
                      查看详情
                    </Button>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col span={24}>
              <Card>
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <p>暂无匹配的用户数据</p>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* 使用说明 */}
      <div className="usage-guide">
        <Divider>功能说明</Divider>
        <div className="guide-content">
          <h3>个人工作负载评估功能</h3>
          <ul>
            <li><strong>工时投入分析：</strong>统计总工时、加班时长和可用工时，实时监控工作饱和度</li>
            <li><strong>任务完成情况：</strong>跟踪任务完成率和按时完成率，评估工作效率</li>
            <li><strong>质量指标：</strong>监控缺陷率，确保工作质量</li>
            <li><strong>综合评分：</strong>基于多维度指标生成综合负载评分，直观展示工作负载状态</li>
            <li><strong>趋势分析：</strong>通过历史数据图表，展示工作负载变化趋势</li>
            <li><strong>智能建议：</strong>根据评估结果提供个性化工作分配建议</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PersonalWorkloadAssessmentDemo;