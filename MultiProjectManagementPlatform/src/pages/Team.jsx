import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Avatar, Modal, Form, Input, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { userService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Team.less';

const { Option } = Select;

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  // 角色配置
  const roles = [
    { value: 'admin', label: '管理员' },
    { value: 'manager', label: '项目经理' },
    { value: 'developer', label: '开发人员' },
    { value: 'designer', label: '设计师' },
    { value: 'tester', label: '测试人员' },
  ];

  // 角色颜色配置
  const roleColors = {
    'admin': 'red',
    'manager': 'orange',
    'developer': 'blue',
    'designer': 'purple',
    'tester': 'green',
  };

  // 获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 获取用户数据
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // 打开创建/编辑用户模态框
  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingUser(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 在实际应用中，这里应该调用API保存数据
      // 这里我们只是模拟保存操作
      if (editingUser) {
        // 更新用户
        setUsers(users.map(u => 
          u.id === editingUser.id ? { ...u, ...values } : u
        ));
      } else {
        // 创建新用户
        const newUser = {
          ...values,
          id: users.length + 1,
        };
        setUsers([...users, newUser]);
      }
      handleCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 删除用户
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        // 在实际应用中，这里应该调用API删除数据
        setUsers(users.filter(u => u.id !== id));
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, record) => (
        <Avatar>{record.name.charAt(0)}</Avatar>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleInfo = roles.find(r => r.value === role);
        return (
          <Tag color={roleColors[role] || 'default'}>
            {roleInfo ? roleInfo.label : role}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
            <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/member/${record.id}`)}>
              查看详情
            </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="team-container">
      <div className="page-header">
        <h1 className="page-title">团队成员</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchOutlined className="search-icon" />
            <Input
              placeholder="搜索姓名或邮箱"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            新增成员
          </Button>
        </div>
      </div>

      <Card className="team-card">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑用户模态框 */}
      <Modal
        title={editingUser ? '编辑成员' : '新增成员'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          className="user-form"
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
              {roles.map(role => (
                <Option key={role.value} value={role.value}>{role.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          {!editingUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码长度不能少于6位' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Team;