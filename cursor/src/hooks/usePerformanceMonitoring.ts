import { useEffect, useState, useCallback } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { PerformanceMetrics } from '@/types';

interface UsePerformanceMonitoringReturn {
  metrics: PerformanceMetrics | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const usePerformanceMonitoring = (appId: string): UsePerformanceMonitoringReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectWebVitals = useCallback(() => {
    const newMetrics: Partial<PerformanceMetrics> = {};

    // 收集 Core Web Vitals
    getCLS((metric) => {
      newMetrics.cls = metric.value;
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });

    getFID((metric) => {
      newMetrics.fid = metric.value;
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });

    getFCP((metric) => {
      newMetrics.fcp = metric.value;
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });

    getLCP((metric) => {
      newMetrics.lcp = metric.value;
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });

    getTTFB((metric) => {
      newMetrics.ttfb = metric.value;
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });
  }, []);

  const collectNavigationTiming = useCallback(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const newMetrics: Partial<PerformanceMetrics> = {
        fmp: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      };
      
      setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    }
  }, []);

  const collectResourceTiming = useCallback(() => {
    const resources = performance.getEntriesByType('resource');
    
    // 计算平均响应时间
    const responseTimes = resources
      .filter((resource: any) => resource.responseEnd && resource.responseStart)
      .map((resource: any) => resource.responseEnd - resource.responseStart);
    
    if (responseTimes.length > 0) {
      const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      setMetrics(prev => ({ 
        ...prev, 
        responseTime: avgResponseTime 
      } as PerformanceMetrics));
    }
  }, []);

  const collectErrorRate = useCallback(() => {
    // 这里需要从错误监控系统获取错误率
    // 暂时使用模拟数据
    setMetrics(prev => ({ 
      ...prev, 
      errorRate: 0.01 // 1% 错误率
    } as PerformanceMetrics));
  }, []);

  const collectAvailability = useCallback(() => {
    // 这里需要从监控系统获取可用性数据
    // 暂时使用模拟数据
    setMetrics(prev => ({ 
      ...prev, 
      availability: 99.9 // 99.9% 可用性
    } as PerformanceMetrics));
  }, []);

  const collectThroughput = useCallback(() => {
    // 这里需要从监控系统获取吞吐量数据
    // 暂时使用模拟数据
    setMetrics(prev => ({ 
      ...prev, 
      throughput: 1000 // 1000 QPS
    } as PerformanceMetrics));
  }, []);

  const collectBusinessMetrics = useCallback(() => {
    // 这里需要从业务系统获取PV/UV等数据
    // 暂时使用模拟数据
    setMetrics(prev => ({ 
      ...prev, 
      pv: Math.floor(Math.random() * 10000) + 5000,
      uv: Math.floor(Math.random() * 5000) + 2000,
      conversionRate: Math.random() * 0.1 + 0.05 // 5-15% 转化率
    } as PerformanceMetrics));
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      collectWebVitals();
      collectNavigationTiming();
      collectResourceTiming();
      collectErrorRate();
      collectAvailability();
      collectThroughput();
      collectBusinessMetrics();
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to collect metrics');
      setLoading(false);
    }
  }, [
    collectWebVitals,
    collectNavigationTiming,
    collectResourceTiming,
    collectErrorRate,
    collectAvailability,
    collectThroughput,
    collectBusinessMetrics
  ]);

  useEffect(() => {
    if (appId) {
      refresh();
    }
  }, [appId, refresh]);

  // 定期刷新数据
  useEffect(() => {
    const interval = setInterval(() => {
      if (appId) {
        refresh();
      }
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(interval);
  }, [appId, refresh]);

  return {
    metrics,
    loading,
    error,
    refresh,
  };
};
