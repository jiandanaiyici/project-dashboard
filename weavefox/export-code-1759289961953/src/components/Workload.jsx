import React from 'react';
import { Progress, Typography, Space } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Workload = ({ workload }) => {
  return (
    <div>
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Text type="secondary">工作时长</Text>
          <Title level={4} className="!mb-0">{workload?.hours || 0} 小时</Title>
          <Progress percent={70} status="normal" showInfo={false} />
        </div>
        
        <div>
          <Text type="secondary">效率指数</Text>
          <Title level={4} className="!mb-0">{workload?.efficiency || 0}%</Title>
          <Progress percent={workload?.efficiency || 0} status="active" strokeColor="#52c41a" />
        </div>
        
        <div>
          <Text type="secondary">荷载率</Text>
          <Title level={4} className="!mb-0">{workload?.loadRate || 0}%</Title>
          <Progress 
            percent={workload?.loadRate || 0} 
            status={workload?.loadRate > 80 ? "exception" : "normal"} 
            strokeColor={workload?.loadRate > 80 ? "#ff4d4f" : "#1890ff"} 
          />
        </div>
      </Space>
    </div>
  );
};

export default Workload;
