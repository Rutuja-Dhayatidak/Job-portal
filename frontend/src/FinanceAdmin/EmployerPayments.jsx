import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { getPayments } from '../services/financeAdminApi';
import toast from 'react-hot-toast';

const EmployerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'All',
    date: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      const data = await getPayments(filters);
      setPayments(data);
    } catch (err) {
      // Mock data for display
      setPayments([
        { _id: '1', employer: 'Google Inc.', plan: 'Enterprise', amount: 49999, status: 'completed', date: '2024-05-12', method: 'Razorpay' },
        { _id: '2', employer: 'Microsoft', plan: 'Professional', amount: 14999, status: 'pending', date: '2024-05-11', method: 'Stripe' },
        { _id: '3', employer: 'Meta Systems', plan: 'Starter', amount: 4999, status: 'failed', date: '2024-05-10', method: 'Razorpay' },
        { _id: '4', employer: 'Netflix', plan: 'Enterprise', amount: 49999, status: 'completed', date: '2024-05-09', method: 'Razorpay' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'failed': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'failed': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employer Payments</h1>
          <p className="text-slate-500 font-medium mt-1">Audit and monitor all transaction activities.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-900/10">
          <Download size={18} /> Export Statement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group min-w-[300px]">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Search by employer name or Transaction ID..." 
               className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-sm"
             />
          </div>
          <select 
            className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-600 text-sm"
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option>All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest px-4">
          <Filter size={16} /> Filters Applied
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employer Detail</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subscription</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
              <th className="px-10 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg">
                      {p.employer[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{p.employer}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: TXN-293049</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8 font-black text-slate-700 text-sm">
                  {p.plan} Plan
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-1 font-black text-slate-900 text-lg tracking-tight">
                    <IndianRupee size={16} /> {p.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-xs font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    {p.method}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${getStatusStyle(p.status)}`}>
                    {getStatusIcon(p.status)}
                    {p.status}
                  </span>
                </td>
                <td className="px-10 py-8 text-xs font-bold text-slate-400">
                  {p.date}
                </td>
                <td className="px-10 py-8 text-right">
                   <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
                     <MoreVertical size={20} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing 1 to 4 of 128 entries</p>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-500 transition-colors"><ChevronLeft size={20}/></button>
          <button className="px-5 py-3 bg-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-blue-500/20">1</button>
          <button className="px-5 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-50 transition-colors">2</button>
          <button className="px-5 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl font-black text-xs hover:bg-slate-50 transition-colors">3</button>
          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-500 transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default EmployerPayments;
