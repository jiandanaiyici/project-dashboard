import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'umi';
import { useUserStore } from '@/stores';
import './403.less';

const ForbiddenPage: React.FC = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleBackPrevious = () => {
    window.history.go(-1);
  };

  const handleLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="forbidden-page-container">
      <div className="forbidden-content">
        <Result
          status="403"
          title={
            <div className="forbidden-title">
              <span className="forbidden-code">403</span>
              <span className="forbidden-message">访问被拒绝</span>
            </div>
          }
          subTitle={
            <div className="forbidden-subtitle">
              <p>抱歉，您没有权限访问此页面</p>
              {user ? (
                <p>当前用户：<span className="user-info">{user.name} ({user.role})</span></p>
              ) : (
                <p>请登录后重试，或联系管理员获取访问权限</p>
              )}
            </div>
          }
          extra={
            <div className="forbidden-actions">
              <Button type="primary" size="large" onClick={handleBackHome}>
                返回首页
              </Button>
              <Button size="large" onClick={handleBackPrevious}>
                返回上页
              </Button>
              {!user && (
                <Button type="dashed" size="large" onClick={handleLogin}>
                  重新登录
                </Button>
              )}
            </div>
          }
        />
        
        <div className="forbidden-animation">
          <div className="lock-container">
            <div className="lock-body">
              <div className="lock-shackle"></div>
              <div className="lock-keyhole"></div>
            </div>
          </div>
          
          <div className="warning-elements">
            <div className="warning-element warning-1"></div>
            <div className="warning-element warning-2"></div>
            <div className="warning-element warning-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;