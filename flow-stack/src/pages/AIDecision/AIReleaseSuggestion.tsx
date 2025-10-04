import {
  Statistic,
  Badge,
  Progress,
  Spin,
  Row,
  Col,
  Card,
  Typography,
  Tooltip,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import TestTrend from './components/TestTrend';

import { useReadinessData } from './hooks';
import AIReleaseSuggestions from './components/AIReleaseSuggestions';
import PendingItems from './components/PendingItems';

const { Text } = Typography;

/**
 * 发布建议
 */
const AIReleaseSuggestion = ({ projectId }: { projectId: string }) => {
  const [readinessData, loading, fetchReleaseReadiness] = useReadinessData();

  /**
   * 渲染发布就绪度评分卡片
   */
  const renderReadinessScore = () => {
    if (!readinessData) return null;

    let scoreColor = '#FAAD14'; // 中
    if (readinessData.releaseReadinessScore >= 80) {
      scoreColor = '#52C41A'; // 高
    } else if (readinessData.releaseReadinessScore < 60) {
      scoreColor = '#F5222D'; // 低
    }

    let riskColor = '#FAAD14';
    if (readinessData.releaseRiskLevel === '低') {
      riskColor = '#52C41A';
    } else if (readinessData.releaseRiskLevel === '高') {
      riskColor = '#F5222D';
    }

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="发布就绪度评分"
            className="hover:shadow-md transition-shadow h-100"
            extra={
              <ReloadOutlined
                className="cursor-pointer"
                onClick={() => {
                  fetchReleaseReadiness();
                }}
              />
            }
          >
            <div className="flex items-center mt-2">
              <Statistic
                value={readinessData.releaseReadinessScore}
                valueStyle={{ fontSize: '36px', color: scoreColor }}
                suffix="/100"
              />
              <Badge
                className="ml-4"
                status={
                  readinessData.releaseReadinessScore >= 80
                    ? 'success'
                    : readinessData.releaseReadinessScore < 60
                      ? 'error'
                      : 'warning'
                }
                text={
                  readinessData.releaseReadinessScore >= 80
                    ? '已就绪'
                    : readinessData.releaseReadinessScore < 60
                      ? '未就绪'
                      : '基本就绪'
                }
              />
            </div>
            <Progress
              percent={readinessData.releaseReadinessScore}
              status={
                readinessData.releaseReadinessScore >= 80
                  ? 'success'
                  : readinessData.releaseReadinessScore < 60
                    ? 'exception'
                    : 'active'
              }
              className="mt-4"
            />
            <div className="mt-4">
              <Text type="secondary" className="text-sm">
                发布风险等级:{' '}
              </Text>
              <Text
                style={{ color: riskColor, fontWeight: 'bold' }}
                className="ml-2"
              >
                {readinessData.releaseRiskLevel}风险
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="hover:shadow-md transition-shadow h-100"
            title={
              <Tooltip title="维度就绪度较低，建议检查并改进">
                <Text type="secondary">各维度就绪度</Text>
              </Tooltip>
            }
            extra={
              <Text type="secondary" className="text-sm">
                详情
              </Text>
            }
          >
            <div className="mt-4 space-y-4">
              {readinessData.dimensionScores.map((item: any, index: number) => {
                let statusColor = '#FAAD14';
                if (item.status === '优秀') statusColor = '#52C41A';
                if (item.status === '风险') statusColor = '#F5222D';

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <Text className="text-sm">{item.dimension}</Text>
                      <Text className="text-sm" style={{ color: statusColor }}>
                        {item.score}分 ({item.status})
                      </Text>
                    </div>
                    <Progress
                      percent={item.score}
                      size="small"
                      status={
                        item.status === '优秀'
                          ? 'success'
                          : item.status === '风险'
                            ? 'exception'
                            : 'active'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  // 主渲染函数
  return (
    <div className="space-y-6">
      {loading ? (
        <Card className="h-64 flex items-center justify-center">
          <Spin size="large" />
        </Card>
      ) : (
        renderReadinessScore()
      )}
      <TestTrend loading={loading} readinessData={readinessData} />
      <PendingItems loading={loading} readinessData={readinessData} />
      <AIReleaseSuggestions readinessData={readinessData} />
    </div>
  );
};

export default AIReleaseSuggestion;
