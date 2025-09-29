import React from 'react';
import { Card, Statistic, Progress } from 'antd';
import { StatisticProps } from 'antd/es/statistic';

interface StatCardProps extends Omit<StatisticProps, 'prefix'> {
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  className?: string;
  style?: React.CSSProperties;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  trend,
  progress,
  className,
  style,
  ...statisticProps
}) => {
  return (
    <Card className={className} style={style}>
      <Statistic
        {...statisticProps}
        prefix={icon}
      />
      
      {trend && (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px',
          color: trend.isPositive ? '#52c41a' : '#ff4d4f'
        }}>
          <span>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div style={{ marginTop: '8px' }}>
          <Progress 
            percent={progress} 
            size="small"
            showInfo={false}
            strokeColor={progress > 70 ? '#52c41a' : progress > 40 ? '#1890ff' : '#faad14'}
          />
        </div>
      )}
    </Card>
  );
};

export default StatCard;