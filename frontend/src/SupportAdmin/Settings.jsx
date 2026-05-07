import React from 'react';
import Header from './components/Header';
import { Settings as SettingsIcon, Shield, Bell, User } from 'lucide-react';

const Settings = () => {
  return (
    <div className="flex-1">
      <Header title="Support Settings" subtitle="Manage your agent profile and platform preferences." />
      <div className="p-10 space-y-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] space-y-8 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                     <User size={24} />
                  </div>
                  <h3 className="text-slate-900 font-black text-lg">Agent Profile</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                     <input type="text" defaultValue="Support Agent #01" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                     <input type="email" defaultValue="support@nexthire.com" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all" />
                  </div>
               </div>
               <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20">Save Changes</button>
            </div>

            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] space-y-8 shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                     <Shield size={24} />
                  </div>
                  <h3 className="text-slate-900 font-black text-lg">Security & Access</h3>
               </div>
               <div className="space-y-4">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="text-slate-900 font-bold text-sm">Two-Factor Authentication</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Disabled</p>
                     </div>
                     <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Enable</button>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                     <div>
                        <p className="text-slate-900 font-bold text-sm">Active Session</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">IP: 192.168.1.1</p>
                     </div>
                     <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Current</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
