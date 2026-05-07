import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getReports, reviewReport, banUser, warnUser } from '../services/moderator';
import { Flag, MoreVertical, ShieldAlert, CheckCircle, XCircle, AlertTriangle, UserMinus, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await reviewReport(id, { status, notes: "Processed by moderator" });
      toast.success(`Report ${status}`);
      fetchReports();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'ban') await banUser(userId);
      if (action === 'warn') await warnUser(userId, "Violating community standards");
      toast.success(`User ${action === 'ban' ? 'Banned' : 'Warned'}`);
    } catch (err) {
      toast.error("User action failed");
    }
  };

  const filteredReports = reports.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="flex-1">
      <Header title="Reports & Flags" subtitle="Manage user-reported content and platform violations." />
      
      <div className="p-10 space-y-8">
          <div className="flex items-center gap-4">
            {['Pending', 'Under Review', 'Resolved', 'Rejected', 'All'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-white text-zinc-900 shadow-xl shadow-white/10' 
                    : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
             {filteredReports.map((report) => (
               <div key={report._id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        report.type === 'job' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {report.type === 'job' ? <Briefcase size={24} /> : <User size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-black text-lg">Report #{report._id.slice(-6)}</h3>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                            report.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium max-w-xl">{report.reason}</p>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                        <MessageSquare size={14} className="text-zinc-500" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Context Available</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAction(report._id, 'Resolved')}
                        className="p-3 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/10"
                        title="Approve Report"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleAction(report._id, 'Rejected')}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                        title="Reject Report"
                      >
                        <XCircle size={18} />
                      </button>
                      
                      <div className="w-[1px] h-10 bg-white/5 mx-2" />
                      
                      <button 
                        onClick={() => handleUserAction(report.targetId, 'warn')}
                        className="px-6 py-3 bg-white/5 hover:bg-white text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all text-white border border-white/10"
                      >
                        WARN USER
                      </button>
                      <button 
                        onClick={() => handleUserAction(report.targetId, 'ban')}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                      >
                        BAN USER
                      </button>
                    </div>
                  </div>
               </div>
             ))}
             {filteredReports.length === 0 && (
               <div className="py-20 text-center text-zinc-600 space-y-4">
                  <Flag className="mx-auto opacity-10" size={80} />
                  <p className="text-xs font-black uppercase tracking-widest">No reports in this category</p>
               </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default Reports;
