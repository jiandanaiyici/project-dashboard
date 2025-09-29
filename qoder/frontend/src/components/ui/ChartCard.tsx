import React from 'react';
import { Card, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';

interface ChartCardProps {
  title?: string;
  option: any;
  height?: string | number;
  loading?: boolean;
  extra?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  option,
  height = '300px',
  loading = false,
  extra,
  className,
  style,
}) => {
  return (
    <Card
      title={title}
      extra={extra}
      className={className}
      style={style}
    >
      <Spin spinning={loading}>
        <ReactECharts
          option={option}
          style={{ height }}
          notMerge
          lazyUpdate
        />
      </Spin>
    </Card>
  );
};

export default ChartCard;