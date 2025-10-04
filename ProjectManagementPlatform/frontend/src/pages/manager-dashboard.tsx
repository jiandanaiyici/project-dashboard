import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, Statistic, Progress, Table, Tag, Button, DatePicker, Select } from 'antd';
import { 
  ProjectOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  WarningOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { PageHeader, StatCard, ChartCard } from '@/components';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 交付经理看板
 */
const DeliveryManagerDashboard: React.FC = () => {
  const [deliveryData, setDeliveryData] = useState({
    totalProjects: 45,
    onTimeDelivery: 89,
    qualityScore: 92,
    clientSatisfaction: 88,
    activeDeliveries: 12,
    delayedProjects: 3,
  });

  // 交付质量趋势图
  const qualityTrendOption = {
    title: { text: '交付质量趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [
      {
        name: '质量评分',
        type: 'line',
        data: [85, 88, 91, 89, 94, 92],
        smooth: true,
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '客户满意度',
        type: 'line',
        data: [82, 85, 87, 86, 90, 88],
        smooth: true,
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  // 项目交付状态表格
  const deliveryColumns = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '客户', dataIndex: 'client', key: 'client' },
    { 
      title: '交付状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '按期' ? 'green' : status === '延期' ? 'red' : 'orange'}>
          {status}
        </Tag>
      )
    },
    { title: '完成度', dataIndex: 'progress', key: 'progress', render: (progress: number) => `${progress}%` },
    { title: '交付日期', dataIndex: 'deliveryDate', key: 'deliveryDate' },
    { title: '质量评分', dataIndex: 'qualityScore', key: 'qualityScore' },
  ];

  const deliveryTableData = [
    { key: '1', name: 'ERP系统升级', client: 'ABC公司', status: '按期', progress: 95, deliveryDate: '2024-01-15', qualityScore: 94 },
    { key: '2', name: '移动APP开发', client: 'XYZ集团', status: '延期', progress: 78, deliveryDate: '2024-01-20', qualityScore: 87 },
    { key: '3', name: '数据分析平台', client: 'DEF企业', status: '进行中', progress: 65, deliveryDate: '2024-02-01', qualityScore: 89 },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatCard
            title="项目总数"
            value={deliveryData.totalProjects}
            icon={<ProjectOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="按期交付率"
            value={deliveryData.onTimeDelivery}
            suffix="%"
            icon={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="质量评分"
            value={deliveryData.qualityScore}
            suffix="%"
            icon={<TrophyOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="客户满意度"
            value={deliveryData.clientSatisfaction}
            suffix="%"
            icon={<TrophyOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ChartCard option={qualityTrendOption}>
          </ChartCard>
        </Col>
        <Col span={12}>
          <Card title="交付状态分布">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="按期交付" value={9} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
              </Col>
              <Col span={8}>
                <Statistic title="延期项目" value={3} prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />} />
              </Col>
              <Col span={8}>
                <Statistic title="进行中" value={8} prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card title="项目交付状态" style={{ marginTop: 16 }}>
        <Table 
          columns={deliveryColumns} 
          dataSource={deliveryTableData}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

/**
 * 产品经理看板
 */
const ProductManagerDashboard: React.FC = () => {
  const [productData, setProductData] = useState({
    totalFeatures: 156,
    completedFeatures: 89,
    userFeedback: 4.3,
    activeUsers: 12589,
    featureAdoption: 76,
    bugRate: 2.1,
  });

  // 功能采用率图表
  const adoptionOption = {
    title: { text: '功能采用率', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '80%'],
        data: [
          { value: 76, name: '已采用', itemStyle: { color: '#52c41a' } },
          { value: 24, name: '未采用', itemStyle: { color: '#ff4d4f' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 用户反馈趋势
  const feedbackTrendOption = {
    title: { text: '用户反馈趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', min: 0, max: 5 },
    series: [
      {
        name: '用户评分',
        type: 'line',
        data: [4.1, 4.2, 4.0, 4.3, 4.4, 4.3],
        smooth: true,
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatCard
            title="功能总数"
            value={productData.totalFeatures}
            icon={<ProjectOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="已完成功能"
            value={productData.completedFeatures}
            icon={<CheckCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="用户评分"
            value={productData.userFeedback}
            precision={1}
            icon={<TrophyOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="活跃用户"
            value={productData.activeUsers}
            icon={<TeamOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ChartCard option={adoptionOption}>
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard option={feedbackTrendOption}>
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="功能完成进度">
            <Progress 
              type="circle" 
              percent={Math.round((productData.completedFeatures / productData.totalFeatures) * 100)} 
              format={percent => `${percent}%`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Bug率">
            <Progress 
              type="circle" 
              percent={productData.bugRate} 
              status={productData.bugRate > 5 ? 'exception' : 'success'}
              format={percent => `${percent}%`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="功能采用率">
            <Progress 
              type="circle" 
              percent={productData.featureAdoption}
              format={percent => `${percent}%`}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/**
 * 项目经理看板
 */
const ProjectManagerDashboard: React.FC = () => {
  const [projectData, setProjectData] = useState({
    totalProjects: 28,
    activeProjects: 15,
    completedProjects: 12,
    teamMembers: 45,
    budget: 2800000,
    budgetUsed: 1950000,
  });

  // 项目进度分布图
  const progressOption = {
    title: { text: '项目进度分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '80%',
        data: [
          { value: 5, name: '规划中', itemStyle: { color: '#1890ff' } },
          { value: 8, name: '进行中', itemStyle: { color: '#52c41a' } },
          { value: 12, name: '已完成', itemStyle: { color: '#722ed1' } },
          { value: 3, name: '已暂停', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  };

  // 团队工作量分布
  const workloadOption = {
    title: { text: '团队工作量分布', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['前端团队', '后端团队', '测试团队', '设计团队', 'DevOps']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '工作量(%)',
        type: 'bar',
        data: [85, 92, 78, 65, 88],
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatCard
            title="项目总数"
            value={projectData.totalProjects}
            icon={<ProjectOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="活跃项目"
            value={projectData.activeProjects}
            icon={<ClockCircleOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="团队成员"
            value={projectData.teamMembers}
            icon={<TeamOutlined />}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="预算使用率"
            value={Math.round((projectData.budgetUsed / projectData.budget) * 100)}
            suffix="%"
            icon={<DollarOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <ChartCard option={progressOption}>
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard option={workloadOption}>
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="关键指标监控">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic 
                  title="项目平均进度" 
                  value={78} 
                  suffix="%" 
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="预算使用率" 
                  value={Math.round((projectData.budgetUsed / projectData.budget) * 100)} 
                  suffix="%" 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="团队利用率" 
                  value={82} 
                  suffix="%" 
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="风险项目数" 
                  value={3} 
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/**
 * 管理看板主页面
 */
const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('delivery');

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader 
        title="管理看板" 
      />
      
      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane 
            tab={
              <span>
                <TrophyOutlined />
                交付经理看板
              </span>
            } 
            key="delivery"
          >
            <DeliveryManagerDashboard />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <ProjectOutlined />
                产品经理看板
              </span>
            } 
            key="product"
          >
            <ProductManagerDashboard />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                项目经理看板
              </span>
            } 
            key="project"
          >
            <ProjectManagerDashboard />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ManagerDashboard;