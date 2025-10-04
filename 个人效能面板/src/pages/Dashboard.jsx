import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Select, Space, Typography, Divider } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CommitStats from '../components/CommitStats';
import TrendChart from '../components/TrendChart';
import SkillRadar from '../components/SkillRadar';
import Workload from '../components/Workload';
import ProjectSummary from '../components/ProjectSummary';
import Header from '../components/Header';

const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    // 模拟从本地存储获取数据
    const storedData = localStorage.getItem('developerDashboardData');
    if (storedData) {
      setDashboardData(JSON.parse(storedData));
    } else {
      // 初始化默认数据
      const defaultData = {
        commits: {
          count: 128,
          lines: 15420,
          growth: 12.5
        },
        workload: {
          hours: 35,
          efficiency: 85,
          loadRate: 72
        },
        skills: [
          { name: 'React', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'Node.js', level: 75 },
          { name: 'Python', level: 70 },
          { name: 'CSS', level: 80 },
          { name: 'Git', level: 95 }
        ],
        projects: [
          { id: 1, name: '电商平台重构', role: '前端负责人', commits: 42, hours: 20 },
          { id: 2, name: '数据可视化系统', role: '全栈开发', commits: 35, hours: 18 },
          { id: 3, name: '移动端应用', role: '前端开发', commits: 28, hours: 12 }
        ]
      };
      setDashboardData(defaultData);
      localStorage.setItem('developerDashboardData', JSON.stringify(defaultData));
    }
  }, []);

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    // 这里可以添加根据时间范围重新获取数据的逻辑
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="!mb-0">个人效能面板</Title>
          <Space>
            <Select 
              defaultValue="month" 
              style={{ width: 120 }} 
              onChange={handleTimeRangeChange}
              value={timeRange}
            >
              <Option value="day">日</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
              <Option value="quarter">季</Option>
              <Option value="year">年</Option>
            </Select>
            <Link to="/settings">
              <Button icon={<SettingOutlined />}>设置</Button>
            </Link>
          </Space>
        </div>

        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BarChartOutlined className="text-blue-500 text-xl" />
                </div>
                <div>
                  <Text type="secondary">代码提交次数</Text>
                  <Title level={3} className="!mb-0">{dashboardData.commits?.count || 0}</Title>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <LineChartOutlined className="text-green-500 text-xl" />
                </div>
                <div>
                  <Text type="secondary">提交代码量</Text>
                  <Title level={3} className="!mb-0">{dashboardData.commits?.lines?.toLocaleString() || 0}</Title>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <PieChartOutlined className="text-purple-500 text-xl" />
                </div>
                <div>
                  <Text type="secondary">环比增长</Text>
                  <Title level={3} className="!mb-0">
                    <span className="text-green-500">+{dashboardData.commits?.growth || 0}%</span>
                  </Title>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <CalendarOutlined className="text-orange-500 text-xl" />
                </div>
                <div>
                  <Text type="secondary">工作时长</Text>
                  <Title level={3} className="!mb-0">{dashboardData.workload?.hours || 0}h</Title>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} lg={16}>
            <Card title="提交趋势" className="shadow-sm">
              <TrendChart timeRange={timeRange} />
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="技能分布" className="shadow-sm">
              <SkillRadar skills={dashboardData.skills || []} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="荷载率分析" className="shadow-sm">
              <Workload workload={dashboardData.workload} />
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="参与项目汇总" className="shadow-sm">
              <ProjectSummary projects={dashboardData.projects || []} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
