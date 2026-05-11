import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Square, MapPin, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [logs, setLogs] = useState([
    { date: "May 10, 2026", checkIn: "09:12 AM", checkOut: "06:05 PM", status: "On Time" },
    { date: "May 09, 2026", checkIn: "08:58 AM", checkOut: "05:45 PM", status: "On Time" },
    { date: "May 08, 2026", checkIn: "09:30 AM", checkOut: "06:12 PM", status: "Late In" }
  ]);

  useEffect(() => {
    let interval = null;
    if (punchedIn && punchTime) {
      interval = setInterval(() => {
        const diffMs = new Date() - punchTime;
        const diffSecs = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffSecs / 3600);
        const minutes = Math.floor((diffSecs % 3600) / 60);
        const seconds = diffSecs % 60;
        
        const pad = (n) => n.toString().padStart(2, "0");
        setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }, 1000);
    } else {
      setElapsed("00:00:00");
    }
    return () => clearInterval(interval);
  }, [punchedIn, punchTime]);

  const handlePunch = () => {
    if (!punchedIn) {
      setPunchedIn(true);
      setPunchTime(new Date());
      toast.success("Successfully Checked-In! Have a productive day.");
    } else {
      const now = new Date();
      const inStr = punchTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const outStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      
      setLogs([{
        date: dateStr,
        checkIn: inStr,
        checkOut: outStr,
        status: "On Time"
      }, ...logs]);

      setPunchedIn(false);
      setPunchTime(null);
      toast.success("Punch recorded. Have a great evening!");
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Punch Attendance</h1>
        <p className="text-slate-500 font-medium mt-1">Punch your shift attendance and log coordinates directly to SuperAdmin audit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Punch Card Column */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
          <div className="relative">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              punchedIn ? "bg-red-50 text-red-500 animate-pulse" : "bg-violet-50 text-violet-600"
            }`}>
              <Clock size={48} />
            </div>
            {punchedIn && (
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"></span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">{elapsed}</h3>
            <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Shift Elapsed Time</p>
          </div>

          <button 
            onClick={handlePunch}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all shadow-md ${
              punchedIn ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10" : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/10"
            }`}
          >
            {punchedIn ? <><Square size={16} /> Punched Out / Stop</> : <><Play size={16} /> Punched In / Start</>}
          </button>
        </div>

        {/* Location Verification & Metrics */}
        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900">Virtual Verification Info</h3>
            <p className="text-xs text-slate-400 font-medium">Verify login security signatures and GPS stamps.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <MapPin className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-slate-900">GPS Stamp Located</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Corporate IP checked. Coordinates: 19.0760° N, 72.8777° E (Mumbai Hub)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-violet-50/50 rounded-2xl border border-violet-100/50">
              <Sparkles className="text-violet-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Secure Network Signature</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Device secure signature verified by administrative token. Zero proxy indicators found.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Corporate Policy Target: 8 Hours / Day</span>
            <span className="text-slate-900 font-black">5 Days / Week</span>
          </div>
        </div>
      </div>

      {/* History logs */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h4 className="text-base font-black text-slate-900">Punch Shift Logs</h4>
          <span className="text-xs font-bold text-slate-400">Current Month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/50">
                <th className="px-8 py-4">Shift Date</th>
                <th className="px-8 py-4">Punched In</th>
                <th className="px-8 py-4">Punched Out</th>
                <th className="px-8 py-4">Status Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-600">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/20">
                  <td className="px-8 py-4 text-slate-900">{log.date}</td>
                  <td className="px-8 py-4">{log.checkIn}</td>
                  <td className="px-8 py-4">{log.checkOut || <span className="text-amber-500 italic">In-Progress</span>}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      log.status === "On Time" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
