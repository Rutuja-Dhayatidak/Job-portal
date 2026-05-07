import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8 lg:p-10 flex flex-col items-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <Building2 size={32} />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Company Sign in</h2>
            <p className="text-slate-400 font-medium text-sm">Access your employer dashboard</p>
          </div>

          {/* Form */}
          <form className="w-full space-y-6">
            {/* Work Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">WORK EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PASSWORD</label>
                <button type="button" className="text-[10px] font-bold text-emerald-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Secure Login */}
            <div className="flex justify-between items-center px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                <span className="text-xs text-slate-600 font-bold group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Secure login</span>
              </div>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="w-full py-4.5 bg-[#0e693a] hover:bg-[#0a4d2a] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Sign in
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* OR Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
            </div>

            {/* OTP Login */}
            <button 
              type="button"
              className="w-full py-4 border-2 border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Smartphone size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              Login with OTP
            </button>

            {/* Safety Note */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0 mt-0.5">
                <ShieldCheck size={14} />
              </div>
              <p className="text-[10px] font-bold text-emerald-800 leading-relaxed">
                We never share your data with anyone. Your information is safe with us.
              </p>
            </div>
          </form>

          {/* Footer - Register */}
          <div className="mt-8 border-t border-slate-50 w-full pt-8 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Not a registered company? <Link to="/company/register" className="text-emerald-600 font-bold hover:underline">Register now</Link>
            </p>
          </div>
        </div>

        {/* reCAPTCHA Footer */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-center gap-2">
          <Lock size={12} className="text-slate-400" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            Protected by reCAPTCHA. <span className="text-slate-600 hover:underline cursor-pointer">Privacy Policy</span> & <span className="text-slate-600 hover:underline cursor-pointer">Terms of Service</span> apply.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyLogin;
