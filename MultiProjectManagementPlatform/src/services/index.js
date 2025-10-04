// 统一导出所有服务
import api from '../utils/request';
import authService from './authService';
import projectService from './projectService';
import userService from './userService';
import timeTrackingService from './timeTrackingService';
import applicationService from './applicationService';
import overviewService from './overviewService';

// 导出所有服务
export {
  api,
  authService,
  projectService,
  userService,
  timeTrackingService,
  applicationService,
  overviewService
};

// 默认导出api实例
export default api;