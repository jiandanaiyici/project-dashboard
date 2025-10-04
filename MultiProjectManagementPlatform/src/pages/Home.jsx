import { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Statistic, Avatar, Tag } from 'antd';
import {
    UserOutlined,
    ProjectOutlined,
    BarChartOutlined,
    PieChartOutlined,
    CalendarOutlined,
    LineChartOutlined,
    HeartOutlined
} from '@ant-design/icons';
import { overviewService } from '../services/api';
import './Home.less';

const Home = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 获取仪表盘数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await overviewService.getDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 计算高负荷成员数量
    const getHighLoadMembers = () => {
        if (!dashboardData?.userAllocations) return 0;
        return dashboardData.userAllocations.filter(user => user.saturation > 80).length;
    };

    // 获取总加班时长
    const getTotalOvertime = () => {
        if (!dashboardData?.userAllocations) return 0;
        return dashboardData.userAllocations.reduce((sum, user) => sum + (user.overtime || 0), 0);
    };

    return (
        <div className="home-container">
            {/* 头部横幅 */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">智能项目管理平台</h1>
                    <p className="hero-subtitle">整合资源、优化配置、提升效率，让项目管理更智能</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">{dashboardData?.totalProjects || 0}+</span>
                            <span className="stat-label">活跃项目</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{dashboardData?.totalMembers || 0}+</span>
                            <span className="stat-label">团队成员</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">项目成功率</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 平台概述 */}
            <section className="overview-section">
                <div className="section-header">
                    <h2 className="section-title">平台概述</h2>
                    <div className="section-divider"></div>
                </div>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card className="feature-card">
                            <div className="feature-icon">
                                <BarChartOutlined className="icon-large" />
                            </div>
                            <h3 className="feature-title">数据驱动决策</h3>
                            <p className="feature-description">
                                通过实时数据和历史分析，为资源分配提供科学依据，帮助管理层做出更明智的决策，优化资源利用率。
                            </p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card className="feature-card">
                            <div className="feature-icon">
                                <LineChartOutlined className="icon-large" />
                            </div>
                            <h3 className="feature-title">资源平衡优化</h3>
                            <p className="feature-description">
                                智能分析团队负载，避免个别人员过度工作而其他人闲置的情况，实现资源的最优配置和平衡使用。
                            </p>
                        </Card>
                    </Col>
                </Row>

                <div className="core-goals">
                    <h3 className="goals-title">平台核心目标</h3>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <LineChartOutlined className="icon-medium" />
                                </div>
                                <h4 className="goal-title">实时掌握状态</h4>
                                <p className="goal-description">全面监控项目和团队进度，及时发现问题</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <ProjectOutlined className="icon-medium" />
                                </div>
                                <h4 className="goal-title">优化人员负载</h4>
                                <p className="goal-description">智能平衡工作分配，避免过度或不足分配</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <BarChartOutlined className="icon-medium" />
                                </div>
                                <h4 className="goal-title">智能调度资源</h4>
                                <p className="goal-description">基于数据分析，提供最优资源分配建议</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <CalendarOutlined className="icon-medium" />
                                </div>
                                <h4 className="goal-title">合理管理加班</h4>
                                <p className="goal-description">有效控制加班情况，维护团队健康</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            {/* 核心功能模块 */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">核心功能模块</h2>
                    <div className="section-divider"></div>
                </div>

                <Row gutter={[24, 24]} className="features-row">
                    {/* 项目总览模块 */}
                    <Col xs={24} lg={12}>
                        <Card className="feature-card-large">
                            <h3 className="module-title">
                                {/* TODO 点击后跳转至项目纵览页面 */}
                                <ProjectOutlined className="module-icon" /> 项目总览模块
                            </h3>
                            <div className="module-content">
                                <div className="module-stats">
                                    <div className="stat-card">
                                        <Statistic
                                            title="总项目数"
                                            value={dashboardData?.totalProjects || 0}
                                            suffix="个"
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </div>
                                    <div className="stat-card">
                                        <Statistic
                                            title="进行中项目"
                                            value={dashboardData?.activeProjects || 0}
                                            suffix="个"
                                            valueStyle={{ color: '#13c2c2' }}
                                        />
                                    </div>
                                    <div className="stat-card">
                                        <Statistic
                                            title="已完成项目"
                                            value={dashboardData?.completedProjects || 0}
                                            suffix="个"
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                    </div>
                                </div>
                                <div className="module-description">
                                    <p>全面掌握所有项目的进度、状态和资源使用情况，支持按多种维度筛选和排序，提供可视化图表展示项目进展趋势。</p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* 资源管理模块 TODO 点击后跳转至资源管理页面 */}
                    <Col xs={24} lg={12}>
                        <Card className="feature-card-large">
                            <h3 className="module-title">
                                <UserOutlined className="module-icon" /> 资源管理模块
                            </h3>
                            <div className="module-content">
                                <div className="module-stats">
                                    <div className="stat-card">
                                        <Statistic
                                            title="团队成员"
                                            value={dashboardData?.totalMembers || 0}
                                            suffix="人"
                                            valueStyle={{ color: '#722ed1' }}
                                        />
                                    </div>
                                    <div className="stat-card">
                                        <Statistic
                                            title="高负荷成员"
                                            value={getHighLoadMembers()}
                                            suffix="人"
                                            valueStyle={{ color: '#ff4d4f' }}
                                        />
                                    </div>
                                    <div className="stat-card">
                                        <Statistic
                                            title="总工时"
                                            value={dashboardData?.totalHours || 0}
                                            suffix="小时"
                                            valueStyle={{ color: '#fa8c16' }}
                                        />
                                    </div>
                                </div>
                                <div className="module-description">
                                    <p>管理团队成员信息、技能和可用性，实时监控团队饱和度和工作量，提供人员分配和调整的建议。</p>
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* 负载监控模块 */}
                    <Col xs={24} lg={6}>
                        <Card className="feature-card-small">
                            <h3 className="module-title-small">
                                <PieChartOutlined className="module-icon-small" /> 负载监控
                            </h3>
                            <div className="module-description-small">
                                <p>实时监控团队和个人负载情况，及时识别高负载风险，提供负载预警机制。</p>
                            </div>
                        </Card>
                    </Col>

                    {/* 资源调度模块 */}
                    <Col xs={24} lg={6}>
                        <Card className="feature-card-small">
                            <h3 className="module-title-small">
                                <BarChartOutlined className="module-icon-small" /> 资源调度
                            </h3>
                            <div className="module-description-small">
                                <p>基于项目需求和团队技能，智能分配资源，优化资源利用率，减少资源冲突。</p>
                            </div>
                        </Card>
                    </Col>

                    {/* 加班管理模块 */}
                    <Col xs={24} lg={6}>
                        <Card className="feature-card-small">
                            <h3 className="module-title-small">
                                <CalendarOutlined className="module-icon-small" /> 加班管理
                            </h3>
                            <div className="module-description-small">
                                <p>记录和统计加班情况，分析加班原因，控制加班时长，维护团队健康。</p>
                            </div>
                        </Card>
                    </Col>

                    {/* 报表分析模块 */}
                    <Col xs={24} lg={6}>
                        <Card className="feature-card-small">
                            <h3 className="module-title-small">
                                <LineChartOutlined className="module-icon-small" /> 报表分析
                            </h3>
                            <div className="module-description-small">
                                <p>生成多维度报表，分析资源利用效率和项目进展，支持数据导出和自定义报表。</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/*
             个人时间明细看板 TODO 默认展示  TOP 3
             1. 点击查看更多 跳转至个人时间页面
             2. 点击个人时间面板跳转至详情页
            
            */}
            <section className="personal-board-section">
                <div className="section-header">
                    <h2 className="section-title">个人时间明细看板</h2>
                    <div className="section-divider"></div>
                </div>

                <Card className="personal-board-card">
                    <div className="personal-info">
                        <Avatar size={64} className="user-avatar-large">张</Avatar>
                        <div className="user-details">
                            <h3 className="user-name">张工程师</h3>
                            <p className="user-role">高级前端开发工程师</p>
                        </div>
                        <div className="user-stats">
                            <div className="stat-item-small">
                                <span className="stat-value">80%</span>
                                <span className="stat-label-small">负载率</span>
                            </div>
                            <div className="stat-item-small">
                                <span className="stat-value">{getTotalOvertime()}</span>
                                <span className="stat-label-small">加班(小时)</span>
                            </div>
                            <div className="stat-item-small">
                                <span className="stat-value">{dashboardData?.totalHours || 0}</span>
                                <span className="stat-label-small">本周工时</span>
                            </div>
                        </div>
                    </div>

                    <div className="time-allocations">
                        <h4 className="allocation-title">本周时间分配</h4>
                        <div className="allocation-list">
                            <div className="allocation-item">
                                <div className="allocation-info">
                                    <span className="project-name">项目A</span>
                                    <Tag color="blue">进行中</Tag>
                                </div>
                                <div className="allocation-progress">
                                    <Progress percent={65} showInfo={false} size="small" />
                                    <span className="allocation-hours">16h</span>
                                </div>
                            </div>
                            <div className="allocation-item">
                                <div className="allocation-info">
                                    <span className="project-name">项目B</span>
                                    <Tag color="blue">进行中</Tag>
                                </div>
                                <div className="allocation-progress">
                                    <Progress percent={45} showInfo={false} size="small" />
                                    <span className="allocation-hours">12h</span>
                                </div>
                            </div>
                            <div className="allocation-item">
                                <div className="allocation-info">
                                    <span className="project-name">项目C</span>
                                    <Tag color="green">已完成</Tag>
                                </div>
                                <div className="allocation-progress">
                                    <Progress percent={100} showInfo={false} size="small" status="success" />
                                    <span className="allocation-hours">8h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* 平台优势 */}
            <section className="advantages-section">
                <div className="section-header">
                    <h2 className="section-title">平台优势</h2>
                    <div className="section-divider"></div>
                </div>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <div className="advantage-card">
                            <div className="advantage-icon">
                                <BarChartOutlined className="icon-medium" />
                            </div>
                            <h3 className="advantage-title">数据驱动决策</h3>
                            <p className="advantage-description">通过实时数据和历史分析，为资源分配提供科学依据</p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="advantage-card">
                            <div className="advantage-icon">
                                <ProjectOutlined className="icon-medium" />
                            </div>
                            <h3 className="advantage-title">平衡资源负载</h3>
                            <p className="advantage-description">避免个别人员过度工作而其他人闲置的情况</p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="advantage-card">
                            <div className="advantage-icon">
                                <BarChartOutlined className="icon-medium" />
                            </div>
                            <h3 className="advantage-title">提高资源灵活性</h3>
                            <p className="advantage-description">快速响应项目变化，实现资源的最优配置</p>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div className="advantage-card">
                            <div className="advantage-icon">
                                <HeartOutlined className="icon-medium" />
                            </div>
                            <h3 className="advantage-title">可持续团队管理</h3>
                            <p className="advantage-description">合理控制加班，减少人员 burnout，提高团队稳定性</p>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* 技术实现建议 */}
            <section className="tech-section">
                <div className="section-header">
                    <h2 className="section-title">技术实现建议</h2>
                    <div className="section-divider"></div>
                </div>

                <Card className="tech-card">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <div className="tech-item">
                                <div className="tech-icon">
                                    <ProjectOutlined className="icon-small" />
                                </div>
                                <h3 className="tech-title">微服务架构</h3>
                                <p className="tech-description">采用微服务架构，确保各模块独立扩展，提高系统灵活性和可维护性</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <div className="tech-item">
                                <div className="tech-icon">
                                    <CalendarOutlined className="icon-small" />
                                </div>
                                <h3 className="tech-title">实时数据处理</h3>
                                <p className="tech-description">实时数据处理，保证负载和资源状态的即时性，支持动态决策</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <div className="tech-item">
                                <div className="tech-icon">
                                    <BarChartOutlined className="icon-small" />
                                </div>
                                <h3 className="tech-title">AI辅助决策</h3>
                                <p className="tech-description">引入AI辅助决策，优化资源分配建议，提高决策效率和准确性</p>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <div className="tech-item">
                                <div className="tech-icon">
                                    <UserOutlined className="icon-small" />
                                </div>
                                <h3 className="tech-title">移动端支持</h3>
                                <p className="tech-description">移动端支持，方便现场资源调度和状态更新，提高管理便捷性</p>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </section>
        </div>
    );
};

export default Home;