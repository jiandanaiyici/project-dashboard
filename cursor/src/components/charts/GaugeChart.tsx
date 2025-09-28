import React from 'react';
import { Gauge } from '@ant-design/charts';
import { ChartConfig } from '@/types';

interface GaugeData {
  name: string;
  value: number;
  max: number;
  unit?: string;
}

interface GaugeChartProps extends ChartConfig {
  data: GaugeData[];
  showMultiple?: boolean;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  data,
  title,
  height = 300,
  showMultiple = false,
  colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d']
}) => {
  if (showMultiple && data.length > 1) {
    return (
      <div className="gauge-chart-multiple">
        {title && <h3 className="chart-title" style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{title}</h3>}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.ceil(data.length / 2)}, 1fr)`, gap: 16 }}>
          {data.map((item, index) => (
            <div key={item.name} style={{ textAlign: 'center' }}>
              <h4 style={{ marginBottom: 8, fontSize: 14 }}>{item.name}</h4>
              <Gauge
                {...{
                  percent: item.value / item.max,
                  range: {
                    color: colors[index % colors.length],
                  },
                  indicator: {
                    pointer: {
                      style: {
                        stroke: colors[index % colors.length],
                      },
                    },
                    pin: {
                      style: {
                        stroke: colors[index % colors.length],
                      },
                    },
                  },
                  statistic: {
                    content: {
                      style: {
                        fontSize: 16,
                        color: '#262626',
                      },
                      formatter: () => `${item.value.toFixed(1)}${item.unit || ''}`,
                    },
                  },
                }}
                height={height / 2}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const singleData = data[0];
  const config = {
    percent: singleData.value / singleData.max,
    range: {
      color: colors[0],
    },
    indicator: {
      pointer: {
        style: {
          stroke: colors[0],
        },
      },
      pin: {
        style: {
          stroke: colors[0],
        },
      },
    },
    statistic: {
      title: {
        content: singleData.name,
        style: {
          fontSize: 16,
          color: '#262626',
        },
      },
      content: {
        style: {
          fontSize: 24,
          color: colors[0],
          fontWeight: 'bold',
        },
        formatter: () => `${singleData.value.toFixed(1)}${singleData.unit || ''}`,
      },
    },
  };

  return (
    <div className="gauge-chart">
      {title && <h3 className="chart-title" style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{title}</h3>}
      <Gauge {...config} height={height} />
    </div>
  );
};

export default GaugeChart;
