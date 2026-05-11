// file:///c:/Users/ADMIN/Documents/GitHub/Job-portal/frontend/src/sales-panel/pages/Notifications.jsx
import React from 'react';
import { Bell, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';

export const Notifications = () => {
  const alerts = [
    { title: "New Enterprise Lead Assigned", text: "Rahul Sharma from Google Inc. was added to your pipeline.", time: "2 hours ago", type: "info" },
    { title: "Follow-Up Overdue Reminder", text: "Your catchup with Amazon HR team is overdue.", time: "1 day ago", type: "warn" }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Signals & Notifications</h1>
        <p className="text-slate-500 font-medium mt-1">Check recent system alerts and automated client response indicators.</p>
      </div>

      <div className="space-y-4">
        {alerts.map((al, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
            <div className={`p-3 rounded-2xl shrink-0 h-fit ${al.type === 'warn' ? 'bg-amber-50 text-amber-500' : 'bg-violet-50 text-violet-500'}`}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{al.title}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">{al.text}</p>
              <span className="text-[10px] text-slate-400 font-bold block mt-2">{al.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
