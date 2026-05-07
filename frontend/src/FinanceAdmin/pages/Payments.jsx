import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee
} from 'lucide-react';
import { getPayments } from '../../services/financeAdminApi';
import toast from 'react-hot-toast';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      // Mock data
      setPayments([
        { _id: 'TXN001', employer: 'Google', plan: 'Enterprise', amount: 9999, status: 'completed', date: '2026-05-01', method: 'Razorpay' },
        { _id: 'TXN002', employer: 'Microsoft', plan: 'Professional', amount: 2999, status: 'completed', date: '2026-05-02', method: 'Stripe' },
        { _id: 'TXN003', employer: 'Meta', plan: 'Starter', amount: 999, status: 'pending', date: '2026-05-04', method: 'PayPal' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payments</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor employer transactions and history.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by employer or transaction ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-medium transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-500">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/50">
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Employer</th>
                <th className="px-8 py-5">Plan</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((payment) => (
                <tr key={payment._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">#{payment._id}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{payment.employer}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{payment.plan}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                       <IndianRupee size={14} /> {payment.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    {payment.status === 'completed' ? (
                      <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-wider">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-500 rounded-lg">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
