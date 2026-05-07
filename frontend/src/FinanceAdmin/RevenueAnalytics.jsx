import React, { useState } from 'react';
import { 
  Calendar, 
  Filter, 
  Download, 
  TrendingUp, 
  ArrowUpRight, 
  IndianRupee,
  BarChart,
  Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar
} from 'recharts';

const RevenueAnalytics = () => {
  const [timeframe, setTimeframe] = useState('Monthly');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const analyticsData = [
    { name: 'Mon', revenue: 45000, users: 12 },
    { name: 'Tue', revenue: 52000, users: 15 },
    { name: 'Wed', revenue: 38000, users: 10 },
    { name: 'Thu', revenue: 65000, users: 20 },
    { name: 'Fri', revenue: 48000, users: 14 },
    { name: 'Sat', revenue: 25000, users: 8 },
    { name: 'Sun', revenue: 30000, users: 9 },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Revenue Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Deep dive into platform earnings and financial trends.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
          {['Daily', 'Weekly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-8 py-3 rounded-[1.5rem] text-xs font-black transition-all ${
                timeframe === tab 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="date" 
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-600 text-xs"
            />
          </div>
          <span className="text-slate-300 font-black">to</span>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="date" 
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-600 text-xs"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs hover:bg-blue-100 transition-all">
            <Filter size={16} /> Apply Filters
          </button>
        </div>

        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs hover:bg-black transition-all shadow-xl shadow-slate-900/10">
          <Download size={18} /> Export Analytics
        </button>
      </div>

      {/* Analytics Main View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Metric Summaries */}
        <div className="lg:col-span-1 space-y-6">
           {[
             { label: 'Avg. Daily Revenue', value: '₹42,500', growth: '+12%', icon: <IndianRupee size={20}/>, color: 'blue' },
             { label: 'Conversion Rate', value: '3.4%', growth: '+0.5%', icon: <Activity size={20}/>, color: 'emerald' },
             { label: 'Total Transactions', value: '1,280', growth: '+24%', icon: <TrendingUp size={20}/>, color: 'purple' },
           ].map((metric, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-blue-100 transition-colors">
               <div className={`w-12 h-12 bg-${metric.color}-50 text-${metric.color}-500 rounded-xl flex items-center justify-center mb-6`}>
                 {metric.icon}
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
               <div className="flex items-baseline justify-between mt-2">
                 <h4 className="text-2xl font-black text-slate-900">{metric.value}</h4>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{metric.growth}</span>
               </div>
             </div>
           ))}
        </div>

        {/* Large Chart Area */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
          <div className="mb-10">
            <h3 className="text-xl font-black text-slate-900">Revenue Growth Patterns</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparing {timeframe.toLowerCase()} streams</p>
          </div>
          
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', padding: '12px'}}
                  cursor={{stroke: '#3b82f6', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
