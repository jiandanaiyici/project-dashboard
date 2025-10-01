import React, { useState } from 'react';
import { Card, Row, Col, Select, Typography, Tag, Button, Space } from 'antd';
import { 
  CodeOutlined, 
  DatabaseOutlined, 
  DesktopOutlined, 
  CloudServerOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';

const { Title, Text } = Typography;
const { Option } = Select;

const MetricsCategories = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('all');
  
  // 角色选项
  const roles = [
    { value: 'all', label: '全部角色', icon: <BarChartOutlined /> },
    { value: 'backend', label: '后端开发', icon: <CodeOutlined /> },
    { value: 'frontend', label: '前端开发', icon: <DesktopOutlined /> },
    { value: 'devops', label: 'DevOps', icon: <CloudServerOutlined /> },
    { value: 'data', label: '数据开发', icon: <DatabaseOutlined /> },
    { value: 'security', label: '安全指标', icon: <SafetyCertificateOutlined /> }
  ];

  // 指标数据
  const metricsData = [
    // 通用核心开发指标
    {
      id: 'code-coverage',
      category: '代码质量',
      name: '代码覆盖率',
      description: '被自动化测试覆盖的代码行数占总代码行数的比例',
      value: '85%',
      status: 'normal',
      role: ['backend', 'frontend', 'devops', 'data'],
      tags: ['通用', '质量']
    },
    {
      id: 'code-complexity',
      category: '代码质量',
      name: '代码复杂度',
      description: '衡量代码分支逻辑的复杂程度',
      value: '12',
      status: 'warning',
      role: ['backend', 'frontend', 'devops'],
      tags: ['通用', '质量']
    },
    {
      id: 'commit-frequency',
      category: '版本控制',
      name: '代码提交频率',
      description: '团队/个人每日/每周的Git提交次数',
      value: '3.2次/天',
      status: 'normal',
      role: ['backend', 'frontend', 'devops', 'data'],
      tags: ['通用', '效率']
    },
    {
      id: 'mr-processing-time',
      category: '版本控制',
      name: 'MR处理时效',
      description: '从发起MR到审核通过并合并的平均耗时',
      value: '2.5小时',
      status: 'normal',
      role: ['backend', 'frontend', 'devops'],
      tags: ['通用', '协作']
    },
    {
      id: 'test-pass-rate',
      category: '测试效率',
      name: '自动化测试通过率',
      description: '自动化测试用例执行后通过的用例数占比',
      value: '98%',
      status: 'normal',
      role: ['backend', 'frontend', 'devops', 'data'],
      tags: ['通用', '质量']
    },
    
    // 后端专属指标
    {
      id: 'api-response-time',
      category: '服务性能',
      name: '接口平均响应时间',
      description: '接口从接收到返回响应的平均耗时',
      value: '180ms',
      status: 'normal',
      role: ['backend'],
      tags: ['后端', '性能']
    },
    {
      id: 'api-throughput',
      category: '服务性能',
      name: '接口吞吐量',
      description: '单位时间内接口能处理的请求数',
      value: '1200 QPS',
      status: 'normal',
      role: ['backend'],
      tags: ['后端', '性能']
    },
    {
      id: 'service-availability',
      category: '服务稳定性',
      name: '服务可用性',
      description: '服务正常运行时间占总时间的比例',
      value: '99.95%',
      status: 'normal',
      role: ['backend', 'devops'],
      tags: ['后端', '稳定性']
    },
    {
      id: 'error-rate',
      category: '服务稳定性',
      name: '错误率',
      description: '接口返回非2xx状态码的请求数占比',
      value: '0.05%',
      status: 'normal',
      role: ['backend', 'devops'],
      tags: ['后端', '稳定性']
    },
    {
      id: 'cpu-usage',
      category: '资源利用率',
      name: 'CPU使用率',
      description: '服务所在服务器/容器的CPU占用百分比',
      value: '45%',
      status: 'normal',
      role: ['backend', 'devops'],
      tags: ['后端', '资源']
    },
    {
      id: 'memory-usage',
      category: '资源利用率',
      name: '内存使用率',
      description: '服务占用的物理内存占总内存的比例',
      value: '65%',
      status: 'normal',
      role: ['backend', 'devops'],
      tags: ['后端', '资源']
    },
    
    // 前端专属指标
    {
      id: 'lcp',
      category: '页面性能',
      name: 'LCP(最大内容绘制)',
      description: '页面加载后，最大内容元素完全显示的时间',
      value: '1.8s',
      status: 'normal',
      role: ['frontend'],
      tags: ['前端', '性能']
    },
    {
      id: 'inp',
      category: '页面性能',
      name: 'INP(交互延迟)',
      description: '用户交互的下一步延迟中位数',
      value: '120ms',
      status: 'normal',
      role: ['frontend'],
      tags: ['前端', '性能']
    },
    {
      id: 'frontend-error-rate',
      category: '交互体验',
      name: '前端错误率',
      description: '页面运行时发生的JS错误次数占比',
      value: '0.08%',
      status: 'normal',
      role: ['frontend'],
      tags: ['前端', '质量']
    },
    
    // DevOps专属指标
    {
      id: 'pipeline-success-rate',
      category: 'CI/CD效率',
      name: '流水线成功率',
      description: 'CI/CD流水线执行成功的次数占比',
      value: '96%',
      status: 'normal',
      role: ['devops'],
      tags: ['DevOps', '效率']
    },
    {
      id: 'deployment-frequency',
      category: 'CI/CD效率',
      name: '部署频率',
      description: '团队每周向生产环境部署代码的次数',
      value: '3.5次/周',
      status: 'normal',
      role: ['devops'],
      tags: ['DevOps', '效率']
    },
    {
      id: 'container-status',
      category: '基础设施',
      name: '容器存活状态',
      description: '服务器/容器是否正常运行',
      value: '100%',
      status: 'normal',
      role: ['devops'],
      tags: ['DevOps', '稳定性']
    },
    
    // 数据开发专属指标
    {
      id: 'data-accuracy',
      category: '数据质量',
      name: '数据准确率',
      description: '清洗后正确数据占总数据的比例',
      value: '99.98%',
      status: 'normal',
      role: ['data'],
      tags: ['数据', '质量']
    },
    {
      id: 'model-accuracy',
      category: '模型性能',
      name: '模型准确率',
      description: '模型预测正确的样本数占比',
      value: '92%',
      status: 'normal',
      role: ['data'],
      tags: ['数据', 'AI']
    },
    
    // 安全指标
    {
      id: 'vulnerabilities',
      category: '安全监控',
      name: '高危漏洞数量',
      description: '安全扫描发现的高危安全漏洞数量',
      value: '0',
      status: 'normal',
      role: ['security'],
      tags: ['安全']
    }
  ];

  // 根据角色筛选指标
  const filteredMetrics = selectedRole === 'all' 
    ? metricsData 
    : metricsData.filter(metric => metric.role.includes(selectedRole));

  // 状态标签映射
  const statusMap = {
    normal: { color: 'success', text: '正常' },
    warning: { color: 'warning', text: '预警' },
    error: { color: 'error', text: '异常' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')} 
              className="mb-4"
            >
              返回面板
            </Button>
            <Title level={2} className="!mb-0">技术开发指标体系</Title>
            <Text type="secondary">按开发全流程和角色场景分类的核心指标</Text>
          </div>
          <Link to="/settings">
            <Button>设置</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <Space size="large">
            <Text strong>按角色筛选:</Text>
            <Select 
              defaultValue="all" 
              style={{ width: 200 }} 
              onChange={setSelectedRole}
            >
              {roles.map(role => (
                <Option key={role.value} value={role.value}>
                  <Space>
                    {role.icon}
                    {role.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Space>
        </Card>

        <Row gutter={[24, 24]}>
          {filteredMetrics.map(metric => (
            <Col xs={24} sm={12} lg={8} key={metric.id}>
              <MetricCard metric={metric} statusMap={statusMap} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default MetricsCategories;
