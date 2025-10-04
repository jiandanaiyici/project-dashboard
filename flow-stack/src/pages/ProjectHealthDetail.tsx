import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Tabs,
  Statistic,
  Progress,
  Badge,
  Table,
  Tag,
  Select,
  Button,
  Typography,
  Spin,
  List,
  Space,
  Divider,
  Alert,
} from 'antd';
import {
  LineChartOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  SolutionOutlined,
  DownloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/plots';
import {
  healthDimensions,
  riskIssueCorrelation,
  healthTrendData,
  issuesData,
  recommendations,
} from '@/mock';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

/**
 * 项目健康详情组件
 * @param projectId 项目ID
 */
const ProjectHealthDetail = ({ projectId }: { projectId: string }) => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [healthScore, setHealthScore] = useState(76); // 总体健康分数

  // 健康状态分类
  const healthStatus: Record<
    'excellent' | 'good' | 'average' | 'poor',
    { color: string; text: string; range: number[] }
  > = {
    excellent: { color: '#52C41A', text: '优秀', range: [90, 100] },
    good: { color: '#165DFF', text: '良好', range: [80, 89] },
    average: { color: '#FAAD14', text: '一般', range: [60, 79] },
    poor: { color: '#F5222D', text: '较差', range: [0, 59] },
  };

  // 确定当前健康状态
  const getCurrentHealthStatus = () => {
    for (const key in healthStatus) {
      const { range } = healthStatus[key as keyof typeof healthStatus];
      if (healthScore >= range[0] && healthScore <= range[1]) {
        return healthStatus[key as keyof typeof healthStatus];
      }
    }
    return healthStatus.average;
  };

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [projectId, timeRange]);

  // 健康趋势图配置
  const healthTrendConfig = {
    data: healthTrendData,
    xField: 'date',
    yField: [
      'overall',
      'schedule',
      'quality',
      'resources',
      'risks',
      'requirements',
    ],
    point: {
      size: 5,
      shape: 'diamond',
    },
    legend: {
      position: 'top',
      items: [
        { name: '总体健康度', value: 'overall' },
        { name: '进度健康度', value: 'schedule' },
        { name: '质量健康度', value: 'quality' },
        { name: '资源健康度', value: 'resources' },
        { name: '风险健康度', value: 'risks' },
        { name: '需求稳定性', value: 'requirements' },
      ],
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: '健康分数',
      },
    },
  };

  // 健康维度权重图配置
  const healthWeightConfig = {
    data: healthDimensions,
    angleField: 'weight',
    colorField: 'name',
    radius: 0.7,
    label: {
      type: 'spider',
      labelHeight: 28,
    },
    interactions: [{ type: 'element-active' }],
  };

  // 风险与问题关联图配置
  const riskCorrelationConfig = {
    data: riskIssueCorrelation,
    xField: 'risk',
    yField: 'issues',
    meta: {
      issues: {
        alias: '关联问题数量',
      },
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
  };

  // 渲染健康状态标签
  const renderHealthStatusTag = (score: number) => {
    let status = 'average';
    if (score >= 90) status = 'excellent';
    else if (score >= 80) status = 'good';
    else if (score >= 60) status = 'average';
    else status = 'poor';

    return (
      <Tag color={healthStatus[status as keyof typeof healthStatus].color}>
        {healthStatus[status as keyof typeof healthStatus].text} ({score})
      </Tag>
    );
  };

  // 渲染趋势箭头
  const renderTrendArrow = (trend: number) => {
    if (trend > 0) {
      return <ArrowUpOutlined style={{ color: '#52C41A' }} />;
    } else if (trend < 0) {
      return <ArrowDownOutlined style={{ color: '#F5222D' }} />;
    } else {
      return <div style={{ width: 14 }}></div>;
    }
  };

  // 渲染问题严重程度标签
  const renderSeverityTag = (severity: '高' | '中' | '低') => {
    const severityConfig = {
      高: { color: 'error', text: '高' },
      中: { color: 'warning', text: '中' },
      低: { color: 'info', text: '低' },
    };

    const config =
      severityConfig[severity as keyof typeof severityConfig] ||
      severityConfig['中'];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 渲染建议优先级标签
  const renderPriorityTag = (priority: '高' | '中' | '低') => {
    const priorityConfig = {
      高: { color: 'error', text: '高' },
      中: { color: 'warning', text: '中' },
      低: { color: 'info', text: '低' },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig['中'];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  const currentStatus = getCurrentHealthStatus();

  return (
    <div className="space-y-6">
      {/* 健康评分概览 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card
            className="hover:shadow-md transition-shadow border-l-4"
            style={{ borderLeftColor: currentStatus.color }}
          >
            <div className="flex justify-between items-start">
              <Text type="secondary">项目总体健康评分</Text>
              <LineChartOutlined />
            </div>
            <Statistic
              value={healthScore}
              valueStyle={{ fontSize: '32px', color: currentStatus.color }}
              suffix={renderHealthStatusTag(healthScore)}
            />
            <div className="mt-3 flex items-center">
              <div
                className={`flex items-center mr-4 ${healthScore < 80 ? 'text-warning' : 'text-success'}`}
              >
                {healthScore < 80 ? (
                  <>
                    <WarningOutlined className="mr-1" />
                    <Text>需要关注</Text>
                  </>
                ) : (
                  <>
                    <CheckCircleOutlined className="mr-1" />
                    <Text>状态良好</Text>
                  </>
                )}
              </div>
              <div className="flex items-center text-secondary">
                <ClockCircleOutlined className="mr-1" />
                <Text>上次更新：今天 15:30</Text>
              </div>
            </div>
            <div className="mt-4">
              <Alert
                message="健康评分说明"
                description="健康评分基于进度、质量、资源、风险和需求稳定性五个维度加权计算得出，满分为100分。"
                type="info"
                showIcon
              />
            </div>
          </Card>
        </Col>

        {/* 健康维度卡片 */}
        {healthDimensions.map((dimension, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <Text type="secondary">{dimension.name}</Text>
                <Badge status={dimension.status} />
              </div>
              <Statistic
                value={dimension.score}
                valueStyle={{ fontSize: '24px' }}
              />
              <Progress
                size="small"
                className="mt-2"
                percent={dimension.score}
                // @ts-ignore
                status={dimension.status}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  {renderTrendArrow(dimension.trend)}
                  <Text
                    // @ts-ignore
                    type={dimension.trend >= 0 ? 'success' : 'error'}
                    className="ml-1 text-sm"
                  >
                    {Math.abs(dimension.trend)}分
                  </Text>
                </div>
                <Text type="secondary" className="text-xs">
                  权重 {dimension.weight}%
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 健康趋势分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>健康趋势分析</Title>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                size="small"
                style={{ width: 120 }}
              >
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
                <Option value="quarter">按季度</Option>
              </Select>
            </div>
            <div className="h-80">
              <Line {...healthTrendConfig} />
            </div>
            <div className="mt-4">
              <Alert
                message="趋势分析"
                description="项目总体健康度呈下降趋势，主要受进度延迟和新增高风险影响。质量健康度保持稳定并略有提升。"
                type={healthScore < 80 ? 'warning' : 'info'}
                showIcon
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 健康维度详情和问题清单 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card className="hover:shadow-md transition-shadow">
            <Title level={5} className="mb-4">
              健康维度详情
            </Title>

            <Tabs defaultActiveKey="schedule" className="mb-4">
              {healthDimensions.map((dimension, index) => (
                <TabPane
                  tab={
                    <div className="flex items-center">
                      <Text>{dimension.name}</Text>
                      <Badge
                        count={dimension.score}
                        className="ml-2"
                        style={{
                          backgroundColor:
                            dimension.score >= 80
                              ? '#52C41A'
                              : dimension.score >= 60
                                ? '#FAAD14'
                                : '#F5222D',
                        }}
                      />
                    </div>
                  }
                  key={dimension.name.toLowerCase().replace(/健康度/, '')}
                >
                  <div className="space-y-4">
                    <div>
                      <Text strong>当前评分：{dimension.score}</Text>
                      <div className="ml-2 mt-1">
                        <Progress
                          percent={dimension.score}
                          status={dimension.status}
                        />
                      </div>
                    </div>

                    <div>
                      <Text strong>趋势变化：</Text>
                      <div className="ml-2 mt-1 flex items-center">
                        {renderTrendArrow(dimension.trend)}
                        <Text
                          // @ts-ignore
                          type={dimension.trend >= 0 ? 'success' : 'error'}
                        >
                          较上周期 {dimension.trend >= 0 ? '上升' : '下降'}{' '}
                          {Math.abs(dimension.trend)} 分
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>问题描述：</Text>
                      <p className="ml-2 mt-1 text-gray-600">
                        {dimension.description}
                      </p>
                    </div>

                    <div>
                      <Text strong>相关问题：</Text>
                      <List
                        dataSource={issuesData.filter(
                          (issue) => issue.dimension === dimension.name
                        )}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <Text type="link">
                                  {item.id} {item.title}
                                </Text>
                              }
                              description={
                                <div className="flex items-center">
                                  {renderSeverityTag(item.severity)}
                                  <Text
                                    type="secondary"
                                    className="ml-2 text-sm"
                                  >
                                    {item.status}
                                  </Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                        // @ts-ignore
                        emptyText="暂无相关问题"
                      />
                    </div>

                    <Button
                      type="primary"
                      size="small"
                      icon={<SolutionOutlined />}
                    >
                      查看改进方案
                    </Button>
                  </div>
                </TabPane>
              ))}
            </Tabs>

            <Divider orientation="left">健康维度权重分布</Divider>
            <div className="h-64">
              <Pie {...healthWeightConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>影响健康的问题清单</Title>
              <Button type="primary" size="small" icon={<PlusOutlined />}>
                记录新问题
              </Button>
            </div>

            <Table
              rowKey="id"
              size="small"
              dataSource={issuesData}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'auto' }}
              columns={[
                {
                  title: '问题ID',
                  dataIndex: 'id',
                  key: 'id',
                  width: 100,
                },
                {
                  title: '问题描述',
                  dataIndex: 'title',
                  key: 'title',
                },
                {
                  title: '影响维度',
                  dataIndex: 'dimension',
                  key: 'dimension',
                  width: 120,
                },
                {
                  title: '严重程度',
                  dataIndex: 'severity',
                  key: 'severity',
                  width: 100,
                  render: (text, record) => renderSeverityTag(record.severity),
                },
                {
                  title: '影响描述',
                  dataIndex: 'impact',
                  key: 'impact',
                  width: 180,
                },
                {
                  title: '处理进度',
                  dataIndex: 'progress',
                  key: 'progress',
                  width: 140,
                  render: (text, record) => (
                    <div className="flex items-center">
                      <Progress
                        percent={record.progress}
                        size="small"
                        className="w-24 mr-2"
                      />
                      <span className="text-xs">{record.progress}%</span>
                    </div>
                  ),
                },
                {
                  title: '负责人',
                  dataIndex: 'owner',
                  key: 'owner',
                  width: 100,
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 100,
                  render: (text) => (
                    <Tag
                      color={
                        text === '处理中'
                          ? 'processing'
                          : text === '计划中'
                            ? 'info'
                            : text === '未开始'
                              ? 'default'
                              : 'success'
                      }
                    >
                      {text}
                    </Tag>
                  ),
                },
              ]}
            ></Table>

            <Divider orientation="left" className="mt-4">
              风险与问题关联分析
            </Divider>
            <div className="h-60">
              <Bar {...riskCorrelationConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 改进建议 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>健康改进建议</Title>
              <Button size="small" icon={<DownloadOutlined />}>
                导出改进计划
              </Button>
            </div>

            <Table
              rowKey="id"
              dataSource={recommendations}
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: '建议ID',
                  dataIndex: 'id',
                  width: 100,
                },
                {
                  title: '建议内容',
                  dataIndex: 'title',
                },
                {
                  title: '影响维度',
                  dataIndex: 'dimension',
                },
                {
                  title: '优先级',
                  dataIndex: 'priority',
                  key: 'priority',
                  render: (text, record) => renderPriorityTag(record.priority),
                  width: 100,
                },
                {
                  title: '预期效果',
                  dataIndex: 'expectedImpact',
                  key: 'expectedImpact',
                  width: 180,
                },
                {
                  title: '实施难度',
                  dataIndex: 'implementationEffort',
                  key: 'implementationEffort',
                  width: 120,
                  render: (text) => (
                    <Tag
                      color={
                        text === '高'
                          ? 'error'
                          : text === '中'
                            ? 'warning'
                            : 'success'
                      }
                    >
                      {text}
                    </Tag>
                  ),
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  width: 120,
                  render: (text) => (
                    <Tag
                      color={
                        text === '实施中'
                          ? 'processing'
                          : text === '待审批'
                            ? 'info'
                            : text === '已采纳'
                              ? 'success'
                              : 'default'
                      }
                    >
                      {text}
                    </Tag>
                  ),
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 160,
                  render: () => (
                    <Space size="small">
                      <Button size="small" type="text">
                        查看详情
                      </Button>
                      <Button size="small" type="text" danger>
                        标记完成
                      </Button>
                    </Space>
                  ),
                },
              ]}
            ></Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectHealthDetail;
