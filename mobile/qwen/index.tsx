import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    pageTrends: false,
    appComparison: true,
  });
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data
  const coreMetrics = [
    { name: "总访问用户", value: "89,201", change: 6.3, trend: "up", icon: "👥" },
    { name: "核心功能使用率", value: "72%", change: -2.1, trend: "down", icon: "📊" },
    { name: "新用户转化率", value: "18.7%", change: 3.5, trend: "up", icon: "📈" },
    { name: "崩溃率", value: "0.12%", change: 0, trend: "stable", icon: "⚠️" },
    { name: "平均停留时长", value: "4m 23s", change: 8.2, trend: "up", icon: "⏱️" },
    { name: "跳出率", value: "32.5%", change: -3.1, trend: "down", icon: "📉" },
  ];

  const appData = [
    { name: "微信小程序", icon: "wechat", visits: 35120, change: 12.1, rank: "🥇", dau: 28500, retention: 65.2, crashRate: 0.08 },
    { name: "App首页", icon: "home", visits: 28450, change: -3.2, rank: "🥈", dau: 22100, retention: 58.7, crashRate: 0.12 },
    { name: "用户中心", icon: "user", visits: 15678, change: 8.9, rank: "🥉", dau: 12300, retention: 72.4, crashRate: 0.05 },
    { name: "商品详情页", icon: "shopping", visits: 12340, change: 13.3, rank: "", dau: 9800, retention: 45.8, crashRate: 0.03 },
    { name: "购物车页", icon: "cart", visits: 8765, change: -4.7, rank: "", dau: 7200, retention: 38.2, crashRate: 0.06 },
    { name: "支付成功页", icon: "check", visits: 5432, change: 11.1, rank: "", dau: 4500, retention: 85.6, crashRate: 0.02 },
    { name: "设置页", icon: "settings", visits: 1023, change: -18.7, rank: "⚠️", dau: 850, retention: 22.1, crashRate: 0.15 },
  ];

  const pageTrends = [
    { name: "商品详情页", current: 12340, previous: 10890, change: 13.3, bounceRate: 35.2, avgTime: "3m 45s" },
    { name: "购物车页", current: 8765, previous: 9200, change: -4.7, bounceRate: 18.7, avgTime: "2m 15s" },
    { name: "支付成功页", current: 5432, previous: 4890, change: 11.1, bounceRate: 5.3, avgTime: "1m 30s" },
  ];

  const funnelData = [
    { stage: "访问用户", value: 89201, conversion: 100, dropRate: 0 },
    { stage: "浏览商品", value: 65320, conversion: 73.2, dropRate: 26.8 },
    { stage: "加入购物车", value: 28450, conversion: 43.6, dropRate: 56.4 },
    { stage: "开始支付", value: 15678, conversion: 55.1, dropRate: 44.9 },
    { stage: "支付成功", value: 12345, conversion: 78.7, dropRate: 21.3 },
  ];

  const retentionData = [
    { day: "D1", rate: 65.2, change: 2.1 },
    { day: "D3", rate: 48.7, change: -1.2 },
    { day: "D7", rate: 32.5, change: 3.8 },
    { day: "D14", rate: 25.3, change: 1.5 },
    { day: "D30", rate: 18.7, change: -0.8 },
  ];

  const insights = [
    { type: "positive", text: "商品页访问量连续3天增长（+15.2%）" },
    { type: "warning", text: "支付失败率上升至5.8%（↑2.3pt，需关注）" },
    { type: "negative", text: "设置页访问量跌至历史最低（-18.7%）" },
    { type: "positive", text: "平均停留时长提升至4分23秒（+8.2%）" },
    { type: "warning", text: "购物车到支付转化率下降4.7个百分点" },
  ];

  const trendCharts = {
    users: "▃▄▆▇▆▄▅",
    features: "▇▆▆▅▆▆▇",
    crashes: "▁▁▂▁▁▁▂",
    retention: "▇▆▄▃▂▁▁",
    revenue: "▁▂▃▄▅▆▇",
  };

  const timeRanges = [
    { value: "1d", label: "今日" },
    { value: "7d", label: "近7日" },
    { value: "30d", label: "近30日" },
    { value: "custom", label: "自定义" },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const TrendIcon = ({ trend }) => {
    if (trend === "up") return <span className="text-green-600">↑</span>;
    if (trend === "down") return <span className="text-red-600">↓</span>;
    return <span className="text-gray-500">→</span>;
  };

  const ChangeBadge = ({ change, trend }) => {
    if (trend === "up") 
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">↑{change}%</span>;
    if (trend === "down") 
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">↓{Math.abs(change)}%</span>;
    return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">→{change}%</span>;
  };

  const InsightItem = ({ insight }) => {
    let icon, bgColor, textColor;
    if (insight.type === "positive") {
      icon = "✅";
      bgColor = "bg-green-50";
      textColor = "text-green-800";
    } else if (insight.type === "warning") {
      icon = "⚠️";
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-800";
    } else {
      icon = "📉";
      bgColor = "bg-red-50";
      textColor = "text-red-800";
    }

    return (
      <div className={`${bgColor} ${textColor} p-3 rounded-lg flex items-start space-x-2`}>
        <span className="text-lg mt-0.5">{icon}</span>
        <p className="text-sm">{insight.text}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">产品数据洞察</h1>
              <p className="text-gray-500 text-sm">2025-04-05 · {timeRange === "7d" ? "近7日" : timeRange === "1d" ? "今日" : timeRange === "30d" ? "近30日" : "自定义"}数据</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="flex overflow-x-auto">
          {[
            { key: "overview", label: "概览", icon: "📊" },
            { key: "apps", label: "应用对比", icon: "📱" },
            { key: "funnel", label: "转化漏斗", icon: "🔽" },
            { key: "retention", label: "留存分析", icon: "🔄" },
            { key: "pages", label: "页面分析", icon: "📄" },
            { key: "insights", label: "智能洞察", icon: "💡" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center space-x-1 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                selectedTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {selectedTab === "overview" && (
          <>
            {/* Core Metrics */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">核心指标概览</h3>
              <div className="grid grid-cols-2 gap-3">
                {coreMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">{metric.icon}</span>
                      <p className="text-xs text-gray-500">{metric.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                      <ChangeBadge change={metric.change} trend={metric.trend} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics Comparison */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">关键指标对比</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">A</span>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">A/B测试对比</p>
                      <p className="text-xs text-blue-700">新版本 vs 旧版本</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-900">+15.3%</p>
                    <p className="text-xs text-blue-700">转化率提升</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">R</span>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">渠道对比</p>
                      <p className="text-xs text-green-700">自然流量 vs 付费推广</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">2.3x</p>
                    <p className="text-xs text-green-700">ROI对比</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">U</span>
                    </div>
                    <div>
                      <p className="font-medium text-purple-900">用户分层</p>
                      <p className="text-xs text-purple-700">新用户 vs 老用户</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-900">38%</p>
                    <p className="text-xs text-purple-700">老用户贡献</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">智能洞察</h3>
              <div className="space-y-3">
                {insights.slice(0, 3).map((insight, index) => (
                  <InsightItem key={index} insight={insight} />
                ))}
              </div>
            </div>

            {/* Trend Charts */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">趋势对比</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">用户留存</span>
                    <span className="text-sm font-medium text-blue-600">D1: 65.2%</span>
                  </div>
                  <div className="font-mono text-lg text-blue-600">{trendCharts.retention}</div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">收入增长</span>
                    <span className="text-sm font-medium text-green-600">持续上升</span>
                  </div>
                  <div className="font-mono text-lg text-green-600">{trendCharts.revenue}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "apps" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">应用多维对比</h3>
              <p className="text-sm text-gray-500">按访问量排序 · 环比上周</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">应用</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">访问量</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">DAU</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">留存率</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">崩溃率</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">环比</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appData.map((app, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-xs">
                              {app.rank || app.name.substring(0, 1)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{app.visits.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">{app.dau.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={app.retention > 60 ? "text-green-600" : app.retention > 40 ? "text-yellow-600" : "text-red-600"}>
                          {app.retention}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={app.crashRate < 0.1 ? "text-green-600" : app.crashRate < 0.2 ? "text-yellow-600" : "text-red-600"}>
                          {app.crashRate}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {app.change >= 0 ? (
                          <span className="text-green-600 text-sm">↑{app.change}%</span>
                        ) : (
                          <span className="text-red-600 text-sm">↓{Math.abs(app.change)}%</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "funnel" && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">用户转化漏斗</h3>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="font-medium text-gray-900">{stage.stage}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{stage.value.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{stage.conversion}% 转化率</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, stage.conversion)}%` }}
                    ></div>
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="text-red-600">↓{stage.dropRate}% 流失率</span>
                      {stage.dropRate > 30 && (
                        <span className="ml-2 text-red-600 font-medium">⚠️ 高流失环节</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "retention" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">用户留存分析</h3>
              <div className="grid grid-cols-5 gap-3">
                {retentionData.map((data, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">{data.day}</p>
                    <p className="text-lg font-bold text-gray-900">{data.rate}%</p>
                    <div className="mt-1">
                      {data.change >= 0 ? (
                        <span className="text-green-600 text-xs">↑{data.change}%</span>
                      ) : (
                        <span className="text-red-600 text-xs">↓{Math.abs(data.change)}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">留存对比</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">新用户 vs 老用户留存</h4>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-sm text-blue-700">新用户 D7</p>
                      <p className="text-lg font-bold text-blue-900">28.5%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-700">老用户 D7</p>
                      <p className="text-lg font-bold text-blue-900">45.2%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-700">差值</p>
                      <p className="text-lg font-bold text-red-600">-16.7%</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">渠道用户留存对比</h4>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-sm text-green-700">自然流量</p>
                      <p className="text-lg font-bold text-green-900">35.8%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-700">付费推广</p>
                      <p className="text-lg font-bold text-green-900">22.4%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-green-700">差值</p>
                      <p className="text-lg font-bold text-green-600">+13.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "pages" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">页面多维分析</h3>
              <p className="text-sm text-gray-500">Top页面环比对比</p>
            </div>
            <div className="divide-y">
              {pageTrends.map((page, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <div className="flex items-center space-x-2">
                      {page.change >= 0 ? (
                        <span className="text-green-600 text-sm">↑{page.change}%</span>
                      ) : (
                        <span className="text-red-600 text-sm">↓{Math.abs(page.change)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-1">访问量</p>
                      <p className="font-bold text-gray-900">{page.current.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-1">跳出率</p>
                      <p className="font-bold text-red-600">{page.bounceRate}%</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-1">平均时长</p>
                      <p className="font-bold text-green-600">{page.avgTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "insights" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">数据异常提醒</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <h4 className="font-semibold text-red-800">支付失败率突增</h4>
                    <p className="text-red-700 mt-1">支付失败率突增至 <strong>8.9%</strong>（↑5.2pt）</p>
                    <p className="text-red-600 text-sm mt-2">👉 可能原因：网关接口超时增多（错误码504上升300%）</p>
                    <p className="text-red-600 text-sm">📈 影响范围：影响订单量约 -1,200 笔</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">智能洞察</h3>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <InsightItem key={index} insight={insight} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">优化建议</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-blue-800">提升商品页转化</h4>
                      <p className="text-blue-700 text-sm mt-1">商品页访问量持续增长，建议增加"立即购买"按钮曝光</p>
                      <p className="text-blue-600 text-xs mt-1">预计可提升转化率 5-8%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-semibold text-green-800">优化设置页体验</h4>
                      <p className="text-green-700 text-sm mt-1">设置页访问量持续下降，建议进行用户调研</p>
                      <p className="text-green-600 text-xs mt-1">重点关注功能使用障碍</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-2xl">💰</span>
                    <div>
                      <h4 className="font-semibold text-purple-800">提升付费转化</h4>
                      <p className="text-purple-700 text-sm mt-1">购物车到支付转化率下降，建议优化支付流程</p>
                      <p className="text-purple-600 text-xs mt-1">简化步骤，增加支付方式</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-sm">
          查看完整数据看板
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs">
            设置预警
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs">
            导出报告
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-xs">
            分享
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
