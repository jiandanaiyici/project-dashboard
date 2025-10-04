import React from 'react';
import './index.less';

/**
 * 人员饱和度卡片组件
 * 展示单个团队成员的工作量饱和度及相关统计数据
 */
const MemberSaturationCard = ({
  name,
  role,
  avatarUrl,
  saturation,
  applications,
  tasks,
  overtimeDays,
  onHover,
}) => {
  // 根据饱和度确定状态类型和颜色
  const getSaturationStatus = () => {
    if (saturation > 80) {
      return { type: 'danger', level: '超载', colorClass: 'saturation-danger' };
    }
    if (saturation > 60) {
      return { type: 'warning', level: '正常', colorClass: 'saturation-warning' };
    }
    return { type: 'success', level: '空闲', colorClass: 'saturation-success' };
  };

  const status = getSaturationStatus();

  return (
    <div 
      className={`member-saturation-card p-3 rounded-lg ${status.colorClass}/5 border border-${status.colorClass}/20 hover-lift`}
      onMouseEnter={onHover}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={avatarUrl} 
            alt={name} 
            className="w-10 h-10 rounded-full mr-3"
            loading="lazy"
          />
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-dark">{role}</p>
          </div>
        </div>
        <span className={`text-${status.type} font-semibold`}>{saturation}%</span>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-1">
          <span>工作量饱和度</span>
          <span>{status.level}</span>
        </div>
        <div className="w-full bg-gray-light rounded-full h-2">
          <div 
            className={`bg-${status.type} h-2 rounded-full`}
            style={{ width: `${saturation}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-white rounded p-2 text-center">
          <p className="text-gray-dark">负责应用</p>
          <p className="font-medium">{applications}个</p>
        </div>
        <div className="bg-white rounded p-2 text-center">
          <p className="text-gray-dark">任务数</p>
          <p className="font-medium">{tasks}个</p>
        </div>
        <div className="bg-white rounded p-2 text-center">
          <p className="text-gray-dark">加班天数</p>
          <p className={`font-medium ${overtimeDays > 3 ? 'text-danger' : 'text-gray-dark'}`}>
            {overtimeDays}天
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberSaturationCard;