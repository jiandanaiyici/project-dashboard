/**
 * 数据类型定义
 */

// 基础响应类型
export interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页类型
export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: Pagination;
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface LoginForm {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  username: string;
  password: string;
  email: string;
  name: string;
  phone?: string;
}

// 项目相关类型
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  progress: number;
  managerId: string;
  manager: User;
  members: User[];
  budget?: number;
  actualCost?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectForm {
  name: string;
  description?: string;
  status: Project['status'];
  priority: Project['priority'];
  startDate: string;
  endDate: string;
  managerId: string;
  memberIds: string[];
  budget?: number;
  tags?: string[];
}

// 任务相关类型
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assignee?: User;
  projectId: string;
  project?: Project;
  parentId?: string;
  children?: Task[];
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
  tags?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskForm {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  assigneeId?: string;
  projectId: string;
  parentId?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

// 部门/组织相关类型
export interface Department {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  manager?: User;
  children?: Department[];
  members?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentForm {
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
}

// 风险相关类型
export interface Risk {
  id: string;
  title: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'closed';
  projectId?: string;
  project?: Project;
  ownerId: string;
  owner: User;
  probability: number; // 0-100
  impact: number; // 0-100
  mitigation?: string;
  contingency?: string;
  identifiedDate: string;
  targetDate?: string;
  resolvedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskForm {
  title: string;
  description: string;
  level: Risk['level'];
  projectId?: string;
  ownerId: string;
  probability: number;
  impact: number;
  mitigation?: string;
  contingency?: string;
  targetDate?: string;
}

// 统计相关类型
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalUsers: number;
  activeUsers: number;
  totalRisks: number;
  highRisks: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

export interface ProjectStats {
  projectTrend: ChartData[];
  taskCompletion: ChartData[];
  memberActivity: ChartData[];
  budgetUsage: ChartData[];
}

export interface UserStats {
  userGrowth: ChartData[];
  departmentDistribution: ChartData[];
  roleDistribution: ChartData[];
  activityLevel: ChartData[];
}

export interface PerformanceStats {
  systemMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  responseTime: ChartData[];
  throughput: ChartData[];
  errorRate: ChartData[];
  uptime: number;
}

// 设置相关类型
export interface SystemSettings {
  siteName: string;
  siteDescription?: string;
  logo?: string;
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  timezone: string;
  emailConfig: {
    smtp: string;
    port: number;
    username: string;
    password: string;
    ssl: boolean;
  };
  notificationConfig: {
    enableEmail: boolean;
    enableSMS: boolean;
    enableWebPush: boolean;
  };
  securityConfig: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'zh-CN' | 'en-US';
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
}

// 表格相关类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean;
  render?: (text: any, record: any, index: number) => React.ReactNode;
}

export interface TableParams {
  current: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
  filters?: Record<string, any>;
  search?: string;
}

// 菜单相关类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permissions?: string[];
}

// 文件上传类型
export interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
}

// 通知类型
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId: string;
  createdAt: string;
}

// 日志类型
export interface ActivityLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  user: User;
  details?: any;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}