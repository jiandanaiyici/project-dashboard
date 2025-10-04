import React from 'react';
import { Card, Empty, Spin } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './SaturationAnalysis.less';

const SaturationAnalysis = ({
  userAllocations,
  loading = false,
  title = '人员饱和度分析'
}) => {
  // 获取饱和度颜色 - 使用渐变色系
  const getSaturationColor = (saturation) => {
    if (saturation > 80) return '#ff4d4f'; // 高饱和度 - 渐变色起点
    if (saturation > 60) return '#fa8c16'; // 中饱和度 - 渐变色起点
    return '#52c41a'; // 低饱和度 - 渐变色起点
  };

  // 获取饱和度级别
  const getSaturationLevel = (saturation) => {
    if (saturation > 80) return '高饱和';
    if (saturation > 60) return '中饱和';
    return '低饱和';
  };

  // 按部门分组统计饱和度
  const getDepartmentStats = () => {
    const departmentMap = new Map();

    userAllocations.forEach(alloc => {
      // 假设用户分配中包含部门信息
      const userInfo = JSON.parse(localStorage.getItem('users') || '[]')
        .find((user) => user.id === alloc.userId);
      const department = userInfo?.department || '未分类';

      if (!departmentMap.has(department)) {
        departmentMap.set(department, { totalUsers: 0, high: 0, medium: 0, low: 0 });
      }

      const stats = departmentMap.get(department);
      if (stats) {
        stats.totalUsers++;

        if (alloc.saturation > 80) {
          stats.high++;
        } else if (alloc.saturation > 60) {
          stats.medium++;
        } else {
          stats.low++;
        }
      }
    });

    return Array.from(departmentMap.entries()).map(([department, stats]) => ({
      department,
      ...stats
    }));
  };

  return (
    <div className="saturation-analysis-container">
      <Card title={title} className="saturation-card">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="加载中..." />
          </div>
        ) : userAllocations.length > 0 ? (
          <div className="saturation-content">
            <div className="main-chart">
              <h3>个人饱和度分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={userAllocations.sort((a, b) => b.saturation - a.saturation)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="userName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis label={{ value: '饱和度 (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, '饱和度']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="saturation"
                    name="饱和度"
                    fill={(entry) => getSaturationColor(entry.saturation)}
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    className="chart-bar"
                  >
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="stats-summary">
              <h3>部门饱和度统计</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={getDepartmentStats()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis label={{ value: '人数', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="high"
                    name="高饱和度 (>80%)"
                    stackId="a"
                    fill="#ff4d4f"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    className="chart-bar"
                  />
                  <Bar
                    dataKey="medium"
                    name="中饱和度 (60-80%)"
                    stackId="a"
                    fill="#fa8c16"
                    animationDuration={1500}
                    className="chart-bar"
                  />
                  <Bar
                    dataKey="low"
                    name="低饱和度 (<=60%)"
                    stackId="a"
                    fill="#52c41a"
                    animationDuration={1500}
                    className="chart-bar"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <Empty description="暂无人员饱和度数据" className="empty-container" />
        )}
        <div className="saturation-legend">
          <div className="saturation-legend-item">
            <div className="saturation-legend-color saturation-high" />
            <span>高饱和 (&gt;80%)</span>
          </div>
          <div className="saturation-legend-item">
            <div className="saturation-legend-color saturation-medium" />
            <span>中饱和 (60-80%)</span>
          </div>
          <div className="saturation-legend-item">
            <div className="saturation-legend-color saturation-low" />
            <span>低饱和 (&lt;=60%)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SaturationAnalysis;