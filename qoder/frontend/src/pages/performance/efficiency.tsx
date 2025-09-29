import React, { useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Table,
  Tabs,
  Space,
  Tag,
  Statistic,
  Typography,
  Progress,
  Avatar,
  Timeline,
  Radio,
  Badge,
  Divider,
} from 'antd';
import {
  UserOutlined,
  SyncOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  BugOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 团队成员数据接口
interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  level: 'junior' | 'middle' | 'senior' | 'expert';
  status: 'active' | 'vacation' | 'busy' | 'offline';
  efficiency: {
    score: number;
    tasksCompleted: number;
    tasksInProgress: number;
    averageCompletionTime: number;
    qualityScore: number;
    onTimeDelivery: number;
  };
  skills: {
    name: string;
    level: number;
    experience: number;
  }[];
  workload: {
    currentProjects: number;
    totalHours: number;
    utilization: number;
    overtime: number;
  };
  performance: {
    date: string;
    efficiency: number;
    quality: number;
    velocity: number;
  }[];
  recentActivities: {
    type: 'task' | 'code_review' | 'meeting' | 'bug_fix';
    description: string;
    time: string;
    project: string;
  }[];
}

// 团队架构数据接口
interface TeamStructure {
  department: string;
  manager: string;
  totalMembers: number;
  levels: {
    junior: number;
    middle: number;
    senior: number;
    expert: number;
  };
  efficiency: {
    overall: number;
    trend: number;
  };
  projects: string[];
  technologies: string[];
}

// 模拟团队成员数据
const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-001',
    name: '张三',
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: '高级前端工程师',
    department: '前端开发部',
    level: 'senior',
    status: 'active',
    efficiency: {
      score: 92,
      tasksCompleted: 28,
      tasksInProgress: 3,
      averageCompletionTime: 2.3,
      qualityScore: 95,
      onTimeDelivery: 94,
    },
    skills: [
      { name: 'React', level: 9, experience: 3 },
      { name: 'TypeScript', level: 8, experience: 2 },
      { name: 'Vue.js', level: 7, experience: 2 },
      { name: 'Node.js', level: 6, experience: 1 },
    ],
    workload: {
      currentProjects: 2,
      totalHours: 168,
      utilization: 85,
      overtime: 12,
    },
    performance: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs().subtract(29 - i, 'day').format('MM-DD'),
      efficiency: 85 + Math.random() * 15,
      quality: 90 + Math.random() * 10,
      velocity: 80 + Math.random() * 20,
    })),
    recentActivities: [
      {
        type: 'task',
        description: '完成用户登录模块优化',
        time: '2小时前',
        project: '项目管理平台',
      },
      {
        type: 'code_review',
        description: '审查代码提交 #PR-1234',
        time: '4小时前',
        project: '用户中心',
      },
      {
        type: 'bug_fix',
        description: '修复页面加载异常问题',
        time: '昨天',
        project: '项目管理平台',
      },
    ],
  },
  {
    id: 'member-002',
    name: '李四',
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: '中级后端工程师',
    department: '后端开发部',
    level: 'middle',
    status: 'busy',
    efficiency: {
      score: 78,
      tasksCompleted: 24,
      tasksInProgress: 5,
      averageCompletionTime: 3.1,
      qualityScore: 82,
      onTimeDelivery: 85,
    },
    skills: [
      { name: 'Java', level: 8, experience: 3 },
      { name: 'Spring Boot', level: 7, experience: 2 },
      { name: 'MySQL', level: 7, experience: 3 },
      { name: 'Redis', level: 6, experience: 1 },
    ],
    workload: {
      currentProjects: 3,
      totalHours: 180,
      utilization: 95,
      overtime: 20,
    },
    performance: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs().subtract(29 - i, 'day').format('MM-DD'),
      efficiency: 70 + Math.random() * 20,
      quality: 75 + Math.random() * 20,
      velocity: 70 + Math.random() * 25,
    })),
    recentActivities: [
      {
        type: 'task',
        description: '开发API接口模块',
        time: '1小时前',
        project: '数据分析平台',
      },
      {
        type: 'meeting',
        description: '参加技术评审会议',
        time: '3小时前',
        project: '用户中心',
      },
    ],
  },
  {
    id: 'member-003',
    name: '王五',
    avatar: 'https://joeschmoe.io/api/v1/random',
    role: '初级前端工程师',
    department: '前端开发部',
    level: 'junior',
    status: 'active',
    efficiency: {
      score: 65,
      tasksCompleted: 18,
      tasksInProgress: 4,
      averageCompletionTime: 4.2,
      qualityScore: 72,
      onTimeDelivery: 75,
    },
    skills: [
      { name: 'JavaScript', level: 6, experience: 1 },
      { name: 'HTML/CSS', level: 7, experience: 1 },
      { name: 'React', level: 5, experience: 0.5 },
      { name: 'Vue.js', level: 4, experience: 0.5 },
    ],
    workload: {
      currentProjects: 1,
      totalHours: 160,
      utilization: 80,
      overtime: 8,
    },
    performance: Array.from({ length: 30 }, (_, i) => ({
      date: dayjs().subtract(29 - i, 'day').format('MM-DD'),
      efficiency: 60 + Math.random() * 15,
      quality: 65 + Math.random() * 15,
      velocity: 55 + Math.random() * 20,
    })),
    recentActivities: [
      {
        type: 'task',
        description: '学习React组件开发',
        time: '30分钟前',
        project: '培训项目',
      },
      {
        type: 'code_review',
        description: '提交代码供审查',
        time: '2小时前',
        project: '项目管理平台',
      },
    ],
  },
];

