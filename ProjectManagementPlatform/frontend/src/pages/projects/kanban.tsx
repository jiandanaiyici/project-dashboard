import React, { useState, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Progress,
  Space,
  Popover,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  BugOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: {
    id: string;
    name: string;
    avatar: string;
  };
  startDate?: string;
  endDate?: string;
  progress: number;
  estimatedHours?: number;
  tags: string[];
  project: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  icon: React.ReactNode;
}

const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({
    'task-1': {
      id: 'task-1',
      title: '用户登录功能开发',
      description: '实现用户登录、注册、密码找回功能，包含前端界面和后端API',
      status: 'todo',
      priority: 'high',
      assignee: {
        id: '1',
        name: '张三',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      progress: 0,
      estimatedHours: 40,
      tags: ['前端', '后端', 'API'],
      project: '项目管理平台',
    },
    'task-2': {
      id: 'task-2',
      title: '数据库设计',
      description: '设计用户表、项目表、任务表等核心数据结构',
      status: 'in_progress',
      priority: 'critical',
      assignee: {
        id: '2',
        name: '李四',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      startDate: '2024-09-15',
      endDate: '2024-10-01',
      progress: 75,
      estimatedHours: 24,
      tags: ['数据库', '设计'],
      project: '项目管理平台',
    },
    'task-3': {
      id: 'task-3',
      title: '项目文档编写',
      description: '编写项目需求文档、设计文档、API文档',
      status: 'review',
      priority: 'medium',
      assignee: {
        id: '3',
        name: '王五',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      startDate: '2024-09-01',
      endDate: '2024-09-30',
      progress: 90,
      estimatedHours: 16,
      tags: ['文档'],
      project: '项目管理平台',
    },
    'task-4': {
      id: 'task-4',
      title: '代码审查',
      description: '对已完成的代码进行审查，确保代码质量',
      status: 'done',
      priority: 'low',
      assignee: {
        id: '4',
        name: '赵六',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
      startDate: '2024-09-20',
      endDate: '2024-09-25',
      progress: 100,
      estimatedHours: 8,
      tags: ['代码审查'],
      project: '项目管理平台',
    },
    'task-5': {
      id: 'task-5',
      title: 'UI界面设计',
      description: '设计项目管理平台的用户界面，包含原型图和视觉设计',
      status: 'in_progress',
      priority: 'high',
      assignee: {
        id: '5',
        name: '钱七',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      startDate: '2024-09-10',
      endDate: '2024-10-10',
      progress: 60,
      estimatedHours: 32,
      tags: ['UI', '设计'],
      project: '项目管理平台',
    },
  });

  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    'column-1': {
      id: 'column-1',
      title: '待开始',
      taskIds: ['task-1'],
      color: '#f0f0f0',
      icon: <ClockCircleOutlined />,
    },
    'column-2': {
      id: 'column-2',
      title: '进行中',
      taskIds: ['task-2', 'task-5'],
      color: '#e6f7ff',
      icon: <ExclamationCircleOutlined />,
    },
    'column-3': {
      id: 'column-3',
      title: '待审核',
      taskIds: ['task-3'],
      color: '#fff7e6',
      icon: <BugOutlined />,
    },
    'column-4': {
      id: 'column-4',
      title: '已完成',
      taskIds: ['task-4'],
      color: '#f6ffed',
      icon: <CheckCircleOutlined />,
    },
  });

  const [columnOrder, setColumnOrder] = useState(['column-1', 'column-2', 'column-3', 'column-4']);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const priorityConfig = {
    low: { color: 'default', text: '低' },
    medium: { color: 'blue', text: '中' },
    high: { color: 'orange', text: '高' },
    critical: { color: 'red', text: '紧急' },
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#52c41a';
    if (progress >= 70) return '#1890ff';
    if (progress >= 30) return '#faad14';
    return '#ff4d4f';
  };

  const onDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    // Update task status based on column
    const statusMap: { [key: string]: 'todo' | 'in_progress' | 'review' | 'done' } = {
      'column-1': 'todo',
      'column-2': 'in_progress',
      'column-3': 'review',
      'column-4': 'done',
    };

    const updatedTasks = {
      ...tasks,
      [draggableId]: {
        ...tasks[draggableId],
        status: statusMap[destination.droppableId],
      },
    };

    setTasks(updatedTasks);
    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    message.success(`任务已移动到${finish.title}`);
  }, [columns, tasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      assigneeId: task.assignee.id,
      startDate: task.startDate ? moment(task.startDate) : null,
      endDate: task.endDate ? moment(task.endDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    Modal.confirm({
      title: '确定要删除这个任务吗？',
      content: '删除后无法恢复',
      onOk() {
        // Remove task from tasks
        const newTasks = { ...tasks };
        delete newTasks[taskId];
        setTasks(newTasks);

        // Remove task from columns
        const newColumns = { ...columns };
        Object.keys(newColumns).forEach(columnId => {
          newColumns[columnId] = {
            ...newColumns[columnId],
            taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId),
          };
        });
        setColumns(newColumns);

        message.success('任务删除成功');
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const taskData = {
        ...values,
        assignee: {
          id: values.assigneeId,
          name: getAssigneeName(values.assigneeId),
          avatar: `https://randomuser.me/api/portraits/men/${values.assigneeId}.jpg`,
        },
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
        tags: values.tags || [],
      };

      if (editingTask) {
        // Update existing task
        setTasks({
          ...tasks,
          [editingTask.id]: {
            ...editingTask,
            ...taskData,
          },
        });
        message.success('任务更新成功');
      } else {
        // Add new task
        const newTaskId = `task-${Date.now()}`;
        const newTask: Task = {
          id: newTaskId,
          ...taskData,
          status: 'todo',
          progress: 0,
          project: '项目管理平台',
        };

        setTasks({
          ...tasks,
          [newTaskId]: newTask,
        });

        // Add to first column (待开始)
        setColumns({
          ...columns,
          'column-1': {
            ...columns['column-1'],
            taskIds: [...columns['column-1'].taskIds, newTaskId],
          },
        });

        message.success('任务创建成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getAssigneeName = (id: string) => {
    const names = ['张三', '李四', '王五', '赵六', '钱七'];
    return names[parseInt(id) - 1] || '未知';
  };

  const TaskCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '8px',
          }}
        >
          <Card
            size="small"
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
              transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            }}
            bodyStyle={{ padding: '12px' }}
            actions={[
              <Tooltip title="编辑">
                <EditOutlined onClick={() => handleEditTask(task)} />
              </Tooltip>,
              <Tooltip title="删除">
                <DeleteOutlined onClick={() => handleDeleteTask(task.id)} />
              </Tooltip>,
              <Popover
                content={
                  <div style={{ maxWidth: '200px' }}>
                    <p><strong>描述：</strong>{task.description}</p>
                    <p><strong>项目：</strong>{task.project}</p>
                    {task.startDate && <p><strong>开始：</strong>{task.startDate}</p>}
                    {task.endDate && <p><strong>结束：</strong>{task.endDate}</p>}
                    {task.estimatedHours && <p><strong>预估：</strong>{task.estimatedHours}小时</p>}
                  </div>
                }
                title="任务详情"
                trigger="click"
              >
                <MoreOutlined />
              </Popover>,
            ]}
          >
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {task.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                {task.description.length > 60 
                  ? `${task.description.substring(0, 60)}...` 
                  : task.description}
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <Space wrap>
                <Tag color={priorityConfig[task.priority].color} size="small">
                  {priorityConfig[task.priority].text}
                </Tag>
                {task.tags.map(tag => (
                  <Tag key={tag} size="small">{tag}</Tag>
                ))}
              </Space>
            </div>

            {task.progress > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <Progress
                  percent={task.progress}
                  size="small"
                  strokeColor={getProgressColor(task.progress)}
                  showInfo={false}
                />
                <div style={{ fontSize: '11px', color: '#666', textAlign: 'right' }}>
                  {task.progress}%
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Avatar
                src={task.assignee.avatar}
                size="small"
                icon={<UserOutlined />}
              />
              {task.endDate && (
                <div style={{ fontSize: '11px', color: '#666' }}>
                  <CalendarOutlined style={{ marginRight: '2px' }} />
                  {task.endDate}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const Column: React.FC<{ column: Column }> = ({ column }) => (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            {column.icon}
            <span>{column.title}</span>
            <Badge count={column.taskIds.length} style={{ backgroundColor: '#52c41a' }} />
          </Space>
        </div>
      }
      style={{
        backgroundColor: column.color,
        height: 'calc(100vh - 200px)',
        overflow: 'hidden',
      }}
      bodyStyle={{
        padding: '16px',
        height: 'calc(100% - 70px)',
        overflow: 'auto',
      }}
    >
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: '100%',
              backgroundColor: snapshot.isDraggingOver ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
              borderRadius: '8px',
              padding: snapshot.isDraggingOver ? '8px' : '0',
              transition: 'all 0.2s ease',
            }}
          >
            {column.taskIds.map((taskId, index) => (
              <TaskCard
                key={taskId}
                task={tasks[taskId]}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>任务看板</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask}>
          添加任务
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {columnOrder.map(columnId => (
            <Col key={columnId} span={6}>
              <Column column={columns[columnId]} />
            </Col>
          ))}
        </Row>
      </DragDropContext>

      {/* 添加/编辑任务弹窗 */}
      <Modal
        title={editingTask ? '编辑任务' : '添加任务'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: 'medium',
            progress: 0,
          }}
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
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assigneeId"
                label="负责人"
                rules={[{ required: true, message: '请选择负责人' }]}
              >
                <Select placeholder="请选择负责人">
                  <Option value="1">张三</Option>
                  <Option value="2">李四</Option>
                  <Option value="3">王五</Option>
                  <Option value="4">赵六</Option>
                  <Option value="5">钱七</Option>
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
              <Form.Item name="startDate" label="开始时间">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="结束时间">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="estimatedHours" label="预估工时">
                <Input type="number" placeholder="小时" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="progress" label="完成进度">
                <Input type="number" min={0} max={100} placeholder="0-100" addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入标签，按回车添加"
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanPage;