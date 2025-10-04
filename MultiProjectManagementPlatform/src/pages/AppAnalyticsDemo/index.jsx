import React from 'react';
import { Layout, Typography, Card, Row, Col, Divider } from 'antd';
import AppAnalyticsDashboard from '../AppAnalyticsDashboard';
import './index.less';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

/**
 * 应用埋点数据报表演示页面
 * 用于展示AppAnalyticsDashboard组件的功能和使用方式
 */
const AppAnalyticsDemo = () => {
  return (
    <Layout className="app-analytics">
      <Content className="content">
        {/* 页面标题和描述 */}
        <div className="page-header">
          <Title level={2}>应用埋点数据报表演示</Title>
          <Paragraph className="page-description">
            本页面展示应用埋点数据分析功能，支持查看各应用的访问量(PV)、独立访客(UV)、平均停留时长和跳出率等关键指标，
            并提供趋势图分析和页面级别的数据详情。您可以通过时间区间筛选数据，点击单个应用查看详细分析，
            以及查看热门应用和页面的排行榜。
          </Paragraph>
        </div>

        {/* 功能说明卡片 */}
        <Row gutter={[16, 16]} className="feature-cards">
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="数据概览" bordered={false}>
              <Paragraph>
                <Text strong>应用埋点数据报表大盘</Text> 提供了所有应用的埋点数据汇总，包括总访问量、独立访客、
                平均停留时长和平均跳出率等核心指标，帮助您快速了解整体应用使用情况。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="趋势分析" bordered={false}>
              <Paragraph>
                通过 <Text strong>趋势图</Text> 直观展示各应用的访问量变化趋势，支持时间区间筛选，
                帮助您分析应用使用的高峰和低谷，了解用户行为模式。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="页面详情" bordered={false}>
              <Paragraph>
                点击任意应用可查看 <Text strong>页面级别的详细数据</Text>，包括每个页面的访问量、独立访客、
                停留时长、跳出率、入口率和退出率等指标，帮助您优化页面体验。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="热门排行" bordered={false}>
              <Paragraph>
                展示 <Text strong>今日热门应用和页面排行榜</Text>，动态解析访问量最大的应用和页面，
                帮助您快速了解用户最关注的内容。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="数据筛选" bordered={false}>
              <Paragraph>
                支持通过 <Text strong>时间区间筛选</Text> 查看不同时间段的应用埋点数据，
                灵活选择分析周期，满足不同的数据分析需求。
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="feature-card" title="数据导出" bordered={false}>
              <Paragraph>
                提供 <Text strong>数据导出功能</Text>，支持将应用埋点数据导出为报表，方便进一步分析和分享。
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* 应用埋点数据报表大盘组件 */}
        <div className="dashboard-section">
          <Title level={3}>应用埋点数据报表大盘</Title>
          <AppAnalyticsDashboard />
        </div>

        {/* 常见问题解答 */}
        <div className="faq-section">
          <Title level={3}>常见问题</Title>
          <Card className="faq-card">
            <div className="faq-item">
              <Title level={4}>什么是PV和UV？</Title>
              <Paragraph>
                PV（Page View）表示页面访问量，即用户访问页面的次数；UV（Unique Visitor）表示独立访客数，
                即访问页面的不同用户数量。同一用户多次访问会增加PV，但UV只计算一次。
              </Paragraph>
            </div>
            <Divider type="vertical" className="faq-divider" />
            <div className="faq-item">
              <Title level={4}>如何理解跳出率？</Title>
              <Paragraph>
                跳出率表示用户只访问了一个页面就离开网站的比例。跳出率高可能意味着页面内容不够吸引人，
                或者用户没有找到他们需要的信息。
              </Paragraph>
            </div>
            <Divider type="vertical" className="faq-divider" />
            <div className="faq-item">
              <Title level={4}>时间筛选支持哪些范围？</Title>
              <Paragraph>
                系统支持自定义时间范围，您可以选择任意时间段的数据进行分析，包括按日、周、月或自定义时间区间。
              </Paragraph>
            </div>
          </Card>
        </div>

        {/* 注意事项 */}
        <div className="notes-section">
          <Title level={4}>注意事项</Title>
          <Card className="notes-card">
            <Paragraph>
              <Text type="warning">演示说明：</Text> 本页面使用的是模拟数据，实际应用中请连接真实的埋点数据接口。
              模拟数据包含5个应用的过去7天埋点数据，以及各应用的页面级埋点数据。
            </Paragraph>
            <Paragraph>
              <Text type="success">数据更新：</Text> 点击"刷新"按钮可重新加载数据；点击"导出数据"按钮可模拟数据导出功能。
            </Paragraph>
            <Paragraph>
              <Text type="info">交互说明：</Text> 点击应用名称或"查看详情"按钮可查看应用的详细分析，包括趋势图和页面数据。
            </Paragraph>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AppAnalyticsDemo;