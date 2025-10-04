// 用户类型
export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
  joinDate: string;
  updatedAt?: string;
  role: string;
}

// 项目类型
export interface Project {
  id: number;
  name: string;
  description: string;
  managerId: number;
  members: number[];
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  progress: number;
  status: '规划中' | '进行中' | '已完成' | '已暂停';
  tasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt?: string;
  type: string;
}

// 时间记录类型
export interface TimeRecord {
  id: number;
  userId: number;
  projectId: number;
  date: string;
  hours: number;
  description: string;
  taskType: string;
  createdAt: string;
  updatedAt?: string;
}

// 应用类型
export interface Application {
  id: number;
  name: string;
  description: string;
  type: string;
  url: string;
  status: '启用' | '禁用';
  createdAt: string;
  updatedAt: string;
  owner?: string;
}

// 项目统计数据
export interface ProjectStats {
  [projectId: number]: number;
}

// 时间统计数据
export interface TimeStatistics {
  totalHours: number;
  averageHours: number;
  projectStats: ProjectStats;
  daysRecorded: number;
}

// 用户分配数据
export interface UserAllocation {
  userId: number;
  userName: string;
  saturation: number;
  totalHours: number;
}

// 项目趋势数据
export interface ProjectTrend {
  labels: string[];
  completed: number[];
  inProgress: number[];
  planned: number[];
}

// 资源分配数据
export interface ResourceAllocation {
  projectId: number;
  projectName: string;
  hours: number;
  members: number;
  progress: number;
}

// 仪表盘数据
export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
  userAllocations: UserAllocation[];
  projectTrend: ProjectTrend;
  resourceAllocation: ResourceAllocation[];
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
}

// 项目资源数据
export interface ProjectResourceData {
  projectId: number;
  projectName: string;
  members: number;
  totalHours: number;
  progress: number;
  status: string;
  budget: number;
}

// 人员资源数据
export interface PersonResourceData {
  userId: number;
  userName: string;
  totalHours: number;
  projects: number;
  saturation: number;
  department: string;
  position: string;
}

// 资源分配详情数据
export interface ResourceAllocationData {
  projectResourceData: ProjectResourceData[];
  personResourceData: PersonResourceData[];
}

// 概览数据
export interface OverviewData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalMembers: number;
  userAllocations: UserAllocation[];
  projectTrend: ProjectTrend;
  resourceAllocation: { name: string; value: number }[];
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
}

// 上下文类型
export interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isMenuCollapsed: boolean;
  currentProject: Project | null;
  projects: Project[];
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  toggleMenu: () => void;
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  setUsers: (users: User[]) => void;
}

// 应用健康度数据
export interface ApplicationHealth {
  id: number;
  name: string;
  status: '健康' | '警告' | '危险';
  uptime: number; // 百分比
  responseTime: number; // 毫秒
  errorRate: number; // 百分比
  lastChecked: string;
  category: string;
}

// 甘特图任务数据
export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  assignee: number;
  assigneeName: string;
  projectId: number;
  projectName: string;
  type: string;
}

// 路由参数类型
export interface RouteParams {
  id?: string;
}

// 应用埋点数据类型
export interface AppAnalyticsData {
  appId: number;
  appName: string;
  date: string;
  pv: number; // 页面访问量
  uv: number; // 独立访客数
  duration: number; // 平均停留时长（秒）
  bounceRate: number; // 跳出率（%）
  platform?: string; // 平台类型
}

// 页面埋点数据类型
export interface PageAnalyticsData {
  pageId: string;
  pageName: string;
  appId: number;
  appName: string;
  date: string;
  pv: number;
  uv: number;
  duration: number;
  bounceRate: number;
  entryRate?: number; // 入口率（%）
  exitRate?: number; // 退出率（%）
}

// 应用分析汇总数据类型
export interface AppAnalyticsSummary {
  appId: number;
  appName: string;
  totalPv: number;
  totalUv: number;
  avgDuration: number;
  avgBounceRate: number;
  trend: AppAnalyticsData[];
  topPages: PageAnalyticsData[];
}

// 应用埋点趋势数据类型
export interface AppAnalyticsTrend {
  dates: string[];
  pvData: {[appId: number]: number[]};
  uvData: {[appId: number]: number[]};
}

// 埋点统计概览数据类型
export interface AnalyticsOverview {
  totalApps: number;
  totalPv: number;
  totalUv: number;
  topApp: {id: number; name: string; pv: number; uv: number};
  topPage: {id: string; name: string; pv: number; uv: number; appName: string};
  dailyAveragePv: number;
  dailyAverageUv: number;
}