import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Feed from './Feed';
import RightPanel from './RightPanel';
import { getMyProfile } from '../../services/api';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [initiallyAcknowledged, setInitiallyAcknowledged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile in dashboard", error);
      }
    };
    fetchProfile();
  }, []);

  const company = profile?.userId?.company_id;

  useEffect(() => {
    if (company?._id) {
      const isAck = localStorage.getItem(`company_rejection_acknowledged_${company._id}`) === 'true';
      if (isAck) {
        setInitiallyAcknowledged(true);
        setAcknowledged(true);
      }
    }
  }, [company]);

  const isPending = company && (company.status === 'pending' || company.verification_status === 'pending');
  const isRejected = company && (company.status === 'rejected' || company.verification_status === 'rejected');
  const isApproved = company && (company.status === 'approved' && company.verification_status === 'approved');
  const showRejectionBanner = isRejected && !initiallyAcknowledged;

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans text-slate-900 selection:bg-emerald-100">
      <Navbar />

      <main className="max-w-[1128px] mx-auto pt-[4.5rem] px-4">
        
        {/* Verification Status Banners */}
        <AnimatePresence mode="wait">
          {isPending && (
            <motion.div 
              key="pending-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-r from-amber-50 to-[#fdf9f3] border-2 border-amber-200/80 rounded-[1.8rem] p-6 lg:p-8 mb-6 relative overflow-hidden shadow-[0_12px_40px_rgba(245,158,11,0.05)]"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/[0.03] rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 bg-amber-100/60 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner text-2xl">
                    ⏳
                  </div>
                  <div>
                    <h3 className="text-amber-950 font-black text-xl tracking-tight flex items-center gap-2">
                      Company Verification Under Review
                    </h3>
                    <p className="text-amber-900/80 text-[13px] md:text-sm mt-2 max-w-2xl font-bold leading-relaxed">
                      Your company registration request has been submitted successfully
                      and is currently under review by the NextHire Platform Admin.
                    </p>
                    <p className="text-amber-800/70 text-xs mt-3 font-semibold leading-relaxed">
                      ⚠️ You cannot create another company request until the current verification process is completed.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 items-center">
                      <span className="px-3.5 py-1 bg-amber-100 border border-amber-200 rounded-full font-black text-[11px] text-amber-800 uppercase tracking-wider">
                        Current Status: Pending Review
                      </span>
                      <span className="text-amber-700/80 text-xs font-semibold flex items-center gap-1">
                        Please wait for approval or rejection notification via email.
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/profile')} 
                  className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-600/10 transition-colors whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-1.5 border-none outline-none"
                >
                  View Submitted Details
                </motion.button>
              </div>
            </motion.div>
          )}

          {showRejectionBanner && (
            <motion.div 
              key="rejected-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`border-2 rounded-[1.8rem] p-6 lg:p-8 mb-6 relative overflow-hidden transition-all duration-500 shadow-md ${
                acknowledged 
                  ? "bg-gradient-to-r from-slate-50 to-rose-50/30 border-slate-200" 
                  : "bg-gradient-to-r from-red-50 to-[#fdf4f4] border-red-200/80"
              }`}
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/[0.01] rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex gap-4 items-start w-full md:max-w-3xl">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner text-2xl transition-all duration-500 ${
                    acknowledged ? "bg-slate-100 text-slate-500" : "bg-red-100/60 text-red-600"
                  }`}>
                    {acknowledged ? "📝" : "❌"}
                  </div>
                  <div className="space-y-3 w-full">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className={`font-black text-xl tracking-tight transition-colors duration-500 ${
                        acknowledged ? "text-slate-800" : "text-red-950"
                      }`}>
                        Company Verification Rejected
                      </h3>
                      {acknowledged && (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 size={10} /> Reason Reviewed
                        </motion.span>
                      )}
                    </div>
                    
                    <p className={`text-[13px] md:text-sm font-bold leading-relaxed transition-colors duration-500 ${
                      acknowledged ? "text-slate-500" : "text-red-900/80"
                    }`}>
                      Your company verification request was rejected by Platform Admin. Please acknowledge the reason and update your credentials before resubmitting.
                    </p>

                    <div className={`border rounded-xl p-4 w-full shadow-sm transition-all duration-500 ${
                      acknowledged ? "bg-white/40 border-slate-200" : "bg-white/80 border-red-100/80"
                    }`}>
                      <p className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                        acknowledged ? "text-slate-400" : "text-red-700"
                      }`}>Reason for Rejection</p>
                      <p className={`font-extrabold text-sm mt-1 transition-colors duration-500 ${
                        acknowledged ? "text-slate-700" : "text-red-950"
                      }`}>
                        "{company?.rejectionReason || "The submitted GST certificate could not be verified."}"
                      </p>
                    </div>

                    {/* Accessible Interactive Custom Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group select-none mt-4 p-2.5 rounded-xl hover:bg-slate-100/50 transition-colors">
                      <div className="relative flex items-center mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={acknowledged}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setAcknowledged(checked);
                            if (company?._id) {
                              if (checked) {
                                localStorage.setItem(`company_rejection_acknowledged_${company._id}`, 'true');
                              } else {
                                localStorage.removeItem(`company_rejection_acknowledged_${company._id}`);
                              }
                            }
                          }}
                          className="sr-only" // hidden but accessible
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          acknowledged 
                            ? "bg-red-600 border-red-600 shadow-md shadow-red-600/10" 
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}>
                          {acknowledged && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                        I have reviewed the rejection reason and understand that I need to update the required company details before resubmitting.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex items-center">
                  <motion.button 
                    disabled={!acknowledged}
                    whileHover={acknowledged ? { scale: 1.02 } : {}}
                    whileTap={acknowledged ? { scale: 0.98 } : {}}
                    onClick={() => {
                      if (acknowledged) {
                        navigate('/company/register');
                      }
                    }} 
                    className={`px-6 py-3.5 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition-all whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-1.5 border-none outline-none ${
                      acknowledged 
                        ? "bg-red-600 hover:bg-red-700 shadow-red-600/10 cursor-pointer" 
                        : "bg-slate-300 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Update & Resubmit <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {isApproved && (
            <motion.div 
              key="approved-banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-r from-emerald-50 to-[#f2faf5] border-2 border-emerald-200/80 rounded-[1.8rem] p-6 lg:p-8 mb-6 relative overflow-hidden shadow-[0_12px_40px_rgba(16,185,129,0.05)]"
            >
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 bg-emerald-100/60 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner text-2xl">
                    ✅
                  </div>
                  <div>
                    <h3 className="text-emerald-950 font-black text-xl tracking-tight flex items-center gap-2">
                      Company Verified Successfully <Sparkles size={18} className="text-emerald-500 animate-pulse" />
                    </h3>
                    <p className="text-emerald-900/80 text-[13px] md:text-sm mt-2 max-w-2xl font-bold leading-relaxed">
                      Your company has been approved successfully.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <span className="text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200/40">
                        • Posting Jobs
                      </span>
                      <span className="text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200/40">
                        • Managing Candidates
                      </span>
                      <span className="text-emerald-800 text-xs font-extrabold flex items-center gap-1.5 bg-emerald-100/50 px-3 py-1.5 rounded-lg border border-emerald-200/40">
                        • Hiring Employees
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/company/login')} 
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/10 transition-colors whitespace-nowrap self-stretch md:self-auto flex items-center justify-center gap-1.5 border-none outline-none"
                >
                  Go To Employer Dashboard <ArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Sidebar */}
          <Sidebar />

          {/* Center Feed */}
          <Feed />

          {/* Right Sidebar */}
          <RightPanel />

        </div>

        {/* Mobile Navbar Spacer */}
        <div className="h-20 lg:hidden" />
      </main>
    </div>
  );
};

export default Dashboard;
