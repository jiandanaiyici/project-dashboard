import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Users,
  Code,
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Filter,
  Search,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const teamMembers = [
  {
    id: 1,
    name: "张三",
    role: "前端开发",
    project: "项目A",
    saturation: 85,
    commits: 120,
    lines: 5000,
  },
  {
    id: 2,
    name: "李四",
    role: "后端开发",
    project: "项目B",
    saturation: 65,
    commits: 95,
    lines: 3200,
  },
  {
    id: 3,
    name: "王五",
    role: "测试工程师",
    project: "项目A",
    saturation: 45,
    commits: 30,
    lines: 1200,
  },
  {
    id: 4,
    name: "赵六",
    role: "产品经理",
    project: "项目C",
    saturation: 75,
    commits: 15,
    lines: 800,
  },
  {
    id: 5,
    name: "钱七",
    role: "UI设计师",
    project: "项目B",
    saturation: 55,
    commits: 25,
    lines: 1500,
  },
];

const applicationHealth = [
  { name: "应用A", health: 95, alerts: 2, exceptions: 1 },
  { name: "应用B", health: 87, alerts: 5, exceptions: 3 },
  { name: "应用C", health: 92, alerts: 1, exceptions: 0 },
  { name: "应用D", health: 78, alerts: 8, exceptions: 6 },
];

const commitData = [
  { date: "2024-01", commits: 120, lines: 4500 },
  { date: "2024-02", commits: 150, lines: 5200 },
  { date: "2024-03", commits: 180, lines: 6100 },
  { date: "2024-04", commits: 140, lines: 4800 },
  { date: "2024-05", commits: 200, lines: 7200 },
];

const resourceAllocation = [
  { name: "前端开发", value: 35 },
  { name: "后端开发", value: 30 },
  { name: "测试工程师", value: 20 },
  { name: "产品经理", value: 10 },
  { name: "UI设计师", value: 5 },
];

const riskData = [
  { date: "2024-01", risk: 15 },
  { date: "2024-02", risk: 22 },
  { date: "2024-03", risk: 18 },
  { date: "2024-04", risk: 25 },
  { date: "2024-05", risk: 12 },
];

const projectProgress = [
  { name: "项目A", progress: 85, planned: 90 },
  { name: "项目B", progress: 72, planned: 75 },
  { name: "项目C", progress: 60, planned: 65 },
  { name: "项目D", progress: 45, planned: 50 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardCard = ({ title, children, icon: Icon }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="ml-3 text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const SaturationBar = ({ value }) => {
  let color = "bg-green-500";
  if (value > 90) color = "bg-red-500";
  else if (value > 70) color = "bg-yellow-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color} transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default function App() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportChart = () => {
    alert("图表导出功能已触发");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                前端应用管理大盘
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索成员或项目..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={exportChart}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                导出图表
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard title="团队成员" icon={Users}>
            <div className="text-3xl font-bold text-gray-900">
              {teamMembers.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">活跃成员数</div>
          </DashboardCard>

          <DashboardCard title="代码提交" icon={Code}>
            <div className="text-3xl font-bold text-gray-900">
              {teamMembers.reduce((sum, member) => sum + member.commits, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">本月总提交数</div>
          </DashboardCard>

          <DashboardCard title="风险预警" icon={AlertTriangle}>
            <div className="text-3xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600 mt-1">当前风险数</div>
          </DashboardCard>

          <DashboardCard title="项目进度" icon={TrendingUp}>
            <div className="text-3xl font-bold text-green-600">78%</div>
            <div className="text-sm text-gray-600 mt-1">平均完成率</div>
          </DashboardCard>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 团队成员概览 */}
          <DashboardCard title="团队成员概览" icon={Users}>
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.role} · {member.project}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {member.commits} 次提交
                    </div>
                    <SaturationBar value={member.saturation} />
                    <div className="text-xs text-gray-500 mt-1">
                      {member.saturation}% 饱和度
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* 应用健康度 */}
          <DashboardCard title="应用健康度大盘" icon={Activity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationHealth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="health" name="健康评分" fill="#10B981" />
                <Bar dataKey="alerts" name="告警数" fill="#F59E0B" />
                <Bar dataKey="exceptions" name="异常数" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* 代码提交趋势 */}
          <DashboardCard title="代码提交趋势" icon={Code}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={commitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="commits"
                  name="提交次数"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="lines"
                  name="代码行数"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </DashboardCard>

          {/* 资源分配 */}
          <DashboardCard title="资源分配工种占比" icon={PieChartIcon}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceAllocation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>

        {/* 风险预警 & 项目进度 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardCard title="风险预警趋势" icon={AlertTriangle}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="risk"
                  name="风险指数"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </DashboardCard>

          <DashboardCard title="项目进度追踪" icon={Calendar}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" name="实际进度" fill="#10B981" />
                <Bar dataKey="planned" name="计划进度" fill="#94A3B8" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardCard>
        </div>

        {/* 人员详情模态框 */}
        {selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedMember.name} 详情
                </h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">角色</div>
                  <div className="text-lg font-semibold">
                    {selectedMember.role}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">所属项目</div>
                  <div className="text-lg font-semibold">
                    {selectedMember.project}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">提交次数</div>
                  <div className="text-lg font-semibold">
                    {selectedMember.commits}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">代码行数</div>
                  <div className="text-lg font-semibold">
                    {selectedMember.lines.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">饱和度分析</h3>
                <SaturationBar value={selectedMember.saturation} />
                <div className="text-right text-sm text-gray-600 mt-1">
                  {selectedMember.saturation}%
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  关闭
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  查看详细报告
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
