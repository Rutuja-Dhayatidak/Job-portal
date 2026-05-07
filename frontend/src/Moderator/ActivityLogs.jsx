import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getLogs } from '../services/moderator';
import { History, Shield, Zap, Search, Clock, Calendar, Filter } from 'lucide-react';

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <Header title="Audit Trail" subtitle="Complete immutable history of platform moderation actions." />
      
      <div className="p-10 space-y-8">
          <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <History size={16} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Audit Log</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search audit events..." 
                      className="bg-black/20 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-indigo-500/50 transition-all w-64"
                    />
                 </div>
                 <button className="p-2 bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all border border-white/5">
                    <Filter size={14} />
                 </button>
              </div>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Moderator</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Action</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Target</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-400">
                                {log.moderatorEmail ? log.moderatorEmail[0].toUpperCase() : 'M'}
                              </div>
                              <span className="text-xs font-bold text-white">{log.moderatorEmail}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <Shield size={14} className="text-indigo-500" />
                              <span className="text-[10px] font-black text-zinc-100 uppercase tracking-widest">{log.action}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-bold text-zinc-500 font-mono bg-black/20 px-2 py-1 rounded">
                             {log.targetId}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-zinc-600">
                              <Clock size={12} />
                              <span className="text-[10px] font-bold">{new Date(log.createdAt).toLocaleString()}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
