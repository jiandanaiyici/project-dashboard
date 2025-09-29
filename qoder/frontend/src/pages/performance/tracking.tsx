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
  Switch,
  Space,
  Typography,
  Tabs,
  Statistic,
  List,
  Avatar,
  Progress,
  Alert,
  Tooltip,
  Badge,
  message,
} from 'antd';
import {
  DatabaseOutlined,
  LineChartOutlined,
  SettingOutlined,
  EyeOutlined,
  PlusOutlined,
  BugOutlined,
  ThunderboltOutlined,
  UserOutlined,
  GlobalOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface TrackingEvent {
  id: string;
  name: string;
  eventKey: string;
  type: 'click' | 'view' | 'custom' | 'error' | 'performance';
  status: 'active' | 'inactive' | 'testing';
  appName: string;
  description: string;
  triggerCount: number;
  lastTriggered: string;
  creator: string;
  createTime: string;
}

interface MetricData {
  date: string;
  pv: number;
  uv: number;
  clickRate: number;
  errorCount: number;
  avgLoadTime: number;
}

const DataTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [form] = Form.useForm();

  // 模拟埋点事件数据
  const trackingEvents: TrackingEvent[] = [
    {
      id: '1',
      name: '用户登录',
      eventKey: 'user_login',
      type: 'click',
      status: 'active',
      appName: '项目管理平台',
      description: '用户点击登录按钮',
      triggerCount: 15234,
      lastTriggered: '2024-01-15 14:30:25',
      creator: '张三',
      createTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '页面访问',
      eventKey: 'page_view',
      type: 'view',
      status: 'active',
      appName: '项目管理平台',
      description: '用户访问仪表盘页面',
      triggerCount: 89567,
      lastTriggered: '2024-01-15 14:35:12',
      creator: '李四',
      createTime: '2023-12-01 10:00:00',
    },
    {
      id: '3',
      name: 'API错误',
      eventKey: 'api_error',
      type: 'error',
      status: 'active',
      appName: '用户管理系统',
      description: 'API请求失败错误',
      triggerCount: 89,
      lastTriggered: '2024-01-15 14:20:15',
      creator: '王五',
      createTime: '2023-12-05 15:30:00',
    },
    {
      id: '4',
      name: '页面加载时间',
      eventKey: 'page_load_time',
      type: 'performance',
      status: 'testing',
      appName: '数据分析平台',
      description: '监控页面加载性能',
      triggerCount: 0,
      lastTriggered: '',
      creator: '赵六',
      createTime: '2024-01-10 09:15:00',
    },
  ];

  // 模拟指标数据
  const metricData: MetricData[] = [
    { date: '01-09', pv: 12800, uv: 3200, clickRate: 3.2, errorCount: 15, avgLoadTime: 1200 },
    { date: '01-10', pv: 13200, uv: 3400, clickRate: 3.5, errorCount: 12, avgLoadTime: 1180 },
    { date: '01-11', pv: 14100, uv: 3600, clickRate: 3.8, errorCount: 8, avgLoadTime: 1150 },
    { date: '01-12', pv: 13800, uv: 3500, clickRate: 3.6, errorCount: 10, avgLoadTime: 1190 },
    { date: '01-13', pv: 15200, uv: 3800, clickRate: 4.1, errorCount: 6, avgLoadTime: 1120 },
    { date: '01-14', pv: 14800, uv: 3700, clickRate: 3.9, errorCount: 9, avgLoadTime: 1160 },
    { date: '01-15', pv: 16500, uv: 4100, clickRate: 4.3, errorCount: 4, avgLoadTime: 1100 },
  ];

  const getEventTypeIcon = (type: string) => {
    const iconMap = {
      click: <ThunderboltOutlined />,
      view: <EyeOutlined />,
      custom: <CodeOutlined />,
      error: <BugOutlined />,
      performance: <LineChartOutlined />,
    };
    return iconMap[type as keyof typeof iconMap] || <SettingOutlined />;
  };

  const getEventTypeColor = (type: string) => {
    const colorMap = {
      click: 'blue',
      view: 'green',
      custom: 'purple',
      error: 'red',
      performance: 'orange',
    };
    return colorMap[type as keyof typeof colorMap] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      active: 'success',
      inactive: 'default',
      testing: 'processing',
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap = {
      active: '运行中',
      inactive: '已停用',
      testing: '测试中',
    };
    return textMap[status as keyof typeof textMap] || '未知';
  };

  // 数据趋势图表
  const dataTrendOption = {
    title: {
      text: '埋点数据趋势',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['PV', 'UV', '点击率'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: metricData.map(item => item.date)
    },
    yAxis: [
      {
        type: 'value',
        name: 'PV/UV',
        position: 'left'
      },
      {
        type: 'value',
        name: '点击率(%)',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'PV',
        type: 'line',
        yAxisIndex: 0,
        data: metricData.map(item => item.pv),
        itemStyle: { color: '#1890ff' },
        smooth: true
      },
      {
        name: 'UV',
        type: 'line',
        yAxisIndex: 0,
        data: metricData.map(item => item.uv),
        itemStyle: { color: '#52c41a' },
        smooth: true
      },
      {
        name: '点击率',
        type: 'bar',
        yAxisIndex: 1,
        data: metricData.map(item => item.clickRate),
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  // 错误趋势图表
  const errorTrendOption = {
    title: {
      text: '错误统计趋势',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: metricData.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      name: '错误数量'
    },
    series: [
      {
        name: '错误数量',
        type: 'bar',
        data: metricData.map(item => item.errorCount),
        itemStyle: {
          color: (params: any) => {
            return params.value > 10 ? '#ff4d4f' : '#52c41a';
          }
        }
      }
    ]
  };

  // 性能趋势图表
  const performanceTrendOption = {
    title: {
      text: '页面加载性能',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: metricData.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      name: '加载时间(ms)'
    },
    series: [
      {
        name: '平均加载时间',
        type: 'line',
        data: metricData.map(item => item.avgLoadTime),
        itemStyle: { color: '#722ed1' },
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }
    ]
  };

  const eventColumns = [
    {
      title: '事件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TrackingEvent) => (
        <Space>
          <Avatar icon={getEventTypeIcon(record.type)} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.eventKey}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getEventTypeColor(type)}>
          {type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'processing' : status === 'testing' ? 'warning' : 'default'}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: '应用',
      dataIndex: 'appName',
      key: 'appName',
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (time: string) => time || '-',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TrackingEvent) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedEvent(record.id)}
          >
            详情
          </Button>
          {record.status === 'active' && (
            <Button type="link" icon={<PauseCircleOutlined />}>
              停用
            </Button>
          )}
          {record.status === 'inactive' && (
            <Button type="link" icon={<PlayCircleOutlined />}>
              启用
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateEvent = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(() => {
      message.success('埋点事件创建成功');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // 汇总统计
  const totalStats = {
    totalEvents: trackingEvents.length,
    activeEvents: trackingEvents.filter(e => e.status === 'active').length,
    totalTriggers: trackingEvents.reduce((sum, e) => sum + e.triggerCount, 0),
    errorEvents: trackingEvents.filter(e => e.type === 'error').length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <DatabaseOutlined style={{ marginRight: '8px' }} />
          数据埋点与指标收集
        </Title>
        <Text type="secondary">
          管理应用埋点事件，收集用户行为和性能数据
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="埋点事件" key="events">
          {/* 统计概览 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="总事件数"
                  value={totalStats.totalEvents}
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="运行中"
                  value={totalStats.activeEvents}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="总触发次数"
                  value={totalStats.totalTriggers}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="错误事件"
                  value={totalStats.errorEvents}
                  prefix={<BugOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title="埋点事件管理"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateEvent}>
                创建事件
              </Button>
            }
          >
            <Table
              columns={eventColumns}
              dataSource={trackingEvents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="数据统计" key="statistics">
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="数据趋势分析" style={{ height: '400px' }}>
                <ReactECharts option={dataTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="错误统计" style={{ height: '400px' }}>
                <ReactECharts option={errorTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="性能监控" style={{ height: '400px' }}>
                <ReactECharts option={performanceTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="实时监控" key="realtime">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="实时事件流" bodyStyle={{ height: '400px', overflow: 'auto' }}>
                <List
                  dataSource={[
                    { id: '1', event: 'user_login', user: 'user_123', time: '14:35:12', app: '项目管理平台' },
                    { id: '2', event: 'page_view', user: 'user_456', time: '14:35:08', app: '项目管理平台' },
                    { id: '3', event: 'api_error', user: 'user_789', time: '14:34:55', app: '用户管理系统' },
                    { id: '4', event: 'user_logout', user: 'user_321', time: '14:34:42', app: '项目管理平台' },
                    { id: '5', event: 'button_click', user: 'user_654', time: '14:34:30', app: '数据分析平台' },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<ThunderboltOutlined />} />}
                        title={
                          <Space>
                            <Text code>{item.event}</Text>
                            <Tag>{item.app}</Tag>
                          </Space>
                        }
                        description={
                          <div>
                            <Text type="secondary">用户: {item.user}</Text>
                            <Text type="secondary" style={{ marginLeft: 16 }}>
                              时间: {item.time}
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="实时指标">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Statistic
                    title="当前在线用户"
                    value={1234}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Statistic
                    title="今日PV"
                    value={16500}
                    prefix={<GlobalOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>系统状态</Text>
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      type="circle"
                      percent={95}
                      strokeColor="#52c41a"
                      format={() => '正常'}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="配置管理" key="config">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="全局配置">
                <Form layout="vertical">
                  <Form.Item label="数据采样率">
                    <Input defaultValue="100%" addonAfter="%" />
                  </Form.Item>
                  <Form.Item label="数据保留期">
                    <Select defaultValue="90">
                      <Select.Option value="30">30天</Select.Option>
                      <Select.Option value="90">90天</Select.Option>
                      <Select.Option value="180">180天</Select.Option>
                      <Select.Option value="365">1年</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="自动上报">
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item label="错误自动收集">
                    <Switch defaultChecked />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary">保存配置</Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="数据源配置">
                <Alert
                  message="SDK集成指南"
                  description={
                    <div>
                      <p>1. 安装埋点SDK: npm install @tracking/sdk</p>
                      <p>2. 初始化配置: tracker.init(config)</p>
                      <p>3. 添加埋点: tracker.track(eventName, data)</p>
                    </div>
                  }
                  type="info"
                  showIcon
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 创建事件模态框 */}
      <Modal
        title="创建埋点事件"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="事件名称"
            rules={[{ required: true, message: '请输入事件名称' }]}
          >
            <Input placeholder="如: 用户登录" />
          </Form.Item>
          <Form.Item
            name="eventKey"
            label="事件标识"
            rules={[{ required: true, message: '请输入事件标识' }]}
          >
            <Input placeholder="如: user_login" />
          </Form.Item>
          <Form.Item
            name="type"
            label="事件类型"
            rules={[{ required: true, message: '请选择事件类型' }]}
          >
            <Select placeholder="选择类型">
              <Select.Option value="click">点击事件</Select.Option>
              <Select.Option value="view">页面访问</Select.Option>
              <Select.Option value="custom">自定义事件</Select.Option>
              <Select.Option value="error">错误事件</Select.Option>
              <Select.Option value="performance">性能事件</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="appName"
            label="所属应用"
            rules={[{ required: true, message: '请选择应用' }]}
          >
            <Select placeholder="选择应用">
              <Select.Option value="项目管理平台">项目管理平台</Select.Option>
              <Select.Option value="用户管理系统">用户管理系统</Select.Option>
              <Select.Option value="数据分析平台">数据分析平台</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请填写描述' }]}
          >
            <TextArea rows={3} placeholder="描述事件的触发条件和用途" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTracking;