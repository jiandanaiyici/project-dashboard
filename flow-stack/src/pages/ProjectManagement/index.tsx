import React, { useState } from 'react';
import {
  Layout,
  Badge,
  Button,
  Tabs,
  Select,
  DatePicker,
  Typography,
  Flex,
} from 'antd';
import {
  TeamOutlined,
  PlusOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { PROJECT_TABS, projects } from '@/mock';
import Overview from './Overview';
import TaskManagement from './TaskManagement';
import RiskManagement from './RiskManagement';
import ResourceAllocation from './ResourceAllocation';
import ProjectDocuments from './ProjectDocuments';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState(PROJECT_TABS.overview.key);
  const [currentProject, setCurrentProject] = useState('payment-refactor');

  const currentProjectInfo =
    projects.find((p) => p.value === currentProject) || projects[0];

  return (
    <Layout className="h-screen overflow-hidden flex flex-col">
      <Flex
        wrap="wrap"
        align="center"
        justify="space-between"
        className="bg-white border-b px-6 py-3 items-center"
      >
        <Flex align="center" gap={12}>
          <Title level={4} className="mb-0">
            {currentProjectInfo.label}
          </Title>
          <Badge
            status={
              currentProjectInfo.status === '进行中'
                ? 'processing'
                : currentProjectInfo.status === '计划中'
                  ? 'default'
                  : 'success'
            }
            text={currentProjectInfo.status}
          />
          <Text type="secondary" className="ml-4 hidden md:inline">
            <TeamOutlined className="mr-1" /> {currentProjectInfo.manager} ·{' '}
            {currentProjectInfo.members}名成员
          </Text>
        </Flex>
        <Select
          value={currentProject}
          style={{ width: 200 }}
          className="mt-2 sm:mt-0"
          onChange={setCurrentProject}
          options={projects}
        />
      </Flex>
      <Content className="flex-grow overflow-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Flex
            wrap="wrap"
            align="center"
            justify="space-between"
            className="mb-6"
          >
            <div>
              <Title level={3} className="mb-1">
                {PROJECT_TABS[activeTab]?.title}
              </Title>
              <Text type="secondary">
                {PROJECT_TABS[activeTab]?.description}
              </Text>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <RangePicker />
              <Button type="primary" icon={<DownloadOutlined />}>
                导出报告
              </Button>
              {activeTab === 'tasks' && (
                <Button type="primary" size="small" icon={<PlusOutlined />}>
                  创建任务
                </Button>
              )}
            </div>
          </Flex>
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-6">
            <TabPane tab="项目概览" key="overview">
              <Overview />
            </TabPane>
            <TabPane tab="任务管理" key="tasks">
              <TaskManagement />
            </TabPane>
            <TabPane tab="风险管理" key="risks">
              <RiskManagement />
            </TabPane>
            <TabPane tab="资源分配" key="resources">
              <ResourceAllocation />
            </TabPane>
            <TabPane tab="项目文档" key="documents">
              <ProjectDocuments />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default ProjectManagement;
