import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Alert,
  Table,
  Tag,
  Button,
  Progress,
  Statistic,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Space,
  Badge,
  Timeline,
  Tooltip,
  Divider,
} from 'antd';
import {
  WarningOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  BugOutlined,
  SecurityScanOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BellOutlined,
  FireOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { TextArea } = Input;
const { Option } = Select;

interface Risk {
  id: string;
  title: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'analyzing' | 'mitigating' | 'resolved';
  category: 'technical' | 'schedule' | 'budget' | 'quality' | 'resource';
  project: string;
  assignee: string;
  createDate: string;
  dueDate: string;
  impact: string;
  probability: number;
  mitigation: string;
}

interface RiskSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  resolved: number;
  overdue: number;
}

const RisksPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [form] = Form.useForm();

  // 风险汇总数据
  const riskSummary: RiskSummary = {
    total: 28,
    critical: 3,
    high: 8,
    medium: 12,
    low: 5,
    resolved: 15,
    overdue: 4,
  };

  // 风险列表数据
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: '1',
      title: '数据库性能瓶颈',
      description: '随着用户量增长，数据库查询响应时间超过3秒，影响用户体验',
      level: 'critical',
      status: 'mitigating',
      category: 'technical',
      project: '项目管理平台',
      assignee: '张三',
      createDate: '2024-09-15',
      dueDate: '2024-10-01',
      impact: '系统响应缓慢，用户体验下降',
      probability: 90,
      mitigation: '优化查询语句，增加索引，考虑数据库分库分表',
    },
    {
      id: '2',
      title: '项目进度延期风险',
      description: '移动端开发进度落后于计划，可能影响整体发布时间',
      level: 'high',
      status: 'analyzing',
      category: 'schedule',
      project: '移动端应用',
      assignee: '李四',
      createDate: '2024-09-20',
      dueDate: '2024-10-15',
      impact: '项目延期交付，影响市场竞争力',
      probability: 75,
      mitigation: '增加开发资源，调整功能优先级',
    },
    {
      id: '3',
      title: '核心开发人员离职',
      description: '架构师提出离职申请，担心技术传承和项目延续性',
      level: 'high',
      status: 'identified',
      category: 'resource',
      project: '项目管理平台',
      assignee: '王五',
      createDate: '2024-09-25',
      dueDate: '2024-11-01',
      impact: '技术传承断层，项目风险增加',
      probability: 60,
      mitigation: '知识文档化，技能交接，招聘替代人员',
    },
    {
      id: '4',
      title: '预算超支风险',
      description: '第三方服务费用超出预期，可能导致预算不足',
      level: 'medium',
      status: 'resolved',
      category: 'budget',
      project: 'API重构',
      assignee: '赵六',
      createDate: '2024-08-10',
      dueDate: '2024-09-30',
      impact: '项目预算紧张，影响后续开发',
      probability: 40,
      mitigation: '重新评估服务商，寻找性价比更高的替代方案',
    },
  ]);

  // 风险级别配置
  const riskLevelConfig = {
    critical: { color: 'red', text: '严重', icon: <FireOutlined /> },
    high: { color: 'orange', text: '高', icon: <WarningOutlined /> },
    medium: { color: 'yellow', text: '中', icon: <ExclamationCircleOutlined /> },
    low: { color: 'blue', text: '低', icon: <ClockCircleOutlined /> },
  };

  // 风险状态配置
  const riskStatusConfig = {
    identified: { color: 'default', text: '已识别' },
    analyzing: { color: 'processing', text: '分析中' },
    mitigating: { color: 'warning', text: '缓解中' },
    resolved: { color: 'success', text: '已解决' },
  };

  // 风险分类配置
  const riskCategoryConfig = {
    technical: { color: 'blue', text: '技术风险' },
    schedule: { color: 'orange', text: '进度风险' },
    budget: { color: 'green', text: '预算风险' },
    quality: { color: 'purple', text: '质量风险' },
    resource: { color: 'red', text: '资源风险' },
  };

  // 风险趋势图
  const riskTrendOption = {
    title: {
      text: '风险趋势分析',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['新增风险', '解决风险', '累计风险'],
      bottom: 10
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']
    },
    yAxis: {
      type: 'value',
      name: '风险数量'
    },
    series: [
      {
        name: '新增风险',
        type: 'bar',
        data: [5, 8, 6, 9, 7, 10, 8, 12, 6],
        itemStyle: { color: '#ff4d4f' }
      },
      {
        name: '解决风险',
        type: 'bar',
        data: [3, 6, 4, 8, 5, 9, 7, 10, 8],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '累计风险',
        type: 'line',
        data: [5, 7, 9, 10, 12, 13, 14, 16, 14],
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  // 风险分布图
  const riskDistributionOption = {
    title: {
      text: '风险级别分布',
      left: 'center',
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '风险级别',
        type: 'pie',
        radius: '60%',
        data: [
          { value: riskSummary.critical, name: '严重', itemStyle: { color: '#ff4d4f' } },
          { value: riskSummary.high, name: '高', itemStyle: { color: '#fa8c16' } },
          { value: riskSummary.medium, name: '中', itemStyle: { color: '#fadb14' } },
          { value: riskSummary.low, name: '低', itemStyle: { color: '#1890ff' } },
        ]
      }
    ]
  };

  // 风险表格列
  const riskColumns = [
    {
      title: '风险标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Risk) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {riskLevelConfig[record.level].icon}
            <span style={{ marginLeft: '8px' }}>{text}</span>
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {record.description.length > 50 
              ? `${record.description.substring(0, 50)}...` 
              : record.description}
          </div>
        </div>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const config = riskLevelConfig[level as keyof typeof riskLevelConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => {
        const config = riskStatusConfig[status as keyof typeof riskStatusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => {
        const config = riskCategoryConfig[category as keyof typeof riskCategoryConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      width: 120,
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 80,
    },
    {
      title: '概率',
      dataIndex: 'probability',
      key: 'probability',
      width: 80,
      render: (probability: number) => (
        <Progress 
          percent={probability} 
          size="small"
          strokeColor={probability > 70 ? '#ff4d4f' : probability > 40 ? '#faad14' : '#52c41a'}
        />
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 100,
      render: (date: string) => {
        const isOverdue = new Date(date) < new Date();
        return (
          <span style={{ color: isOverdue ? '#ff4d4f' : 'inherit' }}>
            {date}
            {isOverdue && <WarningOutlined style={{ marginLeft: '4px', color: '#ff4d4f' }} />}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: Risk) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditRisk(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteRisk(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAddRisk = () => {
    setEditingRisk(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    form.setFieldsValue(risk);
    setIsModalVisible(true);
  };

  const handleDeleteRisk = (riskId: string) => {
    Modal.confirm({
      title: '确定要删除这个风险吗？',
      content: '删除后无法恢复',
      onOk() {
        setRisks(risks.filter(risk => risk.id !== riskId));
        message.success('风险删除成功');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRisk) {
        setRisks(risks.map(risk =>
          risk.id === editingRisk.id ? { ...risk, ...values } : risk
        ));
        message.success('风险更新成功');
      } else {
        const newRisk: Risk = {
          id: Date.now().toString(),
          ...values,
          createDate: new Date().toISOString().split('T')[0],
        };
        setRisks([...risks, newRisk]);
        message.success('风险添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getOverdueRisks = () => {
    return risks.filter(risk => 
      new Date(risk.dueDate) < new Date() && risk.status !== 'resolved'
    );
  };

  const getCriticalRisks = () => {
    return risks.filter(risk => risk.level === 'critical' && risk.status !== 'resolved');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2 style={{ margin: 0 }}>风险告警</h2>
          </Col>
          <Col>
            <Space>
              <Button icon={<BellOutlined />}>设置提醒</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRisk}>
                添加风险
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 风险统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="总风险数"
              value={riskSummary.total}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="严重风险"
              value={riskSummary.critical}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="高风险"
              value={riskSummary.high}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card>
            <Statistic
              title="已解决"
              value={riskSummary.resolved}
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card>
            <Statistic
              title="逾期风险"
              value={riskSummary.overdue}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card>
            <Statistic
              title="解决率"
              value={Math.round((riskSummary.resolved / riskSummary.total) * 100)}
              suffix="%"
              prefix={<BugOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 紧急告警 */}
      {getCriticalRisks().length > 0 && (
        <Alert
          message="紧急风险告警"
          description={`发现 ${getCriticalRisks().length} 个严重风险需要立即处理`}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" danger>
              立即处理
            </Button>
          }
        />
      )}

      {getOverdueRisks().length > 0 && (
        <Alert
          message="逾期风险提醒"
          description={`${getOverdueRisks().length} 个风险已超过处理期限`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small">
              查看详情
            </Button>
          }
        />
      )}

      {/* 图表分析 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={riskTrendOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={riskDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 风险列表 */}
      <Card title="风险列表">
        <Table
          columns={riskColumns}
          dataSource={risks}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.level === 'critical') return 'risk-critical-row';
            if (new Date(record.dueDate) < new Date() && record.status !== 'resolved') {
              return 'risk-overdue-row';
            }
            return '';
          }}
        />
      </Card>

      {/* 添加/编辑风险弹窗 */}
      <Modal
        title={editingRisk ? '编辑风险' : '添加风险'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            level: 'medium',
            status: 'identified',
            category: 'technical',
            probability: 50,
          }}
        >
          <Form.Item
            name="title"
            label="风险标题"
            rules={[{ required: true, message: '请输入风险标题' }]}
          >
            <Input placeholder="请输入风险标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="风险描述"
            rules={[{ required: true, message: '请输入风险描述' }]}
          >
            <TextArea rows={3} placeholder="请详细描述风险内容" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="level"
                label="风险级别"
                rules={[{ required: true, message: '请选择风险级别' }]}
              >
                <Select placeholder="请选择风险级别">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">严重</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="风险状态"
                rules={[{ required: true, message: '请选择风险状态' }]}
              >
                <Select placeholder="请选择风险状态">
                  <Option value="identified">已识别</Option>
                  <Option value="analyzing">分析中</Option>
                  <Option value="mitigating">缓解中</Option>
                  <Option value="resolved">已解决</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="风险分类"
                rules={[{ required: true, message: '请选择风险分类' }]}
              >
                <Select placeholder="请选择风险分类">
                  <Option value="technical">技术风险</Option>
                  <Option value="schedule">进度风险</Option>
                  <Option value="budget">预算风险</Option>
                  <Option value="quality">质量风险</Option>
                  <Option value="resource">资源风险</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="project"
                label="关联项目"
                rules={[{ required: true, message: '请输入关联项目' }]}
              >
                <Input placeholder="请输入关联项目" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="处理期限"
                rules={[{ required: true, message: '请选择处理期限' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="probability"
                label="发生概率"
                rules={[{ required: true, message: '请输入发生概率' }]}
              >
                <Input type="number" min={0} max={100} placeholder="0-100" addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="impact"
            label="影响描述"
            rules={[{ required: true, message: '请输入影响描述' }]}
          >
            <TextArea rows={2} placeholder="请描述风险可能带来的影响" />
          </Form.Item>

          <Form.Item
            name="mitigation"
            label="缓解措施"
          >
            <TextArea rows={3} placeholder="请描述风险缓解或应对措施" />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .risk-critical-row {
          background-color: #fff2f0;
        }
        .risk-overdue-row {
          background-color: #fffbe6;
        }
      `}</style>
    </div>
  );
};

export default RisksPage;