import React, { useState, useEffect } from 'react';
import { ShieldAlert, MoreVertical, Ban, Bell, CheckCircle, Search, Filter } from 'lucide-react';
import { getReportedUsers } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const ReportedUsers = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReportedUsers();
      setReports(data);
    } catch (err) {
      setReports([
        { _id: '1', name: 'Scammer Bot', email: 'spam@bot.com', reason: 'Spamming', status: 'Pending', createdAt: '2024-03-15' },
        { _id: '2', name: 'Toxic User', email: 'toxic@web.com', reason: 'Harassment', status: 'Under Review', createdAt: '2024-03-16' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id, type) => {
    toast.success(`User ${type} successful`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reported Users</h1>
        <p className="text-slate-500 font-medium mt-1">Review and manage user conduct reports.</p>
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
        <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reports.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-400">{r.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg italic">
                    "{r.reason}"
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleAction(r._id, 'Blocked')}
                      className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      title="Block User"
                    >
                      <Ban size={18} />
                    </button>
                    <button 
                      onClick={() => handleAction(r._id, 'Warned')}
                      className="p-2.5 bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all"
                      title="Send Warning"
                    >
                      <Bell size={18} />
                    </button>
                    <button 
                      onClick={() => handleAction(r._id, 'Dismissed')}
                      className="p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                      title="Ignore Report"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportedUsers;
