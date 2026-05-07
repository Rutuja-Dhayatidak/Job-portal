import React from 'react';
import { 
  FileText, 
  Download, 
  PieChart as PieIcon, 
  Table as TableIcon,
  TrendingUp,
  ArrowRight,
  BarChart,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';

const FinancialReports = () => {
  const reportData = [
    { month: 'Jan', revenue: 4000, margin: 2400 },
    { month: 'Feb', revenue: 3000, margin: 1398 },
    { month: 'Mar', revenue: 2000, margin: 9800 },
    { month: 'Apr', revenue: 2780, margin: 3908 },
    { month: 'May', revenue: 1890, margin: 4800 },
    { month: 'Jun', revenue: 2390, margin: 3800 },
  ];

  const handleExport = (type) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Preparing ${type} report...`,
        success: `${type} report exported successfully!`,
        error: 'Export failed.',
      }
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Reports</h1>
        <p className="text-slate-500 font-medium mt-1">Generate and export comprehensive financial auditing data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Revenue Report', sub: 'Monthly earnings CSV', icon: <FileSpreadsheet className="text-blue-500" />, type: 'CSV' },
          { title: 'GST Summary', sub: 'Tax compliance Excel', icon: <FileText className="text-emerald-500" />, type: 'Excel' },
          { title: 'Plan Audit', sub: 'Performance analysis PDF', icon: <BarChart className="text-purple-500" />, type: 'PDF' },
          { title: 'Refund Audit', sub: 'Transaction history', icon: <TrendingUp className="text-amber-500" />, type: 'CSV' },
        ].map((report, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              {report.icon}
            </div>
            <h3 className="text-lg font-black text-slate-900">{report.title}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 mb-6 uppercase tracking-widest">{report.sub}</p>
            <button 
              onClick={() => handleExport(report.type)}
              className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} /> Export {report.type}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Monthly Revenue</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Comparison with profit margins</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', padding: '12px'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="margin" fill="#10b981" radius={[6, 6, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Report Actions */}
        <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group shadow-2xl shadow-slate-900/40">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-10 backdrop-blur-md">
               <TrendingUp size={32} className="text-blue-400" />
             </div>
             <h3 className="text-3xl font-black mb-4">Annual Fiscal Audit</h3>
             <p className="text-slate-400 font-medium leading-relaxed max-w-sm mb-10">
               Generate a comprehensive 12-month financial analysis including tax liability, regional growth, and churn metrics.
             </p>
             <button className="flex items-center gap-3 text-sm font-black text-blue-400 uppercase tracking-widest hover:translate-x-2 transition-transform">
               Start Generation <ArrowRight size={20} />
             </button>
           </div>
           
           <div className="mt-auto relative z-10 pt-10 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>Last Generated: May 12, 2024</span>
                <span className="text-emerald-500">Scheduled: June 01</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
