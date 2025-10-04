// 模拟数据 - 扩展以支持所有页面组件
export const mockData = {
  // 模拟用户数据
  users: [
    {
      id: 1,
      name: '张三',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      department: '产品部',
      position: '产品经理',
      joinDate: '2022-01-15',
      isActive: true,
      phone: '13800138001'
    },
    {
      id: 2,
      name: '李四',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      department: '开发部',
      position: '前端开发工程师',
      joinDate: '2022-03-22',
      isActive: true,
      phone: '13900139002'
    },
    {
      id: 3,
      name: '王五',
      email: 'wangwu@example.com',
      password: 'wangwu123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      department: '开发部',
      position: '后端开发工程师',
      joinDate: '2022-02-10',
      isActive: true,
      phone: '13700137003'
    },
    {
      id: 4,
      name: '赵六',
      email: 'zhaoliu@example.com',
      password: 'zhaoliu123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
      department: '设计部',
      position: 'UI设计师',
      joinDate: '2022-04-05',
      isActive: true,
      phone: '13600136004'
    }
  ],
  
  // 模拟项目数据
  projects: [
    {
      id: 1,
      name: '企业官网重构',
      description: '对企业官网进行全面重构，提升用户体验和视觉效果',
      status: '进行中',
      startDate: '2023-06-01',
      endDate: '2023-08-15',
      progress: 75,
      managerId: 1,
      members: [1, 2, 3, 4],
      budget: 150000,
      actualCost: 95000,
      category: '前端开发',
      priority: '高',
      tags: ['网站', 'React', '重构'],
      tasks: 45,
      completedTasks: 34
    },
    {
      id: 2,
      name: '移动端App开发',
      description: '开发企业内部管理App，支持iOS和Android平台',
      status: '进行中',
      startDate: '2023-05-10',
      endDate: '2023-10-30',
      progress: 45,
      managerId: 2,
      members: [2, 3],
      budget: 250000,
      actualCost: 110000,
      category: '移动端开发',
      priority: '高',
      tags: ['App', 'React Native', '移动'],
      tasks: 68,
      completedTasks: 31
    },
    {
      id: 3,
      name: '数据分析系统',
      description: '开发数据可视化分析系统，支持实时数据监控',
      status: '已完成',
      startDate: '2023-01-05',
      endDate: '2023-04-20',
      progress: 100,
      managerId: 1,
      members: [3, 4],
      budget: 180000,
      actualCost: 175000,
      category: '数据开发',
      priority: '中',
      tags: ['数据可视化', '图表', '分析'],
      tasks: 56,
      completedTasks: 56
    },
    {
      id: 4,
      name: '客户关系管理系统',
      description: '开发客户关系管理系统，提升客户服务质量',
      status: '规划中',
      startDate: '2023-09-01',
      endDate: '2024-01-15',
      progress: 0,
      managerId: 1,
      members: [1, 2, 4],
      budget: 350000,
      actualCost: 0,
      category: '后端开发',
      priority: '高',
      tags: ['CRM', '后端', '管理'],
      tasks: 78,
      completedTasks: 0
    }
  ],
  
  // 模拟时间记录数据
  timeRecords: [
    { id: 1, userId: 2, projectId: 1, date: '2023-08-01', hours: 8, description: '首页组件开发和优化', type: '开发' },
    { id: 2, userId: 2, projectId: 1, date: '2023-08-02', hours: 7.5, description: '登录页面实现', type: '开发' },
    { id: 3, userId: 2, projectId: 2, date: '2023-08-03', hours: 6, description: 'App首页原型设计', type: '设计' },
    { id: 4, userId: 3, projectId: 1, date: '2023-08-01', hours: 8, description: '后端接口开发', type: '开发' },
    { id: 5, userId: 3, projectId: 2, date: '2023-08-02', hours: 8, description: 'App后端服务搭建', type: '开发' },
    { id: 6, userId: 4, projectId: 1, date: '2023-08-01', hours: 5, description: 'UI设计和切图', type: '设计' },
    { id: 7, userId: 1, projectId: 1, date: '2023-08-01', hours: 3, description: '需求分析和文档编写', type: '管理' },
    { id: 8, userId: 2, projectId: 1, date: '2023-08-04', hours: 8, description: '产品详情页开发', type: '开发' },
    { id: 9, userId: 3, projectId: 2, date: '2023-08-03', hours: 7, description: 'API接口测试', type: '开发' },
    { id: 10, userId: 4, projectId: 1, date: '2023-08-02', hours: 6, description: '交互设计优化', type: '设计' }
  ],
  
  // 模拟应用数据
  applications: [
    {
      id: 1,
      name: '项目管理系统',
      description: '用于管理公司所有项目的进度和资源分配',
      status: '启用',
      createdAt: '2023-01-15',
      updatedAt: '2023-07-20',
      url: '/projects',
      icon: 'project',
      category: '核心应用',
      permissions: ['admin', 'user']
    },
    {
      id: 2,
      name: '团队协作工具',
      description: '团队成员沟通和协作的平台',
      status: '启用',
      createdAt: '2023-02-10',
      updatedAt: '2023-06-15',
      url: '/team',
      icon: 'team',
      category: '协作工具',
      permissions: ['admin', 'user']
    },
    {
      id: 3,
      name: '时间跟踪工具',
      description: '记录和分析团队成员的工作时间',
      status: '启用',
      createdAt: '2023-03-05',
      updatedAt: '2023-08-01',
      url: '/time-tracking',
      icon: 'clock-circle',
      category: '效率工具',
      permissions: ['admin', 'user']
    },
    {
      id: 4,
      name: '数据分析平台',
      description: '提供各类业务数据的可视化分析',
      status: '启用',
      createdAt: '2023-04-20',
      updatedAt: '2023-07-10',
      url: '/overview',
      icon: 'area-chart',
      category: '数据分析',
      permissions: ['admin']
    },
    {
      id: 5,
      name: '资源分配系统',
      description: '管理和优化项目资源分配',
      status: '启用',
      createdAt: '2023-05-15',
      updatedAt: '2023-05-15',
      url: '/resource-allocation',
      icon: 'user-switch',
      category: '管理工具',
      permissions: ['admin']
    }
  ],
  
  // 模拟应用埋点数据 - 过去30天完整数据
  appAnalytics: function() {
    const data = [];
    const apps = [
      { id: 1, name: '项目管理系统' },
      { id: 2, name: '团队协作工具' },
      { id: 3, name: '时间跟踪工具' },
      { id: 4, name: '数据分析平台' },
      { id: 5, name: '资源分配系统' }
    ];
    
    // 生成过去30天的数据
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      apps.forEach(app => {
        // 为不同应用设置不同的基准值和增长趋势
        let basePV, baseUV, baseDuration, baseBounceRate, baseDau, baseNewUsers, baseConversionRate;
        
        switch(app.id) {
          case 1:
            basePV = 2000 + Math.random() * 1000;
            baseUV = 400 + Math.random() * 200;
            baseDuration = 300 + Math.random() * 100;
            baseBounceRate = 20 + Math.random() * 10;
            baseDau = 350 + Math.random() * 150;
            baseNewUsers = 50 + Math.random() * 30;
            baseConversionRate = 5 + Math.random() * 3;
            break;
          case 2:
            basePV = 1500 + Math.random() * 800;
            baseUV = 300 + Math.random() * 150;
            baseDuration = 280 + Math.random() * 90;
            baseBounceRate = 25 + Math.random() * 10;
            baseDau = 280 + Math.random() * 120;
            baseNewUsers = 40 + Math.random() * 25;
            baseConversionRate = 4 + Math.random() * 2;
            break;
          case 3:
            basePV = 1000 + Math.random() * 600;
            baseUV = 200 + Math.random() * 100;
            baseDuration = 260 + Math.random() * 80;
            baseBounceRate = 30 + Math.random() * 10;
            baseDau = 180 + Math.random() * 80;
            baseNewUsers = 30 + Math.random() * 20;
            baseConversionRate = 3 + Math.random() * 1.5;
            break;
          case 4:
            basePV = 800 + Math.random() * 500;
            baseUV = 150 + Math.random() * 80;
            baseDuration = 250 + Math.random() * 70;
            baseBounceRate = 35 + Math.random() * 10;
            baseDau = 130 + Math.random() * 60;
            baseNewUsers = 20 + Math.random() * 15;
            baseConversionRate = 2.5 + Math.random() * 1.2;
            break;
          case 5:
            basePV = 500 + Math.random() * 400;
            baseUV = 100 + Math.random() * 60;
            baseDuration = 230 + Math.random() * 60;
            baseBounceRate = 40 + Math.random() * 10;
            baseDau = 90 + Math.random() * 40;
            baseNewUsers = 15 + Math.random() * 10;
            baseConversionRate = 2 + Math.random() * 1;
            break;
        }
        
        // 工作日和周末的差异
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const weekendFactor = isWeekend ? 0.6 : 1;
        
        // 添加完整的关键指标
        data.push({
          appId: app.id,
          appName: app.name,
          date: dateStr,
          pv: Math.round(basePV * weekendFactor),
          uv: Math.round(baseUV * weekendFactor),
          duration: Math.round(baseDuration),
          bounceRate: parseFloat(baseBounceRate.toFixed(1)),
          dau: Math.round(baseDau * weekendFactor),
          wau: Math.round(baseDau * 4 * weekendFactor), // 估算值
          mau: Math.round(baseDau * 22 * weekendFactor), // 估算值
          newUsers: Math.round(baseNewUsers * weekendFactor),
          conversionRate: parseFloat(baseConversionRate.toFixed(2)),
          pageDepth: parseFloat((2 + Math.random() * 2).toFixed(1)),
          errorRate: parseFloat((0.1 + Math.random() * 0.5).toFixed(3))
        });
      });
    }
    
    return data;
  }(),
  
  // 模拟页面埋点数据 - 过去15天的页面访问数据
  pageAnalytics: function() {
    const data = [];
    const pagesByApp = {
      1: [ // 项目管理系统
        { id: 'projects-dashboard', name: '项目看板' },
        { id: 'projects-list', name: '项目列表' },
        { id: 'project-detail', name: '项目详情' },
        { id: 'project-create', name: '创建项目' },
        { id: 'project-settings', name: '项目设置' }
      ],
      2: [ // 团队协作工具
        { id: 'team-dashboard', name: '团队概览' },
        { id: 'team-members', name: '成员列表' },
        { id: 'team-chat', name: '团队聊天' },
        { id: 'team-tasks', name: '团队任务' },
        { id: 'team-calendar', name: '团队日历' }
      ],
      3: [ // 时间跟踪工具
        { id: 'time-dashboard', name: '时间概览' },
        { id: 'time-records', name: '时间记录' },
        { id: 'time-report', name: '时间报表' },
        { id: 'time-templates', name: '时间模板' },
        { id: 'time-settings', name: '时间设置' }
      ],
      4: [ // 数据分析平台
        { id: 'data-dashboard', name: '数据总览' },
        { id: 'data-reports', name: '数据报表' },
        { id: 'data-visualization', name: '数据可视化' },
        { id: 'data-sources', name: '数据源管理' },
        { id: 'data-alerts', name: '数据告警' }
      ],
      5: [ // 资源分配系统
        { id: 'resource-overview', name: '资源概览' },
        { id: 'resource-allocation', name: '资源分配' },
        { id: 'resource-report', name: '资源报表' },
        { id: 'resource-forecast', name: '资源预测' },
        { id: 'resource-settings', name: '资源设置' }
      ]
    };
    
    const appNames = {
      1: '项目管理系统',
      2: '团队协作工具',
      3: '时间跟踪工具',
      4: '数据分析平台',
      5: '资源分配系统'
    };
    
    // 生成过去15天的数据
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // 为每个应用生成页面数据
      Object.keys(pagesByApp).forEach(appId => {
        const pages = pagesByApp[appId];
        const appIdNum = parseInt(appId);
        
        pages.forEach((page, pageIndex) => {
          // 为不同页面设置不同的基准值
          const baseMultiplier = 1 - (pageIndex * 0.15); // 页面按照重要性递减
          
          // 为不同应用设置不同的基准值
          let basePV, baseUV, baseDuration, baseBounceRate, baseEntryRate, baseExitRate;
          
          switch(appIdNum) {
            case 1:
              basePV = 800 + Math.random() * 400;
              baseUV = 200 + Math.random() * 100;
              baseDuration = 300 + Math.random() * 200;
              baseBounceRate = 20 + Math.random() * 10;
              baseEntryRate = 40 + Math.random() * 20;
              baseExitRate = 10 + Math.random() * 15;
              break;
            case 2:
              basePV = 700 + Math.random() * 350;
              baseUV = 180 + Math.random() * 90;
              baseDuration = 350 + Math.random() * 250;
              baseBounceRate = 22 + Math.random() * 12;
              baseEntryRate = 38 + Math.random() * 18;
              baseExitRate = 12 + Math.random() * 16;
              break;
            case 3:
              basePV = 500 + Math.random() * 250;
              baseUV = 140 + Math.random() * 70;
              baseDuration = 280 + Math.random() * 180;
              baseBounceRate = 28 + Math.random() * 14;
              baseEntryRate = 42 + Math.random() * 15;
              baseExitRate = 15 + Math.random() * 14;
              break;
            case 4:
              basePV = 400 + Math.random() * 200;
              baseUV = 120 + Math.random() * 60;
              baseDuration = 400 + Math.random() * 300;
              baseBounceRate = 32 + Math.random() * 15;
              baseEntryRate = 45 + Math.random() * 12;
              baseExitRate = 18 + Math.random() * 16;
              break;
            case 5:
              basePV = 300 + Math.random() * 150;
              baseUV = 90 + Math.random() * 45;
              baseDuration = 320 + Math.random() * 200;
              baseBounceRate = 38 + Math.random() * 16;
              baseEntryRate = 48 + Math.random() * 10;
              baseExitRate = 20 + Math.random() * 15;
              break;
          }
          
          // 工作日和周末的差异
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const weekendFactor = isWeekend ? 0.5 : 1;
          
          // 首页有更高的访问量和入口率
          const isHomePage = pageIndex === 0;
          const homePageFactor = isHomePage ? 1.8 : 1;
          const entryRateFactor = isHomePage ? 1.5 : 1;
          
          data.push({
            pageId: page.id,
            pageName: page.name,
            appId: appIdNum,
            appName: appNames[appIdNum],
            date: dateStr,
            pv: Math.round(basePV * baseMultiplier * homePageFactor * weekendFactor),
            uv: Math.round(baseUV * baseMultiplier * homePageFactor * weekendFactor),
            duration: Math.round(baseDuration * baseMultiplier),
            bounceRate: parseFloat(baseBounceRate.toFixed(1)),
            entryRate: parseFloat((baseEntryRate * entryRateFactor).toFixed(1)),
            exitRate: parseFloat(baseExitRate.toFixed(1)),
            conversionRate: parseFloat((1 + Math.random() * 5).toFixed(2)),
            errorRate: parseFloat((0.05 + Math.random() * 0.3).toFixed(3))
          });
        });
      });
    }
    
    return data;
  }(),
  
  // 模拟流量来源数据
  trafficSources: function() {
    const sources = [
      { name: '直接访问', value: 35 + Math.random() * 10 },
      { name: '搜索引擎', value: 25 + Math.random() * 10 },
      { name: '社交媒体', value: 15 + Math.random() * 8 },
      { name: '外部链接', value: 12 + Math.random() * 7 },
      { name: '邮件营销', value: 8 + Math.random() * 5 },
      { name: '其他', value: 5 + Math.random() * 3 }
    ];
    
    // 确保总和为100
    const total = sources.reduce((sum, source) => sum + source.value, 0);
    return sources.map(source => ({
      ...source,
      value: parseFloat((source.value / total * 100).toFixed(1))
    }));
  }(),
  
  // 模拟设备分布数据
  deviceDistribution: function() {
    const devices = [
      { name: '桌面端', value: 45 + Math.random() * 10 },
      { name: '移动端', value: 40 + Math.random() * 10 },
      { name: '平板设备', value: 10 + Math.random() * 5 },
      { name: '其他', value: 5 + Math.random() * 3 }
    ];
    
    // 确保总和为100
    const total = devices.reduce((sum, device) => sum + device.value, 0);
    return devices.map(device => ({
      ...device,
      value: parseFloat((device.value / total * 100).toFixed(1))
    }));
  }(),
  
  // 模拟地域分布数据 (TOP 8)
  geographicDistribution: function() {
    const regions = [
      { name: '北京', pv: 8500 + Math.floor(Math.random() * 2000), uv: 3200 + Math.floor(Math.random() * 800) },
      { name: '上海', pv: 7800 + Math.floor(Math.random() * 1800), uv: 2900 + Math.floor(Math.random() * 700) },
      { name: '广州', pv: 6200 + Math.floor(Math.random() * 1500), uv: 2300 + Math.floor(Math.random() * 600) },
      { name: '深圳', pv: 5800 + Math.floor(Math.random() * 1400), uv: 2100 + Math.floor(Math.random() * 500) },
      { name: '杭州', pv: 4500 + Math.floor(Math.random() * 1200), uv: 1700 + Math.floor(Math.random() * 400) },
      { name: '成都', pv: 3900 + Math.floor(Math.random() * 1100), uv: 1500 + Math.floor(Math.random() * 350) },
      { name: '南京', pv: 3200 + Math.floor(Math.random() * 1000), uv: 1200 + Math.floor(Math.random() * 300) },
      { name: '武汉', pv: 2800 + Math.floor(Math.random() * 900), uv: 1100 + Math.floor(Math.random() * 250) }
    ];
    
    // 按PV降序排序
    return regions.sort((a, b) => b.pv - a.pv);
  }(),
  
  // 模拟用户留存数据 (7日留存)
  retentionData: function() {
    const retention = [
      { day: '第1天', rate: 100 },
      { day: '第2天', rate: 65 + Math.random() * 10 },
      { day: '第3天', rate: 45 + Math.random() * 10 },
      { day: '第4天', rate: 35 + Math.random() * 8 },
      { day: '第5天', rate: 28 + Math.random() * 7 },
      { day: '第6天', rate: 22 + Math.random() * 6 },
      { day: '第7天', rate: 18 + Math.random() * 5 }
    ];
    
    return retention.map(item => ({
      ...item,
      rate: parseFloat(item.rate.toFixed(1))
    }));
  }(),
};

export default mockData;