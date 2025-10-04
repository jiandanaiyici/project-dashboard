import { releaseInfoHistory } from '@/mock';
import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Flex, Select } from 'antd';

/**
 * 发布历史
 */
const ReleaseHistory = () => {
  return (
    <Flex
      vertical
      gap={12}
      className="bg-white rounded-xl p-6 card-shadow mt-6"
    >
      <Flex gap={16} align="center" justify="space-between" className="mb-6">
        <Flex vertical>
          <h3 className="font-semibold text-gray-800">发布历史</h3>
          <p className="text-gray-500 text-sm mt-1">过去6个月的发布记录</p>
        </Flex>
        <Select
          style={{ width: 200 }}
          defaultValue="all"
          options={[
            { value: 'all', label: '所有环境' },
            { value: 'dev', label: '开发环境' },
            { value: 'test', label: '测试环境' },
            { value: 'pre', label: '预发布环境' },
            { value: 'prod', label: '生产环境' },
          ]}
        />
      </Flex>
      <Flex vertical gap={12}>
        {releaseInfoHistory.map((release, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full bg-${release.statusColor}/10 flex items-center justify-center mr-3`}
                >
                  <i
                    className={`fa fa-${release.status === '成功' ? 'check' : 'times'} text-${release.statusColor}`}
                  ></i>
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {release.environment}发布 {release.version}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {release.date} · 由 {release.submitter} 发布
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                <span
                  className={`px-2 py-0.5 bg-${release.statusColor}/10 text-${release.statusColor} text-xs rounded-full`}
                >
                  {release.status}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">功能数</div>
                <div className="font-medium mt-1">{release.features}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">Bug修复</div>
                <div className="font-medium mt-1">{release.bugfixes}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">部署方式</div>
                <div className="font-medium mt-1">{release.deployType}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">耗时</div>
                <div className="font-medium mt-1">{release.duration}</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center text-xs text-gray-600">
                <i
                  className={`fa fa-${release.descriptionIcon} text-${release.descriptionIconColor} mr-2`}
                ></i>
                <span>{release.description}</span>
              </div>
              <div className="flex space-x-2">
                <button className="text-primary text-xs hover:underline">
                  查看详情
                </button>
                <button className="text-gray-500 text-xs hover:text-gray-700">
                  {release.status === '失败' ? '失败分析' : '对比差异'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Flex>
      <Button block icon={<FieldTimeOutlined />}>
        查看更多发布历史
      </Button>
    </Flex>
  );
};

export default ReleaseHistory;
