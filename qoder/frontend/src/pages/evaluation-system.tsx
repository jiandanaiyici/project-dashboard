import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Modal, 
  Form,
  Rate,
  Tabs,
  List,
  Avatar,
  Space,
  Progress,
  Badge,
  message,
  DatePicker,
  Statistic,
  Timeline,
  Alert,
  Radio,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  StarOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  SendOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { PageHeader, StatCard } from '@/components';

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Evaluation {
  id: string;
  evaluateeId: string;
  evaluateeName: string;
  evaluatorId: string;
  evaluatorName: string;
  type: '360' | 'annual' | 'probation' | 'promotion';
  period: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'completed';
  overallScore: number;
  dimensions: EvaluationDimension[];
  comments: string;
  goals: string[];
  achievements: string[];
  improvementAreas: string[];
  createdAt: string;
  submittedAt?: string;
  reviewedAt?: string;
}

interface EvaluationDimension {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
  criteria: string[];
  comments?: string;
}

interface PerformanceGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'performance' | 'development' | 'behavior';
  targetValue?: string;
  currentValue?: string;
  progress: number;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  createdAt: string;
}

/**
 * 评价概览统计
 */
const EvaluationOverview: React.FC = () => {
  const stats = {
    totalEvaluations: 128,
    completedEvaluations: 98,
    pendingEvaluations: 23,
    overdueEvaluations: 7,
    averageScore: 4.2,
    participationRate: 92
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <StatCard
          title="总评价数"
          value={stats.totalEvaluations}
          icon={<FileTextOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="已完成"
          value={stats.completedEvaluations}
          icon={<CheckCircleOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="待处理"
          value={stats.pendingEvaluations}
          icon={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="逾期"
          value={stats.overdueEvaluations}
          icon={<ExclamationCircleOutlined />}
        />
      </Col>

      <Col span={8}>
        <Card>
          <Statistic
            title="平均评分"
            value={stats.averageScore}
            precision={1}
            suffix="/ 5"
            valueStyle={{ color: '#52c41a' }}
            prefix={<StarOutlined />}
          />
          <Progress 
            percent={(stats.averageScore / 5) * 100} 
            strokeColor="#52c41a"
            style={{ marginTop: 8 }}
            showInfo={false}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="参与率"
            value={stats.participationRate}
            suffix="%"
            valueStyle={{ color: '#1890ff' }}
            prefix={<TeamOutlined />}
          />
          <Progress 
            percent={stats.participationRate} 
            strokeColor="#1890ff"
            style={{ marginTop: 8 }}
            showInfo={false}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic
            title="完成率"
            value={Math.round((stats.completedEvaluations / stats.totalEvaluations) * 100)}
            suffix="%"
            valueStyle={{ color: '#fa8c16' }}
            prefix={<TrophyOutlined />}
          />
          <Progress 
            percent={Math.round((stats.completedEvaluations / stats.totalEvaluations) * 100)} 
            strokeColor="#fa8c16"
            style={{ marginTop: 8 }}
            showInfo={false}
          />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 评价分析图表
 */
const EvaluationCharts: React.FC = () => {
  // 评分分布图
  const scoreDistributionOption = {
    title: { text: '评分分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 5, name: '优秀(4.5-5.0)', itemStyle: { color: '#52c41a' } },
          { value: 35, name: '良好(3.5-4.4)', itemStyle: { color: '#1890ff' } },
          { value: 45, name: '一般(2.5-3.4)', itemStyle: { color: '#fa8c16' } },
          { value: 15, name: '待改进(<2.5)', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  };

  // 各维度评分对比
  const dimensionComparisonOption = {
    title: { text: '各维度评分对比', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['工作质量', '工作效率', '团队协作', '创新能力', '学习能力', '领导力']
    },
    yAxis: { type: 'value', min: 0, max: 5 },
    series: [
      {
        name: '平均评分',
        type: 'bar',
        data: [4.3, 4.1, 4.5, 3.8, 4.2, 3.6],
        itemStyle: {
          color: (params: any) => {
            const colors = ['#52c41a', '#1890ff', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2'];
            return colors[params.dataIndex % colors.length];
          }
        }
      }
    ]
  };

  // 评价趋势
  const evaluationTrendOption = {
    title: { text: '评价趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均评分', '参与人数'], bottom: 0 },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yAxis: [
      { type: 'value', name: '评分', min: 0, max: 5 },
      { type: 'value', name: '人数', position: 'right' }
    ],
    series: [
      {
        name: '平均评分',
        type: 'line',
        data: [4.0, 4.1, 4.2, 4.3],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '参与人数',
        type: 'bar',
        yAxisIndex: 1,
        data: [45, 48, 52, 55],
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card title="评分分布">
          <ReactECharts option={scoreDistributionOption} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="各维度评分">
          <ReactECharts option={dimensionComparisonOption} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="评价趋势">
          <ReactECharts option={evaluationTrendOption} style={{ height: 300 }} />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 360度评价管理
 */
const Evaluation360Management: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    const mockEvaluations: Evaluation[] = [
      {
        id: 'eval1',
        evaluateeId: 'user1',
        evaluateeName: '张三',
        evaluatorId: 'user2',
        evaluatorName: '李四',
        type: '360',
        period: '2024年第一季度',
        status: 'completed',
        overallScore: 4.2,
        dimensions: [
          {
            name: '工作质量',
            weight: 25,
            score: 4.5,
            maxScore: 5,
            criteria: ['按时完成任务', '工作成果质量高', '注重细节']
          },
          {
            name: '团队协作',
            weight: 25,
            score: 4.0,
            maxScore: 5,
            criteria: ['积极配合同事', '主动分享知识', '冲突处理能力']
          }
        ],
        comments: '张三在本季度表现优秀，技术能力强，团队协作良好。',
        goals: ['提升React技能', '学习项目管理'],
        achievements: ['完成ERP系统开发', '获得前端技能认证'],
        improvementAreas: ['时间管理', '跨部门沟通'],
        createdAt: '2024-01-01',
        submittedAt: '2024-01-15',
        reviewedAt: '2024-01-20'
      }
    ];

    setEvaluations(mockEvaluations);
  }, []);

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setModalVisible(true);
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      draft: { color: 'default', text: '草稿' },
      submitted: { color: 'processing', text: '已提交' },
      reviewed: { color: 'warning', text: '已审核' },
      completed: { color: 'success', text: '已完成' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      '360': { color: 'blue', text: '360度评价' },
      annual: { color: 'green', text: '年度评价' },
      probation: { color: 'orange', text: '试用期评价' },
      promotion: { color: 'purple', text: '晋升评价' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '被评价人',
      dataIndex: 'evaluateeName',
      key: 'evaluateeName',
    },
    {
      title: '评价人',
      dataIndex: 'evaluatorName',
      key: 'evaluatorName',
    },
    {
      title: '评价类型',
      dataIndex: 'type',
      key: 'type',
      render: getTypeTag,
    },
    {
      title: '评价周期',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '总分',
      dataIndex: 'overallScore',
      key: 'overallScore',
      render: (score: number) => (
        <div>
          <Rate disabled value={score} allowHalf style={{ fontSize: 16 }} />
          <div style={{ color: score >= 4 ? '#52c41a' : score >= 3 ? '#fa8c16' : '#ff4d4f' }}>
            {score.toFixed(1)}
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: Evaluation) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewEvaluation(record)}
          >
            查看
          </Button>
          <Button size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="360度评价管理"
      extra={
        <Space>
          <Button icon={<CalendarOutlined />}>批量发起评价</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            发起评价
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={evaluations}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="评价详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedEvaluation && (
          <div>
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={12}>
                <div><strong>被评价人:</strong> {selectedEvaluation.evaluateeName}</div>
                <div><strong>评价人:</strong> {selectedEvaluation.evaluatorName}</div>
              </Col>
              <Col span={12}>
                <div><strong>评价周期:</strong> {selectedEvaluation.period}</div>
                <div><strong>总分:</strong> {selectedEvaluation.overallScore}/5</div>
              </Col>
            </Row>

            <Divider orientation="left">各维度评分</Divider>
            {selectedEvaluation.dimensions.map((dimension, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <strong>{dimension.name}</strong> (权重: {dimension.weight}%)
                  </Col>
                  <Col>
                    <Rate disabled value={dimension.score} style={{ fontSize: 16 }} />
                    <span style={{ marginLeft: 8 }}>{dimension.score}/{dimension.maxScore}</span>
                  </Col>
                </Row>
                <Progress 
                  percent={(dimension.score / dimension.maxScore) * 100} 
                  strokeColor="#52c41a"
                  style={{ marginTop: 4 }}
                />
              </div>
            ))}

            <Divider orientation="left">评价意见</Divider>
            <p>{selectedEvaluation.comments}</p>

            <Row gutter={16}>
              <Col span={8}>
                <Divider orientation="left">目标设定</Divider>
                <List
                  size="small"
                  dataSource={selectedEvaluation.goals}
                  renderItem={item => <List.Item>• {item}</List.Item>}
                />
              </Col>
              <Col span={8}>
                <Divider orientation="left">主要成就</Divider>
                <List
                  size="small"
                  dataSource={selectedEvaluation.achievements}
                  renderItem={item => <List.Item>• {item}</List.Item>}
                />
              </Col>
              <Col span={8}>
                <Divider orientation="left">改进建议</Divider>
                <List
                  size="small"
                  dataSource={selectedEvaluation.improvementAreas}
                  renderItem={item => <List.Item>• {item}</List.Item>}
                />
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

/**
 * 绩效目标管理
 */
const PerformanceGoals: React.FC = () => {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);

  useEffect(() => {
    const mockGoals: PerformanceGoal[] = [
      {
        id: 'goal1',
        userId: 'user1',
        title: '完成React项目开发',
        description: '在Q1完成ERP系统前端开发',
        category: 'performance',
        targetValue: '100%',
        currentValue: '85%',
        progress: 85,
        dueDate: '2024-03-31',
        status: 'in_progress',
        createdAt: '2024-01-01'
      },
      {
        id: 'goal2',
        userId: 'user1',
        title: '提升技术技能',
        description: '学习Node.js后端开发技术',
        category: 'development',
        progress: 60,
        dueDate: '2024-06-30',
        status: 'in_progress',
        createdAt: '2024-01-15'
      }
    ];

    setGoals(mockGoals);
  }, []);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      not_started: { color: 'default', text: '未开始' },
      in_progress: { color: 'processing', text: '进行中' },
      completed: { color: 'success', text: '已完成' },
      overdue: { color: 'error', text: '已逾期' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getCategoryTag = (category: string) => {
    const categoryConfig = {
      performance: { color: 'blue', text: '绩效目标' },
      development: { color: 'green', text: '发展目标' },
      behavior: { color: 'orange', text: '行为目标' }
    };
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '目标标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: getCategoryTag,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div style={{ width: 100 }}>
          <Progress 
            percent={progress} 
            size="small"
            strokeColor={progress >= 80 ? '#52c41a' : progress >= 50 ? '#fa8c16' : '#ff4d4f'}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />}>编辑</Button>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="绩效目标管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          设定目标
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={goals}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

/**
 * 评价系统主页面
 */
const EvaluationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="人员评价系统" />
      
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="评价概览" key="overview">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <EvaluationOverview />
            <EvaluationCharts />
          </Space>
        </TabPane>
        
        <TabPane tab="360度评价" key="360evaluation">
          <Evaluation360Management />
        </TabPane>
        
        <TabPane tab="绩效目标" key="goals">
          <PerformanceGoals />
        </TabPane>
        
        <TabPane tab="评价报告" key="reports">
          <Card title="评价报告">
            <Alert
              message="评价报告功能"
              description="自动生成个人和团队评价报告，包含详细的分析和建议。"
              type="info"
              showIcon
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EvaluationSystem;