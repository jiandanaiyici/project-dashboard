import { Flex, Progress, ProgressProps, Select, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { teamLoadData } from '@/mock';

const twoColors: ProgressProps['strokeColor'] = {
  '0%': '#108ee9',
  '100%': '#87d068',
};
const TrendTag = ({ text }: { text: number }) => {
  const prefix = text > 0 ? '上升' : '下降';
  const icon = text > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  return (
    <Tag icon={icon} color={text > 0 ? 'success' : 'error'} bordered={false}>
      {` ${prefix} ${text > 0 ? `+${text}` : text}%`}
    </Tag>
  );
};
/**
 * 团队成员贡献详情
 */
const ContributionTable = () => {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">团队成员贡献详情</h3>
          <p className="text-gray-500 text-sm mt-1">
            按不同维度展示成员贡献与效能
          </p>
        </div>
        <Flex gap={8}>
          <Select
            defaultValue="delivery"
            style={{ width: 200 }}
            options={[
              {
                label: '按交付量排序',
                value: 'delivery',
              },
              {
                label: '按质量评分排序',
                value: 'quality',
              },
              {
                label: '按协作效率排序',
                value: 'collaboration',
              },
              {
                label: '按改进幅度排序',
                value: 'improvement',
              },
            ]}
          />
          <Select
            style={{ width: 200 }}
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
      </div>
      <div className="overflow-x-auto">
        <Table
          size="small"
          pagination={false}
          dataSource={teamLoadData}
          columns={[
            {
              title: '成员',
              key: 'name',
              dataIndex: 'name',
              className: 'text-xs',
              render: (_text, record) => {
                return (
                  <Flex align="center">
                    <img
                      className="w-8 h-8 rounded-full mr-3"
                      src={record.avatar}
                      alt={record.name}
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {record.name}
                      </div>
                      <div className="text-xs text-gray-500">{record.role}</div>
                    </div>
                  </Flex>
                );
              },
            },
            {
              title: '角色',
              key: 'role',
              dataIndex: 'role',
              className: 'text-xs',
            },
            {
              title: '完成任务',
              className: 'text-xs',
              key: 'completedTasks',
              dataIndex: 'completedTasks',
              render: (text) => `${text} 项`,
            },
            {
              title: '故事点',
              key: 'points',
              dataIndex: 'points',
              className: 'text-xs',
              render: (text) => `${text} 点`,
            },
            {
              title: '效能评分',
              className: 'text-xs',
              dataIndex: 'performanceScore',
              key: 'performanceScore',
              render: (text) => (
                <Progress
                  percent={text}
                  strokeColor={twoColors}
                  format={(percent) => `${percent}`}
                />
              ),
            },
            {
              title: '质量指数',
              className: 'text-xs',
              key: 'qualityIndex',
              dataIndex: 'qualityIndex',
              render: (text) => (
                <Progress
                  percent={text}
                  strokeColor={twoColors}
                  format={(percent) => `${percent}`}
                />
              ),
            },
            {
              title: '协作指数',
              className: 'text-xs',
              key: 'collaborationIndex',
              dataIndex: 'collaborationIndex',
              render: (text) => (
                <Progress
                  percent={text}
                  strokeColor={twoColors}
                  format={(percent) => `${percent}`}
                />
              ),
            },
            {
              width: 80,
              title: '趋势',
              key: 'trend',
              dataIndex: 'trend',
              className: 'text-xs',
              render: (text) => <TrendTag text={text} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ContributionTable;
