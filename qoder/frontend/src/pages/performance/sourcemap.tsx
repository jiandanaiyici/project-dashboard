import React, { useState, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Input,
  Space,
  Typography,
  Alert,
  Upload,
  message,
  Steps,
  List,
  Badge,
  Descriptions,
  Tabs,
} from 'antd';
import {
  FileTextOutlined,
  BugOutlined,
  SearchOutlined,
  UploadOutlined,
  CodeOutlined,
  FileSearchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  LinkOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Step } = Steps;

// 错误信息接口
interface ErrorInfo {
  id: string;
  message: string;
  stack: string;
  filename: string;
  lineno: number;
  colno: number;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  buildVersion: string;
  environment: 'production' | 'staging' | 'development';
  severity: 'critical' | 'high' | 'medium' | 'low';
  frequency: number;
  firstSeen: string;
  lastSeen: string;
  affected: number;
}

// SourceMap 定位结果接口
interface SourceMapResult {
  originalFile: string;
  originalLine: number;
  originalColumn: number;
  originalSource: string;
  functionName?: string;
  sourceContext: {
    beforeLines: string[];
    errorLine: string;
    afterLines: string[];
  };
}

// 模拟错误数据
const mockErrors: ErrorInfo[] = [
  {
    id: 'error-001',
    message: 'Cannot read property "map" of undefined',
    stack: 'TypeError: Cannot read property "map" of undefined\\n    at a.jsx:1:23456\\n    at r (main.js:2:34567)',
    filename: 'main.js',
    lineno: 2,
    colno: 34567,
    timestamp: '2024-01-15 14:23:45',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    url: 'https://app.example.com/projects',
    userId: 'user-123',
    sessionId: 'session-456',
    buildVersion: 'v1.2.3',
    environment: 'production',
    severity: 'critical',
    frequency: 156,
    firstSeen: '2024-01-15 09:12:34',
    lastSeen: '2024-01-15 14:23:45',
    affected: 89,
  },
  {
    id: 'error-002',
    message: 'Network Error: Failed to fetch data',
    stack: 'Error: Network Error\\n    at fetch.js:1:12345\\n    at async getData (api.js:3:45678)',
    filename: 'api.js',
    lineno: 3,
    colno: 45678,
    timestamp: '2024-01-15 13:45:12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    url: 'https://app.example.com/dashboard',
    sessionId: 'session-789',
    buildVersion: 'v1.2.3',
    environment: 'production',
    severity: 'high',
    frequency: 89,
    firstSeen: '2024-01-15 08:30:15',
    lastSeen: '2024-01-15 13:45:12',
    affected: 45,
  },
  {
    id: 'error-003',
    message: 'ReferenceError: undefined variable "config"',
    stack: 'ReferenceError: config is not defined\\n    at init.js:5:23456\\n    at module.exports (utils.js:2:12345)',
    filename: 'utils.js',
    lineno: 2,
    colno: 12345,
    timestamp: '2024-01-15 12:18:33',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    url: 'https://app.example.com/settings',
    sessionId: 'session-321',
    buildVersion: 'v1.2.2',
    environment: 'production',
    severity: 'medium',
    frequency: 23,
    firstSeen: '2024-01-14 16:45:22',
    lastSeen: '2024-01-15 12:18:33',
    affected: 12,
  },
];

// 模拟 SourceMap 解析结果
const mockSourceMapResult: SourceMapResult = {
  originalFile: 'src/components/ProjectList.tsx',
  originalLine: 45,
  originalColumn: 12,
  originalSource: 'Cannot read property "map" of undefined',
  functionName: 'renderProjectList',
  sourceContext: {
    beforeLines: [
      '  const [projects, setProjects] = useState([]);',
      '  const [loading, setLoading] = useState(false);',
      '  ',
      '  const renderProjectList = () => {',
    ],
    errorLine: '    return projects.map(project => (',
    afterLines: [
      '      <ProjectCard key={project.id} project={project} />',
      '    ));',
      '  };',
      '  ',
    ],
  },
};

