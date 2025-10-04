import React, { useRef, useEffect } from 'react';
import { Card, Col, Row, Select, Button, Progress } from 'antd';
import { Radar } from '@antv/g2plot';
import {
  TrophyOutlined,
  UserOutlined,
  BulbOutlined,
  LockOutlined,
  MoonOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SearchOutlined,
  FlagOutlined,
  TagOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { performanceData, safetyData, skillsData } from '@/mock/personal';

/**
 * 个人仪表盘
 */
const PersonalDashboard = () => {
  const safetyRadarChartRef = useRef<HTMLDivElement>(null);
  const performanceRadarChartRef = useRef<HTMLDivElement>(null);
  const skillsRadarChartRef = useRef<HTMLDivElement>(null);
  const safetyChartInstance = useRef<Radar | null>(null);
  const performanceChartInstance = useRef<Radar | null>(null);
  const skillsChartInstance = useRef<Radar | null>(null);

  useEffect(() => {
    if (!safetyRadarChartRef.current) return;

    if (safetyChartInstance.current) {
      safetyChartInstance.current.destroy();
    }

    safetyChartInstance.current = new Radar(safetyRadarChartRef.current, {
      data: safetyData,
      xField: 'subject',
      yField: 'score',
      meta: {
        score: {
          min: 50,
          max: 100,
          tickCount: 6,
        },
      },
      xAxis: {
        line: null,
        tickLine: null,
      },
      yAxis: {
        line: null,
        grid: {
          alternateColor: 'rgba(245, 245, 245, 0.5)',
        },
      },
      point: {
        size: 2,
        shape: 'circle',
      },
      area: {
        style: {
          fillOpacity: 0.2,
          fill: 'rgba(250, 173, 20, 1)',
        },
      },
      // @ts-ignore
      line: {
        style: {
          stroke: 'rgba(250, 173, 20, 1)',
        },
      },
    });

    safetyChartInstance.current.render();

    return () => {
      if (safetyChartInstance.current) {
        safetyChartInstance.current.destroy();
      }
    };
  }, []);

  // 初始化效能雷达图
  useEffect(() => {
    if (!performanceRadarChartRef.current) return;

    // 销毁已存在的图表实例
    if (performanceChartInstance.current) {
      performanceChartInstance.current.destroy();
    }

    performanceChartInstance.current = new Radar(
      performanceRadarChartRef.current,
      {
        data: performanceData,
        xField: 'subject',
        // @ts-ignore
        yField: ['个人', '团队平均'],
        meta: {
          个人: {
            min: 50,
            max: 100,
            tickCount: 6,
          },
          团队平均: {
            min: 50,
            max: 100,
            tickCount: 6,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
        },
        yAxis: {
          line: null,
          grid: {
            alternateColor: 'rgba(245, 245, 245, 0.5)',
          },
        },
        point: {
          size: 2,
          shape: 'circle',
        },
        seriesField: 'name',
        color: ['rgba(22, 93, 255, 1)', 'rgba(200, 200, 200, 1)'],
      }
    );

    performanceChartInstance.current.render();

    return () => {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
    };
  }, []);

  // 初始化技能雷达图
  useEffect(() => {
    if (!skillsRadarChartRef.current) return;

    // 销毁已存在的图表实例
    if (skillsChartInstance.current) {
      skillsChartInstance.current.destroy();
    }

    skillsChartInstance.current = new Radar(
      skillsRadarChartRef.current,
      {
        data: skillsData,
        xField: 'subject',
        // @ts-ignore
        yField: ['个人', '团队平均'],
        meta: {
          个人: {
            min: 50,
            max: 100,
            tickCount: 6,
          },
          团队平均: {
            min: 50,
            max: 100,
            tickCount: 6,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
        },
        yAxis: {
          line: null,
          grid: {
            alternateColor: 'rgba(245, 245, 245, 0.5)',
          },
        },
        point: {
          size: 2,
          shape: 'circle',
        },
        seriesField: 'name',
        color: ['rgba(52, 199, 89, 1)', 'rgba(200, 200, 200, 1)'],
      }
    );

    skillsChartInstance.current.render();

    return () => {
      if (skillsChartInstance.current) {
        skillsChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">个人看板</h1>
            <p className="text-gray-500 mt-1">
              欢迎回来，张三！今天是周三，祝你工作愉快
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Select className="w-36" defaultValue="最近7天" />
            </div>
            <Button type="primary">
              <i className="fa fa-download mr-1"></i>导出报告
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* 1. 个人状态与工作饱和度 */}
          <Col span={24} xl={8}>
            <Card className="card-shadow hover-lift rounded-xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    个人状态
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    身心健康与工作平衡
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-light-yellow flex items-center justify-center">
                  <i className="fa fa-heartbeat text-warm-yellow"></i>
                </div>
              </div>

              {/* 个人状态卡片 */}
              <div className="flex flex-col space-y-4 mb-6">
                <div className="p-4 bg-success/5 rounded-lg border border-success/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      健康状态
                    </span>
                    <span className="px-2 py-0.5 bg-success/20 text-success text-xs rounded-full">
                      良好
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-success animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-600">
                        心率 72bpm · 睡眠 7h
                      </span>
                    </div>
                    <button className="text-success text-xs hover:underline">
                      查看详情
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-warning/5 rounded-lg border border-warning/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      压力指数
                    </span>
                    <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded-full">
                      中等
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-warning animate-pulse mr-2"></div>
                      <span className="text-xs text-gray-600">
                        68/100 · 较昨日 +3
                      </span>
                    </div>
                    <button className="text-warning text-xs hover:underline">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>

              {/* 人文关怀中心 */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">心理安全指数</h4>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">78</span>
                    <i className="fa fa-long-arrow-up text-success text-xs ml-1"></i>
                  </div>
                </div>
                <div className="h-48" ref={safetyRadarChartRef}></div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start">
                    <i className="fa fa-leaf text-warm-yellow mt-0.5 mr-2"></i>
                    <p className="text-sm text-yellow-800">
                      你的心理安全感较上月提升5%，继续保持积极的工作态度。
                    </p>
                  </div>
                </div>
              </div>

              {/* 工作饱和度与节奏健康度 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">工作饱和度</h4>
                  <Button
                    type="link"
                    className="text-xs text-primary p-0 h-auto"
                  >
                    查看详情
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">本周平均</span>
                  <span className="text-sm font-medium text-warning">108%</span>
                </div>

                {/* 饱和度热力图 */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-success/20 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-success mb-1">
                        92%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">一</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-success/20 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-success mb-1">
                        88%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">二</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-warning/20 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-warning mb-1">
                        105%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">三</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-warning/20 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-warning mb-1">
                        112%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">四</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-danger/20 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-danger mb-1">
                        125%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">五</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-gray-100 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-gray-500 mb-1">
                        0%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">六</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 bg-gray-100 rounded-md flex items-end justify-center">
                      <span className="text-xs font-medium text-gray-500 mb-1">
                        0%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">日</span>
                  </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start">
                    <i className="fa fa-exclamation-circle text-orange-500 mt-0.5 mr-2"></i>
                    <p className="text-sm text-orange-800">
                      你连续2天饱和度超过110%，建议调整任务优先级或寻求帮助。
                    </p>
                  </div>
                </div>

                {/* 节奏健康度 */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">节奏健康度</span>
                    <span className="text-sm font-medium text-success">
                      87%
                    </span>
                  </div>
                  <Progress
                    percent={87}
                    strokeColor="#52C41A"
                    showInfo={false}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>需改善</span>
                    <span>良好</span>
                    <span>优秀</span>
                  </div>
                </div>

                {/* 快捷操作 */}
                <div className="mt-6 flex space-x-3">
                  <Button className="flex-1 bg-light-yellow hover:bg-yellow-100 text-warm-yellow rounded-lg py-2 text-sm font-medium transition-colors">
                    <MoonOutlined className="mr-2" />
                    静默模式
                  </Button>
                  <Button className="flex-1 bg-light-blue hover:bg-blue-100 text-primary rounded-lg py-2 text-sm font-medium transition-colors">
                    <ClockCircleOutlined className="mr-2" />
                    弹性工时
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* 2. 个人效能面板 */}
          <Col span={24} xl={8}>
            <Card className="card-shadow hover-lift rounded-xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    个人效能面板
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    多维度展示你的工作表现
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-light-blue flex items-center justify-center">
                  <i className="fa fa-bar-chart text-primary"></i>
                </div>
              </div>

              {/* 效能雷达图 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">效能雷达图</h4>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-primary/30 rounded-full mr-1"></span>
                    个人
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full ml-3 mr-1"></span>
                    团队平均
                  </div>
                </div>

                <div className="h-64" ref={performanceRadarChartRef}></div>

                <div className="mt-4 p-3 bg-light-blue rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <i className="fa fa-lightbulb-o text-primary mt-0.5 mr-2"></i>
                    <p className="text-sm text-blue-800">
                      你的'协作力'得分最高，在团队中排名前15%，适合担任新人导师。
                    </p>
                  </div>
                </div>
              </div>

              {/* 技能雷达图 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">技能雷达图</h4>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-success/30 rounded-full mr-1"></span>
                    个人
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full ml-3 mr-1"></span>
                    团队平均
                  </div>
                </div>

                <div className="h-64" ref={skillsRadarChartRef}></div>

                <div className="mt-4 p-3 bg-light-green rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <i className="fa fa-check-circle text-success mt-0.5 mr-2"></i>
                    <p className="text-sm text-green-800">
                      你的'问题解决'能力突出，技术广度良好，但在技术深度方面还有提升空间。
                    </p>
                  </div>
                </div>
              </div>

              {/* 任务贡献热力图 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">任务贡献热力图</h4>
                  <div className="relative">
                    <Select className="w-28" defaultValue="按项目" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="bg-primary/10 rounded-lg p-3 hover:bg-primary/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-600">支付系统重构</div>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      <div className="h-2 bg-primary/40 rounded"></div>
                      <div className="h-2 bg-primary/60 rounded"></div>
                      <div className="h-2 bg-primary/80 rounded"></div>
                      <div className="h-2 bg-primary rounded"></div>
                      <div className="h-2 bg-primary/70 rounded"></div>
                    </div>
                    <div className="text-xs text-primary mt-2 font-medium">
                      12个任务 · 高贡献
                    </div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3 hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-600">用户增长系统</div>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      <div className="h-2 bg-secondary/30 rounded"></div>
                      <div className="h-2 bg-secondary/50 rounded"></div>
                      <div className="h-2 bg-secondary/70 rounded"></div>
                      <div className="h-2 bg-secondary/40 rounded"></div>
                      <div className="h-2 bg-secondary/60 rounded"></div>
                    </div>
                    <div className="text-xs text-secondary mt-2 font-medium">
                      8个任务 · 中贡献
                    </div>
                  </div>
                  <div className="bg-success/10 rounded-lg p-3 hover:bg-success/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-600">数据中台建设</div>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      <div className="h-2 bg-success/20 rounded"></div>
                      <div className="h-2 bg-success/30 rounded"></div>
                      <div className="h-2 bg-success/50 rounded"></div>
                      <div className="h-2 bg-success/30 rounded"></div>
                      <div className="h-2 bg-success/40 rounded"></div>
                    </div>
                    <div className="text-xs text-success mt-2 font-medium">
                      5个任务 · 低贡献
                    </div>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-3 hover:bg-warning/20 transition-colors cursor-pointer">
                    <div className="text-xs text-gray-600">移动端新功能</div>
                    <div className="mt-2 grid grid-cols-5 gap-1">
                      <div className="h-2 bg-warning/60 rounded"></div>
                      <div className="h-2 bg-warning/80 rounded"></div>
                      <div className="h-2 bg-warning rounded"></div>
                      <div className="h-2 bg-warning/70 rounded"></div>
                      <div className="h-2 bg-warning/50 rounded"></div>
                    </div>
                    <div className="text-xs text-warning mt-2 font-medium">
                      10个任务 · 高贡献
                    </div>
                  </div>
                </div>

                {/* 最近贡献 */}
                <h4 className="font-medium text-gray-700 mb-3">最近贡献</h4>
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-neutral rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CodeOutlined className="text-primary text-sm" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm">完成支付模块性能优化</div>
                      <div className="text-xs text-gray-500 mt-1">
                        2小时前 · 质量分96
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-neutral rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircleOutlined className="text-success text-sm" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm">
                        帮助王开发解决React Hooks问题
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        昨天 · +5协作分
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-neutral rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <FileTextOutlined className="text-warning text-sm" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm">更新组件库使用文档</div>
                      <div className="text-xs text-gray-500 mt-1">
                        2天前 · +3成长分
                      </div>
                    </div>
                  </div>
                </div>

                {/* 贡献勋章 */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-3">我的勋章</h4>
                  <div className="flex space-x-3">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl mx-auto">
                        <TrophyOutlined />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">代码精英</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-white text-xl mx-auto">
                        <UserOutlined />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">协作达人</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center text-white text-xl mx-auto">
                        <BulbOutlined />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">创意先锋</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl mx-auto border-2 border-dashed border-gray-300">
                        <LockOutlined />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">未解锁</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* 3. AI辅助成长引擎 */}
          <Col span={24} xl={8}>
            <Card className="card-shadow hover-lift rounded-xl overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    AI辅助成长引擎
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    为你定制专属成长路径
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-light-green flex items-center justify-center">
                  <i className="fa fa-graduation-cap text-secondary"></i>
                </div>
              </div>

              {/* 成长力评估 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">成长力评估</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    良好
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">当前成长力分</span>
                  <span className="text-sm font-medium text-success">82</span>
                </div>

                <Progress
                  percent={82}
                  strokeColor="#52C41A"
                  showInfo={false}
                  className="mb-6"
                />

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <div className="p-3 bg-neutral rounded-lg">
                    <div className="text-xs text-gray-600">代码多样性</div>
                    <div className="text-success font-semibold mt-1">85</div>
                  </div>
                  <div className="p-3 bg-neutral rounded-lg">
                    <div className="text-xs text-gray-600">技术债修复</div>
                    <div className="text-warning font-semibold mt-1">76</div>
                  </div>
                  <div className="p-3 bg-neutral rounded-lg">
                    <div className="text-xs text-gray-600">知识分享</div>
                    <div className="text-primary font-semibold mt-1">88</div>
                  </div>
                </div>

                <div className="p-3 bg-light-green rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <LineChartOutlined className="text-secondary mt-0.5 mr-2" />
                    <p className="text-sm text-green-800">
                      你的成长力分比上月提升8%，继续保持！尤其在知识分享方面表现突出。
                    </p>
                  </div>
                </div>
              </div>

              {/* AI学习助手 */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">AI学习助手</h4>
                  <Button
                    type="link"
                    className="text-xs text-primary p-0 h-auto"
                  >
                    更多资源
                  </Button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <SearchOutlined className="text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        技能缺口分析
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        对比前端高级工程师岗位要求，你在微前端架构和性能优化方面有提升空间。
                      </p>
                    </div>
                  </div>
                </div>

                <h5 className="text-sm font-medium text-gray-700 mb-3">
                  推荐学习资源
                </h5>

                <div className="space-y-3 mb-4">
                  <div className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        微前端架构实践指南
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        初级
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="fa fa-clock-o mr-1"></i> 预计学习时间：2小时
                      <span className="mx-2">•</span>
                      <i className="fa fa-star text-warning mr-1"></i> 4.8
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        React性能优化实战
                      </div>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        中级
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="fa fa-clock-o mr-1"></i> 预计学习时间：3小时
                      <span className="mx-2">•</span>
                      <i className="fa fa-star text-warning mr-1"></i> 4.9
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        TypeScript高级类型技巧
                      </div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                        高级
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <i className="fa fa-clock-o mr-1"></i> 预计学习时间：4小时
                      <span className="mx-2">•</span>
                      <i className="fa fa-star text-warning mr-1"></i> 4.7
                    </div>
                  </div>
                </div>

                {/* 实践任务 */}
                <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FlagOutlined className="text-primary" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">推荐实践任务</p>
                      <p className="text-sm text-gray-700 mt-1">
                        为支付模块添加单元测试，提升测试覆盖率至90%以上
                      </p>
                      <Button
                        type="link"
                        className="mt-2 text-primary text-xs p-0 h-auto"
                      >
                        开始任务
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI职业发展顾问 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">AI职业发展顾问</h4>
                  <Button
                    type="link"
                    className="text-xs text-primary p-0 h-auto"
                  >
                    查看详情
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    晋升路径：前端高级工程师
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs z-10">
                          1
                        </div>
                        <span className="text-xs text-gray-500 mt-1">当前</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs z-10">
                          2
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          技能提升
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs z-10">
                          3
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          项目主导
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs z-10">
                          4
                        </div>
                        <span className="text-xs text-gray-500 mt-1">目标</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    完成进度：
                    <span className="text-primary font-medium">45%</span>
                  </div>
                </div>

                <div className="p-3 bg-light-blue rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <TagOutlined className="text-primary mt-0.5 mr-2" />
                    <p className="text-sm text-blue-800">
                      绩效预测：若保持当前成长速度，下季度绩效预计为
                      <span className="font-medium">A-</span>
                      ，距离晋升要求还需提升技术深度。
                    </p>
                  </div>
                </div>

                <Button type="primary" className="mt-6 w-full">
                  <MailOutlined className="mr-2" />
                  生成个性化成长计划
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default PersonalDashboard;
