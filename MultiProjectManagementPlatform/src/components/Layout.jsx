import React, { useContext } from 'react';
import { Layout as AntLayout, Menu, Avatar, Button, Drawer, Space } from 'antd';
import {
  HomeOutlined,
  ProjectOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
}
  from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Layout.less';

const { Header, Sider, Content } = AntLayout;

const NavigationLayout = ({ children }) => {
  const { user, menuCollapsed, toggleMenu, handleLogout } = useContext(AppContext);

  // 导航菜单配置
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: <Link to="/dashboard">DashBoard</Link>,
    },
    {
      key: 'overview',
      icon: <BarChartOutlined />,
      label: <Link to="/overview">概览</Link>,
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">项目管理</Link>,
    },
    {
      key: 'team',
      icon: <TeamOutlined />,
      label: <Link to="/team">团队成员</Link>,
    },
    {
      key: 'time-tracking',
      icon: <ClockCircleOutlined />,
      label: <Link to="/time-tracking">时间明细</Link>,
    },
    {
      key: 'time-analysis',
      icon: <BarChartOutlined />,
      label: <Link to="/time-analysis">时间分析</Link>,
    },
    {
      key: 'resource-allocation',
      icon: <DatabaseOutlined />,
      label: <Link to="/resource-allocation">资源分配</Link>,
    },
    {
      key: 'applications',
      icon: <AppstoreOutlined />,
      label: <Link to="/applications">应用管理</Link>,
    },
    {
      key: 'app-analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/app-analytics">应用分析</Link>,
    },
    {
      key: 'enhanced-saturation-demo',
      icon: <BarChartOutlined />,
      label: <Link to="/enhanced-saturation-demo">增强版饱和度演示</Link>,
    },
    {
      key: 'transfer-demo',
      icon: <BarChartOutlined />,
      label: <Link to="/transfer-demo">人员调动演示</Link>,
    },
    {
      key: 'personal-workload',
      icon: <ClockCircleOutlined />,
      label: <Link to="/personal-workload">个人负载评估</Link>,
    },
  ];

  return (
    <AntLayout className="layout-container">
      <Sider
        width={250}
        theme="dark"
        collapsible
        collapsed={menuCollapsed}
        collapsedWidth={80}
        trigger={null}
        className="sidebar"
      >
        <div className="logo-container">
          <h2 className={`logo-text ${menuCollapsed ? 'collapsed' : ''}`}>多项目管理平台</h2>
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[window.location.pathname.split('/')[1] || 'home']}
          className="main-menu"
        />
      </Sider>

      <AntLayout className="main-layout">
        <Header className="top-header">
          <Button
            type="text"
            icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleMenu}
            className="menu-toggle"
          />

          <div className="header-right">
            <Avatar className="user-avatar">{user?.name?.charAt(0)}</Avatar>
            <span className="user-name">{user?.name}</span>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-btn"
            >
              退出
            </Button>
          </div>
        </Header>

        <Content className="content-container">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default NavigationLayout;