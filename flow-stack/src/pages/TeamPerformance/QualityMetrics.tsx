import React from 'react';
import { Line, Pie } from '@ant-design/charts';
import { Avatar, Button, Flex, Select, Table, Tag } from 'antd';
import type { LineConfig, PieConfig } from '@ant-design/charts';

const { Option } = Select;

// 直接在组件内定义缺陷数据
const defectData = [
  {
    key: '1',
    defectId: 'BUG-2856',
    title: '大额支付偶发超时问题',
    module: '支付核心模块',
    severity: 'P0',
    environment: '生产环境',
    status: '已修复',
    discoveryTime: '6月20日',
    assignee: '李工程师',
    assigneeAvatar: 'https://picsum.photos/id/1012/200/200'
  },
  {
    key: '2',
    defectId: 'BUG-2842',
    title: 'iOS端支付结果页显示异常',
    module: '前端展示模块',
    severity: 'P1',
    environment: '预发布环境',
    status: '修复中',
    discoveryTime: '6月19日',
    assignee: '陈开发',
    assigneeAvatar: 'https://picsum.photos/id/1066/200/200'
  },
  {
    key: '3',
    defectId: 'BUG-2837',
    title: '退款接口并发处理异常',
    module: '退款模块',
    severity: 'P1',
    environment: '测试环境',
    status: '已修复',
    discoveryTime: '6月18日',
    assignee: '李工程师',
    assigneeAvatar: 'https://picsum.photos/id/1012/200/200'
  },
  {
    key: '4',
    defectId: 'BUG-2829',
    title: '支付记录查询超时',
    module: '查询模块',
    severity: 'P1',
    environment: '生产环境',
    status: '已修复',
    discoveryTime: '6月17日',
    assignee: '赵架构',
    assigneeAvatar: 'https://picsum.photos/id/1025/200/200'
  }
];

