import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Filter, Building2, User, Briefcase, Eye, MoreVertical } from 'lucide-react';
import { getReports } from '../services/trustSafetyApi';

const ReportsFlags = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setReports([
        { _id: '1', targetType: 'user', reason: 'Spamming', status: 'Pending', createdAt: '2024-03-16' },
        { _id: '2', targetType: 'job', reason: 'Fraudulent Content', status: 'Reviewing', createdAt: '2024-03-16' },
        { _id: '3', targetType: 'company', reason: 'Identity Theft', status: 'Pending', createdAt: '2024-03-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'user': return <User size={18} className="text-blue-500" />;
      case 'job': return <Briefcase size={18} className="text-emerald-500" />;
      case 'company': return <Building2 size={18} className="text-indigo-500" />;
      default: return <ShieldAlert size={18} />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports & Flags</h1>
        <p className="text-slate-500 font-medium mt-1">Unified intake for all platform reports.</p>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search reports..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reports.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      {getIcon(r.targetType)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{r.targetType}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-bold text-slate-800 italic">"{r.reason}"</p>
                   <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">{new Date(r.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    r.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                    r.status === 'Reviewing' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-500 rounded-xl transition-all"><Eye size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsFlags;
