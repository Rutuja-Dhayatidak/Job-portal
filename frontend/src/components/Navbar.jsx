import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Building2, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-[100] flex items-center justify-between px-8 py-6 bg-transparent">
      <Link to="/" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-10 h-10 bg-[#588157] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-emerald-900/20">
          <span className="text-white font-bold text-xl">N</span>
        </div>
        <span className="text-white text-2xl font-bold tracking-tight">NextHire</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/register" className="text-white font-bold hover:text-emerald-400 transition-colors text-sm">
          Join now
        </Link>

        {/* For Companies Dropdown */}
        <div className="relative group/company">
          <button 
            onMouseEnter={() => setShowCompanyMenu(true)}
            onMouseLeave={() => setShowCompanyMenu(false)}
            className="flex items-center gap-1.5 text-white font-bold hover:text-emerald-400 transition-colors text-sm cursor-pointer py-2"
          >
            For Companies <ChevronDown size={14} className={`transition-transform duration-300 ${showCompanyMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCompanyMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={() => setShowCompanyMenu(true)}
                onMouseLeave={() => setShowCompanyMenu(false)}
                className="absolute top-full right-0 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-2 mt-1 overflow-hidden"
              >
                <Link to="/company/register" className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors group">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Register as Company</p>
                    <p className="text-[10px] text-slate-500 font-medium">Post jobs and hire talent</p>
                  </div>
                </Link>

                <Link to="/company/login" className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors group mt-1">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <LogIn size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Company Sign in</p>
                    <p className="text-[10px] text-slate-500 font-medium">Access your dashboard</p>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to="/login">
          <button className="bg-transparent border-2 border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-2 rounded-full font-bold transition-all text-sm">
            Sign in
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
