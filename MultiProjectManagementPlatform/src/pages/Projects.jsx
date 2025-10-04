import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, DatePicker, Select, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { projectService, userService } from '../services/api';
import './Projects.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 状态颜色配置
  const statusColors = {
    '进行中': 'processing',
    '已完成': 'success',
    '计划中': 'default',
    '已暂停': 'warning',
    '已取消': 'error',
  };

  // 获取项目列表
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // 获取项目数据
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户数据
  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // 根据ID获取用户名
  const getUserNameById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : '未知用户';
  };

  // 过滤项目
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchText.toLowerCase()) ||
    project.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 打开创建/编辑项目模态框
  const showModal = (project = null) => {
    setEditingProject(project);
    if (project) {
      form.setFieldsValue({
        ...project,
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
      });
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingProject(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 在实际应用中，这里应该调用API保存数据
      // 这里我们只是模拟保存操作
      if (editingProject) {
        // 更新项目
        setProjects(projects.map(p => 
          p.id === editingProject.id 
            ? { ...p, ...values, startDate: values.startDate?.format('YYYY-MM-DD'), endDate: values.endDate?.format('YYYY-MM-DD') }
            : p
        ));
      } else {
        // 创建新项目
        const newProject = {
          ...values,
          id: projects.length + 1,
          status: '计划中',
          progress: 0,
          startDate: values.startDate?.format('YYYY-MM-DD'),
          endDate: values.endDate?.format('YYYY-MM-DD'),
          tasks: 0,
          completedTasks: 0,
          budget: values.budget || 0,
          actualCost: 0,
        };
        setProjects([...projects, newProject]);
      }
      handleCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 删除项目
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        // 在实际应用中，这里应该调用API删除数据
        setProjects(projects.filter(p => p.id !== id));
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
      render: (id) => getUserNameById(id),
    },
    {
      title: '团队成员',
      dataIndex: 'members',
      key: 'members',
      render: (memberIds) => (
        <Space size="small">
          {memberIds.slice(0, 3).map(id => {
            const user = users.find(u => u.id === id);
            return user ? (
              <Tooltip key={id} title={user.name}>
                <Avatar>{user.name.charAt(0)}</Avatar>
              </Tooltip>
            ) : null;
          })}
          {memberIds.length > 3 && (
            <Avatar>+{memberIds.length - 3}</Avatar>
          )}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      ),
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => window.location.href = `/projects/${record.id}`}>
            查看
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="projects-container">
      <div className="page-header">
        <h1 className="page-title">项目管理</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchOutlined className="search-icon" />
            <Input
              placeholder="搜索项目名称或描述"
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
            新建项目
          </Button>
        </div>
      </div>

      <Card className="projects-card">
        <Table
          columns={columns}
          dataSource={filteredProjects}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑项目模态框 */}
      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="project-form"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>
          
          <Form.Item
            name="manager"
            label="项目负责人"
            rules={[{ required: true, message: '请选择项目负责人' }]}
          >
            <Select placeholder="请选择项目负责人">
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="members"
            label="团队成员"
            rules={[{ required: true, message: '请选择团队成员' }]}
          >
            <Select mode="multiple" placeholder="请选择团队成员">
              {users.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="endDate"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="budget"
            label="预算"
            rules={[{ required: true, message: '请输入预算' }, { type: 'number', min: 0 }]}
          >
            <Input type="number" placeholder="请输入预算" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;