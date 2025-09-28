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
  Switch,
  Input,
  Select,
  Form,
  Modal,
  message,
  Badge,
  Tooltip
} from 'antd';
import { 
  SettingOutlined, 
  DatabaseOutlined, 
  UserOutlined, 
  SecurityScanOutlined,
  MonitorOutlined,
  CloudOutlined,
  BellOutlined,
  ToolOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { TabPane } = Tabs;
const { Option } = Select;

const SystemAdmin: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45.2,
    memoryUsage: 68.5,
    diskUsage: 32.1,
    networkTraffic: 125.6,
    activeUsers: 156,
    totalRequests: 125000,
    errorRate: 0.12,
    uptime: 99.8
  });

  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      level: 'info',
      message: '系统启动成功',
      timestamp: '2024-01-15 14:30:00',
      module: 'system'
    },
    {
      id: 2,
      level: 'warning',
      message: '内存使用率超过70%',
      timestamp: '2024-01-15 14:25:00',
      module: 'monitor'
    },
    {
      id: 3,
      level: 'error',
      message: '数据库连接超时',
      timestamp: '2024-01-15 14:20:00',
      module: 'database'
    }
  ]);

  const [userList, setUserList] = useState([
    {
      id: 1,
      username: 'admin',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:00',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      username: 'product_manager',
      role: 'product_manager',
      status: 'active',
      lastLogin: '2024-01-15 14:25:00',
      ip: '192.168.1.101'
    },
    {
      id: 3,
      username: 'project_manager',
      role: 'project_manager',
      status: 'inactive',
      lastLogin: '2024-01-14 16:20:00',
      ip: '192.168.1.102'
    }
  ]);

  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    autoBackup: true,
    logLevel: 'info',
    maxUsers: 1000,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false
  });

  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getLevelTag = (level: string) => {
    const levelConfig = {
      info: { color: 'blue', text: '信息' },
      warning: { color: 'orange', text: '警告' },
      error: { color: 'red', text: '错误' },
      debug: { color: 'green', text: '调试' }
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: '活跃' },
      inactive: { color: 'red', text: '非活跃' },
      banned: { color: 'red', text: '已禁用' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRoleTag = (role: string) => {
    const roleConfig = {
      admin: { color: 'red', text: '管理员' },
      product_manager: { color: 'purple', text: '产品经理' },
      project_manager: { color: 'blue', text: '项目经理' },
      delivery_manager: { color: 'green', text: '交付经理' }
    };
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const logColumns = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getLevelTag(level)
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      render: (module: string) => (
        <Tag color="blue">{module}</Tag>
      )
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    }
  ];

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => getRoleTag(role)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin'
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>禁用</Button>
        </Space>
      )
    }
  ];

  const handleConfigChange = (values: any) => {
    setSystemConfig({ ...systemConfig, ...values });
    setConfigModalVisible(false);
    message.success('配置更新成功');
  };

  return (
    <div className="system-admin">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="系统概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="CPU使用率"
                    value={systemStats.cpuUsage}
                    suffix="%"
                    prefix={<MonitorOutlined />}
                    valueStyle={{ color: systemStats.cpuUsage > 80 ? '#f5222d' : '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="内存使用率"
                    value={systemStats.memoryUsage}
                    suffix="%"
                    prefix={<DatabaseOutlined />}
                    valueStyle={{ color: systemStats.memoryUsage > 80 ? '#f5222d' : '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="磁盘使用率"
                    value={systemStats.diskUsage}
                    suffix="%"
                    prefix={<CloudOutlined />}
                    valueStyle={{ color: systemStats.diskUsage > 80 ? '#f5222d' : '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="系统可用性"
                    value={systemStats.uptime}
                    suffix="%"
                    prefix={<SecurityScanOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="系统资源使用情况" style={{ height: 400 }}>
                  <GaugeChart
                    data={[
                      { name: 'CPU', value: systemStats.cpuUsage, max: 100, unit: '%' },
                      { name: '内存', value: systemStats.memoryUsage, max: 100, unit: '%' },
                      { name: '磁盘', value: systemStats.diskUsage, max: 100, unit: '%' }
                    ]}
                    height={300}
                    showMultiple={true}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="系统性能趋势" style={{ height: 400 }}>
                  <TrendChart
                    data={[
                      { date: '2024-01-01', value: 40, category: 'CPU使用率' },
                      { date: '2024-01-02', value: 45, category: 'CPU使用率' },
                      { date: '2024-01-03', value: 42, category: 'CPU使用率' },
                      { date: '2024-01-04', value: 48, category: 'CPU使用率' },
                      { date: '2024-01-05', value: 45, category: 'CPU使用率' },
                      { date: '2024-01-01', value: 65, category: '内存使用率' },
                      { date: '2024-01-02', value: 68, category: '内存使用率' },
                      { date: '2024-01-03', value: 70, category: '内存使用率' },
                      { date: '2024-01-04', value: 72, category: '内存使用率' },
                      { date: '2024-01-05', value: 68, category: '内存使用率' }
                    ]}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="系统日志" key="logs">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<ReloadOutlined />}>
                  刷新日志
                </Button>
                <Button icon={<ToolOutlined />}>
                  清理日志
                </Button>
                <Button icon={<SettingOutlined />}>
                  日志配置
                </Button>
              </Space>
            </div>

            <Table
              columns={logColumns}
              dataSource={systemLogs}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="用户管理" key="users">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<UserOutlined />}>
                  添加用户
                </Button>
                <Button icon={<SecurityScanOutlined />}>
                  权限管理
                </Button>
                <Button icon={<BellOutlined />}>
                  发送通知
                </Button>
              </Space>
            </div>

            <Table
              columns={userColumns}
              dataSource={userList}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="系统配置" key="config">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="基本配置">
                  <Form
                    layout="vertical"
                    initialValues={systemConfig}
                    onFinish={handleConfigChange}
                  >
                    <Form.Item label="维护模式" name="maintenanceMode" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="自动备份" name="autoBackup" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="日志级别" name="logLevel">
                      <Select>
                        <Option value="debug">调试</Option>
                        <Option value="info">信息</Option>
                        <Option value="warning">警告</Option>
                        <Option value="error">错误</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="最大用户数" name="maxUsers">
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item label="会话超时(分钟)" name="sessionTimeout">
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存配置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="通知配置">
                  <Form
                    layout="vertical"
                    initialValues={systemConfig}
                    onFinish={handleConfigChange}
                  >
                    <Form.Item label="邮件通知" name="emailNotifications" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="短信通知" name="smsNotifications" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        保存配置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="系统监控" key="monitor">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="CPU使用率">
                  <Progress
                    type="circle"
                    percent={systemStats.cpuUsage}
                    format={percent => `${percent}%`}
                    size={120}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="内存使用率">
                  <Progress
                    type="circle"
                    percent={systemStats.memoryUsage}
                    format={percent => `${percent}%`}
                    size={120}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="磁盘使用率">
                  <Progress
                    type="circle"
                    percent={systemStats.diskUsage}
                    format={percent => `${percent}%`}
                    size={120}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="实时监控">
                  <Alert
                    message="系统运行正常"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        {systemStats.activeUsers}
                      </div>
                      <div>活跃用户</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        {systemStats.totalRequests.toLocaleString()}
                      </div>
                      <div>总请求数</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                        {systemStats.errorRate}%
                      </div>
                      <div>错误率</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemAdmin;
