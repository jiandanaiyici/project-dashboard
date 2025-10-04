import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Space,
  Typography,
  Tabs,
  Statistic,
  Progress,
  Alert,
  Timeline,
  Divider,
  Radio,
  Slider,
  Tooltip,
} from 'antd';
import {
  FunctionOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BugOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface Requirement {
  id: string;
  title: string;
  type: 'feature' | 'bug' | 'optimization' | 'research';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planning' | 'developing' | 'testing' | 'completed';
  complexity: number; // 1-10
  estimatedDays: number;
  actualDays?: number;
  assignee: string;
  creator: string;
  createTime: string;
  description: string;
  factors: {
    technical: number;
    business: number;
    integration: number;
    testing: number;
    risk: number;
  };
}

interface ComplexityFactor {
  name: string;
  weight: number;
  description: string;
  examples: string[];
}

const ComplexityAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [form] = Form.useForm();

  // 复杂度评估因子
  const complexityFactors: ComplexityFactor[] = [
    {
      name: '技术复杂度',
      weight: 0.3,
      description: '技术实现的难度和复杂程度',
      examples: ['新技术栈', '复杂算法', '性能要求', '技术债务'],
    },
    {
      name: '业务复杂度',
      weight: 0.25,
      description: '业务逻辑的复杂程度',
      examples: ['复杂业务规则', '多角色权限', '复杂工作流', '数据处理'],
    },
    {
      name: '集成复杂度',
      weight: 0.2,
      description: '与其他系统集成的复杂度',
      examples: ['第三方API', '数据同步', '系统间通信', '跨平台兼容'],
    },
    {
      name: '测试复杂度',
      weight: 0.15,
      description: '测试验证的难度',
      examples: ['端到端测试', '性能测试', '兼容性测试', '边界条件'],
    },
    {
      name: '风险评估',
      weight: 0.1,
      description: '实现过程中的潜在风险',
      examples: ['技术风险', '时间风险', '资源风险', '依赖风险'],
    },
  ];

  // 模拟需求数据
  const requirements: Requirement[] = [
    {
      id: '1',
      title: '用户权限管理重构',
      type: 'feature',
      priority: 'high',
      status: 'developing',
      complexity: 8,
      estimatedDays: 15,
      actualDays: 12,
      assignee: '张三',
      creator: '李经理',
      createTime: '2024-01-10',
      description: '重构现有权限系统，支持细粒度权限控制',
      factors: {
        technical: 8,
        business: 9,
        integration: 6,
        testing: 7,
        risk: 6,
      },
    },
    {
      id: '2',
      title: '数据导出功能优化',
      type: 'optimization',
      priority: 'medium',
      status: 'completed',
      complexity: 5,
      estimatedDays: 8,
      actualDays: 6,
      assignee: '李四',
      creator: '王产品',
      createTime: '2024-01-05',
      description: '优化大数据量导出性能，支持异步导出',
      factors: {
        technical: 6,
        business: 4,
        integration: 5,
        testing: 5,
        risk: 4,
      },
    },
    {
      id: '3',
      title: '移动端适配',
      type: 'feature',
      priority: 'high',
      status: 'planning',
      complexity: 7,
      estimatedDays: 20,
      assignee: '王五',
      creator: '赵总监',
      createTime: '2024-01-12',
      description: '开发移动端响应式界面，支持触摸操作',
      factors: {
        technical: 7,
        business: 6,
        integration: 8,
        testing: 8,
        risk: 7,
      },
    },
    {
      id: '4',
      title: 'Bug修复：登录异常',
      type: 'bug',
      priority: 'critical',
      status: 'testing',
      complexity: 3,
      estimatedDays: 2,
      actualDays: 3,
      assignee: '赵六',
      creator: '测试团队',
      createTime: '2024-01-14',
      description: '修复特定条件下的登录失败问题',
      factors: {
        technical: 4,
        business: 2,
        integration: 3,
        testing: 4,
        risk: 5,
      },
    },
  ];

  const getTypeColor = (type: string) => {
    const colorMap = {
      feature: 'blue',
      bug: 'red',
      optimization: 'green',
      research: 'purple',
    };
    return colorMap[type as keyof typeof colorMap] || 'default';
  };

  const getTypeText = (type: string) => {
    const textMap = {
      feature: '新功能',
      bug: 'Bug修复',
      optimization: '优化',
      research: '调研',
    };
    return textMap[type as keyof typeof textMap] || '未知';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      low: 'default',
      medium: 'warning',
      high: 'error',
      critical: 'error',
    };
    return colorMap[priority as keyof typeof colorMap] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      planning: 'default',
      developing: 'processing',
      testing: 'warning',
      completed: 'success',
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 3) return '#52c41a';
    if (complexity <= 6) return '#faad14';
    if (complexity <= 8) return '#ff7a45';
    return '#ff4d4f';
  };

  // 计算复杂度分数
  const calculateComplexity = (factors: any) => {
    let totalScore = 0;
    complexityFactors.forEach(factor => {
      const factorKey = factor.name === '技术复杂度' ? 'technical' :
                       factor.name === '业务复杂度' ? 'business' :
                       factor.name === '集成复杂度' ? 'integration' :
                       factor.name === '测试复杂度' ? 'testing' : 'risk';
      totalScore += factors[factorKey] * factor.weight;
    });
    return Math.round(totalScore);
  };

  // 复杂度分布图表
  const complexityDistributionOption = {
    title: {
      text: '需求复杂度分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '复杂度分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: [
          { 
            value: requirements.filter(r => r.complexity <= 3).length, 
            name: '简单(1-3)', 
            itemStyle: { color: '#52c41a' }
          },
          { 
            value: requirements.filter(r => r.complexity > 3 && r.complexity <= 6).length, 
            name: '中等(4-6)', 
            itemStyle: { color: '#faad14' }
          },
          { 
            value: requirements.filter(r => r.complexity > 6 && r.complexity <= 8).length, 
            name: '复杂(7-8)', 
            itemStyle: { color: '#ff7a45' }
          },
          { 
            value: requirements.filter(r => r.complexity > 8).length, 
            name: '极复杂(9-10)', 
            itemStyle: { color: '#ff4d4f' }
          },
        ]
      }
    ]
  };

  // 估算准确性分析
  const estimationAccuracyOption = {
    title: {
      text: '工期估算准确性',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['预估工期', '实际工期'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: requirements.filter(r => r.actualDays).map(r => r.title)
    },
    yAxis: {
      type: 'value',
      name: '天数'
    },
    series: [
      {
        name: '预估工期',
        type: 'bar',
        data: requirements.filter(r => r.actualDays).map(r => r.estimatedDays),
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '实际工期',
        type: 'bar',
        data: requirements.filter(r => r.actualDays).map(r => r.actualDays),
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  // 复杂度趋势
  const complexityTrendOption = {
    title: {
      text: '复杂度趋势分析',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月1周', '1月2周', '1月3周', '1月4周', '2月1周']
    },
    yAxis: {
      type: 'value',
      name: '平均复杂度'
    },
    series: [
      {
        name: '平均复杂度',
        type: 'line',
        data: [5.2, 6.1, 7.3, 6.8, 5.9],
        itemStyle: { color: '#722ed1' },
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }
    ]
  };

  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Requirement) => (
        <div>
          <div>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.id}
          </Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {getTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '复杂度',
      dataIndex: 'complexity',
      key: 'complexity',
      render: (complexity: number) => (
        <div>
          <Progress
            percent={(complexity / 10) * 100}
            size="small"
            strokeColor={getComplexityColor(complexity)}
            showInfo={false}
          />
          <Text style={{ color: getComplexityColor(complexity), fontSize: 12 }}>
            {complexity}/10
          </Text>
        </div>
      ),
    },
    {
      title: '预估工期',
      dataIndex: 'estimatedDays',
      key: 'estimatedDays',
      render: (days: number) => `${days}天`,
    },
    {
      title: '实际工期',
      dataIndex: 'actualDays',
      key: 'actualDays',
      render: (days: number | undefined) => days ? `${days}天` : '-',
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Requirement) => (
        <Space>
          <Button
            type="link"
            icon={<CalculatorOutlined />}
            onClick={() => setSelectedRequirement(record.id)}
          >
            分析
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateRequirement = () => {
    setIsModalVisible(true);
  };

  // 统计数据
  const stats = {
    totalRequirements: requirements.length,
    avgComplexity: Math.round(requirements.reduce((sum, r) => sum + r.complexity, 0) / requirements.length * 10) / 10,
    highComplexity: requirements.filter(r => r.complexity > 7).length,
    estimationAccuracy: Math.round(
      requirements.filter(r => r.actualDays).reduce((sum, r) => {
        const accuracy = 1 - Math.abs(r.estimatedDays - (r.actualDays || 0)) / r.estimatedDays;
        return sum + Math.max(0, accuracy);
      }, 0) / requirements.filter(r => r.actualDays).length * 100
    ),
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <FunctionOutlined style={{ marginRight: '8px' }} />
          需求复杂度分析
        </Title>
        <Text type="secondary">
          分析需求复杂度，优化开发周期评估和资源分配
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="需求管理" key="requirements">
          {/* 统计概览 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="总需求数"
                  value={stats.totalRequirements}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="平均复杂度"
                  value={stats.avgComplexity}
                  precision={1}
                  prefix={<FunctionOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="高复杂需求"
                  value={stats.highComplexity}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="估算准确率"
                  value={stats.estimationAccuracy}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title="需求列表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequirement}>
                添加需求
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={requirements}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="复杂度分析" key="analysis">
          {selectedRequirement ? (
            <Card title={`复杂度分析 - ${requirements.find(r => r.id === selectedRequirement)?.title}`}>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <div>
                    <Title level={4}>复杂度因子评分</Title>
                    {complexityFactors.map((factor, index) => {
                      const requirement = requirements.find(r => r.id === selectedRequirement);
                      const factorKey = factor.name === '技术复杂度' ? 'technical' :
                                       factor.name === '业务复杂度' ? 'business' :
                                       factor.name === '集成复杂度' ? 'integration' :
                                       factor.name === '测试复杂度' ? 'testing' : 'risk';
                      const score = requirement?.factors[factorKey as keyof typeof requirement.factors] || 0;
                      
                      return (
                        <div key={index} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <Text strong>{factor.name}</Text>
                            <Text>权重: {(factor.weight * 100).toFixed(0)}%</Text>
                          </div>
                          <Progress
                            percent={(score / 10) * 100}
                            strokeColor={getComplexityColor(score)}
                            format={() => `${score}/10`}
                          />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {factor.description}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div>
                    <Title level={4}>评估建议</Title>
                    <Alert
                      message="复杂度评估建议"
                      description={
                        <div>
                          <p>• 当前需求复杂度较高，建议细化任务分解</p>
                          <p>• 技术实现存在挑战，建议提前进行技术预研</p>
                          <p>• 建议增加测试时间，确保质量</p>
                          <p>• 考虑分阶段实施，降低风险</p>
                        </div>
                      }
                      type="warning"
                      showIcon
                    />
                    
                    <Divider />
                    
                    <Title level={5}>工期建议</Title>
                    <Timeline>
                      <Timeline.Item color="blue">
                        <Text strong>需求分析: 2-3天</Text>
                        <br />
                        <Text type="secondary">详细分析需求，确定技术方案</Text>
                      </Timeline.Item>
                      <Timeline.Item color="green">
                        <Text strong>开发实施: 10-12天</Text>
                        <br />
                        <Text type="secondary">按模块分阶段开发</Text>
                      </Timeline.Item>
                      <Timeline.Item color="orange">
                        <Text strong>测试验证: 3-4天</Text>
                        <br />
                        <Text type="secondary">全面测试，包含集成测试</Text>
                      </Timeline.Item>
                    </Timeline>
                  </div>
                </Col>
              </Row>
            </Card>
          ) : (
            <Alert
              message="请选择一个需求进行复杂度分析"
              type="info"
              showIcon
            />
          )}
        </TabPane>

        <TabPane tab="统计报表" key="statistics">
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={8}>
              <Card title="复杂度分布" style={{ height: '400px' }}>
                <ReactECharts option={complexityDistributionOption} style={{ height: '320px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card title="工期估算准确性" style={{ height: '400px' }}>
                <ReactECharts option={estimationAccuracyOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="复杂度趋势" style={{ height: '400px' }}>
                <ReactECharts option={complexityTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="评估工具" key="tool">
          <Card title="复杂度评估工具">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Title level={4}>快速评估</Title>
                <Form layout="vertical">
                  {complexityFactors.map((factor, index) => (
                    <Form.Item key={index} label={factor.name}>
                      <div>
                        <Slider
                          min={1}
                          max={10}
                          defaultValue={5}
                          marks={{ 1: '1', 5: '5', 10: '10' }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          权重: {(factor.weight * 100).toFixed(0)}% - {factor.description}
                        </Text>
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="primary" icon={<CalculatorOutlined />}>
                      计算复杂度
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} lg={12}>
                <Title level={4}>评估结果</Title>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Progress
                    type="circle"
                    percent={70}
                    format={() => '7.0'}
                    strokeColor="#faad14"
                    width={120}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>复杂度评分: 7.0</Text>
                  </div>
                </div>
                
                <Alert
                  message="评估结果"
                  description={
                    <div>
                      <p><strong>复杂度等级:</strong> 复杂</p>
                      <p><strong>建议工期:</strong> 12-15天</p>
                      <p><strong>风险等级:</strong> 中等</p>
                      <p><strong>建议团队:</strong> 2-3人</p>
                    </div>
                  }
                  type="warning"
                  showIcon
                />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加需求模态框 */}
      <Modal
        title="添加需求"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="需求标题"
                rules={[{ required: true, message: '请输入需求标题' }]}
              >
                <Input placeholder="输入需求标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="需求类型"
                rules={[{ required: true, message: '请选择需求类型' }]}
              >
                <Select placeholder="选择类型">
                  <Select.Option value="feature">新功能</Select.Option>
                  <Select.Option value="bug">Bug修复</Select.Option>
                  <Select.Option value="optimization">优化</Select.Option>
                  <Select.Option value="research">调研</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Radio.Group>
                  <Radio value="low">低</Radio>
                  <Radio value="medium">中</Radio>
                  <Radio value="high">高</Radio>
                  <Radio value="critical">紧急</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select placeholder="选择负责人">
                  <Select.Option value="张三">张三</Select.Option>
                  <Select.Option value="李四">李四</Select.Option>
                  <Select.Option value="王五">王五</Select.Option>
                  <Select.Option value="赵六">赵六</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="需求描述"
            rules={[{ required: true, message: '请填写需求描述' }]}
          >
            <TextArea rows={4} placeholder="详细描述需求内容和验收标准" />
          </Form.Item>

          <Divider>复杂度评估</Divider>
          
          {complexityFactors.map((factor, index) => (
            <Form.Item key={index} label={factor.name}>
              <Row gutter={16} align="middle">
                <Col span={16}>
                  <Slider
                    min={1}
                    max={10}
                    defaultValue={5}
                    marks={{ 1: '简单', 5: '中等', 10: '复杂' }}
                  />
                </Col>
                <Col span={8}>
                  <Tooltip title={factor.examples.join(', ')}>
                    <Text type="secondary">权重: {(factor.weight * 100).toFixed(0)}%</Text>
                  </Tooltip>
                </Col>
              </Row>
            </Form.Item>
          ))}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存需求
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComplexityAnalysis;