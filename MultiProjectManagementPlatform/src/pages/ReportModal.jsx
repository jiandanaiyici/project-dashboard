import React from 'react';
import { Modal, Card, Row, Col, Statistic, Tag, Typography, Empty } from 'antd';
import { BarChartOutlined, DatabaseOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const { Title, Text, Paragraph } = Typography;

/**
 * 报表查看模态框组件
 * 支持查看总体报表和应用详情报表
 */
const ReportModal = ({ visible, onCancel, reportData }) => {
  // 计算健康趋势数据
  const getHealthTrendData = (data) => {
    if (!data || !data.healthTrend) {
      return [];
    }
    return data.healthTrend.map((item) => ({
      time: item.time,
      score: item.score,
      availability: item.availability,
      responseTime: item.responseTime,
    }));
  };

  // 计算错误类型分布数据
  const getErrorDistributionData = (data) => {
    if (!data || !data.errorDistribution) {
      return [];
    }
    return Object.entries(data.errorDistribution).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // 获取颜色配置
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 健康趋势数据
  const healthTrendData = getHealthTrendData(reportData);
  // 错误类型分布数据
  const errorDistributionData = getErrorDistributionData(reportData);

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChartOutlined style={{ color: '#1890ff' }} />
          <span>{reportData?.appName ? `${reportData.appName} - 健康报表` : '总体健康报表'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={reportData?.appName ? 800 : 960}
      footer={null}
      destroyOnClose
    >
      {/* 应用信息（仅在查看应用详情时显示） */}
      {reportData?.appName && (
        <div className="report-app-info">
          <Row gutter={16} align="middle">
            <Col span={24}>
              <Title level={4} style={{ marginBottom: 12 }}>{reportData.appName}</Title>
            </Col>
            <Col xs={8} sm={6} md={4}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag color={reportData.status === '正常' ? 'green' : reportData.status === '异常' ? 'red' : 'orange'}>
                  {reportData.status}
                </Tag>
              </div>
            </Col>
            <Col xs={8} sm={6} md={4}>
              <Text type="secondary">类别: </Text>
              <Text>{reportData.category}</Text>
            </Col>
            <Col xs={8} sm={12} md={16}>
              <Text type="secondary">最后更新: </Text>
              <Text>{formatDate(reportData.lastUpdated)}</Text>
            </Col>
          </Row>
        </div>
      )}

      {/* 关键指标统计 */}
      <div className="report-content">
        <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>关键指标</Title>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <Statistic
                title="健康评分"
                value={reportData?.healthScore || 0}
                suffix="/100"
                valueStyle={{
                  color: reportData?.healthScore > 80 ? '#3f8600' : reportData?.healthScore > 60 ? '#cf1322' : '#cf1322',
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <Statistic
                title="可用性"
                value={reportData?.availability || 0}
                suffix="%"
                valueStyle={{
                  color: reportData?.availability > 99 ? '#3f8600' : '#cf1322',
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card hoverable>
              <Statistic
                title="平均响应时间"
                value={reportData?.avgResponseTime || 0}
                suffix="ms"
                valueStyle={{
                  color: reportData?.avgResponseTime < 500 ? '#3f8600' : '#cf1322',
                }}
              />
            </Card>
          </Col>
          {!reportData?.appName && (
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <Statistic
                  title="正常应用数"
                  value={reportData?.normalApps || 0}
                  prefix={<DatabaseOutlined />}
                />
              </Card>
            </Col>
          )}
          {!reportData?.appName && (
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <Statistic
                  title="异常应用数"
                  value={reportData?.abnormalApps || 0}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
          )}
          {!reportData?.appName && (
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <Statistic
                  title="监控总时长"
                  value={reportData?.monitoringDays || 0}
                  suffix="天"
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          )}
        </Row>
      </div>

      {/* 图表展示 */}
      <div className="report-content">
        <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>历史趋势分析</Title>
        <Card>
          {healthTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="score"
                  name="健康评分"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="availability"
                  name="可用性(%)"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTime"
                  name="响应时间(ms)"
                  stroke="#ffc658"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty description="暂无历史数据" />
          )}
        </Card>
      </div>

      {/* 错误分布（仅在有错误数据时显示） */}
      {errorDistributionData.length > 0 && (
        <div className="report-content">
          <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>错误类型分布</Title>
          <Card>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={errorDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {errorDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Col>
              <Col xs={24} md={12}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={errorDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="错误数量" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          </Card>
        </div>
      )}

      {/* 报表总结 */}
      <div className="report-summary">
        <Title level={4} style={{ marginBottom: 12 }}>报表总结</Title>
        <Paragraph>{reportData?.summary || '暂无总结信息'}</Paragraph>
      </div>
    </Modal>
  );
};

export default ReportModal;