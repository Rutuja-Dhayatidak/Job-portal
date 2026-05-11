import React, { useState, useEffect } from 'react';
import { getSalesDashboard } from '../../services/salesApi';
import { Target as TargetIcon, Award, ShieldAlert, Sparkles, TrendingUp, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const Target = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getSalesDashboard();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      toast.error("Failed to load targets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const volume = stats?.totalSalesVolume || 0;
  const quota = stats?.targetQuota || 500000;
  const progress = stats?.targetProgress || 0;

  const milestones = [
    { name: "Bronze Target", value: 100000, desc: "Unlock basic monthly commission multiplier", reached: volume >= 100000 },
    { name: "Silver Milestone", value: 250000, desc: "Unlock mid-tier bonus perks & extra travel allowance", reached: volume >= 250000 },
    { name: "Gold Target (Quota)", value: 500000, desc: "Unlock 100% full commission payout & leadership points", reached: volume >= 500000 },
    { name: "Elite Club Status", value: 1000000, desc: "Unlock exclusive executive bonuses & annual award", reached: volume >= 1000000 }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Targets</h1>
        <p className="text-slate-500 font-medium mt-1">Track monthly conversion metrics and check eligibility for bonuses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large progress meter */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4 min-h-[300px]">
          <div className="p-4 bg-violet-50 text-violet-600 rounded-3xl">
            <TargetIcon size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-900">{progress}%</h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Target Achievement</p>
          </div>
          <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100 mt-2">
            <div className="bg-violet-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Quota details */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Current Sales Volume Progress</h3>
            <p className="text-xs text-slate-400 font-semibold">Track real-time closed deals value against monthly agency targets.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Active Quota</span>
              <h4 className="text-lg font-bold text-slate-900">₹{quota.toLocaleString('en-IN')}</h4>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/30 space-y-1">
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">Achieved Revenue</span>
              <h4 className="text-lg font-bold text-emerald-700">₹{volume.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100/30 text-xs font-semibold text-amber-700">
            <Sparkles size={16} className="shrink-0 mt-0.5" />
            <span>Beat 100% of your target parameters to enter the Elite Platinum Sales Club this month!</span>
          </div>
        </div>
      </div>

      {/* Milestones timeline check-list */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Compass className="text-slate-500" size={18} />
          Bonus Milestones Checklist
        </h3>

        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.name} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
              milestone.reached ? "bg-emerald-50/30 border-emerald-100" : "bg-white border-slate-100"
            }`}>
              <div className="space-y-1 min-w-0">
                <h4 className={`text-sm font-bold ${milestone.reached ? "text-emerald-700" : "text-slate-900"}`}>
                  {milestone.name}
                </h4>
                <p className="text-xs text-slate-400 font-semibold truncate">{milestone.desc}</p>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-black tracking-widest uppercase block ${
                  milestone.reached ? "text-emerald-600" : "text-slate-400"
                }`}>
                  {milestone.reached ? "Claimed / Reached" : "Pending"}
                </span>
                <span className="text-xs font-bold text-slate-500 block mt-0.5">₹{milestone.value.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Target;
