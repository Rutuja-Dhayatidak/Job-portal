import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Building2, LogOut } from 'lucide-react';

const EmployerProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/company/login" replace />;
  }

  if (role !== 'employer') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 -z-10"></div>

        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative">
          <div className="w-16 h-16 bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-900/30">
            <ShieldAlert size={32} />
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-2">Access Denied</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your current account session does not have Employer privileges. Please switch your profile or log in with corporate credentials.
          </p>

          <div className="space-y-3">
            <Link 
              to="/company/login" 
              onClick={() => {
                localStorage.clear();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm cursor-pointer border-none"
            >
              Log in as Employer <Building2 size={16} />
            </Link>

            <Link 
              to="/dashboard" 
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm cursor-pointer border border-slate-700"
            >
              Go to Candidate Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default EmployerProtectedRoute;
