import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Calendar,
  Badge,
  List,
  Avatar,
  Progress,
  Statistic,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Timeline,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'event';
}

const WorkspacePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成登录模块开发',
      description: '实现用户登录、注册、密码找回功能',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-10-15',
      project: '项目管理平台',
      estimatedHours: 16,
      actualHours: 12,
    },
    {
      id: '2',
      title: '设计数据库表结构',
      description: '设计用户表、项目表、任务表等核心数据结构',
      status: 'done',
      priority: 'high',
      dueDate: '2024-10-10',
      project: '项目管理平台',
      estimatedHours: 8,
      actualHours: 8,
    },
    {
      id: '3',
      title: '编写API接口文档',
      description: '编写用户管理、项目管理相关API接口文档',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-10-20',
      project: '项目管理平台',
      estimatedHours: 12,
    },
    {
      id: '4',
      title: '性能优化',
      description: '优化查询性能，减少接口响应时间',
      status: 'todo',
      priority: 'low',
      dueDate: '2024-10-25',
      project: 'API服务重构',
      estimatedHours: 20,
    },
  ]);

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: '项目评审会议',
      date: '2024-10-15',
      time: '14:00',
      type: 'meeting',
    },
    {
      id: '2',
      title: '需求分析截止',
      date: '2024-10-16',
      time: '18:00',
      type: 'deadline',
    },
    {
      id: '3',
      title: '团队建设活动',
      date: '2024-10-18',
      time: '15:00',
      type: 'event',
    },
  ]);

  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm] = Form.useForm();
  const [eventForm] = Form.useForm();

  // 计算统计数据
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    in_progress: tasks.filter(task => task.status === 'in_progress').length,
    done: tasks.filter(task => task.status === 'done').length,
  };

  const completionRate = Math.round((taskStats.done / taskStats.total) * 100);

  // 工作效率图表数据
  const workEfficiencyOption = {
    title: {
      text: '本周工作效率',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      name: '小时'
    },
    series: [
      {
        name: '计划工时',
        type: 'bar',
        data: [8, 8, 8, 8, 8, 4, 0],
        itemStyle: { color: '#91caff' }
      },
      {
        name: '实际工时',
        type: 'bar',
        data: [7.5, 8.2, 7.8, 8.5, 7.2, 3.5, 0],
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  // 任务分布图表数据
  const taskDistributionOption = {
    title: {
      text: '任务分布',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: taskStats.todo, name: '待处理', itemStyle: { color: '#faad14' } },
          { value: taskStats.in_progress, name: '进行中', itemStyle: { color: '#1890ff' } },
          { value: taskStats.done, name: '已完成', itemStyle: { color: '#52c41a' } },
        ]
      }
    ]
  };

  // 任务优先级配置
  const priorityConfig = {
    high: { color: 'red', text: '高' },
    medium: { color: 'orange', text: '中' },
    low: { color: 'blue', text: '低' },
  };

  // 任务状态配置
  const statusConfig = {
    todo: { color: 'default', text: '待处理', icon: <ClockCircleOutlined /> },
    in_progress: { color: 'processing', text: '进行中', icon: <ExclamationCircleOutlined /> },
    done: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
  };

  // 获取日历数据
  const getListData = (value: dayjs.Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const events = scheduleEvents.filter(event => event.date === dateStr);
    return events.map(event => ({
      type: event.type === 'meeting' ? 'warning' : event.type === 'deadline' ? 'error' : 'success',
      content: event.title,
    }));
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const handleTaskSubmit = (values: any) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...values, id: editingTask.id } : task
      ));
      message.success('任务更新成功');
    } else {
      const newTask: Task = {
        ...values,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
      message.success('任务添加成功');
    }
    setIsTaskModalVisible(false);
    setEditingTask(null);
    taskForm.resetFields();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    taskForm.setFieldsValue(task);
    setIsTaskModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    message.success('任务删除成功');
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={taskStats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="待处理"
              value={taskStats.todo}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={taskStats.in_progress}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="完成率"
              value={completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表和任务列表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="工作效率统计" style={{ height: '400px' }}>
            <ReactECharts option={workEfficiencyOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="任务分布" style={{ height: '400px' }}>
            <ReactECharts option={taskDistributionOption} style={{ height: '300px' }} />
          </Card>
        </Col>
      </Row>

      {/* 任务列表和日历 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card 
            title="我的任务" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsTaskModalVisible(true)}
              >
                添加任务
              </Button>
            }
          >
            <List
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => handleEditTask(task)}>编辑</Button>,
                    <Button type="link" danger onClick={() => handleDeleteTask(task.id)}>删除</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={statusConfig[task.status].icon} />}
                    title={
                      <div>
                        <span style={{ marginRight: 8 }}>{task.title}</span>
                        <Tag color={priorityConfig[task.priority].color}>
                          {priorityConfig[task.priority].text}优先级
                        </Tag>
                        <Tag color={statusConfig[task.status].color}>
                          {statusConfig[task.status].text}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{task.description}</div>
                        <div style={{ marginTop: 4, color: '#666' }}>
                          项目：{task.project} | 截止：{task.dueDate}
                          {task.estimatedHours && (
                            <span> | 预估：{task.estimatedHours}h</span>
                          )}
                          {task.actualHours && (
                            <span> | 实际：{task.actualHours}h</span>
                          )}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="日程安排">
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
            />
          </Card>
        </Col>
      </Row>

      {/* 任务模态框 */}
      <Modal
        title={editingTask ? '编辑任务' : '添加任务'}
        open={isTaskModalVisible}
        onCancel={() => {
          setIsTaskModalVisible(false);
          setEditingTask(null);
          taskForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={taskForm}
          onFinish={handleTaskSubmit}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="todo">待处理</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="done">已完成</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="project"
            label="所属项目"
            rules={[{ required: true, message: '请输入所属项目' }]}
          >
            <Input placeholder="请输入所属项目" />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="截止日期"
            rules={[{ required: true, message: '请选择截止日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="estimatedHours"
            label="预估工时"
          >
            <Input type="number" placeholder="预估工时（小时）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {editingTask ? '更新' : '添加'}
            </Button>
            <Button onClick={() => {
              setIsTaskModalVisible(false);
              setEditingTask(null);
              taskForm.resetFields();
            }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkspacePage;