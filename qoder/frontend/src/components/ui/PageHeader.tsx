import React from 'react';
import { Row, Col, Space, Button, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    title: string;
    href?: string;
  }>;
  extra?: React.ReactNode;
  onBack?: () => void;
  backText?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  extra,
  onBack,
  backText = '返回',
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb.Item key={index} href={breadcrumb.href}>
              {breadcrumb.title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}
      
      <Row align="middle" justify="space-between">
        <Col>
          <Space direction="vertical" size="small">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {onBack && (
                <Button onClick={onBack}>
                  {backText}
                </Button>
              )}
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                {title}
              </h1>
            </div>
            {subtitle && (
              <div style={{ color: '#666', fontSize: '14px' }}>
                {subtitle}
              </div>
            )}
          </Space>
        </Col>
        {extra && (
          <Col>
            {extra}
          </Col>
        )}
      </Row>
    </div>
  );
};

export default PageHeader;