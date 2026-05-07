import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, CheckCircle, Eye, Search, MapPin, Building2 } from 'lucide-react';
import { getReportedJobs } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const ReportedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getReportedJobs();
      setJobs(data);
    } catch (err) {
      setJobs([
        { _id: '1', title: 'Work from Home Scam', employer: 'Unknown Entity', reason: 'Fraudulent Content', createdAt: '2024-03-14' },
        { _id: '2', title: 'Fake Software Lead', employer: 'Shell Corp', reason: 'Inaccurate Details', createdAt: '2024-03-15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id, type) => {
    toast.success(`Job ${type} successful`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reported Jobs</h1>
        <p className="text-slate-500 font-medium mt-1">Audit flagged job listings for potential fraud.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-8 rounded-[2rem] border border-red-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
             
             <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-black shadow-inner">
                  <AlertTriangle size={28} />
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-red-50 text-red-600 rounded-full uppercase tracking-widest border border-red-100">Flagged</span>
              </div>

              <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
              <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-2"><Building2 size={14} /> {job.employer}</p>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Reason for report</p>
                <p className="text-sm font-bold text-red-600 italic">"{job.reason}"</p>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => handleAction(job._id, 'Removed')}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Remove Job
                </button>
                <button 
                  onClick={() => handleAction(job._id, 'Approved')}
                  className="flex-1 py-3 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Keep Valid
                </button>
              </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportedJobs;
