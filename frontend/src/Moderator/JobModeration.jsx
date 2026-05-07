import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getJobs, approveJob, rejectJob } from '../services/moderator';
import { Briefcase, CheckCircle, XCircle, ExternalLink, ShieldAlert, Building2, MapPin, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const JobModeration = () => {
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
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await approveJob(id);
      if (action === 'reject') await rejectJob(id);
      toast.success(`Job ${action === 'approve' ? 'Approved' : 'Rejected'}`);
      fetchJobs();
    } catch (err) {
      toast.error("Job action failed");
    }
  };

  return (
    <div className="flex-1">
      <Header title="Job Moderation" subtitle="Review and audit platform job listings for quality and safety." />
      
      <div className="p-10 space-y-8">
           <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all group relative overflow-hidden">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                      <div className="flex-1 space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                               <Building2 size={24} />
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-white">{job.title}</h3>
                               <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{job.companyName || 'Verified Employer'}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ml-auto md:ml-4 ${
                              job.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 
                              job.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {job.status}
                            </span>
                         </div>

                         <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                               <MapPin size={14} className="text-indigo-500" /> {job.location || 'Remote'}
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                               <DollarSign size={14} className="text-emerald-500" /> {job.salary?.min}k - {job.salary?.max}k
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Type:</span>
                               <span className="text-zinc-300">{job.type}</span>
                            </div>
                         </div>

                         <p className="text-zinc-500 text-sm font-medium line-clamp-2 max-w-4xl">
                           {job.description}
                         </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                         <button 
                          onClick={() => handleAction(job._id, 'approve')}
                          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                         >
                            <CheckCircle size={18} /> Approve
                         </button>
                         <button 
                          onClick={() => handleAction(job._id, 'reject')}
                          className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
                         >
                            <XCircle size={18} /> Reject
                         </button>
                         <button className="p-4 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5">
                            <ExternalLink size={20} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}

              {jobs.length === 0 && (
                <div className="py-20 text-center text-zinc-600 space-y-4">
                   <Briefcase className="mx-auto opacity-10" size={80} />
                   <p className="text-xs font-black uppercase tracking-widest">No jobs found in moderation queue</p>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

export default JobModeration;
