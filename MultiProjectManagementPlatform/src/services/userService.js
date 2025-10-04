import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 生成用户分析数据的工具函数
const generateUserAnalytics = () => {
  // 随机生成饱和度数据 (60-95%)
  const saturation = Math.floor(Math.random() * 35) + 60;
  
  // 根据饱和度生成其他相关数据
  const totalHours = Math.floor(saturation * 0.8);
  const completedRequirements = Math.floor(Math.random() * 10) + 5;
  const overtimeDays = saturation > 85 ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 3);
  
  // 项目分配数据
  const projectAllocations = [
    { id: 1, name: '项目A', percentage: Math.floor(Math.random() * 50) + 30, color: '#1890ff' },
    { id: 2, name: '项目B', percentage: Math.floor(Math.random() * 30) + 10, color: '#52c41a' },
    { id: 3, name: '项目C', percentage: Math.floor(Math.random() * 20), color: '#fa8c16' },
  ];
  
  // 质量相关指标
  const defectRate = Number((Math.random() * 4 + 0.5).toFixed(1));
  const codeCommits = Math.floor(Math.random() * 40) + 20;
  const codeCommitsPerWeek = Number((codeCommits / 4).toFixed(1));
  const releases = Math.floor(Math.random() * 5) + 1;
  const releaseFrequency = Math.floor(Math.random() * 10) + 5;
  const onlineIssues = Math.floor(Math.random() * 5);
  const severityLevel = onlineIssues > 3 ? '高' : onlineIssues > 1 ? '中' : '低';
  
  // 时间分配数据
  const developmentHours = Math.floor(totalHours * 0.6);
  const testingHours = Math.floor(totalHours * 0.2);
  const meetingHours = Math.floor(totalHours * 0.1);
  const documentationHours = Math.floor(totalHours * 0.1);
  
  return {
    saturation,
    totalHours,
    completedRequirements,
    overtimeDays,
    requirementCompletionRate: Math.floor(Math.random() * 20) + 80, // 80-99%
    onTimeCompletionRate: Math.floor(Math.random() * 15) + 75, // 75-89%
    efficiencyIndex: Math.floor(Math.random() * 20) + 70, // 70-89
    resourceUtilization: Math.floor(Math.random() * 30) + 60, // 60-89%
    projectAllocations,
    defectRate,
    codeCommits,
    codeCommitsPerWeek,
    releases,
    releaseFrequency,
    onlineIssues,
    severityLevel,
    developmentHours,
    testingHours,
    meetingHours,
    documentationHours
  };
};

// 用户服务
export const userService = {
  // 获取所有用户
  getUsers: async () => {
    await delay(500);
    return mockData.users;
  },
  
  // 获取单个用户
  getUserById: async (id) => {
    await delay(300);
    const user = mockData.users.find(u => u.id === id);
    if (!user) {
      throw new Error('用户不存在');
    }
    return user;
  },
  
  // 获取用户分析数据
  getUserAnalytics: async (userId) => {
    await delay(400);
    // 验证用户是否存在
    const user = mockData.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 生成并返回分析数据
    return generateUserAnalytics(userId);
  },
  
  // 创建用户
  createUser: async (userData) => {
    await delay(500);
    const newUser = {
      id: mockData.users.length + 1,
      ...userData,
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0],
      password: userData.password || '123456' // 默认密码
    };
    mockData.users.push(newUser);
    return newUser;
  },
  
  // 更新用户
  updateUser: async (id, userData) => {
    await delay(400);
    const index = mockData.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('用户不存在');
    }
    mockData.users[index] = {
      ...mockData.users[index],
      ...userData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return mockData.users[index];
  },
  
  // 删除用户
  deleteUser: async (id) => {
    await delay(400);
    const index = mockData.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('用户不存在');
    }
    // 不能删除有项目关联的用户
    const hasProjects = mockData.projects.some(project => 
      project.managerId === id || project.members.includes(id)
    );
    if (hasProjects) {
      throw new Error('该用户有项目关联，无法删除');
    }
    mockData.users.splice(index, 1);
    return { success: true };
  },
  
  // 获取用户的时间记录
  getUserTimeRecords: async (userId) => {
    await delay(400);
    return mockData.timeRecords.filter(record => record.userId === userId);
  }
};

export default userService;