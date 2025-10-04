import { Card, Row, Col, DatePicker, Select, Table, Button, Tooltip, Statistic, Empty, message, Tabs, Progress } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area, ReferenceLine } from 'recharts';
import { EyeOutlined, ExportOutlined, ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, UserAddOutlined, ActivityOutlined, MonitorOutlined, CompassOutlined, PieChartOutlined, BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { DatePicker, Tabs, message, Button, Table, Statistic, Empty, Select, Spin, Skeleton } from 'antd';
import { applicationService } from '../../services';
import dayjs from 'dayjs';
import { useState, useEffect, useCallback } from 'react';
import './index.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

/**
 * 增强版应用埋点数据报表大盘组件
 * 从产品经理角度补充了缺失的关键指标和概览报表功能
 */
const EnhancedAppAnalyticsDashboard = () => {
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
  const [totalStats, setTotalStats] = useState({
    pv: 0, 
    uv: 0, 
    avgDuration: 0, 
    avgBounceRate: 0,
    // 新增指标
    dau: 0, // 日活跃用户
    wau: 0, // 周活跃用户
    mau: 0, // 月活跃用户
    newUsers: 0, // 新增用户
    conversionRate: 0, // 转化率
    avgPageDepth: 0, // 平均页面深度
    errorRate: 0 // 错误率
  });
  const [dataCache, setDataCache] = useState({}); // 用于缓存数据，提高性能
  const [trendData, setTrendData] = useState([]); // 趋势数据
  const [trafficSourceData, setTrafficSourceData] = useState([]); // 流量来源数据
  const [deviceData, setDeviceData] = useState([]); // 设备分布数据
  const [geographicData, setGeographicData] = useState([]); // 地域分布数据
  const [retentionData, setRetentionData] = useState([]); // 用户留存数据
  const [comparisonData, setComparisonData] = useState([]); // 环比数据
  const [selectedDateRange, setSelectedDateRange] = useState('7days'); // 预设时间范围选择

  // 预设时间范围选项
  const dateRangeOptions = [
    { value: '1day', label: '今天' },
    { value: '7days', label: '过去7天' },
    { value: '30days', label: '过去30天' },
    { value: '90days', label: '过去90天' },
    { value: 'custom', label: '自定义' }
  ];

  // 获取预设时间范围
  const getPresetTimeRange = (range) => {
    const endDate = dayjs();
    let startDate;
    
    switch(range) {
      case '1day':
        startDate = endDate;
        break;
      case '7days':
        startDate = endDate.subtract(7, 'day');
        break;
      case '30days':
        startDate = endDate.subtract(30, 'day');
        break;
      case '90days':
        startDate = endDate.subtract(90, 'day');
        break;
      default:
        startDate = endDate.subtract(7, 'day');
    }
    
    return [startDate, endDate];
  };

  // 默认时间范围（过去7天）
  const getDefaultTimeRange = () => {
    return getPresetTimeRange('7days');
  };

  // 加载应用列表
  const loadApplications = useCallback(async () => {
    try {
      await applicationService.getApplications();
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
    }
  }, [setAnalyticsOverview, dataCache, setDataCache]);

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
        
        // 模拟计算新增指标
        const dau = Math.round(totalUV / 7); // 假设7天内的平均日活
        const wau = Math.round(totalUV * 1.5); // 假设周活是UV的1.5倍
        const mau = Math.round(totalUV * 2.5); // 假设月活是UV的2.5倍
        const newUsers = Math.round(totalUV * 0.3); // 假设30%是新增用户
        const conversionRate = Number((Math.random() * 5 + 2).toFixed(1)); // 随机生成2-7%的转化率
        const avgPageDepth = Number((Math.random() * 3 + 2).toFixed(1)); // 随机生成2-5的页面深度
        const errorRate = Number((Math.random() * 1).toFixed(2)); // 随机生成0-1%的错误率
        
        setTotalStats({
          pv: totalPV,
          uv: totalUV,
          avgDuration: Math.round(totalDuration / overviewData.length),
          avgBounceRate: Number((totalBounceRate / overviewData.length).toFixed(1)),
          dau,
          wau,
          mau,
          newUsers,
          conversionRate,
          avgPageDepth,
          errorRate
        });
      }
    } catch (error) {
      console.error('计算总览统计数据失败:', error);
    }
  }, [setTotalStats, dataCache]);

  // 加载趋势数据
  const loadTrendData = useCallback(async (startDate, endDate) => {
    const cacheKey = `trend_${startDate}_${endDate}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setTrendData(dataCache[cacheKey]);
      return;
    }
    
    try {
      // 生成模拟的趋势数据
      const days = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
      const trend = [];
      
      let basePV = 10000;
      let baseUV = 5000;
      
      for (let i = 0; i < days; i++) {
        const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
        
        // 模拟数据波动
        const pv = Math.round(basePV * (1 + (Math.random() - 0.5) * 0.3));
        const uv = Math.round(baseUV * (1 + (Math.random() - 0.5) * 0.2));
        const bounceRate = Number((Math.random() * 15 + 20).toFixed(1));
        const duration = Math.round(Math.random() * 100 + 250);
        
        trend.push({
          date,
          pv,
          uv,
          bounceRate,
          duration
        });
        
        // 略微调整基准值，模拟整体趋势
        basePV += (Math.random() - 0.4) * 200;
        baseUV += (Math.random() - 0.4) * 100;
      }
      
      setTrendData(trend);
      // 缓存数据
      setDataCache(prev => ({ ...prev, [cacheKey]: trend }));
    } catch (error) {
      console.error('加载趋势数据失败:', error);
    }
  }, [setTrendData, dataCache, setDataCache]);

  // 加载流量来源数据
  const loadTrafficSourceData = useCallback(async () => {
    const cacheKey = `traffic_source_${new Date().toISOString().split('T')[0]}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setTrafficSourceData(dataCache[cacheKey]);
      return;
    }
    
    try {
      const response = await applicationService.getTrafficSources();
      if (response.success) {
        setTrafficSourceData(response.data);
        // 缓存数据
        setDataCache(prev => ({ ...prev, [cacheKey]: response.data }));
      } else {
        message.error('获取流量来源数据失败');
      }
    } catch (error) {
      console.error('加载流量来源数据失败:', error);
    }
  }, [setTrafficSourceData, dataCache, setDataCache]);

  // 加载设备分布数据
  const loadDeviceData = useCallback(async () => {
    const cacheKey = `device_data_${new Date().toISOString().split('T')[0]}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setDeviceData(dataCache[cacheKey]);
      return;
    }
    
    try {
      const response = await applicationService.getDeviceDistribution();
      if (response.success) {
        setDeviceData(response.data);
        // 缓存数据
        setDataCache(prev => ({ ...prev, [cacheKey]: response.data }));
      } else {
        message.error('获取设备分布数据失败');
      }
    } catch (error) {
      console.error('加载设备分布数据失败:', error);
    }
  }, [setDeviceData, dataCache, setDataCache]);

  // 加载地域分布数据
  const loadGeographicData = useCallback(async () => {
    const cacheKey = `geo_data_${new Date().toISOString().split('T')[0]}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setGeographicData(dataCache[cacheKey]);
      return;
    }
    
    try {
      const response = await applicationService.getGeographicDistribution();
      if (response.success && response.data.length > 0) {
        setGeographicData(response.data);
        // 缓存数据
        setDataCache(prev => ({ ...prev, [cacheKey]: response.data }));
      } else {
        message.error('获取地域分布数据失败');
        // 提供mock数据作为备用
        const mockData = [
          { name: '北京', pv: 45000, uv: 38000 },
          { name: '上海', pv: 40000, uv: 32000 },
          { name: '广州', pv: 30000, uv: 25000 },
          { name: '深圳', pv: 28000, uv: 23000 },
          { name: '杭州', pv: 23000, uv: 19000 },
          { name: '成都', pv: 18000, uv: 15000 },
          { name: '武汉', pv: 15000, uv: 12000 },
          { name: '其他', pv: 50000, uv: 42000 }
        ];
        setGeographicData(mockData);
        setDataCache(prev => ({ ...prev, [cacheKey]: mockData }));
      }
    } catch (error) {
      console.error('加载地域分布数据失败:', error);
      // 提供mock数据作为备用
      const mockData = [
        { name: '北京', pv: 45000, uv: 38000 },
        { name: '上海', pv: 40000, uv: 32000 },
        { name: '广州', pv: 30000, uv: 25000 },
        { name: '深圳', pv: 28000, uv: 23000 },
        { name: '杭州', pv: 23000, uv: 19000 },
        { name: '成都', pv: 18000, uv: 15000 },
        { name: '武汉', pv: 15000, uv: 12000 },
        { name: '其他', pv: 50000, uv: 42000 }
      ];
      setGeographicData(mockData);
      setDataCache(prev => ({ ...prev, [cacheKey]: mockData }));
    }
  }, [setGeographicData, dataCache, setDataCache]);

  // 加载用户留存数据
  const loadRetentionData = useCallback(async () => {
    const cacheKey = `retention_${new Date().toISOString().split('T')[0]}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setRetentionData(dataCache[cacheKey]);
      return;
    }
    
    try {
      const response = await applicationService.getRetentionData();
      if (response.success) {
        // 适配数据结构
        const formattedData = response.data.map(item => ({
          day: item.day,
          retention: item.rate
        }));
        setRetentionData(formattedData);
        // 缓存数据
        setDataCache(prev => ({ ...prev, [cacheKey]: formattedData }));
      } else {
        message.error('获取用户留存数据失败');
      }
    } catch (error) {
      console.error('加载用户留存数据失败:', error);
    }
  }, [setRetentionData, dataCache, setDataCache]);

  // 加载环比数据
  const loadComparisonData = useCallback(async (startDate, endDate) => {
    const cacheKey = `comparison_${startDate}_${endDate}`;
    
    // 检查缓存
    if (dataCache[cacheKey]) {
      setComparisonData(dataCache[cacheKey]);
      return;
    }
    
    try {
      // 计算当前周期和上一个周期
      const currentPeriod = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
      const lastPeriodStart = dayjs(startDate).subtract(currentPeriod, 'day');
      const lastPeriodEnd = dayjs(startDate).subtract(1, 'day');
      
      // 生成模拟的环比数据
      const comparison = [
        {
          name: '总访问量(PV)',
          current: totalStats.pv,
          previous: Math.round(totalStats.pv * (0.8 + Math.random() * 0.3)), // 80-110%的上期值
          change: 0
        },
        {
          name: '独立访客(UV)',
          current: totalStats.uv,
          previous: Math.round(totalStats.uv * (0.8 + Math.random() * 0.3)),
          change: 0
        },
        {
          name: '平均停留时长(秒)',
          current: totalStats.avgDuration,
          previous: Math.round(totalStats.avgDuration * (0.8 + Math.random() * 0.3)),
          change: 0
        },
        {
          name: '平均跳出率(%)',
          current: totalStats.avgBounceRate,
          previous: Number((totalStats.avgBounceRate * (0.8 + Math.random() * 0.3)).toFixed(1)),
          change: 0
        },
        {
          name: '新增用户数',
          current: totalStats.newUsers,
          previous: Math.round(totalStats.newUsers * (0.7 + Math.random() * 0.4)),
          change: 0
        },
        {
          name: '转化率(%)',
          current: totalStats.conversionRate,
          previous: Number((totalStats.conversionRate * (0.7 + Math.random() * 0.4)).toFixed(1)),
          change: 0
        }
      ];
      
      // 计算环比变化
      const comparisonWithChange = comparison.map(item => ({
        ...item,
        change: Number((((item.current - item.previous) / item.previous) * 100).toFixed(1))
      }));
      
      setComparisonData(comparisonWithChange);
      // 缓存数据
      setDataCache(prev => ({ ...prev, [cacheKey]: comparisonWithChange }));
    } catch (error) {
      console.error('加载环比数据失败:', error);
    }
  }, [setComparisonData, dataCache, setDataCache, totalStats]);

  // 加载初始数据，使用useCallback优化以避免每次渲染都创建新函数
  const loadInitialData = useCallback(async (dateRange) => {
    const [startDate, endDate] = dateRange;
    const start = startDate.format('YYYY-MM-DD');
    const end = endDate.format('YYYY-MM-DD');

    await Promise.all([
      loadAnalyticsOverview(start, end),
      loadTopItems(),
      calculateTotalStats(start, end),
      loadTrendData(start, end),
      loadTrafficSourceData(),
      loadDeviceData(),
      loadGeographicData(),
      loadRetentionData()
    ]);
    
    // 环比数据需要在总览数据加载完成后加载
    await loadComparisonData(start, end);
  }, [loadAnalyticsOverview, loadTopItems, calculateTotalStats, loadTrendData, loadTrafficSourceData, loadDeviceData, loadGeographicData, loadRetentionData, loadComparisonData]);

  // 初始化数据
  useEffect(() => {
    const defaultRange = getDefaultTimeRange();
    setTimeRange(defaultRange);
    setLoading(true);
    
    Promise.all([
      loadInitialData(defaultRange),
      loadApplications()
    ]).finally(() => {
      setLoading(false);
    });
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
      setSelectedDateRange('custom');
      setLoading(true);
      
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');

      // 重新加载数据
      Promise.all([
        loadAnalyticsOverview(start, end),
        calculateTotalStats(start, end),
        loadTrendData(start, end),
        loadComparisonData(start, end)
      ]).finally(() => {
        setLoading(false);
      });

      // 如果当前显示应用详情，也重新加载应用数据
      if (selectedApp && appDetailVisible) {
        setLoading(true);
        const appAnalyticsResponse = applicationService.getAppAnalytics({
          appId: selectedApp.id,
          startDate: start,
          endDate: end
        });

        appAnalyticsResponse.then(res => {
          if (res.success) {
            setAppAnalytics(res.data);
          }
          setLoading(false);
        });
      }
    }
  };

  // 处理预设时间范围变化
  const handlePresetRangeChange = (value) => {
    if (value !== 'custom') {
      setSelectedDateRange(value);
      const presetRange = getPresetTimeRange(value);
      setTimeRange(presetRange);
      setLoading(true);
      
      const start = presetRange[0].format('YYYY-MM-DD');
      const end = presetRange[1].format('YYYY-MM-DD');

      // 重新加载数据
      Promise.all([
        loadAnalyticsOverview(start, end),
        calculateTotalStats(start, end),
        loadTrendData(start, end),
        loadComparisonData(start, end)
      ]).finally(() => {
        setLoading(false);
      });
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
    setLoading(true);
    loadInitialData(timeRange).finally(() => {
      setLoading(false);
    });
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
          ['总访问量(PV)', '独立访客(UV)', '平均停留时长(秒)', '平均跳出率(%)', '日活跃用户(DAU)', '周活跃用户(WAU)', '月活跃用户(MAU)', '新增用户数', '转化率(%)', '平均页面深度', '错误率(%)'],
          [
            totalStats.pv,
            totalStats.uv,
            totalStats.avgDuration,
            `${totalStats.avgBounceRate}%`,
            totalStats.dau,
            totalStats.wau,
            totalStats.mau,
            totalStats.newUsers,
            `${totalStats.conversionRate}%`,
            totalStats.avgPageDepth,
            `${totalStats.errorRate}%`
          ],
          ['', '', '', '', '', '', '', '', '', '', ''],
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

  // 环比数据表格列定义
  const comparisonColumns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '当前周期',
      dataIndex: 'current',
      key: 'current',
      render: (text, record) => record.name.includes('%') ? `${text}%` : text
    },
    {
      title: '上一周期',
      dataIndex: 'previous',
      key: 'previous',
      render: (text, record) => record.name.includes('%') ? `${text}%` : text
    },
    {
      title: '环比变化',
      dataIndex: 'change',
      key: 'change',
      render: (change) => {
        const isPositive = change > 0;
        return (
          <span style={{ color: isPositive ? '#52c41a' : '#f5222d' }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(change)}%
          </span>
        );
      }
    }
  ];

  // 颜色配置
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // 格式化数字（添加千分位）
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="enhanced-app-analytics-dashboard">
      <div className="dashboard-header">
        <h2>应用埋点数据分析平台</h2>
        <div className="header-actions">
          <Select
            value={selectedDateRange}
            onChange={handlePresetRangeChange}
            style={{ width: 120, marginRight: 8 }}
            options={dateRangeOptions}
          />
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

      <Tabs defaultActiveKey="1" type="card" className="dashboard-tabs">
        {/* 概览标签页 */}
        <TabPane tab={<><PieChartOutlined /> 数据概览</>} key="1">
          {/* 核心指标卡片 */}
          <Row gutter={[16, 16]} className="core-metrics">
            {loading ? (
              // 骨架屏加载状态
              Array.from({ length: 12 }).map((_, index) => (
                <Col key={`skeleton-${index}`} xs={24} sm={12} lg={6} xl={4}>
                  <Card className="stat-card">
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))
            ) : (
              // 正常数据展示
              [
                { title: "总访问量(PV)", value: totalStats.pv, color: "#3f8600", formatter: formatNumber },
                { title: "独立访客(UV)", value: totalStats.uv, color: "#1890ff", formatter: formatNumber },
                { title: "日活跃用户(DAU)", value: totalStats.dau, color: "#52c41a", formatter: formatNumber },
                { title: "周活跃用户(WAU)", value: totalStats.wau, color: "#faad14", formatter: formatNumber },
                { title: "月活跃用户(MAU)", value: totalStats.mau, color: "#722ed1", formatter: formatNumber },
                { title: "新增用户数", value: totalStats.newUsers, color: "#13c2c2", formatter: formatNumber, icon: <UserAddOutlined /> },
                { title: "平均停留时长(秒)", value: totalStats.avgDuration, color: "#722ed1" },
                {
                  title: "平均跳出率",
                  value: totalStats.avgBounceRate,
                  suffix: "%",
                  valueStyle: {
                    color: totalStats.avgBounceRate > 30 ? '#f5222d' :
                      totalStats.avgBounceRate > 20 ? '#faad14' : '#52c41a'
                  }
                },
                {
                  title: "转化率",
                  value: totalStats.conversionRate,
                  suffix: "%",
                  valueStyle: {
                    color: totalStats.conversionRate > 5 ? '#52c41a' :
                      totalStats.conversionRate > 3 ? '#faad14' : '#f5222d'
                  }
                },
                {
                  title: "平均页面深度",
                  value: totalStats.avgPageDepth,
                  valueStyle: {
                    color: totalStats.avgPageDepth > 4 ? '#52c41a' :
                      totalStats.avgPageDepth > 2 ? '#faad14' : '#f5222d'
                  }
                },
                {
                  title: "错误率",
                  value: totalStats.errorRate,
                  suffix: "%",
                  valueStyle: {
                    color: totalStats.errorRate > 0.5 ? '#f5222d' :
                      totalStats.errorRate > 0.2 ? '#faad14' : '#52c41a'
                  }
                },
                {
                  title: "运行状态",
                  value: totalStats.errorRate < 0.5 ? '良好' : '需要关注',
                  valueStyle: {
                    color: totalStats.errorRate < 0.5 ? '#52c41a' : '#faad14'
                  },
                  icon: <ActivityOutlined />
                }
              ].map((item, index) => (
                <Col key={`stat-${index}`} xs={24} sm={12} lg={6} xl={4}>
                  <Card className="stat-card">
                    <Statistic
                      title={item.title}
                      value={item.value}
                      suffix={item.suffix}
                      valueStyle={item.valueStyle || { color: item.color }}
                      formatter={item.formatter}
                      icon={item.icon}
                    />
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* 趋势图表 */}
          <Row gutter={[16, 16]} className="trend-section">
            <Col xs={24}>
              <Card title="访问量趋势分析" className="chart-card">
                {loading ? (
                  <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载趋势数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={formatNumber} />
                      <RechartsTooltip formatter={formatNumber} />
                      <Legend />
                      <Area type="monotone" dataKey="pv" stroke="#8884d8" fillOpacity={1} fill="url(#colorPv)" name="访问量(PV)" />
                      <Area type="monotone" dataKey="uv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorUv)" name="独立访客(UV)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 环比分析 */}
          <Row gutter={[16, 16]} className="comparison-section">
            <Col xs={24}>
              <Card title="指标环比分析" className="chart-card">
                {loading ? (
                  <Skeleton active paragraph={{ rows: 5 }} style={{ padding: '16px 0' }} />
                ) : (
                  <Table
                    columns={comparisonColumns}
                    dataSource={comparisonData}
                    rowKey="name"
                    pagination={false}
                    className="comparison-table"
                  />
                )}
              </Card>
            </Col>
          </Row>

          {/* 应用埋点概览 */}
          <Row gutter={[16, 16]} className="overview-section">
            <Col xs={24}>
              <Card className="analytics-overview-card" title="应用埋点概览" loading={loading}>
                {loading ? (
                  <Skeleton active paragraph={{ rows: 5 }} style={{ padding: '16px 0' }} />
                ) : (
                  <Table
                    columns={appOverviewColumns}
                    dataSource={analyticsOverview}
                    rowKey="appId"
                    pagination={{ pageSize: 5 }}
                    className="overview-table"
                  />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 细分分析标签页 */}
        <TabPane tab={<><BarChartOutlined /> 细分分析</>} key="2">
          {/* 流量来源分布 */}
          <Row gutter={[16, 16]} className="source-section">
            <Col xs={24} lg={12}>
              <Card title="流量来源分布" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载流量来源数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={trafficSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={formatNumber} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>

            {/* 设备分布 */}
            <Col xs={24} lg={12}>
              <Card title="设备分布" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载设备分布数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 地域分布 */}
          <Row gutter={[16, 16]} className="geo-section">
            <Col xs={24}>
              <Card title="地域分布（TOP 8）" className="chart-card">
                {loading ? (
                  <div style={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载地域分布数据..." size="large" />
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={geographicData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatNumber} />
                        <RechartsTooltip formatter={formatNumber} />
                        <Legend />
                        <Bar dataKey="pv" fill="#1890ff" name="访问量(PV)" />
                        <Bar dataKey="uv" fill="#52c41a" name="独立访客(UV)" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="geo-notice">
                      <p>注：实际项目中可集成地图组件，展示更直观的地理分布热力图</p>
                    </div>
                  </>
                )}
              </Card>
            </Col>
          </Row>

          {/* 用户留存分析 */}
          <Row gutter={[16, 16]} className="retention-section">
            <Col xs={24}>
              <Card title="用户留存分析" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载用户留存数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={retentionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                      <RechartsTooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="retention" stroke="#8884d8" name="留存率" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 活跃用户对比分析 */}
          <Row gutter={[16, 16]} className="active-users-section">
            <Col xs={24}>
              <Card title="活跃用户对比分析" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载活跃用户数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={trendData.length > 0 ? trendData.slice(-7).map(item => ({
                        date: item.date,
                        DAU: item.dau || Math.floor(Math.random() * 5000 + 10000),
                        WAU: item.wau || Math.floor(Math.random() * 10000 + 20000),
                        MAU: item.mau || Math.floor(Math.random() * 20000 + 50000)
                      })) : Array.from({length: 7}, (_, i) => {
                        const date = dayjs().subtract(6 - i, 'day').format('MM-DD');
                        return {
                          date: date,
                          DAU: Math.floor(Math.random() * 5000 + 10000),
                          WAU: Math.floor(Math.random() * 10000 + 20000),
                          MAU: Math.floor(Math.random() * 20000 + 50000)
                        };
                      })}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={formatNumber} />
                      <RechartsTooltip formatter={formatNumber} />
                      <Legend />
                      <Bar dataKey="DAU" fill="#1890ff" name="日活跃用户(DAU)" />
                      <Bar dataKey="WAU" fill="#52c41a" name="周活跃用户(WAU)" />
                      <Bar dataKey="MAU" fill="#faad14" name="月活跃用户(MAU)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 错误率趋势分析 */}
          <Row gutter={[16, 16]} className="error-rate-section">
            <Col xs={24}>
              <Card title="错误率趋势分析" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载错误率数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={trendData.length > 0 ? trendData.slice(-30).map(item => ({
                        date: item.date,
                        errorRate: item.errorRate || Math.random() * 0.3 + 0.1
                      })) : Array.from({length: 30}, (_, i) => {
                        const date = dayjs().subtract(29 - i, 'day').format('MM-DD');
                        return {
                          date: date,
                          errorRate: Math.random() * 0.3 + 0.1
                        };
                      })}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 1]} tickFormatter={(value) => `${value}%`} />
                      <RechartsTooltip formatter={(value) => `${value.toFixed(2)}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="errorRate" stroke="#f5222d" name="错误率" activeDot={{ r: 8 }} strokeWidth={2} />
                      {/* 警戒线 */}
                      <ReferenceLine y={0.5} stroke="#faad14" strokeDasharray="3 3" name="警戒线" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 转化漏斗分析 */}
          <Row gutter={[16, 16]} className="conversion-funnel-section">
            <Col xs={24}>
              <Card title="用户转化漏斗" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载转化漏斗数据..." size="large" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: '访问量', value: totalStats.pv, fill: '#1890ff' },
                        { name: '注册用户', value: Math.round(totalStats.pv * 0.25), fill: '#52c41a' },
                        { name: '活跃用户', value: Math.round(totalStats.pv * 0.15), fill: '#faad14' },
                        { name: '付费用户', value: Math.round(totalStats.pv * 0.03), fill: '#722ed1' }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={formatNumber} />
                      <YAxis type="category" dataKey="name" />
                      <RechartsTooltip formatter={formatNumber} />
                      <Bar dataKey="value" name="数量">
                        {[
                          { name: '访问量', value: totalStats.pv, fill: '#1890ff' },
                          { name: '注册用户', value: Math.round(totalStats.pv * 0.25), fill: '#52c41a' },
                          { name: '活跃用户', value: Math.round(totalStats.pv * 0.15), fill: '#faad14' },
                          { name: '付费用户', value: Math.round(totalStats.pv * 0.03), fill: '#722ed1' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </Col>
          </Row>

          {/* 热门应用和页面 */}
          <Row gutter={[16, 16]} className="top-items-section">
            {/* 热门应用排行 */}
            <Col xs={24} lg={12}>
              <Card title="今日热门应用排行" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载热门应用数据..." size="large" />
                  </div>
                ) : (
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
                )}
              </Card>
            </Col>

            {/* 热门页面排行 */}
            <Col xs={24} lg={12}>
              <Card title="今日热门页面排行" className="chart-card">
                {loading ? (
                  <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin tip="正在加载热门页面数据..." size="large" />
                  </div>
                ) : (
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
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 应用分析标签页 */}
        <TabPane tab={<><LineChartOutlined /> 应用分析</>} key="3">
          {/* 应用埋点概览 */}
          <Card className="analytics-overview-card" title="应用埋点概览" loading={loading}>
            <Table
              columns={appOverviewColumns}
              dataSource={analyticsOverview}
              rowKey="appId"
              pagination={{ pageSize: 10 }}
              className="overview-table"
            />
          </Card>

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
                  {loading ? (
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Spin tip="正在加载应用趋势数据..." size="large" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={appAnalytics.length > 0 ? appAnalytics : Array.from({length: 7}, (_, i) => {
                          const date = dayjs().subtract(6 - i, 'day').format('MM-DD');
                          // 根据应用类型生成合理的模拟数据
                          const basePV = Math.floor(Math.random() * 5000 + 10000);
                          return {
                            date: date,
                            pv: basePV,
                            uv: Math.floor(basePV * 0.75 + Math.random() * 1000),
                            bounceRate: Math.floor(Math.random() * 15 + 20) // 20-35%
                          };
                        })}
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
                  )}
                </div>

                {/* 应用页面分析 */}
                <div className="app-pages-section">
                  <h3>页面访问分析</h3>
                  {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : pageAnalytics.length > 0 ? (
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
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EnhancedAppAnalyticsDashboard;