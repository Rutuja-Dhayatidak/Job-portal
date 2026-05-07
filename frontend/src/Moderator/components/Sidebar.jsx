import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Flag, Users, Briefcase, 
  History, Settings, Shield, LogOut, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/moderator/dashboard' },
    { icon: <Flag size={20} />, label: 'Reports', path: '/moderator/reports' },
    { icon: <Users size={20} />, label: 'Users', path: '/moderator/users' },
    { icon: <Briefcase size={20} />, label: 'Jobs', path: '/moderator/jobs' },
    { icon: <History size={20} />, label: 'Activity Logs', path: '/moderator/logs' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/moderator/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('moderatorToken');
    localStorage.removeItem('moderatorRole');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="w-72 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">MODERATOR</h1>
            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest leading-none">Trust & Safety</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <span className="transition-transform group-hover:scale-110 duration-300">
              {item.icon}
            </span>
            <span className="font-bold text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-black text-white">
            MA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Mod Admin</p>
            <p className="text-zinc-500 text-[10px] font-medium truncate">Level 4 Auditor</p>
          </div>
          <button className="text-zinc-500 hover:text-indigo-500 transition-colors">
            <Bell size={14} />
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Logout System</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
