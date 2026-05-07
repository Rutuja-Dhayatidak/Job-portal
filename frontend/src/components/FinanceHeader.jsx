import React from 'react';
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const FinanceHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="relative w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search transactions, plans, or reports..." 
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-slate-100"></div>

        {/* User Profile */}
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-tight">{user.firstName || 'Finance'} {user.lastName || 'Admin'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finance Department</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black shadow-inner">
              {user.firstName ? user.firstName[0] : <User size={20} />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </header>
  );
};

export default FinanceHeader;
