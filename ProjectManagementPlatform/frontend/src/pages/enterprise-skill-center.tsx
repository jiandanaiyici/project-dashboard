import React, { useState, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Statistic,
  Progress,
  Avatar,
  Tag,
  List,
  Segmented,
  Alert,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  BarChartOutlined,
  ExportOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// 企业级技能数据模型
interface EnterpriseSkill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'management' | 'domain';
  criticality: 'critical' | 'important' | 'nice_to_have';
  market_demand: number;
  internal_gap: number;
  certification_available: boolean;
}

// 员工技能档案
interface EmployeeProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  department: string;
  overall_score: number;
  key_skills: string[];
  growth_rate: number;
}

const EnterpriseSkillCenter: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'talent' | 'gaps'>('overview');

  // 企业技能库数据
  const enterpriseSkills: EnterpriseSkill[] = useMemo(() => [
    {
      id: 'skill-001',
      name: 'React开发',
      category: 'technical',
      criticality: 'critical',
      market_demand: 95,
      internal_gap: 25,
      certification_available: true,
    },
    {
      id: 'skill-002',
      name: '团队领导力',
      category: 'management',
      criticality: 'critical',
      market_demand: 88,
      internal_gap: 45,
      certification_available: false,
    },
    {
      id: 'skill-003',
      name: '数据分析',
      category: 'technical',
      criticality: 'important',
      market_demand: 82,
      internal_gap: 35,
      certification_available: true,
    },
    {
      id: 'skill-004',
      name: '跨部门协作',
      category: 'soft',
      criticality: 'important',
      market_demand: 78,
      internal_gap: 20,
      certification_available: false,
    },
    {
      id: 'skill-005',
      name: '云架构设计',
      category: 'technical',
      criticality: 'critical',
      market_demand: 92,
      internal_gap: 60,
      certification_available: true,
    },
  ], []);

  // 员工数据
  const employees: EmployeeProfile[] = useMemo(() => [
    {
      id: 'emp-001',
      name: '张三',
      avatar: 'https://joeschmoe.io/api/v1/random',
      role: '高级前端工程师',
      department: '技术部',
      overall_score: 92,
      key_skills: ['React开发', '数据分析', '跨部门协作'],
      growth_rate: 15,
    },
    {
      id: 'emp-002',
      name: '李四',
      avatar: 'https://joeschmoe.io/api/v1/random',
      role: '项目经理',
      department: '项目管理部',
      overall_score: 85,
      key_skills: ['团队领导力', '跨部门协作'],
      growth_rate: 8,
    },
    {
      id: 'emp-003',
      name: '王五',
      avatar: 'https://joeschmoe.io/api/v1/random',
      role: '初级开发工程师',
      department: '技术部',
      overall_score: 68,
      key_skills: ['React开发'],
      growth_rate: 25,
    },
  ], []);

  // 技能覆盖度雷达图
  const getSkillCoverageOption = () => ({
    title: {
      text: '企业技能覆盖度分析',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#262626',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    radar: {
      indicator: [
        { name: '前端技术', max: 100 },
        { name: '后端技术', max: 100 },
        { name: '数据技能', max: 100 },
        { name: '云计算', max: 100 },
        { name: '管理技能', max: 100 },
        { name: '软技能', max: 100 },
      ],
      radius: '65%',
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#595959',
        fontSize: 13,
      },
      splitLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
    },
    series: [
      {
        name: '技能覆盖度',
        type: 'radar',
        data: [
          {
            value: [87, 65, 45, 25, 78, 82],
            name: '当前水平',
            areaStyle: {
              color: 'rgba(24, 144, 255, 0.2)',
            },
            lineStyle: {
              color: '#1890ff',
              width: 3,
            },
          },
          {
            value: [95, 85, 80, 75, 90, 88],
            name: '目标水平',
            areaStyle: {
              color: 'rgba(82, 196, 26, 0.1)',
            },
            lineStyle: {
              color: '#52c41a',
              width: 2,
              type: 'dashed',
            },
          },
        ],
      },
    ],
  });

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              <CrownOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
              企业人才技能中心
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              智能化人才管理与技能发展平台 • 最后更新: {dayjs().format('YYYY-MM-DD HH:mm')}
            </Text>
          </div>
          <Space size="middle">
            <Segmented
              value={activeView}
              onChange={setActiveView}
              options={[
                { label: '技能概览', value: 'overview', icon: <BarChartOutlined /> },
                { label: '人才档案', value: 'talent', icon: <UserOutlined /> },
                { label: '技能缺口', value: 'gaps', icon: <WarningOutlined /> },
              ]}
            />
            <Button type="primary" icon={<ExportOutlined />}>
              生成报告
            </Button>
          </Space>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card style={{ textAlign: 'center', height: '120px' }}>
            <Statistic
              title="技能总数"
              value={enterpriseSkills.length}
              prefix={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', height: '120px' }}>
            <Statistic
              title="人员总数"
              value={employees.length}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', height: '120px' }}>
            <Statistic
              title="平均技能水平"
              value={82}
              suffix="分"
              prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center', height: '120px' }}>
            <Statistic
              title="认证率"
              value={68}
              suffix="%"
              prefix={<SafetyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {activeView === 'overview' && (
          <>
            <Col span={16}>
              <Card title="企业技能覆盖度分析" style={{ height: '400px' }}>
                <ReactECharts
                  option={getSkillCoverageOption()}
                  style={{ height: '320px' }}
                  notMerge={true}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="技能类别分布" style={{ height: '400px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>技术技能</Text>
                    <Text strong>65%</Text>
                  </div>
                  <Progress percent={65} strokeColor="#1890ff" />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>管理技能</Text>
                    <Text strong>25%</Text>
                  </div>
                  <Progress percent={25} strokeColor="#52c41a" />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>软技能</Text>
                    <Text strong>78%</Text>
                  </div>
                  <Progress percent={78} strokeColor="#fa8c16" />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>领域技能</Text>
                    <Text strong>45%</Text>
                  </div>
                  <Progress percent={45} strokeColor="#722ed1" />
                </Space>
              </Card>
            </Col>
          </>
        )}

        {activeView === 'talent' && (
          <Col span={24}>
            <Card title="核心人才档案">
              <Row gutter={[16, 16]}>
                {employees.map((employee) => (
                  <Col span={8} key={employee.id}>
                    <Card 
                      hoverable
                      style={{ 
                        textAlign: 'center',
                        borderTop: `4px solid ${
                          employee.overall_score >= 90 ? '#52c41a' : 
                          employee.overall_score >= 80 ? '#1890ff' : '#fa8c16'
                        }`,
                      }}
                    >
                      <Avatar size={64} src={employee.avatar} style={{ marginBottom: '16px' }} />
                      <Title level={4} style={{ margin: 0 }}>{employee.name}</Title>
                      <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
                        {employee.role} • {employee.department}
                      </Text>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <Progress
                          type="circle"
                          percent={employee.overall_score}
                          size={80}
                          format={(percent) => (
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{percent}</div>
                              <div style={{ fontSize: '10px', color: '#8c8c8c' }}>综合评分</div>
                            </div>
                          )}
                        />
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <Space wrap>
                          {employee.key_skills.slice(0, 3).map((skill) => (
                            <Tag key={skill} color="blue">{skill}</Tag>
                          ))}
                        </Space>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary">成长率</Text>
                        <Text 
                          style={{ 
                            color: employee.growth_rate > 15 ? '#52c41a' : '#fa8c16',
                            fontWeight: 'bold'
                          }}
                        >
                          <RiseOutlined /> {employee.growth_rate}%
                        </Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        )}

        {activeView === 'gaps' && (
          <Col span={24}>
            <Alert
              message="关键技能缺口分析"
              description="基于市场需求和内部能力的技能缺口识别，优先级排序帮助制定人才发展策略"
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Card title="技能缺口排序">
              <List
                dataSource={enterpriseSkills.filter(skill => skill.internal_gap > 30)}
                renderItem={(skill) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>{skill.name}</Text>
                          <Tag color={skill.criticality === 'critical' ? 'red' : 'orange'}>
                            {skill.criticality === 'critical' ? '关键' : '重要'}
                          </Tag>
                          {skill.certification_available && (
                            <Tag color="blue">可认证</Tag>
                          )}
                        </Space>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            <Text type="secondary">缺口程度: </Text>
                            <Progress 
                              percent={skill.internal_gap} 
                              size="small" 
                              status={skill.internal_gap > 50 ? 'exception' : 'active'}
                              format={(percent) => `${percent}%`}
                            />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary">市场需求: {skill.market_demand}%</Text>
                            <Text type="secondary">
                              类别: {
                                skill.category === 'technical' ? '技术' :
                                skill.category === 'management' ? '管理' :
                                skill.category === 'soft' ? '软技能' : '领域'
                              }
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default EnterpriseSkillCenter;