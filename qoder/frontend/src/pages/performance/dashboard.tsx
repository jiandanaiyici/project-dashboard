import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Alert,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Tabs,
  List,
  Avatar,
  Badge,
  Divider,
  Dropdown,
  Tooltip,
  Rate,
  Timeline,
} from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  BugOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  GlobalOutlined,
  LineChartOutlined,
  BarChartOutlined,
  RobotOutlined,
  AimOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  SafetyOutlined,
  FundOutlined,
  TrophyOutlined,
  StarOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// 导入类型定义
import type {
  ApplicationData,
  SmartInsight,
  KPIConfig,
  ActionItem,
  HealthReport,
  UserRole,
  DashboardView,
  SeverityLevel,
  PerformanceMetrics
} from '@/types/performance';

// 导入 mock 数据
import {
  mockApplications,
  mockSmartInsights,
  mockKPIConfigs,
  mockActionItems,
  mockHealthReports,
  mockAlerts,
  getOverallMetrics,
  getPVUVTrendOption,
  getErrorRateOption,
  getResponseTimeOption,
  getUserDistributionOption,
  getGrowthTrendOption,
  getMultiAppComparisonOption,
} from '@/mock/performance';

// 导入工具函数
import {
  calculateHealthScore,
  getPerformanceGrade,
  getStatusColor,
  getStatusText,
  getViewByRole,
  getBusinessImpactScore,
  getPriorityColors,
  getStatusColors,
  calculateGrowthRate,
  getGrowthRateStyle,
} from '@/utils/performance';

// 启用相对时间插件
dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;



