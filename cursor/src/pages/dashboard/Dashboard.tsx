import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Alert, Spin, Button } from 'antd';
import { ReloadOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import RingChart from '@/components/charts/RingChart';
import TrendChart from '@/components/charts/TrendChart';
import GaugeChart from '@/components/charts/GaugeChart';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Alert as AlertType, PerformanceMetrics } from '@/types';

const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [mockData, setMockData] = useState({
    projects: [
      { name: '项目A', value: 35, color: '#1890ff' },
      { name: '项目B', value: 28, color: '#52c41a' },
      { name: '项目C', value: 22, color: '#faad14' },
      { name: '项目D', value: 15, color: '#f5222d' },
    ],
    applications: [
      { name: '应用A', value: 45, color: '#1890ff' },
      { name: '应用B', value: 32, color: '#52c41a' },
      { name: '应用C', value: 23, color: '#faad14' },
    ],
    trendData: [
      { date: '2024-01-01', value: 1200, category: 'PV' },
      { date: '2024-01-02', value: 1100, category: 'PV' },
      { date: '2024-01-03', value: 1300, category: 'PV' },
      { date: '2024-01-04', value: 1400, category: 'PV' },
      { date: '2024-01-05', value: 1350, category: 'PV' },
      { date: '2024-01-01', value: 800, category: 'UV' },
      { date: '2024-01-02', value: 750, category: 'UV' },
      { date: '2024-01-03', value: 850, category: 'UV' },
      { date: '2024-01-04', value: 900, category: 'UV' },
      { date: '2024-01-05', value: 880, category: 'UV' },
    ],
    performanceData: [
      { name: 'LCP', value: 2.1, max: 4.0, unit: 's' },
      { name: 'FID', value: 85, max: 200, unit: 'ms' },
      { name: 'CLS', value: 0.15, max: 0.25, unit: '' },
    ],
  });

  const { metrics, loading, error, refresh } = usePerformanceMonitoring('app-001');

  useEffect(() => {
    // 检查性能指标阈值并生成告警
    if (metrics) {
      const newAlerts: AlertType[] = [];
      
      if (metrics.lcp > 2500) {
        newAlerts.push({
          id: 'lcp-warning',
          type: 'warning',
          title: 'LCP性能警告',
          message: 'LCP超过阈值 (2.5s)',
          description: `当前LCP: ${metrics.lcp.toFixed(2)}ms`,
          timestamp: new Date(),
          resolved: false,
          appId: 'app-001',
        });
      }
      
      if (metrics.fid > 100) {
        newAlerts.push({
          id: 'fid-error',
          type: 'error',
          title: 'FID性能错误',
          message: 'FID超过阈值 (100ms)',
          description: `当前FID: ${metrics.fid.toFixed(2)}ms`,
          timestamp: new Date(),
          resolved: false,
          appId: 'app-001',
        });
      }

      if (metrics.errorRate > 0.05) {
        newAlerts.push({
          id: 'error-rate-warning',
          type: 'warning',
          title: '错误率警告',
          message: '错误率超过阈值 (5%)',
          description: `当前错误率: ${(metrics.errorRate * 100).toFixed(2)}%`,
          timestamp: new Date(),
          resolved: false,
          appId: 'app-001',
        });
      }
      
      setAlerts(newAlerts);
    }
  }, [metrics]);

  const handleRefresh = () => {
    refresh();
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <WarningOutlined style={{ color: '#f5222d' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard" style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>项目聚合平台</h1>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
        >
          刷新数据
        </Button>
      </div>

      {/* 告警区域 */}
      {alerts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="系统告警" size="small">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  type={alert.type}
                  message={alert.message}
                  description={alert.description}
                  icon={getAlertIcon(alert.type)}
                  showIcon
                  style={{ marginBottom: 8 }}
                />
              ))}
            </Card>
          </Col>
        </Row>
      )}

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总项目数"
              value={12}
              valueStyle={{ color: '#1890ff' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃应用"
              value={8}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="团队人数"
              value={45}
              valueStyle={{ color: '#faad14' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统可用性"
              value={99.9}
              precision={1}
              valueStyle={{ color: '#52c41a' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        {/* 项目分布环形图 */}
        <Col span={12}>
          <Card title="项目分布" style={{ height: 400 }}>
            <RingChart
              data={mockData.projects}
              height={300}
              title=""
            />
          </Card>
        </Col>

        {/* 应用分布环形图 */}
        <Col span={12}>
          <Card title="应用分布" style={{ height: 400 }}>
            <RingChart
              data={mockData.applications}
              height={300}
              title=""
            />
          </Card>
        </Col>

        {/* 性能指标仪表盘 */}
        <Col span={12}>
          <Card title="性能指标" style={{ height: 400 }}>
            <GaugeChart
              data={mockData.performanceData}
              height={300}
              showMultiple={true}
              title=""
            />
          </Card>
        </Col>

        {/* 实时性能监控 */}
        <Col span={12}>
          <Card title="实时性能监控" style={{ height: 400 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>正在加载性能数据...</div>
              </div>
            ) : error ? (
              <Alert
                type="error"
                message="加载失败"
                description={error}
                showIcon
              />
            ) : metrics ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="LCP"
                      value={metrics.lcp}
                      precision={2}
                      suffix="ms"
                      valueStyle={{ 
                        color: metrics.lcp > 2500 ? '#f5222d' : '#52c41a' 
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="FID"
                      value={metrics.fid}
                      precision={2}
                      suffix="ms"
                      valueStyle={{ 
                        color: metrics.fid > 100 ? '#f5222d' : '#52c41a' 
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="CLS"
                      value={metrics.cls}
                      precision={3}
                      valueStyle={{ 
                        color: metrics.cls > 0.25 ? '#f5222d' : '#52c41a' 
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="错误率"
                      value={metrics.errorRate * 100}
                      precision={2}
                      suffix="%"
                      valueStyle={{ 
                        color: metrics.errorRate > 0.05 ? '#f5222d' : '#52c41a' 
                      }}
                    />
                  </Col>
                </Row>
              </div>
            ) : null}
          </Card>
        </Col>

        {/* 趋势图 */}
        <Col span={24}>
          <Card title="PV/UV趋势" style={{ height: 400 }}>
            <TrendChart
              data={mockData.trendData}
              height={300}
              seriesField="category"
              showArea={true}
              title=""
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
