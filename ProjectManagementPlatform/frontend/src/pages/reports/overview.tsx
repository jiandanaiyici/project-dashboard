import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Table,
  Progress,
  Tag,
  Button,
  Space,
  Alert,
  List,
  Timeline,
  Tooltip,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ProjectOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OverviewData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalUsers: number;
  activeUsers: number;
  overdueTasks: number;
}

interface ProjectProgress {
  id: string;
  name: string;
  progress: number;
  status: string;
  manager: string;
  endDate: string;
  taskCount: number;
  completedTasks: number;
}

const OverviewPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('month');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // 模拟数据
  const overviewData: OverviewData = {
    totalProjects: 25,
    activeProjects: 18,
    completedProjects: 7,
    totalTasks: 156,
    completedTasks: 89,
    totalUsers: 45,
    activeUsers: 38,
    overdueTasks: 12,
  };

  const projectProgressData: ProjectProgress[] = [
    {
      id: '1',
      name: '项目管理平台',
      progress: 75,
      status: 'in_progress',
      manager: '张三',
      endDate: '2024-12-31',
      taskCount: 28,
      completedTasks: 21,
    },
    {
      id: '2',
      name: '移动端应用',
      progress: 45,
      status: 'in_progress',
      manager: '李四',
      endDate: '2024-11-30',
      taskCount: 20,
      completedTasks: 9,
    },
    {
      id: '3',
      name: 'API重构',
      progress: 90,
      status: 'in_progress',
      manager: '王五',
      endDate: '2024-10-15',
      taskCount: 15,
      completedTasks: 13,
    },
  ];

  // 项目状态分布图
  const projectStatusOption = {
    title: {
      text: '项目状态分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 7, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: 18, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: 3, name: '暂停', itemStyle: { color: '#faad14' } },
          { value: 2, name: '计划中', itemStyle: { color: '#d9d9d9' } },
        ]
      }
    ]
  };

  // 任务完成趋势图
  const taskTrendOption = {
    title: {
      text: '任务完成趋势',
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
      name: '任务数'
    },
    series: [
      {
        name: '新增任务',
        type: 'line',
        data: [12, 18, 15, 22, 28, 25, 30, 35, 20],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '完成任务',
        type: 'line',
        data: [8, 16, 12, 20, 24, 22, 28, 32, 18],
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  // 团队工作量分布图
  const workloadOption = {
    title: {
      text: '团队工作量分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['技术部', '产品部', '设计部', '测试部', '运营部']
    },
    yAxis: {
      type: 'value',
      name: '任务数'
    },
    series: [
      {
        name: '进行中',
        type: 'bar',
        stack: 'total',
        data: [15, 8, 6, 10, 5],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: [25, 12, 10, 18, 8],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '待开始',
        type: 'bar',
        stack: 'total',
        data: [8, 5, 4, 6, 3],
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  // 项目进度表格列
  const progressColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small"
          strokeColor={progress > 70 ? '#52c41a' : progress > 40 ? '#1890ff' : '#faad14'}
        />
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
          'planning': { color: 'default', text: '计划中' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '项目经理',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '任务进度',
      key: 'taskProgress',
      render: (record: ProjectProgress) => (
        <span>{record.completedTasks}/{record.taskCount}</span>
      ),
    },
    {
      title: '截止时间',
      dataIndex: 'endDate',
      key: 'endDate',
    },
  ];

  const calculateCompletionRate = () => {
    return Math.round((overviewData.completedTasks / overviewData.totalTasks) * 100);
  };

  const calculateProjectCompletionRate = () => {
    return Math.round((overviewData.completedProjects / overviewData.totalProjects) * 100);
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2 style={{ margin: 0 }}>数据概览</h2>
          </Col>
          <Col>
            <Space>
              <Select
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                style={{ width: 120 }}
              >
                <Option value="all">全部部门</Option>
                <Option value="tech">技术部</Option>
                <Option value="product">产品部</Option>
                <Option value="design">设计部</Option>
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
              <Button icon={<DownloadOutlined />}>导出报表</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总项目数"
              value={overviewData.totalProjects}
              prefix={<ProjectOutlined />}
              suffix="个"
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#52c41a', fontSize: '12px' }}>
                <ArrowUpOutlined /> 完成率 {calculateProjectCompletionRate()}%
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃项目"
              value={overviewData.activeProjects}
              prefix={<ExclamationCircleOutlined />}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#1890ff', fontSize: '12px' }}>
                进行中 {overviewData.activeProjects} 个
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={overviewData.totalTasks}
              prefix={<CheckCircleOutlined />}
              suffix="个"
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#52c41a', fontSize: '12px' }}>
                <ArrowUpOutlined /> 完成率 {calculateCompletionRate()}%
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={overviewData.totalUsers}
              prefix={<TeamOutlined />}
              suffix="人"
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#722ed1', fontSize: '12px' }}>
                活跃 {overviewData.activeUsers} 人
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 告警信息 */}
      {overviewData.overdueTasks > 0 && (
        <Alert
          message="注意"
          description={`当前有 ${overviewData.overdueTasks} 个任务已逾期，请及时处理`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" type="primary">
              查看详情
            </Button>
          }
        />
      )}

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={projectStatusOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={taskTrendOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <ReactECharts option={workloadOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 项目进度和最新动态 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="项目进度概览">
            <Table
              columns={progressColumns}
              dataSource={projectProgressData}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="最新动态">
            <Timeline size="small">
              <Timeline.Item color="green">
                <div>
                  <div style={{ fontWeight: 'bold' }}>项目发布成功</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    项目管理平台 v1.0 发布成功
                  </div>
                  <div style={{ color: '#999', fontSize: '11px' }}>2小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <div>
                  <div style={{ fontWeight: 'bold' }}>任务完成</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    张三完成了"用户登录模块"开发
                  </div>
                  <div style={{ color: '#999', fontSize: '11px' }}>4小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item color="red">
                <div>
                  <div style={{ fontWeight: 'bold' }}>风险提醒</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    移动端项目进度延迟，需要关注
                  </div>
                  <div style={{ color: '#999', fontSize: '11px' }}>6小时前</div>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div>
                  <div style={{ fontWeight: 'bold' }}>新成员加入</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    李四加入了设计团队
                  </div>
                  <div style={{ color: '#999', fontSize: '11px' }}>1天前</div>
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* 快速统计 */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="快速统计">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <TrophyOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{overviewData.completedProjects}</div>
                  <div style={{ color: '#666' }}>已完成项目</div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <ClockCircleOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{overviewData.activeProjects}</div>
                  <div style={{ color: '#666' }}>进行中项目</div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <ExclamationCircleOutlined style={{ fontSize: '32px', color: '#ff4d4f', marginBottom: '8px' }} />
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{overviewData.overdueTasks}</div>
                  <div style={{ color: '#666' }}>逾期任务</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;