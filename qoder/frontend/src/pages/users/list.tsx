import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Avatar,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Drawer,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  joinDate: string;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: '张三',
      username: 'zhangsan',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      department: '技术部',
      position: '前端工程师',
      role: 'USER',
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: '李四',
      username: 'lisi',
      email: 'lisi@example.com',
      phone: '13800138001',
      department: '技术部',
      position: '后端工程师',
      role: 'USER',
      status: 'active',
      joinDate: '2024-02-01',
    },
    {
      id: '3',
      name: '王五',
      username: 'wangwu',
      email: 'wangwu@example.com',
      phone: '13800138002',
      department: '产品部',
      position: '产品经理',
      role: 'MANAGER',
      status: 'active',
      joinDate: '2023-12-10',
    },
    {
      id: '4',
      name: '赵六',
      username: 'zhaoliu',
      email: 'zhaoliu@example.com',
      phone: '13800138003',
      department: '设计部',
      position: 'UI设计师',
      role: 'USER',
      status: 'inactive',
      joinDate: '2024-03-01',
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 筛选用户
  const filterUsers = () => {
    let filtered = users;

    if (searchText) {
      filtered = filtered.filter(
        user =>
          user.name.includes(searchText) ||
          user.username.includes(searchText) ||
          user.email.includes(searchText)
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(user => user.department === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  React.useEffect(() => {
    filterUsers();
  }, [searchText, departmentFilter, statusFilter, users]);

  const columns = [
    {
      title: '用户信息',
      key: 'userInfo',
      render: (record: User) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>
              @{record.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (record: User) => (
        <div>
          <div>{record.email}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: '部门职位',
      key: 'department',
      render: (record: User) => (
        <div>
          <div>{record.department}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.position}</div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleConfig = {
          ADMIN: { color: 'red', text: '管理员' },
          MANAGER: { color: 'blue', text: '经理' },
          USER: { color: 'green', text: '普通用户' },
        };
        const config = roleConfig[role as keyof typeof roleConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '入职时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: User) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    message.success('用户删除成功');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // 编辑用户
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...values } : user
        ));
        message.success('用户信息更新成功');
      } else {
        // 添加用户
        const newUser: User = {
          id: Date.now().toString(),
          ...values,
          joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers([...users, newUser]);
        message.success('用户添加成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  const handleViewDetail = (user: User) => {
    setEditingUser(user);
    setIsDrawerVisible(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Space style={{ marginBottom: '16px' }}>
            <Search
              placeholder="搜索用户名、邮箱"
              allowClear
              style={{ width: 250 }}
              onSearch={setSearchText}
              onChange={e => setSearchText(e.target.value)}
            />
            
            <Select
              placeholder="选择部门"
              allowClear
              style={{ width: 150 }}
              onChange={setDepartmentFilter}
            >
              <Option value="技术部">技术部</Option>
              <Option value="产品部">产品部</Option>
              <Option value="设计部">设计部</Option>
              <Option value="运营部">运营部</Option>
            </Select>

            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              onChange={setStatusFilter}
            >
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Space>

          <div style={{ float: 'right' }}>
            <Space>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                添加用户
              </Button>
            </Space>
          </div>
          <div style={{ clear: 'both' }} />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleViewDetail(record),
          })}
        />
      </Card>

      {/* 添加/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
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
            status: 'active',
            role: 'USER',
          }}
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
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  <Option value="ADMIN">管理员</Option>
                  <Option value="MANAGER">经理</Option>
                  <Option value="USER">普通用户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={400}
      >
        {editingUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar
                src={editingUser.avatar}
                icon={<UserOutlined />}
                size={80}
              />
              <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>
                {editingUser.name}
              </h3>
              <Tag color={editingUser.status === 'active' ? 'green' : 'red'}>
                {editingUser.status === 'active' ? '正常' : '禁用'}
              </Tag>
            </div>

            <div>
              <p><strong>用户名：</strong>{editingUser.username}</p>
              <p><strong>邮箱：</strong>{editingUser.email}</p>
              <p><strong>手机号：</strong>{editingUser.phone}</p>
              <p><strong>部门：</strong>{editingUser.department}</p>
              <p><strong>职位：</strong>{editingUser.position}</p>
              <p><strong>角色：</strong>{editingUser.role}</p>
              <p><strong>入职时间：</strong>{editingUser.joinDate}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserListPage;