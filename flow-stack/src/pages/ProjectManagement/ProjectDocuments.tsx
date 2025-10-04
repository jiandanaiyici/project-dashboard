import {
  FileTextOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DownloadOutlined,
  CalendarOutlined,
  HistoryOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Bar } from '@ant-design/charts';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  List,
  Menu,
  Row,
  Select,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import { documents, recentDocuments, documentStatsConfig } from '@/mock';

const { Text, Title } = Typography;
/** 项目文档 */
const ProjectDocuments = () => {
  /** 渲染文档项 */
  const renderDocumentItem = (doc: any, type: string) => {
    let icon = <FileTextOutlined />;
    let iconColor = '#1890ff';

    switch (type) {
      case 'requirements':
        icon = <FileTextOutlined />;
        iconColor = '#1890ff';
        break;
      case 'design':
        icon = <FileTextOutlined />;
        iconColor = '#722ed1';
        break;
      case 'test':
        icon = <FileTextOutlined />;
        iconColor = '#52c41a';
        break;
      default:
        break;
    }

    return (
      <Card
        size="small"
        className="mb-3 hover:shadow-md transition-shadow cursor-pointer"
        bodyStyle={{ padding: '12px' }}
      >
        <div className="flex justify-between items-start">
          <Text strong className="text-sm">
            {doc.title}
          </Text>
          {doc.status === 'latest' ? (
            <Tag color="success">最新版</Tag>
          ) : (
            <Tag color="warning">需更新</Tag>
          )}
        </div>
        <div className="flex justify-between items-center mt-3">
          <Text type="secondary" className="text-xs">
            <UserOutlined className="mr-1" /> {doc.owner}
          </Text>
          <Text type="secondary" className="text-xs">
            {doc.views ? (
              <>
                <EyeOutlined className="mr-1" /> {doc.views} 次查看
              </>
            ) : (
              <>
                <CalendarOutlined className="mr-1" /> {doc.date}
              </>
            )}
          </Text>
        </div>
      </Card>
    );
  };

  // 渲染最近文档项
  const renderRecentDocumentItem = (doc: {
    id?: string;
    title: any;
    owner: any;
    date: any;
    downloads: any;
    type: any;
  }) => {
    let icon = <FileTextOutlined />;
    let iconColor = '#1890ff';

    switch (doc.type) {
      case 'pdf':
        icon = <FileTextOutlined />;
        iconColor = '#1890ff';
        break;
      case 'word':
        icon = <FileTextOutlined />;
        iconColor = '#52c41a';
        break;
      case 'code':
        icon = <FileTextOutlined />;
        iconColor = '#722ed1';
        break;
      case 'ppt':
        icon = <FileTextOutlined />;
        iconColor = '#faad14';
        break;
      default:
        break;
    }

    const menu = (
      <Menu>
        <Menu.Item icon={<DownloadOutlined />}>下载</Menu.Item>
        <Menu.Item icon={<HistoryOutlined />}>历史版本</Menu.Item>
        <Menu.Item icon={<MoreOutlined />}>更多操作</Menu.Item>
      </Menu>
    );

    return (
      <List.Item
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        actions={[
          <Dropdown overlay={menu} placement="bottomRight">
            <MoreOutlined />
          </Dropdown>,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={icon} style={{ backgroundColor: iconColor }} />}
          title={
            <Text strong className="text-sm">
              {doc.title}
            </Text>
          }
          description={
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-3">
                <UserOutlined className="mr-1" /> {doc.owner}
              </span>
              <span className="mr-3">
                <CalendarOutlined className="mr-1" /> {doc.date}
              </span>
              <span>
                <DownloadOutlined className="mr-1" /> {doc.downloads} 次
              </span>
            </div>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">文档总数</Text>
              <FileTextOutlined />
            </div>
            <Statistic value={32} valueStyle={{ fontSize: '24px' }} />
            <Text type="secondary" className="text-xs mt-2 block">
              文档类型：需求文档8 · 设计文档12 · 测试文档7 · 其他5
            </Text>
            <Text type="success" className="text-xs mt-2 flex items-center">
              <ArrowUpOutlined className="mr-1" /> 本月新增4篇文档
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">文档访问量</Text>
              <EyeOutlined />
            </div>
            <Statistic value={256} valueStyle={{ fontSize: '24px' }} />
            <Text type="success" className="text-xs mt-2 flex items-center">
              <ArrowUpOutlined className="mr-1" /> 较上月增长18%
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              热门文档：支付系统架构设计
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <Text type="secondary">待更新文档</Text>
              {/* <ClockOutlined /> TODO */}
            </div>
            <Statistic value={5} valueStyle={{ fontSize: '24px' }} />
            <Text type="warning" className="text-xs mt-2 flex items-center">
              <ExclamationCircleOutlined className="mr-1" /> 3篇文档已逾期未更新
            </Text>
            <Text type="secondary" className="text-xs mt-2 block">
              主要原因：开发任务优先级更高
            </Text>
          </Card>
        </Col>
      </Row>

      {/* 文档分类浏览 */}
      <Row gutter={[16, 16]}>
        {Object.entries(documents).map(([k, value]) => {
          const { list, title, total, iconColor } = value;
          return (
            <Col key={k} xs={24} lg={8}>
              <Card
                className="hover:shadow-md transition-shadow"
                extra={
                  <Text type="secondary" className="text-xs">
                    {list.length} 篇
                  </Text>
                }
                title={
                  <Flex gap={8}>
                    <FileTextOutlined style={{ color: iconColor }} />
                    {title}
                  </Flex>
                }
              >
                {list.map((doc) => renderDocumentItem(doc, k))}
                <Text
                  type="secondary"
                  className="text-sm block text-center mt-2"
                >
                  查看全部 {total} 篇
                </Text>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 最近更新文档和文档统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>最近更新文档</Title>
              <Button type="primary" size="small" icon={<PlusOutlined />}>
                上传文档
              </Button>
            </div>
            <List
              dataSource={recentDocuments}
              renderItem={(doc) => renderRecentDocumentItem(doc)}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <Title level={5}>文档统计分析</Title>
              <Select
                size="small"
                defaultValue="month"
                options={[
                  { value: 'month', label: '按月份' },
                  { value: 'sprint', label: '按迭代' },
                  { value: 'author', label: '按作者' },
                ]}
              />
            </div>
            <div className="h-64">
              <Bar {...documentStatsConfig} />
            </div>
            <Row gutter={[16, 16]} className="mt-4">
              <Col xs={12}>
                <Card className="bg-blue-50 border-blue-200">
                  <Text type="secondary" className="text-xs">
                    文档贡献最多
                  </Text>
                  <Text strong className="text-sm block mt-1">
                    赵架构 (12篇)
                  </Text>
                  <Text type="secondary" className="text-xs block mt-1">
                    <FileTextOutlined className="mr-1" /> 主要贡献设计文档
                  </Text>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="bg-green-50 border-green-200">
                  <Text type="secondary" className="text-xs">
                    文档平均更新频率
                  </Text>
                  <Text strong className="text-sm block mt-1">
                    每14天/次
                  </Text>
                  <Text type="success" className="text-xs block mt-1">
                    <ArrowUpOutlined className="mr-1" /> 较上季度提升 20%
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectDocuments;
