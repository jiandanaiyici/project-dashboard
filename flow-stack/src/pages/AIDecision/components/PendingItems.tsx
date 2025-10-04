import {
  Row,
  Col,
  Card,
  Typography,
  List,
  Tag,
  Select,
  Progress,
  Skeleton,
} from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * 未完成关键任务和性能指标
 */
const PendingItems = ({
  loading,
  readinessData,
}: {
  loading: boolean;
  readinessData: any;
}) => {
  return (
    <Skeleton loading={loading} active>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Title level={5} className="mb-0">
                未完成关键任务
              </Title>
              <Text type="secondary" className="text-sm">
                查看所有任务
              </Text>
            </div>
            <List
              dataSource={readinessData?.pendingCriticalTasks}
              renderItem={(task: any, index: number) => (
                <List.Item
                  key={index}
                  className="border-b last:border-0"
                  actions={[
                    <Text type="secondary" className="text-xs">
                      {task.status === '逾期' ? (
                        <span style={{ color: '#f5222d' }}>已逾期</span>
                      ) : (
                        '进行中'
                      )}
                    </Text>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Tag color={task.priority === '高' ? 'red' : 'orange'}>
                        {task.priority}优先级
                      </Tag>
                    }
                    title={
                      <div className="flex items-center">
                        <Text code className="mr-2">
                          {task.id}
                        </Text>
                        <Text>{task.title}</Text>
                      </div>
                    }
                    description={
                      <div className="flex items-center mt-1">
                        <UserOutlined className="mr-1 text-gray-400" />
                        <Text type="secondary" className="text-sm mr-4">
                          {task.owner}
                        </Text>
                        <ClockCircleOutlined className="mr-1 text-gray-400" />
                        <Text type="secondary" className="text-sm">
                          {task.dueDate}到期
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Title level={5} className="mb-0">
                性能测试结果
              </Title>
              <Select
                defaultValue="latest"
                size="small"
                options={[
                  { value: 'latest', label: '最新测试' },
                  { value: 'previous', label: '上一次测试' },
                  { value: 'baseline', label: '基准值' },
                ]}
              />
            </div>
            <div className="space-y-6">
              {Object.entries(readinessData?.performanceMetrics || {}).map(
                ([metric, data]: [string, any], index: number) => {
                  const metricLabels: Record<string, string> = {
                    responseTime: '平均响应时间 (秒)',
                    throughput: '吞吐量 (TPS)',
                    errorRate: '错误率 (%)',
                    cpuUsage: 'CPU使用率 (%)',
                    memoryUsage: '内存使用率 (%)',
                  };

                  let statusColor = '#52C41A'; // 良好
                  if (data.status === '风险') statusColor = '#F5222D';

                  return (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <Text className="text-sm">{metricLabels[metric]}</Text>
                        <Text
                          className="text-sm"
                          style={{ color: statusColor }}
                        >
                          {data.current} / 目标 {data.target}
                        </Text>
                      </div>
                      <Progress
                        percent={Math.min(
                          100,
                          (data.current / data.target) * 100
                        )}
                        size="small"
                        status={
                          data.status === '风险' ? 'exception' : 'success'
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Skeleton>
  );
};

export default PendingItems;
