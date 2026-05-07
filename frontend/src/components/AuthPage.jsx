import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check, ChevronLeft, X, RefreshCw, Smartphone, ChevronDown, MapPin, Briefcase, Building2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { registerCandidate, verifyOtp, loginCandidate } from '../services/candidate';
import API from '../services/axios';
import axios from 'axios';
import toast from 'react-hot-toast';

const LandingView = ({ setView }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      const { role, token, permissions, user } = res.data;
      
      // Store common data
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (permissions) localStorage.setItem('permissions', JSON.stringify(permissions));
      if (user) localStorage.setItem('user', JSON.stringify(user));

      toast.success(`Welcome back, ${role}!`);

      // Standardize storage for all roles
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (res.data.permissions) {
        localStorage.setItem('permissions', JSON.stringify(res.data.permissions));
      }

      // Role-based redirection
      switch (role) {
        case 'superAdmin':
          localStorage.setItem('superAdminToken', token);
          navigate('/super-admin/dashboard');
          break;
        case 'Platform Admin':
          navigate('/admin/dashboard');
          break;
        case 'Finance Admin':
        case 'finance':
          navigate('/finance/dashboard');
          break;
        case 'OPS Admin':
        case 'Ops Admin':
          navigate('/ops/dashboard');
          break;
        case 'Trust & Safety':
        case 'trust_safety':
          navigate('/trust/dashboard');
          break;
        case 'Support Admin':
          navigate('/support/dashboard');
          break;
        case 'Moderator':
        case 'moderator':
          navigate('/moderator/dashboard');
          break;
        case 'candidate':
          navigate('/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-12 lg:py-20 flex-1 flex flex-col justify-center">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-[#1a2e24] leading-[1.1]"
          >
            Explore <span className="text-[#10b981] italic">jobs</span> and grow <br /> 
            your professional network
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-md">
            The most advanced AI-powered platform to find your next career move and connect with industry leaders.
          </p>
        </div>

        {/* Right Content - Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:w-1/2 w-full max-w-[480px] bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sign in</h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">Stay updated on your professional world</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-black text-emerald-600 uppercase hover:underline tracking-tighter">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Sign in"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to NextHire?{' '}
              <button onClick={() => setView('register')} className="text-emerald-600 font-black hover:underline">Join now</button>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

const RegisterForm = ({
  step, setStep, showPassword, setShowPassword,
  firstName, setFirstName, lastName, setLastName,
  email, setEmail, password, setPassword,
  phoneNumber, setPhoneNumber, verificationCode, setVerificationCode,
  handleContinue, setView, isLoading, errorMessage
}) => {
  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-8 pt-6 lg:pt-12 pb-20 w-full"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content - Messaging & Animation */}
        <div className="lg:w-1/2 space-y-8 -mt-10 lg:-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-7xl font-serif text-[#1a2e24] leading-[1.1] mb-6">
              Join <span className="text-[#10b981] italic">NextHire</span> now — it’s free!
            </h2>
            <p className="text-slate-500 text-lg max-w-md leading-relaxed">
              Become a part of the world's most innovative professional network and accelerate your career today.
            </p>
          </motion.div>

          <div className="relative w-full max-w-xl scale-110 lg:scale-135 -ml-5">
            <DotLottieReact
              src="https://lottie.host/ca3c8740-7b3d-45d3-b0dc-26de915cc08b/PVxHN7yK1e.lottie"
              loop
              autoplay
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100/30 rounded-full -z-10 blur-3xl"></div>
          </div>
        </div>

        {/* Right Content - The Form Card */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          <div className="bg-white p-0 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] w-full max-w-[500px] border border-slate-100 relative z-10 overflow-hidden min-h-[500px] flex flex-col">

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 lg:p-10 space-y-5 overflow-y-auto max-h-[600px]"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-500 font-bold ml-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm text-slate-500 font-bold ml-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-500 font-bold ml-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-500 font-bold ml-1">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm flex items-center">+91</div>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="10-digit number"
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 relative">
                    <label className="text-sm text-slate-500 font-bold ml-1">Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] text-emerald-600 font-bold text-xs hover:bg-emerald-50 px-2 py-1 rounded-md transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full py-4 bg-[#1a2e24] hover:bg-black text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/10 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Agree & Join"}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    By clicking Agree & Join, you agree to the NextHire <span className="text-emerald-600 font-bold cursor-pointer hover:underline">User Agreement</span> and <span className="text-emerald-600 font-bold cursor-pointer hover:underline">Privacy Policy</span>.
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 lg:p-10 space-y-8 flex flex-col items-center text-center"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800">Verify your identity</h3>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                      We've sent a 6-digit verification code to <span className="font-bold text-slate-700">{email}</span>. Please enter it below to complete your registration.
                    </p>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="relative group">
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-center text-2xl font-bold tracking-[0.5em] placeholder:text-sm placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300"
                      />
                    </div>

                    <div className="flex flex-col gap-1 text-xs text-slate-400">
                      <p>Didn't receive a code?</p>
                      <button type="button" className="text-blue-600 font-bold hover:underline">Resend code</button>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/25 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                  >
                    Change registration details
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 lg:p-10 space-y-8 flex flex-col items-center text-center justify-center min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-slate-800">Welcome to NextHire!</h3>
                    <p className="text-slate-500 text-base leading-relaxed">
                      Your account has been successfully verified. We are redirecting you to your dashboard...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 3 && (
              <div className="p-8 pt-0 text-center text-sm font-medium mt-auto">
                <span className="text-slate-400">Already on NextHire?</span>{' '}
                <button type="button" onClick={() => setView('landing')} className="text-emerald-600 font-black hover:underline">Sign in</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.main>
  );
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('landing'); // 'landing' or 'register'
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = async () => {
    setErrorMessage('');
    if (step === 1) {
      if (!firstName || !lastName || !email || !phoneNumber || !password) {
        setErrorMessage('All fields are required');
        return;
      }

      setIsLoading(true);
      try {
        await registerCandidate({
          firstName,
          lastName,
          email,
          phone: phoneNumber,
          password
        });
        setStep(2);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      if (!verificationCode) {
        setErrorMessage('Please enter verification code');
        return;
      }

      setIsLoading(true);
      try {
        const response = await verifyOtp({
          email,
          otp: verificationCode
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        setStep(3);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        setErrorMessage(err.response?.data?.message || 'Invalid OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-100 transition-colors duration-700 flex flex-col ${view === 'register' ? 'bg-[#f3f2f1]' : 'bg-white'}`}>
      {/* Brand Navbar */}
      <nav className="max-w-7xl mx-auto px-8 py-6 w-full flex items-center justify-between relative z-50">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-[#588157] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-emerald-900/10">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-[#1a2e24] text-2xl font-bold tracking-tight">NextHire</span>
        </Link>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => { setView('register'); setStep(1); }}
            className={`font-bold transition-all text-sm ${view === 'register' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
          >
            Join now
          </button>

          {/* For Companies Dropdown */}
          <div className="relative group/company">
            <button
              type="button"
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-emerald-600 transition-all text-sm py-2 cursor-pointer"
            >
              For Companies <ChevronDown size={14} className="group-hover/company:rotate-180 transition-transform duration-300" />
            </button>

            <div className="absolute top-full right-0 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 mt-1 hidden group-hover/company:block overflow-hidden z-[100]">
              <Link to="/company/register" className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors group">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Building2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Register as Company</p>
                  <p className="text-[10px] text-slate-500 font-medium">Post jobs and hire talent</p>
                </div>
              </Link>

              <Link to="/company/login" className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors group mt-1">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <LogIn size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">Company Sign in</p>
                  <p className="text-[10px] text-slate-500 font-medium">Access your dashboard</p>
                </div>
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView('landing')}
            className={`font-bold px-8 py-2.5 rounded-full transition-all text-sm border-2 ${view === 'register' ? 'border-slate-300 text-slate-600 hover:bg-white' : 'border-[#10b981] text-[#10b981] hover:bg-emerald-50'}`}
          >
            Sign in
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <LandingView key="landing" setView={setView} />
          ) : (
            <RegisterForm
              key="register"
              step={step}
              setStep={setStep}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              handleContinue={handleContinue}
              setView={setView}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          )}
        </AnimatePresence>
      </div>

      <footer className="max-w-7xl mx-auto px-8 py-10 w-full border-t border-slate-200/60">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          <span className="text-slate-900 font-black">NextHire © 2024</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">User Agreement</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Copyright Policy</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Brand Policy</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Guest Controls</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Language</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