const SourceMapIntegration: React.FC = () => {
  const [selectedError, setSelectedError] = useState<ErrorInfo | null>(null);
  const [sourceMapResult, setSourceMapResult] = useState<SourceMapResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedSourceMap, setUploadedSourceMap] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 分析错误
  const analyzeError = async (error: ErrorInfo) => {
    setIsAnalyzing(true);
    setSelectedError(error);

    // 模拟 SourceMap 解析过程
    setTimeout(() => {
      setSourceMapResult(mockSourceMapResult);
      setIsAnalyzing(false);
      message.success('错误定位成功');
    }, 2000);
  };

  // 上传 SourceMap 文件
  const handleSourceMapUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedSourceMap(file.name);
      message.success(`SourceMap 文件 ${file.name} 上传成功`);
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 错误列表表格列
  const errorColumns = [
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      width: 300,
      render: (text: string, record: ErrorInfo) => (
        <div>
          <Text strong style={{ color: '#ff4d4f' }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.filename}:{record.lineno}:{record.colno}
          </Text>
        </div>
      ),
    },
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => {
        const severityMap = {
          critical: { color: 'red', text: '严重' },
          high: { color: 'orange', text: '高' },
          medium: { color: 'blue', text: '中' },
          low: { color: 'green', text: '低' },
        };
        const config = severityMap[severity as keyof typeof severityMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 80,
      render: (frequency: number) => (
        <Badge count={frequency} style={{ backgroundColor: '#f50' }} />
      ),
    },
    {
      title: '影响用户',
      dataIndex: 'affected',
      key: 'affected',
      width: 100,
      render: (affected: number) => `${affected} 人`,
    },
    {
      title: '环境',
      dataIndex: 'environment',
      key: 'environment',
      width: 100,
      render: (env: string) => {
        const envMap = {
          production: { color: 'red', text: '生产' },
          staging: { color: 'orange', text: '预发' },
          development: { color: 'blue', text: '开发' },
        };
        const config = envMap[env as keyof typeof envMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '最后发生',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: ErrorInfo) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<SearchOutlined />}
            onClick={() => analyzeError(record)}
          >
            定位源码
          </Button>
          <Button
            size="small"
            icon={<FileTextOutlined />}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3}>SourceMap 错误定位</Title>
          <Text type="secondary">
            通过 SourceMap 技术将生产环境的压缩代码错误定位到源码位置，快速诊断和修复问题
          </Text>
        </div>

        <Tabs defaultActiveKey="errors" type="card">
          {/* 错误监控 */}
          <TabPane tab="错误监控" key="errors">
            <Row gutter={[16, 16]}>
              {/* 错误统计 */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text type="danger" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                          {mockErrors.reduce((sum, error) => sum + error.frequency, 0)}
                        </Text>
                        <br />
                        <Text type="secondary">总错误次数</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                          {mockErrors.length}
                        </Text>
                        <br />
                        <Text type="secondary">错误类型</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                          {mockErrors.reduce((sum, error) => sum + error.affected, 0)}
                        </Text>
                        <br />
                        <Text type="secondary">影响用户</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                          {uploadedSourceMap ? '已上传' : '未上传'}
                        </Text>
                        <br />
                        <Text type="secondary">SourceMap</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>

              {/* SourceMap 上传 */}
              <Col span={24}>
                <Card title="SourceMap 管理" size="small">
                  <Alert
                    message="SourceMap 配置说明"
                    description="请上传对应版本的 SourceMap 文件以启用错误源码定位功能。建议按版本分别管理 SourceMap 文件。"
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                  <Upload
                    accept=".map"
                    beforeUpload={handleSourceMapUpload}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>
                      上传 SourceMap 文件
                    </Button>
                  </Upload>
                  {uploadedSourceMap && (
                    <Text type="success" style={{ marginLeft: '16px' }}>
                      已上传: {uploadedSourceMap}
                    </Text>
                  )}
                </Card>
              </Col>

              {/* 错误列表 */}
              <Col span={24}>
                <Card title="错误列表">
                  <Table
                    dataSource={mockErrors}
                    columns={errorColumns}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 源码定位 */}
          <TabPane tab="源码定位" key="analysis">
            {!selectedError ? (
              <Card>
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <FileSearchOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                  <Title level={4} type="secondary">请先选择一个错误进行分析</Title>
                  <Text type="secondary">从错误监控列表中点击"定位源码"按钮开始分析</Text>
                </div>
              </Card>
            ) : (
              <Row gutter={[16, 16]}>
                {/* 错误详情 */}
                <Col span={24}>
                  <Card title="错误详情">
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="错误信息">
                        <Text code>{selectedError.message}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="文件位置">
                        {selectedError.filename}:{selectedError.lineno}:{selectedError.colno}
                      </Descriptions.Item>
                      <Descriptions.Item label="发生时间">
                        {selectedError.timestamp}
                      </Descriptions.Item>
                      <Descriptions.Item label="版本信息">
                        {selectedError.buildVersion}
                      </Descriptions.Item>
                      <Descriptions.Item label="用户代理" span={2}>
                        <Text ellipsis={{ tooltip: selectedError.userAgent }}>
                          {selectedError.userAgent}
                        </Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                {/* 分析步骤 */}
                <Col span={24}>
                  <Card title="定位步骤">
                    <Steps current={isAnalyzing ? 1 : sourceMapResult ? 3 : 0}>
                      <Step
                        title="解析错误堆栈"
                        status="finish"
                        icon={<CheckCircleOutlined />}
                      />
                      <Step
                        title="查找 SourceMap"
                        status={isAnalyzing ? "process" : sourceMapResult ? "finish" : "wait"}
                        icon={isAnalyzing ? <SearchOutlined /> : <CheckCircleOutlined />}
                      />
                      <Step
                        title="定位源代码"
                        status={sourceMapResult ? "finish" : "wait"}
                        icon={sourceMapResult ? <CheckCircleOutlined /> : <CodeOutlined />}
                      />
                    </Steps>
                  </Card>
                </Col>

                {/* 源码定位结果 */}
                {sourceMapResult && (
                  <Col span={24}>
                    <Card
                      title="源码定位结果"
                      extra={
                        <Space>
                          <Button icon={<LinkOutlined />} size="small">
                            在IDE中打开
                          </Button>
                          <Button icon={<DownloadOutlined />} size="small">
                            下载源文件
                          </Button>
                        </Space>
                      }
                    >
                      <Row gutter={[16, 16]}>
                        <Col span={8}>
                          <Descriptions column={1} size="small">
                            <Descriptions.Item label="源文件">
                              <Text code>{sourceMapResult.originalFile}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="位置">
                              行 {sourceMapResult.originalLine}, 列 {sourceMapResult.originalColumn}
                            </Descriptions.Item>
                            <Descriptions.Item label="函数">
                              {sourceMapResult.functionName || '全局作用域'}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col span={16}>
                          <div style={{ backgroundColor: '#f6f8fa', padding: '16px', borderRadius: '6px' }}>
                            <Text strong>源代码上下文：</Text>
                            <pre style={{ marginTop: '8px', fontSize: '12px', lineHeight: '1.5' }}>
                              {sourceMapResult.sourceContext.beforeLines.map((line, index) => (
                                <div key={`before-${index}`} style={{ color: '#666' }}>
                                  {sourceMapResult.originalLine - sourceMapResult.sourceContext.beforeLines.length + index}: {line}
                                </div>
                              ))}
                              <div style={{ backgroundColor: '#ffeef0', color: '#d73a49', padding: '2px 4px' }}>
                                {sourceMapResult.originalLine}: {sourceMapResult.sourceContext.errorLine} ← 错误位置
                              </div>
                              {sourceMapResult.sourceContext.afterLines.map((line, index) => (
                                <div key={`after-${index}`} style={{ color: '#666' }}>
                                  {sourceMapResult.originalLine + index + 1}: {line}
                                </div>
                              ))}
                            </pre>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                )}

                {/* 修复建议 */}
                {sourceMapResult && (
                  <Col span={24}>
                    <Card title="修复建议">
                      <Alert
                        message="错误分析"
                        description="在调用 projects.map() 之前，projects 变量为 undefined。建议添加空值检查或确保数据正确加载。"
                        type="warning"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      <Title level={5}>建议的修复方案：</Title>
                      <List size="small">
                        <List.Item>
                          <Text>1. 添加空值检查：<Text code>{`projects?.map(project => ...)`}</Text></Text>
                        </List.Item>
                        <List.Item>
                          <Text>2. 使用默认值：<Text code>{`(projects || []).map(project => ...)`}</Text></Text>
                        </List.Item>
                        <List.Item>
                          <Text>3. 检查数据加载逻辑，确保 projects 正确初始化</Text>
                        </List.Item>
                        <List.Item>
                          <Text>4. 添加加载状态处理，在数据未加载时显示占位符</Text>
                        </List.Item>
                      </List>
                    </Card>
                  </Col>
                )}
              </Row>
            )}
          </TabPane>

          {/* 性能分析 */}
          <TabPane tab="性能分析" key="performance">
            <Alert
              message="性能分析功能"
              description="结合 SourceMap 定位性能瓶颈代码位置，包括慢查询、大文件加载、内存泄漏等问题的源码定位。"
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="性能问题统计" size="small">
                  <List size="small">
                    <List.Item>
                      <Text>加载时间超时：</Text>
                      <Text strong style={{ color: '#ff4d4f' }}>12 个文件</Text>
                    </List.Item>
                    <List.Item>
                      <Text>内存使用过高：</Text>
                      <Text strong style={{ color: '#fa8c16' }}>5 个组件</Text>
                    </List.Item>
                    <List.Item>
                      <Text>渲染性能问题：</Text>
                      <Text strong style={{ color: '#1890ff' }}>8 个页面</Text>
                    </List.Item>
                    <List.Item>
                      <Text>网络请求超时：</Text>
                      <Text strong style={{ color: '#722ed1' }}>3 个接口</Text>
                    </List.Item>
                  </List>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="SourceMap 覆盖率" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>
                      85%
                    </Text>
                    <br />
                    <Text type="secondary">代码覆盖率</Text>
                    <div style={{ marginTop: '16px' }}>
                      <Text>已覆盖文件：245 / 288</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SourceMapIntegration;