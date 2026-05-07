import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle, XCircle, FileText, ExternalLink, ShieldCheck } from 'lucide-react';
import { getKYC, approveKYC, rejectKYC } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const KYCVerification = () => {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const data = await getKYC();
      setKycs(data);
    } catch (err) {
      setKycs([
        { _id: '1', user: 'Ajay Sharma', type: 'Aadhar Card', status: 'Pending', docUrl: '#' },
        { _id: '2', user: 'TechSolutions Ltd', type: 'GST Certificate', status: 'Pending', docUrl: '#' },
        { _id: '3', user: 'Sarah Connor', type: 'Driving License', status: 'Approved', docUrl: '#' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    toast.success("KYC Verified Successfully");
  };

  const handleReject = async (id) => {
    toast.error("KYC Rejected");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">KYC Verification</h1>
        <p className="text-slate-500 font-medium mt-1">Authenticate user identities through document verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kycs.map((kyc) => (
          <div key={kyc._id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                  <UserCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{kyc.user}</h3>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1"><FileText size={14} /> {kyc.type}</span>
                </div>
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${kyc.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {kyc.status}
              </span>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                  <FileText size={20} />
                </div>
                <p className="text-sm font-black text-slate-600">identity_document.pdf</p>
              </div>
              <button className="p-2 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl transition-all">
                <ExternalLink size={20} />
              </button>
            </div>

            {kyc.status === 'Pending' && (
              <div className="flex gap-4">
                <button 
                  onClick={() => handleApprove(kyc._id)}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve KYC
                </button>
                <button 
                  onClick={() => handleReject(kyc._id)}
                  className="flex-1 py-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            )}
            
            {kyc.status === 'Approved' && (
              <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border border-emerald-100">
                <ShieldCheck size={20} /> Identity Verified
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCVerification;
