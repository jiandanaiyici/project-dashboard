import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TrendChart = ({ timeRange }) => {
  // 根据时间范围生成示例数据
  const generateData = () => {
    switch(timeRange) {
      case 'day':
        return [
          { name: '0-2h', commits: 4, lines: 120 },
          { name: '2-4h', commits: 6, lines: 180 },
          { name: '4-6h', commits: 8, lines: 240 },
          { name: '6-8h', commits: 12, lines: 360 },
          { name: '8-10h', commits: 10, lines: 300 },
          { name: '10-12h', commits: 14, lines: 420 },
        ];
      case 'week':
        return [
          { name: '周一', commits: 22, lines: 660 },
          { name: '周二', commits: 25, lines: 750 },
          { name: '周三', commits: 18, lines: 540 },
          { name: '周四', commits: 28, lines: 840 },
          { name: '周五', commits: 32, lines: 960 },
          { name: '周六', commits: 12, lines: 360 },
          { name: '周日', commits: 8, lines: 240 },
        ];
      case 'month':
        return [
          { name: '第1周', commits: 45, lines: 1350 },
          { name: '第2周', commits: 52, lines: 1560 },
          { name: '第3周', commits: 48, lines: 1440 },
          { name: '第4周', commits: 62, lines: 1860 },
        ];
      case 'quarter':
        return [
          { name: '1月', commits: 128, lines: 3840 },
          { name: '2月', commits: 115, lines: 3450 },
          { name: '3月', commits: 142, lines: 4260 },
        ];
      case 'year':
        return [
          { name: 'Q1', commits: 385, lines: 11550 },
          { name: 'Q2', commits: 420, lines: 12600 },
          { name: 'Q3', commits: 398, lines: 11940 },
          { name: 'Q4', commits: 456, lines: 13680 },
        ];
      default:
        return [];
    }
  };

  const data = generateData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="commits" fill="#1890ff" name="提交次数" />
          <Bar dataKey="lines" fill="#52c41a" name="代码行数" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
