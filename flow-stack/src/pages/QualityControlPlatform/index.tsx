import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Tabs,
  Card,
  Table,
  Button,
  Input,
  Select,
  Badge,
  Progress,
  Statistic,
  Row,
  Col,
  Avatar,
  Dropdown,
  message,
  Modal,
  Form,
  Checkbox,
  Tag,
  DatePicker,
  Tooltip,
  Spin,
  Divider,
} from 'antd';
import {
  Line,
  Bar,
  Pie,
  Area,
  Tooltip as ChartTooltip,
} from '@ant-design/charts';
import {
  DashboardOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SyncOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import moment from 'moment';

// 模拟数据
const mockTeamData = [
  {
    id: 1,
    name: '电商平台团队',
    members: 28,
    applications: 5,
    status: 'active',
  },
  {
    id: 2,
    name: '支付系统团队',
    members: 15,
    applications: 3,
    status: 'active',
  },
  {
    id: 3,
    name: '用户中心团队',
    members: 12,
    applications: 2,
    status: 'active',
  },
  {
    id: 4,
    name: '数据分析团队',
    members: 8,
    applications: 1,
    status: 'maintenance',
  },
  {
    id: 5,
    name: '营销活动团队',
    members: 20,
    applications: 4,
    status: 'active',
  },
];

const mockApplicationData = [
  {
    id: 1,
    name: '电商主站',
    team: '电商平台团队',
    type: '核心',
    version: 'v2.5.3',
    status: 'online',
  },
  {
    id: 2,
    name: '移动端APP',
    team: '电商平台团队',
    type: '核心',
    version: 'v3.2.1',
    status: 'online',
  },
  {
    id: 3,
    name: '支付网关',
    team: '支付系统团队',
    type: '核心',
    version: 'v1.8.5',
    status: 'online',
  },
  {
    id: 4,
    name: '用户认证服务',
    team: '用户中心团队',
    type: '核心',
    version: 'v2.1.0',
    status: 'online',
  },
  {
    id: 5,
    name: '数据报表系统',
    team: '数据分析团队',
    type: '非核心',
    version: 'v1.3.2',
    status: 'maintenance',
  },
  {
    id: 6,
    name: '促销活动引擎',
    team: '营销活动团队',
    type: '非核心',
    version: 'v2.0.4',
    status: 'online',
  },
];

const mockIterationData = [
  {
    id: 1,
    app: '电商主站',
    version: 'v2.5.3',
    startDate: '2025-09-01',
    endDate: '2025-09-21',
    status: 'completed',
  },
  {
    id: 2,
    app: '电商主站',
    version: 'v2.6.0',
    startDate: '2025-09-22',
    endDate: '2025-10-12',
    status: 'in_progress',
  },
  {
    id: 3,
    app: '支付网关',
    version: 'v1.8.5',
    startDate: '2025-09-15',
    endDate: '2025-10-05',
    status: 'completed',
  },
  {
    id: 4,
    app: '移动端APP',
    version: 'v3.2.1',
    startDate: '2025-09-05',
    endDate: '2025-09-25',
    status: 'completed',
  },
  {
    id: 5,
    app: '移动端APP',
    version: 'v3.3.0',
    startDate: '2025-09-26',
    endDate: '2025-10-16',
    status: 'in_progress',
  },
];

const mockQualityMetrics = {
  defectPrevalenceRate: [
    { month: '5月', 电商平台团队: 82, 支付系统团队: 88, 平均: 85 },
    { month: '6月', 电商平台团队: 85, 支付系统团队: 86, 平均: 85.5 },
    { month: '7月', 电商平台团队: 88, 支付系统团队: 90, 平均: 89 },
    { month: '8月', 电商平台团队: 86, 支付系统团队: 92, 平均: 89 },
    { month: '9月', 电商平台团队: 89, 支付系统团队: 91, 平均: 90 },
  ],
  reworkRatio: [
    { month: '5月', 电商平台团队: 12, 支付系统团队: 8, 平均: 10 },
    { month: '6月', 电商平台团队: 10, 支付系统团队: 7, 平均: 8.5 },
    { month: '7月', 电商平台团队: 9, 支付系统团队: 6, 平均: 7.5 },
    { month: '8月', 电商平台团队: 11, 支付系统团队: 7, 平均: 9 },
    { month: '9月', 电商平台团队: 8, 支付系统团队: 5, 平均: 6.5 },
  ],
  onTimeQualityDelivery: [
    { month: '5月', 电商平台团队: 75, 支付系统团队: 85, 平均: 80 },
    { month: '6月', 电商平台团队: 80, 支付系统团队: 88, 平均: 84 },
    { month: '7月', 电商平台团队: 82, 支付系统团队: 90, 平均: 86 },
    { month: '8月', 电商平台团队: 78, 支付系统团队: 86, 平均: 82 },
    { month: '9月', 电商平台团队: 85, 支付系统团队: 92, 平均: 88.5 },
  ],
  currentIterationMetrics: {
    电商主站: {
      defectPrevalenceRate: 89,
      reworkRatio: 8,
      testCoverage: 92,
      defectDensity: 0.4,
      passRate: 96,
      scheduleCompletion: 90,
    },
    支付网关: {
      defectPrevalenceRate: 91,
      reworkRatio: 5,
      testCoverage: 95,
      defectDensity: 0.3,
      passRate: 98,
      scheduleCompletion: 95,
    },
    移动端APP: {
      defectPrevalenceRate: 87,
      reworkRatio: 9,
      testCoverage: 88,
      defectDensity: 0.5,
      passRate: 94,
      scheduleCompletion: 85,
    },
  },
  riskAssessment: [
    { app: '电商主站', riskScore: 35, status: '低风险' },
    { app: '移动端APP', riskScore: 62, status: '中风险' },
    { app: '支付网关', riskScore: 28, status: '低风险' },
    { app: '用户认证服务', riskScore: 45, status: '低风险' },
    { app: '促销活动引擎', riskScore: 75, status: '高风险' },
  ],
};

/**
 * 质量管控
 */
const QualityControlPlatform = () => {
  const { Header, Content, Sider, Footer } = Layout;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: '支付网关迭代v1.8.5质量检查未通过',
      type: 'warning',
      read: false,
    },
    {
      id: 2,
      message: '移动端APP测试覆盖率低于阈值',
      type: 'error',
      read: false,
    },
    { id: 3, message: '电商主站迭代进度延迟', type: 'info', read: true },
  ]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // 处理通知点击
  const handleNotificationClick = () => {
    setIsNotificationVisible(!isNotificationVisible);
    // 标记所有通知为已读
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 获取未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 状态标签颜色映射
  const statusColorMap = {
    active: 'green',
    maintenance: 'orange',
    online: 'green',
    offline: 'red',
    in_progress: 'blue',
    completed: 'green',
    blocked: 'red',
    低风险: 'green',
    中风险: 'orange',
    高风险: 'red',
    核心: 'red',
    非核心: 'blue',
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => (
    // @ts-ignore
    <Tag color={statusColorMap[status] || 'gray'}>
      {status === 'active' && '活跃'}
      {status === 'maintenance' && '维护中'}
      {status === 'online' && '在线'}
      {status === 'offline' && '下线'}
      {status === 'in_progress' && '进行中'}
      {status === 'completed' && '已完成'}
      {status === 'blocked' && '已阻塞'}
      {status === '低风险' && '低风险'}
      {status === '中风险' && '中风险'}
      {status === '高风险' && '高风险'}
      {status === '核心' && '核心应用'}
      {status === '非核心' && '非核心应用'}
    </Tag>
  );

  // 仪表盘配置
  const dashboardConfig = {
    title: '质量管控概览',
    key: 'dashboard',
    content: (
      <div className="space-y-6 p-4">
        {/* 关键指标卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="按时交付且质量达标率"
                value={88.5}
                precision={1}
                valueStyle={{ color: '#3f8600' }}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-green-500">
                  <ArrowUpOutlined /> 3.2%
                </span>
                <span className="ml-1">较上月</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="缺陷前置发现率"
                value={90}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                suffix="%"
                prefix={<SearchOutlined />}
              />
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-green-500">
                  <ArrowUpOutlined /> 1.0%
                </span>
                <span className="ml-1">较上月</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="迭代返工率"
                value={6.5}
                precision={1}
                valueStyle={{ color: '#cf1322' }}
                suffix="%"
                prefix={<SyncOutlined />}
              />
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-green-500">
                  <ArrowDownOutlined /> 2.5%
                </span>
                <span className="ml-1">较上月</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="发布成功率"
                value={96}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
                suffix="%"
                prefix={<CheckCircleOutlined />}
              />
              <div className="mt-2 text-sm text-gray-500">
                <span className="text-green-500">
                  <ArrowUpOutlined /> 1.5%
                </span>
                <span className="ml-1">较上月</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 图表行 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="缺陷前置发现率趋势">
              {/* <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockQualityMetrics.defectPrevalenceRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis min={70} max={100} />
                    <ChartTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="电商平台团队"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="支付系统团队"
                      stroke="#82ca9d"
                    />
                    <Line type="monotone" dataKey="平均" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div> */}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="迭代返工率趋势">
              <div className="h-80">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockQualityMetrics.reworkRatio}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis min={0} max={20} />
                    <ChartTooltip /> 
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="电商平台团队"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="支付系统团队"
                      stroke="#82ca9d"
                    />
                    <Line type="monotone" dataKey="平均" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer> */}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 第二行图表 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="按时交付且质量达标率">
              <div className="h-80">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockQualityMetrics.onTimeQualityDelivery}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis min={70} max={100} />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="电商平台团队" fill="#8884d8" />
                    <Bar dataKey="支付系统团队" fill="#82ca9d" />
                    <Bar dataKey="平均" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer> */}
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="应用风险评估">
              <div className="h-80">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockQualityMetrics.riskAssessment}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" min={0} max={100} />
                    <YAxis dataKey="app" type="category" />
                    <ChartTooltip />
                    <Bar dataKey="riskScore" fill="#8884d8">
                      {mockQualityMetrics.riskAssessment.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === '高风险'
                              ? '#f5222d'
                              : entry.status === '中风险'
                                ? '#faad14'
                                : '#52c41a'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer> */}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 当前迭代质量状态 */}
        <Card title="当前迭代质量状态">
          <Table
            dataSource={Object.entries(
              mockQualityMetrics.currentIterationMetrics
            ).map(([app, metrics], index) => ({
              key: index,
              app,
              ...metrics,
            }))}
            columns={[
              { title: '应用名称', dataIndex: 'app', key: 'app' },
              {
                title: '缺陷前置发现率(%)',
                dataIndex: 'defectPrevalenceRate',
                key: 'defectPrevalenceRate',
                render: value => (
                  <Progress
                    percent={value}
                    size="small"
                    // @ts-ignore
                    status={value >= 85 ? 'success' : 'warning'}
                  />
                ),
              },
              {
                title: '返工率(%)',
                dataIndex: 'reworkRatio',
                key: 'reworkRatio',
                render: value => (
                  <Progress
                    percent={value}
                    size="small"
                    // @ts-ignore
                    status={value <= 10 ? 'success' : 'warning'}
                  />
                ),
              },
              {
                title: '测试覆盖率(%)',
                dataIndex: 'testCoverage',
                key: 'testCoverage',
                render: value => (
                  <Progress
                    percent={value}
                    size="small"
                    // @ts-ignore
                    status={value >= 80 ? 'success' : 'warning'}
                  />
                ),
              },
              {
                title: '缺陷密度(个/千行)',
                dataIndex: 'defectDensity',
                key: 'defectDensity',
                render: value => (
                  <span
                    className={value <= 0.5 ? 'text-green-600' : 'text-red-600'}
                  >
                    {value}
                  </span>
                ),
              },
              {
                title: '测试通过率(%)',
                dataIndex: 'passRate',
                key: 'passRate',
                render: value => (
                  <Progress
                    percent={value}
                    size="small"
                    // @ts-ignore
                    status={value >= 95 ? 'success' : 'warning'}
                  />
                ),
              },
              {
                title: '进度完成度(%)',
                dataIndex: 'scheduleCompletion',
                key: 'scheduleCompletion',
                render: value => (
                  <Progress
                    percent={value}
                    size="small"
                    // @ts-ignore
                    status={value >= 85 ? 'success' : 'warning'}
                  />
                ),
              },
            ]}
          />
        </Card>
      </div>
    ),
  };

  // 团队管理配置
  const teamManagementConfig = {
    title: '团队管理',
    key: 'teams',
    content: (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">团队列表</h2>
          <Button type="primary" icon={<PlusOutlined />}>
            新增团队
          </Button>
        </div>

        <Card>
          <Table
            dataSource={mockTeamData}
            columns={[
              { title: '团队名称', dataIndex: 'name', key: 'name' },
              { title: '成员数量', dataIndex: 'members', key: 'members' },
              {
                title: '负责应用',
                dataIndex: 'applications',
                key: 'applications',
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: renderStatusTag,
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      onClick={() => setSelectedTeam(record)}
                    >
                      详情
                    </Button>
                    <Button size="small" type="primary">
                      编辑
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {selectedTeam && (
          <Card title={`${selectedTeam.name} 详情`} className="mt-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <h3 className="text-lg font-medium mb-3">团队概览</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">团队ID：</span>
                    {selectedTeam.id}
                  </p>
                  <p>
                    <span className="font-medium">团队名称：</span>
                    {selectedTeam.name}
                  </p>
                  <p>
                    <span className="font-medium">成员数量：</span>
                    {selectedTeam.members}
                  </p>
                  <p>
                    <span className="font-medium">负责应用：</span>
                    {selectedTeam.applications}
                  </p>
                  <p>
                    <span className="font-medium">团队状态：</span>
                    {renderStatusTag(selectedTeam.status)}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h3 className="text-lg font-medium mb-3">质量指标</h3>
                <div className="h-64">
                  {/* <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '按时交付率', value: 85 },
                          { name: '测试通过率', value: 92 },
                          { name: '缺陷修复率', value: 96 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ffc658" />
                      </Pie>
                      <ChartTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer> */}
                </div>
              </Col>
            </Row>

            <Divider orientation="left">负责应用</Divider>
            <Table
              dataSource={mockApplicationData.filter(
                app => app.team === selectedTeam.name
              )}
              columns={[
                { title: '应用名称', dataIndex: 'name', key: 'name' },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                  render: renderStatusTag,
                },
                { title: '当前版本', dataIndex: 'version', key: 'version' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: renderStatusTag,
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedApp(record);
                        setActiveTab('applications');
                      }}
                    >
                      查看
                    </Button>
                  ),
                },
              ]}
            />
          </Card>
        )}
      </div>
    ),
  };

  // 应用管理配置
  const applicationConfig = {
    title: '应用管理',
    key: 'applications',
    content: (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">应用列表</h2>
          <Button type="primary" icon={<PlusOutlined />}>
            新增应用
          </Button>
        </div>

        <Card>
          <Table
            dataSource={mockApplicationData}
            columns={[
              { title: '应用名称', dataIndex: 'name', key: 'name' },
              { title: '所属团队', dataIndex: 'team', key: 'team' },
              {
                title: '应用类型',
                dataIndex: 'type',
                key: 'type',
                render: renderStatusTag,
              },
              { title: '当前版本', dataIndex: 'version', key: 'version' },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: renderStatusTag,
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <div className="flex space-x-2">
                    <Button size="small" onClick={() => setSelectedApp(record)}>
                      详情
                    </Button>
                    <Button size="small" type="primary">
                      编辑
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {selectedApp && (
          <Card title={`${selectedApp.name} 详情`} className="mt-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <h3 className="text-lg font-medium mb-3">应用信息</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">应用ID：</span>
                    {selectedApp.id}
                  </p>
                  <p>
                    <span className="font-medium">应用名称：</span>
                    {selectedApp.name}
                  </p>
                  <p>
                    <span className="font-medium">所属团队：</span>
                    {selectedApp.team}
                  </p>
                  <p>
                    <span className="font-medium">应用类型：</span>
                    {renderStatusTag(selectedApp.type)}
                  </p>
                  <p>
                    <span className="font-medium">当前版本：</span>
                    {selectedApp.version}
                  </p>
                  <p>
                    <span className="font-medium">应用状态：</span>
                    {renderStatusTag(selectedApp.status)}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <h3 className="text-lg font-medium mb-3">质量与进度平衡指标</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>缺陷前置发现率</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <Progress percent={89} status="success" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>迭代返工率</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <Progress percent={8} status="success" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>按时交付且质量达标率</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress percent={85} status="success" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>需求变更对进度影响率</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <Progress percent={7} status="success" />
                  </div>
                </div>
              </Col>
            </Row>

            <Divider orientation="left">迭代记录</Divider>
            <Table
              dataSource={mockIterationData.filter(
                iteration => iteration.app === selectedApp.name
              )}
              columns={[
                { title: '版本', dataIndex: 'version', key: 'version' },
                { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
                { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: renderStatusTag,
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Button
                      size="small"
                      onClick={() => {
                        setActiveTab('iterations');
                      }}
                    >
                      查看详情
                    </Button>
                  ),
                },
              ]}
            />
          </Card>
        )}
      </div>
    ),
  };

  // 迭代管理配置
  const iterationConfig = {
    title: '迭代管理',
    key: 'iterations',
    content: (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">迭代列表</h2>
          <div className="flex space-x-2">
            <Button type="primary" icon={<PlusOutlined />}>
              创建迭代
            </Button>
            <Button icon={<FilterOutlined />}>筛选</Button>
          </div>
        </div>

        <Card>
          <Table
            dataSource={mockIterationData}
            columns={[
              { title: '应用', dataIndex: 'app', key: 'app' },
              { title: '版本', dataIndex: 'version', key: 'version' },
              { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
              { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: renderStatusTag,
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <div className="flex space-x-2">
                    <Button size="small">详情</Button>
                    <Button size="small" type="primary">
                      质量分析
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Card title="迭代质量与进度跟踪" className="mt-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <h3 className="text-lg font-medium mb-3">迭代质量指标趋势</h3>
              <div className="h-80">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { date: '9/1', 缺陷数: 12, 已修复: 5, 测试用例: 45 },
                      { date: '9/5', 缺陷数: 28, 已修复: 18, 测试用例: 120 },
                      { date: '9/10', 缺陷数: 35, 已修复: 30, 测试用例: 210 },
                      { date: '9/15', 缺陷数: 42, 已修复: 38, 测试用例: 280 },
                      { date: '9/20', 缺陷数: 45, 已修复: 45, 测试用例: 320 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="缺陷数"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="已修复"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="测试用例"
                      stackId="2"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer> */}
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <h3 className="text-lg font-medium mb-3">迭代进度与质量平衡</h3>
              <div className="h-80">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: '9/1', 进度: 10, 质量评分: 95 },
                      { date: '9/5', 进度: 30, 质量评分: 92 },
                      { date: '9/10', 进度: 50, 质量评分: 88 },
                      { date: '9/15', 进度: 75, 质量评分: 85 },
                      { date: '9/20', 进度: 100, 质量评分: 90 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" min={0} max={100} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      min={0}
                      max={100}
                    />
                    <ChartTooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="进度"
                      stroke="#8884d8"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="质量评分"
                      stroke="#82ca9d"
                    />
                  </LineChart>
                </ResponsiveContainer> */}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    ),
  };

  // 质量标准配置
  const qualityStandardConfig = {
    title: '质量标准配置',
    key: 'standards',
    content: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">质量标准与阈值配置</h2>

        <Card title="通用质量标准配置">
          <Form layout="vertical" className="p-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="defectPrevalenceRate"
                  label="缺陷前置发现率阈值(%)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="85" suffix="%" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="reworkRatio"
                  label="迭代返工率阈值(%)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="10" suffix="%" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="onTimeDeliveryRate"
                  label="按时交付且质量达标率阈值(%)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="80" suffix="%" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="requirementChangeImpact"
                  label="需求变更对进度影响率阈值(%)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="10" suffix="%" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="testCoverage"
                  label="测试覆盖率阈值(%)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="80" suffix="%" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="defectDensity"
                  label="缺陷密度阈值(个/千行)"
                  rules={[{ required: true, message: '请输入阈值' }]}
                >
                  <Input defaultValue="0.5" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存配置
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="应用类型差异化配置" className="mt-4">
          <Table
            dataSource={[
              {
                key: 1,
                type: '核心应用',
                defectPrevalenceRate: '≥90%',
                reworkRatio: '≤8%',
                testCoverage: '≥90%',
                defectDensity: '≤0.4',
              },
              {
                key: 2,
                type: '非核心应用',
                defectPrevalenceRate: '≥80%',
                reworkRatio: '≤12%',
                testCoverage: '≥70%',
                defectDensity: '≤0.6',
              },
            ]}
            columns={[
              { title: '应用类型', dataIndex: 'type', key: 'type' },
              {
                title: '缺陷前置发现率',
                dataIndex: 'defectPrevalenceRate',
                key: 'defectPrevalenceRate',
              },
              {
                title: '迭代返工率',
                dataIndex: 'reworkRatio',
                key: 'reworkRatio',
              },
              {
                title: '测试覆盖率',
                dataIndex: 'testCoverage',
                key: 'testCoverage',
              },
              {
                title: '缺陷密度(个/千行)',
                dataIndex: 'defectDensity',
                key: 'defectDensity',
              },
              {
                title: '操作',
                key: 'action',
                render: () => (
                  <Button size="small" type="primary">
                    编辑
                  </Button>
                ),
              },
            ]}
          />
        </Card>
      </div>
    ),
  };

  // 系统设置配置
  const settingsConfig = {
    title: '系统设置',
    key: 'settings',
    content: (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">系统设置</h2>

        <Card title="用户管理">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <Button type="primary" icon={<PlusOutlined />}>
              添加用户
            </Button>
          </div>
          <Table
            dataSource={[
              {
                id: 1,
                name: '张三',
                role: '管理员',
                team: '所有团队',
                status: 'active',
              },
              {
                id: 2,
                name: '李四',
                role: '测试负责人',
                team: '电商平台团队',
                status: 'active',
              },
              {
                id: 3,
                name: '王五',
                role: '测试负责人',
                team: '支付系统团队',
                status: 'active',
              },
              {
                id: 4,
                name: '赵六',
                role: '开发负责人',
                team: '用户中心团队',
                status: 'active',
              },
            ]}
            columns={[
              { title: '姓名', dataIndex: 'name', key: 'name' },
              { title: '角色', dataIndex: 'role', key: 'role' },
              { title: '所属团队', dataIndex: 'team', key: 'team' },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: renderStatusTag,
              },
              {
                title: '操作',
                key: 'action',
                render: () => (
                  <div className="flex space-x-2">
                    <Button size="small">编辑</Button>
                    <Button size="small" danger>
                      禁用
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <Card title="通知设置" className="mt-4">
          <Form layout="vertical" className="p-4">
            <Form.Item
              name="defectWarning"
              valuePropName="checked"
              label="缺陷数量预警"
            >
              <Checkbox>当缺陷数量超过阈值时发送通知</Checkbox>
            </Form.Item>
            <Form.Item
              name="coverageWarning"
              valuePropName="checked"
              label="测试覆盖率预警"
            >
              <Checkbox>当测试覆盖率低于阈值时发送通知</Checkbox>
            </Form.Item>
            <Form.Item
              name="scheduleWarning"
              valuePropName="checked"
              label="进度延迟预警"
            >
              <Checkbox>当迭代进度延迟时发送通知</Checkbox>
            </Form.Item>
            <Form.Item
              name="releaseWarning"
              valuePropName="checked"
              label="发布风险预警"
            >
              <Checkbox>当发布存在质量风险时发送通知</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    ),
  };

  // 所有标签页配置
  const tabConfigs = [
    dashboardConfig,
    teamManagementConfig,
    applicationConfig,
    iterationConfig,
    qualityStandardConfig,
    settingsConfig,
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={256} theme="light">
        <div className="flex items-center justify-center h-16 bg-primary text-white font-bold text-xl">
          质量管控平台
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={({ key }) => setActiveTab(key)}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key={dashboardConfig.key} icon={<DashboardOutlined />}>
            {dashboardConfig.title}
          </Menu.Item>
          <Menu.Item key={teamManagementConfig.key} icon={<TeamOutlined />}>
            {teamManagementConfig.title}
          </Menu.Item>
          <Menu.Item key={applicationConfig.key} icon={<AppstoreOutlined />}>
            {applicationConfig.title}
          </Menu.Item>
          <Menu.Item key={iterationConfig.key} icon={<SyncOutlined />}>
            {iterationConfig.title}
          </Menu.Item>
          <Menu.Item
            key={qualityStandardConfig.key}
            icon={<BarChartOutlined />}
          >
            {qualityStandardConfig.title}
          </Menu.Item>
          <Menu.Item key={settingsConfig.key} icon={<SettingOutlined />}>
            {settingsConfig.title}
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">
              {tabConfigs.find(t => t.key === activeTab)?.title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                icon={<BellOutlined />}
                onClick={handleNotificationClick}
                className="relative"
              >
                {unreadCount > 0 && (
                  <Badge
                    count={unreadCount}
                    className="absolute -top-1 -right-1"
                  />
                )}
              </Button>

              {isNotificationVisible && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                  <div className="p-2 border-b border-gray-200 font-medium">
                    通知
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5">
                            {notification.type === 'warning' && (
                              <ExclamationCircleOutlined className="text-orange-500" />
                            )}
                            {notification.type === 'error' && (
                              <CloseCircleOutlined className="text-red-500" />
                            )}
                            {notification.type === 'info' && (
                              <ClockCircleOutlined className="text-blue-500" />
                            )}
                          </div>
                          <div className="text-sm">{notification.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-gray-200 text-sm text-primary cursor-pointer hover:bg-gray-50">
                    查看全部
                  </div>
                </div>
              )}
            </div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile">个人中心</Menu.Item>
                  <Menu.Item key="logout">退出登录</Menu.Item>
                </Menu>
              }
            >
              <div className="flex items-center cursor-pointer">
                <Avatar icon={<UserOutlined />} className="mr-2" />
                <span>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : (
            tabConfigs.find(t => t.key === activeTab)?.content
          )}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          多团队质量管控平台 ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default QualityControlPlatform;
