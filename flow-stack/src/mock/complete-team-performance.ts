// 模拟数据
const performanceTrendData = [
  { month: '1月', score: 76, average: 72 },
  { month: '2月', score: 78, average: 73 },
  { month: '3月', score: 80, average: 74 },
  { month: '4月', score: 82, average: 75 },
  { month: '5月', score: 81, average: 76 },
  { month: '6月', score: 86, average: 77 },
];

export const radarData = [
  { dimension: '交付速度', score: 82, benchmark: 85 },
  { dimension: '交付质量', score: 79, benchmark: 88 },
  { dimension: '团队协作', score: 91, benchmark: 85 },
  { dimension: '技术创新', score: 85, benchmark: 82 },
  { dimension: '流程规范', score: 88, benchmark: 80 },
  { dimension: '问题解决', score: 84, benchmark: 86 },
];

export const goalsData = [
  { name: '迭代完成率', target: 90, current: 92 },
  { name: '周期时间', target: 6, current: 5.2 },
  { name: '缺陷率', target: 3, current: 3.8 },
  { name: '自动化覆盖率', target: 85, current: 78 },
  { name: '协作效率', target: 90, current: 91 },
];

export const memberData = [
  {
    name: '李工程师',
    role: '前端开发',
    tasks: 24,
    score: 89,
    trend: 'up',
    quality: 92,
    collaboration: 85,
  },
  {
    name: '王测试',
    role: '测试工程师',
    tasks: 36,
    score: 92,
    trend: 'up',
    quality: 95,
    collaboration: 88,
  },
  {
    name: '陈开发',
    role: '后端开发',
    tasks: 29,
    score: 85,
    trend: 'down',
    quality: 87,
    collaboration: 90,
  },
  {
    name: '赵架构',
    role: '架构师',
    tasks: 18,
    score: 87,
    trend: 'up',
    quality: 90,
    collaboration: 84,
  },
  {
    name: '张经理',
    role: '项目经理',
    tasks: 22,
    score: 86,
    trend: 'up',
    quality: 88,
    collaboration: 95,
  },
  {
    name: '刘UI',
    role: '设计师',
    tasks: 15,
    score: 90,
    trend: 'stable',
    quality: 94,
    collaboration: 89,
  },
  {
    name: '周数据',
    role: '数据分析师',
    tasks: 12,
    score: 88,
    trend: 'up',
    quality: 91,
    collaboration: 86,
  },
  {
    name: '吴产品',
    role: '产品经理',
    tasks: 28,
    score: 84,
    trend: 'down',
    quality: 85,
    collaboration: 92,
  },
];

export const iterationData = [
  {
    name: '迭代8',
    planned: 48,
    actual: 48,
    completion: 100,
    cycle: 14,
    speed: 2.57,
  },
  {
    name: '迭代9',
    planned: 52,
    actual: 52,
    completion: 100,
    cycle: 14,
    speed: 2.57,
  },
  {
    name: '迭代10',
    planned: 60,
    actual: 56,
    completion: 93,
    cycle: 14,
    speed: 2.5,
  },
  {
    name: '迭代11',
    planned: 64,
    actual: 60,
    completion: 94,
    cycle: 14,
    speed: 2.71,
  },
  {
    name: '迭代12',
    planned: 56,
    actual: 48,
    completion: 86,
    cycle: 14,
    speed: 2.29,
  },
];

export const qualityMetricsData = [
  {
    name: '迭代8',
    productionBug: 2.1,
    codeRework: 8.5,
    testCoverage: 65,
    autoTestRatio: 45,
  },
  {
    name: '迭代9',
    productionBug: 2.5,
    codeRework: 9.2,
    testCoverage: 68,
    autoTestRatio: 52,
  },
  {
    name: '迭代10',
    productionBug: 2.8,
    codeRework: 7.8,
    testCoverage: 72,
    autoTestRatio: 60,
  },
  {
    name: '迭代11',
    productionBug: 3.2,
    codeRework: 8.1,
    testCoverage: 75,
    autoTestRatio: 68,
  },
  {
    name: '迭代12',
    productionBug: 3.8,
    codeRework: 9.5,
    testCoverage: 78,
    autoTestRatio: 75,
  },
];

const defectSeverityData = [
  { type: 'P0', value: 2 },
  { type: 'P1', value: 8 },
  { type: 'P2', value: 15 },
  { type: 'P3', value: 25 },
];

