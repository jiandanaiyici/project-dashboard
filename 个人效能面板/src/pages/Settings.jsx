import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, message, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 从本地存储加载设置
    const storedSettings = localStorage.getItem('developerDashboardSettings');
    if (storedSettings) {
      form.setFieldsValue(JSON.parse(storedSettings));
    }
  }, [form]);

  const onFinish = (values) => {
    setLoading(true);
    // 保存设置到本地存储
    localStorage.setItem('developerDashboardSettings', JSON.stringify(values));
    setTimeout(() => {
      setLoading(false);
      message.success('设置已保存');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/">
            <Button icon={<ArrowLeftOutlined />} type="link">返回面板</Button>
          </Link>
        </div>
        
        <Title level={2} className="mb-6">面板设置</Title>
        
        <Card className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              notifications: true,
              autoRefresh: false,
              theme: 'light'
            }}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="输入您的用户名" />
            </Form.Item>
            
            <Form.Item
              label="邮箱"
              name="email"
              rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
            >
              <Input placeholder="输入您的邮箱地址" />
            </Form.Item>
            
            <Form.Item
              label="启用通知"
              name="notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item
              label="自动刷新数据"
              name="autoRefresh"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存设置
                </Button>
                <Button htmlType="button" onClick={() => form.resetFields()}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
