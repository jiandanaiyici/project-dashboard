import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Table, 
  Progress, 
  Tag, 
  Avatar, 
  Button, 
  Space, 
  Select, 
  Statistic,
  Modal,
  Alert,
  Badge,
  List,
  Rate,
} from 'antd';
import {
  TrophyOutlined,
  StarOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  BulbOutlined,
  AimOutlined,
  CrownOutlined,
  RocketOutlined,
  EyeOutlined,
  EditOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useMobileDetection } from '@/components/Mobile';

const { TabPane } = Tabs;

interface PerformanceData {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
  level: 'S' | 'A' | 'B' | 'C' | 'D';
  dimensions: {
    workQuality: number;
    efficiency: number;
    teamwork: number;
    innovation: number;
  };
  status: 'draft' | 'pending' | 'completed' | 'approved';
}

const SmartPerformanceEvaluation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-Q1');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<PerformanceData | null>(null);
  const { isMobile } = useMobileDetection();

  // 绩效统计数据
  const performanceStats = [
    {
      title: '已完成评定',
      value: 128,
      total: 150,
      icon: <TrophyOutlined />,
      color: '#52c41a',
      change: '+12',
    },
    {
      title: '优秀员工',
      value: 42,
      icon: <CrownOutlined />,
      color: '#fa8c16',
      change: '+5',
    },
    {
      title: '平均分数',
      value: 4.2,
      suffix: '/5.0',
      icon: <StarOutlined />,
      color: '#1890ff',
      change: '+0.3',
    },
    {
      title: 'AI建议',
      value: 86,
      icon: <BulbOutlined />,
      color: '#722ed1',
      change: '+24',
    },
  ];

  // 绩效等级配置
  const performanceLevels = {
    S: { label: 'S级 (卓越)', color: '#ff4d4f', range: '4.5-5.0' },
    A: { label: 'A级 (优秀)', color: '#fa8c16', range: '4.0-4.4' },
    B: { label: 'B级 (良好)', color: '#52c41a', range: '3.5-3.9' },
    C: { label: 'C级 (合格)', color: '#1890ff', range: '3.0-3.4' },
    D: { label: 'D级 (待改进)', color: '#d9d9d9', range: '0-2.9' },
  };

  // 评定维度配置
  const evaluationDimensions = [
    { key: 'workQuality', label: '工作质量', icon: <AimOutlined />, weight: 30 },
    { key: 'efficiency', label: '工作效率', icon: <ThunderboltOutlined />, weight: 25 },
    { key: 'teamwork', label: '团队协作', icon: <TeamOutlined />, weight: 25 },
    { key: 'innovation', label: '创新能力', icon: <BulbOutlined />, weight: 20 },
  ];

  // 模拟绩效数据
  const performanceData: PerformanceData[] = [
    {
      id: '1',
      name: '张明',
      department: '技术部',
      position: '高级前端工程师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      overallScore: 4.6,
      trend: 'up',
      level: 'S',
      dimensions: { workQuality: 4.8, efficiency: 4.5, teamwork: 4.6, innovation: 4.7 },
      status: 'completed',
    },
    {
      id: '2',
      name: '李华',
      department: '产品部',
      position: '产品经理',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      overallScore: 4.2,
      trend: 'up',
      level: 'A',
      dimensions: { workQuality: 4.3, efficiency: 4.0, teamwork: 4.5, innovation: 4.0 },
      status: 'completed',
    },
    {
      id: '3',
      name: '王芳',
      department: '设计部',
      position: 'UI设计师',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      overallScore: 4.0,
      trend: 'stable',
      level: 'A',
      dimensions: { workQuality: 4.2, efficiency: 3.8, teamwork: 4.1, innovation: 4.0 },
      status: 'pending',
    },
    {
      id: '4',
      name: '赵强',
      department: '运营部',
      position: '运营专员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhao',
      overallScore: 3.8,
      trend: 'down',
      level: 'B',
      dimensions: { workQuality: 3.9, efficiency: 3.7, teamwork: 3.8, innovation: 3.8 },
      status: 'draft',
    },
  ];

  // 获取等级颜色
  const getLevelColor = (level: string) => {
    return performanceLevels[level as keyof typeof performanceLevels]?.color || '#d9d9d9';
  };

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    const color = trend === 'up' ? '#52c41a' : trend === 'down' ? '#ff4d4f' : '#d9d9d9';
    const icon = trend === 'up' ? <RiseOutlined /> : trend === 'down' ? <FallOutlined /> : null;
    return { icon, color };
  };

  // 表格列配置
  const columns = [
    {
      title: '员工信息',
      key: 'employee',
      render: (record: PerformanceData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src={record.avatar} size={40} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.position} · {record.department}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '综合评分',
      key: 'score',
      sorter: (a: PerformanceData, b: PerformanceData) => a.overallScore - b.overallScore,
      render: (record: PerformanceData) => {
        const trend = getTrendIcon(record.trend);
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: getLevelColor(record.level) }}>
              {record.overallScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '12px', color: trend.color }}>
              {trend.icon}
            </div>
          </div>
        );
      },
    },
    {
      title: '等级',
      key: 'level',
      render: (record: PerformanceData) => (
        <Tag color={getLevelColor(record.level)} style={{ fontWeight: 600 }}>
          {record.level}级
        </Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      render: (record: PerformanceData) => {
        const statusConfig = {
          draft: { color: 'default', text: '草稿' },
          pending: { color: 'processing', text: '待审核' },
          completed: { color: 'success', text: '已完成' },
          approved: { color: 'green', text: '已批准' },
        };
        const config = statusConfig[record.status];
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: PerformanceData) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedEmployee(record);
              setDetailModalVisible(true);
            }}
          >
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            评定
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? '16px' : '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: isMobile ? '24px' : '28px', fontWeight: 600 }}>
          智能绩效评定
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>
          基于AI算法的智能绩效评估系统，多维度客观评价员工表现
        </p>
      </div>

      {/* 筛选条件 */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={4}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>评定周期</div>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: '100%' }}
              options={[
                { label: '2024年Q1', value: '2024-Q1' },
                { label: '2023年Q4', value: '2023-Q4' },
                { label: '2023年Q3', value: '2023-Q3' },
              ]}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>部门</div>
            <Select
              defaultValue="all"
              style={{ width: '100%' }}
              options={[
                { label: '全部部门', value: 'all' },
                { label: '技术部', value: 'tech' },
                { label: '产品部', value: 'product' },
                { label: '设计部', value: 'design' },
              ]}
            />
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <Space>
              <Button type="primary">开始批量评定</Button>
              <Button>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {performanceStats.map((stat, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
              <div style={{ fontSize: '12px', color: stat.change.startsWith('+') ? '#52c41a' : '#ff4d4f', marginTop: '8px' }}>
                {stat.change}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="评定概览" key="overview">
          {/* AI洞察卡片 */}
          <Alert
            message="AI智能分析"
            description="本季度整体绩效较上季度提升12%，技术部表现最为突出。建议加强产品部和运营部的团队协作培训。"
            type="info"
            icon={<BulbOutlined />}
            showIcon
            style={{ marginBottom: '24px', borderRadius: '8px' }}
          />

          <Card 
            title="员工绩效列表" 
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <Table
              dataSource={performanceData}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="维度分析" key="dimensions">
          <Row gutter={[24, 24]}>
            {evaluationDimensions.map((dimension) => (
              <Col xs={24} sm={12} lg={6} key={dimension.key}>
                <Card 
                  title={
                    <Space>
                      {dimension.icon}
                      {dimension.label}
                      <Tag>{dimension.weight}%</Tag>
                    </Space>
                  }
                  style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={85}
                      format={() => '4.2/5.0'}
                      strokeColor="#1890ff"
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                      部门平均分数
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane tab="等级分布" key="levels">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card 
                title="等级分布统计" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <List
                  dataSource={Object.entries(performanceLevels)}
                  renderItem={([key, level]) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Tag color={level.color}>{key}级</Tag>}
                        title={level.label}
                        description={`评分范围: ${level.range}`}
                      />
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600 }}>
                          {key === 'S' ? 8 : key === 'A' ? 34 : key === 'B' ? 72 : key === 'C' ? 28 : 8}人
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title="部门绩效对比" 
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                {['技术部', '产品部', '设计部', '运营部'].map((dept, index) => {
                  const scores = [4.3, 4.1, 4.0, 3.8];
                  const score = scores[index];
                  return (
                    <div key={dept} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{dept}</span>
                        <span style={{ fontWeight: 600 }}>{score.toFixed(1)}</span>
                      </div>
                      <Progress percent={score * 20} strokeColor="#1890ff" />
                    </div>
                  );
                })}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="AI洞察" key="insights">
          <Card 
            title={<Space><FireOutlined />智能分析报告</Space>}
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <BulbOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>AI智能洞察功能开发中...</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                将提供个性化绩效建议、职业发展路径推荐、团队优化建议等
              </div>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* 绩效详情模态框 */}
      <Modal
        title={selectedEmployee ? `${selectedEmployee.name} - 绩效详情` : '绩效详情'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedEmployee && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <Avatar src={selectedEmployee.avatar} size={64} />
              <div>
                <h3>{selectedEmployee.name}</h3>
                <p style={{ color: '#666' }}>{selectedEmployee.position} · {selectedEmployee.department}</p>
                <Space>
                  <Tag color={getLevelColor(selectedEmployee.level)}>{selectedEmployee.level}级</Tag>
                  <Rate disabled defaultValue={selectedEmployee.overallScore} />
                  <span>{selectedEmployee.overallScore.toFixed(1)}分</span>
                </Space>
              </div>
            </div>

            <div>
              <h4>维度评分</h4>
              <Row gutter={[16, 16]}>
                {evaluationDimensions.map((dim) => (
                  <Col xs={12} key={dim.key}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '8px' }}>{dim.icon} {dim.label}</div>
                      <Progress
                        type="circle"
                        size={60}
                        percent={selectedEmployee.dimensions[dim.key as keyof typeof selectedEmployee.dimensions] * 20}
                        format={() => selectedEmployee.dimensions[dim.key as keyof typeof selectedEmployee.dimensions].toFixed(1)}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SmartPerformanceEvaluation;