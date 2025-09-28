// 用户角色枚举
export enum UserRole {
  PRODUCT_MANAGER = 'product_manager',
  PROJECT_MANAGER = 'project_manager',
  DELIVERY_MANAGER = 'delivery_manager',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  DESIGNER = 'designer',
}

// 项目状态枚举
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// 应用状态枚举
export enum ApplicationStatus {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production',
  DEPRECATED = 'deprecated',
}

// 用户接口
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  skills: string[];
  currentProjects: string[];
  evaluations: Evaluation[];
  performance: PerformanceMetrics;
  avatar?: string;
  phone?: string;
  joinDate: Date;
  lastActive: Date;
}

// 项目接口
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  manager: User;
  team: User[];
  applications: Application[];
  metrics: ProjectMetrics;
  createdAt: Date;
  updatedAt: Date;
}

// 应用接口
export interface Application {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: ApplicationStatus;
  version: string;
  url: string;
  metrics: ApplicationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

// 性能指标接口
export interface PerformanceMetrics {
  responseTime: number;
  errorRate: number;
  availability: number;
  throughput: number;
  pv: number;
  uv: number;
  conversionRate: number;
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
}

// 项目指标接口
export interface ProjectMetrics {
  progress: number;
  budget: number;
  actualCost: number;
  teamSize: number;
  completedTasks: number;
  totalTasks: number;
  riskLevel: 'low' | 'medium' | 'high';
  qualityScore: number;
}

// 应用指标接口
export interface ApplicationMetrics {
  performance: PerformanceMetrics;
  uptime: number;
  errorCount: number;
  userSatisfaction: number;
  deploymentFrequency: number;
  leadTime: number;
  mttr: number; // Mean Time To Recovery
}

// 评价接口
export interface Evaluation {
  id: string;
  userId: string;
  evaluatorId: string;
  projectId: string;
  technicalSkills: number;
  workAttitude: number;
  teamwork: number;
  projectContribution: number;
  knowledgeTransfer: number;
  overallScore: number;
  comments: string;
  createdAt: Date;
}

// 人员流动接口
export interface PersonnelMovement {
  id: string;
  userId: string;
  fromProject?: string;
  toProject?: string;
  fromRole?: UserRole;
  toRole?: UserRole;
  reason: string;
  date: Date;
  type: 'transfer' | 'promotion' | 'demotion' | 'resignation' | 'hire';
}

// 错误报告接口
export interface ErrorReport {
  id: string;
  appId: string;
  type: 'javascript' | 'promise' | 'network' | 'resource';
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: string;
  userId?: string;
  userAgent: string;
  url: string;
  sourceMapping?: SourceMapMapping;
}

// Source Map映射接口
export interface SourceMapMapping {
  source: string;
  line: number;
  column: number;
  name?: string;
}

// 分析查询接口
export interface AnalyticsQuery {
  metric: string;
  timeRange: TimeRange;
  filters?: Record<string, any>;
  groupBy?: string[];
  aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
}

// 时间范围接口
export interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day' | 'week' | 'month';
}

// 趋势数据接口
export interface TrendData {
  date: string;
  value: number;
  category?: string;
}

// 分布数据接口
export interface DistributionData {
  name: string;
  value: number;
  percentage: number;
}

// 图表配置接口
export interface ChartConfig {
  title?: string;
  height?: number;
  width?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  colors?: string[];
}

// 筛选器接口
export interface ProjectFilters {
  status?: ProjectStatus[];
  manager?: string[];
  dateRange?: TimeRange;
  keyword?: string;
}

export interface UserFilters {
  role?: UserRole[];
  department?: string[];
  skills?: string[];
  keyword?: string;
}

export interface ErrorFilters {
  type?: string[];
  severity?: string[];
  dateRange?: TimeRange;
  appId?: string[];
}

// 分页接口
export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

// API响应接口
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  code?: number;
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

// 创建请求接口
export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  managerId: string;
  teamIds: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  skills: string[];
  phone?: string;
}

export interface CreateApplicationRequest {
  name: string;
  description: string;
  projectId: string;
  url: string;
}

// 更新请求接口
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  endDate?: Date;
  managerId?: string;
  teamIds?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: string;
  skills?: string[];
  phone?: string;
}

// 评价请求接口
export interface EvaluationRequest {
  technicalSkills: number;
  workAttitude: number;
  teamwork: number;
  projectContribution: number;
  knowledgeTransfer: number;
  comments: string;
}

// 人员统计接口
export interface PersonnelStatistics {
  totalUsers: number;
  activeUsers: number;
  movementRate: number;
  averageTenure: number;
  skillDistribution: DistributionData[];
  roleDistribution: DistributionData[];
  departmentDistribution: DistributionData[];
}

// 告警接口
export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  description?: string;
  timestamp: Date;
  resolved: boolean;
  appId?: string;
  projectId?: string;
  userId?: string;
}
