import React from 'react';
import { Pie } from '@ant-design/charts';
import { ChartConfig } from '@/types';

interface RingChartProps extends ChartConfig {
  data: Array<{ name: string; value: number; color?: string }>;
}

const RingChart: React.FC<RingChartProps> = ({
  data,
  title,
  height = 300,
  showLegend = true,
  colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
}) => {
  const config = {
    data,
    angleField: 'value',
    colorField: 'name',
    radius: 0.8,
    innerRadius: 0.6,
    color: colors,
    label: {
      type: 'inner' as const,
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
        fill: '#fff',
      },
    },
    legend: showLegend ? {
      position: 'bottom' as const,
      itemName: {
        formatter: (text: string) => text,
      },
    } : false,
    interactions: [
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: {
        content: '总计',
        style: {
          fontSize: 16,
          color: '#262626',
        },
      },
      content: {
        content: data.reduce((sum, item) => sum + item.value, 0).toString(),
        style: {
          fontSize: 24,
          color: '#1890ff',
          fontWeight: 'bold',
        },
      },
    },
  };

  return (
    <div className="ring-chart">
      {title && <h3 className="chart-title" style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{title}</h3>}
      <Pie {...config} height={height} />
    </div>
  );
};

export default RingChart;
