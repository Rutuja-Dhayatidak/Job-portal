import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getCompanies,
  approveCompany,
  rejectCompany,
  getCompanyReviewDetails,
  escalateCompany
} from '../../services/adminApi';
import {
  Building2, CheckCircle, XCircle, ExternalLink, Globe, Mail,
  Search, ShieldCheck, ShieldAlert, Phone, Users2,
  Layers, Loader2, Calendar, MapPin, Activity, Info,
  AlertTriangle, ArrowRight, Shield, History, User,
  Clock, ArrowUpRight, Lock, HelpCircle, FileText, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { hasPermission } from '../../utils/permissionUtils';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected' | 'high_risk' | 'today'

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
  const [timelineFilter, setTimelineFilter] = useState('all'); // 'all' | 'verified' | 'pending' | 'rejected' | 'auto'

  const userRole = localStorage.getItem('role');
  const normalizedRole = userRole?.toLowerCase()?.replace('_', ' ')?.trim();
  const isAuthorizedAdmin = 
    normalizedRole === 'platform admin' || 
    normalizedRole === 'superadmin' || 
    userRole === 'superAdmin' ||
    hasPermission('Companies', 'approve');

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
  const parseAuditLog = (log) => {
    let title = log.action || 'Audit Record';
    let desc = log.details || '';
    let status = 'review'; // 'verified' | 'pending' | 'rejected' | 'review'
    let type = 'Manual Review'; // 'Manual Review' | 'Auto Verification'
    let adminName = log.adminId?.firstName
      ? `${log.adminId.firstName} ${log.adminId.lastName || ''}`.trim()
      : 'System Automation';
    let adminRole = log.adminId?.role || 'Compliance System';

    const detailsLower = (log.details || '').toLowerCase();
    const actionLower = (log.action || '').toLowerCase();

    if (actionLower === 'official_email_verified_link' || detailsLower.includes('official_email_verified_link') || detailsLower.includes('email verified via secure verification link')) {
      title = 'Official Email Verified';
      desc = 'Corporate domain email successfully verified through modern secure token handshake.';
      status = 'verified';
      type = 'Auto Verification';
      adminName = 'Employer Self-Verification';
      adminRole = 'SMTP Gateway';
    } else if (actionLower === 'risk_flagged' || detailsLower.includes('risk_flagged') || detailsLower.includes('flagged as')) {
      title = 'Compliance Risk Flagged';
      desc = log.details || 'Elevated risk parameters identified during automated background scanning.';
      status = 'rejected';
      type = 'Auto Verification';
    } else if (actionLower === 'marked company safe' || detailsLower.includes('marked as safe by trust & safety')) {
      title = 'Trust & Safety Cleared';
      desc = 'Successfully passed all trust vetting steps and forwarded to final platform activation.';
      status = 'verified';
      type = 'Manual Review';
    } else if (actionLower === 'rejected company verification' || detailsLower.includes('rejected company request')) {
      title = 'Verification Request Rejected';
      desc = log.details || 'Registration request declined due to policy or document mismatch.';
      status = 'rejected';
      type = 'Manual Review';
    } else if (actionLower === 'updated verification field' || detailsLower.includes('updated verification field')) {
      if (detailsLower.includes('pan_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'PAN Details Verified' : 'PAN Verification Revoked';
        desc = isTrue ? 'Company Permanent Account Number (PAN) details matched and verified.' : 'Company PAN details marked as unverified.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('gst_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'GST Details Verified' : 'GST Verification Revoked';
        desc = isTrue ? 'Company GST certification successfully matched and approved.' : 'Company GST details marked as unverified.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('cin_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'CIN Details Verified' : 'CIN Verification Revoked';
        desc = isTrue ? 'Company Corporate Identification Number (CIN) validated successfully.' : 'Company CIN records marked as unverified.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('documents_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Company Documents Approved' : 'Documents Suspended';
        desc = isTrue ? 'All uploaded corporate legal registration papers successfully approved.' : 'All uploaded papers marked as suspended.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('website_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Website Domain Verified' : 'Website Domain Suspended';
        desc = isTrue ? 'Company domain and web presence verified.' : 'Company web domain marked as unverified.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('logo_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Corporate Logo Approved' : 'Logo Suspended';
        desc = isTrue ? 'Company brand identity logo passed safety review.' : 'Company logo marked as suspended.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('google_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Google Presence Verified' : 'Google Presence Revoked';
        desc = isTrue ? 'Corporate listing confirmed in public business search directories.' : 'Google business presence marked as unconfirmed.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('duplicate_checked')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Duplicate Check Passed' : 'Duplicate Check Failed';
        desc = isTrue ? 'Checked database; no duplicate corporate entities detected.' : 'Duplicate company detail warning triggered.';
        status = isTrue ? 'verified' : 'pending';
      } else if (detailsLower.includes('email_verified')) {
        const isTrue = detailsLower.includes('to true');
        title = isTrue ? 'Official Email Verified' : 'Email Verification Revoked';
        desc = isTrue ? 'Corporate official email domain verified.' : 'Corporate email marked as unverified.';
        status = isTrue ? 'verified' : 'pending';
      }
    } else if (actionLower === 'updated company status' || detailsLower.includes('status updated')) {
      if (detailsLower.includes('to approved')) {
        title = 'Company Final Activation';
        desc = 'Platform Administrator approved the registration request. Full privileges active.';
        status = 'verified';
      } else if (detailsLower.includes('to rejected')) {
        title = 'Company Activation Rejected';
        desc = log.details || 'Registration activation rejected by Platform Administrator.';
        status = 'rejected';
      }
    } else if (actionLower === 'escalated company dossier' || detailsLower.includes('escalate')) {
      title = 'Dossier Escalated';
      desc = log.details || 'Case escalated to Super Administration for physical compliance audit.';
      status = 'review';
    }

    if (adminName.toLowerCase().includes('system') || adminName.toLowerCase().includes('automation')) {
      type = 'Auto Verification';
    }

    return { title, desc, status, type, adminName, adminRole };
  };


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
      toast.error("Failed to retrieve company review details");
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleApproveCompany = async (id) => {
    if (!isAuthorizedAdmin) {
      return toast.error("Security Alert: Only Platform or Super Admins can approve employers.");
    }
    try {
      setActionProcessing(true);
      const res = await approveCompany(id);
      toast.success(res.message || "Company approved and activated successfully!");
      fetchCompanies();
      if (drawerOpen && selectedCompanyId === id) {
        // Refresh drawer details
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
    if (!isAuthorizedAdmin) {
      return toast.error("Security Alert: Unauthorized role access.");
    }
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
    if (!isAuthorizedAdmin) {
      return toast.error("Security Alert: Unauthorized role access.");
    }
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
    active: companies.filter(c => c.status === 'approved').length,
    pending: companies.filter(c => c.status === 'pending').length,
    highRisk: companies.filter(c => c.risk_level === 'High' || c.risk_level === 'Critical' || c.trust_safety_status === 'flagged').length,
  };

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Timestamp formatter
  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter & Search Logic
  const filteredCompanies = companies.filter(c => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.official_work_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.website_url?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'pending') return matchesSearch && c.status === 'pending';
    if (filterType === 'approved') return matchesSearch && c.status === 'approved';
    if (filterType === 'rejected') return matchesSearch && c.status === 'rejected';
    if (filterType === 'high_risk') return matchesSearch && (c.risk_level === 'High' || c.risk_level === 'Critical' || c.trust_safety_status === 'flagged');
    if (filterType === 'today') {
      const isToday = new Date(c.createdAt).toDateString() === new Date().toDateString();
      return matchesSearch && isToday;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16 font-sans relative">
      {/* Header and Subheading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Employer Moderation Console <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold uppercase px-2.5 py-1 rounded-full border border-indigo-100">Enterprise Admin</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Platform Security & Risk Governance Panel • Manage final employer activations, escalations, and audits.
          </p>
        </div>
        <button
          onClick={fetchCompanies}
          className="px-4.5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <Activity size={13} className="animate-pulse" /> Refresh Console
        </button>
      </div>

      {/* Dynamic Statistics Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Accounts', value: stats.total, icon: <Building2 size={20} />, bg: 'bg-indigo-50/70 border-indigo-100 text-indigo-600' },
          { label: 'Active Employers', value: stats.active, icon: <ShieldCheck size={20} />, bg: 'bg-emerald-50/70 border-emerald-100 text-emerald-600' },
          { label: 'Awaiting Activation', value: stats.pending, icon: <Clock size={20} />, bg: 'bg-amber-50/70 border-amber-100 text-amber-600' },
          { label: 'High Risk Alerts', value: stats.highRisk, icon: <AlertTriangle size={20} />, bg: 'bg-rose-50/70 border-rose-100 text-rose-600' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-5 rounded-3xl border bg-white flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-950 leading-tight">{item.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters Controls Bar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-center bg-slate-50 p-3 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by company, location, domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all text-xs font-bold shadow-sm"
          />
        </div>

        <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-1 w-full xl:w-auto overflow-x-auto gap-1">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'pending', label: 'Pending Approval' },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'high_risk', label: '⚠️ High Risk' },
            { id: 'today', label: 'Today Requests' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterType(type.id)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1 xl:flex-initial text-center whitespace-nowrap ${filterType === type.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Corporate Modern Grid / List Layout */}
      {loading ? (
        <div className="p-24 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing directory...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-24 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
            <Building2 size={26} />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 font-extrabold text-base">No employer records found</p>
            <p className="text-slate-400 text-xs font-medium">No organizations correspond to your selection criteria.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pl-6 pr-4 py-4.5">Company Info</th>
                  <th className="px-5 py-4.5">Location & Sub-Date</th>
                  <th className="px-5 py-4.5">Security Scorecard</th>
                  <th className="px-5 py-4.5">Mod / verification status</th>
                  <th className="pl-4 pr-6 py-4.5 text-right">Verification Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((company, idx) => {
                  const isHighRisk = company.risk_level === 'High' || company.risk_level === 'Critical' || company.trust_safety_status === 'flagged';
                  const riskColorClass = company.risk_level === 'Critical' || company.risk_level === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    company.risk_level === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100';

                  // Dynamic Badge for General Admin Status
                  const isEmailVerified = company.email_verified;
                  const isTSCleared = company.trust_safety_status === 'cleared' || company.trust_safety_status === 'approved';
                  const isDocsVerified = company.documents_verified;

                  const canApprove = isEmailVerified && isTSCleared && isDocsVerified;

                  return (
                    <motion.tr
                      key={company._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-slate-50/50 transition-all duration-200 group"
                    >
                      {/* Column 1: Company Profile */}
                      <td className="pl-6 pr-4 py-5 max-w-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden flex-shrink-0 shadow-sm relative group-hover:scale-105 transition-all duration-300">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="w-full h-full object-cover p-0.5" />
                            ) : (
                              <Building2 className="text-slate-400" size={18} />
                            )}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate text-sm sm:text-base leading-tight">
                              {company.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                              <Mail size={11} className="text-slate-400 flex-shrink-0" />
                              <span className="truncate max-w-[150px]">{company.official_work_email || company.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Location & Created At */}
                      <td className="px-5 py-5">
                        <div className="space-y-1 text-xs font-bold text-slate-700">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin size={12} className="text-indigo-500" />
                            <span>{company.company_location || 'Not Specified'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
                            <Calendar size={11} />
                            <span>Submitted: {formatDate(company.createdAt)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Column 3: Trust & Risk Assessment */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          {/* Trust Score indicator */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-lg">
                                Score: {company.trust_score || 0}
                              </span>
                            </div>
                            <div className="w-20 bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, company.trust_score || 0))}%` }}
                              />
                            </div>
                          </div>

                          {/* Risk Level Badge */}
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${riskColorClass}`}>
                            {company.risk_level || 'Low'} Risk
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Verification Badges */}
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1.5">
                          {/* Platform Status */}
                          {company.status === 'approved' ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 w-max">
                              <CheckCircle size={9} /> Approved
                            </span>
                          ) : company.status === 'rejected' ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border-rose-100 flex items-center gap-1 w-max">
                              <XCircle size={9} /> Rejected
                            </span>
                          ) : !company.email_verified ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 w-max">
                              <Loader2 size={9} className="animate-spin text-slate-400" /> Pending Email
                            </span>
                          ) : company.trust_safety_status === 'pending' ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1 w-max">
                              <Loader2 size={9} className="animate-spin text-amber-500" /> Pending Trust
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100 flex items-center gap-1 w-max">
                              <Loader2 size={9} className="animate-spin text-violet-500" /> Pending Final Approval
                            </span>
                          )}

                          {/* T&S Badge */}
                          {isTSCleared ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-100 w-max">
                              T&S: Cleared ✅
                            </span>
                          ) : company.trust_safety_status === 'escalated' ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-extrabold bg-violet-50 text-violet-600 border border-violet-100 w-max animate-pulse">
                              T&S: Escalated ⚡
                            </span>
                          ) : company.trust_safety_status === 'flagged' ? (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-extrabold bg-rose-50 text-rose-600 border-rose-100 w-max">
                              T&S: High Risk ⚠️
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-extrabold bg-slate-100 text-slate-400 border border-slate-200 w-max">
                              T&S: Unreviewed ⏳
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Action Buttons */}
                      <td className="pl-4 pr-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Review Details Action */}
                          <button
                            onClick={() => handleOpenDrawer(company._id)}
                            className="px-3.5 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 active:scale-95 border border-slate-200"
                          >
                            Review Details <ChevronRight size={11} />
                          </button>

                          {isAuthorizedAdmin && (
                            <>
                              {company.status === 'approved' ? (
                                <button
                                  onClick={() => {
                                    setRejectCompanyId(company._id);
                                    setRejectModalOpen(true);
                                  }}
                                  className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 inline-flex items-center gap-1"
                                >
                                  <XCircle size={11} /> Revoke
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {/* Approve with Strict Gate */}
                                  <div className="relative group">
                                    <button
                                      disabled={!canApprove || actionProcessing}
                                      onClick={() => handleApproveCompany(company._id)}
                                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-1 active:scale-95 ${canApprove
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent shadow-sm'
                                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                        }`}
                                    >
                                      <CheckCircle size={11} /> Approve
                                    </button>

                                    {/* Tooltip explanation */}
                                    {!canApprove && (
                                      <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover:block w-48 bg-slate-900 text-white text-[9px] leading-relaxed p-2.5 rounded-xl shadow-lg z-30 font-black tracking-wide">
                                        ⚠️ Gated Access. Complete verification tasks before final approval:
                                        <div className="mt-1.5 space-y-1 font-bold border-t border-slate-800 pt-1.5">
                                          <p className={isEmailVerified ? "text-emerald-400" : "text-slate-400"}>• Email Verified: {isEmailVerified ? "✅" : "❌"}</p>
                                          <p className={isTSCleared ? "text-emerald-400" : "text-slate-400"}>• Trust cleared: {isTSCleared ? "✅" : "❌"}</p>
                                          <p className={isDocsVerified ? "text-emerald-400" : "text-slate-400"}>• Docs Verified: {isDocsVerified ? "✅" : "❌"}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => {
                                      setRejectCompanyId(company._id);
                                      setRejectModalOpen(true);
                                    }}
                                    className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 inline-flex items-center gap-1"
                                  >
                                    <XCircle size={11} /> Reject
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Advanced sliding Side Drawer */}
      {createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950 z-40 cursor-pointer"
              />

              {/* Sliding Drawer Body */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen max-h-screen w-full sm:w-[600px] bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col"
              >
                {drawerLoading ? (
                  <div className="h-full w-full flex flex-col items-center justify-center space-y-4 p-8">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing verification dossier...</p>
                  </div>
                ) : drawerData ? (
                  <div className="flex flex-col h-full overflow-hidden w-full">
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-slate-100/80 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-slate-50/20 backdrop-blur-md">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/60 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md p-1 transition-transform hover:scale-105 duration-300">
                          {drawerData.company.logo ? (
                            <img src={drawerData.company.logo} alt={drawerData.company.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Building2 className="text-indigo-500" size={20} />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h2 className="font-black text-slate-900 text-lg tracking-tight font-sans leading-none">{drawerData.company.name}</h2>
                          <span className="text-[10px] font-black text-indigo-600/80 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                            <ShieldCheck size={11} className="text-indigo-500 animate-pulse" /> Enterprise KYC Dossier Review
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setDrawerOpen(false)}
                        className="w-9 h-9 rounded-full border border-slate-200/80 hover:bg-slate-50 transition-all flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>

                    {/* Drawer Body Contents */}
                    <div data-lenis-prevent className="p-6 space-y-8 flex-1 overflow-y-auto font-sans">
                      {/* Metrics scorecard Row */}
                      <div className="grid grid-cols-2 gap-5 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/40 p-5 rounded-3xl border border-indigo-100/50 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Activity size={11} className="text-indigo-500" /> Trust Assessment Score
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-indigo-600 tracking-tight font-sans">{drawerData.company.trust_score || 0}</span>
                            <span className="text-xs font-black text-slate-400">/ 100</span>
                          </div>
                          {/* Mini progress bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div 
                              className="bg-indigo-600 h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${drawerData.company.trust_score || 0}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 pl-4 border-l border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Shield size={11} className="text-indigo-500" /> Threat Risk Profile
                          </span>
                          <div className="flex flex-col gap-1.5 mt-1">
                            <span className={`px-3 py-1 border text-[11px] font-black uppercase tracking-widest rounded-xl w-max flex items-center gap-1 shadow-sm ${
                              drawerData.company.risk_level === 'Critical' || drawerData.company.risk_level === 'High' 
                                ? 'bg-rose-50 border-rose-100 text-rose-600' :
                              drawerData.company.risk_level === 'Medium' 
                                ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                                  'bg-emerald-50 border-emerald-100 text-emerald-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${
                                drawerData.company.risk_level === 'Critical' || drawerData.company.risk_level === 'High' ? 'bg-rose-500' :
                                drawerData.company.risk_level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`} />
                              {drawerData.company.risk_level || 'Low'} Risk
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Vetting Status: Passed V1 Vetting</span>
                          </div>
                        </div>
                      </div>

                      {/* Summary Card Checklist */}
                      <div className="space-y-3.5">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck size={14} className="text-indigo-600 animate-pulse" /> Verification Checklist Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { label: "Official Email Verified", val: drawerData.company.email_verified },
                            { label: "Website Domain Verified", val: drawerData.company.website_verified },
                            { label: "GST Verification status", val: drawerData.company.gst_verified },
                            { label: "KYC Documents Verified", val: drawerData.company.documents_verified },
                          ].map((chk, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
                              <span className="text-[11px] font-extrabold text-slate-600 leading-tight pr-2">{chk.label}</span>
                              {chk.val ? (
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1 bg-emerald-50 border border-emerald-100/60 px-2.5 py-1 rounded-lg flex-shrink-0 animate-fade-in-up">
                                  Verified <CheckCircle size={10} />
                                </span>
                              ) : (
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg flex-shrink-0">
                                  Pending <Clock size={10} />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Company Information section */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Info size={14} className="text-indigo-600" /> Administrative Metadata
                        </h3>
                        <div className="border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white shadow-sm">
                          <div className="flex p-4 justify-between items-center">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">Sector / Industry</span>
                            <span className="text-slate-900 font-extrabold">{drawerData.company.industry?.toUpperCase() || 'GENERAL'}</span>
                          </div>
                          <div className="flex p-4 justify-between items-center">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">Staffing Pool size</span>
                            <span className="text-slate-900 font-extrabold">{drawerData.company.company_size || 'Not specified'} employees</span>
                          </div>
                          <div className="flex p-4 justify-between items-center">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">Business registration codes</span>
                            <span className="font-mono text-[10px] tracking-wide text-slate-800 bg-slate-50 border border-slate-100 rounded-lg p-1.5 px-2.5">
                              GST: <span className="font-black text-indigo-600">{drawerData.company.gst_number || 'N/A'}</span> | PAN: <span className="font-black text-indigo-600">{drawerData.company.pan_number || 'N/A'}</span>
                            </span>
                          </div>
                          <div className="flex p-4 justify-between items-center">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">Main Location</span>
                            <span className="inline-flex items-center gap-1.5 text-slate-900 font-extrabold">
                              <MapPin size={12} className="text-indigo-500" /> {drawerData.company.company_location}
                            </span>
                          </div>
                          <div className="flex p-4 justify-between items-center">
                            <span className="text-slate-400 uppercase tracking-wider text-[9px] font-black">Registered Owner</span>
                            <span className="inline-flex items-center gap-1.5 text-indigo-600 font-black bg-indigo-50/50 border border-indigo-100/40 rounded-xl px-2.5 py-1">
                              <User size={11} className="text-indigo-500" /> 
                              {drawerData.company.owner_user_id 
                                ? `${drawerData.company.owner_user_id.firstName || ''} (${drawerData.company.owner_user_id.email})` 
                                : 'System Registered'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progression Approval Timeline */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Clock size={14} className="text-indigo-600" /> Progression Approval Timeline
                        </h3>
                        <div className="relative border-l border-slate-100 pl-5.5 space-y-6 text-xs font-extrabold ml-1.5">
                          {[
                            { title: 'Submitted to Platform', active: true, desc: `Registration request received on ${formatDate(drawerData.company.createdAt)}` },
                            { title: 'Official Email Verified', active: drawerData.company.email_verified, desc: drawerData.company.email_verified ? 'Successfully verified corporate address' : 'Awaiting OTP authentication' },
                            { title: 'Trust & Safety Cleared', active: drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved', desc: drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved' ? 'Passed KYC manual and automated checks' : 'Awaiting trust officer clearing' },
                            { title: 'Platform final Activation', active: drawerData.company.status === 'approved', desc: drawerData.company.status === 'approved' ? 'Activated as an authorized platform employer' : 'Pending Platform Admin final approval decision' },
                          ].map((item, idx) => (
                            <div key={idx} className="relative group">
                              {/* Dot overlay */}
                              <div className={`absolute -left-[27.5px] top-1 w-3 h-3 rounded-full border bg-white flex items-center justify-center transition-all group-hover:scale-125 ${
                                item.active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'
                              }`} />
                              <div className="space-y-0.5">
                                <p className={`font-black uppercase tracking-wide text-[11px] ${item.active ? 'text-slate-800' : 'text-slate-400'}`}>{item.title}</p>
                                <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Uploaded Documents List */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <FileText size={14} className="text-indigo-600" /> Employer Registration Documents
                        </h3>
                        {drawerData.documents.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No business verification papers loaded yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-3.5">
                            {drawerData.documents.map((doc) => (
                              <div key={doc._id} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 flex-shrink-0">
                                    <FileText size={18} />
                                  </div>
                                  <div className="min-w-0 space-y-0.5">
                                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-wide truncate max-w-[200px]">
                                      {doc.document_type?.replace('_', ' ')}
                                    </p>
                                    <div className="inline-flex items-center gap-1.5">
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">Status:</span>
                                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                                        doc.verification_status === 'approved' 
                                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' 
                                          : doc.verification_status === 'rejected' 
                                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                                            : 'bg-amber-50 text-amber-700 border-amber-100'
                                      }`}>
                                        {doc.verification_status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <a 
                                  href={doc.document_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors rounded-xl flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider active:scale-95 shadow-sm"
                                >
                                  View File <ArrowUpRight size={12} />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Verification Activity Timeline Section */}
                      <div className="space-y-4">
                        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-100">
                          <div className="space-y-0.5">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <History size={14} className="text-indigo-600 animate-pulse" /> Verification Activity Timeline
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold">Enterprise-grade compliance verification logging.</p>
                          </div>

                          {/* Optional Filter Tabs */}
                          <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 rounded-xl text-[9px] font-black uppercase tracking-wider self-start sm:self-auto">
                            {[
                              { key: 'all', label: 'All' },
                              { key: 'verified', label: 'Verified' },
                              { key: 'pending', label: 'Pending' },
                              { key: 'rejected', label: 'Rejected' },
                              { key: 'auto', label: 'Auto Verified' }
                            ].map((tab) => (
                              <button
                                key={tab.key}
                                onClick={() => setTimelineFilter(tab.key)}
                                className={`px-2.5 py-1.5 rounded-lg transition-all ${timelineFilter === tab.key
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                  }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {drawerData.logs.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">No historical operations logged for this candidate.</p>
                        ) : (
                          (() => {
                            const sortedLogs = [...drawerData.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                            const parsedLogs = sortedLogs.map(log => ({
                              original: log,
                              parsed: parseAuditLog(log)
                            }));

                            const filteredLogs = parsedLogs.filter(({ parsed }) => {
                              if (timelineFilter === 'all') return true;
                              if (timelineFilter === 'verified') return parsed.status === 'verified';
                              if (timelineFilter === 'pending') return parsed.status === 'pending' || parsed.status === 'review';
                              if (timelineFilter === 'rejected') return parsed.status === 'rejected';
                              if (timelineFilter === 'auto') return parsed.type === 'Auto Verification';
                              return true;
                            });

                            if (filteredLogs.length === 0) {
                              return (
                                <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-2 bg-slate-50/50">
                                  <History className="mx-auto text-slate-300" size={20} />
                                  <p className="text-xs text-slate-400 italic font-medium">No actions matched the "{timelineFilter}" filter criteria.</p>
                                </div>
                              );
                            }

                            return (
                              <div className="relative border-l-2 border-slate-100 pl-4.5 space-y-5 ml-2 mt-2">
                                {filteredLogs.map(({ original, parsed }) => {
                                  let badgeColor = 'bg-amber-50 text-amber-700 border-amber-100';
                                  let iconBg = 'bg-amber-50 border-amber-100 text-amber-600';
                                  let statusLabel = 'In Review';
                                  let StatusIcon = Clock;

                                  if (parsed.status === 'verified') {
                                    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                                    iconBg = 'bg-emerald-50 border-emerald-100 text-emerald-600';
                                    statusLabel = 'Verified';
                                    StatusIcon = CheckCircle;
                                  } else if (parsed.status === 'rejected') {
                                    badgeColor = 'bg-rose-50 text-rose-700 border-rose-100';
                                    iconBg = 'bg-rose-50 border-rose-100 text-rose-600';
                                    statusLabel = 'Rejected';
                                    StatusIcon = XCircle;
                                  } else if (parsed.status === 'review') {
                                    badgeColor = 'bg-yellow-50 text-yellow-800 border-yellow-200';
                                    iconBg = 'bg-yellow-50 border-yellow-100 text-yellow-600';
                                    statusLabel = 'Needs Attention';
                                    StatusIcon = AlertTriangle;
                                  }

                                  return (
                                    <div key={original._id} className="relative group">
                                      {/* Physical timeline dot */}
                                      <div className={`absolute -left-[24.5px] top-4 w-2.5 h-2.5 rounded-full border-2 bg-white transition-all duration-200 group-hover:scale-125 ${parsed.status === 'verified' ? 'border-emerald-500 bg-emerald-500' : parsed.status === 'rejected' ? 'border-rose-500 bg-rose-500' : 'border-amber-400 bg-amber-400'
                                        }`} />

                                      {/* Activity Card */}
                                      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-200">
                                        {/* Header block */}
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                          <div className="flex items-center gap-2.5">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${iconBg}`}>
                                              <StatusIcon size={14} />
                                            </div>
                                            <div>
                                              <h4 className="text-[11px] font-black text-slate-800 tracking-wide uppercase leading-tight">{parsed.title}</h4>
                                              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                                <Clock size={9} /> {formatTimestamp(original.timestamp)}
                                              </span>
                                            </div>
                                          </div>

                                          {/* Status and Type Badges */}
                                          <div className="flex gap-1 flex-shrink-0">
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${badgeColor}`}>
                                              {statusLabel}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${parsed.type === 'Auto Verification' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-100 text-slate-600'
                                              }`}>
                                              {parsed.type}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                          {parsed.desc}
                                        </p>

                                        {/* Operator metadata block */}
                                        <div className="pt-2 border-t border-slate-50 flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                          <span className="inline-flex items-center gap-1">
                                            <User size={10} className="text-slate-400" /> Operator: <span className="text-slate-600 font-extrabold">{parsed.adminName}</span>
                                          </span>
                                          <span className="inline-flex items-center gap-1 flex-shrink-0">
                                            <Shield size={10} className="text-slate-400" /> Role: <span className="text-slate-600 font-extrabold">{parsed.adminRole}</span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()
                        )}
                      </div>
                    </div>

                    {/* Drawer Sticky Bottom Actions Panel */}
                    {isAuthorizedAdmin && (
                      <div className="p-4 border-t border-slate-100 bg-white flex gap-3 shadow-2xl z-20">
                        {drawerData.company.status !== 'approved' && (
                          <>
                            {/* Approve gated */}
                            <div className="relative flex-1 group">
                              <button
                                disabled={!(drawerData.company.email_verified && (drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved') && drawerData.company.documents_verified) || actionProcessing}
                                onClick={() => handleApproveCompany(drawerData.company._id)}
                                className={`w-full py-3 px-4.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${drawerData.company.email_verified && (drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved') && drawerData.company.documents_verified
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  }`}
                              >
                                <CheckCircle size={14} /> Approve & Activate
                              </button>

                              {!(drawerData.company.email_verified && (drawerData.company.trust_safety_status === 'cleared' || drawerData.company.trust_safety_status === 'approved') && drawerData.company.documents_verified) && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 hidden group-hover:block bg-slate-950 text-white text-[9px] p-2.5 rounded-xl leading-relaxed z-30 font-bold tracking-wide shadow-xl">
                                  ⚠️ Complete verification pipeline tasks before promoting activation!
                                </div>
                              )}
                            </div>

                            <button
                              disabled={actionProcessing}
                              onClick={() => {
                                setRejectCompanyId(drawerData.company._id);
                                setRejectModalOpen(true);
                              }}
                              className="flex-1 py-3 px-4.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all rounded-2xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-1.5 active:scale-95 border border-rose-100 shadow-sm"
                            >
                              <XCircle size={14} /> Reject Request
                            </button>
                          </>
                        )}

                        {/* Escalate button */}
                        {drawerData.company.trust_safety_status !== 'escalated' && (
                          <button
                            disabled={actionProcessing}
                            onClick={() => {
                              setEscalateCompanyId(drawerData.company._id);
                              setEscalateModalOpen(true);
                            }}
                            className="px-4 py-3 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-all rounded-2xl text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                          >
                            <Lock size={13} /> Escalate Case
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Corporate Rejection Reason Modal Popup */}
      {createPortal(
        <AnimatePresence>
          {rejectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setRejectModalOpen(false)}
                className="fixed inset-0 bg-slate-950"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 max-w-md w-full relative z-10 space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="text-rose-500" size={18} /> Confirm Rejection Decision
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">
                    Provide the formal reason for rejecting this employer request. This message will be transmitted directly to the partner via email.
                  </p>
                </div>

                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason description (e.g., website domain inactive, unverified GST cert, mismatch contact details)..."
                  className="w-full border border-slate-200 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-50 p-3 text-xs font-bold rounded-xl shadow-inner leading-relaxed resize-none"
                />

                <div className="flex gap-2.5">
                  <button
                    disabled={actionProcessing}
                    onClick={handleRejectSubmit}
                    className="flex-grow py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => {
                      setRejectModalOpen(false);
                      setRejectionReason('');
                    }}
                    className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Corporate Case Escalation Modal Popup */}
      {createPortal(
        <AnimatePresence>
          {escalateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setEscalateModalOpen(false)}
                className="fixed inset-0 bg-slate-950"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 max-w-md w-full relative z-10 space-y-4"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Lock className="text-indigo-600" size={18} /> Escalate Dossier to Super Admin
                  </h3>
                  <p className="text-slate-400 text-xs font-medium">
                    Explain the legal risk, policy violation, or mismatch that triggers the need for a manual override by a Super Administrator.
                  </p>
                </div>

                <textarea
                  rows={4}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Escalation explanation (suspicious domain, high risk profile, compliance concerns)..."
                  className="w-full border border-slate-200 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-50 p-3 text-xs font-bold rounded-xl shadow-inner leading-relaxed resize-none"
                />

                <div className="flex gap-2.5">
                  <button
                    disabled={actionProcessing}
                    onClick={handleEscalateSubmit}
                    className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    Confirm Escalation
                  </button>
                  <button
                    onClick={() => {
                      setEscalateModalOpen(false);
                      setEscalationReason('');
                    }}
                    className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default Companies;
