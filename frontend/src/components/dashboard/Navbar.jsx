import React, { useState } from "react";
import {
  Search,
  Briefcase,
  FileText,
  Bookmark,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  Building2,
  Users,
  ShieldCheck,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../../services/api";
import { sendCompanyOtp, verifyCompanyOtp } from "../../services/companyApi";
import toast from "react-hot-toast";
import { useEffect } from "react";

const CandidateNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      setOtpLoading(true);
      const data = await sendCompanyOtp();
      if (data.success) {
        toast.success("OTP sent to your registered email");
        setShowCompanyModal(false);
        setShowOTPModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setOtpVerifyLoading(true);
      const data = await verifyCompanyOtp(otp);
      if (data.success) {
        toast.success("OTP verified successfully");
        setShowOTPModal(false);
        navigate("/company/register");
        setShowSidebar(false);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (data.success) {
          setProfile(data.profile);
          setCompletion(data.completionPercentage);
        }
      } catch (error) {
        console.error("Error fetching nav profile", error);
      }
    };
    fetchProfile();
  }, []);

  const user = profile?.userId || {};

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500"
        style={{
          backgroundColor: "#1a2e24",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 15px, rgba(16, 185, 129, 0.1) 0px 10px 30px"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* 🟢 Logo Area */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-300 shadow-lg shadow-emerald-500/20">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">NextHire</span>
          </div>

          {/* 🔍 Search Bar */}
          <div className="hidden lg:flex items-center bg-white/5 backdrop-blur-md rounded-xl px-4 py-2 w-[400px] border border-white/10 transition-all focus-within:w-[450px] focus-within:bg-white/10 focus-within:border-emerald-500/50">
            <Search className="w-4 h-4 text-emerald-400 mr-3" />
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="bg-transparent outline-none w-full text-sm text-white placeholder:text-white/30"
            />
          </div>

          {/* 🧑‍💼 Navigation Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavItem icon={<Briefcase />} label="Jobs" />
            <NavItem icon={<FileText />} label="Applications" />
            <NavItem icon={<Bookmark />} label="Saved" />

            {/* 🔔 Notifications */}
            <div className="relative cursor-pointer group">
              <Bell className="w-6 h-6 text-white/60 group-hover:text-emerald-400 transition-all group-hover:-translate-y-1" />
              <span className="absolute -top-1 -right-1 text-[9px] bg-emerald-500 text-white font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg border-2 border-[#1a2e24]">
                2
              </span>
            </div>

            {/* 👤 Profile Section (Triggers Sidebar) */}
            <div 
              onClick={() => setShowSidebar(true)}
              className="relative group cursor-pointer"
            >
              <div className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-emerald-500/30 transition-all overflow-hidden">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="user" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white/80 group-hover:text-white" />
                )}
              </div>
            </div>
          </div>

          {/* 📱 Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 📱 Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-[#1a2e24] border-t border-white/5 px-6 py-8 space-y-5 shadow-2xl"
            >
              <MobileItem label="Jobs" icon={<Briefcase className="w-5 h-5" />} />
              <MobileItem label="Applications" icon={<FileText className="w-5 h-5" />} />
              <MobileItem label="Saved Jobs" icon={<Bookmark className="w-5 h-5" />} />
              <div 
                onClick={() => { setShowSidebar(true); setMenuOpen(false); }}
                className="flex items-center gap-4 text-emerald-400 font-bold cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                Open Profile Settings
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🚀 GitHub-Style Slide-out Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white z-[210] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col border-l border-slate-200"
            >
              {/* Header: Profile Info */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                       {profile?.profileImage ? (
                         <img src={profile.profileImage} alt="profile" className="w-full h-full object-cover" />
                       ) : (
                         <User className="w-full h-full p-2 text-slate-500" />
                       )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{user.firstName || 'User'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Profile Score: {Math.round(completion)}%</span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"></path></svg>
                  </button>
                </div>
                
                {/* Status Bar */}
                <button className="w-full flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                  <span className="text-sm">😊</span>
                  Set status
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-2 space-y-0.5">
                  <GithubMenuItem 
                    icon={<User size={16} />} 
                    label="My Profile" 
                    onClick={() => {
                      navigate('/profile');
                      setShowSidebar(false);
                    }}
                  />
                  <GithubMenuItem icon={<Briefcase size={16} />} label="Repositories" />
                  <GithubMenuItem icon={<Bookmark size={16} />} label="Stars" />
                  <GithubMenuItem icon={<FileText size={16} />} label="Gists" />
                </div>

                <div className="h-px bg-slate-100 my-2"></div>

                <div className="px-2 space-y-0.5">
                  <GithubMenuItem 
                    icon={<Briefcase size={16} />} 
                    label="Create Company" 
                    onClick={() => {
                      setShowCompanyModal(true);
                    }}
                  />
                  <GithubMenuItem icon={<Briefcase size={16} />} label="Settings" />
                </div>
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-slate-100">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors group">
                  <svg className="group-hover:translate-x-0.5 transition-transform" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 010 1.5h-2.5A1.75 1.75 0 012 13.25V2.75zm10.44 4.5H6.75a.75.75 0 000 1.5h5.69l-1.97 1.97a.75.75 0 101.06 1.06l3.25-3.25a.75.75 0 000-1.06l-3.25-3.25a.75.75 0 10-1.06 1.06l1.97 1.97z"></path></svg>
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Company Modal */}
      <AnimatePresence>
        {showCompanyModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-10 w-full max-w-[700px] shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowCompanyModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-8 mb-8">
                {/* Illustration */}
                <div className="w-32 h-32 bg-[#eaf7f0] rounded-full flex items-center justify-center relative flex-shrink-0">
                  <Building2 className="w-16 h-16 text-[#00b074] absolute left-6 bottom-8 stroke-[1.5]" />
                  <Briefcase className="w-14 h-14 text-slate-800 absolute right-4 bottom-4 stroke-[1.5] fill-slate-800" />
                  <div className="absolute top-6 left-8 text-emerald-400 animate-pulse">✨</div>
                  <div className="absolute top-10 right-6 text-emerald-400 text-sm animate-pulse delay-100">✨</div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                    Create Company Page
                  </h2>
                  <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm">
                    Create a company profile to post jobs, manage applicants, and hire the best talent.
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100 mb-8"></div>

              {/* Features Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#eaf7f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5 text-[#00b074]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1">Post Jobs</h4>
                    <p className="text-[13px] text-slate-500 leading-snug pr-2">Publish job openings and reach candidates</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#eaf7f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-5 h-5 text-[#00b074]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1">Manage Applications</h4>
                    <p className="text-[13px] text-slate-500 leading-snug pr-2">Track and manage all applications in one place</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#eaf7f0] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-5 h-5 text-[#00b074]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1">Hire Talent</h4>
                    <p className="text-[13px] text-slate-500 leading-snug pr-2">Find and hire the right people faster</p>
                  </div>
                </div>
              </div>

              {/* Alert Box */}
              <div className="bg-[#f2fbf5] border border-[#d1f4e0] rounded-xl p-5 flex gap-4 mb-8 items-center">
                <div className="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#166534] text-[14px]">Email verification is required</h4>
                  <p className="text-[#15803d] text-[13px] mt-0.5">We will send a 6-digit OTP to your registered email for verification.</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mb-6">
                <button
                  onClick={() => setShowCompanyModal(false)}
                  className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 bg-white"
                  disabled={otpLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  className="px-8 py-3 rounded-xl bg-[#00b074] text-white font-bold hover:bg-[#009662] transition-all active:scale-95 flex items-center justify-center min-w-[140px]"
                >
                  {otpLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              {/* Secure Process Text */}
              <div className="flex items-center justify-center gap-2 text-slate-400 mt-2">
                <Lock size={14} />
                <span className="text-[13px] font-medium">Secure verification process</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
              {/* Top Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" /></svg>
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Check Your Email</h2>
                <p className="text-slate-500 text-sm mb-8 px-2">
                  We've sent a 6-digit verification code to your registered email address.
                </p>
                
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full text-center text-4xl tracking-[0.5em] font-black text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl py-6 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 mb-6 transition-all placeholder:text-slate-300"
                />
                
                <div className="flex w-full justify-between items-center mb-8 px-2">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Expires in <span className="font-bold text-slate-700">5:00</span></span>
                  </div>
                  <button 
                    onClick={handleSendOtp}
                    className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors"
                    disabled={otpLoading}
                  >
                    Resend Code
                  </button>
                </div>

                <div className="flex w-full gap-4">
                  <button
                    onClick={() => setShowOTPModal(false)}
                    className="flex-1 px-6 py-4 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || otpVerifyLoading}
                    className="flex-1 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.6)] active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {otpVerifyLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1 text-white/50 hover:text-emerald-400 cursor-pointer transition-all hover:-translate-y-1 group">
    <div className="w-6 h-6">{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
  </div>
);

const GithubMenuItem = ({ icon, label, badge, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer group transition-colors"
  >
    <div className="flex items-center gap-3 text-slate-600">
      <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
        {icon}
      </div>
      <span className="text-[13px] font-medium">{label}</span>
    </div>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge === 'New' ? 'text-blue-600 border-blue-200 bg-blue-50' : 'text-slate-500 border-slate-200 bg-slate-50'}`}>
        {badge}
      </span>
    )}
  </div>
);

const MobileItem = ({ label, icon }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white/60 hover:text-emerald-400 transition-all cursor-pointer">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="font-bold">{label}</span>
  </div>
);

export default CandidateNavbar;