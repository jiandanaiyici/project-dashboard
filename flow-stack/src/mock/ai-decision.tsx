import {
  ArrowRightOutlined,
  CalendarOutlined,
  CodeOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

// Mock数据
const riskTrendData = [
  { date: '5/28', total: 45, schedule: 30, quality: 20 },
  { date: '5/30', total: 42, schedule: 28, quality: 18 },
  { date: '6/1', total: 40, schedule: 25, quality: 15 },
  { date: '6/3', total: 43, schedule: 27, quality: 16 },
  { date: '6/5', total: 48, schedule: 35, quality: 18 },
  { date: '6/7', total: 52, schedule: 42, quality: 20 },
  { date: '6/9', total: 58, schedule: 48, quality: 22 },
  { date: '6/11', total: 62, schedule: 55, quality: 25 },
  { date: '6/13', total: 65, schedule: 60, quality: 28 },
  { date: '6/15', total: 68, schedule: 65, quality: 30 },
];

const teamMembers = [
  {
    name: '李工程师',
    avatar: 'https://picsum.photos/id/1012/200/200',
    load: 115,
  },
  { name: '陈开发', avatar: 'https://picsum.photos/id/1066/200/200', load: 95 },
  { name: '王测试', avatar: 'https://picsum.photos/id/1027/200/200', load: 65 },
  { name: '赵架构', avatar: 'https://picsum.photos/id/1025/200/200', load: 45 },
];

const riskItems = [
  {
    title: '支付核心模块开发滞后',
    level: '高风险',
    levelType: 'danger',
    description:
      '根据当前进度，该模块可能无法按时完成，影响整体发布计划。风险概率：78%',
    measures: [
      {
        name: '增加1名开发人员',
        icon: <UserOutlined className="text-primary mr-1" />,
      },
      {
        name: '拆分任务优先级',
        icon: <ExclamationCircleOutlined className="text-primary mr-1" />,
      },
      {
        name: '调整交付时间',
        icon: <CalendarOutlined className="text-primary mr-1" />,
      },
    ],
    icon: <ExclamationCircleOutlined className="text-danger" />,
  },
  {
    title: '第三方支付接口兼容性问题',
    level: '中风险',
    levelType: 'warning',
    description:
      '新接口与部分老旧设备存在兼容性风险，可能影响用户支付体验。风险概率：45%',
    measures: [
      {
        name: '增加兼容性测试',
        icon: <CodeOutlined className="text-primary mr-1" />,
      },
      {
        name: '保留旧接口兼容层',
        icon: <CodeOutlined className="text-primary mr-1" />,
      },
    ],
    icon: <ExclamationCircleOutlined className="text-warning" />,
  },
  {
    title: '数据库性能瓶颈',
    level: '低风险',
    levelType: 'primary',
    description:
      '高并发场景下可能出现数据库性能瓶颈，影响支付处理速度。风险概率：22%',
    measures: [],
    icon: <InfoCircleOutlined className="text-primary" />,
  },
];

const optimizationSuggestions = [
  {
    title: '将"支付宝接口对接"任务从李工程师分配给赵架构',
    description: '预计平衡负载：李工程师 85%，赵架构 65%',
    icon: <ArrowRightOutlined className="text-xs" />,
  },
  {
    title: '将陈开发的3个低优先级任务延期至下一迭代',
    description: '预计平衡负载：陈开发 70%',
    icon: <CalendarOutlined className="text-xs" />,
  },
  {
    name: '临时增加1名开发人员支持核心模块开发',
    description: '预计可将整体进度提前 3-5 天',
    icon: <UserOutlined className="text-xs" />,
  },
];

const releaseWindows = [
  {
    time: '6月30日 23:00 - 01:00',
    matchRate: 92,
    userActivity: '低 (7% 平均)',
    systemLoad: '低 (22% 平均)',
    recoveryWindow: '2小时 (足够)',
    successRate: '96%',
  },
  {
    time: '7月1日 03:00 - 05:00',
    matchRate: 85,
    tags: ['低活跃度', '低负载'],
  },
  {
    time: '7月2日 22:00 - 00:00',
    matchRate: 80,
    tags: ['中低活跃度', '中负载'],
  },
];

const aiChats = [
  {
    type: 'ai',
    content:
      '您好！我是项目智能助手，可以为您提供项目风险分析、资源优化建议和发布计划支持。请问有什么可以帮助您的？',
  },
  {
    type: 'user',
    content: '我们能按时完成v2.0.0版本的发布吗？如果有风险，主要原因是什么？',
  },
  {
    type: 'ai',
    content:
      '根据当前项目进度和历史数据预测，按时完成v2.0.0版本发布的概率为65%，存在一定风险。\n\n主要风险原因：\n• 支付核心模块开发进度滞后计划约4天\n• 李工程师当前负载过高(115%)，可能影响交付质量\n• 第三方支付接口兼容性测试尚未完成\n\n建议采取资源优化措施，平衡团队负载，优先保障核心模块开发。',
  },
];

export {
  riskTrendData,
  teamMembers,
  riskItems,
  optimizationSuggestions,
  releaseWindows,
  aiChats,
};
