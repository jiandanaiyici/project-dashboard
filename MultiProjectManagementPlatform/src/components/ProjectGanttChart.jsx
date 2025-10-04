import React from 'react';
import { Card, Select, Tag, Empty, Spin, Tooltip } from 'antd';
import './ProjectGanttChart.less';

const { Option } = Select;



const ProjectGanttChart = ({
    tasks = [],
    loading = false,
    title = '项目人员多兵种甘特图',
    projects = [],
    onProjectChange,
    selectedProject = ''
}) => {
    // 角色颜色映射
    const roleColors = {
        '前端开发': '#1890ff',
        '后端开发': '#52c41a',
        'UI设计': '#fa8c16',
        '产品管理': '#722ed1',
        '测试工程师': '#ff4d4f',
        '运维工程师': '#13c2c2',
        '数据分析师': '#eb2f96',
        '项目经理': '#faad14'
    };

    // 格式化日期显示
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    };

    // 计算时间跨度（天数）
    const getDaysBetween = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // 计算任务在甘特图中的位置和宽度
    const calculateTaskPosition = (task, minDate, maxDate) => {
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        const totalDays = getDaysBetween(minDate.toISOString(), maxDate.toISOString());
        const startOffset = getDaysBetween(minDate.toISOString(), taskStart.toISOString());
        const taskDays = getDaysBetween(taskStart.toISOString(), taskEnd.toISOString());

        const left = Math.max(0, (startOffset / totalDays) * 100);
        const width = Math.min(100 - left, (taskDays / totalDays) * 100);

        return { left, width };
    };

    // 获取时间范围
    const getTimeRange = () => {
        if (tasks.length === 0) {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return { minDate: today, maxDate: nextWeek };
        }

        const dates = tasks.flatMap(task => [new Date(task.start), new Date(task.end)]);
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

        // 扩展时间范围以提供边距
        minDate.setDate(minDate.getDate() - 1);
        maxDate.setDate(maxDate.getDate() + 1);

        return { minDate, maxDate };
    };

    // 生成日期刻度
    const generateDateTicks = (minDate, maxDate) => {
        const ticks = [];
        const totalDays = getDaysBetween(minDate.toISOString(), maxDate.toISOString());
        const step = Math.max(1, Math.ceil(totalDays / 20)); // 最多显示20个刻度

        for (let i = 0; i <= totalDays; i += step) {
            const currentDate = new Date(minDate);
            currentDate.setDate(minDate.getDate() + i);
            const position = (i / totalDays) * 100;

            ticks.push({
                date: currentDate,
                position,
                label: formatDate(currentDate.toISOString())
            });
        }

        return ticks;
    };

    // 按用户分组任务
    const getTasksByUser = () => {
        const userTasks = {};

        tasks.forEach(task => {
            if (!userTasks[task.user]) {
                userTasks[task.user] = [];
            }
            userTasks[task.user].push(task);
        });

        return userTasks;
    };

    // 获取所有角色
    const getAllRoles = () => {
        const roles = new Set();
        tasks.forEach(task => {
            if (task.role) {
                roles.add(task.role);
            }
        });
        return Array.from(roles);
    };

    const { minDate, maxDate } = getTimeRange();
    const dateTicks = generateDateTicks(minDate, maxDate);
    const userTasks = getTasksByUser();
    const allRoles = getAllRoles();

    return (
        <div className="project-gantt-chart">
            <Card
                title={
                    <div className="gantt-header">
                        <span>{title}</span>
                        {projects.length > 0 && (
                            <Select
                                value={selectedProject}
                                style={{ width: 200, marginLeft: 16 }}
                                onChange={onProjectChange}
                                placeholder="选择项目"
                            >
                                {projects.map(project => (
                                    <Option key={project} value={project}>{project}</Option>
                                ))}
                            </Select>
                        )}
                    </div>
                }
                className="gantt-chart-card"
            >
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" tip="加载中..." />
                    </div>
                ) : Object.keys(userTasks).length > 0 ? (
                    <>
                        {/* 图例 */}
                        <div className="gantt-legend">
                            {allRoles.map(role => (
                                <div key={role} className="legend-item">
                                    <span
                                        className="legend-color"
                                        style={{ backgroundColor: roleColors[role] || '#888888' }}
                                    />
                                    <span className="legend-text">{role}</span>
                                </div>
                            ))}
                        </div>

                        {/* 甘特图 */}
                        <div className="gantt-container">
                            {/* 日期刻度 */}
                            <div className="gantt-timeline">
                                <div className="timeline-labels">
                                    <div className="user-column-header">团队成员</div>
                                    <div className="timeline-dates">
                                        {dateTicks.map((tick, index) => (
                                            <div
                                                key={index}
                                                className="timeline-tick"
                                                style={{ left: `${tick.position}%` }}
                                            >
                                                <div className="tick-line" />
                                                <div className="tick-label">{tick.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 甘特图主体 */}
                                <div className="gantt-body">
                                    {Object.entries(userTasks).map(([user, userTasksList], index) => (
                                        <div key={user} className="gantt-row">
                                            <div className="user-column">
                                                <div className="user-info">
                                                    <span className="user-name">{user}</span>
                                                    <div className="user-roles">
                                                        {[...new Set(userTasksList.map(task => task.role))].map(role => (
                                                            <Tag
                                                                key={role}
                                                                color={roleColors[role] || '#888888'}
                                                                size="small"
                                                            >
                                                                {role}
                                                            </Tag>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tasks-column">
                                                {userTasksList.map((task, taskIndex) => {
                                                    const { left, width } = calculateTaskPosition(task, minDate, maxDate);
                                                    const taskColor = roleColors[task.role] || '#888888';

                                                    return (
                                                        <Tooltip
                                                            key={task.id}
                                                            title={
                                                                <div className="task-tooltip">
                                                                    <p><strong>任务:</strong> {task.name}</p>
                                                                    <p><strong>角色:</strong> {task.role}</p>
                                                                    <p><strong>时间:</strong> {formatDate(task.start)} - {formatDate(task.end)}</p>
                                                                    <p><strong>项目:</strong> {task.project}</p>
                                                                    <p><strong>状态:</strong> <Tag color={task.status === '进行中' ? 'blue' : task.status === '已完成' ? 'green' : 'orange'}>{task.status}</Tag></p>
                                                                </div>
                                                            }
                                                            placement="top"
                                                        >
                                                            <div
                                                                className={`gantt-task task-${task.status}`}
                                                                style={{
                                                                    left: `${left}%`,
                                                                    width: `${width}%`,
                                                                    backgroundColor: taskColor,
                                                                    opacity: task.status === '已完成' ? 0.6 : 1
                                                                }}
                                                            >
                                                                <div className="task-content">
                                                                    <div className="task-name">{task.name}</div>
                                                                    <div className="task-dates">{formatDate(task.start)} - {formatDate(task.end)}</div>
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 时间范围信息 */}
                        <div className="time-range-info">
                            <p>时间范围: {formatDate(minDate.toISOString())} 至 {formatDate(maxDate.toISOString())}</p>
                            <p>总天数: {getDaysBetween(minDate.toISOString(), maxDate.toISOString())} 天</p>
                        </div>
                    </>
                ) : (
                    <Empty description="暂无甘特图数据" className="empty-container" />
                )}
            </Card>
        </div>
    );
};

export default ProjectGanttChart;