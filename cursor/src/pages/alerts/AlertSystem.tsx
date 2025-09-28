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
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  message,
  Tabs,
  List,
  Badge,
  Tooltip,
  Alert,
  Switch,
  Radio
} from 'antd';
import { 
  BellOutlined, 
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  SendOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: '系统性能告警',
      type: 'performance',
      level: 'high',
      message: 'CPU使用率超过90%，持续5分钟',
      status: 'active',
      source: '系统监控',
      createTime: '2024-01-15 14:30:00',
      updateTime: '2024-01-15 14:35:00',
      assignee: '张三',
      resolved: false
    },
    {
      id: 2,
      title: '项目进度告警',
      type: 'project',
      level: 'medium',
      message: '电商平台重构项目进度滞后15%',
      status: 'active',
      source: '项目管理',
      createTime: '2024-01-15 10:20:00',
      updateTime: '2024-01-15 10:25:00',
      assignee: '李四',
      resolved: false
    },
    {
      id: 3,
      title: '人员流动告警',
      type: 'personnel',
      level: 'low',
      message: '王五申请调离当前项目',
      status: 'resolved',
      source: '人员管理',
      createTime: '2024-01-14 16:45:00',
      updateTime: '2024-01-15 09:00:00',
      assignee: '王五',
      resolved: true
    },
    {
      id: 4,
      title: '预算超支告警',
      type: 'financial',
      level: 'high',
      message: '移动端开发项目预算使用率达到95%',
      status: 'active',
      source: '财务管理',
      createTime: '2024-01-15 11:15:00',
      updateTime: '2024-01-15 11:20:00',
      assignee: '赵六',
      resolved: false
    }
  ]);

  const [alertStats, setAlertStats] = useState({
    total: 4,
    active: 3,
    resolved: 1,
    high: 2,
    medium: 1,
    low: 1
  });

  const [alertTrend, setAlertTrend] = useState([
    { date: '2024-01-01', value: 2, category: '新增告警' },
    { date: '2024-01-02', value: 1, category: '新增告警' },
    { date: '2024-01-03', value: 3, category: '新增告警' },
    { date: '2024-01-04', value: 1, category: '新增告警' },
    { date: '2024-01-05', value: 2, category: '新增告警' },
    { date: '2024-01-01', value: 1, category: '解决告警' },
    { date: '2024-01-02', value: 2, category: '解决告警' },
    { date: '2024-01-03', value: 1, category: '解决告警' },
    { date: '2024-01-04', value: 3, category: '解决告警' },
    { date: '2024-01-05', value: 1, category: '解决告警' }
  ]);

  const [alertDistribution, setAlertDistribution] = useState([
    { name: '性能告警', value: 1, color: '#f5222d' },
    { name: '项目告警', value: 1, color: '#faad14' },
    { name: '人员告警', value: 1, color: '#1890ff' },
    { name: '财务告警', value: 1, color: '#52c41a' }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    webhook: true,
    performance: true,
    project: true,
    personnel: false,
    financial: true
  });

  const getLevelTag = (level: string) => {
    const levelConfig = {
      high: { color: 'red', text: '高', icon: <ExclamationCircleOutlined /> },
      medium: { color: 'orange', text: '中', icon: <WarningOutlined /> },
      low: { color: 'green', text: '低', icon: <CheckCircleOutlined /> }
    };
    const config = levelConfig[level as keyof typeof levelConfig];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'red', text: '活跃' },
      resolved: { color: 'green', text: '已解决' },
      closed: { color: 'blue', text: '已关闭' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      performance: { color: 'red', text: '性能告警' },
      project: { color: 'orange', text: '项目告警' },
      personnel: { color: 'blue', text: '人员告警' },
      financial: { color: 'green', text: '财务告警' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const alertColumns = [
    {
      title: '告警标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Space>
          <BellOutlined />
          {text}
        </Space>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type)
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => getLevelTag(level)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          {!record.resolved && (
            <Button type="link" size="small" danger>
              解决
            </Button>
          )}
        </Space>
      )
    }
  ];

  const handleResolveAlert = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'resolved', resolved: true, updateTime: new Date().toLocaleString() }
        : alert
    ));
    message.success('告警已解决');
  };

  const handleSendNotification = () => {
    message.success('通知已发送');
  };

  return (
    <div className="alert-system">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="告警概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总告警数"
                    value={alertStats.total}
                    prefix={<BellOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="活跃告警"
                    value={alertStats.active}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已解决"
                    value={alertStats.resolved}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="高风险"
                    value={alertStats.high}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="告警类型分布">
                  <RingChart
                    data={alertDistribution}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="告警趋势">
                  <TrendChart
                    data={alertTrend}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Alert
                  message="告警提醒"
                  description="当前有3个活跃告警需要处理，其中2个为高风险告警。"
                  type="warning"
                  showIcon
                  action={
                    <Button size="small" type="primary">
                      立即处理
                    </Button>
                  }
                />
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="告警列表" key="alerts">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<BellOutlined />}>
                  新建告警
                </Button>
                <Button icon={<SendOutlined />} onClick={handleSendNotification}>
                  发送通知
                </Button>
                <Select placeholder="选择告警级别" style={{ width: 120 }}>
                  <Option value="all">全部级别</Option>
                  <Option value="high">高风险</Option>
                  <Option value="medium">中风险</Option>
                  <Option value="low">低风险</Option>
                </Select>
                <Select placeholder="选择告警类型" style={{ width: 120 }}>
                  <Option value="all">全部类型</Option>
                  <Option value="performance">性能告警</Option>
                  <Option value="project">项目告警</Option>
                  <Option value="personnel">人员告警</Option>
                  <Option value="financial">财务告警</Option>
                </Select>
                <RangePicker />
              </Space>
            </div>

            <Table
              columns={alertColumns}
              dataSource={alerts}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="通知设置" key="settings">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="通知渠道">
                  <Form layout="vertical">
                    <Form.Item label="邮件通知">
                      <Switch 
                        checked={notificationSettings.email}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, email: checked})}
                      />
                    </Form.Item>
                    <Form.Item label="短信通知">
                      <Switch 
                        checked={notificationSettings.sms}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, sms: checked})}
                      />
                    </Form.Item>
                    <Form.Item label="Webhook通知">
                      <Switch 
                        checked={notificationSettings.webhook}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, webhook: checked})}
                      />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="告警类型">
                  <Form layout="vertical">
                    <Form.Item label="性能告警">
                      <Switch 
                        checked={notificationSettings.performance}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, performance: checked})}
                      />
                    </Form.Item>
                    <Form.Item label="项目告警">
                      <Switch 
                        checked={notificationSettings.project}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, project: checked})}
                      />
                    </Form.Item>
                    <Form.Item label="人员告警">
                      <Switch 
                        checked={notificationSettings.personnel}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, personnel: checked})}
                      />
                    </Form.Item>
                    <Form.Item label="财务告警">
                      <Switch 
                        checked={notificationSettings.financial}
                        onChange={(checked) => setNotificationSettings({...notificationSettings, financial: checked})}
                      />
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="通知模板">
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <SettingOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                    <div style={{ marginTop: 16, color: '#666' }}>
                      通知模板管理功能开发中...
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="告警历史" key="history">
            <List
              dataSource={alerts.filter(alert => alert.status === 'resolved')}
              renderItem={(alert) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{alert.title}</span>
                        {getLevelTag(alert.level)}
                        {getStatusTag(alert.status)}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>{alert.message}</div>
                        <div style={{ color: '#666' }}>
                          <strong>创建时间：</strong>{alert.createTime} | 
                          <strong> 解决时间：</strong>{alert.updateTime} | 
                          <strong> 负责人：</strong>{alert.assignee}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AlertSystem;
