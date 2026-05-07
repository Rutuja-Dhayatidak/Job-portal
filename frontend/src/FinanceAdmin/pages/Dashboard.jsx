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
import { getDashboard } from '../../services/financeAdminApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingRefunds: 0,
    revenueGrowth: 12.5,
    subscriptionGrowth: 8.2
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Mock data if API fails or for initial UI
      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      // toast.error("Failed to load dashboard stats");
      // Keeping default mock stats for demonstration
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: <IndianRupee className="text-blue-500" />, 
      growth: stats.revenueGrowth,
      color: 'blue'
    },
    { 
      title: 'Active Subscriptions', 
      value: stats.activeSubscriptions, 
      icon: <CreditCard className="text-emerald-500" />, 
      growth: stats.subscriptionGrowth,
      color: 'emerald'
    },
    { 
      title: 'Pending Refunds', 
      value: stats.pendingRefunds, 
      icon: <Undo2 className="text-amber-500" />, 
      growth: -2.4,
      color: 'amber'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finance Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Overview of platform revenue and financial health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 bg-${card.color}-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${card.growth >= 0 ? 'text-emerald-500' : 'text-red-500'} bg-${card.growth >= 0 ? 'emerald' : 'red'}-50 px-2.5 py-1 rounded-full`}>
                {card.growth >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(card.growth)}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400">
           <BarChart3 size={48} className="mb-4 opacity-20" />
           <p className="font-bold uppercase tracking-widest text-[10px]">Revenue Analytics Chart Placeholder</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-slate-400">
           <TrendingUp size={48} className="mb-4 opacity-20" />
           <p className="font-bold uppercase tracking-widest text-[10px]">Subscription Growth Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
