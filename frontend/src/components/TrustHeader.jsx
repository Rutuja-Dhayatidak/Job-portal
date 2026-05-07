import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Shield, ChevronDown, User, Briefcase, ShieldAlert, Loader2 } from 'lucide-react';
import { searchData } from '../services/trustSafetyApi';
import { Link } from 'react-router-dom';

const TrustHeader = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        handleSearch();
      } else {
        setResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setShowResults(true);
    try {
      const data = await searchData(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-[100]">
      <div className="relative w-96 group" ref={searchRef}>
        <div className="relative">
          {loading ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 animate-spin" size={18} />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          )}
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 2 && setShowResults(true)}
            placeholder="Audit users, jobs, or reports..." 
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && results && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden max-h-[480px] overflow-y-auto z-[110]">
             {results.users?.length > 0 && (
               <div className="p-2 border-b border-slate-50">
                  <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Users</p>
                  {results.users.map(u => (
                    <div key={u._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                       <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center"><User size={16} /></div>
                       <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{u.firstName} {u.lastName}</span>
                    </div>
                  ))}
               </div>
             )}
             {results.jobs?.length > 0 && (
               <div className="p-2 border-b border-slate-50">
                  <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jobs</p>
                  {results.jobs.map(j => (
                    <div key={j._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                       <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center"><Briefcase size={16} /></div>
                       <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{j.title}</span>
                    </div>
                  ))}
               </div>
             )}
             {results.reports?.length > 0 && (
               <div className="p-2">
                  <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reports</p>
                  {results.reports.map(r => (
                    <div key={r._id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                       <div className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><ShieldAlert size={16} /></div>
                       <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 line-clamp-1 italic">"{r.reason}"</span>
                    </div>
                  ))}
               </div>
             )}
             {(!results.users?.length && !results.jobs?.length && !results.reports?.length) && (
               <div className="p-8 text-center text-slate-400 font-medium text-sm italic">No compliance data found</div>
             )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
        </button>

        <div className="w-px h-6 bg-slate-100"></div>

        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-tight">{user.firstName || 'Trust'} {user.lastName || 'Admin'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust & Safety Dept</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black shadow-inner">
              {user.firstName ? user.firstName[0] : <Shield size={20} />}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white"></div>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </div>
    </header>
  );
};

export default TrustHeader;
