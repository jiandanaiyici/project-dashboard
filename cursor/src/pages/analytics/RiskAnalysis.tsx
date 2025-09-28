import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Statistic,
  Progress,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  message,
  Tabs,
  List,
  Badge,
  Tooltip,
  Alert
} from 'antd';
import { 
  WarningOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const RiskAnalysis: React.FC = () => {
  const [riskData, setRiskData] = useState([
    {
      id: 1,
      title: '项目进度延期风险',
      type: 'schedule',
      level: 'high',
      probability: 80,
      impact: 90,
      riskScore: 85,
      status: 'active',
      project: '电商平台重构',
      owner: '张三',
      description: '由于需求变更频繁，项目进度存在延期风险',
      mitigation: '加强需求管理，增加缓冲时间',
      createDate: '2024-01-10',
      dueDate: '2024-02-15'
    },
    {
      id: 2,
      title: '技术架构风险',
      type: 'technical',
      level: 'medium',
      probability: 60,
      impact: 70,
      riskScore: 65,
      status: 'active',
      project: '移动端开发',
      owner: '李四',
      description: '新技术栈可能存在兼容性问题',
      mitigation: '进行技术预研和POC验证',
      createDate: '2024-01-12',
      dueDate: '2024-01-30'
    },
    {
      id: 3,
      title: '人员流失风险',
      type: 'personnel',
      level: 'medium',
      probability: 50,
      impact: 80,
      riskScore: 70,
      status: 'active',
      project: '数据分析平台',
      owner: '王五',
      description: '核心开发人员可能离职',
      mitigation: '加强团队建设，提供培训机会',
      createDate: '2024-01-08',
      dueDate: '2024-02-28'
    },
    {
      id: 4,
      title: '预算超支风险',
      type: 'financial',
      level: 'low',
      probability: 30,
      impact: 60,
      riskScore: 45,
      status: 'resolved',
      project: '管理后台',
      owner: '赵六',
      description: '项目预算可能超支',
      mitigation: '严格控制成本，定期审查预算',
      createDate: '2024-01-05',
      dueDate: '2024-01-20'
    }
  ]);

  const [riskStats, setRiskStats] = useState({
    total: 4,
    active: 3,
    resolved: 1,
    high: 1,
    medium: 2,
    low: 1
  });

  const [riskTrend, setRiskTrend] = useState([
    { date: '2024-01-01', value: 2, category: '新增风险' },
    { date: '2024-01-02', value: 1, category: '新增风险' },
    { date: '2024-01-03', value: 0, category: '新增风险' },
    { date: '2024-01-04', value: 1, category: '新增风险' },
    { date: '2024-01-05', value: 0, category: '新增风险' },
    { date: '2024-01-01', value: 1, category: '解决风险' },
    { date: '2024-01-02', value: 0, category: '解决风险' },
    { date: '2024-01-03', value: 1, category: '解决风险' },
    { date: '2024-01-04', value: 0, category: '解决风险' },
    { date: '2024-01-05', value: 0, category: '解决风险' }
  ]);

  const [riskDistribution, setRiskDistribution] = useState([
    { name: '进度风险', value: 1, color: '#f5222d' },
    { name: '技术风险', value: 1, color: '#faad14' },
    { name: '人员风险', value: 1, color: '#1890ff' },
    { name: '财务风险', value: 1, color: '#52c41a' }
  ]);

  const getLevelTag = (level: string) => {
    const levelConfig = {
      high: { color: 'red', text: '高风险', icon: <ExclamationCircleOutlined /> },
      medium: { color: 'orange', text: '中风险', icon: <WarningOutlined /> },
      low: { color: 'green', text: '低风险', icon: <CheckCircleOutlined /> }
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'red', text: '活跃' },
      resolved: { color: 'green', text: '已解决' },
      closed: { color: 'blue', text: '已关闭' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      schedule: { color: 'red', text: '进度风险' },
      technical: { color: 'orange', text: '技术风险' },
      personnel: { color: 'blue', text: '人员风险' },
      financial: { color: 'green', text: '财务风险' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return '#f5222d';
    if (score >= 60) return '#faad14';
    return '#52c41a';
  };

  const riskColumns = [
    {
      title: '风险标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <WarningOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: '风险等级',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getLevelTag(level)
    },
    {
      title: '风险评分',
      dataIndex: 'riskScore',
      key: 'riskScore',
      render: (score: number) => (
        <div style={{ color: getRiskScoreColor(score), fontWeight: 'bold' }}>
          {score}
        </div>
      )
    },
    {
      title: '概率/影响',
      key: 'probability',
      render: (record: any) => (
        <div>
          <div>概率: {record.probability}%</div>
          <div>影响: {record.impact}%</div>
        </div>
      )
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project'
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate'
    }
  ];

  return (
    <div className="risk-analysis">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="风险概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总风险数"
                    value={riskStats.total}
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="活跃风险"
                    value={riskStats.active}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已解决"
                    value={riskStats.resolved}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="高风险"
                    value={riskStats.high}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="风险类型分布">
                  <RingChart
                    data={riskDistribution}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="风险趋势">
                  <TrendChart
                    data={riskTrend}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Alert
                  message="风险预警"
                  description="当前有1个高风险项目需要重点关注，建议立即采取缓解措施。"
                  type="warning"
                  showIcon
                  action={
                    <Button size="small" type="primary">
                      查看详情
                    </Button>
                  }
                />
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="风险列表" key="risks">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<WarningOutlined />}>
                  新建风险
                </Button>
                <Select placeholder="选择风险等级" style={{ width: 120 }}>
                  <Option value="all">全部等级</Option>
                  <Option value="high">高风险</Option>
                  <Option value="medium">中风险</Option>
                  <Option value="low">低风险</Option>
                </Select>
                <Select placeholder="选择风险类型" style={{ width: 120 }}>
                  <Option value="all">全部类型</Option>
                  <Option value="schedule">进度风险</Option>
                  <Option value="technical">技术风险</Option>
                  <Option value="personnel">人员风险</Option>
                  <Option value="financial">财务风险</Option>
                </Select>
                <RangePicker />
              </Space>
            </div>

            <Table
              columns={riskColumns}
              dataSource={riskData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="风险分析" key="analysis">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="风险评分分布">
                  <GaugeChart
                    data={[
                      { name: '高风险', value: 1, max: 4, unit: '个' },
                      { name: '中风险', value: 2, max: 4, unit: '个' },
                      { name: '低风险', value: 1, max: 4, unit: '个' }
                    ]}
                    height={200}
                    showMultiple={true}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="风险解决率">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      {((riskStats.resolved / riskStats.total) * 100).toFixed(1)}%
                    </div>
                    <div style={{ color: '#666' }}>风险解决率</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="平均风险评分">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                      {riskData.reduce((sum, item) => sum + item.riskScore, 0) / riskData.length}
                    </div>
                    <div style={{ color: '#666' }}>平均风险评分</div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="风险矩阵">
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                    <div style={{ marginTop: 16, color: '#666' }}>
                      风险矩阵图功能开发中...
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="缓解措施" key="mitigation">
            <List
              dataSource={riskData.filter(item => item.status === 'active')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{item.title}</span>
                        {getLevelTag(item.level)}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>{item.description}</div>
                        <div style={{ color: '#666' }}>
                          <strong>缓解措施：</strong>{item.mitigation}
                        </div>
                      </div>
                    }
                  />
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>负责人：</strong>{item.owner}
                    </div>
                    <div style={{ color: '#666' }}>
                      <strong>截止日期：</strong>{item.dueDate}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default RiskAnalysis;
