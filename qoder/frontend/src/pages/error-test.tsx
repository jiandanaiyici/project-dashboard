import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { useNavigate } from 'umi';

const { Title, Paragraph } = Typography;

const ErrorTestPage: React.FC = () => {
  const navigate = useNavigate();

  const handle404 = () => {
    navigate('/404');
  };

  const handle403 = () => {
    navigate('/403');
  };

  const handleNonExistent = () => {
    navigate('/non-existent-page');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>错误页面测试</Title>
        <Paragraph>
          这个页面用于测试不同的错误页面效果。
        </Paragraph>
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card type="inner" title="404 页面测试">
            <Paragraph>
              测试当页面不存在时的 404 错误页面显示效果。
            </Paragraph>
            <Space>
              <Button type="primary" onClick={handle404}>
                直接访问 404 页面
              </Button>
              <Button onClick={handleNonExistent}>
                访问不存在的页面
              </Button>
            </Space>
          </Card>

          <Card type="inner" title="403 页面测试">
            <Paragraph>
              测试当用户没有权限访问页面时的 403 错误页面显示效果。
            </Paragraph>
            <Button type="primary" danger onClick={handle403}>
              访问 403 页面
            </Button>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default ErrorTestPage;