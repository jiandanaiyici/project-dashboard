import {
  WarningOutlined,
  ArrowUpOutlined,
  ExclamationCircleOutlined,
  MinusOutlined,
  InfoOutlined,
  ArrowDownOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Line, Scatter } from '@antv/g2plot';
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Select,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import { risks, riskTrendConfig, riskMatrixConfig } from '@/mock';

const { Text, Title } = Typography;
/** 风险管理 */
const RiskManagement = () => {
  /** 渲染影响程度标签 */
  const renderImpactTag = (impact: string) => {
    const impactConfig = {
      高: { color: 'red', text: '高' },
      中: { color: 'orange', text: '中' },
      低: { color: 'blue', text: '低' },
    };

    // @ts-ignore
    const config = impactConfig[impact] || impactConfig['中'];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /** 渲染状态标签 */
  const renderStatusTag = (status: string) => {
    const statusConfig = {
      进行中: { color: 'processing', text: '进行中' },
      待处理: { color: 'default', text: '待处理' },
      待审核: { color: 'warning', text: '待审核' },
      已完成: { color: 'success', text: '已完成' },
      已逾期: { color: 'error', text: '已逾期' },
      处理中: { color: 'processing', text: '处理中' },
      计划中: { color: 'info', text: '计划中' },
      completed: { color: 'success', text: '已完成' },
      'in-progress': { color: 'processing', text: '进行中' },
      pending: { color: 'default', text: '待进行' },
    };

    // @ts-ignore
    const config = statusConfig[status] || statusConfig['进行中'];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <Text type="secondary">高风险项</Text>
              <WarningOutlined style={{ color: '#f5222d' }} />
            </div>
            <Statistic
              value={1}
              valueStyle={{ fontSize: '24px', color: '#f5222d' }}
            />
            <Text type="danger" className="text-xs mt-2 flex items-center">
              <ArrowUpOutlined className="mr-1" /> 较上周新增1项
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              主要风险：第三方支付接口稳定性
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <Text type="secondary">中风险项</Text>
              <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            </div>
            <Statistic
              value={1}
              valueStyle={{ fontSize: '24px', color: '#faad14' }}
            />
            <Text type="secondary" className="text-xs mt-2 flex items-center">
              <MinusOutlined className="mr-1" /> 与上周持平
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              主要风险：核心开发人员负荷过高
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <Text type="secondary">低风险项</Text>
              <InfoOutlined style={{ color: '#1890ff' }} />
            </div>
            <Statistic
              value={1}
              valueStyle={{ fontSize: '24px', color: '#1890ff' }}
            />
            <Text type="success" className="text-xs mt-2 flex items-center">
              <ArrowDownOutlined className="mr-1" /> 较上周减少1项
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              主要风险：文档完善进度滞后
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 风险清单 */}
      <Card
        title="项目风险清单"
        className="hover:shadow-md transition-shadow"
        extra={
          <Button type="primary" size="small" icon={<PlusOutlined />}>
            新增风险
          </Button>
        }
      >
        <Table
          rowKey="id"
          dataSource={risks}
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: '风险ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '风险描述',
              dataIndex: 'description',
              key: 'description',
              render: (_text, record) => (
                <div>
                  <Text strong>{record.description}</Text>
                  <div className="text-xs text-gray-500 mt-1">
                    {record.detail}
                  </div>
                </div>
              ),
            },
            {
              title: '影响范围',
              dataIndex: 'scope',
              key: 'scope',
            },
            {
              title: '可能性',
              dataIndex: 'probability',
              key: 'probability',
            },
            {
              title: '影响程度',
              dataIndex: 'impact',
              key: 'impact',
              render: (_text, record) => renderImpactTag(record.impact),
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (_text, record) => renderStatusTag(record.status),
            },
            {
              title: '应对措施',
              dataIndex: 'measures',
              key: 'measures',
              render: (_text, record) => (
                <div>
                  {record.measures.map(
                    (
                      measure:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | null
                        | undefined,
                      index: React.Key | null | undefined
                    ) => (
                      <div key={index} className="text-sm">
                        {measure}
                      </div>
                    )
                  )}
                </div>
              ),
            },
            {
              title: '负责人',
              dataIndex: 'owner',
              key: 'owner',
              render: (text, record) => (
                <div className="flex items-center">
                  <Avatar
                    src={record.ownerAvatar}
                    size="small"
                    className="mr-2"
                  />
                  <span>{record.owner}</span>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 风险趋势和风险矩阵 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>风险趋势分析</Title>
              <Select
                defaultValue="week"
                size="small"
                options={[
                  { value: 'week', label: '按周' },
                  { value: 'month', label: '按月' },
                  { value: 'sprint', label: '按迭代' },
                ]}
              />
            </div>
            <div className="h-72">{/* <Line {...riskTrendConfig} /> */}</div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>风险矩阵</Title>
              <Text type="secondary" className="text-sm">
                风险评估指南
              </Text>
            </div>
            <div className="h-72">
              {/* <Scatter {...riskMatrixConfig} /> */}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>需立即处理</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>需重点关注</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>常规监控</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <span>可接受风险</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskManagement;
