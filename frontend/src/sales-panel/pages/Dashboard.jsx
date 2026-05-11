import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, CheckSquare, TrendingUp, 
  Target, Sparkles, Plus, ChevronRight, Award,
  ArrowUpRight, Clock, ShieldCheck, Briefcase, Building2, Ticket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getSalesDashboard } from '../../services/salesApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await getSalesDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      toast.error("Failed to load analytics dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600 animate-pulse" size={20} />
        </div>
      </div>
    );
  }

  const { stats, chartData, recentLeads, recentTasks } = data || {
    stats: { totalLeads: 0, newLeads: 0, wonLeadsCount: 0, pendingTasks: 0, todayFollowUps: 0, totalSalesVolume: 0, targetProgress: 0, targetQuota: 500000 },
    chartData: [],
    recentLeads: [],
    recentTasks: []
  };

  // Tailored specifically for Job Portal sales operations
  const statCards = [
    {
      title: "Employer HR Leads",
      value: stats.totalLeads,
      description: `${stats.newLeads} pending warm signups`,
      icon: Building2,
      color: "from-violet-500 to-indigo-600",
      bg: "bg-violet-50/50"
    },
    {
      title: "HR Catch-ups Today",
      value: stats.todayFollowUps,
      description: "Hiring manager call outreach",
      icon: Calendar,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50/50"
    },
    {
      title: "Recruitment Plans Closed",
      value: stats.wonLeadsCount,
      description: "Active corporate subscribers",
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50/50"
    },
    {
      title: "Total Sales Revenue",
      value: `₹${stats.totalSalesVolume.toLocaleString('en-IN')}`,
      description: "Enterprise subscription revenue",
      icon: TrendingUp,
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50/50"
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-violet-950 to-indigo-950 p-8 md:p-10 rounded-[2.5rem] shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-violet-200 text-xs font-semibold tracking-wider uppercase border border-white/10">
              <Sparkles size={12} className="text-amber-400" />
              B2B Recruiter Sales Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Powering NextHire's Employer Acquisition
            </h1>
            <p className="text-violet-200/80 max-w-xl font-medium text-sm md:text-base leading-relaxed">
              Source corporate partners, pitch featured job-post limits, sell enterprise recruiter databases, and scale B2B subscription revenue.
            </p>
          </div>
          <button 
            onClick={() => navigate('/sales/add-lead')}
            className="flex items-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 w-fit shrink-0"
          >
            <Plus size={20} />
            Add Sourced Employer
          </button>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={card.title}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold tracking-wider uppercase">{card.title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <card.icon size={20} />
              </div>
            </div>
            <div className="border-t border-slate-50 mt-4 pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">{card.description}</span>
              <ArrowUpRight size={14} className="text-slate-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart & Target Radial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Enterprise Revenue Trend</h3>
              <p className="text-xs text-slate-400 font-medium">Monthly subscriptions & custom corporate contract billing</p>
            </div>
            <span className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-xl text-xs font-bold">2026 Quota Tracking</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', color: '#a78bfa' }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Ring Tracker */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">B2B Commission Target</h3>
            <p className="text-xs text-slate-400 font-medium">Target contract volume closed this month</p>
          </div>
          
          <div className="relative flex items-center justify-center py-4">
            {/* SVG Progress Circle */}
            <svg className="w-40 h-40 transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="#7c3aed" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * stats.targetProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900">{stats.targetProgress}%</span>
              <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Closed</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Goal Quota:</span>
              <span className="text-slate-900">₹{stats.targetQuota.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Achieved:</span>
              <span className="text-emerald-600">₹{stats.totalSalesVolume.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads & Tasks Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Sourced Employer Registrations</h3>
              <p className="text-xs text-slate-400 font-medium">Verify company registration requirements & plan package pitches</p>
            </div>
            <Link to="/sales/leads" className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {recentLeads.map((lead) => (
              <div key={lead._id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-sm">
                    {lead.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{lead.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Briefcase size={12} className="text-slate-400" />
                      {lead.company || "Corporate HR"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    lead.status === 'won' ? 'bg-emerald-50 text-emerald-600' :
                    lead.status === 'proposal' ? 'bg-indigo-50 text-indigo-600' :
                    lead.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900">₹{(lead.value || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
            {recentLeads.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                No active employer pipelines sourced
              </div>
            )}
          </div>
        </div>

        {/* Action Chores / Tasks */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Outreach Agenda & Tasks</h3>
              <p className="text-xs text-slate-400 font-medium">Pending action loops (contracts, followups, pitches)</p>
            </div>
            <Link to="/sales/tasks" className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {recentTasks.map((task) => (
              <div key={task._id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    task.priority === 'high' ? 'bg-rose-50 text-rose-500' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-500'
                  }`}>
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} />
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  task.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                No active outreach chores scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
