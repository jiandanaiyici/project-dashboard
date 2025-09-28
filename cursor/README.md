# 聚合平台 - 项目管理和人员流动监控系统

## 项目简介

聚合平台是一个综合性的项目管理和人员流动监控系统，旨在提供全生命周期的项目管理、质量管控、性能监控和人员效能分析。该平台支持多项目、多应用、多产品的统一管理，并提供丰富的数据可视化和分析功能。

## 核心功能

### 🎯 项目管理
- 项目全生命周期管理
- 进度跟踪和风险预警
- 质量管控流程
- 发布规范管控

### 👥 人员管理
- 角色权限体系（产品经理、项目经理、交付经理）
- 人员流动监控
- 人员撤出评价系统
- 个人效能看板

### 📊 性能监控
- 应用性能指标监控
- 前端性能指标（LCP、FID、CLS等）
- 错误监控和代码定位（基于Source Map）
- 实时告警系统

### 📈 数据分析
- 多维度对比分析（应用、项目、产品）
- 趋势增长图
- 用户分布图
- 智能推送系统

### 🔍 代码定位
- 基于Source Map的错误定位
- 性能瓶颈分析
- 代码执行热力图
- 依赖关系分析

## 技术栈

### 前端技术
- **框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit + RTK Query
- **UI组件**: Ant Design
- **图表库**: @ant-design/charts + ECharts
- **构建工具**: Vite
- **代码质量**: ESLint + Prettier

### 后端技术
- **运行时**: Node.js + Express
- **数据库**: PostgreSQL + Redis
- **消息队列**: RabbitMQ
- **监控**: Prometheus + Grafana
- **日志**: ELK Stack

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── charts/         # 图表组件
│   ├── forms/          # 表单组件
│   ├── tables/         # 表格组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
│   ├── dashboard/      # 仪表盘
│   ├── projects/       # 项目管理
│   ├── personnel/      # 人员管理
│   ├── monitoring/     # 性能监控
│   └── analytics/      # 数据分析
├── hooks/              # 自定义Hooks
├── services/           # API服务
├── store/              # 状态管理
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
└── constants/          # 常量定义
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发环境启动
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## 核心特性

### 1. 实时性能监控
- 基于Web Vitals的性能指标收集
- 实时错误监控和上报
- 性能阈值告警
- 历史趋势分析

### 2. 代码定位系统
- 集成Source Map进行错误定位
- 将生产环境错误映射到源码位置
- 性能瓶颈代码定位
- 代码执行频率分析

### 3. 多维度数据分析
- 项目对比分析
- 应用性能对比
- 人员效能分析
- 业务指标趋势

### 4. 智能告警系统
- 性能指标异常告警
- 错误率阈值告警
- 项目风险预警
- 多渠道通知推送

### 5. 人员流动管理
- 人员档案管理
- 流动记录跟踪
- 评价系统
- 效能分析

## 配置说明

### 环境变量
创建 `.env.local` 文件：
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ID=your-app-id
VITE_SOURCE_MAP_ENABLED=true
```

### 代理配置
开发环境已配置API代理，将 `/api` 请求代理到后端服务。

## 部署说明

### 构建配置
- 自动生成Source Map用于错误定位
- 代码分割优化加载性能
- 静态资源CDN配置

### 安全配置
- Content Security Policy (CSP)
- XSS保护
- 点击劫持防护
- MIME类型嗅探防护

## 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件采用函数式组件 + Hooks

### 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 性能优化

### 前端优化
- 代码分割和懒加载
- 图片优化和懒加载
- 缓存策略优化
- 包体积优化

### 监控优化
- 性能指标实时收集
- 错误监控和上报
- 用户体验指标跟踪
- 业务指标监控

## 浏览器支持

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

- 项目维护者: 聚合平台团队
- 邮箱: platform@example.com
- 项目地址: https://github.com/example/project-management-platform

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础项目管理功能
- 人员管理模块
- 性能监控系统
- 数据分析看板
- Source Map集成
