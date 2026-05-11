// file:///c:/Users/ADMIN/Documents/GitHub/Job-portal/frontend/src/sales-panel/pages/Settings.jsx
import React from 'react';
import { ToggleLeft, Shield, Lock, Bell, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your workspace UI preferences and security details.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 divide-y divide-slate-50">
        <div className="py-4 first:pt-0 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Push Notifications</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Receive alert cues when new enterprise leads are registered.</p>
          </div>
          <button onClick={() => toast.success("Preferences updated!")} className="text-violet-600 hover:text-violet-700 font-bold text-xs bg-violet-50 px-3 py-1.5 rounded-lg">
            Active
          </button>
        </div>

        <div className="py-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Virtual Geolocation Punch</h4>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Log physical coordinates directly on punching attendance.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
