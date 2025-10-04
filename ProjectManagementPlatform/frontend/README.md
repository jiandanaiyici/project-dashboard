# 项目管理平台 - 前端开发指南

## 📋 项目概述

这是一个基于 **UMI 4 + React 18 + Ant Design 5** 技术栈的现代化项目管理平台前端应用。

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
# 启动开发服务器
npm run dev
# 或
yarn dev

# 服务器将在 http://localhost:8000 启动
```

### 构建生产版本
```bash
# 构建生产版本
npm run build
# 或
yarn build
```

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/          # 通用组件
│   │   ├── ui/             # UI组件
│   │   │   ├── StatCard.tsx
│   │   │   ├── ChartCard.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── DataTable.tsx
│   │   ├── AuthGuard.tsx   # 路由守卫
│   │   ├── ErrorBoundary.tsx # 错误边界
│   │   └── index.ts        # 组件导出
│   ├── pages/              # 页面组件
│   │   ├── login.tsx       # 登录页
│   │   ├── register.tsx    # 注册页
│   │   ├── dashboard.tsx   # 仪表盘
│   │   ├── workspace.tsx   # 个人工作台
│   │   ├── settings.tsx    # 系统设置
│   │   ├── users/          # 人员管理
│   │   ├── projects/       # 项目管理
│   │   └── reports/        # 数据报表
│   ├── layouts/            # 布局组件
│   │   └── BasicLayout.tsx
│   ├── services/           # API服务
│   │   └── api.ts
│   ├── hooks/              # 自定义Hooks
│   │   └── index.ts
│   ├── stores/             # 状态管理
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── index.ts
│   │   └── constants.ts
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── styles/             # 全局样式
│   │   └── global.css
│   └── app.tsx             # 应用配置
├── .umirc.ts               # UMI配置
├── package.json
└── README.md
```

## 🔧 技术栈

### 核心技术
- **UMI 4**: 企业级React应用框架
- **React 18**: 用户界面构建库
- **TypeScript**: 静态类型检查
- **Ant Design 5**: 企业级UI设计语言

### 状态管理
- **Zustand**: 轻量级状态管理

### 工具库
- **ECharts**: 数据可视化图表库
- **dayjs**: 日期处理库
- **axios**: HTTP客户端
- **lodash-es**: 工具函数库

### 开发工具
- **Prettier**: 代码格式化
- **Husky**: Git hooks

## 📚 功能模块

### 1. 用户认证
- ✅ 登录页面 (`/login`)
- ✅ 注册页面 (`/register`)
- ✅ 路由守卫
- ⏳ 密码找回

### 2. 仪表盘
- ✅ 数据统计卡片
- ✅ 图表展示
- ✅ 快速操作面板

### 3. 人员管理
- ✅ 人员列表 (`/users/list`)
- ✅ 组织架构 (`/users/organization`)
- ✅ 人员信息管理

### 4. 项目管理
- ✅ 项目列表 (`/projects/list`)
- ✅ 项目详情 (`/projects/detail/:id`)
- ✅ 任务看板 (`/projects/kanban`)
- ✅ 拖拽功能

### 5. 数据报表
- ✅ 数据概览 (`/reports/overview`)
- ✅ 性能分析 (`/reports/performance`)
- ✅ 风险告警 (`/reports/risks`)

### 6. 个人工作台
- ✅ 个人任务看板
- ✅ 日程安排
- ✅ 数据统计

### 7. 系统设置
- ✅ 系统配置
- ✅ 个人设置
- ✅ 通知设置

## 🎨 UI组件库

### 通用组件
- **StatCard**: 统计卡片组件
- **ChartCard**: 图表容器组件
- **PageHeader**: 页面头部组件
- **Loading**: 加载状态组件
- **EmptyState**: 空状态组件
- **DataTable**: 数据表格组件

### 业务组件
- **AuthGuard**: 路由守卫组件
- **ErrorBoundary**: 错误边界组件

## 🔗 API接口

API服务层已配置完成，包含以下模块：
- `userAPI`: 用户相关接口
- `projectAPI`: 项目相关接口
- `taskAPI`: 任务相关接口
- `reportAPI`: 报表相关接口
- `organizationAPI`: 组织相关接口
- `settingsAPI`: 设置相关接口

## 📱 响应式设计

项目采用响应式设计，支持：
- 桌面端 (>= 1200px)
- 平板端 (768px - 1199px)
- 移动端 (< 768px)

## 🔧 开发工具

### 自定义Hooks
- `useDebounce`: 防抖Hook
- `useThrottle`: 节流Hook
- `useAsync`: 异步数据获取Hook
- `useTable`: 表格数据管理Hook
- `useLocalStorage`: 本地存储Hook
- `useWindowSize`: 窗口大小Hook

### 工具函数
- `formatCurrency`: 货币格式化
- `formatDate`: 日期格式化
- `debounce`: 防抖函数
- `throttle`: 节流函数
- `downloadFile`: 文件下载

## 🎯 开发规范

### 目录命名
- 组件目录使用 PascalCase
- 文件名使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### 组件开发
- 使用 TypeScript 编写
- 函数组件 + Hooks
- Props 接口定义
- 默认导出组件

### 样式规范
- 使用 CSS-in-JS 或 Less
- 遵循 BEM 命名规范
- 响应式设计优先

## 🚀 部署

### 构建命令
```bash
npm run build
```

### 部署目录
构建产物将生成在 `dist/` 目录

### 环境变量
- `NODE_ENV`: 环境标识
- `API_BASE_URL`: API基础地址

## 📞 技术支持

如有问题，请联系开发团队或查看相关文档。

---

**项目管理平台前端** - 现代化、高效的企业级应用
