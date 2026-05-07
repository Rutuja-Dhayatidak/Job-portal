import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getStats } from '../services/supportAdmin';
import { 
  LifeBuoy, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  MessageCircle,
  Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
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
    { name: 'Mon', tickets: 20 },
    { name: 'Tue', tickets: 35 },
    { name: 'Wed', tickets: 55 },
    { name: 'Thu', tickets: 40 },
    { name: 'Fri', tickets: 70 },
    { name: 'Sat', tickets: 45 },
    { name: 'Sun', tickets: 60 },
  ];

  const cards = [
    { label: 'Total Tickets', value: stats.total, icon: <LifeBuoy />, color: 'text-slate-900', bg: 'bg-white border-slate-100' },
    { label: 'Open Issues', value: stats.open, icon: <Clock />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'Live Chats', value: 8, icon: <MessageCircle />, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Support Hub" subtitle="Live platform helpdesk monitoring and user care." />
      
      <div className="p-10 space-y-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border ${card.bg} shadow-sm relative overflow-hidden group`}>
                <div className="relative z-10">
                   <div className={`${card.color} mb-4 opacity-80 group-hover:scale-110 transition-transform`}>
                     {React.cloneElement(card.icon, { size: 32 })}
                   </div>
                   <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</h4>
                   <p className="text-3xl font-black text-slate-900">{card.value}</p>
                </div>
                <Zap className="absolute -right-4 -bottom-4 text-slate-900/[0.02] w-24 h-24 rotate-12" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">Ticket Volume</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Weekly Support Audit</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <TrendingUp size={14} /> Efficiency +8%
                   </div>
                </div>
                
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', fontSize: '10px', fontWeight: '900' }}
                        />
                        <Area type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTickets)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-slate-400" /> Recent Actions
                </h3>
                <div className="space-y-6">
                  {[
                    { agent: 'Support_1', action: 'Resolved Ticket', target: '#402', time: '2m ago' },
                    { agent: 'Support_2', action: 'Replied to', target: '#105', time: '15m ago' },
                    { agent: 'System', action: 'Auto-Assign', target: '#991', time: '1h ago' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-slate-100 transition-all border border-slate-100">
                        {act.agent[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 text-xs font-bold">{act.agent} <span className="text-slate-400 font-medium">{act.action}</span></p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{act.target}</p>
                      </div>
                      <span className="text-[10px] font-black text-slate-300">{act.time}</span>
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
