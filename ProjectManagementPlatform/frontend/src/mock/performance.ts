import dayjs from 'dayjs';
import type {
  ApplicationData,
  SmartInsight,
  KPIConfig,
  ActionItem,
  HealthReport,
  ChartOption,
  SeverityLevel,
} from '@/types/performance';

// 模拟应用数据
export const mockApplications: ApplicationData[] = [
  {
    id: '1',
    name: '项目管理平台',
    version: 'v1.2.3',
    status: 'healthy',
    metrics: {
      pv: 125000,
      uv: 8500,
      errorRate: 0.2,
      successRate: 99.8,
      avgResponseTime: 280,
      whiteScreenTime: 1200,
      healthScore: 95,
      performanceGrade: 'A',
    },
    lastDeployTime: '2024-01-15 14:30:00',
    // 环比数据
    previousMetrics: {
      pv: 110000,
      uv: 7800,
      errorRate: 0.3,
      successRate: 99.7,
      avgResponseTime: 320,
      whiteScreenTime: 1350,
      healthScore: 92,
    }
  },
  {
    id: '2',
    name: '用户管理系统',
    version: 'v2.1.0',
    status: 'warning',
    metrics: {
      pv: 89000,
      uv: 5200,
      errorRate: 1.8,
      successRate: 98.2,
      avgResponseTime: 450,
      whiteScreenTime: 2100,
      healthScore: 78,
      performanceGrade: 'B',
    },
    lastDeployTime: '2024-01-10 09:15:00',
    // 环比数据
    previousMetrics: {
      pv: 92000,
      uv: 5400,
      errorRate: 1.5,
      successRate: 98.5,
      avgResponseTime: 420,
      whiteScreenTime: 2000,
      healthScore: 80,
    }
  },
  {
    id: '3',
    name: '数据分析平台',
    version: 'v3.0.1',
    status: 'error',
    metrics: {
      pv: 45000,
      uv: 2800,
      errorRate: 5.2,
      successRate: 94.8,
      avgResponseTime: 850,
      whiteScreenTime: 3500,
      healthScore: 62,
      performanceGrade: 'C',
    },
    lastDeployTime: '2024-01-12 16:45:00',
    // 环比数据
    previousMetrics: {
      pv: 50000,
      uv: 3200,
      errorRate: 4.8,
      successRate: 95.2,
      avgResponseTime: 800,
      whiteScreenTime: 3200,
      healthScore: 65,
    }
  },
];

// 智能洞察数据
export const mockSmartInsights: SmartInsight[] = [
  {
    id: 'insight-1',
    type: 'opportunity',
    title: '移动端访问量增长机会',
    description: '过去7天移动端流量增长32%，建议优化移动端体验以获得更高转化',
    confidence: 85,
    impact: {
      revenue: 156000,
      users: 12000,
      reputation: 'medium',
      urgency: 'medium' as SeverityLevel,
    },
    actionable: true,
    recommendations: [
      '优化移动端页面加载速度',
      '改进移动端交互体验',
      '增加移动端专属功能',
    ],
    relatedMetrics: ['mobile_pv', 'mobile_conversion', 'page_load_time'],
    timestamp: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: 'insight-2',
    type: 'risk',
    title: 'API响应时间异常',
    description: '用户登录接口响应时间较昨日增长85%，可能影响用户体验',
    confidence: 92,
    impact: {
      revenue: 89000,
      users: 8500,
      reputation: 'high',
      urgency: 'high' as SeverityLevel,
    },
    actionable: true,
    recommendations: [
      '检查数据库连接池配置',
      '优化登录接口查询逻辑',
      '增加接口监控告警',
    ],
    relatedMetrics: ['api_response_time', 'error_rate', 'user_login_success'],
    timestamp: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 'insight-3',
    type: 'trend',
    title: '用户活跃度持续提升',
    description: '月活跃用户数连续3个月增长，增长率稳定在15%左右',
    confidence: 78,
    impact: {
      revenue: 234000,
      users: 25000,
      reputation: 'high',
      urgency: 'info' as SeverityLevel,
    },
    actionable: false,
    recommendations: [
      '保持当前产品策略',
      '准备扩容计划以应对增长',
      '分析增长驱动因素并复制',
    ],
    relatedMetrics: ['monthly_active_users', 'user_retention', 'feature_usage'],
    timestamp: dayjs().subtract(4, 'hour').toISOString(),
  },
];

