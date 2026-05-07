import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Info, 
  Settings2, 
  TrendingUp, 
  Tag, 
  Percent, 
  IndianRupee,
  Loader2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { getPricing, updatePricing } from '../services/financeAdminApi';
import toast from 'react-hot-toast';

const PricingCharges = () => {
  const [pricing, setPricing] = useState({
    jobPostPrice: 499,
    featuredPrice: 999,
    hireCommission: 10,
    resumeAccessPrice: 1999
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const data = await getPricing();
      if (data) setPricing(data);
    } catch (err) {
      toast.error("Failed to load current pricing");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePricing(pricing);
      toast.success("Pricing updated successfully!");
    } catch (err) {
      toast.error("Failed to update pricing");
    } finally {
      setSaving(false);
    }
  };

  const PricingInput = ({ label, value, icon, onChange, suffix = '' }) => (
    <div className="space-y-3">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input 
          type="number" 
          value={value}
          onChange={onChange}
          className="w-full pl-16 pr-12 py-5 bg-white border border-slate-100 rounded-3xl outline-none focus:border-blue-500 focus:shadow-2xl focus:shadow-blue-500/10 transition-all font-black text-slate-900 text-lg tracking-tight"
        />
        {suffix && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-10 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pricing & Charges</h1>
          <p className="text-slate-500 font-medium mt-1">Configure platform-wide transaction and service fees.</p>
        </div>
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner">
           <Settings2 size={28} />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-12">
        {/* Main Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <PricingInput 
             label="Standard Job Post" 
             value={pricing.jobPostPrice} 
             icon={<Tag size={20} />} 
             onChange={e => setPricing({...pricing, jobPostPrice: e.target.value})}
             suffix="INR"
           />
           <PricingInput 
             label="Featured Listing" 
             value={pricing.featuredPrice} 
             icon={<TrendingUp size={20} />} 
             onChange={e => setPricing({...pricing, featuredPrice: e.target.value})}
             suffix="INR"
           />
           <PricingInput 
             label="Hiring Commission" 
             value={pricing.hireCommission} 
             icon={<Percent size={20} />} 
             onChange={e => setPricing({...pricing, hireCommission: e.target.value})}
             suffix="%"
           />
           <PricingInput 
             label="Resume Access (Bulk)" 
             value={pricing.resumeAccessPrice} 
             icon={<ShieldCheck size={20} />} 
             onChange={e => setPricing({...pricing, resumeAccessPrice: e.target.value})}
             suffix="INR"
           />
        </div>

        {/* Warning/Info Section */}
        <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2.5rem] flex gap-6 items-start">
           <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
             <AlertTriangle size={24} />
           </div>
           <div className="space-y-1">
             <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Pricing Policy Warning</h4>
             <p className="text-sm text-amber-800 leading-relaxed font-medium">
               Changes to pricing will reflect immediately across the platform. This affects all new transactions. Existing active subscriptions will remain unaffected until their next billing cycle.
             </p>
           </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
           <button 
             type="submit" 
             disabled={saving}
             className="flex items-center gap-3 px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm hover:bg-black transition-all shadow-2xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
           >
             {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
             Update Platform Pricing
           </button>
        </div>
      </form>

      {/* Audit Log Hint */}
      <div className="pt-10 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
        <Info size={14} /> Last updated by Super Admin on May 10, 2024
      </div>
    </div>
  );
};

export default PricingCharges;
