import { delay } from '@/utils';

export const queryAnalyzeReleaseReadinessService = async () => {
  delay(1000);
  return {
    /** 发布就绪度评分 0-100 */
    releaseReadinessScore: 78,
    /** 发布风险等级: 低, 中, 高 */
    releaseRiskLevel: '中',

    /** 各维度就绪度 */
    dimensionScores: [
      { dimension: '功能完整性', score: 85, status: '良好' },
      { dimension: '测试覆盖率', score: 72, status: '一般' },
      { dimension: '性能指标', score: 80, status: '良好' },
      { dimension: '稳定性', score: 65, status: '风险' },
      { dimension: '文档完整性', score: 90, status: '优秀' },
    ],

    /** 未完成关键任务 */
    pendingCriticalTasks: [
      {
        id: 'T283',
        title: '修复大额支付偶发失败问题',
        priority: '高',
        owner: '李工程师',
        dueDate: '2023-06-25',
        status: '逾期',
      },
      {
        id: 'T282',
        title: '集成新的第三方支付渠道',
        priority: '中',
        owner: '李工程师',
        dueDate: '2023-07-02',
        status: '进行中',
      },
    ],

    /** 已知缺陷 */
    knownDefects: [
      {
        severity: '严重',
        count: 1,
        details: ['支付超时处理机制存在漏洞'],
      },
      {
        severity: '主要',
        count: 3,
        details: ['部分浏览器兼容性问题, 退款流程偶发卡顿, 金额显示格式错误'],
      },
      {
        severity: '次要',
        count: 8,
        details: ['UI显示不一致, 提示信息不明确等'],
      },
    ],

    /** 最近测试结果趋势 */
    testTrend: [
      { date: '6/20', passRate: 75, defects: 12 },
      { date: '6/22', passRate: 78, defects: 10 },
      { date: '6/24', passRate: 82, defects: 7 },
      { date: '6/26', passRate: 85, defects: 4 },
      { date: '6/28', passRate: 88, defects: 4 },
    ],

    /** 性能测试结果 */
    performanceMetrics: {
      responseTime: { current: 1.2, target: 1.0, status: '风险' },
      throughput: { current: 950, target: 1000, status: '风险' },
      errorRate: { current: 0.3, target: 0.5, status: '良好' },
      cpuUsage: { current: 65, target: 80, status: '良好' },
      memoryUsage: { current: 70, target: 85, status: '良好' },
    },
  };
};

// 生成发布建议
export const generateReleaseRecommendations = (readinessData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // 建议的发布策略
        recommendedStrategy: '分阶段灰度发布',

        // 建议发布时间
        recommendedTimeline: {
          targetDate: '2023-07-10',
          readinessDate: '2023-07-05', // 预计就绪时间
          rationale: '给予5天时间修复关键缺陷和完成未决任务',
          confidence: 85, // 时间预测可信度%
        },

        // 发布前必须完成的事项
        prerequisites: [
          {
            item: '修复T283严重缺陷',
            owner: '李工程师',
            estimatedTime: '2天',
            criticality: '必须',
          },
          {
            item: '完成第三方支付渠道集成',
            owner: '李工程师',
            estimatedTime: '3天',
            criticality: '必须',
          },
          {
            item: '性能优化至目标值',
            owner: '赵架构',
            estimatedTime: '2天',
            criticality: '必须',
          },
          {
            item: '完成最终回归测试',
            owner: '王测试',
            estimatedTime: '1天',
            criticality: '必须',
          },
        ],

        // 发布计划
        releasePlan: {
          phase1: {
            scope: '内部测试环境部署',
            date: '2023-07-10',
            audience: '开发和测试团队',
            percentage: 'N/A',
            focus: '功能验证和基本性能测试',
          },
          phase2: {
            scope: '灰度发布',
            date: '2023-07-12',
            audience: '内部员工 + 5%真实用户',
            percentage: '5%',
            focus: '真实环境行为观察和问题收集',
          },
          phase3: {
            scope: '扩大灰度',
            date: '2023-07-15',
            audience: '20%真实用户',
            percentage: '20%',
            focus: '性能监控和稳定性评估',
          },
          phase4: {
            scope: '全面发布',
            date: '2023-07-18',
            audience: '所有用户',
            percentage: '100%',
            focus: '全量监控和快速响应',
          },
        },

        // 风险缓解措施
        riskMitigation: [
          {
            risk: '支付功能故障导致交易失败',
            impact: '高',
            probability: '中',
            mitigation:
              '1. 实施开关控制, 可快速回滚有问题功能; 2. 准备应急预案, 必要时切换至旧版本',
            owner: '张经理',
          },
          {
            risk: '性能未达预期影响用户体验',
            impact: '中',
            probability: '中',
            mitigation:
              '1. 实施流量控制; 2. 准备扩容方案; 3. 优先保障核心支付流程',
            owner: '赵架构',
          },
          {
            risk: '第三方接口兼容性问题',
            impact: '中',
            probability: '高',
            mitigation:
              '1. 增加监控告警; 2. 准备备用接口方案; 3. 制定快速切换流程',
            owner: '李工程师',
          },
        ],

        // 发布准备检查清单
        checklist: [
          {
            category: '功能验证',
            items: [
              '所有关键功能已验证',
              '所有P0/P1缺陷已修复',
              '功能文档已更新',
              '用户手册已准备',
            ],
          },
          {
            category: '质量保障',
            items: [
              '测试覆盖率达到90%以上',
              '性能测试通过',
              '安全测试通过',
              '兼容性测试完成',
            ],
          },
          {
            category: '发布准备',
            items: [
              '部署脚本已验证',
              '回滚方案已准备',
              '监控指标已配置',
              '发布通知已发送',
              '相关团队已准备支持',
            ],
          },
        ],

        // 发布后监控重点
        monitoringFocus: [
          { metric: '支付成功率', target: '>99.9%', priority: '高' },
          { metric: '平均响应时间', target: '<1.0s', priority: '高' },
          { metric: '系统错误率', target: '<0.1%', priority: '高' },
          { metric: '用户反馈数量', target: '<50条/天', priority: '中' },
          { metric: '服务器资源使用率', target: '<80%', priority: '中' },
        ],
      });
    }, 1800);
  });
};

