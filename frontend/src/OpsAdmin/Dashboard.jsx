import React, { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { getDashboard } from '../services/opsAdminApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalCompanies: 450,
    activeJobs: 890,
    pendingApprovals: 45,
    userGrowth: [40, 50, 60, 80, 95, 120, 150],
    jobTrends: [20, 35, 45, 30, 55, 70, 90]
  });

  const chartData = stats.userGrowth.map((val, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
    users: val,
    jobs: stats.jobTrends[i]
  }));

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboard();
      setStats(prev => ({ ...prev, ...data }));
    } catch (err) {
      // Use defaults
    }
  };

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <Users className="text-blue-500" />, growth: '+12.5%' },
    { title: 'Total Companies', value: stats.totalCompanies, icon: <Building2 className="text-emerald-500" />, growth: '+8.2%' },
    { title: 'Active Jobs', value: stats.activeJobs, icon: <Briefcase className="text-purple-500" />, growth: '+15.4%' },
    { title: 'Pending Approvals', value: stats.pendingApprovals, icon: <Clock className="text-amber-500" />, growth: '-2.1%' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Operations Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Platform-wide activity and growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                {card.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${card.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.growth}
              </span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-500" /> User Growth Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            <ArrowUpRight size={20} className="text-blue-500" /> Job Posting Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="jobs" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
