import { RightOutlined } from '@ant-design/icons';
import { Flex, Progress } from 'antd';

/**
 * 板卡组件
 * @param param0 组件属性
 * @returns 板卡组件
 * title 人员效能
 * icon: <UserOutlined className="text-blue-600" />
 * list: [{title: '平均饱和度', value: '85%', color: 'rgb(34 197 94 / 100%)'}, {title: '人文关怀分', value: '82', color: 'rgb(255 191 0 / 100%)'}, {title: '成长力分', value: '76', color: 'rgb(255 191 0 / 100%)'}]
 */
const BoardCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  list: { title: string; value: string; color: string }[];
}> = ({ title, icon, list }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <Flex vertical gap={4}>
        {list.map((item) => {
          return (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{item.title}</span>
                <span className="font-medium">{item.value}</span>
              </div>
              <Progress
                strokeColor={item.color}
                percent={parseInt(item.value.replace('%', ''))}
              />
            </div>
          );
        })}
      </Flex>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a
          // {/* TODO: 替换为动态路由 */}
          href="/personnel-efficiency"
          className="text-blue-600 text-sm font-medium flex items-center hover:underline"
        >
          查看详情 <RightOutlined className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default BoardCard;