export const queryPredictRisksService = async () => {
  await delay(1000);
  return {
    riskScore: 68, // 整体风险分数 0-100，越高风险越大
    riskTrend: 'increasing', // 风险趋势: increasing, decreasing, stable
    predictedRisks: [
      {
        id: 'PR-001',
        description: '核心开发人员负荷持续过高导致进度延误',
        category: '资源风险',
        probability: 85, // 发生概率%
        impact: 90, // 影响程度%
        predictedOccurrence: '未来2周内',
        confidence: 92, // 预测可信度%
        contributingFactors: [
          { factor: '当前负荷率', value: 115, weight: 0.35 },
          { factor: '任务复杂度', value: '高', weight: 0.25 },
          { factor: '人员稳定性', value: '中', weight: 0.2 },
          { factor: '近期休假计划', value: '多', weight: 0.2 },
        ],
      },
      {
        id: 'PR-002',
        description: '第三方支付接口兼容性问题导致功能异常',
        category: '技术风险',
        probability: 65,
        impact: 85,
        predictedOccurrence: '未来3周内',
        confidence: 88,
        contributingFactors: [
          { factor: '接口版本变更频率', value: '高', weight: 0.4 },
          { factor: '历史兼容性问题', value: 5, weight: 0.3 },
          { factor: '测试覆盖率', value: 75, weight: 0.3 },
        ],
      },
      {
        id: 'PR-003',
        description: '需求变更频繁导致返工率上升',
        category: '需求风险',
        probability: 70,
        impact: 75,
        predictedOccurrence: '未来4周内',
        confidence: 85,
        contributingFactors: [
          { factor: '历史变更频率', value: '高', weight: 0.4 },
          { factor: '需求明确度', value: 60, weight: 0.3 },
          { factor: '利益相关方数量', value: 8, weight: 0.3 },
        ],
      },
      {
        id: 'PR-004',
        description: '性能未达预期导致用户体验下降',
        category: '性能风险',
        probability: 45,
        impact: 80,
        predictedOccurrence: '未来5周内',
        confidence: 76,
        contributingFactors: [
          { factor: '当前响应时间', value: '1.2s', weight: 0.3 },
          { factor: '并发用户增长', value: '15%/周', weight: 0.4 },
          { factor: '性能测试覆盖', value: 65, weight: 0.3 },
        ],
      },
    ],
    riskDistribution: [
      { category: '资源风险', value: 35 },
      { category: '技术风险', value: 25 },
      { category: '需求风险', value: 20 },
      { category: '性能风险', value: 10 },
      { category: '其他风险', value: 10 },
    ],
    riskTimeline: [
      { week: '第1周', high: 1, medium: 2, low: 2 },
      { week: '第2周', high: 1, medium: 3, low: 2 },
      { week: '第3周', high: 2, medium: 3, low: 1 },
      { week: '第4周', high: 2, medium: 2, low: 2 },
      { week: '第5周', high: 2, medium: 3, low: 1 },
    ],
  };
};

