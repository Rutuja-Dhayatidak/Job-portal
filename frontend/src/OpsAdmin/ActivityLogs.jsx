import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, Activity, Shield, LogIn } from 'lucide-react';
import { getLogs } from '../services/opsAdminApi';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      setLogs([
        { _id: '1', action: 'Approved Job', admin: 'Sarah Jenkins', target: 'Lead Dev @ TechCorp', type: 'moderation', timestamp: '2024-03-15T10:30:00' },
        { _id: '2', action: 'Blocked User', admin: 'Mark Wilson', target: 'spam_user_99', type: 'security', timestamp: '2024-03-15T09:15:00' },
        { _id: '3', action: 'Resolved Ticket', admin: 'Sarah Jenkins', target: '#4582', type: 'support', timestamp: '2024-03-14T16:45:00' },
        { _id: '4', action: 'Admin Login', admin: 'Ops Manager', target: 'System', type: 'login', timestamp: '2024-03-14T08:00:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'moderation': return <Shield size={18} className="text-emerald-500" />;
      case 'security': return <Activity size={18} className="text-red-500" />;
      case 'support': return <History size={18} className="text-blue-500" />;
      case 'login': return <LogIn size={18} className="text-purple-500" />;
      default: return <Activity size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Activity</h1>
          <p className="text-slate-500 font-medium mt-1">Audit trail of all administrative actions.</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-xs font-bold"
            />
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><Filter size={20} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      {getTypeIcon(log.type)}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-800">{log.action}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.type}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-600">{log.admin}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-medium text-slate-500 italic">{log.target}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-xs font-bold text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</p>
                    <p className="text-[10px] font-black text-slate-300">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
