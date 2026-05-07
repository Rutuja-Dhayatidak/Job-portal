import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Loader2, ArrowRight, Home } from 'lucide-react';
import { verifyCompanyEmailLink } from '../services/trustSafetyApi';

const CompanyVerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'expired' | 'error'
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const doVerification = async () => {
      try {
        const data = await verifyCompanyEmailLink(token);
        if (data.success) {
          setCompanyName(data.companyName || 'Your Company');
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(data.message || 'Verification failed');
        }
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.message || '';
        if (errMsg.toLowerCase().includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
          setErrorMsg(errMsg || 'The verification link is invalid or has already been used.');
        }
      }
    };

    if (token) {
      doVerification();
    } else {
      setStatus('error');
      setErrorMsg('No verification token provided.');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {status === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl flex flex-col items-center text-center text-white space-y-6"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 animate-spin flex items-center justify-center" />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-wide">Validating Secure Token</h2>
              <p className="text-slate-400 text-sm font-medium">Please wait while we verify your official company credentials...</p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-emerald-500/20 shadow-2xl shadow-emerald-950/20 flex flex-col items-center text-center text-white space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <ShieldCheck size={36} />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-black tracking-wide text-emerald-400">
                Official Company Email Verified Successfully
              </h2>
              <p className="text-slate-300 text-sm font-semibold leading-relaxed px-2">
                Your company email has been successfully verified. Your employer verification request for <strong className="text-white font-black">{companyName}</strong> is now under review.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              Back to Dashboard <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

        {(status === 'expired' || status === 'error') && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-red-500/20 shadow-2xl flex flex-col items-center text-center text-white space-y-6"
          >
            <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
              <AlertTriangle size={36} />
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-black tracking-wide text-red-400">
                {status === 'expired' ? 'Verification Link Expired' : 'Verification Failed'}
              </h2>
              <p className="text-slate-300 text-sm font-semibold leading-relaxed px-2">
                {status === 'expired' 
                  ? 'This verification link is invalid or has expired after 24 hours. Please request a new link from your profile dashboard.'
                  : errorMsg || 'The verification link is invalid or has already been used.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-transparent text-slate-400 hover:text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Home size={14} /> Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyVerifyEmail;
