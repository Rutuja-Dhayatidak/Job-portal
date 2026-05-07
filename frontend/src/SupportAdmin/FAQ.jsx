import React from 'react';
import Header from './components/Header';
import { HelpCircle, Plus } from 'lucide-react';

const FAQ = () => {
  return (
    <div className="flex-1">
      <Header title="Knowledge Base" subtitle="Manage and curate platform FAQs and help articles." />
      <div className="p-10 space-y-10">
         <div className="flex items-center justify-between">
            <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">Article Manager</h3>
            <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
               <Plus size={18} /> Create New Article
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "Account Security",
              "Payment Issues",
              "Job Posting Rules",
              "Profile Verification"
            ].map((cat, i) => (
              <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3rem] hover:border-indigo-100 transition-all group shadow-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                       <HelpCircle size={24} />
                    </div>
                    <h4 className="text-slate-900 font-black text-lg">{cat}</h4>
                 </div>
                 <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">
                    Comprehensive documentation covering common user questions and troubleshooting steps for {cat.toLowerCase()}.
                 </p>
                 <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest cursor-pointer group-hover:gap-4 transition-all">
                    View 12 Articles <Plus size={14} />
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default FAQ;
