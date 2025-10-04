import { Flex, Select } from 'antd';

/**
 * 技术效能评估中心
 */
const TechnicalEfficiencyEvaluationCenter = () => {
  return (
    <div className="bg-gray-50 font-sans text-gray-800 min-h-screen">
      {/* <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <i className="fa fa-rocket text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-dark">技术效能评估中心</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-500 hover:text-primary transition-colors">
                <i className="fa fa-calendar-o"></i>
                <span className="ml-1">2024 Q3</span>
              </button>
              <button className="text-gray-500 hover:text-primary transition-colors">
                <i className="fa fa-refresh"></i>
              </button>
              <button className="text-gray-500 hover:text-primary transition-colors">
                <i className="fa fa-download"></i>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <img
                src="https://picsum.photos/id/1005/40/40"
                alt="用户头像"
                className="w-8 h-8 rounded-full object-cover border-2 border-primary"
              />
              <span className="hidden md:inline font-medium">张开发</span>
              <i className="fa fa-chevron-down text-xs text-gray-500"></i>
            </div>
          </div>
        </div>
      </header> */}

      <main className="mx-auto px-4 py-6">
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 md:p-8 text-white card-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold mb-2">
                  个人效能综合评估
                </h2>
                <p className="text-white/80 max-w-2xl">
                  基于五大维度的全方位评估，帮助你了解自己的优势与待提升领域
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                  <svg className="w-full h-full progress-ring">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      stroke-width="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="white"
                      stroke-width="12"
                      stroke-dasharray="351.86"
                      stroke-dashoffset="88"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">75</span>
                    <span className="text-sm text-white/80">良好</span>
                  </div>
                </div>
                <span className="text-sm text-white/80">较上季度提升 5 分</span>
              </div>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <Flex justify="space-between" align="center" className="mb-6">
            <h2 className="text-xl font-bold text-dark">核心效能指标</h2>
            <Flex align="center" gap={4}>
              <span className="text-sm text-gray-500">时间范围:</span>
              <Select
                defaultValue="quarter"
                options={[
                  {
                    label: '本季度',
                    value: 'quarter',
                  },
                  {
                    label: '上季度',
                    value: 'last-quarter',
                  },
                  {
                    label: '本年度',
                    value: 'year',
                  },
                ]}
              />
            </Flex>
          </Flex>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 card-shadow card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">代码质量指数</span>
                  <h3 className="text-2xl font-bold mt-1">
                    82
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /100
                    </span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <i className="fa fa-code text-primary"></i>
                </div>
              </div>
              <div className="flex items-center text-secondary text-sm">
                <i className="fa fa-arrow-up mr-1"></i>
                <span>较上月提升 3 分</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 card-shadow card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">开发效率</span>
                  <h3 className="text-2xl font-bold mt-1">
                    68
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /100
                    </span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <i className="fa fa-tachometer text-warning"></i>
                </div>
              </div>
              <div className="flex items-center text-danger text-sm">
                <i className="fa fa-arrow-down mr-1"></i>
                <span>较上月下降 2 分</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 card-shadow card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">协作效能</span>
                  <h3 className="text-2xl font-bold mt-1">
                    85
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /100
                    </span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <i className="fa fa-users text-accent"></i>
                </div>
              </div>
              <div className="flex items-center text-secondary text-sm">
                <i className="fa fa-arrow-up mr-1"></i>
                <span>较上月提升 5 分</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 card-shadow card-hover border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">学习成长</span>
                  <h3 className="text-2xl font-bold mt-1">
                    65
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /100
                    </span>
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <i className="fa fa-graduation-cap text-secondary"></i>
                </div>
              </div>
              <div className="flex items-center text-secondary text-sm">
                <i className="fa fa-arrow-up mr-1"></i>
                <span>较上月提升 1 分</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">效能维度分布</h3>
            <div className="aspect-square flex items-center justify-center">
              <canvas id="radarChart"></canvas>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>雷达图展示五大维度的平衡情况，帮助识别优势与短板</p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <Flex justify="space-between" align="center" className="mb-6">
              <h3 className="text-lg font-semibold">关键指标详情</h3>
              <Select
                defaultValue="all"
                options={[
                  { label: '全部维度', value: 'all' },
                  { label: '代码质量', value: 'codeQuality' },
                  { label: '开发效率', value: 'developmentEfficiency' },
                  { label: '协作效能', value: 'collaborationEfficiency' },
                ]}
              />
            </Flex>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <i className="fa fa-check-circle text-secondary mr-2"></i>
                    <span className="font-medium">测试覆盖率</span>
                  </div>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-secondary h-2.5 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>目标: ≥80%</span>
                  <span className="text-secondary">超出目标 5%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <i className="fa fa-exclamation-circle text-warning mr-2"></i>
                    <span className="font-medium">专注时间占比</span>
                  </div>
                  <span className="text-sm font-medium">55%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-warning h-2.5 rounded-full"
                    style={{ width: '55%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>目标: ≥60%</span>
                  <span className="text-danger">低于目标 5%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <i className="fa fa-check-circle text-secondary mr-2"></i>
                    <span className="font-medium">PR审查响应时长</span>
                  </div>
                  <span className="text-sm font-medium">3.5小时</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-secondary h-2.5 rounded-full"
                    style={{ width: '88%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>目标: ≤4小时</span>
                  <span className="text-secondary">符合目标</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <i className="fa fa-exclamation-circle text-warning mr-2"></i>
                    <span className="font-medium">新技术使用占比</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-warning h-2.5 rounded-full"
                    style={{ width: '67%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>目标: ≥15%</span>
                  <span className="text-danger">低于目标 5%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <i className="fa fa-check-circle text-secondary mr-2"></i>
                    <span className="font-medium">CI/CD流水线成功率</span>
                  </div>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-secondary h-2.5 rounded-full"
                    style={{ width: '96%' }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>目标: ≥95%</span>
                  <span className="text-secondary">超出目标 1%</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-2 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/5 transition-colors">
              查看全部指标 <i className="fa fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">效能趋势分析</h3>
            <div className="h-64">
              <canvas id="trendChart"></canvas>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 card-shadow border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">个性化改进建议</h3>
            <div className="space-y-4">
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <h4 className="font-medium text-warning flex items-center">
                  <i className="fa fa-lightbulb-o mr-2"></i> 提升开发效率
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  每天安排2个3小时的专注时段，关闭邮件和消息通知，减少上下文切换。
                </p>
              </div>

              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-medium text-accent flex items-center">
                  <i className="fa fa-lightbulb-o mr-2"></i> 增加技术探索
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  每两周安排4小时学习新技术，本季度建议关注微前端或Serverless相关技术。
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium text-primary flex items-center">
                  <i className="fa fa-trophy mr-2"></i> 保持优势
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  PR审查响应及时是你的优势，建议分享你的高效协作经验给团队其他成员。
                </p>
              </div>
            </div>

            <button className="mt-5 w-full py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
              生成详细提升计划
            </button>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-dark mb-6">维度深度分析</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl overflow-hidden card-shadow card-hover border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center">
                    <i className="fa fa-code text-primary mr-2"></i>
                    代码质量
                  </h3>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    82分
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>静态代码分析问题数</span>
                      <span>3个/千行</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>缺陷逃逸率</span>
                      <span>8%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: '80%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>技术债务指数</span>
                      <span>3天工作量</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 text-primary border border-primary/30 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                  查看详细分析
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden card-shadow card-hover border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center">
                    <i className="fa fa-tachometer text-warning mr-2"></i>
                    开发效率
                  </h3>
                  <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">
                    68分
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>任务周期时间</span>
                      <span>28小时</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: '70%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>上下文切换次数</span>
                      <span>7次/天</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: '50%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>阻塞时间占比</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                </div>

                <button className="mt-4 w-full py-2 text-warning border border-warning/30 rounded-lg text-sm hover:bg-warning/5 transition-colors">
                  查看详细分析
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <footer className="bg-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fa fa-rocket text-primary text-xl"></i>
                <h2 className="text-xl font-bold">技术效能评估中心</h2>
              </div>
              <p className="text-gray-400 text-sm">
                助力开发者持续成长的全方位评估工具
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                关于系统
              </a>
              <a href="#" className="hover:text-white transition-colors">
                指标说明
              </a>
              <a href="#" className="hover:text-white transition-colors">
                使用指南
              </a>
              <a href="#" className="hover:text-white transition-colors">
                反馈建议
              </a>
              <a href="#" className="hover:text-white transition-colors">
                联系我们
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>
              © 2024 技术效能评估中心 | 保护开发者隐私 · 数据仅用于个人成长
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default TechnicalEfficiencyEvaluationCenter;
