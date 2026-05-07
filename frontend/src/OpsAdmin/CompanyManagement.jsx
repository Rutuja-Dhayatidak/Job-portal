import React, { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle2, XCircle, MoreVertical, ExternalLink } from 'lucide-react';
import { getCompanies, approveCompany, rejectCompany } from '../services/opsAdminApi';
import toast from 'react-hot-toast';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setCompanies([
        { _id: '1', firstName: 'TechCorp', email: 'hr@techcorp.com', status: 'active', createdAt: '2024-03-01' },
        { _id: '2', firstName: 'DesignStudio', email: 'jobs@design.io', status: 'pending', createdAt: '2024-03-05' },
        { _id: '3', firstName: 'InnovateX', email: 'admin@innovatex.com', status: 'pending', createdAt: '2024-03-08' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCompany(id);
      toast.success("Company approved successfully");
      fetchCompanies();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCompany(id);
      toast.error("Company rejected");
      fetchCompanies();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recruiters Verification</h1>
        <p className="text-slate-500 font-medium mt-1">Audit and verify employer accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <div key={c._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                <Building2 size={32} />
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${c.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {c.status}
              </span>
            </div>
            
            <h3 className="text-xl font-black text-slate-900">{c.firstName}</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">{c.email}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
              {c.status === 'pending' ? (
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => handleApprove(c._id)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(c._id)}
                    className="flex-1 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              ) : (
                <button className="w-full py-3 bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                  <ExternalLink size={16} /> View Profile
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyManagement;
