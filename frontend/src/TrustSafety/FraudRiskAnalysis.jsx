import React, { useState, useEffect } from 'react';
import { Fingerprint, TrendingUp, AlertCircle, ShieldAlert, MoreVertical, Search, Filter } from 'lucide-react';
import { getFraudData } from '../services/trustSafetyApi';

const FraudRiskAnalysis = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFraud();
  }, []);

  const fetchFraud = async () => {
    try {
      const result = await getFraudData();
      setData(result);
    } catch (err) {
      setData([
        { _id: '1', user: 'Spammer_Bot_01', alert: 'Multiple Account Creation', severity: 'Critical', calculatedRisk: 'Critical' },
        { _id: '2', user: 'Shell_Corp_Inc', alert: 'Suspicious IP Cluster', severity: 'High', calculatedRisk: 'High' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fraud & Risk Analysis</h1>
        <p className="text-slate-500 font-medium mt-1">Deep analysis of suspicious platform patterns.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs">
               <ShieldAlert size={16} /> 12 High Risk Detected
             </div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity Pattern</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</th>
              <th className="px-8 py-5 text-right">Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Fingerprint size={20} />
                    </div>
                    <span className="font-bold text-slate-900">{item.user}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-bold text-slate-600 italic">{item.alert}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.calculatedRisk === 'Critical' ? 'bg-red-500' : 
                      item.calculatedRisk === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.calculatedRisk}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                    Run Deep Audit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FraudRiskAnalysis;
