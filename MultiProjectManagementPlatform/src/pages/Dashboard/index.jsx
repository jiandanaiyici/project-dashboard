import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Empty, Spin } from 'antd';
import { ClockCircleOutlined, UserOutlined, ProjectOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { overviewService } from '../../services/api';
import SaturationAnalysis from '../../components/SaturationAnalysis';
import './index.less';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 项目表格列配置
  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={`/projects/${record.id}`}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === '进行中') color = 'processing';
        if (status === '已完成') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress percent={progress} size="small" status={progress === 100 ? 'success' : 'active'} />
      ),
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '团队成员',
      dataIndex: 'members',
      key: 'members',
      render: (members) => `${members.length}人`,
    },
  ];

  // 成员饱和度表格列配置
  const memberColumns = [
    {
      title: '成员姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '饱和度',
      dataIndex: 'saturation',
      key: 'saturation',
      render: (saturation) => {
        let color = 'green';
        if (saturation > 80) color = 'red';
        if (saturation > 60 && saturation <= 80) color = 'orange';
        return (
          <div className="saturation-indicator">
            <span style={{ color }} className="saturation-text">{saturation}%</span>
            <Progress percent={saturation} size="small" strokeColor={color} />
          </div>
        );
      },
    },
    {
      title: '工时',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (hours) => `${hours}h`,
    },
  ];

  // 获取仪表盘数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await overviewService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 计算高负荷成员数量
  const getHighLoadMembers = () => {
    if (!dashboardData?.userAllocations) return 0;
    return dashboardData.userAllocations.filter(user => user.saturation > 80).length;
  };

  return (
    <div className="dashboard-container">
      <h1 className="page-title">仪表盘</h1>

      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总项目数"
              value={dashboardData?.totalProjects || 0}
              prefix={<ProjectOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中项目"
              value={dashboardData?.activeProjects || 0}
              prefix={<ClockCircleOutlined />}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成项目"
              value={dashboardData?.completedProjects || 0}
              prefix={<CheckCircleOutlined />}
              suffix="个"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={dashboardData?.totalMembers || 0}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="高负荷成员"
              value={getHighLoadMembers()}
              prefix={<UserOutlined />}
              suffix="人"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总工时"
              value={dashboardData?.totalHours || 0}
              prefix={<ClockCircleOutlined />}
              suffix="小时"
            />
          </Card>
        </Col>
      </Row>

      {/* 人员饱和度分析区域 */}
      <Row gutter={[16, 16]} className="saturation-section">
        <Col xs={24}>
          <SaturationAnalysis
            userAllocations={dashboardData?.userAllocations || []}
            loading={loading}
            title="团队饱和度分析"
          />
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]} className="main-content">
        {/* 项目进度表格 */}
        <Col xs={24} lg={12}>
          <Card title="项目进度" loading={loading}>
            {loading ? (
              <div className="loading-container">
                <Spin size="small" tip="加载中..." />
              </div>
            ) : dashboardData?.resourceAllocation?.length > 0 ? (
              <Table
                columns={projectColumns}
                dataSource={dashboardData.resourceAllocation.map(item => ({
                  ...item,
                  key: item.projectId,
                  status: item.hours > 0 ? '进行中' : '计划中',
                  progress: Math.floor(Math.random() * 100),
                  manager: '项目经理',
                }))}
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="暂无项目数据" />
            )}
          </Card>
        </Col>

        {/* 成员饱和度表格 */}
        <Col xs={24} lg={12}>
          <Card title="成员饱和度" loading={loading}>
            {loading ? (
              <div className="loading-container">
                <Spin size="small" tip="加载中..." />
              </div>
            ) : dashboardData?.userAllocations?.length > 0 ? (
              <Table
                columns={memberColumns}
                dataSource={dashboardData.userAllocations}
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="暂无成员数据" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;