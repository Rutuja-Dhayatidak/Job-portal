import React, { useState, useEffect } from 'react';
import { getFollowUpsList } from '../../services/salesApi';
import { Calendar, Mail, Phone, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FollowUps = () => {
  const navigate = useNavigate();
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowups();
  }, []);

  const fetchFollowups = async () => {
    try {
      const res = await getFollowUpsList();
      if (res.success) {
        setFollowups(res.followups);
      }
    } catch (err) {
      toast.error("Failed to load followups");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Outreach Schedule</h1>
        <p className="text-slate-500 font-medium mt-1">Don't lose traction. Complete scheduled follow-ups and warm-outreach calls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followups.map((lead) => (
          <div key={lead._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {lead.status}
                </span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-950">{lead.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{lead.company || "Enterprise Partner"}</p>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-slate-400" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-slate-400" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/sales/add-lead?id=${lead._id}`)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all text-xs"
            >
              Action Lead
              <ArrowRight size={14} />
            </button>
          </div>
        ))}

        {followups.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <UserCheck size={32} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">No scheduled follow-up outreach</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUps;
