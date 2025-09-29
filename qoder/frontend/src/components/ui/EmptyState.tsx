import React from 'react';
import { Empty, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
    type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  };
  style?: React.CSSProperties;
}

/**
 * 空状态组件
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无数据',
  description,
  image,
  action,
  style,
}) => {
  const defaultImage = <InboxOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />;

  return (
    <div 
      className="empty-wrapper"
      style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: 'rgba(0, 0, 0, 0.45)',
        ...style,
      }}
    >
      <div className="empty-icon" style={{ marginBottom: 16 }}>
        {image || defaultImage}
      </div>
      <div className="empty-title" style={{ fontSize: 16, marginBottom: 8 }}>
        {title}
      </div>
      {description && (
        <div className="empty-description" style={{ fontSize: 14, marginBottom: 16 }}>
          {description}
        </div>
      )}
      {action && (
        <Button 
          type={action.type || 'primary'} 
          onClick={action.onClick}
        >
          {action.text}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;