import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Statistic, Divider, Progress, Tabs, Empty, Avatar } from 'antd';
import { UserOutlined, ClockCircleOutlined, CheckCircleOutlined, AlertOutlined, BugOutlined, CodeOutlined, FileTextOutlined } from '@ant-design/icons';
import { userService } from '../services/api';
import MemberTransferChart from '../components/MemberTransferChart';
import './MemberDetail.less';

const { TabPane } = Tabs;

const MemberDetail = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transferData, setTransferData] = useState([]);

  // 生成模拟的人员流动数据
  const generateTransferData = (memberData) => {
    const transferData = [];
    let counter = 1;

    memberData.projects.forEach(project => {
      transferData.push({
        id: counter++,
        userId: memberData.id,
        userName: memberData.name,
        projectId: project.id,
        projectName: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        percentage: project.percentage
      });
    });

    return transferData;
  };

  // 生成模拟的分析数据
  const generateAnalyticsData = (memberData) => {
    return {
      saturation: memberData.saturation,
      totalHours: memberData.totalHours,
      completedRequirements: Math.floor(Math.random() * 50) + 10,
      overtimeDays: Math.floor(memberData.overtimeHours / 8),
      requirementCompletionRate: Math.floor(Math.random() * 20) + 80,
      onTimeCompletionRate: Math.floor(Math.random() * 30) + 70,
      efficiencyIndex: Math.floor(Math.random() * 20) + 80,
      resourceUtilization: memberData.saturation,
      defectRate: Math.floor(Math.random() * 5) + 1,
      codeCommits: Math.floor(Math.random() * 100) + 50,
      codeCommitsPerWeek: Math.floor(Math.random() * 20) + 5,
      releases: Math.floor(Math.random() * 10) + 1,
      releaseFrequency: Math.floor(Math.random() * 10) + 5,
      onlineIssues: Math.floor(Math.random() * 5),
      severityLevel: '低',
      developmentHours: Math.floor(memberData.totalHours * 0.6),
      testingHours: Math.floor(memberData.totalHours * 0.2),
      meetingHours: Math.floor(memberData.totalHours * 0.1),
      documentationHours: Math.floor(memberData.totalHours * 0.1),
      projectAllocations: memberData.projects.map((project, index) => ({
        id: project.id,
        name: project.name,
        percentage: project.percentage,
        color: ['#1890ff', '#722ed1', '#fa8c16', '#52c41a', '#13c2c2', '#eb2f96'][index % 6]
      }))
    };
  };

  // 获取成员详情和分析数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 尝试从localStorage获取数据（模拟环境）
        const storedMember = localStorage.getItem('selectedMember');
        if (storedMember) {
          const memberData = JSON.parse(storedMember);
          setMember(memberData);

          // 生成模拟的分析数据
          const analytics = generateAnalyticsData(memberData);
          setAnalyticsData(analytics);

          // 生成模拟的人员流动数据
          const transfers = generateTransferData(memberData);
          setTransferData(transfers);
        } else {
          // 尝试从API获取数据
          const memberData = await userService.getUserById(parseInt(id));
          setMember(memberData);

          // 获取成员分析数据
          const analytics = await userService.getUserAnalytics(parseInt(id));
          setAnalyticsData(analytics);
        }
      } catch (error) {
        console.error('Failed to fetch member details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="member-detail-container">
        <div className="loading-container">
          <Card loading={true} />
        </div>
      </div>
    );
  }

  if (!member || !analyticsData) {
    return (
      <div className="member-detail-container">
        <Empty description="成员数据不存在" />
      </div>
    );
  }

  return (
    <div className="member-detail-container">
      {/* 成员基本信息头部 */}
      <Card className="member-header-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6} className="member-basic-info">
            <div className="avatar-container">
              {member.avatarUrl ? (
                <Avatar size={64} src={member.avatarUrl} icon={<UserOutlined />} />
              ) : (
                <UserOutlined className="avatar-icon" />
              )}
              <div>
                <h2 className="member-name">{member.name}</h2>
                <p className="member-role">{member.role || (member.department ? `${member.department} - ${member.position}` : '')}</p>
                <div className="saturation-badge">
                  <span className={`saturation-value ${member.saturation > 80 ? 'danger' : member.saturation > 60 ? 'warning' : 'success'}`}>
                    {member.saturation}%
                  </span>
                  <span className="saturation-label">工作饱和度</span>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} md={18}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="工作饱和度"
                  value={analyticsData.saturation}
                  suffix="%"
                  valueStyle={{ color: analyticsData.saturation > 80 ? '#ff4d4f' : analyticsData.saturation > 60 ? '#fa8c16' : '#52c41a' }}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="总工时投入"
                  value={analyticsData.totalHours}
                  suffix="小时"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="已完成需求"
                  value={analyticsData.completedRequirements}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>

              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="加班小时"
                  value={member.overtimeHours}
                  suffix="小时"
                  prefix={<AlertOutlined />}
                  valueStyle={{ color: member.overtimeHours > 10 ? '#ff4d4f' : '#fa8c16' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* 详细指标标签页 */}
      <Tabs defaultActiveKey="workload" className="metrics-tabs">
        {/* 工作量分析 */}
        <TabPane tab="工作量分析" key="workload">
          <Card className="metrics-card">
            <h3 className="metric-section-title">主要工作指标</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="metric-item">
                  <div className="metric-header">
                    <span>需求完成率</span>
                    <span className="metric-value">{analyticsData.requirementCompletionRate}%</span>
                  </div>
                  <Progress percent={analyticsData.requirementCompletionRate} strokeColor="#1890ff" />
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="metric-item">
                  <div className="metric-header">
                    <span>任务按时完成率</span>
                    <span className="metric-value">{analyticsData.onTimeCompletionRate}%</span>
                  </div>
                  <Progress percent={analyticsData.onTimeCompletionRate} strokeColor="#52c41a" />
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="metric-item">
                  <div className="metric-header">
                    <span>工作效率指数</span>
                    <span className="metric-value">{analyticsData.efficiencyIndex}/100</span>
                  </div>
                  <Progress percent={analyticsData.efficiencyIndex} strokeColor="#fa8c16" />
                </div>
              </Col>

              <Col xs={24} sm={12} md={6}>
                <div className="metric-item">
                  <div className="metric-header">
                    <span>资源利用率</span>
                    <span className="metric-value">{analyticsData.resourceUtilization}%</span>
                  </div>
                  <Progress percent={analyticsData.resourceUtilization} strokeColor="#722ed1" />
                </div>
              </Col>
            </Row>

            <Divider />

            <h3 className="metric-section-title">项目分配情况</h3>
            <div className="projects-allocation">
              {analyticsData.projectAllocations.map(project => (
                <div key={project.id} className="project-allocation-item">
                  <div className="project-info">
                    <span className="project-name">{project.name}</span>
                    <span className="project-percentage">{project.percentage}%</span>
                  </div>
                  <Progress percent={project.percentage} strokeColor={project.color} />
                </div>
              ))}
            </div>
          </Card>
        </TabPane>

        {/* 质量分析 */}
        <TabPane tab="质量分析" key="quality">
          <Card className="metrics-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="quality-metric">
                  <div className="metric-icon">
                    <BugOutlined />
                  </div>
                  <div className="metric-content">
                    <h4>缺陷率</h4>
                    <div className="metric-value-large">{analyticsData.defectRate}%</div>
                    <p className="metric-description">
                      {analyticsData.defectRate <= 2 ? '优秀' : analyticsData.defectRate <= 5 ? '良好' : '需要改进'}
                    </p>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="quality-metric">
                  <div className="metric-icon">
                    <CodeOutlined />
                  </div>
                  <div className="metric-content">
                    <h4>代码提交次数</h4>
                    <div className="metric-value-large">{analyticsData.codeCommits}</div>
                    <p className="metric-description">平均每周 {analyticsData.codeCommitsPerWeek}</p>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="quality-metric">
                  <div className="metric-icon">
                    <FileTextOutlined />
                  </div>
                  <div className="metric-content">
                    <h4>发布数量</h4>
                    <div className="metric-value-large">{analyticsData.releases}</div>
                    <p className="metric-description">平均每 {analyticsData.releaseFrequency} 天</p>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={12}>
                <div className="quality-metric">
                  <div className="metric-icon">
                    <AlertOutlined />
                  </div>
                  <div className="metric-content">
                    <h4>线上问题数</h4>
                    <div className="metric-value-large">{analyticsData.onlineIssues}</div>
                    <p className="metric-description">严重程度: {analyticsData.severityLevel}</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>

        {/* 人员流动分析 */}
        <TabPane tab="人员流动" key="transfer">
          <MemberTransferChart
            transferData={transferData}
            projects={member.projects || []}
            users={[{ id: member.id, name: member.name }]}
            title={`${member.name}的项目分配与流动分析`}
            loading={loading}
          />
        </TabPane>

        {/* 时间明细 */}
        <TabPane tab="时间明细" key="time-details">
          <Card className="time-details-card">
            <div className="time-summary">
              <h3>时间分配概览</h3>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="开发时间" value={analyticsData.developmentHours} suffix="小时" />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="测试时间" value={analyticsData.testingHours} suffix="小时" />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="会议时间" value={analyticsData.meetingHours} suffix="小时" />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="文档时间" value={analyticsData.documentationHours} suffix="小时" />
                </Col>
              </Row>
            </div>

            <Divider />

            <div className="time-breakdown">
              <h3>时间细分</h3>
              {/* 这里可以添加时间记录的表格或图表 */}
              <Empty description="暂无详细时间记录数据" />
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MemberDetail;