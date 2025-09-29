import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * 通用加载组件
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  tip = '加载中...',
  spinning = true,
  children,
  style,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 16 }} spin />;

  if (children) {
    // 包装子组件的加载状态
    return (
      <Spin indicator={antIcon} spinning={spinning} tip={tip} style={style}>
        {children}
      </Spin>
    );
  }

  // 独立的加载组件
  return (
    <div 
      className="loading-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
        ...style,
      }}
    >
      <Spin indicator={antIcon} tip={tip} />
    </div>
  );
};

export default Loading;