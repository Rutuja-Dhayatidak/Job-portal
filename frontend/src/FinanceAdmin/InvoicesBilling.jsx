import React from 'react';
import { 
  FileText, 
  Download, 
  IndianRupee, 
  Clock, 
  CheckCircle2,
  Search,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

const InvoicesBilling = () => {
  const invoices = [
    { id: 'INV-2024-881', employer: 'Google India', amount: 9999, gst: 1800, total: 11799, date: '2024-05-01', status: 'Paid', gstNo: '07AAAAA0000A1Z5' },
    { id: 'INV-2024-882', employer: 'Microsoft Corp', amount: 2999, gst: 540, total: 3539, date: '2024-05-02', status: 'Pending', gstNo: '29BBBBB1111B2Z6' },
    { id: 'INV-2024-883', employer: 'Meta Platforms', amount: 999, gst: 180, total: 1179, date: '2024-05-04', status: 'Paid', gstNo: '27CCCCC2222C3Z7' },
  ];

  const handleDownload = (id) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Generating PDF for ${id}...`,
        success: `Invoice ${id} downloaded!`,
        error: 'Generation failed.',
      }
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Invoices & Billing</h1>
          <p className="text-slate-500 font-medium mt-1">Manage employer tax invoices and billing history.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Billed (MTD)</span>
              <span className="text-sm font-black text-slate-900">₹1,24,500</span>
           </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-md">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
           <input 
             type="text" 
             placeholder="Search by Invoice ID or Employer Name..." 
             className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-sm"
           />
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
          <FileText size={18} /> Batch Generate Invoices
        </button>
      </div>

      {/* Invoices List */}
      <div className="grid grid-cols-1 gap-6">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left: ID & Date */}
            <div className="flex flex-col items-center lg:items-start min-w-[150px]">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  <Hash size={12} /> Invoice ID
               </div>
               <h4 className="text-lg font-black text-slate-900 font-mono tracking-tight">{inv.id}</h4>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-2">
                  <Calendar size={12} /> {inv.date}
               </div>
            </div>

            {/* Middle: Employer Info */}
            <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full lg:w-auto">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                     <Building2 size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg">{inv.employer}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GSTIN: {inv.gstNo}</p>
                  </div>
               </div>

               <div className="flex flex-wrap justify-center lg:justify-start gap-12">
                  <div className="text-center lg:text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Amount</p>
                     <p className="font-black text-slate-700">₹{inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-center lg:text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GST (18%)</p>
                     <p className="font-black text-slate-700">₹{inv.gst.toLocaleString()}</p>
                  </div>
                  <div className="text-center lg:text-left">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Payable</p>
                     <p className="text-xl font-black text-slate-900 tracking-tight">₹{inv.total.toLocaleString()}</p>
                  </div>
               </div>
            </div>

            {/* Right: Status & Action */}
            <div className="flex items-center gap-6">
               <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                 inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
               }`}>
                 {inv.status === 'Paid' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                 {inv.status}
               </span>
               
               <button 
                 onClick={() => handleDownload(inv.id)}
                 className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-inner group/dl"
               >
                 <Download size={24} className="group-hover/dl:scale-110 transition-transform" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesBilling;
