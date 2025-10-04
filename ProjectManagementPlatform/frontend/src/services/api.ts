/**
 * API 服务层
 * 统一管理所有API请求
 */

import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:7001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API_PREFIX = '/api';

// 用户相关API
export const userAPI = {
  // 登录
  login: (data: { username: string; password: string }) =>
    request(`${API_PREFIX}/auth/login`, {
      method: 'POST',
      data,
    }),

  // 注册
  register: (data: { username: string; password: string; email: string }) =>
    request(`${API_PREFIX}/auth/register`, {
      method: 'POST',
      data,
    }),

  // 获取用户信息
  getUserInfo: () =>
    request(`${API_PREFIX}/user/info`, {
      method: 'GET',
    }),

  // 获取用户列表
  getUserList: (params: any) =>
    request(`${API_PREFIX}/users`, {
      method: 'GET',
      params,
    }),

  // 创建用户
  createUser: (data: any) =>
    request(`${API_PREFIX}/users`, {
      method: 'POST',
      data,
    }),

  // 更新用户
  updateUser: (id: string, data: any) =>
    request(`${API_PREFIX}/users/${id}`, {
      method: 'PUT',
      data,
    }),

  // 删除用户
  deleteUser: (id: string) =>
    request(`${API_PREFIX}/users/${id}`, {
      method: 'DELETE',
    }),
};

// 项目相关API
export const projectAPI = {
  // 获取项目列表
  getProjectList: (params: any) =>
    request(`${API_PREFIX}/projects`, {
      method: 'GET',
      params,
    }),

  // 获取项目详情
  getProjectDetail: (id: string) =>
    request(`${API_PREFIX}/projects/${id}`, {
      method: 'GET',
    }),

  // 创建项目
  createProject: (data: any) =>
    request(`${API_PREFIX}/projects`, {
      method: 'POST',
      data,
    }),

  // 更新项目
  updateProject: (id: string, data: any) =>
    request(`${API_PREFIX}/projects/${id}`, {
      method: 'PUT',
      data,
    }),

  // 删除项目
  deleteProject: (id: string) =>
    request(`${API_PREFIX}/projects/${id}`, {
      method: 'DELETE',
    }),

  // 获取项目成员
  getProjectMembers: (id: string) =>
    request(`${API_PREFIX}/projects/${id}/members`, {
      method: 'GET',
    }),

  // 添加项目成员
  addProjectMember: (id: string, data: any) =>
    request(`${API_PREFIX}/projects/${id}/members`, {
      method: 'POST',
      data,
    }),
};

// 任务相关API
export const taskAPI = {
  // 获取任务列表
  getTaskList: (params: any) =>
    request(`${API_PREFIX}/tasks`, {
      method: 'GET',
      params,
    }),

  // 获取任务详情
  getTaskDetail: (id: string) =>
    request(`${API_PREFIX}/tasks/${id}`, {
      method: 'GET',
    }),

  // 创建任务
  createTask: (data: any) =>
    request(`${API_PREFIX}/tasks`, {
      method: 'POST',
      data,
    }),

  // 更新任务
  updateTask: (id: string, data: any) =>
    request(`${API_PREFIX}/tasks/${id}`, {
      method: 'PUT',
      data,
    }),

  // 删除任务
  deleteTask: (id: string) =>
    request(`${API_PREFIX}/tasks/${id}`, {
      method: 'DELETE',
    }),

  // 更新任务状态
  updateTaskStatus: (id: string, status: string) =>
    request(`${API_PREFIX}/tasks/${id}/status`, {
      method: 'PATCH',
      data: { status },
    }),
};

// 报表相关API
export const reportAPI = {
  // 获取仪表盘数据
  getDashboardData: () =>
    request(`${API_PREFIX}/reports/dashboard`, {
      method: 'GET',
    }),

  // 获取项目统计
  getProjectStats: (params: any) =>
    request(`${API_PREFIX}/reports/projects`, {
      method: 'GET',
      params,
    }),

  // 获取用户统计
  getUserStats: (params: any) =>
    request(`${API_PREFIX}/reports/users`, {
      method: 'GET',
      params,
    }),

  // 获取性能数据
  getPerformanceData: (params: any) =>
    request(`${API_PREFIX}/reports/performance`, {
      method: 'GET',
      params,
    }),

  // 获取风险数据
  getRiskData: (params: any) =>
    request(`${API_PREFIX}/reports/risks`, {
      method: 'GET',
      params,
    }),
};

// 组织相关API
export const organizationAPI = {
  // 获取组织架构
  getOrganization: () =>
    request(`${API_PREFIX}/organization`, {
      method: 'GET',
    }),

  // 获取部门列表
  getDepartments: () =>
    request(`${API_PREFIX}/departments`, {
      method: 'GET',
    }),

  // 创建部门
  createDepartment: (data: any) =>
    request(`${API_PREFIX}/departments`, {
      method: 'POST',
      data,
    }),

  // 更新部门
  updateDepartment: (id: string, data: any) =>
    request(`${API_PREFIX}/departments/${id}`, {
      method: 'PUT',
      data,
    }),

  // 删除部门
  deleteDepartment: (id: string) =>
    request(`${API_PREFIX}/departments/${id}`, {
      method: 'DELETE',
    }),
};

// 系统设置相关API
export const settingsAPI = {
  // 获取系统配置
  getSystemConfig: () =>
    request(`${API_PREFIX}/settings/system`, {
      method: 'GET',
    }),

  // 更新系统配置
  updateSystemConfig: (data: any) =>
    request(`${API_PREFIX}/settings/system`, {
      method: 'PUT',
      data,
    }),

  // 获取用户设置
  getUserSettings: () =>
    request(`${API_PREFIX}/settings/user`, {
      method: 'GET',
    }),

  // 更新用户设置
  updateUserSettings: (data: any) =>
    request(`${API_PREFIX}/settings/user`, {
      method: 'PUT',
      data,
    }),
};

export default {
  userAPI,
  projectAPI,
  taskAPI,
  reportAPI,
  organizationAPI,
  settingsAPI,
};