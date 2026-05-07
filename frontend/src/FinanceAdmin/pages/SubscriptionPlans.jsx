import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Package,
  Clock,
  IndianRupee
} from 'lucide-react';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/financeAdminApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '30',
    jobPosts: '10',
    features: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      // Mock data for UI
      setPlans([
        { _id: '1', name: 'Starter', price: 999, duration: 30, jobPosts: 5, isActive: true },
        { _id: '2', name: 'Professional', price: 2999, duration: 30, jobPosts: 20, isActive: true },
        { _id: '3', name: 'Enterprise', price: 9999, duration: 365, jobPosts: 100, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await updatePlan(editingPlan._id, formData);
        toast.success("Plan updated successfully");
      } else {
        await createPlan(formData);
        toast.success("Plan created successfully");
      }
      setShowModal(false);
      fetchPlans();
    } catch (err) {
      toast.error("Failed to save plan");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await deletePlan(id);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 font-medium mt-1">Manage employer membership packages.</p>
        </div>
        <button 
          onClick={() => {
            setEditingPlan(null);
            setFormData({ name: '', price: '', duration: '30', jobPosts: '10', features: '', isActive: true });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
              <button onClick={() => { setEditingPlan(plan); setFormData(plan); setShowModal(true); }} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 rounded-lg">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(plan._id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{plan.duration} Days</span>
                <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-slate-400 font-bold text-sm">/ {plan.duration} days</span>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  {plan.jobPosts} Job Postings
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Premium Support
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <h2 className="text-2xl font-black text-slate-900 mb-8">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                        placeholder="e.g. Starter"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <input 
                        type="number" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                        placeholder="999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                      <input 
                        type="number" 
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Posts</label>
                      <input 
                        type="number" 
                        value={formData.jobPosts}
                        onChange={(e) => setFormData({...formData, jobPosts: e.target.value})}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Save Plan</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionPlans;
