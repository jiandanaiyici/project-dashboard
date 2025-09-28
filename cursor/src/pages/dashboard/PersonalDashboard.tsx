import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  List, 
  Tag, 
  Button, 
  Space, 
  Avatar,
  Badge,
  Timeline,
  Tabs,
  Select,
  DatePicker,
  Input
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileTextOutlined,
  BellOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const PersonalDashboard: React.FC = () => {
  const [personalStats, setPersonalStats] = useState({
    totalTasks: 25,
    completedTasks: 18,
    inProgressTasks: 5,
    overdueTasks: 2,
    efficiency: 85.2,
    qualityScore: 4.3,
    teamCollaboration: 4.5,
    knowledgeSharing: 4.1
  });

  const [myProjects, setMyProjects] = useState([
    {
      id: 1,
      name: '电商平台重构',
      role: '项目经理',
      progress: 75,
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-03-31',
      teamSize: 8
    },
    {
      id: 2,
      name: '移动端开发',
      role: '技术负责人',
      progress: 45,
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-04-30',
      teamSize: 6
    },
    {
      id: 3,
      name: '数据分析平台',
      role: '前端开发',
      progress: 100,
      status: 'completed',
      priority: 'low',
      dueDate: '2024-01-31',
      teamSize: 5
    }
  ]);

  const [myTasks, setMyTasks] = useState([
    {
      id: 1,
      title: '完成用户需求分析',
      project: '电商平台重构',
      priority: 'high',
      dueDate: '2024-01-20',
      status: 'in_progress',
      progress: 80
    },
    {
      id: 2,
      title: '技术架构设计评审',
      project: '移动端开发',
      priority: 'medium',
      dueDate: '2024-01-22',
      status: 'pending',
      progress: 0
    },
    {
      id: 3,
      title: '代码审查',
      project: '数据分析平台',
      priority: 'low',
      dueDate: '2024-01-18',
      status: 'completed',
      progress: 100
    }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'task',
      title: '完成了用户需求分析任务',
      time: '2024-01-15 14:30:00',
      status: 'success'
    },
    {
      id: 2,
      type: 'project',
      title: '电商平台重构项目进度更新',
      time: '2024-01-15 10:20:00',
      status: 'info'
    },
    {
      id: 3,
      type: 'meeting',
      title: '参加了项目评审会议',
      time: '2024-01-14 16:00:00',
      status: 'warning'
    },
    {
      id: 4,
      type: 'evaluation',
      title: '完成了团队成员评价',
      time: '2024-01-14 09:15:00',
      status: 'success'
    }
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: '任务完成专家',
      description: '完成50个以上任务',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      unlocked: true
    },
    {
      id: 2,
      title: '团队协作之星',
      description: '团队协作评分4.5+',
      icon: <TeamOutlined />,
      color: '#1890ff',
      unlocked: true
    },
    {
      id: 3,
      title: '效率达人',
      description: '任务完成率90%+',
      icon: <TrophyOutlined />,
      color: '#faad14',
      unlocked: true
    },
    {
      id: 4,
      title: '知识分享者',
      description: '分享知识给团队成员',
      icon: <FileTextOutlined />,
      color: '#722ed1',
      unlocked: false
    }
  ]);

  const [performanceData, setPerformanceData] = useState([
    { name: '任务完成率', value: 85.2, max: 100, unit: '%' },
    { name: '质量评分', value: 4.3, max: 5, unit: '分' },
    { name: '团队协作', value: 4.5, max: 5, unit: '分' },
    { name: '知识分享', value: 4.1, max: 5, unit: '分' }
  ]);

  const [taskTrend, setTaskTrend] = useState([
    { date: '2024-01-01', value: 5, category: '完成任务' },
    { date: '2024-01-02', value: 3, category: '完成任务' },
    { date: '2024-01-03', value: 7, category: '完成任务' },
    { date: '2024-01-04', value: 4, category: '完成任务' },
    { date: '2024-01-05', value: 6, category: '完成任务' }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      completed: { color: 'green', text: '已完成' },
      in_progress: { color: 'blue', text: '进行中' },
      pending: { color: 'orange', text: '待开始' },
      overdue: { color: 'red', text: '已逾期' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      high: { color: 'red', text: '高' },
      medium: { color: 'orange', text: '中' },
      low: { color: 'green', text: '低' }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getActivityIcon = (type: string) => {
    const iconConfig = {
      task: <CheckCircleOutlined />,
      project: <ProjectOutlined />,
      meeting: <CalendarOutlined />,
      evaluation: <TrophyOutlined />
    };
    return iconConfig[type as keyof typeof iconConfig] || <UserOutlined />;
  };

  const getActivityColor = (status: string) => {
    const colorConfig = {
      success: '#52c41a',
      info: '#1890ff',
      warning: '#faad14',
      error: '#f5222d'
    };
    return colorConfig[status as keyof typeof colorConfig] || '#666';
  };

  return (
    <div className="personal-dashboard">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2>个人工作台</h2>
                <p style={{ color: '#666', margin: 0 }}>欢迎回来，张三！今天是2024年1月15日</p>
              </div>
              <Space>
                <Select placeholder="选择时间范围" style={{ width: 120 }}>
                  <Option value="today">今天</Option>
                  <Option value="week">本周</Option>
                  <Option value="month">本月</Option>
                </Select>
                <RangePicker />
              </Space>
            </div>

            <Tabs defaultActiveKey="overview">
              <TabPane tab="工作概览" key="overview">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总任务数"
                        value={personalStats.totalTasks}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="已完成"
                        value={personalStats.completedTasks}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="进行中"
                        value={personalStats.inProgressTasks}
                        prefix={<ClockCircleOutlined />}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="已逾期"
                        value={personalStats.overdueTasks}
                        prefix={<ExclamationCircleOutlined />}
                        valueStyle={{ color: '#f5222d' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="个人表现">
                      <GaugeChart
                        data={performanceData}
                        height={300}
                        showMultiple={true}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="任务完成趋势">
                      <TrendChart
                        data={taskTrend}
                        height={300}
                        seriesField="category"
                        showArea={true}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="我的项目" key="projects">
                <Row gutter={[16, 16]}>
                  {myProjects.map(project => (
                    <Col span={8} key={project.id}>
                      <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <h4>{project.name}</h4>
                          <div>
                            {getStatusTag(project.status)}
                            {getPriorityTag(project.priority)}
                          </div>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span>进度</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress percent={project.progress} />
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          <div>角色: {project.role}</div>
                          <div>截止日期: {project.dueDate}</div>
                          <div>团队规模: {project.teamSize}人</div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane tab="我的任务" key="tasks">
                <List
                  dataSource={myTasks}
                  renderItem={(task) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Space>
                            <span>{task.title}</span>
                            {getStatusTag(task.status)}
                            {getPriorityTag(task.priority)}
                          </Space>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: 8 }}>项目: {task.project}</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ marginRight: 8 }}>进度:</span>
                              <Progress percent={task.progress} size="small" style={{ flex: 1, marginRight: 8 }} />
                              <span>{task.progress}%</span>
                            </div>
                          </div>
                        }
                      />
                      <div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          截止日期: {task.dueDate}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>

              <TabPane tab="最近活动" key="activities">
                <Timeline>
                  {recentActivities.map(activity => (
                    <Timeline.Item
                      key={activity.id}
                      dot={
                        <div style={{ 
                          color: getActivityColor(activity.status),
                          fontSize: 16
                        }}>
                          {getActivityIcon(activity.type)}
                        </div>
                      }
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{activity.title}</div>
                          <div style={{ color: '#666', fontSize: 12 }}>
                            {activity.time}
                          </div>
                        </div>
                        <Tag color={activity.status === 'success' ? 'green' : 
                                     activity.status === 'warning' ? 'orange' : 'blue'}>
                          {activity.status === 'success' ? '完成' : 
                           activity.status === 'warning' ? '进行中' : '信息'}
                        </Tag>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>

              <TabPane tab="成就徽章" key="achievements">
                <Row gutter={[16, 16]}>
                  {achievements.map(achievement => (
                    <Col span={6} key={achievement.id}>
                      <Card
                        style={{ 
                          textAlign: 'center',
                          opacity: achievement.unlocked ? 1 : 0.5
                        }}
                      >
                        <div style={{ 
                          fontSize: 48, 
                          color: achievement.unlocked ? achievement.color : '#d9d9d9',
                          marginBottom: 16
                        }}>
                          {achievement.icon}
                        </div>
                        <h4>{achievement.title}</h4>
                        <p style={{ color: '#666' }}>{achievement.description}</p>
                        {achievement.unlocked && (
                          <Badge count="已获得" style={{ backgroundColor: achievement.color }} />
                        )}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalDashboard;
