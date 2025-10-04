/** 项目概览数据 */
export const projectOverviewData = {
  progress: 68,
  remainingDays: 42,
  deadline: '2023-07-30',
  unfinishedTasks: 24,
  overdueTasks: 8,
  risks: 3,
  newRisks: 1,
  completedMilestones: 3,
  totalMilestones: 5,
  nextMilestone: '支付核心模块完成',
};

/** 项目里程碑数据 */
export const milestones = [
  {
    title: '需求分析与规划完成',
    planned: '2023-03-15',
    actual: '2023-03-12',
    description: '完成了所有业务需求分析和技术方案设计',
    status: 'completed',
  },
  {
    title: '架构设计评审通过',
    planned: '2023-03-30',
    actual: '2023-03-28',
    description: '完成核心架构设计并通过技术评审',
    status: 'completed',
  },
  {
    title: '基础框架搭建完成',
    planned: '2023-04-15',
    actual: '2023-04-15',
    description: '完成项目基础框架和基础设施搭建',
    status: 'completed',
  },
  {
    title: '支付核心模块完成',
    planned: '2023-06-30',
    actual: null,
    description: '包含支付流程、安全验证和交易记录',
    status: 'in-progress',
  },
  {
    title: '系统上线发布',
    planned: '2023-07-30',
    actual: null,
    description: '完成生产环境部署和灰度发布',
    status: 'pending',
  },
];

/** 项目进度趋势数据 */
export const progressTrendData = [
  { week: '第1周', planned: 5, actual: 5 },
  { week: '第2周', planned: 12, actual: 10 },
  { week: '第3周', planned: 20, actual: 15 },
  { week: '第4周', planned: 28, actual: 22 },
  { week: '第5周', planned: 35, actual: 28 },
  { week: '第6周', planned: 42, actual: 35 },
  { week: '第7周', planned: 50, actual: 40 },
  { week: '第8周', planned: 58, actual: 45 },
  { week: '第9周', planned: 65, actual: 52 },
  { week: '第10周', planned: 72, actual: 58 },
  { week: '第11周', planned: 85, actual: 63 },
  { week: '第12周', planned: 100, actual: 68 },
];

// 进度趋势图配置
export const progressTrendConfig: any = {
  data: progressTrendData,
  xField: 'week',
  yField: ['planned', 'actual'],
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: false,
  legend: {
    position: 'top',
  },
  yAxis: {
    title: {
      text: '项目进度 (%)',
    },
    formatter: (value: any) => `${value}%`,
  },
};

/** 项目健康状态数据 */
export const healthData: any = [
  { name: '进度健康度', value: 72, threshold: 80 },
  { name: '质量健康度', value: 85, threshold: 80 },
  { name: '资源健康度', value: 65, threshold: 70 },
  { name: '风险健康度', value: 55, threshold: 70 },
  { name: '成本健康度', value: 90, threshold: 80 },
  { name: '需求稳定性', value: 80, threshold: 75 },
];

/** 团队负荷数据 */
export const teamLoadData = [
  {
    name: '李工程师',
    load: 115,
    tasks: 8,
    points: 16,
    color: 'blue',
    performanceScore: 85,
    qualityIndex: 85,
    collaborationIndex: 85,
    module: '支付核心模块',
    completedTasks: 8,
    trend:5,
    avatar: 'https://picsum.photos/id/1012/200/200',
    role: '后端开发',
    position: '后端开发工程师',
  },
  {
    name: '王测试',
    load: 90,
    tasks: 6,
    points: 12,
    trend: -10,
    completedTasks: 6,
    performanceScore: 80,
    qualityIndex: 80,
    collaborationIndex: 80,
    module: '全模块测试',
    avatar: 'https://picsum.photos/id/1027/200/200',
    role: '质量保障',
    color: 'purple',
    position: '测试工程师',
  },
  {
    name: '陈开发',
    load: 75,
    tasks: 5,
    points: 10,
    trend: 10,
    completedTasks: 5,
    performanceScore: 85,
    qualityIndex: 85,
    collaborationIndex: 85,
    module: '支付前端界面',
    color: 'blue',
    avatar: 'https://picsum.photos/id/1066/200/200',
    role: '前端开发',
    position: '前端开发工程师',
  },
  {
    name: '赵架构',
    load: 105,
    tasks: 7,
    points: 14,
    trend: -5,
    completedTasks: 7,
    performanceScore: 85,
    qualityIndex: 85,
    collaborationIndex: 85,
    module: '架构设计、技术难点',
    avatar: 'https://picsum.photos/id/1025/200/200',
    role: '技术负责人',
    color: 'gold',
    position: '架构师',
  },
  {
    name: '张经理',
    load: 60,
    tasks: 4,
    points: 0,
    trend: 0,
    completedTasks: 4,
    performanceScore: 80,
    qualityIndex: 80,
    collaborationIndex: 80,
    module: '项目计划、风险管理',
    avatar: 'https://picsum.photos/id/1005/200/200',
    role: '项目管理',
    color: 'gray',
    position: '项目经理',
  },
];

/** 任务数据 */
export const tasks = {
  backlog: [
    {
      id: 'T286',
      title: '优化支付超时处理机制',
      priority: 'high',
      assignee: '李工程师',
      avatar: 'https://picsum.photos/id/1012/200/200',
      dueDate: '2023-06-30',
    },
    {
      id: 'T285',
      title: '实现退款进度查询API',
      priority: 'medium',
      assignee: '陈开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
      dueDate: '2023-07-05',
    },
    {
      id: 'T284',
      title: '完善支付日志查询界面',
      priority: 'low',
      assignee: '陈开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
      dueDate: '2023-07-10',
    },
  ],
  inProgress: [
    {
      id: 'T283',
      title: '修复大额支付偶发失败问题',
      priority: 'high',
      assignee: '李工程师',
      avatar: 'https://picsum.photos/id/1012/200/200',
      dueDate: '2023-06-25',
      status: 'overdue',
      remaining: 2,
    },
    {
      id: 'T282',
      title: '集成新的第三方支付渠道',
      priority: 'medium',
      assignee: '李工程师, 赵架构',
      avatar: [
        'https://picsum.photos/id/1012/200/200',
        'https://picsum.photos/id/1025/200/200',
      ],
      dueDate: '2023-07-02',
      remaining: 3,
    },
    {
      id: 'T281',
      title: '实现支付结果异步通知处理',
      priority: 'medium',
      assignee: '李工程师',
      avatar: 'https://picsum.photos/id/1012/200/200',
      dueDate: '2023-06-28',
      remaining: 1,
    },
  ],
  inReview: [
    {
      id: 'T280',
      title: '优化支付流程前端交互',
      priority: 'medium',
      assignee: '陈开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
      completedDate: '2023-06-25',
      reviewer: '王测试',
    },
    {
      id: 'T279',
      title: '修复iOS端支付结果页显示异常',
      priority: 'high',
      assignee: '陈开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
      completedDate: '2023-06-26',
      reviewer: '王测试',
    },
  ],
  completed: [
    {
      id: 'T278',
      title: '实现支付密码验证功能',
      priority: 'medium',
      assignee: '李工程师',
      avatar: 'https://picsum.photos/id/1012/200/200',
      completedDate: '2023-06-20',
    },
    {
      id: 'T277',
      title: '完善支付相关文档',
      priority: 'low',
      assignee: '张经理',
      avatar: 'https://picsum.photos/id/1005/200/200',
      completedDate: '2023-06-18',
    },
    {
      id: 'T276',
      title: '修复支付记录查询超时问题',
      priority: 'high',
      assignee: '赵架构',
      avatar: 'https://picsum.photos/id/1025/200/200',
      completedDate: '2023-06-17',
    },
  ],
};

/** 任务状态分布数据 */
export const taskStatusData = [
  { status: '已完成', value: 62, color: '#52C41A' },
  { status: '进行中', value: 10, color: '#165DFF' },
  { status: '待审核', value: 6, color: '#FAAD14' },
  { status: '待处理', value: 8, color: '#8C8C8C' },
];

/** 任务优先级分布数据 */
export const taskPriorityData = [
  { priority: '高优先级', value: 25, color: '#F5222D' },
  { priority: '中优先级', value: 45, color: '#FAAD14' },
  { priority: '低优先级', value: 30, color: '#165DFF' },
];

/** 迭代燃尽图数据 */
export const burnDownData = [
  { date: '6/15', planned: 45, actual: 45 },
  { date: '6/16', planned: 41, actual: 42 },
  { date: '6/17', planned: 36, actual: 39 },
  { date: '6/18', planned: 32, actual: 37 },
  { date: '6/19', planned: 28, actual: 35 },
  { date: '6/20', planned: 24, actual: 35 },
  { date: '6/21', planned: 20, actual: 35 },
  { date: '6/22', planned: 16, actual: 34 },
  { date: '6/23', planned: 12, actual: 34 },
  { date: '6/24', planned: 8, actual: 33 },
  { date: '6/25', planned: 4, actual: 32 },
  { date: '6/26', planned: 0, actual: 32 },
];

/** 项目活动数据 */
export const activities = [
  {
    user: '李工程师',
    action: '完成了任务',
    target: '#T278 实现支付密码验证功能',
    time: '今天 14:30',
    type: 'complete',
  },
  {
    user: '陈开发',
    action: '将任务',
    target: '#T279 修复iOS端支付结果页显示异常',
    detail: '从 进行中 移至 待审核',
    time: '今天 11:15',
    type: 'move',
  },
  {
    user: '张经理',
    action: '将任务',
    target: '#T283 修复大额支付偶发失败问题',
    detail: '分配给 李工程师',
    time: '昨天 16:45',
    type: 'assign',
  },
  {
    user: '系统',
    action: '任务',
    target: '#T283 修复大额支付偶发失败问题',
    detail: '已逾期',
    time: '昨天 09:00',
    type: 'system',
  },
  {
    user: '王测试',
    action: '对任务',
    target: '#T280 优化支付流程前端交互',
    detail: '发表了评论',
    comment: '建议增加支付超时的友好提示，目前的提示不够明确。',
    time: '昨天 08:30',
    type: 'comment',
  },
];

/** 风险数据 */
export const risks = [
  {
    id: 'R-001',
    description: '第三方支付接口稳定性不足',
    detail: '新接入的第三方支付渠道接口响应时间不稳定，偶发超时',
    scope: '支付功能',
    probability: '中',
    impact: '高',
    status: '处理中',
    measures: ['1. 实现接口超时重试机制', '2. 准备备用支付渠道'],
    owner: '赵架构',
    ownerAvatar: 'https://picsum.photos/id/1025/200/200',
  },
  {
    id: 'R-002',
    description: '核心开发人员负荷过高',
    detail: '李工程师和赵架构当前负荷超过100%，存在 burnout 风险',
    scope: '整体进度',
    probability: '高',
    impact: '中',
    status: '计划中',
    measures: ['1. 任务重新分配，减轻负荷', '2. 申请临时资源支持'],
    owner: '张经理',
    ownerAvatar: 'https://picsum.photos/id/1005/200/200',
  },
  {
    id: 'R-003',
    description: '技术文档完善进度滞后',
    detail: '核心模块设计文档和API文档更新不及时，影响后续维护',
    scope: '维护与扩展',
    probability: '中',
    impact: '低',
    status: '计划中',
    measures: ['1. 安排专人负责文档更新', '2. 将文档完善纳入迭代任务'],
    owner: '张经理',
    ownerAvatar: 'https://picsum.photos/id/1005/200/200',
  },
];

/** 风险趋势数据 */
export const projectRiskTrendData = [
  { week: '第1周', high: 0, medium: 1, low: 2 },
  { week: '第2周', high: 1, medium: 1, low: 2 },
  { week: '第3周', high: 1, medium: 2, low: 1 },
  { week: '第4周', high: 0, medium: 2, low: 2 },
  { week: '第5周', high: 0, medium: 1, low: 2 },
  { week: '第6周', high: 0, medium: 1, low: 3 },
  { week: '第7周', high: 0, medium: 1, low: 2 },
  { week: '第8周', high: 1, medium: 1, low: 1 },
];

/** 风险矩阵数据 */
export const riskMatrixData = [
  { x: 80, y: 90, risk: 'R-001: 第三方支付接口稳定性不足', level: 'high' },
  { x: 70, y: 60, risk: 'R-002: 核心开发人员负荷过高', level: 'medium' },
  { x: 40, y: 50, risk: 'R-003: 技术文档完善进度滞后', level: 'low' },
];

/** 角色分配数据 */
export const roleAllocationData = [
  { role: '后端开发', value: 40, color: '#165DFF' },
  { role: '前端开发', value: 20, color: '#0FC6C2' },
  { role: '测试工程师', value: 15, color: '#722ED1' },
  { role: '架构师', value: 15, color: '#FF7D00' },
  { role: '项目经理', value: 10, color: '#8C8C8C' },
];

/** 模块分配数据 */
export const moduleAllocationData = [
  { module: '支付核心', value: 35 },
  { module: '前端展示', value: 25 },
  { module: '退款模块', value: 18 },
  { module: '查询模块', value: 12 },
  { module: '安全模块', value: 10 },
];

/** 资源预测数据 */
export const resourceForecastData = [
  { iteration: '迭代12', required: 8, available: 8 },
  { iteration: '迭代13', required: 8, available: 8 },
  { iteration: '迭代14', required: 10, available: 8 },
];

