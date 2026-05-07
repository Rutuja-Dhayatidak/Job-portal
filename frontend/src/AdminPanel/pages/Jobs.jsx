import React, { useState, useEffect } from 'react';
import { getJobs, approveJob } from '../../services/adminApi';
import { Briefcase, CheckCircle2, Clock, MapPin, Building2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { hasPermission } from '../../utils/permissionUtils';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await approveJob(id);
      toast.success(res.message);
      fetchJobs();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Moderation</h1>
        <p className="text-slate-500 font-medium text-sm">Review and approve job postings before they go live.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={job._id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Briefcase size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Building2 size={14} />
                    {job.company?.name || "Unknown Company"}
                  </div>
                  <div className="flex items-center gap-1 text-indigo-500">
                    <MapPin size={14} />
                    Remote / On-site
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                  job.status === 'approved' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {job.status === 'approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{job.status}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                  <Eye size={20} />
                </button>
                {hasPermission('Jobs', 'approve') && (
                  <button 
                    onClick={() => handleApprove(job._id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                      job.status === 'approved'
                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                    }`}
                  >
                    {job.status === 'approved' ? 'Unapprove' : 'Approve Job'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
            <Briefcase size={32} />
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No jobs posted yet</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
