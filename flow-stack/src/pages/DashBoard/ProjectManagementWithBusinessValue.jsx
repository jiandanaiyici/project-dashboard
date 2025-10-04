import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Spin } from 'antd';
import {
  TrophyOutlined,
  HeartOutlined,
  ShieldOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 商业价值详情
 */
const ProjectManagementWithBusinessValue = () => {
  // 状态管理（保持不变）
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [currentProject, setCurrentProject] = useState('payment-refactor');
  const [timeRange, setTimeRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  // 模拟数据加载（保持不变）
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [activeTab, currentProject, timeRange]);

  // 项目数据（保持不变）
  const projects = [
    {
      id: 'payment-refactor',
      name: '支付系统重构',
      status: '进行中',
      team: '支付研发团队',
      members: 8,
    },
    {
      id: 'user-center',
      name: '用户中心升级',
      status: '计划中',
      team: '用户研发团队',
      members: 6,
    },
    {
      id: 'mobile-app',
      name: '移动端新版开发',
      status: '进行中',
      team: '移动端团队',
      members: 5,
    },
    {
      id: 'data-platform',
      name: '数据分析平台',
      status: '已启动',
      team: '数据团队',
      members: 7,
    },
  ];

  // 获取当前项目信息（保持不变）
  const currentProjectInfo =
    projects.find(p => p.id === currentProject) || projects[0];

  const renderBusinessValue = () => (
    <BusinessValueDetail projectId={currentProject} />
  );

  // 根据当前激活的标签渲染对应内容（增加商业价值选项）
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'tasks':
        return renderTaskManagement();
      case 'risks':
        return renderRiskManagement();
      case 'resources':
        return renderResourceAllocation();
      case 'documents':
        return renderProjectDocuments();
      case 'efficiency':
        return renderPersonnelEfficiency();
      case 'health':
        return renderProjectHealth();
      case 'stability':
        return renderSystemStability();
      case 'business': // 新增商业价值选项
        return renderBusinessValue();
      default:
        return renderOverview();
    }
  };

  // 渲染主布局（更新标签页，增加商业价值）
  return (
    <Layout className="h-screen overflow-hidden flex flex-col">
      {/* 顶部导航（保持不变） */}
      <Header className="bg-white shadow-sm z-10">{/* 内容保持不变 */}</Header>

      {/* 项目信息栏（保持不变） */}
      <div className="bg-white border-b px-6 py-3 flex flex-wrap items-center justify-between">
        {/* 内容保持不变 */}
      </div>

      {/* 主内容区 */}
      <Content className="flex-grow overflow-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div>
              <Title level={3} className="mb-1">
                {/* 其他标题保持不变 */}
                {activeTab === 'business' && '商业价值详情'} {/* 新增标题 */}
              </Title>
              <Text type="secondary">
                {/* 其他描述保持不变 */}
                {activeTab === 'business' &&
                  '分析项目的商业价值、投资回报和业务影响，评估项目效益'}{' '}
                {/* 新增描述 */}
              </Text>
            </div>
            {/* 操作按钮区（保持不变） */}
          </div>

          {/* 功能标签页（增加商业价值选项） */}
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
            <TabPane tab="项目概览" key="overview" />
            <TabPane tab="任务管理" key="tasks" />
            <TabPane tab="风险管理" key="risks" />
            <TabPane tab="资源分配" key="resources" />
            <TabPane tab="项目文档" key="documents" />
            <TabPane
              tab="人员效能"
              key="efficiency"
              icon={<TrophyOutlined />}
            />
            <TabPane tab="项目健康" key="health" icon={<HeartOutlined />} />
            <TabPane tab="系统稳定" key="stability" icon={<ShieldOutlined />} />
            <TabPane
              tab="商业价值"
              key="business"
              icon={<DollarOutlined />}
            />{' '}
            {/* 新增标签页 */}
          </Tabs>

          {/* 内容区域（保持不变） */}
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Spin size="large" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </Content>

      {/* 页脚（保持不变） */}
      <Footer className="bg-white border-t text-center py-4">
        {/* 内容保持不变 */}
      </Footer>
    </Layout>
  );
};

// 导出组件
export default ProjectManagementWithBusinessValue;
