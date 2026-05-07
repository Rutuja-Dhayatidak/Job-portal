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
