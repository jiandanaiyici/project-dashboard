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
  Alert,
  Typography,
  Radio,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SyncOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 应用数据接口
interface ApplicationMetrics {
  appId: string;
  appName: string;
  version: string;
  environment: 'production' | 'staging' | 'development';
  status: 'healthy' | 'warning' | 'error';
  metrics: {
    pv: number;
    uv: number;
    errorRate: number;
    successRate: number;
    avgResponseTime: number;
    whiteScreenTime: number;
    loadTime: number;
    jsErrorCount: number;
    apiErrorCount: number;
    crashRate: number;
    userSatisfaction: number;
    bounceRate: number;
    conversion: number;
    retention: number;
  };
  performance: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  geography: {
    region: string;
    users: number;
    avgTime: number;
  }[];
  trend: {
    date: string;
    pv: number;
    uv: number;
    errorRate: number;
    responseTime: number;
  }[];
}

// 模拟应用数据
const mockApplications: ApplicationMetrics[] = [
  {
    appId: 'app-001',
    appName: '项目管理平台',
    version: '2.1.0',
    environment: 'production',
    status: 'healthy',
    metrics: {
      pv: 125000,
      uv: 15600,
      errorRate: 0.45,
      successRate: 99.55,
      avgResponseTime: 280,
      whiteScreenTime: 450,
      loadTime: 1200,
      jsErrorCount: 56,
      apiErrorCount: 23,
      crashRate: 0.02,
      userSatisfaction: 4.6,
      bounceRate: 25.3,
      conversion: 12.8,
      retention: 78.5,
    },
    performance: {
      fcp: 1100,
      lcp: 1800,
      fid: 45,
      cls: 0.08,
      ttfb: 120,
    },
    geography: [
      { region: '北京', users: 3200, avgTime: 250 },
      { region: '上海', users: 2800, avgTime: 290 },
      { region: '广州', users: 2400, avgTime: 310 },
      { region: '深圳', users: 2100, avgTime: 275 },
      { region: '杭州', users: 1800, avgTime: 260 },
    ],
    trend: Array.from({ length: 7 }, (_, i) => ({
      date: dayjs().subtract(6 - i, 'day').format('MM-DD'),
      pv: 15000 + Math.random() * 5000,
      uv: 1800 + Math.random() * 600,
      errorRate: 0.3 + Math.random() * 0.4,
      responseTime: 250 + Math.random() * 100,
    })),
  },
  {
    appId: 'app-002',
    appName: '用户中心',
    version: '1.8.5',
    environment: 'production',
    status: 'warning',
    metrics: {
      pv: 89000,
      uv: 12300,
      errorRate: 1.2,
      successRate: 98.8,
      avgResponseTime: 420,
      whiteScreenTime: 680,
      loadTime: 1580,
      jsErrorCount: 98,
      apiErrorCount: 45,
      crashRate: 0.08,
      userSatisfaction: 4.2,
      bounceRate: 32.1,
      conversion: 9.5,
      retention: 65.2,
    },
    performance: {
      fcp: 1350,
      lcp: 2200,
      fid: 78,
      cls: 0.15,
      ttfb: 180,
    },
    geography: [
      { region: '北京', users: 2800, avgTime: 380 },
      { region: '上海', users: 2200, avgTime: 450 },
      { region: '广州', users: 1900, avgTime: 420 },
      { region: '深圳', users: 1600, avgTime: 390 },
      { region: '杭州', users: 1400, avgTime: 410 },
    ],
    trend: Array.from({ length: 7 }, (_, i) => ({
      date: dayjs().subtract(6 - i, 'day').format('MM-DD'),
      pv: 11000 + Math.random() * 4000,
      uv: 1400 + Math.random() * 500,
      errorRate: 0.8 + Math.random() * 0.8,
      responseTime: 380 + Math.random() * 120,
    })),
  },
  {
    appId: 'app-003',
    appName: '数据分析平台',
    version: '3.0.2',
    environment: 'production',
    status: 'healthy',
    metrics: {
      pv: 67000,
      uv: 8900,
      errorRate: 0.65,
      successRate: 99.35,
      avgResponseTime: 320,
      whiteScreenTime: 520,
      loadTime: 1350,
      jsErrorCount: 34,
      apiErrorCount: 18,
      crashRate: 0.03,
      userSatisfaction: 4.5,
      bounceRate: 28.7,
      conversion: 15.2,
      retention: 72.3,
    },
    performance: {
      fcp: 1200,
      lcp: 1950,
      fid: 52,
      cls: 0.09,
      ttfb: 140,
    },
    geography: [
      { region: '北京', users: 2100, avgTime: 300 },
      { region: '上海', users: 1800, avgTime: 340 },
      { region: '广州', users: 1500, avgTime: 330 },
      { region: '深圳', users: 1300, avgTime: 310 },
      { region: '杭州', users: 1100, avgTime: 320 },
    ],
    trend: Array.from({ length: 7 }, (_, i) => ({
      date: dayjs().subtract(6 - i, 'day').format('MM-DD'),
      pv: 8500 + Math.random() * 3000,
      uv: 1100 + Math.random() * 400,
      errorRate: 0.4 + Math.random() * 0.5,
      responseTime: 280 + Math.random() * 80,
    })),
  },
];

