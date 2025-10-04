import { Button, Flex, Select } from 'antd';
import { teamLoadData } from '../ProjectManagement/constant';
import ContributionTable from './components/ContributionTable';

/**
 * 成员贡献
 */
const MemberContributions = () => {
  return (
    <section
      id="member-contribution"
      className="performance-section section-transition"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">团队平均效能评分</div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fa fa-users text-gray-500"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            86.5
            <span className="text-base font-normal text-gray-500 ml-1">
              /100
            </span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i>较上月提升 2.3 分
          </div>
          <div className="mt-3 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
              <div
                className="h-full bg-gradient-to-r from-danger via-warning to-success rounded-full"
                style={{ width: '86.5%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">任务完成率</div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fa fa-check-square-o text-gray-500"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            92
            <span className="text-base font-normal text-gray-500 ml-1">%</span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i>较上月提升 3%
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">分布：</span>{' '}
            8人完成率超90%，1人需提升
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 card-shadow hover-lift">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">协作贡献指数</div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fa fa-comments-o text-gray-500"></i>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold">
            88
            <span className="text-base font-normal text-gray-500 ml-1">
              /100
            </span>
          </div>
          <div className="mt-1 text-xs text-success">
            <i className="fa fa-arrow-up mr-1"></i>较上月提升 1.5 分
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <span className="font-medium">亮点：</span> 代码审查响应及时率96%
          </div>
        </div>
      </div>
      <ContributionTable />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <Flex align="center" justify="space-between" className="mb-6">
            <Flex vertical gap={6}>
              <h3 className="font-semibold text-gray-800">成员效能分布</h3>
              <p className="text-gray-500 text-sm">团队成员效能评分分布情况</p>
            </Flex>
            <Select
              style={{ width: 120 }}
              defaultValue="thisIteration"
              options={[
                {
                  label: '本迭代',
                  value: 'thisIteration',
                },
                {
                  label: '近30天',
                  value: 'last30Days',
                },
                {
                  label: '本季度',
                  value: 'thisQuarter',
                },
                {
                  label: '全年',
                  value: 'thisYear',
                },
              ]}
            />
          </Flex>
          {/* TODO 图表 */}
          <div className="h-64">
            <canvas id="memberPerformanceDistributionChart"></canvas>
          </div>

          <div className="mt-4 text-xs text-gray-600">
            <p>
              <i className="fa fa-info-circle text-primary mr-1"></i>{' '}
              效能评分基于交付量、质量和协作多维度计算
            </p>
            <p className="mt-1">
              <i className="fa fa-check-circle text-success mr-1"></i> 87.5%
              成员达到或超过团队平均水平
            </p>
          </div>
        </div>

        <Flex vertical className="bg-white rounded-xl p-6 card-shadow">
          <Flex className="flex items-center justify-between mb-6">
            <Flex vertical gap={2}>
              <h3 className="font-semibold text-gray-800">核心成员贡献趋势</h3>
              <p className="text-gray-500 text-sm">近3个迭代的效能变化趋势</p>
            </Flex>
            <Button type="text" className="text-效能 text-sm">
              添加成员
            </Button>
          </Flex>
          <div className="h-64">
            <canvas id="keyMemberTrendChart"></canvas>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>李工程师</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-效能 mr-2"></div>
              <span>王测试</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
              <span>陈开发</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-创新 mr-2"></div>
              <span>赵架构</span>
            </div>
          </div>
        </Flex>
      </div>
    </section>
  );
};

export default MemberContributions;
