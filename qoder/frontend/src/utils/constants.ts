// 项目状态配置
export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PROJECT_STATUS_CONFIG = {
  [PROJECT_STATUS.PLANNING]: { color: 'blue', text: '计划中' },
  [PROJECT_STATUS.IN_PROGRESS]: { color: 'processing', text: '进行中' },
  [PROJECT_STATUS.ON_HOLD]: { color: 'warning', text: '暂停' },
  [PROJECT_STATUS.COMPLETED]: { color: 'success', text: '已完成' },
  [PROJECT_STATUS.CANCELLED]: { color: 'error', text: '已取消' },
};

// 任务状态配置
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
  CANCELLED: 'cancelled',
} as const;

export const TASK_STATUS_CONFIG = {
  [TASK_STATUS.TODO]: { color: 'default', text: '待开始' },
  [TASK_STATUS.IN_PROGRESS]: { color: 'processing', text: '进行中' },
  [TASK_STATUS.REVIEW]: { color: 'warning', text: '待审核' },
  [TASK_STATUS.DONE]: { color: 'success', text: '已完成' },
  [TASK_STATUS.CANCELLED]: { color: 'error', text: '已取消' },
};

// 优先级配置
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const PRIORITY_CONFIG = {
  [PRIORITY.LOW]: { color: 'default', text: '低' },
  [PRIORITY.MEDIUM]: { color: 'blue', text: '中' },
  [PRIORITY.HIGH]: { color: 'orange', text: '高' },
  [PRIORITY.CRITICAL]: { color: 'red', text: '紧急' },
};

// 用户角色配置
export const USER_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export const USER_ROLE_CONFIG = {
  [USER_ROLE.ADMIN]: { color: 'red', text: '管理员' },
  [USER_ROLE.MANAGER]: { color: 'blue', text: '经理' },
  [USER_ROLE.USER]: { color: 'green', text: '普通用户' },
};

// 风险级别配置
export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const RISK_LEVEL_CONFIG = {
  [RISK_LEVEL.LOW]: { color: 'blue', text: '低' },
  [RISK_LEVEL.MEDIUM]: { color: 'yellow', text: '中' },
  [RISK_LEVEL.HIGH]: { color: 'orange', text: '高' },
  [RISK_LEVEL.CRITICAL]: { color: 'red', text: '严重' },
};

// 通知类型
export const NOTIFICATION_TYPE = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// API 路径
export const API_ROUTES = {
  // 用户相关
  USER_LOGIN: '/api/user/login',
  USER_REGISTER: '/api/user/register',
  USER_INFO: '/api/user/info',
  USER_LIST: '/api/user/list',
  USER_CREATE: '/api/user',
  USER_UPDATE: '/api/user/:id',
  USER_DELETE: '/api/user/:id',

  // 项目相关
  PROJECT_LIST: '/api/project/list',
  PROJECT_DETAIL: '/api/project/:id',
  PROJECT_CREATE: '/api/project',
  PROJECT_UPDATE: '/api/project/:id',
  PROJECT_DELETE: '/api/project/:id',
  PROJECT_STATS: '/api/project/stats/overview',

  // 任务相关
  TASK_LIST: '/api/task/list',
  TASK_CREATE: '/api/task',
  TASK_UPDATE: '/api/task/:id',
  TASK_DELETE: '/api/task/:id',

  // 风险相关
  RISK_LIST: '/api/risk/list',
  RISK_CREATE: '/api/risk',
  RISK_UPDATE: '/api/risk/:id',
  RISK_DELETE: '/api/risk/:id',
} as const;

// 页面路由
export const PAGE_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USER_LIST: '/users/list',
  USER_ORGANIZATION: '/users/organization',
  PROJECTS: '/projects',
  PROJECT_LIST: '/projects/list',
  PROJECT_DETAIL: '/projects/detail/:id',
  PROJECT_KANBAN: '/projects/kanban',
  REPORTS: '/reports',
  REPORT_OVERVIEW: '/reports/overview',
  REPORT_PERFORMANCE: '/reports/performance',
  REPORT_RISKS: '/reports/risks',
  WORKSPACE: '/workspace',
  SETTINGS: '/settings',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
} as const;

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// 图表颜色配置
export const CHART_COLORS = [
  '#1890ff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#eb2f96',
  '#fa8c16',
  '#13c2c2',
  '#a0d911',
  '#2f54eb',
] as const;

// 时间格式
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
} as const;