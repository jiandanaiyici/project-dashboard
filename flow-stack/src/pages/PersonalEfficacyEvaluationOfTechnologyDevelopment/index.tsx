import { useState } from 'react';
import {
  Card,
  Statistic,
  Progress,
  Tag,
  Button,
  Typography,
  Row,
  Col,
} from 'antd';
import { Bar } from '@ant-design/charts';
import {
  CodeOutlined,
  ThunderboltOutlined,
  UserOutlined,
  DatabaseOutlined,
  ControlOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const PersonalEfficacyEvaluationOfTechnologyDevelopment = () => {
  const [activeDimension, setActiveDimension] = useState('codeQuality');

  const dimensions = [
    {
      id: 'codeQuality',
      name: '代码质量',
      icon: CodeOutlined,
      color: '#3B82F6',
    },
    {
      id: 'devEfficiency',
      name: '开发效率',
      icon: ThunderboltOutlined,
      color: '#10B981',
    },
    {
      id: 'collaboration',
      name: '协作效能',
      icon: UserOutlined,
      color: '#8B5CF6',
    },
    {
      id: 'learningGrowth',
      name: '学习成长',
      icon: DatabaseOutlined,
      color: '#F59E0B',
    },
    {
      id: 'processMaturity',
      name: '流程成熟度',
      icon: ControlOutlined,
      color: '#EF4444',
    },
  ];

  const metricsData: any = {
    codeQuality: [
      {
        name: '静态代码分析问题数',
        value: 3,
        threshold: 5,
        unit: '个/千行',
        description: '反映代码规范性和潜在风险',
      },
      {
        name: '测试覆盖率',
        value: 85,
        threshold: 80,
        unit: '%',
        description: '衡量代码被测试用例覆盖的程度',
      },
      {
        name: '缺陷逃逸率',
        value: 8,
        threshold: 10,
        unit: '%',
        description: '反映测试阶段的有效性',
      },
      {
        name: '技术债务指数',
        value: 24,
        threshold: 40,
        unit: '小时',
        description: '量化代码重构的紧急程度',
      },
      {
        name: '代码重复率',
        value: 3,
        threshold: 5,
        unit: '%',
        description: '反映代码复用性和维护成本',
      },
    ],
    devEfficiency: [
      {
        name: '任务周期时间',
        value: 18,
        threshold: 24,
        unit: '小时',
        description: '反映单个任务的处理效率',
      },
      {
        name: '专注时间占比',
        value: 65,
        threshold: 60,
        unit: '%',
        description: '衡量深度工作的占比',
      },
      {
        name: '上下文切换次数',
        value: 4,
        threshold: 5,
        unit: '次/天',
        description: '反映工作被打断的频率',
      },
      {
        name: '重构占比',
        value: 25,
        threshold: 20,
        unit: '%',
        description: '反映对代码质量的主动优化',
      },
      {
        name: '阻塞时间占比',
        value: 12,
        threshold: 15,
        unit: '%',
        description: '识别流程中的瓶颈',
      },
    ],
    collaboration: [
      {
        name: 'PR审查响应时长',
        value: 2.5,
        threshold: 4,
        unit: '小时',
        description: '反映团队协作的及时性',
      },
      {
        name: 'PR通过率',
        value: 85,
        threshold: 80,
        unit: '%',
        description: '反映代码提交前的自检质量',
      },
      {
        name: '文档完善度',
        value: 95,
        threshold: 90,
        unit: '%',
        description: '衡量知识传递的完整性',
      },
      {
        name: '跨团队协作频率',
        value: 4,
        threshold: 3,
        unit: '次/周',
        description: '反映跨角色协作的主动性',
      },
      {
        name: '结对编程时长',
        value: 15,
        threshold: 10,
        unit: '%',
        description: '反映知识共享和问题解决效率',
      },
    ],
    learningGrowth: [
      {
        name: '新技术使用占比',
        value: 18,
        threshold: 15,
        unit: '%',
        description: '反映技术栈更新的主动性',
      },
      {
        name: '技能拓展速度',
        value: 22,
        threshold: 30,
        unit: '天',
        description: '衡量学习能力和适应性',
      },
      {
        name: '技术分享次数',
        value: 2,
        threshold: 1,
        unit: '次/季度',
        description: '反映知识沉淀和输出能力',
      },
      {
        name: '问题解决自主性',
        value: 75,
        threshold: 70,
        unit: '%',
        description: '衡量技术深度和独立思考能力',
      },
    ],
    processMaturity: [
      {
        name: 'CI/CD流水线成功率',
        value: 97,
        threshold: 95,
        unit: '%',
        description: '反映自动化流程的稳定性',
      },
      {
        name: '自动化测试占比',
        value: 75,
        threshold: 70,
        unit: '%',
        description: '衡量测试效率的自动化水平',
      },
      {
        name: '部署自动化率',
        value: 92,
        threshold: 90,
        unit: '%',
        description: '反映发布流程的成熟度',
      },
      {
        name: '环境一致性问题数',
        value: 1,
        threshold: 2,
        unit: '次/月',
        description: '反映基础设施标准化程度',
      },
    ],
  };

  const getMetricStatus = (
    value: any,
    threshold: any,
    isLowerBetter = false
  ) => {
    if (isLowerBetter) {
      return value <= threshold ? 'good' : 'warning';
    }
    return value >= threshold ? 'good' : 'warning';
  };

  const MetricCard = ({
    metric,
    dimensionColor,
  }: {
    metric: any;
    dimensionColor: string;
  }) => {
    const isLowerBetter = [
      '静态代码分析问题数',
      '缺陷逃逸率',
      '代码重复率',
      '任务周期时间',
      '上下文切换次数',
      '阻塞时间占比',
      'PR审查响应时长',
      '环境一致性问题数',
    ].includes(metric.name);
    const status = getMetricStatus(
      metric.value,
      metric.threshold,
      isLowerBetter
    );

    const progressWidth = isLowerBetter
      ? Math.min(100, (metric.threshold / Math.max(metric.value, 1)) * 100)
      : Math.min(100, (metric.value / metric.threshold) * 100);

    return (
      <Card hoverable className="transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">
              {metric.name}
            </h3>
            <p className="text-gray-600 text-xs">{metric.description}</p>
          </div>
          <Tag color={status === 'good' ? 'green' : 'warning'}>
            {status === 'good' ? '达标' : '待改进'}
          </Tag>
        </div>
        <Statistic
          value={metric.value}
          suffix={metric.unit}
          precision={
            metric.unit.includes('%') || metric.unit.includes('小时') ? 1 : 0
          }
          valueStyle={{ fontSize: '24px' }}
        />
        <div className="mt-2 text-xs text-gray-500">
          目标: {metric.threshold}
          {metric.unit}
        </div>
        <Progress
          percent={progressWidth}
          status={status === 'good' ? 'active' : 'exception'}
          strokeColor={dimensionColor}
          showInfo={false}
          size="small"
          className="mt-3"
        />
      </Card>
    );
  };

  const OverviewChart = () => {
    const overviewData = dimensions.map((dim) => {
      const metrics: any = metricsData[dim.id];
      const goodMetrics = metrics.filter((m: any) => {
        const isLowerBetter = [
          '静态代码分析问题数',
          '缺陷逃逸率',
          '代码重复率',
          '任务周期时间',
          '上下文切换次数',
          '阻塞时间占比',
          'PR审查响应时长',
          '环境一致性问题数',
        ].includes(m.name);
        return getMetricStatus(m.value, m.threshold, isLowerBetter) === 'good';
      });
      return {
        name: dim.name,
        value: Math.round((goodMetrics.length / metrics.length) * 100),
        color: dim.color,
      };
    });

    const config = {
      data: overviewData,
      xField: 'value',
      yField: 'name',
      label: {
        position: 'middle-right',
        formatter: (datum: any) => `${datum.value}%`,
      },
      tooltip: {
        formatter: (datum: any) => {
          return {
            name: '达标率',
            value: `${datum.value}%`,
          };
        },
      },
      color: (datum: any) => datum.color,
      barStyle: {
        radius: [0, 4, 4, 0],
      },
    };

    return (
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <WarningOutlined className="w-5 h-5" />
          综合效能概览
        </h3>
        <div style={{ height: 300 }}>
          <Bar {...config} />
        </div>
      </Card>
    );
  };

  const RecommendationCard = () => {
    const recommendations = [
      '根据角色选择核心指标，避免指标过载',
      '结合趋势分析，观察周/月变化趋势',
      '平衡量化指标与质性反馈',
      '关注指标间的关联性，避免单一维度优化',
    ];

    return (
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <ExclamationCircleOutlined className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">指标应用建议</h3>
        </div>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="text-blue-800 text-sm flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </Card>
    );
  };

  const currentDimension: any = dimensions.find(
    (d) => d.id === activeDimension
  );
  const currentMetrics: any = metricsData[activeDimension];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <CodeOutlined className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                技术开发个人效能评估
              </h1>
              <p className="text-gray-600">
                超越基础指标，全面评估开发者综合效能
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {dimensions.map((dimension) => {
            const Icon = dimension.icon;
            return (
              <Button
                key={dimension.id}
                onClick={() => setActiveDimension(dimension.id)}
                icon={<Icon />}
                type={activeDimension === dimension.id ? 'primary' : 'default'}
                style={
                  activeDimension === dimension.id
                    ? {
                        backgroundColor: dimension.color,
                        borderColor: dimension.color,
                      }
                    : {}
                }
              >
                {dimension.name}
              </Button>
            );
          })}
        </div>

        {/* Current Dimension Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: currentDimension.color + '20' }}
            >
              <currentDimension.icon
                className="w-4 h-4"
                style={{ color: currentDimension.color }}
              />
            </div>
            <Title level={4}>{currentDimension.name}</Title>
          </div>
          <Paragraph>
            {activeDimension === 'codeQuality' &&
              '聚焦代码的可维护性、稳定性和健壮性，避免“数量优先”导致的质量隐患'}
            {activeDimension === 'devEfficiency' &&
              '关注开发过程的流畅度和任务交付速度，而非单纯的“工时堆积”'}
            {activeDimension === 'collaboration' &&
              '评估开发者在团队中的协作质量和沟通效率'}
            {activeDimension === 'learningGrowth' &&
              '衡量开发者的技术迭代和能力拓展，避免陷入“重复劳动”'}
            {activeDimension === 'processMaturity' &&
              '反映开发流程的自动化水平和规范化程度'}
          </Paragraph>
        </div>

        {/* Metrics Grid */}
        <Row gutter={[16, 16]} className="mb-8">
          {currentMetrics.map((metric: any, index: any) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <MetricCard
                metric={metric}
                dimensionColor={currentDimension.color}
              />
            </Col>
          ))}
        </Row>

        {/* Overview and Recommendations */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <OverviewChart />
          </Col>
          <Col xs={24} lg={8}>
            <RecommendationCard />
          </Col>
        </Row>

        {/* Legend */}
        <Card className="mt-8">
          <h4 className="font-medium text-gray-900 mb-3">指标状态说明</h4>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text>达标：指标表现良好</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <Text>待改进：指标未达预期</Text>
            </div>
            <Text type="secondary">
              <Text strong>注意：</Text>
              部分指标数值越低越好（如问题数、周期时间等）
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalEfficacyEvaluationOfTechnologyDevelopment;
