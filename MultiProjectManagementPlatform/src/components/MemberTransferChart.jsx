import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Empty, Spin, Statistic, Tag, Select, Badge, Space, Tooltip, DatePicker } from 'antd';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
  UserOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  SearchOutlined,
  ProjectOutlined,
  TeamOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import './MemberTransferChart.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MemberTransferChart = ({
  transferData = [],
  projects = [],
  users = [],
  loading = false,
  title = '人员调动分析'
}) => {
  // 状态管理
  const [dateRange, setDateRange] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  // 获取用户名称
  const getUserNameById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : '未知用户';
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 计算两个日期之间的天数
  const getDaysBetween = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 计算项目人日和参与人员信息
  const calculateProjectDays = (data) => {
    const projectDays = {};

    data.forEach(item => {
      const days = getDaysBetween(item.startDate, item.endDate);
      const effectiveDays = days * item.percentage / 100;

      if (!projectDays[item.projectId]) {
        projectDays[item.projectId] = {
          projectId: item.projectId,
          projectName: item.projectName,
          totalDays: 0,
          userCount: new Set(),
          users: new Map(),
          startDate: item.startDate,
          endDate: item.endDate
        };
      }

      projectDays[item.projectId].totalDays += effectiveDays;
      projectDays[item.projectId].userCount.add(item.userId);

      // 存储用户信息
      const userName = getUserNameById(item.userId);
      if (!projectDays[item.projectId].users.has(item.userId)) {
        projectDays[item.projectId].users.set(item.userId, { id: item.userId, name: userName });
      }

      // 修正日期比较逻辑
      projectDays[item.projectId].startDate = new Date(projectDays[item.projectId].startDate) < new Date(item.startDate) 
        ? projectDays[item.projectId].startDate 
        : item.startDate;
      projectDays[item.projectId].endDate = new Date(projectDays[item.projectId].endDate) > new Date(item.endDate) 
        ? projectDays[item.projectId].endDate 
        : item.endDate;
    });

    // 转换Set和Map为适当的格式
    Object.values(projectDays).forEach(project => {
      project.userCount = project.userCount.size;
      project.users = Array.from(project.users.values()); // 转换为数组以便渲染
      // 先将时间戳转换为Date对象，然后再调用toISOString方法
      project.startDate = new Date(project.startDate).toISOString().split('T')[0];
      project.endDate = new Date(project.endDate).toISOString().split('T')[0];
    });

    return Object.values(projectDays);
  };

  // 计算人员项目分配数据
  const getUserProjectAllocation = (data) => {
    const allocationData = {};

    data.forEach(item => {
      if (!allocationData[item.userId]) {
        allocationData[item.userId] = [];
      }

      allocationData[item.userId].push({
        projectId: item.projectId,
        projectName: item.projectName,
        startDate: item.startDate,
        endDate: item.endDate,
        percentage: item.percentage,
        days: Math.round(getDaysBetween(item.startDate, item.endDate) * item.percentage / 100)
      });
    });

    return Object.entries(allocationData).map(([userId, projects]) => ({
      userId,
      userName: getUserNameById(userId),
      projects
    }));
  };

  // 过滤数据
  useEffect(() => {
    let result = [...transferData];

    // 按日期范围过滤
    if (dateRange.length === 2) {
      const start = dateRange[0].toISOString().split('T')[0];
      const end = dateRange[1].toISOString().split('T')[0];
      result = result.filter(item => {
        return item.startDate >= start && item.endDate <= end;
      });
    }

    // 按项目过滤
    if (selectedProject !== 'all') {
      result = result.filter(item => item.projectId === selectedProject);
    }

    // 按用户过滤
    if (selectedUser !== 'all') {
      result = result.filter(item => item.userId === selectedUser);
    }

    setFilteredData(result);
  }, [transferData, dateRange, selectedProject, selectedUser]);

  // 准备项目人日图表数据
  const getProjectDaysChartData = () => {
    const projectDays = calculateProjectDays(filteredData);
    return projectDays.map(project => ({
      name: project.projectName,
      人日: Math.round(project.totalDays),
      参与人数: project.userCount
    }));
  };

  // 准备人员项目分配图表数据
  const getUserProjectChartData = () => {
    const allocationData = getUserProjectAllocation(filteredData);
    return allocationData.flatMap(user =>
      user.projects.map(project => ({
        userName: user.userName,
        projectName: project.projectName,
        人日: project.days
      }))
    );
  };

  // 渲染人员项目分配的动线流转图
  const renderTransferFlow = () => {
    const allocationData = getUserProjectAllocation(filteredData);

    if (allocationData.length === 0) {
      return <Empty description="暂无人员调动数据" className="empty-container" />;
    }

    return (
      <div className="transfer-flow-container">
        <h3 className="flow-title">人员项目分配动线图</h3>
        <div className="flow-content">
          {/* 左侧人员列 */}
          <div className="user-column">
            {allocationData.map(user => (
              <div key={user.userId} className="user-node">
                <div className="user-info">
                  <UserOutlined className="user-icon" />
                  <span className="user-name">{user.userName}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 中间动线 */}
          <div className="flow-lines">
            {allocationData.map((user, userIndex) =>
              user.projects.map((project, projectIndex) => {
                const totalProjects = Math.max(...allocationData.map(u => u.projects.length));
                const lineTop = (userIndex * 100 / (allocationData.length - 1 || 1)) + '%';
                const lineHeight = Math.min(30, 100 / totalProjects) + 'px';
                const lineLeft = (projectIndex * 100 / (totalProjects - 1 || 1)) + '%';

                return (
                  <Tooltip
                    key={`${user.userId}-${project.projectId}`}
                    title={`${user.userName} 在 ${project.projectName} 投入 ${project.days} 人日`}
                  >
                    <div
                      className="flow-line"
                      style={{
                        top: lineTop,
                        height: lineHeight,
                        left: lineLeft,
                        opacity: project.percentage / 100
                      }}
                    />
                  </Tooltip>
                );
              })
            )}
          </div>

          {/* 右侧项目列 */}
          <div className="project-column">
            {Array.from(new Set(
              filteredData.map(item => ({ id: item.projectId, name: item.projectName }))
            )).map(project => (
              <div key={project.id} className="project-node">
                <div className="project-info">
                  <FileDoneOutlined className="project-icon" />
                  <span className="project-name">{project.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 统计信息
  const projectDaysStats = calculateProjectDays(filteredData);
  const totalManDays = Math.round(projectDaysStats.reduce((sum, project) => sum + project.totalDays, 0));
  const totalProjects = projectDaysStats.length;
  const totalUsers = new Set(filteredData.map(item => item.userId)).size;

  return (
    <div className="member-transfer-chart">
      <Card className="transfer-chart-card">
        <div className="transfer-chart-header">
          <h2 className="transfer-chart-title">
            <TeamOutlined className="title-icon" />
            人员流动分析
            <Tooltip title="展示人员在不同项目间的分配和流动情况">
              <InfoCircleOutlined style={{ marginLeft: 8, fontSize: 16 }} />
            </Tooltip>
          </h2>
        </div>

        <div className="transfer-chart-content">
          {/* 过滤条件 */}
          <div className="filter-section">
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} sm={8} md={6}>
                <div className="filter-item">
                  <span className="filter-label">日期范围：</span>
                  <DatePicker.RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates || [])}
                    className="date-filter"
                  />
                </div>
              </Col>

              <Col xs={24} sm={8} md={6}>
                <div className="filter-item">
                  <span className="filter-label">项目：</span>
                  <Select
                    value={selectedProject}
                    onChange={setSelectedProject}
                    style={{ width: 150 }}
                    placeholder="选择项目"
                    allowClear
                  >
                    <Option value="all">全部项目</Option>
                    {projects.map(project => (
                      <Option key={project.id} value={project.id}>{project.name}</Option>
                    ))}
                  </Select>
                </div>
              </Col>

              <Col xs={24} sm={8} md={6}>
                <div className="filter-item">
                  <span className="filter-label">人员：</span>
                  <Select
                    value={selectedUser}
                    onChange={setSelectedUser}
                    style={{ width: 150 }}
                    placeholder="选择人员"
                    allowClear
                  >
                    <Option value="all">全部人员</Option>
                    {users.map(user => (
                      <Option key={user.id} value={user.id}>{user.name}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
          </div>

          {loading ? (
            <div className="loading-container">
              <Spin size="large" tip="正在加载人员流动数据..." />
            </div>
          ) : filteredData.length > 0 ? (
            <>
              {/* 数据概览卡片 */}
              <div className="data-overview">
                <Badge.Ribbon text="最新数据" color="blue">
                  <Card className="overview-card">
                    <Row gutter={[16, 16]} className="stats-row">
                      <Col xs={24} sm={12} md={8}>
                        <Card className="stat-card">
                          <Statistic
                            title="总投入人日"
                            value={totalManDays}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix="人日"
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Card className="stat-card">
                          <Statistic
                            title="涉及项目数"
                            value={totalProjects}
                            prefix={<FileDoneOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                            suffix="个"
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Card className="stat-card">
                          <Statistic
                            title="参与人数"
                            value={totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                            suffix="人"
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              </div>

              {/* 项目人日分布图 */}
              <div className="chart-section">
                <Card className="chart-card">
                  <h3 className="chart-title">
                    项目投入分析
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={getProjectDaysChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip
                        formatter={(value, name) => [`${value}${name === '人日' ? '人日' : '人'}`, name === '人日' ? '投入人日' : '参与人数']}
                        labelFormatter={(label) => `项目: ${label}`}
                        contentStyle={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="人日" name="投入人日" fill="#1890ff" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="参与人数" name="参与人数" fill="#52c41a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 人员项目分配图 */}
              <div className="chart-section">
                <Card className="chart-card">
                  <h3 className="chart-title">
                    <UserOutlined /> 人员项目分配明细
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={getUserProjectChartData()} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="userName" type="category" width={120} tick={{ fontSize: 12 }} />
                      <RechartsTooltip
                        formatter={(value) => [`${value}人日`, '投入人日']}
                        labelFormatter={(label, data) => {
                          const entry = data[0]?.payload;
                          return `${label} - ${entry?.projectName}`;
                        }}
                        contentStyle={{ borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="人日" name="投入人日" radius={[0, 4, 4, 0]}>
                        {getUserProjectChartData().map((entry, index) => {
                          const projectIndex = projects.findIndex(p => p.name === entry.projectName);
                          const colors = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#ff4d4f', '#13c2c2'];
                          return <Cell key={`cell-${index}`} fill={colors[projectIndex % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* 人员调动动线图 */}
              <div className="flow-section">
                <Card className="chart-card">
                  <h3 className="chart-title">
                    <ArrowRightOutlined /> 人员项目流动关系
                  </h3>
                  <div className="transfer-flow-container">
                    {renderTransferFlow()}
                  </div>
                </Card>
              </div>

              {/* 项目详细信息 */}
              <div className="project-details-section">
                <Card className="details-card">
                  <h3 className="details-title">
                    <ProjectOutlined /> 项目详细信息
                  </h3>
                  <div className="details-grid">
                    {projectDaysStats.map(project => (
                      <div key={project.projectId} className="project-detail-card">
                        <div className="detail-header">
                          <h4 className="project-name">{project.projectName}</h4>
                          <Tag color="blue">{Math.round(project.totalDays)}人日</Tag>
                        </div>
                        <div className="detail-info">
                          <p><strong>时间范围：</strong>{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                          <p><strong>参与人数：</strong>{project.userCount}人</p>
                          <div className="participants-info">
                            <strong>参与人员：</strong>
                            <Space size="small" wrap>
                              {project.users?.map((user, index) => (
                                <Badge key={user.id} color="blue" text={user.name} showZero />
                              ))}
                            </Space>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <div className="empty-container">
              <Empty
                description="暂无人员流动数据"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemberTransferChart;