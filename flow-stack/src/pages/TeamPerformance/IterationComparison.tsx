import React, { useState } from 'react';
import {
  LineChartOutlined,
  DownloadOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  TagsOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { Line, Bar, Radar } from '@ant-design/plots';
import {
  Card,
  Button,
  Select,
  Row,
  Col,
  Typography,
  Flex,
  Segmented,
} from 'antd';
import {
  bugRateData,
  efficiencyScoreData,
  iterationBasicData,
  iterationCycleData,
  iterationPlanData,
  reworkRateData,
  storyPointSpeedData,
} from '@/mock';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

/**
 * 迭代对比分析组件
 */
const IterationComparison: React.FC = () => {
  const [activeIteration, setActiveIteration] = useState('iteration8');
  const [metricType, setMetricType] = useState('all');
  const [contentViewType, setContentViewType] = useState('points');

  // 团队活动指标数据
  const teamActivityData = {
    codeReview: [88, 90, 92, 94, 96],
    dailyMeeting: [85, 82, 90, 92, 94],
    documentation: [75, 72, 80, 82, 78],
  };

  // 迭代内容分布数据
  const iterationContentData = {
    labels: ['迭代8', '迭代9', '迭代10', '迭代11', '迭代12'],
    datasets: [
      {
        name: '新功能开发',
        data: [45, 40, 50, 48, 42],
        color: '#165DFF',
      },
      {
        name: '技术优化',
        data: [20, 15, 18, 22, 20],
        color: '#0FC6C2',
      },
      {
        name: '缺陷修复',
        data: [30, 35, 25, 22, 35],
        color: '#F5222D',
      },
      {
        name: '文档完善',
        data: [5, 10, 7, 8, 3],
        color: '#FAAD14',
      },
    ],
  };

  // 改进机会数据
  const improvementOpportunities = [
    {
      id: 1,
      title: '降低生产环境缺陷率',
      description:
        '最近2个迭代缺陷率呈上升趋势，建议增加自动化测试覆盖率，特别是核心支付流程',
      priority: 'high',
    },
    {
      id: 2,
      title: '稳定迭代交付速度',
      description: '迭代速度波动较大，建议优化故事点估算方法，提高计划准确性',
      priority: 'medium',
    },
    {
      id: 3,
      title: '保持高质量的代码审查',
      description: '代码审查覆盖率持续提升，建议将此实践标准化并推广到其他团队',
      priority: 'success',
    },
    {
      id: 4,
      title: '平衡任务类型分布',
      description:
        '缺陷修复占比偏高(35%)，建议增加技术优化投入，减少未来的维护成本',
      priority: 'high',
    },
  ];

  // 图表配置
  const scoreChartConfig = {
    data: efficiencyScoreData,
    xField: 'iteration',
    yField: 'score',
    seriesField: 'iteration',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      min: 60,
      max: 100,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    xAxis: {
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    point: {
      size: 4,
      shape: 'circle',
    },
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 1:#0FC6C20A',
      },
    },
    line: {
      color: '#0FC6C2',
      width: 2,
    },
  };

  const cycleChartConfig = {
    data: iterationCycleData,
    xField: 'iteration',
    yField: 'cycle',
    seriesField: 'iteration',
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    barStyle: {
      fill: '#165DFF',
      radius: [4, 4, 0, 0],
    },
    yAxis: {
      title: {
        text: '天数',
      },
      min: 0,
    },
  };

  const speedChartConfig = {
    data: storyPointSpeedData,
    xField: 'iteration',
    yField: 'speed',
    seriesField: 'iteration',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      title: {
        text: '点/天',
      },
      min: 0,
    },
    line: {
      color: '#FF7D00',
      width: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#FF7D00',
      },
    },
  };

  const bugRateChartConfig = {
    data: bugRateData,
    xField: 'iteration',
    yField: 'rate',
    seriesField: 'iteration',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      title: {
        text: '缺陷率 (%)',
      },
      min: 0,
    },
    line: {
      color: '#F5222D',
      width: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#F5222D',
      },
    },
  };

  const reworkRateChartConfig = {
    data: reworkRateData,
    xField: 'iteration',
    yField: 'rate',
    seriesField: 'iteration',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      title: {
        text: '返工率 (%)',
      },
      min: 0,
    },
    line: {
      color: '#FAAD14',
      width: 2,
    },
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#FAAD14',
      },
    },
  };

  const contentRadarChartConfig = {
    data: iterationContentData.labels.map((label, index) => {
      const item: any = { iteration: label };
      iterationContentData.datasets.forEach((dataset) => {
        item[dataset.name] = dataset.data[index];
      });
      return item;
    }),
    xField: 'iteration',
    yField: iterationContentData.datasets[0].name,
    seriesField: 'iteration',
    meta: {
      新功能开发: {
        min: 0,
        max: 60,
      },
      技术优化: {
        min: 0,
        max: 60,
      },
      缺陷修复: {
        min: 0,
        max: 60,
      },
      文档完善: {
        min: 0,
        max: 60,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      line: null,
      tickLine: null,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
      shape: 'circle',
    },
    area: {},
  };

  return (
    <Flex vertical gap={12}>
      <Flex align="center" justify="space-between" wrap>
        <div>
          <Title
            level={1}
            className="text-[clamp(1.5rem,3vw,2rem)] font-bold m-0"
          >
            迭代对比分析
          </Title>
          <Text type="secondary">
            多维度对比迭代效能 · 识别趋势变化 · 发现改进机会
          </Text>
        </div>

        <Flex gap={4} className="mt-4 md:mt-0" wrap>
          {/* 迭代选择器 */}
          <Segmented
            defaultValue={iterationBasicData[0].id}
            style={{ width: 200 }}
            options={iterationBasicData.map((iteration) => ({
              value: iteration.id,
              label: iteration.name,
            }))}
          />
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={setMetricType}
            className="bg-white border border-gray-300 rounded-lg"
            options={[
              { value: 'all', label: '所有指标' },
              { value: 'speed', label: '交付速度指标' },
              { value: 'quality', label: '交付质量指标' },
              { value: 'collaboration', label: '团队协作指标' },
            ]}
          />
          <Button icon={<DownloadOutlined />}>导出报告</Button>

          <Button type="primary" icon={<BulbOutlined />}>
            查看改进建议
          </Button>
        </Flex>
      </Flex>
      {/* 迭代概览对比 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            size="small"
            title={<Text type="secondary">迭代基本信息</Text>}
            extra={<InfoCircleOutlined style={{ color: '#8c8c8c' }} />}
            className="card-shadow hover:shadow-lg transition-shadow rounded-xl"
          >
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div className="text-center text-gray-500 font-medium">
                  迭代
                </div>
                <div className="text-center text-gray-500 font-medium">
                  时间范围
                </div>
                <div className="text-center text-gray-500 font-medium">
                  团队规模
                </div>
              </div>

              {iterationBasicData.map((iteration, index) => (
                <div
                  key={iteration.id}
                  className={`grid grid-cols-3 gap-2 text-xs py-2 ${index < iterationBasicData.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div className="text-center font-medium">
                    {iteration.name}
                  </div>
                  <div className="text-center">{iteration.timeRange}</div>
                  <div className="text-center">{iteration.teamSize}人</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="card-shadow hover:shadow-lg transition-shadow rounded-xl">
            <div className="flex items-center justify-between">
              <Text type="secondary">迭代计划与完成</Text>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <TagsOutlined style={{ color: '#8c8c8c' }} />
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2 text-xs mb-3">
                <div className="text-center text-gray-500 font-medium">
                  迭代
                </div>
                <div className="text-center text-gray-500 font-medium">
                  计划点
                </div>
                <div className="text-center text-gray-500 font-medium">
                  实际点
                </div>
                <div className="text-center text-gray-500 font-medium">
                  完成率
                </div>
              </div>

              {iterationPlanData.map((iteration, index) => (
                <div
                  key={iteration.id}
                  className={`grid grid-cols-4 gap-2 text-xs py-2 ${index < iterationPlanData.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div className="text-center font-medium">
                    {iteration.name}
                  </div>
                  <div className="text-center">{iteration.plannedPoints}</div>
                  <div className="text-center">{iteration.actualPoints}</div>
                  <div
                    className="text-center"
                    style={{ color: iteration.rateColor }}
                  >
                    {iteration.completionRate}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="card-shadow hover:shadow-lg transition-shadow rounded-xl">
            <div className="flex items-center justify-between">
              <Text type="secondary">效能评分趋势</Text>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <LineChartOutlined style={{ color: '#8c8c8c' }} />
              </div>
            </div>

            <div className="mt-4 h-56">
              <Line {...scoreChartConfig} />
            </div>

            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <Paragraph className="m-0">
                <InfoCircleOutlined
                  style={{ color: '#1890ff', marginRight: 4 }}
                />
                效能评分基于交付速度、质量、协作等多维度计算
              </Paragraph>
              <Paragraph className="m-0">
                <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                近5个迭代平均提升 3.2 分/迭代
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
      {/* 详细指标对比 */}
      <Row gutter={[16, 16]}>
        {/* 交付速度指标 */}
        <Col xs={24} lg={12}>
          <Card className="card-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title level={4} className="font-semibold m-0">
                  交付速度指标对比
                </Title>
                <Text type="secondary">迭代周期、完成速度等关键指标趋势</Text>
              </div>
              <Button type="link" className="text-效能">
                查看详情
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Text className="font-medium">迭代周期 (天)</Text>
                  <Text type="secondary" className="text-xs">
                    周期越短越好
                  </Text>
                </div>
                <div className="h-48">
                  <Bar {...cycleChartConfig} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Text className="font-medium">
                    平均故事点完成速度 (点/天)
                  </Text>
                  <Text type="secondary" className="text-xs">
                    速度越快越好
                  </Text>
                </div>
                <div className="h-48">
                  <Line {...speedChartConfig} />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 交付质量指标 */}
        <Col xs={24} lg={12}>
          <Card className="card-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title level={4} className="font-semibold m-0">
                  交付质量指标对比
                </Title>
                <Text type="secondary">缺陷率、返工率等质量相关指标</Text>
              </div>
              <Button type="link" className="text-效能">
                查看详情
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Text className="font-medium">生产环境缺陷率 (%)</Text>
                  <Text type="secondary" className="text-xs">
                    比例越低越好
                  </Text>
                </div>
                <div className="h-48">
                  <Line {...bugRateChartConfig} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Text className="font-medium">代码返工率 (%)</Text>
                  <Text type="secondary" className="text-xs">
                    比例越低越好
                  </Text>
                </div>
                <div className="h-48">
                  <Line {...reworkRateChartConfig} />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {/* 团队活动和改进机会 */}
      <Row gutter={[16, 16]}>
        {/* 团队活动指标 */}
        <Col xs={24} lg={8}>
          <Card className="card-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title level={4} className="font-semibold m-0">
                  团队活动指标
                </Title>
                <Text type="secondary">团队协作与活动情况</Text>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Text className="text-sm mb-2 block">代码审查覆盖率</Text>
                <div className="grid grid-cols-5 gap-2 text-xs mb-1">
                  {iterationBasicData.map((iteration) => (
                    <div key={iteration.id} className="text-center">
                      {iteration.name}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 h-2">
                  {teamActivityData.codeReview.map((rate, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gray-200 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-效能 rounded-full"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Text className="text-sm mb-2 block">每日站会参与率</Text>
                <div className="grid grid-cols-5 gap-2 text-xs mb-1">
                  {iterationBasicData.map((iteration) => (
                    <div key={iteration.id} className="text-center">
                      {iteration.name}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 h-2">
                  {teamActivityData.dailyMeeting.map((rate, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gray-200 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-协作 rounded-full"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Text className="text-sm mb-2 block">文档完善度</Text>
                <div className="grid grid-cols-5 gap-2 text-xs mb-1">
                  {iterationBasicData.map((iteration) => (
                    <div key={iteration.id} className="text-center">
                      {iteration.name}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 h-2">
                  {teamActivityData.documentation.map((rate, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gray-200 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-创新 rounded-full"
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 迭代内容分布 */}
        <Col xs={24} lg={8}>
          <Card className="card-shadow rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Title level={4} className="font-semibold m-0">
                  迭代内容分布
                </Title>
                <Text type="secondary">不同类型任务的占比分析</Text>
              </div>
              <Select
                defaultValue="points"
                style={{ width: 120 }}
                onChange={setContentViewType}
                size="small"
              >
                <Option value="points">按故事点</Option>
                <Option value="tasks">按任务数量</Option>
              </Select>
            </div>

            <div className="h-64">
              <Radar {...contentRadarChartConfig} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {iterationContentData.datasets.map((dataset) => (
                <div key={dataset.name} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: dataset.color }}
                  ></div>
                  <Text>{dataset.name}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        {/* 改进机会 */}
        <Col xs={24} lg={8}>
          <Card size="small" className="card-shadow rounded-xl p-6">
            <Flex vertical className="mb-6">
              <Title level={4} className="font-semibold m-0">
                关键改进机会
              </Title>
              <Text type="secondary">基于迭代对比的效能提升建议</Text>
            </Flex>
            <div className="space-y-4">
              {improvementOpportunities.map((opportunity) => {
                const getBorderColor = () => {
                  switch (opportunity.priority) {
                    case 'high':
                      return '#F5222D';
                    case 'medium':
                      return '#FAAD14';
                    case 'success':
                      return '#52C41A';
                    default:
                      return '#1890ff';
                  }
                };

                return (
                  <div
                    key={opportunity.id}
                    className="border-l-4 pl-4 py-1"
                    style={{ borderColor: getBorderColor() }}
                  >
                    <Title level={5} className="font-medium m-0">
                      {opportunity.title}
                    </Title>
                    <Text type="secondary" className="text-xs block mt-1">
                      {opportunity.description}
                    </Text>
                    <div className="mt-2 flex">
                      {opportunity.priority !== 'success' ? (
                        <>
                          <Button
                            type="link"
                            size="small"
                            className="text-danger text-xs p-0"
                          >
                            查看详情
                          </Button>
                          <Button
                            type="link"
                            size="small"
                            className="text-primary text-xs p-0 ml-4"
                          >
                            创建改进计划
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="link"
                          size="small"
                          className="text-success text-xs p-0"
                        >
                          查看最佳实践
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              block
              type="primary"
              icon={<TagsOutlined />}
              className="mt-6 bg-效能 hover:bg-效能/90 text-white rounded-lg"
            >
              生成效能改进计划
            </Button>
          </Card>
        </Col>
      </Row>
    </Flex>
  );
};

export default IterationComparison;