const ApplicationHealthDashboard: React.FC = () => {
  // 状态管理
  const [currentUser, setCurrentUser] = useState<UserRole>(UserRole.TECH_LEAD);
  const [dashboardView, setDashboardView] = useState<DashboardView>(DashboardView.OPERATIONAL);
  const [selectedApp, setSelectedApp] = useState('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [loading, setLoading] = useState(false);
  const [personalizedKPIs, setPersonalizedKPIs] = useState<string[]>([]);
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // 智能洞察数据
  const smartInsights: SmartInsight[] = useMemo(() => [
    {
      id: 'insight-1',
      type: 'opportunity',
      title: '移动端访问量增长机会',
      description: '过去7天移动端流量增长32%，建议优化移动端体验以获得更高转化',
      confidence: 85,
      impact: {
        revenue: 156000,
        users: 12000,
        reputation: 'medium',
        urgency: SeverityLevel.MEDIUM,
      },
      actionable: true,
      recommendations: [
        '优化移动端页面加载速度',
        '改进移动端交互体验',
        '增加移动端专属功能',
      ],
      relatedMetrics: ['mobile_pv', 'mobile_conversion', 'page_load_time'],
      timestamp: dayjs().subtract(2, 'hour').toISOString(),
    },
    {
      id: 'insight-2',
      type: 'risk',
      title: 'API响应时间异常',
      description: '用户登录接口响应时间较昨日增长85%，可能影响用户体验',
      confidence: 92,
      impact: {
        revenue: 89000,
        users: 8500,
        reputation: 'high',
        urgency: SeverityLevel.HIGH,
      },
      actionable: true,
      recommendations: [
        '检查数据库连接池配置',
        '优化登录接口查询逻辑',
        '增加接口监控告警',
      ],
      relatedMetrics: ['api_response_time', 'error_rate', 'user_login_success'],
      timestamp: dayjs().subtract(1, 'hour').toISOString(),
    },
    {
      id: 'insight-3',
      type: 'trend',
      title: '用户活跃度持续提升',
      description: '月活跃用户数连续3个月增长，增长率稳定在15%左右',
      confidence: 78,
      impact: {
        revenue: 234000,
        users: 25000,
        reputation: 'high',
        urgency: SeverityLevel.INFO,
      },
      actionable: false,
      recommendations: [
        '保持当前产品策略',
        '准备扩容计划以应对增长',
        '分析增长驱动因素并复制',
      ],
      relatedMetrics: ['monthly_active_users', 'user_retention', 'feature_usage'],
      timestamp: dayjs().subtract(4, 'hour').toISOString(),
    },
  ], []);
  
  // KPI配置数据
  const kpiConfigs: KPIConfig[] = useMemo(() => [
    {
      id: 'availability',
      name: '系统可用性',
      category: '稳定性',
      target: 99.9,
      current: 99.85,
      trend: -0.05,
      status: 'warning',
      businessValue: '每0.1%可用性提升可减少约50万元损失',
      owner: 'DevOps团队',
    },
    {
      id: 'user_satisfaction',
      name: '用户满意度',
      category: '体验',
      target: 4.5,
      current: 4.6,
      trend: 0.1,
      status: 'excellent',
      businessValue: '满意度每提升0.1可带来约15%的留存提升',
      owner: '产品团队',
    },
    {
      id: 'response_time',
      name: '平均响应时间',
      category: '性能',
      target: 200,
      current: 280,
      trend: 15,
      status: 'warning',
      businessValue: '响应时间每减少100ms可提升转化率约3%',
      owner: '技术团队',
    },
    {
      id: 'error_rate',
      name: '错误率',
      category: '质量',
      target: 0.1,
      current: 0.45,
      trend: 0.1,
      status: 'critical',
      businessValue: '错误率每降低0.1%可减少约10万元客服成本',
      owner: '开发团队',
    },
  ], []);
  
  // 行动项数据
  const actionItems: ActionItem[] = useMemo(() => [
    {
      id: 'action-1',
      title: '优化用户登录接口性能',
      priority: SeverityLevel.HIGH,
      assignee: '张三',
      dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      status: 'in_progress',
      estimatedImpact: '预计可提升登录成功率8%',
      category: '性能优化',
    },
    {
      id: 'action-2',
      title: '建立移动端性能监控',
      priority: SeverityLevel.MEDIUM,
      assignee: '李四',
      dueDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      status: 'pending',
      estimatedImpact: '完善监控体系，减少故障发现时间50%',
      category: '监控完善',
    },
    {
      id: 'action-3',
      title: '数据库查询优化',
      priority: SeverityLevel.HIGH,
      assignee: '王五',
      dueDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      status: 'overdue',
      estimatedImpact: '预计可降低平均响应时间30%',
      category: '数据库优化',
    },
  ], []);
  const [activeTab, setActiveTab] = useState('overview');

  // 健康度评估算法
  const calculateHealthScore = useCallback((metrics: PerformanceMetrics) => {
    // 基于多维度指标计算健康度
    const stabilityScore = Math.max(0, 100 - metrics.errorRate * 10); // 稳定性：错误率越低越好
    const performanceScore = Math.max(0, 100 - (metrics.avgResponseTime - 200) / 10); // 性能：200ms为基准
    const reliabilityScore = metrics.successRate; // 可靠性：成功率
    const userExpScore = Math.max(0, 100 - (metrics.whiteScreenTime - 1000) / 50); // 用户体验：1秒为基准
    
    // 加权平均
    const healthScore = (
      stabilityScore * 0.3 + 
      performanceScore * 0.25 + 
      reliabilityScore * 0.25 + 
      userExpScore * 0.2
    );
    
    return Math.round(Math.max(0, Math.min(100, healthScore)));
  }, []);

  // 获取性能等级
  const getPerformanceGrade = useCallback((score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, []);

  // 健康度报表数据
  const healthReports: HealthReport[] = useMemo(() => [
    {
      period: '本周',
      overallScore: 85,
      trend: 'up',
      metrics: {
        stability: 92,
        performance: 78,
        reliability: 89,
        security: 95,
        userExperience: 82,
        maintainability: 75,
      },
      issues: [
        {
          type: 'major',
          description: '数据分析平台响应时间过长',
          impact: '影响用户体验，可能导致用户流失',
          suggestion: '优化数据库查询，增加缓存机制',
        },
        {
          type: 'minor',
          description: '部分接口错误率较高',
          impact: '影响系统稳定性',
          suggestion: '加强异常处理和重试机制',
        },
      ],
      achievements: [
        {
          title: '系统可用性提升',
          improvement: 5,
          description: '系统可用性从95%提升到99.5%',
        },
        {
          title: '错误率降低',
          improvement: 3,
          description: '整体错误率从2.1%降低到1.8%',
        },
      ],
    },
  ], []);

  // 根据用户角色定制视图
  const getViewByRole = useCallback((role: UserRole) => {
    switch (role) {
      case UserRole.TECH_LEAD:
        return {
          title: '技术负责人视图',
          description: '关注系统稳定性、技术债务和团队效能',
          primaryMetrics: ['availability', 'error_rate', 'technical_debt', 'team_velocity'],
          insights: smartInsights.filter(i => i.type === 'risk' || i.type === 'trend'),
        };
      case UserRole.PRODUCT_MANAGER:
        return {
          title: '产品经理视图',
          description: '关注用户体验、业务指标和产品健康度',
          primaryMetrics: ['user_satisfaction', 'conversion_rate', 'feature_adoption', 'churn_rate'],
          insights: smartInsights.filter(i => i.type === 'opportunity' || i.type === 'trend'),
        };
      case UserRole.DEVOPS:
        return {
          title: 'DevOps视图',
          description: '关注系统运行状态、部署质量和运维效率',
          primaryMetrics: ['uptime', 'deployment_frequency', 'mttr', 'change_failure_rate'],
          insights: smartInsights.filter(i => i.type === 'risk' || i.type === 'anomaly'),
        };
      default:
        return {
          title: '综合视图',
          description: '全面的系统性能概览',
          primaryMetrics: ['availability', 'user_satisfaction', 'response_time', 'error_rate'],
          insights: smartInsights,
        };
    }
  }, [smartInsights]);
  
  // 获取业务影响评分
  const getBusinessImpactScore = useCallback((impact: { revenue: number, users: number, reputation: string, urgency: SeverityLevel }) => {
    const revenueScore = Math.min(impact.revenue / 100000, 10); // 10万为满分
    const userScore = Math.min(impact.users / 10000, 10); // 1万用户为满分
    const reputationScore = impact.reputation === 'high' ? 10 : impact.reputation === 'medium' ? 6 : 3;
    const urgencyScore = {
      [SeverityLevel.CRITICAL]: 10,
      [SeverityLevel.HIGH]: 8,
      [SeverityLevel.MEDIUM]: 5,
      [SeverityLevel.LOW]: 3,
      [SeverityLevel.INFO]: 1,
    }[impact.urgency];
    
    return Math.round((revenueScore + userScore + reputationScore + urgencyScore) / 4);
  }, []);
  
  // 智能洞察组件
  const renderSmartInsights = () => {
    const currentViewInsights = getViewByRole(currentUser).insights;
    
    return (
      <Card 
        title={
          <Space>
            <RobotOutlined style={{ color: '#722ed1' }} />
            <span>智能洞察</span>
            <Badge count={currentViewInsights.length} style={{ backgroundColor: '#722ed1' }} />
          </Space>
        }
        extra={
          <Button 
            type="link" 
            onClick={() => setInsightsVisible(true)}
            icon={<EyeOutlined />}
          >
            查看全部
          </Button>
        }
        style={{ marginBottom: '16px' }}
      >
        <List
          size="small"
          dataSource={currentViewInsights.slice(0, 3)}
          renderItem={(insight) => (
            <List.Item
              actions={[
                <Tooltip title={`置信度: ${insight.confidence}%`}>
                  <Progress 
                    type="circle" 
                    size={24} 
                    percent={insight.confidence}
                    format={() => `${insight.confidence}%`}
                    strokeWidth={8}
                  />
                </Tooltip>,
                <Button 
                  type="link" 
                  size="small"
                  disabled={!insight.actionable}
                >
                  {insight.actionable ? '采取行动' : '仅供参考'}
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    style={{
                      backgroundColor: {
                        'opportunity': '#52c41a',
                        'risk': '#ff4d4f',
                        'trend': '#1890ff',
                        'anomaly': '#fa8c16',
                      }[insight.type]
                    }}
                    icon={
                      {
                        'opportunity': <ArrowUpOutlined />,
                        'risk': <WarningOutlined />,
                        'trend': <LineChartOutlined />,
                        'anomaly': <ThunderboltOutlined />,
                      }[insight.type]
                    }
                  />
                }
                title={
                  <Space>
                    <span>{insight.title}</span>
                    <Tag color={
                      {
                        'opportunity': 'green',
                        'risk': 'red',
                        'trend': 'blue',
                        'anomaly': 'orange',
                      }[insight.type]
                    }>
                      {{
                        'opportunity': '机会',
                        'risk': '风险',
                        'trend': '趋势',
                        'anomaly': '异常',
                      }[insight.type]}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>{insight.description}</div>
                    <Space size="small">
                      <Text type="secondary">
                        业务影响: ¥{insight.impact.revenue.toLocaleString()}
                      </Text>
                      <Divider type="vertical" />
                      <Text type="secondary">
                        影响用户: {insight.impact.users.toLocaleString()}人
                      </Text>
                      <Divider type="vertical" />
                      <Text type="secondary">
                        {dayjs(insight.timestamp).fromNow()}
                      </Text>
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };
  
  // KPI仪表板组件
  const renderKPIDashboard = () => {
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        {kpiConfigs.map((kpi) => {
          const isPercentage = kpi.id === 'availability' || kpi.id === 'error_rate';
          const statusColors = {
            excellent: '#52c41a',
            good: '#1890ff',
            warning: '#fa8c16',
            critical: '#ff4d4f',
          };
          
          return (
            <Col span={6} key={kpi.id}>
              <Card size="small" hoverable>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {kpi.category}
                    </Text>
                    <Badge color={statusColors[kpi.status]} />
                  </div>
                  
                  <Statistic
                    title={kpi.name}
                    value={kpi.current}
                    precision={isPercentage ? 2 : 0}
                    suffix={isPercentage ? '%' : kpi.id === 'response_time' ? 'ms' : ''}
                    valueStyle={{ 
                      color: statusColors[kpi.status],
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                    prefix={
                      kpi.trend > 0 ? 
                        <ArrowUpOutlined style={{ color: kpi.status === 'excellent' ? '#52c41a' : '#ff4d4f' }} /> :
                        <ArrowDownOutlined style={{ color: kpi.status === 'critical' ? '#ff4d4f' : '#52c41a' }} />
                    }
                  />
                  
                  <div style={{ marginTop: '8px' }}>
                    <Progress
                      percent={Math.round((kpi.current / kpi.target) * 100)}
                      size="small"
                      status={kpi.status === 'critical' ? 'exception' : kpi.status === 'warning' ? 'active' : 'success'}
                      showInfo={false}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '11px' }}>目标: {kpi.target}</Text>
                      <Text type="secondary" style={{ fontSize: '11px' }}>负责人: {kpi.owner}</Text>
                    </div>
                  </div>
                  
                  <Tooltip title={kpi.businessValue}>
                    <Button type="link" size="small" icon={<InfoCircleOutlined />}>
                      业务价值
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };
  
  // 行动项组件
  const renderActionItems = () => {
    const priorityColors = {
      [SeverityLevel.CRITICAL]: '#ff4d4f',
      [SeverityLevel.HIGH]: '#fa8c16',
      [SeverityLevel.MEDIUM]: '#1890ff',
      [SeverityLevel.LOW]: '#52c41a',
      [SeverityLevel.INFO]: '#d9d9d9',
    };
    
    const statusColors = {
      pending: 'default',
      in_progress: 'processing',
      completed: 'success',
      overdue: 'error',
    };
    
    return (
      <Card 
        title={
          <Space>
            <AimOutlined style={{ color: '#1890ff' }} />
            <span>待办行动项</span>
            <Badge count={actionItems.filter(item => item.status !== 'completed').length} />
          </Space>
        }
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />}>
            新建任务
          </Button>
        }
      >
        <List
          size="small"
          dataSource={actionItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={statusColors[item.status]}>
                  {{                  
                    pending: '待开始',
                    in_progress: '进行中',
                    completed: '已完成',
                    overdue: '已逾期',
                  }[item.status]}
                </Tag>,
                <Dropdown
                  menu={{
                    items: [
                      { key: 'edit', label: '编辑', icon: <EditOutlined /> },
                      { key: 'delete', label: '删除', icon: <DeleteOutlined /> },
                      { key: 'reassign', label: '重新分配', icon: <UsergroupAddOutlined /> },
                    ]
                  }}
                >
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </Dropdown>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge 
                    color={priorityColors[item.priority]} 
                    dot 
                    style={{ marginTop: '8px' }}
                  />
                }
                title={
                  <Space>
                    <span>{item.title}</span>
                    <Tag>{item.category}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '4px' }}>{item.estimatedImpact}</div>
                    <Space size="small">
                      <Text type="secondary">
                        <UsergroupAddOutlined /> {item.assignee}
                      </Text>
                      <Divider type="vertical" />
                      <Text type="secondary">
                        <ClockCircleOutlined /> {item.dueDate}
                      </Text>
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };
  const applications: ApplicationData[] = [
    {
      id: '1',
      name: '项目管理平台',
      version: 'v1.2.3',
      status: 'healthy',
      metrics: {
        pv: 125000,
        uv: 8500,
        errorRate: 0.2,
        successRate: 99.8,
        avgResponseTime: 280,
        whiteScreenTime: 1200,
        healthScore: 95,
        performanceGrade: 'A',
      },
      lastDeployTime: '2024-01-15 14:30:00',
    },
    {
      id: '2',
      name: '用户管理系统',
      version: 'v2.1.0',
      status: 'warning',
      metrics: {
        pv: 89000,
        uv: 5200,
        errorRate: 1.8,
        successRate: 98.2,
        avgResponseTime: 450,
        whiteScreenTime: 2100,
        healthScore: 78,
        performanceGrade: 'B',
      },
      lastDeployTime: '2024-01-10 09:15:00',
    },
    {
      id: '3',
      name: '数据分析平台',
      version: 'v3.0.1',
      status: 'error',
      metrics: {
        pv: 45000,
        uv: 2800,
        errorRate: 5.2,
        successRate: 94.8,
        avgResponseTime: 850,
        whiteScreenTime: 3500,
        healthScore: 62,
        performanceGrade: 'C',
      },
      lastDeployTime: '2024-01-12 16:45:00',
    },
  ];

  // 汇总指标
  const overallMetrics = {
    totalPV: applications.reduce((sum, app) => sum + app.metrics.pv, 0),
    totalUV: applications.reduce((sum, app) => sum + app.metrics.uv, 0),
    avgErrorRate: applications.reduce((sum, app) => sum + app.metrics.errorRate, 0) / applications.length,
    avgResponseTime: applications.reduce((sum, app) => sum + app.metrics.avgResponseTime, 0) / applications.length,
    // 环比增长率
    growthRates: {
      pv: calculateGrowthRate(
        applications.reduce((sum, app) => sum + app.metrics.pv, 0),
        applications.reduce((sum, app) => sum + (app.previousMetrics?.pv || 0), 0)
      ),
      uv: calculateGrowthRate(
        applications.reduce((sum, app) => sum + app.metrics.uv, 0),
        applications.reduce((sum, app) => sum + (app.previousMetrics?.uv || 0), 0)
      ),
      errorRate: calculateGrowthRate(
        overallMetrics.avgErrorRate,
        applications.reduce((sum, app) => sum + (app.previousMetrics?.errorRate || 0), 0) / applications.length
      ),
      responseTime: calculateGrowthRate(
        overallMetrics.avgResponseTime,
        applications.reduce((sum, app) => sum + (app.previousMetrics?.avgResponseTime || 0), 0) / applications.length
      ),
    }
  };

  // 环比增长趋势图配置
  const growthTrendOption = getGrowthTrendOption(applications);

  // 多应用对比图配置
  const multiAppComparisonOption = getMultiAppComparisonOption(applications);

  // PV/UV趋势图表
  const pvUvTrendOption = {
    title: {
      text: 'PV/UV 趋势分析',
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
      data: ['PV', 'UV'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
    },
    yAxis: [
      {
        type: 'value',
        name: 'PV',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: 'UV',
        position: 'right',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: 'PV',
        type: 'line',
        yAxisIndex: 0,
        data: [118000, 122000, 125000, 120000, 128000, 125000, 130000],
        itemStyle: { color: '#1890ff' },
        smooth: true
      },
      {
        name: 'UV',
        type: 'line',
        yAxisIndex: 1,
        data: [8200, 8400, 8500, 8300, 8600, 8500, 8700],
        itemStyle: { color: '#52c41a' },
        smooth: true
      }
    ]
  };

  // 错误率分布图
  const errorRateOption = {
    title: {
      text: '应用错误率对比',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)'
    },
    series: [
      {
        name: '错误率',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: applications.map(app => ({
          value: app.metrics.errorRate,
          name: app.name,
          itemStyle: {
            color: app.status === 'healthy' ? '#52c41a' :
                   app.status === 'warning' ? '#faad14' : '#ff4d4f'
          }
        }))
      }
    ]
  };

  // 响应时间趋势
  const responseTimeOption = {
    title: {
      text: '响应时间分析',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: applications.map(app => app.name)
    },
    yAxis: {
      type: 'value',
      name: '响应时间(ms)'
    },
    series: [
      {
        name: '平均响应时间',
        type: 'bar',
        data: applications.map(app => ({
          value: app.metrics.avgResponseTime,
          itemStyle: {
            color: app.metrics.avgResponseTime < 300 ? '#52c41a' :
                   app.metrics.avgResponseTime < 500 ? '#faad14' : '#ff4d4f'
          }
        }))
      }
    ]
  };

  // 用户分布地图数据（模拟）
  const userDistributionOption = {
    title: {
      text: '用户地理分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '用户分布',
        type: 'pie',
        radius: '65%',
        center: ['50%', '60%'],
        data: [
          { value: 3500, name: '北京' },
          { value: 2800, name: '上海' },
          { value: 2200, name: '广州' },
          { value: 1800, name: '深圳' },
          { value: 1500, name: '杭州' },
          { value: 1200, name: '其他' }
        ]
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return '健康';
      case 'warning': return '警告';
      case 'error': return '错误';
      default: return '未知';
    }
  };

  const applicationColumns = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ApplicationData) => (
        <Space>
          <Avatar icon={<GlobalOutlined />} />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.version}
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
      title: '健康度',
      dataIndex: ['metrics', 'healthScore'],
      key: 'healthScore',
      render: (score: number, record: ApplicationData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Progress
            type="circle"
            percent={score}
            size={40}
            format={() => score}
            strokeColor={
              score >= 90 ? '#52c41a' :
              score >= 80 ? '#1890ff' :
              score >= 70 ? '#faad14' : '#ff4d4f'
            }
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{score}分</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {record.metrics.performanceGrade}级
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'PV',
      dataIndex: ['metrics', 'pv'],
      key: 'pv',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'UV',
      dataIndex: ['metrics', 'uv'],
      key: 'uv',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '错误率',
      dataIndex: ['metrics', 'errorRate'],
      key: 'errorRate',
      render: (value: number) => (
        <span style={{ color: value > 2 ? '#ff4d4f' : value > 1 ? '#faad14' : '#52c41a' }}>
          {value}%
        </span>
      ),
    },
    {
      title: '响应时间',
      dataIndex: ['metrics', 'avgResponseTime'],
      key: 'responseTime',
      render: (value: number) => `${value}ms`,
    },
    {
      title: '白屏时间',
      dataIndex: ['metrics', 'whiteScreenTime'],
      key: 'whiteScreenTime',
      render: (value: number) => `${value}ms`,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <MedicineBoxOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          应用健康度中心
        </Title>
        <Text type="secondary">
          智能监控应用健康状态，提供全面的健康度评估和优化建议
        </Text>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space size="large">
          <div>
            <Text strong>应用选择：</Text>
            <Select
              value={selectedApp}
              onChange={setSelectedApp}
              style={{ width: 200, marginLeft: 8 }}
            >
              <Select.Option value="all">全部应用</Select.Option>
              {applications.map(app => (
                <Select.Option key={app.id} value={app.id}>
                  {app.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <Text strong>时间范围：</Text>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ marginLeft: 8 }}
            />
          </div>
          <Button type="primary" icon={<LineChartOutlined />}>
            更新数据
          </Button>
        </Space>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab={
          <span>
            <HeartOutlined />
            健康概览
          </span>
        } key="overview">
          {/* 综合指标卡片 - 含环比增长趋势 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="metric-card">
                <Statistic
                  title="总访问量 (PV)"
                  value={overallMetrics.totalPV}
                  precision={0}
                  prefix={<EyeOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                  suffix={
                    <Tooltip title={`环比增长${overallMetrics.growthRates.pv}%`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}></span>
                        <span 
                          className="growth-rate"
                          style={{
                            color: getGrowthRateStyle(overallMetrics.growthRates.pv).color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getGrowthRateStyle(overallMetrics.growthRates.pv).icon === 'up' ? 
                            <ArrowUpOutlined style={{ fontSize: 12, marginRight: 2 }} /> : 
                            <ArrowDownOutlined style={{ fontSize: 12, marginRight: 2 }} />
                          }
                          {Math.abs(overallMetrics.growthRates.pv)}%
                        </span>
                      </span>
                    </Tooltip>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="metric-card">
                <Statistic
                  title="独立访客 (UV)"
                  value={overallMetrics.totalUV}
                  precision={0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                  suffix={
                    <Tooltip title={`环比增长${overallMetrics.growthRates.uv}%`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ marginRight: 8 }}></span>
                        <span 
                          className="growth-rate"
                          style={{
                            color: getGrowthRateStyle(overallMetrics.growthRates.uv).color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getGrowthRateStyle(overallMetrics.growthRates.uv).icon === 'up' ? 
                            <ArrowUpOutlined style={{ fontSize: 12, marginRight: 2 }} /> : 
                            <ArrowDownOutlined style={{ fontSize: 12, marginRight: 2 }} />
                          }
                          {Math.abs(overallMetrics.growthRates.uv)}%
                        </span>
                      </span>
                    </Tooltip>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="metric-card">
                <Statistic
                  title="平均错误率"
                  value={overallMetrics.avgErrorRate}
                  precision={2}
                  prefix={<BugOutlined />}
                  valueStyle={{ color: overallMetrics.avgErrorRate > 2 ? '#ff4d4f' : '#52c41a' }}
                  suffix={
                    <Tooltip title={`环比变化${overallMetrics.growthRates.errorRate}%`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span>%</span>
                        <span style={{ marginLeft: 8 }}></span>
                        <span 
                          className="growth-rate"
                          style={{
                            color: getGrowthRateStyle(overallMetrics.growthRates.errorRate, false).color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getGrowthRateStyle(overallMetrics.growthRates.errorRate, false).icon === 'up' ? 
                            <ArrowUpOutlined style={{ fontSize: 12, marginRight: 2 }} /> : 
                            <ArrowDownOutlined style={{ fontSize: 12, marginRight: 2 }} />
                          }
                          {Math.abs(overallMetrics.growthRates.errorRate)}%
                        </span>
                      </span>
                    </Tooltip>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card hoverable className="metric-card">
                <Statistic
                  title="平均响应时间"
                  value={overallMetrics.avgResponseTime}
                  precision={0}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: overallMetrics.avgResponseTime > 500 ? '#ff4d4f' : '#52c41a' }}
                  suffix={
                    <Tooltip title={`环比变化${overallMetrics.growthRates.responseTime}%`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <span>ms</span>
                        <span style={{ marginLeft: 8 }}></span>
                        <span 
                          className="growth-rate"
                          style={{
                            color: getGrowthRateStyle(overallMetrics.growthRates.responseTime, false).color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getGrowthRateStyle(overallMetrics.growthRates.responseTime, false).icon === 'up' ? 
                            <ArrowUpOutlined style={{ fontSize: 12, marginRight: 2 }} /> : 
                            <ArrowDownOutlined style={{ fontSize: 12, marginRight: 2 }} />
                          }
                          {Math.abs(overallMetrics.growthRates.responseTime)}%
                        </span>
                      </span>
                    </Tooltip>
                  }
                />
              </Card>
            </Col>
          </Row>

          {/* 图表区域 - 包含环比趋势和多应用对比 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="PV/UV 趋势" style={{ height: '400px' }}>
                <ReactECharts option={pvUvTrendOption} style={{ height: '320px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="错误率分布" style={{ height: '400px' }}>
                <ReactECharts option={errorRateOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>

          {/* 环比增长趋势和多应用对比图表 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title="健康度环比增长趋势" style={{ height: '400px' }} className="chart-card">
                <ReactECharts 
                  option={growthTrendOption} 
                  style={{ height: '320px' }}
                  notMerge={true}
                  lazyUpdate={true}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="多应用核心指标对比" style={{ height: '400px' }} className="chart-card">
                <ReactECharts 
                  option={multiAppComparisonOption} 
                  style={{ height: '320px' }}
                  notMerge={true}
                  lazyUpdate={true}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="响应时间对比" style={{ height: '400px' }}>
                <ReactECharts option={responseTimeOption} style={{ height: '320px' }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="用户地理分布" style={{ height: '400px' }}>
                <ReactECharts option={userDistributionOption} style={{ height: '320px' }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab={
          <span>
            <FundOutlined />
            健康度报表
          </span>
        } key="health-report">
          {/* 健康度报表内容 */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            {/* 综合健康度 */}
            <Col xs={24} lg={8}>
              <Card title={
                <Space>
                  <TrophyOutlined style={{ color: '#52c41a' }} />
                  综合健康度
                </Space>
              }>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Progress
                      type="circle"
                      percent={healthReports[0].overallScore}
                      format={(percent) => (
                        <div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                            {percent}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999' }}>分</div>
                        </div>
                      )}
                      strokeColor={{
                        '0%': '#ff4d4f',
                        '50%': '#faad14',
                        '80%': '#52c41a',
                        '100%': '#13c2c2',
                      }}
                      size={120}
                    />
                  </div>
                  <Rate disabled value={Math.floor(healthReports[0].overallScore / 20)} />
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">
                      {healthReports[0].trend === 'up' ? '上升趋势' : 
                       healthReports[0].trend === 'down' ? '下降趋势' : '稳定趋势'}
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* 各维度指标 */}
            <Col xs={24} lg={16}>
              <Card title="健康度维度分析">
                <Row gutter={[16, 16]}>
                  {Object.entries(healthReports[0].metrics).map(([key, value]) => {
                    const labels: Record<string, string> = {
                      stability: '稳定性',
                      performance: '性能',
                      reliability: '可靠性',
                      security: '安全性',
                      userExperience: '用户体验',
                      maintainability: '可维护性',
                    };
                    return (
                      <Col span={8} key={key}>
                        <div style={{ textAlign: 'center' }}>
                          <Progress
                            type="circle"
                            percent={value}
                            size={80}
                            format={(percent) => `${percent}`}
                            strokeColor={
                              value >= 90 ? '#52c41a' :
                              value >= 80 ? '#1890ff' :
                              value >= 70 ? '#faad14' : '#ff4d4f'
                            }
                          />
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            {labels[key]}
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </Col>
          </Row>

          {/* 问题和成就 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  发现问题
                </Space>
              }>
                <List
                  dataSource={healthReports[0].issues}
                  renderItem={(issue) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: 
                                issue.type === 'critical' ? '#ff4d4f' :
                                issue.type === 'major' ? '#faad14' : '#1890ff'
                            }}
                          >
                            {issue.type === 'critical' ? 'C' :
                             issue.type === 'major' ? 'M' : 'L'}
                          </Avatar>
                        }
                        title={issue.description}
                        description={
                          <div>
                            <div style={{ marginBottom: '4px' }}>
                              <Text type="secondary">影响：{issue.impact}</Text>
                            </div>
                            <div>
                              <Text strong>建议：</Text>
                              <Text>{issue.suggestion}</Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title={
                <Space>
                  <StarOutlined style={{ color: '#52c41a' }} />
                  改进成果
                </Space>
              }>
                <Timeline>
                  {healthReports[0].achievements.map((achievement, index) => (
                    <Timeline.Item
                      key={index}
                      color="green"
                      dot={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {achievement.title}
                          <Tag color="green" style={{ marginLeft: '8px' }}>
                            +{achievement.improvement}%
                          </Tag>
                        </div>
                        <Text type="secondary">{achievement.description}</Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>

        </TabPane>

        <TabPane tab={
          <span>
            <GlobalOutlined />
            应用详情
          </span>
        } key="applications">
          <Card title="应用性能详情">
            <Table
              columns={applicationColumns}
              dataSource={applications}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </TabPane>

        <TabPane tab="实时告警" key="alerts">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="当前告警">
                <List
                  dataSource={[
                    {
                      id: '1',
                      type: 'error',
                      app: '数据分析平台',
                      message: '错误率超过5%阈值',
                      time: '2分钟前',
                    },
                    {
                      id: '2',
                      type: 'warning',
                      app: '用户管理系统',
                      message: '响应时间超过400ms',
                      time: '5分钟前',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<ExclamationCircleOutlined />}
                            style={{
                              backgroundColor: item.type === 'error' ? '#ff4d4f' : '#faad14'
                            }}
                          />
                        }
                        title={item.app}
                        description={
                          <div>
                            <div>{item.message}</div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.time}
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
              <Card title="告警统计">
                <div style={{ textAlign: 'center' }}>
                  <Statistic
                    title="今日告警"
                    value={15}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <Progress
                      type="circle"
                      percent={85}
                      format={() => '正常率\n85%'}
                      strokeColor="#52c41a"
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ApplicationHealthDashboard;