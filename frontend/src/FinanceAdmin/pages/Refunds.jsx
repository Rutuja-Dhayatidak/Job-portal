import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MessageSquare,
  User,
  IndianRupee,
  Search,
  Filter
} from 'lucide-react';
import { getRefunds, approveRefund, rejectRefund } from '../../services/financeAdminApi';
import toast from 'react-hot-toast';

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const data = await getRefunds();
      setRefunds(data);
    } catch (err) {
      // Mock data
      setRefunds([
        { _id: 'REF001', employer: 'SpaceX', amount: 999, reason: 'Accidental purchase', status: 'pending', date: '2026-05-04' },
        { _id: 'REF002', employer: 'Netflix', amount: 2999, reason: 'Duplicate transaction', status: 'pending', date: '2026-05-03' },
        { _id: 'REF003', employer: 'Apple', amount: 9999, reason: 'Service not as described', status: 'approved', date: '2026-05-01' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this refund?")) return;
    try {
      await approveRefund(id);
      toast.success("Refund approved");
      fetchRefunds();
    } catch (err) {
      toast.error("Failed to approve refund");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await rejectRefund(id, reason);
      toast.success("Refund rejected");
      fetchRefunds();
    } catch (err) {
      toast.error("Failed to reject refund");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Refund Requests</h1>
        <p className="text-slate-500 font-medium mt-1">Review and process employer refund claims.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by employer or ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-medium transition-all"
            />
          </div>
          <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-500">
            <Filter size={20} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 gap-6">
          {refunds.map((refund) => (
            <div key={refund._id} className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all hover:border-blue-200">
              <div className="flex gap-6 items-start">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  refund.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                  refund.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {refund.status === 'pending' ? <Clock size={32} /> : 
                   refund.status === 'approved' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{refund._id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      refund.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      refund.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {refund.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{refund.employer}</h3>
                  <div className="flex items-center gap-6">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <IndianRupee size={16} /> {refund.amount.toLocaleString()}
                    </p>
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <MessageSquare size={16} /> {refund.reason}
                    </p>
                  </div>
                </div>
              </div>

              {refund.status === 'pending' && (
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleReject(refund._id)}
                    className="px-6 py-3 bg-white text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-all shadow-sm"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(refund._id)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Approve Refund
                  </button>
                </div>
              )}
              
              {refund.status !== 'pending' && (
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Processed Date</p>
                   <p className="text-sm font-black text-slate-900">{new Date(refund.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Refunds;
