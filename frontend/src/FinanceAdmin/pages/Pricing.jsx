import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Info, 
  Settings2,
  TrendingUp,
  Tag,
  Percent,
  IndianRupee,
  Loader2
} from 'lucide-react';
import { getPricing, updatePricing } from '../../services/financeAdminApi';
import toast from 'react-hot-toast';

const Pricing = () => {
  const [pricing, setPricing] = useState({
    jobPostPrice: 499,
    featuredPrice: 999,
    hireCommission: 10,
    resumeAccessPrice: 1999
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const data = await getPricing();
      setPricing(data);
    } catch (err) {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updatePricing(pricing);
      toast.success("Pricing updated successfully");
    } catch (err) {
      toast.error("Failed to update pricing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Pricing</h1>
        <p className="text-slate-500 font-medium mt-1">Configure global rates and commission fees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Tag size={12} className="text-blue-500" /> Standard Job Post
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</div>
                  <input 
                    type="number" 
                    value={pricing.jobPostPrice}
                    onChange={(e) => setPricing({...pricing, jobPostPrice: e.target.value})}
                    className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-black text-xl transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold px-1 italic">* Price for a single 30-day job posting.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <TrendingUp size={12} className="text-emerald-500" /> Featured Upgrade
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</div>
                  <input 
                    type="number" 
                    value={pricing.featuredPrice}
                    onChange={(e) => setPricing({...pricing, featuredPrice: e.target.value})}
                    className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-black text-xl transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold px-1 italic">* Additional cost for homepage featuring.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Percent size={12} className="text-indigo-500" /> Hiring Commission
                </label>
                <div className="relative">
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</div>
                  <input 
                    type="number" 
                    value={pricing.hireCommission}
                    onChange={(e) => setPricing({...pricing, hireCommission: e.target.value})}
                    className="w-full pl-5 pr-12 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-black text-xl transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold px-1 italic">* Platform fee per successful hire.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <IndianRupee size={12} className="text-amber-500" /> Resume Database
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</div>
                  <input 
                    type="number" 
                    value={pricing.resumeAccessPrice}
                    onChange={(e) => setPricing({...pricing, resumeAccessPrice: e.target.value})}
                    className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white outline-none font-black text-xl transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold px-1 italic">* Monthly access to candidate resume pool.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button 
                type="submit" 
                disabled={submitting}
                className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black hover:bg-black transition-all flex items-center gap-3 shadow-2xl shadow-slate-900/20"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> Update Pricing</>}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Info size={24} />
            </div>
            <h3 className="text-xl font-black mb-4">Pricing Strategy</h3>
            <p className="text-sm font-medium leading-relaxed opacity-80">
              Updates here will take effect immediately for all new transactions. Existing active subscriptions will not be affected until renewal.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                 <Settings2 size={20} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Tax Rate</p>
                 <p className="text-sm font-black text-slate-900">18% GST (Standard)</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
