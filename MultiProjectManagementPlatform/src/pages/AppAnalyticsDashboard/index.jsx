import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, DatePicker, Select, Table, Button, Tooltip, Statistic, Empty, message } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { EyeOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { applicationService } from '../../services';
import dayjs from 'dayjs';
import './index.less';

const { RangePicker } = DatePicker;

/**
 * 应用埋点数据报表大盘组件
 * 用于分析各应用埋点数据并生成报表，支持查看单应用下所有页面的埋点数据
 */
const AppAnalyticsDashboard = () => {
  // 状态管理
  const [analyticsOverview, setAnalyticsOverview] = useState([]);
  const [appAnalytics, setAppAnalytics] = useState([]);
  const [pageAnalytics, setPageAnalytics] = useState([]);
  const [topApps, setTopApps] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [timeRange, setTimeRange] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appDetailVisible, setAppDetailVisible] = useState(false);
  const [totalStats, setTotalStats] = useState({ pv: 0, uv: 0, avgDuration: 0, avgBounceRate: 0 });
  const [dataCache, setDataCache] = useState({}); // 用于缓存数据，提高性能

  // 默认时间范围（过去7天）
  const getDefaultTimeRange = () => {
    const endDate = dayjs();
    const startDate = dayjs().subtract(7, 'day');
    return [startDate, endDate];
  };

  // 加载应用列表（保留但不使用，以便将来扩展）
  const loadApplications = useCallback(async () => {
    try {
      await applicationService.getApplications();
      // 可以在将来使用这些数据进行筛选或展示
    } catch (error) {
      console.error('加载应用列表失败:', error);
    }
  }, []);

  // 加载应用埋点概览数据（带缓存优化）
  const loadAnalyticsOverview = useCallback(async (startDate, endDate) => {
    const cacheKey = `overview_${startDate}_${endDate}`;
    
    // 检查是否有缓存数据
    if (dataCache[cacheKey]) {
      setAnalyticsOverview(dataCache[cacheKey]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await applicationService.getAppAnalyticsOverview({
        startDate,
        endDate
      });
      
      if (response.success) {
        setAnalyticsOverview(response.data);
        // 缓存数据
        setDataCache(prev => ({ ...prev, [cacheKey]: response.data }));
      } else {
        message.error('获取应用埋点概览数据失败');
      }
    } catch (error) {
      console.error('加载应用埋点概览数据失败:', error);
      message.error('加载应用埋点概览数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setAnalyticsOverview, dataCache, setDataCache]);

  // 加载热门应用和页面（并行加载提高性能）
  const loadTopItems = useCallback(async () => {
    try {
      // 获取今天的日期
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `top_items_${today}`;
      
      // 检查缓存
      if (dataCache[cacheKey]) {
        const { topApps, topPages } = dataCache[cacheKey];
        setTopApps(topApps);
        setTopPages(topPages);
        return;
      }
      
      // 并行加载热门应用和页面
      const [topAppsResponse, topPagesResponse] = await Promise.all([
        applicationService.getTopAnalyticsItems({
          type: 'app',
          top: 5,
          date: today
        }),
        applicationService.getTopAnalyticsItems({
          type: 'page',
          top: 5,
          date: today
        })
      ]);
      
      if (topAppsResponse.success) {
        setTopApps(topAppsResponse.data);
      }
      
      if (topPagesResponse.success) {
        setTopPages(topPagesResponse.data);
      }
      
      // 缓存结果
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: {
          topApps: topAppsResponse.success ? topAppsResponse.data : [],
          topPages: topPagesResponse.success ? topPagesResponse.data : []
        }
      }));
    } catch (error) {
      console.error('加载热门应用和页面失败:', error);
      message.error('加载热门数据失败，请稍后重试');
    }
  }, [setTopApps, setTopPages, dataCache, setDataCache]);

  // 计算总览统计数据（优化：优先使用缓存数据）
  const calculateTotalStats = useCallback(async (startDate, endDate) => {
    const cacheKey = `overview_${startDate}_${endDate}`;
    
    try {
      let overviewData = [];
      
      // 优先使用缓存的数据
      if (dataCache[cacheKey]) {
        overviewData = dataCache[cacheKey];
      } else {
        const overviewResponse = await applicationService.getAppAnalyticsOverview({
          startDate,
          endDate
        });
        
        if (overviewResponse.success) {
          overviewData = overviewResponse.data;
        }
      }
      
      if (overviewData.length > 0) {
        const totalPV = overviewData.reduce((sum, app) => sum + app.totalPV, 0);
        const totalUV = overviewData.reduce((sum, app) => sum + app.totalUV, 0);
        const totalDuration = overviewData.reduce((sum, app) => sum + app.avgDuration, 0);
        const totalBounceRate = overviewData.reduce((sum, app) => sum + app.avgBounceRate, 0);
        
        setTotalStats({
          pv: totalPV,
          uv: totalUV,
          avgDuration: Math.round(totalDuration / overviewData.length),
          avgBounceRate: Number((totalBounceRate / overviewData.length).toFixed(1))
        });
      }
    } catch (error) {
      console.error('计算总览统计数据失败:', error);
    }
  }, [setTotalStats, dataCache]);

  // 加载初始数据，使用useCallback优化以避免每次渲染都创建新函数
  const loadInitialData = useCallback(async (dateRange) => {
    const [startDate, endDate] = dateRange;
    const start = startDate.format('YYYY-MM-DD');
    const end = endDate.format('YYYY-MM-DD');

    await Promise.all([
      loadAnalyticsOverview(start, end),
      loadTopItems(),
      calculateTotalStats(start, end)
    ]);
  }, [loadAnalyticsOverview, loadTopItems, calculateTotalStats]);

  // 初始化数据
  useEffect(() => {
    const defaultRange = getDefaultTimeRange();
    setTimeRange(defaultRange);
    loadInitialData(defaultRange);
    loadApplications();
  }, [loadInitialData, loadApplications]);

  // 加载选中应用的详细数据（缓存+并行加载优化）
  const loadAppDetailData = async (appId, appName) => {
    setLoading(true);
    setSelectedApp({ id: appId, name: appName });
    
    try {
      const [startDate, endDate] = timeRange;
      const start = startDate.format('YYYY-MM-DD');
      const end = endDate.format('YYYY-MM-DD');
      
      const cacheKey = `app_${appId}_${start}_${end}`;
      const pageCacheKey = `pages_${appId}_${end}`;
      
      // 检查缓存
      if (dataCache[cacheKey] && dataCache[pageCacheKey]) {
        setAppAnalytics(dataCache[cacheKey]);
        setPageAnalytics(dataCache[pageCacheKey]);
        setAppDetailVisible(true);
        setLoading(false);
        return;
      }
      
      // 并行加载数据以提高性能
      const [analyticsResponse, pageResponse] = await Promise.all([
        applicationService.getAppAnalytics({
          appId,
          startDate: start,
          endDate: end
        }),
        applicationService.getPageAnalytics({
          appId,
          date: end
        })
      ]);
      
      if (analyticsResponse.success) {
        setAppAnalytics(analyticsResponse.data);
        setDataCache(prev => ({ ...prev, [cacheKey]: analyticsResponse.data }));
      } else {
        message.error('获取应用趋势数据失败');
      }
      
      if (pageResponse.success) {
        setPageAnalytics(pageResponse.data);
        setDataCache(prev => ({ ...prev, [pageCacheKey]: pageResponse.data }));
      } else {
        message.error('获取应用页面数据失败');
      }
      
      setAppDetailVisible(true);
    } catch (error) {
      console.error('加载应用详细数据失败:', error);
      message.error('加载应用详细数据失败，请稍后重试');
      setAppDetailVisible(false);
    } finally {
      setLoading(false);
    }
  };

  // 处理时间范围变化
  const handleTimeRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setTimeRange(dates);
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');

      // 重新加载数据
      Promise.all([
        loadAnalyticsOverview(start, end),
        calculateTotalStats(start, end)
      ]);

      // 如果当前显示应用详情，也重新加载应用数据
      if (selectedApp && appDetailVisible) {
        const appAnalyticsResponse = applicationService.getAppAnalytics({
          appId: selectedApp.id,
          startDate: start,
          endDate: end
        });

        appAnalyticsResponse.then(res => {
          if (res.success) {
            setAppAnalytics(res.data);
          }
        });
      }
    }
  };

  // 关闭应用详情
  const handleCloseAppDetail = () => {
    setAppDetailVisible(false);
    setSelectedApp(null);
    setAppAnalytics([]);
    setPageAnalytics([]);
  };

  // 刷新数据
  const handleRefresh = () => {
    loadInitialData(timeRange);
    loadTopItems();
  };

  // 导出数据功能（增强版）
  const handleExport = () => {
    setLoading(true);

    // 模拟导出功能，实际项目中应实现真正的导出逻辑
    setTimeout(() => {
      try {
        const [startDate, endDate] = timeRange;
        const timeRangeText = `${startDate.format('YYYY-MM-DD')}_to_${endDate.format('YYYY-MM-DD')}`;
        
        // 创建CSV内容（添加更多导出字段和标题）
        const csvContent = [
          ['应用埋点数据报表', '', '', '', '', `时间范围: ${timeRangeText}`],
          ['', '', '', '', '', ''],
          ['总览统计', '', '', '', '', ''],
          ['总访问量(PV)', '独立访客(UV)', '平均停留时长(秒)', '平均跳出率(%)', '', ''],
          [totalStats.pv, totalStats.uv, totalStats.avgDuration, `${totalStats.avgBounceRate}%`, '', ''],
          ['', '', '', '', '', ''],
          ['应用名称', '总访问量(PV)', '独立访客(UV)', '平均停留时长(秒)', '平均跳出率(%)', '备注'],
          ...analyticsOverview.map(app => [
            app.appName,
            app.totalPV,
            app.totalUV,
            app.avgDuration,
            `${app.avgBounceRate}%`,
            app.avgBounceRate > 30 ? '跳出率高' : app.avgBounceRate > 20 ? '跳出率中等' : '跳出率良好'
          ])
        ].map(row => row.join(',')).join('\n');

        // 创建下载链接
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `应用埋点数据报表_${timeRangeText}_${dayjs().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        message.success('数据导出成功');
      } catch (error) {
        console.error('导出数据失败:', error);
        message.error('数据导出失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  // 应用概览表格列定义
  const appOverviewColumns = [
    {
      title: '应用名称',
      dataIndex: 'appName',
      key: 'appName',
      render: (text, record) => (
        <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => loadAppDetailData(record.appId, text)}>
          {text}
        </span>
      )
    },
    {
      title: '总访问量(PV)',
      dataIndex: 'totalPV',
      key: 'totalPV',
      sorter: (a, b) => b.totalPV - a.totalPV
    },
    {
      title: '独立访客(UV)',
      dataIndex: 'totalUV',
      key: 'totalUV',
      sorter: (a, b) => b.totalUV - a.totalUV
    },
    {
      title: '平均停留时长(秒)',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
      sorter: (a, b) => b.avgDuration - a.avgDuration
    },
    {
      title: '平均跳出率(%)',
      dataIndex: 'avgBounceRate',
      key: 'avgBounceRate',
      sorter: (a, b) => a.avgBounceRate - b.avgBounceRate,
      render: rate => (
        <span style={{ color: rate > 30 ? '#f5222d' : rate > 20 ? '#faad14' : '#52c41a' }}>
          {rate}%
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => loadAppDetailData(record.appId, record.appName)}
        >
          查看详情
        </Button>
      )
    }
  ];

  // 页面分析表格列定义
  const pageAnalyticsColumns = [
    {
      title: '页面名称',
      dataIndex: 'pageName',
      key: 'pageName'
    },
    {
      title: '访问量(PV)',
      dataIndex: 'pv',
      key: 'pv',
      sorter: (a, b) => b.pv - a.pv
    },
    {
      title: '独立访客(UV)',
      dataIndex: 'uv',
      key: 'uv',
      sorter: (a, b) => b.uv - a.uv
    },
    {
      title: '平均停留时长(秒)',
      dataIndex: 'duration',
      key: 'duration',
      sorter: (a, b) => b.duration - a.duration
    },
    {
      title: '跳出率(%)',
      dataIndex: 'bounceRate',
      key: 'bounceRate',
      render: rate => (
        <span style={{ color: rate > 30 ? '#f5222d' : rate > 20 ? '#faad14' : '#52c41a' }}>
          {rate}%
        </span>
      )
    },
    {
      title: '入口率(%)',
      dataIndex: 'entryRate',
      key: 'entryRate'
    },
    {
      title: '退出率(%)',
      dataIndex: 'exitRate',
      key: 'exitRate'
    }
  ];

  // 颜色配置
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 格式化数字（添加千分位）
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="app-analytics-dashboard">
      <div className="dashboard-header">
        <div className="header-actions">
          <RangePicker 
            value={timeRange} 
            onChange={handleTimeRangeChange} 
            className="time-range-picker"
            placeholder={['开始日期', '结束日期']}
            allowClear={false}
          />
          <Button 
            onClick={handleRefresh} 
            className="refresh-btn"
            icon={<ReloadOutlined />}
            loading={loading}
            size="middle"
            style={{ marginLeft: 8 }}
          >
            刷新
          </Button>
          <Button 
            type="primary" 
            icon={<ExportOutlined />} 
            onClick={handleExport} 
            className="export-btn"
            size="middle"
            loading={loading}
            style={{ marginLeft: 8 }}
          >
            导出数据
          </Button>
        </div>
      </div>

      {/* 总览统计卡片 */}
      <Row gutter={[16, 16]} className="overview-stats">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="总访问量(PV)"
              value={totalStats.pv}
              valueStyle={{ color: '#3f8600' }}
              formatter={formatNumber}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="独立访客(UV)"
              value={totalStats.uv}
              valueStyle={{ color: '#1890ff' }}
              formatter={formatNumber}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="平均停留时长(秒)"
              value={totalStats.avgDuration}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="平均跳出率"
              value={totalStats.avgBounceRate}
              suffix="%"
              valueStyle={{
                color: totalStats.avgBounceRate > 30 ? '#f5222d' :
                  totalStats.avgBounceRate > 20 ? '#faad14' : '#52c41a'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 应用埋点概览 */}
      <Card className="analytics-overview-card" title="应用埋点概览" loading={loading}>
        <Table
          columns={appOverviewColumns}
          dataSource={analyticsOverview}
          rowKey="appId"
          pagination={{ pageSize: 5 }}
          className="overview-table"
        />
      </Card>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} className="charts-section">
        {/* 应用访问量分布 */}
        <Col xs={24} lg={12}>
          <Card title="应用访问量分布" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsOverview}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalPV"
                >
                  {analyticsOverview.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={formatNumber} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 热门应用排行 */}
        <Col xs={24} lg={12}>
          <Card title="今日热门应用排行" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topApps}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatNumber} />
                <YAxis dataKey="appName" type="category" width={100} />
                <RechartsTooltip formatter={formatNumber} />
                <Bar dataKey="pv" fill="#1890ff" name="访问量(PV)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 热门页面排行 */}
        <Col xs={24}>
          <Card title="今日热门页面排行" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topPages}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pageName" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={formatNumber} />
                <RechartsTooltip formatter={formatNumber} />
                <Bar dataKey="pv" fill="#52c41a" name="访问量(PV)" />
                <Bar dataKey="uv" fill="#faad14" name="独立访客(UV)" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 应用详情区域 */}
      {appDetailVisible && selectedApp && (
        <div className="app-detail-section">
          <Card
            title={`${selectedApp.name} - 详细分析`}
            className="app-detail-card"
            extra={
              <Button onClick={handleCloseAppDetail} type="link">
                关闭
              </Button>
            }
          >
            {/* 应用访问趋势 */}
            <div className="app-trend-section">
              <h3>访问趋势分析</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={appAnalytics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" tickFormatter={formatNumber} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <RechartsTooltip formatter={(value, name) => {
                    if (name === '跳出率') return [`${value}%`, name];
                    return [formatNumber(value), name];
                  }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#1890ff" name="访问量(PV)" activeDot={{ r: 8 }} />
                  <Line yAxisId="left" type="monotone" dataKey="uv" stroke="#52c41a" name="独立访客(UV)" />
                  <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#f5222d" name="跳出率" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 应用页面分析 */}
            <div className="app-pages-section">
              <h3>页面访问分析</h3>
              {pageAnalytics.length > 0 ? (
                <Table
                  columns={pageAnalyticsColumns}
                  dataSource={pageAnalytics}
                  rowKey="pageId"
                  pagination={{ pageSize: 5 }}
                  className="pages-table"
                />
              ) : (
                <Empty description="暂无页面数据" />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AppAnalyticsDashboard;