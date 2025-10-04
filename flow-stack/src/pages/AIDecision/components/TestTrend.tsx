import { Line } from '@ant-design/plots';
import { Card, Col, Row, Select, Typography, Badge, Skeleton } from 'antd';

const { Text, Title } = Typography;

/**
 * 测试趋势
 */
const TestTrend = ({
  readinessData,
  loading,
}: {
  readinessData: any;
  loading: boolean;
}) => {
  const testTrendConfig = {
    data: readinessData?.testTrend,
    xField: 'date',
    yField: ['passRate', 'defects'],
    yAxis: [
      {
        field: 'passRate',
        name: '通过率 (%)',
        min: 70,
        max: 100,
        formatter: (v: number) => `${v}%`,
      },
      {
        field: 'defects',
        name: '缺陷数',
        min: 0,
        max: 15,
        grid: {
          visible: false,
        },
      },
    ],
    legend: {
      position: 'top',
    },
  };

  return (
    <Skeleton loading={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Title level={5} className="mb-0">
                测试趋势
              </Title>
              <Select
                defaultValue="week"
                size="small"
                options={[
                  { value: 'week', label: '近一周' },
                  { value: 'month', label: '近一月' },
                ]}
              />
            </div>
            <div className="h-64">
              <Line {...testTrendConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <Title level={5} className="mb-0">
                已知缺陷分布
              </Title>
              <Text type="secondary" className="text-sm">
                查看全部
              </Text>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <Text>严重缺陷</Text>
                  </div>
                  <Badge
                    count={readinessData?.knownDefects[0].count}
                    color="error"
                  />
                </div>
                <div className="ml-5 text-sm text-gray-600">
                  {readinessData?.knownDefects[0].details.map(
                    (detail: string, i: number) => (
                      <div key={i} className="mb-1">
                        - {detail}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <Text>主要缺陷</Text>
                  </div>
                  <Badge
                    count={readinessData?.knownDefects[1].count}
                    color="warning"
                  />
                </div>
                <div className="ml-5 text-sm text-gray-600">
                  {readinessData?.knownDefects[1].details.map(
                    (detail: string, i: number) => (
                      <div key={i} className="mb-1">
                        - {detail}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <Text>次要缺陷</Text>
                  </div>
                  <Badge
                    count={readinessData?.knownDefects[2].count}
                    color="info"
                  />
                </div>
                <div className="ml-5 text-sm text-gray-600">
                  {readinessData?.knownDefects[2].details[0]}等共
                  {readinessData?.knownDefects[2].count}项
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Skeleton>
  );
};

export default TestTrend;
