// import React, { useState, } from 'react';
// import {
//     Card, Row, Col, Tag, Button, Select, Option,
//     Title, Text, Badge, List, Progress, Spin,
//     Popover
// } from 'antd';
// import {
//     LineChartOutlined, BarChartOutlined, AlertOutlined,
//     ClockCircleOutlined, ExclamationCircleOutlined,
//     DownloadOutlined, FilterOutlined,
//     ArrowUpOutlined, ArrowDownOutlined,
//     PlusOutlined
// } from '@ant-design/icons';
// import { Line, Bar, Pie } from '@ant-design/plots';

// const SystemStabilityDetail = () => {
//     const [timeRange, setTimeRange] = useState('week');
//     const [selectedService, setSelectedService] = useState('all');
//     const [loading, setLoading] = useState(false);
//     const [services, setServices] = useState([
//         { id: 'all', name: '全部服务' },
//         { id: 'api-gateway', name: 'API网关' },
//         { id: 'user-service', name: '用户服务' },
//         { id: 'order-service', name: '订单服务' },
//         { id: 'payment-service', name: '支付服务' },
//         { id: 'inventory-service', name: '库存服务' },
//     ]);

//     // 系统稳定性核心指标数据
//     const stabilityMetrics = {
//         uptimeRate: 99.92,
//         errorRate: 0.15,
//         avgResponseTime: 123,
//         throughput: 4567,
//     };

//     // 服务健康状态数据
//     const serviceHealthData = [
//         { service: 'API网关', status: 'healthy', score: 97 },
//         { service: '用户服务', status: 'healthy', score: 96 },
//         { service: '订单服务', status: 'degraded', score: 82 },
//         { service: '支付服务', status: 'unhealthy', score: 65 },
//         { service: '库存服务', status: 'healthy', score: 98 },
//     ];

//     // 错误类型分布数据
//     const errorDistributionData = [
//         { type: '超时错误', count: 350, percentage: 35 },
//         { type: '数据库错误', count: 220, percentage: 22 },
//         { type: '网络错误', count: 180, percentage: 18 },
//         { type: '权限错误', count: 150, percentage: 15 },
//         { type: '其他错误', count: 100, percentage: 10 },
//     ];

//     // 最近故障事件数据
//     const recentIncidents = [
//         {
//             id: 'INC-20230615-001',
//             title: '支付服务响应超时',
//             severity: 'high',
//             startTime: '2023-06-15 14:30',
//             endTime: '2023-06-15 15:15',
//             duration: '45分钟',
//             affectedServices: ['支付服务', '订单服务'],
//             rootCause: '数据库连接池配置不合理',
//             resolution: '增加数据库连接池大小，优化查询语句',
//         },
//         {
//             id: 'INC-20230610-002',
//             title: '用户登录缓慢',
//             severity: 'medium',
//             startTime: '2023-06-10 09:15',
//             endTime: '2023-06-10 10:00',
//             duration: '45分钟',
//             affectedServices: ['用户服务'],
//             rootCause: '缓存服务性能下降',
//             resolution: '重启缓存服务，增加缓存节点',
//         },
//         {
//             id: 'INC-20230605-003',
//             title: '订单创建失败',
//             severity: 'high',
//             startTime: '2023-06-05 20:45',
//             endTime: '2023-06-05 21:30',
//             duration: '45分钟',
//             affectedServices: ['订单服务', '库存服务'],
//             rootCause: '库存锁定逻辑错误',
//             resolution: '修复库存锁定逻辑，增加事务回滚机制',
//         },
//     ];

