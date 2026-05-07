import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Search, Filter, ShieldAlert, CheckCircle2, 
  XCircle, Clock, ExternalLink, Mail, Phone, MapPin, 
  Globe, Fingerprint, Shield, MoreVertical, X,
  AlertTriangle, ArrowRight, Activity, FileCheck, ScrollText,
  Loader2, ShieldCheck, Send, Copy
} from 'lucide-react';
import { 
  getCompanyRequests, approveCompany, rejectCompany, flagCompany, verifyChecklist, verifyCompanyDoc,
  sendCompanyEmailLink, updateVerificationField
} from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const CompanyVerification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'rejected', 'High'
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  // Official Email Link States
  const [sendingLink, setSendingLink] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lastVerifyUrl, setLastVerifyUrl] = useState('');

  // Clear url state when selected company changes
  useEffect(() => {
    setLastVerifyUrl('');
  }, [selectedCompany?._id]);

  // Cooldown effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendVerificationLink = async () => {
    if (cooldown > 0) return;
    try {
      setSendingLink(true);
      const res = await sendCompanyEmailLink(selectedCompany._id);
      toast.success('Verification link sent to official work email!');
      if (res.verifyUrl) {
        setLastVerifyUrl(res.verifyUrl);
      }
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification link');
    } finally {
      setSendingLink(false);
    }
  };

  const formatIndustry = (industry) => {
    if (!industry) return 'N/A';
    const short = industry.toUpperCase();
    if (['IT', 'HR', 'PR', 'AI', 'UX', 'UI'].includes(short)) return short;
    return industry.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  useEffect(() => {
    if (selectedCompany) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCompany]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'pending') params.status = 'pending';
      if (filter === 'approved') params.status = 'approved';
      if (filter === 'rejected') params.status = 'rejected';
      if (filter === 'High' || filter === 'Critical') params.risk = filter;

      const data = await getCompanyRequests(params);
      setRequests(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setIsProcessing(true);
      await approveCompany(id);
      toast.success('Company approved successfully');
      setSelectedCompany(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve company');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return toast.error('Please provide a rejection reason');
    }
    try {
      setIsProcessing(true);
      await rejectCompany(selectedCompany._id, rejectReason);
      toast.success('Company request rejected');
      setShowRejectModal(false);
      setSelectedCompany(null);
      setRejectReason('');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject company');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlagRiskSubmit = async () => {
    if (flagReason.trim().length < 10) {
      return toast.error('Please provide at least 10 characters for the reason');
    }
    try {
      setIsProcessing(true);
      await flagCompany(selectedCompany._id, 'High', flagReason);
      toast.success(`Company flagged as High risk`);
      setShowFlagModal(false);
      setFlagReason('');
      fetchRequests();
      if (selectedCompany) {
        setSelectedCompany({ ...selectedCompany, risk_score: 'High', risk_flagged: true, flagged_reason: flagReason });
      }
    } catch (err) {
      toast.error('Failed to flag company');
    } finally {
      setIsProcessing(false);
    }
  };

  const [updatingField, setUpdatingField] = useState(null);

  const handleUpdateVerification = async (field, value) => {
    try {
      setUpdatingField(field);
      const res = await updateVerificationField(selectedCompany._id, field, value);
      
      if (res.company) {
        setSelectedCompany(res.company);
        setRequests(prev => prev.map(r => r._id === res.company._id ? res.company : r));
      }
      
      const labelMap = {
        website_verified: 'Website',
        gst_verified: 'GST',
        cin_verified: 'CIN',
        pan_verified: 'PAN',
        documents_verified: 'Company Documents',
        email_verified: 'Email Address',
        logo_verified: 'Company Logo',
        google_verified: 'Google Presence',
        duplicate_checked: 'Duplicate Check status'
      };
      
      const readable = labelMap[field] || field;
      if (value) {
        toast.success(`${readable} verified successfully!`);
      } else {
        toast.success(`${readable} marked as unverified.`);
      }
      
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update verification status');
    } finally {
      setUpdatingField(null);
    }
  };
  const filteredRequests = requests.filter(req => 
    req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.owner_user_id?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.trust_safety_status === 'pending').length,
    highRisk: requests.filter(r => r.risk_score === 'High' || r.risk_score === 'Critical').length,
    approved: requests.filter(r => r.trust_safety_status === 'approved').length
  };

  const getRiskColor = (score) => {
    switch(score) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Company Verification Requests</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Review and verify employer/company registration requests to maintain platform integrity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, icon: <Building2 />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock />, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Approved', value: stats.approved, icon: <CheckCircle2 />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'High Risk', value: stats.highRisk, icon: <ShieldAlert />, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
          {['all', 'pending', 'approved', 'rejected', 'High'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by company, email, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Owner</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Industry</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Risk Score</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    <Activity className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading requests...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No requests found.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedCompany(req)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                          {req.logo ? (
                            <img src={req.logo} alt={req.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{req.name}</p>
                          <a href={req.website_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {req.website_url || 'No Website'}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 text-sm">{req.owner_user_id?.firstName} {req.owner_user_id?.lastName}</p>
                      <p className="text-[11px] text-slate-500">{req.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{formatIndustry(req.industry)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${getRiskColor(req.risk_score)} flex items-center gap-1.5 w-max`}>
                          <Fingerprint size={12} />
                          {req.risk_score}
                        </span>
                        {req.risk_flagged && (
                          <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                            <ShieldAlert size={10} /> Flagged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        req.trust_safety_status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                        req.trust_safety_status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {req.trust_safety_status === 'approved' ? 'Safe' : req.trust_safety_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedCompany(req); }}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Slide-out Drawer */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[600px] h-screen bg-white shadow-2xl z-[110] flex flex-col border-l border-slate-200 overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden flex items-center justify-center">
                    {selectedCompany.logo ? (
                      <img src={selectedCompany.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{selectedCompany.name}</h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest mt-1 inline-block ${
                        selectedCompany.trust_safety_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        selectedCompany.trust_safety_status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {selectedCompany.trust_safety_status === 'approved' ? 'Passed Safety Review' : selectedCompany.trust_safety_status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div 
                data-lenis-prevent
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 space-y-8"
              >
                
                {/* Fraud Detection Alerts */}
                {selectedCompany.flagged_reason && (
                  <div className={`p-4 rounded-xl border ${selectedCompany.risk_score === 'Critical' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} flex gap-3`}>
                    <ShieldAlert className={selectedCompany.risk_score === 'Critical' ? 'text-red-500' : 'text-orange-500'} size={24} />
                    <div>
                      <h4 className={`text-sm font-black ${selectedCompany.risk_score === 'Critical' ? 'text-red-800' : 'text-orange-800'}`}>
                        System Flag: {selectedCompany.risk_score} Risk
                      </h4>
                      <p className={`text-xs font-medium mt-1 ${selectedCompany.risk_score === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>
                        {selectedCompany.flagged_reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* 1. Company Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Industry</p>
                    <p className="text-sm font-bold text-slate-800">{formatIndustry(selectedCompany.industry)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company Size</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCompany.company_size || 'Not Provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Website URL</p>
                    {selectedCompany.website_url ? (
                      <a href={selectedCompany.website_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                        {selectedCompany.website_url} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-slate-500">Not Provided</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">About Company</p>
                    <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedCompany.about_company || 'No description provided.'}
                    </p>
                  </div>
                </div>

                 {/* Owner & Contact Details */}
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Owner Name</span>
                     <span className="text-sm font-bold text-slate-800">{selectedCompany.owner_user_id?.firstName} {selectedCompany.owner_user_id?.lastName}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Official Work Email</span>
                     <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                       <Mail size={14} className="text-slate-400" /> {selectedCompany.official_work_email || 'N/A'}
                     </span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Official Company Phone</span>
                     <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                       <Phone size={14} className="text-slate-400" /> {selectedCompany.mobile_number || 'N/A'}
                     </span>
                   </div>
                   <div className="flex flex-col gap-2 border-t border-slate-200/60 pt-3">
                     <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-500">Email Verification</span>
                       {selectedCompany.email_verified ? (
                         <div className="flex flex-col items-end gap-1">
                           <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1">
                             <CheckCircle2 size={12} /> Official Company Email Verified
                           </span>
                           {selectedCompany.email_verified_at && (
                             <span className="text-[10px] font-bold text-slate-400">
                               Verified At: {new Date(selectedCompany.email_verified_at).toLocaleString()}
                             </span>
                           )}
                         </div>
                       ) : (
                         <div className="flex items-center gap-2">
                           <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1">
                             <AlertTriangle size={12} className="text-amber-500" /> Official Company Email Not Verified
                           </span>
                           <button
                             disabled={sendingLink}
                             onClick={handleSendVerificationLink}
                             className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-sm flex items-center gap-1.5"
                           >
                             {sendingLink ? (
                               <>
                                 <Loader2 className="animate-spin" size={12} /> Sending...
                               </>
                             ) : cooldown > 0 ? (
                               <>
                                 <Send size={11} /> Resend ({cooldown}s)
                               </>
                             ) : (
                               <>
                                 <Send size={11} /> Send Verification Link
                               </>
                             )}
                           </button>
                         </div>
                       )}
                     </div>
                     {lastVerifyUrl && !selectedCompany.email_verified && (
                       <div className="flex justify-between items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/80 mt-1 animate-fadeIn">
                         <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wide">Link is ready to copy:</span>
                         <button
                           onClick={() => {
                             navigator.clipboard.writeText(lastVerifyUrl);
                             toast.success('Verification link copied to clipboard!');
                           }}
                           className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black uppercase transition-all shadow-sm flex items-center gap-1"
                         >
                           <Copy size={11} /> Copy Verification Link
                         </button>
                       </div>
                     )}
                   </div>
                 </div>

                {/* 2. Fraud & Verification Checklist */}
                <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-500" />
                    Fraud & Verification Checklist
                    <span className="text-[10px] text-slate-400 font-bold ml-2">(Click to manually verify)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    {/* Website Active */}
                    <button 
                      disabled={updatingField === 'website_verified'}
                      onClick={() => handleUpdateVerification('website_verified', !selectedCompany.website_verified)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:shadow-md outline-none text-left w-full ${selectedCompany.website_verified ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                    >
                      {updatingField === 'website_verified' ? (
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                      ) : selectedCompany.website_verified ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <XCircle className="text-red-500" size={20} />
                      )}
                      <span className={`text-sm font-bold ${selectedCompany.website_verified ? 'text-emerald-700' : 'text-red-700'}`}>
                        Website active
                      </span>
                    </button>

                    {/* Google Presence */}
                    <button 
                      disabled={updatingField === 'google_verified'}
                      onClick={() => handleUpdateVerification('google_verified', !selectedCompany.google_verified)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:shadow-md outline-none text-left w-full ${selectedCompany.google_verified ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'}`}
                    >
                      {updatingField === 'google_verified' ? (
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                      ) : selectedCompany.google_verified ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <Clock className="text-yellow-500" size={20} />
                      )}
                      <span className={`text-sm font-bold ${selectedCompany.google_verified ? 'text-emerald-700' : 'text-yellow-700'}`}>
                        {selectedCompany.google_verified ? 'Company exists on Google' : 'Google presence pending'}
                      </span>
                    </button>

                    {/* Duplicate Request */}
                    <button 
                      disabled={updatingField === 'duplicate_checked'}
                      onClick={() => handleUpdateVerification('duplicate_checked', !selectedCompany.duplicate_checked)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:shadow-md outline-none text-left w-full ${selectedCompany.duplicate_checked ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200'}`}
                    >
                      {updatingField === 'duplicate_checked' ? (
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                      ) : selectedCompany.duplicate_checked ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <AlertTriangle className="text-orange-500" size={20} />
                      )}
                      <span className={`text-sm font-bold ${selectedCompany.duplicate_checked ? 'text-emerald-700' : 'text-orange-700'}`}>
                        {selectedCompany.duplicate_checked ? 'No duplicate requests' : 'Duplicate requests found'}
                      </span>
                    </button>

                    {/* Logo Verification */}
                    <button 
                      disabled={updatingField === 'logo_verified'}
                      onClick={() => handleUpdateVerification('logo_verified', !selectedCompany.logo_verified)}
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:shadow-md outline-none text-left w-full ${selectedCompany.logo_verified ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'}`}
                    >
                      {updatingField === 'logo_verified' ? (
                        <Loader2 className="animate-spin text-slate-400" size={20} />
                      ) : selectedCompany.logo_verified ? (
                        <CheckCircle2 className="text-emerald-500" size={20} />
                      ) : (
                        <Clock className="text-yellow-500" size={20} />
                      )}
                      <span className={`text-sm font-bold ${selectedCompany.logo_verified ? 'text-emerald-700' : 'text-yellow-700'}`}>
                        {selectedCompany.logo_verified ? 'Logo verified' : 'Logo verification pending'}
                      </span>
                    </button>

                  </div>
                </div>

                {/* 3. Uploaded Documents */}
                <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileCheck size={16} className="text-indigo-500" />
                    Uploaded Documents
                  </h3>
                  {selectedCompany.documents && selectedCompany.documents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedCompany.documents.map((doc) => {
                        const docLabels = {
                          gst_cert: 'GST Certificate',
                          pan_card: 'PAN Card Doc',
                          business_proof: 'Business Proof',
                          company_proof: 'Utility / Company Proof'
                        };
                        return (
                          <div 
                            key={doc._id}
                            className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-200 transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{docLabels[doc.document_type] || doc.document_type}</p>
                              <a 
                                href={doc.document_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1"
                              >
                                View file <ExternalLink size={12} />
                              </a>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {(() => {
                                const typeToField = {
                                  gst_cert: 'gst_verified',
                                  pan_card: 'pan_verified',
                                  company_proof: 'cin_verified',
                                  business_proof: 'documents_verified'
                                };
                                const mappedField = typeToField[doc.document_type] || 'documents_verified';
                                const isFieldVerified = !!selectedCompany[mappedField];

                                return (
                                  <>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                      isFieldVerified 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {isFieldVerified ? 'verified' : 'pending'}
                                    </span>

                                    <button
                                      disabled={updatingField === mappedField}
                                      onClick={() => handleUpdateVerification(mappedField, !isFieldVerified)}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                                        isFieldVerified
                                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                      }`}
                                    >
                                      {updatingField === mappedField && (
                                        <Loader2 className="animate-spin text-slate-400" size={11} />
                                      )}
                                      {isFieldVerified ? 'Reject' : 'Approve'}
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed text-center">
                      <p className="text-sm font-bold text-slate-500">No documents uploaded</p>
                    </div>
                  )}
                </div>

                {/* 4. Admin Notes & Review History */}
                {(selectedCompany.flagged_reason || selectedCompany.rejectionReason) && (
                  <div className="border-t border-slate-100 pt-8">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ScrollText size={16} className="text-indigo-500" />
                      Admin Notes & Review History
                    </h3>
                    <div className="space-y-3">
                      {selectedCompany.flagged_reason && (
                        <div className="p-4 rounded-xl border bg-orange-50 border-orange-200">
                          <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-1">Flagged Reason</p>
                          <p className="text-sm font-medium text-orange-700">{selectedCompany.flagged_reason}</p>
                          {selectedCompany.flagged_by && (
                            <p className="text-[10px] font-bold text-orange-500 mt-2">By: Admin ID {selectedCompany.flagged_by}</p>
                          )}
                        </div>
                      )}
                      {selectedCompany.rejectionReason && (
                        <div className="p-4 rounded-xl border bg-red-50 border-red-200">
                          <p className="text-xs font-black text-red-800 uppercase tracking-widest mb-1">Rejection Reason</p>
                          <p className="text-sm font-medium text-red-700">{selectedCompany.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              {selectedCompany.trust_safety_status === 'pending' && (
                <div className="p-6 border-t border-slate-200 bg-white flex flex-col gap-3">
                  <button 
                    onClick={() => handleApprove(selectedCompany._id)}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <ShieldCheck size={18} /> Mark as Safe → Send to Platform Admin
                  </button>
                  {selectedCompany.risk_score !== 'High' && selectedCompany.risk_score !== 'Critical' && !selectedCompany.risk_flagged && (
                    <button 
                      onClick={() => setShowFlagModal(true)}
                      disabled={isProcessing}
                      className="w-full py-3 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <AlertTriangle size={18} /> Flag as Risk
                    </button>
                  )}
                </div>
              )}

              {/* Flag Reason Form */}
              <AnimatePresence>
                {showFlagModal && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="p-6 border-t border-orange-100 bg-orange-50/50"
                  >
                    <h4 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-3">Add Reason for Flagging</h4>
                    <div className="relative mb-3">
                      <textarea 
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                        placeholder="Enter reason for flagging this company..."
                        className="w-full p-3 bg-white border border-orange-200 rounded-xl outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10 text-sm font-medium resize-none h-24"
                      ></textarea>
                      <span className={`absolute bottom-3 right-3 text-[10px] font-bold ${flagReason.length < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                        {flagReason.length}/10 min
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleFlagRiskSubmit}
                        disabled={isProcessing || flagReason.length < 10}
                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-colors"
                      >
                        Submit Flag
                      </button>
                      <button 
                        onClick={() => { setShowFlagModal(false); setFlagReason(''); }}
                        className="px-6 py-3 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </>
        )}
      </AnimatePresence>


    </div>
  );
};

export default CompanyVerification;
