// 性能指标接口
export interface PerformanceMetrics {
  pv: number;
  uv: number;
  errorRate: number;
  successRate: number;
  avgResponseTime: number;
  whiteScreenTime: number;
  healthScore: number; // 健康度评分
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F'; // 绩效等级
}

// 健康度评估指标
export interface HealthMetrics {
  stability: number; // 稳定性评分 (0-100)
  performance: number; // 性能评分 (0-100)
  reliability: number; // 可靠性评分 (0-100)
  security: number; // 安全性评分 (0-100)
  userExperience: number; // 用户体验评分 (0-100)
  maintainability: number; // 可维护性评分 (0-100)
}

// 应用数据接口
export interface ApplicationData {
  id: string;
  name: string;
  version: string;
  status: 'healthy' | 'warning' | 'error';
  metrics: PerformanceMetrics;
  lastDeployTime: string;
  previousMetrics?: Partial<PerformanceMetrics>; // 环比数据
}

// 用户角色枚举
export enum UserRole {
  TECH_LEAD = 'tech_lead',
  PRODUCT_MANAGER = 'product_manager',
  DEVOPS = 'devops',
  DEVELOPER = 'developer',
  PROJECT_MANAGER = 'project_manager',
}

// 仪表板视图类型
export enum DashboardView {
  EXECUTIVE = 'executive', // 高管视图：关注业务影响
  OPERATIONAL = 'operational', // 运营视图：关注日常运行
  TECHNICAL = 'technical', // 技术视图：关注技术指标
  STRATEGIC = 'strategic', // 战略视图：关注长期趋势
}

// 严重程度级别
export enum SeverityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

// 业务影响评估
export interface BusinessImpact {
  revenue: number; // 收入影响（元）
  users: number; // 用户影响数量
  reputation: 'high' | 'medium' | 'low'; // 声誉风险
  urgency: SeverityLevel; // 紧急程度
}

// 智能洞察
export interface SmartInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number; // 置信度 0-100
  impact: BusinessImpact;
  actionable: boolean;
  recommendations: string[];
  relatedMetrics: string[];
  timestamp: string;
}

// KPI配置
export interface KPIConfig {
  id: string;
  name: string;
  category: string;
  target: number;
  current: number;
  trend: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  businessValue: string;
  owner: string;
}

// 行动项
export interface ActionItem {
  id: string;
  title: string;
  priority: SeverityLevel;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedImpact: string;
  category: string;
}

// 健康度报表数据
export interface HealthReport {
  period: string; // 时间周期
  overallScore: number; // 综合健康度
  trend: 'up' | 'down' | 'stable'; // 趋势
  metrics: HealthMetrics;
  issues: Array<{
    type: 'critical' | 'major' | 'minor';
    description: string;
    impact: string;
    suggestion: string;
  }>;
  achievements: Array<{
    title: string;
    improvement: number;
    description: string;
  }>;
}

// 图表配置接口
export interface ChartOption {
  title?: any;
  tooltip?: any;
  legend?: any;
  xAxis?: any;
  yAxis?: any;
  series?: any[];
}