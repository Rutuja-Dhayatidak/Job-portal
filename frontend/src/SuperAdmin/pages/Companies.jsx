import React, { useState, useEffect } from 'react';
import { getCompanies, verifyCompany } from '../../services/superAdminApi';
import { 
  getCompanyReviewDetails, 
  approveCompany, 
  rejectCompany, 
  escalateCompany 
} from '../../services/adminApi';
import { 
  Building2, CheckCircle, XCircle, Search, Loader2, MapPin, 
  Info, Clock, ArrowUpRight, Lock, FileText, ChevronRight, History, ShieldAlert, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'pending' | 'approved' | 'escalated'

  // Drawer / Detail modal state
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerData, setDrawerData] = useState(null); // { company, documents, logs }

  // Rejection Dialog state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectCompanyId, setRejectCompanyId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Escalation Dialog state
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateCompanyId, setEscalateCompanyId] = useState(null);
  const [escalationReason, setEscalationReason] = useState('');

  const [actionProcessing, setActionProcessing] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const isOverlayOpen = drawerOpen || rejectModalOpen || escalateModalOpen;
    if (isOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen, rejectModalOpen, escalateModalOpen]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data || []);
    } catch (err) {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = async (companyId) => {
    try {
      setSelectedCompanyId(companyId);
      setDrawerOpen(true);
      setDrawerLoading(true);
      const res = await getCompanyReviewDetails(companyId);
      setDrawerData(res);
    } catch (err) {
      toast.error("Failed to retrieve company details");
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleApproveCompany = async (id) => {
    try {
      setActionProcessing(true);
      const res = await approveCompany(id);
      toast.success(res.message || "Company approved successfully!");
      fetchCompanies();
      if (drawerOpen && selectedCompanyId === id) {
        const refreshed = await getCompanyReviewDetails(id);
        setDrawerData(refreshed);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve company");
    } finally {
      setActionProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      return toast.error("Rejection reason is mandatory.");
    }
    try {
      setActionProcessing(true);
      const res = await rejectCompany(rejectCompanyId, rejectionReason);
      toast.success(res.message || "Company request rejected.");
      setRejectModalOpen(false);
      setRejectionReason('');
      fetchCompanies();
      if (drawerOpen && selectedCompanyId === rejectCompanyId) {
        const refreshed = await getCompanyReviewDetails(rejectCompanyId);
        setDrawerData(refreshed);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject company");
    } finally {
      setActionProcessing(false);
    }
  };

  const handleEscalateSubmit = async () => {
    if (!escalationReason.trim()) {
      return toast.error("Escalation reason is mandatory.");
    }
    try {
      setActionProcessing(true);
      const res = await escalateCompany(escalateCompanyId, escalationReason);
      toast.success(res.message || "Case escalated to Super Admin.");
      setEscalateModalOpen(false);
      setEscalationReason('');
      fetchCompanies();
      if (drawerOpen && selectedCompanyId === escalateCompanyId) {
        const refreshed = await getCompanyReviewDetails(escalateCompanyId);
        setDrawerData(refreshed);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to escalate case");
    } finally {
      setActionProcessing(false);
    }
  };

  // Stats calculation
  const stats = {
    total: companies.length,
    active: companies.filter(c => c.status === 'approved' || c.isVerified).length,
    pending: companies.filter(c => c.status === 'pending' && !c.isVerified).length,
    escalated: companies.filter(c => c.trust_safety_status === 'escalated').length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filtering list
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'pending') {
      return matchesSearch && company.status === 'pending' && !company.isVerified;
    }
    if (filterType === 'approved') {
      return matchesSearch && (company.status === 'approved' || company.isVerified);
    }
    if (filterType === 'escalated') {
      return matchesSearch && company.trust_safety_status === 'escalated';
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center space-y-3">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-xs font-semibold text-slate-400 tracking-wider">Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto p-2">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="text-emerald-500" size={26} /> Company Management
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Verify and manage platform registered business entities.</p>
      </div>

      {/* Simplified, Clean Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Companies", value: stats.total, color: "bg-slate-50 border-slate-100", textColor: "text-slate-800", icon: <Building2 className="text-slate-500" size={16} /> },
          { label: "Pending Vetting", value: stats.pending, color: "bg-amber-50/40 border-amber-100/50", textColor: "text-amber-700", icon: <Clock className="text-amber-500" size={16} /> },
          { label: "Active Verified", value: stats.active, color: "bg-emerald-50/40 border-emerald-100/50", textColor: "text-emerald-700", icon: <CheckCircle className="text-emerald-500" size={16} /> },
          { label: "Escalated Cases", value: stats.escalated, color: "bg-rose-50/40 border-rose-100/50", textColor: "text-rose-700", icon: <ShieldAlert className="text-rose-500" size={16} /> },
        ].map((card, i) => (
          <div key={i} className={`p-4 rounded-2xl border ${card.color} flex items-center justify-between shadow-sm transition-all duration-200 hover:shadow-md`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className={`text-xl font-extrabold ${card.textColor}`}>{card.value}</p>
            </div>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Balanced Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { type: 'all', label: 'All' },
            { type: 'pending', label: 'Pending' },
            { type: 'approved', label: 'Approved' },
            { type: 'escalated', label: 'Escalated' },
          ].map((tab) => (
            <button
              key={tab.type}
              onClick={() => setFilterType(tab.type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                filterType === tab.type 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
          />
        </div>
      </div>

      {/* Balanced elegant Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Profile</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 pr-6 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map((company) => {
                const isEmailVerified = company.email_verified;
                const isDocsVerified = company.documents_verified;
                const isTSCleared = company.trust_safety_status === 'cleared' || company.trust_safety_status === 'approved';
                const canApprove = isEmailVerified && isDocsVerified && isTSCleared;

                return (
                  <tr key={company._id} className="hover:bg-slate-50/30 transition-colors duration-150">
                    {/* Company info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{company.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{company.industry || 'General'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 text-xs font-semibold text-slate-600 font-mono">{company.email}</td>

                    {/* Risk Level */}
                    <td className="p-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        company.risk_level === 'Critical' || company.risk_level === 'High' 
                          ? 'bg-rose-50 text-rose-600' 
                          : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {company.risk_level || 'Low'} Risk
                      </span>
                    </td>

                    {/* Status badges */}
                    <td className="p-4">
                      {company.status === 'approved' || company.isVerified ? (
                        <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-600">
                          Active ✅
                        </span>
                      ) : company.status === 'rejected' ? (
                        <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-rose-50 text-rose-600">
                          Rejected ❌
                        </span>
                      ) : company.trust_safety_status === 'escalated' ? (
                        <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-purple-50 text-purple-600 animate-pulse">
                          Escalated ⚠️
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-amber-50 text-amber-600">
                          Pending ⏳
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDrawer(company._id)}
                          className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-0.5 active:scale-95 border border-slate-100"
                        >
                          Review <ChevronRight size={10} />
                        </button>

                        {(company.status === 'approved' || company.isVerified) ? (
                          <button
                            onClick={() => {
                              setRejectCompanyId(company._id);
                              setRejectModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold transition-all"
                          >
                            Revoke
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="relative group">
                              <button
                                disabled={!canApprove || actionProcessing}
                                onClick={() => handleApproveCompany(company._id)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                  canApprove 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                }`}
                              >
                                Approve
                              </button>

                              {!canApprove && (
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-44 bg-slate-900 text-white text-[9px] p-2 rounded-lg shadow-md z-30 font-semibold leading-relaxed">
                                  Complete verification tasks:
                                  <div className="mt-1 space-y-0.5 border-t border-slate-800 pt-1">
                                    <p className={isEmailVerified ? "text-emerald-400" : "text-slate-400"}>• Email: {isEmailVerified ? "✅" : "❌"}</p>
                                    <p className={isTSCleared ? "text-emerald-400" : "text-slate-400"}>• Trust: {isTSCleared ? "✅" : "❌"}</p>
                                    <p className={isDocsVerified ? "text-emerald-400" : "text-slate-400"}>• Docs: {isDocsVerified ? "✅" : "❌"}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setRejectCompanyId(company._id);
                                setRejectModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCompanies.length === 0 && (
          <div className="p-16 text-center text-slate-400 font-bold uppercase text-xs tracking-wider">
            No matching companies found
          </div>
        )}
      </div>

      {/* Balanced Clean Sliding Detail Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40 cursor-pointer"
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen max-h-screen w-full sm:w-[500px] bg-white border-l border-slate-100 shadow-xl z-50 flex flex-col"
            >
              {drawerLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center space-y-3 p-6">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-xs text-slate-400 font-medium">Loading details...</p>
                </div>
              ) : drawerData ? (
                <div className="flex flex-col h-full overflow-hidden w-full">
                  {/* Drawer Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm p-0.5">
                        {drawerData.company.logo ? (
                          <img src={drawerData.company.logo} alt={drawerData.company.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="text-slate-400" size={16} />
                        )}
                      </div>
                      <div>
                        <h2 className="font-extrabold text-slate-900 text-base leading-none">{drawerData.company.name}</h2>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">KYC Verification Dossier</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setDrawerOpen(false)}
                      className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>

                  {/* Drawer Body */}
                  <div data-lenis-prevent className="p-5 space-y-6 flex-1 overflow-y-auto">
                    {/* Score and Risk Summary */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score</span>
                        <p className="text-xl font-extrabold text-slate-800 mt-1">{drawerData.company.trust_score || 0} <span className="text-xs text-slate-400 font-normal">/100</span></p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk factor</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold mt-1.5 uppercase ${
                          drawerData.company.risk_level === 'Critical' || drawerData.company.risk_level === 'High' 
                            ? 'bg-rose-50 text-rose-600' 
                            : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {drawerData.company.risk_level || 'Low'} Risk
                        </span>
                      </div>
                    </div>

                    {/* Checklist summary */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Verification Checklist</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Email Verified", val: drawerData.company.email_verified },
                          { label: "Website Verified", val: drawerData.company.website_verified },
                          { label: "GST Verified", val: drawerData.company.gst_verified },
                          { label: "Documents Verified", val: drawerData.company.documents_verified },
                        ].map((chk, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                            <span className="text-xs font-semibold text-slate-600">{chk.label}</span>
                            {chk.val ? (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                OK ✅
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                                Pending ⏳
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata table */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Administrative Metadata</h3>
                      <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs font-semibold text-slate-700 bg-white shadow-sm">
                        <div className="flex p-3 justify-between">
                          <span className="text-slate-400">Sector</span>
                          <span className="font-bold text-slate-900">{drawerData.company.industry?.toUpperCase() || 'GENERAL'}</span>
                        </div>
                        <div className="flex p-3 justify-between">
                          <span className="text-slate-400">Company Size</span>
                          <span className="font-bold text-slate-900">{drawerData.company.company_size || 'Not specified'}</span>
                        </div>
                        <div className="flex p-3 justify-between">
                          <span className="text-slate-400">GST / PAN</span>
                          <span className="font-mono text-[10px] text-slate-800">
                            GST: {drawerData.company.gst_number || 'N/A'} | PAN: {drawerData.company.pan_number || 'N/A'}
                          </span>
                        </div>
                        <div className="flex p-3 justify-between">
                          <span className="text-slate-400">Location</span>
                          <span className="font-bold text-slate-900">{drawerData.company.company_location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-3">
                      <h3 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">Uploaded Documents</h3>
                      {drawerData.documents.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No business papers loaded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {drawerData.documents.map((doc) => (
                            <div key={doc._id} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 uppercase truncate">
                                  {doc.document_type?.replace('_', ' ')}
                                </p>
                                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                                  Status: <span className={doc.verification_status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}>{doc.verification_status}</span>
                                </p>
                              </div>
                              <a 
                                href={doc.document_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors rounded-lg flex items-center gap-1 text-[10px] font-bold"
                              >
                                View File <ArrowUpRight size={10} />
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
                    {drawerData.company.status === 'approved' || drawerData.company.isVerified ? (
                      <button
                        onClick={() => {
                          setRejectCompanyId(drawerData.company._id);
                          setRejectModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
                      >
                        <XCircle size={12} /> Revoke Activation
                      </button>
                    ) : (
                      <>
                        <button
                          disabled={!(drawerData.company.email_verified && drawerData.company.documents_verified && (drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved')) || actionProcessing}
                          onClick={() => handleApproveCompany(drawerData.company._id)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            (drawerData.company.email_verified && drawerData.company.documents_verified && (drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved'))
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <CheckCircle size={12} /> Approve
                        </button>

                        <button
                          onClick={() => {
                            setRejectCompanyId(drawerData.company._id);
                            setRejectModalOpen(true);
                          }}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() => {
                            setEscalateCompanyId(drawerData.company._id);
                            setEscalateModalOpen(true);
                          }}
                          className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all"
                        >
                          Escalate
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModalOpen(false)}
              className="fixed inset-0 bg-slate-900 cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-slate-100 z-10 space-y-4 font-sans"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Verification Decline</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Please provide rejection feedback</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Reason (Mandatory)</label>
                <textarea
                  placeholder="State the reason for declining..."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-400 transition-all resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={actionProcessing}
                  onClick={handleRejectSubmit}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Escalation Modal */}
      <AnimatePresence>
        {escalateModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setEscalateModalOpen(false)}
              className="fixed inset-0 bg-slate-900 cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl border border-slate-100 z-10 space-y-4 font-sans"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900">Escalate Case to Super Admin</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Please add escalation reason</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Reason (Mandatory)</label>
                <textarea
                  placeholder="State the escalation notes..."
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all resize-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEscalateModalOpen(false)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={actionProcessing}
                  onClick={handleEscalateSubmit}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Escalate Case
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Companies;
