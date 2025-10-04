import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Progress, 
  Select, 
  DatePicker, 
  Button,
  Statistic,
  Alert,
  Tabs,
  List,
  Avatar,
  Space,
  Tooltip,
  message
} from 'antd';
import { 
  UserOutlined,
  WarningOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { PageHeader, StatCard } from '@/components';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface WorkloadData {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
  currentWorkload: number; // 当前工作负载百分比
  capacity: number; // 工作容量 (小时/周)
  efficiency: number; // 工作效率评分
  projects: ProjectWorkload[];
  weeklyHours: number[];
  status: 'overloaded' | 'busy' | 'normal' | 'available';
  burnoutRisk: number; // 倦怠风险评分 0-100
  skillMatch: number; // 技能匹配度 0-100
}

interface ProjectWorkload {
  projectId: string;
  projectName: string;
  hoursPerWeek: number;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

/**
 * 工作负载概览
 */
const WorkloadOverview: React.FC<{ data: WorkloadData[] }> = ({ data }) => {
  const overloadedCount = data.filter(d => d.status === 'overloaded').length;
  const busyCount = data.filter(d => d.status === 'busy').length;
  const normalCount = data.filter(d => d.status === 'normal').length;
  const availableCount = data.filter(d => d.status === 'available').length;

  const averageWorkload = Math.round(data.reduce((sum, d) => sum + d.currentWorkload, 0) / data.length);
  const averageEfficiency = Math.round(data.reduce((sum, d) => sum + d.efficiency, 0) / data.length);
  const highRiskCount = data.filter(d => d.burnoutRisk > 70).length;

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <StatCard
          title="超负荷人员"
          value={overloadedCount}
          icon={<WarningOutlined />}
          style={{ borderLeft: '4px solid #ff4d4f' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="繁忙人员"
          value={busyCount}
          icon={<ClockCircleOutlined />}
          style={{ borderLeft: '4px solid #fa8c16' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="正常人员"
          value={normalCount}
          icon={<CheckCircleOutlined />}
          style={{ borderLeft: '4px solid #52c41a' }}
        />
      </Col>
      <Col span={6}>
        <StatCard
          title="可分配人员"
          value={availableCount}
          icon={<UserOutlined />}
          style={{ borderLeft: '4px solid #1890ff' }}
        />
      </Col>
      
      <Col span={8}>
        <Card>
          <Statistic
            title="平均工作负载"
            value={averageWorkload}
            suffix="%"
            valueStyle={{ color: averageWorkload > 80 ? '#ff4d4f' : '#52c41a' }}
          />
          <Progress 
            percent={averageWorkload} 
            strokeColor={averageWorkload > 80 ? '#ff4d4f' : '#52c41a'}
            style={{ marginTop: 8 }}
          />
        </Card>
      </Col>
      
      <Col span={8}>
        <Card>
          <Statistic
            title="平均工作效率"
            value={averageEfficiency}
            suffix="%"
            valueStyle={{ color: averageEfficiency > 70 ? '#52c41a' : '#fa8c16' }}
          />
          <Progress 
            percent={averageEfficiency} 
            strokeColor={averageEfficiency > 70 ? '#52c41a' : '#fa8c16'}
            style={{ marginTop: 8 }}
          />
        </Card>
      </Col>
      
      <Col span={8}>
        <Card>
          <Statistic
            title="高倦怠风险"
            value={highRiskCount}
            valueStyle={{ color: '#ff4d4f' }}
            prefix={<ExclamationCircleOutlined />}
          />
          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
            需要关注和调整
          </div>
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 工作负载分布图表
 */
const WorkloadCharts: React.FC<{ data: WorkloadData[] }> = ({ data }) => {
  // 工作负载分布
  const workloadDistribution = {
    title: { text: '工作负载分布', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: data.filter(d => d.status === 'overloaded').length, name: '超负荷(>100%)', itemStyle: { color: '#ff4d4f' } },
          { value: data.filter(d => d.status === 'busy').length, name: '繁忙(80-100%)', itemStyle: { color: '#fa8c16' } },
          { value: data.filter(d => d.status === 'normal').length, name: '正常(50-80%)', itemStyle: { color: '#52c41a' } },
          { value: data.filter(d => d.status === 'available').length, name: '可分配(<50%)', itemStyle: { color: '#1890ff' } }
        ]
      }
    ]
  };

  // 部门工作负载对比
  const departments = Array.from(new Set(data.map(d => d.department)));
  const departmentWorkload = {
    title: { text: '部门工作负载对比', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: departments
    },
    yAxis: { type: 'value', name: '平均负载(%)' },
    series: [
      {
        name: '平均工作负载',
        type: 'bar',
        data: departments.map(dept => {
          const deptData = data.filter(d => d.department === dept);
          return Math.round(deptData.reduce((sum, d) => sum + d.currentWorkload, 0) / deptData.length);
        }),
        itemStyle: {
          color: (params: any) => {
            const value = params.value;
            if (value > 90) return '#ff4d4f';
            if (value > 70) return '#fa8c16';
            return '#52c41a';
          }
        }
      }
    ]
  };

  // 效率vs负载散点图
  const efficiencyScatter = {
    title: { text: '效率与负载关系', left: 'center' },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const dataIndex = params.dataIndex;
        const person = data[dataIndex];
        return `${person.name}<br/>工作负载: ${person.currentWorkload}%<br/>工作效率: ${person.efficiency}%`;
      }
    },
    xAxis: { type: 'value', name: '工作负载(%)' },
    yAxis: { type: 'value', name: '工作效率(%)' },
    series: [
      {
        type: 'scatter',
        data: data.map(d => [d.currentWorkload, d.efficiency]),
        itemStyle: {
          color: (params: any) => {
            const [workload, efficiency] = params.value;
            if (workload > 100) return '#ff4d4f';
            if (efficiency < 60) return '#fa8c16';
            return '#52c41a';
          }
        },
        symbolSize: 8
      }
    ]
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={8}>
        <Card title="工作负载分布">
          <ReactECharts option={workloadDistribution} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="部门负载对比">
          <ReactECharts option={departmentWorkload} style={{ height: 300 }} />
        </Card>
      </Col>
      <Col span={8}>
        <Card title="效率与负载关系">
          <ReactECharts option={efficiencyScatter} style={{ height: 300 }} />
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 人员详细列表
 */
const StaffDetailTable: React.FC<{ data: WorkloadData[] }> = ({ data }) => {
  const [sortedData, setSortedData] = useState(data);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: WorkloadData) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} size="small" />
          <span>{text}</span>
        </Space>
      ),
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '当前负载',
      dataIndex: 'currentWorkload',
      key: 'currentWorkload',
      render: (workload: number) => (
        <div style={{ width: 100 }}>
          <div>{workload}%</div>
          <Progress 
            percent={Math.min(workload, 100)} 
            size="small"
            strokeColor={workload > 100 ? '#ff4d4f' : workload > 80 ? '#fa8c16' : '#52c41a'}
            showInfo={false}
          />
        </div>
      ),
      sorter: (a: WorkloadData, b: WorkloadData) => a.currentWorkload - b.currentWorkload,
      width: 120,
    },
    {
      title: '工作效率',
      dataIndex: 'efficiency',
      key: 'efficiency',
      render: (efficiency: number) => (
        <div>
          <div>{efficiency}%</div>
          <Progress 
            percent={efficiency} 
            size="small"
            strokeColor={efficiency > 70 ? '#52c41a' : '#fa8c16'}
            showInfo={false}
          />
        </div>
      ),
      sorter: (a: WorkloadData, b: WorkloadData) => a.efficiency - b.efficiency,
      width: 100,
    },
    {
      title: '倦怠风险',
      dataIndex: 'burnoutRisk',
      key: 'burnoutRisk',
      render: (risk: number) => {
        let color = 'green';
        let text = '低';
        if (risk > 70) {
          color = 'red';
          text = '高';
        } else if (risk > 40) {
          color = 'orange';
          text = '中';
        }
        return (
          <Tooltip title={`倦怠风险评分: ${risk}`}>
            <Tag color={color}>{text}</Tag>
          </Tooltip>
        );
      },
      sorter: (a: WorkloadData, b: WorkloadData) => a.burnoutRisk - b.burnoutRisk,
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          overloaded: { color: 'red', text: '超负荷' },
          busy: { color: 'orange', text: '繁忙' },
          normal: { color: 'blue', text: '正常' },
          available: { color: 'green', text: '可分配' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: '超负荷', value: 'overloaded' },
        { text: '繁忙', value: 'busy' },
        { text: '正常', value: 'normal' },
        { text: '可分配', value: 'available' },
      ],
      onFilter: (value: any, record: WorkloadData) => record.status === value,
      width: 80,
    },
    {
      title: '项目数',
      dataIndex: 'projects',
      key: 'projectCount',
      render: (projects: ProjectWorkload[]) => projects.length,
      sorter: (a: WorkloadData, b: WorkloadData) => a.projects.length - b.projects.length,
      width: 80,
    },
  ];

  const filteredData = data.filter(item => {
    if (filterDepartment !== 'all' && item.department !== filterDepartment) {
      return false;
    }
    if (filterStatus !== 'all' && item.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const departments = Array.from(new Set(data.map(d => d.department)));

  return (
    <Card 
      title="人员工作负载详情"
      extra={
        <Space>
          <Select
            value={filterDepartment}
            onChange={setFilterDepartment}
            style={{ width: 120 }}
          >
            <Option value="all">全部部门</Option>
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 100 }}
          >
            <Option value="all">全部状态</Option>
            <Option value="overloaded">超负荷</Option>
            <Option value="busy">繁忙</Option>
            <Option value="normal">正常</Option>
            <Option value="available">可分配</Option>
          </Select>
          <Button icon={<ExportOutlined />}>导出数据</Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        size="middle"
      />
    </Card>
  );
};

/**
 * 风险预警
 */
const RiskAlerts: React.FC<{ data: WorkloadData[] }> = ({ data }) => {
  const highRiskStaff = data.filter(d => d.burnoutRisk > 70 || d.currentWorkload > 110);
  const overloadedStaff = data.filter(d => d.currentWorkload > 100);
  const lowEfficiencyStaff = data.filter(d => d.efficiency < 60);

  return (
    <Card title="风险预警">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {highRiskStaff.length > 0 && (
          <Alert
            message="高倦怠风险预警"
            description={
              <div>
                以下人员存在高倦怠风险，建议适当调整工作安排：
                <List
                  size="small"
                  dataSource={highRiskStaff}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <Avatar src={item.avatar} icon={<UserOutlined />} size="small" />
                        <span>{item.name}</span>
                        <Tag color="red">倦怠风险: {item.burnoutRisk}%</Tag>
                        <Tag color="orange">负载: {item.currentWorkload}%</Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            }
            type="error"
            showIcon
          />
        )}

        {overloadedStaff.length > 0 && (
          <Alert
            message="工作负载超标"
            description={
              <div>
                以下人员工作负载超过100%，建议重新分配任务：
                <List
                  size="small"
                  dataSource={overloadedStaff}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <Avatar src={item.avatar} icon={<UserOutlined />} size="small" />
                        <span>{item.name}</span>
                        <Tag color="red">负载: {item.currentWorkload}%</Tag>
                        <span>涉及 {item.projects.length} 个项目</span>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            }
            type="warning"
            showIcon
          />
        )}

        {lowEfficiencyStaff.length > 0 && (
          <Alert
            message="工作效率偏低"
            description={
              <div>
                以下人员工作效率低于60%，建议关注和辅导：
                <List
                  size="small"
                  dataSource={lowEfficiencyStaff}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <Avatar src={item.avatar} icon={<UserOutlined />} size="small" />
                        <span>{item.name}</span>
                        <Tag color="orange">效率: {item.efficiency}%</Tag>
                        <Tag>技能匹配: {item.skillMatch}%</Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            }
            type="info"
            showIcon
          />
        )}

        {highRiskStaff.length === 0 && overloadedStaff.length === 0 && lowEfficiencyStaff.length === 0 && (
          <Alert
            message="团队状态良好"
            description="当前团队工作负载分配合理，无明显风险预警。"
            type="success"
            showIcon
          />
        )}
      </Space>
    </Card>
  );
};

/**
 * 人员饱和度分析主页面
 */
const WorkloadAnalysis: React.FC = () => {
  const [workloadData, setWorkloadData] = useState<WorkloadData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 模拟数据
  useEffect(() => {
    const mockData: WorkloadData[] = [
      {
        id: '1',
        name: '张三',
        department: '技术部',
        position: '前端工程师',
        currentWorkload: 115,
        capacity: 40,
        efficiency: 75,
        status: 'overloaded',
        burnoutRisk: 85,
        skillMatch: 90,
        weeklyHours: [45, 48, 42, 50, 46],
        projects: [
          { projectId: 'p1', projectName: 'ERP系统', hoursPerWeek: 25, priority: 'high', deadline: '2024-06-30' },
          { projectId: 'p2', projectName: '移动APP', hoursPerWeek: 15, priority: 'medium', deadline: '2024-08-15' },
          { projectId: 'p3', projectName: '官网改版', hoursPerWeek: 6, priority: 'low', deadline: '2024-09-30' },
        ],
      },
      {
        id: '2',
        name: '李四',
        department: '技术部',
        position: '后端工程师',
        currentWorkload: 95,
        capacity: 40,
        efficiency: 88,
        status: 'busy',
        burnoutRisk: 45,
        skillMatch: 95,
        weeklyHours: [38, 40, 36, 42, 39],
        projects: [
          { projectId: 'p1', projectName: 'ERP系统', hoursPerWeek: 30, priority: 'high', deadline: '2024-06-30' },
          { projectId: 'p4', projectName: '数据平台', hoursPerWeek: 8, priority: 'medium', deadline: '2024-07-31' },
        ],
      },
      {
        id: '3',
        name: '王五',
        department: '设计部',
        position: 'UI设计师',
        currentWorkload: 65,
        capacity: 40,
        efficiency: 82,
        status: 'normal',
        burnoutRisk: 25,
        skillMatch: 85,
        weeklyHours: [26, 28, 24, 30, 27],
        projects: [
          { projectId: 'p2', projectName: '移动APP', hoursPerWeek: 20, priority: 'medium', deadline: '2024-08-15' },
          { projectId: 'p3', projectName: '官网改版', hoursPerWeek: 6, priority: 'low', deadline: '2024-09-30' },
        ],
      },
      {
        id: '4',
        name: '赵六',
        department: '产品部',
        position: '产品经理',
        currentWorkload: 45,
        capacity: 40,
        efficiency: 70,
        status: 'available',
        burnoutRisk: 15,
        skillMatch: 75,
        weeklyHours: [18, 20, 16, 22, 19],
        projects: [
          { projectId: 'p4', projectName: '数据平台', hoursPerWeek: 18, priority: 'medium', deadline: '2024-07-31' },
        ],
      },
      {
        id: '5',
        name: '钱七',
        department: '测试部',
        position: '测试工程师',
        currentWorkload: 55,
        capacity: 40,
        efficiency: 65,
        status: 'normal',
        burnoutRisk: 30,
        skillMatch: 80,
        weeklyHours: [22, 24, 20, 26, 23],
        projects: [
          { projectId: 'p1', projectName: 'ERP系统', hoursPerWeek: 15, priority: 'high', deadline: '2024-06-30' },
          { projectId: 'p2', projectName: '移动APP', hoursPerWeek: 7, priority: 'medium', deadline: '2024-08-15' },
        ],
      },
    ];

    setWorkloadData(mockData);
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="人员饱和度分析" />
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="large"
      >
        <TabPane tab="负载概览" key="overview">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <WorkloadOverview data={workloadData} />
            <WorkloadCharts data={workloadData} />
          </Space>
        </TabPane>
        
        <TabPane tab="人员详情" key="details">
          <StaffDetailTable data={workloadData} />
        </TabPane>
        
        <TabPane tab="风险预警" key="alerts">
          <RiskAlerts data={workloadData} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default WorkloadAnalysis;