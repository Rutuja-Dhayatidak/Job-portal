import React from 'react';
import { FileText, Download, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const exports = [
    { name: "Monthly Leads Performance Report", date: "May 01, 2026", type: "PDF Document" },
    { name: "Enterprise Customer Conversion Log", date: "Apr 30, 2026", type: "CSV Spreadsheet" },
    { name: "Shift Attendance coordinates Audit Log", date: "Apr 15, 2026", type: "Excel Document" }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Reports</h1>
        <p className="text-slate-500 font-medium mt-1">Export structured analytics logs, commission worksheets, and lead audits.</p>
      </div>

      <div className="space-y-4">
        {exports.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-violet-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-400 font-semibold flex items-center gap-2 mt-1">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.type}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => toast.success("Compiling archive... Download will start shortly.")}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
            >
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
