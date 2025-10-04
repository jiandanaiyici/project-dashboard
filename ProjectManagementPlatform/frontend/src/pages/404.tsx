import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'umi';
import './404.less';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleBackPrevious = () => {
    window.history.go(-1);
  };

  return (
    <div className="error-page-container">
      <div className="error-content">
        <Result
          status="404"
          title={
            <div className="error-title">
              <span className="error-code">404</span>
              <span className="error-message">页面不存在</span>
            </div>
          }
          subTitle={
            <div className="error-subtitle">
              <p>抱歉，您访问的页面不存在或已被移除</p>
              <p>请检查网址是否正确，或返回首页重新导航</p>
            </div>
          }
          extra={
            <div className="error-actions">
              <Button type="primary" size="large" onClick={handleBackHome}>
                返回首页
              </Button>
              <Button size="large" onClick={handleBackPrevious}>
                返回上页
              </Button>
            </div>
          }
        />
        
        <div className="error-animation">
          <div className="floating-elements">
            <div className="element element-1"></div>
            <div className="element element-2"></div>
            <div className="element element-3"></div>
            <div className="element element-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;