/** 团队效能汇总数据 */
export const teamEfficiencySummary = {
  avgCompletionRate: 85,
  avgOnTimeRate: 81,
  avgQualityScore: 87,
  topPerformer: '王测试',
  mostImproved: '陈开发',
  bottleneck: '赵架构',
};

/** 效能指标数据 */
export const efficiencyMetrics = {
  1012: {
    // 李工程师
    completionRate: 85, // 任务完成率
    onTimeRate: 70, // 按时完成率
    avgCycle: 3.2, // 平均任务周期(天)
    throughput: 16, // 故事点吞吐量
    qualityScore: 82, // 质量评分
    reworkRate: 15, // 返工率(%)
    contributionIndex: 90, // 贡献指数
    collaborationScore: 85, // 协作评分
    trend: [80, 82, 85, 83, 85], // 效能趋势
    recentPerformance: 'up', // up, same, down
  },
  1027: {
    // 王测试
    completionRate: 92,
    onTimeRate: 95,
    avgCycle: 2.1,
    throughput: 12,
    qualityScore: 94,
    reworkRate: 5,
    contributionIndex: 88,
    collaborationScore: 90,
    trend: [85, 87, 86, 88, 88],
    recentPerformance: 'same',
  },
  1066: {
    // 陈开发
    completionRate: 80,
    onTimeRate: 85,
    avgCycle: 2.8,
    throughput: 10,
    qualityScore: 88,
    reworkRate: 10,
    contributionIndex: 75,
    collaborationScore: 82,
    trend: [70, 72, 73, 74, 75],
    recentPerformance: 'up',
  },
  1025: {
    // 赵架构
    completionRate: 78,
    onTimeRate: 65,
    avgCycle: 4.5,
    throughput: 14,
    qualityScore: 90,
    reworkRate: 8,
    contributionIndex: 85,
    collaborationScore: 78,
    trend: [88, 86, 87, 86, 85],
    recentPerformance: 'down',
  },
  1005: {
    // 张经理
    completionRate: 90,
    onTimeRate: 90,
    avgCycle: 2.0,
    throughput: 0,
    qualityScore: 0,
    reworkRate: 0,
    contributionIndex: 80,
    collaborationScore: 95,
    trend: [78, 79, 80, 80, 80],
    recentPerformance: 'same',
  },
};

/** 迭代基本信息数据 */
export const iterationBasicData = [
  {
    id: 'iteration8',
    name: '迭代 8',
    timeRange: '4月20日 - 5月3日',
    teamSize: 8,
  },
  {
    id: 'iteration9',
    name: '迭代 9',
    timeRange: '5月4日 - 5月17日',
    teamSize: 8,
  },
  {
    id: 'iteration10',
    name: '迭代 10',
    timeRange: '5月18日 - 5月31日',
    teamSize: 7,
  },
  {
    id: 'iteration11',
    name: '迭代 11',
    timeRange: '6月1日 - 6月14日',
    teamSize: 8,
  },
  {
    id: 'iteration12',
    name: '迭代 12',
    timeRange: '6月15日 - 6月28日',
    teamSize: 8,
  },
];

/** 迭代计划与完成数据 */
export const iterationPlanData = [
  {
    id: 'iteration8',
    name: '迭代 8',
    plannedPoints: 38,
    actualPoints: 36,
    completionRate: 95,
    rateColor: '#52c41a',
  },
  {
    id: 'iteration9',
    name: '迭代 9',
    plannedPoints: 42,
    actualPoints: 36,
    completionRate: 86,
    rateColor: '#faad14',
  },
  {
    id: 'iteration10',
    name: '迭代 10',
    plannedPoints: 35,
    actualPoints: 35,
    completionRate: 100,
    rateColor: '#52c41a',
  },
  {
    id: 'iteration11',
    name: '迭代 11',
    plannedPoints: 40,
    actualPoints: 38,
    completionRate: 95,
    rateColor: '#52c41a',
  },
  {
    id: 'iteration12',
    name: '迭代 12',
    plannedPoints: 45,
    actualPoints: 32,
    completionRate: 71,
    rateColor: '#faad14',
  },
];

/** 效能评分趋势数据 */
export const efficiencyScoreData = [
  { iteration: '迭代8', score: 76 },
  { iteration: '迭代9', score: 82 },
  { iteration: '迭代10', score: 92 },
  { iteration: '迭代11', score: 88 },
  { iteration: '迭代12', score: 85 },
];

/** 迭代周期数据 */
export const iterationCycleData = [
  { iteration: '迭代8', cycle: 14 },
  { iteration: '迭代9', cycle: 14 },
  { iteration: '迭代10', cycle: 14 },
  { iteration: '迭代11', cycle: 14 },
  { iteration: '迭代12', cycle: 14 },
];

/** 故事点完成速度数据 */
export const storyPointSpeedData = [
  { iteration: '迭代8', speed: 2.57 },
  { iteration: '迭代9', speed: 2.57 },
  { iteration: '迭代10', speed: 2.5 },
  { iteration: '迭代11', speed: 2.71 },
  { iteration: '迭代12', speed: 2.29 },
];

/** 生产环境缺陷率数据 */
export const bugRateData = [
  { iteration: '迭代8', rate: 2.1 },
  { iteration: '迭代9', rate: 2.5 },
  { iteration: '迭代10', rate: 2.8 },
  { iteration: '迭代11', rate: 3.2 },
  { iteration: '迭代12', rate: 3.8 },
];

/** 代码返工率数据 */
export const reworkRateData = [
  { iteration: '迭代8', rate: 8.5 },
  { iteration: '迭代9', rate: 9.2 },
  { iteration: '迭代10', rate: 7.8 },
  { iteration: '迭代11', rate: 8.1 },
  { iteration: '迭代12', rate: 9.5 },
];

export const defectData = [
  {
    key: '1',
    defectId: 'BUG-2856',
    title: '大额支付偶发超时问题',
    module: '支付核心模块',
    severity: 'P0',
    environment: '生产环境',
    status: '已修复',
    discoveryTime: '6月20日',
    assignee: '李工程师',
    assigneeAvatar: 'https://picsum.photos/id/1012/200/200',
  },
  {
    key: '2',
    defectId: 'BUG-2842',
    title: 'iOS端支付结果页显示异常',
    module: '前端展示模块',
    severity: 'P1',
    environment: '预发布环境',
    status: '修复中',
    discoveryTime: '6月19日',
    assignee: '陈开发',
    assigneeAvatar: 'https://picsum.photos/id/1066/200/200',
  },
  {
    key: '3',
    defectId: 'BUG-2837',
    title: '退款接口并发处理异常',
    module: '退款模块',
    severity: 'P1',
    environment: '测试环境',
    status: '已修复',
    discoveryTime: '6月18日',
    assignee: '李工程师',
    assigneeAvatar: 'https://picsum.photos/id/1012/200/200',
  },
  {
    key: '4',
    defectId: 'BUG-2829',
    title: '支付记录查询超时',
    module: '查询模块',
    severity: 'P1',
    environment: '生产环境',
    status: '已修复',
    discoveryTime: '6月17日',
    assignee: '赵架构',
    assigneeAvatar: 'https://picsum.photos/id/1025/200/200',
  }
];