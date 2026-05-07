import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserX, UserCheck, AlertTriangle, TrendingUp, Fingerprint, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { getDashboard, getReports, getActionHistory } from '../services/trustSafetyApi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 156,
    pendingModeration: 42,
    blockedUsers: 84,
    fraudAlerts: 12,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s, r, a] = await Promise.all([getDashboard(), getReports(), getActionHistory()]);
      setStats(s);
      setRecentReports(r.slice(0, 5));
      setRecentActions(a.slice(0, 5));
    } catch (err) {}
  };

  const chartData = [
    { name: 'Mon', reports: 15, fraud: 5 },
    { name: 'Tue', reports: 20, fraud: 8 },
    { name: 'Wed', reports: 25, fraud: 3 },
    { name: 'Thu', reports: 18, fraud: 7 },
    { name: 'Fri', reports: 30, fraud: 10 },
    { name: 'Sat', reports: 22, fraud: 6 },
    { name: 'Sun', reports: 28, fraud: 9 },
  ];

  const kpis = [
    { title: 'Total Reports', value: stats.totalReports, icon: <ShieldAlert className="text-red-500" />, color: 'bg-red-50' },
    { title: 'Pending Moderation', value: stats.pendingModeration, icon: <Clock className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'High Risk Users', value: stats.fraudAlerts, icon: <Fingerprint className="text-indigo-500" />, color: 'bg-indigo-50' },
    { title: 'Blocked Users', value: stats.blockedUsers, icon: <UserX className="text-slate-600" />, color: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Safety Control Center</h1>
          <p className="text-slate-500 font-medium mt-1">Platform-wide security and compliance governance.</p>
        </div>
        <div className="flex gap-3">
           <Link to="/trust/moderation" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
             <Zap size={18} /> Moderate Queue
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${kpi.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner`}>
                {kpi.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{kpi.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <TrendingUp size={20} className="text-red-500" /> Platform Risk Trends
               </h3>
               <select className="text-xs font-bold bg-slate-50 border-none rounded-lg p-2 outline-none">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
               </select>
             </div>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorRisk)" />
                    <Area type="monotone" dataKey="fraud" stroke="#6366f1" strokeWidth={4} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                 <Clock size={20} className="text-amber-500" /> Recent Reports
               </h3>
               <Link to="/trust/reports" className="text-xs font-black text-indigo-500 hover:underline flex items-center gap-1">
                 View All <ArrowRight size={14} />
               </Link>
             </div>
             <div className="space-y-4">
                {recentReports.map((r) => (
                  <div key={r._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-black">
                          {r.targetType[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 italic">"{r.reason}"</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.targetType}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Quick Actions & Recent History */}
        <div className="space-y-8">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
              <h3 className="text-lg font-black mb-6 relative z-10 flex items-center gap-2">
                <Zap size={20} className="text-amber-400" /> Quick Actions
              </h3>
              <div className="space-y-3 relative z-10">
                 <Link to="/trust/actions" className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all group">
                    <span className="text-sm font-bold">Issue Enforcement</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/trust/kyc" className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all group">
                    <span className="text-sm font-bold">Verify Documents</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/trust/fraud" className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between transition-all group">
                    <span className="text-sm font-bold">Audit Fraud Alerts</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" /> Recent Actions
              </h3>
              <div className="space-y-6">
                 {recentActions.map((a) => (
                   <div key={a._id} className="flex gap-4 relative">
                      <div className="w-0.5 h-full bg-slate-100 absolute left-[19px] top-10"></div>
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 leading-none">{a.type}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold italic line-clamp-1">"{a.reason}"</p>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">{new Date(a.createdAt).toLocaleTimeString()}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
