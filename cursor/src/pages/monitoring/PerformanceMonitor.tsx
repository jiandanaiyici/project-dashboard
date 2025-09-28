import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Alert, 
  Statistic,
  Table,
  Tag,
  Progress
} from 'antd';
import { 
  ReloadOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  BugOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import GaugeChart from '@/components/charts/GaugeChart';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { PerformanceMetrics, ErrorReport } from '@/types';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PerformanceMonitor: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string>('app-001');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [errorLogs, setErrorLogs] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  const { metrics, loading: metricsLoading, error, refresh } = usePerformanceMonitoring(selectedApp);

  // 获取错误日志
  const fetchErrorLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/monitoring/errors/${selectedApp}?limit=10`);
      const data = await response.json();

      if (data.success) {
        setErrorLogs(data.data.errors);
      }
    } catch (error) {
      console.error('获取错误日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取性能趋势数据
  const fetchPerformanceTrend = async () => {
    try {
      const endTime = new Date();
      const startTime = new Date();
      
      switch (timeRange) {
        case '24h':
          startTime.setHours(startTime.getHours() - 24);
          break;
        case '7d':
          startTime.setDate(startTime.getDate() - 7);
          break;
        case '30d':
          startTime.setDate(startTime.getDate() - 30);
          break;
      }

      const response = await fetch(`/api/monitoring/metrics/history/${selectedApp}?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}&granularity=${timeRange === '24h' ? 'hour' : 'day'}`);
      const data = await response.json();

      if (data.success) {
        // 处理趋势数据
        return data.data.metrics;
      }
    } catch (error) {
      console.error('获取性能趋势失败:', error);
    }
    return {};
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [selectedApp]);

  // 检查性能告警
  useEffect(() => {
    if (metrics) {
      const newAlerts = [];
      
      if (metrics.lcp > 2500) {
        newAlerts.push({
          type: 'warning',
          message: 'LCP超过阈值 (2.5s)',
          description: `当前LCP: ${metrics.lcp.toFixed(2)}ms`,
          icon: <WarningOutlined />
        });
      }
      
      if (metrics.fid > 100) {
        newAlerts.push({
          type: 'error',
          message: 'FID超过阈值 (100ms)',
          description: `当前FID: ${metrics.fid.toFixed(2)}ms`,
          icon: <WarningOutlined />
        });
      }

      if (metrics.errorRate > 0.05) {
        newAlerts.push({
          type: 'error',
          message: '错误率超过阈值 (5%)',
          description: `当前错误率: ${(metrics.errorRate * 100).toFixed(2)}%`,
          icon: <BugOutlined />
        });
      }

      if (metrics.availability < 99.9) {
        newAlerts.push({
          type: 'warning',
          message: '可用性低于阈值 (99.9%)',
          description: `当前可用性: ${metrics.availability.toFixed(2)}%`,
          icon: <WarningOutlined />
        });
      }
      
      setAlerts(newAlerts);
    }
  }, [metrics]);

  // 错误日志表格列定义
  const errorColumns = [
    {
      title: '错误类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          javascript: { color: 'red', text: 'JavaScript' },
          promise: { color: 'orange', text: 'Promise' },
          network: { color: 'blue', text: '网络' },
          resource: { color: 'purple', text: '资源' }
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true
    },
    {
      title: '文件',
      dataIndex: 'filename',
      key: 'filename',
      render: (filename: string) => filename ? filename.split('/').pop() : '-'
    },
    {
      title: '行号',
      dataIndex: 'line_number',
      key: 'line_number',
      render: (line: number) => line || '-'
    },
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString()
    }
  ];

  // 性能指标数据
  const performanceData = metrics ? [
    { name: 'LCP', value: metrics.lcp, max: 4000, unit: 'ms' },
    { name: 'FID', value: metrics.fid, max: 200, unit: 'ms' },
    { name: 'CLS', value: metrics.cls, max: 0.25, unit: '' },
    { name: 'FCP', value: metrics.fcp, max: 2000, unit: 'ms' }
  ] : [];

  return (
    <div className="performance-monitor">
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Select
              value={selectedApp}
              onChange={setSelectedApp}
              style={{ width: 200 }}
            >
              <Option value="app-001">应用A</Option>
              <Option value="app-002">应用B</Option>
              <Option value="app-003">应用C</Option>
            </Select>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="24h">最近24小时</Option>
              <Option value="7d">最近7天</Option>
              <Option value="30d">最近30天</Option>
            </Select>
          </Space>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={refresh}
            loading={metricsLoading}
          >
            刷新
          </Button>
        </div>

        {/* 告警区域 */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                type={alert.type}
                message={alert.message}
                description={alert.description}
                icon={alert.icon}
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
          </div>
        )}

        {/* 核心指标卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="响应时间"
                value={metrics?.responseTime || 0}
                precision={2}
                suffix="ms"
                valueStyle={{ 
                  color: (metrics?.responseTime || 0) > 500 ? '#f5222d' : '#52c41a' 
                }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="错误率"
                value={(metrics?.errorRate || 0) * 100}
                precision={2}
                suffix="%"
                valueStyle={{ 
                  color: (metrics?.errorRate || 0) > 0.05 ? '#f5222d' : '#52c41a' 
                }}
                prefix={<BugOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="可用性"
                value={metrics?.availability || 0}
                precision={2}
                suffix="%"
                valueStyle={{ 
                  color: (metrics?.availability || 0) < 99.9 ? '#f5222d' : '#52c41a' 
                }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="吞吐量"
                value={metrics?.throughput || 0}
                precision={0}
                suffix="QPS"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 性能指标仪表盘 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card title="Core Web Vitals" style={{ height: 400 }}>
              <GaugeChart
                data={performanceData}
                height={300}
                showMultiple={true}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="业务指标" style={{ height: 400 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="PV"
                    value={metrics?.pv || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="UV"
                    value={metrics?.uv || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="转化率"
                    value={(metrics?.conversionRate || 0) * 100}
                    precision={2}
                    suffix="%"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={12}>
                  <Progress
                    type="circle"
                    percent={Math.round((metrics?.conversionRate || 0) * 100)}
                    format={percent => `${percent}%`}
                    size={80}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 错误日志表格 */}
        <Card title="最近错误日志" style={{ marginBottom: 24 }}>
          <Table
            columns={errorColumns}
            dataSource={errorLogs}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
          />
        </Card>

        {/* 性能趋势图 */}
        <Card title="性能趋势">
          <TrendChart
            data={[
              { date: '2024-01-01', value: 1200, category: 'LCP' },
              { date: '2024-01-02', value: 1100, category: 'LCP' },
              { date: '2024-01-03', value: 1300, category: 'LCP' },
              { date: '2024-01-04', value: 1400, category: 'LCP' },
              { date: '2024-01-05', value: 1350, category: 'LCP' },
              { date: '2024-01-01', value: 80, category: 'FID' },
              { date: '2024-01-02', value: 75, category: 'FID' },
              { date: '2024-01-03', value: 85, category: 'FID' },
              { date: '2024-01-04', value: 90, category: 'FID' },
              { date: '2024-01-05', value: 88, category: 'FID' }
            ]}
            height={300}
            seriesField="category"
            showArea={true}
          />
        </Card>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
