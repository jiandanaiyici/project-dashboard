import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Empty, Spin, Badge, Tooltip as AntTooltip, Modal, Button, Divider } from 'antd';
import ReportModal from './ReportModal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    AlertOutlined,
    ClockCircleOutlined,
    WarningOutlined,
    DatabaseOutlined,
    CloudOutlined,
    AppstoreOutlined,
    SettingOutlined,
    HistoryOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import './ApplicationHealthDashboard.less';
import { generateHealthData } from '../utils/mockData';
const ApplicationHealthDashboard = ({
    healthData = null,
    loading = false,
    title = '应用健康度大盘'
}) => {
    // 使用mock数据作为默认值，如果没有提供数据
    const defaultHealthData = React.useMemo(() => generateHealthData(), []);
    const healthDataObj = healthData || defaultHealthData;
    const healthDetails = healthDataObj.healthDetails || [];

    // 报表查看相关状态
    const [reportModalVisible, setReportModalVisible] = React.useState(false);
    const [selectedApp, setSelectedApp] = React.useState(null);

    // 打开报表模态框
    const openReportModal = (app = null) => {
        setSelectedApp(app);
        setReportModalVisible(true);
    };

    // 关闭报表模态框
    const closeReportModal = () => {
        setReportModalVisible(false);
        setSelectedApp(null);
    };

    // 生成详细报表数据（模拟）
    const generateDetailedReportData = (app) => {
        if (!app) {
            // 生成总体报表数据
            const healthTrend = [];
            const days = 30;
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
                const availability = parseFloat((99.0 + Math.random() * 0.8).toFixed(2));
                const responseTime = Math.floor(100 + Math.random() * 300);
                const errorRate = parseFloat((0.1 + Math.random() * 0.8).toFixed(3));
                
                // 计算健康评分（可用性权重60%，响应时间权重30%，错误率权重10%）
                const score = Math.floor(
                    availability * 0.6 +
                    (1 - Math.min(responseTime / 1000, 1)) * 30 +
                    (1 - Math.min(errorRate, 1)) * 10
                );
                
                healthTrend.push({
                    time: dateStr,
                    score: score,
                    availability: availability,
                    responseTime: responseTime,
                });
            }
            
            // 计算健康汇总数据
            const totalApps = healthDetails.length || 6;
            const normalApps = Math.floor(totalApps * 0.7 + Math.random() * totalApps * 0.2);
            const abnormalApps = totalApps - normalApps;
            
            // 错误类型分布
            const errorDistribution = {
                '系统错误': Math.floor(10 + Math.random() * 50),
                '网络错误': Math.floor(5 + Math.random() * 30),
                '数据库错误': Math.floor(3 + Math.random() * 20),
                '业务错误': Math.floor(8 + Math.random() * 40),
            };
            
            return {
                healthScore: 85 + Math.floor(Math.random() * 15),
                availability: parseFloat((99.0 + Math.random() * 0.8).toFixed(2)),
                avgResponseTime: Math.floor(100 + Math.random() * 300),
                normalApps: normalApps,
                abnormalApps: abnormalApps,
                monitoringDays: 30,
                healthTrend: healthTrend,
                errorDistribution: errorDistribution,
                summary: '根据过去30天的监控数据，系统整体运行状况良好。大部分应用保持高可用性和低响应时间，建议继续关注异常应用的性能优化。'
            };
        }
        
        // 生成单个应用的报表数据
        const healthTrend = [];
        const days = 30;
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            const baseAvailability = parseFloat(app.availability || '99.00');
            const baseResponseTime = parseInt(app.responseTime || '300');
            const baseErrorRate = parseFloat(app.errorRate || '0.50');
            
            const availability = parseFloat((baseAvailability - 0.5 + Math.random()).toFixed(2));
            const responseTime = Math.floor(baseResponseTime - 50 + Math.random() * 100);
            const errorRate = parseFloat((baseErrorRate - 0.2 + Math.random() * 0.4).toFixed(3));
            
            // 计算健康评分
            const score = Math.floor(
                availability * 0.6 +
                (1 - Math.min(responseTime / 1000, 1)) * 30 +
                (1 - Math.min(errorRate, 1)) * 10
            );
            
            healthTrend.push({
                time: dateStr,
                score: score,
                availability: availability,
                responseTime: responseTime,
            });
        }
        
        // 错误类型分布
        const errorDistribution = {
            '系统错误': Math.floor(1 + Math.random() * 10),
            '网络错误': Math.floor(1 + Math.random() * 5),
            '数据库错误': Math.floor(1 + Math.random() * 8),
            '业务错误': Math.floor(1 + Math.random() * 15),
        };
        
        return {
            appName: app.name,
            status: getStatusConfig(app.status).text,
            category: app.category,
            lastUpdated: new Date().toISOString(),
            healthScore: app.healthScore || 85 + Math.floor(Math.random() * 15),
            availability: parseFloat(app.availability || '99.00'),
            avgResponseTime: parseInt(app.responseTime || '300'),
            healthTrend: healthTrend,
            errorDistribution: errorDistribution,
            summary: `${app.name}在过去30天内整体运行${getStatusConfig(app.status).text === '健康' ? '良好' : '基本稳定，存在一些波动'}。可用性保持在${app.availability}%左右，响应时间平均${app.responseTime}ms。建议继续关注${errorDistribution['系统错误'] > errorDistribution['业务错误'] ? '系统稳定性' : '业务逻辑'}方面的优化。`
        };
    };

    // 获取状态图标和颜色
    const getStatusConfig = (status) => {
        switch (status) {
            case 'normal':
            case '健康':
                return { icon: <CheckCircleOutlined />, color: '#52c41a', bgColor: '#f6ffed', text: '健康' };
            case 'warning':
            case '警告':
                return { icon: <ExclamationCircleOutlined />, color: '#fa8c16', bgColor: '#fffbe6', text: '警告' };
            case 'error':
            case '危险':
                return { icon: <CloseCircleOutlined />, color: '#ff4d4f', bgColor: '#fff1f0', text: '危险' };
            default:
                return { icon: <AlertOutlined />, color: '#1890ff', bgColor: '#e6f7ff', text: '未知' };
        }
    };

    // 获取应用类别图标
    const getCategoryIcon = (category) => {
        switch (category) {
            case '核心业务':
                return <AppstoreOutlined />;
            case '支撑系统':
                return <DatabaseOutlined />;
            case '运维平台':
                return <SettingOutlined />;
            default:
                return <CloudOutlined />;
        }
    };

    // 准备饼图数据
    const getStatusPieData = () => {
        const statusDistribution = healthDataObj.statusDistribution || {};
        return [
            { name: '健康', value: statusDistribution.normal || 0, color: '#52c41a' },
            { name: '警告', value: statusDistribution.warning || 0, color: '#fa8c16' },
            { name: '危险', value: statusDistribution.error || 0, color: '#ff4d4f' }
        ].filter(item => item.value > 0);
    };

    // 准备响应时间柱状图数据
    const getResponseTimeBarData = () => {
        return healthDetails
            .sort((a, b) => a.responseTime - b.responseTime)
            .slice(0, 8) // 显示前8个应用
            .map(app => ({
                name: app.name.length > 8 ? `${app.name.substring(0, 8)}...` : app.name,
                响应时间: app.responseTime,
                状态: app.status
            }));
    };

    // 准备可用性趋势线图数据
    const getAvailabilityTrendData = () => {
        // 生成最近7天的模拟趋势数据
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayStr = `${date.getMonth() + 1}/${date.getDate()}`;
            days.push(dayStr);
        }

        return days.map(day => {
            const baseValue = 99.0 + Math.random() * 0.8;
            return {
                日期: day,
                平均可用性: parseFloat(baseValue.toFixed(2))
            };
        });
    };

    // 准备类别分布数据
    const getCategoryDistributionData = () => {
        const categoryCount = {};
        healthDetails.forEach(app => {
            categoryCount[app.category] = (categoryCount[app.category] || 0) + 1;
        });

        return Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value
        }));
    };

    const pieData = getStatusPieData();
    const barData = getResponseTimeBarData();
    const availabilityTrendData = getAvailabilityTrendData();
    const categoryData = getCategoryDistributionData();

    // 处理数据容错，确保即使数据为空也能正常显示
    const handleDataFallback = () => {
        if (!healthDetails || healthDetails.length === 0) {
            // 生成模拟数据以确保界面不会空白
            const mockApps = [
                { id: 1, name: '电商平台', type: 'Web应用', category: '核心业务', availability: 99.5, responseTime: 280, errorRate: 0.15, status: 'normal', healthScore: 95 },
                { id: 2, name: '数据分析后台', type: 'Web应用', category: '支撑系统', availability: 98.9, responseTime: 420, errorRate: 0.45, status: 'normal', healthScore: 85 },
                { id: 3, name: '移动应用', type: '移动端应用', category: '核心业务', availability: 99.2, responseTime: 380, errorRate: 0.28, status: 'normal', healthScore: 90 },
                { id: 4, name: '订单处理系统', type: '微服务', category: '核心业务', availability: 98.5, responseTime: 510, errorRate: 0.62, status: 'warning', healthScore: 78 },
                { id: 5, name: '支付网关', type: '微服务', category: '核心业务', availability: 99.7, responseTime: 220, errorRate: 0.08, status: 'normal', healthScore: 98 },
                { id: 6, name: '监控告警平台', type: 'Web应用', category: '运维平台', availability: 98.2, responseTime: 650, errorRate: 0.95, status: 'warning', healthScore: 72 },
            ];
            return mockApps;
        }
        return healthDetails;
    };

    // 获取实际要显示的应用数据（包含容错处理）
    const displayAppsData = handleDataFallback();

    return (
        <div className="application-health-dashboard">
            <Card title={title} className="health-dashboard-card" loading={loading}>
                {/* 整体健康状态卡片 */}
                <div className="overall-health-section">
                    <Card className="overall-health-card">
                        <Row gutter={[16, 0]}>
                            <Col xs={24} md={12} lg={6}>
                                <Statistic
                                    title="整体健康状态"
                                    value={getStatusConfig(healthDataObj.overallHealth || 'normal').text}
                                    valueStyle={{ color: getStatusConfig(healthDataObj.overallHealth || 'normal').color }}
                                    prefix={getStatusConfig(healthDataObj.overallHealth || 'normal').icon}
                                />
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Statistic
                                    title="应用总数"
                                    value={healthDataObj.totalApps || displayAppsData.length}
                                    prefix={<DatabaseOutlined />}
                                />
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Statistic
                                    title="平均可用性"
                                    value={healthDataObj.avgAvailability || '99.00'}
                                    suffix="%"
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Statistic
                                    title="平均错误率"
                                    value={healthDataObj.avgErrorRate || '0.50'}
                                    suffix="%"
                                    prefix={<WarningOutlined />}
                                    valueStyle={{ color: (parseFloat(healthDataObj.avgErrorRate || '0.50') > 0.8) ? '#ff4d4f' : '#52c41a' }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>

                {/* 健康状态分布和可用性趋势 */}
                <Row gutter={[16, 16]} className="health-content">
                    {/* 饼图：健康状态分布 */}
                    <Col xs={24} md={12} className="health-chart-col">
                        <Card title="应用健康状态分布" className="health-chart-card">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}个应用`, '数量']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    {/* 折线图：可用性趋势 */}
                    <Col xs={24} md={12} className="health-chart-col">
                        <Card title="平均可用性趋势 (7天)" className="health-chart-card">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={availabilityTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="日期" />
                                    <YAxis domain={[98.5, 100]} label={{ value: '可用性 (%)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value}%`, '平均可用性']} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="平均可用性" 
                                        stroke="#1890ff" 
                                        strokeWidth={2} 
                                        dot={{ r: 4 }} 
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    {/* 柱状图：应用响应时间 */}
                    <Col xs={24} lg={12} className="health-chart-col">
                        <Card title="应用响应时间对比 (TOP 8)" className="health-chart-card">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis label={{ value: '响应时间 (ms)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip formatter={(value) => [`${value}ms`, '响应时间']} />
                                    <Bar
                                        dataKey="响应时间"
                                        fill={(entry) => getStatusConfig(entry.状态).color}
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>

                    {/* 饼图：应用类别分布 */}
                    <Col xs={24} lg={12} className="health-chart-col">
                        <Card title="应用类别分布" className="health-chart-card">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#1890ff', '#52c41a', '#fa8c16', '#722ed1'][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}个应用`, '数量']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>

                {/* 应用健康详情列表 */}
                <div className="health-details-section">
                    <Card 
                        title="应用健康详情" 
                        className="health-details-card"
                        extra={
                            <Button 
                                type="primary" 
                                icon={<BarChartOutlined />} 
                                onClick={() => openReportModal()}
                            >
                                查看总体报表
                            </Button>
                        }
                    >
                        <div className="health-apps-grid">
                            {displayAppsData.map((app) => {
                                const statusConfig = getStatusConfig(app.status);
                                // 计算环比变化（模拟数据）
                                const availabilityChange = (Math.random() * 0.6 - 0.3).toFixed(2);
                                const responseTimeChange = (Math.random() * 40 - 20).toFixed(0);
                                const errorRateChange = (Math.random() * 0.2 - 0.1).toFixed(2);
                                
                                return (
                                    <Card
                                        key={app.id}
                                        size="small"
                                        className="health-app-card"
                                        style={{ backgroundColor: statusConfig.bgColor }}
                                        title={
                                            <div className="app-card-title">
                                                <span>{app.name}</span>
                                                <Tag color={statusConfig.color} icon={statusConfig.icon}>
                                                    {statusConfig.text}
                                                </Tag>
                                            </div>
                                        }
                                        extra={
                                            <div className="app-card-extra">
                                                <Badge 
                                                    count={`${app.healthScore || 90}`} 
                                                    showZero 
                                                    style={{ 
                                                        backgroundColor: app.healthScore > 80 ? '#52c41a' : app.healthScore > 60 ? '#fa8c16' : '#ff4d4f',
                                                        fontSize: '12px',
                                                        padding: '0 4px',
                                                        height: '18px',
                                                        lineHeight: '18px'
                                                    }}
                                                />
                                                <AntTooltip title={app.type}>
                                                    <div className="app-type-icon">
                                                        {getCategoryIcon(app.category)}
                                                    </div>
                                                </AntTooltip>
                                            </div>
                                        }
                                    >
                                        <Row gutter={[16, 0]}>
                                            <Col span={12}>
                                                <div className="app-metric">
                                                    <div className="metric-header">
                                                        <span className="metric-label">可用性</span>
                                                        <span className={`metric-change ${parseFloat(availabilityChange) > 0 ? 'positive' : parseFloat(availabilityChange) < 0 ? 'negative' : 'neutral'}`}>
                                                            {parseFloat(availabilityChange) > 0 ? <ArrowUpOutlined /> : parseFloat(availabilityChange) < 0 ? <ArrowDownOutlined /> : null}
                                                            {availabilityChange !== '0.00' && `${availabilityChange}%`}
                                                        </span>
                                                    </div>
                                                    <div className="metric-value">
                                                        <span style={{ color: statusConfig.color }}>{app.availability || 99.00}%</span>
                                                    </div>
                                                    <Progress
                                                        percent={app.availability || 99}
                                                        size="small"
                                                        status="active"
                                                        strokeColor={statusConfig.color}
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="app-metric">
                                                    <div className="metric-header">
                                                        <span className="metric-label">响应时间</span>
                                                        <span className={`metric-change ${parseFloat(responseTimeChange) < 0 ? 'positive' : parseFloat(responseTimeChange) > 0 ? 'negative' : 'neutral'}`}>
                                                            {parseFloat(responseTimeChange) > 0 ? <ArrowUpOutlined /> : parseFloat(responseTimeChange) < 0 ? <ArrowDownOutlined /> : null}
                                                            {responseTimeChange !== '0' && `${responseTimeChange}ms`}
                                                        </span>
                                                    </div>
                                                    <div className="metric-value">
                                                        <span style={{ color: statusConfig.color }}>{app.responseTime || 300}ms</span>
                                                    </div>
                                                    <Progress
                                                        percent={Math.min(100, (app.responseTime || 300) / 10)}
                                                        size="small"
                                                        status="active"
                                                        strokeColor={statusConfig.color}
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="app-metric">
                                                    <div className="metric-header">
                                                        <span className="metric-label">错误率</span>
                                                        <span className={`metric-change ${parseFloat(errorRateChange) < 0 ? 'positive' : parseFloat(errorRateChange) > 0 ? 'negative' : 'neutral'}`}>
                                                            {parseFloat(errorRateChange) > 0 ? <ArrowUpOutlined /> : parseFloat(errorRateChange) < 0 ? <ArrowDownOutlined /> : null}
                                                            {errorRateChange !== '0.00' && `${errorRateChange}%`}
                                                        </span>
                                                    </div>
                                                    <div className="metric-value">
                                                        <span style={{ color: statusConfig.color }}>{app.errorRate || 0.50}%</span>
                                                    </div>
                                                    <Progress
                                                        percent={app.errorRate || 0.5}
                                                        size="small"
                                                        status="active"
                                                        strokeColor={statusConfig.color}
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className="app-metric">
                                                    <div className="metric-header">
                                                        <span className="metric-label">类别</span>
                                                        <span className="metric-label">类型</span>
                                                    </div>
                                                    <div className="metric-value">
                                                        <Tag icon={getCategoryIcon(app.category)}>{app.category}</Tag>
                                                    </div>
                                                    <div className="metric-value">
                                                        <Tag color="blue">{app.type}</Tag>
                                                    </div>
                                                    <div className="last-checked">
                                                        <HistoryOutlined style={{ marginRight: '4px' }} />
                                                        更新于: {new Date().toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="app-card-actions">
                                            <Button 
                                                size="small" 
                                                onClick={() => openReportModal(app)}
                                                style={{ width: '100%' }}
                                                icon={<BarChartOutlined />}
                                            >
                                                查看详情报表
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </Card>
            
            {/* 报表查看模态框 */}
            <ReportModal
                visible={reportModalVisible}
                onCancel={closeReportModal}
                reportData={selectedApp ? generateDetailedReportData(selectedApp) : generateDetailedReportData()}
            />
        </div>
    );
};

export default ApplicationHealthDashboard;