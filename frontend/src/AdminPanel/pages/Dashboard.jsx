import React, { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { getDashboard } from '../../services/adminApi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Candidates', value: stats.totalUsers, icon: <Users />, color: 'bg-blue-500', light: 'bg-blue-50' },
    { name: 'Active Companies', value: stats.totalCompanies, icon: <Building2 />, color: 'bg-indigo-500', light: 'bg-indigo-50' },
    { name: 'Total Jobs', value: stats.totalJobs, icon: <Briefcase />, color: 'bg-emerald-500', light: 'bg-emerald-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Activity className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-500 font-medium text-sm">Welcome back! Here's what's happening on the platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.name}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-4 rounded-2xl ${stat.light} text-indigo-600 transition-transform group-hover:scale-110`}>
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black uppercase">
                <TrendingUp size={12} /> +12%
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-80 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
            <Activity size={32} />
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Growth Charts Coming Soon</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-80 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
            <TrendingUp size={32} />
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Activity Feed Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
