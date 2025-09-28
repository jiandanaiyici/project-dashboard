import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  message,
  Tooltip,
  Badge,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { User, UserRole, PersonnelMovement } from '@/types';

const { Option } = Select;
const { TabPane } = Tabs;

const PersonnelList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [movements, setMovements] = useState<PersonnelMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    role: undefined,
    department: undefined,
    keyword: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        ...filters,
        ...params
      });

      const response = await fetch(`/api/users?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total
        }));
      } else {
        message.error('获取用户列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  // 获取人员流动记录
  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/users/movements');
      const data = await response.json();

      if (data.success) {
        setMovements(data.data.movements);
      }
    } catch (error) {
      console.error('获取人员流动记录失败:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMovements();
  }, [pagination.current, pagination.pageSize, filters]);

  // 处理搜索
  const handleSearch = (values: any) => {
    setFilters(values);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 处理表格变化
  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  // 打开创建/编辑模态框
  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null);
    setModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        message.success(editingUser ? '用户更新成功' : '用户创建成功');
        handleCloseModal();
        fetchUsers();
      } else {
        message.error(data.message || '操作失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  // 获取角色标签
  const getRoleTag = (role: UserRole) => {
    const roleConfig = {
      product_manager: { color: 'purple', text: '产品经理' },
      project_manager: { color: 'blue', text: '项目经理' },
      delivery_manager: { color: 'green', text: '交付经理' },
      developer: { color: 'orange', text: '开发工程师' },
      tester: { color: 'cyan', text: '测试工程师' },
      designer: { color: 'pink', text: '设计师' }
    };

    const config = roleConfig[role];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取流动类型标签
  const getMovementTag = (type: string) => {
    const typeConfig = {
      transfer: { color: 'blue', text: '项目调动' },
      promotion: { color: 'green', text: '晋升' },
      demotion: { color: 'orange', text: '降级' },
      resignation: { color: 'red', text: '离职' },
      hire: { color: 'cyan', text: '入职' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 用户表格列定义
  const userColumns = [
    {
      title: '用户信息',
      key: 'user_info',
      render: (_, record: User) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => getRoleTag(role)
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => department || '未分配'
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills?.slice(0, 3).map(skill => (
            <Tag key={skill} size="small">{skill}</Tag>
          ))}
          {skills?.length > 3 && (
            <Tag size="small">+{skills.length - 3}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '当前项目',
      dataIndex: 'currentProjects',
      key: 'currentProjects',
      render: (projects: string[]) => (
        <Space>
          <TeamOutlined />
          {projects?.length || 0}个
        </Space>
      )
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: User) => (
        <Space>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // 流动记录表格列定义
  const movementColumns = [
    {
      title: '人员',
      key: 'user_name',
      render: (_, record: PersonnelMovement) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>{record.userId}</span>
        </Space>
      )
    },
    {
      title: '流动类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getMovementTag(type)
    },
    {
      title: '原项目',
      dataIndex: 'fromProject',
      key: 'fromProject',
      render: (project: string) => project || '-'
    },
    {
      title: '目标项目',
      dataIndex: 'toProject',
      key: 'toProject',
      render: (project: string) => project || '-'
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true
    },
    {
      title: '生效日期',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  return (
    <div className="personnel-list">
      <Card>
        <Tabs defaultActiveKey="users">
          <TabPane tab="人员列表" key="users">
            <div style={{ marginBottom: 16 }}>
              <Form
                layout="inline"
                onFinish={handleSearch}
                initialValues={filters}
              >
                <Form.Item name="keyword">
                  <Input
                    placeholder="搜索姓名或邮箱"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item name="role">
                  <Select placeholder="角色" style={{ width: 120 }} allowClear>
                    <Option value="product_manager">产品经理</Option>
                    <Option value="project_manager">项目经理</Option>
                    <Option value="delivery_manager">交付经理</Option>
                    <Option value="developer">开发工程师</Option>
                    <Option value="tester">测试工程师</Option>
                    <Option value="designer">设计师</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="department">
                  <Input placeholder="部门" style={{ width: 120 }} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button onClick={() => setFilters({ role: undefined, department: undefined, keyword: '' })}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div style={{ marginBottom: 16, textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
              >
                新建用户
              </Button>
            </div>

            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              onChange={handleTableChange}
            />
          </TabPane>

          <TabPane tab="人员流动" key="movements">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <TrophyOutlined />
                <span>人员流动记录</span>
              </Space>
            </div>

            <Table
              columns={movementColumns}
              dataSource={movements}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Option value="product_manager">产品经理</Option>
              <Option value="project_manager">项目经理</Option>
              <Option value="delivery_manager">交付经理</Option>
              <Option value="developer">开发工程师</Option>
              <Option value="tester">测试工程师</Option>
              <Option value="designer">设计师</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="department"
            label="部门"
          >
            <Input placeholder="请输入部门" />
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
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonnelList;
