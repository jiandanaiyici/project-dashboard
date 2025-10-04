/**
 * 个人发展计划 + AI 推荐
 */
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  Avatar,
  Button,
  Typography,
  Tabs,
  Badge,
  Progress,
  Input,
  Select,
  Dropdown,
  message,
  Tooltip,
  Divider,
  List,
  Tag,
} from 'antd';
import {
  LineChartOutlined,
  CodeOutlined,
  CheckSquareOutlined,
  BookOutlined,
  TeamOutlined,
  DownloadOutlined,
  PlusOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  Line,
  Bar,
  Pie,
  Radar,
  Tooltip as VTooltip,
  // Axis, Legend, Coord, Label, View, Guide
} from '@ant-design/charts';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 模拟数据
const efficiencyTrendData = [
  { month: '1月', overall: 72, task: 78, code: 82, collaboration: 75 },
  { month: '2月', overall: 74, task: 80, code: 81, collaboration: 77 },
  { month: '3月', overall: 76, task: 82, code: 80, collaboration: 79 },
  { month: '4月', overall: 78, task: 84, code: 81, collaboration: 81 },
  { month: '5月', overall: 80, task: 85, code: 81, collaboration: 83 },
  { month: '6月', overall: 82, task: 87, code: 79, collaboration: 85 },
];

const skillRadarData = [
  { name: 'HTML/CSS', value: 88, target: 90 },
  { name: 'JavaScript', value: 78, target: 85 },
  { name: 'React', value: 88, target: 95 },
  { name: 'Vue', value: 72, target: 80 },
  { name: '工程化', value: 70, target: 85 },
  { name: '性能优化', value: 60, target: 80 },
  { name: '跨端开发', value: 55, target: 75 },
];

const taskTypeData = [
  { type: '新功能开发', value: 40 },
  { type: 'Bug修复', value: 25 },
  { type: 'UI调整', value: 15 },
  { type: '性能优化', value: 10 },
  { type: '重构', value: 10 },
];

const taskCycleData = [
  { type: '新功能开发', estimate: 8, actual: 9 },
  { type: 'Bug修复', estimate: 2, actual: 2.5 },
  { type: 'UI调整', estimate: 3, actual: 4 },
  { type: '性能优化', estimate: 6, actual: 5 },
  { type: '重构', estimate: 10, actual: 12 },
];

const codeIssuesData = [
  { issue: 'CSS冗余', value: 35 },
  { issue: '函数过长', value: 25 },
  { issue: '缺少注释', value: 15 },
  { issue: '重复代码', value: 15 },
  { issue: '性能问题', value: 10 },
];

const teamSkillData = [
  { skill: 'HTML/CSS', personal: 88, team: 82 },
  { skill: 'JavaScript', personal: 78, team: 75 },
  { skill: 'React', personal: 88, team: 76 },
  { skill: 'Vue', personal: 72, team: 74 },
  { skill: '工程化', personal: 70, team: 73 },
  { skill: '性能优化', personal: 60, team: 68 },
];

const teamRankingData = [
  { name: '王开发', score: 91, rank: 1 },
  { name: '李开发（你）', score: 82, rank: 2 },
  { name: '张开发', score: 79, rank: 3 },
  { name: '赵开发', score: 76, rank: 4 },
];

const growthPlanData = [
  {
    title: '提升代码质量与复用率',
    status: '重点',
    target: '将代码复用率从当前的62%提升至75%以上',
    progress: 60,
    completed: '3/5',
  },
  {
    title: '深入学习React性能优化',
    status: '进阶',
    target: '掌握React组件优化、状态管理优化等核心技巧',
    progress: 25,
    completed: '1/4',
  },
  {
    title: '学习微前端架构',
    status: '拓展',
    target: '理解微前端核心概念，能够参与微前端项目开发',
    progress: 0,
    completed: '0/3',
  },
];

const learningResources = [
  {
    title: 'React性能优化实战课程',
    description: '基于你的技能缺口推荐，包含12个实战案例',
    type: '视频课程',
    time: '6小时',
    icon: <VideoCameraOutlined />,
  },
  {
    title: '现代CSS架构与组件化开发',
    description: '针对你的CSS复用率问题，学习模块化解决方案',
    type: '电子书',
    time: '4小时',
    icon: <BookOutlined />,
  },
];

const skillsData = [
  {
    category: '前端基础',
    skills: [
      { name: 'HTML5', level: 90, status: 'success' },
      { name: 'CSS3', level: 85, status: 'success' },
      { name: 'JavaScript', level: 78, status: 'warning' },
      { name: 'ES6+', level: 82, status: 'success' },
    ],
  },
  {
    category: '框架与库',
    skills: [
      { name: 'React', level: 88, status: 'success' },
      { name: 'Vue', level: 72, status: 'warning' },
      { name: 'Angular', level: 45, status: 'error' },
      { name: 'TypeScript', level: 75, status: 'warning' },
    ],
  },
  {
    category: '工具与工程化',
    skills: [
      { name: 'Webpack', level: 76, status: 'warning' },
      { name: 'Git', level: 85, status: 'success' },
      { name: 'Docker', level: 52, status: 'error' },
      { name: 'CI/CD', level: 68, status: 'warning' },
    ],
  },
  {
    category: '性能与优化',
    skills: [
      { name: '页面加载优化', level: 70, status: 'warning' },
      { name: '渲染性能', level: 58, status: 'error' },
      { name: '代码分割', level: 55, status: 'error' },
    ],
  },
];

const PersonalDevelopmentPlan = () => {
  // 初始化图表
  // useEffect(() => {
  //   const efficiencyTrendChart = new Line({
  //     el: document.getElementById('efficiencyTrend'),
  //     width: 'auto',
  //     height: 300,
  //   });

  //   efficiencyTrendChart.source(efficiencyTrendData);
  //   efficiencyTrendChart.scale({
  //     overall: { min: 50, max: 100 },
  //     task: { min: 50, max: 100 },
  //     code: { min: 50, max: 100 },
  //     collaboration: { min: 50, max: 100 },
  //   });

  //   efficiencyTrendChart.tooltip({
  //     showCrosshairs: true,
  //     shared: true,
  //   });

  //   efficiencyTrendChart.axis('month', {
  //     label: {
  //       fontSize: 12,
  //     },
  //   });

  //   efficiencyTrendChart.axis('value', {
  //     label: {
  //       fontSize: 12,
  //     },
  //   });

  //   efficiencyTrendChart
  //     .line()
  //     .position('month*overall')
  //     .color('#165DFF')
  //     .size(2);
  //   efficiencyTrendChart.line().position('month*task').color('#52C41A').size(2);
  //   efficiencyTrendChart.line().position('month*code').color('#FAAD14').size(2);
  //   efficiencyTrendChart
  //     .line()
  //     .position('month*collaboration')
  //     .color('#1890FF')
  //     .size(2);

  //   efficiencyTrendChart.render();

  //   // 技能雷达图
  //   const skillRadarChart = new Radar({
  //     el: document.getElementById('skillRadar'),
  //     width: 'auto',
  //     height: 300,
  //   });

  //   skillRadarChart.source(skillRadarData, {
  //     value: {
  //       min: 0,
  //       max: 100,
  //       tickCount: 5,
  //     },
  //     target: {
  //       min: 0,
  //       max: 100,
  //       tickCount: 5,
  //     },
  //   });

  //   skillRadarChart.coord('polar', {
  //     startAngle: -Math.PI / 2,
  //     endAngle: (Math.PI * 3) / 2,
  //     radius: 0.85,
  //   });

  //   skillRadarChart.axis('name', {
  //     label: {
  //       fontSize: 12,
  //     },
  //   });

  //   skillRadarChart
  //     .line()
  //     .position('name*value')
  //     .color('#165DFF')
  //     .size(2)
  //     .connectNulls(true);

  //   skillRadarChart.area().position('name*value').color('#165DFF').opacity(0.2);

  //   skillRadarChart
  //     .line()
  //     .position('name*target')
  //     .color('#52C41A')
  //     .size(2)
  //     .style({
  //       lineDash: [5, 5],
  //     })
  //     .connectNulls(true);

  //   skillRadarChart.render();

  //   // 任务类型分布图
  //   const taskTypeChart = new Pie({
  //     el: document.getElementById('taskType'),
  //     width: 'auto',
  //     height: 250,
  //   });

  //   taskTypeChart.source(taskTypeData);
  //   taskTypeChart.coord('theta', {
  //     radius: 0.75,
  //   });
  //   taskTypeChart.legend('type', {
  //     position: 'bottom',
  //     itemFormatter: val => {
  //       const item = taskTypeData.find(d => d.type === val);
  //       return `${val} ${item.value}%`;
  //     },
  //   });
  //   taskTypeChart.tooltip({
  //     showTitle: false,
  //     itemTpl: '<li>{name}: {value}%</li>',
  //   });
  //   taskTypeChart
  //     .interval()
  //     .position('value')
  //     .color('type', ['#165DFF', '#52C41A', '#FAAD14', '#1890FF', '#722ED1'])
  //     .adjust('stack')
  //     .style({
  //       lineWidth: 1,
  //       stroke: '#fff',
  //     })
  //     .label('type', {
  //       offset: -20,
  //       style: {
  //         fill: '#fff',
  //         fontSize: 12,
  //         fontWeight: 'bold',
  //       },
  //     });

  //   taskTypeChart.render();

  //   // 任务周期分析图
  //   // const taskCycleChart = new Bar({
  //   //   el: document.getElementById('taskCycle'),
  //   //   width: 'auto',
  //   //   height: 250,
  //   // });

  //   const cycleData = [];
  //   taskCycleData.forEach(item => {
  //     cycleData.push({
  //       type: item.type,
  //       value: item.estimate,
  //       name: '预估工时',
  //     });
  //     cycleData.push({ type: item.type, value: item.actual, name: '实际工时' });
  //   });

  //   taskCycleChart.source(cycleData);
  //   taskCycleChart.scale('value', {
  //     min: 0,
  //     tickCount: 5,
  //   });
  //   taskCycleChart.legend('name', {
  //     position: 'bottom',
  //   });
  //   taskCycleChart.tooltip({
  //     shared: true,
  //   });
  //   taskCycleChart.coord('rect').transpose();
  //   taskCycleChart
  //     .interval()
  //     .position('type*value')
  //     .color('name', ['#165DFF', '#FAAD14'])
  //     .adjust('dodge', {
  //       marginRatio: 0.05,
  //     });

  //   taskCycleChart.render();

  //   // 代码问题分布图
  //   const codeIssuesChart = new Pie({
  //     el: document.getElementById('codeIssues'),
  //     width: 'auto',
  //     height: 250,
  //   });

  //   codeIssuesChart.source(codeIssuesData);
  //   codeIssuesChart.legend('issue', {
  //     position: 'right',
  //     itemFormatter: val => {
  //       const item = codeIssuesData.find(d => d.issue === val);
  //       return `${val} ${item.value}%`;
  //     },
  //   });
  //   taskTypeChart.tooltip({
  //     showTitle: false,
  //     itemTpl: '<li>{name}: {value}%</li>',
  //   });
  //   codeIssuesChart
  //     .interval()
  //     .position('value')
  //     .color('issue', ['#FAAD14', '#1890FF', '#722ED1', '#FF4D4F', '#F5222D'])
  //     .adjust('stack')
  //     .style({
  //       lineWidth: 1,
  //       stroke: '#fff',
  //     });

  //   codeIssuesChart.render();

  //   // 团队技能对比图
  //   const teamSkillChart = new Bar({
  //     el: document.getElementById('teamSkill'),
  //     width: 'auto',
  //     height: 250,
  //   });

  //   const skillData = [];
  //   teamSkillData.forEach(item => {
  //     skillData.push({
  //       skill: item.skill,
  //       value: item.personal,
  //       name: '你的技能',
  //     });
  //     skillData.push({ skill: item.skill, value: item.team, name: '团队平均' });
  //   });

  //   teamSkillChart.source(skillData);
  //   teamSkillChart.scale('value', {
  //     min: 0,
  //     max: 100,
  //     tickCount: 5,
  //   });
  //   teamSkillChart.legend('name', {
  //     position: 'bottom',
  //   });
  //   teamSkillChart.tooltip({
  //     shared: true,
  //   });
  //   teamSkillChart
  //     .interval()
  //     .position('skill*value')
  //     .color('name', ['#165DFF', '#C9CDD4'])
  //     .adjust('dodge', {
  //       marginRatio: 0.1,
  //     });

  //   teamSkillChart.render();

  //   return () => {
  //     efficiencyTrendChart.destroy();
  //     skillRadarChart.destroy();
  //     taskTypeChart.destroy();
  //     taskCycleChart.destroy();
  //     codeIssuesChart.destroy();
  //     teamSkillChart.destroy();
  //   };
  // }, []);

  const handleRefreshAnalysis = () => {
    message.success('AI分析已更新');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          background: '#F5F5F5',
          minHeight: 280,
        }}
      >
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Title level={2}>李开发的效能分析</Title>
              <Paragraph type="secondary">
                前端开发 · 加入时间: 2021-03-15 · 上次更新: 今天 14:30
              </Paragraph>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Select defaultValue="3months" style={{ width: 120 }}>
                <Option value="7days">近7天</Option>
                <Option value="1month">近1个月</Option>
                <Option value="3months">近3个月</Option>
                <Option value="6months">近6个月</Option>
              </Select>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefreshAnalysis}
              >
                AI分析
              </Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </div>
          </div>
        </div>

        {/* AI分析概览 */}
        <Card
          className="mb-6"
          bordered={false}
          style={{
            borderLeft: '4px solid #1890FF',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info">
                {/* <LightbulbOutlined /> */}
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <Title level={5} style={{ margin: 0 }}>
                  AI效能分析建议
                </Title>
                <Badge
                  style={{
                    marginLeft: 8,
                    backgroundColor: 'rgba(24, 144, 255, 0.1)',
                    color: '#1890FF',
                  }}
                >
                  最新分析于 2小时前
                </Badge>
              </div>
              <Paragraph type="secondary" style={{ marginTop: 5 }}>
                李开发的整体效能评分为82分（优秀），任务完成效率高但代码复用率有待提升。建议重点优化CSS代码结构，增加组件复用。根据技能图谱，推荐深入学习React性能优化和微前端架构。
              </Paragraph>
              <Text type="secondary" style={{ cursor: 'pointer' }}>
                查看详细分析报告 →
              </Text>
            </div>
          </div>
        </Card>

        {/* 核心效能指标 */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="hover:shadow-lg transition-shadow"
              bordered={false}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text type="secondary">整体效能评分</Text>
                  <Statistic
                    title=""
                    value={82}
                    precision={0}
                    valueStyle={{ fontSize: 24 }}
                    suffix="/100"
                  />
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined
                      style={{ color: '#52C41A', fontSize: 14 }}
                    />
                    <Text type="success" style={{ fontSize: '12px' }}>
                      5分 较上月
                    </Text>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <LineChartOutlined />
                </div>
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                <Text strong>计算逻辑：</Text>
                （任务完成效率×30% + 代码质量×30% + 协作贡献度×20% +
                技能成长×20%）
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="hover:shadow-lg transition-shadow"
              bordered={false}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text type="secondary">任务完成效率</Text>
                  <Statistic
                    title=""
                    value={87}
                    precision={0}
                    valueStyle={{ fontSize: 24 }}
                    suffix="/100"
                  />
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined
                      style={{ color: '#52C41A', fontSize: 14 }}
                    />
                    <Text type="success" style={{ fontSize: '12px' }}>
                      3分 较上月
                    </Text>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <CheckSquareOutlined />
                </div>
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                <Text strong>计算逻辑：</Text>
                （按时完成任务数÷总任务数×50% +
                平均任务完成速度÷团队平均速度×50%）
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="hover:shadow-lg transition-shadow"
              bordered={false}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text type="secondary">代码质量</Text>
                  <Statistic
                    title=""
                    value={79}
                    precision={0}
                    valueStyle={{ fontSize: 24 }}
                    suffix="/100"
                  />
                  <div className="flex items-center mt-2">
                    <ArrowDownOutlined
                      style={{ color: '#FF4D4F', fontSize: 14 }}
                    />
                    <Text type="danger" style={{ fontSize: '12px' }}>
                      2分 较上月
                    </Text>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                  <CodeOutlined />
                </div>
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                <Text strong>计算逻辑：</Text>
                （1-代码缺陷率×40% + 代码复用率×30% + 规范符合度×30%）×100
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="hover:shadow-lg transition-shadow"
              bordered={false}
            >
              <div className="flex justify-between items-start">
                <div>
                  <Text type="secondary">协作贡献度</Text>
                  <Statistic
                    title=""
                    value={85}
                    precision={0}
                    valueStyle={{ fontSize: 24 }}
                    suffix="/100"
                  />
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined
                      style={{ color: '#52C41A', fontSize: 14 }}
                    />
                    <Text type="success" style={{ fontSize: '12px' }}>
                      4分 较上月
                    </Text>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center text-info">
                  <TeamOutlined />
                </div>
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: 8 }}>
                <Text strong>计算逻辑：</Text>
                （团队问题解决参与度×40% + 知识分享次数×30% +
                跨团队协作评分×30%）
              </Text>
            </Card>
          </Col>
        </Row>

        {/* 效能趋势与技能雷达图 */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <Title level={5} style={{ margin: 0 }}>
                  效能趋势分析
                </Title>
                <div>
                  <Button size="small" type="primary">
                    月
                  </Button>
                  <Button size="small" style={{ marginLeft: 8 }}>
                    季
                  </Button>
                  <Button size="small" style={{ marginLeft: 8 }}>
                    年
                  </Button>
                </div>
              </div>
              <div id="efficiencyTrend" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                  <Text style={{ fontSize: '12px' }}>整体效能</Text>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-success mr-2"></span>
                  <Text style={{ fontSize: '12px' }}>任务效率</Text>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-warning mr-2"></span>
                  <Text style={{ fontSize: '12px' }}>代码质量</Text>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-info mr-2"></span>
                  <Text style={{ fontSize: '12px' }}>协作贡献</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <Title level={5} style={{ margin: 0 }}>
                  技能雷达图
                </Title>
                <Tooltip title="重新计算技能评分">
                  <Button type="text" icon={<ReloadOutlined />} />
                </Tooltip>
              </div>
              <div id="skillRadar" />
              <Text
                type="secondary"
                style={{
                  fontSize: '12px',
                  margin: '0 auto',
                  display: 'block',
                  marginTop: 8,
                }}
              >
                <Text strong>计算逻辑：</Text>
                基于代码提交分析(40%)、项目实践评估(30%)和自评(30%)综合计算
              </Text>
            </Card>
          </Col>
        </Row>

        {/* 任务完成分析 */}
        <Card
          bordered={false}
          className="mb-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-center mb-6">
            <Title level={5} style={{ margin: 0 }}>
              任务完成分析
            </Title>
            <div className="flex items-center">
              <div className="mr-4">
                <Button size="small" type="primary">
                  类型
                </Button>
                <Button size="small" style={{ marginLeft: 8 }}>
                  优先级
                </Button>
                <Button size="small" style={{ marginLeft: 8 }}>
                  状态
                </Button>
              </div>
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item key="1">导出数据</Menu.Item>
                    <Menu.Item key="2">刷新数据</Menu.Item>
                    <Menu.Item key="3">任务设置</Menu.Item>
                  </Menu>
                }
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Title level={5} style={{ marginBottom: 16, fontSize: '16px' }}>
                任务类型分布
              </Title>
              <div id="taskType" />
            </Col>
            <Col xs={24} lg={8}>
              <Title level={5} style={{ marginBottom: 16, fontSize: '16px' }}>
                任务完成周期分析
              </Title>
              {/* <div id="taskCycle" /> */}
            </Col>
            <Col xs={24} lg={8}>
              <Title level={5} style={{ marginBottom: 16, fontSize: '16px' }}>
                任务优先级完成情况
              </Title>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <Text>高优先级</Text>
                    <Text>92% 按时完成</Text>
                  </div>
                  <Progress
                    percent={92}
                    status="active"
                    strokeColor="#FF4D4F"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text>中优先级</Text>
                    <Text>88% 按时完成</Text>
                  </div>
                  <Progress
                    percent={88}
                    status="active"
                    strokeColor="#FAAD14"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Text>低优先级</Text>
                    <Text>75% 按时完成</Text>
                  </div>
                  <Progress
                    percent={75}
                    status="active"
                    strokeColor="#52C41A"
                  />
                </div>
              </div>

              <Card
                className="mt-6"
                bordered={false}
                style={{ backgroundColor: '#F2F3F5' }}
              >
                <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
                  AI任务分析洞察
                </Title>
                <List
                  dataSource={[
                    {
                      icon: (
                        <CheckCircleOutlined style={{ color: '#52C41A' }} />
                      ),
                      content: '高优先级任务完成率高于团队平均水平(85%)',
                    },
                    {
                      icon: (
                        <ExclamationCircleOutlined
                          style={{ color: '#FAAD14' }}
                        />
                      ),
                      content:
                        'UI调整类任务平均耗时超出预估30%，建议预留更多缓冲时间',
                    },
                    {
                      // icon: (
                      //   <LightbulbOutlined style={{ color: '#1890FF' }} />
                      // ),
                      content:
                        '建议将每周低优先级任务集中安排在周四处理，效率提升15%',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.icon}
                        description={
                          <Text style={{ fontSize: '12px' }}>
                            {item.content}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* 代码质量深度分析 */}
        <Card
          bordered={false}
          className="mb-6 hover:shadow-lg transition-shadow"
        >
          <Tabs defaultActiveKey="overall">
            <TabPane tab="总体质量" key="overall">
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                  <Title
                    level={5}
                    style={{ marginBottom: 16, fontSize: '16px' }}
                  >
                    代码质量核心指标
                  </Title>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Text>代码缺陷率</Text>
                        <Text type="danger">3.2%</Text>
                      </div>
                      <Progress
                        percent={32}
                        status="exception"
                        strokeColor="#FF4D4F"
                      />
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '12px',
                          marginTop: 4,
                          display: 'inline-block',
                        }}
                      >
                        <ExclamationCircleOutlined
                          style={{ fontSize: 12, marginRight: 4 }}
                        />
                        计算逻辑：代码审查发现的问题数 ÷ 代码总行数 ×
                        100%（团队平均：2.5%）
                      </Text>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <Text>代码复用率</Text>
                        <Text type="warning">62%</Text>
                      </div>
                      <Progress
                        percent={62}
                        status="active"
                        strokeColor="#FAAD14"
                      />
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '12px',
                          marginTop: 4,
                          display: 'inline-block',
                        }}
                      >
                        <ExclamationCircleOutlined
                          style={{ fontSize: 12, marginRight: 4 }}
                        />
                        计算逻辑：复用组件/函数调用次数 ÷ 总组件/函数调用次数 ×
                        100%（团队平均：68%）
                      </Text>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <Text>规范符合度</Text>
                        <Text type="success">94%</Text>
                      </div>
                      <Progress
                        percent={94}
                        status="success"
                        strokeColor="#52C41A"
                      />
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '12px',
                          marginTop: 4,
                          display: 'inline-block',
                        }}
                      >
                        <ExclamationCircleOutlined
                          style={{ fontSize: 12, marginRight: 4 }}
                        />
                        计算逻辑：符合团队规范的代码行数 ÷ 总代码行数 ×
                        100%（团队平均：89%）
                      </Text>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <Text>测试覆盖率</Text>
                        <Text type="warning">71%</Text>
                      </div>
                      <Progress
                        percent={71}
                        status="active"
                        strokeColor="#FAAD14"
                      />
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '12px',
                          marginTop: 4,
                          display: 'inline-block',
                        }}
                      >
                        <ExclamationCircleOutlined
                          style={{ fontSize: 12, marginRight: 4 }}
                        />
                        计算逻辑：被测试覆盖的代码行数 ÷ 总代码行数 ×
                        100%（团队目标：80%）
                      </Text>
                    </div>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <Title
                    level={5}
                    style={{ marginBottom: 16, fontSize: '16px' }}
                  >
                    代码问题分布与优化建议
                  </Title>
                  <div id="codeIssues" style={{ marginBottom: 24 }} />

                  <Card
                    bordered={false}
                    style={{ backgroundColor: 'rgba(22, 93, 255, 0.05)' }}
                  >
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {/* <LightbulbOutlined
                          style={{ color: '#165DFF', marginRight: 8 }}
                        /> */}
                      AI代码优化建议
                    </Title>
                    <List
                      dataSource={[
                        {
                          title: 'CSS代码冗余问题',
                          content:
                            '检测到15处可合并的CSS样式，建议提取为公共样式组件，预计减少23%的CSS代码量',
                          action: '查看详细优化方案',
                        },
                        {
                          title: 'JavaScript函数优化',
                          content:
                            '12个函数长度超过40行，建议拆分为更小的单一职责函数，提高可维护性',
                          action: '查看重构示例',
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                                <ExclamationCircleOutlined
                                  style={{ fontSize: 12 }}
                                />
                              </div>
                            }
                            title={<Text strong>{item.title}</Text>}
                            description={
                              <div>
                                <Text style={{ fontSize: '12px' }}>
                                  {item.content}
                                </Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    marginTop: 4,
                                    display: 'inline-block',
                                  }}
                                >
                                  {item.action}
                                </Text>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="HTML/CSS" key="htmlcss">
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <Text type="secondary">HTML/CSS代码质量分析数据将在此显示</Text>
              </div>
            </TabPane>
            <TabPane tab="JavaScript" key="javascript">
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <Text type="secondary">
                  JavaScript代码质量分析数据将在此显示
                </Text>
              </div>
            </TabPane>
            <TabPane tab="框架代码" key="framework">
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <Text type="secondary">框架代码质量分析数据将在此显示</Text>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* 技能打标与成长计划 */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow"
            >
              <Title level={5} style={{ margin: 0, marginBottom: 16 }}>
                技能打标
              </Title>
              <div className="space-y-6">
                {skillsData.map((category, index) => (
                  <div key={index}>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        marginBottom: 12,
                        fontSize: '16px',
                      }}
                    >
                      {category.category}
                    </Title>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <Tag
                          key={skillIndex}
                          color={skill.status}
                          className="flex items-center"
                        >
                          {skill.name} ({skill.level}%)
                        </Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <Button type="dashed" block icon={<PlusOutlined />}>
                添加技能标签
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-16">
                <Title level={5} style={{ margin: 0 }}>
                  AI推荐成长计划
                </Title>
                <Badge>3个月</Badge>
              </div>
              <List
                dataSource={growthPlanData}
                renderItem={(item) => (
                  <List.Item
                    className="mb-6"
                    style={{
                      backgroundColor: '#F2F3F5',
                      borderRadius: 4,
                      padding: '12px 16px',
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <div className="flex justify-between">
                          <Text strong>{item.title}</Text>
                          <Badge
                            color={
                              item.status === '重点'
                                ? '#FAAD14'
                                : item.status === '进阶'
                                  ? '#165DFF'
                                  : '#1890FF'
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                      }
                      description={
                        <div>
                          <Text style={{ fontSize: '12px' }} type="secondary">
                            {item.target}
                          </Text>
                          <div className="flex justify-between items-center mt-2">
                            <Text style={{ fontSize: '12px' }} type="secondary">
                              <CheckCircleOutlined
                                style={{ fontSize: 12, marginRight: 4 }}
                              />
                              已完成 {item.completed} 任务
                            </Text>
                            <Text style={{ fontSize: '12px' }}>
                              {item.progress}%
                            </Text>
                          </div>
                          <Progress
                            percent={item.progress}
                            size="small"
                            strokeColor={
                              item.status === '重点'
                                ? '#FAAD14'
                                : item.status === '进阶'
                                  ? '#165DFF'
                                  : '#1890FF'
                            }
                            style={{ marginTop: 4 }}
                          />
                        </div>
                      }
                    />
                  </List.Item>
                )}
                bordered={false}
              />
              <Divider style={{ margin: '16px 0' }} />
              {/*  icon={<LightbulbOutlined />} */}
              <Button type="primary" block>
                生成个性化学习路径
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              bordered={false}
              className="hover:shadow-lg transition-shadow"
            >
              <Title level={5} style={{ margin: 0, marginBottom: 16 }}>
                AI学习助手
              </Title>
              <div className="mb-6">
                <Input.Search
                  placeholder="请输入你想学习的前端技能或问题..."
                  // enterButton={<PaperPlaneOutlined />}
                />
              </div>
              <div className="mb-6">
                <Title
                  level={5}
                  style={{ margin: 0, marginBottom: 12, fontSize: '16px' }}
                >
                  推荐学习资源
                </Title>
                <List
                  dataSource={learningResources}
                  renderItem={(item) => (
                    <List.Item className="mb-3 hover:bg-gray-50 rounded p-2 transition-colors">
                      <List.Item.Meta
                        avatar={
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            {item.icon}
                          </div>
                        }
                        title={<Text strong>{item.title}</Text>}
                        description={
                          <div>
                            <Text style={{ fontSize: '12px' }} type="secondary">
                              {item.description}
                            </Text>
                            <div className="flex items-center mt-2">
                              <Badge
                                style={{
                                  backgroundColor: 'rgba(22, 93, 255, 0.1)',
                                  color: '#165DFF',
                                }}
                              >
                                {item.type}
                              </Badge>
                              <Text type="secondary" style={{ marginLeft: 8 }}>
                                预计学习时间：{item.time}
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                  bordered={false}
                />
              </div>
              <div>
                <Title
                  level={5}
                  style={{ margin: 0, marginBottom: 12, fontSize: '16px' }}
                >
                  技能练习项目
                </Title>
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: 'rgba(22, 93, 255, 0.05)',
                    border: '1px solid rgba(22, 93, 255, 0.2)',
                  }}
                >
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                          <CodeOutlined />
                        </div>
                      }
                      title={
                        <Text
                          strong
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          组件库重构挑战
                        </Text>
                      }
                      description={
                        <div>
                          <Text style={{ fontSize: '12px' }} type="secondary">
                            重构一个小型组件库，提高代码复用率和可维护性，AI将提供代码评审
                          </Text>
                          <Button
                            type="primary"
                            size="small"
                            style={{ marginTop: 8 }}
                          >
                            开始挑战
                          </Button>
                        </div>
                      }
                    />
                  </List.Item>
                </Card>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 团队对比分析 */}
        <Card bordered={false} className="hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} style={{ margin: 0 }}>
              团队效能对比分析
            </Title>
            <div>
              <Button size="small" type="primary">
                前端团队
              </Button>
              <Button size="small" style={{ marginLeft: 8 }}>
                全公司
              </Button>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Title level={5} style={{ marginBottom: 16, fontSize: '16px' }}>
                团队效能排名（近3个月）
              </Title>
              <List
                dataSource={teamRankingData}
                renderItem={(item) => (
                  <List.Item
                    className={`
                        mb-3 p-3 rounded-lg 
                        ${item.rank === 1 ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50'}
                      `}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                            ${item.rank === 1 ? 'bg-primary' : item.rank === 2 ? 'bg-gray-500' : 'bg-warning'}
                          `}
                        >
                          {item.rank}
                        </div>
                      }
                      title={
                        <div className="flex items-center">
                          <Avatar
                            src={`https://picsum.photos/id/${1012 + item.rank}/200/200`}
                            size="small"
                            style={{ marginRight: 8 }}
                          />
                          <Text strong>{item.name}</Text>
                        </div>
                      }
                      description={
                        <div>
                          <Progress
                            percent={item.score}
                            size="small"
                            status={item.rank === 1 ? 'active' : 'normal'}
                            strokeColor={
                              item.rank === 1 ? '#165DFF' : undefined
                            }
                            style={{ marginTop: 4, width: '80%' }}
                          />
                        </div>
                      }
                    />
                    <Text
                      strong
                      style={{
                        color: item.rank === 1 ? '#165DFF' : undefined,
                      }}
                    >
                      {item.score}分
                    </Text>
                  </List.Item>
                )}
                bordered={false}
              />
              <Button type="dashed" block style={{ marginTop: 16 }}>
                查看完整排名
              </Button>
            </Col>
            <Col xs={24} lg={12}>
              <Title level={5} style={{ marginBottom: 16, fontSize: '16px' }}>
                与团队平均技能对比
              </Title>
              <div id="teamSkill" />
              <Card
                className="mt-6"
                bordered={false}
                style={{ backgroundColor: '#F2F3F5' }}
              >
                <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
                  AI团队对比分析
                </Title>
                <List
                  dataSource={[
                    {
                      icon: <TrophyOutlined style={{ color: '#FAAD14' }} />,
                      content:
                        '你的React技能高于团队平均水平12%，可作为团队内部分享者',
                    },
                    {
                      icon: (
                        <ExclamationCircleOutlined
                          style={{ color: '#FAAD14' }}
                        />
                      ),
                      content:
                        '性能优化相关技能低于团队平均水平8%，建议参与团队性能优化专项小组',
                    },
                    {
                      // icon: (
                      //   <LightbulbOutlined style={{ color: '#1890FF' }} />
                      // ),
                      content:
                        '根据团队技能分布，学习微前端架构将提高你的团队协作适配性',
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.icon}
                        description={
                          <Text style={{ fontSize: '12px' }}>
                            {item.content}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default PersonalDevelopmentPlan;
