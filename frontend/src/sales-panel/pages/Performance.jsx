import React from 'react';
import { Award, TrendingUp, Compass, Star, Trophy, ArrowUpRight } from 'lucide-react';

const Performance = () => {
  const metrics = [
    { title: "Conversion Ratio", value: "34.5%", desc: "Ratio of Won leads vs New leads", icon: TrendingUp, color: "text-violet-600 bg-violet-50" },
    { title: "Average Deal Cycle", value: "12 Days", desc: "Average duration to win a lead", icon: Compass, color: "text-amber-600 bg-amber-50" },
    { title: "Customer Satisfaction", value: "4.9 / 5", desc: "Corporate CSAT feedback score", icon: Star, color: "text-emerald-600 bg-emerald-50" }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Performance</h1>
        <p className="text-slate-500 font-medium mt-1">Review active conversion metrics and agent achievements parameters.</p>
      </div>

      {/* Hero Badge */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[60px]"></div>
        <div className="space-y-3 relative z-10">
          <span className="px-3 py-1.5 bg-violet-500/20 text-violet-300 text-[10px] font-black uppercase tracking-wider rounded-lg border border-violet-500/20">
            Current Rank: #2 Active Rep
          </span>
          <h3 className="text-2xl font-black tracking-tight">Enterprise Elite Platinum Level</h3>
          <p className="text-slate-300 text-xs font-semibold max-w-sm">Congratulations! You are on track to unlock highest-tier commissions multiplier this week.</p>
        </div>
        <div className="p-4 bg-violet-600 text-white rounded-3xl shadow-lg shadow-violet-500/20 shrink-0 hidden sm:block">
          <Trophy size={40} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.title} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-44">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.title}</span>
                <h4 className="text-2xl font-black text-slate-950">{m.value}</h4>
              </div>
              <div className={`p-2.5 rounded-xl ${m.color}`}>
                <m.icon size={18} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold border-t border-slate-50 pt-3">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
