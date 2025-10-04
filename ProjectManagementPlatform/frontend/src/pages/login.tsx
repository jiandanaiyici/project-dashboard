import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { useUserStore } from '@/stores';
import './login.less';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useUserStore();

  const onFinish = async (values: any) => {
    try {
      // TODO: 实际的登录API调用
      console.log('登录信息:', values);
      
      // 模拟登录成功
      const token = 'mock-token';
      const user = {
        id: '1',
        username: values.username,
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin'
      };
      
      // 保存到本地存储
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // 更新 Zustand 状态
      login(user, token);
      
      message.success('登录成功！');
      
      // 跳转到概览大盘
      history.push('/app/dashboard');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <h2>项目管理平台</h2>
            <p>欢迎登录</p>
          </div>
          
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '用户名至少3个字符!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码至少6个字符!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-button"
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <div className="login-footer">
            <p>还没有账号？<a href="/register">立即注册</a></p>
            <p><a href="#forgot">忘记密码？</a></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;