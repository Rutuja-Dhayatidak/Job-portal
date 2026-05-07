import React, { useEffect, useState } from 'react';
import { getJobs, updateJobStatus } from '../../services/superAdminApi';
import { Loader2, Briefcase, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateJobStatus(id, status);
      toast.success(`Job ${status} successfully`);
      fetchJobs();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Moderation</h1>
        <p className="text-slate-400 font-medium mt-1">Review and approve job postings from companies.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-50/30 transition-all group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Briefcase size={20} />
                    </div>
                    <p className="text-sm font-black text-slate-900">{job.title}</p>
                  </div>
                </td>
                <td className="p-6 text-sm text-slate-500 font-black uppercase tracking-tight">{job.company?.name || "Unknown"}</td>
                <td className="p-6">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider w-fit ${
                    job.status === 'approved' ? 'text-emerald-600 bg-emerald-50' : 
                    job.status === 'rejected' ? 'text-red-600 bg-red-50' : 
                    'text-orange-600 bg-orange-50'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                  {job.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'approved')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'rejected')}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No jobs found</div>}
      </div>
    </div>
  );
};

export default Jobs;
