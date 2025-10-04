import React, { useState, useEffect } from 'react';
import { Card, Tabs, Table, Select, Spin, Empty, Tag } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { overviewService, projectService, userService } from '../services/api';
import './ResourceAllocation.less';

const { TabPane } = Tabs;
const { Option } = Select;

const ResourceAllocation = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  // 获取概览数据、项目和用户列表
  useEffect(() => {
    fetchData();
  }, []);

  // 获取数据
  const fetchData = async () => {
    try {
      setLoading(true);
      // 获取概览数据
      const data = await overviewService.getDashboardData();
      setOverviewData(data);
      
      // 获取项目列表
      const projectsData = await projectService.getProjects();
      setProjects(projectsData);
      
      // 获取用户列表
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据ID获取用户名
  const getUserNameById = (id) => {
    const user = users.find(u => u.id === id);
    return user ? user.name : '未知用户';
  };

  // 根据ID获取项目名
  const getProjectNameById = (id) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : '未知项目';
  };

  // 准备项目资源分配数据
  const getProjectResourceData = () => {
    if (!overviewData?.resourceAllocation) return [];
    
    return overviewData.resourceAllocation
      .filter(item => selectedProject === 'all' || item.projectId === parseInt(selectedProject))
      .map(item => ({
        name: getProjectNameById(item.projectId),
        工时: item.hours || 0,
        成员数: item.members,
      }));
  };

  // 准备人员资源分配数据
  const getUserResourceData = () => {
    if (!overviewData?.userAllocations) return [];
    
    return overviewData.userAllocations
      .filter(item => selectedUser === 'all' || item.userId === parseInt(selectedUser))
      .map(item => ({
        name: item.userName,
        饱和度: item.saturation,
        工时: item.totalHours,
      }));
  };

  // 表格列配置 - 项目资源
  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '总工时',
      dataIndex: '工时',
      key: 'hours',
    },
    {
      title: '成员数',
      dataIndex: '成员数',
      key: 'members',
    },
    {
      title: '资源状态',
      key: 'status',
      render: (_, record) => {
        // 这里简化处理，根据工时和成员数判断资源状态
        let status = '正常';
        let color = 'green';
        if (record['工时'] > 100) {
          status = '资源紧张';
          color = 'orange';
        }
        if (record['工时'] > 200) {
          status = '资源超载';
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // 表格列配置 - 人员资源
  const userColumns = [
    {
      title: '成员姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '饱和度',
      dataIndex: '饱和度',
      key: 'saturation',
      render: (saturation) => {
        let color = 'green';
        if (saturation > 80) color = 'red';
        if (saturation > 60 && saturation <= 80) color = 'orange';
        return (
          <Tag color={color}>{saturation}%</Tag>
        );
      },
    },
    {
      title: '总工时',
      dataIndex: '工时',
      key: 'hours',
    },
    {
      title: '资源状态',
      key: 'status',
      render: (_, record) => {
        let status = '正常';
        let color = 'green';
        if (record['饱和度'] > 80) {
          status = '工作超载';
          color = 'red';
        }
        if (record['饱和度'] > 60 && record['饱和度'] <= 80) {
          status = '工作饱和';
          color = 'orange';
        }
        if (record['饱和度'] < 40) {
          status = '资源空闲';
          color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="resource-allocation-container">
      <h1 className="page-title">资源分配</h1>
      
      <Tabs defaultActiveKey="1" className="resource-tabs">
        <TabPane tab="项目资源分配" key="1">
          <Card>
            <div className="filter-section">
              <span className="filter-label">筛选项目：</span>
              <Select
                value={selectedProject}
                onChange={setSelectedProject}
                style={{ width: 200 }}
                placeholder="选择项目"
              >
                <Option value="all">全部项目</Option>
                {projects.map(project => (
                  <Option key={project.id} value={project.id}>{project.name}</Option>
                ))}
              </Select>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : overviewData?.resourceAllocation?.length > 0 ? (
              <div className="content-wrapper">
                <ResponsiveContainer width="100%" height={300} className="chart-container">
                  <BarChart data={getProjectResourceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="工时" fill="#1890ff" name="工时" />
                    <Bar dataKey="成员数" fill="#52c41a" name="成员数" />
                  </BarChart>
                </ResponsiveContainer>
                
                <Table
                  columns={projectColumns}
                  dataSource={getProjectResourceData()}
                  pagination={false}
                  size="small"
                  className="resource-table"
                />
              </div>
            ) : (
              <Empty description="暂无资源数据" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="人员资源分配" key="2">
          <Card>
            <div className="filter-section">
              <span className="filter-label">筛选成员：</span>
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                style={{ width: 200 }}
                placeholder="选择成员"
              >
                <Option value="all">全部成员</Option>
                {users.map(user => (
                  <Option key={user.id} value={user.id}>{user.name}</Option>
                ))}
              </Select>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : overviewData?.userAllocations?.length > 0 ? (
              <div className="content-wrapper">
                <ResponsiveContainer width="100%" height={300} className="chart-container">
                  <BarChart data={getUserResourceData()}> 
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="饱和度" fill="#ff4d4f" name="饱和度" />
                    <Bar dataKey="工时" fill="#722ed1" name="工时" />
                  </BarChart>
                </ResponsiveContainer>
                
                <Table
                  columns={userColumns}
                  dataSource={getUserResourceData()}
                  pagination={false}
                  size="small"
                  className="resource-table"
                />
              </div>
            ) : (
              <Empty description="暂无资源数据" />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ResourceAllocation;