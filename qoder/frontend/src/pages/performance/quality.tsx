import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Steps,
  Table,
  Tag,
  Button,
  Progress,
  Timeline,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Space,
  Typography,
  Tabs,
  Alert,
  Statistic,
  List,
  Avatar,
} from 'antd';
import {
  RocketOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BugOutlined,
  CodeOutlined,
  UploadOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ReleaseRecord {
  id: string;
  version: string;
  appName: string;
  status: 'pending' | 'testing' | 'approved' | 'deploying' | 'deployed' | 'failed';
  qualityScore: number;
  testCoverage: number;
  bugCount: number;
  creator: string;
  createTime: string;
  deployTime?: string;
  environment: 'dev' | 'test' | 'staging' | 'prod';
}

interface QualityGate {
  id: string;
  name: string;
  type: 'code' | 'test' | 'security' | 'performance';
  status: 'passed' | 'failed' | 'warning';
  threshold: number;
  actualValue: number;
  description: string;
}

const QualityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('releases');
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟发布记录数据
  const releaseRecords: ReleaseRecord[] = [
    {
      id: '1',
      version: 'v1.2.3',
      appName: '项目管理平台',
      status: 'deployed',
      qualityScore: 92,
      testCoverage: 85,
      bugCount: 2,
      creator: '张三',
      createTime: '2024-01-15 09:00:00',
      deployTime: '2024-01-15 14:30:00',
      environment: 'prod',
    },
    {
      id: '2',
      version: 'v2.1.0',
      appName: '用户管理系统',
      status: 'testing',
      qualityScore: 78,
      testCoverage: 72,
      bugCount: 8,
      creator: '李四',
      createTime: '2024-01-14 16:20:00',
      environment: 'test',
    },
    {
      id: '3',
      version: 'v3.0.1',
      appName: '数据分析平台',
      status: 'failed',
      qualityScore: 65,
      testCoverage: 58,
      bugCount: 15,
      creator: '王五',
      createTime: '2024-01-13 11:15:00',
      environment: 'test',
    },
  ];

  // 质量门禁规则
  const qualityGates: QualityGate[] = [
    {
      id: '1',
      name: '代码覆盖率',
      type: 'code',
      status: 'passed',
      threshold: 80,
      actualValue: 85,
      description: '单元测试覆盖率必须达到80%以上',
    },
    {
      id: '2',
      name: '代码质量评分',
      type: 'code',
      status: 'warning',
      threshold: 85,
      actualValue: 82,
      description: 'SonarQube代码质量评分',
    },
    {
      id: '3',
      name: '安全漏洞检测',
      type: 'security',
      status: 'passed',
      threshold: 0,
      actualValue: 0,
      description: '高危安全漏洞数量必须为0',
    },
    {
      id: '4',
      name: '性能测试',
      type: 'performance',
      status: 'failed',
      threshold: 500,
      actualValue: 650,
      description: '接口响应时间不超过500ms',
    },
  ];

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'default',
      testing: 'processing',
      approved: 'success',
      deploying: 'processing',
      deployed: 'success',
      failed: 'error',
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap = {
      pending: '待审核',
      testing: '测试中',
      approved: '已批准',
      deploying: '部署中',
      deployed: '已部署',
      failed: '失败',
    };
    return textMap[status as keyof typeof textMap] || '未知';
  };

  const getQualityGateIcon = (type: string) => {
    const iconMap = {
      code: <CodeOutlined />,
      test: <BugOutlined />,
      security: <ExclamationCircleOutlined />,
      performance: <RocketOutlined />,
    };
    return iconMap[type as keyof typeof iconMap] || <FileTextOutlined />;
  };

  const getQualityGateColor = (status: string) => {
    const colorMap = {
      passed: 'success',
      failed: 'error',
      warning: 'warning',
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  // 发布流程步骤
  const getReleaseSteps = (status: string) => {
    type StepStatus = 'finish' | 'process' | 'wait' | 'error';
    
    const getStepStatus = (condition: boolean, activeStatus: StepStatus, inactiveStatus: StepStatus = 'wait'): StepStatus => {
      return condition ? activeStatus : inactiveStatus;
    };
    
    const steps = [
      { title: '代码提交', status: 'finish' as StepStatus },
      { title: '质量检测', status: getStepStatus(status === 'pending', 'process', 'finish') },
      { title: '测试验证', status: getStepStatus(
        ['testing', 'approved', 'deploying', 'deployed'].includes(status),
        status === 'testing' ? 'process' : 'finish'
      ) },
      { title: '审核批准', status: getStepStatus(
        ['approved', 'deploying', 'deployed'].includes(status),
        status === 'approved' ? 'process' : 'finish'
      ) },
      { title: '部署发布', status: (
        status === 'deploying' ? 'process' :
        status === 'deployed' ? 'finish' :
        status === 'failed' ? 'error' : 'wait'
      ) as StepStatus },
    ];
    return steps;
  };

  // 质量趋势图表
  const qualityTrendOption = {
    title: {
      text: '发布质量趋势',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['质量评分', '测试覆盖率', 'Bug数量'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['v1.1.0', 'v1.1.5', 'v1.2.0', 'v1.2.1', 'v1.2.2', 'v1.2.3']
    },
    yAxis: [
      {
        type: 'value',
        name: '评分/覆盖率',
        position: 'left',
        max: 100
      },
      {
        type: 'value',
        name: 'Bug数量',
        position: 'right'
      }
    ],
    series: [
      {
        name: '质量评分',
        type: 'line',
        yAxisIndex: 0,
        data: [75, 82, 88, 85, 90, 92],
        itemStyle: { color: '#1890ff' },
        smooth: true
      },
      {
        name: '测试覆盖率',
        type: 'line',
        yAxisIndex: 0,
        data: [68, 72, 78, 75, 82, 85],
        itemStyle: { color: '#52c41a' },
        smooth: true
      },
      {
        name: 'Bug数量',
        type: 'bar',
        yAxisIndex: 1,
        data: [12, 8, 5, 7, 3, 2],
        itemStyle: { color: '#ff4d4f' }
      }
    ]
  };

  // 发布成功率图表
  const successRateOption = {
    title: {
      text: '发布成功率统计',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '发布状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { value: 85, name: '成功', itemStyle: { color: '#52c41a' } },
          { value: 10, name: '失败', itemStyle: { color: '#ff4d4f' } },
          { value: 5, name: '进行中', itemStyle: { color: '#1890ff' } }
        ]
      }
    ]
  };

  const releaseColumns = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (text: string, record: ReleaseRecord) => (
        <Space>
          <RocketOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.appName}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score: number) => (
        <div>
          <Progress
            percent={score}
            size="small"
            strokeColor={score >= 85 ? '#52c41a' : score >= 70 ? '#faad14' : '#ff4d4f'}
          />
          <Text style={{ fontSize: 12 }}>{score}分</Text>
        </div>
      ),
    },
    {
      title: '测试覆盖率',
      dataIndex: 'testCoverage',
      key: 'testCoverage',
      render: (coverage: number) => `${coverage}%`,
    },
    {
      title: 'Bug数量',
      dataIndex: 'bugCount',
      key: 'bugCount',
      render: (count: number) => (
        <span style={{ color: count > 5 ? '#ff4d4f' : count > 2 ? '#faad14' : '#52c41a' }}>
          {count}
        </span>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => time.split(' ')[0],
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ReleaseRecord) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedRelease(record.id)}
          >
            详情
          </Button>
          {record.status === 'approved' && (
            <Button type="link" icon={<PlayCircleOutlined />}>
              部署
            </Button>
          )}
          {record.status === 'testing' && (
            <Button type="link" icon={<StopOutlined />} danger>
              停止
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateRelease = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('发布申请已提交');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <RocketOutlined style={{ marginRight: '8px' }} />
          发布质量管控
        </Title>
        <Text type="secondary">
          规范化应用发布流程，确保发布质量和稳定性
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="发布记录" key="releases">
          <Card
            title="发布记录"
            extra={
              <Button type="primary" icon={<RocketOutlined />} onClick={handleCreateRelease}>
                创建发布
              </Button>
            }
          >
            <Table
              columns={releaseColumns}
              dataSource={releaseRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="质量门禁" key="quality-gates">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="质量门禁规则">
                <List
                  dataSource={qualityGates}
                  renderItem={(gate) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={getQualityGateIcon(gate.type)}
                            style={{
                              backgroundColor: 
                                gate.status === 'passed' ? '#52c41a' :
                                gate.status === 'warning' ? '#faad14' : '#ff4d4f'
                            }}
                          />
                        }
                        title={
                          <Space>
                            {gate.name}
                            <Tag color={getQualityGateColor(gate.status)}>
                              {gate.status === 'passed' ? '通过' :
                               gate.status === 'warning' ? '警告' : '失败'}
                            </Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <div>{gate.description}</div>
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary">
                                阈值: {gate.threshold} | 实际值: {gate.actualValue}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="门禁统计">
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="通过率"
                    value={75}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <Progress
                      type="circle"
                      percent={75}
                      strokeColor="#52c41a"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="发布流程" key="process">
          {selectedRelease ? (
            <Card title={`发布流程 - ${releaseRecords.find(r => r.id === selectedRelease)?.version}`}>
              <Steps
                current={getReleaseSteps(releaseRecords.find(r => r.id === selectedRelease)?.status || 'pending')
                  .findIndex(step => step.status === 'process')}
                items={getReleaseSteps(releaseRecords.find(r => r.id === selectedRelease)?.status || 'pending')}
              />
              <div style={{ marginTop: '24px' }}>
                <Timeline>
                  <Timeline.Item color="green">
                    <Text strong>代码提交</Text>
                    <br />
                    <Text type="secondary">2024-01-15 09:00:00</Text>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>质量检测通过</Text>
                    <br />
                    <Text type="secondary">2024-01-15 09:30:00</Text>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>测试验证完成</Text>
                    <br />
                    <Text type="secondary">2024-01-15 12:00:00</Text>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>审核批准</Text>
                    <br />
                    <Text type="secondary">2024-01-15 14:00:00</Text>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>部署成功</Text>
                    <br />
                    <Text type="secondary">2024-01-15 14:30:00</Text>
                  </Timeline.Item>
                </Timeline>
              </div>
            </Card>
          ) : (
            <Alert
              message="请选择一个发布记录查看详细流程"
              type="info"
              showIcon
            />
          )}
        </TabPane>

        <TabPane tab="质量统计" key="statistics">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="质量趋势分析" style={{ height: '400px' }}>
                <ReactECharts option={qualityTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="发布成功率" style={{ height: '400px' }}>
                <ReactECharts option={successRateOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 创建发布模态框 */}
      <Modal
        title="创建发布"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="appName"
            label="应用名称"
            rules={[{ required: true, message: '请选择应用' }]}
          >
            <Select placeholder="选择应用">
              <Select.Option value="项目管理平台">项目管理平台</Select.Option>
              <Select.Option value="用户管理系统">用户管理系统</Select.Option>
              <Select.Option value="数据分析平台">数据分析平台</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="如: v1.2.3" />
          </Form.Item>
          <Form.Item
            name="environment"
            label="目标环境"
            rules={[{ required: true, message: '请选择环境' }]}
          >
            <Select placeholder="选择环境">
              <Select.Option value="test">测试环境</Select.Option>
              <Select.Option value="staging">预发布环境</Select.Option>
              <Select.Option value="prod">生产环境</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="发布说明"
            rules={[{ required: true, message: '请填写发布说明' }]}
          >
            <TextArea rows={4} placeholder="请描述此次发布的主要内容和变更" />
          </Form.Item>
          <Form.Item name="attachment" label="相关文档">
            <Upload>
              <Button icon={<UploadOutlined />}>上传文档</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QualityManagement;