import React, { useEffect, useState } from 'react';
import { 
  Users, Building2, Briefcase, FileText, 
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  MoreVertical, Bell, Calendar, ChevronDown,
  ArrowUpRight, ArrowDownRight, Search,
  Loader2
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard, getCandidates } from '../../services/superAdminApi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalCompanies: 0, totalJobs: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const [statsRes, candidatesRes] = await Promise.all([
          getDashboard(),
          getCandidates()
        ]);
        
        console.log("Stats Response:", statsRes);
        console.log("Candidates Response:", candidatesRes);

        setStats(statsRes || { totalUsers: 0, totalCompanies: 0, totalJobs: 0 });
        setRecentCandidates(Array.isArray(candidatesRes) ? candidatesRes.slice(0, 5) : []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        toast.error("Failed to fetch live data. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const growthData = [
    { name: 'Apr 28', users: 50 },
    { name: 'Apr 29', users: 80 },
    { name: 'Apr 30', users: 120 },
    { name: 'May 1', users: 110 },
    { name: 'May 2', users: 150 },
    { name: 'May 3', users: 180 },
    { name: 'May 4', users: stats.totalUsers || 0 },
  ];

  const statCards = [
    { title: 'Total Candidate', value: stats.totalUsers, icon: <Users size={20} />, trend: '+12.5%', color: 'text-blue-600', bg: 'bg-blue-50', path: '/super-admin/candidates' },
    { title: 'Total Companies', value: stats.totalCompanies, icon: <Building2 size={20} />, trend: '+8.3%', color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/super-admin/companies' },
    { title: 'Total Jobs', value: stats.totalJobs, icon: <Briefcase size={20} />, trend: '+15.7%', color: 'text-purple-600', bg: 'bg-purple-50', path: '/super-admin/jobs' },
    { title: 'Total Applications', value: '0', icon: <FileText size={20} />, trend: '+0%', color: 'text-orange-600', bg: 'bg-orange-50', path: '/super-admin/applications' },
  ];

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown';
    const now = new Date();
    const then = new Date(dateString);
    const diffInMs = now - then;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Super Admin! 👋</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time platform performance overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-medium text-slate-600">
            <Calendar size={16} />
            <span>May 04, 2025</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Link 
            key={idx} 
            to={stat.path}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={14} /> {stat.trend}
                </span>
                <span className="text-slate-400 text-[10px] font-medium italic">live sync</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Candidate Growth</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800">Recent Activities</h4>
            <Link to="/super-admin/candidates" className="text-xs font-bold text-emerald-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-6">
            {recentCandidates.length > 0 ? recentCandidates.map((candidate, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/super-admin/candidates')}>
                <div className="w-10 h-10 shrink-0 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">Candidate Joined</p>
                  <p className="text-xs text-slate-500 truncate">{candidate.firstName} {candidate.lastName} ({candidate.email})</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {getRelativeTime(candidate.createdAt)}
                </p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                <AlertCircle size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest">No candidates found in DB</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
