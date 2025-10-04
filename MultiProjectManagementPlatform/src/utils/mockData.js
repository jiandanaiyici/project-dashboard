// 模拟用户数据
export const mockUsers = [
  { id: 1, name: '张三', username: 'zhangsan', department: '前端开发', position: '高级工程师', isActive: true, joinDate: '2023-01-15' },
  { id: 2, name: '李四', username: 'lisi', department: '前端开发', position: '工程师', isActive: true, joinDate: '2023-03-10' },
  { id: 3, name: '王五', username: 'wangwu', department: '后端开发', position: '高级工程师', isActive: true, joinDate: '2022-11-05' },
  { id: 4, name: '赵六', username: 'zhaoliu', department: '后端开发', position: '工程师', isActive: true, joinDate: '2023-02-20' },
  { id: 5, name: '钱七', username: 'qianqi', department: '测试', position: '测试工程师', isActive: true, joinDate: '2023-04-18' },
  { id: 6, name: '孙八', username: 'sunba', department: '产品', position: '产品经理', isActive: true, joinDate: '2022-09-30' },
  { id: 7, name: '周九', username: 'zhoujiu', department: '设计', position: 'UI设计师', isActive: true, joinDate: '2023-01-25' },
  { id: 8, name: '吴十', username: 'wushi', department: '运维', position: '运维工程师', isActive: true, joinDate: '2022-12-10' }
];

// 模拟项目数据
export const mockProjects = [
  { id: 1, name: '电商平台重构', description: '重构现有电商平台前端架构', managerId: 6, members: [1, 2, 7], startDate: '2023-06-01', endDate: '2023-09-30', budget: 150000, actualCost: 45000, progress: 65, status: '进行中', tasks: 45, completedTasks: 29, type: '前端开发' },
  { id: 2, name: '数据分析后台', description: '开发新的数据分析后台系统', managerId: 6, members: [3, 4, 5], startDate: '2023-05-15', endDate: '2023-08-15', budget: 120000, actualCost: 90000, progress: 85, status: '进行中', tasks: 32, completedTasks: 27, type: '后端开发' },
  { id: 3, name: '移动应用开发', description: '开发公司核心业务移动应用', managerId: 6, members: [1, 2, 3, 7], startDate: '2023-07-01', endDate: '2024-01-31', budget: 250000, actualCost: 65000, progress: 25, status: '进行中', tasks: 80, completedTasks: 20, type: '全栈开发' },
  { id: 4, name: '官网改版', description: '公司官网全新改版设计与开发', managerId: 6, members: [1, 7], startDate: '2023-04-01', endDate: '2023-06-15', budget: 50000, actualCost: 50000, progress: 100, status: '已完成', tasks: 20, completedTasks: 20, type: '前端开发' },
  { id: 5, name: 'CRM系统升级', description: '客户关系管理系统功能升级', managerId: 6, members: [3, 4, 5], startDate: '2023-03-01', endDate: '2023-05-30', budget: 80000, actualCost: 80000, progress: 100, status: '已完成', tasks: 35, completedTasks: 35, type: '后端开发' },
  { id: 6, name: 'DevOps自动化', description: '开发运维自动化平台搭建', managerId: 6, members: [4, 8], startDate: '2023-08-01', endDate: '2023-10-31', budget: 90000, actualCost: 15000, progress: 15, status: '进行中', tasks: 25, completedTasks: 4, type: '运维' }
];

