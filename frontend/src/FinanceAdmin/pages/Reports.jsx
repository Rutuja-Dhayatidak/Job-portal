import React from 'react';
import { FileText, Download, PieChart } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { title: 'Monthly Revenue Report', icon: <FileText className="text-blue-500" /> },
    { title: 'Tax & GST Summary', icon: <PieChart className="text-emerald-500" /> },
    { title: 'Employer Payouts', icon: <Download className="text-amber-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
        <p className="text-slate-500 font-medium mt-1">Generate and export comprehensive financial data.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {report.icon}
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">{report.title}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generate Report</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
