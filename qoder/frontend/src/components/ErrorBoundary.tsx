import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * 错误边界组件
 * 捕获并处理React组件树中的JavaScript错误
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <Result
            status="500"
            title="页面出错了"
            subTitle="抱歉，页面发生了意外错误。请尝试刷新页面或返回首页。"
            extra={
              <div>
                <Button type="primary" onClick={this.handleReload} style={{ marginRight: 16 }}>
                  刷新页面
                </Button>
                <Button onClick={this.handleGoHome}>
                  返回首页
                </Button>
              </div>
            }
          />
          {this.state.error && (
            <details style={{ marginTop: 20, textAlign: 'left' }}>
              <summary>错误详情（开发模式）</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 10, 
                fontSize: 12,
                overflow: 'auto',
                marginTop: 10
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;