import React from 'react';
import { Card, Typography } from 'antd';
import {  UserOutlined, FileDoneOutlined } from '@ant-design/icons';
import MemberTransferChart from '../components/MemberTransferChart';
import './TransferDemo.less';

const { Title, Paragraph, Text } = Typography;

const TransferDemo = () => {
  // 模拟项目数据
  const mockProjects = [
    { id: 1, name: '电商平台重构' },
    { id: 2, name: '用户管理系统升级' },
    { id: 3, name: '数据分析平台开发' },
    { id: 4, name: '移动应用优化' }
  ];

  // 模拟人员数据
  const mockUsers = [
    { id: 1, name: '张三', role: '前端开发' },
    { id: 2, name: '李四', role: '后端开发' },
    { id: 3, name: '王五', role: 'UI设计' },
    { id: 4, name: '赵六', role: '产品经理' },
    { id: 5, name: '钱七', role: '测试工程师' },
    { id: 6, name: '孙八', role: '数据分析师' }
  ];

  // 模拟人员调动数据
  const mockTransferData = [
    // 电商平台重构项目
    { userId: 1, userName: '张三', projectId: 1, projectName: '电商平台重构', startDate: '2024-01-01', endDate: '2024-02-28', percentage: 100 },
    { userId: 2, userName: '李四', projectId: 1, projectName: '电商平台重构', startDate: '2024-01-01', endDate: '2024-02-15', percentage: 80 },
    { userId: 5, userName: '钱七', projectId: 1, projectName: '电商平台重构', startDate: '2024-02-10', endDate: '2024-02-28', percentage: 100 },
    
    // 用户管理系统升级项目
    { userId: 2, userName: '李四', projectId: 2, projectName: '用户管理系统升级', startDate: '2024-02-16', endDate: '2024-03-31', percentage: 100 },
    { userId: 4, userName: '赵六', projectId: 2, projectName: '用户管理系统升级', startDate: '2024-02-01', endDate: '2024-03-31', percentage: 50 },
    { userId: 5, userName: '钱七', projectId: 2, projectName: '用户管理系统升级', startDate: '2024-03-10', endDate: '2024-03-31', percentage: 80 },
    
    // 数据分析平台开发项目
    { userId: 6, userName: '孙八', projectId: 3, projectName: '数据分析平台开发', startDate: '2024-01-15', endDate: '2024-04-30', percentage: 100 },
    { userId: 4, userName: '赵六', projectId: 3, projectName: '数据分析平台开发', startDate: '2024-01-15', endDate: '2024-04-30', percentage: 50 },
    { userId: 1, userName: '张三', projectId: 3, projectName: '数据分析平台开发', startDate: '2024-03-01', endDate: '2024-04-30', percentage: 60 },
    
    // 移动应用优化项目
    { userId: 3, userName: '王五', projectId: 4, projectName: '移动应用优化', startDate: '2024-01-01', endDate: '2024-03-15', percentage: 100 },
    { userId: 1, userName: '张三', projectId: 4, projectName: '移动应用优化', startDate: '2024-01-01', endDate: '2024-02-28', percentage: 40 },
    { userId: 5, userName: '钱七', projectId: 4, projectName: '移动应用优化', startDate: '2024-03-01', endDate: '2024-03-15', percentage: 100 }
  ];

  return (
    <div className="transfer-demo-container">
      <Title level={2} className="page-title">
        {/* <BarChart2Outlined />  */}
        人员调动分析示例
      </Title>
      
      <Card className="demo-intro-card">
        <Title level={4}>组件功能说明</Title>
        <Paragraph>
          <Text strong>人员调动图</Text> 组件提供了团队成员在不同项目间的分配情况可视化，包括：
        </Paragraph>
        <ul>
          <li className="feature-item">
            <UserOutlined className="feature-icon" />
            <Text>显示人员从哪天开始投入哪个项目，支持时间区间筛选</Text>
          </li>
          <li className="feature-item">
            <FileDoneOutlined className="feature-icon" />
            <Text>计算每个项目的投入人日、开始时间和结束时间</Text>
          </li>
          <li className="feature-item">
            {/* <BarChart2Outlined className="feature-icon" /> */}
            <Text>支持动线流转图，直观展示人员在项目间的流动</Text>
          </li>
        </ul>
      </Card>

      {/* 人员调动图组件展示 */}
      <div className="chart-demo-section">
        <MemberTransferChart 
          transferData={mockTransferData} 
          projects={mockProjects} 
          users={mockUsers} 
          loading={false} 
          title="团队成员项目调动分析"
        />
      </div>

      {/* 使用说明 */}
      <Card className="usage-guide-card">
        <Title level={4}>使用指南</Title>
        <div className="usage-content">
          <div className="usage-item">
            <Paragraph>
              <Text strong>1. 时间范围筛选：</Text> 选择起始日期和结束日期，可以查看特定时间段内的人员调动情况。
            </Paragraph>
          </div>
          <div className="usage-item">
            <Paragraph>
              <Text strong>2. 项目筛选：</Text> 选择特定项目，可以查看参与该项目的所有人员及其投入情况。
            </Paragraph>
          </div>
          <div className="usage-item">
            <Paragraph>
              <Text strong>3. 人员筛选：</Text> 选择特定人员，可以查看该人员在各个项目中的投入情况。
            </Paragraph>
          </div>
          <div className="usage-item">
            <Paragraph>
              <Text strong>4. 数据分析：</Text>
              <ul>
                <li>项目人日分布图显示各项目的总投入人日和参与人数</li>
                <li>人员项目分配明细展示每个人员在不同项目中的投入情况</li>
                <li>人员项目分配动线图直观展示人员与项目之间的分配关系</li>
                <li>项目详细信息列出每个项目的时间范围、总投入人日和参与人数</li>
              </ul>
            </Paragraph>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TransferDemo;