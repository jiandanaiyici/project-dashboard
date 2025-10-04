import React, { useEffect } from 'react';
import { Spin } from 'antd';
import { history } from 'umi';

const AuthRedirect: React.FC = () => {
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // 已登录，跳转到概览大盘
          history.replace('/app/dashboard');
        } catch (error) {
          console.error('解析用户信息失败:', error);
          // 清理无效数据
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // 跳转到 landing 页
          history.replace('/landing');
        }
      } else {
        // 未登录，跳转到 landing 页
        history.replace('/landing');
      }
    };

    checkAuthAndRedirect();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Spin size="large" />
    </div>
  );
};

export default AuthRedirect;