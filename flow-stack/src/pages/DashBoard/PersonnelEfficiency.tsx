/**
 * 人员效能详情
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Tag,
  Avatar,
  Statistic,
  Progress,
  Row,
  Col,
  Select,
  Badge,
  Spin,
  Typography,
  List,
  Timeline,
  Dropdown,
  Menu as AntMenu,
} from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  LineChartOutlined,
  BarChartOutlined,
  CalendarOutlined,
  StarOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Line, Bar, Pie, Radar } from '@ant-design/plots';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 人员效能详情组件
const PersonnelEfficiency = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter
  const [selectedMember, setSelectedMember] = useState(null);
  const [metricType, setMetricType] = useState('all'); // all, efficiency, quality, contribution

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [timeRange, metricType]);

  // 团队成员数据
  const teamMembers = [
    {
      id: '1012',
      name: '李工程师',
      role: '后端开发',
      avatar: 'https://picsum.photos/id/1012/200/200',
      joinDate: '2021-03-15',
      status: 'active',
    },
    {
      id: '1027',
      name: '王测试',
      role: '测试工程师',
      avatar: 'https://picsum.photos/id/1027/200/200',
      joinDate: '2020-11-08',
      status: 'active',
    },
    {
      id: '1066',
      name: '陈开发',
      role: '前端开发',
      avatar: 'https://picsum.photos/id/1066/200/200',
      joinDate: '2022-05-20',
      status: 'active',
    },
    {
      id: '1025',
      name: '赵架构',
      role: '架构师',
      avatar: 'https://picsum.photos/id/1025/200/200',
      joinDate: '2019-08-03',
      status: 'active',
    },
    {
      id: '1005',
      name: '张经理',
      role: '项目经理',
      avatar: 'https://picsum.photos/id/1005/200/200',
      joinDate: '2018-06-12',
      status: 'active',
    },
  ];

  // 效能指标数据
  const efficiencyMetrics: any = {
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

  // 任务完成数据
  const taskCompletionData = {
    1012: [
      { period: '第1周', completed: 3, total: 4 },
      { period: '第2周', completed: 2, total: 3 },
      { period: '第3周', completed: 4, total: 4 },
      { period: '第4周', completed: 3, total: 5 },
    ],
    1027: [
      { period: '第1周', completed: 5, total: 5 },
      { period: '第2周', completed: 4, total: 4 },
      { period: '第3周', completed: 3, total: 3 },
      { period: '第4周', completed: 4, total: 4 },
    ],
    1066: [
      { period: '第1周', completed: 2, total: 3 },
      { period: '第2周', completed: 3, total: 3 },
      { period: '第3周', completed: 2, total: 2 },
      { period: '第4周', completed: 3, total: 4 },
    ],
    1025: [
      { period: '第1周', completed: 2, total: 2 },
      { period: '第2周', completed: 3, total: 4 },
      { period: '第3周', completed: 2, total: 3 },
      { period: '第4周', completed: 2, total: 3 },
    ],
    1005: [
      { period: '第1周', completed: 2, total: 2 },
      { period: '第2周', completed: 1, total: 1 },
      { period: '第3周', completed: 3, total: 3 },
      { period: '第4周', completed: 2, total: 2 },
    ],
  };

  // 任务类型分布
  const taskTypeDistribution = {
    1012: [
      { type: '新功能', value: 60 },
      { type: '缺陷修复', value: 30 },
      { type: '优化', value: 10 },
    ],
    1027: [
      { type: '功能测试', value: 50 },
      { type: '性能测试', value: 20 },
      { type: '自动化测试', value: 30 },
    ],
    1066: [
      { type: '新功能', value: 50 },
      { type: 'UI优化', value: 30 },
      { type: '缺陷修复', value: 20 },
    ],
    1025: [
      { type: '架构设计', value: 40 },
      { type: '技术难点', value: 35 },
      { type: '代码评审', value: 25 },
    ],
    1005: [
      { type: '计划管理', value: 30 },
      { type: '风险管理', value: 25 },
      { type: '沟通协调', value: 45 },
    ],
  };

  // 最近任务数据
  const recentTasks = {
    1012: [
      {
        id: 'T283',
        title: '修复大额支付偶发失败问题',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2023-06-25',
        isOverdue: true,
      },
      {
        id: 'T282',
        title: '集成新的第三方支付渠道',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2023-07-02',
      },
      {
        id: 'T281',
        title: '实现支付结果异步通知处理',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2023-06-28',
      },
      {
        id: 'T278',
        title: '实现支付密码验证功能',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-20',
      },
    ],
    1027: [
      {
        id: 'T280',
        title: '优化支付流程前端交互',
        status: 'in-review',
        priority: 'medium',
        assignedDate: '2023-06-25',
      },
      {
        id: 'T279',
        title: '修复iOS端支付结果页显示异常',
        status: 'in-review',
        priority: 'high',
        assignedDate: '2023-06-26',
      },
      {
        id: 'T275',
        title: '支付系统压力测试',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-18',
      },
      {
        id: 'T270',
        title: '支付安全测试',
        status: 'completed',
        priority: 'high',
        completedDate: '2023-06-15',
      },
    ],
    1066: [
      {
        id: 'T285',
        title: '实现退款进度查询API',
        status: 'backlog',
        priority: 'medium',
        dueDate: '2023-07-05',
      },
      {
        id: 'T284',
        title: '完善支付日志查询界面',
        status: 'backlog',
        priority: 'low',
        dueDate: '2023-07-10',
      },
      {
        id: 'T280',
        title: '优化支付流程前端交互',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-25',
      },
      {
        id: 'T279',
        title: '修复iOS端支付结果页显示异常',
        status: 'completed',
        priority: 'high',
        completedDate: '2023-06-26',
      },
    ],
    1025: [
      {
        id: 'T282',
        title: '集成新的第三方支付渠道',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2023-07-02',
      },
      {
        id: 'T276',
        title: '修复支付记录查询超时问题',
        status: 'completed',
        priority: 'high',
        completedDate: '2023-06-17',
      },
      {
        id: 'T274',
        title: '支付系统架构优化方案',
        status: 'completed',
        priority: 'high',
        completedDate: '2023-06-12',
      },
      {
        id: 'T268',
        title: '数据库性能优化',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-08',
      },
    ],
    1005: [
      {
        id: 'M003',
        title: '项目中期汇报材料准备',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-20',
      },
      {
        id: 'R002',
        title: '资源负荷平衡方案',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2023-06-30',
      },
      {
        id: 'D401',
        title: '项目中期汇报演示文稿',
        status: 'completed',
        priority: 'medium',
        completedDate: '2023-06-18',
      },
      {
        id: 'T277',
        title: '完善支付相关文档',
        status: 'completed',
        priority: 'low',
        completedDate: '2023-06-18',
      },
    ],
  };

  // 团队效能汇总数据
  const teamEfficiencySummary = {
    avgCompletionRate: 85,
    avgOnTimeRate: 81,
    avgQualityScore: 87,
    topPerformer: '王测试',
    mostImproved: '陈开发',
    bottleneck: '赵架构',
  };

  // 渲染状态标签
  const renderStatusTag = (status: string | number) => {
    const statusConfig: Record<
      string,
      { color: string; text: string; icon: React.ReactNode }
    > = {
      'in-progress': {
        color: 'processing',
        text: '进行中',
        icon: <ClockCircleOutlined />,
      },
      backlog: {
        color: 'default',
        text: '待处理',
        icon: <ClockCircleOutlined />,
      },
      'in-review': { color: 'warning', text: '待审核', icon: <MehOutlined /> },
      completed: {
        color: 'success',
        text: '已完成',
        icon: <CheckCircleOutlined />,
      },
    };

    const config = statusConfig[status] || statusConfig['in-progress'];
    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  // 渲染优先级标签
  const renderPriorityTag = (priority: string | number) => {
    const priorityConfig: Record<
      string,
      { color: string; text: string; icon: React.ReactNode }
    > = {
      high: { color: 'red', text: '高优先级', icon: <StarOutlined /> },
      medium: { color: 'orange', text: '中优先级', icon: <StarOutlined /> },
      low: { color: 'blue', text: '低优先级', icon: <StarOutlined /> },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <Tag icon={config.icon} color={config.color}>
        {config.text}
      </Tag>
    );
  };

  // 渲染绩效趋势图标
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    } else if (trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
    } else {
      return <div style={{ width: 14 }}></div>;
    }
  };

  // 渲染绩效评分
  const renderPerformanceScore = (score: number) => {
    let color = '#52c41a'; // 绿色 - 优秀
    let text = '优秀';
    let icon = <SmileOutlined />;

    if (score < 60) {
      color = '#f5222d'; // 红色 - 待改进
      text = '待改进';
      icon = <FrownOutlined />;
    } else if (score < 80) {
      color = '#faad14'; // 黄色 - 良好
      text = '良好';
      icon = <MehOutlined />;
    }

    return (
      <div className="flex items-center">
        <div style={{ color, marginRight: 4 }}>{icon}</div>
        <span style={{ color, fontWeight: 'bold' }}>{score}</span>
        <span style={{ marginLeft: 4, color: '#8c8c8c' }}>{text}</span>
      </div>
    );
  };

  // 团队效能概览
  const renderTeamOverview = () => (
    <div className="space-y-6">
      {/* 团队效能核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均任务完成率</Text>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgCompletionRate}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={teamEfficiencySummary.avgCompletionRate}
              size="small"
              status="active"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月提升 3%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均按时完成率</Text>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgOnTimeRate}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={teamEfficiencySummary.avgOnTimeRate}
              size="small"
              status={
                teamEfficiencySummary.avgOnTimeRate > 80 ? 'success' : 'active'
              }
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月下降 2%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均质量评分</Text>
              <SmileOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgQualityScore}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
            />
            <Progress
              percent={teamEfficiencySummary.avgQualityScore}
              size="small"
              status="success"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月提升 1%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">团队效能趋势</Text>
              <LineChartOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value="上升"
              valueStyle={{ fontSize: '24px', color: '#52c41a' }}
            />
            <div className="h-10 mt-2">
              <Line
                data={[
                  { month: '3月', score: 78 },
                  { month: '4月', score: 80 },
                  { month: '5月', score: 82 },
                  { month: '6月', score: 85 },
                ]}
                xField="month"
                yField="score"
                meta={{ score: { min: 70, max: 90 } }}
                lineStyle={{ stroke: '#52c41a', lineWidth: 2 }}
                point={false}
                xAxis={false}
                yAxis={false}
              />
            </div>
            <Text type="secondary" className="text-xs mt-1 block">
              连续3个月呈上升趋势
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 团队成员效能排行 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <Title level={5}>团队成员效能排行</Title>
          <Select value={timeRange} onChange={setTimeRange} size="small">
            <Option value="week">近一周</Option>
            <Option value="month">近一月</Option>
            <Option value="quarter">近一季度</Option>
          </Select>
        </div>

        <Table
          dataSource={teamMembers.map((member) => ({
            ...member,
            // @ts-ignore
            ...efficiencyMetrics[member.id],
            key: member.id,
          }))}
          pagination={false}
          onRow={(record) => ({
            onClick: () => setSelectedMember(record.id),
            style: {
              cursor: 'pointer',
              backgroundColor: selectedMember === record.id ? '#f0f7ff' : '',
            },
          })}
        >
          <Table.Column
            title="排名"
            render={(text, record, index) => (
              <div className="flex items-center">
                {index < 3 ? (
                  <TrophyOutlined
                    style={{
                      color:
                        index === 0
                          ? '#faad14'
                          : index === 1
                            ? '#c0c0c0'
                            : '#cd7f32',
                      marginRight: 8,
                    }}
                  />
                ) : (
                  <span style={{ marginRight: 8 }}>{index + 1}</span>
                )}
                <div className="flex items-center">
                  <Avatar src={record.avatar} size="small" className="mr-2" />
                  <span>{record.name}</span>
                </div>
              </div>
            )}
          />
          <Table.Column title="角色" dataIndex="role" />
          <Table.Column
            title="完成率"
            render={(text, record) => (
              <div className="flex items-center">
                <span style={{ marginRight: 8, fontWeight: 'bold' }}>
                  {record.completionRate}%
                </span>
                <Progress percent={record.completionRate} size="small" />
              </div>
            )}
          />
          <Table.Column
            title="按时率"
            render={(text, record) => (
              <div className="flex items-center">
                <span style={{ marginRight: 8, fontWeight: 'bold' }}>
                  {record.onTimeRate}%
                </span>
                <Progress percent={record.onTimeRate} size="small" />
              </div>
            )}
          />
          <Table.Column
            title="质量评分"
            render={(text, record) =>
              renderPerformanceScore(record.qualityScore)
            }
          />
          <Table.Column
            title="效能趋势"
            render={(text, record) => (
              <div className="flex items-center">
                {renderTrendIcon(record.recentPerformance)}
                <span style={{ marginLeft: 4 }}>
                  {record.recentPerformance === 'up'
                    ? '上升'
                    : record.recentPerformance === 'down'
                      ? '下降'
                      : '持平'}
                </span>
              </div>
            )}
          />
        </Table>
      </Card>

      {/* 团队效能分布分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>成员效能分布</Title>
              <Select defaultValue="completion" size="small">
                <Option value="completion">按完成率</Option>
                <Option value="quality">按质量评分</Option>
                <Option value="contribution">按贡献度</Option>
              </Select>
            </div>
            <div className="h-72">
              <Bar
                data={teamMembers.map((member) => ({
                  name: member.name,
                  // @ts-ignore
                  完成率: efficiencyMetrics[member.id].completionRate,
                }))}
                xField="name"
                yField="完成率"
                meta={{ 完成率: { min: 0, max: 100 } }}
                xAxis={{ label: { autoRotate: true } }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>任务类型分布</Title>
              <Select defaultValue="team" size="small">
                <Option value="team">团队整体</Option>
                <Option value="role">按角色</Option>
              </Select>
            </div>
            <div className="h-72">
              <Pie
                data={[
                  { type: '新功能开发', value: 45 },
                  { type: '缺陷修复', value: 25 },
                  { type: '优化改进', value: 15 },
                  { type: '测试验证', value: 10 },
                  { type: '文档管理', value: 5 },
                ]}
                angleField="value"
                colorField="type"
                radius={0.7}
                label={({ type, value }: { type: string; value: number }) =>
                  `${type}: ${value}%`
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 成员详情视图
  const renderMemberDetails = () => {
    if (!selectedMember) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
          <UserOutlined
            style={{ fontSize: '48px', color: '#ccc', marginBottom: 16 }}
          />
          <Text type="secondary">请从团队列表中选择一名成员查看详情</Text>
        </div>
      );
    }

    const member = teamMembers.find((m) => m.id === selectedMember);
    const metrics: any = efficiencyMetrics[selectedMember];
    const tasks = recentTasks[selectedMember];
    const completionData = taskCompletionData[selectedMember];
    const taskDistribution = taskTypeDistribution[selectedMember];

    if (!member || !metrics) {
      return <div>成员数据不存在</div>;
    }

    return (
      <div className="space-y-6">
        {/* 成员基本信息和核心指标 */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex flex-wrap items-start">
            <div className="flex items-center mb-4 sm:mb-0">
              <Avatar src={member.avatar} size="large" className="mr-4" />
              <div>
                <Title level={4} className="mb-0">
                  {member.name}
                </Title>
                <Text type="secondary">
                  {member.role} · 加入于 {member.joinDate}
                </Text>
                <div className="flex items-center mt-2">
                  <Badge status="success" text="在职" className="mr-3" />
                  <div className="flex items-center">
                    {renderTrendIcon(metrics.recentPerformance)}
                    <Text
                      // @ts-ignore
                      type={
                        metrics.recentPerformance === 'up'
                          ? 'success'
                          : metrics.recentPerformance === 'down'
                            ? 'error'
                            : 'secondary'
                      }
                      className="ml-1"
                    >
                      {metrics.recentPerformance === 'up'
                        ? '近期效能上升'
                        : metrics.recentPerformance === 'down'
                          ? '近期效能下降'
                          : '近期效能持平'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 ml-0 sm:ml-8">
              <div>
                <Text type="secondary" className="text-xs">
                  任务完成率
                </Text>
                <Statistic
                  value={metrics.completionRate}
                  precision={0}
                  valueStyle={{ fontSize: '18px' }}
                  suffix="%"
                />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  按时完成率
                </Text>
                <Statistic
                  value={metrics.onTimeRate}
                  precision={0}
                  valueStyle={{ fontSize: '18px' }}
                  suffix="%"
                />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  平均任务周期
                </Text>
                <Statistic
                  value={metrics.avgCycle}
                  precision={1}
                  valueStyle={{ fontSize: '18px' }}
                  suffix="天"
                />
              </div>
              <div>
                <Text type="secondary" className="text-xs">
                  质量评分
                </Text>
                <Statistic
                  value={metrics.qualityScore}
                  precision={0}
                  valueStyle={{ fontSize: '18px' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 效能详情标签页 */}
        <Tabs activeKey={metricType} onChange={setMetricType} className="mb-6">
          <TabPane tab="综合效能" key="all" />
          <TabPane tab="效率指标" key="efficiency" />
          <TabPane tab="质量指标" key="quality" />
          <TabPane tab="贡献度" key="contribution" />
        </Tabs>

        {/* 综合效能视图 */}
        {metricType === 'all' && (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card className="hover:shadow-md transition-shadow">
                  <Title level={5} className="mb-4">
                    效能雷达图
                  </Title>
                  <div className="h-72">
                    <Radar
                      data={[
                        {
                          indicator: '任务完成率',
                          个人: metrics.completionRate,
                          团队平均: teamEfficiencySummary.avgCompletionRate,
                        },
                        {
                          indicator: '按时完成率',
                          个人: metrics.onTimeRate,
                          团队平均: teamEfficiencySummary.avgOnTimeRate,
                        },
                        {
                          indicator: '质量评分',
                          个人: metrics.qualityScore,
                          团队平均: teamEfficiencySummary.avgQualityScore,
                        },
                        {
                          indicator: '贡献指数',
                          个人: metrics.contributionIndex,
                          团队平均: 84,
                        },
                        {
                          indicator: '协作评分',
                          个人: metrics.collaborationScore,
                          团队平均: 86,
                        },
                      ]}
                      xField="indicator"
                      yField={['个人', '团队平均']}
                      meta={{
                        个人: { min: 50, max: 100 },
                        团队平均: { min: 50, max: 100 },
                      }}
                      point={{ size: 5 }}
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="hover:shadow-md transition-shadow">
                  <Title level={5} className="mb-4">
                    效能趋势
                  </Title>
                  <div className="h-72">
                    <Line
                      data={[
                        { 周期: '第1周', 效能得分: metrics.trend[0] },
                        { 周期: '第2周', 效能得分: metrics.trend[1] },
                        { 周期: '第3周', 效能得分: metrics.trend[2] },
                        { 周期: '第4周', 效能得分: metrics.trend[3] },
                        { 周期: '第5周', 效能得分: metrics.trend[4] },
                      ]}
                      xField="周期"
                      yField="效能得分"
                      meta={{ 效能得分: { min: 50, max: 100 } }}
                      point={{ size: 5 }}
                      lineStyle={{ lineWidth: 2 }}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card className="hover:shadow-md transition-shadow">
                  <Title level={5} className="mb-4">
                    任务完成情况
                  </Title>
                  <div className="h-72">
                    <Bar
                      data={completionData}
                      xField="period"
                      yField={['completed', 'total']}
                      legend={{ position: 'top' }}
                      xAxis={{ label: { autoRotate: true } }}
                    />
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card className="hover:shadow-md transition-shadow">
                  <Title level={5} className="mb-4">
                    任务类型分布
                  </Title>
                  <div className="h-72">
                    <Pie
                      data={taskDistribution}
                      angleField="value"
                      colorField="type"
                      radius={0.7}
                      label={({
                        type,
                        value,
                      }: {
                        type: string;
                        value: number;
                      }) => `${type}: ${value}%`}
                    />
                  </div>
                </Card>
              </Col>
            </Row>

            <Card className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <Title level={5}>最近任务</Title>
                <Text type="secondary" className="text-sm">
                  查看全部
                </Text>
              </div>

              <List
                dataSource={tasks}
                renderItem={(task: any) => (
                  <List.Item
                    actions={[
                      <Dropdown
                        overlay={
                          <AntMenu>
                            <AntMenu.Item>查看详情</AntMenu.Item>
                            <AntMenu.Item>查看历史</AntMenu.Item>
                          </AntMenu>
                        }
                      >
                        <MoreOutlined />
                      </Dropdown>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={renderStatusTag(task?.status)}
                      title={
                        <div className="flex items-center">
                          <Text code className="mr-2">
                            {task.id}
                          </Text>
                          <Text strong>{task.title}</Text>
                        </div>
                      }
                      description={
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          {renderPriorityTag(task.priority)}
                          <Text type="secondary" className="text-xs">
                            {task.status === 'completed' ? (
                              <>
                                <CheckCircleOutlined className="mr-1" /> 完成于{' '}
                                {task.completedDate}
                              </>
                            ) : task.status === 'in-review' ? (
                              <>
                                <ClockCircleOutlined className="mr-1" /> 提交于{' '}
                                {task.assignedDate}
                              </>
                            ) : (
                              <>
                                <CalendarOutlined className="mr-1" />
                                {task.isOverdue ? (
                                  <Text type="danger" className="text-xs">
                                    已逾期: {task.dueDate}
                                  </Text>
                                ) : (
                                  `截止: ${task.dueDate}`
                                )}
                              </>
                            )}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}

        {/* 效率指标视图 */}
        {metricType === 'efficiency' && (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">任务完成率</Text>
                    <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.completionRate}
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                    suffix="%"
                  />
                  <Progress
                    percent={metrics.completionRate}
                    size="small"
                    status={metrics.completionRate > 80 ? 'success' : 'active'}
                    className="mt-2"
                  />
                  <Text
                    // @ts-ignore
                    type={
                      metrics.completionRate >
                      teamEfficiencySummary.avgCompletionRate
                        ? 'success'
                        : 'error'
                    }
                    className="text-xs mt-2 flex items-center"
                  >
                    {metrics.completionRate >
                    teamEfficiencySummary.avgCompletionRate ? (
                      <ArrowUpOutlined className="mr-1" />
                    ) : (
                      <ArrowDownOutlined className="mr-1" />
                    )}
                    较团队平均{' '}
                    {metrics.completionRate >
                    teamEfficiencySummary.avgCompletionRate
                      ? '高'
                      : '低'}{' '}
                    {Math.abs(
                      metrics.completionRate -
                        teamEfficiencySummary.avgCompletionRate
                    )}
                    %
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">按时完成率</Text>
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.onTimeRate}
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                    suffix="%"
                  />
                  <Progress
                    percent={metrics.onTimeRate}
                    size="small"
                    status={metrics.onTimeRate > 80 ? 'success' : 'active'}
                    className="mt-2"
                  />
                  <Text
                    // @ts-ignore
                    type={
                      metrics.onTimeRate > teamEfficiencySummary.avgOnTimeRate
                        ? 'success'
                        : 'error'
                    }
                    className="text-xs mt-2 flex items-center"
                  >
                    {metrics.onTimeRate >
                    teamEfficiencySummary.avgOnTimeRate ? (
                      <ArrowUpOutlined className="mr-1" />
                    ) : (
                      <ArrowDownOutlined className="mr-1" />
                    )}
                    较团队平均{' '}
                    {metrics.onTimeRate > teamEfficiencySummary.avgOnTimeRate
                      ? '高'
                      : '低'}{' '}
                    {Math.abs(
                      metrics.onTimeRate - teamEfficiencySummary.avgOnTimeRate
                    )}
                    %
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">平均任务周期</Text>
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.avgCycle}
                    precision={1}
                    valueStyle={{ fontSize: '24px' }}
                    suffix="天"
                  />
                  <div className="mt-3">
                    <Text
                      // @ts-ignore
                      type={
                        metrics.avgCycle < 3
                          ? 'success'
                          : metrics.avgCycle < 5
                            ? 'secondary'
                            : 'error'
                      }
                      className="text-sm"
                    >
                      {metrics.avgCycle < 3
                        ? '高效'
                        : metrics.avgCycle < 5
                          ? '正常'
                          : '偏慢'}
                    </Text>
                  </div>
                  <Text type="secondary" className="text-xs mt-2 block">
                    较上月 {metrics.avgCycle < 3.5 ? '缩短' : '延长'}{' '}
                    {Math.abs(metrics.avgCycle - 3.5).toFixed(1)} 天
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">故事点吞吐量</Text>
                    <BarChartOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.throughput}
                    valueStyle={{ fontSize: '24px' }}
                    suffix="点"
                  />
                  <Progress
                    percent={(metrics.throughput / 20) * 100}
                    size="small"
                    status={metrics.throughput > 15 ? 'success' : 'active'}
                    className="mt-2"
                  />
                  <Text type="secondary" className="text-xs mt-2 block">
                    本月累计完成 {metrics.throughput} 个故事点
                  </Text>
                </Card>
              </Col>
            </Row>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                任务周期趋势
              </Title>
              <div className="h-72">
                <Line
                  data={[
                    { 任务: 'T270', 周期: 3.5 },
                    { 任务: 'T274', 周期: 4.0 },
                    { 任务: 'T276', 周期: 3.0 },
                    { 任务: 'T281', 周期: 2.5 },
                    { 任务: 'T282', 周期: 5.0 },
                  ]}
                  xField="任务"
                  yField="周期"
                  point={{ size: 5 }}
                  meta={{ 周期: { min: 0, max: 7, alias: '周期(天)' } }}
                />
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                效率改进建议
              </Title>
              <List
                dataSource={[
                  {
                    title: '减少任务切换频率',
                    content:
                      '分析显示您在短时间内频繁切换任务，建议批量处理相似任务以提高专注度。',
                  },
                  {
                    title: '优化高优先级任务处理',
                    content:
                      '高优先级任务平均处理周期较长，建议优先处理高优先级任务，缩短响应时间。',
                  },
                  {
                    title: '提高预估准确性',
                    content:
                      '任务实际周期与预估偏差较大，建议在任务规划阶段投入更多时间进行准确评估。',
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{item.title}</Text>}
                      description={<Paragraph>{item.content}</Paragraph>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}

        {/* 质量指标视图 */}
        {metricType === 'quality' && (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">质量评分</Text>
                    <SmileOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.qualityScore}
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress
                    percent={metrics.qualityScore}
                    size="small"
                    status={metrics.qualityScore > 80 ? 'success' : 'active'}
                    className="mt-2"
                  />
                  <Text
                    // @ts-ignore
                    type={
                      metrics.qualityScore >
                      teamEfficiencySummary.avgQualityScore
                        ? 'success'
                        : 'error'
                    }
                    className="text-xs mt-2 flex items-center"
                  >
                    {metrics.qualityScore >
                    teamEfficiencySummary.avgQualityScore ? (
                      <ArrowUpOutlined className="mr-1" />
                    ) : (
                      <ArrowDownOutlined className="mr-1" />
                    )}
                    较团队平均{' '}
                    {metrics.qualityScore >
                    teamEfficiencySummary.avgQualityScore
                      ? '高'
                      : '低'}{' '}
                    {Math.abs(
                      metrics.qualityScore -
                        teamEfficiencySummary.avgQualityScore
                    )}
                    分
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">返工率</Text>
                    <FrownOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.reworkRate}
                    precision={0}
                    valueStyle={{
                      fontSize: '24px',
                      color: metrics.reworkRate > 10 ? '#f5222d' : '#52c41a',
                    }}
                    suffix="%"
                  />
                  <Progress
                    percent={metrics.reworkRate}
                    size="small"
                    status={metrics.reworkRate > 10 ? 'exception' : 'success'}
                    className="mt-2"
                  />
                  <Text
                    // @ts-ignore
                    type={metrics.reworkRate < 10 ? 'success' : 'error'}
                    className="text-xs mt-2 flex items-center"
                  >
                    {metrics.reworkRate < 10 ? (
                      <ArrowDownOutlined className="mr-1" />
                    ) : (
                      <ArrowUpOutlined className="mr-1" />
                    )}
                    较上月 {metrics.reworkRate < 12 ? '下降' : '上升'}{' '}
                    {Math.abs(metrics.reworkRate - 12)}%
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">代码评审通过率</Text>
                    <CheckCircleOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={
                      member.role.includes('开发') ||
                      member.role.includes('架构')
                        ? 88
                        : 0
                    }
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                    suffix="%"
                  />
                  <Progress
                    percent={
                      member.role.includes('开发') ||
                      member.role.includes('架构')
                        ? 88
                        : 0
                    }
                    size="small"
                    status="success"
                    className="mt-2"
                  />
                  <Text type="secondary" className="text-xs mt-2 block">
                    平均每次评审发现{' '}
                    {member.role.includes('开发') ||
                    member.role.includes('架构')
                      ? 2.3
                      : 0}{' '}
                    个问题
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">缺陷密度</Text>
                    <FrownOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={
                      member.role.includes('开发')
                        ? 0.8
                        : member.role.includes('测试')
                          ? 0
                          : 1.2
                    }
                    precision={1}
                    valueStyle={{
                      fontSize: '24px',
                      color:
                        (member.role.includes('开发') ? 0.8 : 1.2) < 1
                          ? '#52c41a'
                          : '#f5222d',
                    }}
                    suffix="个/功能点"
                  />
                  <Progress
                    percent={member.role.includes('开发') ? 40 : 60}
                    size="small"
                    status={
                      member.role.includes('开发') ? 'success' : 'exception'
                    }
                    className="mt-2"
                  />
                  <Text type="secondary" className="text-xs mt-2 block">
                    {member.role.includes('开发') ? '优于' : '高于'}{' '}
                    团队平均水平
                  </Text>
                </Card>
              </Col>
            </Row>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                缺陷分布与趋势
              </Title>
              <div className="h-72">
                <Bar
                  data={[
                    { 类型: '功能缺陷', 数量: 5 },
                    { 类型: '性能问题', 数量: 1 },
                    { 类型: 'UI/UX问题', 数量: 3 },
                    { 类型: '安全问题', 数量: 0 },
                    { 类型: '文档问题', 数量: 2 },
                  ]}
                  xField="类型"
                  yField="数量"
                  xAxis={{ label: { autoRotate: true } }}
                />
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                质量改进建议
              </Title>
              <List
                dataSource={[
                  {
                    title: '加强单元测试覆盖',
                    content:
                      '您的代码单元测试覆盖率低于团队平均水平，建议提高单元测试覆盖率至80%以上。',
                  },
                  {
                    title: '关注常见缺陷类型',
                    content:
                      '分析显示您的代码中功能缺陷占比较高，建议在功能实现后进行更全面的自测。',
                  },
                  {
                    title: '参与代码评审培训',
                    content:
                      '代码评审中发现的问题较多，建议参与团队代码评审标准和最佳实践培训。',
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{item.title}</Text>}
                      description={<Paragraph>{item.content}</Paragraph>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}

        {/* 贡献度视图 */}
        {metricType === 'contribution' && (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">贡献指数</Text>
                    <TrophyOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.contributionIndex}
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress
                    percent={metrics.contributionIndex}
                    size="small"
                    status="success"
                    className="mt-2"
                  />
                  <Text type="secondary" className="text-xs mt-2 block">
                    团队排名:{' '}
                    {teamMembers
                      .sort(
                        (a, b) =>
                          efficiencyMetrics[b.id].contributionIndex -
                          efficiencyMetrics[a.id].contributionIndex
                      )
                      .findIndex((m) => m.id === selectedMember) + 1}{' '}
                    / {teamMembers.length}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">协作评分</Text>
                    <UserOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={metrics.collaborationScore}
                    precision={0}
                    valueStyle={{ fontSize: '24px' }}
                  />
                  <Progress
                    percent={metrics.collaborationScore}
                    size="small"
                    status={
                      metrics.collaborationScore > 80 ? 'success' : 'active'
                    }
                    className="mt-2"
                  />
                  <Text type="secondary" className="text-xs mt-2 block">
                    基于团队反馈和协作频率计算
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">关键任务参与</Text>
                    <StarOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={
                      member.role.includes('架构') ||
                      member.role.includes('经理')
                        ? 5
                        : 3
                    }
                    valueStyle={{ fontSize: '24px' }}
                    suffix="个"
                  />
                  <Text type="secondary" className="text-xs mt-3 block">
                    本月参与的高优先级任务数量
                  </Text>
                  <Text type="success" className="text-xs mt-1 block">
                    高于团队平均水平
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <Text type="secondary">知识贡献</Text>
                    <FileTextOutlined style={{ color: '#1890ff' }} />
                  </div>
                  <Statistic
                    value={
                      member.role.includes('架构')
                        ? 4
                        : member.role.includes('经理')
                          ? 3
                          : 1
                    }
                    valueStyle={{ fontSize: '24px' }}
                    suffix="次"
                  />
                  <Text type="secondary" className="text-xs mt-3 block">
                    本月文档更新/技术分享次数
                  </Text>
                  <Text
                    type={member.role.includes('开发') ? 'warning' : 'success'}
                    className="text-xs mt-1 block"
                  >
                    {member.role.includes('开发')
                      ? '建议增加知识分享'
                      : '保持良好的知识贡献'}
                  </Text>
                </Card>
              </Col>
            </Row>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                贡献分布
              </Title>
              <div className="h-72">
                <Pie
                  data={[
                    { 类型: '代码贡献', value: 45 },
                    { 类型: '问题解决', value: 25 },
                    { 类型: '文档完善', value: 10 },
                    { 类型: '团队协作', value: 15 },
                    { 类型: '知识分享', value: 5 },
                  ]}
                  angleField="value"
                  colorField="type"
                  radius={0.7}
                  label={({ type, value }: any) => `${type}: ${value}%`}
                />
              </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                主要贡献成果
              </Title>
              <Timeline mode="left">
                <Timeline.Item>
                  <Title level={5}>支付核心模块设计与实现</Title>
                  <Text type="secondary" className="text-xs block">
                    完成时间：2023-06-15
                  </Text>
                  <Text type="secondary" className="text-xs mt-1 block">
                    负责核心支付流程设计与实现，解决了3个关键技术难点
                  </Text>
                  <Tag color="success" className="mt-1">
                    高价值贡献
                  </Tag>
                </Timeline.Item>
                <Timeline.Item>
                  <Title level={5}>数据库性能优化方案</Title>
                  <Text type="secondary" className="text-xs block">
                    完成时间：2023-06-08
                  </Text>
                  <Text type="secondary" className="text-xs mt-1 block">
                    提出并实施数据库优化方案，查询性能提升60%
                  </Text>
                  <Tag color="success" className="mt-1">
                    高价值贡献
                  </Tag>
                </Timeline.Item>
                <Timeline.Item>
                  <Title level={5}>团队技术分享：支付安全最佳实践</Title>
                  <Text type="secondary" className="text-xs block">
                    完成时间：2023-05-25
                  </Text>
                  <Text type="secondary" className="text-xs mt-1 block">
                    分享支付安全相关知识，提升团队安全意识
                  </Text>
                </Timeline.Item>
              </Timeline>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // 主渲染函数
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between">
        <Title level={3} className="mb-0">
          人员效能分析
        </Title>
        <Text type="secondary">
          全面评估团队成员的工作效率、质量和贡献度，识别高绩效员工和待改进领域
        </Text>
      </div>

      <Tabs defaultActiveKey="team">
        <TabPane tab="团队效能概览" key="team">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : (
            renderTeamOverview()
          )}
        </TabPane>
        <TabPane tab="成员效能详情" key="member">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : (
            renderMemberDetails()
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PersonnelEfficiency;
