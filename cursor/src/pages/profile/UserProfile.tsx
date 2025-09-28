import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Avatar, 
  Button, 
  Space, 
  Tag, 
  Progress, 
  List, 
  Tabs,
  Form,
  Input,
  Select,
  Upload,
  message,
  Badge,
  Timeline,
  Statistic,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  SettingOutlined, 
  BellOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  ProjectOutlined,
  StarOutlined,
  CameraOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { TabPane } = Tabs;
const { Option } = Select;

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'product_manager',
    department: '产品部',
    phone: '13800138000',
    avatar: '',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15 14:30:00',
    skills: ['产品设计', '用户研究', '数据分析', '项目管理'],
    bio: '专注于用户体验设计和产品创新，拥有5年产品管理经验。'
  });

  const [personalStats, setPersonalStats] = useState({
    totalProjects: 12,
    completedProjects: 8,
    currentProjects: 3,
    totalTasks: 156,
    completedTasks: 142,
    efficiency: 91.0,
    qualityScore: 4.5,
    teamCollaboration: 4.8,
    knowledgeSharing: 4.2
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'project',
      title: '完成了电商平台重构项目',
      time: '2024-01-15 14:30:00',
      status: 'success'
    },
    {
      id: 2,
      type: 'task',
      title: '提交了用户需求分析报告',
      time: '2024-01-15 10:20:00',
      status: 'info'
    },
    {
      id: 3,
      type: 'meeting',
      title: '参加了产品评审会议',
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
      title: '项目完成专家',
      description: '完成10个以上项目',
      icon: <TrophyOutlined />,
      color: '#faad14',
      unlocked: true
    },
    {
      id: 2,
      title: '团队协作之星',
      description: '团队协作评分4.5+',
      icon: <TeamOutlined />,
      color: '#52c41a',
      unlocked: true
    },
    {
      id: 3,
      title: '效率达人',
      description: '任务完成率90%+',
      icon: <StarOutlined />,
      color: '#1890ff',
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
    { name: '任务完成率', value: 91.0, max: 100, unit: '%' },
    { name: '质量评分', value: 4.5, max: 5, unit: '分' },
    { name: '团队协作', value: 4.8, max: 5, unit: '分' },
    { name: '知识分享', value: 4.2, max: 5, unit: '分' }
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getRoleTag = (role: string) => {
    const roleConfig = {
      product_manager: { color: 'purple', text: '产品经理' },
      project_manager: { color: 'blue', text: '项目经理' },
      delivery_manager: { color: 'green', text: '交付经理' },
      developer: { color: 'orange', text: '开发工程师' },
      tester: { color: 'cyan', text: '测试工程师' },
      designer: { color: 'pink', text: '设计师' }
    };
    const config = roleConfig[role as keyof typeof roleConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getActivityIcon = (type: string) => {
    const iconConfig = {
      project: <ProjectOutlined />,
      task: <FileTextOutlined />,
      meeting: <CalendarOutlined />,
      evaluation: <StarOutlined />
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

  const handleEditProfile = () => {
    form.setFieldsValue(userInfo);
    setEditModalVisible(true);
  };

  const handleSaveProfile = (values: any) => {
    setUserInfo({ ...userInfo, ...values });
    setEditModalVisible(false);
    message.success('个人信息更新成功');
  };

  return (
    <div className="user-profile">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />}
                src={userInfo.avatar}
              />
              <div style={{ marginTop: 16 }}>
                <h2>{userInfo.name}</h2>
                <div style={{ marginBottom: 8 }}>
                  {getRoleTag(userInfo.role)}
                </div>
                <div style={{ color: '#666', marginBottom: 16 }}>
                  {userInfo.department}
                </div>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEditProfile}
                >
                  编辑资料
                </Button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4>个人简介</h4>
              <p style={{ color: '#666' }}>{userInfo.bio}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4>技能标签</h4>
              <Space wrap>
                {userInfo.skills.map(skill => (
                  <Tag key={skill} color="blue">{skill}</Tag>
                ))}
              </Space>
            </div>

            <div>
              <h4>联系信息</h4>
              <div style={{ color: '#666' }}>
                <div>邮箱: {userInfo.email}</div>
                <div>电话: {userInfo.phone}</div>
                <div>入职时间: {userInfo.joinDate}</div>
                <div>最后登录: {userInfo.lastLogin}</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Tabs defaultActiveKey="overview">
              <TabPane tab="个人概览" key="overview">
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="总项目数"
                        value={personalStats.totalProjects}
                        prefix={<ProjectOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="已完成项目"
                        value={personalStats.completedProjects}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="当前项目"
                        value={personalStats.currentProjects}
                        prefix={<CalendarOutlined />}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card>
                      <Statistic
                        title="任务完成率"
                        value={personalStats.efficiency}
                        suffix="%"
                        prefix={<StarOutlined />}
                        valueStyle={{ color: '#722ed1' }}
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
                        data={[
                          { date: '2024-01-01', value: 85, category: '完成率' },
                          { date: '2024-01-02', value: 88, category: '完成率' },
                          { date: '2024-01-03', value: 90, category: '完成率' },
                          { date: '2024-01-04', value: 92, category: '完成率' },
                          { date: '2024-01-05', value: 91, category: '完成率' }
                        ]}
                        height={300}
                        seriesField="category"
                        showArea={true}
                      />
                    </Card>
                  </Col>
                </Row>
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
                    <Col span={8} key={achievement.id}>
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

              <TabPane tab="设置" key="settings">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="通知设置">
                      <List
                        dataSource={[
                          { title: '项目更新通知', description: '项目状态变更时通知', enabled: true },
                          { title: '任务分配通知', description: '新任务分配时通知', enabled: true },
                          { title: '会议提醒', description: '会议开始前提醒', enabled: false },
                          { title: '系统公告', description: '系统重要公告通知', enabled: true }
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            actions={[
                              <Button type="link" size="small">
                                {item.enabled ? '关闭' : '开启'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              title={item.title}
                              description={item.description}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="隐私设置">
                      <List
                        dataSource={[
                          { title: '显示在线状态', description: '让其他用户看到你的在线状态', enabled: true },
                          { title: '显示联系方式', description: '在个人资料中显示联系方式', enabled: false },
                          { title: '显示项目历史', description: '显示参与过的项目历史', enabled: true }
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            actions={[
                              <Button type="link" size="small">
                                {item.enabled ? '关闭' : '开启'}
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              title={item.title}
                              description={item.description}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="编辑个人资料"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProfile}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="skills"
            label="技能"
          >
            <Select
              mode="tags"
              placeholder="请输入技能标签"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label="个人简介"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
