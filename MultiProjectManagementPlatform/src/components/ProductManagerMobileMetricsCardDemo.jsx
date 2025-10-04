import React from 'react';
import { Card, Row, Col, Space, Button, Divider, Tag } from 'antd';
import { MobileOutlined, TabletOutlined, DesktopOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ProductManagerMobileMetricsCard from './ProductManagerMobileMetricsCard';

/**
 * 产品经理移动端指标卡片演示组件
 */
const ProductManagerMobileMetricsCardDemo = () => {
  // 刷新卡片数据的处理函数
  const handleRefresh = () => {
    // 这里可以添加刷新逻辑，实际项目中会通过props传递给子组件
    console.log('刷新指标数据');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#333', fontSize: '28px', fontWeight: '600' }}>
          产品经理指标卡片演示
        </h1>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
          专为产品经理和管理层设计的应用关键指标移动端卡片
        </p>
      </div>

      {/* 说明卡片 */}
      <Card 
        title="组件说明" 
        style={{ marginBottom: '24px' }} 
        extra={<InfoCircleOutlined />}
      >
        <div>
          <p style={{ marginBottom: '8px', color: '#666' }}>
            这个组件专为产品经理和管理层设计，提供了移动端友好的关键业务指标概览视图，包含：
          </p>
          <ul style={{ margin: '0 0 12px 20px', color: '#666' }}>
            <li style={{ marginBottom: '4px' }}>核心业务指标：总营收、日活跃用户</li>
            <li style={{ marginBottom: '4px' }}>运营指标：转化率、平均订单价值</li>
            <li style={{ marginBottom: '4px' }}>趋势分析：环比变化指标</li>
            <li style={{ marginBottom: '4px' }}>性能指标：用户增长、留存率、应用加载时间、错误率</li>
          </ul>
          <p style={{ color: '#999', fontSize: '13px' }}>
            组件支持响应式布局，在移动设备上自动优化显示效果，数据每30秒自动刷新。
          </p>
        </div>
      </Card>

      {/* 演示控制区域 */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MobileOutlined style={{ color: '#1890ff' }} />
              <span style={{ fontSize: '14px', color: '#333' }}>移动端优化</span>
            </div>
            <Divider type="vertical" />
            <Tag color="blue" icon={<ReloadOutlined />}>自动刷新</Tag>
          </div>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
          >
            刷新数据
          </Button>
        </div>
      </Card>

      {/* 桌面端视图展示 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DesktopOutlined /> 桌面端视图
        </h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <ProductManagerMobileMetricsCard title="电商应用指标" />
          </Col>
          <Col xs={24} md={8}>
            <ProductManagerMobileMetricsCard title="金融产品指标" />
          </Col>
          <Col xs={24} md={8}>
            <ProductManagerMobileMetricsCard title="社交应用指标" />
          </Col>
        </Row>
      </div>

      {/* 平板端视图展示 */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TabletOutlined /> 平板端视图
        </h2>
        <div style={{ maxWidth: '768px', margin: '0 auto', border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px', backgroundColor: '#fff' }}>
          <ProductManagerMobileMetricsCard title="应用运营概览" />
        </div>
      </div>

      {/* 移动端视图展示 */}
      <div>
        <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MobileOutlined /> 移动端视图
        </h2>
        <div style={{ maxWidth: '414px', margin: '0 auto', border: '1px solid #e8e8e8', borderRadius: '16px', padding: '12px', backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}>
          <ProductManagerMobileMetricsCard title="业务指标" />
        </div>
      </div>
    </div>
  );
};

export default ProductManagerMobileMetricsCardDemo;