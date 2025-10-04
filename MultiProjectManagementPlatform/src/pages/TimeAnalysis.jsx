import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, Statistic, Tabs, Table, Select, DatePicker, Tag, Tooltip, Button } from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AppContext } from '../context/AppContext';
import { timeTrackingService, userService, projectService } from '../services/api';
import './TimeAnalysis.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const TimeAnalysis = () => {
  const { user } = useContext(AppContext);
  const [statistics, setStatistics] = useState(null);
  const [timeRecords, setTimeRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(user?.id || null);
  const [dateRange, setDateRange] = useState(null);
  const [projectId, setProjectId] = useState(null);

  // 任务类型颜色映射
  const taskTypeColors = {
    '开发': '#1890ff',
    '设计': '#52c41a',
    '管理': '#faad14',
    '测试': '#f5222d',
    '文档': '#722ed1',
    '会议': '#13c2c2',
    '其他': '#8c8c8c'
  };

  // 项目颜色映射
  const projectColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'];

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, []);

  // 当用户或日期范围变化时重新获取数据
  useEffect(() => {
    if (selectedUser) {
      fetchData();
    }
  }, [selectedUser, dateRange, projectId]);

  // 初始化数据
  const initializeData = async () => {
    try {
      const users = await userService.getUsers();
      setAllUsers(users);

      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  };

  // 获取统计数据
  const fetchData = async () => {
    try {
      setLoading(true);

      // 获取统计数据
      const stats = await timeTrackingService.getTimeStatistics(selectedUser);
      setStatistics(stats);

      // 获取筛选后的时间记录
      const filters = {
        userId: selectedUser
      };

      if (dateRange) {
        filters.startDate = dateRange[0].format('YYYY-MM-DD');
        filters.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      if (projectId) {
        filters.projectId = projectId;
      }

      const records = await timeTrackingService.getTimeRecords(filters);
      setTimeRecords(records);
    } catch (error) {
      console.error('Failed to fetch time analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取项目名称
  const getProjectName = (id) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : '未知项目';
  };

  // 获取用户名称
  const getUserName = (id) => {
    const user = allUsers.find(u => u.id === id);
    return user ? user.name : '未知用户';
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  // 准备项目工时图表数据
  const prepareProjectChartData = () => {
    if (!statistics?.projectStats || !projects.length) return [];

    return Object.entries(statistics.projectStats)
      .map(([projectId, hours]) => ({
        name: getProjectName(parseInt(projectId)),
        hours,
        projectId: parseInt(projectId)
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  // 准备任务类型图表数据
  const prepareTaskTypeChartData = () => {
    if (!timeRecords.length) return [];

    const taskTypeStats = {};
    timeRecords.forEach(record => {
      if (!taskTypeStats[record.type]) {
        taskTypeStats[record.type] = 0;
      }
      taskTypeStats[record.type] += record.hours;
    });

    return Object.entries(taskTypeStats)
      .map(([type, hours]) => ({
        name: type,
        hours,
        value: hours
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  // 准备工时趋势图表数据
  const prepareTrendChartData = () => {
    if (!timeRecords.length) return [];

    const dailyStats = {};
    timeRecords.forEach(record => {
      if (!dailyStats[record.date]) {
        dailyStats[record.date] = 0;
      }
      dailyStats[record.date] += record.hours;
    });

    return Object.entries(dailyStats)
      .map(([date, hours]) => ({
        date: formatDate(date),
        hours
      }))
      .sort((a, b) => new Date(a.date.replace(/\//g, '-')) - new Date(b.date.replace(/\//g, '-')));
  };

  // 表格列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: formatDate
    },
    {
      title: '项目',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (id) => (
        <Tooltip title={getProjectName(id)}>
          <div className="project-name">{getProjectName(id)}</div>
        </Tooltip>
      )
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={taskTypeColors[type] || '#8c8c8c'}>
          {type}
        </Tag>
      )
    },
    {
      title: '工时',
      dataIndex: 'hours',
      key: 'hours',
      render: (hours) => <strong>{hours}h</strong>,
      sorter: (a, b) => a.hours - b.hours
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    }
  ];

  // 获取项目工时占比
  const getProjectPercentage = (projectHours) => {
    if (!statistics?.totalHours || statistics.totalHours === 0) return '0%';
    return `${((projectHours / statistics.totalHours) * 100).toFixed(1)}%`;
  };

  // 重置筛选条件
  const resetFilters = () => {
    setDateRange(null);
    setProjectId(null);
  };

  return (
    <div className="time-analysis-container">
      <div className="page-header">
        <h1 className="page-title">时间管理分析</h1>

        {/* 筛选条件 */}
        <div className="filter-container">
          <div className="filter-item">
            <label className="filter-label">选择成员</label>
            <Select
              value={selectedUser}
              onChange={setSelectedUser}
              className="filter-select"
              placeholder="请选择成员"
              allowClear
            >
              {allUsers.map(user => (
                <Option key={user.id} value={user.id}>
                  <div className="user-option">
                    <UserOutlined className="user-icon" />
                    <span>{user.name} ({user.department})</span>
                  </div>
                </Option>
              ))}
            </Select>
          </div>

          <div className="filter-item">
            <label className="filter-label">选择日期</label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={['开始日期', '结束日期']}
              className="date-range-picker"
            />
          </div>

          <div className="filter-item">
            <label className="filter-label">选择项目</label>
            <Select
              value={projectId}
              onChange={setProjectId}
              className="filter-select"
              placeholder="请选择项目"
              allowClear
            >
              {projects.map(project => (
                <Option key={project.id} value={project.id}>
                  {project.name}
                </Option>
              ))}
            </Select>
          </div>

          <Button onClick={resetFilters} className="reset-button">
            重置
          </Button>
        </div>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="总工时"
              value={statistics?.totalHours || 0}
              suffix="小时"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="平均工时/天"
              value={statistics?.averageHours || 0}
              suffix="小时"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="记录天数"
              value={statistics?.daysRecorded || 0}
              suffix="天"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="工时记录数"
              value={timeRecords.length}
              suffix="条"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表分析区域 */}
      <Tabs
        defaultActiveKey="project"
        className="analysis-tabs"
        items={[
          {
            key: 'project',
            label: <span><BarChartOutlined /> 项目工时分布</span>,
            children: (
              <Card className="chart-card">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={prepareProjectChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value, name) => [`${value}小时`, '工时']}
                        labelFormatter={(label, payload) => {
                          if (payload && payload.length > 0) {
                            const projectId = payload[0].payload.projectId;
                            const percentage = getProjectPercentage(payload[0].value);
                            return `${label} (${percentage})`;
                          }
                          return label;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="hours" name="工时">
                        {prepareProjectChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={projectColors[index % projectColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )
          },
          {
            key: 'taskType',
            label: <span><PieChartOutlined /> 任务类型分布</span>,
            children: (
              <Card className="chart-card">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={prepareTaskTypeChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareTaskTypeChartData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={taskTypeColors[entry.name] || '#8c8c8c'}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value}小时`, '工时']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )
          },
          {
            key: 'trend',
            label: <span><LineChartOutlined /> 工时趋势分析</span>,
            children: (
              <Card className="chart-card">
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={prepareTrendChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => [`${value}小时`, '工时']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        name="日工时"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )
          },
          {
            key: 'details',
            label: <span><CalendarOutlined /> 工时明细</span>,
            children: (
              <Card className="records-card">
                <Table
                  columns={columns}
                  dataSource={timeRecords}
                  loading={loading}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} 共 ${total} 条`,
                  }}
                />
              </Card>
            )
          }
        ]}
      />
    </div>
  );
};

export default TimeAnalysis;