const ApplicationComparison: React.FC = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>(['app-001', 'app-002']);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'radar'>('line');

  // 获取选中应用的数据
  const getSelectedApplications = useCallback(() => {
    return mockApplications.filter(app => selectedApps.includes(app.appId));
  }, [selectedApps]);

  // 生成性能对比图表配置
  const getPerformanceComparisonOption = () => {
    const apps = getSelectedApplications();
    const xAxisData = apps.map(app => app.appName);
    
    const series = [
      {
        name: 'PV',
        type: chartType === 'radar' ? 'line' : chartType,
        data: apps.map(app => app.metrics.pv),
        yAxisIndex: 0,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: 'UV',
        type: chartType === 'radar' ? 'line' : chartType,
        data: apps.map(app => app.metrics.uv),
        yAxisIndex: 0,
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '错误率 (%)',
        type: chartType === 'radar' ? 'line' : chartType,
        data: apps.map(app => app.metrics.errorRate),
        yAxisIndex: 1,
        itemStyle: { color: '#ff4d4f' },
      },
      {
        name: '响应时间 (ms)',
        type: chartType === 'radar' ? 'line' : chartType,
        data: apps.map(app => app.metrics.avgResponseTime),
        yAxisIndex: 1,
        itemStyle: { color: '#fa8c16' },
      },
    ];

    return {
      title: {
        text: '应用性能指标对比',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['PV', 'UV', '错误率 (%)', '响应时间 (ms)'],
        bottom: 10,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: [
        {
          type: 'value',
          name: '访问量',
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: '错误率/响应时间',
          position: 'right',
          axisLabel: {
            formatter: '{value}',
          },
        },
      ],
      series,
    };
  };

  // 性能对比表格列配置
  const performanceColumns = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      key: 'appName',
      render: (text: string, record: ApplicationMetrics) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color={record.status === 'healthy' ? 'green' : record.status === 'warning' ? 'orange' : 'red'}>
            {record.status === 'healthy' ? '健康' : record.status === 'warning' ? '警告' : '异常'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'PV',
      dataIndex: ['metrics', 'pv'],
      key: 'pv',
      render: (value: number) => value.toLocaleString(),
      sorter: (a: ApplicationMetrics, b: ApplicationMetrics) => a.metrics.pv - b.metrics.pv,
    },
    {
      title: 'UV',
      dataIndex: ['metrics', 'uv'],
      key: 'uv',
      render: (value: number) => value.toLocaleString(),
      sorter: (a: ApplicationMetrics, b: ApplicationMetrics) => a.metrics.uv - b.metrics.uv,
    },
    {
      title: '错误率',
      dataIndex: ['metrics', 'errorRate'],
      key: 'errorRate',
      render: (value: number) => (
        <Text type={value > 1 ? 'danger' : value > 0.5 ? 'warning' : 'success'}>
          {value.toFixed(2)}%
        </Text>
      ),
      sorter: (a: ApplicationMetrics, b: ApplicationMetrics) => a.metrics.errorRate - b.metrics.errorRate,
    },
    {
      title: '响应时间',
      dataIndex: ['metrics', 'avgResponseTime'],
      key: 'avgResponseTime',
      render: (value: number) => (
        <Text type={value > 500 ? 'danger' : value > 300 ? 'warning' : 'success'}>
          {value}ms
        </Text>
      ),
      sorter: (a: ApplicationMetrics, b: ApplicationMetrics) => a.metrics.avgResponseTime - b.metrics.avgResponseTime,
    },
    {
      title: '用户满意度',
      dataIndex: ['metrics', 'userSatisfaction'],
      key: 'userSatisfaction',
      render: (value: number) => (
        <Space>
          <Text>{value.toFixed(1)}</Text>
          <Text type="secondary">/5.0</Text>
        </Space>
      ),
      sorter: (a: ApplicationMetrics, b: ApplicationMetrics) => a.metrics.userSatisfaction - b.metrics.userSatisfaction,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>多应用性能对比分析</Title>
          <Text type="secondary">
            对比分析多个应用的性能指标、用户行为和业务数据，识别性能差异和优化机会
          </Text>
        </div>

        {/* 筛选控制区 */}
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={8}>
              <Text strong>选择应用：</Text>
              <Select
                mode="multiple"
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="选择要对比的应用"
                value={selectedApps}
                onChange={setSelectedApps}
                maxTagCount={3}
              >
                {mockApplications.map(app => (
                  <Select.Option key={app.appId} value={app.appId}>
                    {app.appName}
                  </Select.Option>
                ))}
              </Select>
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
              <Text strong>图表类型：</Text>
              <Radio.Group
                style={{ marginTop: '8px' }}
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <Radio.Button value="line">
                  <LineChartOutlined />
                </Radio.Button>
                <Radio.Button value="bar">
                  <BarChartOutlined />
                </Radio.Button>
                <Radio.Button value="radar">
                  <PieChartOutlined />
                </Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={4}>
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

        <Tabs defaultActiveKey="overview" type="card">
          {/* 对比概览 */}
          <TabPane tab="对比概览" key="overview">
            <Row gutter={[16, 16]}>
              {/* 核心指标对比图表 */}
              <Col span={24}>
                <Card title="核心指标对比">
                  <ReactECharts
                    option={getPerformanceComparisonOption()}
                    style={{ height: '400px' }}
                    notMerge={true}
                  />
                </Card>
              </Col>

              {/* 应用状态概览 */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {getSelectedApplications().map(app => (
                    <Col span={8} key={app.appId}>
                      <Card size="small">
                        <Statistic
                          title={
                            <Space>
                              <Text>{app.appName}</Text>
                              <Tag color={
                                app.status === 'healthy' ? 'green' : 
                                app.status === 'warning' ? 'orange' : 'red'
                              }>
                                {app.status === 'healthy' ? '健康' : 
                                 app.status === 'warning' ? '警告' : '异常'}
                              </Tag>
                            </Space>
                          }
                          value={app.metrics.pv}
                          precision={0}
                          valueStyle={{ color: '#1890ff' }}
                          prefix={<BarChartOutlined />}
                          suffix="PV"
                        />
                        <Row gutter={8} style={{ marginTop: '16px' }}>
                          <Col span={12}>
                            <Statistic
                              title="UV"
                              value={app.metrics.uv}
                              precision={0}
                              valueStyle={{ fontSize: '14px' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic
                              title="错误率"
                              value={app.metrics.errorRate}
                              precision={2}
                              suffix="%"
                              valueStyle={{ 
                                fontSize: '14px',
                                color: app.metrics.errorRate > 1 ? '#ff4d4f' : '#52c41a'
                              }}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </TabPane>

          {/* 性能对比 */}
          <TabPane tab="性能对比" key="performance">
            <Card title="性能指标详细对比">
              <Table
                dataSource={getSelectedApplications()}
                columns={performanceColumns}
                rowKey="appId"
                pagination={false}
              />
            </Card>
          </TabPane>

          {/* 用户分析 */}
          <TabPane tab="用户分析" key="users">
            <Alert
              message="用户行为对比分析"
              description="通过对比不同应用的用户访问模式、地理分布和行为特征，识别用户偏好和使用习惯的差异"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              {getSelectedApplications().map(app => (
                <Col span={12} key={app.appId}>
                  <Card size="small" title={`${app.appName} - 用户分布`}>
                    <Table
                      size="small"
                      dataSource={app.geography}
                      pagination={false}
                      columns={[
                        {
                          title: '地区',
                          dataIndex: 'region',
                          key: 'region',
                        },
                        {
                          title: '用户数',
                          dataIndex: 'users',
                          key: 'users',
                          render: (value: number) => value.toLocaleString(),
                        },
                        {
                          title: '响应时间',
                          dataIndex: 'avgTime',
                          key: 'avgTime',
                          render: (value: number) => `${value}ms`,
                        },
                      ]}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* 错误分析 */}
          <TabPane tab="错误分析" key="errors">
            <Alert
              message="错误率对比分析"
              description="对比不同应用的错误类型、发生频率和影响范围，帮助识别系统稳定性问题"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Row gutter={[16, 16]}>
              {getSelectedApplications().map(app => (
                <Col span={8} key={app.appId}>
                  <Card size="small" title={app.appName}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Statistic
                        title="JS 错误数"
                        value={app.metrics.jsErrorCount}
                        valueStyle={{ color: '#ff4d4f' }}
                      />
                      <Statistic
                        title="API 错误数"
                        value={app.metrics.apiErrorCount}
                        valueStyle={{ color: '#fa8c16' }}
                      />
                      <Statistic
                        title="崩溃率"
                        value={app.metrics.crashRate}
                        precision={3}
                        suffix="%"
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ApplicationComparison;