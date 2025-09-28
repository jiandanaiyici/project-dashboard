import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Tag, 
  Tooltip,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import Gantt from '@dhtmlx/trial';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PersonnelGantt: React.FC = () => {
  const [ganttData, setGanttData] = useState([
    {
      id: 1,
      text: '张三 - 电商平台项目',
      start_date: '2024-01-01',
      end_date: '2024-03-31',
      progress: 75,
      type: 'project',
      person: '张三',
      project: '电商平台项目',
      role: '项目经理',
      status: 'active'
    },
    {
      id: 2,
      text: '李四 - 移动端开发',
      start_date: '2024-01-15',
      end_date: '2024-04-30',
      progress: 45,
      type: 'project',
      person: '李四',
      project: '移动端开发',
      role: '技术负责人',
      status: 'active'
    },
    {
      id: 3,
      text: '王五 - 数据分析平台',
      start_date: '2023-11-01',
      end_date: '2024-01-31',
      progress: 100,
      type: 'project',
      person: '王五',
      project: '数据分析平台',
      role: '前端开发',
      status: 'completed'
    },
    {
      id: 4,
      text: '张三 - 项目调动',
      start_date: '2024-02-01',
      end_date: '2024-02-01',
      progress: 0,
      type: 'movement',
      person: '张三',
      project: '从电商平台到支付系统',
      role: '项目经理',
      status: 'planned'
    },
    {
      id: 5,
      text: '赵六 - 新员工入职',
      start_date: '2024-01-20',
      end_date: '2024-01-20',
      progress: 0,
      type: 'movement',
      person: '赵六',
      project: '加入电商平台团队',
      role: '后端开发',
      status: 'completed'
    }
  ]);

  const [filteredData, setFilteredData] = useState(ganttData);
  const [selectedPerson, setSelectedPerson] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const persons = ['张三', '李四', '王五', '赵六', '钱七', '孙八'];
  const projects = ['电商平台项目', '移动端开发', '数据分析平台', '支付系统', '管理后台'];
  const roles = ['项目经理', '技术负责人', '前端开发', '后端开发', '测试工程师', '产品经理'];

  useEffect(() => {
    let filtered = ganttData;

    if (selectedPerson !== 'all') {
      filtered = filtered.filter(item => item.person === selectedPerson);
    }

    if (selectedProject !== 'all') {
      filtered = filtered.filter(item => item.project === selectedProject);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredData(filtered);
  }, [selectedPerson, selectedProject, selectedStatus, ganttData]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: '进行中' },
      completed: { color: 'blue', text: '已完成' },
      planned: { color: 'orange', text: '计划中' },
      cancelled: { color: 'red', text: '已取消' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeTag = (type: string) => {
    const typeConfig = {
      project: { color: 'blue', text: '项目参与' },
      movement: { color: 'purple', text: '人员流动' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleAddItem = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      person: item.person,
      project: item.project,
      role: item.role,
      start_date: item.start_date,
      end_date: item.end_date,
      status: item.status,
      type: item.type
    });
    setModalVisible(true);
  };

  const handleDeleteItem = (id: number) => {
    setGanttData(ganttData.filter(item => item.id !== id));
    message.success('删除成功');
  };

  const handleSaveItem = (values: any) => {
    if (editingItem) {
      // 编辑
      setGanttData(ganttData.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...values, text: `${values.person} - ${values.project}` }
          : item
      ));
      message.success('更新成功');
    } else {
      // 新增
      const newItem = {
        id: Math.max(...ganttData.map(item => item.id)) + 1,
        text: `${values.person} - ${values.project}`,
        progress: 0,
        ...values
      };
      setGanttData([...ganttData, newItem]);
      message.success('添加成功');
    }
    setModalVisible(false);
  };

  const renderGanttChart = () => {
    // 这里应该使用真实的甘特图组件
    // 由于@dhtmlx/trial需要DOM操作，这里用表格模拟
    return (
      <div style={{ height: 400, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>人员</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>项目/流动</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>角色</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>开始时间</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>结束时间</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>进度</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>状态</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>类型</th>
              <th style={{ padding: '8px', border: '1px solid #d9d9d9' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  <Space>
                    <TeamOutlined />
                    {item.person}
                  </Space>
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {item.project}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {item.role}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {item.start_date}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {item.end_date}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '8px', 
                      background: '#f0f0f0', 
                      borderRadius: '4px',
                      marginRight: '8px'
                    }}>
                      <div style={{
                        width: `${item.progress}%`,
                        height: '100%',
                        background: item.progress === 100 ? '#52c41a' : '#1890ff',
                        borderRadius: '4px'
                      }} />
                    </div>
                    <span>{item.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {getStatusTag(item.status)}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  {getTypeTag(item.type)}
                </td>
                <td style={{ padding: '8px', border: '1px solid #d9d9d9' }}>
                  <Space>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<EditOutlined />}
                      onClick={() => handleEditItem(item)}
                    />
                    <Button 
                      type="link" 
                      size="small" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteItem(item.id)}
                    />
                  </Space>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="personnel-gantt">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Select
              value={selectedPerson}
              onChange={setSelectedPerson}
              style={{ width: 120 }}
              placeholder="选择人员"
            >
              <Option value="all">全部人员</Option>
              {persons.map(person => (
                <Option key={person} value={person}>{person}</Option>
              ))}
            </Select>
            <Select
              value={selectedProject}
              onChange={setSelectedProject}
              style={{ width: 150 }}
              placeholder="选择项目"
            >
              <Option value="all">全部项目</Option>
              {projects.map(project => (
                <Option key={project} value={project}>{project}</Option>
              ))}
            </Select>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 120 }}
              placeholder="选择状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="active">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="planned">计划中</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
            <RangePicker />
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddItem}
            >
              添加记录
            </Button>
            <Button icon={<CalendarOutlined />}>
              导出甘特图
            </Button>
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h3>人员流动甘特图</h3>
          <p style={{ color: '#666' }}>
            显示人员在不同项目间的流动情况和时间安排
          </p>
        </div>

        {renderGanttChart()}

        <Modal
          title={editingItem ? '编辑记录' : '添加记录'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveItem}
          >
            <Form.Item
              name="person"
              label="人员"
              rules={[{ required: true, message: '请选择人员' }]}
            >
              <Select placeholder="选择人员">
                {persons.map(person => (
                  <Option key={person} value={person}>{person}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="project"
              label="项目/流动"
              rules={[{ required: true, message: '请输入项目或流动信息' }]}
            >
              <Input placeholder="请输入项目名称或流动信息" />
            </Form.Item>

            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="选择角色">
                {roles.map(role => (
                  <Option key={role} value={role}>{role}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '请选择类型' }]}
            >
              <Select placeholder="选择类型">
                <Option value="project">项目参与</Option>
                <Option value="movement">人员流动</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="start_date"
              label="开始时间"
              rules={[{ required: true, message: '请选择开始时间' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="end_date"
              label="结束时间"
              rules={[{ required: true, message: '请选择结束时间' }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="选择状态">
                <Option value="active">进行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="planned">计划中</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PersonnelGantt;
