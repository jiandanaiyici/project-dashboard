import { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import { TableParams } from '@/types';

/**
 * 防抖hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 节流hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  const lastExecTime = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastExecTime.current >= delay) {
        lastExecTime.current = now;
        return fn(...args);
      }
    }) as T,
    [fn, delay]
  );
}

/**
 * 异步数据获取hook
 */
export function useAsync<T, P extends any[] = any[]>(
  asyncFunction: (...params: P) => Promise<T>,
  immediate = true
) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  const execute = useCallback(
    async (...params: P) => {
      try {
        setLoading(true);
        setError(undefined);
        const result = await asyncFunction(...params);
        setData(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        message.error(error.message || '请求失败');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      (execute as any)();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}

/**
 * 表格数据管理hook
 */
export function useTable<T = any>(
  fetchData: (params: TableParams) => Promise<{ data: T[]; total: number }>,
  initialParams: Partial<TableParams> = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<TableParams>({
    current: 1,
    pageSize: 10,
    ...initialParams,
  });
  const [total, setTotal] = useState(0);

  const loadData = useCallback(async (newParams?: Partial<TableParams>) => {
    try {
      setLoading(true);
      const finalParams = { ...params, ...newParams };
      const result = await fetchData(finalParams);
      setData(result.data);
      setTotal(result.total);
      setParams(finalParams);
    } catch (error) {
      console.error('Table data loading error:', error);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [fetchData, params]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleParamsChange = useCallback((newParams: Partial<TableParams>) => {
    loadData(newParams);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    params,
    total,
    refresh,
    handleParamsChange,
    setData,
  };
}

/**
 * 本地存储hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * 窗口大小hook
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * 上一个值hook
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * 点击外部hook
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

/**
 * 强制更新hook
 */
export function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);
  return update;
}