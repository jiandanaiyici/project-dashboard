import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 项目服务
export const projectService = {
  // 获取所有项目
  getProjects: async () => {
    await delay(600);
    return mockData.projects;
  },
  
  // 获取单个项目
  getProjectById: async (id) => {
    await delay(400);
    const project = mockData.projects.find(p => p.id === id);
    if (!project) {
      throw new Error('项目不存在');
    }
    return project;
  },
  
  // 创建项目
  createProject: async (projectData) => {
    await delay(500);
    const newProject = {
      id: mockData.projects.length + 1,
      ...projectData,
      progress: 0,
      status: '规划中',
      actualCost: 0,
      tasks: 0,
      completedTasks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    mockData.projects.push(newProject);
    return newProject;
  },
  
  // 更新项目
  updateProject: async (id, projectData) => {
    await delay(500);
    const index = mockData.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('项目不存在');
    }
    mockData.projects[index] = {
      ...mockData.projects[index],
      ...projectData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return mockData.projects[index];
  },
  
  // 删除项目
  deleteProject: async (id) => {
    await delay(400);
    const index = mockData.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('项目不存在');
    }
    mockData.projects.splice(index, 1);
    // 同时删除相关的时间记录
    mockData.timeRecords = mockData.timeRecords.filter(record => record.projectId !== id);
    return { success: true };
  }
};

export default projectService;