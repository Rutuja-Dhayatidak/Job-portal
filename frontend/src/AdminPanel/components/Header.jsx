import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 w-96 group focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search for something..."
          className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-500 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 leading-none">Platform Admin</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global Access</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