// 模拟时间记录数据
export const mockTimeRecords = [
  // 张三的时间记录
  { id: 1, userId: 1, projectId: 1, date: '2023-07-01', hours: 8, description: '首页重构开发', taskType: '开发' },
  { id: 2, userId: 1, projectId: 1, date: '2023-07-02', hours: 7, description: '商品列表页开发', taskType: '开发' },
  { id: 3, userId: 1, projectId: 3, date: '2023-07-03', hours: 6, description: '移动应用登录模块开发', taskType: '开发' },
  { id: 4, userId: 1, projectId: 3, date: '2023-07-04', hours: 8, description: '用户中心页面开发', taskType: '开发' },
  { id: 5, userId: 1, projectId: 1, date: '2023-07-05', hours: 5, description: '购物车功能优化', taskType: '开发' },
  
  // 李四的时间记录
  { id: 6, userId: 2, projectId: 1, date: '2023-07-01', hours: 7, description: '订单管理页面开发', taskType: '开发' },
  { id: 7, userId: 2, projectId: 1, date: '2023-07-02', hours: 8, description: '支付流程集成', taskType: '开发' },
  { id: 8, userId: 2, projectId: 3, date: '2023-07-03', hours: 6, description: '移动端商品详情页开发', taskType: '开发' },
  { id: 9, userId: 2, projectId: 3, date: '2023-07-04', hours: 7, description: '移动应用搜索功能开发', taskType: '开发' },
  
  // 王五的时间记录
  { id: 10, userId: 3, projectId: 2, date: '2023-07-01', hours: 8, description: '数据API接口开发', taskType: '开发' },
  { id: 11, userId: 3, projectId: 2, date: '2023-07-02', hours: 9, description: '数据分析算法实现', taskType: '开发' },
  { id: 12, userId: 3, projectId: 3, date: '2023-07-03', hours: 8, description: '移动应用后端服务开发', taskType: '开发' },
  { id: 13, userId: 3, projectId: 3, date: '2023-07-04', hours: 7, description: '数据库设计优化', taskType: '开发' },
  
  // 赵六的时间记录
  { id: 14, userId: 4, projectId: 2, date: '2023-07-01', hours: 7, description: '后端服务集成测试', taskType: '测试' },
  { id: 15, userId: 4, projectId: 2, date: '2023-07-02', hours: 8, description: '性能优化', taskType: '优化' },
  { id: 16, userId: 4, projectId: 6, date: '2023-07-03', hours: 6, description: 'CI/CD流程搭建', taskType: '运维' },
  { id: 17, userId: 4, projectId: 6, date: '2023-07-04', hours: 8, description: '自动化测试脚本开发', taskType: '运维' },
  
  // 其他人员的时间记录
  { id: 18, userId: 5, projectId: 2, date: '2023-07-01', hours: 8, description: '功能测试', taskType: '测试' },
  { id: 19, userId: 5, projectId: 2, date: '2023-07-02', hours: 7, description: 'bug报告整理', taskType: '测试' },
  { id: 20, userId: 7, projectId: 1, date: '2023-07-01', hours: 6, description: 'UI设计稿优化', taskType: '设计' },
  { id: 21, userId: 7, projectId: 3, date: '2023-07-02', hours: 8, description: '移动端UI设计', taskType: '设计' },
  { id: 22, userId: 8, projectId: 6, date: '2023-07-01', hours: 8, description: '服务器配置', taskType: '运维' },
  { id: 23, userId: 8, projectId: 6, date: '2023-07-02', hours: 7, description: '监控系统搭建', taskType: '运维' }
];

// 计算用户饱和度数据
export const calculateUserAllocations = () => {
  // 计算每个用户的总工时
  const userHours = {};
  mockTimeRecords.forEach(record => {
    if (!userHours[record.userId]) {
      userHours[record.userId] = 0;
    }
    userHours[record.userId] += record.hours;
  });
  
  // 生成用户分配数据
  return mockUsers.map(user => {
    const totalHours = userHours[user.id] || 0;
    // 假设标准工作时间为每周40小时，这里简化计算
    const saturation = Math.min(100, Math.round((totalHours / 32) * 100));
    
    return {
      userId: user.id,
      userName: user.name,
      saturation,
      totalHours
    };
  });
};

// 生成仪表盘数据
export const generateDashboardData = () => {
  const userAllocations = calculateUserAllocations();
  const activeProjects = mockProjects.filter(project => project.status === '进行中').length;
  const completedProjects = mockProjects.filter(project => project.status === '已完成').length;
  
  // 计算总工时、可计费工时和不可计费工时（简化计算）
  const totalHours = mockTimeRecords.reduce((sum, record) => sum + record.hours, 0);
  const billableHours = Math.round(totalHours * 0.85); // 85%的工时为可计费
  const nonBillableHours = totalHours - billableHours;
  
  // 生成资源分配数据
  const resourceAllocation = mockProjects.map(project => ({
    projectId: project.id,
    projectName: project.name,
    hours: mockTimeRecords.filter(record => record.projectId === project.id).reduce((sum, record) => sum + record.hours, 0),
    members: project.members.length,
    progress: project.progress
  }));
  
  // 生成项目趋势数据（最近6个月）
  const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
  const projectTrend = {
    labels: months,
    completed: [0, 0, 1, 1, 1, 1],
    inProgress: [0, 1, 2, 3, 4, 4],
    planned: [2, 2, 1, 0, 0, 1]
  };
  
  return {
    totalProjects: mockProjects.length,
    activeProjects,
    completedProjects,
    totalMembers: mockUsers.length,
    userAllocations,
    projectTrend,
    resourceAllocation,
    totalHours,
    billableHours,
    nonBillableHours
  };
};

// 模拟应用健康度数据
export const generateHealthData = () => {
  // 应用列表
  const applications = [
    { id: 1, name: '电商平台', type: 'Web应用', category: '核心业务' },
    { id: 2, name: '数据分析后台', type: 'Web应用', category: '支撑系统' },
    { id: 3, name: '移动应用', type: '移动端应用', category: '核心业务' },
    { id: 4, name: '用户管理系统', type: 'Web应用', category: '支撑系统' },
    { id: 5, name: '订单处理系统', type: '微服务', category: '核心业务' },
    { id: 6, name: '支付网关', type: '微服务', category: '核心业务' },
    { id: 7, name: '数据分析API', type: '微服务', category: '支撑系统' },
    { id: 8, name: '监控告警平台', type: 'Web应用', category: '运维平台' }
  ];

  // 生成每个应用的健康数据
  const healthDetails = applications.map(app => {
    // 根据应用类别设置不同的健康基准值
    let baseAvailability = 99.0;
    let baseResponseTime = 500;
    let baseErrorRate = 0.5;
    
    if (app.category === '核心业务') {
      baseAvailability = 99.5;
      baseResponseTime = 300;
      baseErrorRate = 0.2;
    } else if (app.category === '运维平台') {
      baseAvailability = 98.5;
      baseResponseTime = 700;
      baseErrorRate = 0.8;
    }
    
    // 添加随机波动
    const availability = Math.min(100, Math.max(90, baseAvailability + (Math.random() * 2 - 0.5))).toFixed(2);
    const responseTime = Math.min(2000, Math.max(50, Math.round(baseResponseTime * (0.8 + Math.random() * 0.4))));
    const errorRate = Math.min(5, Math.max(0.01, (baseErrorRate * (0.5 + Math.random())).toFixed(3)));
    
    // 计算健康状态
    let status = 'normal';
    let healthScore = 100;
    
    // 可用性权重40%，响应时间权重30%，错误率权重30%
    healthScore -= (100 - parseFloat(availability)) * 4;
    healthScore -= Math.min(100, (responseTime - 100) / 10) * 0.3;
    healthScore -= parseFloat(errorRate) * 30;
    
    if (healthScore < 60) {
      status = 'error';
    } else if (healthScore < 80) {
      status = 'warning';
    }
    
    return {
      id: app.id,
      name: app.name,
      type: app.type,
      category: app.category,
      availability: parseFloat(availability),
      responseTime,
      errorRate: parseFloat(errorRate),
      status,
      healthScore: Math.max(0, Math.round(healthScore))
    };
  });

  // 计算整体健康数据
  const totalApps = healthDetails.length;
  const normalApps = healthDetails.filter(app => app.status === 'normal').length;
  const warningApps = healthDetails.filter(app => app.status === 'warning').length;
  const errorApps = healthDetails.filter(app => app.status === 'error').length;
  
  const avgAvailability = (healthDetails.reduce((sum, app) => sum + app.availability, 0) / totalApps).toFixed(2);
  const avgResponseTime = Math.round(healthDetails.reduce((sum, app) => sum + app.responseTime, 0) / totalApps);
  const avgErrorRate = (healthDetails.reduce((sum, app) => sum + app.errorRate, 0) / totalApps).toFixed(3);
  
  // 健康状态分布
  const statusDistribution = {
    normal: normalApps,
    warning: warningApps,
    error: errorApps
  };
  
  // 整体健康状态
  let overallHealth = 'normal';
  if (errorApps > totalApps * 0.2 || parseFloat(avgErrorRate) > 1.0) {
    overallHealth = 'error';
  } else if (warningApps > totalApps * 0.3 || parseFloat(avgAvailability) < 98.5) {
    overallHealth = 'warning';
  }
  
  return {
    overallHealth,
    avgAvailability: parseFloat(avgAvailability),
    avgResponseTime,
    avgErrorRate: parseFloat(avgErrorRate),
    totalApps,
    statusDistribution,
    healthDetails
  };
};

// 导出默认的模拟数据
export default {
  mockUsers,
  mockProjects,
  mockTimeRecords,
  calculateUserAllocations,
  generateDashboardData,
  generateHealthData
};