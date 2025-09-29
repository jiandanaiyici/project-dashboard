import React, { useMemo, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, List, Tag, Button, Avatar, Space, Typography, Tooltip, Badge, Drawer } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  EyeOutlined,
  MoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BellOutlined,
  MenuOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useMobileDetection, MobileContainer, MobileGrid, MobileStatCard, MobileActionBar, MobileDrawer } from '../components/Mobile';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'projects' | 'team'>('overview');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // 移动端检测
  const { isMobile, isSmallMobile, isMobileOrTablet } = useMobileDetection();

  // 企业级关键指标
  const enterpriseMetrics = useMemo(() => [
    {
      key: 'projects',
      title: '活跃项目',
      value: 25,
      change: '+12%',
      trend: 'up',
      color: '#1890ff',
      icon: <ProjectOutlined style={{ fontSize: '28px', color: '#1890ff' }} />,
      description: '本月新增3个项目',
      target: 30,
      status: 'normal'
    },
    {
      key: 'team',
      title: '团队成员',
      value: 128,
      change: '+5.2%',
      trend: 'up',
      color: '#52c41a',
      icon: <TeamOutlined style={{ fontSize: '28px', color: '#52c41a' }} />,
      description: '在线率98.5%',
      target: 150,
      status: 'good'
    },
    {
      key: 'delivery',
      title: '交付里程碑',
      value: 89,
      change: '+24%',
      trend: 'up',
      color: '#722ed1',
      icon: <TrophyOutlined style={{ fontSize: '28px', color: '#722ed1' }} />,
      description: '按时完成率89%',
      target: 100,
      status: 'excellent'
    },
    {
      key: 'alerts',
      title: '风险监控',
      value: 3,
      change: '-60%',
      trend: 'down',
      color: '#fa8c16',
      icon: <ExclamationCircleOutlined style={{ fontSize: '28px', color: '#fa8c16' }} />,
      description: '需关注风险减少',
      target: 0,
      status: 'warning'
    },
  ], []);

  // 项目效能图表配置
  const performanceChartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '项目效能概览',
      left: 'center',
      textStyle: {
        color: '#262626',
        fontSize: 16,
        fontWeight: 500,
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      itemGap: 20,
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 42, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: 38, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: 12, name: '待开始', itemStyle: { color: '#faad14' } },
          { value: 8, name: '暂停', itemStyle: { color: '#f5222d' } }
        ]
      }
    ]
  }), []);

  // 团队效率趋势图
  const efficiencyTrendOption = useMemo(() => ({
    backgroundColor: 'transparent',
    title: {
      text: '团队效率趋势',
      left: 'center',
      textStyle: {
        color: '#262626',
        fontSize: 16,
        fontWeight: 500,
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderWidth: 0,
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ])
        },
        itemStyle: {
          color: '#667eea',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: 'rgba(102, 126, 234, 0)' }
          ])
        },
        data: [120, 145, 132, 168, 185, 203]
      },
      {
        name: '团队效率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#f093fb' },
            { offset: 1, color: '#f5576c' }
          ])
        },
        itemStyle: {
          color: '#f093fb',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f093fb' },
            { offset: 1, color: 'rgba(240, 147, 251, 0)' }
          ])
        },
        data: [85, 89, 92, 88, 94, 96]
      }
    ]
  }), []);

  // 智能洞察数据
  const insights = useMemo(() => [
    {
      id: 1,
      type: 'trend',
      title: '项目交付效率提升显著',
      description: '相比上月，项目交付效率提升24%，团队协作水平不断优化',
      time: '刚刚',
      priority: 'high',
      icon: <TrophyOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: 2,
      type: 'alert',
      title: '移动端项目进度延迟',
      description: '需要关注资源调配，建议增加2名开发人员',
      time: '5分钟前',
      priority: 'medium',
      icon: <ClockCircleOutlined style={{ color: '#faad14' }} />
    },
    {
      id: 3,
      type: 'achievement',
      title: '技术团队技能提升明显',
      description: '本季度团队完成技能认证18项，技术栈覆盖度达95%',
      time: '1小时前',
      priority: 'low',
      icon: <ThunderboltOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: 4,
      type: 'collaboration',
      title: '跨部门协作效率优化',
      description: '通过流程优化，跨部门沟通效率提升35%',
      time: '2小时前',
      priority: 'low',
      icon: <TeamOutlined style={{ color: '#722ed1' }} />
    }
  ], []);

  // 移动端操作按钮
  const mobileActions = [
    {
      key: 'filter',
      label: '筛选',
      icon: <FilterOutlined />,
      onClick: () => setDrawerVisible(true),
    },
    {
      key: 'refresh',
      label: '刷新',
      icon: <BellOutlined />,
      onClick: () => window.location.reload(),
    },
    {
      key: 'create',
      label: '创建',
      icon: <ProjectOutlined />,
      type: 'primary' as const,
      onClick: () => console.log('创建项目'),
    },
  ];

  // 移动端筛选抽屉内容
  const renderMobileFilters = () => (
    <div>
      <Title level={4} style={{ marginBottom: '16px' }}>数据筛选</Title>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>查看模式</Text>
          <div style={{ marginTop: '8px' }}>
            <Button.Group style={{ width: '100%' }}>
              <Button 
                type={viewMode === 'overview' ? 'primary' : 'default'}
                onClick={() => setViewMode('overview')}
                style={{ flex: 1 }}
              >
                数据概览
              </Button>
              <Button 
                type={viewMode === 'projects' ? 'primary' : 'default'}
                onClick={() => setViewMode('projects')}
                style={{ flex: 1 }}
              >
                项目管理
              </Button>
              <Button 
                type={viewMode === 'team' ? 'primary' : 'default'}
                onClick={() => setViewMode('team')}
                style={{ flex: 1 }}
              >
                团队效能
              </Button>
            </Button.Group>
          </div>
        </div>
        
        <div>
          <Text strong>时间范围</Text>
          <div style={{ marginTop: '8px' }}>
            <Button.Group style={{ width: '100%' }}>
              <Button 
                type={timeframe === 'today' ? 'primary' : 'default'}
                onClick={() => setTimeframe('today')}
                style={{ flex: 1 }}
              >
                今日
              </Button>
              <Button 
                type={timeframe === 'week' ? 'primary' : 'default'}
                onClick={() => setTimeframe('week')}
                style={{ flex: 1 }}
              >
                本周
              </Button>
              <Button 
                type={timeframe === 'month' ? 'primary' : 'default'}
                onClick={() => setTimeframe('month')}
                style={{ flex: 1 }}
              >
                本月
              </Button>
            </Button.Group>
          </div>
        </div>
      </Space>
    </div>
  );

  // 项目执行数据
  const projectData = useMemo(() => [
    {
      key: '1',
      name: '管理平台',
      status: '进行中',
      progress: 85,
      members: 8,
      deadline: '2024-12-31',
      priority: 'high',
      health: 'good',
      manager: '张明',
      budget: 98.5
    },
    {
      key: '2',
      name: '移动端智能应用',
      status: '计划中',
      progress: 25,
      members: 5,
      deadline: '2024-11-30',
      priority: 'medium',
      health: 'normal',
      manager: '李炎',
      budget: 75.2
    },
    {
      key: '3',
      name: '微服务架构重构',
      status: '进行中',
      progress: 72,
      members: 6,
      deadline: '2024-10-15',
      priority: 'high',
      health: 'excellent',
      manager: '王浩',
      budget: 92.8
    },
    {
      key: '4',
      name: '数据分析中台',
      status: '已完成',
      progress: 100,
      members: 4,
      deadline: '2024-09-20',
      priority: 'low',
      health: 'excellent',
      manager: '刘芳',
      budget: 100
    },
    {
      key: '5',
      name: '企业级安全平台',
      status: '进行中',
      progress: 45,
      members: 7,
      deadline: '2025-01-15',
      priority: 'high',
      health: 'warning',
      manager: '陈敏',
      budget: 68.3
    }
  ], []);

  const projectColumns = useMemo(() => [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            style={{ 
              backgroundColor: record.priority === 'high' ? '#ff4d4f' : 
                             record.priority === 'medium' ? '#faad14' : '#52c41a',
              marginRight: '8px'
            }} 
            size="small"
          >
            {name.charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: '14px' }}>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>PM: {record.manager}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: any) => {
        const statusConfig = {
          '进行中': { color: 'processing', icon: <ClockCircleOutlined /> },
          '已完成': { color: 'success', icon: <CheckCircleOutlined /> },
          '暂停': { color: 'warning', icon: <ExclamationCircleOutlined /> },
          '计划中': { color: 'default', icon: <CalendarOutlined /> }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['计划中'];
        return (
          <Tag color={config.color} icon={config.icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number, record: any) => {
        const strokeColor = record.health === 'excellent' ? '#52c41a' : 
                           record.health === 'good' ? '#1890ff' :
                           record.health === 'normal' ? '#faad14' : '#ff4d4f';
        return (
          <div>
            <Progress 
              percent={progress} 
              size="small" 
              strokeColor={strokeColor}
              format={(percent) => `${percent}%`}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              预算: {record.budget}%
            </Text>
          </div>
        );
      },
    },
    {
      title: '团队',
      dataIndex: 'members',
      key: 'members',
      width: 80,
      render: (members: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeamOutlined style={{ marginRight: '4px', color: '#666' }} />
          <Text>{members}人</Text>
        </div>
      ),
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
      width: 120,
      render: (deadline: string) => (
        <div>
          <Text style={{ fontSize: '14px' }}>{deadline}</Text>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="更多操作">
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ], []);

  return (
    <MobileContainer 
      style={{ 
        padding: isMobile ? (isSmallMobile ? '8px' : '12px') : '24px', 
        background: '#f5f5f5', 
        minHeight: '100vh' 
      }}
    >
      {/* 企业级标题区域 */}
      <div style={{ marginBottom: isMobile ? '16px' : '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <Title level={isMobile ? 3 : 2} style={{ margin: 0, color: '#262626', fontWeight: 600 }}>
              智能运营中心
            </Title>
            <Text type="secondary" style={{ fontSize: isMobile ? '14px' : '16px' }}>
              实时洞察业务运营数据，智能驱动决策优化
            </Text>
          </div>
          {isMobile && (
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              onClick={() => setDrawerVisible(true)}
              size="large"
            />
          )}
        </div>
        
        {/* 桌面端按钮组 */}
        {!isMobile && (
          <div style={{ marginTop: '16px' }}>
            <Space>
              <Button 
                type={viewMode === 'overview' ? 'primary' : 'default'}
                onClick={() => setViewMode('overview')}
                icon={<BarChartOutlined />}
              >
                数据概览
              </Button>
              <Button 
                type={viewMode === 'projects' ? 'primary' : 'default'}
                onClick={() => setViewMode('projects')}
                icon={<ProjectOutlined />}
              >
                项目管理
              </Button>
              <Button 
                type={viewMode === 'team' ? 'primary' : 'default'}
                onClick={() => setViewMode('team')}
                icon={<TeamOutlined />}
              >
                团队效能
              </Button>
            </Space>
          </div>
        )}
      </div>

      {/* 移动端操作按钮 */}
      {isMobile && (
        <MobileActionBar 
          actions={mobileActions} 
          layout="horizontal" 
          fixed={false}
        />
      )}

      {/* 智能指标看板 */}
      {isMobile ? (
        <MobileGrid gutter={[8, 8]} cols={{ xs: 12, sm: 12 }}>
          {enterpriseMetrics.map((metric) => (
            <MobileStatCard
              key={metric.key}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              change={metric.change}
              trend={metric.trend as 'up' | 'down'}
              description={metric.description}
            />
          ))}
        </MobileGrid>
      ) : (
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          {enterpriseMetrics.map((metric) => (
            <Col xs={24} sm={12} lg={6} key={metric.key}>
              <Card 
                style={{ 
                  borderRadius: '12px', 
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: '#fff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      {metric.icon}
                      <Text type="secondary" style={{ marginLeft: '8px', fontSize: '14px' }}>
                        {metric.title}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
                      <Text style={{ fontSize: '32px', fontWeight: 600, color: '#262626' }}>
                        {metric.value}
                      </Text>
                      <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                        {metric.trend === 'up' ? (
                          <RiseOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                        ) : (
                          <FallOutlined style={{ color: '#f5222d', fontSize: '16px' }} />
                        )}
                        <Text 
                          style={{ 
                            marginLeft: '4px',
                            color: metric.trend === 'up' ? '#52c41a' : '#f5222d',
                            fontSize: '14px',
                            fontWeight: 500
                          }}
                        >
                          {metric.change}
                        </Text>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {metric.description}
                    </Text>
                    <Progress 
                      percent={Math.round((metric.value / metric.target) * 100)} 
                      size="small" 
                      showInfo={false}
                      strokeColor={metric.color}
                      style={{ marginTop: '8px' }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 核心数据可视化 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <PieChartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                  项目效能概览
                </span>
                <Button type="text" icon={<EyeOutlined />} size="small">
                  详情
                </Button>
              </div>
            }
            style={{ 
              borderRadius: '12px', 
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts option={performanceChartOption} style={{ height: '320px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <LineChartOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                  团队效率趋势
                </span>
                <Space>
                  <Button 
                    type={timeframe === 'today' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeframe('today')}
                  >
                    今日
                  </Button>
                  <Button 
                    type={timeframe === 'week' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeframe('week')}
                  >
                    本周
                  </Button>
                  <Button 
                    type={timeframe === 'month' ? 'primary' : 'text'} 
                    size="small"
                    onClick={() => setTimeframe('month')}
                  >
                    本月
                  </Button>
                </Space>
              </div>
            }
            style={{ 
              borderRadius: '12px', 
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <ReactECharts option={efficiencyTrendOption} style={{ height: '320px' }} />
          </Card>
        </Col>
      </Row>

      {/* 数据表格与智能洞察 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <FileTextOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />
                  项目执行看板
                </span>
                <Button type="primary" size="small">
                  创建项目
                </Button>
              </div>
            }
            style={{ 
              borderRadius: '12px', 
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Table 
              dataSource={projectData} 
              columns={projectColumns} 
              pagination={{ pageSize: 5, size: 'small' }}
              size="middle"
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <ThunderboltOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                  智能洞察
                </span>
                <Badge count={insights.length} size="small">
                  <BellOutlined style={{ fontSize: '16px', color: '#666' }} />
                </Badge>
              </div>
            }
            style={{ 
              borderRadius: '12px', 
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <List
              dataSource={insights}
              renderItem={(item) => (
                <List.Item style={{ border: 'none', paddingLeft: 0, paddingRight: 0 }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: item.priority === 'high' ? '#fff2e8' : 
                                         item.priority === 'medium' ? '#fff7e6' : '#f6ffed',
                          border: 'none'
                        }}
                        icon={item.icon}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: '14px' }}>
                          {item.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.time}
                        </Text>
                      </div>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        {item.description}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 移动端筛选抽屉 */}
      <MobileDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        title="操作面板"
        placement="right"
      >
        {renderMobileFilters()}
      </MobileDrawer>
    </MobileContainer>
  );
};

export default DashboardPage;