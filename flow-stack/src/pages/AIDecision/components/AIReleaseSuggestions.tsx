import {
  CheckCircleOutlined,
  SolutionOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  List,
  Row,
  Spin,
  Table,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from 'react';
import { generateReleaseRecommendations } from '../service';

const { Text, Title, Paragraph } = Typography;

const AIReleaseSuggestions = ({ readinessData }: { readinessData: any }) => {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);

  /**
   * 生成发布建议
   */
  const generateRecommendations = async () => {
    if (!readinessData) return;

    setRecommendationLoading(true);
    try {
      const result = await generateReleaseRecommendations(readinessData);
      setRecommendation(result);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setRecommendationLoading(false);
    }
  };

  // 渲染发布建议
  const renderRecommendations = () => {
    if (!recommendation) return null;

    return (
      <div className="space-y-6">
        <Card className="hover:shadow-md transition-shadow bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <SolutionOutlined
              style={{
                fontSize: '20px',
                color: '#1890ff',
                marginRight: 16,
                marginTop: 4,
              }}
            />
            <div>
              <Title level={5} className="mb-2 text-blue-800">
                推荐发布策略: {recommendation.recommendedStrategy}
              </Title>
              <Paragraph className="text-sm text-blue-700 mb-0">
                基于当前项目状态和风险评估，AI推荐采用分阶段灰度发布策略，逐步扩大用户范围，
                同时密切监控系统表现，确保发布质量。
              </Paragraph>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                建议发布时间
              </Title>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-green-100 text-green-600 text-xl font-bold mb-4">
                  {recommendation.recommendedTimeline.targetDate}
                </div>
                <div className="space-y-2">
                  <Text type="secondary" className="text-sm">
                    预计就绪日期:{' '}
                    {recommendation.recommendedTimeline.readinessDate}
                  </Text>
                  <Text type="secondary" className="text-sm">
                    时间预测可信度:{' '}
                    {recommendation.recommendedTimeline.confidence}%
                  </Text>
                  <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                    <Text type="secondary">推荐理由:</Text>
                    <Text className="block mt-1">
                      {recommendation.recommendedTimeline.rationale}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                发布前必须完成的事项
              </Title>
              <List
                dataSource={recommendation.prerequisites}
                renderItem={(item: any, index) => (
                  <List.Item key={index} className="border-b last:border-0">
                    <List.Item.Meta
                      avatar={
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.criticality === '必须'
                              ? 'bg-red-100 text-red-500'
                              : 'bg-orange-100 text-orange-500'
                          }`}
                        >
                          <span>{index + 1}</span>
                        </div>
                      }
                      title={
                        <div className="flex justify-between">
                          <Text>{item.item}</Text>
                          <Tag
                            color={
                              item.criticality === '必须' ? 'red' : 'orange'
                            }
                          >
                            {item.criticality}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                          <div>
                            <Text type="secondary">负责人: </Text>
                            <Text>{item.owner}</Text>
                          </div>
                          <div>
                            <Text type="secondary">预计时间: </Text>
                            <Text>{item.estimatedTime}</Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Card className="hover:shadow-md transition-shadow">
          <Title level={5} className="mb-4">
            分阶段发布计划
          </Title>
          <Timeline mode="left">
            {Object.entries(recommendation.releasePlan).map(
              ([phase, details]: [string, any]) => (
                <Timeline.Item
                  key={phase}
                  label={
                    <div className="text-right">
                      <Text strong>{details.date}</Text>
                      <div className="text-xs text-gray-500">
                        {details.audience}
                      </div>
                    </div>
                  }
                >
                  <Card>
                    <Title level={5} className="mb-1">
                      {phase.replace('phase', '阶段')}: {details.scope}
                      {details.percentage && (
                        <Badge
                          className="ml-2"
                          text={`${details.percentage} 用户`}
                        />
                      )}
                    </Title>
                    <Text type="secondary" className="text-sm">
                      重点关注: {details.focus}
                    </Text>
                  </Card>
                </Timeline.Item>
              )
            )}
          </Timeline>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                风险缓解措施
              </Title>
              <List
                dataSource={recommendation.riskMitigation}
                renderItem={(item: any, index) => (
                  <List.Item key={index} className="border-b last:border-0">
                    <List.Item.Meta
                      avatar={
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.impact === '高'
                              ? 'bg-red-100 text-red-500'
                              : item.impact === '中'
                                ? 'bg-orange-100 text-orange-500'
                                : 'bg-blue-100 text-blue-500'
                          }`}
                        >
                          <WarningOutlined />
                        </div>
                      }
                      title={
                        <div className="flex justify-between">
                          <Text>{item.risk}</Text>
                          <div className="flex gap-2">
                            <Tag
                              color={
                                item.impact === '高'
                                  ? 'red'
                                  : item.impact === '中'
                                    ? 'orange'
                                    : 'blue'
                              }
                            >
                              影响: {item.impact}
                            </Tag>
                            <Tag
                              color={
                                item.probability === '高'
                                  ? 'red'
                                  : item.probability === '中'
                                    ? 'orange'
                                    : 'blue'
                              }
                            >
                              概率: {item.probability}
                            </Tag>
                          </div>
                        </div>
                      }
                      description={
                        <div className="mt-2">
                          <Text type="secondary" className="text-sm block mb-2">
                            缓解措施:
                          </Text>
                          <Text className="text-sm ml-4 list-disc list-inside">
                            {item.mitigation
                              .split('; ')
                              .map(
                                (
                                  measure:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                        any,
                                        string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined,
                                  i: Key | null | undefined
                                ) => (
                                  <div key={i}>{measure}</div>
                                )
                              )}
                          </Text>
                          <div className="mt-2 flex items-center text-sm">
                            <UserOutlined className="mr-1 text-gray-400" />
                            <Text type="secondary">负责人: {item.owner}</Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="hover:shadow-md transition-shadow">
              <Title level={5} className="mb-4">
                发布准备检查清单
              </Title>
              <div className="space-y-6">
                {recommendation.checklist.map(
                  (category: any, index: number) => (
                    <div key={index}>
                      <Title level={5} className="mb-2">
                        {category.category}
                      </Title>
                      <div className="ml-4 space-y-2">
                        {category.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-start">
                            <div className="w-5 h-5 rounded border border-gray-300 mt-0.5 mr-2 flex-shrink-0"></div>
                            <Text className="text-sm">{item}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
                <Button type="primary" size="small" className="mt-4">
                  导出检查清单
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="hover:shadow-md transition-shadow">
          <Title level={5} className="mb-4">
            发布后监控重点
          </Title>
          <Table
            dataSource={recommendation.monitoringFocus}
            rowKey="metric"
            pagination={false}
          >
            <Table.Column title="监控指标" dataIndex="metric" key="metric" />
            <Table.Column title="目标值" dataIndex="target" key="target" />
            <Table.Column
              title="优先级"
              dataIndex="priority"
              key="priority"
              render={(priority) => (
                <Tag color={priority === '高' ? 'red' : 'orange'}>
                  {priority}
                </Tag>
              )}
            />
            <Table.Column
              title="监控措施"
              key="measures"
              render={() => (
                <Text type="secondary" className="text-sm">
                  实时监控 + 每小时报告 + 异常告警
                </Text>
              )}
            />
          </Table>
        </Card>

        <Card className="hover:shadow-md transition-shadow flex flex-col items-center justify-center p-6 border-dashed">
          <div className="text-center">
            <Title level={5} className="mb-4">
              执行发布计划
            </Title>
            <Paragraph className="text-sm text-gray-500 mb-6 max-w-2xl">
              确认发布建议后，系统将生成详细的发布执行计划，并通知相关团队成员做好准备。
              您可以根据实际情况调整计划后再执行。
            </Paragraph>
            <div className="flex gap-4">
              <Button size="large">保存为草稿</Button>
              <Button size="large">调整计划</Button>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
              >
                确认并执行
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <Title level={5} className="mb-0">
          AI发布建议
        </Title>
        <Button
          type="primary"
          // icon={<ZapOutlined />}
          onClick={generateRecommendations}
          loading={recommendationLoading}
        >
          {recommendation ? '重新生成建议' : '生成发布建议'}
        </Button>
      </div>

      {recommendationLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spin size="large" />
          <Text type="secondary" className="mt-4">
            AI正在分析项目数据并生成最佳发布方案...
          </Text>
        </div>
      ) : recommendation ? (
        renderRecommendations()
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-blue-50 border border-blue-200 rounded">
          {/* <ZapOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} /> */}
          <Title level={4} className="text-blue-800">
            获取AI发布建议
          </Title>
          <Paragraph className="text-sm text-blue-700 mb-6 text-center max-w-2xl">
            点击上方按钮生成AI驱动的发布建议方案，包括最佳发布时间、风险缓解措施和分阶段发布计划，
            帮助您安全顺利地完成发布。
          </Paragraph>
          <Button
            type="primary"
            // icon={<ZapOutlined />}
            onClick={generateRecommendations}
          >
            立即生成发布建议
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AIReleaseSuggestions;
