import type { PerformanceMetrics, BusinessImpact, SmartInsight, UserRole, SeverityLevel } from '@/types/performance';

/**
 * 健康度评估算法
 * @param metrics 性能指标
 * @returns 健康度评分 (0-100)
 */
export const calculateHealthScore = (metrics: PerformanceMetrics): number => {
  // 基于多维度指标计算健康度
  const stabilityScore = Math.max(0, 100 - metrics.errorRate * 10); // 稳定性：错误率越低越好
  const performanceScore = Math.max(0, 100 - (metrics.avgResponseTime - 200) / 10); // 性能：200ms为基准
  const reliabilityScore = metrics.successRate; // 可靠性：成功率
  const userExpScore = Math.max(0, 100 - (metrics.whiteScreenTime - 1000) / 50); // 用户体验：1秒为基准
  
  // 加权平均
  const healthScore = (
    stabilityScore * 0.3 + 
    performanceScore * 0.25 + 
    reliabilityScore * 0.25 + 
    userExpScore * 0.2
  );
  
  return Math.round(Math.max(0, Math.min(100, healthScore)));
};

/**
 * 获取性能等级
 * @param score 健康度评分
 * @returns 性能等级 A-F
 */
export const getPerformanceGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

/**
 * 获取状态颜色
 * @param status 状态
 * @returns Ant Design 颜色
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'default';
  }
};

/**
 * 获取状态文本
 * @param status 状态
 * @returns 状态文本
 */
export const getStatusText = (status: string) => {
  switch (status) {
    case 'healthy': return '健康';
    case 'warning': return '警告';
    case 'error': return '错误';
    default: return '未知';
  }
};

/**
 * 根据用户角色过滤洞察数据
 * @param role 用户角色
 * @param smartInsights 智能洞察数据
 * @returns 过滤后的洞察数据
 */
export const getViewByRole = (role: UserRole, smartInsights: SmartInsight[]) => {
  switch (role) {
    case 'tech_lead':
      return {
        title: '技术负责人视图',
        description: '关注系统稳定性、技术债务和团队效能',
        primaryMetrics: ['availability', 'error_rate', 'technical_debt', 'team_velocity'],
        insights: smartInsights.filter(i => i.type === 'risk' || i.type === 'trend'),
      };
    case 'product_manager':
      return {
        title: '产品经理视图',
        description: '关注用户体验、业务指标和产品健康度',
        primaryMetrics: ['user_satisfaction', 'conversion_rate', 'feature_adoption', 'churn_rate'],
        insights: smartInsights.filter(i => i.type === 'opportunity' || i.type === 'trend'),
      };
    case 'devops':
      return {
        title: 'DevOps视图',
        description: '关注系统运行状态、部署质量和运维效率',
        primaryMetrics: ['uptime', 'deployment_frequency', 'mttr', 'change_failure_rate'],
        insights: smartInsights.filter(i => i.type === 'risk' || i.type === 'anomaly'),
      };
    default:
      return {
        title: '综合视图',
        description: '全面的系统性能概览',
        primaryMetrics: ['availability', 'user_satisfaction', 'response_time', 'error_rate'],
        insights: smartInsights,
      };
  }
};

/**
 * 获取业务影响评分
 * @param impact 业务影响数据
 * @returns 业务影响评分
 */
export const getBusinessImpactScore = (impact: BusinessImpact): number => {
  const revenueScore = Math.min(impact.revenue / 100000, 10); // 10万为满分
  const userScore = Math.min(impact.users / 10000, 10); // 1万用户为满分
  const reputationScore = impact.reputation === 'high' ? 10 : impact.reputation === 'medium' ? 6 : 3;
  
  const urgencyScoreMap: Record<SeverityLevel, number> = {
    critical: 10,
    high: 8,
    medium: 5,
    low: 3,
    info: 1,
  };
  const urgencyScore = urgencyScoreMap[impact.urgency];
  
  return Math.round((revenueScore + userScore + reputationScore + urgencyScore) / 4);
};

/**
 * 获取优先级颜色映射
 * @returns 优先级颜色映射对象
 */
export const getPriorityColors = () => ({
  critical: '#ff4d4f',
  high: '#fa8c16',
  medium: '#1890ff',
  low: '#52c41a',
  info: '#d9d9d9',
});

/**
 * 获取状态颜色映射
 * @returns 状态颜色映射对象
 */
export const getStatusColors = () => ({
  pending: 'default',
  in_progress: 'processing',
  completed: 'success',
  overdue: 'error',
});

/**
 * 计算环比增长率
 * @param current 当前值
 * @param previous 上期值
 * @returns 增长率百分比
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const rate = ((current - previous) / previous) * 100;
  return Math.round(rate * 10) / 10; // 保留一位小数
};

/**
 * 获取增长率的颜色和图标
 * @param rate 增长率
 * @param isHigherBetter 是否数值越高越好
 * @returns 包含颜色和图标的对象
 */
export const getGrowthRateStyle = (
  rate: number,
  isHigherBetter: boolean = true
): { color: string; icon: 'up' | 'down' } => {
  if (rate > 0) {
    return { 
      color: isHigherBetter ? '#52c41a' : '#ff4d4f',
      icon: 'up'
    };
  } else if (rate < 0) {
    return { 
      color: isHigherBetter ? '#ff4d4f' : '#52c41a',
      icon: 'down'
    };
  }
  return { color: '#d9d9d9', icon: 'up' };
};