import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { 
  CodeOutlined, 
  DatabaseOutlined, 
  DesktopOutlined, 
  CloudServerOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const MetricCard = ({ metric, statusMap }) => {
  const navigate = useNavigate();
  
  // 角色图标映射
  const roleIcons = {
    backend: <CodeOutlined />,
    frontend: <DesktopOutlined />,
    devops: <CloudServerOutlined />,
    data: <DatabaseOutlined />,
    security: <SafetyCertificateOutlined />
  };

  const statusInfo = statusMap[metric.status] || { color: 'default', text: '未知' };

  return (
    <Card 
      hoverable
      onClick={() => navigate(`/metrics/${metric.id}`)}
      className="h-full transition-all hover:shadow-lg"
    >
      <div className="flex justify-between items-start mb-3">
        <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        <Tag color="blue">{metric.category}</Tag>
      </div>
      
      <Title level={4} className="!mb-2">{metric.name}</Title>
      <Text type="secondary" className="text-sm mb-4 block">{metric.description}</Text>
      
      <div className="flex justify-between items-center">
        <Space>
          {metric.role.slice(0, 2).map(role => (
            <Tag key={role} icon={roleIcons[role]} color="default">
              {role === 'backend' ? '后端' : 
               role === 'frontend' ? '前端' : 
               role === 'devops' ? 'DevOps' : 
               role === 'data' ? '数据' : 
               role === 'security' ? '安全' : '通用'}
            </Tag>
          ))}
          {metric.role.length > 2 && (
            <Tag>+{metric.role.length - 2}</Tag>
          )}
        </Space>
        <div className="text-lg font-semibold text-gray-800">{metric.value}</div>
      </div>
    </Card>
  );
};

export default MetricCard;