const QualityMetrics = () => {
  // 缺陷率趋势数据
  const defectRateData = [
    {
      iteration: '迭代8',
      production: 2.1,
      preRelease: 3.5,
      test: 6.2,
      development: 8.5,
    },
    {
      iteration: '迭代9',
      production: 2.5,
      preRelease: 3.8,
      test: 6.5,
      development: 8.2,
    },
    {
      iteration: '迭代10',
      production: 2.8,
      preRelease: 3.6,
      test: 5.8,
      development: 7.9,
    },
    {
      iteration: '迭代11',
      production: 3.2,
      preRelease: 4.0,
      test: 6.0,
      development: 8.1,
    },
    {
      iteration: '迭代12',
      production: 3.8,
      preRelease: 4.5,
      test: 6.3,
      development: 7.8,
    },
  ];

  // 缺陷严重程度分布数据
  const defectSeverityData = [
    { type: 'P0', value: 5 },
    { type: 'P1', value: 12 },
    { type: 'P2', value: 18 },
    { type: 'P3', value: 25 },
  ];

  // 缺陷模块分布数据
  const defectModuleData = [
    { type: '支付核心模块', value: 15 },
    { type: '前端展示模块', value: 12 },
    { type: '退款模块', value: 8 },
    { type: '查询模块', value: 6 },
    { type: '用户管理模块', value: 9 },
  ];

  // 测试覆盖率趋势数据
  const testCoverageData = [
    { iteration: '迭代8', coverage: 72, automation: 65 },
    { iteration: '迭代9', coverage: 73, automation: 67 },
    { iteration: '迭代10', coverage: 75, automation: 69 },
    { iteration: '迭代11', coverage: 76, automation: 72 },
    { iteration: '迭代12', coverage: 78, automation: 75 },
  ];

  // 缺陷率趋势图表配置
  const defectRateTrendConfig: LineConfig = {
    data: [
      ...defectRateData.map(item => ({
        name: item.iteration,
        value: item.production,
        type: '生产环境',
      })),
      ...defectRateData.map(item => ({
        name: item.iteration,
        value: item.preRelease,
        type: '预发布环境',
      })),
      ...defectRateData.map(item => ({
        name: item.iteration,
        value: item.test,
        type: '测试环境',
      })),
      ...defectRateData.map(item => ({
        name: item.iteration,
        value: item.development,
        type: '开发环境',
      })),
    ],
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
    yAxis: {
      title: {
        text: '缺陷率 (%)',
      },
      min: 0,
    },
    color: ['#F5222D', '#FAAD14', '#165DFF', '#0FC6C2'],
  };

  // 缺陷严重程度分布图表配置
  const defectSeverityConfig: PieConfig = {
    data: defectSeverityData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    color: ['#F5222D', '#FAAD14', '#165DFF', '#8C8C8C'],
  };

  // 缺陷模块分布图表配置
  const defectModuleConfig: PieConfig = {
    data: defectModuleData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 测试覆盖率趋势图表配置
  const testCoverageConfig: LineConfig = {
    data: [
      ...testCoverageData.map(item => ({
        name: item.iteration,
        value: item.coverage,
        type: '代码覆盖率',
      })),
      ...testCoverageData.map(item => ({
        name: item.iteration,
        value: item.automation,
        type: '自动化测试比例',
      })),
    ],
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 5,
      shape: 'circle',
    },
    yAxis: {
      title: {
        text: '百分比 (%)',
      },
      min: 60,
      max: 90,
    },
    color: ['#52C41A', '#165DFF'],
  };

  return (
    <section
      id="quality-metrics"
      className="performance-section section-transition"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-质量">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">生产环境缺陷率</div>
            <div className="w-10 h-10 rounded-full bg-质量/10 flex items-center justify-center">
              <i className="fa fa-bug text-质量"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            3.8
            <span className="text-base font-normal text-gray-500 ml-1">%</span>
          </div>
          <div className="mt-1 text-xs text-danger">
            <i className="fa fa-arrow-up mr-1"></i>较上迭代上升 0.6%
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">目标：</span> 控制在 3% 以内
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-warning">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">代码返工率</div>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <i className="fa fa-refresh text-warning"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            9.5
            <span className="text-base font-normal text-gray-500 ml-1">%</span>
          </div>
          <div className="mt-1 text-xs text-danger">
            <i className="fa fa-arrow-up mr-1"></i>较上迭代上升 1.4%
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">目标：</span> 控制在 8% 以内
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">自动化测试覆盖率</div>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <i className="fa fa-check-square-o text-success"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            78
            <span className="text-base font-normal text-gray-500 ml-1">%</span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i>较上迭代上升 4%
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">目标：</span> 本季度达到 85%
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">平均缺陷修复时间</div>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <i className="fa fa-clock-o text-cyan-500"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            8.5
            <span className="text-base font-normal text-gray-500 ml-1">
              小时
            </span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-down mr-1"></i>较上迭代缩短 0.8 小时
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">目标：</span> 控制在 10 小时以内
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">缺陷率趋势分析</h3>
              <p className="text-gray-500 text-sm mt-1">
                不同环境缺陷率变化趋势
              </p>
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500">
                <option>近5个迭代</option>
                <option>近3个月</option>
                <option>本季度</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="fa fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="h-64">
            <Line {...defectRateTrendConfig} />
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-danger mr-2"></div>
              <span>生产环境</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
              <span>预发布环境</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>测试环境</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></div>
              <span>开发环境</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">缺陷分布分析</h3>
              <p className="text-gray-500 text-sm mt-1">按严重程度和模块分布</p>
            </div>
            <div className="relative">
              <Select style={{ width: 100 }}>
                <option>迭代 12</option>
                <option>迭代 11</option>
                <option>迭代 10</option>
                <option>近3个迭代</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                按严重程度分布
              </h4>
              <div className="h-40">
                <Pie {...defectSeverityConfig} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                按模块分布
              </h4>
              <div className="h-40">
                <Pie {...defectModuleConfig} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">测试覆盖率趋势</h3>
              <p className="text-gray-500 text-sm mt-1">
                代码覆盖率与自动化测试比例
              </p>
            </div>
            <Button type="text" className="text-cyan-500 text-sm">
              测试详情
            </Button>
          </div>
          <div className="h-64">
            <Line {...testCoverageConfig} />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
              <span>代码覆盖率</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>自动化测试比例</span>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-600">
            <p>
              <i className="fa fa-info-circle text-primary mr-1"></i>{' '}
              目标是核心模块覆盖率达到90%以上
            </p>
            <p className="mt-1">
              <i className="fa fa-arrow-up text-success mr-1"></i>{' '}
              自动化测试比例持续提升
            </p>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">最近严重缺陷</h3>
              <p className="text-gray-500 text-sm mt-1">
                P0/P1级缺陷列表及修复状态
              </p>
            </div>
            <Button type="text" className="text-purple-500 text-sm">
              查看所有缺陷
            </Button>
          </div>
          <Table
            size="small"
            pagination={false}
            dataSource={defectData}
            rowKey={(record) => record.defectId}
            columns={[
              {
                title: '缺陷ID',
                dataIndex: 'defectId',
                key: 'defectId',
                className: 'text-xs text-gray-500',
              },
              {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                className: 'text-xs text-gray-500',
                render: (_text, record) => {
                  return (
                    <Flex vertical gap={4}>
                      <div className="text-sm font-medium text-gray-900">
                        {record.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.module}
                      </div>
                    </Flex>
                  );
                },
              },
              {
                title: '严重程度',
                dataIndex: 'severity',
                key: 'severity',
                className: 'text-xs text-gray-500',
                render: (_text, record) => {
                  return (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {record.severity}
                    </span>
                  );
                },
              },
              {
                title: '发现环境',
                dataIndex: 'environment',
                key: 'environment',
                className: 'text-xs text-gray-500',
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                className: 'text-xs text-gray-500',
                render: (_text, record) => {
                  return (
                    <Tag
                      bordered={false}
                      color={record.status === '修复中' ? 'blue' : 'red'}
                    >
                      {record.status}
                    </Tag>
                  );
                },
              },
              {
                title: '发现时间',
                dataIndex: 'discoveryTime',
                key: 'discoveryTime',
                className: 'text-xs text-gray-500',
              },
              {
                title: '负责人',
                key: 'assignee',
                dataIndex: 'assignee',
                className: 'text-xs text-gray-500',
                render: (_text, record) => {
                  return (
                    <Flex
                      gap={4}
                      align="center"
                      className="text-xs text-gray-500"
                    >
                      <Avatar
                        shape="circle"
                        className="w-6 h-6"
                        alt={record.assignee}
                        src={record.assigneeAvatar}
                      />
                      <span className="text-xs text-gray-700">
                        {record.assignee}
                      </span>
                    </Flex>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default QualityMetrics;
