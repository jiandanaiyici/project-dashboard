import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Tooltip, Alert, Table, Empty, Badge, Avatar } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, AlertOutlined, BugOutlined, FileTextOutlined, CalendarOutlined, LineChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './PersonalWorkloadAssessment.less';

/**
 * 个人工作负载评估组件
 * 根据工时投入、任务完成情况、缺陷率等指标评估个人工作负载
 */
const PersonalWorkloadAssessment = ({ 
  userId, 
  userName, 
  avatarUrl, 
  role, 
  department,
  onLoadMore,
  showActions = true
}) => {
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // 模拟数据生成函数 - 在实际应用中应从API获取
  const generateMockData = () => {
    // 基础指标
    const totalHours = Math.floor(Math.random() * 40) + 20; // 20-60小时
    const overtimeHours = Math.floor(totalHours * 0.2); // 加班为总工时的20%
    const availableHours = Math.max(0, 40 - totalHours + overtimeHours); // 可用工时
    const taskCompletionRate = Math.floor(Math.random() * 20) + 80; // 80-99%
    const onTimeCompletionRate = Math.floor(Math.random() * 25) + 70; // 70-94%
    const defectRate = Number((Math.random() * 4 + 0.5).toFixed(1)); // 0.5-4.5%
    
    // 计算综合负载得分 (100分为满分)
    // 工时占比40%，任务完成率占比30%，缺陷率占比30%
    let workloadScore = 100;
    workloadScore -= (totalHours > 40 ? (totalHours - 40) * 2 : 0); // 超工时扣分
    workloadScore -= (100 - taskCompletionRate) * 0.3; // 任务完成率扣分
    workloadScore += (defectRate < 2 ? (2 - defectRate) * 10 : 0); // 低缺陷率加分
    workloadScore = Math.max(0, Math.min(100, Math.round(workloadScore)));
    
    // 负载状态
    let workloadStatus = 'normal';
    if (workloadScore < 60) {
      workloadStatus = 'high';
    } else if (workloadScore < 80) {
      workloadStatus = 'medium';
    }
    
    // 生成趋势数据 (过去8周)
    const weeklyTrend = Array.from({ length: 8 }, (_, i) => ({
      week: `第${i + 1}周`,
      hours: Math.floor(Math.random() * 30) + 25,
      completionRate: Math.floor(Math.random() * 15) + 80,
      defectRate: Number((Math.random() * 3 + 0.5).toFixed(1))
    }));
    
    // 任务分布
    const taskDistribution = [
      { name: '开发', value: Math.floor(Math.random() * 50) + 30 },
      { name: '测试', value: Math.floor(Math.random() * 20) + 10 },
      { name: '会议', value: Math.floor(Math.random() * 15) + 5 },
      { name: '文档', value: Math.floor(Math.random() * 10) + 2 }
    ];
    
    // 最近任务列表
    const recentTasks = Array.from({ length: 5 }, (_, i) => {
      const statuses = ['completed', 'inProgress', 'pending', 'overdue'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      return {
        id: i + 1,
        name: `任务 ${String.fromCharCode(65 + i)}`,
        project: `项目${Math.floor(Math.random() * 3) + 1}`,
        status,
        priority: ['高', '中', '低'][Math.floor(Math.random() * 3)],
        deadline: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        hoursSpent: Math.floor(Math.random() * 10) + 2
      };
    });
    
    return {
      totalHours,
      overtimeHours,
      availableHours,
      taskCompletionRate,
      onTimeCompletionRate,
      defectRate,
      workloadScore,
      workloadStatus,
      weeklyTrend,
      taskDistribution,
      recentTasks
    };
  };

  // 生成负载建议
  const generateRecommendations = (data) => {
    const recs = [];
    
    if (data.workloadStatus === 'high') {
      recs.push('当前工作负载过高，建议减少任务分配或延长截止日期');
      recs.push('考虑将部分任务委派给团队其他成员');
    }
    
    if (data.defectRate > 2) {
      recs.push('缺陷率较高，建议增加代码审查时间或调整工作节奏');
    }
    
    if (data.onTimeCompletionRate < 80) {
      recs.push('任务按时完成率偏低，建议重新评估任务优先级和时间估算');
    }
    
    if (data.overtimeHours > 10) {
      recs.push('加班时间过长，注意工作与生活平衡，避免长期疲劳工作');
    }
    
    return recs;
  };

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 生成模拟数据
        const mockData = generateMockData();
        setAssessmentData(mockData);
        
        // 生成建议
        const recs = generateRecommendations(mockData);
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to fetch workload assessment data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 获取负载状态配置
  const getWorkloadStatusConfig = (status) => {
    const config = {
      high: { 
        color: '#ff4d4f', 
        label: '高负载',
        icon: <AlertOutlined />,
        description: '工作量饱和，存在延期风险'
      },
      medium: { 
        color: '#fa8c16', 
        label: '正常负载',
        icon: <CheckCircleOutlined />,
        description: '工作量适中，可接受'
      },
      normal: { 
        color: '#52c41a', 
        label: '低负载',
        icon: <ClockCircleOutlined />,
        description: '工作量轻松，可接受新任务'
      }
    };
    return config[status] || config.normal;
  };

  // 饼图颜色
  const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#722ed1'];

  // 任务状态配置
  const taskStatusConfig = {
    completed: { color: 'green', label: '已完成' },
    inProgress: { color: 'blue', label: '进行中' },
    pending: { color: 'orange', label: '待处理' },
    overdue: { color: 'red', label: '已逾期' }
  };

  // 任务表格列配置
  const taskColumns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属项目',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={taskStatusConfig[status]?.color || 'default'}>
          {taskStatusConfig[status]?.label || status}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <Tag color={priority === '高' ? 'red' : priority === '中' ? 'orange' : 'default'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '已投入工时',
      dataIndex: 'hoursSpent',
      key: 'hoursSpent',
      render: hours => `${hours}小时`,
    },
  ];

  if (loading || !assessmentData) {
    return (
      <Card loading={loading} className="personal-workload-assessment">
        <Empty description="加载中..." />
      </Card>
    );
  }

  const workloadConfig = getWorkloadStatusConfig(assessmentData.workloadStatus);

  return (
    <Card className={`personal-workload-assessment ${assessmentData.workloadStatus}`}>
      {/* 基本信息区域 */}
      <div className="assessment-header">
        <div className="user-info">
          <div className="user-avatar-name">
            <Avatar src={avatarUrl} className="avatar-large" />
            <div className="user-details">
              <h2 className="user-name">{userName}</h2>
              <p className="user-meta">{role} | {department}</p>
            </div>
          </div>
          <div className="workload-overview">
            <Badge.Ribbon
              text={workloadConfig.label}
              color={workloadConfig.color}
              className="workload-ribbon"
            >
              <div className="workload-score">
                <Statistic
                  value={assessmentData.workloadScore}
                  suffix="/100"
                  valueStyle={{ color: workloadConfig.color, fontSize: '2rem' }}
                  formatter={(value) => `${value}`}
                />
                <p className="workload-description">{workloadConfig.description}</p>
              </div>
            </Badge.Ribbon>
          </div>
        </div>
      </div>

      {/* 关键指标区域 */}
      <div className="key-metrics-section">
        <h3 className="section-title">关键指标</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="总工时投入"
              value={assessmentData.totalHours}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="加班时长"
              value={assessmentData.overtimeHours}
              suffix="小时"
              prefix={<AlertOutlined />}
              valueStyle={{ color: assessmentData.overtimeHours > 10 ? '#ff4d4f' : '#fa8c16' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="任务完成率"
              value={assessmentData.taskCompletionRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: assessmentData.taskCompletionRate > 90 ? '#52c41a' : '#fa8c16' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="缺陷率"
              value={assessmentData.defectRate}
              suffix="%"
              prefix={<BugOutlined />}
              valueStyle={{ color: assessmentData.defectRate > 2 ? '#ff4d4f' : '#52c41a' }}
            />
          </Col>
        </Row>

        {/* 详细进度条 */}
        <Row gutter={[16, 16]} className="progress-section">
          <Col xs={24} sm={12}>
            <div className="progress-item">
              <div className="progress-header">
                <span>工时饱和度</span>
                <span>{assessmentData.totalHours}/40小时</span>
              </div>
              <Progress 
                percent={Math.min(100, (assessmentData.totalHours / 40) * 100)} 
                strokeColor={assessmentData.totalHours > 40 ? '#ff4d4f' : '#1890ff'}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="progress-item">
              <div className="progress-header">
                <span>任务按时完成率</span>
                <span>{assessmentData.onTimeCompletionRate}%</span>
              </div>
              <Progress 
                percent={assessmentData.onTimeCompletionRate} 
                strokeColor={assessmentData.onTimeCompletionRate > 85 ? '#52c41a' : '#fa8c16'}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* 展开详情区域 */}
      {showDetails && (
        <div className="detailed-section">
          {/* 趋势图表 */}
          <div className="chart-section">
            <h3 className="section-title">工作负载趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={assessmentData.weeklyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="hours" name="工时" stroke="#1890ff" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="completionRate" name="完成率 (%)" stroke="#52c41a" />
                <Line yAxisId="right" type="monotone" dataKey="defectRate" name="缺陷率 (%)" stroke="#ff4d4f" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 任务分布和最近任务 */}
          <Row gutter={[16, 16]} className="bottom-sections">
            <Col xs={24} md={8}>
              <Card title="任务类型分布" className="distribution-card">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={assessmentData.taskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {assessmentData.taskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <Card title="最近任务" className="tasks-card">
                <Table
                  columns={taskColumns}
                  dataSource={assessmentData.recentTasks}
                  pagination={false}
                  size="small"
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>

          {/* 负载建议 */}
          {recommendations.length > 0 && (
            <div className="recommendations-section">
              <Alert
                message="工作负载建议"
                description={
                  <ul>
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                }
                type={assessmentData.workloadStatus === 'high' ? 'warning' : 'info'}
                showIcon
              />
            </div>
          )}
        </div>
      )}

      {/* 操作按钮 */}
      {showActions && (
        <div className="action-buttons">
          <button
            className="toggle-details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? '收起详情' : '查看详情'} {showDetails ? '−' : '+'}
          </button>
          {assessmentData.workloadStatus === 'high' && (
            <button className="adjust-workload-btn">
              <AlertOutlined /> 调整工作分配
            </button>
          )}
        </div>
      )}
    </Card>
  );
};

export default PersonalWorkloadAssessment;