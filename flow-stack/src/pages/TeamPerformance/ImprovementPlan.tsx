import { Select } from 'antd';

const ImprovementPlan: React.FC = () => {
  return (
    <section
      id="improvement-plan"
      className="performance-section section-transition"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">进行中改进计划</div>
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <i className="fa fa-spinner text-warning"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">5</div>
          <div className="mt-1 text-xs text-warning">
            <i className="fa fa-exclamation-circle mr-1"></i> 2 项计划进度滞后
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">完成率：</span> 平均完成进度 62%
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">已完成改进计划</div>
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <i className="fa fa-check text-success"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">12</div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i> 本季度新增 4 项
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">平均周期：</span> 2.3 个迭代
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">效能提升成果</div>
            <div className="w-10 h-10 rounded-full bg-效能/10 flex items-center justify-center">
              <i className="fa fa-line-chart text-效能"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            +18.5
            <span className="text-base font-normal text-gray-500 ml-1">%</span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i> 较实施前提升
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">主要贡献：</span> 自动化测试优化
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 card-shadow mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">进行中的改进计划</h3>
            <p className="text-gray-500 text-sm mt-1">
              按优先级排序的效能改进行动
            </p>
          </div>
          <button className="bg-效能 hover:bg-效能/90 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center">
            <i className="fa fa-plus mr-2"></i>创建改进计划
          </button>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full mr-2">
                    P0
                  </span>
                  <h4 className="text-sm font-medium">降低生产环境缺陷率</h4>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  通过增加自动化测试覆盖率和改进代码审查流程，将生产环境缺陷率从3.8%降低到3%以下
                </p>
              </div>
              <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                进度滞后
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-500">负责人</div>
                <div className="flex items-center mt-1">
                  <img
                    className="w-5 h-5 rounded-full mr-1"
                    src="https://picsum.photos/id/1027/200/200"
                    alt="王测试的头像"
                  />
                  <span>王测试</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">计划周期</div>
                <div className="mt-1">迭代12 - 迭代13</div>
              </div>
              <div>
                <div className="text-gray-500">当前进度</div>
                <div className="mt-1 flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div
                      className="h-full bg-warning rounded-full"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                  <span>45%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">预期收益</div>
                <div className="mt-1 text-success">缺陷率降低 21%</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  自动化测试
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                  代码审查
                </span>
              </div>
              <button className="text-primary text-xs hover:underline">
                查看详情
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full mr-2">
                    P1
                  </span>
                  <h4 className="text-sm font-medium">优化迭代计划准确性</h4>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  改进故事点估算方法，引入规划扑克和历史数据参考，提高迭代计划完成率至95%以上
                </p>
              </div>
              <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                按计划进行
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-500">负责人</div>
                <div className="flex items-center mt-1">
                  <img
                    className="w-5 h-5 rounded-full mr-1"
                    src="https://picsum.photos/id/1005/200/200"
                    alt="张经理的头像"
                  />
                  <span>张经理</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">计划周期</div>
                <div className="mt-1">迭代12 - 迭代14</div>
              </div>
              <div>
                <div className="text-gray-500">当前进度</div>
                <div className="mt-1 flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div
                      className="h-full bg-success rounded-full"
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                  <span>60%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">预期收益</div>
                <div className="mt-1 text-success">计划准确性提升 15%</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  计划管理
                </span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  估算方法
                </span>
              </div>
              <button className="text-primary text-xs hover:underline">
                查看详情
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full mr-2">
                    P1
                  </span>
                  <h4 className="text-sm font-medium">技术债务清理计划</h4>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  系统性清理核心模块技术债务，提高代码质量和可维护性，降低长期维护成本
                </p>
              </div>
              <span className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                进度滞后
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-500">负责人</div>
                <div className="flex items-center mt-1">
                  <img
                    className="w-5 h-5 rounded-full mr-1"
                    src="https://picsum.photos/id/1025/200/200"
                    alt="赵架构的头像"
                  />
                  <span>赵架构</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">计划周期</div>
                <div className="mt-1">迭代11 - 迭代15</div>
              </div>
              <div>
                <div className="text-gray-500">当前进度</div>
                <div className="mt-1 flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div
                      className="h-full bg-warning rounded-full"
                      style={{ width: '35%' }}
                    ></div>
                  </div>
                  <span>35%</span>
                </div>
              </div>
              <div>
                <div className="text-gray-500">预期收益</div>
                <div className="mt-1 text-success">维护成本降低 30%</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                  技术优化
                </span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  代码重构
                </span>
              </div>
              <button className="text-primary text-xs hover:underline">
                查看详情
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="text-primary text-sm hover:underline">
            查看全部 5 项进行中的计划
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">已完成的改进计划</h3>
              <p className="text-gray-500 text-sm mt-1">
                已落地并产生效能提升的改进措施
              </p>
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-效能/50 focus:border-效能">
                <option>近3个月</option>
                <option>本季度</option>
                <option>本年度</option>
                <option>全部</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <i className="fa fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-success/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">提高代码审查覆盖率</h4>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    通过自动化提醒和审查流程优化，将代码审查覆盖率从85%提升至96%
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                  已完成
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-gray-500">负责人</div>
                  <div className="flex items-center mt-1">
                    <img
                      className="w-5 h-5 rounded-full mr-1"
                      src="https://picsum.photos/id/1025/200/200"
                      alt="赵架构的头像"
                    />
                    <span>赵架构</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">完成时间</div>
                  <div className="mt-1">迭代11</div>
                </div>
                <div>
                  <div className="text-gray-500">实际收益</div>
                  <div className="mt-1 text-success">覆盖率提升 13%</div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                    代码审查
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    流程优化
                  </span>
                </div>
                <button className="text-primary text-xs hover:underline">
                  查看报告
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-success/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">优化自动化测试流程</h4>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    引入CI/CD流水线自动化测试，减少人工测试成本，提高测试效率30%
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">
                  已完成
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-gray-500">负责人</div>
                  <div className="flex items-center mt-1">
                    <img
                      className="w-5 h-5 rounded-full mr-1"
                      src="https://picsum.photos/id/1027/200/200"
                      alt="王测试的头像"
                    />
                    <span>王测试</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">完成时间</div>
                  <div className="mt-1">迭代10</div>
                </div>
                <div>
                  <div className="text-gray-500">实际收益</div>
                  <div className="mt-1 text-success">测试效率提升 35%</div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    自动化测试
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                    CI/CD
                  </span>
                </div>
                <button className="text-primary text-xs hover:underline">
                  查看报告
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button className="text-primary text-sm hover:underline">
              查看全部 12 项已完成计划
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">效能提升分析</h3>
              <p className="text-gray-500 text-sm mt-1">
                改进计划实施前后的效能对比
              </p>
            </div>
            <div className="relative">
              <Select
                style={{ width: 120 }}
                size="small"
                defaultValue={'1'}
                options={[
                  {
                    value: '1',
                    label: '按改进计划',
                  },
                  {
                    value: '2',
                    label: '按效能维度',
                  },
                  {
                    value: '3',
                    label: '按时间周期',
                  },
                ]}
              />
            </div>
          </div>

          <div className="h-64">
            <canvas id="performanceImprovementChart"></canvas>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/5 rounded-lg p-3 border border-success/20">
              <div className="text-xs text-gray-500">最有效的改进措施</div>
              <div className="text-sm font-medium mt-1">自动化测试流程优化</div>
              <div className="text-xs text-success mt-1">
                <i className="fa fa-arrow-up mr-1"></i> 带来 28% 的效能提升
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="text-xs text-gray-500">投资回报率最高</div>
              <div className="text-sm font-medium mt-1">代码审查流程优化</div>
              <div className="text-xs text-primary mt-1">
                <i className="fa fa-line-chart mr-1"></i> 投入产出比 1:5.2
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImprovementPlan;
