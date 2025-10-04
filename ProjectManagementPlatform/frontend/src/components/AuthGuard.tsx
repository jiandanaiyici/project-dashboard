import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useUserStore } from '@/stores';
import { history } from 'umi';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, login } = useUserStore();

  useEffect(() => {
    const checkAuth = () => {
      // 检查本地存储中的登录状态
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // 如果 zustand 状态未同步，手动设置
          if (!isAuthenticated) {
            login(user, token);
          }
          setLoading(false);
        } catch (error) {
          console.error('解析用户信息失败:', error);
          // 清理无效数据
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // 跳转到 landing 页
          history.push('/landing');
          setLoading(false);
        }
      } else {
        // 未登录，跳转到 landing 页
        history.push('/landing');
        setLoading(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, login]);

  if (loading) {
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
  }

  if (!isAuthenticated) {
    return null; // 认证守卫会自动跳转，这里返回 null
  }

  return <>{children}</>;
};

export default AuthGuard;