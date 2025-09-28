import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Progress, 
  Modal, 
  Form, 
  message,
  Tooltip,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  TeamOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { Project, ProjectStatus, UserRole } from '@/types';

const { Option } = Select;

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: undefined,
    keyword: '',
    manager: undefined
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  // 获取项目列表
  const fetchProjects = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        ...filters,
        ...params
      });

      const response = await fetch(`/api/projects?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProjects(data.data.projects);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total
        }));
      } else {
        message.error('获取项目列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
  const handleOpenModal = (project?: Project) => {
    setEditingProject(project || null);
    setModalVisible(true);
    if (project) {
      form.setFieldsValue(project);
    } else {
      form.resetFields();
    }
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingProject(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

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
        message.success(editingProject ? '项目更新成功' : '项目创建成功');
        handleCloseModal();
        fetchProjects();
      } else {
        message.error(data.message || '操作失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  // 删除项目
  const handleDelete = (project: Project) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除项目"${project.name}"吗？此操作不可撤销。`,
      onOk: async () => {
        try {
          const response = await fetch(`/api/projects/${project.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const data = await response.json();

          if (data.success) {
            message.success('项目删除成功');
            fetchProjects();
          } else {
            message.error(data.message || '删除失败');
          }
        } catch (error) {
          message.error('网络错误');
        }
      }
    });
  };

  // 获取状态标签
  const getStatusTag = (status: ProjectStatus) => {
    const statusConfig = {
      planning: { color: 'blue', text: '规划中' },
      in_progress: { color: 'green', text: '进行中' },
      testing: { color: 'orange', text: '测试中' },
      completed: { color: 'purple', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' }
    };

    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取风险等级标签
  const getRiskTag = (riskLevel: string) => {
    const riskConfig = {
      low: { color: 'green', text: '低风险' },
      medium: { color: 'orange', text: '中风险' },
      high: { color: 'red', text: '高风险' }
    };

    const config = riskConfig[riskLevel as keyof typeof riskConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.description}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => getStatusTag(status)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      )
    },
    {
      title: '项目经理',
      dataIndex: 'manager_name',
      key: 'manager_name'
    },
    {
      title: '团队规模',
      dataIndex: 'team_size',
      key: 'team_size',
      render: (size: number) => (
        <Space>
          <TeamOutlined />
          {size}人
        </Space>
      )
    },
    {
      title: '应用数量',
      dataIndex: 'application_count',
      key: 'application_count',
      render: (count: number) => (
        <Space>
          <AppstoreOutlined />
          {count}个
        </Space>
      )
    },
    {
      title: '风险等级',
      dataIndex: 'risk_level',
      key: 'risk_level',
      render: (riskLevel: string) => getRiskTag(riskLevel)
    },
    {
      title: '质量评分',
      dataIndex: 'quality_score',
      key: 'quality_score',
      render: (score: number) => (
        <Badge 
          count={score.toFixed(1)} 
          style={{ backgroundColor: score >= 4 ? '#52c41a' : score >= 3 ? '#faad14' : '#f5222d' }}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Project) => (
        <Space>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="project-list">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Form
            layout="inline"
            onFinish={handleSearch}
            initialValues={filters}
          >
            <Form.Item name="keyword">
              <Input
                placeholder="搜索项目名称或描述"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="status">
              <Select placeholder="项目状态" style={{ width: 120 }} allowClear>
                <Option value="planning">规划中</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="testing">测试中</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={() => setFilters({ status: undefined, keyword: '', manager: undefined })}>
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
            新建项目
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={projects}
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
      </Card>

      <Modal
        title={editingProject ? '编辑项目' : '新建项目'}
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
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
          >
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>

          <Form.Item
            name="start_date"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="budget"
            label="预算"
          >
            <Input type="number" placeholder="请输入预算金额" />
          </Form.Item>

          <Form.Item
            name="status"
            label="项目状态"
            rules={[{ required: true, message: '请选择项目状态' }]}
          >
            <Select placeholder="请选择项目状态">
              <Option value="planning">规划中</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="testing">测试中</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="risk_level"
            label="风险等级"
          >
            <Select placeholder="请选择风险等级">
              <Option value="low">低风险</Option>
              <Option value="medium">中风险</Option>
              <Option value="high">高风险</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCloseModal}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProject ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;
