import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Switch, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { applicationService } from '../services/api';
import './AppManagement.less';

const { Option } = Select;

const AppManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // 应用类型选项
  const appTypes = [
    { value: 'core', label: '核心' },
    { value: 'auxiliary', label: '辅助' },
    { value: 'development', label: '开发' },
    { value: 'quality', label: '质量' },
    { value: 'management', label: '管理' },
  ];

  // 状态颜色配置
  const statusColors = {
    '启用': 'green',
    '禁用': 'red',
  };

  // 类型颜色配置
  const typeColors = {
    'core': 'blue',
    'auxiliary': 'purple',
    'development': 'cyan',
    'quality': 'orange',
    'management': 'pink',
  };

  // 获取应用列表
  useEffect(() => {
    fetchApplications();
  }, []);

  // 获取应用数据
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤应用
  const filteredApps = applications.filter(app => 
    app.name.toLowerCase().includes(searchText.toLowerCase()) ||
    app.description.toLowerCase().includes(searchText.toLowerCase())
  );

  // 打开创建/编辑应用模态框
  const showModal = (app = null) => {
    setEditingApp(app);
    if (app) {
      form.setFieldsValue(app);
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingApp(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 在实际应用中，这里应该调用API保存数据
      // 这里我们只是模拟保存操作
      if (editingApp) {
        // 更新应用
        setApplications(applications.map(a => 
          a.id === editingApp.id ? { ...a, ...values } : a
        ));
      } else {
        // 创建新应用
        const newApp = {
          ...values,
          id: applications.length + 1,
          status: '启用',
        };
        setApplications([...applications, newApp]);
      }
      handleCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 删除应用
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个应用吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        // 在实际应用中，这里应该调用API删除数据
        setApplications(applications.filter(a => a.id !== id));
      },
    });
  };

  // 切换应用状态
  const toggleStatus = (id, currentStatus) => {
    // 在实际应用中，这里应该调用API更新状态
    const newStatus = currentStatus === '启用' ? '禁用' : '启用';
    setApplications(applications.map(a => 
      a.id === id ? { ...a, status: newStatus } : a
    ));
  };

  // 表格列配置
  const columns = [
    {
      title: '应用名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeInfo = appTypes.find(t => t.value === type);
        return (
          <Tag color={typeColors[type] || 'default'}>
            {typeInfo ? typeInfo.label : type}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === '启用'}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          onChange={() => toggleStatus(record.id, status)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <span>
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
    <div className="app-management-container">
      <div className="page-header">
        <h1 className="page-title">应用管理</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchOutlined className="search-icon" />
            <Input
              placeholder="搜索应用名称或描述"
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
            新建应用
          </Button>
        </div>
      </div>

      <Card className="apps-card">
        <div className="card-header-actions">
          <Button 
            type="text" 
            icon={<ReloadOutlined />}
            onClick={fetchApplications}
            loading={loading}
          >
            刷新
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={filteredApps}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑应用模态框 */}
      <Modal
        title={editingApp ? '编辑应用' : '新建应用'}
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
          className="app-form"
        >
          <Form.Item
            name="name"
            label="应用名称"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="应用描述"
            rules={[{ required: true, message: '请输入应用描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入应用描述" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="应用类型"
            rules={[{ required: true, message: '请选择应用类型' }]}
          >
            <Select placeholder="请选择应用类型">
              {appTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppManagement;