import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Card, Space, Statistic, Timeline, Avatar, Drawer } from 'antd';
import {
  RocketOutlined,
  TeamOutlined,
  BarChartOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  StarFilled,
  TrophyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import { useMobileDetection } from '@/components/Mobile';
import './landing.less';

const { Title, Paragraph, Text } = Typography;

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface TestimonialItem {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

const Landing: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { isMobile, isSmallMobile } = useMobileDetection();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features: FeatureCard[] = [
    {
      icon: <TeamOutlined />,
      title: '智能人员管理',
      description: '全方位的人员技能评估、组织架构管理和团队协作优化',
      color: '#1890ff',
    },
    {
      icon: <BarChartOutlined />,
      title: '项目全生命周期',
      description: '从立项到交付的完整项目管理流程，支持敏捷开发和瀑布模型',
      color: '#52c41a',
    },
    {
      icon: <ThunderboltOutlined />,
      title: '实时性能监控',
      description: '7x24小时系统监控，智能告警和性能分析，保障系统稳定运行',
      color: '#fa8c16',
    },
    {
      icon: <SafetyOutlined />,
      title: '企业级安全',
      description: '多层次安全防护，符合等保要求，保障企业数据安全',
      color: '#722ed1',
    },
  ];

  const statistics = [
    { title: '服务企业', value: 500, suffix: '+', prefix: '' },
    { title: '项目成功率', value: 98.5, suffix: '%', prefix: '' },
    { title: '用户满意度', value: 4.9, suffix: '/5.0', prefix: '' },
    { title: '节省成本', value: 60, suffix: '%', prefix: '平均' },
  ];

  const testimonials: TestimonialItem[] = [
    {
      name: '张明',
      role: 'CTO',
      company: '科技创新公司',
      content: '这个平台帮助我们提升了30%的项目交付效率，团队协作变得更加顺畅。',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
      rating: 5,
    },
    {
      name: '李华',
      role: '项目总监',
      company: '互联网企业',
      content: '实时监控功能让我们能够及时发现和解决问题，大大减少了线上事故。',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
      rating: 5,
    },
    {
      name: '王芳',
      role: 'HR总监',
      company: '大型集团',
      content: '人员技能评估系统帮助我们更好地进行人才配置和培养规划。',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wang',
      rating: 5,
    },
  ];

  const handleGetStarted = () => {
    history.push('/register');
  };

  const handleLogin = () => {
    history.push('/login');
  };

  const handleDemo = () => {
    history.push('/dashboard');
  };

  return (
    <div className="landing-container">
      {/* 导航栏 */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo">
            <RocketOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <span className="logo-text">项目管理平台</span>
          </div>
          <nav className="nav-menu">
            {!isMobile ? (
              <Space size="large">
                <a href="#features">功能特色</a>
                <a href="#solutions">解决方案</a>
                <a href="#testimonials">客户案例</a>
                <a href="/pricing">价格方案</a>
              </Space>
            ) : (
              <Button 
                type="text" 
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuVisible(true)}
              />
            )}
          </nav>
          <div className="header-actions">
            <Space>
              <Button type="text" onClick={handleLogin}>
                登录
              </Button>
              <Button type="primary" onClick={handleGetStarted}>
                免费试用
              </Button>
            </Space>
          </div>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <Row align="middle" gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <div className="hero-text">
                <Title level={1} className="hero-title">
                  智能化项目管理
                  <br />
                  <span className="highlight">驱动企业数字化转型</span>
                </Title>
                <Paragraph className="hero-description">
                  集成人员管理、项目协作、性能监控于一体的企业级管理平台。
                  运用AI技术提升管理效率，让每个项目都能准时高质量交付。
                </Paragraph>
                <div className="hero-actions">
                  <Space size="large">
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<RocketOutlined />}
                      onClick={handleGetStarted}
                      className="cta-button"
                    >
                      立即开始免费试用
                    </Button>
                    <Button 
                      size="large" 
                      icon={<PlayCircleOutlined />}
                      onClick={handleDemo}
                      className="demo-button"
                    >
                      观看演示
                    </Button>
                  </Space>
                </div>
                <div className="hero-stats">
                  <Space size="large">
                    <div className="stat-item">
                      <Text strong>500+</Text>
                      <Text type="secondary">企业选择</Text>
                    </div>
                    <div className="stat-item">
                      <Text strong>98.5%</Text>
                      <Text type="secondary">项目成功率</Text>
                    </div>
                    <div className="stat-item">
                      <Text strong>4.9/5.0</Text>
                      <Text type="secondary">用户评分</Text>
                    </div>
                  </Space>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-visual">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <Text type="secondary">项目管理平台</Text>
                  </div>
                  <div className="preview-content">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Card size="small" className="metric-card">
                          <Statistic title="项目总数" value={128} prefix={<TrophyOutlined />} />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" className="metric-card">
                          <Statistic title="团队成员" value={45} prefix={<TeamOutlined />} />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" className="metric-card">
                          <Statistic title="完成率" value={95.2} suffix="%" prefix={<CheckCircleOutlined />} />
                        </Card>
                      </Col>
                    </Row>
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '80%' }}></div>
                        <div className="bar" style={{ height: '45%' }}></div>
                        <div className="bar" style={{ height: '90%' }}></div>
                        <div className="bar" style={{ height: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 核心数据 */}
      <section className="stats-section">
        <div className="section-content">
          <Row gutter={[32, 32]}>
            {statistics.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div className="stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    className="stat-number"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 功能特色 */}
      <section id="features" className="features-section">
        <div className="section-content">
          <div className="section-header">
            <Title level={2}>核心功能特色</Title>
            <Paragraph>
              全方位的项目管理解决方案，助力企业实现高效协作和智能决策
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <Title level={4}>{feature.title}</Title>
                  <Paragraph>{feature.description}</Paragraph>
                  <Button type="link" className="feature-link">
                    了解更多 <ArrowRightOutlined />
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 解决方案 */}
      <section id="solutions" className="solutions-section">
        <div className="section-content">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="solution-content">
                <Title level={2}>为什么选择我们？</Title>
                <Timeline
                  items={[
                    {
                      dot: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                      children: (
                        <div>
                          <Title level={4}>提升效率60%</Title>
                          <Paragraph>智能化工作流程，自动化任务分配，大幅提升团队协作效率</Paragraph>
                        </div>
                      ),
                    },
                    {
                      dot: <SafetyOutlined style={{ color: '#1890ff' }} />,
                      children: (
                        <div>
                          <Title level={4}>企业级安全</Title>
                          <Paragraph>多重安全防护，数据加密传输，符合国际安全标准</Paragraph>
                        </div>
                      ),
                    },
                    {
                      dot: <GlobalOutlined style={{ color: '#722ed1' }} />,
                      children: (
                        <div>
                          <Title level={4}>全球化部署</Title>
                          <Paragraph>支持多地域部署，7x24小时技术支持，保障业务连续性</Paragraph>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="solution-visual">
                <Card className="solution-card">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Card size="small" className="process-card">
                        <Space>
                          <Avatar style={{ backgroundColor: '#52c41a' }} icon={<CheckCircleOutlined />} />
                          <div>
                            <Text strong>项目立项</Text>
                            <br />
                            <Text type="secondary">智能评估项目可行性</Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card size="small" className="process-card">
                        <Space>
                          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<TeamOutlined />} />
                          <div>
                            <Text strong>团队组建</Text>
                            <br />
                            <Text type="secondary">AI匹配最优人员配置</Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card size="small" className="process-card">
                        <Space>
                          <Avatar style={{ backgroundColor: '#fa8c16' }} icon={<BarChartOutlined />} />
                          <div>
                            <Text strong>实时监控</Text>
                            <br />
                            <Text type="secondary">全方位进度和质量把控</Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 客户见证 */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-content">
          <div className="section-header">
            <Title level={2}>客户见证</Title>
            <Paragraph>听听我们的客户怎么说</Paragraph>
          </div>
          <div className="testimonial-container">
            <Card className="testimonial-card">
              <div className="testimonial-content">
                <div className="rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFilled 
                      key={i} 
                      style={{ 
                        color: i < testimonials[currentTestimonial].rating ? '#fadb14' : '#f0f0f0' 
                      }} 
                    />
                  ))}
                </div>
                <Paragraph className="testimonial-text">
                  "{testimonials[currentTestimonial].content}"
                </Paragraph>
                <div className="testimonial-author">
                  <Avatar src={testimonials[currentTestimonial].avatar} />
                  <div className="author-info">
                    <Text strong>{testimonials[currentTestimonial].name}</Text>
                    <br />
                    <Text type="secondary">
                      {testimonials[currentTestimonial].role} · {testimonials[currentTestimonial].company}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="cta-section">
        <div className="section-content">
          <div className="cta-content">
            <Title level={2}>准备开始您的数字化转型之旅？</Title>
            <Paragraph>
              立即注册，体验全功能免费试用，专业团队为您提供一对一服务
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large" 
                icon={<RocketOutlined />}
                onClick={handleGetStarted}
                className="cta-primary"
              >
                免费试用30天
              </Button>
              <Button 
                size="large" 
                onClick={handleDemo}
                className="cta-secondary"
              >
                预约演示
              </Button>
            </Space>
            <div className="cta-note">
              <Text type="secondary">
                * 无需信用卡，30天免费试用全部功能
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="landing-footer">
        <div className="footer-content">
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4}>产品</Title>
                <div className="footer-links">
                  <a href="#features">功能特色</a>
                  <a href="/pricing">价格方案</a>
                  <a href="#integrations">集成服务</a>
                  <a href="/api-docs">API文档</a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4}>解决方案</Title>
                <div className="footer-links">
                  <a href="#enterprise">企业版</a>
                  <a href="#startups">初创企业</a>
                  <a href="#agencies">代理机构</a>
                  <a href="#consulting">咨询服务</a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4}>支持</Title>
                <div className="footer-links">
                  <a href="#help">帮助中心</a>
                  <a href="#training">培训资源</a>
                  <a href="#community">社区论坛</a>
                  <a href="/contact">联系我们</a>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="footer-section">
                <Title level={4}>公司</Title>
                <div className="footer-links">
                  <a href="#about">关于我们</a>
                  <a href="#careers">加入我们</a>
                  <a href="#news">新闻动态</a>
                  <a href="#privacy">隐私政策</a>
                </div>
              </div>
            </Col>
          </Row>
          <div className="footer-bottom">
            <Text type="secondary">
              © 2024 项目管理平台. 保留所有权利.
            </Text>
          </div>
        </div>
      </footer>

      {/* 移动端导航抽屉 */}
      <Drawer
        title="导航菜单"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
      >
        <div className="mobile-nav-menu">
          <div className="mobile-nav-item">
            <a href="#features" onClick={() => setMobileMenuVisible(false)}>
              功能特色
            </a>
          </div>
          <div className="mobile-nav-item">
            <a href="#solutions" onClick={() => setMobileMenuVisible(false)}>
              解决方案
            </a>
          </div>
          <div className="mobile-nav-item">
            <a href="#testimonials" onClick={() => setMobileMenuVisible(false)}>
              客户案例
            </a>
          </div>
          <div className="mobile-nav-item">
            <a href="#pricing" onClick={() => setMobileMenuVisible(false)}>
              价格方案
            </a>
          </div>
          <div className="mobile-nav-actions">
            <Button type="text" onClick={handleLogin} block>
              登录
            </Button>
            <Button type="primary" onClick={handleGetStarted} block>
              免费试用
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Landing;