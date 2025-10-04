import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Avatar,
  Badge,
  Progress,
  Button,
  Segmented,
  Tooltip,
  Divider,
  Tag,
  Alert,
  Rate,
} from 'antd';
import {
  DashboardOutlined,
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  ProjectOutlined,
  TeamOutlined,
  SafetyOutlined,
  RocketOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  StarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// 企业级关键指标
interface ExecutiveKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  impact: string;
  category: 'business' | 'operational' | 'strategic' | 'people';
}

// 战略洞察
interface StrategicInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'achievement';
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  business_impact: number;
  confidence: number;
  action_required: boolean;
  timeline: string;
}

const ExecutiveDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'quarter' | 'month' | 'week'>('quarter');
  const [focusArea, setFocusArea] = useState<'all' | 'business' | 'operations' | 'people'>('all');

  // 核心KPI数据
  const executiveKPIs: ExecutiveKPI[] = useMemo(() => [
    {
      id: 'revenue_growth',
      name: '营收增长率',
      value: 23.5,
      target: 25.0,
      unit: '%',
      trend: 2.1,
      status: 'good',
      impact: '年度收入目标完成94%',
      category: 'business',
    },
    {
      id: 'customer_satisfaction',
      name: '客户满意度',
      value: 4.6,
      target: 4.5,
      unit: '/5.0',
      trend: 0.2,
      status: 'excellent',
      impact: '超越行业标准15%',
      category: 'business',
    },
    {
      id: 'system_availability',
      name: '系统可用性',
      value: 99.85,
      target: 99.9,
      unit: '%',
      trend: -0.03,
      status: 'warning',
      impact: '需关注系统稳定性',
      category: 'operational',
    },
    {
      id: 'team_efficiency',
      name: '团队效能',
      value: 82,
      target: 85,
      unit: '分',
      trend: 3.5,
      status: 'good',
      impact: '持续改善中',
      category: 'people',
    },
    {
      id: 'delivery_success',
      name: '交付成功率',
      value: 94.2,
      target: 95.0,
      unit: '%',
      trend: 1.8,
      status: 'good',
      impact: '客户信任度提升',
      category: 'operational',
    },
    {
      id: 'innovation_index',
      name: '创新指数',
      value: 78,
      target: 80,
      unit: '分',
      trend: 5.2,
      status: 'good',
      impact: 'AI功能采用率突破预期',
      category: 'strategic',
    },
  ], []);

  // 战略洞察数据
  const strategicInsights: StrategicInsight[] = useMemo(() => [
    {
      id: 'insight-001',
      type: 'opportunity',
      priority: 'high',
      title: '企业客户市场潜力巨大',
      description: '企业客户收入增长35%，远超个人用户增长率',
      business_impact: 2800000,
      confidence: 92,
      action_required: true,
      timeline: 'Q4执行',
    },
    {
      id: 'insight-002',
      type: 'risk',
      priority: 'critical',
      title: '核心技术人才流失风险',
      description: '高级技术人员离职率15%，需立即干预',
      business_impact: -1500000,
      confidence: 88,
      action_required: true,
      timeline: '30天内',
    },
    {
      id: 'insight-003',
      type: 'achievement',
      priority: 'medium',
      title: 'AI功能市场认可度高',
      description: '用户采用率72%，超预期22个百分点',
      business_impact: 1200000,
      confidence: 95,
      action_required: false,
      timeline: '持续优化',
    },
  ], []);

  // 业务健康度图表
  const getBusinessHealthOption = () => ({
    title: {
      text: '业务健康度雷达',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#262626',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
    },
    radar: {
      indicator: [
        { name: '营收增长', max: 100 },
        { name: '客户满意', max: 100 },
        { name: '运营效率', max: 100 },
        { name: '团队效能', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '市场地位', max: 100 },
      ],
      radius: '65%',
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#595959',
        fontSize: 14,
        fontWeight: 500,
      },
      splitLine: {
        lineStyle: {
          color: '#e8e8e8',
          width: 1,
        },
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.3)', 'rgba(250, 250, 250, 0.1)'],
        },
      },
    },
    series: [
      {
        name: '业务健康度',
        type: 'radar',
        data: [
          {
            value: [85, 92, 88, 82, 78, 75],
            name: '当前状态',
            areaStyle: {
              color: 'rgba(24, 144, 255, 0.2)',
            },
            lineStyle: {
              color: '#1890ff',
              width: 3,
            },
            itemStyle: {
              color: '#1890ff',
              borderWidth: 2,
            },
          },
        ],
      },
    ],
  });

  // 战略执行进度图表
  const getStrategicProgressOption = () => ({
    title: {
      text: '战略举措执行进度',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#262626',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
    },
    xAxis: {
      type: 'category',
      data: ['数字化转型', 'AI能力建设', '国际化拓展', '生态合作', '人才发展'],
      axisLabel: {
        color: '#595959',
        fontSize: 12,
        interval: 0,
        rotate: 0,
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        color: '#8c8c8c',
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: '完成进度',
        type: 'bar',
        data: [78, 85, 45, 62, 88],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#52c41a' },
            { offset: 1, color: '#237804' },
          ]),
          borderRadius: [4, 4, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#262626',
          fontWeight: 600,
        },
        barWidth: '50%',
      },
    ],
  });

  // 渲染KPI卡片
  const renderKPICard = (kpi: ExecutiveKPI) => {
    const statusColors = {
      excellent: '#52c41a',
      good: '#1890ff',
      warning: '#fa8c16',
      critical: '#ff4d4f',
    };

    const statusIcons = {
      excellent: <CheckCircleOutlined />,
      good: <RiseOutlined />,
      warning: <WarningOutlined />,
      critical: <ClockCircleOutlined />,
    };

    const completion = (kpi.value / kpi.target) * 100;

    return (
      <Card
        hoverable
        style={{
          height: '180px',
          borderLeft: `4px solid ${statusColors[kpi.status]}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
              {kpi.name}
            </Text>
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <Text
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: statusColors[kpi.status],
                  lineHeight: 1,
                }}
              >
                {kpi.value}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: '#8c8c8c',
                  marginLeft: '4px',
                }}
              >
                {kpi.unit}
              </Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Progress
                percent={Math.min(completion, 100)}
                size="small"
                strokeColor={statusColors[kpi.status]}
                showInfo={false}
                style={{ margin: 0 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>
                  目标: {kpi.target}{kpi.unit}
                </Text>
                <Text style={{ fontSize: '11px', color: '#bfbfbf' }}>
                  {completion.toFixed(0)}%
                </Text>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Badge color={statusColors[kpi.status]} />
            <div style={{ marginTop: '8px' }}>
              <Space>
                {statusIcons[kpi.status]}
                <Text
                  style={{
                    fontSize: '12px',
                    color: kpi.trend > 0 ? '#52c41a' : '#ff4d4f',
                    fontWeight: 600,
                  }}
                >
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </Text>
              </Space>
            </div>
          </div>
        </div>
        <Tooltip title={kpi.impact}>
          <Text
            type="secondary"
            style={{
              fontSize: '11px',
              display: 'block',
              marginTop: '8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {kpi.impact}
          </Text>
        </Tooltip>
      </Card>
    );
  };

  // 渲染洞察卡片
  const renderInsightCard = (insight: StrategicInsight) => {
    const typeColors = {
      opportunity: '#52c41a',
      risk: '#ff4d4f',
      achievement: '#1890ff',
    };

    const typeLabels = {
      opportunity: '机会',
      risk: '风险',
      achievement: '成就',
    };

    const priorityColors = {
      critical: '#ff4d4f',
      high: '#fa8c16',
      medium: '#1890ff',
    };

    return (
      <Card
        size="small"
        style={{
          marginBottom: '12px',
          borderLeft: `3px solid ${typeColors[insight.type]}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Tag color={typeColors[insight.type]} style={{ margin: 0, marginRight: '8px' }}>
                {typeLabels[insight.type]}
              </Tag>
              <Badge color={priorityColors[insight.priority]} />
            </div>
            <Title level={5} style={{ margin: 0, marginBottom: '4px', fontSize: '14px' }}>
              {insight.title}
            </Title>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              {insight.description}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                影响: ¥{Math.abs(insight.business_impact).toLocaleString()}
              </Text>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
                置信度: {insight.confidence}%
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <CrownOutlined style={{ marginRight: '12px', color: '#faad14' }} />
              执行仪表板
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              企业级决策支持中心 • 最后更新: {dayjs().format('YYYY-MM-DD HH:mm')}
            </Text>
          </div>
          <Space size="middle">
            <Segmented
              value={timeframe}
              onChange={setTimeframe}
              options={[
                { label: '本季度', value: 'quarter' },
                { label: '本月', value: 'month' },
                { label: '本周', value: 'week' },
              ]}
            />
            <Button type="primary" icon={<EyeOutlined />}>
              生成报告
            </Button>
          </Space>
        </div>
      </div>

      {/* 核心KPI指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {executiveKPIs.slice(0, 6).map((kpi) => (
          <Col span={4} key={kpi.id}>
            {renderKPICard(kpi)}
          </Col>
        ))}
      </Row>

      {/* 数据可视化图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card
            title="业务健康度分析"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts
              option={getBusinessHealthOption()}
              style={{ height: '320px' }}
              notMerge={true}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="战略执行进度"
            style={{ height: '400px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts
              option={getStrategicProgressOption()}
              style={{ height: '320px' }}
              notMerge={true}
            />
          </Card>
        </Col>
      </Row>

      {/* 战略洞察与行动建议 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <ThunderboltOutlined style={{ color: '#722ed1' }} />
                <span>战略洞察与行动建议</span>
                <Badge count={strategicInsights.filter(i => i.action_required).length} />
              </Space>
            }
            extra={
              <Button type="link" icon={<MoreOutlined />}>
                查看全部
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {strategicInsights.map((insight) => (
                <Col span={8} key={insight.id}>
                  {renderInsightCard(insight)}
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveDashboard;