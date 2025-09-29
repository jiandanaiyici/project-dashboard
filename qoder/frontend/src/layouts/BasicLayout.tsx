import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Link, Outlet, useAppData, useLocation } from 'umi';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useMobileDetection } from '../components/Mobile';

const iconMap = {
  dashboard: <DashboardOutlined />,
  team: <TeamOutlined />,
  project: <ProjectOutlined />,
  'bar-chart': <BarChartOutlined />,
  user: <UserOutlined />,
  setting: <SettingOutlined />,
};

export default function BasicLayout() {
  const location = useLocation();
  const { clientRoutes } = useAppData();
  const [collapsed, setCollapsed] = useState(false);
  
  // 移动端检测
  const { isMobile, isSmallMobile, isMobileOrTablet } = useMobileDetection();
  
  // 移动端默认折叠侧边栏
  const shouldCollapse = isMobileOrTablet || collapsed;

  return (
    <ProLayout
      title="项目管理平台"
      logo="https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg"
      location={{
        pathname: location.pathname,
      }}
      route={{
        path: '/',
        routes: clientRoutes,
      }}
      menuItemRender={(item, dom) => (
        <Link to={item.path || '/'}>{dom}</Link>
      )}
      // 移动端优化配置
      collapsed={shouldCollapse}
      onCollapse={setCollapsed}
      collapsedButtonRender={isMobile ? false : undefined}
      breakpoint={isMobile ? false : 'lg'}
      siderWidth={isMobile ? 200 : 256}
      // 移动端隐藏侧边栏
      menuRender={isMobile ? false : undefined}
      // 响应式布局
      fixSiderbar
      layout="mix"
      splitMenus={!isMobile}
      headerContentRender={() => {
        if (isMobile) {
          return (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%',
              padding: '0 12px'
            }}>
              <span style={{ 
                fontSize: isSmallMobile ? '16px' : '18px',
                fontWeight: 600,
                color: '#262626'
              }}>
                智能管理
              </span>
            </div>
          );
        }
        return null;
      }}
      menuDataRender={() => [
        {
          path: '/dashboard',
          name: '仪表盘',
          icon: iconMap.dashboard,
        },
        {
          path: '/users',
          name: '人员管理',
          icon: iconMap.team,
          children: [
            {
              path: '/users/list',
              name: '人员列表',
            },
            {
              path: '/users/organization',
              name: '组织架构',
            },
          ],
        },
        {
          path: '/projects',
          name: '项目管理',
          icon: iconMap.project,
          children: [
            {
              path: '/projects/list',
              name: '项目列表',
            },
            {
              path: '/projects/kanban',
              name: '任务看板',
            },
          ],
        },
        {
          path: '/reports',
          name: '数据报表',
          icon: iconMap['bar-chart'],
          children: [
            {
              path: '/reports/overview',
              name: '数据概览',
            },
            {
              path: '/reports/performance',
              name: '性能分析',
            },
            {
              path: '/reports/risks',
              name: '风险告警',
            },
          ],
        },
        {
          path: '/workspace',
          name: '个人工作台',
          icon: iconMap.user,
        },
        {
          path: '/settings',
          name: '系统设置',
          icon: iconMap.setting,
        },
      ]}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%2EQkReJ/yuhao.jpg',
        size: 'small',
        title: '管理员',
      }}
      actionsRender={() => []}
      headerTitleRender={() => <div>项目管理平台</div>}
    >
      <Outlet />
    </ProLayout>
  );
}