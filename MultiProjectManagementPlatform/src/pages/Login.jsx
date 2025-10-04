import React, { useState, useContext } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AppContext } from '../context/AppContext';
import './Login.less';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useContext(AppContext);
  const [form] = Form.useForm();

  // 处理表单提交
  const onFinish = async (values) => {
    try {
      setLoading(true);
      await handleLogin(values);
      message.success('登录成功');
      window.location.href = '/';
    } catch (error) {
      message.error(error.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2 className="login-title">多项目管理平台</h2>
        <p className="login-subtitle">请登录您的账户</p>
        
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            email: 'admin@example.com',
            password: 'admin123',
          }}
        >
          <Form.Item
            name="email"
            label="电子邮箱"
            rules={[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-prefix" />}
              placeholder="请输入电子邮箱"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-prefix" />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item className="login-actions">
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
          
          <div className="login-help">
            <p>测试账号:</p>
            <p>管理员: admin@example.com / admin123</p>
            <p>经理: lisi@example.com / lisi</p>
            <p>开发者: wangwu@example.com / wangwu</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;