//     // 最近变更记录数据
//     const changeRecords = [
//         {
//             id: 'CHG-20230614-001',
//             description: '支付服务接口优化',
//             type: '代码',
//             status: 'completed',
//             service: '支付服务',
//             time: '2023-06-14 18:30',
//             author: '张三',
//             authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang3',
//         },
//         {
//             id: 'CHG-20230612-002',
//             description: '数据库索引优化',
//             type: '数据库',
//             status: 'completed',
//             service: '订单服务',
//             time: '2023-06-12 15:45',
//             author: '李四',
//             authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li4',
//         },
//         {
//             id: 'CHG-20230610-003',
//             description: '配置中心迁移',
//             type: '配置',
//             status: 'completed',
//             service: '所有服务',
//             time: '2023-06-10 11:20',
//             author: '王五',
//             authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang5',
//         },
//     ];

//     // 稳定性趋势数据
//     const stabilityTrendData = [
//         { date: '6/10', uptimeRate: 99.95, errorRate: 0.12, avgResponseTime: 110 },
//         { date: '6/11', uptimeRate: 99.93, errorRate: 0.13, avgResponseTime: 115 },
//         { date: '6/12', uptimeRate: 99.90, errorRate: 0.15, avgResponseTime: 120 },
//         { date: '6/13', uptimeRate: 99.88, errorRate: 0.18, avgResponseTime: 125 },
//         { date: '6/14', uptimeRate: 99.91, errorRate: 0.16, avgResponseTime: 122 },
//         { date: '6/15', uptimeRate: 99.92, errorRate: 0.15, avgResponseTime: 123 },
//         { date: '6/16', uptimeRate: 99.94, errorRate: 0.14, avgResponseTime: 118 },
//     ];

//     // 团队成员排名数据
//     const teamRankingData = [
//         {
//             name: '张三',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang3',
//             incidentsResolved: 12,
//             avgResolutionTime: '35分钟',
//             successRate: 95,
//         },
//         {
//             name: '李四',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li4',
//             incidentsResolved: 10,
//             avgResolutionTime: '40分钟',
//             successRate: 92,
//         },
//         {
//             name: '王五',
//             avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang5',
//             incidentsResolved: 8,
//             avgResolutionTime: '38分钟',
//             successRate: 94,
//         },
//     ];

//     // 稳定性改进建议数据
//     const improvementSuggestions = [
//         {
//             id: 'SUGG-001',
//             title: '数据库连接池参数调整',
//             priority: 'medium',
//             description: '增加数据库连接池最大连接数，优化连接超时设置',
//             impact: '预计减少30%的超时错误',
//             responsible: '张三',
//             deadline: '2023-06-20',
//         },
//         {
//             id: 'SUGG-002',
//             title: '引入熔断机制',
//             priority: 'high',
//             description: '在关键服务之间引入熔断机制，防止级联故障',
//             impact: '提高系统整体稳定性，减少故障传播',
//             responsible: '李四',
//             deadline: '2023-06-25',
//         },
//         {
//             id: 'SUGG-003',
//             title: '变更风险评估流程实施',
//             priority: 'low',
//             description: '建立变更前风险评估和影响分析流程',
//             impact: '降低变更导致的故障概率',
//             responsible: '王五',
//             deadline: '2023-07-01',
//         },
//     ];

//     // 渲染服务状态标签
//     const renderServiceStatusTag = (status, score) => {
//         let color = 'success';
//         let text = '健康';

//         if (status === 'degraded') {
//             color = 'warning';
//             text = '降级';
//         } else if (status === 'unhealthy') {
//             color = 'error';
//             text = '异常';
//         }

//         return <Tag color={color}>{text}({score}分)</Tag>;
//     };

//     // 渲染故障严重程度标签
//     const renderSeverityTag = (severity) => {
//         const severityConfig = {
//             high: { color: 'red', text: '高' },
//             medium: { color: 'orange', text: '中' },
//             low: { color: 'green', text: '低' },
//         };

//         const { color, text } = severityConfig[severity] || { color: 'default', text: severity };
//         return <Tag color={color}>严重程度：{text}</Tag>;
//     };

//     // 渲染变更类型标签
//     const renderChangeTypeTag = (type) => {
//         const typeConfig = {
//             code: { color: 'blue', text: '代码' },
//             config: { color: 'purple', text: '配置' },
//             数据库: { color: 'orange', text: '数据库' },
//             基础设施: { color: 'geekblue', text: '基础设施' },
//         };

//         const { color, text } = typeConfig[type] || { color: 'default', text: type };
//         return <Tag color={color}>{text}</Tag>;
//     };

//     // 渲染变更状态标签
//     const renderChangeStatusTag = (status) => {
//         const statusConfig = {
//             pending: { color: 'default', text: '待处理' },
//             inProgress: { color: 'processing', text: '处理中' },
//             completed: { color: 'success', text: '已完成' },
//             failed: { color: 'error', text: '失败' },
//         };

//         const { color, text } = statusConfig[status] || { color: 'default', text: status };
//         return <Tag color={color} className="ml-1">{text}</Tag>;
//     };

//     // 渲染优先级标签
//     const renderPriorityTag = (priority) => {
//         const priorityConfig = {
//             high: { color: 'red', text: '高优先级' },
//             medium: { color: 'orange', text: '中优先级' },
//             low: { color: 'green', text: '低优先级' },
//         };

//         const { color, text } = priorityConfig[priority] || { color: 'default', text: priority };
//         return <Badge color={color} text={text} />;
//     };

//     // 稳定性趋势图表配置
//     const stabilityTrendConfig = {
//         data: stabilityTrendData,
//         xField: 'date',
//         yField: 'uptimeRate',
//         seriesField: 'type',
//         yAxis: {
//             label: {
//                 formatter: (v) => `${v}%`,
//             },
//             max: 100,
//         },
//         legend: {
//             position: 'top',
//         },
//         smooth: true,
//         animation: {
//             appear: {
//                 animation: 'path-in',
//                 duration: 1000,
//             },
//         },
//     };

//     // 错误类型分布图表配置
//     const errorDistributionConfig = {
//         data: errorDistributionData,
//         xField: 'type',
//         yField: 'count',
//         label: {
//             position: 'middle',
//             style: {
//                 fill: '#FFFFFF',
//                 opacity: 0.6,
//             },
//         },
//         xAxis: {
//             label: {
//                 autoHide: true,
//                 autoRotate: false,
//             },
//         },
//         meta: {
//             type: {
//                 alias: '错误类型',
//             },
//             count: {
//                 alias: '错误数量',
//             },
//         },
//     };

//     // 团队成员排名图表配置
//     const teamRankingConfig = {
//         data: teamRankingData,
//         angleField: 'incidentsResolved',
//         colorField: 'name',
//         radius: 0.8,
//         label: {
//             type: 'outer',
//             content: '{name}: {incidentsResolved}',
//         },
//         interactions: [
//             {
//                 type: 'element-active',
//             },
//         ],
//     };

//     return (
//         <div className="space-y-6">
//             {/* 页面标题和操作区 */}
//             <div className="flex flex-wrap items-center justify-between">
//                 <div>
//                     <Title level={4} className="mb-1">系统稳定性监控</Title>
//                     <Text type="secondary">实时监控系统健康状态、性能指标和故障情况</Text>
//                 </div>

//                 <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
//                     <Select
//                         value={timeRange}
//                         onChange={setTimeRange}
//                         size="small"
//                     >
//                         <Option value="day">今日</Option>
//                         <Option value="week">本周</Option>
//                         <Option value="month">本月</Option>
//                         <Option value="quarter">本季度</Option>
//                     </Select>

//                     <Select
//                         value={selectedService}
//                         onChange={setSelectedService}
//                         size="small"
//                         style={{ width: 180 }}
//                     >
//                         {services.map(service => (
//                             <Option key={service.id} value={service.id}>{service.name}</Option>
//                         ))}
//                     </Select>

//                     <Button size="small" icon={<DownloadOutlined />}>导出报告</Button>
//                 </div>
//             </div>

