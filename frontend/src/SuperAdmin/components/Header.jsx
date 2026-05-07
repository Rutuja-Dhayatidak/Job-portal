import React from 'react';
import { Bell, User, Search, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('superAdminRole');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar - As per Image */}
      <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-[450px]">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="Search something..." 
          className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Profile and Notifications - As per Image */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <User size={20} />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Super Admin</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                Administrator <ChevronDown size={10} />
              </p>
            </div>
          </div>

          <div className="relative p-2 text-slate-400 hover:text-emerald-600 transition-all cursor-pointer">
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">5</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-all"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