export async function generateOptimizationRecommendationsService({
  projectId,
}: {
  projectId?: string;
}) {
  await delay(1500);
  return {
    // 人员负荷优化建议
    loadOptimization: [
      {
        action: '任务重分配',
        details: '将李工程师的2项后端任务分配给陈开发',
        affectedMembers: ['李工程师', '陈开发'],
        expectedImpact: '李工程师负荷降低20%，陈开发负荷提高20%',
        benefitScore: 90,
        implementationEffort: '低',
      },
      {
        action: '架构任务分担',
        details: '将赵架构的部分设计任务分配给资深开发人员',
        affectedMembers: ['赵架构', '李工程师'],
        expectedImpact: '赵架构负荷降低15%',
        benefitScore: 85,
        implementationEffort: '中',
      },
      {
        action: '引入临时资源',
        details: '申请1名临时后端开发支持2周',
        affectedMembers: ['临时资源', '李工程师'],
        expectedImpact: '整体后端资源负荷降低10%',
        benefitScore: 75,
        implementationEffort: '高',
      },
    ],

    // 优化后的资源分配方案
    optimizedAllocation: [
      {
        id: 'M001',
        name: '李工程师',
        role: '后端开发',
        currentLoad: 115,
        optimizedLoad: 92,
        change: -23,
      },
      {
        id: 'M002',
        name: '王测试',
        role: '测试工程师',
        currentLoad: 90,
        optimizedLoad: 90,
        change: 0,
      },
      {
        id: 'M003',
        name: '陈开发',
        role: '前端开发',
        currentLoad: 75,
        optimizedLoad: 95,
        change: +20,
      },
      {
        id: 'M004',
        name: '赵架构',
        role: '架构师',
        currentLoad: 105,
        optimizedLoad: 88,
        change: -17,
      },
      {
        id: 'M005',
        name: '张经理',
        role: '项目经理',
        currentLoad: 60,
        optimizedLoad: 65,
        change: +5,
      },
    ],

    // 任务排期优化
    scheduleOptimization: [
      {
        task: '支付核心模块开发',
        currentOwner: '李工程师',
        proposedOwner: '李工程师、陈开发',
        reason: '分担工作量，提高并行度',
        expectedDurationReduction: '2天',
      },
      {
        task: '第三方接口集成',
        currentOwner: '赵架构',
        proposedOwner: '赵架构、李工程师',
        reason: '利用李工程师的接口开发经验',
        expectedDurationReduction: '1天',
      },
      {
        task: '前端支付流程优化',
        currentOwner: '陈开发',
        proposedOwner: '陈开发',
        reason: '保持专注度，但调整开始时间',
        expectedStartDelay: '2天',
        expectedDurationReduction: '0天',
      },
    ],

    // 优化效果预测
    optimizationImpact: {
      overallEfficiencyScore: 85, // 优化后的效率评分
      resourceUtilization: 90, // 优化后的资源利用率
      overloadedMembers: 0, // 优化后负荷过高的成员
      underutilizedMembers: 0, // 优化后未充分利用的成员
      allocationBalance: 88, // 优化后的分配均衡度
      expectedProgressImprovement: '5-7天', // 预期进度提升
    },

    // 资源分配流动图数据
    resourceFlowData: {
      nodes: [
        { id: 'M001', name: '李工程师' },
        { id: 'M002', name: '王测试' },
        { id: 'M003', name: '陈开发' },
        { id: 'M004', name: '赵架构' },
        { id: 'M005', name: '张经理' },
        { id: 'T1', name: '任务A' },
        { id: 'T2', name: '任务B' },
        { id: 'T3', name: '任务C' },
        { id: 'T4', name: '任务D' },
        { id: 'T5', name: '任务E' },
      ],
      links: [
        { source: 'M001', target: 'T1', value: 30 },
        { source: 'M001', target: 'T2', value: 20 },
        { source: 'M003', target: 'T2', value: 20 }, // 新分配
        { source: 'M004', target: 'T3', value: 30 },
        { source: 'M001', target: 'T3', value: 15 }, // 新分配
        { source: 'M004', target: 'T4', value: 25 },
        { source: 'M003', target: 'T5', value: 40 },
        { source: 'M005', target: 'T1', value: 10 },
        { source: 'M005', target: 'T5', value: 10 },
      ],
    },
  };
}

