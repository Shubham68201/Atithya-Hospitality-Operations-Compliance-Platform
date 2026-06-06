import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  HiOutlineUsers, HiOutlineClipboardList, HiOutlineMail,
  HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineBriefcase,
} from "react-icons/hi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS  = ["#C8A25D","#0B1F3A","#A67C32","#9BB0C9","#2E2E2E","#EF4444"];

function StatCard({ icon: Icon, label, value, color = "bg-navy/5" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elegant flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="text-gold" size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy font-cinzel">{value ?? "—"}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const [stats,  setStats]  = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    const isAdmin = ["super_admin","admin"].includes(user?.role);
    if (isAdmin) {
      axiosInstance.get("/dashboard/stats").then(({ data }) => setStats(data.data)).catch(() => {});
      axiosInstance.get("/dashboard/charts").then(({ data }) => setCharts(data.data)).catch(() => {});
    }
  }, [user]);

  const userGrowthData = charts?.userGrowth?.map((d) => ({
    name: MONTHS[d._id.month - 1],
    users: d.count,
  })) || [];

  const demoTrendData = charts?.demoTrend?.map((d) => ({
    name: MONTHS[d._id.month - 1],
    demos: d.count,
  })) || [];

  const roleData = charts?.roleDistribution?.map((d) => ({
    name: d._id?.replace("_", " "),
    value: d.count,
  })) || [];

  const complianceData = charts?.complianceStatus?.map((d) => ({
    name: d._id,
    value: d.count,
  })) || [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-cinzel text-navy text-2xl sm:text-3xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, <span className="text-gold font-medium">{user?.fullName}</span>
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <StatCard icon={HiOutlineUsers}           label="Total Users"        value={stats.totalUsers}         color="bg-blue-50" />
          <StatCard icon={HiOutlineUsers}           label="Active Users"       value={stats.activeUsers}        color="bg-green-50" />
          <StatCard icon={HiOutlineClipboardList}   label="Demo Requests"      value={stats.totalDemos}         color="bg-yellow-50" />
          <StatCard icon={HiOutlineClipboardList}   label="Open Demos"         value={stats.openDemos}          color="bg-orange-50" />
          <StatCard icon={HiOutlineBriefcase}       label="Applications"       value={stats.careerApplications} color="bg-purple-50" />
          <StatCard icon={HiOutlineOfficeBuilding}  label="Properties Managed" value={stats.propertiesManaged}  color="bg-teal-50" />
          <StatCard icon={HiOutlineMail}            label="Pending Verif."     value={stats.pendingVerifications} color="bg-pink-50" />
          <StatCard icon={HiOutlineShieldCheck}     label="Verified Users"     value={stats.verifiedUsers}      color="bg-indigo-50" />
        </div>
      )}

      {/* Charts row 1 */}
      {charts && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card-elegant">
              <h3 className="font-cinzel text-navy text-base mb-4">User Growth (Last 12 Months)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C8A25D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C8A25D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#C8A25D" strokeWidth={2} fill="url(#goldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card-elegant">
              <h3 className="font-cinzel text-navy text-base mb-4">Demo Requests Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={demoTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="demos" fill="#0B1F3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card-elegant">
              <h3 className="font-cinzel text-navy text-base mb-4">User Role Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card-elegant">
              <h3 className="font-cinzel text-navy text-base mb-4">Compliance Status Overview</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={complianceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#C8A25D" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Non-admin welcome */}
      {!["super_admin","admin"].includes(user?.role) && (
        <div className="card-elegant text-center py-12">
          <h2 className="font-cinzel text-navy text-2xl mb-3">Welcome to Atithya</h2>
          <p className="text-gray-500 text-sm">Use the sidebar to navigate to your assigned modules.</p>
        </div>
      )}
    </div>
  );
}
