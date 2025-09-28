import React from 'react';
import { Line } from '@ant-design/charts';
import { TrendData, ChartConfig } from '@/types';

interface TrendChartProps extends ChartConfig {
  data: TrendData[];
  xField?: string;
  yField?: string;
  seriesField?: string;
  smooth?: boolean;
  showArea?: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title,
  height = 300,
  xField = 'date',
  yField = 'value',
  seriesField,
  smooth = true,
  showArea = false,
  showLegend = true,
  colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2']
}) => {
  const config = {
    data,
    xField,
    yField,
    seriesField,
    smooth,
    area: showArea ? {} : undefined,
    point: {
      size: 3,
      shape: 'circle',
    },
    color: colors,
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: seriesField ? datum[seriesField] : yField,
          value: datum[yField],
        };
      },
    },
    legend: showLegend && seriesField ? {
      position: 'top' as const,
    } : false,
    xAxis: {
      type: 'time' as const,
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (text: string) => {
          const value = parseFloat(text);
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
          }
          return text;
        },
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div className="trend-chart">
      {title && <h3 className="chart-title" style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{title}</h3>}
      <Line {...config} height={height} />
    </div>
  );
};

export default TrendChart;
