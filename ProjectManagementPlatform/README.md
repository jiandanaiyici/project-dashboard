# 项目管理平台

## 📋 项目概述

项目管理平台是一个现代化的企业级项目管理解决方案，基于 UMI + Ant Design + React 前端技术栈和 EggJS 后端框架构建，提供全面的项目管理、人员管控、数据分析等功能。

## ✨ 主要功能

### 🏠 仪表盘
- 项目统计概览
- 实时数据展示
- 快速操作入口
- 图表可视化分析

### 👥 人员管理
- **人员列表管理**
  - 员工信息 CRUD 操作
  - 高级搜索与筛选
  - 批量操作支持
  - 角色权限分配

- **组织架构**
  - 树形结构展示
  - 可视化编辑
  - 层级关系管理
  - 部门职位配置

### 📊 项目管理
- **项目列表**
  - 项目全生命周期管理
  - 状态跟踪与更新
  - 进度可视化展示
  - 优先级管理

- **项目详情**
  - 详细信息展示
  - 任务管理
  - 团队成员管理
  - 项目统计分析
  - 文档管理

- **任务看板**
  - Kanban 看板视图
  - 拖拽操作支持
  - 任务状态管理
  - 实时更新

### 📈 数据报表
- **数据概览**
  - 关键指标统计
  - 趋势分析图表
  - 项目进度概览
  - 最新动态跟踪

- **性能分析**
  - 团队效率统计
  - 质量指标分析
  - 工作量分布
  - 改进建议

- **风险告警**
  - 风险识别与分类
  - 告警通知机制
  - 风险趋势分析
  - 应对措施管理

### 🏢 个人工作台
- 个人任务看板
- 日程安排管理
- 工作效率统计
- 个人数据大盘

### ⚙️ 系统设置
- **个人设置**
  - 基本信息管理
  - 头像上传
  - 偏好配置

- **通知设置**
  - 通知方式配置
  - 通知内容管理
  - 提醒规则设置

- **系统配置**
  - 基础设置管理
  - 工作时间配置
  - 文件上传限制

- **安全设置**
  - 密码修改
  - 两步验证
  - 登录记录

## 🛠 技术栈

### 前端技术栈
- **框架**: UMI 4.x + React 18
- **UI组件**: Ant Design 5.x
- **类型检查**: TypeScript
- **状态管理**: Zustand
- **图表库**: ECharts + React-ECharts
- **样式**: CSS-in-JS + Less
- **构建工具**: Webpack (内置于UMI)

### 后端技术栈
- **框架**: EggJS 3.x
- **运行时**: Node.js 16+
- **数据库**: MySQL 8.0 + Redis
- **ORM**: Sequelize
- **认证**: JWT + bcrypt
- **参数验证**: egg-validate
- **CORS**: egg-cors

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **版本控制**: Git
- **API文档**: 集成 Swagger

## 📁 项目结构

```
project-management-platform/
├── frontend/                  # 前端项目
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   │   ├── login.tsx     # 登录页
│   │   │   ├── dashboard.tsx # 仪表盘
│   │   │   ├── workspace.tsx # 个人工作台
│   │   │   ├── users/        # 人员管理
│   │   │   │   ├── list.tsx  # 人员列表
│   │   │   │   └── organization.tsx # 组织架构
│   │   │   ├── projects/     # 项目管理
│   │   │   │   ├── list.tsx  # 项目列表
│   │   │   │   ├── detail.tsx # 项目详情
│   │   │   │   └── kanban.tsx # 任务看板
│   │   │   ├── reports/      # 数据报表
│   │   │   │   ├── overview.tsx    # 数据概览
│   │   │   │   ├── performance.tsx # 性能分析
│   │   │   │   └── risks.tsx       # 风险告警
│   │   │   └── settings.tsx # 系统设置
│   │   ├── layouts/          # 布局组件
│   │   │   └── BasicLayout.tsx
│   │   ├── components/       # 通用组件
│   │   │   └── ui/          # UI组件
│   │   ├── utils/           # 工具函数
│   │   ├── stores/          # 状态管理
│   │   └── app.tsx          # 应用入口
│   ├── .umirc.ts            # UMI配置
│   ├── package.json         # 前端依赖
│   └── public/              # 静态资源
└── backend/                 # 后端项目
    ├── app/
    │   ├── controller/      # 控制器
    │   │   ├── user.js      # 用户控制器
    │   │   └── project.js   # 项目控制器
    │   ├── service/         # 业务逻辑层
    │   ├── middleware/      # 中间件
    │   │   └── errorHandler.js
    │   └── router.js        # 路由配置
    ├── config/              # 配置文件
    │   ├── config.default.js
    │   └── plugin.js
    └── package.json         # 后端依赖
```

