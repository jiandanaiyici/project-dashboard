import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Progress,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Tooltip,
  Avatar,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CalendarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget?: number;
  members: string[];
  manager: string;
  createTime: string;
}

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: '项目管理平台',
      description: '开发一个全功能的项目管理平台，包含人员管理、项目跟踪、风险控制等功能',
      status: 'in_progress',
      priority: 'high',
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 500000,
      members: ['张三', '李四', '王五'],
      manager: '项目经理A',
      createTime: '2024-01-01',
    },
    {
      id: '2',
      name: '移动端应用开发',
      description: '开发配套的移动端应用，支持iOS和Android平台',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      budget: 300000,
      members: ['赵六', '钱七'],
      manager: '项目经理B',
      createTime: '2024-02-15',
    },
    {
      id: '3',
      name: 'API服务重构',
      description: '重构现有API服务，提升性能和稳定性',
      status: 'in_progress',
      priority: 'critical',
      progress: 60,
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      budget: 200000,
      members: ['孙八', '周九', '吴十'],
      manager: '项目经理C',
      createTime: '2024-01-20',
    },
  ]);

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  // 筛选项目
  const filterProjects = () => {
    let filtered = projects;

    if (searchText) {
      filtered = filtered.filter(
        project =>
          project.name.includes(searchText) ||
          project.description.includes(searchText) ||
          project.manager.includes(searchText)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    setFilteredProjects(filtered);
  };

  React.useEffect(() => {
    filterProjects();
  }, [searchText, statusFilter, priorityFilter, projects]);

  const statusConfig = {
    planning: { color: 'blue', text: '计划中' },
    in_progress: { color: 'processing', text: '进行中' },
    on_hold: { color: 'warning', text: '暂停' },
    completed: { color: 'success', text: '已完成' },
    cancelled: { color: 'error', text: '已取消' },
  };

  const priorityConfig = {
    low: { color: 'default', text: '低' },
    medium: { color: 'blue', text: '中' },
    high: { color: 'orange', text: '高' },
    critical: { color: 'red', text: '紧急' },
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {record.description.length > 50
              ? `${record.description.substring(0, 50)}...`
              : record.description}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      ),
    },
    {
      title: '时间',
      key: 'time',
      width: 180,
      render: (record: Project) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            开始: {record.startDate}
          </div>
          <div style={{ fontSize: '12px' }}>
            结束: {record.endDate}
          </div>
        </div>
      ),
    },
    {
      title: '团队',
      key: 'team',
      width: 150,
      render: (record: Project) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <Avatar.Group size="small" maxCount={3}>
              {record.members.map((member, index) => (
                <Avatar key={index} style={{ backgroundColor: '#87d068' }}>
                  {member[0]}
                </Avatar>
              ))}
            </Avatar.Group>
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            负责人: {record.manager}
          </div>
        </div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      render: (budget: number) => (
        budget ? `¥${(budget / 10000).toFixed(1)}万` : '-'
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (record: Project) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.setFieldsValue({
      ...project,
      dateRange: [moment(project.startDate), moment(project.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确定要删除这个项目吗？',
      content: '删除后无法恢复',
      onOk() {
        setProjects(projects.filter(project => project.id !== id));
        message.success('项目删除成功');
      },
    });
  };

  const handleViewDetail = (project: Project) => {
    history.push(`/projects/detail/${project.id}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { dateRange, ...otherValues } = values;
      
      const projectData = {
        ...otherValues,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      if (editingProject) {
        // 编辑项目
        setProjects(projects.map(project => 
          project.id === editingProject.id 
            ? { ...project, ...projectData }
            : project
        ));
        message.success('项目更新成功');
      } else {
        // 添加项目
        const newProject: Project = {
          id: Date.now().toString(),
          ...projectData,
          progress: 0,
          createTime: new Date().toISOString().split('T')[0],
        };
        setProjects([...projects, newProject]);
        message.success('项目创建成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索项目名称、描述、负责人"
                allowClear
                onSearch={setSearchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="项目状态"
                allowClear
                style={{ width: '100%' }}
                onChange={setStatusFilter}
              >
                <Option value="planning">计划中</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="on_hold">暂停</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="优先级"
                allowClear
                style={{ width: '100%' }}
                onChange={setPriorityFilter}
              >
                <Option value="low">低</Option>
                <Option value="medium">中</Option>
                <Option value="high">高</Option>
                <Option value="critical">紧急</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  创建项目
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 添加/编辑项目弹窗 */}
      <Modal
        title={editingProject ? '编辑项目' : '创建项目'}
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
            status: 'planning',
            priority: 'medium',
            progress: 0,
          }}
        >
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
                label="项目负责人"
                rules={[{ required: true, message: '请输入项目负责人' }]}
              >
                <Input placeholder="请输入项目负责人" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea 
              rows={3}
              placeholder="请输入项目描述" 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="status"
                label="项目状态"
                rules={[{ required: true, message: '请选择项目状态' }]}
              >
                <Select placeholder="请选择项目状态">
                  <Option value="planning">计划中</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="on_hold">暂停</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="critical">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="budget"
                label="项目预算"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预算金额"
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="项目时间"
                rules={[{ required: true, message: '请选择项目时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="members"
                label="团队成员"
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="请输入团队成员，按回车添加"
                  tokenSeparators={[',']}
                />
              </Form.Item>
            </Col>
          </Row>

          {editingProject && (
            <Form.Item
              name="progress"
              label="项目进度"
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: '100%' }}
                formatter={value => `${value}%`}
                parser={value => value!.replace('%', '')}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectListPage;