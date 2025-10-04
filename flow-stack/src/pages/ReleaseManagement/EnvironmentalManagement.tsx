import type { Environment } from './types';

/**
 * 环境管理
 */
const EnvironmentalManagement = ({
  environments,
}: {
  environments: Environment[];
}) => {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">环境管理</h3>
          <p className="text-gray-500 text-sm mt-1">部署环境配置与状态</p>
        </div>
        <button className="text-primary text-sm hover:underline">
          管理环境
        </button>
      </div>

      <div className="space-y-4">
        {environments.map((env, index) => (
          <div
            key={index}
            className={`border border-gray-200 rounded-lg p-4 hover:border-${env.envColor} transition-colors cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full bg-${env.envColor} mr-2`}
                ></div>
                <h4 className="font-medium text-gray-800">{env.name}</h4>
              </div>
              <span
                className={`px-2 py-0.5 bg-${env.statusColor}/10 text-${env.statusColor} text-xs rounded-full`}
              >
                {env.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">当前版本</div>
                <div className="font-medium mt-1">{env.version}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">上次部署</div>
                <div className="font-medium mt-1">{env.lastDeploy}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">服务器</div>
                <div className="font-medium mt-1">{env.servers}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-gray-500">状态</div>
                <div
                  className={`font-medium mt-1 text-${env.runningStatusColor}`}
                >
                  {env.runningStatus}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnvironmentalManagement;