//             {/* 系统稳定性核心指标 */}
//             <Row gutter={[16, 16]}>
//                 <Col xs={24} sm={12} lg={6}>
//                     <Card className="hover:shadow-md transition-shadow border-l-4 border-success">
//                         <div className="flex flex-col h-full">
//                             <div className="flex justify-between items-start mb-2">
//                                 <Text type="secondary">系统可用性</Text>
//                                 <ClockCircleOutlined className="text-success" />
//                             </div>
//                             <Title level={3}>{stabilityMetrics.uptimeRate}%</Title>
//                             <div className="mt-auto">
//                                 <div className="flex items-center text-xs text-success">
//                                     <ArrowUpOutlined className="mr-1" />
//                                     <Text>较上周提升0.02%</Text>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </Col>

//                 <Col xs={24} sm={12} lg={6}>
//                     <Card className="hover:shadow-md transition-shadow border-l-4 border-error">
//                         <div className="flex flex-col h-full">
//                             <div className="flex justify-between items-start mb-2">
//                                 <Text type="secondary">错误率</Text>
//                                 <AlertOutlined className="text-error" />
//                             </div>
//                             <Title level={3}>{stabilityMetrics.errorRate}%</Title>
//                             <div className="mt-auto">
//                                 <div className="flex items-center text-xs text-success">
//                                     <ArrowDownOutlined className="mr-1" />
//                                     <Text>较上周下降0.03%</Text>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </Col>

//                 <Col xs={24} sm={12} lg={6}>
//                     <Card className="hover:shadow-md transition-shadow border-l-4 border-warning">
//                         <div className="flex flex-col h-full">
//                             <div className="flex justify-between items-start mb-2">
//                                 <Text type="secondary">平均响应时间</Text>
//                                 <LineChartOutlined className="text-warning" />
//                             </div>
//                             <Title level={3}>{stabilityMetrics.avgResponseTime}ms</Title>
//                             <div className="mt-auto">
//                                 <div className="flex items-center text-xs text-error">
//                                     <ArrowUpOutlined className="mr-1" />
//                                     <Text>较上周增加5ms</Text>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </Col>

//                 <Col xs={24} sm={12} lg={6}>
//                     <Card className="hover:shadow-md transition-shadow border-l-4 border-info">
//                         <div className="flex flex-col h-full">
//                             <div className="flex justify-between items-start mb-2">
//                                 <Text type="secondary">系统吞吐量</Text>
//                                 <BarChartOutlined className="text-info" />
//                             </div>
//                             <Title level={3}>{stabilityMetrics.throughput}</Title>
//                             <div className="mt-auto">
//                                 <div className="flex items-center text-xs text-success">
//                                     <ArrowUpOutlined className="mr-1" />
//                                     <Text>较上周增加120</Text>
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* 稳定性趋势图 */}
//             <Row gutter={[16, 16]}>
//                 <Col xs={24}>
//                     <Card className="hover:shadow-md transition-shadow">
//                         <div className="flex justify-between items-center mb-4">
//                             <Title level={5}>稳定性趋势</Title>
//                             <div className="flex items-center gap-2">
//                                 <Select defaultValue="uptimeRate" size="small">
//                                     <Option value="uptimeRate">系统可用性</Option>
//                                     <Option value="errorRate">错误率</Option>
//                                     <Option value="avgResponseTime">平均响应时间</Option>
//                                 </Select>
//                                 <FilterOutlined className="text-gray-400 cursor-pointer" />
//                             </div>
//                         </div>
//                         <div className="h-80">
//                             {loading ? (
//                                 <div className="flex justify-center items-center h-full">
//                                     <Spin size="default" />
//                                 </div>
//                             ) : (
//                                 <Line {...stabilityTrendConfig} />
//                             )}
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>

