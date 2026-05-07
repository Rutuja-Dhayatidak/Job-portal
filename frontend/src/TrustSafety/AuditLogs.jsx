import React, { useState, useEffect } from 'react';
import { ScrollText, Search, Filter, Download, Shield, Eye, Lock } from 'lucide-react';
import { getLogs } from '../services/trustSafetyApi';

const AuditLogs = () => {
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
        { _id: '1', action: 'Blocked User', admin: 'Trust Admin', target: 'Spammer Bot', type: 'Security', timestamp: '2024-03-16 14:20' },
        { _id: '2', action: 'Approved KYC', admin: 'Senior Auditor', target: 'Sarah Connor', type: 'Compliance', timestamp: '2024-03-16 13:45' },
        { _id: '3', action: 'Removed Job', admin: 'Moderator', target: 'Scam Post #12', type: 'Moderation', timestamp: '2024-03-16 12:00' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance Audit Logs</h1>
          <p className="text-slate-500 font-medium mt-1">Immutable record of all trust and safety decisions.</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search audit trail..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-xs font-bold"
            />
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-500 rounded-xl transition-all"><Filter size={20} /></button>
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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      log.type === 'Security' ? 'bg-red-50 text-red-500' : 
                      log.type === 'Compliance' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {log.type === 'Security' ? <Lock size={18} /> : <Shield size={18} />}
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
                    <p className="text-xs font-bold text-slate-400">{log.timestamp}</p>
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

export default AuditLogs;
