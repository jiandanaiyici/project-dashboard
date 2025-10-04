import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Badge, Avatar, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, TrendingUpOutlined, TrendingDownOutlined, AlertOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined, ShieldOutlined, BarChartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './ProductManagerMobileMetricsCard.less';

/**
 * 产品经理和管理层关注的应用指标移动端卡片
 * 提供关键业务指标的移动端友好视图
 */
const ProductManagerMobileMetricsCard = ({ title = '业务指标概览', refreshInterval = 30000 }) => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  // 模拟获取指标数据
  const fetchMetricsData = async () => {
    setLoading(true);
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 生成模拟数据
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setLastUpdated(currentTime);
      
      // 生成波动的模拟数据
      const generateRandomData = (base, range = 0.2) => {
        const variation = base * range;
        return Math.round((base - variation + Math.random() * variation * 2) * 10) / 10;
      };

      const data = {
        // 核心业务指标
        totalRevenue: generateRandomData(158000),
        dailyActiveUsers: generateRandomData(12500),
        conversionRate: generateRandomData(4.8),
        avgOrderValue: generateRandomData(89.5),
        
        // 运营指标
        newUserGrowth: generateRandomData(18.5),
        retentionRate: generateRandomData(76.2),
        
        // 性能指标
        appLoadTime: generateRandomData(1.2),
        errorRate: generateRandomData(0.3),
        
        // 趋势数据（环比变化）
        revenueChange: generateRandomData(12.3, 0.5),
        userChange: generateRandomData(8.7, 0.5),
        conversionChange: generateRandomData(-2.1, 1),
        
        // 指标状态
        status: {
          revenue: 'up', // up, down, stable
          users: 'up',
          conversion: 'down',
          performance: 'good'
        }
      };
      
      setMetricsData(data);
    } catch (error) {
      console.error('Failed to fetch metrics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchMetricsData();
    
    // 设置定时刷新
    const interval = setInterval(fetchMetricsData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // 获取指标状态的配置
  const getMetricStatusConfig = (status, value) => {
    const configs = {
      up: {
        color: '#52c41a',
        icon: <ArrowUpOutlined />,
        text: '上升'
      },
      down: {
        color: '#ff4d4f',
        icon: <ArrowDownOutlined />,
        text: '下降'
      },
      stable: {
        color: '#faad14',
        icon: <ArrowUpOutlined />,
        text: '稳定'
      },
      good: {
        color: '#52c41a',
        icon: <CheckCircleOutlined />,
        text: '良好'
      },
      warning: {
        color: '#faad14',
        icon: <AlertOutlined />,
        text: '警告'
      },
      critical: {
        color: '#ff4d4f',
        icon: <AlertOutlined />,
        text: '严重'
      }
    };
    
    return configs[status] || configs.stable;
  };

  // 格式化大数字
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
  };

  // 格式化货币
  const formatCurrency = (num) => {
    return `¥${num.toLocaleString('zh-CN')}`;
  };

  // 渲染指标卡片
  const renderMetricCard = (title, value, icon, status, suffix = '', formatter = null, description = '') => {
    const statusConfig = getMetricStatusConfig(status, value);
    const formattedValue = formatter ? formatter(value) : value;
    
    return (
      <Card className={`metric-card ${status}`} loading={loading}>
        <div className="metric-header">
          <div className="metric-title">{title}</div>
          <Badge color={statusConfig.color} text={statusConfig.text} className="metric-status" />
        </div>
        
        <div className="metric-content">
          <div className="metric-icon" style={{ color: statusConfig.color }}>
            {icon}
          </div>
          <div className="metric-value-container">
            <Statistic
              value={formattedValue}
              suffix={suffix}
              valueStyle={{ color: statusConfig.color, fontSize: '18px', fontWeight: 'bold' }}
              className="metric-stat"
            />
            {description && <div className="metric-description">{description}</div>}
          </div>
        </div>
        
        {status && (
          <div className="metric-trend">
            <span className="trend-icon" style={{ color: statusConfig.color }}>{statusConfig.icon}</span>
          </div>
        )}
      </Card>
    );
  };

  // 渲染进度条指标
  const renderProgressMetric = (title, value, color, max = 100) => {
    return (
      <div className="progress-metric">
        <div className="progress-header">
          <span className="progress-title">{title}</span>
          <span className="progress-value">{value}%</span>
        </div>
        <Progress
          percent={Math.min(max, value)}
          strokeColor={color}
          showInfo={false}
          size="small"
          className="metric-progress"
        />
      </div>
    );
  };

  if (loading && !metricsData) {
    return (
      <Card className="product-manager-mobile-metrics-card loading">
        <div className="metrics-loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">加载指标数据中...</div>
          </div>
        </div>
      </Card>
    );
  }

  if (!metricsData) {
    return (
      <Card className="product-manager-mobile-metrics-card error">
        <div className="metrics-error">
          <AlertOutlined className="error-icon" />
          <div className="error-text">无法加载指标数据</div>
          <button 
            className="retry-button" 
            onClick={fetchMetricsData}
          >
            重试
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="product-manager-mobile-metrics-card">
      <div className="metrics-header">
        <div className="metrics-title">
          <BarChartOutlined className="title-icon" />
          {title}
        </div>
        <div className="metrics-update-time">
          <ClockCircleOutlined className="time-icon" />
          最后更新: {lastUpdated}
        </div>
      </div>

      {/* 核心业务指标 */}
      <div className="metrics-section">
        <h3 className="section-title">核心业务指标</h3>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            {renderMetricCard(
              '总营收',
              metricsData.totalRevenue,
              <DollarOutlined />,
              metricsData.status.revenue,
              '',
              formatCurrency,
              '今日累计'
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderMetricCard(
              '日活跃用户',
              metricsData.dailyActiveUsers,
              <UserOutlined />,
              metricsData.status.users,
              '',
              formatNumber,
              '24小时内'
            )}
          </Col>
        </Row>
      </div>

      {/* 关键运营指标 */}
      <div className="metrics-section">
        <h3 className="section-title">运营指标</h3>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            {renderMetricCard(
              '转化率',
              metricsData.conversionRate,
              <ShoppingCartOutlined />,
              metricsData.status.conversion,
              '%'
            )}
          </Col>
          <Col xs={24} sm={12}>
            {renderMetricCard(
              '平均订单价值',
              metricsData.avgOrderValue,
              <DollarOutlined />,
              'stable',
              '',
              formatCurrency
            )}
          </Col>
        </Row>
      </div>

      {/* 趋势分析 */}
      <div className="metrics-section">
        <h3 className="section-title">趋势分析</h3>
        <div className="trend-metrics">
          <div className="trend-item">
            <div className="trend-label">营收环比</div>
            <div className={`trend-value ${metricsData.revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {metricsData.revenueChange >= 0 ? '+' : ''}{metricsData.revenueChange}%
              {metricsData.revenueChange >= 0 ? 
                <TrendingUpOutlined className="trend-icon-small" /> : 
                <TrendingDownOutlined className="trend-icon-small" />
              }
            </div>
          </div>
          <div className="trend-item">
            <div className="trend-label">用户环比</div>
            <div className={`trend-value ${metricsData.userChange >= 0 ? 'positive' : 'negative'}`}>
              {metricsData.userChange >= 0 ? '+' : ''}{metricsData.userChange}%
              {metricsData.userChange >= 0 ? 
                <TrendingUpOutlined className="trend-icon-small" /> : 
                <TrendingDownOutlined className="trend-icon-small" />
              }
            </div>
          </div>
          <div className="trend-item">
            <div className="trend-label">转化率环比</div>
            <div className={`trend-value ${metricsData.conversionChange >= 0 ? 'positive' : 'negative'}`}>
              {metricsData.conversionChange >= 0 ? '+' : ''}{metricsData.conversionChange}%
              {metricsData.conversionChange >= 0 ? 
                <TrendingUpOutlined className="trend-icon-small" /> : 
                <TrendingDownOutlined className="trend-icon-small" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* 性能指标 */}
      <div className="metrics-section">
        <h3 className="section-title">性能指标</h3>
        <div className="performance-metrics">
          {renderProgressMetric('新用户增长率', metricsData.newUserGrowth, '#1890ff')}
          {renderProgressMetric('用户留存率', metricsData.retentionRate, '#52c41a')}
          {renderProgressMetric('应用加载时间', metricsData.appLoadTime * 100, '#faad14', 300)}
          {renderProgressMetric('错误率', metricsData.errorRate * 100, metricsData.errorRate > 0.5 ? '#ff4d4f' : '#52c41a', 2)}
        </div>
      </div>

      {/* 整体状态 */}
      <div className="metrics-status">
        <Tag color={metricsData.status.performance === 'good' ? '#52c41a' : '#faad14'} 
             icon={<ShieldOutlined />}>
          系统状态: {metricsData.status.performance === 'good' ? '良好' : '需要关注'}
        </Tag>
      </div>
    </Card>
  );
};

export default ProductManagerMobileMetricsCard;