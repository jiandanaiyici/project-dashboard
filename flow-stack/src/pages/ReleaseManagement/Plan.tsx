import { Select, Switch, Table } from 'antd';
import { Fragment } from 'react';
import { changeItems } from '@/mock';

/**
 * 发布计划
 */
const Plan = ({ deploymentProgress }: { deploymentProgress: number }) => {
  return (
    <Fragment>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">待发布项</div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <i className="fa fa-tasks text-primary text-sm"></i>
            </div>
          </div>
          <div className="mt-3 text-xl font-bold">12</div>
          <div className="mt-1 text-xs text-gray-500">
            <span className="text-primary">8个功能</span> ·{' '}
            <span className="text-danger">4个Bug修复</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">发布成功率</div>
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
              <i className="fa fa-check-circle text-success text-sm"></i>
            </div>
          </div>
          <div className="mt-3 text-xl font-bold">92%</div>
          <div className="mt-1 text-xs text-gray-500">
            <span className="text-success">
              <i className="fa fa-arrow-up mr-1"></i>5%
            </span>{' '}
            相比上季度
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">平均发布时长</div>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
              <i className="fa fa-clock-o text-secondary text-sm"></i>
            </div>
          </div>
          <div className="mt-3 text-xl font-bold">18分钟</div>
          <div className="mt-1 text-xs text-gray-500">
            <span className="text-success">
              <i className="fa fa-arrow-down mr-1"></i>12%
            </span>{' '}
            相比上季度
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">发布流水线进度</h3>
              <p className="text-gray-500 text-sm mt-1">
                v2.0.0 发布周期 · 总体进度 68%
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">自动部署:</span>
              <Switch defaultChecked />
            </div>
          </div>

          {/* 发布流程时间线 */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* 开发环境 */}
            <div className="flex items-center mb-8 relative pl-14">
              <div className="absolute left-3 w-4 h-4 bg-env-dev rounded-full border-4 border-white -ml-0.5"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">开发环境</h4>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                    已完成
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">完成于 6月12日</div>
              </div>
            </div>

            {/* 测试环境 */}
            <div className="flex items-center mb-8 relative pl-14">
              <div className="absolute left-3 w-4 h-4 bg-env-test rounded-full border-4 border-white -ml-0.5"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">测试环境</h4>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                    已完成
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">完成于 6月18日</div>
              </div>
            </div>

            {/* 预发布环境 */}
            <div className="flex items-center mb-8 relative pl-14">
              <div className="absolute left-3 w-4 h-4 bg-env-staging rounded-full border-4 border-white -ml-0.5"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">预发布环境</h4>
                  <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                    进行中
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">已运行 12分钟</div>
              </div>
            </div>

            {/* 生产环境 */}
            <div className="flex items-center relative pl-14">
              <div className="absolute left-3 w-4 h-4 bg-env-production rounded-full border-4 border-white -ml-0.5"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">生产环境</h4>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                    未开始
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">计划 6月30日</div>
              </div>
            </div>
          </div>

          {/* 部署详情 */}
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
                    className="h-2 bg-primary rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* 部署步骤 */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-xs">
                  <i className="fa fa-check text-success mr-2"></i>
                  <span className="text-gray-600">代码拉取完成</span>
                </div>
                <div className="flex items-center text-xs">
                  <i className="fa fa-check text-success mr-2"></i>
                  <span className="text-gray-600">依赖安装完成</span>
                </div>
                <div className="flex items-center text-xs">
                  <i className="fa fa-check text-success mr-2"></i>
                  <span className="text-gray-600">构建打包完成</span>
                </div>
                <div className="flex items-center text-xs">
                  <i className="fa fa-circle-o-notch fa-spin text-warning mr-2"></i>
                  <span className="text-gray-600">正在部署服务</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <i className="fa fa-circle-o mr-2"></i>
                  <span>服务启动验证</span>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <i className="fa fa-circle-o mr-2"></i>
                  <span>部署完成通知</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 风险分析和部署配置 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="font-semibold text-gray-800 mb-4">发布风险分析</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">整体风险等级</div>
              <div className="flex items-center">
                {/* <div className="w-20 h-20" ref={riskChartRef}></div> */}
                <div className="ml-4">
                  <div className="text-xl font-bold text-warning">中等</div>
                  <div className="text-xs text-gray-500">包含1项中风险变更</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
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
          </div>

          {/* 部署配置 */}
          <div className="bg-white rounded-xl p-6 card-shadow">
            <h3 className="font-semibold text-gray-800 mb-4">部署配置</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">计划发布时间</span>
                <span className="font-medium">2023-06-30 22:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">发布方式</span>
                <span className="font-medium">蓝绿部署</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">回滚方案</span>
                <span className="font-medium text-primary">已准备</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 变更清单和审批流程 */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">待发布变更清单</h3>
            <p className="text-gray-500 text-sm mt-1">
              包含12项变更 · 预计发布到生产环境
            </p>
          </div>
          <div className="relative">
            <Select
              defaultValue="all"
              options={[
                {
                  label: '全部类型',
                  value: 'all',
                },
                {
                  label: '功能更新',
                  value: 'feature',
                },
                {
                  label: 'Bug修复',
                  value: 'bug',
                },
                {
                  label: '性能优化',
                  value: 'performance',
                },
                {
                  label: '安全修复',
                  value: 'security',
                },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            size="small"
            dataSource={changeItems}
            rowClassName="hover:bg-gray-50 transition-colors"
            columns={[
              {
                title: '变更ID',
                dataIndex: 'id',
                key: 'id',
                className: 'px-3 py-3 whitespace-nowrap text-sm text-gray-900',
              },
              {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                className:
                  'px-3 py-3 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate',
              },
              {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                className: 'px-3 py-3 whitespace-nowrap text-sm text-gray-900',
                render: (text, record) => (
                  <span
                    className={`px-2 py-1 text-xs rounded-full bg-${record.type.color}-100 text-${record.type.color}-800`}
                  >
                    {record.type.name}
                  </span>
                ),
              },
              {
                title: '提交人',
                dataIndex: 'submitter',
                key: 'submitter',
                className: 'px-3 py-3 whitespace-nowrap text-sm text-gray-900',
                render: (text, record) => (
                  <div className="flex items-center">
                    <img
                      className="w-6 h-6 rounded-full mr-2"
                      src={record.submitter.avatar}
                      alt={record.submitter.name}
                    />
                    <span className="text-sm text-gray-900">
                      {record.submitter.name}
                    </span>
                  </div>
                ),
              },
              {
                title: '风险等级',
                dataIndex: 'riskLevel',
                key: 'riskLevel',
                className: 'px-3 py-3 whitespace-nowrap text-sm text-gray-900',
                render: (_text, record) => (
                  <span
                    className={`px-2 py-1 text-xs rounded-full bg-${record.riskLevel.color}-100 text-${record.riskLevel.color}-800`}
                  >
                    {record.riskLevel.name}
                  </span>
                ),
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                className: 'px-3 py-3 whitespace-nowrap text-sm text-gray-900',
                render: (_text, record) => (
                  <span
                    className={`px-2 py-1 text-xs rounded-full bg-${record.statusColor}-100 text-${record.statusColor}-800`}
                  >
                    {record.status}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Plan;
