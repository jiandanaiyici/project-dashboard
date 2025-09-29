import React from 'react';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './login.less';

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  name: string;
  agreement: boolean;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterForm) => {
    try {
      console.log('注册信息:', values);
      // 这里调用注册API
      message.success('注册成功！请登录');
      window.location.href = '/login';
    } catch (error) {
      message.error('注册失败，请重试');
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Card className="login-card">
          <div className="login-header">
            <h1>用户注册</h1>
            <p>创建新账户</p>
          </div>
          
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: '请输入真实姓名!' },
                { min: 2, message: '姓名至少2个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="真实姓名"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '用户名至少3个字符' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号!' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号!' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="手机号"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意用户协议')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意 <a href="#" onClick={(e) => e.preventDefault()}>《用户协议》</a> 和{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>《隐私政策》</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-button"
                block
              >
                立即注册
              </Button>
            </Form.Item>

            <div className="login-footer">
              已有账户？<a onClick={handleLoginClick}>立即登录</a>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;