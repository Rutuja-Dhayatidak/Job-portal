import React, { useEffect, useState } from 'react';
import { getCandidates, overrideCandidate, getCandidateHistory } from '../../services/superAdminApi';
import { 
  Loader2, ShieldAlert, ShieldCheck, Search, 
  History, User, Clock, Info, X, ChevronRight,
  ShieldX, UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Candidates = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Override Modal State
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [overrideData, setOverrideData] = useState({ reason: '', action: '' });

  const fetchUsers = async () => {
    try {
      const data = await getCandidates();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openHistory = async (user) => {
    setSelectedUser(user);
    try {
      const data = await getCandidateHistory(user._id);
      setHistory(data);
      setIsHistoryModalOpen(true);
    } catch (err) {
      toast.error("Failed to fetch history");
    }
  };

  const openOverride = (user) => {
    setSelectedUser(user);
    setOverrideData({ 
      action: user.status === 'blocked' ? 'UNBLOCK' : 'BLOCK', 
      reason: '' 
    });
    setIsOverrideModalOpen(true);
  };

  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    if (!overrideData.reason.trim()) return toast.error("Reason is mandatory");

    setIsSubmitting(true);
    try {
      await overrideCandidate(selectedUser._id, overrideData.action, overrideData.reason);
      toast.success(`User successfully ${overrideData.action.toLowerCase()}ed`);
      setIsOverrideModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Override failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
            <User className="text-indigo-600" size={32} />
            User Management
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Super Admin Level Control</p>
        </div>
        <div className="relative group w-full md:w-64">
           <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
           <input type="text" placeholder="Filter by name..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold text-xs" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                <th className="p-6">Candidate Details</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center">
                      {(user.isBlocked || user.status === 'blocked') ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-red-100">
                          <ShieldAlert size={12} /> Account Blocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-emerald-100">
                          <ShieldCheck size={12} /> Active Access
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openHistory(user)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-slate-100 rounded-2xl transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                        title="View Admin History"
                      >
                        <History size={20} />
                      </button>
                      <button 
                        onClick={() => openOverride(user)}
                        className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-lg ${
                          (user.isBlocked || user.status === 'blocked')
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/20'
                        }`}
                      >
                        {(user.isBlocked || user.status === 'blocked') ? "Force Unblock" : "Force Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <div className="p-20 text-center text-slate-300 font-black uppercase text-xs tracking-[0.2em]">No Candidates in Registry</div>}
      </div>

      {/* History Timeline Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95">
            <div className="p-8 bg-slate-900 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tight">Administrative History</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">User: {selectedUser?.email}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all border border-white/10">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 max-h-[60vh] overflow-y-auto space-y-8 custom-scrollbar">
              {history.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300"><Info size={32}/></div>
                  <p className="text-slate-400 font-bold italic">No administrative actions have been recorded for this user yet.</p>
                </div>
              ) : (
                <div className="relative space-y-12 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {history.map((item, index) => (
                    <div key={index} className="relative pl-16 group">
                      <div className={`absolute left-0 top-1 w-12 h-12 rounded-2xl border-4 border-white flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110 ${
                        item.action === 'BLOCK' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.action === 'BLOCK' ? <ShieldX size={20}/> : <UserCheck size={20}/>}
                      </div>
                      
                      <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group-hover:border-indigo-100 transition-all group-hover:bg-white group-hover:shadow-xl group-hover:shadow-indigo-500/5">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.adminName}</p>
                              <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">{item.role}</p>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock size={12}/>
                              <span className="text-[10px] font-bold uppercase">{format(new Date(item.createdAt), 'MMM dd, HH:mm')}</span>
                           </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200/50">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Confidential Reason</p>
                           <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{item.reason}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {isOverrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 flex items-center gap-2 italic uppercase tracking-tight">
                Status Override
              </h3>
              <button onClick={() => setIsOverrideModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="p-8 space-y-6">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-3">
                <Info className="text-indigo-500 shrink-0" size={20} />
                <p className="text-[11px] text-indigo-700 leading-relaxed font-bold italic">
                  SUPER ADMIN OVERRIDE: Providing a clear reason is mandatory. This note will be visible ONLY to Platform Admins.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Override Justification
                </label>
                <textarea 
                  required
                  value={overrideData.reason}
                  onChange={(e) => setOverrideData({...overrideData, reason: e.target.value})}
                  placeholder="Explain why you are overriding the previous administrative action..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[120px] text-sm font-bold"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !overrideData.reason.trim()}
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl disabled:opacity-50 ${
                  overrideData.action === 'UNBLOCK' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                }`}
              >
                {isSubmitting ? "Executing Override..." : `Confirm ${overrideData.action} Override`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
