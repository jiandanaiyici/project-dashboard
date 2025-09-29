import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Select, 
  Switch, 
  Input, 
  DatePicker,
  Modal,
  Form,
  Radio,
  Slider,
  Tabs,
  List,
  Avatar,
  Badge,
  Space,
  Tooltip,
  message,
  notification,
  Divider,
  Timeline,
  Alert,
  Statistic
} from 'antd';
import { 
  BellOutlined, 
  WarningOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  FilterOutlined,
  SoundOutlined,
  MailOutlined,
  MobileOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '@/components';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

interface AlertRule {
  id: string;
  name: string;
  type: 'project' | 'budget' | 'workload' | 'performance' | 'deadline' | 'quality';
  level: 'low' | 'medium' | 'high' | 'critical';
  condition: string;
  threshold: number;
  enabled: boolean;
  notifications: string[]; // 通知方式: email, sms, app, webhook
  recipients: string[]; // 接收人
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface AlertInstance {
  id: string;
  ruleId: string;
  ruleName: string;
  title: string;
  message: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  metadata?: any;
}

/**
 * 告警概览统计
 */
const AlertOverview: React.FC<{ alerts: AlertInstance[], rules: AlertRule[] }> = ({ alerts, rules }) => {
  const newAlerts = alerts.filter(a => a.status === 'new').length;
  const criticalAlerts = alerts.filter(a => a.level === 'critical' && a.status !== 'resolved').length;
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged').length;
  const activeRules = rules.filter(r => r.enabled).length;

  const alertsByLevel = {
    critical: alerts.filter(a => a.level === 'critical' && a.status !== 'resolved').length,
    high: alerts.filter(a => a.level === 'high' && a.status !== 'resolved').length,
    medium: alerts.filter(a => a.level === 'medium' && a.status !== 'resolved').length,
    low: alerts.filter(a => a.level === 'low' && a.status !== 'resolved').length,
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <StatCard
          title="新告警"
          value={newAlerts}
          icon={<BellOutlined />}
          style={{ borderLeft: '4px solid #ff4d4f' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="严重告警"
          value={criticalAlerts}
          icon={<WarningOutlined />}
          style={{ borderLeft: '4px solid #ff7875' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="已确认"
          value={acknowledgedAlerts}
          icon={<CheckCircleOutlined />}
          style={{ borderLeft: '4px solid #fa8c16' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="活跃规则"
          value={activeRules}
          icon={<SettingOutlined />}
          style={{ borderLeft: '4px solid #1890ff' }}
        />
      </Col>

      <Col span={24}>
        <Card title="告警级别分布">
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="严重"
                value={alertsByLevel.critical}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="高"
                value={alertsByLevel.high}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<WarningOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="中"
                value={alertsByLevel.medium}
                valueStyle={{ color: '#faad14' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="低"
                value={alertsByLevel.low}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 实时告警列表
 */
const AlertList: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertInstance[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  // 模拟告警数据
  useEffect(() => {
    const mockAlerts: AlertInstance[] = [
      {
        id: '1',
        ruleId: 'rule1',
        ruleName: '项目预算超支告警',
        title: 'ERP系统项目预算超支',
        message: 'ERP系统项目预算使用率已达105%，超出预算50万元',
        level: 'critical',
        type: 'budget',
        status: 'new',
        triggeredAt: '2024-01-15 14:30:00',
        metadata: { projectId: 'p1', budgetUsage: 105, overAmount: 500000 }
      },
      {
        id: '2',
        ruleId: 'rule2',
        ruleName: '人员工作负载告警',
        title: '张三工作负载过高',
        message: '张三当前工作负载为115%，存在倦怠风险',
        level: 'high',
        type: 'workload',
        status: 'acknowledged',
        triggeredAt: '2024-01-15 10:15:00',
        acknowledgedAt: '2024-01-15 11:00:00',
        acknowledgedBy: '李四',
        metadata: { userId: 'u1', workload: 115 }
      },
      {
        id: '3',
        ruleId: 'rule3',
        ruleName: '项目延期风险告警',
        title: '移动APP项目进度延迟',
        message: '移动APP项目当前进度仅为60%，存在延期风险',
        level: 'medium',
        type: 'deadline',
        status: 'new',
        triggeredAt: '2024-01-15 09:45:00',
        metadata: { projectId: 'p2', progress: 60, expectedProgress: 75 }
      },
      {
        id: '4',
        ruleId: 'rule4',
        ruleName: '系统性能告警',
        title: '系统响应时间过长',
        message: '系统平均响应时间超过2秒，影响用户体验',
        level: 'medium',
        type: 'performance',
        status: 'resolved',
        triggeredAt: '2024-01-14 16:20:00',
        resolvedAt: '2024-01-15 08:30:00',
        resolvedBy: '运维团队',
        metadata: { responseTime: 2.3, threshold: 2.0 }
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  // 过滤告警
  useEffect(() => {
    let filtered = alerts;

    if (filterLevel !== 'all') {
      filtered = filtered.filter(a => a.level === filterLevel);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    if (searchText) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchText.toLowerCase()) ||
        a.message.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filterLevel, filterStatus, searchText]);

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toISOString(), acknowledgedBy: '当前用户' }
        : alert
    ));
    message.success('告警已确认');
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString(), resolvedBy: '当前用户' }
        : alert
    ));
    message.success('告警已解决');
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'dismissed' }
        : alert
    ));
    message.success('告警已忽略');
  };

  const getLevelColor = (level: string) => {
    const colors = {
      critical: '#ff4d4f',
      high: '#fa8c16',
      medium: '#faad14',
      low: '#52c41a',
    };
    return colors[level as keyof typeof colors];
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      new: { color: 'red', text: '新告警' },
      acknowledged: { color: 'orange', text: '已确认' },
      resolved: { color: 'green', text: '已解决' },
      dismissed: { color: 'default', text: '已忽略' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => (
        <Badge 
          color={getLevelColor(level)} 
          text={level.toUpperCase()}
        />
      ),
    },
    {
      title: '告警信息',
      key: 'info',
      render: (record: AlertInstance) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.title}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.message}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: getStatusTag,
    },
    {
      title: '触发时间',
      dataIndex: 'triggeredAt',
      key: 'triggeredAt',
      width: 150,
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (record: AlertInstance) => (
        <Space size="small">
          {record.status === 'new' && (
            <Button 
              size="small" 
              type="primary" 
              onClick={() => handleAcknowledge(record.id)}
            >
              确认
            </Button>
          )}
          {(record.status === 'new' || record.status === 'acknowledged') && (
            <Button 
              size="small" 
              type="primary" 
              ghost
              onClick={() => handleResolve(record.id)}
            >
              解决
            </Button>
          )}
          <Button 
            size="small" 
            onClick={() => handleDismiss(record.id)}
          >
            忽略
          </Button>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => message.info('查看详情功能开发中')}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="实时告警"
      extra={
        <Space>
          <Search
            placeholder="搜索告警"
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            value={filterLevel}
            onChange={setFilterLevel}
            style={{ width: 100 }}
          >
            <Option value="all">全部级别</Option>
            <Option value="critical">严重</Option>
            <Option value="high">高</Option>
            <Option value="medium">中</Option>
            <Option value="low">低</Option>
          </Select>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 100 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="new">新告警</Option>
            <Option value="acknowledged">已确认</Option>
            <Option value="resolved">已解决</Option>
            <Option value="dismissed">已忽略</Option>
          </Select>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredAlerts}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        size="middle"
      />
    </Card>
  );
};

/**
 * 告警规则管理
 */
const AlertRules: React.FC = () => {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [form] = Form.useForm();

  // 模拟告警规则数据
  useEffect(() => {
    const mockRules: AlertRule[] = [
      {
        id: 'rule1',
        name: '项目预算超支告警',
        type: 'budget',
        level: 'critical',
        condition: '预算使用率 > 100%',
        threshold: 100,
        enabled: true,
        notifications: ['email', 'app'],
        recipients: ['project-manager@company.com'],
        frequency: 'immediate',
        createdAt: '2024-01-01',
        lastTriggered: '2024-01-15 14:30:00',
        triggerCount: 3,
      },
      {
        id: 'rule2',
        name: '人员工作负载告警',
        type: 'workload',
        level: 'high',
        condition: '工作负载 > 110%',
        threshold: 110,
        enabled: true,
        notifications: ['email', 'sms'],
        recipients: ['hr@company.com', 'team-lead@company.com'],
        frequency: 'daily',
        createdAt: '2024-01-01',
        lastTriggered: '2024-01-15 10:15:00',
        triggerCount: 8,
      },
      {
        id: 'rule3',
        name: '项目延期风险告警',
        type: 'deadline',
        level: 'medium',
        condition: '项目进度偏差 > 15%',
        threshold: 15,
        enabled: true,
        notifications: ['app'],
        recipients: ['project-manager@company.com'],
        frequency: 'weekly',
        createdAt: '2024-01-01',
        lastTriggered: '2024-01-15 09:45:00',
        triggerCount: 2,
      },
    ];

    setRules(mockRules);
  }, []);

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule: AlertRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个告警规则吗？',
      onOk() {
        setRules(prev => prev.filter(r => r.id !== ruleId));
        message.success('删除成功');
      },
    });
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
    message.success(enabled ? '规则已启用' : '规则已禁用');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingRule) {
        setRules(prev => prev.map(rule => 
          rule.id === editingRule.id ? { ...rule, ...values } : rule
        ));
        message.success('更新成功');
      } else {
        const newRule: AlertRule = {
          id: `rule${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          triggerCount: 0,
        };
        setRules(prev => [...prev, newRule]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          project: '项目',
          budget: '预算',
          workload: '工作负载',
          performance: '性能',
          deadline: '截止日期',
          quality: '质量',
        };
        return typeMap[type as keyof typeof typeMap];
      },
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const colors = {
          critical: 'red',
          high: 'orange',
          medium: 'yellow',
          low: 'green',
        };
        return <Tag color={colors[level as keyof typeof colors]}>{level.toUpperCase()}</Tag>;
      },
    },
    {
      title: '条件',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: AlertRule) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleRule(record.id, checked)}
        />
      ),
    },
    {
      title: '触发次数',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (time?: string) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: AlertRule) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="告警规则管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加规则
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={rules}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRule ? '编辑告警规则' : '添加告警规则'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="告警类型"
                rules={[{ required: true, message: '请选择告警类型' }]}
              >
                <Select placeholder="请选择告警类型">
                  <Option value="project">项目</Option>
                  <Option value="budget">预算</Option>
                  <Option value="workload">工作负载</Option>
                  <Option value="performance">性能</Option>
                  <Option value="deadline">截止日期</Option>
                  <Option value="quality">质量</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="告警级别"
                rules={[{ required: true, message: '请选择告警级别' }]}
              >
                <Select placeholder="请选择告警级别">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="condition"
            label="触发条件"
            rules={[{ required: true, message: '请输入触发条件' }]}
          >
            <Input placeholder="例如：预算使用率 > 100%" />
          </Form.Item>

          <Form.Item
            name="threshold"
            label="阈值"
            rules={[{ required: true, message: '请输入阈值' }]}
          >
            <Slider min={0} max={200} />
          </Form.Item>

          <Form.Item
            name="notifications"
            label="通知方式"
            rules={[{ required: true, message: '请选择通知方式' }]}
          >
            <Select mode="multiple" placeholder="请选择通知方式">
              <Option value="email">邮件</Option>
              <Option value="sms">短信</Option>
              <Option value="app">应用内通知</Option>
              <Option value="webhook">Webhook</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="frequency"
            label="通知频率"
            rules={[{ required: true, message: '请选择通知频率' }]}
          >
            <Radio.Group>
              <Radio value="immediate">立即</Radio>
              <Radio value="hourly">每小时</Radio>
              <Radio value="daily">每天</Radio>
              <Radio value="weekly">每周</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="enabled"
            label="启用规则"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

/**
 * 告警历史
 */
const AlertHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<AlertInstance[]>([]);

  useEffect(() => {
    // 模拟历史数据
    const mockHistory: AlertInstance[] = [
      {
        id: 'h1',
        ruleId: 'rule1',
        ruleName: '项目预算超支告警',
        title: 'ERP系统项目预算超支',
        message: 'ERP系统项目预算使用率已达105%',
        level: 'critical',
        type: 'budget',
        status: 'resolved',
        triggeredAt: '2024-01-15 14:30:00',
        resolvedAt: '2024-01-15 16:00:00',
        resolvedBy: '项目经理',
      },
      {
        id: 'h2',
        ruleId: 'rule2',
        ruleName: '系统性能告警',
        title: '系统响应时间过长',
        message: '系统平均响应时间超过2秒',
        level: 'medium',
        type: 'performance',
        status: 'resolved',
        triggeredAt: '2024-01-14 16:20:00',
        resolvedAt: '2024-01-15 08:30:00',
        resolvedBy: '运维团队',
      },
    ];

    setHistoryData(mockHistory);
  }, []);

  return (
    <Card title="告警历史">
      <Timeline>
        {historyData.map(alert => (
          <Timeline.Item
            key={alert.id}
            color={alert.level === 'critical' ? 'red' : alert.level === 'high' ? 'orange' : 'blue'}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{alert.title}</div>
              <div style={{ color: '#666', fontSize: '12px', marginTop: 4 }}>
                {alert.message}
              </div>
              <div style={{ color: '#999', fontSize: '12px', marginTop: 4 }}>
                触发时间: {new Date(alert.triggeredAt).toLocaleString()}
                {alert.resolvedAt && (
                  <span> | 解决时间: {new Date(alert.resolvedAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

/**
 * 告警系统主页面
 */
const AlertSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts] = useState<AlertInstance[]>([]);
  const [rules] = useState<AlertRule[]>([]);

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="告警系统" />
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
      >
        <TabPane tab="告警概览" key="overview">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <AlertOverview alerts={alerts} rules={rules} />
            <AlertList />
          </Space>
        </TabPane>
        
        <TabPane tab="规则管理" key="rules">
          <AlertRules />
        </TabPane>
        
        <TabPane tab="告警历史" key="history">
          <AlertHistory />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AlertSystem;