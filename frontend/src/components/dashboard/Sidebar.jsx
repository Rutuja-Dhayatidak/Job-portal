import React from 'react';
import { Home, Briefcase, Building2, BookOpen, CheckCircle2 } from 'lucide-react';

const DashboardSidebar = () => {
  return (
    <aside className="w-full lg:w-[280px] flex flex-col gap-4 font-sans">
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center">
        
        {/* Circular Progress Avatar */}
        <div className="relative w-24 h-24 mb-4">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="#f1f5f9"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="276"
              strokeDashoffset={276 * (1 - 0.28)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop" 
                alt="Avatar" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold text-red-500">28%</span>
          </div>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-6">
          Rutuja Technologies
        </h3>

        {/* What are you missing Section */}
        <div className="w-full bg-rose-50/50 rounded-[2rem] p-6 mb-4">
          <h4 className="font-bold text-[15px] text-slate-800 mb-4">
            What are you missing?
          </h4>
          <ul className="space-y-3 mb-6">
            <MissingItem text="Daily job recommendations" />
            <MissingItem text="Job application updates" />
            <MissingItem text="Direct jobs from recruiters" />
          </ul>
          <button className="w-full py-3.5 bg-[#ef4444] hover:bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/20 transition-all active:scale-95 text-sm">
            Complete profile
          </button>
        </div>

        <div className="w-full h-px bg-slate-100 mb-6"></div>

        {/* Navigation Links */}
        <div className="w-full space-y-1">
          <NavLink icon={<Home className="w-5 h-5" />} label="My home" />
          <NavLink icon={<Briefcase className="w-5 h-5" />} label="Jobs" active />
          <NavLink icon={<Building2 className="w-5 h-5" />} label="Companies" />
          <NavLink icon={<BookOpen className="w-5 h-5" />} label="Blogs" />
        </div>

        <div className="w-full h-px bg-slate-100 mt-6 mb-4"></div>

        <button className="text-sm font-medium text-slate-400 hover:text-[#0a66c2] transition-colors">
          How NextHire works?
        </button>
      </div>

    </aside>
  );
};

const MissingItem = ({ text }) => (
  <li className="flex items-center gap-3">
    <CheckCircle2 className="w-4 h-4 text-orange-500 fill-orange-500/10" />
    <span className="text-[13px] font-medium text-slate-600">{text}</span>
  </li>
);

const NavLink = ({ icon, label, active }) => (
  <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all group ${active ? 'bg-slate-50 text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <div className={`${active ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>
      {icon}
    </div>
    <span className="text-[14px] font-medium tracking-tight">{label}</span>
  </div>
);

export default DashboardSidebar;