// 模拟团队架构数据
const mockTeamStructure: TeamStructure[] = [
  {
    department: '前端开发部',
    manager: '张经理',
    totalMembers: 12,
    levels: {
      junior: 4,
      middle: 5,
      senior: 2,
      expert: 1,
    },
    efficiency: {
      overall: 85,
      trend: 3,
    },
    projects: ['项目管理平台', '用户中心', '数据分析平台'],
    technologies: ['React', 'Vue.js', 'TypeScript', 'Node.js'],
  },
  {
    department: '后端开发部',
    manager: '李经理',
    totalMembers: 15,
    levels: {
      junior: 5,
      middle: 6,
      senior: 3,
      expert: 1,
    },
    efficiency: {
      overall: 82,
      trend: -1,
    },
    projects: ['项目管理平台', '用户中心', '数据分析平台', 'API网关'],
    technologies: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka'],
  },
  {
    department: '测试部',
    manager: '王经理',
    totalMembers: 8,
    levels: {
      junior: 2,
      middle: 4,
      senior: 2,
      expert: 0,
    },
    efficiency: {
      overall: 78,
      trend: 2,
    },
    projects: ['项目管理平台', '用户中心', '数据分析平台'],
    technologies: ['Selenium', 'JMeter', 'Postman', 'Jest'],
  },
];

const EfficiencyAnalysis: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string>('member-001');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [viewType, setViewType] = useState<'individual' | 'team' | 'department'>('individual');

  // 获取选中成员数据
  const getSelectedMember = useCallback(() => {
    return mockTeamMembers.find(member => member.id === selectedMember);
  }, [selectedMember]);

  // 生成个人效能趋势图配置
  const getPersonalEfficiencyOption = () => {
    const member = getSelectedMember();
    if (!member) return {};

    const dates = member.performance.map(p => p.date);
    
    return {
      title: {
        text: `${member.name} - 个人效能趋势`,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['效率指数', '质量指数', '速度指数'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        name: '指数',
      },
      series: [
        {
          name: '效率指数',
          type: 'line',
          data: member.performance.map(p => p.efficiency),
          smooth: true,
          itemStyle: { color: '#1890ff' },
        },
        {
          name: '质量指数',
          type: 'line',
          data: member.performance.map(p => p.quality),
          smooth: true,
          itemStyle: { color: '#52c41a' },
        },
        {
          name: '速度指数',
          type: 'line',
          data: member.performance.map(p => p.velocity),
          smooth: true,
          itemStyle: { color: '#fa8c16' },
        },
      ],
    };
  };

  // 生成团队架构分析图配置
  const getTeamStructureOption = () => {
    const departments = mockTeamStructure.map(dept => dept.department);
    const totalMembers = mockTeamStructure.map(dept => dept.totalMembers);
    const efficiency = mockTeamStructure.map(dept => dept.efficiency.overall);

    return {
      title: {
        text: '团队架构分析',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['人员数量', '效能指数'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: departments,
      },
      yAxis: [
        {
          type: 'value',
          name: '人员数量',
          position: 'left',
        },
        {
          type: 'value',
          name: '效能指数',
          position: 'right',
          min: 0,
          max: 100,
        },
      ],
      series: [
        {
          name: '人员数量',
          type: 'bar',
          data: totalMembers,
          itemStyle: { color: '#1890ff' },
        },
        {
          name: '效能指数',
          type: 'line',
          yAxisIndex: 1,
          data: efficiency,
          itemStyle: { color: '#52c41a' },
          smooth: true,
        },
      ],
    };
  };

  // 个人效能表格列配置
  const memberColumns = [
    {
      title: '成员',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TeamMember) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.role}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap = {
          junior: { text: '初级', color: 'blue' },
          middle: { text: '中级', color: 'green' },
          senior: { text: '高级', color: 'orange' },
          expert: { text: '专家', color: 'red' },
        };
        return <Tag color={levelMap[level as keyof typeof levelMap].color}>
          {levelMap[level as keyof typeof levelMap].text}
        </Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          active: { text: '活跃', color: 'green' },
          vacation: { text: '休假', color: 'blue' },
          busy: { text: '忙碌', color: 'orange' },
          offline: { text: '离线', color: 'gray' },
        };
        return <Badge 
          status={statusMap[status as keyof typeof statusMap].color as any}
          text={statusMap[status as keyof typeof statusMap].text}
        />;
      },
    },
    {
      title: '效能得分',
      dataIndex: ['efficiency', 'score'],
      key: 'score',
      render: (score: number) => (
        <Progress
          type="circle"
          size={40}
          percent={score}
          format={() => score}
          strokeColor={score >= 90 ? '#52c41a' : score >= 70 ? '#1890ff' : '#fa8c16'}
        />
      ),
      sorter: (a: TeamMember, b: TeamMember) => a.efficiency.score - b.efficiency.score,
    },
    {
      title: '完成任务',
      dataIndex: ['efficiency', 'tasksCompleted'],
      key: 'tasksCompleted',
      sorter: (a: TeamMember, b: TeamMember) => a.efficiency.tasksCompleted - b.efficiency.tasksCompleted,
    },
    {
      title: '质量评分',
      dataIndex: ['efficiency', 'qualityScore'],
      key: 'qualityScore',
      render: (score: number) => (
        <Text type={score >= 90 ? 'success' : score >= 70 ? undefined : 'warning'}>
          {score}分
        </Text>
      ),
      sorter: (a: TeamMember, b: TeamMember) => a.efficiency.qualityScore - b.efficiency.qualityScore,
    },
    {
      title: '工作负载',
      dataIndex: ['workload', 'utilization'],
      key: 'utilization',
      render: (utilization: number) => (
        <Progress
          percent={utilization}
          size="small"
          status={utilization > 95 ? 'exception' : utilization > 85 ? 'active' : 'normal'}
        />
      ),
      sorter: (a: TeamMember, b: TeamMember) => a.workload.utilization - b.workload.utilization,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>团队效能分析</Title>
          <Text type="secondary">
            分析个人和团队的工作效能、技能分布和人员流动情况，优化团队结构和资源配置
          </Text>
        </div>

        {/* 筛选控制区 */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={6}>
              <Text strong>分析视角：</Text>
              <Radio.Group
                style={{ marginTop: '8px' }}
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <Radio.Button value="individual">个人</Radio.Button>
                <Radio.Button value="team">团队</Radio.Button>
                <Radio.Button value="department">部门</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={6}>
              <Text strong>时间范围：</Text>
              <RangePicker
                style={{ width: '100%', marginTop: '8px' }}
                value={dateRange}
                onChange={(dates) => dates && dates[0] && dates[1] && setDateRange([dates[0], dates[1]])}
              />
            </Col>
            <Col span={6}>
              <Text strong>选择成员：</Text>
              <Select
                style={{ width: '100%', marginTop: '8px' }}
                value={selectedMember}
                onChange={setSelectedMember}
                disabled={viewType !== 'individual'}
              >
                {mockTeamMembers.map(member => (
                  <Select.Option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Space direction="vertical">
                <Button type="primary" icon={<SyncOutlined />}>
                  刷新数据
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出报告
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Tabs defaultActiveKey="individual" type="card">
          {/* 个人效能分析 */}
          <TabPane tab="个人效能" key="individual">
            <Row gutter={[16, 16]}>
              {/* 团队成员效能概览 */}
              <Col span={24}>
                <Card title="团队成员效能概览">
                  <Table
                    dataSource={mockTeamMembers}
                    columns={memberColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Card>
              </Col>

              {/* 选中成员详情 */}
              {viewType === 'individual' && getSelectedMember() && (
                <>
                  <Col span={16}>
                    <Card title="个人效能趋势分析">
                      <ReactECharts
                        option={getPersonalEfficiencyOption()}
                        style={{ height: '400px' }}
                        notMerge={true}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="个人详细信息">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <Avatar size={64} src={getSelectedMember()?.avatar} icon={<UserOutlined />} />
                          <Title level={4} style={{ margin: '8px 0' }}>
                            {getSelectedMember()?.name}
                          </Title>
                          <Text type="secondary">{getSelectedMember()?.role}</Text>
                        </div>
                        
                        <Divider />
                        
                        <Row gutter={[8, 8]}>
                          <Col span={12}>
                            <Statistic
                              title="效能得分"
                              value={getSelectedMember()?.efficiency.score}
                              suffix="/100"
                              valueStyle={{ color: '#1890ff' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="完成任务"
                              value={getSelectedMember()?.efficiency.tasksCompleted}
                              suffix="个"
                              valueStyle={{ color: '#52c41a' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="平均完成时间"
                              value={getSelectedMember()?.efficiency.averageCompletionTime}
                              suffix="天"
                              precision={1}
                              valueStyle={{ color: '#fa8c16' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="准时交付率"
                              value={getSelectedMember()?.efficiency.onTimeDelivery}
                              suffix="%"
                              valueStyle={{ color: '#722ed1' }}
                            />
                          </Col>
                        </Row>

                        <Divider />

                        <div>
                          <Text strong>技能分布</Text>
                          <div style={{ marginTop: '8px' }}>
                            {getSelectedMember()?.skills.map(skill => (
                              <div key={skill.name} style={{ marginBottom: '8px' }}>
                                <Row justify="space-between">
                                  <Text>{skill.name}</Text>
                                  <Text type="secondary">{skill.experience}年</Text>
                                </Row>
                                <Progress percent={skill.level * 10} size="small" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Divider />

                        <div>
                          <Text strong>最近活动</Text>
                          <Timeline style={{ marginTop: '8px' }}>
                            {getSelectedMember()?.recentActivities.map((activity, index) => (
                              <Timeline.Item
                                key={index}
                                dot={
                                  activity.type === 'task' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                                  activity.type === 'bug_fix' ? <BugOutlined style={{ color: '#ff4d4f' }} /> :
                                  <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                                }
                              >
                                <Text>{activity.description}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {activity.project} · {activity.time}
                                </Text>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </TabPane>

          {/* 团队架构分析 */}
          <TabPane tab="团队架构" key="structure">
            <Row gutter={[16, 16]}>
              <Col span={14}>
                <Card title="部门结构分析">
                  <ReactECharts
                    option={getTeamStructureOption()}
                    style={{ height: '400px' }}
                    notMerge={true}
                  />
                </Card>
              </Col>
              <Col span={10}>
                <Card title="部门详情">
                  {mockTeamStructure.map((dept, index) => (
                    <Card key={index} size="small" style={{ marginBottom: '16px' }}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{dept.department}</Text>
                          <Badge 
                            count={dept.totalMembers} 
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        </div>
                        <Text type="secondary">负责人：{dept.manager}</Text>
                        <div>
                          <Text>效能指数：</Text>
                          <Text strong style={{ color: '#52c41a' }}>
                            {dept.efficiency.overall}分
                          </Text>
                          <Text type={dept.efficiency.trend > 0 ? 'success' : 'danger'}>
                            ({dept.efficiency.trend > 0 ? '+' : ''}{dept.efficiency.trend}%)
                          </Text>
                        </div>
                        <div>
                          <Text>技术栈：</Text>
                          <div style={{ marginTop: '4px' }}>
                            {dept.technologies.map(tech => (
                              <Tag key={tech}>{tech}</Tag>
                            ))}
                          </div>
                        </div>
                      </Space>
                    </Card>
                  ))}
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 人员流动统计 */}
          <TabPane tab="人员流动" key="movement">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="流动类型统计">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Statistic title="本月入职" value={3} prefix="+" valueStyle={{ color: '#52c41a' }} />
                    <Statistic title="本月离职" value={1} prefix="-" valueStyle={{ color: '#ff4d4f' }} />
                    <Statistic title="本月调岗" value={2} valueStyle={{ color: '#1890ff' }} />
                    <Statistic title="本月晋升" value={2} prefix="↑" valueStyle={{ color: '#fa8c16' }} />
                  </Space>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="流动趋势">
                  <Text type="secondary">人员流动对团队稳定性和项目进度的影响分析</Text>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Text>团队稳定性：</Text>
                      <Progress percent={85} size="small" status="active" />
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text>知识传承率：</Text>
                      <Progress percent={75} size="small" />
                    </div>
                    <div>
                      <Text>适应周期：</Text>
                      <Text strong> 平均2.5周</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default EfficiencyAnalysis;