export const queryAnalyzeResourceAllocationService = async ({
  projectId,
}: {
  projectId?: string;
}) => {
  await delay(1000);
  return {
    overallEfficiencyScore: 68, // 资源整体效率评分 0-100
    resourceUtilization: 85, // 资源利用率%
    overloadedMembers: 2, // 负荷过高的成员数量
    underutilizedMembers: 1, // 未充分利用的成员数量
    allocationBalance: 62, // 分配均衡度 0-100

    // 成员当前负荷情况
    memberLoad: [
      {
        id: 'M001',
        name: '李工程师',
        role: '后端开发',
        load: 115,
        capacity: 100,
        avatar: 'https://picsum.photos/id/1012/200/200',
      },
      {
        id: 'M002',
        name: '王测试',
        role: '测试工程师',
        load: 90,
        capacity: 100,
        avatar: 'https://picsum.photos/id/1027/200/200',
      },
      {
        id: 'M003',
        name: '陈开发',
        role: '前端开发',
        load: 75,
        capacity: 100,
        avatar: 'https://picsum.photos/id/1066/200/200',
      },
      {
        id: 'M004',
        name: '赵架构',
        role: '架构师',
        load: 105,
        capacity: 100,
        avatar: 'https://picsum.photos/id/1025/200/200',
      },
      {
        id: 'M005',
        name: '张经理',
        role: '项目经理',
        load: 60,
        capacity: 80,
        avatar: 'https://picsum.photos/id/1005/200/200',
      },
    ],

    // 资源分配按角色分布
    roleDistribution: [
      { role: '后端开发', allocated: 40, capacity: 45 },
      { role: '前端开发', allocated: 20, capacity: 25 },
      { role: '测试工程师', allocated: 15, capacity: 20 },
      { role: '架构师', allocated: 15, capacity: 15 },
      { role: '项目经理', allocated: 10, capacity: 15 },
    ],

    // 资源负荷趋势
    loadTrend: [
      { week: '第1周', averageLoad: 72, maxLoad: 95 },
      { week: '第2周', averageLoad: 78, maxLoad: 105 },
      { week: '第3周', averageLoad: 82, maxLoad: 110 },
      { week: '第4周', averageLoad: 85, maxLoad: 115 },
      { week: '第5周', averageLoad: 88, maxLoad: 120 },
    ],

    // 当前分配存在的问题
    allocationIssues: [
      {
        issue: '核心开发人员负荷过高',
        severity: '高',
        impact: '可能导致进度延误和质量下降',
        affectedMembers: ['李工程师', '赵架构'],
      },
      {
        issue: '前后端资源分配不均衡',
        severity: '中',
        impact: '可能导致前端开发进度滞后',
        affectedArea: '前端模块',
      },
      {
        issue: '测试资源投入不足',
        severity: '中',
        impact: '可能导致后期缺陷数量增加',
        currentRatio: '1:5 (测试:开发)',
      },
    ],
  };
};

// 生成风险应对建议
export const generateRecommendations = (risk: {
  category: string | number;
}) => {
  const recommendations = {
    资源风险: [
      '临时调配2名备用开发人员分担核心成员工作',
      '重新评估任务优先级，将低优先级任务延后至下一迭代',
      '实施轮休制度，避免核心人员过度疲劳',
      '开展知识共享活动，提高团队整体技能水平',
    ],
    技术风险: [
      '建立第三方接口变更预警机制，提前获取更新信息',
      '增加兼容性测试覆盖率至95%以上',
      '开发接口适配层，隔离第三方接口变更影响',
      '准备备用方案，在主要接口出现问题时快速切换',
    ],
    需求风险: [
      '增加需求评审频率，每周进行一次需求确认会议',
      '建立需求变更评估流程，所有变更需经过影响分析',
      '制作交互式原型，提前获取用户反馈',
      '冻结核心功能需求，仅接受必须的变更',
    ],
    性能风险: [
      '提前进行压力测试，模拟1.5倍预期用户量',
      '优化数据库查询，减少响应时间至0.5s以内',
      '实施缓存策略，提高热门接口响应速度',
      '设计弹性扩容方案，应对流量峰值',
    ],
  };

  return (
    (recommendations as Record<string, string[]>)[risk.category as string] || [
      '成立专项小组评估风险影响范围',
      '制定详细的风险应对计划和责任人',
      '增加监控频率，密切关注风险指标变化',
      '准备应急方案，以便风险发生时快速响应',
    ]
  );
};

/** 模拟风险缓解效果预测 */
export const queryPredictMitigationEffectivenessService = (
  risk: { category: string | number },
  _recommendation: any
) => {
  const baseEffectiveness = {
    资源风险: 75,
    技术风险: 65,
    需求风险: 60,
    性能风险: 70,
    其他风险: 50,
  };

  // 随机波动±10%模拟预测
  const fluctuation = Math.floor(Math.random() * 20) - 10;
  return Math.max(
    30,
    Math.min(
      95,
      (baseEffectiveness as Record<string, number>)[risk.category as string] +
        fluctuation
    )
  );
};
