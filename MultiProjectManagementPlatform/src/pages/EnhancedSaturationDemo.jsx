import React, { useState } from 'react';
import { Row, Col, Avatar, Input, Select, Radio, Empty, Button, Space, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, UserOutlined, ExportOutlined } from '@ant-design/icons';
import EnhancedMemberSaturationCard from '../components/EnhancedMemberSaturationCard';
import './EnhancedSaturationDemo.less';

const { Option } = Select;
const { Search } = Input;

/**
 * 增强版成员工作饱和度卡片演示页面
 * 展示如何使用EnhancedMemberSaturationCard组件
 */
const EnhancedSaturationDemo = () => {
  // 状态管理
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [loading, setLoading] = useState(false);

  // 模拟数据 - 高负荷成员
  const highLoadMember = {
    id: 1,
    name: '李开发',
    role: '前端开发',
    avatarUrl: 'https://picsum.photos/id/1012/200/200',
    saturation: 92,
    totalHours: 76,
    overtimeHours: 18,
    availableHours: 8,
    lastUpdated: '2024-09-20 15:30',
    projects: [
      { id: 1, name: '电商平台重构', percentage: 45, status: 'active', startDate: '2024-01-01', endDate: '2024-03-31' },
      { id: 2, name: '用户管理系统', percentage: 30, status: 'active', startDate: '2024-02-15', endDate: '2024-04-15' },
      { id: 3, name: '数据分析平台', percentage: 17, status: 'active', startDate: '2024-03-01', endDate: '2024-03-15' }
    ],
    tasks: [
      { id: 1, name: '首页性能优化', status: 'inProgress', priority: 'high' },
      { id: 2, name: '用户登录模块重构', status: 'inProgress', priority: 'high' },
      { id: 3, name: '数据可视化组件开发', status: 'inProgress', priority: 'medium' },
      { id: 4, name: '移动端适配优化', status: 'overdue', priority: 'medium' },
      { id: 5, name: '接口文档编写', status: 'pending', priority: 'low' },
      { id: 6, name: '用户反馈问题修复', status: 'completed', priority: 'high' }
    ]
  };

  // 模拟数据 - 正常负荷成员
  const normalLoadMember = {
    id: 2,
    name: '赵数据',
    role: '数据分析师',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    saturation: 75,
    totalHours: 62,
    overtimeHours: 6,
    availableHours: 22,
    lastUpdated: '2024-09-20 14:15',
    projects: [
      { id: 3, name: '数据分析平台', percentage: 50, status: 'active', startDate: '2024-01-15', endDate: '2024-04-30' },
      { id: 4, name: '用户行为分析', percentage: 25, status: 'active', startDate: '2024-02-01', endDate: '2024-03-15' }
    ],
    tasks: [
      { id: 7, name: '数据仓库建模', status: 'inProgress', priority: 'high' },
      { id: 8, name: '业务指标分析报告', status: 'inProgress', priority: 'medium' },
      { id: 9, name: '数据可视化仪表板开发', status: 'completed', priority: 'high' },
      { id: 10, name: '数据导出功能优化', status: 'completed', priority: 'medium' },
      { id: 11, name: '数据质量监控规则配置', status: 'pending', priority: 'low' }
    ]
  };

  // 模拟数据 - 低负荷成员
  const lowLoadMember = {
    id: 3,
    name: '陈文档',
    role: '技术文档',
    avatarUrl: 'https://picsum.photos/id/1074/200/200',
    saturation: 45,
    totalHours: 38,
    overtimeHours: 2,
    availableHours: 46,
    lastUpdated: '2024-09-20 10:45',
    projects: [
      { id: 1, name: '电商平台重构', percentage: 25, status: 'active', startDate: '2024-02-01', endDate: '2024-03-31' },
      { id: 5, name: '内部知识库建设', percentage: 20, status: 'active', startDate: '2024-01-01', endDate: '2024-06-30' }
    ],
    tasks: [
      { id: 12, name: 'API文档更新', status: 'inProgress', priority: 'medium' },
      { id: 13, name: '用户手册编写', status: 'pending', priority: 'medium' },
      { id: 14, name: '系统架构文档修订', status: 'completed', priority: 'high' }
    ]
  };

  // 模拟数据 - 空闲成员
  const idleMember = {
    id: 4,
    name: '王测试',
    role: '测试工程师',
    avatarUrl: 'https://picsum.photos/id/1062/200/200',
    saturation: 30,
    totalHours: 24,
    overtimeHours: 0,
    availableHours: 60,
    lastUpdated: '2024-09-20 09:30',
    projects: [
      { id: 6, name: '内部工具开发', percentage: 30, status: 'active', startDate: '2024-03-01', endDate: '2024-04-15' }
    ],
    tasks: [
      { id: 15, name: '测试用例编写', status: 'inProgress', priority: 'medium' },
      { id: 16, name: '自动化测试脚本开发', status: 'pending', priority: 'high' }
    ]
  };

  // 所有成员数据
  const allMembers = [highLoadMember, normalLoadMember, lowLoadMember, idleMember];

  // 筛选成员数据
  const filteredMembers = allMembers.filter(member => {
    // 状态筛选
    if (filterStatus === 'danger' && member.saturation <= 80) return false;
    if (filterStatus === 'warning' && (member.saturation <= 60 || member.saturation > 80)) return false;
    if (filterStatus === 'success' && member.saturation > 60) return false;

    // 搜索筛选
    if (searchQuery &&
      !member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !member.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // 处理成员卡片点击
  const handleMemberClick = (member) => {
    // 跳转到成员详情页面，使用状态管理传递数据
    localStorage.setItem('selectedMember', JSON.stringify(member));
    window.location.href = `/member/${member.id}`;
  };

  // 处理项目点击
  const handleProjectClick = (project) => {
    Modal.info({
      title: `项目详情: ${project.name}`,
      content: (
        <div>
          <p>状态: {project.status === 'active' ? '进行中' : '已完成'}</p>
          <p>投入占比: {project.percentage}%</p>
          <p>开始日期: {project.startDate}</p>
          <p>结束日期: {project.endDate}</p>
        </div>
      ),
      onOk() { }
    });
  };

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    // 模拟数据加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // 清空筛选
  const handleClearFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
  };

  return (
    <div className="enhanced-saturation-demo-container">
      {/* 页面标题和操作栏 */}
      <div className="page-header">
        <h1 className="demo-title">
          <UserOutlined /> 增强版成员工作饱和度视图
        </h1>
        <div className="header-actions">
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>添加成员</Button>
            <Button onClick={handleRefresh} loading={loading}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出数据</Button>
          </Space>
        </div>
      </div>

      {/* 筛选和搜索区域 */}
      <div className="filter-section">
        <div className="filter-controls">
          <Search
            placeholder="搜索成员姓名或角色"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="筛选饱和度"
            size="middle"
            className="status-filter"
          >
            <Option value="all">全部</Option>
            <Option value="danger">高负荷 (&gt;80%)</Option>
            <Option value="warning">正常负荷 (60-80%)</Option>
            <Option value="success">低负荷 (&lt;60%)</Option>
          </Select>
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="view-mode">
            <Radio.Button value="card">卡片视图</Radio.Button>
            <Radio.Button value="list">列表视图</Radio.Button>
          </Radio.Group>
          <Button onClick={handleClearFilters} className="clear-filter-btn">清空筛选</Button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="stats-overview">
        <div className="stat-card total-members">
          <div className="stat-value">{allMembers.length}</div>
          <div className="stat-label">总成员数</div>
        </div>
        <div className="stat-card high-load">
          <div className="stat-value danger">{allMembers.filter(m => m.saturation > 80).length}</div>
          <div className="stat-label">高负荷成员</div>
        </div>
        <div className="stat-card normal-load">
          <div className="stat-value warning">{allMembers.filter(m => m.saturation > 60 && m.saturation <= 80).length}</div>
          <div className="stat-label">正常负荷成员</div>
        </div>
        <div className="stat-card low-load">
          <div className="stat-value success">{allMembers.filter(m => m.saturation <= 60).length}</div>
          <div className="stat-label">低负荷成员</div>
        </div>
      </div>

      {/* 成员卡片展示区域 */}
      <div className="members-section">
        {loading ? (
          <div className="loading-container">
            <Empty description="加载中..." />
          </div>
        ) : filteredMembers.length > 0 ? (
          viewMode === 'card' ? (
            <Row gutter={[16, 16]}>
              {filteredMembers.map(member => (
                <Col key={member.id} xs={24} sm={12} md={8} lg={6}>
                  <EnhancedMemberSaturationCard
                    {...member}
                    onClick={() => handleMemberClick(member)}
                    onProjectClick={handleProjectClick}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="list-view">
              {filteredMembers.map(member => (
                <div key={member.id} className="list-item">
                  <EnhancedMemberSaturationCard
                    {...member}
                    onClick={() => handleMemberClick(member)}
                    onProjectClick={handleProjectClick}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <Empty description="没有找到匹配的成员" />
        )}
      </div>

      {/* 使用说明 */}
      <div className="usage-guide">
        <h2>组件功能说明</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>基础信息展示</h3>
            <p>显示成员姓名、角色、头像和当前工作饱和度，通过颜色区分不同饱和度状态。</p>
          </div>
          <div className="feature-item">
            <h3>详细数据统计</h3>
            <p>提供总工时、加班时长、可用工时、项目数量和任务数量等关键指标。</p>
          </div>
          <div className="feature-item">
            <h3>展开详情功能</h3>
            <p>点击卡片右上角的+按钮可展开查看项目分配概览和任务状态统计。</p>
          </div>
          <div className="feature-item">
            <h3>项目分配可视化</h3>
            <p>直观展示成员在不同项目中的时间分配比例，支持查看详细的项目信息。</p>
          </div>
          <div className="feature-item">
            <h3>交互操作</h3>
            <p>支持点击查看成员详情、项目详情，以及筛选、搜索和视图切换功能。</p>
          </div>
          <div className="feature-item">
            <h3>响应式设计</h3>
            <p>适配不同屏幕尺寸，在移动端和桌面端均有良好的显示效果。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSaturationDemo;