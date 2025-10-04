import React, { useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Typography, Space, message } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WechatOutlined,
  QqOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟发送联系表单
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('您的消息已发送，我们会在24小时内回复您！');
      form.resetFields();
    } catch (error) {
      message.error('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 页面头部 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={1}>联系我们</Title>
          <Paragraph style={{ fontSize: '18px', color: '#666' }}>
            我们的团队随时为您提供帮助，期待与您的合作
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* 联系信息 */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <PhoneOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                  <Title level={4}>电话咨询</Title>
                  <Text>工作日 9:00-18:00</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ fontSize: '18px' }}>400-800-1234</Text>
                  <br />
                  <Text type="secondary">免费客服热线</Text>
                </div>
              </Card>

              <Card>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <MailOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
                  <Title level={4}>邮件咨询</Title>
                  <Text>24小时内回复</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ fontSize: '16px' }}>support@projectmanager.com</Text>
                  <br />
                  <Text type="secondary">技术支持邮箱</Text>
                </div>
              </Card>

              <Card>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <EnvironmentOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '16px' }} />
                  <Title level={4}>公司地址</Title>
                  <Text>欢迎预约到访</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>北京市朝阳区建国门外大街1号</Text>
                  <br />
                  <Text type="secondary">国贸大厦A座20层</Text>
                </div>
              </Card>

              <Card>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <ClockCircleOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '16px' }} />
                  <Title level={4}>工作时间</Title>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Text strong>周一至周五：9:00 - 18:00</Text>
                  <br />
                  <Text type="secondary">周末及节假日：值班客服</Text>
                </div>
              </Card>
            </Space>
          </Col>

          {/* 联系表单 */}
          <Col xs={24} lg={16}>
            <Card title="发送消息" style={{ height: 'fit-content' }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入您的姓名' }]}
                    >
                      <Input placeholder="请输入您的姓名" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="company"
                      label="公司名称"
                      rules={[{ required: true, message: '请输入公司名称' }]}
                    >
                      <Input placeholder="请输入公司名称" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="邮箱地址"
                      rules={[
                        { required: true, message: '请输入邮箱地址' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                      ]}
                    >
                      <Input placeholder="请输入邮箱地址" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="联系电话"
                      rules={[{ required: true, message: '请输入联系电话' }]}
                    >
                      <Input placeholder="请输入联系电话" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label="咨询主题"
                  rules={[{ required: true, message: '请输入咨询主题' }]}
                >
                  <Input placeholder="请输入咨询主题" size="large" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="详细描述"
                  rules={[{ required: true, message: '请输入详细描述' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="请详细描述您的需求或问题，我们会尽快为您解答"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    style={{ width: '100%', height: '48px' }}
                  >
                    发送消息
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* 社交媒体 */}
            <Card title="关注我们" style={{ marginTop: '24px' }}>
              <Row gutter={[16, 16]} justify="center">
                <Col>
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#07c160' }}
                    icon={<WechatOutlined />}
                    size="large"
                  >
                    微信公众号
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<QqOutlined />}
                    size="large"
                  >
                    QQ 交流群
                  </Button>
                </Col>
              </Row>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text type="secondary">
                  关注我们的社交媒体，获取最新产品动态和技术分享
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Contact;