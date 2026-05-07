import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Mail, 
  Phone, 
  X,
  Globe,
  Briefcase,
  Users,
  MapPin,
  Upload,
  Link2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  User,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerCompanyApi, resubmitCompanyApi } from '../services/companyApi';
import { getMyProfile } from '../services/api';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for upload animation progress
  const [uploadProgress, setUploadProgress] = useState({
    gst_cert: 0,
    pan_card: 0,
    business_proof: 0,
    company_proof: 0
  });

  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    website_url: '',
    about_company: '',
    logo: '',
    official_work_email: '',
    contact_person_name: '',
    mobile_number: '',
    company_location: '',
    gst_number: '',
    cin_number: '',
    pan_number: '',
    gst_cert: null,
    pan_card: null,
    business_proof: null,
    company_proof: null
  });

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('company_reg_draft');
    if (savedDraft) {
      try {
        const { formData: savedForm, step: savedStep } = JSON.parse(savedDraft);
        if (window.confirm("Restore your previously saved company registration draft?")) {
          setFormData(prev => ({ ...prev, ...savedForm }));
          setStep(savedStep || 1);
          toast.success("Draft restored successfully!");
        } else {
          localStorage.removeItem('company_reg_draft');
        }
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // Check company registration permission on mount
  useEffect(() => {
    const checkCompanyStatus = async () => {
      try {
        const data = await getMyProfile();
        if (data.success) {
          const company = data.profile?.userId?.company_id;
          if (company) {
            if (company.status === 'pending' || company.verification_status === 'pending') {
              toast.error("You already have a company registration request pending review.", { id: "pending-err" });
              navigate('/dashboard');
            } else if (company.status === 'approved' && company.verification_status === 'approved') {
              toast.success("Your company is already approved!", { id: "approved-success" });
              navigate('/dashboard');
            } else if (company.status === 'rejected' || company.verification_status === 'rejected') {
              // Prepopulate details for update and resubmission
              setFormData(prev => ({
                ...prev,
                company_name: company.name || '',
                official_work_email: company.official_work_email || '',
                contact_person_name: company.contact_person_name || '',
                mobile_number: company.mobile_number || '',
                company_location: company.company_location || '',
                website_url: company.website_url || '',
                about_company: company.about_company || '',
                industry: company.industry || '',
                company_size: company.company_size || '',
                gst_number: company.gst_number || '',
                cin_number: company.cin_number || '',
                pan_number: company.pan_number || ''
              }));
              setIsEditMode(true);
              toast.error(`Company Verification Rejected. Reason: "${company.rejectionReason || 'Invalid GST Document'}"`, { id: "rejected-warning-init", duration: 7000 });
            }
          }
        }
      } catch (err) {
        console.error("Error checking company status:", err);
      }
    };
    checkCompanyStatus();
  }, [navigate]);

  // Autosave draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Create copy of state without files (since Files can't be stringified)
      const draftData = { ...formData };
      delete draftData.gst_cert;
      delete draftData.pan_card;
      delete draftData.business_proof;
      delete draftData.company_proof;
      
      localStorage.setItem('company_reg_draft', JSON.stringify({ formData: draftData, step }));
      toast.success("Draft saved successfully", { id: 'autosave-toast', duration: 1500 });
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, step]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    // Validate type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, PNG, and JPG/JPEG files are accepted");
      return;
    }

    setFormData(prev => ({ ...prev, [field]: file }));
    
    // Animated progress simulation
    setUploadProgress(prev => ({ ...prev, [field]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [field]: progress }));
    }, 120);
  };

  const removeFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setUploadProgress(prev => ({ ...prev, [field]: 0 }));
  };

  // Validators
  const isEmailGmailOrYahoo = () => {
    const freeDomains = ['gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'icloud.com'];
    if (!formData.official_work_email) return false;
    const domain = formData.official_work_email.toLowerCase().split('@')[1];
    return freeDomains.includes(domain);
  };

  const isGstValid = () => {
    if (!formData.gst_number) return true; // Optional field
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(formData.gst_number.toUpperCase().trim());
  };

  const isPanValid = () => {
    if (!formData.pan_number) return true; // Optional field
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(formData.pan_number.toUpperCase().trim());
  };

  const isCinValid = () => {
    if (!formData.cin_number) return true; // Optional field
    const cinRegex = /^[U|L][0-9]{5}[A-Z]{2}[0-9]{4}[P|G][L|T][C][0-9]{6}$/;
    return cinRegex.test(formData.cin_number.toUpperCase().trim());
  };

  const isMobileValid = () => {
    if (!formData.mobile_number) return false;
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(formData.mobile_number.trim());
  };

  // Steps handling validations
  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.company_name) return "Company Name is required";
      if (!formData.industry) return "Industry is required";
      if (!formData.company_size) return "Company Size is required";
      if (!formData.about_company) return "About Company is required";
    }
    if (step === 2) {
      if (!formData.official_work_email) return "Work Email is required";
      if (!formData.contact_person_name) return "Contact Person Name is required";
      if (!formData.mobile_number) return "Mobile Number is required";
      if (!isMobileValid()) return "Mobile Number must be exactly 10 digits";
      if (!formData.company_location) return "Company Location is required";
    }
    if (step === 3) {
      if (formData.gst_number && !isGstValid()) return "Invalid GST Number format";
      if (formData.pan_number && !isPanValid()) return "Invalid PAN Number format";
      if (formData.cin_number && !isCinValid()) return "Invalid CIN Number format";
    }
    if (step === 4) {
      // Optional files check, can always go forward
    }
    return null;
  };

  const handleNext = () => {
    const error = validateCurrentStep();
    if (error) {
      toast.error(error);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateCurrentStep();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      const dataPayload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          dataPayload.append(key, formData[key]);
        }
      });

      const response = isEditMode 
        ? await resubmitCompanyApi(dataPayload)
        : await registerCompanyApi(dataPayload);

      if (response.success) {
        toast.success(isEditMode ? "Resubmission successful! Back to admin review queue." : "Registration submitted! Our Trust & Safety team is verifying your details.", { duration: 6000 });
        localStorage.removeItem('company_reg_draft'); // Clean draft on success
        navigate("/dashboard", { state: { bannerMessage: isEditMode ? "Your resubmitted company request is currently under review." : "Your company verification request is currently under review." } });
      } else {
        toast.error(response.message || "Failed to submit registration");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Progress steps indicators
  const stepsList = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Contacts" },
    { num: 3, label: "Government IDs" },
    { num: 4, label: "Documents" },
    { num: 5, label: "Submit" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-12 px-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex flex-col lg:flex-row relative"
      >
        {/* Close Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-20"
        >
          <X size={24} />
        </button>

        {/* Left Sidebar - Dynamic Verification Checklist */}
        <div className="lg:w-[32%] bg-[#f7fbf8] flex flex-col border-r border-slate-100 p-8 lg:p-10">
          <div className="mb-10">
             <div className="w-16 h-16 bg-emerald-100/70 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-sm">
                <Building2 size={36} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                {isEditMode ? "Update & Resubmit" : "Register Employer"}
             </h2>
             <p className="text-emerald-700 font-bold text-xs mt-2 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} /> Trusted Verification
             </p>
          </div>

          {/* Stepper Status UI */}
          <div className="relative mb-10 flex flex-row lg:flex-col justify-between lg:justify-start gap-4 lg:gap-8 items-center lg:items-start overflow-x-auto py-2">
            {stepsList.map((s, index) => (
              <div key={s.num} className="flex items-center gap-3 shrink-0">
                <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center transition-all ${
                  step === s.num 
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md' 
                    : step > s.num 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <CheckCircle2 size={16} /> : s.num}
                </div>
                <span className={`hidden lg:inline text-[13px] font-bold ${step === s.num ? 'text-slate-900 font-black' : step > s.num ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Verification Process Notice */}
          <div className="mt-auto bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1">
              <ShieldCheck className="text-emerald-500" size={14} /> Trust Boost Indicators
            </h5>
            <ul className="space-y-3">
              <li className="flex gap-2 text-[10px] text-slate-600 font-semibold">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${isEmailGmailOrYahoo() === false && formData.official_work_email ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Official Company Domain (+25% trust)
              </li>
              <li className="flex gap-2 text-[10px] text-slate-600 font-semibold">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${formData.website_url ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Company Website Link (+15% trust)
              </li>
              <li className="flex gap-2 text-[10px] text-slate-600 font-semibold">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${isGstValid() && formData.gst_number ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                GST Verification (+20% trust)
              </li>
              <li className="flex gap-2 text-[10px] text-slate-600 font-semibold">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${formData.gst_cert || formData.pan_card ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Verification Documents (+10% trust)
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Dynamic Step Form Content */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-between min-h-[620px]">
          <div>
            <div className="mb-10">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                Step {step} of 5
              </span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
                {step === 1 && "Basic Company Profile"}
                {step === 2 && "Contact Representative Details"}
                {step === 3 && "Government Business Identifiers"}
                {step === 4 && "Support Verification Documents"}
                {step === 5 && "Review & Submit Credentials"}
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 font-medium">
                Provide genuine details to acquire high trusted employer verification status.
              </p>
            </div>

            <form onSubmit={e => e.preventDefault()} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Name *</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="text" name="company_name" required value={formData.company_name} onChange={handleChange} placeholder="e.g. WorknAI Pvt Ltd" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} placeholder="https://www.company.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry *</label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select name="industry" required value={formData.industry} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer">
                            <option value="">Select industry</option>
                            <option value="IT">Information Technology</option>
                            <option value="Finance">Finance / Banking</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education / EdTech</option>
                            <option value="HR">Human Resources</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Size *</label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <select name="company_size" required value={formData.company_size} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium appearance-none cursor-pointer">
                            <option value="">Select size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="500+">500+ employees</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Logo URL (Optional)</label>
                      <div className="relative">
                        <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="url" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://logo.com/image.png" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Description *</label>
                      <textarea name="about_company" required value={formData.about_company} onChange={handleChange} placeholder="Briefly describe what your organization does..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium min-h-[110px] resize-none" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Work Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="email" name="official_work_email" required value={formData.official_work_email} onChange={handleChange} placeholder="hr@company.com" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                        {isEmailGmailOrYahoo() && (
                          <div className="flex items-center gap-1.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-700 font-bold leading-tight mt-2">
                            <ShieldAlert size={14} className="shrink-0 text-amber-500" />
                            Recommended: Use an official work email domain (e.g. hr@company.com) to earn +25% trust points instantly!
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Person Name (HR/Recruiter) *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="text" name="contact_person_name" required value={formData.contact_person_name} onChange={handleChange} placeholder="Enter your full name" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mobile Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="tel" name="mobile_number" required value={formData.mobile_number} onChange={handleChange} placeholder="10-digit phone number" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Location *</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                          <input type="text" name="company_location" required value={formData.company_location} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex gap-3 text-xs text-emerald-800 font-medium leading-relaxed">
                      <Info className="text-emerald-600 mt-0.5 shrink-0" size={16} />
                      Providing legal business details ensures that your candidates verify you as a trusted and secure employer. Double check formats.
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GST Number (Optional)</label>
                        {formData.gst_number && (
                          <span className={`text-[10px] font-black uppercase ${isGstValid() ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isGstValid() ? 'Format Valid ✔' : 'Invalid Format'}
                          </span>
                        )}
                      </div>
                      <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} placeholder="27ABCDE1234F1Z5" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold uppercase" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PAN Number (Optional)</label>
                          {formData.pan_number && (
                            <span className={`text-[10px] font-black uppercase ${isPanValid() ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isPanValid() ? 'Format Valid ✔' : 'Invalid Format'}
                            </span>
                          )}
                        </div>
                        <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} placeholder="ABCDE1234F" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold uppercase" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CIN Number (Optional)</label>
                          {formData.cin_number && (
                            <span className={`text-[10px] font-black uppercase ${isCinValid() ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isCinValid() ? 'Format Valid ✔' : 'Invalid Format'}
                            </span>
                          )}
                        </div>
                        <input type="text" name="cin_number" value={formData.cin_number} onChange={handleChange} placeholder="U72900MH2025PTC123456" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold uppercase" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {[
                      { key: 'gst_cert', label: 'GST Certificate', helper: 'Govt issued GST certificate (PDF/PNG)' },
                      { key: 'pan_card', label: 'PAN Card Doc', helper: 'Official company PAN details' },
                      { key: 'business_proof', label: 'Business Proof', helper: 'COI or Shops establishment cert' },
                      { key: 'company_proof', label: 'Utility Bill/Other Proof', helper: 'Utility bill matching name & location' }
                    ].map(doc => (
                      <div key={doc.key} className="p-5 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-slate-50/50 transition-all">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">{doc.label}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-none">{doc.helper}</p>

                        {!formData[doc.key] ? (
                          <div className="relative mt-4 h-24 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 cursor-pointer overflow-hidden hover:bg-slate-100/50 transition-colors">
                            <Upload className="text-slate-300 mb-1" size={24} />
                            <span className="text-[10px] font-bold text-slate-500">Drag & Drop or Click to Upload</span>
                            <span className="text-[8px] font-bold text-slate-400 mt-1">Accepted: PDF, PNG, JPG (Max 5MB)</span>
                            <input 
                              type="file" 
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, doc.key)}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                          </div>
                        ) : (
                          <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="text-emerald-600 shrink-0" size={20} />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-emerald-900 truncate max-w-[120px]">{formData[doc.key].name}</p>
                                <p className="text-[8px] font-bold text-emerald-600">{(formData[doc.key].size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeFile(doc.key)}
                              className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-full shrink-0"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}

                        {uploadProgress[doc.key] > 0 && uploadProgress[doc.key] < 100 && (
                          <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
                            <div className="bg-emerald-500 h-1 transition-all duration-150" style={{ width: `${uploadProgress[doc.key]}%` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Trust Summary Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-[#f2faf5] border border-emerald-100 relative overflow-hidden flex items-center gap-6">
                      <div className="shrink-0 w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/10">
                        <ShieldCheck size={36} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-emerald-950">Industrial Grade Encryption Shielded</h4>
                        <p className="text-xs text-emerald-700 font-medium leading-relaxed mt-1">
                          Your uploaded legal credentials are strictly encrypted and used exclusively for Trust & Safety verification checks.
                        </p>
                      </div>
                      <div className="absolute right-4 bottom-4 opacity-[0.03] pointer-events-none">
                        <Building2 size={120} />
                      </div>
                    </div>

                    {/* Summary Matrix Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Company Essentials</h5>
                        <p className="text-sm font-bold text-slate-800">{formData.company_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formData.industry} • {formData.company_size} Employees</p>
                        <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                          <Globe size={12} /> {formData.website_url || "No website"}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Contact Representative</h5>
                        <p className="text-sm font-bold text-slate-800">{formData.contact_person_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formData.official_work_email}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formData.mobile_number} • {formData.company_location}</p>
                      </div>
                    </div>

                    {/* Badge Matrix */}
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="text-emerald-500" size={14} /> Secure Verification
                      </span>
                      <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="text-emerald-500" size={14} /> Fraud Protection
                      </span>
                      <span className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="text-emerald-500" size={14} /> Trusted Employer Process
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Stepper Wizard Buttons Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-8 mt-12 gap-4">
            <button 
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className={`px-6 py-3.5 border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 ${
                step === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>

            {step < 5 ? (
              <button 
                type="button"
                onClick={handleNext}
                className="px-6 py-3.5 bg-[#1a2e24] hover:bg-black text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-950/5"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white rounded-xl font-black text-base flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/25"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {isEditMode ? "Encrypting & Resubmitting..." : "Encrypting & Registering..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? "Resubmit Application for Verification" : "Submit Company for Verification"} <Sparkles size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyRegister;
