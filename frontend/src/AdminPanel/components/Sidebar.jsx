import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hasPermission } from '../../utils/permissionUtils';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const allItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard', alwaysShow: true },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users', module: 'Candidates' },
    { name: 'Companies', icon: <Building2 size={20} />, path: '/admin/companies', module: 'Companies' },
    { name: 'Jobs', icon: <Briefcase size={20} />, path: '/admin/jobs', module: 'Jobs' },
    { name: 'Tickets', icon: <MessageSquare size={20} />, path: '/admin/tickets', module: 'Support' },
    { name: 'Analytics', icon: <LayoutDashboard size={20} />, path: '/admin/analytics', module: 'Analytics' },
    { name: 'Reports', icon: <MessageSquare size={20} />, path: '/admin/reports', module: 'Reports' },
    { name: 'Audit Logs', icon: <ShieldCheck size={20} />, path: '/admin/logs', module: 'Audit Logs' },
  ];

  const menuItems = allItems.filter(item => {
    if (item.alwaysShow) return true;
    if (!item.module) return false;
    // Show if user has ANY permission for this module
    const perms = JSON.parse(localStorage.getItem('permissions') || '{}');
    return perms[item.module] && perms[item.module].length > 0;
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

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
      className="h-screen bg-[#111827] text-slate-400 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800 shadow-2xl"
    >
      {/* Brand Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start px-6'} h-24 mb-2`}>
        <div className="flex items-center gap-3">
          <motion.div
            layout
            className="w-11 h-11 min-w-[44px] bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"
          >
            <ShieldCheck size={24} />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col select-none"
            >
              <span className="font-black text-lg tracking-tight text-white uppercase italic leading-none">PLATFORM</span>
              <span className="font-black text-lg tracking-tight text-indigo-400 uppercase italic leading-none">ADMIN</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60] border-2 border-[#111827]"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto overflow-x-hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] group relative ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'hover:bg-slate-800/50 hover:text-white'
                }`}
            >
              <motion.div layout className={isActive ? 'scale-110' : 'group-hover:scale-110'}>
                {item.icon}
              </motion.div>

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 border border-slate-700 shadow-2xl">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] text-red-400 hover:bg-red-500/10 hover:text-red-500 group"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
