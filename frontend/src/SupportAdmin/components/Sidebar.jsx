import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  HelpCircle, 
  Settings, 
  LifeBuoy,
  MessageCircle,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/support/dashboard' },
    { name: 'Tickets', icon: <LifeBuoy size={20} />, path: '/support/tickets' },
    { name: 'Live Chat', icon: <MessageCircle size={20} />, path: '/support/chat' },
    { name: 'Users Help', icon: <Users size={20} />, path: '/support/users' },
    { name: 'FAQ Manager', icon: <HelpCircle size={20} />, path: '/support/faq' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/support/settings' },
  ];

  return (
    <div className="w-80 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-slate-900 font-black text-lg tracking-tighter leading-none uppercase italic">Support</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Care Center</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-10 pt-0">
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest"
        >
          <LogOut size={20} />
          Logout System
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
