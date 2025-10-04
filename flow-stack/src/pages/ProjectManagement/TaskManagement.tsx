import {
  TeamOutlined,
  FilterOutlined,
  FlagOutlined,
  PlusOutlined,
  InfoOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { Pie, Line } from '@ant-design/charts';
import {
  Typography,
  Badge,
  Button,
  Card,
  Col,
  List,
  Row,
  Select,
  Statistic,
  Avatar,
  Tag,
  Flex,
} from 'antd';

import {
  taskStatusConfig,
  taskPriorityConfig,
  tasks,
  activities,
  burnDownConfig,
  priorityConfig,
} from '@/mock';
import moment from 'moment';

const { Text, Title } = Typography;

/** 任务管理 */
const TaskManagement = () => {
  /** 渲染活动项 */
  const renderActivityItem = (activity: any) => {
    let icon = <CheckCircleOutlined />;
    let iconColor = 'green';

    switch (activity.type) {
      case 'move':
        icon = <ArrowUpOutlined />;
        iconColor = 'orange';
        break;
      case 'assign':
        icon = <UserOutlined />;
        iconColor = 'green';
        break;
      case 'system':
        icon = <ExclamationCircleOutlined />;
        iconColor = 'red';
        break;
      case 'comment':
        icon = <UserOutlined />;
        iconColor = 'blue';
        break;
      default:
        break;
    }

    return (
      <List.Item key={activity.time}>
        <List.Item.Meta
          avatar={
            <Avatar
              icon={icon}
              style={{
                backgroundColor:
                  iconColor === 'green'
                    ? '#52c41a'
                    : iconColor === 'orange'
                      ? '#faad14'
                      : iconColor === 'red'
                        ? '#f5222d'
                        : '#1890ff',
              }}
            />
          }
          title={
            <div>
              <Text strong>{activity.user}</Text>
              <Text> {activity.action} </Text>
              <Text type="secondary">{activity.target}</Text>
              {activity.detail && <Text> {activity.detail}</Text>}
            </div>
          }
          description={
            <div>
              <Text type="secondary" className="text-xs">
                {activity.time}
              </Text>
              {activity.comment && (
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                  {activity.comment}
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  };
  /** 渲染优先级标签 */
  const renderPriorityTag = (priority: string) => {
    // @ts-ignore
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  /** 渲染任务卡片 */
  const renderTaskCard = (task: any, status: string) => {
    return (
      <Card
        size="small"
        className="mb-3 hover:shadow-md transition-shadow"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex justify-between items-start">
          {renderPriorityTag(task.priority)}
          <Text code className="text-xs">
            {task.id}
          </Text>
        </div>
        <Text strong className="block mt-2 text-sm">
          {task.title}
        </Text>

        {status === 'inProgress' && task.remaining && (
          <Text type="secondary" className="text-xs mt-2 block">
            <ClockCircleOutlined className="mr-1" /> 进行中 · 预计还需
            {task.remaining}天
          </Text>
        )}

        {status === 'inReview' && (
          <Text type="secondary" className="text-xs mt-2 block">
            <UserOutlined className="mr-1" /> 等待{task.reviewer}审核
          </Text>
        )}

        {status === 'completed' && (
          <Text type="success" className="text-xs mt-2 block">
            <CheckCircleOutlined className="mr-1" /> 已验收通过
          </Text>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex -space-x-2">
            {Array.isArray(task.avatar) ? (
              task.avatar.map(
                (
                  avatar:
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
                  <Avatar
                    key={index}
                    src={avatar}
                    size="small"
                    shape="circle"
                  />
                )
              )
            ) : (
              <Avatar src={task.avatar} size="small" shape="circle" />
            )}
          </div>

          <Text type="secondary" className="text-xs">
            {status === 'completed' || status === 'inReview' ? (
              `${task.completedDate}完成`
            ) : task.dueDate === moment().format('YYYY-MM-DD') ? (
              '今天到期'
            ) : task.dueDate < moment().format('YYYY-MM-DD') &&
              status !== 'completed' ? (
              <span style={{ color: '#f5222d' }}>已逾期</span>
            ) : (
              `${task.dueDate}到期`
            )}
          </Text>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 任务概览指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">任务总数</Text>
              <TeamOutlined />
            </div>
            <Statistic value={86} valueStyle={{ fontSize: '24px' }} />
            <Text type="secondary" className="text-xs mt-2 block">
              已完成：62 (72%) · 未完成：24 (28%)
            </Text>
            <div className="flex mt-3 h-1.5">
              <div className="flex-1 bg-green-500 rounded-l"></div>
              <div className="flex-1 bg-gray-200 rounded-r"></div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title="任务按状态分布"
            extra={<FilterOutlined />}
            className="hover:shadow-md transition-shadow"
          >
            <div className="h-40">
              <Pie {...taskStatusConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            title="任务按优先级分布"
            extra={<FilterOutlined />}
            className="hover:shadow-md transition-shadow"
          >
            <div className="h-40">
              {/* @ts-ignore */}
              <Pie {...taskPriorityConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 任务看板 */}
      <Card
        title="任务看板"
        extra={
          <Flex>
            <Select
              defaultValue="all"
              size="small"
              options={[
                { value: 'all', label: '所有任务' },
                { value: 'mine', label: '我的任务' },
                { value: 'overdue', label: '已逾期任务' },
                { value: 'week', label: '本周到期' },
              ]}
            />
            <Button type="primary" size="small" icon={<PlusOutlined />}>
              新建任务
            </Button>
          </Flex>
        }
        className="hover:shadow-md transition-shadow"
      >
        <div className="flex overflow-x-auto pb-4 gap-4">
          <div className="w-80 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <Text strong>待处理</Text>
              </div>
              <Badge count={tasks.backlog.length} size="small" />
            </div>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {tasks.backlog.map((task) => renderTaskCard(task, 'backlog'))}
            </div>
          </div>

          {/* 进行中 */}
          <div className="w-80 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                <Text strong>进行中</Text>
              </div>
              <Badge
                size="small"
                color="processing"
                count={tasks.inProgress.length}
              />
            </div>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {tasks.inProgress.map((task) =>
                renderTaskCard(task, 'inProgress')
              )}
            </div>
          </div>

          {/* 待审核 */}
          <div className="w-80 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <Text strong>待审核</Text>
              </div>
              <Badge
                count={tasks.inReview.length}
                size="small"
                color="warning"
              />
            </div>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {tasks.inReview.map((task) => renderTaskCard(task, 'inReview'))}
            </div>
          </div>

          {/* 已完成 */}
          <div className="w-80 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <Text strong>已完成</Text>
              </div>
              <Badge
                count={tasks.completed.length}
                size="small"
                color="success"
              />
            </div>
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {tasks.completed.map((task) => renderTaskCard(task, 'completed'))}
            </div>
          </div>
        </div>
      </Card>

      {/* 最近活动和燃尽图 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>项目最近活动</Title>
              <Text type="secondary" className="text-sm">
                查看全部
              </Text>
            </div>
            <List
              dataSource={activities}
              renderItem={(activity) => renderActivityItem(activity)}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>迭代任务燃尽图</Title>
              <Select
                defaultValue="12"
                size="small"
                options={[
                  { value: '12', label: '迭代 12' },
                  { value: '11', label: '迭代 11' },
                  { value: '10', label: '迭代 10' },
                ]}
              />
            </div>
            <div className="h-60">
              <Line {...burnDownConfig} />
            </div>
            <Text type="secondary" className="text-xs mt-4 block">
              <InfoOutlined className="mr-1" /> 迭代周期：6月15日 -
              6月28日，共14天
            </Text>
            <Text type="secondary" className="text-xs mt-1 block">
              <CheckCircleOutlined className="mr-1 text-green-500" />{' '}
              计划故事点：45点，已完成：32点 (71%)
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskManagement;
