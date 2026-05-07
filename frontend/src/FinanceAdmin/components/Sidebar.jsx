import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  IndianRupee, 
  CreditCard, 
  Tag, 
  Undo2, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldEllipsis,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/finance/dashboard' },
    { name: 'Daily Revenue', icon: <IndianRupee size={20} />, path: '/finance/revenue' },
    { name: 'Subscription Plans', icon: <CreditCard size={20} />, path: '/finance/plans' },
    { name: 'Employer Payments', icon: <BarChart3 size={20} />, path: '/finance/payments' },
    { name: 'Pricing Configuration', icon: <Tag size={20} />, path: '/finance/pricing' },
    { name: 'Refund Management', icon: <Undo2 size={20} />, path: '/finance/refunds' },
    { name: 'Invoices & Billing', icon: <Settings size={20} />, path: '/finance/invoices' },
    { name: 'Financial Reports', icon: <FileText size={20} />, path: '/finance/reports' },
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
            className="min-w-[44px] h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
          >
            <ShieldEllipsis size={26} />
          </motion.div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="font-black text-lg tracking-tight text-white uppercase italic leading-none">FINANCE</span>
              <span className="font-black text-lg tracking-tight text-blue-500 uppercase italic leading-none">ADMIN</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-[60] border-2 border-[#0f172a]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold text-[13px] group relative ${
                isActive 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
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
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 border border-slate-700 shadow-2xl translate-x-4 group-hover:translate-x-0">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <motion.div layout className={`bg-slate-800/40 rounded-2xl border border-slate-700/50 ${isCollapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
          <div className={`w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6] ${!isCollapsed && 'inline-block mr-2'}`}></div>
          {!isCollapsed && <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Financial Secure</span>}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
