import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import { verifyInvite, activateAdmin } from '../services/superAdminApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ActivateAdmin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing invitation token.");
      setVerifying(false);
      return;
    }
    handleVerify();
  }, [token]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyInvite(token);
      setUser(res.data.user);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || "Invitation link is invalid or expired.");
    } finally {
      setVerifying(false);
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error("Please enter password");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");

    setLoading(true);
    try {
      const res = await activateAdmin({ token, password });
      toast.success(res.data.message || "Account activated successfully!");
      setActivated(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Activation failed. Please try again.");
      setLoading(false); // Reset loading on error
    } finally {
      // Small delay before enabling button again if needed
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Verifying Invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Link Expired</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={handleVerify}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mb-2"
          >
            <RefreshCcw size={18} /> Try Again
          </button>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (activated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-8"
        >
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">All Set!</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Your admin account is now active. Redirecting you to login...</p>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            Go to Login <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100"
      >
        <div className="mb-10 text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Activate Admin</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Welcome, {user?.firstName}!</p>
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider mt-2">
            {user?.role}
          </div>
        </div>

        <form onSubmit={handleActivate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Activate Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          Security Note: Once activated, this link will become invalid. Please keep your password secure.
        </p>
      </motion.div>
    </div>
  );
};

export default ActivateAdmin;
