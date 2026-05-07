import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getStats } from '../services/moderator';
import { 
  AlertCircle, CheckCircle2, Clock, Users, 
  TrendingUp, Activity, ShieldAlert, Zap 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, activeMods: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Mon', reports: 40 },
    { name: 'Tue', reports: 30 },
    { name: 'Wed', reports: 65 },
    { name: 'Thu', reports: 45 },
    { name: 'Fri', reports: 90 },
    { name: 'Sat', reports: 55 },
    { name: 'Sun', reports: 70 },
  ];

  const cards = [
    { label: 'Total Reports', value: stats.total, icon: <AlertCircle />, color: 'text-zinc-100', bg: 'bg-white/5' },
    { label: 'Pending Cases', value: stats.pending, icon: <Clock />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle2 />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Mods', value: stats.activeMods, icon: <Users />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Safety Overview" subtitle="Real-time platform moderation metrics and health." />
      
      <div className="p-10 space-y-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border border-white/5 ${card.bg} relative overflow-hidden group`}>
                <div className="relative z-10">
                   <div className={`${card.color} mb-4 opacity-80 group-hover:scale-110 transition-transform`}>
                     {React.cloneElement(card.icon, { size: 32 })}
                   </div>
                   <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</h4>
                   <p className="text-3xl font-black text-white">{card.value}</p>
                </div>
                <Zap className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white/5 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-xl font-black text-white mb-1">Reports Frequency</h3>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Weekly Activity Audit</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/10">
                      <TrendingUp size={14} /> +12.5% Inc.
                   </div>
                </div>
                
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                        <YAxis stroke="#52525b" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#09090b', border: '1px solid #ffffff10', borderRadius: '1rem', fontSize: '10px', fontWeight: '900' }}
                        />
                        <Area type="monotone" dataKey="reports" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#colorReports)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex-1">
                <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-zinc-500" /> Recent Activity
                </h3>
                <div className="space-y-6">
                  {[
                    { mod: 'Alex', action: 'Banned User', target: 'ID: 402', time: '2m ago' },
                    { mod: 'Sarah', action: 'Approved Job', target: 'ID: 105', time: '15m ago' },
                    { mod: 'System', action: 'Auto-Flag', target: 'ID: 991', time: '1h ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-zinc-400 group-hover:bg-zinc-800 transition-all">
                        {act.mod[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-zinc-100 text-xs font-bold">{act.mod} <span className="text-zinc-500 font-medium">{act.action}</span></p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{act.target}</p>
                      </div>
                      <span className="text-[10px] font-black text-zinc-700">{act.time}</span>
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
