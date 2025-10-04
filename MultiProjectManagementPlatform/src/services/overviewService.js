import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 概览服务
export const overviewService = {
  // 获取仪表盘数据
  getDashboardData: async () => {
    await delay(700);
    // 计算概览数据
    const totalProjects = mockData.projects.length;
    const activeProjects = mockData.projects.filter(p => p.status === '进行中').length;
    const completedProjects = mockData.projects.filter(p => p.status === '已完成').length;
    const totalMembers = mockData.users.length;
    
    // 计算人员饱和度
    const userAllocations = mockData.users.map(user => {
      const userRecords = mockData.timeRecords.filter(r => r.userId === user.id);
      const totalHours = userRecords.reduce((sum, record) => sum + record.hours, 0);
      // 假设每周标准工作时间为40小时
      const saturation = Math.min((totalHours / 40) * 100, 100);
      return {
        userId: user.id,
        userName: user.name,
        saturation: Math.round(saturation),
        totalHours,
      };
    });
    
    // 计算项目趋势数据
    const projectTrend = {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
      completed: [0, 0, 0, 1, 0, 0, 0, 0],
      inProgress: [1, 2, 3, 2, 2, 2, 2, 2],
      planned: [2, 1, 0, 0, 0, 0, 0, 1],
    };
    
    // 计算资源分配数据
    const resourceAllocation = mockData.projects.map(project => {
      const projectHours = mockData.timeRecords
        .filter(r => r.projectId === project.id)
        .reduce((sum, record) => sum + record.hours, 0);
      return {
        projectId: project.id,
        projectName: project.name,
        hours: projectHours,
        members: project.members.length,
        progress: project.progress
      };
    });
    
    // 计算工时统计
    const totalHours = mockData.timeRecords.reduce((sum, record) => sum + record.hours, 0);
    const billableHours = totalHours * 0.85; // 假设85%是可计费工时
    const nonBillableHours = totalHours * 0.15;
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalMembers,
      userAllocations,
      projectTrend,
      resourceAllocation,
      totalHours: Math.round(totalHours * 10) / 10,
      billableHours: Math.round(billableHours * 10) / 10,
      nonBillableHours: Math.round(nonBillableHours * 10) / 10
    };
  },
  
  // 获取资源分配详情数据
  getResourceAllocationData: async () => {
    await delay(600);
    
    // 项目资源分配数据
    const projectResourceData = mockData.projects.map(project => {
      const projectMembers = project.members.length;
      const projectHours = mockData.timeRecords
        .filter(record => record.projectId === project.id)
        .reduce((sum, record) => sum + record.hours, 0);
      
      return {
        projectId: project.id,
        projectName: project.name,
        members: projectMembers,
        totalHours: projectHours,
        progress: project.progress,
        status: project.status,
        budget: project.budget
      };
    });
    
    // 人员资源分配数据
    const personResourceData = mockData.users.map(user => {
      const userHours = mockData.timeRecords
        .filter(record => record.userId === user.id)
        .reduce((sum, record) => sum + record.hours, 0);
      
      const userProjects = [...new Set(mockData.timeRecords
        .filter(record => record.userId === user.id)
        .map(record => record.projectId))].length;
      
      // 计算饱和度 (基于每周40小时计算)
      const saturation = Math.min(100, Math.round((userHours / 40) * 100));
      
      return {
        userId: user.id,
        userName: user.name,
        totalHours: userHours,
        projects: userProjects,
        saturation: saturation,
        department: user.department,
        position: user.position
      };
    });
    
    return {
      projectResourceData,
      personResourceData
    };
  },
  
  // 获取概览数据（用于概览页面）
  getOverviewData: async () => {
    await delay(500);
    
    const dashboardData = await overviewService.getDashboardData();
    
    // 资源分配饼图数据
    const resourceAllocation = [
      { name: '前端开发', value: 40 },
      { name: '后端开发', value: 30 },
      { name: 'UI设计', value: 15 },
      { name: '产品管理', value: 15 }
    ];
    
    return {
      ...dashboardData,
      resourceAllocation
    };
  }
};

export default overviewService;