/** 文档数据 */
export const documents = {
  requirements: {
    iconColor: '#1890ff',
    title: '需求文档',
    total: 100,
    list: [
      {
        id: 'D101',
        title: '支付系统功能需求规格说明书',
        owner: '张经理',
        date: '2023-03-10',
        status: 'latest',
      },
      {
        id: 'D102',
        title: '用户支付流程需求分析',
        owner: '张经理',
        date: '2023-03-05',
        status: 'latest',
      },
      {
        id: 'D103',
        title: '第三方支付接口需求文档',
        owner: '李工程师',
        date: '2023-03-20',
        status: 'update',
      },
    ],
  },
  design: {
    title: '设计文档',
    iconColor: '#722ed1',
    total: 10,
    list: [
      {
        id: 'D201',
        title: '支付系统架构设计文档',
        owner: '赵架构',
        date: '2023-04-01',
        views: 86,
        status: 'latest',
      },
      {
        id: 'D202',
        title: '数据库设计说明书',
        owner: '李工程师',
        date: '2023-04-10',
        views: 52,
        status: 'latest',
      },
      {
        id: 'D203',
        title: 'API接口设计文档',
        owner: '李工程师',
        date: '2023-04-15',
        views: 64,
        status: 'update',
      },
    ],
  },
  test: {
    title: '测试文档',
    iconColor: '#52c41a',
    total: 30,
    list: [
      {
        id: 'D301',
        title: '支付功能测试用例',
        owner: '王测试',
        date: '2023-06-15',
        status: 'latest',
      },
      {
        id: 'D302',
        title: '性能测试报告 v2.0',
        owner: '王测试',
        date: '2023-06-10',
        status: 'latest',
      },
      {
        id: 'D303',
        title: '安全测试报告',
        owner: '王测试',
        date: '2023-05-28',
        status: 'latest',
      },
    ],
  },
};

/** 最近更新文档 */
export const recentDocuments = [
  {
    id: 'D301',
    title: '支付系统功能测试用例 v3.2',
    owner: '王测试',
    date: '今天 14:30',
    downloads: 12,
    type: 'pdf',
  },
  {
    id: 'D204',
    title: '支付核心模块开发说明',
    owner: '李工程师',
    date: '昨天 16:45',
    downloads: 8,
    type: 'word',
  },
  {
    id: 'D205',
    title: '前端组件设计规范 v1.1',
    owner: '陈开发',
    date: '昨天 11:20',
    downloads: 15,
    type: 'code',
  },
  {
    id: 'D401',
    title: '项目中期汇报演示文稿',
    owner: '张经理',
    date: '2023-06-20',
    downloads: 23,
    type: 'ppt',
  },
];

/** 文档统计数据 */
export const documentStatsData = [
  { month: '3月', new: 10, views: 35 },
  { month: '4月', new: 8, views: 62 },
  { month: '5月', new: 6, views: 78 },
  { month: '6月', new: 8, views: 81 },
];

/** 健康状态图配置 */
export const healthConfig: any = {
  data: healthData,
  xField: 'name',
  yField: 'value',
  meta: {
    value: {
      alias: '健康指数',
    },
  },
  point: {
    size: 5,
    shape: 'diamond',
  },
  line: {
    style: {
      lineWidth: 2,
    },
  },
  legend: false,
  xAxis: {
    label: {
      autoRotate: true,
    },
  },
  yAxis: {
    min: 50,
    max: 100,
    label: {
      formatter: (v: number) => `${v}分`,
    },
  },
};

/** 任务状态图配置 */
export const taskStatusConfig = {
  data: taskStatusData,
  angleField: 'value',
  colorField: 'status',
  color: (datum: any) => datum.color,
  radius: 0.7,
  label: {
    type: 'outer',
    content: '{name}: {percentage}',
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
};

/** 任务优先级图配置 */
export const taskPriorityConfig = {
  data: taskPriorityData,
  angleField: 'value',
  colorField: 'priority',
  color: (datum: any) => datum.color,
  radius: 0.7,
  label: {
    type: 'outer',
    content: '{name}: {percentage}',
  },
  interactions: [
    {
      type: 'element-active',
    },
  ],
};

/** 燃尽图配置 */
export const burnDownConfig = {
  data: burnDownData,
  xField: 'date',
  yField: 'value',
  seriesField: 'type',
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: {
    style: {
      fill: '#aaa',
    },
  },
  legend: {
    position: 'top',
  },
  yAxis: {
    title: {
      text: '剩余故事点',
    },
  },
};

/** 风险趋势图配置 */
export const riskTrendConfig = {
  data: projectRiskTrendData,
  xField: 'week',
  yField: 'value',
  seriesField: 'level',
  point: {
    size: 5,
    shape: 'diamond',
  },
  label: {
    style: {
      fill: '#aaa',
    },
  },
  legend: {
    position: 'top',
  },
  yAxis: {
    title: {
      text: '风险数量',
    },
    tickCount: 5,
  },
};

/** 风险矩阵图配置 */
export const riskMatrixConfig = {
  data: riskMatrixData,
  xField: 'x',
  yField: 'y',
  pointSize: 30,
  pointStyle: (datum: any) => {
    const colorMap = {
      high: '#F5222D',
      medium: '#FAAD14',
      low: '#165DFF',
    };
    return {
      fill: colorMap[datum.level as 'high' | 'medium' | 'low'],
      stroke: '#fff',
      lineWidth: 2,
    };
  },
  xAxis: {
    min: 0,
    max: 100,
    title: {
      text: '影响程度 (高 →)',
    },
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: '可能性 (高 ↑)',
    },
  },
  tooltip: {
    formatter: (datum: any) => {
      return { name: '风险', value: datum.risk };
    },
  },
};

