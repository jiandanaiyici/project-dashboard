import React, { ReactNode, useState, useEffect } from 'react';
import { Card, Row, Col, Space, Button, Drawer, FloatButton } from 'antd';
import { MenuOutlined, MoreOutlined, ArrowUpOutlined } from '@ant-design/icons';

// 移动端检测Hook
export const useMobileDetection = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = screenSize;
  
  const isMobile = width <= 767;
  const isTablet = width >= 768 && width <= 1023;
  const isDesktop = width >= 1024;
  const isSmallMobile = width <= 575;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isTouchDevice,
    width,
    height,
    // 组合判断
    isMobileOrTablet: isMobile || isTablet,
    isSmallScreen: isMobile,
  };
};

// 移动端响应式容器
interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  fullHeight?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className = '',
  style = {},
  fullHeight = false,
}) => {
  const { isMobile, isSmallMobile } = useMobileDetection();
  
  const containerStyle: React.CSSProperties = {
    padding: isSmallMobile ? '8px' : isMobile ? '12px' : '16px',
    minHeight: fullHeight ? '100vh' : 'auto',
    background: '#f5f5f5',
    ...style,
  };
  
  return (
    <div className={`mobile-container ${className}`} style={containerStyle}>
      {children}
    </div>
  );
};

// 移动端响应式网格
interface MobileGridProps {
  children: ReactNode;
  gutter?: [number, number];
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  gutter = [12, 12],
  cols = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4 },
}) => {
  const { isMobile } = useMobileDetection();
  
  const adjustedGutter: [number, number] = isMobile 
    ? [gutter[0] / 2, gutter[1] / 2] 
    : gutter;
  
  return (
    <Row gutter={adjustedGutter}>
      {React.Children.map(children, (child, index) => (
        <Col key={index} {...cols}>
          {child}
        </Col>
      ))}
    </Row>
  );
};

// 移动端优化的统计卡片
interface MobileStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  change?: string;
  trend?: 'up' | 'down';
  description?: string;
  action?: ReactNode;
}

export const MobileStatCard: React.FC<MobileStatCardProps> = ({
  title,
  value,
  icon,
  color = '#1890ff',
  change,
  trend,
  description,
  action,
}) => {
  const { isSmallMobile } = useMobileDetection();
  
  return (
    <Card
      style={{
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        background: '#fff',
        marginBottom: isSmallMobile ? '8px' : '12px',
      }}
      bodyStyle={{
        padding: isSmallMobile ? '12px' : '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {icon && (
              <div style={{ marginRight: '8px', color }}>
                {icon}
              </div>
            )}
            <span style={{ 
              fontSize: isSmallMobile ? '12px' : '14px', 
              color: '#666',
              fontWeight: 500,
            }}>
              {title}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '4px' }}>
            <span style={{ 
              fontSize: isSmallMobile ? '20px' : '24px', 
              fontWeight: 600, 
              color: '#262626',
              marginRight: '8px',
            }}>
              {value}
            </span>
            
            {change && (
              <span style={{ 
                fontSize: isSmallMobile ? '11px' : '12px',
                color: trend === 'up' ? '#52c41a' : '#f5222d',
                fontWeight: 500,
              }}>
                {change}
              </span>
            )}
          </div>
          
          {description && (
            <span style={{ 
              fontSize: isSmallMobile ? '10px' : '12px', 
              color: '#999' 
            }}>
              {description}
            </span>
          )}
        </div>
        
        {action && (
          <div style={{ marginLeft: '12px' }}>
            {action}
          </div>
        )}
      </div>
    </Card>
  );
};

// 移动端操作按钮组
interface MobileActionBarProps {
  actions: Array<{
    key: string;
    label: string;
    icon?: ReactNode;
    type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
    onClick?: () => void;
    disabled?: boolean;
  }>;
  layout?: 'horizontal' | 'vertical';
  fixed?: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  actions,
  layout = 'horizontal',
  fixed = false,
}) => {
  const { isMobile, isSmallMobile } = useMobileDetection();
  
  if (!isMobile) {
    return (
      <Space size="middle">
        {actions.map((action) => (
          <Button
            key={action.key}
            type={action.type}
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
      </Space>
    );
  }
  
  const containerStyle: React.CSSProperties = fixed ? {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    padding: '12px 16px',
    borderTop: '1px solid #f0f0f0',
    zIndex: 1000,
  } : {
    padding: '12px 0',
  };
  
  if (layout === 'vertical') {
    return (
      <div style={containerStyle}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {actions.map((action) => (
            <Button
              key={action.key}
              type={action.type}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              size={isSmallMobile ? 'middle' : 'large'}
              block
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </div>
    );
  }
  
  return (
    <div style={containerStyle}>
      <Row gutter={8}>
        {actions.map((action) => (
          <Col key={action.key} flex={1}>
            <Button
              type={action.type}
              icon={action.icon}
              onClick={action.onClick}
              disabled={action.disabled}
              size={isSmallMobile ? 'middle' : 'large'}
              block
            >
              {isSmallMobile ? action.icon || action.label.charAt(0) : action.label}
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// 移动端浮动操作按钮
interface MobileFloatButtonProps {
  icon?: ReactNode;
  tooltip?: string;
  onClick?: () => void;
  type?: 'primary' | 'default';
  shape?: 'circle' | 'square';
  position?: {
    bottom?: number;
    right?: number;
  };
}

export const MobileFloatButton: React.FC<MobileFloatButtonProps> = ({
  icon = <ArrowUpOutlined />,
  tooltip,
  onClick,
  type = 'primary',
  shape = 'circle',
  position = { bottom: 24, right: 24 },
}) => {
  const { isMobile } = useMobileDetection();
  
  if (!isMobile) return null;
  
  return (
    <FloatButton
      icon={icon}
      tooltip={tooltip}
      onClick={onClick}
      type={type}
      shape={shape}
      style={position}
    />
  );
};

// 移动端侧边栏抽屉
interface MobileDrawerProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: string | number;
  height?: string | number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  visible,
  onClose,
  title,
  children,
  placement = 'right',
  width = '80vw',
  height = '60vh',
}) => {
  const { isMobile } = useMobileDetection();
  
  const drawerProps = {
    open: visible,
    onClose,
    title,
    placement,
    width: placement === 'left' || placement === 'right' ? width : '100vw',
    height: placement === 'top' || placement === 'bottom' ? height : '100vh',
    styles: {
      body: {
        padding: isMobile ? '12px' : '16px',
      },
    },
  };
  
  return (
    <Drawer {...drawerProps}>
      {children}
    </Drawer>
  );
};

export default {
  useMobileDetection,
  MobileContainer,
  MobileGrid,
  MobileStatCard,
  MobileActionBar,
  MobileFloatButton,
  MobileDrawer,
};