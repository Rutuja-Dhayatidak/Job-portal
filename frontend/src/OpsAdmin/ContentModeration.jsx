import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldX, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { getModeration, approveContent, rejectContent } from '../services/opsAdminApi';
import toast from 'react-hot-toast';

const ContentModeration = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const data = await getModeration();
      setPendingItems(data);
    } catch (err) {
      setPendingItems([
        { _id: '1', title: 'Earn $5000/week from home!', employer: { firstName: 'Sus Company' }, reason: 'Possible Spam', createdAt: '2024-03-10' },
        { _id: '2', title: 'Data Scientist', employer: { firstName: 'Valid Corp' }, reason: 'New Registration', createdAt: '2024-03-11' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveContent(id);
      toast.success("Content approved");
      fetchPending();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectContent(id);
      toast.error("Content rejected");
      fetchPending();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Moderation</h1>
        <p className="text-slate-500 font-medium mt-1">Review pending content and filter spam.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-black text-amber-900">Spam Protection Active</h4>
          <p className="text-sm text-amber-700 font-medium mt-1">Our AI has flagged {pendingItems.length} items for manual review. Please check them carefully before approving.</p>
        </div>
      </div>

      <div className="space-y-4">
        {pendingItems.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6 hover:border-emerald-200 transition-all">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black">
                <Info size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400">By {item.employer.firstName}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest">{item.reason}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleApprove(item._id)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <CheckCircle size={18} /> Approve
              </button>
              <button 
                onClick={() => handleReject(item._id)}
                className="px-6 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModeration;
