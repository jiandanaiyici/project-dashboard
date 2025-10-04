import {
  TeamOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Pie, Bar } from '@ant-design/charts';
import {
  Row,
  Col,
  Card,
  Statistic,
  Avatar,
  Progress,
  Select,
  Button,
  Table,
  Tag,
  Typography,
  Flex,
} from 'antd';
import {
  resourceForecastConfig,
  teamLoadData,
  moduleAllocationConfig,
} from '@/mock';

const { Text } = Typography;

/** 资源分配 */
const ResourceAllocation = () => {
  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">团队总人数</Text>
              <TeamOutlined />
            </div>
            <Statistic value={8} valueStyle={{ fontSize: '24px' }} />
            <Text type="secondary" className="text-xs mt-2 block">
              人员构成：开发5人 · 测试2人 · 管理1人
            </Text>
            <div className="flex mt-3">
              <Avatar
                src="https://picsum.photos/id/1012/200/200"
                size="small"
                className="mr-1"
              />
              <Avatar
                src="https://picsum.photos/id/1027/200/200"
                size="small"
                className="mr-1"
              />
              <Avatar
                src="https://picsum.photos/id/1066/200/200"
                size="small"
                className="mr-1"
              />
              <Avatar
                src="https://picsum.photos/id/1025/200/200"
                size="small"
                className="mr-1"
              />
              <Avatar
                src="https://picsum.photos/id/1005/200/200"
                size="small"
                className="mr-1"
              />
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                +3
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">资源利用率</Text>
              <BarChartOutlined />
            </div>
            <Statistic
              value={85}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={85}
              size="small"
              status="active"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              健康区间：70%-90% · 当前处于理想状态
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">任务分配均衡度</Text>
              {/* <PieChart2Outlined /> */}
            </div>
            <Statistic
              value={72}
              valueStyle={{ fontSize: '24px' }}
              suffix="/100"
            />
            <Text type="warning" className="text-xs mt-2 flex items-center">
              <ExclamationCircleOutlined className="mr-1" /> 均衡度一般，需优化
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              主要问题：2名成员负荷过高
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 资源分配详情 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            title="按角色分配"
            className="hover:shadow-md transition-shadow"
            extra={
              <Select
                defaultValue="current"
                size="small"
                options={[
                  { value: 'current', label: '当前迭代' },
                  { value: 'project', label: '本项目' },
                  { value: 'month', label: '本月' },
                ]}
              />
            }
          >
            <div className="h-64">
              <Pie {...moduleAllocationConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="按模块分配"
            className="hover:shadow-md transition-shadow"
            extra={
              <Text type="secondary" className="text-sm">
                查看详情
              </Text>
            }
          >
            <div className="h-64">
              <Bar {...moduleAllocationConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="资源负载预测"
            extra="资源规划"
            className="hover:shadow-md transition-shadow"
          >
            <div className="h-64">
              <Bar {...resourceForecastConfig} />
            </div>
            <div className="mt-4 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              <ExclamationCircleOutlined className="mr-1" />{' '}
              预测显示迭代14资源不足，建议提前规划补充资源
            </div>
          </Card>
        </Col>
      </Row>

      {/* 人员详细分配 */}
      <Card
        title="人员详细分配"
        className="hover:shadow-md transition-shadow"
        extra={
          <Flex gap={4}>
            <Select
              defaultValue="current"
              size="small"
              options={[
                { value: 'current', label: '当前迭代' },
                { value: 'next', label: '下一迭代' },
                { value: 'quarter', label: '本季度' },
              ]}
            />
            <Button type="primary" size="small" icon={<BarChartOutlined />}>
              平衡负载
            </Button>
          </Flex>
        }
      >
        <Table
          rowKey="name"
          dataSource={teamLoadData}
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: '成员',
              key: 'name',
              render: (text, record) => (
                <div className="flex items-center">
                  <Avatar src={record.avatar} className="mr-3" />
                  <div>
                    <div>{record.name}</div>
                    <div className="text-xs text-gray-500">{record.role}</div>
                  </div>
                </div>
              ),
            },
            {
              title: '角色',
              key: 'role',
              render: (_text, record) => (
                <Tag color={record.color}>{record.role}</Tag>
              ),
            },
            {
              title: '分配任务',
              key: 'tasks',
              render: (_text, record) => `${record.tasks} 项`,
            },
            {
              title: '故事点',
              key: 'points',
              render: (_text, record) => `${record.points} 点`,
            },
            {
              title: '负荷率',
              key: 'load',
              render: (text, record) => (
                <div className="flex items-center">
                  <Progress
                    percent={record.load}
                    size="small"
                    status={
                      record.load > 100
                        ? 'exception'
                        : record.load > 80
                          ? 'active'
                          : 'success'
                    }
                    className="w-24 mr-2"
                  />
                  <span
                    style={{
                      color:
                        record.load > 100
                          ? '#f5222d'
                          : record.load > 80
                            ? '#faad14'
                            : '#52c41a',
                    }}
                  >
                    {record.load}%
                  </span>
                </div>
              ),
            },
            {
              title: '主要负责模块',
              key: 'module',
              render: (_text, record) => record.module,
            },
            {
              title: '状态',
              key: 'status',
              render: (_text, record) => {
                if (record.load > 100) {
                  return <Tag color="error">负荷过高</Tag>;
                } else {
                  return <Tag color="success">正常</Tag>;
                }
              },
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ResourceAllocation;
