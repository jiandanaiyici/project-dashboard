import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Avatar, 
  Tag, 
  Tooltip,
  Progress,
  Modal,
  Form,
  Input,
  Switch,
  Alert,
  Divider,
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  EyeOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useMobileDetection } from '@/components/Mobile';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
  position: string;
  status: 'active' | 'busy' | 'leave' | 'offline';
  workload: number; // 工作负载百分比
  efficiency: number; // 效率评分
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  startDate: string;
  endDate: string;
  progress: number;
  priority: 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  project: string;
  dependencies?: string[]; // 依赖任务ID
}

interface GanttTimelineData {
  member: TeamMember;
  tasks: Task[];
}

const StaffGanttChart: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month').add(1, 'month'),
  ]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [form] = Form.useForm();
  const { isMobile } = useMobileDetection();

  // 团队成员数据
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: '张明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      department: '技术部',
      position: '高级前端工程师',
      status: 'active',
      workload: 85,
      efficiency: 92,
    },
    {
      id: '2',
      name: '李华',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      department: '技术部',
      position: '后端工程师',
      status: 'busy',
      workload: 95,
      efficiency: 88,
    },
    {
      id: '3',
      name: '王芳',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      department: '产品部',
      position: '产品经理',
      status: 'active',
      workload: 75,
      efficiency: 94,
    },
    {
      id: '4',
      name: '赵强',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
      department: '设计部',
      position: 'UI设计师',
      status: 'leave',
      workload: 0,
      efficiency: 0,
    },
    {
      id: '5',
      name: '刘敏',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu',
      department: '技术部',
      position: '测试工程师',
      status: 'active',
      workload: 68,
      efficiency: 90,
    },
  ];

  // 任务数据
  const tasksData: Task[] = [
    {
      id: 'task-1',
      title: '用户界面重构',
      assignee: '1',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      progress: 75,
      priority: 'high',
      status: 'in_progress',
      project: '项目管理平台',
    },
    {
      id: 'task-2',
      title: 'API接口开发',
      assignee: '2',
      startDate: '2024-03-05',
      endDate: '2024-03-20',
      progress: 60,
      priority: 'high',
      status: 'in_progress',
      project: '项目管理平台',
    },
    {
      id: 'task-3',
      title: '需求分析文档',
      assignee: '3',
      startDate: '2024-02-28',
      endDate: '2024-03-10',
      progress: 90,
      priority: 'medium',
      status: 'in_progress',
      project: '新产品规划',
    },
    {
      id: 'task-4',
      title: '视觉设计稿',
      assignee: '4',
      startDate: '2024-03-12',
      endDate: '2024-03-25',
      progress: 0,
      priority: 'medium',
      status: 'not_started',
      project: '移动端应用',
    },
    {
      id: 'task-5',
      title: '功能测试',
      assignee: '5',
      startDate: '2024-03-18',
      endDate: '2024-03-30',
      progress: 0,
      priority: 'high',
      status: 'not_started',
      project: '项目管理平台',
    },
  ];

  // 生成甘特图数据
  const generateGanttData = (): GanttTimelineData[] => {
    return teamMembers
      .filter(member => {
        if (selectedDepartment !== 'all' && member.department !== selectedDepartment) {
          return false;
        }
        if (filterStatus !== 'all' && member.status !== filterStatus) {
          return false;
        }
        return true;
      })
      .map(member => ({
        member,
        tasks: tasksData.filter(task => task.assignee === member.id),
      }));
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a';
      case 'busy': return '#fa8c16';
      case 'leave': return '#d9d9d9';
      case 'offline': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // 获取任务状态颜色
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return '#d9d9d9';
      case 'in_progress': return '#1890ff';
      case 'completed': return '#52c41a';
      case 'delayed': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#fa8c16';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 计算任务在时间轴上的位置
  const calculateTaskPosition = (task: Task) => {
    const startDate = dayjs(task.startDate);
    const endDate = dayjs(task.endDate);
    const rangeStart = selectedDateRange[0];
    const rangeEnd = selectedDateRange[1];
    
    const totalDays = rangeEnd.diff(rangeStart, 'day');
    const taskStartDays = startDate.diff(rangeStart, 'day');
    const taskDuration = endDate.diff(startDate, 'day') + 1;
    
    const left = Math.max(0, (taskStartDays / totalDays) * 100);
    const width = Math.min(100 - left, (taskDuration / totalDays) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  // 生成时间轴标题
  const generateTimelineHeaders = () => {
    const start = selectedDateRange[0];
    const end = selectedDateRange[1];
    const headers = [];
    
    if (viewMode === 'week') {
      let current = start.startOf('week');
      while (current.isBefore(end)) {
        headers.push({
          label: current.format('MM/DD'),
          date: current,
        });
        current = current.add(1, 'week');
      }
    } else {
      let current = start.startOf('day');
      while (current.isBefore(end)) {
        headers.push({
          label: current.format('MM/DD'),
          date: current,
        });
        current = current.add(1, 'day');
      }
    }
    
    return headers;
  };

  const ganttData = generateGanttData();
  const timelineHeaders = generateTimelineHeaders();

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '28px', fontWeight: 600 }}>
          人员云动甘特图
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>
          可视化展示团队成员工作安排和任务进度，优化资源配置
        </p>
      </div>

      {/* 控制面板 */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>时间范围</div>
            <RangePicker
              value={selectedDateRange}
              onChange={(dates) => setSelectedDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={4} md={3}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>视图模式</div>
            <Select
              value={viewMode}
              onChange={setViewMode}
              style={{ width: '100%' }}
            >
              <Option value="week">周视图</Option>
              <Option value="month">月视图</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4} md={3}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>部门</div>
            <Select
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: '100%' }}
            >
              <Option value="all">全部</Option>
              <Option value="技术部">技术部</Option>
              <Option value="产品部">产品部</Option>
              <Option value="设计部">设计部</Option>
            </Select>
          </Col>
          <Col xs={12} sm={4} md={3}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>状态</div>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            >
              <Option value="all">全部</Option>
              <Option value="active">活跃</Option>
              <Option value="busy">忙碌</Option>
              <Option value="leave">请假</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                新建任务
              </Button>
              <Button icon={<SettingOutlined />}>
                设置
              </Button>
              <Button icon={<FilterOutlined />}>
                筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 工作负载概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }}>
                <TeamOutlined />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
                {ganttData.length}
              </div>
              <div style={{ color: '#666' }}>活跃成员</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }}>
                <CalendarOutlined />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
                {tasksData.length}
              </div>
              <div style={{ color: '#666' }}>进行中任务</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '8px' }}>
                <ClockCircleOutlined />
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
                82%
              </div>
              <div style={{ color: '#666' }}>平均负载</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 甘特图主体 */}
      <Card 
        title="人员工作安排甘特图"
        style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div className="gantt-container" style={{ overflowX: 'auto' }}>
          {/* 时间轴头部 */}
          <div style={{ display: 'flex', marginBottom: '16px', minWidth: '800px' }}>
            <div style={{ width: '200px', padding: '8px', fontWeight: 600, borderBottom: '2px solid #f0f0f0' }}>
              团队成员
            </div>
            <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #f0f0f0' }}>
              {timelineHeaders.map((header, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#666',
                    borderRight: '1px solid #f0f0f0',
                  }}
                >
                  {header.label}
                </div>
              ))}
            </div>
          </div>

          {/* 甘特图内容 */}
          <div style={{ minWidth: '800px' }}>
            {ganttData.map((data, memberIndex) => (
              <div key={data.member.id} style={{ display: 'flex', marginBottom: '2px' }}>
                {/* 成员信息列 */}
                <div style={{ 
                  width: '200px', 
                  padding: '12px 8px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fafafa',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar src={data.member.avatar} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 500, 
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        {data.member.name}
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: getStatusColor(data.member.status),
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {data.member.position}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        负载: {data.member.workload}% | 效率: {data.member.efficiency}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 任务时间轴 */}
                <div style={{ 
                  flex: 1, 
                  position: 'relative',
                  height: '56px',
                  borderBottom: '1px solid #f0f0f0',
                  background: '#fff',
                }}>
                  {/* 时间网格线 */}
                  {timelineHeaders.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${(index / timelineHeaders.length) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        background: '#f0f0f0',
                      }}
                    />
                  ))}

                  {/* 任务条 */}
                  {data.tasks.map((task, taskIndex) => {
                    const position = calculateTaskPosition(task);
                    return (
                      <Tooltip
                        key={task.id}
                        title={
                          <div>
                            <div style={{ fontWeight: 600 }}>{task.title}</div>
                            <div>项目: {task.project}</div>
                            <div>进度: {task.progress}%</div>
                            <div>时间: {task.startDate} ~ {task.endDate}</div>
                          </div>
                        }
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: position.left,
                            width: position.width,
                            height: '20px',
                            top: `${8 + taskIndex * 24}px`,
                            background: getTaskStatusColor(task.status),
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px',
                            fontSize: '11px',
                            color: '#fff',
                            fontWeight: 500,
                            overflow: 'hidden',
                            border: `2px solid ${getPriorityColor(task.priority)}`,
                          }}
                          onClick={() => {
                            setSelectedMember(data.member);
                            setTaskModalVisible(true);
                          }}
                        >
                          <div style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            flex: 1,
                          }}>
                            {task.title}
                          </div>
                          <div style={{ marginLeft: '4px', fontSize: '10px' }}>
                            {task.progress}%
                          </div>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>任务状态:</span>
            <Space size="small">
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#d9d9d9', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px' }}>未开始</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#1890ff', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px' }}>进行中</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#52c41a', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px' }}>已完成</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '12px', height: '12px', background: '#ff4d4f', borderRadius: '2px' }} />
                <span style={{ fontSize: '12px' }}>延期</span>
              </div>
            </Space>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>优先级:</span>
            <Space size="small">
              <Tag color="#ff4d4f">高</Tag>
              <Tag color="#fa8c16">中</Tag>
              <Tag color="#52c41a">低</Tag>
            </Space>
          </div>
        </div>
      </Card>

      {/* 任务详情模态框 */}
      <Modal
        title="任务详情"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedMember && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <Avatar src={selectedMember.avatar} size={48} />
              <div>
                <h4 style={{ margin: 0 }}>{selectedMember.name}</h4>
                <p style={{ margin: 0, color: '#666' }}>
                  {selectedMember.position} · {selectedMember.department}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center', color: '#666' }}>
              点击任务条可查看具体任务详情...
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffGanttChart;