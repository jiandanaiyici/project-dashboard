import React, { useState, useEffect } from 'react';
import { DownOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Select,
  Button,
  DatePicker,
  Typography,
  Badge,
  List,
  Spin,
  Flex,
  Avatar,
  message,
  TableColumnsType,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  SolutionOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Line, Pie, Scatter } from '@ant-design/plots';
import dayjs from 'dayjs';

import { teamMembers, riskItems, optimizationSuggestions } from '@/mock';

import {
  queryPredictMitigationEffectivenessService,
  generateRecommendations,
} from './service';
import { usePrediction } from './hooks';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

/**
 * TODO
 * 项目趋势预测
 */
const AIDecisionCenter = ({ projectId }: { projectId: string }) => {
  const [riskPeriod, setRiskPeriod] = useState('2weeks');
  const [timeRange, setTimeRange] = useState([
    dayjs(),
    dayjs().add(6, 'weeks'),
  ]);

  const [predictionResult, loading, refetch] = usePrediction();

  // 获取进度条颜色
  const getProgressColor = (load: number) => {
    if (load > 100) return 'red';
    if (load > 80) return 'orange';
    if (load > 60) return 'green';
    return 'blue';
  };

  const refreshPredictions = () => {
    // fetchRiskPredictions();
  };

  const renderRiskScoreCard = () => {
    if (!predictionResult) return null;

    let riskLevel = '中等';
    let riskColor = '#FAAD14';
    let trendIcon = <ArrowUpOutlined />;
    let trendColor = '#F5222D';
    let trendText = '上升趋势';

    if (predictionResult.riskScore < 40) {
      riskLevel = '低';
      riskColor = '#52C41A';
    } else if (predictionResult.riskScore > 70) {
      riskLevel = '高';
      riskColor = '#F5222D';
    }

    if (predictionResult.riskTrend === 'decreasing') {
      trendIcon = <ArrowDownOutlined />;
      trendColor = '#52C41A';
      trendText = '下降趋势';
    } else if (predictionResult.riskTrend === 'stable') {
      trendIcon = <ArrowDownOutlined rotate={-90} />;
      trendColor = '#1890FF';
      trendText = '稳定趋势';
    }

    return (
      <Card
        className='hover:shadow-md transition-shadow border-l-4'
        style={{ borderLeftColor: riskColor }}
      >
        <div className='flex justify-between items-start'>
          <div>
            <Text type='secondary'>AI预测整体风险评分</Text>
            <div className='flex items-end mt-1'>
              <Statistic
                value={predictionResult.riskScore}
                valueStyle={{ fontSize: '32px', color: riskColor }}
                suffix='/100'
              />
              <Badge
                className='ml-3 mb-1'
                status={
                  predictionResult.riskScore < 40
                    ? 'success'
                    : predictionResult.riskScore > 70
                      ? 'error'
                      : 'warning'
                }
                text={riskLevel}
              />
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <div style={{ color: trendColor, fontSize: '20px' }}>
              {trendIcon}
            </div>
            <Text style={{ color: trendColor }} className='text-sm mt-1'>
              {trendText}
            </Text>
          </div>
        </div>
        <Progress
          percent={predictionResult.riskScore}
          status={
            predictionResult.riskScore < 40
              ? 'success'
              : predictionResult.riskScore > 70
                ? 'exception'
                : 'active'
          }
          className='mt-4'
        />
        <Text type='secondary' className='text-xs mt-3 block'>
          风险评分基于历史数据、当前项目状态和外部因素，由AI模型综合计算得出
        </Text>
      </Card>
    );
  };

  // 渲染风险分布图表
  const renderRiskDistribution = () => {
    if (!predictionResult) return null;

    const config = {
      data: predictionResult.riskDistribution,
      angleField: 'value',
      colorField: 'category',
      radius: 0.7,
      label: {
        type: 'spider',
        labelHeight: 28,
      },
      interactions: [{ type: 'element-active' }],
    };

    return (
      <Card className='hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={5} className='mb-0'>
            预测风险类型分布
          </Title>
          <Select defaultValue='percentage' size='small'>
            <Option value='percentage'>按百分比</Option>
            <Option value='count'>按数量</Option>
          </Select>
        </div>
        <div className='h-64'>
          <Pie {...config} />
        </div>
      </Card>
    );
  };

  // 渲染风险时间线图表
  const renderRiskTimeline = () => {
    if (!predictionResult) return null;

    const config = {
      data: predictionResult.riskTimeline,
      xField: 'week',
      yField: ['high', 'medium', 'low'],
      point: {
        size: 5,
        shape: 'diamond',
      },
      label: false,
      legend: {
        position: 'top',
      },
      yAxis: {
        title: {
          text: '风险数量',
        },
        tickCount: 5,
      },
    };

    return (
      <Card
        title='未来风险趋势预测'
        className='hover:shadow-md transition-shadow'
        extra={
          <Select
            defaultValue='weekly'
            options={[
              { value: 'weekly', label: '按周' },
              { value: 'monthly', label: '按月' },
            ]}
          />
        }
      >
        <div className='h-64'>
          <Line {...config} />
        </div>
      </Card>
    );
  };

  const renderRiskMatrix = () => {
    if (!predictionResult || !predictionResult.predictedRisks) return null;

    const matrixData = predictionResult.predictedRisks.map((risk: any) => ({
      x: risk.impact,
      y: risk.probability,
      risk: risk.description,
      id: risk.id,
      category: risk.category,
    }));

    const colorMap: any = {
      资源风险: '#F5222D',
      技术风险: '#FAAD14',
      需求风险: '#1890FF',
      性能风险: '#722ED1',
      其他风险: '#8C8C8C',
    };

    const config = {
      data: matrixData,
      xField: 'x',
      yField: 'y',
      pointSize: 30,
      pointStyle: (datum: any) => {
        return {
          fill: colorMap[datum.category] || '#8C8C8C',
          stroke: '#fff',
          lineWidth: 2,
        };
      },
      xAxis: {
        min: 0,
        max: 100,
        title: {
          text: '影响程度 (高 →)',
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: '发生概率 (高 ↑)',
        },
      },
      tooltip: {
        formatter: (datum: any) => {
          return { name: datum.id, value: datum.risk };
        },
      },
    };

    return (
      <Card className='hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={5} className='mb-0'>
            风险矩阵分析
          </Title>
          <Text type='secondary' className='text-sm'>
            查看详情
          </Text>
        </div>
        <div className='h-72'>
          <Scatter {...config} />
        </div>
        <div className='flex flex-wrap gap-4 mt-4'>
          {Object.entries(colorMap).map(([category, color]: any) => (
            <div key={category} className='flex items-center text-xs'>
              <div
                className='mr-2 w-3 h-3 rounded-full'
                style={{ backgroundColor: color }}
              ></div>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  // 渲染预测风险列表
  const renderPredictedRisks = () => {
    if (!predictionResult || !predictionResult.predictedRisks) return null;

    const columns: TableColumnsType<any> = [
      {
        title: '风险ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
      },
      {
        title: '风险描述',
        dataIndex: 'description',
        key: 'description',
        width: '25%',
      },
      {
        title: '风险类别',
        dataIndex: 'category',
        key: 'category',
        width: '12%',
        render: (category: any) => {
          const colorMap = {
            资源风险: 'red',
            技术风险: 'orange',
            需求风险: 'blue',
            性能风险: 'purple',
            其他风险: 'gray',
          };
          return (
            <Tag color={colorMap[category as keyof typeof colorMap] || 'gray'}>
              {category}
            </Tag>
          );
        },
      },
      {
        title: '发生概率',
        key: 'probability',
        width: '13%',
        render: (_t: any, record: any) => (
          <div>
            <div className='flex justify-between mb-1'>
              <Text className='text-xs'>{record.probability}%</Text>
              <Badge
                status={
                  record.probability > 70
                    ? 'error'
                    : record.probability > 40
                      ? 'warning'
                      : 'success'
                }
              />
            </div>
            <Progress percent={record.probability} size='small' />
          </div>
        ),
      },
      {
        title: '影响程度',
        key: 'impact',
        width: '13%',
        render: (_, record) => (
          <div>
            <div className='flex justify-between mb-1'>
              <Text className='text-xs'>{record.impact}%</Text>
              <Badge
                status={
                  record.impact > 70
                    ? 'error'
                    : record.impact > 40
                      ? 'warning'
                      : 'success'
                }
              />
            </div>
            <Progress percent={record.impact} size='small' />
          </div>
        ),
      },
      {
        title: '预计发生时间',
        dataIndex: 'predictedOccurrence',
        key: 'predictedOccurrence',
        width: '12%',
        render: (time) => (
          <div className='flex items-center'>
            <ClockCircleOutlined className='mr-1 text-orange-500' />
            <Text className='text-sm'>{time}</Text>
          </div>
        ),
      },
      {
        title: '预测可信度',
        dataIndex: 'confidence',
        key: 'confidence',
        width: '15%',
        render: (confidence) => (
          <div>
            <Text className='text-xs'>{confidence}% 可信度</Text>
            <Progress
              percent={confidence}
              size='small'
              status='success'
              className='mt-1'
            />
          </div>
        ),
      },
    ];

    return (
      <Card className='hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-center mb-4'>
          <Title level={5} className='mb-0'>
            AI预测高风险项
          </Title>
          <Button
            size='small'
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            重新预测
          </Button>
        </div>
        <Table
          dataSource={predictionResult.predictedRisks}
          columns={columns}
          rowKey='id'
          pagination={{ pageSize: 5 }}
          expandable={{
            expandedRowRender: (record) => (
              <div className='p-4 bg-gray-50 rounded'>
                <Title level={5} className='mb-2'>
                  风险因素分析
                </Title>
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  {record.contributingFactors.map(
                    (factor: any, index: number) => (
                      <div key={index}>
                        <div className='flex justify-between text-sm mb-1'>
                          <span>{factor.factor}</span>
                          <span>
                            {factor.value}{' '}
                            <Text type='secondary'>
                              (权重: {factor.weight * 100}%)
                            </Text>
                          </span>
                        </div>
                        <Progress
                          percent={
                            typeof factor.value === 'number'
                              ? factor.value
                              : factor.value === '高'
                                ? 80
                                : factor.value === '中'
                                  ? 50
                                  : 30
                          }
                          size='small'
                        />
                      </div>
                    )
                  )}
                </div>

                <Title level={5} className='mb-2'>
                  AI推荐应对措施
                </Title>
                <List
                  dataSource={generateRecommendations(record)}
                  renderItem={(item, index) => (
                    <List.Item key={index} className='py-1'>
                      <List.Item.Meta
                        avatar={
                          <SolutionOutlined style={{ color: '#1890ff' }} />
                        }
                        title={
                          <div className='flex justify-between'>
                            <span>{item}</span>
                            <Badge
                              text={`预计缓解: ${queryPredictMitigationEffectivenessService(record, item)}%`}
                              color='success'
                            />
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />

                <div className='mt-4'>
                  <Button type='primary' size='small' className='mr-2'>
                    创建应对任务
                  </Button>
                  <Button size='small'>添加到风险跟踪</Button>
                </div>
              </div>
            ),
          }}
        />
      </Card>
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <Title level={3} className='mb-0'>
          风险预测
        </Title>
        <Flex className='flex gap-2'>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
          <Button type='primary'>生成决策建议</Button>
          <Select
            defaultValue='payment-refactor'
            style={{ width: 200 }}
            options={[
              { value: 'payment-refactor', label: '支付系统重构' },
              { value: 'user-center', label: '用户中心升级' },
              { value: 'mobile-app', label: '移动端新版开发' },
            ]}
          />
        </Flex>
      </div>
      <div className='space-y-6'>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            {loading ? (
              <Card className='h-64 flex items-center justify-center'>
                <Spin size='large' />
              </Card>
            ) : (
              renderRiskScoreCard()
            )}
          </Col>
          <Col xs={24} lg={8}>
            {loading ? (
              <Card className='h-64 flex items-center justify-center'>
                <Spin size='large' />
              </Card>
            ) : (
              renderRiskDistribution()
            )}
          </Col>
          <Col xs={24} lg={8}>
            {loading ? (
              <Card className='h-64 flex items-center justify-center'>
                <Spin size='large' />
              </Card>
            ) : (
              <Card className='hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-center mb-4'>
                  <Title level={5} className='mb-0'>
                    预测参数设置
                  </Title>
                  <Button
                    size='small'
                    type='primary'
                    // icon={<ZapOutlined />}
                    onClick={refreshPredictions}
                  >
                    重新计算
                  </Button>
                </div>
                <div className='space-y-4'>
                  <div>
                    <Text type='secondary' className='text-xs block mb-1'>
                      预测时间范围
                    </Text>
                    <RangePicker
                      size='small'
                      // @ts-ignore
                      value={timeRange}
                      // @ts-ignore
                      onChange={setTimeRange}
                    />
                  </div>
                  <div>
                    <Text type='secondary' className='text-xs block mb-1'>
                      预测模型版本
                    </Text>
                    <Select
                      defaultValue='v2.3'
                      size='small'
                      style={{ width: '100%' }}
                    >
                      <Option value='v2.3'>AI风险预测模型 v2.3 (推荐)</Option>
                      <Option value='v2.2'>AI风险预测模型 v2.2</Option>
                      <Option value='v1.0'>基础统计模型 v1.0</Option>
                    </Select>
                  </div>
                  <div>
                    <Text type='secondary' className='text-xs block mb-1'>
                      预测敏感度
                    </Text>
                    <Select
                      defaultValue='balanced'
                      size='small'
                      style={{ width: '100%' }}
                    >
                      <Option value='high'>高敏感度 (更多预警)</Option>
                      <Option value='balanced'>平衡 (推荐)</Option>
                      <Option value='low'>低敏感度 (较少预警)</Option>
                    </Select>
                  </div>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {loading ? (
              <Card className='h-80 flex items-center justify-center'>
                <Spin size='large' />
              </Card>
            ) : (
              renderRiskTimeline()
            )}
          </Col>
          <Col xs={24} lg={12}>
            {loading ? (
              <Card className='h-80 flex items-center justify-center'>
                <Spin size='large' />
              </Card>
            ) : (
              renderRiskMatrix()
            )}
          </Col>
        </Row>

        {loading ? (
          <Card className='h-96 flex items-center justify-center'>
            <Spin size='large' />
          </Card>
        ) : (
          renderPredictedRisks()
        )}

        <Card className='hover:shadow-md transition-shadow bg-blue-50 border-blue-200'>
          <div className='flex items-start'>
            <div className='mt-1 mr-4 text-blue-500'>
              {/* <ZapOutlined style={{ fontSize: '20px' }} /> */}
            </div>
            <div>
              <Title level={5} className='mb-2 text-blue-800'>
                AI风险预测模型说明
              </Title>
              <Paragraph className='text-sm text-blue-700 mb-0'>
                本风险预测基于机器学习算法，分析项目历史数据、当前状态和类似项目经验，
                预测未来可能出现的风险及可能性。预测结果仅供参考，建议结合项目实际情况
                进行决策。模型每周自动更新，提高预测准确性。
              </Paragraph>
            </div>
          </div>
        </Card>
        {/* 风险预测和资源优化 */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          {/* 风险预测 */}
          <div className='lg:col-span-2'>
            <Card className='h-full'>
              <div className='flex flex-wrap justify-between items-center mb-6'>
                <div>
                  <h3 className='font-semibold text-gray-800'>项目风险预测</h3>
                  <p className='text-gray-500 text-sm mt-1'>
                    基于历史数据和当前趋势的AI风险评估
                  </p>
                </div>
                <div className='mt-4 sm:mt-0'>
                  <Select
                    className='w-40'
                    defaultValue='2weeks'
                    onChange={setRiskPeriod}
                    suffixIcon={<DownOutlined className='text-xs' />}
                    options={[
                      { value: '2weeks', label: '未来2周' },
                      { value: '1month', label: '未来1个月' },
                      { value: 'iteration', label: '整个迭代周期' },
                    ]}
                  ></Select>
                </div>
              </div>

              {/* 风险趋势图 */}
              <div id='riskTrendChart' className='h-64 mb-6'></div>

              {/* 主要风险列表 */}
              <div>
                <h4 className='font-medium text-gray-700 mb-4'>
                  高优先级风险项
                </h4>
                <div className='space-y-4'>
                  {riskItems.map((risk, index) => (
                    <Card
                      key={index}
                      className={`border-${risk.levelType}/30 bg-${risk.levelType}/5 hover:border-${risk.levelType} transition-colors`}
                    >
                      <div className='flex items-start'>
                        <div
                          className={`w-8 h-8 rounded-full bg-${risk.levelType}/10 flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          {risk.icon}
                        </div>
                        <div className='ml-3 flex-1'>
                          <div className='flex flex-wrap justify-between'>
                            <p className='text-sm font-medium'>{risk.title}</p>
                            <Badge
                              color={risk.levelType}
                              text={risk.level}
                              className='mt-0.5'
                            />
                          </div>
                          <p className='text-xs text-gray-600 mt-1'>
                            {risk.description}
                          </p>

                          {risk.measures.length > 0 && (
                            <div className='mt-3'>
                              <div className='text-xs text-gray-500 mb-1'>
                                AI推荐缓解措施：
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                {risk.measures.map((measure, mIndex) => (
                                  <Tag
                                    key={mIndex}
                                    className='flex items-center'
                                    closeIcon={null}
                                  >
                                    {measure.icon} {measure.name}
                                  </Tag>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 资源优化 */}
          <div>
            <Card className='h-full'>
              <div className='flex flex-wrap justify-between items-center mb-6'>
                <div>
                  <h3 className='font-semibold text-gray-800'>资源优化建议</h3>
                  <p className='text-gray-500 text-sm mt-1'>
                    AI驱动的团队资源分配优化
                  </p>
                </div>
                <Button type='text' className='mt-4 sm:mt-0'>
                  查看详情
                </Button>
              </div>

              {/* 资源负载分析 */}
              <div className='mb-6'>
                <h4 className='font-medium text-gray-700 mb-3'>
                  团队成员负载分析
                </h4>
                <div className='space-y-4'>
                  {teamMembers.map((member, index) => (
                    <div key={index}>
                      <div className='flex justify-between text-sm mb-1'>
                        <div className='flex items-center'>
                          <Avatar
                            size={20}
                            src={member.avatar}
                            className='mr-2'
                          />
                          <span className='text-gray-600'>{member.name}</span>
                        </div>
                        <span className='text-gray-600'>{member.load}%</span>
                      </div>
                      <Progress
                        percent={member.load}
                        strokeColor={getProgressColor(member.load)}
                        size='small'
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 优化建议 */}
              <div className='border-t border-gray-200 pt-4'>
                <h4 className='font-medium text-gray-700 mb-3'>AI优化建议</h4>
                <div className='space-y-3'>
                  {optimizationSuggestions.map((suggestion, index) => (
                    <div key={index} className='flex items-start'>
                      <div className='w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5'>
                        {suggestion.icon}
                      </div>
                      <div className='ml-3'>
                        <p className='text-sm'>{suggestion.title}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className='mt-4 w-full bg-purple-50 hover:bg-purple-100 text-purple-600 border-none'
                  onClick={() => {
                    message.success('资源优化建议已应用！');
                  }}
                >
                  <span>应用优化建议</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDecisionCenter;
