import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Button, Space } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const userMenu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">设置</Link>
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-white shadow-sm px-4 flex justify-between items-center">
      <div className="text-xl font-bold">开发者效能面板</div>
      <Space>
        <Link to="/metrics">
          <Button icon={<BarChartOutlined />}>指标体系</Button>
        </Link>
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Button type="text" icon={<Avatar icon={<UserOutlined />} />}>
            开发者
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader;
