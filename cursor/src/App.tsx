import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  MonitorOutlined,
  RocketOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';

// 页面组件
import Dashboard from './pages/dashboard/Dashboard';
import PersonalDashboard from './pages/dashboard/PersonalDashboard';
import ProjectList from './pages/projects/ProjectList';
import PersonnelList from './pages/personnel/PersonnelList';
import PerformanceMonitor from './pages/monitoring/PerformanceMonitor';
import DeliveryManager from './pages/delivery/DeliveryManager';
import ProjectManager from './pages/project/ProjectManager';
import ProductManager from './pages/product/ProductManager';
import SystemAdmin from './pages/admin/SystemAdmin';
import ReportAnalytics from './pages/analytics/ReportAnalytics';
import PersonnelGantt from './pages/analytics/PersonnelGantt';
import PersonnelSaturation from './pages/analytics/PersonnelSaturation';
import RiskAnalysis from './pages/analytics/RiskAnalysis';
import BudgetSettlement from './pages/finance/BudgetSettlement';
import AlertSystem from './pages/alerts/AlertSystem';
import UserProfile from './pages/profile/UserProfile';

import './App.css';

const { Content, Sider } = Layout;

const App: React.FC = () => {
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘'
    },
    {
      key: '/personal-dashboard',
      icon: <UserOutlined />,
      label: '个人看板'
    },
    {
      key: 'project-management',
      icon: <ProjectOutlined />,
      label: '项目管理',
      children: [
        { key: '/projects', label: '项目列表' },
        { key: '/project-manager', label: '项目经理' }
      ]
    },
    {
      key: 'personnel',
      icon: <TeamOutlined />,
      label: '人员管理',
      children: [
        { key: '/personnel', label: '人员列表' },
        { key: '/personnel-gantt', label: '人员流动甘特图' },
        { key: '/personnel-saturation', label: '人员饱和度' },
        { key: '/profile', label: '个人中心' }
      ]
    },
    {
      key: 'delivery',
      icon: <RocketOutlined />,
      label: '交付管理',
      children: [
        { key: '/delivery-manager', label: '交付经理' }
      ]
    },
    {
      key: 'product',
      icon: <AppstoreOutlined />,
      label: '产品管理',
      children: [
        { key: '/product-manager', label: '产品经理' }
      ]
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: '监控分析',
      children: [
        { key: '/monitoring', label: '性能监控' },
        { key: '/analytics', label: '报表分析' },
        { key: '/risk-analysis', label: '风险分析' },
        { key: '/alert-system', label: '告警系统' }
      ]
    },
    {
      key: 'finance',
      icon: <BarChartOutlined />,
      label: '财务管理',
      children: [
        { key: '/budget-settlement', label: '预算结算' }
      ]
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: '/admin', label: '系统管理' }
      ]
    }
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="App">
          <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} theme="dark">
              <div style={{ 
                height: 32, 
                margin: 16, 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                聚合平台
              </div>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/']}
                defaultOpenKeys={['project-management', 'personnel', 'delivery', 'product', 'monitoring', 'admin']}
                items={menuItems}
                onClick={({ key }) => {
                  if (key.startsWith('/')) {
                    window.location.href = key;
                  }
                }}
              />
            </Sider>
            <Layout>
              <Content style={{ margin: 0, minHeight: 280 }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/personal-dashboard" element={<PersonalDashboard />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/personnel" element={<PersonnelList />} />
                  <Route path="/personnel-gantt" element={<PersonnelGantt />} />
                  <Route path="/personnel-saturation" element={<PersonnelSaturation />} />
                  <Route path="/monitoring" element={<PerformanceMonitor />} />
                  <Route path="/delivery-manager" element={<DeliveryManager />} />
                  <Route path="/project-manager" element={<ProjectManager />} />
                  <Route path="/product-manager" element={<ProductManager />} />
                  <Route path="/admin" element={<SystemAdmin />} />
                  <Route path="/analytics" element={<ReportAnalytics />} />
                  <Route path="/risk-analysis" element={<RiskAnalysis />} />
                  <Route path="/alert-system" element={<AlertSystem />} />
                  <Route path="/budget-settlement" element={<BudgetSettlement />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
