import { Helmet } from "react-helmet";
import {
  Building2,
  Users,
  FileText,
  Activity,
  ArrowUpRight,
  Plus,
  UserPlus,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Mock data
const DEPARTMENTS = [
  { id: 1, code: "YS", name: "Head Office", userCount: 14 },
  { id: 2, code: "YSC", name: "Tokyo Sales", userCount: 9 },
  { id: 3, code: "YSF", name: "Nagano Sales", userCount: 6 },
  { id: 4, code: "YSG", name: "North Kanto", userCount: 5 },
  { id: 5, code: "YSJ", name: "Kyushu Branch", userCount: 4 },
];

const RECENT_REQUESTS = [
  { id: 1, actor: "Aiko Tanaka", requestNo: "YSC-26-0142", projectName: "Lighting Project", requestType: "New", time: "12 mins ago" },
  { id: 2, actor: "Hiro Nakamura", requestNo: "YSF-26-0087", projectName: "Signboard Project", requestType: "Revision", time: "Yesterday" },
  { id: 3, actor: "Rina Kobayashi", requestNo: "YSG-26-0033", projectName: "Disaster Prevention Project", requestType: "New", time: "3 days ago" },
  { id: 4, actor: "Yui Sato", requestNo: "YSC-26-0139", projectName: "Lighting Project", requestType: "New", time: "4 days ago" },
  { id: 5, actor: "Kenji Watanabe", requestNo: "YS-26-0201", projectName: "Multi-purpose Project", requestType: "Revision", time: "5 days ago" },
];

const REQUEST_TYPE_DATA = [
  { name: 'New', value: 131, color: '#3399cc' },
  { name: 'Revision', value: 25, color: '#cbd5e1' }
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
};

function StatTile({ icon: Icon, label, value, trend, trendTone = "neutral", gradient, onClick }) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className="group text-left bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#3399cc]/40 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-sm bg-gradient-to-br ${gradient}`}>
          <Icon size={20} strokeWidth={2.25} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#3399cc] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
      <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
      <h3 className="text-[28px] leading-none font-bold text-slate-900 tabular-nums">{value}</h3>
      {trend && (
        <p
          className={`mt-2 text-xs font-medium ${
            trendTone === "good"
              ? "text-emerald-600"
              : trendTone === "warn"
                ? "text-amber-600"
                : "text-slate-400"
          }`}
        >
          {trend}
        </p>
      )}
    </motion.button>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3 text-sm">
        <p className="font-semibold text-slate-900 mb-1">{payload[0].name}</p>
        <p className="text-slate-600">
          <span className="font-medium text-slate-900">{payload[0].value}</span> items
        </p>
      </div>
    );
  }
  return null;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const totalUsers = DEPARTMENTS.reduce((sum, d) => sum + d.userCount, 0);

  const metrics = [
    {
      icon: Building2,
      label: "Total Departments",
      value: DEPARTMENTS.length,
      trend: "+1 this quarter",
      trendTone: "good",
      gradient: "from-[#0d3b66] to-[#3399cc]",
      path: "/superadmin/departments",
    },
    {
      icon: Users,
      label: "Total Users",
      value: totalUsers,
      trend: "+3 this month",
      trendTone: "good",
      gradient: "from-emerald-500 to-emerald-600",
      path: "/superadmin/users",
    },
    {
      icon: FileText,
      label: "Calculation Requests",
      value: 156,
      trend: "+23 vs. last month",
      trendTone: "good",
      gradient: "from-amber-500 to-amber-600",
      path: "/database",
    },
    {
      icon: Activity,
      label: "Active Today",
      value: 11,
      trend: `of ${totalUsers} total users`,
      trendTone: "neutral",
      gradient: "from-violet-500 to-violet-600",
      path: "/superadmin/users",
    },
  ];

  return (
    <div className="min-h-full flex flex-col bg-slate-50/50">
      <Helmet>
        <title>Super Admin Dashboard - KORI BALI</title>
      </Helmet>

      <div className="mx-6 2040:mx-[250px] hp:mx-2 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Overview of company-wide activities, departments, and user metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/superadmin/departments")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Department
            </button>
            <button
              onClick={() => navigate("/superadmin/users")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0d3b66] text-white rounded-lg text-sm font-medium hover:bg-[#0a2c4c] transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-6"
        >
          {metrics.map((metric) => (
            <StatTile key={metric.label} {...metric} onClick={() => navigate(metric.path)} />
          ))}
        </motion.div>

        {/* Charts & Tables Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Department Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 lg:col-span-2 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Users per Department</h2>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPARTMENTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="code" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                  <Bar 
                    dataKey="userCount" 
                    name="Users" 
                    radius={[4, 4, 0, 0]}
                    fill="#3399cc"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Types Donut */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm flex flex-col">
            <h2 className="text-base font-bold text-slate-900 mb-6">Request Distribution</h2>
            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                <PieChart>
                  <Pie
                    data={REQUEST_TYPE_DATA}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {REQUEST_TYPE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900 tabular-nums">
                  {REQUEST_TYPE_DATA.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-1">Total</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
              {REQUEST_TYPE_DATA.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-width Recent Requests Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Calculation Requests</h2>
              <p className="text-xs text-slate-500 mt-1">Latest activities from across all departments</p>
            </div>
            <button
              onClick={() => navigate("/database")}
              className="text-sm font-medium text-[#3399cc] hover:text-[#287a99] transition-colors flex items-center gap-1.5"
            >
              View Full Database <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Request No</th>
                  <th className="px-6 py-4 border-b border-slate-200">Applicant</th>
                  <th className="px-6 py-4 border-b border-slate-200">Project Name</th>
                  <th className="px-6 py-4 border-b border-slate-200">Type</th>
                  <th className="px-6 py-4 border-b border-slate-200 text-right">Time</th>
                  <th className="px-6 py-4 border-b border-slate-200 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_REQUESTS.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-slate-900">{req.requestNo}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#0d3b66]/5 text-[#0d3b66] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {initials(req.actor)}
                        </div>
                        <span className="text-slate-700 font-medium">{req.actor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-slate-600">{req.projectName}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold tracking-wide ${
                          req.requestType === "New" 
                            ? "bg-blue-50 text-[#3399cc] border border-blue-100/50" 
                            : "bg-slate-100 text-slate-600 border border-slate-200/50"
                        }`}
                      >
                        {req.requestType.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-slate-500 text-xs">{req.time}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button className="text-slate-300 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {RECENT_REQUESTS.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-sm">No recent requests found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
