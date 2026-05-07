import React, { useState, useEffect } from 'react';
import { Ban, Bell, ShieldAlert, History, UserX, Clock, ShieldCheck, MoreVertical, Search } from 'lucide-react';
import { takeAction, getActionHistory } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const EnforcementActions = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ targetId: '', targetType: 'user', type: 'Warn', reason: '', duration: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getActionHistory();
      setHistory(data);
    } catch (err) {
      setHistory([
        { _id: '1', type: 'Block', targetType: 'user', adminId: { firstName: 'Trust Admin' }, reason: 'Fraud', createdAt: '2024-03-16' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await takeAction(formData);
      toast.success(`${formData.type} action applied!`);
      fetchHistory();
    } catch (err) {
      toast.error("Failed to apply action");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enforcement Actions</h1>
          <p className="text-slate-500 font-medium mt-1">Tiered disciplinary measures for platform participants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Action Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit sticky top-28">
           <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
             <ShieldAlert size={20} className="text-indigo-500" /> Issue New Action
           </h3>
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target ID</label>
                <input 
                  type="text" 
                  placeholder="Paste User/Job ID..."
                  value={formData.targetId}
                  onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none"
                  >
                    <option value="Warn">Warn</option>
                    <option value="Suspend">Suspend</option>
                    <option value="Block">Block</option>
                    <option value="Restrict">Restrict</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <input 
                    type="text" 
                    placeholder="7 Days..."
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Reason</label>
                <textarea 
                  rows="4"
                  placeholder="Explain violation..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold resize-none"
                  required
                />
              </div>

              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-indigo-500/20">
                Execute Action
              </button>
           </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
             <History size={20} className="text-slate-400" /> Recent Actions History
           </h3>
           <div className="space-y-4">
              {history.map((h) => (
                <div key={h._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:border-red-100 transition-all group">
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                        h.type === 'Block' ? 'bg-red-50 text-red-500' : 
                        h.type === 'Suspend' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                      }`}>
                        {h.type === 'Block' ? <UserX size={24} /> : h.type === 'Warn' ? <Bell size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">{h.type} Action</h4>
                        <p className="text-xs font-bold text-slate-400 mt-1 italic">"{h.reason}"</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-slate-900">Admin: {h.adminId?.firstName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{new Date(h.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EnforcementActions;
