import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Undo2,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  BarChart3
} from 'lucide-react';
import { getDashboard } from '../services/financeAdminApi';
import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 1250000,
    activeSubscriptions: 450,
    pendingRefunds: 12,
    revenueGrowth: 15.2,
    subscriptionGrowth: 8.4
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', amount: 400000 },
    { name: 'Feb', amount: 300000 },
    { name: 'Mar', amount: 600000 },
    { name: 'Apr', amount: 800000 },
    { name: 'May', amount: 500000 },
    { name: 'Jun', amount: 900000 },
    { name: 'Jul', amount: 1250000 },
  ];

  const planData = [
    { name: 'Starter', value: 240, color: '#3b82f6' },
    { name: 'Professional', value: 150, color: '#8b5cf6' },
    { name: 'Enterprise', value: 60, color: '#10b981' },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await getDashboard();
      setStats(prev => ({ ...prev, ...data }));
    } catch (err) {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee className="text-blue-500" />, growth: stats.revenueGrowth, color: 'blue' },
    { title: 'Active Subscriptions', value: stats.activeSubscriptions, icon: <CreditCard className="text-purple-500" />, growth: stats.subscriptionGrowth, color: 'purple' },
    { title: 'Pending Refunds', value: stats.pendingRefunds, icon: <Undo2 className="text-amber-500" />, growth: -2.1, color: 'amber' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Finance Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time financial performance and analytics.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Live Updates Active</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${card.color}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={`w-16 h-16 bg-${card.color}-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1.5 text-[11px] font-black ${card.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'} px-3 py-1.5 rounded-full`}>
                {card.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(card.growth)}%
              </div>
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{card.title}</p>
              <h3 className="text-4xl font-black text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Revenue Growth</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Monthly performance trend</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black text-slate-600 outline-none">
              <option>Last 7 Months</option>
              <option>Year 2024</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', padding: '12px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 900 }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900">Plan Distribution</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Market share by package</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
            {planData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-black text-slate-700">{item.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
