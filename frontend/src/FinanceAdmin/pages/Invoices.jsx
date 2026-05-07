import React from 'react';
import { FileText, Download, IndianRupee, Clock, CheckCircle2 } from 'lucide-react';

const Invoices = () => {
  const invoices = [
    { id: 'INV-2024-001', employer: 'Google', amount: 9999, date: '2024-05-01', status: 'Paid' },
    { id: 'INV-2024-002', employer: 'Microsoft', amount: 2999, date: '2024-05-02', status: 'Pending' },
    { id: 'INV-2024-003', employer: 'Meta', amount: 999, date: '2024-05-04', status: 'Paid' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Invoices & Billing</h1>
        <p className="text-slate-500 font-medium mt-1">Manage employer invoices and billing history.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-8 py-5">Invoice ID</th>
              <th className="px-8 py-5">Employer</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">{inv.id}</td>
                <td className="px-8 py-6 font-black text-slate-900 text-sm">{inv.employer}</td>
                <td className="px-8 py-6 font-black text-slate-900 text-sm flex items-center gap-1">
                  <IndianRupee size={14} /> {inv.amount.toLocaleString()}
                </td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400">{inv.date}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {inv.status === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-300 hover:text-blue-500 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
