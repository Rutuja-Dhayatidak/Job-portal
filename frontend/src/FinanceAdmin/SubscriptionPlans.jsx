import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  Package, 
  Clock, 
  IndianRupee,
  Search,
  ChevronRight
} from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '../services/financeAdminApi';
import toast from 'react-hot-toast';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 30,
    jobPosts: 10,
    features: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        features: formData.features.split(',').map(f => f.trim()) 
      };
      if (editingPlan) {
        await updatePlan(editingPlan._id, payload);
        toast.success("Plan updated successfully");
      } else {
        await createPlan(payload);
        toast.success("Plan created successfully");
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(id);
        toast.success("Plan deleted");
        fetchPlans();
      } catch (err) {
        toast.error("Failed to delete plan");
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 font-medium mt-1">Manage employer membership tiers and benefits.</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setShowModal(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all overflow-hidden group">
              <div className="p-10 pb-0">
                 <div className="flex items-center justify-between mb-8">
                   <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <Package size={28} />
                   </div>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => { setEditingPlan(plan); setFormData({ ...plan, features: plan.features.join(', ') }); setShowModal(true); }}
                       className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                     >
                       <Pencil size={18} />
                     </button>
                     <button 
                       onClick={() => handleDelete(plan._id)}
                       className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                     >
                       <Trash2 size={18} />
                     </button>
                   </div>
                 </div>
                 
                 <div className="space-y-1">
                   <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                     <Clock size={14} /> {plan.duration} Days Validity
                   </div>
                 </div>

                 <div className="mt-8 mb-10 flex items-baseline gap-1">
                   <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{plan.price}</span>
                   <span className="text-slate-400 font-bold">/ package</span>
                 </div>
              </div>

              <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-50">
                 <div className="flex items-center gap-2 mb-6">
                    <CheckCircle2 className="text-emerald-500" size={18} />
                    <span className="text-sm font-black text-slate-700">{plan.jobPosts} Job Postings</span>
                 </div>
                 <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-slate-500 font-medium group/feat">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full transition-transform group-hover/feat:scale-150"></div>
                        {feature}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Placeholder - Functional implementation would follow standard React modal pattern */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSubmit}>
              <div className="p-10 bg-slate-900 text-white">
                <h3 className="text-2xl font-black">{editingPlan ? 'Edit' : 'Create'} Subscription Plan</h3>
                <p className="text-slate-400 text-sm mt-1">Configure plan details and pricing architecture.</p>
              </div>
              <div className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Enterprise Pro"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="9999"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                    <input 
                      type="number" 
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Posts</label>
                    <input 
                      type="number" 
                      value={formData.jobPosts}
                      onChange={e => setFormData({...formData, jobPosts: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Features (Comma separated)</label>
                  <textarea 
                    value={formData.features}
                    onChange={e => setFormData({...formData, features: e.target.value})}
                    placeholder="Premium Support, Featured Listings, etc."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm min-h-[100px]"
                  />
                </div>
              </div>
              <div className="p-10 pt-0 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
