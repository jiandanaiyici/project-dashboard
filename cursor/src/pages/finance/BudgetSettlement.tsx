import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Statistic,
  Progress,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  message,
  Tabs,
  List,
  Badge
} from 'antd';
import { 
  DollarOutlined, 
  CalculatorOutlined, 
  FileTextOutlined,
  DownloadOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  WarningOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const BudgetSettlement: React.FC = () => {
  const [budgetData, setBudgetData] = useState([
    {
      id: 1,
      projectName: '电商平台重构',
      budget: 500000,
      actualCost: 480000,
      remaining: 20000,
      utilization: 96,
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      manager: '张三',
      department: '技术部'
    },
    {
      id: 2,
      projectName: '移动端应用开发',
      budget: 300000,
      actualCost: 225000,
      remaining: 75000,
      utilization: 75,
      status: 'in_progress',
      startDate: '2024-01-15',
      endDate: '2024-04-30',
      manager: '李四',
      department: '技术部'
    },
    {
      id: 3,
      projectName: '数据分析平台',
      budget: 200000,
      actualCost: 195000,
      remaining: 5000,
      utilization: 97.5,
      status: 'completed',
      startDate: '2023-11-01',
      endDate: '2024-01-31',
      manager: '王五',
      department: '数据部'
    }
  ]);

  const [costBreakdown, setCostBreakdown] = useState([
    { name: '人力成本', value: 1200000, color: '#1890ff' },
    { name: '设备成本', value: 300000, color: '#52c41a' },
    { name: '软件成本', value: 200000, color: '#faad14' },
    { name: '其他成本', value: 100000, color: '#722ed1' }
  ]);

  const [budgetTrend, setBudgetTrend] = useState([
    { date: '2024-01-01', value: 1000000, category: '预算' },
    { date: '2024-01-02', value: 950000, category: '预算' },
    { date: '2024-01-03', value: 900000, category: '预算' },
    { date: '2024-01-04', value: 850000, category: '预算' },
    { date: '2024-01-05', value: 800000, category: '预算' },
    { date: '2024-01-01', value: 200000, category: '实际支出' },
    { date: '2024-01-02', value: 350000, category: '实际支出' },
    { date: '2024-01-03', value: 500000, category: '实际支出' },
    { date: '2024-01-04', value: 650000, category: '实际支出' },
    { date: '2024-01-05', value: 800000, category: '实际支出' }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: '电商平台重构项目预算即将超支',
      project: '电商平台重构',
      severity: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: '移动端应用开发项目预算使用正常',
      project: '移动端应用开发',
      severity: 'low'
    }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: 'green', text: '已完成' },
      in_progress: { color: 'blue', text: '进行中' },
      planning: { color: 'orange', text: '规划中' },
      cancelled: { color: 'red', text: '已取消' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return '#f5222d';
    if (utilization >= 80) return '#faad14';
    return '#52c41a';
  };

  const budgetColumns = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => (
        <Space>
          <FileTextOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => (
        <Space>
          <DollarOutlined />
          ¥{budget.toLocaleString()}
        </Space>
      )
    },
    {
      title: '实际成本',
      dataIndex: 'actualCost',
      key: 'actualCost',
      render: (cost: number) => (
        <Space>
          <CalculatorOutlined />
          ¥{cost.toLocaleString()}
        </Space>
      )
    },
    {
      title: '剩余预算',
      dataIndex: 'remaining',
      key: 'remaining',
      render: (remaining: number) => (
        <div style={{ color: remaining > 0 ? '#52c41a' : '#f5222d' }}>
          ¥{remaining.toLocaleString()}
        </div>
      )
    },
    {
      title: '预算使用率',
      dataIndex: 'utilization',
      key: 'utilization',
      render: (utilization: number) => (
        <div>
          <Progress 
            percent={utilization} 
            size="small" 
            strokeColor={getUtilizationColor(utilization)}
          />
          <div style={{ fontSize: 12, color: '#666' }}>{utilization}%</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '项目经理',
      dataIndex: 'manager',
      key: 'manager'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      )
    }
  ];

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalActualCost = budgetData.reduce((sum, item) => sum + item.actualCost, 0);
  const totalRemaining = budgetData.reduce((sum, item) => sum + item.remaining, 0);
  const avgUtilization = budgetData.reduce((sum, item) => sum + item.utilization, 0) / budgetData.length;

  return (
    <div className="budget-settlement">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="预算概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总预算"
                    value={totalBudget}
                    prefix="¥"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="实际支出"
                    value={totalActualCost}
                    prefix="¥"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="剩余预算"
                    value={totalRemaining}
                    prefix="¥"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均使用率"
                    value={avgUtilization}
                    suffix="%"
                    valueStyle={{ color: getUtilizationColor(avgUtilization) }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="成本构成">
                  <RingChart
                    data={costBreakdown}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="预算趋势">
                  <TrendChart
                    data={budgetTrend}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="项目预算" key="projects">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  新建预算
                </Button>
                <Button icon={<DownloadOutlined />}>
                  导出报表
                </Button>
                <Select placeholder="选择部门" style={{ width: 120 }}>
                  <Option value="all">全部部门</Option>
                  <Option value="技术部">技术部</Option>
                  <Option value="数据部">数据部</Option>
                  <Option value="产品部">产品部</Option>
                </Select>
                <RangePicker />
              </Space>
            </div>

            <Table
              columns={budgetColumns}
              dataSource={budgetData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="成本分析" key="analysis">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="人力成本分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                      ¥1,200,000
                    </div>
                    <div style={{ color: '#666' }}>占总成本 66.7%</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="设备成本分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      ¥300,000
                    </div>
                    <div style={{ color: '#666' }}>占总成本 16.7%</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="软件成本分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                      ¥200,000
                    </div>
                    <div style={{ color: '#666' }}>占总成本 11.1%</div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="月度支出趋势">
                  <TrendChart
                    data={[
                      { date: '2024-01', value: 200000, category: '人力成本' },
                      { date: '2024-02', value: 250000, category: '人力成本' },
                      { date: '2024-03', value: 300000, category: '人力成本' },
                      { date: '2024-01', value: 50000, category: '设备成本' },
                      { date: '2024-02', value: 80000, category: '设备成本' },
                      { date: '2024-03', value: 100000, category: '设备成本' }
                    ]}
                    height={400}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="预算告警" key="alerts">
            <List
              dataSource={alerts}
              renderItem={(alert) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        count={alert.severity === 'high' ? '高' : '低'} 
                        style={{ 
                          backgroundColor: alert.severity === 'high' ? '#f5222d' : '#52c41a' 
                        }}
                      />
                    }
                    title={alert.message}
                    description={alert.project}
                  />
                  <div>
                    <Tag color={alert.type === 'warning' ? 'orange' : 'blue'}>
                      {alert.type === 'warning' ? '警告' : '信息'}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BudgetSettlement;
