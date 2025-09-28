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
  Tooltip
} from 'antd';
import { 
  RocketOutlined, 
  BugOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  WarningOutlined,
  DeploymentUnitOutlined,
  CodeOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { TabPane } = Tabs;

const DeliveryManager: React.FC = () => {
  const [deliveryStats, setDeliveryStats] = useState({
    totalDeployments: 156,
    successRate: 98.5,
    avgDeployTime: 12.5,
    rollbackRate: 1.2,
    codeQuality: 4.2,
    testCoverage: 87.3
  });

  const [recentDeployments, setRecentDeployments] = useState([
    {
      id: 1,
      application: '用户管理系统',
      version: 'v2.1.3',
      status: 'success',
      deployTime: '2024-01-15 14:30:00',
      duration: '8分钟',
      environment: 'production',
      deployer: '张三'
    },
    {
      id: 2,
      application: '订单处理系统',
      version: 'v1.8.2',
      status: 'success',
      deployTime: '2024-01-15 10:15:00',
      duration: '12分钟',
      environment: 'production',
      deployer: '李四'
    },
    {
      id: 3,
      application: '支付网关',
      version: 'v3.0.1',
      status: 'failed',
      deployTime: '2024-01-14 16:45:00',
      duration: '3分钟',
      environment: 'production',
      deployer: '王五'
    }
  ]);

  const [qualityMetrics, setQualityMetrics] = useState([
    { name: '代码质量', value: 4.2, max: 5, unit: '分' },
    { name: '测试覆盖率', value: 87.3, max: 100, unit: '%' },
    { name: '性能评分', value: 4.5, max: 5, unit: '分' },
    { name: '安全评分', value: 4.8, max: 5, unit: '分' }
  ]);

  const [deploymentTrend, setDeploymentTrend] = useState([
    { date: '2024-01-01', value: 8, category: '成功部署' },
    { date: '2024-01-02', value: 12, category: '成功部署' },
    { date: '2024-01-03', value: 6, category: '成功部署' },
    { date: '2024-01-04', value: 15, category: '成功部署' },
    { date: '2024-01-05', value: 9, category: '成功部署' },
    { date: '2024-01-01', value: 1, category: '失败部署' },
    { date: '2024-01-02', value: 0, category: '失败部署' },
    { date: '2024-01-03', value: 1, category: '失败部署' },
    { date: '2024-01-04', value: 0, category: '失败部署' },
    { date: '2024-01-05', value: 1, category: '失败部署' }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      success: { color: 'green', text: '成功' },
      failed: { color: 'red', text: '失败' },
      pending: { color: 'blue', text: '进行中' },
      rollback: { color: 'orange', text: '回滚' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getEnvironmentTag = (env: string) => {
    const envConfig = {
      production: { color: 'red', text: '生产环境' },
      staging: { color: 'orange', text: '预发布' },
      development: { color: 'blue', text: '开发环境' }
    };
    const config = envConfig[env as keyof typeof envConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const deploymentColumns = [
    {
      title: '应用名称',
      dataIndex: 'application',
      key: 'application',
      render: (text: string) => (
        <Space>
          <DeploymentUnitOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => (
        <Tag color="blue">{version}</Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      render: (env: string) => getEnvironmentTag(env)
    },
    {
      title: '部署时间',
      dataIndex: 'deployTime',
      key: 'deployTime'
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: string) => (
        <Space>
          <ClockCircleOutlined />
          {duration}
        </Space>
      )
    },
    {
      title: '部署人',
      dataIndex: 'deployer',
      key: 'deployer'
    }
  ];

  return (
    <div className="delivery-manager">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="交付概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总部署次数"
                    value={deliveryStats.totalDeployments}
                    prefix={<RocketOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="部署成功率"
                    value={deliveryStats.successRate}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均部署时间"
                    value={deliveryStats.avgDeployTime}
                    suffix="分钟"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="回滚率"
                    value={deliveryStats.rollbackRate}
                    suffix="%"
                    prefix={<WarningOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="质量指标" style={{ height: 400 }}>
                  <GaugeChart
                    data={qualityMetrics}
                    height={300}
                    showMultiple={true}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="部署趋势" style={{ height: 400 }}>
                  <TrendChart
                    data={deploymentTrend}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="部署记录" key="deployments">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<RocketOutlined />}>
                  新建部署
                </Button>
                <Button icon={<CodeOutlined />}>
                  代码检查
                </Button>
                <Button icon={<ExperimentOutlined />}>
                  运行测试
                </Button>
              </Space>
            </div>

            <Table
              columns={deploymentColumns}
              dataSource={recentDeployments}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="质量管控" key="quality">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="代码质量">
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Progress
                      type="circle"
                      percent={Math.round(deliveryStats.codeQuality * 20)}
                      format={percent => `${deliveryStats.codeQuality}/5.0`}
                      size={120}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Badge count="优秀" style={{ backgroundColor: '#52c41a' }} />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="测试覆盖率">
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Progress
                      type="circle"
                      percent={deliveryStats.testCoverage}
                      format={percent => `${deliveryStats.testCoverage}%`}
                      size={120}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Badge count="良好" style={{ backgroundColor: '#1890ff' }} />
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="性能指标">
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Progress
                      type="circle"
                      percent={90}
                      format={percent => `90%`}
                      size={120}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Badge count="优秀" style={{ backgroundColor: '#52c41a' }} />
                  </div>
                </Card>
              </Col>
            </Row>

            <Card title="质量趋势" style={{ marginTop: 16 }}>
              <TrendChart
                data={[
                  { date: '2024-01-01', value: 4.1, category: '代码质量' },
                  { date: '2024-01-02', value: 4.2, category: '代码质量' },
                  { date: '2024-01-03', value: 4.0, category: '代码质量' },
                  { date: '2024-01-04', value: 4.3, category: '代码质量' },
                  { date: '2024-01-05', value: 4.2, category: '代码质量' },
                  { date: '2024-01-01', value: 85, category: '测试覆盖率' },
                  { date: '2024-01-02', value: 86, category: '测试覆盖率' },
                  { date: '2024-01-03', value: 87, category: '测试覆盖率' },
                  { date: '2024-01-04', value: 88, category: '测试覆盖率' },
                  { date: '2024-01-05', value: 87, category: '测试覆盖率' }
                ]}
                height={300}
                seriesField="category"
                showArea={true}
              />
            </Card>
          </TabPane>

          <TabPane tab="发布计划" key="release">
            <Timeline>
              <Timeline.Item color="green">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>用户管理系统 v2.2.0</h4>
                      <p>计划发布时间: 2024-01-20 14:00</p>
                      <p>负责人: 张三</p>
                    </div>
                    <Tag color="green">已准备就绪</Tag>
                  </div>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="blue">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>订单处理系统 v1.9.0</h4>
                      <p>计划发布时间: 2024-01-22 10:00</p>
                      <p>负责人: 李四</p>
                    </div>
                    <Tag color="blue">测试中</Tag>
                  </div>
                </Card>
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>支付网关 v3.1.0</h4>
                      <p>计划发布时间: 2024-01-25 16:00</p>
                      <p>负责人: 王五</p>
                    </div>
                    <Tag color="orange">开发中</Tag>
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

export default DeliveryManager;
