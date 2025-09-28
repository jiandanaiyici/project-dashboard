import { ErrorReport, SourceMapMapping } from '@/types';

class ErrorMonitoring {
  private appId: string;
  private sourceMapService: SourceMapService;
  private errorQueue: ErrorReport[] = [];
  private isProcessing = false;

  constructor(appId: string) {
    this.appId = appId;
    this.sourceMapService = new SourceMapService();
  }

  init() {
    // 监听JavaScript错误
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
      });
    });

    // 监听Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
      });
    });

    // 监听资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportError({
          type: 'resource',
          message: `Failed to load resource: ${(event.target as any).src || (event.target as any).href}`,
          filename: (event.target as any).src || (event.target as any).href,
          timestamp: new Date().toISOString(),
        });
      }
    }, true);

    // 监听网络错误
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.name === 'NetworkError' || event.reason?.name === 'TypeError') {
        this.reportError({
          type: 'network',
          message: event.reason?.message || 'Network Error',
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // 定期处理错误队列
    setInterval(() => {
      this.processErrorQueue();
    }, 5000);
  }

  private async reportError(error: Omit<ErrorReport, 'id' | 'appId' | 'userAgent' | 'url'>) {
    const errorReport: ErrorReport = {
      ...error,
      id: this.generateErrorId(),
      appId: this.appId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
    };

    // 添加到队列
    this.errorQueue.push(errorReport);

    // 如果队列未在处理，立即处理
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      for (const error of errors) {
        try {
          // 尝试映射到源码位置
          const sourceMapping = await this.sourceMapService.mapError(error);
          error.sourceMapping = sourceMapping;

          // 发送到后端
          await this.sendErrorToServer(error);
        } catch (err) {
          console.error('Failed to process error:', err);
          // 重新加入队列
          this.errorQueue.push(error);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendErrorToServer(error: ErrorReport) {
    try {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to send error to server:', err);
      throw err;
    }
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string | null {
    // 从认证状态获取用户ID
    return localStorage.getItem('userId');
  }

  private getAuthToken(): string | null {
    // 从认证状态获取token
    return localStorage.getItem('authToken');
  }
}

class SourceMapService {
  private sourceMapCache: Map<string, any> = new Map();

  async mapError(error: ErrorReport): Promise<SourceMapMapping | null> {
    try {
      if (!error.filename || !error.lineno || !error.colno) {
        return null;
      }

      const sourceMap = await this.getSourceMap(error.filename);
      if (!sourceMap) {
        return null;
      }

      const mapping = this.findMapping(sourceMap, error.lineno, error.colno);
      return mapping;
    } catch (err) {
      console.error('Source map mapping failed:', err);
      return null;
    }
  }

  private async getSourceMap(filename: string): Promise<any> {
    if (this.sourceMapCache.has(filename)) {
      return this.sourceMapCache.get(filename);
    }

    try {
      const sourceMapUrl = `${filename}.map`;
      const response = await fetch(sourceMapUrl);
      
      if (!response.ok) {
        return null;
      }

      const sourceMap = await response.json();
      this.sourceMapCache.set(filename, sourceMap);
      return sourceMap;
    } catch (err) {
      console.error('Failed to load source map:', err);
      return null;
    }
  }

  private findMapping(sourceMap: any, line: number, column: number): SourceMapMapping | null {
    try {
      // 这里需要集成source-map库进行实际的映射
      // 暂时返回模拟数据
      return {
        source: 'src/components/Example.tsx',
        line: line - 10, // 模拟映射到源码行号
        column: column - 5, // 模拟映射到源码列号
        name: 'handleClick',
      };
    } catch (err) {
      console.error('Failed to find source mapping:', err);
      return null;
    }
  }
}

export default ErrorMonitoring;
