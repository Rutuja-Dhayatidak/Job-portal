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
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { getRefunds, approveRefund, rejectRefund } from '../services/financeAdminApi';
import toast from 'react-hot-toast';

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
        { _id: '1', employer: 'SpaceX', amount: 9999, reason: 'Duplicate transaction', status: 'pending', date: '2024-05-12' },
        { _id: '2', employer: 'Tesla', amount: 499, reason: 'Plan mismatch', status: 'approved', date: '2024-05-10' },
        { _id: '3', employer: 'Blue Origin', amount: 2500, reason: 'Service not delivered', status: 'rejected', date: '2024-05-08' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Approve this refund? Funds will be reversed to the employer's original payment method.")) {
      try {
        await approveRefund(id);
        toast.success("Refund approved successfully");
        fetchRefunds();
      } catch (err) {
        toast.error("Failed to approve refund");
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return toast.error("Please provide a reason for rejection");
    try {
      await rejectRefund(selectedRefund._id, rejectionReason);
      toast.success("Refund request rejected");
      setSelectedRefund(null);
      setRejectionReason('');
      fetchRefunds();
    } catch (err) {
      toast.error("Failed to reject refund");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Refund Management</h1>
          <p className="text-slate-500 font-medium mt-1">Review and process employer refund claims.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 text-amber-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-amber-100">
          <AlertCircle size={16} /> 12 Pending Reviews
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Claimant / Employer</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reason</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {refunds.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/30 transition-all group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                       <User size={18} />
                    </div>
                    <span className="font-black text-slate-900">{r.employer}</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-1 font-black text-slate-900 text-lg">
                    <IndianRupee size={16} /> {r.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2 text-slate-500 font-medium max-w-[200px]">
                    <MessageSquare size={14} className="shrink-0 opacity-50" />
                    <span className="truncate italic">"{r.reason}"</span>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                     r.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                     r.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                   }`}>
                     {r.status === 'approved' ? <CheckCircle2 size={14} /> : 
                      r.status === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                     {r.status}
                   </span>
                </td>
                <td className="px-10 py-8 text-xs font-bold text-slate-400">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="px-10 py-8 text-right">
                  {r.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleApprove(r._id)}
                         className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-inner"
                       >
                         Approve
                       </button>
                       <button 
                         onClick={() => setSelectedRefund(r)}
                         className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-inner"
                       >
                         Reject
                       </button>
                    </div>
                  ) : (
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 bg-red-600 text-white">
                <h3 className="text-2xl font-black">Reject Refund Claim</h3>
                <p className="text-red-100 text-sm mt-1">Please provide a valid reasoning for transparency.</p>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rejection Reason</label>
                   <textarea 
                     value={rejectionReason}
                     onChange={(e) => setRejectionReason(e.target.value)}
                     placeholder="e.g. Services already utilized, Request past deadline..."
                     className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-red-500 transition-all font-bold text-sm min-h-[120px]"
                   />
                </div>
                <div className="flex gap-4">
                   <button 
                     onClick={() => setSelectedRefund(null)}
                     className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleReject}
                     className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                   >
                     Confirm Rejection
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundManagement;
