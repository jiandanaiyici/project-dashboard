import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Progress,
  Tag,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Avatar,
  List,
  Tabs,
  Statistic,
  Space,
  message,
  Popconfirm,
} from 'antd';
import {
  EditOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useParams, history } from 'umi';
import { ReactECharts } from 'echarts-for-react';
import moment from 'moment';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  startDate: string;
  endDate: string;
  progress: number;
  estimatedHours: number;
  actualHours: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  joinDate: string;
  taskCount: number;
}

interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  actualCost: number;
  manager: string;
  createTime: string;
  tags: string[];
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const [project, setProject] = useState<ProjectDetail>({
    id: '1',
    name: '项目管理平台',
    description: '开发一个全功能的项目管理平台，包含人员管理、项目跟踪、风险控制等功能。',
    status: 'in_progress',
    priority: 'high',
    progress: 75,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 500000,
    actualCost: 375000,
    manager: '项目经理A',
    createTime: '2024-01-01',
    tags: ['React', 'TypeScript', 'Ant Design', 'Node.js'],
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '需求分析',
      description: '收集和分析项目需求，制定功能规格说明书',
      status: 'done',
      priority: 'high',
      assignee: '张三',
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      progress: 100,
      estimatedHours: 40,
      actualHours: 38,
    },
    {
      id: '2',
      title: '前端开发',
      description: '开发用户界面和交互功能',
      status: 'in_progress',
      priority: 'high',
      assignee: '王五',
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      progress: 75,
      estimatedHours: 200,
      actualHours: 150,
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: '张三',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: '产品经理',
      email: 'zhangsan@example.com',
      joinDate: '2024-01-01',
      taskCount: 3,
    },
    {
      id: '2',
      name: '王五',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      role: '前端工程师',
      email: 'wangwu@example.com',
      joinDate: '2024-01-01',
      taskCount: 4,
    },
  ]);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm] = Form.useForm();

  // 配置对象
  const taskStatusConfig = {
    todo: { color: 'default', text: '待开始', icon: <ClockCircleOutlined /> },
    in_progress: { color: 'processing', text: '进行中', icon: <ExclamationCircleOutlined /> },
    review: { color: 'warning', text: '待审核' },
    done: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
  };

  const priorityConfig = {
    low: { color: 'default', text: '低' },
    medium: { color: 'blue', text: '中' },
    high: { color: 'orange', text: '高' },
    critical: { color: 'red', text: '紧急' },
  };

  const statusConfig = {
    planning: { color: 'blue', text: '计划中' },
    in_progress: { color: 'processing', text: '进行中' },
    on_hold: { color: 'warning', text: '暂停' },
    completed: { color: 'success', text: '已完成' },
    cancelled: { color: 'error', text: '已取消' },
  };

  // 任务表格列定义
  const taskColumns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
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
        const config = taskStatusConfig[status as keyof typeof taskStatusConfig];
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
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
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 100,
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: Task) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTask(record)}
          />
          <Popconfirm
            title="确定要删除这个任务吗？"
            onConfirm={() => handleDeleteTask(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    taskForm.setFieldsValue({
      ...task,
      startDate: moment(task.startDate),
      endDate: moment(task.endDate),
    });
    setIsTaskModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    message.success('任务删除成功');
  };

  const handleAddTask = () => {
    setEditingTask(null);
    taskForm.resetFields();
    setIsTaskModalVisible(true);
  };

  const handleTaskModalOk = async () => {
    try {
      const values = await taskForm.validateFields();
      const taskData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };

      if (editingTask) {
        setTasks(tasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        ));
        message.success('任务更新成功');
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          ...taskData,
          progress: 0,
        };
        setTasks([...tasks, newTask]);
        message.success('任务创建成功');
      }

      setIsTaskModalVisible(false);
      taskForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.goBack()}
          style={{ marginBottom: '16px' }}
        >
          返回项目列表
        </Button>
        
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center">
              <h2 style={{ margin: 0 }}>{project.name}</h2>
              <Tag color={statusConfig[project.status].color}>
                {statusConfig[project.status].text}
              </Tag>
              <Tag color={priorityConfig[project.priority].color}>
                {priorityConfig[project.priority].text}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<EditOutlined />}>编辑项目</Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
                添加任务
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 项目概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="项目进度"
              value={project.progress}
              suffix="%"
              valueStyle={{ color: project.progress > 70 ? '#3f8600' : '#cf1322' }}
            />
            <Progress percent={project.progress} showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="预算使用"
              value={((project.actualCost / project.budget) * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              已用: ¥{(project.actualCost / 10000).toFixed(1)}万
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={teamMembers.length}
              suffix="人"
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="任务总数"
              value={tasks.length}
              suffix="个"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        {/* 项目信息 */}
        <TabPane tab="项目信息" key="1">
          <Card>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="项目名称">{project.name}</Descriptions.Item>
              <Descriptions.Item label="项目经理">{project.manager}</Descriptions.Item>
              <Descriptions.Item label="项目状态">
                <Tag color={statusConfig[project.status].color}>
                  {statusConfig[project.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={priorityConfig[project.priority].color}>
                  {priorityConfig[project.priority].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="开始时间">{project.startDate}</Descriptions.Item>
              <Descriptions.Item label="结束时间">{project.endDate}</Descriptions.Item>
              <Descriptions.Item label="项目预算">¥{(project.budget / 10000).toFixed(1)}万</Descriptions.Item>
              <Descriptions.Item label="实际成本">¥{(project.actualCost / 10000).toFixed(1)}万</Descriptions.Item>
              <Descriptions.Item label="技术栈">
                {project.tags.map(tag => (
                  <Tag key={tag} color="blue">{tag}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="项目描述" span={2}>
                {project.description}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>

        {/* 任务管理 */}
        <TabPane tab="任务管理" key="2">
          <Card>
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </Card>
        </TabPane>

        {/* 团队成员 */}
        <TabPane tab="团队成员" key="3">
          <Card>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
              dataSource={teamMembers}
              renderItem={(member) => (
                <List.Item>
                  <Card size="small">
                    <Card.Meta
                      avatar={<Avatar src={member.avatar} size={48} />}
                      title={member.name}
                      description={
                        <div>
                          <div>{member.role}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {member.email}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            任务数: {member.taskCount}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加/编辑任务弹窗 */}
      <Modal
        title={editingTask ? '编辑任务' : '添加任务'}
        open={isTaskModalVisible}
        onOk={handleTaskModalOk}
        onCancel={() => {
          setIsTaskModalVisible(false);
          taskForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={taskForm}
          layout="vertical"
          initialValues={{
            status: 'todo',
            priority: 'medium',
            progress: 0,
          }}
        >
          <Form.Item
            name="title"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignee"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select placeholder="请选择负责人">
                  {teamMembers.map(member => (
                    <Option key={member.id} value={member.name}>
                      {member.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
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
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始时间"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束时间"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="estimatedHours"
                label="预估工时"
              >
                <Input type="number" placeholder="小时" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="actualHours"
                label="实际工时"
              >
                <Input type="number" placeholder="小时" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetailPage;