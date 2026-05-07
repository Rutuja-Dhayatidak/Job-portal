import React from 'react';
import { Search, Bell, ShieldCheck, Zap, Globe } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-10 py-6">
      <div className="flex items-center justify-between gap-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <ShieldCheck size={14} className="text-indigo-500" />
             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Secure Session Active</p>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-zinc-500 text-sm font-medium">{subtitle}</p>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search reports, entities, or log entries..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-white text-sm font-medium focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
               <span className="bg-white/5 text-[10px] text-zinc-500 font-bold px-1.5 py-0.5 rounded border border-white/5">⌘</span>
               <span className="bg-white/5 text-[10px] text-zinc-500 font-bold px-1.5 py-0.5 rounded border border-white/5">K</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Operations</span>
          </div>
          
          <button className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl transition-all border border-white/5 relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0a0a0a]" />
          </button>
          
          <div className="h-10 w-[1px] bg-white/5 mx-2" />
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-indigo-500/20">
             <Zap size={14} />
             <span>QUICK ACTION</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
