import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Tag, List, Switch } from 'antd';
import {
  CheckOutlined,
  RocketOutlined,
  TeamOutlined,
  CrownOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import './pricing.less';

const { Title, Paragraph, Text } = Typography;

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      id: 'starter',
      name: '入门版',
      subtitle: '适合小团队试用',
      price: { monthly: 0, yearly: 0 },
      icon: <RocketOutlined />,
      color: '#52c41a',
      buttonText: '免费开始',
      buttonType: 'default' as const,
      limits: ['最多 5 个用户', '最多 10 个项目', '2GB 存储空间', '社区支持'],
    },
    {
      id: 'professional',
      name: '专业版',
      subtitle: '适合成长型团队',
      price: { monthly: 299, yearly: 2590 },
      originalPrice: { monthly: 299, yearly: 3588 },
      popular: true,
      icon: <TeamOutlined />,
      color: '#1890ff',
      buttonText: '选择专业版',
      buttonType: 'primary' as const,
      limits: ['最多 50 个用户', '无限项目', '100GB 存储空间', '邮件 + 在线客服'],
    },
    {
      id: 'enterprise',
      name: '企业版',
      subtitle: '适合大型企业',
      price: { monthly: 899, yearly: 7990 },
      originalPrice: { monthly: 899, yearly: 10788 },
      enterprise: true,
      icon: <CrownOutlined />,
      color: '#722ed1',
      buttonText: '联系销售',
      buttonType: 'default' as const,
      limits: ['无限用户', '无限项目', '1TB 存储空间', '7x24 专属客服'],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    if (planId === 'starter') {
      history.push('/register');
    } else if (planId === 'enterprise') {
      console.log('联系销售');
    } else {
      history.push(`/payment?plan=${planId}&cycle=${billingCycle}`);
    }
  };

  return (
    <div className="pricing-container">
      {/* 页面头部 */}
      <div className="pricing-header">
        <div className="section-content">
          <Title level={1}>选择适合您的方案</Title>
          <Paragraph className="header-description">
            无论您是初创企业还是大型机构，我们都有适合您的解决方案
          </Paragraph>
          
          <div className="billing-toggle">
            <Space size="middle" align="center">
              <Text>按月付费</Text>
              <Switch
                checked={billingCycle === 'yearly'}
                onChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <Text>按年付费</Text>
              <Tag color="volcano">节省 25%</Tag>
            </Space>
          </div>
        </div>
      </div>

      {/* 价格卡片 */}
      <div className="pricing-plans">
        <div className="section-content">
          <Row gutter={[24, 24]} justify="center">
            {plans.map((plan) => {
              const currentPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
              const originalPrice = plan.originalPrice 
                ? (billingCycle === 'monthly' ? plan.originalPrice.monthly : plan.originalPrice.yearly)
                : null;
              
              return (
                <Col xs={24} lg={8} key={plan.id}>
                  <Card
                    className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.enterprise ? 'enterprise' : ''}`}
                    style={{ borderColor: plan.popular || plan.enterprise ? plan.color : undefined }}
                  >
                    {plan.popular && (
                      <div className="popular-badge">
                        <Tag color={plan.color} icon={<StarOutlined />}>最受欢迎</Tag>
                      </div>
                    )}
                    
                    {plan.enterprise && (
                      <div className="enterprise-badge">
                        <Tag color={plan.color} icon={<CrownOutlined />}>企业首选</Tag>
                      </div>
                    )}

                    <div className="plan-header">
                      <div className="plan-icon" style={{ color: plan.color }}>
                        {plan.icon}
                      </div>
                      <Title level={3}>{plan.name}</Title>
                      <Text type="secondary">{plan.subtitle}</Text>
                    </div>

                    <div className="plan-price">
                      {currentPrice === 0 ? (
                        <div className="price-free">
                          <span className="price-amount">免费</span>
                        </div>
                      ) : (
                        <div className="price-paid">
                          {originalPrice && billingCycle === 'yearly' && (
                            <div className="original-price">¥{originalPrice.toLocaleString()}</div>
                          )}
                          <div className="current-price">
                            <span className="currency">¥</span>
                            <span className="amount">{currentPrice.toLocaleString()}</span>
                            <span className="period">/{billingCycle === 'monthly' ? '月' : '年'}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="plan-limits">
                      <List
                        size="small"
                        dataSource={plan.limits}
                        renderItem={(item) => (
                          <List.Item>
                            <CheckOutlined style={{ color: plan.color, marginRight: 8 }} />
                            {item}
                          </List.Item>
                        )}
                      />
                    </div>

                    <div className="plan-cta">
                      <Button
                        type={plan.buttonType}
                        size="large"
                        block
                        onClick={() => handlePlanSelect(plan.id)}
                        style={{
                          backgroundColor: plan.buttonType === 'primary' ? plan.color : undefined,
                          borderColor: plan.color,
                          color: plan.buttonType === 'default' ? plan.color : undefined,
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Pricing;