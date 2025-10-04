import React, { useState } from "react";
import { Avatar, Dropdown, Tabs } from "antd";
import { Outlet, useLocation } from "umi";
import "./index.less";

interface MenuItem {
  key: string;
  label: string;
  path: string;
}

const Layout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("ai-decision");

  // 通用一级菜单配置
  const menuItems: MenuItem[] = [
    {
      key: "dashboard",
      label: "数据大盘",
      path: "/dashboard",
    },
    {
      key: "project-management",
      label: "项目管理",
      path: "/project-management",
    },
    {
      key: "team-performance",
      label: "团队效能",
      path: "/team-performance",
    },
    {
      key: "release-management",
      label: "发布管控",
      path: "/release-management",
    },
    {
      key: "quality-control-platform",
      label: "质量管控【测试】",
      path: "/quality-control-platform",
    },
    {
      key: "ai-decision",
      label: "AI决策分析",
      path: "/ai-decision",
    },
  ];

  // 根据当前路由设置激活的标签
  React.useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find((item) =>
      currentPath.includes(item.path)
    );
    if (currentItem) {
      setActiveTab(currentItem.key);
    }
  }, [location.pathname, menuItems]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const item = menuItems.find((item) => item.key === key);
    if (item) {
      window.location.href = item.path;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg w-10 h-10 flex items-center justify-center">
                F
              </div>
              <div className="hidden md:block ml-4">
                <div className="text-sm font-medium text-gray-700">
                  FlowStack
                </div>
                <div className="text-xs text-gray-500">AI智能项目管理平台</div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">欢迎，管理员</div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "profile",
                        label: <a href="/personnel-efficiency">个人效能</a>,
                      },
                      {
                        key: "personal-dashboard",
                        label: <a href="/personal-dashboard">个人看板</a>,
                      },
                      {
                        key: "technical-efficiency-evaluation-center",
                        label: (
                          <a href="/technical-efficiency-evaluation-center">
                            技术效能评估中心
                          </a>
                        ),
                      },
                      {
                        key: "personal-development-plan",
                        label: (
                          <a href="/personal-development-plan">个人发展计划</a>
                        ),
                      },
                      {
                        key: "personal-efficacy-evaluation-of-technology-development",
                        label: (
                          <a href="/personal-efficacy-evaluation-of-technology-development">
                            个人技术开发效能评估
                          </a>
                        ),
                      },
                      {
                        key: "logout",
                        label: "退出登录",
                      },
                    ],
                  }}
                >
                  <Avatar src="https://picsum.photos/id/1005/200/200" />
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 通用一级菜单导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="py-3"
            tabBarStyle={{
              borderBottom: "none",
              paddingLeft: "0px",
            }}
            tabBarExtraContent={{}}
            items={menuItems.map((item) => ({
              key: item.key,
              label: <span className="py-1.5 px-3 text-sm">{item.label}</span>,
            }))}
          />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-800">
                FlowStack
              </span>
              <span className="ml-4 text-xs text-gray-500">
                © 2025 FlowStack Inc. 保留所有权利
              </span>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
                使用文档
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
                隐私政策
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
                联系我们
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
                关于我们
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
