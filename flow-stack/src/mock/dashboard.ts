// Mock数据
export const deliveryTrendData = [
  { week: '第1周', points: 12 },
  { week: '第2周', points: 19 },
  { week: '第3周', points: 15 },
  { week: '第4周', points: 22 },
  { week: '第5周', points: 18 },
  { week: '第6周', points: 25 },
  { week: '第7周', points: 21 },
];

export const riskDistributionData = [
  { type: '人员风险', value: 30, color: '#165DFF' },
  { type: '项目风险', value: 25, color: '#36CFC9' },
  { type: '系统风险', value: 15, color: '#52C41A' },
  { type: '财务风险', value: 20, color: '#FAAD14' },
  { type: '发布风险', value: 10, color: '#FF4D4F' },
];

export const projectData = [
  {
    key: '1',
    name: '支付系统重构',
    owner: {
      name: '李工程师',
      avatar: 'https://picsum.photos/id/1012/200/200',
    },
    progress: 65,
    risk: 68,
    roi: '2.3x',
    status: '进行中',
    statusColor: 'yellow',
  },
  {
    key: '2',
    name: '用户增长系统',
    owner: {
      name: '王产品',
      avatar: 'https://picsum.photos/id/1027/200/200',
    },
    progress: 82,
    risk: 25,
    roi: '3.7x',
    status: '进行中',
    statusColor: 'yellow',
  },
  {
    key: '3',
    name: '数据中台建设',
    owner: {
      name: '赵架构师',
      avatar: 'https://picsum.photos/id/1025/200/200',
    },
    progress: 45,
    risk: 52,
    roi: '1.8x',
    status: '进行中',
    statusColor: 'yellow',
  },
  {
    key: '4',
    name: '移动端新功能',
    owner: {
      name: '陈开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
    },
    progress: 98,
    risk: 18,
    roi: '4.2x',
    status: '即将发布',
    statusColor: 'green',
  },
];

export const qualityMetrics = [
  { name: '测试通过率', value: '97.8%', color: 'success', percentage: 97.8 },
  { name: '代码覆盖率', value: '82.5%', color: 'primary', percentage: 82.5 },
  { name: '代码扫描问题', value: '12', color: 'warning', percentage: 35 },
  { name: '性能测试结果', value: '通过', color: 'success', percentage: 100 },
];

export const releaseHistory = [
  { version: 'V2.3.0', status: 'success', time: '今天 09:42' },
  { version: 'V2.2.1', status: 'success', time: '昨天 16:15' },
  { version: 'V2.2.0', status: 'fail', time: '2023-06-12' },
];

export const riskTypes = [
  { name: '人员风险', value: 38, color: 'primary' },
  { name: '项目风险', value: 45, color: 'secondary' },
  { name: '系统风险', value: 22, color: 'success' },
  { name: '财务风险', value: 58, color: 'warning' },
  { name: '发布风险', value: 35, color: 'primary' },
];
