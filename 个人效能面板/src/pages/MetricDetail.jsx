import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Descriptions,
  Progress,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

// 模拟指标详细数据
const getMetricDetail = (id) => {
  const metrics = {
    "code-coverage": {
      id: "code-coverage",
      name: "代码覆盖率",
      category: "代码质量",
      description:
        "被自动化测试（单元测试/集成测试）覆盖的代码行数占总代码行数的比例",
      value: "85%",
      status: "normal",
      definition: "通过工具（如JaCoCo、Istanbul）统计被测试覆盖的代码行数占比",
      importance: '避免"未测试代码"隐藏bug，尤其核心业务逻辑需高覆盖',
      standard: "核心模块≥80%，非核心模块≥60%",
      tools: "JaCoCo（Java）、Istanbul（JS）、Coverage.py（Python）",
      trendData: [
        { date: "05-01", value: 78 },
        { date: "05-08", value: 80 },
        { date: "05-15", value: 82 },
        { date: "05-22", value: 83 },
        { date: "05-29", value: 85 },
      ],
    },
    "api-response-time": {
      id: "api-response-time",
      name: "接口平均响应时间",
      category: "服务性能",
      description: "接口从接收请求到返回响应的平均耗时",
      value: "180ms",
      status: "normal",
      definition: "通过APM工具（如Prometheus）统计接口响应时间平均值",
      importance: "慢接口会直接影响用户体验（如APP加载超过3秒会流失用户）",
      standard: "查询接口≤200ms，写入接口≤500ms，复杂计算接口≤1s",
      tools: "Prometheus+Grafana、SkyWalking、New Relic",
      trendData: [
        { date: "05-01", value: 210 },
        { date: "05-08", value: 195 },
        { date: "05-15", value: 185 },
        { date: "05-22", value: 182 },
        { date: "05-29", value: 180 },
      ],
    },
    lcp: {
      id: "lcp",
      name: "LCP(最大内容绘制)",
      category: "页面性能",
      description: "页面加载后，最大内容元素（如图片、标题）完全显示的时间",
      value: "1.8s",
      status: "normal",
      definition: "通过浏览器性能API或第三方工具测量页面核心内容加载完成时间",
      importance: '衡量"页面加载速度"，LCP慢会让用户觉得页面"卡着不动"',
      standard: "优秀≤2.5s，可接受≤4s，差>4s",
      tools: "Chrome DevTools、Lighthouse、PageSpeed Insights、百度统计",
      trendData: [
        { date: "05-01", value: 2.3 },
        { date: "05-08", value: 2.1 },
        { date: "05-15", value: 2.0 },
        { date: "05-22", value: 1.9 },
        { date: "05-29", value: 1.8 },
      ],
    },
  };

  return metrics[id] || metrics["code-coverage"];
};

const MetricDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const metric = getMetricDetail(id);

  const statusConfig = {
    normal: {
      color: "success",
      icon: <CheckCircleOutlined />,
      text: "正常",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    warning: {
      color: "warning",
      icon: <WarningOutlined />,
      text: "预警",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    error: {
      color: "error",
      icon: <CloseCircleOutlined />,
      text: "异常",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  };

  const currentStatus = statusConfig[metric.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          返回指标列表
        </Button>

        <Card
          className={`mb-6 border-2 ${currentStatus.borderColor} ${currentStatus.bgColor}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Space size="middle" className="mb-2">
                <Tag
                  color={currentStatus.color}
                  className="text-base py-1 px-3"
                >
                  {currentStatus.icon} {currentStatus.text}
                </Tag>
                <Tag color="blue" className="text-base py-1 px-3">
                  <BarChartOutlined /> {metric.category}
                </Tag>
              </Space>
              <Title level={2} className="!mb-2">
                {metric.name}
              </Title>
              <Text type="secondary">{metric.description}</Text>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-3xl font-bold text-gray-800">
                {metric.value}
              </div>
            </div>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="指标趋势" className="mb-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metric.trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1890ff"
                      activeDot={{ r: 8 }}
                      name={metric.name}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="关键信息" className="mb-6">
              <Descriptions column={1} layout="vertical">
                <Descriptions.Item label="定义">
                  <Text>{metric.definition}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="核心关注点">
                  <Text type="secondary">{metric.importance}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="常见标准">
                  <Text>{metric.standard}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="监控工具">
                  <Text>{metric.tools}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="操作建议">
              <Space direction="vertical" className="w-full">
                <Button block icon={<ToolOutlined />}>
                  查看监控配置
                </Button>
                <Button block>设置告警规则</Button>
                <Button block type="primary">
                  查看相关文档
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MetricDetail;