// KPI配置数据
export const mockKPIConfigs: KPIConfig[] = [
  {
    id: 'availability',
    name: '系统可用性',
    category: '稳定性',
    target: 99.9,
    current: 99.85,
    trend: -0.05,
    status: 'warning',
    businessValue: '每0.1%可用性提升可减少约50万元损失',
    owner: 'DevOps团队',
  },
  {
    id: 'user_satisfaction',
    name: '用户满意度',
    category: '体验',
    target: 4.5,
    current: 4.6,
    trend: 0.1,
    status: 'excellent',
    businessValue: '满意度每提升0.1可带来约15%的留存提升',
    owner: '产品团队',
  },
  {
    id: 'response_time',
    name: '平均响应时间',
    category: '性能',
    target: 200,
    current: 280,
    trend: 15,
    status: 'warning',
    businessValue: '响应时间每减少100ms可提升转化率约3%',
    owner: '技术团队',
  },
  {
    id: 'error_rate',
    name: '错误率',
    category: '质量',
    target: 0.1,
    current: 0.45,
    trend: 0.1,
    status: 'critical',
    businessValue: '错误率每降低0.1%可减少约10万元客服成本',
    owner: '开发团队',
  },
];

// 行动项数据
export const mockActionItems: ActionItem[] = [
  {
    id: 'action-1',
    title: '优化用户登录接口性能',
    priority: 'high' as SeverityLevel,
    assignee: '张三',
    dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    status: 'in_progress',
    estimatedImpact: '预计可提升登录成功率8%',
    category: '性能优化',
  },
  {
    id: 'action-2',
    title: '建立移动端性能监控',
    priority: 'medium' as SeverityLevel,
    assignee: '李四',
    dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    estimatedImpact: '完善监控体系，减少故障发现时间50%',
    category: '监控完善',
  },
  {
    id: 'action-3',
    title: '数据库查询优化',
    priority: 'high' as SeverityLevel,
    assignee: '王五',
    dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    status: 'overdue',
    estimatedImpact: '预计可降低平均响应时间30%',
    category: '数据库优化',
  },
];

// 健康度报表数据
export const mockHealthReports: HealthReport[] = [
  {
    period: '本周',
    overallScore: 85,
    trend: 'up',
    metrics: {
      stability: 92,
      performance: 78,
      reliability: 89,
      security: 95,
      userExperience: 82,
      maintainability: 75,
    },
    issues: [
      {
        type: 'major',
        description: '数据分析平台响应时间过长',
        impact: '影响用户体验，可能导致用户流失',
        suggestion: '优化数据库查询，增加缓存机制',
      },
      {
        type: 'minor',
        description: '部分接口错误率较高',
        impact: '影响系统稳定性',
        suggestion: '加强异常处理和重试机制',
      },
    ],
    achievements: [
      {
        title: '系统可用性提升',
        improvement: 5,
        description: '系统可用性从95%提升到99.5%',
      },
      {
        title: '错误率降低',
        improvement: 3,
        description: '整体错误率从2.1%降低到1.8%',
      },
    ],
  },
];

// 获取汇总指标
export const getOverallMetrics = (applications: ApplicationData[]) => ({
  totalPV: applications.reduce((sum, app) => sum + app.metrics.pv, 0),
  totalUV: applications.reduce((sum, app) => sum + app.metrics.uv, 0),
  avgErrorRate: applications.reduce((sum, app) => sum + app.metrics.errorRate, 0) / applications.length,
  avgResponseTime: applications.reduce((sum, app) => sum + app.metrics.avgResponseTime, 0) / applications.length,
});

// PV/UV趋势图表配置
export const getPVUVTrendOption = (): ChartOption => ({
  title: {
    text: 'PV/UV 趋势分析',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['PV', 'UV'],
    bottom: 10
  },
  xAxis: {
    type: 'category',
    data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
  },
  yAxis: [
    {
      type: 'value',
      name: 'PV',
      position: 'left',
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: 'UV',
      position: 'right',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: 'PV',
      type: 'line',
      yAxisIndex: 0,
      data: [118000, 122000, 125000, 120000, 128000, 125000, 130000],
      itemStyle: { color: '#1890ff' },
      smooth: true
    },
    {
      name: 'UV',
      type: 'line',
      yAxisIndex: 1,
      data: [8200, 8400, 8500, 8300, 8600, 8500, 8700],
      itemStyle: { color: '#52c41a' },
      smooth: true
    }
  ]
});

// 错误率分布图配置
export const getErrorRateOption = (applications: ApplicationData[]): ChartOption => ({
  title: {
    text: '应用错误率对比',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}% ({d}%)'
  },
  series: [
    {
      name: '错误率',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: applications.map(app => ({
        value: app.metrics.errorRate,
        name: app.name,
        itemStyle: {
          color: app.status === 'healthy' ? '#52c41a' :
                 app.status === 'warning' ? '#faad14' : '#ff4d4f'
        }
      }))
    }
  ]
});

// 响应时间分析图配置
export const getResponseTimeOption = (applications: ApplicationData[]): ChartOption => ({
  title: {
    text: '响应时间分析',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: applications.map(app => app.name)
  },
  yAxis: {
    type: 'value',
    name: '响应时间(ms)'
  },
  series: [
    {
      name: '平均响应时间',
      type: 'bar',
      data: applications.map(app => ({
        value: app.metrics.avgResponseTime,
        itemStyle: {
          color: app.metrics.avgResponseTime < 300 ? '#52c41a' :
                 app.metrics.avgResponseTime < 500 ? '#faad14' : '#ff4d4f'
        }
      }))
    }
  ]
});

// 环比增长趋势图配置
export const getGrowthTrendOption = (applications: ApplicationData[]): ChartOption => ({
  title: {
    text: '健康度环比增长趋势',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const appName = params[0].name;
      const currentScore = params[0].data;
      const prevScore = params[1].data;
      const growthRate = ((currentScore - prevScore) / prevScore * 100).toFixed(1);
      return `${appName}<br/>本期: ${currentScore}分<br/>上期: ${prevScore}分<br/>环比: ${growthRate}%`;
    }
  },
  legend: {
    data: ['本期', '上期'],
    bottom: 10
  },
  xAxis: {
    type: 'category',
    data: applications.map(app => app.name)
  },
  yAxis: {
    type: 'value',
    name: '健康度分数',
    min: 50,
    max: 100
  },
  series: [
    {
      name: '本期',
      type: 'bar',
      data: applications.map(app => ({
        value: app.metrics.healthScore,
        itemStyle: {
          color: app.status === 'healthy' ? '#52c41a' :
                 app.status === 'warning' ? '#faad14' : '#ff4d4f'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      })),
      animationDuration: 1500,
      animationEasing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)'
    },
    {
      name: '上期',
      type: 'bar',
      data: applications.map(app => ({
        value: app.previousMetrics?.healthScore || 0,
        itemStyle: {
          color: '#d9d9d9'
        }
      })),
      animationDuration: 1500,
      animationEasing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)'
    }
  ]
});

// 多应用核心指标对比图配置
export const getMultiAppComparisonOption = (applications: ApplicationData[]): ChartOption => ({
  title: {
    text: '多应用核心指标对比',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    data: ['平均响应时间(ms)', '错误率(%)', '健康度(分)'],
    bottom: 10
  },
  xAxis: [
    {
      type: 'category',
      data: applications.map(app => app.name),
      axisPointer: {
        type: 'shadow'
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: '响应时间(ms)',
      min: 0,
      max: 1000,
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '比率(%)',
      min: 0,
      max: 10,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    {
      type: 'value',
      name: '健康度(分)',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '平均响应时间(ms)',
      type: 'bar',
      data: applications.map(app => app.metrics.avgResponseTime),
      itemStyle: {
        color: '#1890ff'
      },
      animationDuration: 2000,
      animationEasing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)'
    },
    {
      name: '错误率(%)',
      type: 'line',
      yAxisIndex: 1,
      data: applications.map(app => app.metrics.errorRate),
      itemStyle: { color: '#ff4d4f' },
      smooth: true,
      animationDuration: 2500,
      animationEasing: 'cubicBezier(0.215, 0.61, 0.355, 1)'
    },
    {
      name: '健康度(分)',
      type: 'line',
      yAxisIndex: 2,
      data: applications.map(app => app.metrics.healthScore),
      itemStyle: { color: '#52c41a' },
      smooth: true,
      animationDuration: 3000,
      animationEasing: 'cubicBezier(0.215, 0.61, 0.355, 1)'
    }
  ]
});

// 用户地理分布图配置
export const getUserDistributionOption = (): ChartOption => ({
  title: {
    text: '用户地理分布',
    left: 'center',
    textStyle: { fontSize: 16 }
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '用户分布',
      type: 'pie',
      radius: '65%',
      center: ['50%', '60%'],
      data: [
        { value: 3500, name: '北京' },
        { value: 2800, name: '上海' },
        { value: 2200, name: '广州' },
        { value: 1800, name: '深圳' },
        { value: 1500, name: '杭州' },
        { value: 1200, name: '其他' }
      ]
    }
  ]
});

// 实时告警数据
export const mockAlerts = [
  {
    id: '1',
    type: 'error',
    app: '数据分析平台',
    message: '错误率超过5%阈值',
    time: '2分钟前',
  },
  {
    id: '2',
    type: 'warning',
    app: '用户管理系统',
    message: '响应时间超过400ms',
    time: '5分钟前',
  },
];