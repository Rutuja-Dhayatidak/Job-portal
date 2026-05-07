import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Lock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/super-admin/dashboard' },
    { name: 'Candidates', icon: <Users size={20} />, path: '/super-admin/candidates' },
    { name: 'Admins', icon: <UserCog size={20} />, path: '/super-admin/admins' },
    { name: 'RBAC', icon: <ShieldCheck size={20} />, path: '/super-admin/rbac' },
    { name: 'Companies', icon: <Building2 size={20} />, path: '/super-admin/companies' },
    { name: 'Jobs', icon: <Briefcase size={20} />, path: '/super-admin/jobs' },
    { name: 'Audit Logs', icon: <Activity size={20} />, path: '/super-admin/audit' },
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
      className="h-screen bg-[#0f172a] text-slate-400 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800 shadow-2xl"
    >
      {/* Brand Logo & Toggle */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-4 h-24`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div 
            layout
            className="min-w-[44px] h-11 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"
          >
            <ShieldCheck size={26} />
          </motion.div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="font-black text-lg tracking-tight text-white uppercase italic leading-none">SUPER</span>
              <span className="font-black text-lg tracking-tight text-emerald-500 uppercase italic leading-none">ADMIN</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button - Floating Style */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-[60] border-2 border-[#0f172a]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto overflow-x-hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] group relative ${
                isActive 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
              }`}
            >
              <motion.div 
                layout
                className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
              >
                {item.icon}
              </motion.div>
              
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 border border-slate-700 shadow-2xl translate-x-4 group-hover:translate-x-0">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 mt-auto">
        <motion.div 
          layout
          className={`bg-slate-800/40 rounded-2xl border border-slate-700/50 transition-all duration-300 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}
        >
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-1"
            >
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Fully Operational</span>
              </div>
            </motion.div>
          ) : (
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" title="Systems Operational"></div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
