import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Progress,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Rate,
  Tabs,
  Space,
  Badge,
  Statistic,
} from 'antd';
import {
  StarOutlined,
  TrophyOutlined,
  ToolOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { PageHeader, StatCard } from '@/components';

const { TabPane } = Tabs;
const { Option } = Select;

/**
 * 技能概览统计
 */
const SkillOverview: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <StatCard
          title="技能总数"
          value={156}
          icon={<ToolOutlined />}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="人员总数"
          value={45}
          icon={<TeamOutlined />}
        />
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="平均技能水平"
            value={3.2}
            precision={1}
            suffix="/ 5"
            valueStyle={{ color: '#fa8c16' }}
            prefix={<StarOutlined />}
          />
          <Progress percent={64} strokeColor="#fa8c16" style={{ marginTop: 8 }} showInfo={false} />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="技能认证率"
            value={68}
            suffix="%"
            valueStyle={{ color: '#722ed1' }}
            prefix={<TrophyOutlined />}
          />
          <Progress percent={68} strokeColor="#722ed1" style={{ marginTop: 8 }} showInfo={false} />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 技能分析图表
 */
const SkillCharts: React.FC = () => {
  const skillRadarOption = {
    title: { text: '团队技能雷达图', left: 'center' },
    tooltip: {},
    radar: {
      indicator: [
        { name: 'React开发', max: 5 },
        { name: 'Node.js', max: 5 },
        { name: '数据库设计', max: 5 },
        { name: '项目管理', max: 5 },
        { name: '团队协作', max: 5 },
        { name: '沟通能力', max: 5 }
      ]
    },
    series: [{
      name: '技能水平',
      type: 'radar',
      data: [
        {
          value: [4.2, 3.8, 3.5, 3.9, 4.1, 3.7],
          name: '团队平均水平',
          itemStyle: { color: '#1890ff' }
        }
      ]
    }]
  };

  const skillTrendOption = {
    title: { text: '技能成长趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: { type: 'value', min: 0, max: 5 },
    series: [
      {
        name: '技术技能',
        type: 'line',
        data: [3.2, 3.4, 3.6, 3.8, 4.0, 4.2],
        smooth: true,
        itemStyle: { color: '#1890ff' }
      }
    ]
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="团队技能雷达">
          <ReactECharts option={skillRadarOption} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={12}>
        <Card title="技能成长趋势">
          <ReactECharts option={skillTrendOption} style={{ height: 300 }} />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 技能库管理
 */
const SkillManagement: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const mockSkills = [
      {
        id: 'skill1',
        name: 'React开发',
        category: 'technical',
        level: 4,
        description: '基于React的前端开发技能',
        keywords: ['React', 'JSX', 'Hooks']
      },
      {
        id: 'skill2',
        name: '项目管理',
        category: 'management',
        level: 4,
        description: '项目规划、执行和监控能力',
        keywords: ['项目规划', '风险管理', 'Scrum']
      }
    ];
    setSkills(mockSkills);
  }, []);

  const columns = [
    {
      title: '技能名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const colors = { technical: 'blue', management: 'orange', soft: 'green' };
        return <Tag color={colors[category as keyof typeof colors]}>{category}</Tag>;
      },
    },
    {
      title: '级别要求',
      dataIndex: 'level',
      key: 'level',
      render: (level: number) => <Rate disabled value={level} style={{ fontSize: 16 }} />,
    },
    {
      title: '操作',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="技能库管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          添加技能
        </Button>
      }
    >
      <Table columns={columns} dataSource={skills} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title="添加技能"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="技能名称" rules={[{ required: true }]}>
            <Input placeholder="请输入技能名称" />
          </Form.Item>
          <Form.Item name="category" label="技能分类" rules={[{ required: true }]}>
            <Select placeholder="请选择技能分类">
              <Option value="technical">技术技能</Option>
              <Option value="soft">软技能</Option>
              <Option value="management">管理技能</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

/**
 * 技能差距分析
 */
const SkillGapAnalysis: React.FC = () => {
  const gapData = [
    {
      userName: '张三',
      position: '前端工程师',
      gapScore: 2.3,
      requiredSkills: [
        { skillName: 'React', required: 5, current: 4, gap: 1 },
        { skillName: 'Node.js', required: 4, current: 3, gap: 1 }
      ]
    }
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '技能差距评分',
      dataIndex: 'gapScore',
      key: 'gapScore',
      render: (score: number) => (
        <Badge
          count={score.toFixed(1)}
          style={{ backgroundColor: score > 2 ? '#ff4d4f' : '#52c41a' }}
        />
      ),
    },
    {
      title: '主要技能差距',
      dataIndex: 'requiredSkills',
      key: 'requiredSkills',
      render: (skills: any[]) => (
        <div>
          {skills.map((skill, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <span>{skill.skillName}: </span>
              <Progress
                percent={(skill.current / skill.required) * 100}
                size="small"
                format={() => `${skill.current}/${skill.required}`}
              />
            </div>
          ))}
        </div>
      ),
    }
  ];

  return (
    <Card title="技能差距分析">
      <Table columns={columns} dataSource={gapData} pagination={{ pageSize: 10 }} />
    </Card>
  );
};

/**
 * 技能打标分析系统主页面
 */
const SkillAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="人员技能打标分析系统" />

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab="技能概览" key="overview">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <SkillOverview />
            <SkillCharts />
          </Space>
        </TabPane>

        <TabPane tab="技能库管理" key="management">
          <SkillManagement />
        </TabPane>

        <TabPane tab="技能档案" key="profile">
          <Card title="人员技能档案">
            <p>技能档案功能开发中...</p>
          </Card>
        </TabPane>

        <TabPane tab="差距分析" key="gap">
          <SkillGapAnalysis />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SkillAnalysis;