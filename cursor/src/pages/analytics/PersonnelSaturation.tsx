import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Button, 
  Space, 
  Statistic,
  Progress,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  message,
  Tabs,
  List,
  Badge,
  Tooltip
} from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  CalendarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import TrendChart from '@/components/charts/TrendChart';
import RingChart from '@/components/charts/RingChart';
import GaugeChart from '@/components/charts/GaugeChart';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const PersonnelSaturation: React.FC = () => {
  const [saturationData, setSaturationData] = useState([
    {
      id: 1,
      name: '张三',
      role: '项目经理',
      department: '技术部',
      currentWorkload: 95,
      maxCapacity: 100,
      saturation: 95,
      status: 'overloaded',
      projects: ['电商平台重构', '移动端开发'],
      skills: ['项目管理', '敏捷开发'],
      lastUpdate: '2024-01-15'
    },
    {
      id: 2,
      name: '李四',
      role: '技术负责人',
      department: '技术部',
      currentWorkload: 75,
      maxCapacity: 100,
      saturation: 75,
      status: 'normal',
      projects: ['数据分析平台'],
      skills: ['架构设计', '技术选型'],
      lastUpdate: '2024-01-15'
    },
    {
      id: 3,
      name: '王五',
      role: '前端开发',
      department: '技术部',
      currentWorkload: 60,
      maxCapacity: 100,
      saturation: 60,
      status: 'underutilized',
      projects: ['移动端开发'],
      skills: ['React', 'Vue', 'TypeScript'],
      lastUpdate: '2024-01-15'
    },
    {
      id: 4,
      name: '赵六',
      role: '后端开发',
      department: '技术部',
      currentWorkload: 85,
      maxCapacity: 100,
      saturation: 85,
      status: 'normal',
      projects: ['电商平台重构', '支付系统'],
      skills: ['Java', 'Spring', 'MySQL'],
      lastUpdate: '2024-01-15'
    }
  ]);

  const [departmentStats, setDepartmentStats] = useState([
    { name: '技术部', total: 20, overloaded: 3, normal: 15, underutilized: 2 },
    { name: '产品部', total: 8, overloaded: 1, normal: 6, underutilized: 1 },
    { name: '数据部', total: 5, overloaded: 0, normal: 4, underutilized: 1 }
  ]);

  const [saturationTrend, setSaturationTrend] = useState([
    { date: '2024-01-01', value: 75, category: '平均饱和度' },
    { date: '2024-01-02', value: 78, category: '平均饱和度' },
    { date: '2024-01-03', value: 82, category: '平均饱和度' },
    { date: '2024-01-04', value: 85, category: '平均饱和度' },
    { date: '2024-01-05', value: 88, category: '平均饱和度' }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: '张三工作负荷过重，建议调整任务分配',
      person: '张三',
      severity: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: '王五工作负荷较轻，可以承担更多任务',
      person: '王五',
      severity: 'low'
    }
  ]);

  const getSaturationColor = (saturation: number) => {
    if (saturation >= 90) return '#f5222d';
    if (saturation >= 70) return '#faad14';
    return '#52c41a';
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      overloaded: { color: 'red', text: '过载', icon: <ExclamationCircleOutlined /> },
      normal: { color: 'green', text: '正常', icon: <CheckCircleOutlined /> },
      underutilized: { color: 'blue', text: '未充分利用', icon: <WarningOutlined /> }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const saturationColumns = [
    {
      title: '人员',
      key: 'person',
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
      title: '部门',
      dataIndex: 'department',
      key: 'department'
    },
    {
      title: '当前工作量',
      dataIndex: 'currentWorkload',
      key: 'currentWorkload',
      render: (workload: number, record: any) => (
        <div>
          <Progress 
            percent={workload} 
            size="small" 
            strokeColor={getSaturationColor(workload)}
          />
          <div style={{ fontSize: 12, color: '#666' }}>
            {workload}/{record.maxCapacity}
          </div>
        </div>
      )
    },
    {
      title: '饱和度',
      dataIndex: 'saturation',
      key: 'saturation',
      render: (saturation: number) => (
        <div style={{ color: getSaturationColor(saturation), fontWeight: 'bold' }}>
          {saturation}%
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
      title: '参与项目',
      dataIndex: 'projects',
      key: 'projects',
      render: (projects: string[]) => (
        <Space wrap>
          {projects.map(project => (
            <Tag key={project} size="small">{project}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.slice(0, 2).map(skill => (
            <Tag key={skill} size="small" color="blue">{skill}</Tag>
          ))}
          {skills.length > 2 && (
            <Tag size="small">+{skills.length - 2}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate'
    }
  ];

  const totalPersonnel = saturationData.length;
  const overloadedCount = saturationData.filter(item => item.status === 'overloaded').length;
  const normalCount = saturationData.filter(item => item.status === 'normal').length;
  const underutilizedCount = saturationData.filter(item => item.status === 'underutilized').length;
  const avgSaturation = saturationData.reduce((sum, item) => sum + item.saturation, 0) / totalPersonnel;

  return (
    <div className="personnel-saturation">
      <Card>
        <Tabs defaultActiveKey="overview">
          <TabPane tab="饱和度概览" key="overview">
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="总人数"
                    value={totalPersonnel}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="过载人数"
                    value={overloadedCount}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="正常人数"
                    value={normalCount}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均饱和度"
                    value={avgSaturation}
                    suffix="%"
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: getSaturationColor(avgSaturation) }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="部门饱和度分布">
                  <RingChart
                    data={[
                      { name: '过载', value: overloadedCount, color: '#f5222d' },
                      { name: '正常', value: normalCount, color: '#52c41a' },
                      { name: '未充分利用', value: underutilizedCount, color: '#1890ff' }
                    ]}
                    height={300}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="饱和度趋势">
                  <TrendChart
                    data={saturationTrend}
                    height={300}
                    seriesField="category"
                    showArea={true}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="部门统计">
                  <Table
                    dataSource={departmentStats}
                    columns={[
                      { title: '部门', dataIndex: 'name', key: 'name' },
                      { title: '总人数', dataIndex: 'total', key: 'total' },
                      { 
                        title: '过载人数', 
                        dataIndex: 'overloaded', 
                        key: 'overloaded',
                        render: (count: number) => (
                          <Badge count={count} style={{ backgroundColor: '#f5222d' }} />
                        )
                      },
                      { 
                        title: '正常人数', 
                        dataIndex: 'normal', 
                        key: 'normal',
                        render: (count: number) => (
                          <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
                        )
                      },
                      { 
                        title: '未充分利用', 
                        dataIndex: 'underutilized', 
                        key: 'underutilized',
                        render: (count: number) => (
                          <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
                        )
                      }
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="人员详情" key="personnel">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Select placeholder="选择部门" style={{ width: 120 }}>
                  <Option value="all">全部部门</Option>
                  <Option value="技术部">技术部</Option>
                  <Option value="产品部">产品部</Option>
                  <Option value="数据部">数据部</Option>
                </Select>
                <Select placeholder="选择状态" style={{ width: 120 }}>
                  <Option value="all">全部状态</Option>
                  <Option value="overloaded">过载</Option>
                  <Option value="normal">正常</Option>
                  <Option value="underutilized">未充分利用</Option>
                </Select>
                <RangePicker />
              </Space>
            </div>

            <Table
              columns={saturationColumns}
              dataSource={saturationData}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </TabPane>

          <TabPane tab="饱和度分析" key="analysis">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="饱和度分布">
                  <GaugeChart
                    data={[
                      { name: '平均饱和度', value: avgSaturation, max: 100, unit: '%' },
                      { name: '过载率', value: (overloadedCount / totalPersonnel * 100), max: 100, unit: '%' },
                      { name: '未充分利用率', value: (underutilizedCount / totalPersonnel * 100), max: 100, unit: '%' }
                    ]}
                    height={200}
                    showMultiple={true}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="工作负荷分析">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#f5222d' }}>
                      {overloadedCount}
                    </div>
                    <div style={{ color: '#666' }}>过载人员</div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="资源利用率">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      {avgSaturation.toFixed(1)}%
                    </div>
                    <div style={{ color: '#666' }}>平均饱和度</div>
                  </div>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="饱和度热力图">
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                    <div style={{ marginTop: 16, color: '#666' }}>
                      饱和度热力图功能开发中...
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="告警管理" key="alerts">
            <List
              dataSource={alerts}
              renderItem={(alert) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        count={alert.severity === 'high' ? '高' : '低'} 
                        style={{ 
                          backgroundColor: alert.severity === 'high' ? '#f5222d' : '#52c41a' 
                        }}
                      />
                    }
                    title={alert.message}
                    description={alert.person}
                  />
                  <div>
                    <Tag color={alert.type === 'warning' ? 'orange' : 'blue'}>
                      {alert.type === 'warning' ? '警告' : '信息'}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PersonnelSaturation;
