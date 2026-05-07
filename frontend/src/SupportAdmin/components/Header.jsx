import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="h-24 border-b border-slate-100 flex items-center justify-between px-12 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
      <div>
        <h2 className="text-slate-900 font-black text-2xl tracking-tighter">{title}</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search tickets, users..." 
            className="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all w-80 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <div className="text-right">
              <p className="text-[11px] font-black text-slate-900 leading-none">Support Agent</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tier 1 Support</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black border border-indigo-100">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