//             {/* 服务健康状态和错误类型分布 */}
//             <Row gutter={[16, 16]}>
//                 <Col xs={24} lg={8}>
//                     <Card className="hover:shadow-md transition-shadow">
//                         <div className="flex justify-between items-center mb-4">
//                             <Title level={5}>服务健康状态</Title>
//                             <Text type="link" className="text-sm">查看详情</Text>
//                         </div>
//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <Spin size="default" />
//                             </div>
//                         ) : (
//                             <List
//                                 dataSource={serviceHealthData}
//                                 renderItem={item => (
//                                     <List.Item className="hover:bg-gray-50 transition-colors">
//                                         <List.Item.Meta
//                                             title={
//                                                 <div className="flex justify-between items-center">
//                                                     <span>{item.service}</span>
//                                                     {renderServiceStatusTag(item.status, item.score)}
//                                                 </div>
//                                             }
//                                             description={
//                                                 <Progress
//                                                     percent={item.score}
//                                                     size="small"
//                                                     status={item.status === 'unhealthy' ? 'exception' : item.status === 'degraded' ? 'active' : 'success'}
//                                                 />
//                                             }
//                                         />
//                                     </List.Item>
//                                 )}
//               </List>
//             )}
//                 </Card>
//             </Col>

//             <Col xs={24} lg={16}>
//                 <Card className="hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-center mb-4">
//                         <Title level={5}>错误类型分布</Title>
//                         <Select defaultValue="day" size="small">
//                             <Option value="day">今日</Option>
//                             <Option value="week">本周</Option>
//                             <Option value="month">本月</Option>
//                         </Select>
//                     </div>
//                     <div className="h-64">
//                         {loading ? (
//                             <div className="flex justify-center items-center h-full">
//                                 <Spin size="default" />
//                             </div>
//                         ) : (
//                             <Bar {...errorDistributionConfig} />
//                         )}
//                     </div>
//                     <div className="mt-4 text-xs text-warning bg-warning/5 p-2 rounded border border-warning/20">
//                         <ExclamationCircleOutlined className="mr-1" /> 超时错误占比最高(35%)，主要集中在支付核心服务
//                     </div>
//                 </Card>
//             </Col>
//         </Row>

//       {/* 最近故障事件和变更记录 */ }
//       <Row gutter={[16, 16]}>
//         <Col xs={24} lg={12}>
//           <Card className="hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-center mb-4">
//               <Title level={5}>最近故障事件</Title>
//               <Button size="small" type="primary" icon={<PlusOutlined />}>
//                 记录故障
//               </Button>
//             </div>
//             {loading ? (
//               <div className="flex justify-center items-center h-80">
//                 <Spin size="default" />
//               </div>
//             ) : (
//               <List
//                 dataSource={recentIncidents}
//                 renderItem={item => (
//                   <List.Item className="hover:bg-gray-50 transition-colors">
//                     <List.Item.Meta
//                       title={
//                         <div className="flex flex-wrap justify-between items-start">
//                           <div>
//                             <Text strong className="mr-2">{item.title}</Text>
//                             <Text code className="text-xs">{item.id}</Text>
//                           </div>
//                           {renderSeverityTag(item.severity)}
//                         </div>
//                       }
//                       description={
//                         <div className="space-y-2">
//                           <div className="text-xs">
//                             <Text type="secondary">时间：</Text>
//                             <Text>{item.startTime} - {item.endTime}</Text>
//                             <Badge className="ml-2" count={item.duration} size="small" />
//                           </div>
//                           <div className="text-xs">
//                             <Text type="secondary">影响服务：</Text>
//                             {item.affectedServices.map((service, index) => (
//                               <Tag key={index} color="blue" size="small" className="mr-1">
//                                 {service}
//                               </Tag>
//                             ))}
//                           </div>
//                           <div className="text-xs">
//                             <Text type="secondary">根本原因：</Text>
//                             <Text>{item.rootCause}</Text>
//                           </div>
//                           <Popover
//                             content={
//                               <div className="text-xs">
//                                 <p><strong>解决措施：</strong>{item.resolution}</p>
//                               </div>
//                             }
//                             title="详细信息"
//                           >
//                             <Text type="link" className="text-xs">查看详细解决措施</Text>
//                           </Popover>
//                         </div>
//                       }
//                     />
//                   </List.Item>
//                 )}
//               </List>
//             )}
//           </Card>
//         </Col>

//         <Col xs={24} lg={12}>
//           <Card className="hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-center mb-4">
//               <Title level={5}>最近变更记录</Title>
//               <Text type="link" className="text-sm">查看全部</Text>
//             </div>
//             {loading ? (
//               <div className="flex justify-center items-center h-80">
//                 <Spin size="default" />
//               </div>
//             ) : (
//               <List
//                 dataSource={changeRecords}
//                 renderItem={item => (
//                   <List.Item className="hover:bg-gray-50 transition-colors">
//                     <List.Item.Meta
//                       avatar={<Avatar src={item.authorAvatar} />}
//                       title={
//                         <div className="flex flex-wrap justify-between items-start">
//                           <div>
//                             <Text strong className="mr-2">{item.description}</Text>
//                             <Text code className="text-xs">{item.id}</Text>
//                           </div>
//                           <div className="flex items-center">
//                             {renderChangeTypeTag(item.type)}
//                             {renderChangeStatusTag(item.status)}
//                           </div>
//                         </div>
//                       }
//                       description={
//                         <div className="space-y-1">
//                           <div className="text-xs">
//                             <Text type="secondary">服务：</Text>
//                             <Text>{item.service}</Text>
//                           </div>
//                           <div className="text-xs">
//                             <Text type="secondary">时间：</Text>
//                             <Text>{item.time}</Text>
//                           </div>
//                           <div className="text-xs">
//                             <Text type="secondary">操作人：</Text>
//                             <Text>{item.author}</Text>
//                           </div>
//                         </div>
//                       }
//                     />
//                   </List.Item>
//                 )}
//               </List>
//             )}
//           </Card>
//         </Col >
//       </Row >

//     {/* 团队成员排名和稳定性改进建议 */ }
//     < Row gutter = { [16, 16]} >
//         <Col xs={24} lg={12}>
//           <Card className="hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-center mb-4">
//               <Title level={5}>团队成员排名</Title>
//               <Select defaultValue="incidents" size="small">
//                 <Option value="incidents">解决故障数</Option>
//                 <Option value="resolutionTime">平均解决时间</Option>
//                 <Option value="successRate">成功率</Option>
//               </Select>
//             </div>
//             <div className="h-80">
//               {loading ? (
//                 <div className="flex justify-center items-center h-full">
//                   <Spin size="default" />
//                 </div>
//               ) : (
//                 <Pie {...teamRankingConfig} />
//               )}
//             </div>
//           </Card>
//         </Col>

//         <Col xs={24} lg={12}>
//           <Card className="hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-center mb-4">
//               <Title level={5}>稳定性改进建议</Title>
//               <Text type="link" className="text-sm">查看全部</Text>
//             </div>
//             {loading ? (
//               <div className="flex justify-center items-center h-80">
//                 <Spin size="default" />
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {improvementSuggestions.map(suggestion => (
//                   <div key={suggestion.id} className="p-3 border border-gray-200 rounded bg-white hover:bg-gray-50 transition-colors">
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="flex items-center">
//                         <ExclamationCircleOutlined className="text-warning mr-2" />
//                         <Text strong>{suggestion.title}</Text>
//                       </div>
//                       {renderPriorityTag(suggestion.priority)}
//                     </div>
//                     <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
//                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
//                       <div><Text type="secondary">预期影响：</Text>{suggestion.impact}</div>
//                       <div><Text type="secondary">负责人：</Text>{suggestion.responsible}</div>
//                       <div><Text type="secondary">截止日期：</Text>{suggestion.deadline}</div>
//                     </div>
//                     <div className="mt-2 text-right">
//                       <Text type="link" className="text-xs">查看详情</Text>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>
//         </Col>
//       </Row >
//     </div >
//   );
// };

// export default SystemStabilityDetail;
