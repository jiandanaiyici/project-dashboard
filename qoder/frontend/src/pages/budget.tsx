import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Form, 
  InputNumber,
  Statistic,
  Progress,
  Tabs,
  Space,
  Tooltip,
  message
} from 'antd';
import { 
  DollarOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExportOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { PageHeader, StatCard, DataTable } from '@/components';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

/**
 * 预算概览卡片
 */
const BudgetOverview: React.FC = () => {
  const budgetData = {
    totalBudget: 5000000,
    usedBudget: 3200000,
    remainingBudget: 1800000,
    overdueProjects: 3,
    onBudgetProjects: 12,
    overBudgetProjects: 2,
  };

  const usageRate = Math.round((budgetData.usedBudget / budgetData.totalBudget) * 100);

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <StatCard
          title="总预算"
          value={budgetData.totalBudget}
          formatter={(value: any) => `¥${((value as number) / 10000).toFixed(1)}万`}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="已使用预算"
          value={budgetData.usedBudget}
          formatter={(value: any) => `¥${((value as number) / 10000).toFixed(1)}万`}
          icon={<CheckCircleOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="剩余预算"
          value={budgetData.remainingBudget}
          formatter={(value: any) => `¥${((value as number) / 10000).toFixed(1)}万`}
          icon={<ExclamationCircleOutlined />}
        />
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="预算使用率"
            value={usageRate}
            suffix="%"
            valueStyle={{ color: usageRate > 80 ? '#ff4d4f' : '#52c41a' }}
          />
          <Progress 
            percent={usageRate} 
            strokeColor={usageRate > 80 ? '#ff4d4f' : '#52c41a'}
            style={{ marginTop: 8 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 预算趋势图表
 */
const BudgetTrendChart: React.FC = () => {
  const trendOption = {
    title: { text: '预算使用趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['预算', '实际支出', '预测支出'], bottom: 0 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: { type: 'value', name: '金额(万元)' },
    series: [
      {
        name: '预算',
        type: 'line',
        data: [400, 420, 450, 480, 500, 520, 550, 580, 600, 620, 650, 680],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '实际支出',
        type: 'line',
        data: [380, 410, 430, 470, 490, 510, 540, 570, 590, 610, 630, 0],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '预测支出',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 640, 670],
        itemStyle: { color: '#fa8c16' },
        lineStyle: { type: 'dashed' }
      }
    ]
  };

  return (
    <Card title="预算使用趋势">
      <ReactECharts option={trendOption} style={{ height: 400 }} />
    </Card>
  );
};

/**
 * 项目预算管理
 */
const ProjectBudgetManagement: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      render: (amount: number) => `¥${(amount / 10000).toFixed(2)}万`,
      sorter: (a: any, b: any) => a.budget - b.budget,
    },
    {
      title: '已使用',
      dataIndex: 'used',
      key: 'used',
      render: (amount: number) => `¥${(amount / 10000).toFixed(2)}万`,
      sorter: (a: any, b: any) => a.used - b.used,
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      key: 'usageRate',
      render: (rate: number, record: any) => {
        const usage = Math.round((record.used / record.budget) * 100);
        return (
          <div>
            <Progress 
              percent={usage} 
              size="small" 
              strokeColor={usage > 90 ? '#ff4d4f' : usage > 70 ? '#fa8c16' : '#52c41a'}
            />
            <span style={{ marginLeft: 8 }}>{usage}%</span>
          </div>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => {
        const usage = (record.used / record.budget) * 100;
        let color = 'green';
        let text = '正常';
        
        if (usage > 100) {
          color = 'red';
          text = '超预算';
        } else if (usage > 90) {
          color = 'orange';
          text = '预警';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const mockData = [
    {
      key: '1',
      name: 'ERP系统升级',
      budget: 1200000,
      used: 980000,
      manager: '张三',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
    },
    {
      key: '2',
      name: '移动APP开发',
      budget: 800000,
      used: 850000,
      manager: '李四',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
    },
    {
      key: '3',
      name: '数据分析平台',
      budget: 1500000,
      used: 750000,
      manager: '王五',
      startDate: '2024-03-01',
      endDate: '2024-12-31',
    },
  ];

  useEffect(() => {
    setProjects(mockData);
  }, []);

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingProject(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目"${record.name}"的预算信息吗？`,
      onOk() {
        message.success('删除成功');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values);
      setModalVisible(false);
      message.success(editingProject ? '更新成功' : '添加成功');
    });
  };

  return (
    <Card 
      title="项目预算管理"
      extra={
        <Space>
          <Button icon={<ExportOutlined />}>导出报表</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加预算
          </Button>
        </Space>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Search placeholder="搜索项目名称" allowClear />
          </Col>
          <Col span={4}>
            <Select placeholder="预算状态" allowClear style={{ width: '100%' }}>
              <Option value="normal">正常</Option>
              <Option value="warning">预警</Option>
              <Option value="over">超预算</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: '100%' }} />
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        loading={loading}
        pagination={{
          total: projects.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />

      <Modal
        title={editingProject ? '编辑项目预算' : '添加项目预算'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="manager"
                label="项目经理"
                rules={[{ required: true, message: '请选择项目经理' }]}
              >
                <Select placeholder="请选择项目经理">
                  <Option value="张三">张三</Option>
                  <Option value="李四">李四</Option>
                  <Option value="王五">王五</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算金额(元)"
                rules={[{ required: true, message: '请输入预算金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: any) => value!.replace(/\¥\s?|(,*)/g, '') as any}
                  placeholder="请输入预算金额"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="预算类别"
                rules={[{ required: true, message: '请选择预算类别' }]}
              >
                <Select placeholder="请选择预算类别">
                  <Option value="development">开发费用</Option>
                  <Option value="infrastructure">基础设施</Option>
                  <Option value="marketing">市场推广</Option>
                  <Option value="operation">运营维护</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="预算说明"
          >
            <Input.TextArea rows={3} placeholder="请输入预算说明" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

/**
 * 成本分析
 */
const CostAnalysis: React.FC = () => {
  // 成本分布饼图
  const costDistributionOption = {
    title: { text: '成本分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: '人力成本', itemStyle: { color: '#1890ff' } },
          { value: 25, name: '技术成本', itemStyle: { color: '#52c41a' } },
          { value: 20, name: '运营成本', itemStyle: { color: '#fa8c16' } },
          { value: 15, name: '营销成本', itemStyle: { color: '#722ed1' } },
          { value: 5, name: '其他成本', itemStyle: { color: '#eb2f96' } }
        ]
      }
    ]
  };

  // 月度成本对比
  const monthlyCostOption = {
    title: { text: '月度成本对比', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['预算成本', '实际成本'], bottom: 0 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', name: '成本(万元)' },
    series: [
      {
        name: '预算成本',
        type: 'bar',
        data: [120, 130, 140, 135, 145, 150],
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '实际成本',
        type: 'bar',
        data: [115, 125, 145, 140, 150, 155],
        itemStyle: { color: '#52c41a' }
      }
    ]
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="成本分布分析">
          <ReactECharts option={costDistributionOption} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="月度成本对比">
          <ReactECharts option={monthlyCostOption} style={{ height: 300 }} />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 财务报表
 */
const FinancialReport: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState<any>(null);

  const reportColumns = [
    { title: '项目', dataIndex: 'project', key: 'project' },
    { title: '预算', dataIndex: 'budget', key: 'budget' },
    { title: '实际支出', dataIndex: 'actual', key: 'actual' },
    { title: '差额', dataIndex: 'difference', key: 'difference' },
    { title: '完成度', dataIndex: 'completion', key: 'completion' },
  ];

  const reportData = [
    {
      key: '1',
      project: 'ERP系统升级',
      budget: '¥120万',
      actual: '¥98万',
      difference: '+¥22万',
      completion: '85%',
    },
    {
      key: '2',
      project: '移动APP开发',
      budget: '¥80万',
      actual: '¥85万',
      difference: '-¥5万',
      completion: '90%',
    },
  ];

  return (
    <Card 
      title="财务报表"
      extra={
        <Space>
          <Select value={reportType} onChange={setReportType} style={{ width: 120 }}>
            <Option value="monthly">月度报表</Option>
            <Option value="quarterly">季度报表</Option>
            <Option value="yearly">年度报表</Option>
          </Select>
          <RangePicker onChange={(dates: any) => setDateRange(dates)} />
          <Button icon={<ExportOutlined />}>导出报表</Button>
        </Space>
      }
    >
      <Table
        columns={reportColumns}
        dataSource={reportData}
        pagination={false}
        summary={(pageData) => {
          let totalBudget = 0;
          let totalActual = 0;
          
          pageData.forEach(({ budget, actual }) => {
            totalBudget += parseFloat(budget.replace(/[¥万]/g, ''));
            totalActual += parseFloat(actual.replace(/[¥万]/g, ''));
          });
          
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>¥{totalBudget}万</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>¥{totalActual}万</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                ¥{(totalBudget - totalActual).toFixed(1)}万
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </Card>
  );
};

/**
 * 项目预算结算主页面
 */
const BudgetManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="项目预算结算" />
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
      >
        <TabPane tab="预算概览" key="overview">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <BudgetOverview />
            <BudgetTrendChart />
          </Space>
        </TabPane>
        
        <TabPane tab="项目预算" key="projects">
          <ProjectBudgetManagement />
        </TabPane>
        
        <TabPane tab="成本分析" key="analysis">
          <CostAnalysis />
        </TabPane>
        
        <TabPane tab="财务报表" key="reports">
          <FinancialReport />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BudgetManagement;