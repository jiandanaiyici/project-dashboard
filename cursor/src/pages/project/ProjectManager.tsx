import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Alert,
  Tabs,
  Timeline,
  Badge,
  Tooltip,
  Calendar,
  List,
  Avatar
} from 'antd';
import { 
  ProjectOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';

const { TabPane } = Tabs;

const ProjectManager: React.FC = () => {
  const [projectStats, setProjectStats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 3,
    overdueProjects: 1,
    avgProgress: 68.5,
    teamUtilization: 85.2
  });

  const [projectList, setProjectList] = useState([
    {
      id: 1,
      name: '电商平台重构',
      status: 'in_progress',
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      teamSize: 8,
      budget: 500000,
      spent: 375000,
      riskLevel: 'medium',
      manager: '张三'
    },
    {
      id: 2,
      name: '移动端应用开发',
      status: 'in_progress',
      progress: 45,
      startDate: '2024-01-15',
      endDate: '2024-04-30',
      teamSize: 6,
      budget: 300000,
      spent: 135000,
      riskLevel: 'low',
      manager: '李四'
    },
    {
      id: 3,
      name: '数据分析平台',
      status: 'testing',
      progress: 90,
      startDate: '2023-11-01',
      endDate: '2024-01-31',
      teamSize: 5,
      budget: 200000,
      spent: 180000,
      riskLevel: 'low',
      manager: '王五'
    }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: '张三',
      role: '项目经理',
      currentProjects: 2,
      workload: 85,
      skills: ['项目管理', '敏捷开发', '团队协作']
    },
    {
      id: 2,
      name: '李四',
      role: '技术负责人',
      currentProjects: 1,
      workload: 70,
      skills: ['架构设计', '技术选型', '代码审查']
    },
    {
      id: 3,
      name: '王五',
      role: '前端开发',
      currentProjects: 3,
      workload: 95,
      skills: ['React', 'Vue', 'TypeScript']
    }
  ]);

  const [riskAlerts, setRiskAlerts] = useState([
    {
      id: 1,
      project: '电商平台重构',
      type: 'schedule',
      level: 'high',
      message: '项目进度滞后15%，需要调整计划',
      date: '2024-01-15'
    },
    {
      id: 2,
      project: '移动端应用开发',
      type: 'resource',
      level: 'medium',
      message: '前端开发人员不足，建议增加人手',
      date: '2024-01-14'
    }
  ]);

  const getStatusTag = (status: string) => {
    const statusConfig = {
      planning: { color: 'blue', text: '规划中' },
      in_progress: { color: 'green', text: '进行中' },
      testing: { color: 'orange', text: '测试中' },
      completed: { color: 'purple', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getRiskTag = (level: string) => {
    const riskConfig = {
      low: { color: 'green', text: '低风险' },
      medium: { color: 'orange', text: '中风险' },
      high: { color: 'red', text: '高风险' }
    };
    const config = riskConfig[level as keyof typeof riskConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>负责人: {record.manager}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      )
    },
    {
      title: '团队规模',
      dataIndex: 'teamSize',
      key: 'teamSize',
      render: (size: number) => (
        <Space>
          <TeamOutlined />
          {size}人
        </Space>
      )
    },
    {
      title: '预算使用',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number, record: any) => {
        const usage = (record.spent / budget * 100).toFixed(1);
        return (
          <div>
            <div>¥{record.spent.toLocaleString()} / ¥{budget.toLocaleString()}</div>
            <Progress percent={parseFloat(usage)} size="small" />
          </div>
        );
      }
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      render: (level: string) => getRiskTag(level)
    }
  ];

  const teamColumns = [
    {
      title: '成员',
      key: 'member',
      render: (record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.role}</div>
          </div>
        </Space>
      )
    },
    {
      title: '当前项目',
      dataIndex: 'currentProjects',
      key: 'currentProjects',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: '工作负荷',
      dataIndex: 'workload',
      key: 'workload',
      render: (workload: number) => (
        <div>
          <Progress percent={workload} size="small" />
          <div style={{ fontSize: 12, color: '#666' }}>{workload}%</div>
        </div>
      )
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.map(skill => (
            <Tag key={skill} size="small">{skill}</Tag>
          ))}
        </Space>
      )
    }
  ];

  return (
    <div className="project-manager">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="项目概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总项目数"
                    value={projectStats.totalProjects}
                    prefix={<ProjectOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="进行中项目"
                    value={projectStats.activeProjects}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="已完成项目"
                    value={projectStats.completedProjects}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="逾期项目"
                    value={projectStats.overdueProjects}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="项目进度分布" style={{ height: 400 }}>
                  <RingChart
                    data={[
                      { name: '进行中', value: 8, color: '#52c41a' },
                      { name: '测试中', value: 2, color: '#faad14' },
                      { name: '已完成', value: 3, color: '#722ed1' },
                      { name: '逾期', value: 1, color: '#f5222d' }
                    ]}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="团队利用率" style={{ height: 400 }}>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Progress
                      type="circle"
                      percent={projectStats.teamUtilization}
                      format={percent => `${percent}%`}
                      size={120}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Badge count="良好" style={{ backgroundColor: '#52c41a' }} />
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="项目管理" key="projects">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<ProjectOutlined />}>
                  新建项目
                </Button>
                <Button icon={<BarChartOutlined />}>
                  项目报表
                </Button>
                <Button icon={<FileTextOutlined />}>
                  导出数据
                </Button>
              </Space>
            </div>

            <Table
              columns={projectColumns}
              dataSource={projectList}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="团队管理" key="team">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button type="primary" icon={<TeamOutlined />}>
                  添加成员
                </Button>
                <Button icon={<UserOutlined />}>
                  成员详情
                </Button>
              </Space>
            </div>

            <Table
              columns={teamColumns}
              dataSource={teamMembers}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="风险预警" key="risks">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="风险列表">
                  <List
                    dataSource={riskAlerts}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              style={{ 
                                backgroundColor: item.level === 'high' ? '#f5222d' : 
                                               item.level === 'medium' ? '#faad14' : '#52c41a' 
                              }}
                            >
                              <WarningOutlined />
                            </Avatar>
                          }
                          title={item.project}
                          description={item.message}
                        />
                        <div>
                          <Tag color={item.level === 'high' ? 'red' : 
                                     item.level === 'medium' ? 'orange' : 'green'}>
                            {item.level === 'high' ? '高风险' : 
                             item.level === 'medium' ? '中风险' : '低风险'}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="风险趋势">
                  <TrendChart
                    data={[
                      { date: '2024-01-01', value: 3, category: '高风险' },
                      { date: '2024-01-02', value: 2, category: '高风险' },
                      { date: '2024-01-03', value: 1, category: '高风险' },
                      { date: '2024-01-04', value: 2, category: '高风险' },
                      { date: '2024-01-05', value: 1, category: '高风险' },
                      { date: '2024-01-01', value: 5, category: '中风险' },
                      { date: '2024-01-02', value: 4, category: '中风险' },
                      { date: '2024-01-03', value: 3, category: '中风险' },
                      { date: '2024-01-04', value: 4, category: '中风险' },
                      { date: '2024-01-05', value: 3, category: '中风险' }
                    ]}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="日程安排" key="schedule">
            <Calendar
              headerRender={({ value, type, onChange, onTypeChange }) => (
                <div style={{ padding: 8 }}>
                  <Space>
                    <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                      上个月
                    </Button>
                    <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                      下个月
                    </Button>
                  </Space>
                </div>
              )}
              dateCellRender={(date) => {
                const day = date.date();
                if (day === 15) {
                  return (
                    <div style={{ background: '#f0f0f0', padding: 4, borderRadius: 4 }}>
                      <div style={{ fontSize: 12 }}>项目评审</div>
                    </div>
                  );
                }
                if (day === 20) {
                  return (
                    <div style={{ background: '#e6f7ff', padding: 4, borderRadius: 4 }}>
                      <div style={{ fontSize: 12 }}>里程碑检查</div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProjectManager;
