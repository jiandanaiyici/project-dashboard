import { delay } from '../utils/request';
import { mockData } from '../mock/mockData';

// 时间记录服务
export const timeTrackingService = {
  // 获取所有时间记录
  getTimeRecords: async (filters = {}) => {
    await delay(400);
    let records = [...mockData.timeRecords];
    
    // 应用筛选条件
    if (filters.userId) {
      records = records.filter(record => record.userId === filters.userId);
    }
    if (filters.projectId) {
      records = records.filter(record => record.projectId === filters.projectId);
    }
    if (filters.startDate) {
      records = records.filter(record => record.date >= filters.startDate);
    }
    if (filters.endDate) {
      records = records.filter(record => record.date <= filters.endDate);
    }
    
    return records;
  },
  
  // 创建时间记录
  createTimeRecord: async (recordData) => {
    await delay(400);
    const newRecord = {
      id: mockData.timeRecords.length + 1,
      ...recordData,
      createdAt: new Date().toISOString()
    };
    mockData.timeRecords.push(newRecord);
    return newRecord;
  },
  
  // 更新时间记录
  updateTimeRecord: async (id, recordData) => {
    await delay(300);
    const index = mockData.timeRecords.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('时间记录不存在');
    }
    mockData.timeRecords[index] = {
      ...mockData.timeRecords[index],
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    return mockData.timeRecords[index];
  },
  
  // 删除时间记录
  deleteTimeRecord: async (id) => {
    await delay(300);
    const index = mockData.timeRecords.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('时间记录不存在');
    }
    mockData.timeRecords.splice(index, 1);
    return { success: true };
  },
  
  // 获取时间统计数据
  getTimeStatistics: async (userId) => {
    await delay(500);
    const userRecords = userId 
      ? mockData.timeRecords.filter(record => record.userId === userId)
      : mockData.timeRecords;
    
    // 计算按项目分类的工时统计
    const projectStats = {};
    userRecords.forEach(record => {
      if (!projectStats[record.projectId]) {
        projectStats[record.projectId] = 0;
      }
      projectStats[record.projectId] += record.hours;
    });
    
    // 计算总工数
    const totalHours = userRecords.reduce((sum, record) => sum + record.hours, 0);
    
    // 计算平均工时
    const days = new Set(userRecords.map(record => record.date)).size;
    const averageHours = days > 0 ? totalHours / days : 0;
    
    return {
      totalHours: Math.round(totalHours * 10) / 10,
      averageHours: Math.round(averageHours * 10) / 10,
      projectStats,
      daysRecorded: days
    };
  }
};

export default timeTrackingService;