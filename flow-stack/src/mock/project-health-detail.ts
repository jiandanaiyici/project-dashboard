// 健康维度数据
export const healthDimensions = [
  {
    name: '进度健康度',
    score: 72,
    trend: -5,
    weight: 25,
    status: 'warning',
    description: '项目进度落后于计划约5%，主要受第三方接口集成延迟影响',
  },
  {
    name: '质量健康度',
    score: 85,
    trend: +3,
    weight: 25,
    status: 'success',
    description: '代码质量良好，测试通过率95%，较上周期提升3%',
  },
  {
    name: '资源健康度',
    score: 65,
    trend: -2,
    weight: 20,
    status: 'warning',
    description: '2名核心开发人员负荷过高，存在 burnout 风险',
  },
  {
    name: '风险健康度',
    score: 55,
    trend: -8,
    weight: 15,
    status: 'error',
    description: '新增1个高优先级风险，需立即关注第三方支付接口稳定性问题',
  },
  {
    name: '需求稳定性',
    score: 80,
    trend: 0,
    weight: 15,
    status: 'success',
    description: '需求变更控制良好，本周期变更率仅为3%，在可接受范围内',
  },
];

// 健康趋势数据
export const healthTrendData = [
  {
    date: '第1周',
    overall: 82,
    schedule: 85,
    quality: 82,
    resources: 78,
    risks: 75,
    requirements: 80,
  },
  {
    date: '第2周',
    overall: 80,
    schedule: 83,
    quality: 83,
    resources: 77,
    risks: 73,
    requirements: 80,
  },
  {
    date: '第3周',
    overall: 79,
    schedule: 80,
    quality: 84,
    resources: 76,
    risks: 72,
    requirements: 80,
  },
  {
    date: '第4周',
    overall: 78,
    schedule: 78,
    quality: 85,
    resources: 75,
    risks: 70,
    requirements: 80,
  },
  {
    date: '第5周',
    overall: 76,
    schedule: 72,
    quality: 85,
    resources: 65,
    risks: 55,
    requirements: 80,
  },
];

// 问题清单数据
export const issuesData = [
  {
    id: 'ISSUE-001',
    title: '第三方支付接口响应延迟',
    dimension: '进度健康度',
    severity: '高',
    impact: '支付流程可能超时失败',
    status: '处理中',
    owner: '赵架构',
    deadline: '2023-07-05',
    progress: 60,
  },
  {
    id: 'ISSUE-002',
    title: '核心开发人员负荷过高',
    dimension: '资源健康度',
    severity: '中',
    impact: '可能导致进度延迟和质量下降',
    status: '计划中',
    owner: '张经理',
    deadline: '2023-07-03',
    progress: 0,
  },
  {
    id: 'ISSUE-003',
    title: '支付安全测试发现3个高危漏洞',
    dimension: '质量健康度',
    severity: '高',
    impact: '可能存在支付安全风险',
    status: '处理中',
    owner: '李工程师',
    deadline: '2023-06-30',
    progress: 70,
  },
  {
    id: 'ISSUE-004',
    title: 'API文档更新不及时',
    dimension: '质量健康度',
    severity: '低',
    impact: '影响团队协作效率',
    status: '未开始',
    owner: '陈开发',
    deadline: '2023-07-10',
    progress: 0,
  },
];

// 改进建议数据
export const recommendations = [
  {
    id: 'REC-001',
    title: '增加临时开发资源',
    dimension: '资源健康度',
    priority: '高',
    expectedImpact: '资源健康度提升15-20分',
    implementationEffort: '低',
    status: '待审批',
  },
  {
    id: 'REC-002',
    title: '实现支付接口降级方案',
    dimension: '进度健康度、风险健康度',
    priority: '高',
    expectedImpact: '风险健康度提升20-25分',
    implementationEffort: '中',
    status: '实施中',
  },
  {
    id: 'REC-003',
    title: '增加代码审查频率',
    dimension: '质量健康度',
    priority: '中',
    expectedImpact: '质量健康度提升5-10分',
    implementationEffort: '中',
    status: '已采纳',
  },
];

// 风险与问题关联数据
export const riskIssueCorrelation = [
  { risk: '第三方依赖风险', issues: 3, impact: 85 },
  { risk: '资源不足风险', issues: 2, impact: 70 },
  { risk: '技术复杂度风险', issues: 1, impact: 40 },
  { risk: '需求变更风险', issues: 0, impact: 10 },
];
