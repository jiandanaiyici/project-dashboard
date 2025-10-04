import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SmileOutlined,
  LineChartOutlined,
  TrophyOutlined,
  FrownOutlined,
  MehOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/plots';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Select,
  Table,
  Avatar,
  Typography,
  Segmented,
  Flex,
} from 'antd';
import { useState } from 'react';

import { efficiencyMetrics, teamEfficiencySummary, teamMembers } from '@/mock';

const { Text, Title } = Typography;
/**
 * 团队效能概览
 */
const TeamOverview = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter

  // 渲染绩效评分
  const renderPerformanceScore = (score: number) => {
    let color = '#52c41a'; // 绿色 - 优秀
    let text = '优秀';
    let icon = <SmileOutlined />;

    if (score < 60) {
      color = '#f5222d'; // 红色 - 待改进
      text = '待改进';
      icon = <FrownOutlined />;
    } else if (score < 80) {
      color = '#faad14'; // 黄色 - 良好
      text = '良好';
      icon = <MehOutlined />;
    }

    return (
      <div className="flex items-center">
        <div style={{ color, marginRight: 4 }}>{icon}</div>
        <span style={{ color, fontWeight: 'bold' }}>{score}</span>
        <span style={{ marginLeft: 4, color: '#8c8c8c' }}>{text}</span>
      </div>
    );
  };

  // 渲染绩效趋势图标
  const renderTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    } else if (trend === 'down') {
      return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
    } else {
      return <div style={{ width: 14 }}></div>;
    }
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均任务完成率</Text>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgCompletionRate}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={teamEfficiencySummary.avgCompletionRate}
              size="small"
              status="active"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月提升 3%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均按时完成率</Text>
              <ClockCircleOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgOnTimeRate}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={teamEfficiencySummary.avgOnTimeRate}
              size="small"
              status={
                teamEfficiencySummary.avgOnTimeRate > 80 ? 'success' : 'active'
              }
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月下降 2%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">平均质量评分</Text>
              <SmileOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={teamEfficiencySummary.avgQualityScore}
              precision={0}
              valueStyle={{ fontSize: '24px' }}
            />
            <Progress
              percent={teamEfficiencySummary.avgQualityScore}
              size="small"
              status="success"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              较上月提升 1%
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">团队效能趋势</Text>
              <LineChartOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value="上升"
              valueStyle={{ fontSize: '24px', color: '#52c41a' }}
            />
            <div className="h-10 mt-2">
              <Line
                data={[
                  { month: '3月', score: 78 },
                  { month: '4月', score: 80 },
                  { month: '5月', score: 82 },
                  { month: '6月', score: 85 },
                ]}
                xField="month"
                yField="score"
                meta={{ score: { min: 70, max: 90 } }}
                lineStyle={{ stroke: '#52c41a', lineWidth: 2 }}
                point={false}
                xAxis={false}
                yAxis={false}
              />
            </div>
            <Text type="secondary" className="text-xs mt-1 block">
              连续3个月呈上升趋势
            </Text>
          </Card>
        </Col>
      </Row>
      <section
        id="performance-overview"
        className="performance-section section-transition"
      >
        {/* <!-- 效能评分概览 --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-效能">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">团队效能综合评分</div>
              <div className="w-10 h-10 rounded-full bg-效能/10 flex items-center justify-center">
                <i className="fa fa-tachometer text-效能"></i>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">
              86
              <span className="text-base font-normal text-gray-500 ml-1">
                /100
              </span>
            </div>
            <div className="mt-1 text-xs text-success">
              <i className="fa fa-arrow-up mr-1"></i>较上季度提升 5 分
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">评级：</span> 优秀 ·
              处于公司前20%团队
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-创新">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">交付速度</div>
              <div className="w-10 h-10 rounded-full bg-创新/10 flex items-center justify-center">
                <i className="fa fa-bolt text-创新"></i>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">
              82
              <span className="text-base font-normal text-gray-500 ml-1">
                /100
              </span>
            </div>
            <div className="mt-1 text-xs text-success">
              <i className="fa fa-arrow-up mr-1"></i>较上季度提升 8 分
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">亮点：</span> 迭代周期缩短15%
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-质量">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">交付质量</div>
              <div className="w-10 h-10 rounded-full bg-质量/10 flex items-center justify-center">
                <i className="fa fa-check-circle text-质量"></i>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">
              79
              <span className="text-base font-normal text-gray-500 ml-1">
                /100
              </span>
            </div>
            <div className="mt-1 text-xs text-danger">
              <i className="fa fa-arrow-down mr-1"></i>较上季度下降 2 分
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">问题：</span> 生产环境Bug率上升
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-协作">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 text-sm">团队协作</div>
              <div className="w-10 h-10 rounded-full bg-协作/10 flex items-center justify-center">
                <i className="fa fa-handshake-o text-协作"></i>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold">
              91
              <span className="text-base font-normal text-gray-500 ml-1">
                /100
              </span>
            </div>
            <div className="mt-1 text-xs text-success">
              <i className="fa fa-arrow-up mr-1"></i>较上季度提升 3 分
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <span className="font-medium">优势：</span>{' '}
              沟通效率高，知识共享充分
            </div>
          </div>
        </div>

        {/* <!-- 效能趋势和关键指标 --> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card
            size="small"
            title={
              <Flex vertical>
                <h3 className="font-semibold text-gray-800">效能趋势分析</h3>
                <p className="text-gray-500 text-sm mt-1">
                  团队效能关键指标变化趋势
                </p>
              </Flex>
            }
            extra={
              <Segmented
                options={[
                  { label: '综合评分', value: 'overall' },
                  { label: '交付速度', value: 'deliverySpeed' },
                  { label: '交付质量', value: 'deliveryQuality' },
                  { label: '团队协作', value: 'teamCollaboration' },
                ]}
              />
            }
            className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow"
          >
            {/* <!-- 效能趋势图 --> */}
            <div className="h-64 mb-6">
              <canvas id="performanceTrendChart"></canvas>
            </div>

            {/* <!-- 效能雷达图 --> */}
            <div>
              <h4 className="font-medium text-gray-700 mb-4">效能维度分析</h4>
              <div className="h-64">
                <canvas id="performanceRadarChart"></canvas>
              </div>
            </div>
          </Card>

          {/* <!-- 关键效能指标 --> */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">关键效能指标</h3>
                <p className="text-gray-500 text-sm mt-1">
                  核心效能度量与行业基准对比
                </p>
              </div>
              <button className="text-效能 text-sm hover:underline">
                查看全部
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">迭代完成率</span>
                  <span className="text-gray-600">92%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-效能 rounded-full"
                    style={{ width: '92%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    团队历史平均: 85%
                  </span>
                  <span className="text-xs text-success">高于行业基准 12%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">周期时间 (天)</span>
                  <span className="text-gray-600">5.2天</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-效能 rounded-full"
                    style={{ width: '78%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    团队历史平均: 6.8天
                  </span>
                  <span className="text-xs text-success">优于行业基准 21%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">生产环境缺陷率</span>
                  <span className="text-gray-600">3.8%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    团队历史平均: 3.2%
                  </span>
                  <span className="text-xs text-danger">高于行业基准 0.5%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">代码审查覆盖率</span>
                  <span className="text-gray-600">96%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-效能 rounded-full"
                    style={{ width: '96%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    团队历史平均: 90%
                  </span>
                  <span className="text-xs text-success">高于行业基准 16%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">平均修复时间 (小时)</span>
                  <span className="text-gray-600">8.5小时</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-效能 rounded-full"
                    style={{ width: '82%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    团队历史平均: 10.2小时
                  </span>
                  <span className="text-xs text-success">优于行业基准 18%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- 效能健康度和目标达成 --> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <!-- 效能健康度 --> */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">效能健康度</h3>
                <p className="text-gray-500 text-sm mt-1">
                  各维度效能健康状态评估
                </p>
              </div>
              <button className="text-效能 text-sm hover:underline">
                详情分析
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">迭代计划准确性</div>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                    健康
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">当前水平</span>
                    <span className="text-gray-500">92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: '92%' }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <i className="fa fa-arrow-up text-success mr-1"></i>{' '}
                  连续3个迭代保持在90%以上
                </div>
              </div>

              <div className="bg-warning/5 rounded-lg p-4 border border-warning/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">缺陷预防能力</div>
                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                    需关注
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">当前水平</span>
                    <span className="text-gray-500">68%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-warning rounded-full"
                      style={{ width: '68%' }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <i className="fa fa-arrow-down text-danger mr-1"></i>{' '}
                  近2个迭代呈下降趋势
                </div>
              </div>

              <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">团队协作效率</div>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                    健康
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">当前水平</span>
                    <span className="text-gray-500">91%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: '91%' }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <i className="fa fa-arrow-up text-success mr-1"></i>{' '}
                  较上季度提升3个百分点
                </div>
              </div>

              <div className="bg-danger/5 rounded-lg p-4 border border-danger/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">技术债务管理</div>
                  <span className="px-2 py-0.5 bg-danger/10 text-danger text-xs rounded-full">
                    需改进
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">当前水平</span>
                    <span className="text-gray-500">52%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-danger rounded-full"
                      style={{ width: '52%' }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <i className="fa fa-arrow-down text-danger mr-1"></i>{' '}
                  低于健康阈值(70%)
                </div>
              </div>
            </div>
          </div>

          {/* <!-- 效能目标达成 --> */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">效能目标达成</h3>
                <p className="text-gray-500 text-sm mt-1">
                  季度效能目标完成情况
                </p>
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-效能/50 focus:border-效能">
                  <option>2023 Q2</option>
                  <option>2023 Q1</option>
                  <option>2022 Q4</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <i className="fa fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>

            <div className="h-64">
              <canvas id="performanceGoalsChart"></canvas>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span>目标值</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-效能 mr-2"></div>
                <span>当前值</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span>未达成</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
                <span>已达成</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 团队成员效能排行 */}
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <Title level={5}>团队成员效能排行</Title>
          <Select
            value={timeRange}
            onChange={setTimeRange}
            size="small"
            options={[
              { value: 'week', label: '近一周' },
              { value: 'month', label: '近一月' },
              { value: 'quarter', label: '近一季度' },
            ]}
          />
        </div>

        <Table
          dataSource={teamMembers.map(member => ({
            ...member,
            // @ts-ignore
            ...efficiencyMetrics[member.id],
            key: member.id,
          }))}
          pagination={false}
          onRow={record => ({
            onClick: () => setSelectedMember(record.id),
            style: {
              cursor: 'pointer',
              backgroundColor: selectedMember === record.id ? '#f0f7ff' : '',
            },
          })}
        >
          <Table.Column
            title="排名"
            render={(text, record, index) => (
              <div className="flex items-center">
                {index < 3 ? (
                  <TrophyOutlined
                    style={{
                      color:
                        index === 0
                          ? '#faad14'
                          : index === 1
                            ? '#c0c0c0'
                            : '#cd7f32',
                      marginRight: 8,
                    }}
                  />
                ) : (
                  <span style={{ marginRight: 8 }}>{index + 1}</span>
                )}
                <div className="flex items-center">
                  <Avatar src={record.avatar} size="small" className="mr-2" />
                  <span>{record.name}</span>
                </div>
              </div>
            )}
          />
          <Table.Column title="角色" dataIndex="role" />
          <Table.Column
            title="完成率"
            render={(text, record) => (
              <div className="flex items-center">
                <span style={{ marginRight: 8, fontWeight: 'bold' }}>
                  {record.completionRate}%
                </span>
                <Progress percent={record.completionRate} size="small" />
              </div>
            )}
          />
          <Table.Column
            title="按时率"
            render={(text, record) => (
              <div className="flex items-center">
                <span style={{ marginRight: 8, fontWeight: 'bold' }}>
                  {record.onTimeRate}%
                </span>
                <Progress percent={record.onTimeRate} size="small" />
              </div>
            )}
          />
          <Table.Column
            title="质量评分"
            render={(text, record) =>
              renderPerformanceScore(record.qualityScore)
            }
          />
          <Table.Column
            title="效能趋势"
            render={(text, record) => (
              <div className="flex items-center">
                {renderTrendIcon(record.recentPerformance)}
                <span style={{ marginLeft: 4 }}>
                  {record.recentPerformance === 'up'
                    ? '上升'
                    : record.recentPerformance === 'down'
                      ? '下降'
                      : '持平'}
                </span>
              </div>
            )}
          />
        </Table>
      </Card>

      {/* 团队效能分布分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>成员效能分布</Title>
              <Select
                defaultValue="completion"
                size="small"
                options={[
                  { value: 'completion', label: '按完成率' },
                  { value: 'quality', label: '按质量评分' },
                  { value: 'contribution', label: '按贡献度' },
                ]}
                // onChange={setMetricType}
              />
            </div>
            <div className="h-72">
              <Bar
                data={teamMembers.map(member => ({
                  name: member.name,
                  // @ts-ignore
                  // 完成率: efficiencyMetrics[member.id].completionRate,
                }))}
                xField="name"
                yField="完成率"
                meta={{ 完成率: { min: 0, max: 100 } }}
                xAxis={{ label: { autoRotate: true } }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>任务类型分布</Title>
              <Select
                defaultValue="team"
                size="small"
                options={[
                  { value: 'team', label: '团队整体' },
                  { value: 'role', label: '按角色' },
                ]}
                // onChange={setDistributionType}
              />
            </div>
            <div className="h-72">
              <Pie
                data={[
                  { type: '新功能开发', value: 45 },
                  { type: '缺陷修复', value: 25 },
                  { type: '优化改进', value: 15 },
                  { type: '测试验证', value: 10 },
                  { type: '文档管理', value: 5 },
                ]}
                angleField="value"
                colorField="type"
                radius={0.7}
                label={({ type, value }) => `${type}: ${value}%`}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamOverview;
