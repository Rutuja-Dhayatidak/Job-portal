import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Fingerprint,
  UserCheck,
  UserX,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  ShieldHalf,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/trust/dashboard' },
    { name: 'Reports & Flags', icon: <ShieldAlert size={20} />, path: '/trust/reports' },
    { name: 'Moderation Queue', icon: <AlertTriangle size={20} />, path: '/trust/moderation' },
    { name: 'Fraud & Risk Analysis', icon: <Fingerprint size={20} />, path: '/trust/fraud' },
    { name: 'Enforcement Actions', icon: <FileCheck size={20} />, path: '/trust/actions' },
    { name: 'Blocked Accounts', icon: <UserX size={20} />, path: '/trust/blocked' },
    { name: 'Audit Logs', icon: <ScrollText size={20} />, path: '/trust/logs' },
    { name: 'KYC Verification', icon: <UserCheck size={20} />, path: '/trust/kyc' },
    { name: 'Company Verification', icon: <Building2 size={20} />, path: '/trust/company-verification' },
  ];

  const sidebarTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={sidebarTransition}
      className="h-screen bg-[#020617] text-slate-400 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800 shadow-2xl"
    >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4 h-24`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            layout
            className="min-w-[44px] h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"
          >
            <ShieldHalf size={26} />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-lg tracking-tight text-white uppercase leading-none">TRUST</span>
              <span className="font-black text-lg tracking-tight text-indigo-500 uppercase leading-none">& SAFETY</span>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60] border-2 border-[#020617]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] group relative ${isActive
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
                }`}
            >
              <motion.div layout className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </motion.div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <motion.div layout className={`bg-slate-800/40 rounded-2xl border border-slate-700/50 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
          <div className={`w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_#6366f1] ${!isCollapsed && 'inline-block mr-2'}`}></div>
          {!isCollapsed && <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Compliance Mode</span>}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrustSidebar;
