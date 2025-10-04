import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 应用管理服务
export const applicationService = {
  // 获取所有应用
  getApplications: async () => {
    await delay(400);
    return mockData.applications;
  },
  
  // 获取单个应用
  getApplicationById: async (id) => {
    await delay(300);
    const app = mockData.applications.find(a => a.id === id);
    if (!app) {
      throw new Error('应用不存在');
    }
    return app;
  },
  
  // 创建应用
  createApplication: async (appData) => {
    await delay(400);
    const newApp = {
      id: mockData.applications.length + 1,
      ...appData,
      status: '启用',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    mockData.applications.push(newApp);
    return newApp;
  },
  
  // 更新应用
  updateApplication: async (id, appData) => {
    await delay(300);
    const index = mockData.applications.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('应用不存在');
    }
    mockData.applications[index] = {
      ...mockData.applications[index],
      ...appData,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    return mockData.applications[index];
  },
  
  // 删除应用
  deleteApplication: async (id) => {
    await delay(300);
    const index = mockData.applications.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('应用不存在');
    }
    mockData.applications.splice(index, 1);
    return { success: true };
  },
  
  // 获取应用埋点数据
  getAppAnalytics: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = mockData.appAnalytics;
    
    // 根据应用ID筛选
    if (params.appId) {
      filtered = filtered.filter(item => item.appId === params.appId);
    }
    
    // 根据时间范围筛选
    if (params.startDate && params.endDate) {
      filtered = filtered.filter(item => 
        item.date >= params.startDate && item.date <= params.endDate
      );
    }
    
    // 按日期排序
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },
  
  // 获取应用页面埋点数据
  getPageAnalytics: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = mockData.pageAnalytics;
    
    // 根据应用ID筛选
    if (params.appId) {
      filtered = filtered.filter(item => item.appId === params.appId);
    }
    
    // 根据页面ID筛选
    if (params.pageId) {
      filtered = filtered.filter(item => item.pageId === params.pageId);
    }
    
    // 根据日期筛选
    if (params.date) {
      filtered = filtered.filter(item => item.date === params.date);
    }
    
    // 按PV降序排序
    filtered.sort((a, b) => b.pv - a.pv);
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },
  
  // 获取应用埋点概览数据
  getAppAnalyticsOverview: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let analyticsData = mockData.appAnalytics;
    
    // 根据时间范围筛选
    if (params.startDate && params.endDate) {
      analyticsData = analyticsData.filter(item => 
        item.date >= params.startDate && item.date <= params.endDate
      );
    }
    
    // 按应用分组汇总数据
    const summaryByApp = {};
    analyticsData.forEach(item => {
      if (!summaryByApp[item.appId]) {
        summaryByApp[item.appId] = {
          appId: item.appId,
          appName: item.appName,
          totalPV: 0,
          totalUV: 0,
          avgDuration: 0,
          avgBounceRate: 0,
          recordCount: 0
        };
      }
      
      summaryByApp[item.appId].totalPV += item.pv;
      summaryByApp[item.appId].totalUV += item.uv;
      summaryByApp[item.appId].avgDuration += item.duration;
      summaryByApp[item.appId].avgBounceRate += item.bounceRate;
      summaryByApp[item.appId].recordCount += 1;
    });
    
    // 计算平均值
    const result = Object.values(summaryByApp).map(item => ({
      ...item,
      avgDuration: Math.round(item.avgDuration / item.recordCount),
      avgBounceRate: Number((item.avgBounceRate / item.recordCount).toFixed(1))
    }));
    
    // 按PV降序排序
    result.sort((a, b) => b.totalPV - a.totalPV);
    
    return {
      success: true,
      data: result,
      total: result.length
    };
  },
  
  // 获取热门应用/页面
  getTopAnalyticsItems: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const { type = 'app', top = 5, date } = params;
    
    if (type === 'app') {
      // 获取热门应用
      let appData = mockData.appAnalytics;
      if (date) {
        appData = appData.filter(item => item.date === date);
      }
      
      // 按PV降序排序并取前N个
      const topApps = [...new Map(appData.map(item => [item.appId, item])).values()]
        .sort((a, b) => b.pv - a.pv)
        .slice(0, top);
      
      return {
        success: true,
        data: topApps,
        total: topApps.length
      };
    } else if (type === 'page') {
      // 获取热门页面
      let pageData = mockData.pageAnalytics;
      if (date) {
        pageData = pageData.filter(item => item.date === date);
      }
      
      // 按PV降序排序并取前N个
      const topPages = pageData
        .sort((a, b) => b.pv - a.pv)
        .slice(0, top);
      
      return {
        success: true,
        data: topPages,
        total: topPages.length
      };
    }
    
    return {
      success: false,
      message: '无效的类型参数'
    };
  },
  
  // 获取流量来源数据
  getTrafficSources: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: mockData.trafficSources,
      total: mockData.trafficSources.length
    };
  },
  
  // 获取设备分布数据
  getDeviceDistribution: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: mockData.deviceDistribution,
      total: mockData.deviceDistribution.length
    };
  },
  
  // 获取地域分布数据
  getGeographicDistribution: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: mockData.geographicDistribution,
      total: mockData.geographicDistribution.length
    };
  },
  
  // 获取用户留存数据
  getRetentionData: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: mockData.retentionData,
      total: mockData.retentionData.length
    };
  }
};

export default applicationService;