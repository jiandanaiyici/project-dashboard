import React, { useState, useEffect } from 'react';
import { Line, Pie } from '@antv/g2plot';
import {
  DownloadOutlined,
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  MoreOutlined,
  ReloadOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import {
  deliveryTrendData,
  projectData,
  qualityMetrics,
  releaseHistory,
  riskDistributionData,
  riskTypes,
} from '@/mock';
import { Button, Card, Flex, Segmented, Select } from 'antd';
import BoardCard from './components/BoardCard';

const Dashboard: React.FC = () => {
  const [deliveryChart, setDeliveryChart] = useState<any>(null);
  const [riskChart, setRiskChart] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7days');
  const [department, setDepartment] = useState('all');

  useEffect(() => {
    // 交付趋势图
    const deliveryContainer = document.getElementById('deliveryTrendChart');
    if (deliveryContainer) {
      const chart = new Line(deliveryContainer, {
        data: deliveryTrendData,
        xField: 'week',
        yField: 'points',
        smooth: true,
        animation: false,
        point: {
          size: 5,
          shape: 'diamond',
        },
        tooltip: {
          showCrosshairs: true,
          shared: true,
          formatter: (datum: any) => {
            return {
              name: '人均故事点',
              value: datum.points,
            };
          },
        },
        yAxis: {
          label: {
            formatter: (v: any) => `${v}`,
          },
          grid: {
            line: {
              style: {
                stroke: 'rgba(0, 0, 0, 0.05)',
              },
            },
          },
        },
        xAxis: {
          grid: {
            line: {
              style: {
                stroke: 'rgba(0, 0, 0, 0.05)',
              },
            },
          },
        },
        area: {
          style: {
            fill: 'rgba(22, 93, 255, 0.1)',
          },
        },
      });

      chart.render();
      setDeliveryChart(chart);
    }

    // 风险分布饼图
    const riskContainer = document.getElementById('riskDistributionChart');
    if (riskContainer) {
      const chart = new Pie(riskContainer, {
        data: riskDistributionData,
        angleField: 'value',
        colorField: 'type',
        color: riskDistributionData.map(item => item.color),
        radius: 0.8,
        innerRadius: 0.6,
        label: {
          type: 'outer',
          content: '{name}: {percentage}',
        },
        interactions: [
          {
            type: 'element-active',
          },
        ],
        legend: {
          position: 'bottom',
        },
      });

      chart.render();
      setRiskChart(chart);
    }

    return () => {
      if (deliveryChart) {
        deliveryChart.destroy();
      }
      if (riskChart) {
        riskChart.destroy();
      }
    };
  }, []);

  // 导出报告
  const exportReport = () => {
    // 这里可以实现导出报告的逻辑
    console.log('导出报告');
  };

  // 刷新数据
  const refreshData = () => {
    // 这里可以实现刷新数据的逻辑
    console.log('刷新数据');
  };

  // 获取风险等级
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: '正常', color: 'bg-green-500' };
    if (score <= 60) return { level: '关注', color: 'bg-blue-500' };
    if (score <= 80) return { level: '高风险', color: 'bg-yellow-500' };
    return { level: '紧急', color: 'bg-red-500' };
  };

  const riskLevel = getRiskLevel(42);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* 页面标题和操作区 */}
        <Flex gap={12} align="center" justify="space-between">
          <Flex gap={12} vertical>
            <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800">
              数据大盘
            </h1>
            <p className="text-gray-500 mt-1">
              实时掌控人员、项目、系统与商业价值的全局视图
            </p>
          </Flex>
          <Flex gap={12}>
            <Select
              value={timeRange}
              onChange={e => setTimeRange(e)}
              className=" border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              options={[
                { value: '7days', label: '近7天' },
                { value: '30days', label: '近30天' },
                { value: 'quarter', label: '本季度' },
                { value: 'year', label: '本年度' },
              ]}
            />
            <Select
              className="rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={department}
              onChange={e => setDepartment(e)}
              options={[
                { value: 'all', label: '全公司' },
                { value: 'product', label: '产品研发部' },
                { value: 'tech', label: '技术中台' },
                { value: 'data', label: '数据团队' },
              ]}
            />
            <Button
              type="primary"
              onClick={exportReport}
              icon={<DownloadOutlined />}
            >
              导出报告
            </Button>
          </Flex>
        </Flex>

        {/* 综合风险评分卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                综合风险评分
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                实时评估整体运营风险状况
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-end">
              <div className="text-4xl font-bold text-green-600">42</div>
              <div className="ml-3 mb-1">
                <div className="text-sm text-gray-600">风险等级</div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskLevel.color} text-white`}
                >
                  {riskLevel.level}
                </span>
              </div>
            </div>
          </div>

          {/* 风险评分分布 */}
          <div className="mt-6">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>正常 (0-30)</span>
              <span>关注 (31-60)</span>
              <span>高风险 (61-80)</span>
              <span>紧急 (81-100)</span>
            </div>
          </div>
          {/* 风险构成 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {riskTypes.map((risk, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{risk.name}</span>
                  <span className="text-sm font-medium">{risk.value}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className={`h-full rounded-full ${risk.color === 'primary' ? 'bg-blue-500' : risk.color === 'secondary' ? 'bg-gray-500' : risk.color === 'success' ? 'bg-green-500' : risk.color === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${risk.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* AI建议 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0 mt-0.5">
                <BulbOutlined className="text-blue-600 text-xl" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  AI决策建议
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  财务风险偏高(58)，建议：① 优化云资源配置 ② 调整Q3预算分配 ③
                  优先推进高ROI项目
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 四大维度概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <BoardCard
            title="人员效能"
            icon={<UserOutlined className="text-blue-600" />}
            list={[
              {
                title: '平均饱和度',
                value: '85%',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                value: '82',
                title: '人文关怀分',
                color: 'rgb(255 191 0 / 100%)',
              },
              {
                value: '76',
                title: '成长力分',
                color: 'rgb(255 191 0 / 100%)',
              },
            ]}
          />
          <BoardCard
            title="项目健康"
            icon={<TrophyOutlined className="text-yellow-600" />}
            list={[
              {
                title: '平均进展分',
                value: '78',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                title: '交付准时率',
                value: '92%',
                color: 'rgb(34 197 94 / 100%)',
              },
              { title: '阻塞率', value: '18%', color: 'rgb(255 191 0 / 100%)' },
            ]}
          />
          <BoardCard
            title="系统稳定"
            icon={<DatabaseOutlined className="text-green-600" />}
            list={[
              {
                title: '系统健康分',
                value: '91',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                title: '可用性',
                value: '99.96%',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                title: '错误率',
                value: '10.32%',
                color: 'rgb(255 191 0 / 100%)',
              },
            ]}
          />
          <BoardCard
            title="商业价值"
            icon={<BarChartOutlined className="text-yellow-600" />}
            list={[
              {
                title: '平均ROI',
                value: '1.6x',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                title: '成本效率',
                value: '86%',
                color: 'rgb(34 197 94 / 100%)',
              },
              {
                title: '预算控制',
                value: '92%',
                color: 'rgb(255 191 0 / 100%)',
              },
            ]}
          />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 交付趋势图 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800">交付效能趋势</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    团队交付能力的周度变化趋势
                  </p>
                </div>
                <Segmented
                  options={[
                    { value: 'points', label: '人均故事点' },
                    { value: 'cycle', label: '交付周期' },
                    { value: 'frequency', label: '部署频率' },
                  ]}
                />
              </div>
              {/* @TODO: 交付趋势图 */}
              <div id="deliveryTrendChart" className="h-80"></div>
            </div>
          </div>

          {/* 风险分布饼图 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800">风险类型分布</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    各类型风险占比情况
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreOutlined />
                </button>
              </div>
              <div
                id="riskDistributionChart"
                className="h-64 flex items-center justify-center"
              ></div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {riskDistributionData.map((risk, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${risk.type === '发布风险' ? 'col-span-2' : ''}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: risk.color }}
                    ></span>
                    <span className="text-xs text-gray-600">{risk.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 项目列表和质量指标 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            size="small"
            className="lg:col-span-2"
            extra={
              <a
                href="#"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                查看全部
              </a>
            }
            title={
              <Flex vertical gap={4}>
                <h3 className="font-semibold text-gray-800">重点项目状态</h3>
                <p className="text-gray-500 text-xs font-medium">
                  按风险等级排序的关键项目
                </p>
              </Flex>
            }
          >
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        项目名称
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        负责人
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        进度
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        风险分
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ROI
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectData.map(project => (
                      <tr key={project.key}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {project.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={project.owner.avatar}
                              alt={project.owner.name}
                              className="w-6 h-6 rounded-full mr-2 object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              {project.owner.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${project.progress > 80 ? 'bg-green-500' : project.progress > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {project.progress}%
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.risk > 60 ? 'bg-yellow-100 text-yellow-800' : project.risk > 30 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
                          >
                            {project.risk}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.roi}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                          >
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
          {/* 质量指标卡片 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800">质量门禁指标</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    最近发布的质量数据
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  onClick={refreshData}
                >
                  <ReloadOutlined />
                </button>
              </div>

              <div className="space-y-6">
                {qualityMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        {metric.name}
                      </span>
                      <span
                        className={`text-sm font-medium ${metric.color === 'success' ? 'text-green-600' : metric.color === 'warning' ? 'text-yellow-600' : ''}`}
                      >
                        {metric.value}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${metric.color === 'success' ? 'bg-green-500' : metric.color === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">质量门禁状态</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleOutlined className="mr-1" />
                      绿色通行
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">
                    最近发布记录
                  </h4>
                  <div className="space-y-3">
                    {releaseHistory.map((release, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${release.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                          ></span>
                          <span className="text-sm text-gray-600">
                            {release.version}{' '}
                            {release.status === 'success'
                              ? '发布成功'
                              : '发布失败'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {release.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