const defectModuleData = [
  { type: '支付核心', value: 35 },
  { type: '前端展示', value: 25 },
  { type: '退款模块', value: 18 },
  { type: '查询模块', value: 15 },
  { type: '其他', value: 7 },
];

const defectListData = [
  {
    id: 'BUG-2856',
    title: '大额支付偶发超时问题',
    module: '支付核心模块',
    severity: 'P0',
    environment: '生产环境',
    status: '已修复',
    date: '6月20日',
    assignee: '李工程师',
    avatar: 'https://picsum.photos/id/1012/200/200',
  },
  {
    id: 'BUG-2842',
    title: 'iOS端支付结果页显示异常',
    module: '前端展示模块',
    severity: 'P1',
    environment: '预发布环境',
    status: '修复中',
    date: '6月19日',
    assignee: '陈开发',
    avatar: 'https://picsum.photos/id/1066/200/200',
  },
  {
    id: 'BUG-2837',
    title: '退款接口并发处理异常',
    module: '退款模块',
    severity: 'P1',
    environment: '测试环境',
    status: '已修复',
    date: '6月18日',
    assignee: '李工程师',
    avatar: 'https://picsum.photos/id/1012/200/200',
  },
  {
    id: 'BUG-2829',
    title: '支付记录查询超时',
    module: '查询模块',
    severity: 'P1',
    environment: '生产环境',
    status: '已修复',
    date: '6月17日',
    assignee: '赵架构',
    avatar: 'https://picsum.photos/id/1025/200/200',
  },
];

const improvementPlanData = {
  inProgress: [
    {
      id: 1,
      title: '降低生产环境缺陷率',
      description:
        '通过增加自动化测试覆盖率和改进代码审查流程，将生产环境缺陷率从3.8%降低到3%以下',
      priority: 'P0',
      status: '滞后',
      owner: '王测试',
      ownerAvatar: 'https://picsum.photos/id/1027/200/200',
      period: '迭代12 - 迭代13',
      progress: 45,
      expectedBenefit: '缺陷率降低 21%',
      tags: ['自动化测试', '代码审查'],
    },
    {
      id: 2,
      title: '优化迭代计划准确性',
      description:
        '改进故事点估算方法，引入规划扑克和历史数据参考，提高迭代计划完成率至95%以上',
      priority: 'P1',
      status: '正常',
      owner: '张经理',
      ownerAvatar: 'https://picsum.photos/id/1005/200/200',
      period: '迭代12 - 迭代14',
      progress: 60,
      expectedBenefit: '计划准确性提升 15%',
      tags: ['计划管理', '估算方法'],
    },
    {
      id: 3,
      title: '技术债务清理计划',
      description:
        '系统性清理核心模块技术债务，提高代码质量和可维护性，降低长期维护成本',
      priority: 'P1',
      status: '滞后',
      owner: '赵架构',
      ownerAvatar: 'https://picsum.photos/id/1025/200/200',
      period: '迭代11 - 迭代15',
      progress: 35,
      expectedBenefit: '维护成本降低 30%',
      tags: ['技术优化', '代码重构'],
    },
  ],
  completed: [
    {
      id: 101,
      title: '提高代码审查覆盖率',
      description:
        '通过自动化提醒和审查流程优化，将代码审查覆盖率从85%提升至96%',
      owner: '赵架构',
      ownerAvatar: 'https://picsum.photos/id/1025/200/200',
      completionDate: '迭代11',
      actualBenefit: '覆盖率提升 13%',
      tags: ['代码审查', '流程优化'],
    },
    {
      id: 102,
      title: '优化自动化测试流程',
      description:
        '引入CI/CD流水线自动化测试，减少人工测试成本，提高测试效率30%',
      owner: '王测试',
      ownerAvatar: 'https://picsum.photos/id/1027/200/200',
      completionDate: '迭代10',
      actualBenefit: '测试效率提升 35%',
      tags: ['自动化测试', 'CI/CD'],
    },
  ],
};

const performanceImprovementData = [
  { name: '代码审查优化', before: 85, after: 96 },
  { name: '自动化测试', before: 62, after: 85 },
  { name: '计划准确性', before: 82, after: 92 },
  { name: '技术债务清理', before: 65, after: 78 },
];

export {
  performanceTrendData,
  defectSeverityData,
  defectModuleData,
  defectListData,
  improvementPlanData,
  performanceImprovementData,
};
