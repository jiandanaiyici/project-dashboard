// 此文件已拆分到独立的服务文件中
// 保留作为兼容性入口，重定向到新的文件结构

import api from '../utils/request';
import authService from './authService';
import projectService from './projectService';
import userService from './userService';
import timeTrackingService from './timeTrackingService';
import applicationService from './applicationService';
import overviewService from './overviewService';

// 导出所有服务
export {
  authService,
  projectService,
  userService,
  timeTrackingService,
  applicationService,
  overviewService
};

// 导出delay函数，用于向后兼容
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 默认导出api实例
export default api;

// 向后兼容的mockData导出
import { mockData } from '../mock/mockData';
export { mockData };