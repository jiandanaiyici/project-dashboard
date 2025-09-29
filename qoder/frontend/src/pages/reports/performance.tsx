import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Button,
  DatePicker,
  Select,
  Space,
  Tooltip,
  Alert,
  List,
  Avatar,
  Badge,
} from 'antd';
import {
  TrophyOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BarChartOutlined,
  DashboardOutlined,
  DownloadOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface PerformanceMetrics {
  efficiency: number;
  quality: number;
  velocity: number;
  satisfaction: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
  tasksCompleted: number;
  efficiency: number;
  quality: number;
  workHours: number;
}

interface ProjectPerformance {
  id: string;
  name: string;
  efficiency: number;
  quality: number;
  onTimeDelivery: number;
  budgetUsage: number;
  status: string;
}

const PerformancePage: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('efficiency');

  // 性能指标数据
  const metrics: PerformanceMetrics = {
    efficiency: 85,
    quality: 92,
    velocity: 78,
    satisfaction: 89,
  };

  // 团队成员表现数据
  const teamPerformance: TeamMember[] = [
    {
      id: '1',
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      department: '技术部',
      tasksCompleted: 24,
      efficiency: 92,
      quality: 88,
      workHours: 160,
    },
    {
      id: '2',
      name: '李四',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      department: '技术部',
      tasksCompleted: 18,
      efficiency: 85,
      quality: 95,
      workHours: 155,
    },
    {
      id: '3',
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      department: '产品部',
      tasksCompleted: 15,
      efficiency: 78,
      quality: 90,
      workHours: 148,
    },
    {
      id: '4',
      name: '赵六',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      department: '设计部',
      tasksCompleted: 12,
      efficiency: 88,
      quality: 93,
      workHours: 152,
    },
  ];

  // 项目表现数据
  const projectPerformance: ProjectPerformance[] = [
    {
      id: '1',
      name: '项目管理平台',
      efficiency: 88,
      quality: 92,
      onTimeDelivery: 95,
      budgetUsage: 85,
      status: 'in_progress',
    },
    {
      id: '2',
      name: '移动端应用',
      efficiency: 75,
      quality: 87,
      onTimeDelivery: 70,
      budgetUsage: 90,
      status: 'in_progress',
    },
    {
      id: '3',
      name: 'API重构',
      efficiency: 92,
      quality: 95,
      onTimeDelivery: 100,
      budgetUsage: 78,
      status: 'completed',
    },
  ];

  // 效率趋势图
  const efficiencyTrendOption = {
    title: {
      text: '团队效率趋势',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']
    },
    yAxis: {
      type: 'value',
      name: '效率分数',
      min: 0,
      max: 100
    },
    series: [
      {
        name: '团队效率',
        type: 'line',
        data: [78, 82, 85, 88, 85, 90, 87, 92, 89],
        smooth: true,
        itemStyle: { color: '#1890ff' },
        areaStyle: { color: 'rgba(24, 144, 255, 0.2)' }
      }
    ]
  };

  // 部门对比图
  const departmentComparisonOption = {
    title: {
      text: '部门绩效对比',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['效率', '质量', '按时交付'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['技术部', '产品部', '设计部', '测试部']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: '效率',
        type: 'bar',
        data: [88, 85, 92, 78],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '质量',
        type: 'bar',
        data: [92, 88, 95, 85],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '按时交付',
        type: 'bar',
        data: [85, 90, 88, 82],
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  // 工作量分布图
  const workloadDistributionOption = {
    title: {
      text: '工作量分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}小时 ({d}%)'
    },
    series: [
      {
        name: '工作量',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 320, name: '开发', itemStyle: { color: '#1890ff' } },
          { value: 180, name: '测试', itemStyle: { color: '#52c41a' } },
          { value: 120, name: '设计', itemStyle: { color: '#faad14' } },
          { value: 80, name: '文档', itemStyle: { color: '#722ed1' } },
          { value: 60, name: '会议', itemStyle: { color: '#eb2f96' } },
        ]
      }
    ]
  };

  // 团队成员表格列
  const memberColumns = [
    {
      title: '成员',
      key: 'member',
      render: (record: TeamMember) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.department}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '完成任务',
      dataIndex: 'tasksCompleted',
      key: 'tasksCompleted',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <div>
          <Progress 
            percent={efficiency} 
            size="small" 
            strokeColor={efficiency > 85 ? '#52c41a' : efficiency > 70 ? '#1890ff' : '#faad14'}
            showInfo={false}
          />
          <span style={{ fontSize: '12px', marginLeft: '8px' }}>{efficiency}%</span>
        </div>
      ),
    },
    {
      title: '质量分',
      dataIndex: 'quality',
      key: 'quality',
      render: (quality: number) => (
        <Tag color={quality > 90 ? 'green' : quality > 80 ? 'blue' : 'orange'}>
          {quality}分
        </Tag>
      ),
    },
    {
      title: '工时',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (hours: number) => `${hours}h`,
    },
  ];

  // 项目表现表格列
  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '效率指数',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <Tooltip title="基于任务完成速度和质量综合计算">
          <Progress 
            percent={efficiency} 
            size="small"
            strokeColor={efficiency > 80 ? '#52c41a' : '#1890ff'}
          />
        </Tooltip>
      ),
    },
    {
      title: '质量分数',
      dataIndex: 'quality',
      key: 'quality',
      render: (quality: number) => (
        <Tag color={quality > 90 ? 'green' : quality > 80 ? 'blue' : 'orange'}>
          {quality}分
        </Tag>
      ),
    },
    {
      title: '按时交付',
      dataIndex: 'onTimeDelivery',
      key: 'onTimeDelivery',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: '预算使用',
      dataIndex: 'budgetUsage',
      key: 'budgetUsage',
      render: (usage: number) => (
        <span style={{ color: usage > 90 ? '#ff4d4f' : usage > 80 ? '#faad14' : '#52c41a' }}>
          {usage}%
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          'in_progress': { color: 'processing', text: '进行中' },
          'completed': { color: 'success', text: '已完成' },
          'on_hold': { color: 'warning', text: '暂停' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  const getMetricColor = (value: number) => {
    if (value >= 90) return '#52c41a';
    if (value >= 80) return '#1890ff';
    if (value >= 70) return '#faad14';
    return '#ff4d4f';
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2 style={{ margin: 0 }}>性能分析</h2>
          </Col>
          <Col>
            <Space>
              <Select
                value={selectedMetric}
                onChange={setSelectedMetric}
                style={{ width: 120 }}
              >
                <Option value="efficiency">效率</Option>
                <Option value="quality">质量</Option>
                <Option value="velocity">速度</Option>
                <Option value="satisfaction">满意度</Option>
              </Select>
              <Select
                value={dateRange}
                onChange={setDateRange}
                style={{ width: 120 }}
              >
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="quarter">本季度</Option>
                <Option value="year">本年</Option>
              </Select>
              <Button icon={<DownloadOutlined />}>导出分析</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="团队效率"
              value={metrics.efficiency}
              suffix="%"
              prefix={<RocketOutlined />}
              valueStyle={{ color: getMetricColor(metrics.efficiency) }}
            />
            <Progress 
              percent={metrics.efficiency} 
              strokeColor={getMetricColor(metrics.efficiency)}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="质量指数"
              value={metrics.quality}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getMetricColor(metrics.quality) }}
            />
            <Progress 
              percent={metrics.quality} 
              strokeColor={getMetricColor(metrics.quality)}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="交付速度"
              value={metrics.velocity}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: getMetricColor(metrics.velocity) }}
            />
            <Progress 
              percent={metrics.velocity} 
              strokeColor={getMetricColor(metrics.velocity)}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="满意度"
              value={metrics.satisfaction}
              suffix="%"
              prefix={<TeamOutlined />}
              valueStyle={{ color: getMetricColor(metrics.satisfaction) }}
            />
            <Progress 
              percent={metrics.satisfaction} 
              strokeColor={getMetricColor(metrics.satisfaction)}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 性能提醒 */}
      <Alert
        message="性能提示"
        description="本月团队整体表现良好，建议继续保持高质量交付。移动端项目需要关注进度。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* 图表分析 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={efficiencyTrendOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={departmentComparisonOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={workloadDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 详细数据表格 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="团队成员表现">
            <Table
              columns={memberColumns}
              dataSource={teamPerformance}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="项目表现排行">
            <Table
              columns={projectColumns}
              dataSource={projectPerformance}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 改进建议 */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="性能改进建议">
            <List
              size="small"
              dataSource={[
                {
                  title: '提升代码质量',
                  description: '建议加强代码审查流程，提高代码质量标准',
                  icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                },
                {
                  title: '优化工作流程',
                  description: '可以通过自动化工具减少重复性工作，提升效率',
                  icon: <RocketOutlined style={{ color: '#1890ff' }} />,
                },
                {
                  title: '团队培训',
                  description: '定期组织技术分享和培训，提升团队整体能力',
                  icon: <TeamOutlined style={{ color: '#722ed1' }} />,
                },
                {
                  title: '项目管理优化',
                  description: '加强项目计划和风险管控，提高按时交付率',
                  icon: <DashboardOutlined style={{ color: '#faad14' }} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformancePage;