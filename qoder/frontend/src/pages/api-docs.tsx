import React, { useState } from 'react';
import { Card, Typography, Tabs, Space, Tag, Button, Anchor, Divider } from 'antd';
import { 
  ApiOutlined, 
  KeyOutlined, 
  FileTextOutlined,
  BugOutlined,
  SafetyOutlined,
  RocketOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ApiDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/projects',
      description: '获取项目列表',
      parameters: [
        { name: 'page', type: 'number', required: false, description: '页码，默认为1' },
        { name: 'limit', type: 'number', required: false, description: '每页数量，默认为20' },
        { name: 'status', type: 'string', required: false, description: '项目状态筛选' },
      ],
      response: `{
  "success": true,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "项目名称",
        "status": "active",
        "createTime": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}`
    },
    {
      method: 'POST',
      path: '/api/projects',
      description: '创建新项目',
      parameters: [
        { name: 'name', type: 'string', required: true, description: '项目名称' },
        { name: 'description', type: 'string', required: false, description: '项目描述' },
        { name: 'managerId', type: 'string', required: true, description: '项目经理ID' },
      ],
      response: `{
  "success": true,
  "data": {
    "id": "new-project-id",
    "name": "新项目",
    "status": "active",
    "createTime": "2024-01-15T10:30:00Z"
  }
}`
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 页面头部 */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Title level={1}>
            <ApiOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
            API 文档
          </Title>
          <Paragraph style={{ fontSize: '18px', color: '#666' }}>
            完整的 REST API 参考文档，助您快速集成我们的服务
          </Paragraph>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane tab="概览" key="overview">
            <Card>
              <Title level={2}>API 概览</Title>
              <Paragraph>
                我们的 API 采用 RESTful 设计风格，支持 JSON 格式的数据交换。
                所有 API 请求都需要通过 HTTPS 协议访问，确保数据传输安全。
              </Paragraph>
              
              <Title level={3}>基础信息</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>基础 URL: </Text>
                  <Tag color="blue">https://api.projectmanager.com/v1</Tag>
                </div>
                <div>
                  <Text strong>认证方式: </Text>
                  <Tag color="green">Bearer Token</Tag>
                </div>
                <div>
                  <Text strong>数据格式: </Text>
                  <Tag color="orange">JSON</Tag>
                </div>
                <div>
                  <Text strong>字符编码: </Text>
                  <Tag color="purple">UTF-8</Tag>
                </div>
              </Space>

              <Divider />

              <Title level={3}>快速开始</Title>
              <Paragraph>
                1. 获取 API Key：在控制台的"API 密钥"页面生成您的访问令牌
              </Paragraph>
              <Paragraph>
                2. 发送请求：在请求头中包含 Authorization: Bearer YOUR_API_KEY
              </Paragraph>
              <Paragraph>
                3. 处理响应：所有响应都包含 success 字段指示请求是否成功
              </Paragraph>
            </Card>
          </TabPane>

          <TabPane tab="认证" key="auth">
            <Card>
              <Title level={2}>
                <KeyOutlined style={{ marginRight: '8px' }} />
                API 认证
              </Title>
              
              <Title level={3}>获取 API Key</Title>
              <Paragraph>
                在使用 API 之前，您需要在控制台获取 API Key：
              </Paragraph>
              <ol>
                <li>登录项目管理平台</li>
                <li>进入"系统设置" → "API 密钥"</li>
                <li>点击"生成新密钥"</li>
                <li>复制并安全保存您的 API Key</li>
              </ol>

              <Title level={3}>请求头设置</Title>
              <Card style={{ background: '#001529', color: '#fff', marginTop: '16px' }}>
                <pre style={{ margin: 0, color: '#fff' }}>
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json`}
                </pre>
              </Card>

              <Title level={3}>错误响应</Title>
              <Paragraph>认证失败时会返回 401 状态码：</Paragraph>
              <Card style={{ background: '#fff2f0', border: '1px solid #ffccc7' }}>
                <pre style={{ margin: 0 }}>
{`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}`}
                </pre>
              </Card>
            </Card>
          </TabPane>

          <TabPane tab="API 参考" key="reference">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {apiEndpoints.map((endpoint, index) => (
                <Card key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Tag 
                      color={endpoint.method === 'GET' ? 'green' : 'blue'}
                      style={{ minWidth: '60px', textAlign: 'center' }}
                    >
                      {endpoint.method}
                    </Tag>
                    <Text code style={{ marginLeft: '12px', fontSize: '16px' }}>
                      {endpoint.path}
                    </Text>
                  </div>
                  
                  <Paragraph>{endpoint.description}</Paragraph>
                  
                  <Title level={4}>请求参数</Title>
                  {endpoint.parameters.map((param, paramIndex) => (
                    <div key={paramIndex} style={{ marginBottom: '8px' }}>
                      <Text code>{param.name}</Text>
                      <Tag color={param.required ? 'red' : 'default'} style={{ marginLeft: '8px' }}>
                        {param.type}
                      </Tag>
                      {param.required && <Tag color="volcano">必需</Tag>}
                      <Text style={{ marginLeft: '8px', color: '#666' }}>
                        {param.description}
                      </Text>
                    </div>
                  ))}
                  
                  <Title level={4}>响应示例</Title>
                  <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {endpoint.response}
                    </pre>
                  </Card>
                </Card>
              ))}
            </Space>
          </TabPane>

          <TabPane tab="错误码" key="errors">
            <Card>
              <Title level={2}>
                <BugOutlined style={{ marginRight: '8px' }} />
                错误码说明
              </Title>
              
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {[
                  { code: 200, name: 'OK', description: '请求成功' },
                  { code: 400, name: 'Bad Request', description: '请求参数错误' },
                  { code: 401, name: 'Unauthorized', description: '未授权访问' },
                  { code: 403, name: 'Forbidden', description: '访问被拒绝' },
                  { code: 404, name: 'Not Found', description: '资源不存在' },
                  { code: 429, name: 'Too Many Requests', description: '请求频率超限' },
                  { code: 500, name: 'Internal Server Error', description: '服务器内部错误' },
                ].map((error) => (
                  <Card key={error.code} size="small">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag 
                        color={error.code < 300 ? 'green' : error.code < 500 ? 'orange' : 'red'}
                        style={{ minWidth: '60px', textAlign: 'center' }}
                      >
                        {error.code}
                      </Tag>
                      <Text strong style={{ marginLeft: '12px' }}>{error.name}</Text>
                      <Text style={{ marginLeft: '12px', color: '#666' }}>{error.description}</Text>
                    </div>
                  </Card>
                ))}
              </Space>
            </Card>
          </TabPane>

          <TabPane tab="SDK" key="sdk">
            <Card>
              <Title level={2}>
                <RocketOutlined style={{ marginRight: '8px' }} />
                SDK 与示例
              </Title>
              
              <Title level={3}>JavaScript SDK</Title>
              <Card style={{ background: '#001529', color: '#fff' }}>
                <pre style={{ margin: 0, color: '#fff' }}>
{`npm install @projectmanager/sdk

import { ProjectManager } from '@projectmanager/sdk';

const client = new ProjectManager({
  apiKey: 'YOUR_API_KEY'
});

// 获取项目列表
const projects = await client.projects.list();
console.log(projects);`}
                </pre>
              </Card>

              <Title level={3}>Python SDK</Title>
              <Card style={{ background: '#001529', color: '#fff' }}>
                <pre style={{ margin: 0, color: '#fff' }}>
{`pip install projectmanager-sdk

from projectmanager import Client

client = Client(api_key='YOUR_API_KEY')

# 获取项目列表
projects = client.projects.list()
print(projects)`}
                </pre>
              </Card>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiDocs;