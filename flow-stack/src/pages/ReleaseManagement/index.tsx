import React, { useState, useEffect, useRef } from 'react';
import { Gauge } from '@antv/g2plot';
import { Tabs, Select, Flex, Button } from 'antd';

import Plan from './Plan';
import EnvironmentalManagement from './EnvironmentalManagement';
import { Environment } from './types';
import RequestApproval from './RequestApproval';
import ReleaseHistory from './ReleaseHistory';
import { changeItems } from '@/mock';
/**
 * 发布管理
 */
const { TabPane } = Tabs;

const environments: Environment[] = [
  {
    name: '开发环境',
    status: '正常',
    statusColor: 'success',
    envColor: 'env-dev',
    version: 'v2.0.0-dev.56',
    lastDeploy: '6月5日 10:23',
    servers: '3台 · 开发集群',
    runningStatus: '全部运行中',
    runningStatusColor: 'success',
  },
  {
    name: '测试环境',
    status: '正常',
    statusColor: 'success',
    envColor: 'env-test',
    version: 'v2.0.0-test.32',
    lastDeploy: '6月12日 15:47',
    servers: '4台 · 测试集群',
    runningStatus: '全部运行中',
    runningStatusColor: 'success',
  },
  {
    name: '预发布环境',
    status: '部署中',
    statusColor: 'warning',
    envColor: 'env-staging',
    version: 'v2.0.0-staging.18',
    lastDeploy: '进行中 · 12分钟',
    servers: '6台 · 预发布集群',
    runningStatus: '部分部署中',
    runningStatusColor: 'warning',
  },
  {
    name: '生产环境',
    status: '正常',
    statusColor: 'success',
    envColor: 'env-production',
    version: 'v1.9.3',
    lastDeploy: '5月20日 23:15',
    servers: '12台 · 生产集群',
    runningStatus: '全部运行中',
    runningStatusColor: 'success',
  },
];

const ReleaseManagement: React.FC = () => {
  const [deploymentProgress, setDeploymentProgress] = useState(75);
  const [riskGauge, setRiskGauge] = useState<Gauge | null>(null);
  const riskChartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 初始化风险 gauge 图表
    if (riskChartRef.current) {
      const gauge = new Gauge(riskChartRef.current, {
        value: 68,
        min: 0,
        max: 100,
        startAngle: 210,
        endAngle: -30,
        innerRadius: 0.8,
        ranges: [
          { start: 0, end: 40, color: '#52c41a' },
          { start: 40, end: 70, color: '#faad14' },
          { start: 70, end: 100, color: '#f5222d' },
        ],
        tooltip: {
          formatter: (datum: any) => {
            return { name: '风险评分', value: datum.value };
          },
        },
      });

      gauge.render();
      setRiskGauge(gauge);

      // 清理函数
      return () => {
        gauge.destroy();
      };
    }
  }, []);

  useEffect(() => {
    // 模拟部署进度更新
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container mx-auto px-4 py-6">
      <Flex justify="space-between" align="center">
        <Flex vertical>
          <h1 className="text-2xl font-bold text-gray-800">发布管控中心</h1>
          <p className="text-gray-500 mt-1">
            管理和跟踪所有发布流程、变更和环境
          </p>
        </Flex>
        <Flex className="space-x-3">
          <Select
            defaultValue="filter"
            options={[
              { value: 'filter', label: '筛选发布' },
              { value: 'time', label: '按时间' },
              { value: 'env', label: '按环境' },
              { value: 'status', label: '按状态' },
            ]}
          />
          <Button type="primary">创建发布计划</Button>
        </Flex>
      </Flex>
      <div className="mt-3">
        <Tabs defaultActiveKey="1">
          <TabPane tab="发布计划" key="1">
            <Plan deploymentProgress={deploymentProgress} />
          </TabPane>
          <TabPane tab="环境管理" key="2">
            <EnvironmentalManagement environments={environments} />
          </TabPane>
          <TabPane tab="变更审批" key="3">
            <RequestApproval changeItems={changeItems} />
          </TabPane>
          <TabPane tab="发布历史" key="4">
            <ReleaseHistory />
          </TabPane>
          <TabPane tab="应急回滚" key="5">
            {/* 应急回滚内容 */}
            <div className="bg-white rounded-xl p-6 card-shadow mt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <i className="fa fa-refresh text-red-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  应急回滚功能
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  此功能允许您在发布出现问题时快速回滚到之前的稳定版本。
                  请联系系统管理员启用此功能。
                </p>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
      {/* 发布进度和风险分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 发布进度 */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
          <Flex align="center" justify="space-between" className="mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">发布流水线进度</h3>
              <p className="text-gray-500 text-sm mt-1">
                v2.0.0 发布周期 · 总体进度 68%
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">自动部署:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </Flex>
          {/* 发布流程进度 */}
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
            <div
              className="absolute top-5 left-0 h-0.5 bg-primary -z-0"
              style={{ width: '68%' }}
            ></div>

            <div className="flex justify-between relative">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white z-10">
                  <i className="fa fa-check"></i>
                </div>
                <div className="mt-2 text-sm font-medium">开发环境</div>
                <div className="text-xs text-gray-500 mt-1">已完成</div>
                <div className="text-xs text-gray-500">6月5日</div>
              </div>

              {/* 测试环境 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white z-10">
                  <i className="fa fa-check"></i>
                </div>
                <div className="mt-2 text-sm font-medium">测试环境</div>
                <div className="text-xs text-gray-500 mt-1">已完成</div>
                <div className="text-xs text-gray-500">6月12日</div>
              </div>

              {/* 预发布环境 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center text-white z-10 animate-pulse">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
                <div className="mt-2 text-sm font-medium">预发布环境</div>
                <div className="text-xs text-warning mt-1">进行中</div>
                <div className="text-xs text-gray-500">预计6月20日</div>
              </div>

              {/* 生产环境 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 z-10">
                  <i className="fa fa-lock"></i>
                </div>
                <div className="mt-2 text-sm font-medium">生产环境</div>
                <div className="text-xs text-gray-500 mt-1">未开始</div>
                <div className="text-xs text-gray-500">计划6月30日</div>
              </div>
            </div>
          </div>

          {/* 环境详情 */}
          <div className="mt-8 space-y-6">
            {/* 预发布环境详情 */}
            <div className="border border-warning/30 rounded-xl p-4 bg-warning/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-env-staging mr-2"></div>
                  <h4 className="font-medium text-gray-800">预发布环境部署</h4>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full mr-2">
                    进行中
                  </span>
                  <span className="text-xs text-gray-500">已运行 12分钟</span>
                </div>
              </div>

              {/* 部署进度 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">部署进度</span>
                  <span className="text-gray-600">{deploymentProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* 部署步骤 */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <i className="fa fa-check-circle text-success mr-2"></i>
                  <span>代码拉取与编译</span>
                  <span className="ml-auto text-xs text-gray-500">
                    已完成 (2m30s)
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fa fa-check-circle text-success mr-2"></i>
                  <span>数据库迁移</span>
                  <span className="ml-auto text-xs text-gray-500">
                    已完成 (3m15s)
                  </span>
                </div>
                {deploymentProgress < 30 && (
                  <div className="flex items-center text-sm">
                    <i className="fa fa-spinner fa-spin text-warning mr-2"></i>
                    <span>应用部署与启动</span>
                    <span className="ml-auto text-xs text-gray-500">
                      进行中 (6m45s)
                    </span>
                  </div>
                )}
                {deploymentProgress >= 30 && deploymentProgress < 60 && (
                  <div className="flex items-center text-sm">
                    <i className="fa fa-check-circle text-success mr-2"></i>
                    <span>应用部署与启动</span>
                    <span className="ml-auto text-xs text-gray-500">
                      已完成 (8m15s)
                    </span>
                  </div>
                )}
                {deploymentProgress < 60 && (
                  <div className="flex items-center text-sm text-gray-400">
                    <i className="fa fa-circle-o mr-2"></i>
                    <span>自动化测试执行</span>
                    <span className="ml-auto text-xs">待执行</span>
                  </div>
                )}
                {deploymentProgress >= 30 && deploymentProgress < 60 && (
                  <div className="flex items-center text-sm">
                    <i className="fa fa-spinner fa-spin text-warning mr-2"></i>
                    <span>自动化测试执行</span>
                    <span className="ml-auto text-xs text-gray-500">
                      进行中 (2m30s)
                    </span>
                  </div>
                )}
                {deploymentProgress >= 60 && (
                  <div className="flex items-center text-sm">
                    <i className="fa fa-check-circle text-success mr-2"></i>
                    <span>自动化测试执行</span>
                    <span className="ml-auto text-xs text-gray-500">
                      已完成 (5m45s)
                    </span>
                  </div>
                )}
                {deploymentProgress < 60 && (
                  <div className="flex items-center text-sm text-gray-400">
                    <i className="fa fa-circle-o mr-2"></i>
                    <span>性能指标监控</span>
                    <span className="ml-auto text-xs">待执行</span>
                  </div>
                )}
                {deploymentProgress >= 60 && (
                  <div className="flex items-center text-sm">
                    <i className="fa fa-spinner fa-spin text-warning mr-2"></i>
                    <span>性能指标监控</span>
                    <span className="ml-auto text-xs text-gray-500">
                      进行中 (1m15s)
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-1.5 px-3 text-sm font-medium transition-colors flex items-center">
                  <i className="fa fa-pause mr-2"></i>暂停
                </button>
                <button className="bg-danger hover:bg-danger/90 text-white rounded-lg py-1.5 px-3 text-sm font-medium transition-colors flex items-center">
                  <i className="fa fa-stop mr-2"></i>终止
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 风险分析 */}
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">发布风险分析</h3>
              <p className="text-gray-500 text-sm mt-1">
                基于AI的风险识别与评估
              </p>
            </div>
            <button className="text-primary text-sm hover:underline">
              查看详情
            </button>
          </div>

          {/* 风险评分 */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <div
                ref={riskChartRef}
                style={{ width: '100%', height: '100%' }}
              ></div>
            </div>
          </div>

          {/* 风险列表 */}
          <div className="space-y-4">
            <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa fa-exclamation-triangle text-danger"></i>
                </div>
                <div className="ml-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">支付核心模块变更</p>
                    <span className="px-2 py-0.5 bg-danger/10 text-danger text-xs rounded-full">
                      高风险
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    涉及支付流程核心逻辑变更，影响范围广，建议增加测试覆盖率
                  </p>
                  <button className="mt-2 text-danger text-xs font-medium hover:underline">
                    查看缓解措施
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa fa-exclamation-circle text-warning"></i>
                </div>
                <div className="ml-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">数据库 schema 变更</p>
                    <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                      中风险
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    包含3张核心表结构变更，建议先在预发布环境验证数据迁移
                  </p>
                  <button className="mt-2 text-warning text-xs font-medium hover:underline">
                    查看缓解措施
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa fa-info-circle text-primary"></i>
                </div>
                <div className="ml-3">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">第三方支付接口升级</p>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      低风险
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    支付宝接口版本升级，已完成兼容性测试，但建议监控首小时调用情况
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-white border border-primary text-primary hover:bg-primary/5 rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center">
            <i className="fa fa-shield mr-2"></i>生成风险缓解计划
          </button>
        </div>
      </div>
    </main>
  );
};

export default ReleaseManagement;
