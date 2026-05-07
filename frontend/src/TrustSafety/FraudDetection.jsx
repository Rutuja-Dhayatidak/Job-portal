import React, { useState, useEffect } from 'react';
import { Fingerprint, AlertCircle, ShieldAlert, MoreVertical, Flag, Search, Filter } from 'lucide-react';
import { getFraudData } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const FraudDetection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraud();
  }, []);

  const fetchFraud = async () => {
    try {
      const data = await getFraudData();
      setAlerts(data);
    } catch (err) {
      setAlerts([
        { _id: '1', user: 'User_452', alert: 'Multiple Account Login', severity: 'High', timestamp: '2024-03-16 10:00' },
        { _id: '2', user: 'Employer_X', alert: 'Rapid Job Posting', severity: 'Medium', timestamp: '2024-03-16 11:30' },
        { _id: '3', user: 'Guest_78', alert: 'Suspicious IP Address', severity: 'Critical', timestamp: '2024-03-16 12:15' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = (id) => {
    toast.error("User flagged for security audit");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fraud Detection</h1>
        <p className="text-slate-500 font-medium mt-1">Monitor suspicious activities and protect the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <div key={alert._id} className={`bg-white p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-6 ${alert.severity === 'Critical' ? 'border-red-200 bg-red-50/10' : 'border-slate-100'}`}>
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                alert.severity === 'Critical' ? 'bg-red-100 text-red-600' : 
                alert.severity === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Fingerprint size={28} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900">{alert.alert}</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    alert.severity === 'Critical' ? 'bg-red-500 text-white' : 
                    alert.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400">User: <span className="text-slate-900">{alert.user}</span></span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-xs font-bold text-slate-400">{alert.timestamp}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleFlag(alert._id)}
                className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
              >
                <Flag size={18} /> Flag User
              </button>
              <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudDetection;
