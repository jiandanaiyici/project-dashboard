import React from 'react';

const App = () => {
  const metrics = [
    {
      name: 'DAU',
      today: 86420,
      yesterday: 82150,
      change: 5.2,
      trend: 'up',
      chart: '████▅▆▇█'
    },
    {
      name: 'PV',
      today: 1240300,
      yesterday: 1180500,
      change: 5.1,
      trend: 'up',
      chart: '████▅▆▇█'
    },
    {
      name: 'UV',
      today: 85700,
      yesterday: 81900,
      change: 4.6,
      trend: 'up',
      chart: '████▅▆▇█'
    },
    {
      name: 'PV/UV',
      today: 14.47,
      yesterday: 14.41,
      change: 0.4,
      trend: 'stable',
      chart: '████████'
    },
    {
      name: '次日留存',
      today: 38.2,
      yesterday: 36.8,
      change: 1.4,
      trend: 'up',
      chart: '███▃▄▅▆█',
      unit: '%'
    },
    {
      name: '7日留存',
      today: 15.6,
      yesterday: 15.3,
      change: 0.3,
      trend: 'stable',
      chart: '████████',
      unit: '%'
    }
  ];

  const getChangeColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeArrow = (trend) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">产品核心指标日报</h1>
              <p className="text-gray-600 mt-1">📅 日期：2025-04-05（对比 2025-04-04）</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                📌 XXX 产品
              </span>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-800 text-sm">
              💡 注：pp = percentage point（百分点），非百分比变化
            </p>
          </div>
        </div>

        {/* Metrics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">📊 核心指标概览</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指标</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">今日值</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">昨日值</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">环比变化</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">趋势图</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.map((metric, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-semibold">
                        {typeof metric.today === 'number' && metric.today > 10000 
                          ? metric.today.toLocaleString() 
                          : metric.today.toFixed(2)}
                        {metric.unit || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {typeof metric.yesterday === 'number' && metric.yesterday > 10000 
                          ? metric.yesterday.toLocaleString() 
                          : metric.yesterday.toFixed(2)}
                        {metric.unit || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor(metric.trend)}`}>
                        {getChangeArrow(metric.trend)} +{metric.change}{metric.name.includes('留存') ? 'pp' : '%'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-blue-600">{metric.chart}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚠️ 关键洞察</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🔹</span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>DAU & PV 双增长</strong>：运营活动/版本更新带动用户回流，建议复盘增长来源。
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🔹</span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>PV/UV 微升</strong>：人均浏览深度稳定，内容吸引力保持。
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🔹</span>
              </div>
              <p className="text-sm text-gray-700">
                <strong>留存率改善</strong>：次日留存提升显著，可能与新用户引导优化相关。
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📬 下一步建议</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">👉</span>
              <span className="text-sm text-gray-700">深入分析新用户来源渠道与行为路径</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">👉</span>
              <span className="text-sm text-gray-700">对比活动页转化率是否同步提升</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">👉</span>
              <span className="text-sm text-gray-700">关注7日留存是否持续改善</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              🔔 设置提醒：每日9:30自动推送 | 数据延迟约2小时
            </div>
            <a 
              href="https://your-bi-dashboard.com" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔗 查看完整数据看板
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
