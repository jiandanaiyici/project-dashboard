import React, { useState, useEffect } from 'react';
import {
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoOutlined,
} from '@ant-design/icons';
import { Line, Radar } from '@ant-design/charts';
import {
  Typography,
  Row,
  Col,
  Card,
  Badge,
  Statistic,
  Progress,
  Select,
  Timeline,
  List,
  Avatar,
  Flex,
} from 'antd';
import {
  healthConfig,
  milestones,
  progressTrendData,
  projectOverviewData,
  teamLoadData,
} from '@/mock';

const { Title, Text } = Typography;

/** 项目概览 */
const Overview = () => {
  const [longFormatData, setLongFormatData] = useState<any[]>([]);

  useEffect(() => {
    const formattedData: any[] = [];
    progressTrendData.forEach((item) => {
      formattedData.push({
        week: item.week,
        type: '计划',
        value: item.planned,
      });
      formattedData.push({
        week: item.week,
        type: '实际',
        value: item.actual,
      });
    });
    setLongFormatData(formattedData);
  }, []);

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">项目进度</Text>
              <Badge status="processing" />
            </div>
            <Statistic
              suffix="%"
              precision={0}
              value={projectOverviewData.progress}
              valueStyle={{ fontSize: '24px' }}
            />
            <Progress
              size="small"
              status="active"
              className="mt-2"
              percent={projectOverviewData.progress}
            />
            <Text type="secondary" className="text-xs mt-2 block">
              计划：{projectOverviewData.deadline}完成 · 剩余
              {projectOverviewData.remainingDays}天
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">未完成任务</Text>
              <Badge status="warning" />
            </div>
            <Statistic
              value={projectOverviewData.unfinishedTasks}
              valueStyle={{ fontSize: '24px' }}
            />
            <Text type="warning" className="text-xs mt-2 flex items-center">
              <ExclamationCircleOutlined className="mr-1" />{' '}
              {projectOverviewData.overdueTasks}项任务已逾期
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              分类：功能开发14项 · 缺陷修复10项
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">项目风险</Text>
              <Badge status="error" />
            </div>
            <Statistic
              value={projectOverviewData.risks}
              valueStyle={{ fontSize: '24px' }}
              suffix="个"
            />
            <Text type="danger" className="text-xs mt-2 flex items-center">
              <ArrowUpOutlined className="mr-1" /> 较上周新增
              {projectOverviewData.newRisks}个高风险
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              分布：高1 · 中1 · 低1
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">已完成里程碑</Text>
              <Badge status="success" />
            </div>
            <Statistic
              value={`${projectOverviewData.completedMilestones}/${projectOverviewData.totalMilestones}`}
              valueStyle={{ fontSize: '24px' }}
            />
            <Progress
              percent={
                (projectOverviewData.completedMilestones /
                  projectOverviewData.totalMilestones) *
                100
              }
              size="small"
              status="success"
              className="mt-2"
            />
            <Text type="secondary" className="text-xs mt-2 block">
              下一里程碑：{projectOverviewData.nextMilestone}
            </Text>
          </Card>
        </Col>
      </Row>
      {/* 项目进度趋势和里程碑 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="hover:shadow-md transition-shadow">
            <Flex align="center" justify="space-between" className="mb-4">
              <Title level={5}>项目进度趋势</Title>
              <Select
                defaultValue="week"
                size="small"
                options={[
                  { value: 'week', label: '按周' },
                  { value: 'month', label: '按月' },
                  { value: 'sprint', label: '按迭代' },
                ]}
              />
            </Flex>
            <div className="h-80">
              <Line
                data={longFormatData}
                xField="week"
                yField="value"
                seriesField="type"
                legend={{
                  position: 'top',
                }}
                yAxis={{
                  title: {
                    text: '项目进度 (%)',
                  },
                  label: {
                    formatter: (text: string) => `${text}%`,
                  },
                }}
                point={{
                  size: 5,
                  shape: 'diamond',
                }}
                color={['#1890ff', '#52c41a']}
                tooltip={{
                  formatter: (datum: any) => {
                    return {
                      name: datum.type,
                      value: `${datum.value}%`,
                    };
                  },
                }}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <Flex align="center" justify="space-between" className="mb-4">
              <Title level={5}>项目里程碑</Title>
              <Text type="secondary" className="text-sm">
                查看全部
              </Text>
            </Flex>
            <Timeline
              mode="left"
              items={milestones.map((milestone, index) => ({
                key: index,
                dot:
                  milestone.status === 'completed' ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : milestone.status === 'in-progress' ? (
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  ) : (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#d9d9d9',
                      }}
                    />
                  ),
                children: (
                  <>
                    <Title level={5}>{milestone.title}</Title>
                    <Text type="secondary" className="text-xs block">
                      计划：{milestone.planned}{' '}
                      {milestone.actual && `· 实际：${milestone.actual}`}
                    </Text>
                    <Text type="secondary" className="text-xs mt-1 block">
                      {milestone.description}
                    </Text>
                  </>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 项目健康状态和团队负荷 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>项目健康状态</Title>
              <Text className="text-sm">详情分析</Text>
            </div>
            <div className="h-80">
              <Radar
                {...healthConfig}
                tooltip={{
                  formatter: (datum: any) => {
                    return {
                      name: datum.name,
                      value: datum.value,
                    };
                  },
                }}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>进度健康度</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>质量健康度</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>资源健康度</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>风险健康度</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="团队负荷情况"
            className="hover:shadow-md transition-shadow"
            extra={
              <Select
                defaultValue="current"
                size="small"
                options={[
                  { value: 'current', label: '当前迭代' },
                  { value: 'next', label: '下一迭代' },
                  { value: 'month', label: '本月' },
                ]}
              />
            }
          >
            <List
              dataSource={teamLoadData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <div className="flex justify-between w-full">
                        <span>{item.name}</span>
                        <span
                          style={{
                            color:
                              item.load > 100
                                ? '#f5222d'
                                : item.load > 80
                                  ? '#faad14'
                                  : '#52c41a',
                          }}
                        >
                          {item.load}%
                        </span>
                      </div>
                    }
                    description={
                      <div>
                        <Progress
                          percent={item.load}
                          size="small"
                          status={
                            item.load > 100
                              ? 'exception'
                              : item.load > 80
                                ? 'active'
                                : 'success'
                          }
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <Text type="secondary" className="text-xs mt-4 block">
              <InfoOutlined className="mr-1" />{' '}
              团队平均负荷：85%，2名成员负荷过高
            </Text>
            <Text className="text-xs mt-1 block">平衡资源负荷</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
