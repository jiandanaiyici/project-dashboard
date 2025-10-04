import { Card, Typography, Divider } from 'antd';
import EnhancedAppAnalyticsDashboard from '../../components/EnhancedAppAnalyticsDashboard';
import './index.less';

const { Title, Paragraph, Text } = Typography;

/**
 * 增强版应用埋点数据报表演示页面
 * 展示从产品经理角度补充的完整埋点数据分析功能
 */
const EnhancedAppAnalyticsDemo = () => {
  return (
    <div className="app-analytics">
      <div className="demo-header">
        <Title level={2} className="demo-title">
          应用埋点数据分析平台 - 增强版
        </Title>
        <Paragraph className="demo-description">
          从产品经理角度全面优化的应用埋点数据报表系统，提供更丰富的指标分析和可视化展示
        </Paragraph>
      </div>

      <Divider className="demo-divider" />

      <div className="demo-content">
        <Card className="demo-card">
          <div className="demo-intro">
            <Title level={4}>产品亮点</Title>
            <div className="feature-list">
              <div className="feature-item">
                <Text strong>1. 完整的核心指标体系</Text>
                <Paragraph>
                  补充了日活跃用户(DAU)、周活跃用户(WAU)、月活跃用户(MAU)、新增用户数、转化率、平均页面深度、错误率等关键指标
                </Paragraph>
              </div>
              <div className="feature-item">
                <Text strong>2. 多维度数据分析</Text>
                <Paragraph>
                  新增流量来源分析、设备分布、地域分布、用户留存分析等细分维度，帮助全面了解用户行为
                </Paragraph>
              </div>
              <div className="feature-item">
                <Text strong>3. 环比对比分析</Text>
                <Paragraph>
                  提供当前周期与上一周期的指标环比变化，清晰展示数据增长趋势
                </Paragraph>
              </div>
              <div className="feature-item">
                <Text strong>4. 响应式设计</Text>
                <Paragraph>
                  优化的界面布局，支持多种设备访问，提供良好的移动端体验
                </Paragraph>
              </div>
              <div className="feature-item">
                <Text strong>5. 性能优化</Text>
                <Paragraph>
                  实现了数据缓存机制，减少重复请求，提升系统响应速度
                </Paragraph>
              </div>
              <div className="feature-item">
                <Text strong>6. 数据导出增强</Text>
                <Paragraph>
                  支持导出完整的埋点数据报表，包含所有新增指标，满足数据分析和报表生成需求
                </Paragraph>
              </div>
            </div>
          </div>

          <Divider className="demo-intro-divider" />

          <div className="dashboard-container">
            <EnhancedAppAnalyticsDashboard />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAppAnalyticsDemo;