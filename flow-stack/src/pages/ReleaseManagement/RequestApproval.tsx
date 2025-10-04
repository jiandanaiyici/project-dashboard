import { ChangeItem } from './types';
import { approvalSteps } from '@/mock';
/**
 * 请求审批
 */
const RequestApproval = ({ changeItems }: { changeItems: ChangeItem[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">变更项列表</h3>
            <p className="text-gray-500 text-sm mt-1">待发布的功能和Bug修复</p>
          </div>
        </div>

        {/* 变更项表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  变更项
                </th>
                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提交人
                </th>
                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  风险等级
                </th>
                <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {changeItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      ID: {item.id}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full bg-${item.type.color}-100 text-${item.type.color}-800`}
                    >
                      {item.type.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={item.submitter.avatar}
                        alt={item.submitter.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-800">
                        {item.submitter.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full bg-${item.riskLevel.color}-100 text-${item.riskLevel.color}-800`}
                    >
                      {item.riskLevel.name}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-3 whitespace-nowrap text-sm text-${item.statusColor}`}
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">显示 1-5 项，共 12 项</div>
          <div className="flex space-x-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              3
            </button>
          </div>
        </div>
      </div>

      {/* 审批流程 */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-800">生产环境发布审批</h3>
            <p className="text-gray-500 text-sm mt-1">
              v2.0.0 生产发布审批流程
            </p>
          </div>
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            待审批
          </span>
        </div>

        {/* 审批进度 */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {approvalSteps.map((step, index) => (
              <div key={index} className="relative pl-10 pb-6">
                <div
                  className={`absolute left-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${step.isActive ? 'z-10' : ''}`}
                  style={{
                    backgroundColor:
                      step.status === '已通过'
                        ? '#52c41a'
                        : step.status === '待审批'
                          ? '#faad14'
                          : '#d9d9d9',
                  }}
                >
                  <i className={`fa fa-${step.icon} text-white text-xs`}></i>
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${step.status === '已通过' ? 'bg-success/10 text-success' : step.status === '待审批' ? 'bg-warning/10 text-warning' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-xs text-gray-500">
                      审批人: {step.approver}
                    </span>
                  </div>
                  {step.description && (
                    <p className="mt-1 text-xs text-gray-600">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-6 w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center">
          <i className="fa fa-file-text-o mr-2"></i>查看完整审批单
        </button>
      </div>
    </div>
  );
};

export default RequestApproval;
