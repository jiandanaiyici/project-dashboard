import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Alert,
  Tabs,
  Timeline,
  Badge,
  Tooltip,
  List,
  Avatar,
  Rate,
  Divider
} from 'antd';
import { 
  AppstoreOutlined, 
  BarChartOutlined, 
  UserOutlined, 
  HeartOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TrophyOutlined,
  BulbOutlined,
  SettingOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { TabPane } = Tabs;

const ProductManager: React.FC = () => {
  const [productStats, setProductStats] = useState({
    totalProducts: 8,
    activeProducts: 6,
    totalUsers: 125000,
    monthlyRevenue: 2500000,
    userGrowth: 15.2,
    conversionRate: 3.8
  });

  const [productList, setProductList] = useState([
    {
      id: 1,
      name: '电商平台',
      status: 'active',
      users: 45000,
      revenue: 1200000,
      growth: 12.5,
      satisfaction: 4.2,
      priority: 'high'
    },
    {
      id: 2,
      name: '移动应用',
      status: 'active',
      users: 35000,
      revenue: 800000,
      growth: 18.3,
      satisfaction: 4.5,
      priority: 'high'
    },
    {
      id: 3,
      name: '管理后台',
      status: 'active',
      users: 15000,
      revenue: 300000,
      growth: 8.7,
      satisfaction: 3.8,
      priority: 'medium'
    }
  ]);

  const [userFeedback, setUserFeedback] = useState([
    {
      id: 1,
      user: '用户A',
      product: '电商平台',
      rating: 5,
      comment: '界面设计很美观，功能完善',
      date: '2024-01-15'
    },
    {
      id: 2,
      user: '用户B',
      product: '移动应用',
      rating: 4,
      comment: '性能不错，但有些功能需要优化',
      date: '2024-01-14'
    },
    {
      id: 3,
      user: '用户C',
      product: '管理后台',
      rating: 3,
      comment: '功能齐全，但操作流程可以简化',
      date: '2024-01-13'
    }
  ]);

  const [marketAnalysis, setMarketAnalysis] = useState([
    { name: '市场份额', value: 15.2, max: 100, unit: '%' },
    { name: '用户满意度', value: 4.1, max: 5, unit: '分' },
    { name: '品牌认知度', value: 68.5, max: 100, unit: '%' },
    { name: '竞争优势', value: 7.8, max: 10, unit: '分' }
  ]);

  const [revenueTrend, setRevenueTrend] = useState([
    { date: '2024-01-01', value: 2200000, category: '收入' },
    { date: '2024-01-02', value: 2300000, category: '收入' },
    { date: '2024-01-03', value: 2400000, category: '收入' },
    { date: '2024-01-04', value: 2500000, category: '收入' },
    { date: '2024-01-05', value: 2600000, category: '收入' },
    { date: '2024-01-01', value: 120000, category: '用户增长' },
    { date: '2024-01-02', value: 135000, category: '用户增长' },
    { date: '2024-01-03', value: 142000, category: '用户增长' },
    { date: '2024-01-04', value: 158000, category: '用户增长' },
    { date: '2024-01-05', value: 165000, category: '用户增长' }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: '活跃' },
      inactive: { color: 'red', text: '停用' },
      development: { color: 'blue', text: '开发中' },
      testing: { color: 'orange', text: '测试中' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      high: { color: 'red', text: '高优先级' },
      medium: { color: 'orange', text: '中优先级' },
      low: { color: 'green', text: '低优先级' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const productColumns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <AppstoreOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '用户数',
      dataIndex: 'users',
      key: 'users',
      render: (users: number) => (
        <Space>
          <UserOutlined />
          {users.toLocaleString()}
        </Space>
      )
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <Space>
          <DollarOutlined />
          ¥{revenue.toLocaleString()}
        </Space>
      )
    },
    {
      title: '增长率',
      dataIndex: 'growth',
      key: 'growth',
      render: (growth: number) => (
        <div style={{ color: growth > 0 ? '#52c41a' : '#f5222d' }}>
          {growth > 0 ? '+' : ''}{growth}%
        </div>
      )
    },
    {
      title: '满意度',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      render: (satisfaction: number) => (
        <Rate disabled defaultValue={satisfaction} />
      )
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => getPriorityTag(priority)
    }
  ];

  return (
    <div className="product-manager">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="产品概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总产品数"
                    value={productStats.totalProducts}
                    prefix={<AppstoreOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总用户数"
                    value={productStats.totalUsers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="月收入"
                    value={productStats.monthlyRevenue}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="用户增长率"
                    value={productStats.userGrowth}
                    suffix="%"
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="产品分布" style={{ height: 400 }}>
                  <RingChart
                    data={[
                      { name: '活跃产品', value: 6, color: '#52c41a' },
                      { name: '开发中', value: 1, color: '#1890ff' },
                      { name: '测试中', value: 1, color: '#faad14' }
                    ]}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="市场分析" style={{ height: 400 }}>
                  <GaugeChart
                    data={marketAnalysis}
                    height={300}
                    showMultiple={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="产品管理" key="products">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<AppstoreOutlined />}>
                  新建产品
                </Button>
                <Button icon={<BarChartOutlined />}>
                  产品分析
                </Button>
                <Button icon={<SettingOutlined />}>
                  产品配置
                </Button>
              </Space>
            </div>

            <Table
              columns={productColumns}
              dataSource={productList}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="用户反馈" key="feedback">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="最新反馈">
                  <List
                    dataSource={userFeedback}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <Space>
                              <span>{item.user}</span>
                              <Tag color="blue">{item.product}</Tag>
                            </Space>
                          }
                          description={
                            <div>
                              <div>{item.comment}</div>
                              <div style={{ marginTop: 8 }}>
                                <Rate disabled defaultValue={item.rating} />
                                <span style={{ marginLeft: 8, color: '#666' }}>
                                  {item.date}
                                </span>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="满意度趋势">
                  <TrendChart
                    data={[
                      { date: '2024-01-01', value: 4.0, category: '满意度' },
                      { date: '2024-01-02', value: 4.1, category: '满意度' },
                      { date: '2024-01-03', value: 4.2, category: '满意度' },
                      { date: '2024-01-04', value: 4.0, category: '满意度' },
                      { date: '2024-01-05', value: 4.3, category: '满意度' }
                    ]}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="收入分析" key="revenue">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="收入趋势">
                  <TrendChart
                    data={revenueTrend}
                    height={400}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={8}>
                <Card title="收入来源">
                  <RingChart
                    data={[
                      { name: '电商平台', value: 1200000, color: '#52c41a' },
                      { name: '移动应用', value: 800000, color: '#1890ff' },
                      { name: '管理后台', value: 300000, color: '#faad14' },
                      { name: '其他', value: 200000, color: '#722ed1' }
                    ]}
                    height={200}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="转化率">
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={productStats.conversionRate * 10}
                      format={percent => `${productStats.conversionRate}%`}
                      size={120}
                    />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="关键指标">
                  <div style={{ textAlign: 'center' }}>
                    <Statistic
                      title="ARPU"
                      value={productStats.monthlyRevenue / productStats.totalUsers}
                      precision={2}
                      prefix="¥"
                    />
                    <Divider />
                    <Statistic
                      title="LTV"
                      value={productStats.monthlyRevenue / productStats.totalUsers * 12}
                      precision={2}
                      prefix="¥"
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="产品路线图" key="roadmap">
            <Timeline>
              <Timeline.Item color="green">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>电商平台 v3.0</h4>
                      <p>预计发布时间: 2024-03-01</p>
                      <p>主要功能: 智能推荐、AR试穿、社交购物</p>
                    </div>
                    <Tag color="green">开发中</Tag>
                  </div>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>移动应用 v2.5</h4>
                      <p>预计发布时间: 2024-02-15</p>
                      <p>主要功能: 离线模式、语音搜索、个性化首页</p>
                    </div>
                    <Tag color="blue">设计阶段</Tag>
                  </div>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>管理后台 v1.8</h4>
                      <p>预计发布时间: 2024-02-01</p>
                      <p>主要功能: 数据可视化、权限管理、自动化运维</p>
                    </div>
                    <Tag color="orange">规划中</Tag>
                  </div>
                </Card>
              </Timeline.Item>
            </Timeline>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductManager;
