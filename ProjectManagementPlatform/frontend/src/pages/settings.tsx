import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Select,
  Button,
  Avatar,
  Upload,
  Divider,
  message,
  Tabs,
  Table,
  Tag,
  Modal,
  Space,
  Alert,
  TimePicker,
  Slider,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  TeamOutlined,
  GlobalOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  avatar: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  taskAssigned: boolean;
  taskCompleted: boolean;
  projectUpdated: boolean;
  deadlineReminder: boolean;
  weeklyReport: boolean;
}

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  workingHours: {
    start: string;
    end: string;
  };
  maxFileSize: number;
  allowedFileTypes: string[];
}

const SettingsPage: React.FC = () => {
  const [userForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [systemForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 用户信息
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    department: '技术部',
    position: '项目经理',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
  });

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    browser: true,
    mobile: false,
    taskAssigned: true,
    taskCompleted: true,
    projectUpdated: true,
    deadlineReminder: true,
    weeklyReport: false,
  });

  // 系统设置
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: '项目管理平台',
    siteDescription: '专业的项目管理解决方案',
    defaultLanguage: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx'],
  });

  const handleUserInfoSave = async () => {
    try {
      setLoading(true);
      const values = await userForm.validateFields();
      setUserProfile({ ...userProfile, ...values });
      message.success('个人信息保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setLoading(true);
      const values = await notificationForm.validateFields();
      setNotificationSettings({ ...notificationSettings, ...values });
      message.success('通知设置保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSave = async () => {
    try {
      setLoading(true);
      const values = await systemForm.validateFields();
      setSystemSettings({ ...systemSettings, ...values });
      message.success('系统设置保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功');
      // 这里应该更新用户头像URL
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  const uploadProps = {
    name: 'avatar',
    action: '/api/upload/avatar',
    listType: 'picture-card' as const,
    showUploadList: false,
    onChange: handleAvatarChange,
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs defaultActiveKey="1" type="card">
          {/* 个人设置 */}
          <TabPane
            tab={
              <span>
                <UserOutlined />
                个人设置
              </span>
            }
            key="1"
          >
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Card title="头像设置" style={{ marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Upload {...uploadProps}>
                      <Avatar
                        size={120}
                        src={userProfile.avatar}
                        icon={<UserOutlined />}
                        style={{ cursor: 'pointer' }}
                      />
                    </Upload>
                    <div style={{ marginTop: '16px' }}>
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>更换头像</Button>
                      </Upload>
                    </div>
                    <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                      支持 JPG、PNG 格式，大小不超过 2MB
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={16}>
                <Card title="基本信息">
                  <Form
                    form={userForm}
                    layout="vertical"
                    initialValues={userProfile}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="name"
                          label="姓名"
                          rules={[{ required: true, message: '请输入姓名' }]}
                        >
                          <Input placeholder="请输入姓名" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label="邮箱"
                          rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入正确的邮箱格式' },
                          ]}
                        >
                          <Input placeholder="请输入邮箱" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="phone"
                          label="手机号"
                          rules={[{ required: true, message: '请输入手机号' }]}
                        >
                          <Input placeholder="请输入手机号" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="department"
                          label="部门"
                          rules={[{ required: true, message: '请选择部门' }]}
                        >
                          <Select placeholder="请选择部门">
                            <Option value="技术部">技术部</Option>
                            <Option value="产品部">产品部</Option>
                            <Option value="设计部">设计部</Option>
                            <Option value="运营部">运营部</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="position"
                          label="职位"
                          rules={[{ required: true, message: '请输入职位' }]}
                        >
                          <Input placeholder="请输入职位" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="timezone"
                          label="时区"
                        >
                          <Select placeholder="请选择时区">
                            <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                            <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                            <Option value="Europe/London">英国时间 (UTC+0)</Option>
                            <Option value="Asia/Tokyo">日本时间 (UTC+9)</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="language"
                      label="语言偏好"
                    >
                      <Select placeholder="请选择语言">
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                        <Option value="ja-JP">日本語</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={handleUserInfoSave}
                      >
                        保存设置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 通知设置 */}
          <TabPane
            tab={
              <span>
                <BellOutlined />
                通知设置
              </span>
            }
            key="2"
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="通知方式">
                  <Form
                    form={notificationForm}
                    layout="vertical"
                    initialValues={notificationSettings}
                  >
                    <Form.Item name="email" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>邮件通知</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>通过邮件接收通知</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="browser" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>浏览器通知</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>在浏览器中显示桌面通知</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="mobile" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>手机推送</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>向手机应用推送通知</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="通知内容">
                  <Form
                    form={notificationForm}
                    layout="vertical"
                    initialValues={notificationSettings}
                  >
                    <Form.Item name="taskAssigned" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>任务分配</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>有新任务分配给我时</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="taskCompleted" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>任务完成</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>我负责的任务被完成时</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="projectUpdated" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>项目更新</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>参与的项目有重要更新时</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="deadlineReminder" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>截止提醒</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>任务即将到期时提醒</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Divider />

                    <Form.Item name="weeklyReport" valuePropName="checked">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>周报推送</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>每周接收工作总结报告</div>
                        </div>
                        <Switch />
                      </div>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={handleNotificationSave}
                      >
                        保存设置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 系统设置 */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                系统设置
              </span>
            }
            key="3"
          >
            <Alert
              message="管理员权限"
              description="以下设置仅限管理员用户修改，将影响整个系统的运行。"
              type="warning"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="基本设置">
                  <Form
                    form={systemForm}
                    layout="vertical"
                    initialValues={systemSettings}
                  >
                    <Form.Item
                      name="siteName"
                      label="站点名称"
                      rules={[{ required: true, message: '请输入站点名称' }]}
                    >
                      <Input placeholder="请输入站点名称" />
                    </Form.Item>

                    <Form.Item
                      name="siteDescription"
                      label="站点描述"
                    >
                      <TextArea rows={3} placeholder="请输入站点描述" />
                    </Form.Item>

                    <Form.Item
                      name="defaultLanguage"
                      label="默认语言"
                    >
                      <Select placeholder="请选择默认语言">
                        <Option value="zh-CN">简体中文</Option>
                        <Option value="en-US">English</Option>
                        <Option value="ja-JP">日本語</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="timezone"
                      label="系统时区"
                    >
                      <Select placeholder="请选择系统时区">
                        <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
                        <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
                        <Option value="Europe/London">英国时间 (UTC+0)</Option>
                        <Option value="Asia/Tokyo">日本时间 (UTC+9)</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="dateFormat"
                      label="日期格式"
                    >
                      <Select placeholder="请选择日期格式">
                        <Option value="YYYY-MM-DD">2024-01-01</Option>
                        <Option value="MM/DD/YYYY">01/01/2024</Option>
                        <Option value="DD/MM/YYYY">01/01/2024</Option>
                        <Option value="YYYY年MM月DD日">2024年01月01日</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="系统配置">
                  <Form
                    form={systemForm}
                    layout="vertical"
                    initialValues={systemSettings}
                  >
                    <Form.Item label="工作时间">
                      <Space>
                        <TimePicker format="HH:mm" placeholder="开始时间" />
                        <span>至</span>
                        <TimePicker format="HH:mm" placeholder="结束时间" />
                      </Space>
                    </Form.Item>

                    <Form.Item
                      name="maxFileSize"
                      label="最大文件大小 (MB)"
                    >
                      <Slider
                        min={1}
                        max={100}
                        marks={{
                          1: '1MB',
                          50: '50MB',
                          100: '100MB',
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="allowedFileTypes"
                      label="允许的文件类型"
                    >
                      <Select
                        mode="multiple"
                        placeholder="请选择允许的文件类型"
                        style={{ width: '100%' }}
                      >
                        <Option value="jpg">JPG</Option>
                        <Option value="png">PNG</Option>
                        <Option value="pdf">PDF</Option>
                        <Option value="doc">DOC</Option>
                        <Option value="docx">DOCX</Option>
                        <Option value="xls">XLS</Option>
                        <Option value="xlsx">XLSX</Option>
                        <Option value="txt">TXT</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Space>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          loading={loading}
                          onClick={handleSystemSave}
                        >
                          保存设置
                        </Button>
                        <Button>重置为默认</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 安全设置 */}
          <TabPane
            tab={
              <span>
                <SecurityScanOutlined />
                安全设置
              </span>
            }
            key="4"
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="密码安全">
                  <Form layout="vertical">
                    <Form.Item
                      name="currentPassword"
                      label="当前密码"
                      rules={[{ required: true, message: '请输入当前密码' }]}
                    >
                      <Input.Password placeholder="请输入当前密码" />
                    </Form.Item>

                    <Form.Item
                      name="newPassword"
                      label="新密码"
                      rules={[
                        { required: true, message: '请输入新密码' },
                        { min: 8, message: '密码至少8个字符' },
                      ]}
                    >
                      <Input.Password placeholder="请输入新密码" />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      label="确认密码"
                      rules={[
                        { required: true, message: '请确认新密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="请确认新密码" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary">更新密码</Button>
                    </Form.Item>
                  </Form>
                </Card>

                <Card title="两步验证" style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>短信验证</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>通过短信接收验证码</div>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>邮箱验证</div>
                        <div style={{ color: '#666', fontSize: '12px' }}>通过邮箱接收验证码</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="登录记录">
                  <Table
                    size="small"
                    dataSource={[
                      {
                        key: '1',
                        time: '2024-09-28 14:30:25',
                        ip: '192.168.1.100',
                        location: '北京市',
                        device: 'Chrome 浏览器',
                        status: 'success',
                      },
                      {
                        key: '2',
                        time: '2024-09-28 09:15:10',
                        ip: '192.168.1.100',
                        location: '北京市',
                        device: 'Chrome 浏览器',
                        status: 'success',
                      },
                      {
                        key: '3',
                        time: '2024-09-27 18:45:33',
                        ip: '10.0.0.50',
                        location: '上海市',
                        device: 'Safari 浏览器',
                        status: 'failed',
                      },
                    ]}
                    columns={[
                      {
                        title: '登录时间',
                        dataIndex: 'time',
                        key: 'time',
                      },
                      {
                        title: 'IP地址',
                        dataIndex: 'ip',
                        key: 'ip',
                      },
                      {
                        title: '地点',
                        dataIndex: 'location',
                        key: 'location',
                      },
                      {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status: string) => (
                          <Tag color={status === 'success' ? 'green' : 'red'}>
                            {status === 'success' ? '成功' : '失败'}
                          </Tag>
                        ),
                      },
                    ]}
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;