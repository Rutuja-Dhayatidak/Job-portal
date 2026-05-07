import React, { useState, useEffect } from 'react';
import { FileCheck, ShieldCheck, ShieldX, Eye, Search, Filter } from 'lucide-react';
import { getModeration } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const ContentModeration = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModeration();
  }, []);

  const fetchModeration = async () => {
    try {
      const data = await getModeration();
      setItems(data);
    } catch (err) {
      setItems([
        { _id: '1', title: 'Data Entry Expert', user: 'Mark S.', type: 'Job Post', status: 'Pending', createdAt: '2024-03-16' },
        { _id: '2', title: 'Profile Verification', user: 'Linda W.', type: 'User Profile', status: 'Pending', createdAt: '2024-03-16' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id, type) => {
    toast.success(`Content ${type} successful`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Content Moderation</h1>
        <p className="text-slate-500 font-medium mt-1">Review and approve new content submissions.</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6 hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-6 flex-1">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center font-black">
                <FileCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400">By {item.user}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-500 rounded-xl transition-all"><Eye size={20} /></button>
              <button 
                onClick={() => handleAction(item._id, 'Approved')}
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <ShieldCheck size={18} /> Approve
              </button>
              <button 
                onClick={() => handleAction(item._id, 'Rejected')}
                className="px-6 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <ShieldX size={18} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentModeration;
