import React from 'react';
import { List, Avatar, Space, Typography } from 'antd';
import { CodeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProjectSummary = ({ projects }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={projects}
      renderItem={(project) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar 
                icon={<CodeOutlined />} 
                style={{ backgroundColor: '#1890ff' }} 
              />
            }
            title={project.name}
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary">{project.role}</Text>
                <Space size="middle">
                  <Text type="secondary">
                    <UserOutlined /> {project.commits} 次提交
                  </Text>
                  <Text type="secondary">
                    <ClockCircleOutlined /> {project.hours} 小时
                  </Text>
                </Space>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ProjectSummary;
