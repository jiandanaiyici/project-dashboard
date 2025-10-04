import React from 'react';
import { Row, Col } from 'antd';
import MemberSaturationCard from '../components/MemberSaturationCard';
import './SaturationDemo.less';

/**
 * 人员饱和度卡片演示页面
 * 展示如何使用MemberSaturationCard组件
 */
const SaturationDemo = () => {
  // 模拟数据 - 高负荷成员
  const highLoadMember = {
    name: '李开发',
    role: '前端开发',
    avatarUrl: 'https://picsum.photos/id/1012/200/200',
    saturation: 92,
    applications: 3,
    tasks: 12,
    overtimeDays: 5
  };

  // 模拟数据 - 正常负荷成员
  const normalLoadMember = {
    name: '赵数据',
    role: '数据分析师',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    saturation: 75,
    applications: 2,
    tasks: 6,
    overtimeDays: 1
  };

  // 模拟数据 - 低负荷成员
  const lowLoadMember = {
    name: '陈文档',
    role: '技术文档',
    avatarUrl: 'https://picsum.photos/id/1074/200/200',
    saturation: 52,
    applications: 1,
    tasks: 3,
    overtimeDays: 0
  };

  // 处理卡片悬停事件
  const handleCardHover = (memberName) => {
    console.log(`Hovered on ${memberName}'s card`);
    // 这里可以添加更多的交互逻辑，比如显示详情弹窗等
  };

  return (
    <div className="saturation-demo-container">
      <h1 className="demo-title">人员饱和度卡片演示</h1>
      <p className="demo-description">
        以下是不同工作饱和度的人员卡片示例。卡片根据饱和度自动显示不同的颜色和状态标识。
      </p>

      <div className="demo-cards-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <MemberSaturationCard
              {...highLoadMember}
              onHover={() => handleCardHover(highLoadMember.name)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <MemberSaturationCard
              {...normalLoadMember}
              onHover={() => handleCardHover(normalLoadMember.name)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <MemberSaturationCard
              {...lowLoadMember}
              onHover={() => handleCardHover(lowLoadMember.name)}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SaturationDemo;