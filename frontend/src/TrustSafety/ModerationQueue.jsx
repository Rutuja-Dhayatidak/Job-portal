import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ShieldAlert, MoreVertical, Filter, Search } from 'lucide-react';
import { getModerationQueue, approveContent, rejectContent, escalateReport } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const ModerationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await getModerationQueue();
      setQueue(data);
    } catch (err) {
      setQueue([
        { _id: '1', reportId: { targetType: 'job', reason: 'Spam' }, riskLevel: 'High', status: 'Pending' },
        { _id: '2', reportId: { targetType: 'user', reason: 'Abuse' }, riskLevel: 'Critical', status: 'Escalated' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await approveContent(id);
      if (action === 'reject') await rejectContent(id, "Community Guidelines Violation");
      if (action === 'escalate') await escalateReport(id);
      
      toast.success(`Action: ${action.toUpperCase()} successful`);
      fetchQueue();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Moderation Queue</h1>
        <p className="text-slate-500 font-medium mt-1">Process pending reports based on risk priority.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6 hover:shadow-xl transition-all">
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                item.riskLevel === 'Critical' ? 'bg-red-100 text-red-600' : 
                item.riskLevel === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900 capitalize">{item.reportId?.targetType} Report</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    item.riskLevel === 'Critical' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                    item.riskLevel === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.riskLevel} Risk
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-400 mt-1 italic">"{item.reportId?.reason}"</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(item._id, 'approve')}
                className="p-3 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                title="Approve Content"
              >
                <CheckCircle size={20} />
              </button>
              <button 
                onClick={() => handleAction(item._id, 'reject')}
                className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                title="Reject Content"
              >
                <XCircle size={20} />
              </button>
              <button 
                onClick={() => handleAction(item._id, 'escalate')}
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all"
              >
                Escalate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModerationQueue;
