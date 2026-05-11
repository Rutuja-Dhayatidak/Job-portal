import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Award, 
  CheckSquare, Clock, Target, TrendingUp, FileText, 
  Bell, Settings, User, LogOut, Menu, X, Sparkles, ChevronDown 
} from 'lucide-react';

const SalesLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Retrieve user name
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { firstName: "Sales", lastName: "Executive", email: "sales@nexthire.com" };
  const displayName = `${user.firstName || 'Sales'} ${user.lastName || 'Rep'}`;

  const menuItems = [
    { name: "Dashboard", path: "/sales/dashboard", icon: LayoutDashboard },
    { name: "Leads", path: "/sales/leads", icon: Users },
    { name: "Follow Ups", path: "/sales/followups", icon: Calendar },
    { name: "Customers", path: "/sales/customers", icon: Award },
    { name: "Tasks", path: "/sales/tasks", icon: CheckSquare },
    { name: "Attendance", path: "/sales/attendance", icon: Clock },
    { name: "Targets", path: "/sales/targets", icon: Target },
    { name: "Performance", path: "/sales/performance", icon: TrendingUp },
    { name: "Reports", path: "/sales/reports", icon: FileText },
    { name: "Notifications", path: "/sales/notifications", icon: Bell },
    { name: "Settings", path: "/sales/settings", icon: Settings },
    { name: "Profile", path: "/sales/profile", icon: User }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    navigate('/login');
  };

  // Extract breadcrumbs
  const getBreadcrumb = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "dashboard") return "CRM Analytics Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 space-y-8 shrink-0">
        {/* NextHire Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-500/20">
            N
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">NextHire</h2>
            <p className="text-[10px] text-violet-600 font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> Enterprise CRM
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-none pr-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all group
                ${isActive 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/10" 
                  : "text-slate-500 hover:text-violet-600 hover:bg-slate-50/80"}
              `}
            >
              <item.icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Item */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-rose-50/50 transition-all w-full text-left"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header/Topbar */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Nav Trigger */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 bg-slate-50 text-slate-600 rounded-xl lg:hidden hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            
            {/* Breadcrumb path */}
            <div className="hidden sm:block">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">NextHire Sales Portal</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{getBreadcrumb()}</h3>
            </div>
          </div>

          {/* User profile actions */}
          <div className="flex items-center gap-4">
            {/* Notification alert bells */}
            <button 
              onClick={() => navigate('/sales/notifications')}
              className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-2xl transition-all relative"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-violet-600 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer"
              >
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center font-bold text-violet-600 text-sm">
                  {displayName[0]}
                </div>
                <div className="text-left hidden md:block">
                  <h4 className="text-xs font-black text-slate-900 leading-none">{displayName}</h4>
                  <span className="text-[9px] text-slate-400 font-bold block mt-1">{user.email}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {/* Profile Dropdown Box */}
              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); navigate('/sales/profile'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User size={14} /> My Profile
                    </button>
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); navigate('/sales/settings'); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings size={14} /> System Settings
                    </button>
                    <div className="border-t border-slate-50 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Pages view */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop screen */}
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)}></div>
          
          <aside className="fixed top-0 bottom-0 left-0 w-72 bg-white p-6 space-y-6 flex flex-col shadow-2xl z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                  N
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">NextHire CRM</h2>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${isActive ? "bg-violet-600 text-white shadow-lg shadow-violet-500/10" : "text-slate-500 hover:bg-slate-50"}
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-rose-50 w-full text-left"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default SalesLayout;
