import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Trash2, Flag, Eye, Search } from 'lucide-react';
import { getJobs, deleteJob } from '../services/opsAdminApi';
import toast from 'react-hot-toast';

const JobManagement = () => {
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
      setJobs([
        { _id: '1', title: 'Senior React Developer', employer: { firstName: 'TechCorp' }, location: 'Remote', salary: '$120k', status: 'active', createdAt: '2024-03-01' },
        { _id: '2', title: 'UI/UX Designer', employer: { firstName: 'Creative Studio' }, location: 'New York', salary: '$90k', status: 'active', createdAt: '2024-03-05' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id);
        toast.success("Job deleted");
        fetchJobs();
      } catch (err) {
        toast.error("Deletion failed");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Posts Control</h1>
          <p className="text-slate-500 font-medium mt-1">Review and moderate all active job listings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                  {job.title[0]}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-400">{job.employer.firstName}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye size={20} /></button>
                <button className="p-2 bg-slate-50 text-slate-400 hover:text-amber-600 rounded-xl transition-all"><Flag size={20} /></button>
                <button 
                  onClick={() => handleDelete(job._id)}
                  className="p-2 bg-red-50 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <MapPin size={14} className="text-blue-500" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <DollarSign size={14} className="text-emerald-500" /> {job.salary}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
                <Calendar size={14} className="text-purple-500" /> {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobManagement;
