import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Drawer } from 'antd';
import { Outlet, useLocation, useNavigate } from 'umi';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  MonitorOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useMobileDetection } from '../components/Mobile';
import { useUserStore } from '@/stores';
import AuthGuard from '@/components/AuthGuard';
import './CloudLayout.less';

const { Header, Content } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  children?: MenuItem[];
  badge?: number;
}

const CloudLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('');
  const { isMobile } = useMobileDetection();
  const { user, logout } = useUserStore();

  // 导航菜单配置
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: '工作台',
      icon: <DashboardOutlined />,
      path: '/app/dashboard',
    },
    {
      key: 'performance-evaluation',
      label: '智能绩效',
      icon: <StarOutlined />,
      path: '/app/performance-evaluation',
    },
    {
      key: 'projects',
      label: '项目',
      icon: <ProjectOutlined />,
      path: '/app/projects',
      children: [
        { key: 'projects-list', label: '项目列表', path: '/app/projects/list' },
        { key: 'projects-kanban', label: '任务看板', path: '/app/projects/kanban' },
      ],
    },
    {
      key: 'teams',
      label: '团队',
      icon: <TeamOutlined />,
      path: '/app/users',
      children: [
        { key: 'teams-list', label: '人员列表', path: '/app/users/list' },
        { key: 'teams-org', label: '组织架构', path: '/app/users/organization' },
        { key: 'teams-skills', label: '技能分析', path: '/app/users/skills' },
        { key: 'teams-gantt', label: '人员云动甘特图', path: '/app/users/staff-gantt' },
      ],
    },
    {
      key: 'analytics',
      label: '数据分析',
      icon: <BarChartOutlined />,
      path: '/app/reports',
      children: [
        { key: 'analytics-overview', label: '数据概览', path: '/app/reports/overview' },
        { key: 'analytics-performance', label: '性能分析', path: '/app/reports/performance' },
      ],
    },
    {
      key: 'monitoring',
      label: '应用健康度',
      icon: <MonitorOutlined />,
      path: '/app/performance',
      children: [
        { key: 'monitoring-dashboard', label: '健康度中心', path: '/app/performance/dashboard' },
        { key: 'monitoring-quality', label: '发布质量', path: '/app/performance/quality' },
      ],
    },
    {
      key: 'risks',
      label: '风险告警',
      icon: <SafetyOutlined />,
      path: '/app/risks',
      badge: 3, // 示例告警数量
    },
    {
      key: 'management',
      label: '管理中心',
      icon: <SettingOutlined />,
      path: '/app/management',
      children: [
        { key: 'management-dashboard', label: '管理看板', path: '/app/management/dashboard' },
        { key: 'management-budget', label: '预算结算', path: '/app/management/budget' },
        { key: 'management-workload', label: '饱和度分析', path: '/app/management/workload' },
        { key: 'management-alerts', label: '告警系统', path: '/app/management/alerts' },
      ],
    },
  ];

  useEffect(() => {
    // 根据当前路径设置活跃菜单项
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (currentPath === item.path || currentPath.startsWith(item.path + '/')) {
        setActiveKey(item.key);
        break;
      }
      if (item.children) {
        for (const child of item.children) {
          if (currentPath === child.path || currentPath.startsWith(child.path + '/')) {
            setActiveKey(item.key);
            break;
          }
        }
      }
    }
  }, [location.pathname]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      // 如果有子菜单，跳转到第一个子菜单
      navigate(item.children[0].path);
    } else {
      navigate(item.path);
    }
    setMobileMenuVisible(false);
  };

  const handleSubMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuVisible(false);
  };

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
    },
    {
      key: 'workspace',
      label: '个人工作台',
      icon: <GlobalOutlined />,
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'workspace':
        navigate('/app/workspace');
        break;
      case 'settings':
        navigate('/app/settings');
        break;
      case 'logout':
        // 清理登录状态
        logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 跳转到 landing 页
        navigate('/landing');
        break;
      default:
        break;
    }
  };

  // 渲染主导航项
  const renderNavItem = (item: MenuItem) => {
    const isActive = activeKey === item.key;
    const hasSubmenu = item.children && item.children.length > 0;

    return (
      <div key={item.key} className="nav-item-wrapper">
        <div
          className={`nav-item ${isActive ? 'active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`}
          onClick={() => handleMenuClick(item)}
        >
          <div className="nav-item-content">
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <Badge count={item.badge} size="small" />}
          </div>
        </div>
        
        {/* 子菜单下拉 */}
        {hasSubmenu && isActive && (
          <div className="submenu-dropdown">
            <div className="submenu-content">
              {item.children?.map((child) => (
                <div
                  key={child.key}
                  className={`submenu-item ${location.pathname === child.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubMenuClick(child.path);
                  }}
                >
                  {child.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout className="cloud-layout">
      <Header className="cloud-header">
        <div className="header-content">
          {/* Logo 区域 */}
          <div className="header-logo" onClick={() => navigate('/app/dashboard')}>
            <ThunderboltOutlined className="logo-icon" />
            <span className="logo-text">项目</span>
          </div>

          {/* 桌面端导航 */}
          {!isMobile && (
            <div className="header-nav">
              {menuItems.map(renderNavItem)}
            </div>
          )}

          {/* 右侧操作区 */}
          <div className="header-actions">
            {!isMobile && (
              <>
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  className="action-btn"
                >
                  搜索
                </Button>
                <Badge count={5} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    className="action-btn"
                  />
                </Badge>
              </>
            )}
            
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              arrow
            >
              <div className="user-profile">
                <Avatar
                  size={32}
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                  className="user-avatar"
                />
                {!isMobile && <span className="user-name">{user?.name || '管理员'}</span>}
              </div>
            </Dropdown>

            {/* 移动端菜单按钮 */}
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
                className="mobile-menu-btn"
              />
            )}
          </div>
        </div>

        {/* 移动端子菜单 */}
        {!isMobile && activeKey && (
          <div className="submenu-bar">
            <div className="submenu-bar-content">
              {menuItems
                .find(item => item.key === activeKey)
                ?.children?.map((child) => (
                  <div
                    key={child.key}
                    className={`submenu-bar-item ${location.pathname === child.path ? 'active' : ''}`}
                    onClick={() => handleSubMenuClick(child.path)}
                  >
                    {child.label}
                  </div>
                ))}
            </div>
          </div>
        )}
      </Header>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="mobile-nav-drawer"
      >
        <div className="mobile-nav-content">
          {menuItems.map((item) => (
            <div key={item.key} className="mobile-nav-section">
              <div
                className={`mobile-nav-item ${activeKey === item.key ? 'active' : ''}`}
                onClick={() => handleMenuClick(item)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <Badge count={item.badge} size="small" />}
              </div>
              
              {item.children && (
                <div className="mobile-submenu">
                  {item.children.map((child) => (
                    <div
                      key={child.key}
                      className={`mobile-submenu-item ${location.pathname === child.path ? 'active' : ''}`}
                      onClick={() => handleSubMenuClick(child.path)}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Drawer>

      <Content className="cloud-content">
        <div className="content-wrapper">
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        </div>
      </Content>
    </Layout>
  );
};

export default CloudLayout;