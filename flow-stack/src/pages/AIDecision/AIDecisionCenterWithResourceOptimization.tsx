import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Select,
  Button,
  Typography,
  Badge,
  Avatar,
  List,
  Spin,
  Slider,
  Switch,
  TableColumnsType,
} from 'antd';
import {
  WarningOutlined,
  ArrowUpOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Line, Bar, Sankey } from '@ant-design/plots';
import { useResourceAllocation, useOptimizationResult } from './hooks';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AIDecisionCenterWithResourceOptimization = ({
  projectId,
}: {
  projectId: string;
}) => {
  const [optimizationParams, setOptimizationParams] = useState({
    efficiencyWeight: 70, // 效率权重
    balanceWeight: 30, // 均衡权重
    minimizeChanges: true, // 最小化变更
  });

  const [allocationData, loading] = useResourceAllocation({ projectId });
  const [optimizationResult, optimizationLoading, mutate] =
    useOptimizationResult({ projectId });

  // 处理参数变更
  const handleParamChange = (param: string, value: number | boolean) => {
    setOptimizationParams({
      ...optimizationParams,
      [param]: value,
    });
  };

  // 渲染资源效率概览卡片
  const renderEfficiencyOverview = () => {
    if (!allocationData) return null;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Text type="secondary" className="block">
              资源整体效率评分
            </Text>
            <Statistic
              value={allocationData.overallEfficiencyScore}
              valueStyle={{ fontSize: '24px' }}
              suffix="/100"
            />
            <Progress
              percent={allocationData.overallEfficiencyScore}
              size="small"
              status={
                allocationData.overallEfficiencyScore > 80
                  ? 'success'
                  : allocationData.overallEfficiencyScore > 60
                    ? 'active'
                    : 'exception'
              }
              className="mt-2"
            />
            <Text
              // @ts-ignore
              type={
                allocationData.overallEfficiencyScore > 80
                  ? 'success'
                  : allocationData.overallEfficiencyScore > 60
                    ? 'warning'
                    : 'error'
              }
              className="text-xs mt-2 block"
            >
              {allocationData.overallEfficiencyScore > 80
                ? '优秀'
                : allocationData.overallEfficiencyScore > 60
                  ? '一般'
                  : '较差'}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Text type="secondary" className="block">
              资源利用率
            </Text>
            <Statistic
              value={allocationData.resourceUtilization}
              valueStyle={{ fontSize: '24px' }}
              suffix="%"
            />
            <Progress
              percent={allocationData.resourceUtilization}
              size="small"
              status={
                allocationData.resourceUtilization > 90
                  ? 'exception'
                  : allocationData.resourceUtilization > 70
                    ? 'success'
                    : 'active'
              }
              className="mt-2"
            />
            <Text
              // @ts-ignore
              type={
                allocationData.resourceUtilization > 90
                  ? 'error'
                  : allocationData.resourceUtilization > 70
                    ? 'success'
                    : 'warning'
              }
              className="text-xs mt-2 block"
            >
              {allocationData.resourceUtilization > 90
                ? '过高'
                : allocationData.resourceUtilization > 70
                  ? '理想'
                  : '偏低'}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Text type="secondary" className="block">
              分配均衡度
            </Text>
            <Statistic
              value={allocationData.allocationBalance}
              valueStyle={{ fontSize: '24px' }}
              suffix="/100"
            />
            <Progress
              percent={allocationData.allocationBalance}
              size="small"
              status={
                allocationData.allocationBalance > 80
                  ? 'success'
                  : allocationData.allocationBalance > 60
                    ? 'active'
                    : 'exception'
              }
              className="mt-2"
            />
            <Text
              // @ts-ignore
              type={
                allocationData.allocationBalance > 80
                  ? 'success'
                  : allocationData.allocationBalance > 60
                    ? 'warning'
                    : 'error'
              }
              className="text-xs mt-2 block"
            >
              {allocationData.allocationBalance > 80
                ? '均衡'
                : allocationData.allocationBalance > 60
                  ? '一般'
                  : '不均衡'}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="hover:shadow-md transition-shadow">
            <Text type="secondary" className="block">
              资源负荷问题
            </Text>
            <div className="flex items-center mt-2">
              <div className="flex-1">
                <div className="flex items-center">
                  <WarningOutlined
                    style={{ color: '#f5222d', marginRight: 4 }}
                  />
                  <Text>负荷过高</Text>
                </div>
                <Statistic
                  value={allocationData.overloadedMembers}
                  valueStyle={{ fontSize: '24px', color: '#f5222d' }}
                  suffix="人"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <ClockCircleOutlined
                    style={{ color: '#faad14', marginRight: 4 }}
                  />
                  <Text>利用不足</Text>
                </div>
                <Statistic
                  value={allocationData.underutilizedMembers}
                  valueStyle={{ fontSize: '24px', color: '#faad14' }}
                  suffix="人"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染成员负荷情况
  const renderMemberLoad = () => {
    if (!allocationData) return null;

    const columns: TableColumnsType<any> = [
      {
        title: '成员',
        key: 'name',
        render: (_, record) => (
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
        title: '当前负荷',
        key: 'load',
        render: (_, record) => (
          <div>
            <div className="flex justify-between mb-1">
              <Text className="text-xs">
                {record.load}% / {record.capacity}%
              </Text>
              <Badge
                status={
                  record.load > record.capacity
                    ? 'error'
                    : record.load > record.capacity * 0.8
                      ? 'warning'
                      : 'success'
                }
              />
            </div>
            <Progress
              percent={record.load}
              size="small"
              status={
                record.load > record.capacity
                  ? 'exception'
                  : record.load > record.capacity * 0.8
                    ? 'active'
                    : 'success'
              }
            />
          </div>
        ),
      },
      {
        title: '状态',
        key: 'status',
        render: (_, record) => {
          if (record.load > record.capacity) {
            return <Tag color="error">负荷过高</Tag>;
          } else if (record.load < record.capacity * 0.5) {
            return <Tag color="warning">利用不足</Tag>;
          } else {
            return <Tag color="success">正常</Tag>;
          }
        },
      },
      {
        title: '分配任务',
        key: 'tasks',
        render: (_, record) => {
          const taskCounts = {
            M001: 8,
            M002: 6,
            M003: 5,
            M004: 7,
            M005: 4,
          };
          // @ts-ignore
          return `${taskCounts[record.id]} 项`;
        },
      },
      {
        title: '主要技能',
        key: 'skills',
        render: (_, record) => {
          const skills: Record<string, string[]> = {
            M001: ['Java', 'Spring', 'MySQL'],
            M002: ['测试设计', '自动化测试', '性能测试'],
            M003: ['React', 'Vue', 'JavaScript'],
            M004: ['系统架构', '微服务', '中间件'],
            M005: ['项目管理', '需求分析', '沟通协调'],
          };
          return (
            <div className="flex flex-wrap gap-1">
              {skills[record.id].map((skill, index) => (
                <Tag key={index} color="blue">
                  {skill}
                </Tag>
              ))}
            </div>
          );
        },
      },
    ];

    return (
      <Card
        title="团队成员负荷情况"
        extra={
          <Select
            defaultValue="current"
            size="small"
            options={[
              { value: 'current', label: '当前状态' },
              { value: 'forecast', label: '未来预测' },
            ]}
          />
        }
        className="hover:shadow-md transition-shadow"
      >
        <Table
          rowKey="id"
          columns={columns}
          pagination={false}
          dataSource={allocationData.memberLoad}
        />
      </Card>
    );
  };

  // 渲染资源分配趋势和分布
  const renderResourceTrends = () => {
    if (!allocationData) return null;

    // 资源负荷趋势图配置
    const trendConfig = {
      data: allocationData.loadTrend,
      xField: 'week',
      yField: ['averageLoad', 'maxLoad'],
      point: {
        size: 5,
        shape: 'diamond',
      },
      label: false,
      legend: {
        position: 'top',
      },
      yAxis: {
        title: {
          text: '负荷率 (%)',
        },
        formatter: (value: any) => `${value}%`,
      },
    };

    // 角色分布图表配置
    const roleConfig = {
      data: allocationData.roleDistribution,
      xField: 'role',
      yField: ['allocated', 'capacity'],
      legend: {
        position: 'top',
      },
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      yAxis: {
        title: {
          text: '资源占比 (%)',
        },
        formatter: (value: any) => `${value}%`,
      },
    };

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="资源负荷趋势"
            className="hover:shadow-md transition-shadow"
            extra={
              <Select defaultValue="weekly" size="small">
                <Option value="weekly">按周</Option>
                <Option value="monthly">按月</Option>
              </Select>
            }
          >
            <div className="h-72">
              <Line {...trendConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="资源按角色分布"
            className="hover:shadow-md transition-shadow"
            extra={
              <Text type="secondary" className="text-sm">
                查看详情
              </Text>
            }
          >
            <div className="h-72">
              <Bar {...roleConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染资源分配问题
  const renderAllocationIssues = () => {
    if (!allocationData) return null;

    return (
      <Card
        title="资源分配问题分析"
        className="hover:shadow-md transition-shadow"
      >
        <List
          dataSource={allocationData.allocationIssues}
          renderItem={(issue, index) => (
            <List.Item
              key={index}
              className={`p-4 ${
                issue.severity === '高'
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : issue.severity === '中'
                    ? 'bg-orange-50 border-l-4 border-orange-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <List.Item.Meta
                avatar={
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      issue.severity === '高'
                        ? 'bg-red-100 text-red-500'
                        : issue.severity === '中'
                          ? 'bg-orange-100 text-orange-500'
                          : 'bg-blue-100 text-blue-500'
                    }`}
                  >
                    <WarningOutlined />
                  </div>
                }
                title={
                  <div className="flex justify-between">
                    <Text strong>{issue.issue}</Text>
                    <Tag
                      color={
                        issue.severity === '高'
                          ? 'red'
                          : issue.severity === '中'
                            ? 'orange'
                            : 'blue'
                      }
                    >
                      {issue.severity}严重
                    </Tag>
                  </div>
                }
                description={
                  <div className="mt-2">
                    <Text type="secondary" className="block mb-2">
                      影响: {issue.impact}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {issue.affectedMembers
                        ? `受影响成员: ${issue.affectedMembers.join(', ')}`
                        : issue.affectedArea
                          ? `受影响区域: ${issue.affectedArea}`
                          : `当前比例: ${issue.currentRatio}`}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  // 渲染优化参数设置
  const renderOptimizationSettings = () => (
    <Card className="hover:shadow-md transition-shadow">
      <Title level={5} className="mb-4">
        资源优化参数设置
      </Title>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <Text>优化目标权重</Text>
            <Text type="secondary">
              {optimizationParams.efficiencyWeight}% 效率,{' '}
              {optimizationParams.balanceWeight}% 均衡
            </Text>
          </div>
          <Slider
            range
            defaultValue={[optimizationParams.efficiencyWeight, 100]}
            max={100}
            tooltip={{ open: false }}
            onChangeComplete={(values) => {
              handleParamChange('efficiencyWeight', values[0]);
              handleParamChange('balanceWeight', 100 - values[0]);
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>优先均衡</span>
            <span>优先效率</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Text>最小化变更</Text>
            <Text type="secondary" className="text-xs block">
              减少团队调整成本
            </Text>
          </div>
          <Switch
            checked={optimizationParams.minimizeChanges}
            onChange={(checked) =>
              handleParamChange('minimizeChanges', checked)
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Text>考虑技能匹配度</Text>
            <Text type="secondary" className="text-xs block">
              基于成员技能分配任务
            </Text>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Text>考虑成员负载历史</Text>
            <Text type="secondary" className="text-xs block">
              基于历史表现分配任务
            </Text>
          </div>
          <Switch defaultChecked />
        </div>

        <Button
          size="large"
          type="primary"
          onClick={() => mutate()}
          className="w-full"
          loading={optimizationLoading}
        >
          生成AI资源优化方案
        </Button>
      </div>
    </Card>
  );

  // 渲染优化结果概览
  const renderOptimizationOverview = () => {
    if (!optimizationResult) return null;

    const original = allocationData;
    const optimized = optimizationResult.optimizationImpact;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <Title level={5} className="mb-4">
          资源优化效果对比
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <Text type="secondary" className="block">
                资源整体效率评分
              </Text>
              <div className="flex items-center justify-center mt-2">
                <Text className="text-2xl font-bold">
                  {original?.overallEfficiencyScore}
                </Text>
                <ArrowRightOutlined className="mx-2 text-gray-400" />
                <Text className="text-2xl font-bold text-green-500">
                  {optimized.overallEfficiencyScore}
                </Text>
              </div>
              <Text
                type="success"
                className="text-xs mt-1 flex items-center justify-center"
              >
                <ArrowUpOutlined className="mr-1" /> 提升{' '}
                {optimized.overallEfficiencyScore -
                  (original?.overallEfficiencyScore || 0)}{' '}
                分
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <Text type="secondary" className="block">
                资源利用率
              </Text>
              <div className="flex items-center justify-center mt-2">
                <Text className="text-2xl font-bold">
                  {original?.resourceUtilization || 0}%
                </Text>
                <ArrowRightOutlined className="mx-2 text-gray-400" />
                <Text className="text-2xl font-bold text-green-500">
                  {optimized?.resourceUtilization || 0}%
                </Text>
              </div>
              <Text
                type="success"
                className="text-xs mt-1 flex items-center justify-center"
              >
                <ArrowUpOutlined className="mr-1" /> 提升{' '}
                {optimized?.resourceUtilization -
                  (original?.resourceUtilization || 0)}%
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <Text type="secondary" className="block">
                分配均衡度
              </Text>
              <div className="flex items-center justify-center mt-2">
                <Text className="text-2xl font-bold">
                  {original?.allocationBalance || 0}
                </Text>
                <ArrowRightOutlined className="mx-2 text-gray-400" />
                <Text className="text-2xl font-bold text-green-500">
                  {optimized?.allocationBalance || 0}
                </Text>
              </div>
              <Text
                type="success"
                className="text-xs mt-1 flex items-center justify-center"
              >
                <ArrowUpOutlined className="mr-1" /> 提升{' '}
                {optimized?.allocationBalance -
                  (original?.allocationBalance || 0)}{' '}
                分
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="text-center">
              <Text type="secondary" className="block">
                预期进度提升
              </Text>
              <Text className="text-2xl font-bold text-green-500 mt-2">
                {optimized.expectedProgressImprovement}
              </Text>
              <div className="flex items-center justify-center mt-1">
                <Text type="success" className="text-xs">
                  <CheckCircleOutlined className="mr-1" /> 解决所有负荷过高问题
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染优化后的资源分配
  const renderOptimizedAllocation = () => {
    if (!optimizationResult) return null;

    const columns: TableColumnsType<any> = [
      {
        title: '成员',
        key: 'name',
        render: (_, record) => {
          const originalMember = allocationData?.memberLoad.find(
            (m) => m.id === record.id
          );
          return (
            <div className="flex items-center">
              <Avatar src={originalMember?.avatar} className="mr-3" />
              <div>
                <div>{record.name}</div>
                <div className="text-xs text-gray-500">
                  {originalMember?.role}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        title: '当前负荷',
        key: 'currentLoad',
        render: (_, record) => (
          <div>
            <Text className="text-sm">{record.currentLoad}%</Text>
            <Progress
              percent={record.currentLoad}
              size="small"
              status={
                record.currentLoad > 100
                  ? 'exception'
                  : record.currentLoad > 80
                    ? 'active'
                    : 'success'
              }
              className="mt-1"
            />
          </div>
        ),
      },
      {
        title: '优化后负荷',
        key: 'optimizedLoad',
        render: (_, record) => (
          <div>
            <div className="flex items-center justify-between">
              <Text className="text-sm">{record.optimizedLoad}%</Text>
              <Badge
                status={
                  record.optimizedLoad > 100
                    ? 'error'
                    : record.optimizedLoad > 80
                      ? 'warning'
                      : 'success'
                }
                text={
                  record.change > 0 ? (
                    <span className="text-red-500">+{record.change}%</span>
                  ) : record.change < 0 ? (
                    <span className="text-green-500">{record.change}%</span>
                  ) : (
                    '-'
                  )
                }
              />
            </div>
            <Progress
              percent={record.optimizedLoad}
              size="small"
              status={
                record.optimizedLoad > 100
                  ? 'exception'
                  : record.optimizedLoad > 80
                    ? 'active'
                    : 'success'
              }
              className="mt-1"
            />
          </div>
        ),
      },
      {
        title: '优化措施',
        key: 'actions',
        render: (_, record) => {
          const actionMap: Record<string, string> = {
            M001: '转移2项任务给陈开发',
            M002: '保持不变',
            M003: '接收2项来自李工程师的任务',
            M004: '转移部分架构任务给李工程师',
            M005: '增加少量协调工作',
          };
          return (
            <Text type="secondary" className="text-sm">
              {actionMap[record.id] || '-'}
            </Text>
          );
        },
      },
    ];

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <Title level={5} className="mb-0">
            优化后的资源分配方案
          </Title>
          <Button size="small" icon={<DownloadOutlined />}>
            导出方案
          </Button>
        </div>
        <Table
          dataSource={optimizationResult.optimizedAllocation}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    );
  };

  // 渲染资源优化建议和任务调整
  const renderOptimizationDetails = () => {
    if (!optimizationResult) return null;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <Title level={5} className="mb-4">
              资源负荷优化建议
            </Title>
            <List
              dataSource={optimizationResult.loadOptimization}
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <List.Item.Meta
                    avatar={
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <SwapOutlined />
                      </div>
                    }
                    title={
                      <div className="flex justify-between">
                        <Text strong>{item.action}</Text>
                        <Badge
                          text={`效益评分: ${item.benefitScore}`}
                          color={
                            item.benefitScore > 80
                              ? 'success'
                              : item.benefitScore > 60
                                ? 'processing'
                                : 'default'
                          }
                        />
                      </div>
                    }
                    description={
                      <div className="mt-2">
                        <Text type="secondary" className="block mb-2">
                          {item.details}
                        </Text>
                        <Text type="secondary" className="text-sm block mb-2">
                          受影响成员: {item.affectedMembers.join(', ')}
                        </Text>
                        <Text type="secondary" className="text-sm block mb-2">
                          预期影响: {item.expectedImpact}
                        </Text>
                        <div className="flex items-center">
                          <Text type="secondary" className="text-xs mr-2">
                            实施难度:
                          </Text>
                          <Tag
                            color={
                              item.implementationEffort === '低'
                                ? 'success'
                                : item.implementationEffort === '中'
                                  ? 'processing'
                                  : 'warning'
                            }
                          >
                            {item.implementationEffort}
                          </Tag>
                        </div>
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
            <Title level={5} className="mb-4">
              任务排期优化建议
            </Title>
            <List
              dataSource={optimizationResult.scheduleOptimization}
              renderItem={(item, index) => (
                <List.Item
                  key={index}
                  className="border-b last:border-0 pb-4 last:pb-0"
                >
                  <List.Item.Meta
                    avatar={
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        {/* <EqualizerOutlined /> */}
                      </div>
                    }
                    title={
                      <div>
                        <Text strong>{item.task}</Text>
                        {item.expectedDurationReduction && (
                          <Badge
                            className="ml-2"
                            text={`缩短 ${item.expectedDurationReduction}`}
                            color="success"
                          />
                        )}
                      </div>
                    }
                    description={
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <Text type="secondary">当前负责人:</Text>
                          <Text>{item.currentOwner}</Text>
                        </div>
                        <div className="flex justify-between text-sm">
                          <Text type="secondary">建议负责人:</Text>
                          <Text type="secondary">{item.proposedOwner}</Text>
                        </div>
                        <div className="flex justify-between text-sm">
                          <Text type="secondary">调整原因:</Text>
                          <Text>{item.reason}</Text>
                        </div>
                        {item.expectedStartDelay && (
                          <div className="flex justify-between text-sm">
                            <Text type="secondary">建议延期开始:</Text>
                            <Text type="warning">
                              {item.expectedStartDelay}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染资源分配流程图
  const renderResourceFlow = () => {
    if (!optimizationResult) return null;

    const config = {
      data: optimizationResult.resourceFlowData,
      sourceField: 'source',
      targetField: 'target',
      weightField: 'value',
      nodeStyle: {
        fill: '#1890ff',
      },
      label: {
        formatter: (datum: any) => datum.name,
      },
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <Title level={5} className="mb-0">
            资源分配流向图
          </Title>
          <Text type="secondary" className="text-xs">
            显示优化后的任务分配关系
          </Text>
        </div>
        <div className="h-80">
          <Sankey {...config} />
        </div>
      </Card>
    );
  };

  // 自定义箭头图标组件
  const ArrowRightOutlined = () => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-13.3 5.9-13.3 13.3v77.3c0 4.4 1.8 8.5 4.9 11.7l350.2 304H152c-7.4 0-13.3 5.9-13.3 13.3v77.3c0 7.4 5.9 13.3 13.3 13.3h583.5c19.4 0 35.8-14.8 35.8-34.2V521.8c0-19.4-16.4-34-35.8-34z" />
    </svg>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="mb-0">
          资源优化
        </Title>
        <div className="flex gap-2">
          <Button size="small" icon={<DownloadOutlined />}>
            导出报告
          </Button>
          <Button type="primary" size="small">
            生成决策建议
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <Card className="h-64 flex items-center justify-center">
            <Spin size="large" />
          </Card>
        ) : (
          renderEfficiencyOverview()
        )}

        {loading ? (
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card className="h-80 flex items-center justify-center">
                <Spin size="large" />
              </Card>
            </Col>
          </Row>
        ) : (
          renderMemberLoad()
        )}

        {loading ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card className="h-80 flex items-center justify-center">
                <Spin size="large" />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="h-80 flex items-center justify-center">
                <Spin size="large" />
              </Card>
            </Col>
          </Row>
        ) : (
          renderResourceTrends()
        )}

        {loading ? (
          <Card className="h-64 flex items-center justify-center">
            <Spin size="large" />
          </Card>
        ) : (
          renderAllocationIssues()
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={6}>
            {renderOptimizationSettings()}
          </Col>
          <Col xs={24} lg={18}>
            {optimizationLoading ? (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Spin size="large" />
                  <Text type="secondary" className="mt-4 block">
                    AI正在分析资源数据并生成优化方案...
                  </Text>
                </div>
              </Card>
            ) : optimizationResult ? (
              <>
                {renderOptimizationOverview()}
                {renderResourceFlow()}
              </>
            ) : (
              <Card className="h-full flex items-center justify-center bg-blue-50 border-blue-200">
                <div className="text-center max-w-md">
                  {/* <ZapOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} /> */}
                  <Title level={4} className="text-blue-800">
                    获取AI资源优化方案
                  </Title>
                  <Paragraph className="text-sm text-blue-700 mb-4">
                    点击左侧按钮生成AI驱动的资源优化方案，平衡团队负荷，提高工作效率
                  </Paragraph>
                  <Button
                    type="primary"
                    // icon={<ZapOutlined />}
                    onClick={() => mutate()}
                  >
                    立即生成优化方案
                  </Button>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        {optimizationResult && renderOptimizedAllocation()}
        {optimizationResult && renderOptimizationDetails()}

        {optimizationResult && (
          <Card className="hover:shadow-md transition-shadow flex flex-col items-center justify-center p-6 border-dashed">
            <div className="text-center">
              <Title level={5} className="mb-4">
                实施资源优化方案
              </Title>
              <Paragraph className="text-sm text-gray-500 mb-6 max-w-2xl">
                确认优化方案后，系统将自动调整任务分配并通知相关团队成员。
                您可以选择分批实施或一次性实施全部优化建议。
              </Paragraph>
              <div className="flex gap-4">
                <Button size="large">分批实施</Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                >
                  立即实施全部方案
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIDecisionCenterWithResourceOptimization;
