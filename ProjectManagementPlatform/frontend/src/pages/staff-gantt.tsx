import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Tag, 
  Tooltip,
  Modal,
  Form,
  Input,
  Space,
  message,
  Slider,
  Switch,
  Tabs,
  Statistic
} from 'antd';
import { 
  CalendarOutlined, 
  TeamOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined,
  FullscreenOutlined,
  SettingOutlined,
  ExportOutlined,
  FilterOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  InboxOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { PageHeader } from '@/components';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface StaffAssignment {
  id: string;
  staffName: string;
  position: string;
  department: string;
  projects: ProjectAssignment[];
  totalWorkload: number;
  availability: number;
  joinDate: string;
  leaveDate?: string;
  transfers?: DepartmentTransfer[];
}

interface DepartmentTransfer {
  fromDepartment: string;
  toDepartment: string;
  transferDate: string;
}

interface StaffMovementData {
  month: string;
  join: number;
  leave: number;
  transfer: number;
}

interface ProjectAssignment {
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  workload: number; // 工作负载百分比
  role: string;
  status: 'active' | 'completed' | 'planned' | 'on-hold';
}

/**
 * 甘特图组件
 */
const GanttChart: React.FC<{
  data: StaffAssignment[];
  timeRange: [string, string];
  zoom: number;
}> = ({ data, timeRange, zoom }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  // 生成时间刻度
  const generateTimeScale = () => {
    const startDate = new Date(timeRange[0]);
    const endDate = new Date(timeRange[1]);
    const months = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
        label: `${current.getFullYear()}-${('0' + (current.getMonth() + 1)).slice(-2)}`
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  };

  const timeScale = generateTimeScale();
  const monthWidth = 80 * zoom;

  // 计算项目在甘特图中的位置
  const calculateProjectPosition = (project: ProjectAssignment) => {
    const startDate = new Date(timeRange[0]);
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    
    const startOffset = Math.max(0, (projectStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const duration = (projectEnd.getTime() - Math.max(projectStart.getTime(), startDate.getTime())) / (1000 * 60 * 60 * 24 * 30);
    
    return {
      left: startOffset * monthWidth,
      width: Math.max(duration * monthWidth, 10),
    };
  };

  // 获取项目状态颜色
  const getProjectColor = (status: string, workload: number) => {
    const baseColors = {
      'active': '#52c41a',
      'completed': '#1890ff',
      'planned': '#fa8c16',
      'on-hold': '#ff4d4f',
    };
    
    const opacity = Math.max(0.3, workload / 100);
    const hex = Math.round(opacity * 255).toString(16);
    const paddedHex = hex.length === 1 ? '0' + hex : hex;
    return `${baseColors[status as keyof typeof baseColors]}${paddedHex}`;
  };

  return (
    <div className="gantt-chart" style={{ overflowX: 'auto', border: '1px solid #f0f0f0' }}>
      {/* 时间刻度头部 */}
      <div className="gantt-header" style={{ 
        display: 'flex', 
        background: '#fafafa', 
        borderBottom: '1px solid #f0f0f0',
        minWidth: timeScale.length * monthWidth + 200
      }}>
        <div style={{ width: 200, padding: '8px 16px', borderRight: '1px solid #f0f0f0' }}>
          <strong>人员/项目</strong>
        </div>
        {timeScale.map((month, index) => (
          <div 
            key={index}
            style={{ 
              width: monthWidth, 
              padding: '8px', 
              textAlign: 'center', 
              borderRight: '1px solid #f0f0f0',
              fontSize: '12px'
            }}
          >
            {month.label}
          </div>
        ))}
      </div>

      {/* 甘特图内容 */}
      <div className="gantt-body">
        {data.map((staff, staffIndex) => (
          <div key={staff.id} className="gantt-row" style={{ 
            display: 'flex', 
            minHeight: '60px',
            borderBottom: '1px solid #f0f0f0',
            minWidth: timeScale.length * monthWidth + 200
          }}>
            {/* 人员信息 */}
            <div style={{ 
              width: 200, 
              padding: '12px 16px', 
              borderRight: '1px solid #f0f0f0',
              background: '#fff'
            }}>
              <div style={{ fontWeight: 500 }}>{staff.staffName}</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {staff.position} | {staff.department}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                工作负载: {staff.totalWorkload}%
              </div>
            </div>

            {/* 项目时间线 */}
            <div style={{ 
              position: 'relative', 
              flex: 1, 
              background: staffIndex % 2 === 0 ? '#fff' : '#fafafa'
            }}>
              {/* 月份分割线 */}
              {timeScale.map((_, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: index * monthWidth,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: '#f0f0f0',
                  }}
                />
              ))}

              {/* 项目条 */}
              {staff.projects.map((project, projectIndex) => {
                const position = calculateProjectPosition(project);
                return (
                  <Tooltip
                    key={`${project.projectId}-${projectIndex}`}
                    title={
                      <div>
                        <div><strong>{project.projectName}</strong></div>
                        <div>角色: {project.role}</div>
                        <div>工作负载: {project.workload}%</div>
                        <div>时间: {project.startDate} ~ {project.endDate}</div>
                        <div>状态: {project.status}</div>
                      </div>
                    }
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: position.left,
                        top: 8 + projectIndex * 20,
                        width: position.width,
                        height: '16px',
                        background: getProjectColor(project.status, project.workload),
                        borderRadius: '8px',
                        border: `1px solid ${getProjectColor(project.status, 100)}`,
                        cursor: 'pointer',
                        fontSize: '10px',
                        lineHeight: '14px',
                        padding: '0 4px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        color: '#fff',
                        textShadow: '0 0 2px rgba(0,0,0,0.5)'
                      }}
                    >
                      {position.width > 60 ? project.projectName : ''}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 人员工作负载统计
 */
const WorkloadSummary: React.FC<{ data: StaffAssignment[] }> = ({ data }) => {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'staffName',
      key: 'staffName',
      width: 100,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '项目数量',
      dataIndex: 'projects',
      key: 'projectCount',
      render: (projects: ProjectAssignment[]) => projects.length,
      width: 80,
    },
    {
      title: '总工作负载',
      dataIndex: 'totalWorkload',
      key: 'totalWorkload',
      render: (workload: number) => (
        <div>
          <div>{workload}%</div>
          <div style={{ width: 80, marginTop: 4 }}>
            <div
              style={{
                height: 6,
                background: workload > 100 ? '#ff4d4f' : workload > 80 ? '#fa8c16' : '#52c41a',
                borderRadius: 3,
                width: `${Math.min(workload, 100)}%`,
              }}
            />
          </div>
        </div>
      ),
      width: 120,
    },
    {
      title: '可用性',
      dataIndex: 'availability',
      key: 'availability',
      render: (availability: number) => (
        <Tag color={availability > 20 ? 'green' : availability > 10 ? 'orange' : 'red'}>
          {availability}%
        </Tag>
      ),
      width: 80,
    },
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: StaffAssignment) => {
        if (record.totalWorkload > 100) {
          return <Tag color="red">超负荷</Tag>;
        } else if (record.totalWorkload > 80) {
          return <Tag color="orange">繁忙</Tag>;
        } else if (record.totalWorkload > 50) {
          return <Tag color="blue">正常</Tag>;
        } else {
          return <Tag color="green">空闲</Tag>;
        }
      },
      width: 80,
    },
  ];

  return (
    <Card title="人员工作负载统计" size="small">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        scroll={{ y: 300 }}
      />
    </Card>
  );
};

/**
 * 人员流动甘特图主页面
 */
const StaffGantt: React.FC = () => {
  const [staffData, setStaffData] = useState<StaffAssignment[]>([]);
  const [timeRange, setTimeRange] = useState<[string, string]>(['2024-01-01', '2024-12-31']);
  const [zoom, setZoom] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // 人员变动趋势图组件
  const StaffMovementTrend: React.FC<{
    data: StaffMovementData[];
    timeRange: [string, string];
  }> = ({ data, timeRange }) => {
    const option = {
      title: {
        text: '人员变动趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入职', '离职', '部门调动'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.month)
      },
      yAxis: {
        type: 'value',
        name: '人数'
      },
      series: [
        {
          name: '入职',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(82, 196, 26, 0.6)' }, { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          lineStyle: {
            color: '#52c41a'
          },
          data: data.map(item => item.join)
        },
        {
          name: '离职',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(255, 77, 79, 0.6)' }, { offset: 1, color: 'rgba(255, 77, 79, 0.1)' }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          lineStyle: {
            color: '#ff4d4f'
          },
          data: data.map(item => item.leave)
        },
        {
          name: '部门调动',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(24, 144, 255, 0.6)' }, { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          lineStyle: {
            color: '#1890ff'
          },
          data: data.map(item => item.transfer)
        }
      ]
    };

    return (
      <Card bodyStyle={{ padding: 0 }}>
        <ReactECharts option={option} style={{ height: 300 }} />
      </Card>
    );
  };

  // 部门人员分布图组件
  const DepartmentDistribution: React.FC<{
    data: StaffAssignment[];
  }> = ({ data }) => {
    // 按部门统计人员
    const departmentData = data.reduce((acc, staff) => {
      const dept = staff.department;
      if (!acc[dept]) {
        acc[dept] = 0;
      }
      acc[dept]++;
      return acc;
    }, {} as Record<string, number>);

    const departmentNames = Object.keys(departmentData);
    const departmentCounts = Object.values(departmentData);

    const option = {
      title: {
        text: '部门人员分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}人 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        bottom: 0,
        data: departmentNames
      },
      series: [
        {
          name: '部门',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: departmentNames.map((dept, index) => ({
            value: departmentCounts[index],
            name: dept
          }))
        }
      ]
    };

    return (
      <Card bodyStyle={{ padding: 0 }}>
        <ReactECharts option={option} style={{ height: 300 }} />
      </Card>
    );
  };

  // 部门间人员流动热图组件
  const DepartmentTransferHeatmap: React.FC<{
    data: StaffAssignment[];
    timeRange: [string, string];
  }> = ({ data, timeRange }) => {
    // 提取所有部门
    const departments = Array.from(new Set(data.map(staff => staff.department)));
    
    // 按时间范围过滤调动记录
    const startDate = dayjs(timeRange[0]);
    const endDate = dayjs(timeRange[1]);
    
    // 初始化热图数据
    const heatmapData: number[][] = departments.map(() => 
      departments.map(() => 0)
    );
    
    // 填充热图数据
    data.forEach(staff => {
      if (staff.transfers) {
        staff.transfers.forEach(transfer => {
          const transferDate = dayjs(transfer.transferDate);
          if (transferDate.isAfter(startDate) && transferDate.isBefore(endDate)) {
            const fromIndex = departments.indexOf(transfer.fromDepartment);
            const toIndex = departments.indexOf(transfer.toDepartment);
            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
              heatmapData[fromIndex][toIndex]++;
            }
          }
        });
      }
    });
    
    // 转换为ECharts需要的格式
    const echartsData: any[] = [];
    departments.forEach((fromDept, fromIndex) => {
      departments.forEach((toDept, toIndex) => {
        if (fromIndex !== toIndex) {
          echartsData.push([fromDept, toDept, heatmapData[fromIndex][toIndex]]);
        }
      });
    });
    
    const option = {
      title: {
        text: '部门间人员流动热图',
        left: 'center'
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `${params.data[0]} → ${params.data[1]}: ${params.data[2]}人`;
        }
      },
      grid: {
        height: '70%',
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: departments,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: departments,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...echartsData.map(d => d[2])) || 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#f7f7f7', '#1890ff']
        }
      },
      series: [
        {
          name: '人员流动',
          type: 'heatmap',
          data: echartsData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{c}'
          }
        }
      ]
    };

    return (
      <Card bodyStyle={{ padding: 0 }}>
        <ReactECharts option={option} style={{ height: 400 }} />
      </Card>
    );
  };

  // 人员变动统计卡片组件
  const StaffMovementStats: React.FC<{
    data: StaffAssignment[];
    timeRange: [string, string];
  }> = ({ data, timeRange }) => {
    const startDate = dayjs(timeRange[0]);
    const endDate = dayjs(timeRange[1]);
    
    // 计算入职人数
    const joinCount = data.filter(staff => 
      dayjs(staff.joinDate).isAfter(startDate) && dayjs(staff.joinDate).isBefore(endDate)
    ).length;
    
    // 计算离职人数
    const leaveCount = data.filter(staff => 
      staff.leaveDate && 
      dayjs(staff.leaveDate).isAfter(startDate) && 
      dayjs(staff.leaveDate).isBefore(endDate)
    ).length;
    
    // 计算调动人数
    const transferCount = data.filter(staff => 
      staff.transfers && 
      staff.transfers.some(transfer => 
        dayjs(transfer.transferDate).isAfter(startDate) && 
        dayjs(transfer.transferDate).isBefore(endDate)
      )
    ).length;
    
    // 计算净增长
    const netGrowth = joinCount - leaveCount;

    return (
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="新入职人数"
              value={joinCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离职人数"
              value={leaveCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="部门调动人数"
              value={transferCount}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="净增长人数"
              value={netGrowth}
              prefix={netGrowth > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: netGrowth > 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  // 模拟数据
  useEffect(() => {
    const mockData: StaffAssignment[] = [
      {
        id: '1',
        staffName: '张三',
        position: '前端工程师',
        department: '技术部',
        totalWorkload: 90,
        availability: 10,
        joinDate: '2023-11-01',
        projects: [
          {
            projectId: 'p1',
            projectName: 'ERP系统前端',
            startDate: '2024-01-01',
            endDate: '2024-06-30',
            workload: 55,
            role: '技术负责人',
            status: 'active',
          },
          {
            projectId: 'p2',
            projectName: '移动APP',
            startDate: '2024-02-01',
            endDate: '2024-08-31',
            workload: 35,
            role: '前端开发',
            status: 'active',
          },
          {
            projectId: 'p4',
            projectName: '用户体验优化',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            workload: 25,
            role: '技术支持',
            status: 'planned',
          },
        ],
      },
      {
        id: '2',
        staffName: '李四',
        position: '后端工程师',
        department: '技术部',
        totalWorkload: 110,
        availability: 0,
        joinDate: '2023-09-15',
        projects: [
          {
            projectId: 'p1',
            projectName: 'ERP系统后端',
            startDate: '2024-01-01',
            endDate: '2024-05-31',
            workload: 70,
            role: '技术负责人',
            status: 'active',
          },
          {
            projectId: 'p3',
            projectName: '数据分析平台',
            startDate: '2024-02-15',
            endDate: '2024-07-30',
            workload: 40,
            role: '架构师',
            status: 'active',
          },
        ],
      },
      {
        id: '3',
        staffName: '王五',
        position: '产品经理',
        department: '产品部',
        totalWorkload: 75,
        availability: 25,
        joinDate: '2023-12-10',
        projects: [
          {
            projectId: 'p2',
            projectName: '移动APP',
            startDate: '2024-02-01',
            endDate: '2024-08-31',
            workload: 50,
            role: '产品负责人',
            status: 'active',
          },
          {
            projectId: 'p4',
            projectName: '用户体验优化',
            startDate: '2024-04-01',
            endDate: '2024-06-30',
            workload: 25,
            role: '产品经理',
            status: 'planned',
          },
        ],
      },
      {
        id: '4',
        staffName: '赵六',
        position: 'UI设计师',
        department: '设计部',
        totalWorkload: 60,
        availability: 40,
        joinDate: '2024-01-05',
        projects: [
          {
            projectId: 'p2',
            projectName: '移动APP',
            startDate: '2024-01-15',
            endDate: '2024-04-30',
            workload: 35,
            role: 'UI设计',
            status: 'active',
          },
          {
            projectId: 'p4',
            projectName: '用户体验优化',
            startDate: '2024-03-15',
            endDate: '2024-05-31',
            workload: 25,
            role: 'UX设计',
            status: 'active',
          },
        ],
      },
    ];

    setStaffData(mockData);
  }, []);

  // 过滤数据
  const filteredData = staffData.filter(staff => {
    if (selectedDepartment !== 'all' && staff.department !== selectedDepartment) {
      return false;
    }
    if (selectedPosition !== 'all' && staff.position !== selectedPosition) {
      return false;
    }
    return true;
  }).map(staff => ({
    ...staff,
    projects: staff.projects.filter(project => 
      showCompleted || project.status !== 'completed'
    )
  }));

  const departments = Array.from(new Set(staffData.map(s => s.department)));
  const positions = Array.from(new Set(staffData.map(s => s.position)));

  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  const handleFullscreen = () => {
    message.info('全屏模式开发中...');
  };

  // 生成人员变动趋势数据
  const generateStaffMovementData = (data: StaffAssignment[], timeRange: [string, string]): StaffMovementData[] => {
    const startDate = dayjs(timeRange[0]);
    const endDate = dayjs(timeRange[1]);
    const months: StaffMovementData[] = [];
    
    // 生成时间范围内的所有月份
    let currentMonth = dayjs(startDate).startOf('month');
    while (currentMonth.isBefore(endDate)) {
      const nextMonth = currentMonth.add(1, 'month');
      const monthLabel = currentMonth.format('YYYY-MM');
      
      // 计算当月入职人数
      const joinCount = data.filter(staff => {
        const joinDate = dayjs(staff.joinDate);
        return joinDate.isAfter(currentMonth) && joinDate.isBefore(nextMonth);
      }).length;
      
      // 计算当月离职人数
      const leaveCount = data.filter(staff => {
        return staff.leaveDate && 
               dayjs(staff.leaveDate).isAfter(currentMonth) && 
               dayjs(staff.leaveDate).isBefore(nextMonth);
      }).length;
      
      // 计算当月部门调动人数
      const transferCount = data.filter(staff => {
        return staff.transfers && 
               staff.transfers.some(transfer => {
                 const transferDate = dayjs(transfer.transferDate);
                 return transferDate.isAfter(currentMonth) && transferDate.isBefore(nextMonth);
               });
      }).length;
      
      months.push({
        month: monthLabel,
        join: joinCount,
        leave: leaveCount,
        transfer: transferCount
      });
      
      currentMonth = nextMonth;
    }
    
    return months;
  };

  // 生成人员变动趋势数据
  const staffMovementData = generateStaffMovementData(filteredData, timeRange);

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader title="人员流动甘特图" />
      
      {/* 人员变动统计卡片 */}
      <StaffMovementStats data={filteredData} timeRange={timeRange} />
      
      {/* 控制面板 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <RangePicker
              value={[
                timeRange[0] as any,
                timeRange[1] as any
              ]}
              onChange={(dates: any, dateStrings: [string, string]) => {
                if (dates) {
                  setTimeRange(dateStrings);
                }
              }}
              style={{ width: '100%' }}
            />
          </Col>
          
          <Col span={3}>
            <Select
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              style={{ width: '100%' }}
              placeholder="选择部门"
            >
              <Option value="all">全部部门</Option>
              {departments.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
          
          <Col span={3}>
            <Select
              value={selectedPosition}
              onChange={setSelectedPosition}
              style={{ width: '100%' }}
              placeholder="选择职位"
            >
              <Option value="all">全部职位</Option>
              {positions.map(pos => (
                <Option key={pos} value={pos}>{pos}</Option>
              ))}
            </Select>
          </Col>

          <Col span={4}>
            <Space>
              <span>缩放:</span>
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                value={zoom}
                onChange={setZoom}
                style={{ width: 100 }}
              />
              <span>{Math.round(zoom * 100)}%</span>
            </Space>
          </Col>

          <Col span={3}>
            <Space>
              <span>显示已完成:</span>
              <Switch
                checked={showCompleted}
                onChange={setShowCompleted}
                size="small"
              />
            </Space>
          </Col>

          <Col span={7}>
            <Space>
              <Button icon={<FilterOutlined />} onClick={() => setFilterModalVisible(true)}>
                高级筛选
              </Button>
              <Button icon={<FullscreenOutlined />} onClick={handleFullscreen}>
                全屏
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 图表区域 */}
      <Tabs defaultActiveKey="1" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <TabPane tab={<span><TeamOutlined /> 甘特图视图</span>} key="1">
          <Row gutter={16}>
            <Col span={18}>
              <Card title="人员项目分配时间线" bodyStyle={{ padding: 0 }}>
                <GanttChart 
                  data={filteredData} 
                  timeRange={timeRange} 
                  zoom={zoom}
                />
              </Card>
            </Col>
            
            <Col span={6}>
              <WorkloadSummary data={filteredData} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span><LineChartOutlined /> 人员变动趋势</span>} key="2">
          <Row gutter={16}>
            <Col span={24}>
              <StaffMovementTrend data={staffMovementData} timeRange={timeRange} />
            </Col>
            <Col span={24}>
              <DepartmentTransferHeatmap data={filteredData} timeRange={timeRange} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span><PieChartOutlined /> 人员分布</span>} key="3">
          <Row gutter={16}>
            <Col span={12}>
              <DepartmentDistribution data={filteredData} />
            </Col>
            <Col span={12}>
              <Card title="人员流动统计详情" extra={<Button type="primary" size="small">导出报告</Button>}>
                <Table
                  dataSource={[
                    {
                      key: '1',
                      time: timeRange[0] + ' 至 ' + timeRange[1],
                      join: staffMovementData.reduce((sum, item) => sum + item.join, 0),
                      leave: staffMovementData.reduce((sum, item) => sum + item.leave, 0),
                      transfer: staffMovementData.reduce((sum, item) => sum + item.transfer, 0),
                      net: staffMovementData.reduce((sum, item) => sum + (item.join - item.leave), 0)
                    }
                  ]}
                  columns={[
                    { title: '时间范围', dataIndex: 'time' },
                    { title: '新入职', dataIndex: 'join', key: 'join' },
                    { title: '离职', dataIndex: 'leave', key: 'leave' },
                    { title: '部门调动', dataIndex: 'transfer', key: 'transfer' },
                    { title: '净增长', dataIndex: 'net', key: 'net' }
                  ]}
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* 高级筛选模态框 */}
      <Modal
        title="高级筛选"
        open={filterModalVisible}
        onOk={() => setFilterModalVisible(false)}
        onCancel={() => setFilterModalVisible(false)}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="工作负载范围">
                <Slider range min={0} max={150} defaultValue={[0, 150]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="可用性范围">
                <Slider range min={0} max={100} defaultValue={[0, 100]} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="项目状态">
            <Select mode="multiple" style={{ width: '100%' }} placeholder="选择项目状态">
              <Option value="active">进行中</Option>
              <Option value="planned">计划中</Option>
              <Option value="completed">已完成</Option>
              <Option value="on-hold">暂停</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="关键词搜索">
            <Input placeholder="搜索人员姓名或项目名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffGantt;