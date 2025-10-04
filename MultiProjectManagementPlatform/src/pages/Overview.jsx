import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tabs, Spin, Empty } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { overviewService } from '../services/api';
import './Overview.less';

const { TabPane } = Tabs;

const Overview = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 获取概览数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await overviewService.getDashboardData();
        setOverviewData(data);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 人员饱和度数据准备
  const getSaturationData = () => {
    if (!overviewData?.userAllocations) return [];
    
    return overviewData.userAllocations.map(user => ({
      name: user.userName,
      饱和度: user.saturation,
      fill: user.saturation > 80 ? '#ff4d4f' : user.saturation > 60 ? '#faad14' : '#52c41a',
    }));
  };

  // 项目趋势数据准备
  const getTrendData = () => {
    if (!overviewData?.projectTrend) return [];
    
    const { labels, completed, inProgress, planned } = overviewData.projectTrend;
    return labels.map((label, index) => ({
      月份: label,
      已完成: completed[index],
      进行中: inProgress[index],
      计划中: planned[index],
    }));
  };

  // 资源分配饼图数据准备
  const getResourcePieData = () => {
    if (!overviewData?.resourceAllocation) return [];
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return overviewData.resourceAllocation.map((project, index) => ({
      name: project.projectName,
      value: project.hours || 10,
      color: COLORS[index % COLORS.length],
    }));
  };

  // 渲染饼图扇区
  const renderPieSector = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${payload.name}: ${payload.value}h`}
        </text>
        <Cell key={`cell-${props.index}`} fill={fill} />
      </g>
    );
  };

  return (
    <div className="overview-container">
      <h1 className="page-title">数据概览</h1>
      
      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总项目数"
              value={overviewData?.totalProjects || 0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中项目"
              value={overviewData?.activeProjects || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已完成项目"
              value={overviewData?.completedProjects || 0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={overviewData?.totalMembers || 0}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表标签页 */}
      <Tabs defaultActiveKey="1" className="charts-tabs">
        <TabPane tab="人员饱和度" key="1">
          <Card>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : overviewData?.userAllocations?.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getSaturationData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, '饱和度']} />
                  <Legend />
                  <Bar dataKey="饱和度" name="人员饱和度">
                    {getSaturationData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无人员数据" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="项目趋势" key="2">
          <Card>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : overviewData?.projectTrend ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="月份" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="已完成" stroke="#52c41a" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="进行中" stroke="#1890ff" />
                  <Line type="monotone" dataKey="计划中" stroke="#faad14" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无趋势数据" />
            )}
          </Card>
        </TabPane>

        <TabPane tab="资源分配" key="3">
          <Card>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : overviewData?.resourceAllocation?.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={getResourcePieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderPieSector}
                  >
                    {getResourcePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}小时`, '工时']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无资源数据" />
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Overview;