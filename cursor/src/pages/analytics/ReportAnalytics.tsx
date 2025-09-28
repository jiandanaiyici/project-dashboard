import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Select,
  DatePicker,
  Tabs,
  List,
  Avatar,
  Progress,
  Badge
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined, 
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  FilterOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  const [overviewData, setOverviewData] = useState({
    totalProjects: 25,
    completedProjects: 18,
    activeUsers: 156,
    totalRevenue: 2500000,
    avgProjectDuration: 45,
    teamEfficiency: 85.2
  });

  const [projectPerformance, setProjectPerformance] = useState([
    {
      id: 1,
      name: '电商平台重构',
      status: 'completed',
      progress: 100,
      duration: 90,
      budget: 500000,
      actualCost: 480000,
      teamSize: 8,
      qualityScore: 4.5,
      efficiency: 92
    },
    {
      id: 2,
      name: '移动端应用开发',
      status: 'in_progress',
      progress: 75,
      duration: 60,
      budget: 300000,
      actualCost: 225000,
      teamSize: 6,
      qualityScore: 4.2,
      efficiency: 88
    },
    {
      id: 3,
      name: '数据分析平台',
      status: 'completed',
      progress: 100,
      duration: 45,
      budget: 200000,
      actualCost: 195000,
      teamSize: 5,
      qualityScore: 4.8,
      efficiency: 95
    }
  ]);

  const [teamEfficiency, setTeamEfficiency] = useState([
    {
      id: 1,
      name: '张三',
      role: '项目经理',
      projects: 3,
      completedTasks: 45,
      totalTasks: 50,
      efficiency: 90,
      qualityScore: 4.5
    },
    {
      id: 2,
      name: '李四',
      role: '技术负责人',
      projects: 2,
      completedTasks: 38,
      totalTasks: 40,
      efficiency: 95,
      qualityScore: 4.8
    },
    {
      id: 3,
      name: '王五',
      role: '前端开发',
      projects: 4,
      completedTasks: 52,
      totalTasks: 60,
      efficiency: 87,
      qualityScore: 4.2
    }
  ]);

  const [revenueData, setRevenueData] = useState([
    { date: '2024-01-01', value: 200000, category: '收入' },
    { date: '2024-01-02', value: 220000, category: '收入' },
    { date: '2024-01-03', value: 180000, category: '收入' },
    { date: '2024-01-04', value: 250000, category: '收入' },
    { date: '2024-01-05', value: 300000, category: '收入' },
    { date: '2024-01-01', value: 150000, category: '成本' },
    { date: '2024-01-02', value: 160000, category: '成本' },
    { date: '2024-01-03', value: 140000, category: '成本' },
    { date: '2024-01-04', value: 170000, category: '成本' },
    { date: '2024-01-05', value: 180000, category: '成本' }
  ]);

  const [projectDistribution, setProjectDistribution] = useState([
    { name: '已完成', value: 18, color: '#52c41a' },
    { name: '进行中', value: 5, color: '#1890ff' },
    { name: '计划中', value: 2, color: '#faad14' }
  ]);

  const [qualityMetrics, setQualityMetrics] = useState([
    { name: '代码质量', value: 4.3, max: 5, unit: '分' },
    { name: '测试覆盖率', value: 85.2, max: 100, unit: '%' },
    { name: '用户满意度', value: 4.5, max: 5, unit: '分' },
    { name: '交付及时率', value: 92.1, max: 100, unit: '%' }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: 'green', text: '已完成' },
      in_progress: { color: 'blue', text: '进行中' },
      planning: { color: 'orange', text: '计划中' },
      cancelled: { color: 'red', text: '已取消' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      )
    },
    {
      title: '工期(天)',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '预算使用',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number, record: any) => {
        const usage = (record.actualCost / budget * 100).toFixed(1);
        return (
          <div>
            <div>¥{record.actualCost.toLocaleString()} / ¥{budget.toLocaleString()}</div>
            <Progress percent={parseFloat(usage)} size="small" />
          </div>
        );
      }
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score: number) => (
        <Badge count={score} style={{ backgroundColor: score >= 4.5 ? '#52c41a' : '#faad14' }} />
      )
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <div>
          <Progress percent={efficiency} size="small" />
          <div style={{ fontSize: 12, color: '#666' }}>{efficiency}%</div>
        </div>
      )
    }
  ];

  const teamColumns = [
    {
      title: '成员',
      key: 'member',
      render: (record: any) => (
        <Space>
          <Avatar icon={<BarChartOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.role}</div>
          </div>
        </Space>
      )
    },
    {
      title: '项目数',
      dataIndex: 'projects',
      key: 'projects',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: '任务完成率',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
      render: (completed: number, record: any) => {
        const rate = (completed / record.totalTasks * 100).toFixed(1);
        return (
          <div>
            <div>{completed}/{record.totalTasks}</div>
            <Progress percent={parseFloat(rate)} size="small" />
          </div>
        );
      }
    },
    {
      title: '效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <div>
          <Progress percent={efficiency} size="small" />
          <div style={{ fontSize: 12, color: '#666' }}>{efficiency}%</div>
        </div>
      )
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score: number) => (
        <Badge count={score} style={{ backgroundColor: score >= 4.5 ? '#52c41a' : '#faad14' }} />
      )
    }
  ];

  const handleExport = (format: string) => {
    console.log(`导出${format}格式报表`);
  };

  return (
    <div className="report-analytics">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="7d">最近7天</Option>
              <Option value="30d">最近30天</Option>
              <Option value="90d">最近90天</Option>
              <Option value="1y">最近1年</Option>
            </Select>
            <RangePicker />
            <Button icon={<FilterOutlined />}>筛选</Button>
          </Space>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={() => handleExport('excel')}>
              导出Excel
            </Button>
            <Button icon={<PrinterOutlined />} onClick={() => handleExport('pdf')}>
              打印PDF
            </Button>
            <Button icon={<ShareAltOutlined />} onClick={() => handleExport('share')}>
              分享
            </Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="overview">
          <TabPane tab="概览报表" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总项目数"
                    value={overviewData.totalProjects}
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已完成项目"
                    value={overviewData.completedProjects}
                    prefix={<LineChartOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="活跃用户"
                    value={overviewData.activeUsers}
                    prefix={<PieChartOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总收入"
                    value={overviewData.totalRevenue}
                    prefix="¥"
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="项目分布" style={{ height: 400 }}>
                  <RingChart
                    data={projectDistribution}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="质量指标" style={{ height: 400 }}>
                  <GaugeChart
                    data={qualityMetrics}
                    height={300}
                    showMultiple={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="项目报表" key="projects">
            <Table
              columns={projectColumns}
              dataSource={projectPerformance}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="团队报表" key="team">
            <Table
              columns={teamColumns}
              dataSource={teamEfficiency}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="财务报表" key="finance">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="收入成本趋势">
                  <TrendChart
                    data={revenueData}
                    height={400}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Card title="收入分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      ¥{overviewData.totalRevenue.toLocaleString()}
                    </div>
                    <div style={{ color: '#666' }}>总收入</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="成本分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f5222d' }}>
                      ¥{(overviewData.totalRevenue * 0.7).toLocaleString()}
                    </div>
                    <div style={{ color: '#666' }}>总成本</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="利润率">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                      30%
                    </div>
                    <div style={{ color: '#666' }}>利润率</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="自定义报表" key="custom">
            <Card title="报表配置">
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                <div style={{ marginTop: 16, color: '#666' }}>
                  自定义报表功能开发中...
                </div>
                <Button type="primary" style={{ marginTop: 16 }}>
                  创建自定义报表
                </Button>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ReportAnalytics;
