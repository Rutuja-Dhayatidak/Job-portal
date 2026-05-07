import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  RefreshCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCompanyApi } from '../services/companyApi';
import toast from 'react-hot-toast';

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for verification response modals
  const [verificationStatus, setVerificationStatus] = useState(null); // 'pending' or 'rejected'
  const [rejectionReason, setRejectionReason] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields.");
    }

    setLoading(true);
    try {
      const res = await loginCompanyApi(email, password);
      
      const { success, token, user, company, status, rejectionReason: reason, message } = res.data;

      if (!success) {
        if (status === 'pending_review') {
          setVerificationStatus('pending');
          return;
        } else if (status === 'rejected') {
          setVerificationStatus('rejected');
          setRejectionReason(reason || "Invalid documentation or missing business parameters.");
          return;
        } else {
          return toast.error(message || "Invalid credentials.");
        }
      }

      // Successful login
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('company', JSON.stringify(company));
      
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      toast.success("Welcome back! Loading Employer Dashboard...");
      
      setTimeout(() => {
        navigate('/employer/dashboard');
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid work email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7f6] via-white to-[#edf2f1] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Soft Fresh Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-emerald-100/40 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-emerald-50/50 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 -z-10"></div>

      <AnimatePresence mode="wait">
        {!verificationStatus ? (
          <motion.div 
            key="login-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(16,185,129,0.06)] border border-slate-100 relative overflow-hidden p-8 lg:p-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10 border-none cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center">
              {/* Premium Brand Icon */}
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#0e693a] shadow-inner mb-6 relative group">
                <Building2 size={28} />
                <div className="absolute inset-0 bg-emerald-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Typography Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">Corporate Portal</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Access your employer workspace</p>
              </div>

              {/* Form content */}
              <form onSubmit={handleLogin} className="w-full space-y-5">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WORK EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com" 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PASSWORD</label>
                    <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline transition-colors border-none bg-transparent cursor-pointer">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter company password" 
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold text-slate-800 placeholder:text-slate-400"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors border-none bg-transparent cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Secure Badge */}
                <div className="flex justify-between items-center px-1 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                    />
                    <span className="text-xs text-slate-500 font-bold group-hover:text-slate-800 transition-colors">Remember me</span>
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>Secure Gate</span>
                  </div>
                </div>

                {/* Submit button with loading state */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-[#0e693a] hover:bg-[#0a4d2a] disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl font-bold text-base transition-all shadow-md shadow-emerald-950/5 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer border-none"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify & Sign in 
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Secure Workspace Memo */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-[10px] font-bold text-emerald-800 leading-relaxed">
                    Access is restricted to verified NextHire corporate members only. Security parameters are actively monitored.
                  </p>
                </div>
              </form>

              {/* Registration Footer Redirect */}
              <div className="mt-8 border-t border-slate-50 w-full pt-8 text-center">
                <p className="text-sm text-slate-400 font-medium">
                  Looking to hire? <Link to="/company/register" className="text-emerald-600 font-black hover:underline">Register your company</Link>
                </p>
              </div>
            </div>
          </motion.div>
        ) : verificationStatus === 'pending' ? (
          <motion.div 
            key="pending-modal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-[0_30px_70px_rgba(16,185,129,0.06)] flex flex-col items-center text-center relative"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Clock size={28} className="animate-pulse" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Verification Under Review</h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-semibold">
              Your company registration has been received and is currently being audited by our Trust & Safety crew.
            </p>

            <div className="bg-slate-50/60 rounded-2xl p-4 mb-6 text-left w-full border border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Step 1: Document Credential Verification
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                Step 2: Platform Administrator Activation
              </div>
            </div>

            <button
              onClick={() => setVerificationStatus(null)}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border-none text-sm cursor-pointer"
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="rejected-modal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md w-full bg-white rounded-[2.5rem] p-8 lg:p-10 border border-red-100 shadow-[0_30px_70px_rgba(239,68,68,0.06)] flex flex-col items-center text-center relative"
          >
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={28} />
            </div>
            
            <h3 className="text-2xl font-black text-red-600 tracking-tight mb-2">Verification Rejected</h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-4 font-semibold">
              Your company verification request was rejected by the administration team for the following reason:
            </p>

            {/* Custom Rejection Memo box */}
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6 text-left w-full">
              <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-1">AUDIT FEEDBACK</span>
              <p className="text-xs text-red-900 font-bold leading-relaxed">
                {rejectionReason}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate('/company/register')}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer border-none"
              >
                Update & Resubmit <ExternalLink size={14} />
              </button>
              
              <button
                onClick={() => setVerificationStatus(null)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all border-none text-sm cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyLogin;