/** 角色分配图配置 */
export const roleAllocationConfig = {
  data: roleAllocationData,
  angleField: 'value',
  colorField: 'role',
  color: (datum: any) => datum.color,
  radius: 0.7,
  label: {
    type: 'spider',
    labelHeight: 28,
  },
  interactions: [{ type: 'element-active' }],
};

/** 模块分配图配置 */
export const moduleAllocationConfig = {
  data: moduleAllocationData,
  xField: 'module',
  yField: 'value',
  meta: {
    value: {
      formatter: (v: number) => `${v}%`,
    },
  },
  label: {
    position: 'middle',
    style: {
      fill: '#FFFFFF',
      opacity: 0.6,
    },
  },
  xAxis: {
    label: {
      autoRotate: true,
    },
  },
};

/** 资源预测图配置 */
export const resourceForecastConfig = {
  data: resourceForecastData,
  xField: 'iteration',
  yField: 'value',
  seriesField: 'type',
  legend: {
    position: 'top',
  },
  xAxis: {
    label: {
      autoRotate: true,
    },
  },
  yAxis: {
    title: {
      text: '人数',
    },
    tickCount: 5,
  },
};

/** 文档统计图表配置 */
export const documentStatsConfig = {
  data: documentStatsData,
  xField: 'month',
  yField: 'value',
  seriesField: 'type',
  legend: {
    position: 'top',
  },
  yAxis: {
    title: {
      text: '数量',
    },
    min: 0,
  },
};

/** 项目管理页面标签页枚举 */
export const PROJECT_TABS: Record<
  string,
  { key: string; title: string; description: string }
> = {
  overview: {
    key: 'overview',
    title: '项目概览',
    description: '全面掌握项目进度、健康状态和关键指标',
  },
  tasks: {
    key: 'tasks',
    title: '任务管理',
    description: '跟踪和管理项目任务的分配与进度',
  },
  risks: {
    key: 'risks',
    title: '风险管理',
    description: '识别、评估和应对项目风险',
  },
  resources: {
    key: 'resources',
    title: '资源分配',
    description: '团队资源分配与负荷情况分析',
  },
  documents: {
    key: 'documents',
    title: '项目文档',
    description: '管理和查阅项目相关文档',
  },
};

/** 项目管理页面标签页 keys 数组 */
export const PROJECT_TAB_KEYS = Object.keys(PROJECT_TABS);

/** 项目列表数据 */
export const projects = [
  {
    value: 'payment-refactor',
    label: '支付系统重构项目',
    description: '重构现有支付系统，提升性能和安全性',
    startDate: '2023-03-01',
    endDate: '2023-07-30',
    manager: '张经理',
    status: '进行中',
    members: 12,
  },
  {
    value: 'mobile-app-v2', 
    label: '移动端应用 v2.0 开发',
    description: '开发移动应用新版本，添加新功能和优化用户体验',
    startDate: '2023-04-15',
    endDate: '2023-09-15',
    manager: '李工程师',
    status: '已完成',
    members: 8,
  },
  {
    value: 'data-platform',
    label: '数据平台建设',
    description: '构建企业级数据平台，支持数据分析和决策',
    startDate: '2023-02-01',
    endDate: '2023-12-31',
    manager: '王架构师',
    status: '进行中',
    members: 15,
  },
];

/** 优先级配置 */
export const priorityConfig = {
  high: {
    color: 'red',
    text: '高',
  },
  medium: {
    color: 'orange',
    text: '中',
  },
  low: {
    color: 'green',
    text: '低',
  },
};