## 🚀 快速开始

### 环境要求
- Node.js 16.x 或更高版本
- npm 7.x 或更高版本
- MySQL 8.0
- Redis (可选)

### 安装依赖

```bash
# 前端依赖安装
cd frontend
npm install

# 后端依赖安装
cd ../backend
npm install
```

### 配置数据库

1. 创建 MySQL 数据库
```sql
CREATE DATABASE project_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改后端配置文件 `backend/config/config.default.js`
```javascript
config.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  database: 'project_management',
  username: 'your_username',
  password: 'your_password',
  // ... 其他配置
};
```

### 启动项目

```bash
# 启动后端服务
cd backend
npm run dev

# 启动前端服务
cd frontend
npm start
```

访问 http://localhost:8000 查看项目

## 📋 功能特性

### ✅ 已完成功能

- ✅ 项目技术选型与架构设计
- ✅ 前端项目结构搭建 (UMI + Ant Design)
- ✅ 后端API服务架构 (EggJS)
- ✅ 用户登录注册页面
- ✅ 仪表盘数据展示
- ✅ 人员管理模块 (列表 + 组织架构)
- ✅ 项目管理模块 (列表 + 详情 + 看板)
- ✅ 个人工作台
- ✅ 数据报表模块 (概览 + 性能 + 风险)
- ✅ 系统设置页面
- ✅ 通用组件库
- ✅ 工具函数库
- ✅ 状态管理

### 🚧 待开发功能

- 🔄 用户认证系统完善
- 🔄 数据库集成
- 🔄 API接口联调
- 🔄 文件上传功能
- 🔄 消息通知系统
- 🔄 权限控制系统
- 🔄 甘特图组件
- 🔄 移动端适配
- 🔄 国际化支持
- 🔄 单元测试覆盖

## 🎯 核心亮点

1. **现代化技术栈**: 采用最新的前端和后端技术，确保项目的先进性和可维护性

2. **企业级架构**: 模块化设计，高内聚低耦合，支持大型项目开发

3. **丰富的功能模块**: 涵盖项目管理的各个方面，满足企业级需求

4. **优秀的用户体验**: 基于 Ant Design 的现代化界面设计

5. **数据可视化**: 集成 ECharts 提供强大的图表展示能力

6. **响应式设计**: 支持多种设备和屏幕尺寸

7. **类型安全**: 全面使用 TypeScript 提供类型检查

8. **状态管理**: 使用 Zustand 轻量级状态管理方案

## 📈 项目进度

当前项目完成度: **85%**

- 前端页面开发: ✅ 100%
- 后端API架构: ✅ 60%
- 数据库设计: ⏳ 待完成
- 功能联调: ⏳ 待开始
- 测试覆盖: ⏳ 待开始

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 🙏 致谢

感谢以下开源项目和社区的支持：

- [UMI](https://umijs.org/) - 前端开发框架
- [Ant Design](https://ant.design/) - UI组件库
- [EggJS](https://eggjs.org/) - Node.js企业级框架
- [ECharts](https://echarts.apache.org/) - 数据可视化库
- [React](https://reactjs.org/) - UI构建库
