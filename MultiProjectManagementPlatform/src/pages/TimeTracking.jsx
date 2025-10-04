import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Modal, Form, Input, DatePicker, Select, Statistic, Row, Col, Tag, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { userService, projectService } from '../services/api';
import { AppContext } from '../context/AppContext';
import './TimeTracking.less';

const { Option } = Select;

const TimeTracking = () => {
  const { user } = useContext(AppContext);
  const [timeRecords, setTimeRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchDate, setSearchDate] = useState('');

  // 任务类型选项
  const taskTypes = [
    '需求分析', '设计', '前端开发', '后端开发', '测试', '文档编写', '会议', '其他'
  ];

  // 获取时间记录和项目列表
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      // 获取当前用户的时间记录
      const records = await userService.getUserTimeRecords(user?.id || 3);
      setTimeRecords(records);
      
      // 获取项目列表
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据ID获取项目名称
  const getProjectNameById = (id) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : '未知项目';
  };

  // 过滤时间记录
  const filteredRecords = timeRecords.filter(record => 
    !searchDate || record.date === searchDate
  );

  // 计算总工时
  const totalHours = filteredRecords.reduce((sum, record) => sum + record.hours, 0);

  // 打开创建/编辑工时记录模态框
  const showModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: record.date ? new Date(record.date) : null,
      });
    } else {
      form.resetFields();
    }
    setVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setVisible(false);
    setEditingRecord(null);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 在实际应用中，这里应该调用API保存数据
      // 这里我们只是模拟保存操作
      if (editingRecord) {
        // 更新工时记录
        setTimeRecords(timeRecords.map(r => 
          r.id === editingRecord.id 
            ? { ...r, ...values, date: values.date?.format('YYYY-MM-DD') }
            : r
        ));
      } else {
        // 创建新工时记录
        const newRecord = {
          ...values,
          id: timeRecords.length + 1,
          userId: user?.id || 3,
          date: values.date?.format('YYYY-MM-DD'),
        };
        setTimeRecords([...timeRecords, newRecord]);
      }
      handleCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  // 删除工时记录
  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条工时记录吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        // 在实际应用中，这里应该调用API删除数据
        setTimeRecords(timeRecords.filter(r => r.id !== id));
      },
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '项目',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (id) => (
        <Tooltip title={getProjectNameById(id)}>
          <div className="project-name">{getProjectNameById(id)}</div>
        </Tooltip>
      ),
    },
    {
      title: '任务',
      dataIndex: 'task',
      key: 'task',
      render: (task) => (
        <Tag>{task}</Tag>
      ),
    },
    {
      title: '工时',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours) => <strong>{hours}h</strong>,
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

  // 按日期分组统计
  const getDailySummary = () => {
    const summary = {};
    timeRecords.forEach(record => {
      if (!summary[record.date]) {
        summary[record.date] = 0;
      }
      summary[record.date] += record.hours;
    });
    return Object.entries(summary).map(([date, hours]) => ({
      date,
      hours,
      key: date,
    })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  };

  return (
    <div className="time-tracking-container">
      <div className="page-header">
        <h1 className="page-title">时间明细</h1>
        <div className="header-actions">
          <div className="filter-box">
            <DatePicker
              value={searchDate ? new Date(searchDate) : null}
              onChange={(date) => setSearchDate(date ? date.format('YYYY-MM-DD') : '')}
              placeholder="选择日期"
              className="date-filter"
            />
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            记录工时
          </Button>
        </div>
      </div>

      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="本周工时"
              value={totalHours}
              suffix="小时"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="平均日工时"
              value={(totalHours / Math.max(1, filteredRecords.length)).toFixed(1)}
              suffix="小时"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="记录条数"
              value={filteredRecords.length}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      {/* 近期工时统计 */}
      <Card className="summary-card" title="近期工时统计" extra={<span className="summary-hint">最近7天</span>}>
        <div className="daily-summary">
          {getDailySummary().map(item => (
            <div key={item.date} className="summary-item">
              <div className="summary-date">{item.date}</div>
              <div className="summary-hours">{item.hours}h</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 工时记录表格 */}
      <Card className="records-card">
        <Table
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑工时记录模态框 */}
      <Modal
        title={editingRecord ? '编辑工时记录' : '记录工时'} 
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
          className="time-record-form"
        >
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          
          <Form.Item
            name="projectId"
            label="项目"
            rules={[{ required: true, message: '请选择项目' }]}
          >
            <Select placeholder="请选择项目">
              {projects.map(project => (
                <Option key={project.id} value={project.id}>{project.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="task"
            label="任务类型"
            rules={[{ required: true, message: '请选择任务类型' }]}
          >
            <Select placeholder="请选择任务类型">
              {taskTypes.map(task => (
                <Option key={task} value={task}>{task}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="hours"
            label="工时"
            rules={[
              { required: true, message: '请输入工时' },
              { type: 'number', min: 0.5, max: 24, message: '工时应在0.5-24小时之间' }
            ]}
          >
            <Input type="number" step={0.5} placeholder="请输入工时" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimeTracking;