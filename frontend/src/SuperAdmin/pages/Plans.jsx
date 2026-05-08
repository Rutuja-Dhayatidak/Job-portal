import React, { useState, useEffect } from "react";
import {
  getPlans,
  createPlan,
  updatePlan,
  togglePlanActive,
  deletePlan,
  getPlanStats
} from "../../services/superAdminApi";
import { toast } from "react-hot-toast";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  X,
  Check,
  AlertTriangle,
  Users,
  Briefcase,
  IndianRupee,
  Activity,
  Award,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
  Zap,
  Info,
  TrendingUp
} from "lucide-react";

const planTypeDetails = {
  free: { label: "Free Trial", color: "from-slate-500 to-slate-600", border: "border-slate-200" },
  basic: { label: "Basic", color: "from-blue-500 to-blue-600", border: "border-blue-100" },
  pro: { label: "Pro Premium", color: "from-emerald-500 to-emerald-600", border: "border-emerald-500 ring-2 ring-emerald-500/20" },
  enterprise: { label: "Enterprise", color: "from-purple-500 to-purple-600", border: "border-purple-200" }
};

const supportTypeLabels = {
  basic: "Self-Service Basic",
  email: "Email Support Desk",
  priority: "Priority VIP Desk",
  dedicated: "24/7 Dedicated Manager"
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activeCompanies: 0,
    monthlyRevenue: 0,
    mostPopularPlan: { name: "N/A", subscribers: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const defaultForm = {
    plan_name: "",
    plan_type: "basic",
    price: 0,
    billing_cycle: "monthly",
    limits: {
      job_posts: 5,
      team_members: 3,
      applications: -1
    },
    features: {
      analytics: false,
      featured_jobs: false,
      priority_support: false,
      custom_branding: false,
      api_access: false,
      dedicated_manager: false
    },
    support_type: "email",
    is_active: true,
    is_popular: false
  };

  const [form, setForm] = useState(defaultForm);

  // Fetch all plans and statistics
  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, statsRes] = await Promise.all([getPlans(), getPlanStats()]);
      if (plansRes.success) setPlans(plansRes.plans);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load subscription plans telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setForm(defaultForm);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    setForm({
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      price: plan.price,
      billing_cycle: plan.billing_cycle,
      limits: {
        job_posts: plan.limits?.job_posts ?? 5,
        team_members: plan.limits?.team_members ?? 3,
        applications: plan.limits?.applications ?? -1
      },
      features: {
        analytics: !!plan.features?.analytics,
        featured_jobs: !!plan.features?.featured_jobs,
        priority_support: !!plan.features?.priority_support,
        custom_branding: !!plan.features?.custom_branding,
        api_access: !!plan.features?.api_access,
        dedicated_manager: !!plan.features?.dedicated_manager
      },
      support_type: plan.support_type || "email",
      is_active: plan.is_active,
      is_popular: plan.is_popular
    });
    setShowEditModal(true);
  };

  const handleOpenToggle = (plan) => {
    // Constraint check: Free plan cannot be disabled
    if (plan.plan_type === "free" && plan.is_active) {
      return toast.error("Free Trial plan cannot be disabled and must remain always available.");
    }
    setSelectedPlan(plan);
    setShowDisableModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await createPlan(form);
      if (res.success) {
        toast.success(`Plan "${form.plan_name}" created successfully!`);
        setShowCreateModal(false);
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create plan.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await updatePlan(selectedPlan._id, form);
      if (res.success) {
        toast.success(`Plan "${form.plan_name}" updated successfully!`);
        if (res.warning) {
          toast(res.warning, { icon: "⚠️", duration: 6000 });
        }
        setShowEditModal(false);
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update plan.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleConfirmToggle = async () => {
    const newStatus = !selectedPlan.is_active;
    try {
      const res = await togglePlanActive(selectedPlan._id, newStatus);
      if (res.success) {
        toast.success(`Plan "${selectedPlan.plan_name}" has been ${newStatus ? "enabled" : "disabled"} successfully!`);
        setShowDisableModal(false);
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle plan status.");
    }
  };

  const handleDeletePlan = async (plan) => {
    if (plan.subscribed_companies > 0) {
      return toast.error(`Cannot delete plan "${plan.plan_name}" because ${plan.subscribed_companies} companies are currently subscribed. Disable it instead.`);
    }

    if (!window.confirm(`Are you absolutely sure you want to hard-delete "${plan.plan_name}"? This action is irreversible.`)) {
      return;
    }

    try {
      const res = await deletePlan(plan._id);
      if (res.success) {
        toast.success(`Plan "${plan.plan_name}" has been deleted.`);
        loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete plan.");
    }
  };

  const handleCheckboxChange = (field) => {
    setForm(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: !prev.features[field]
      }
    }));
  };

  const handleLimitChange = (field, val) => {
    setForm(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [field]: Number(val)
      }
    }));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a1120] tracking-tight flex items-center gap-2">
            <Layers className="text-emerald-600" size={26} />
            <span>Plans Management</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Create, edit and manage subscription plans and limits for employers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#16a34a] hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 border-none cursor-pointer shadow-md shadow-emerald-500/10"
        >
          <Plus size={16} />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* KPI Stats Cards Row */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white border border-[#e2e8f0] rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Plans */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Layers size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Active Plans</p>
              <h3 className="text-2xl font-black text-[#0a1120] mt-1">{stats.totalPlans}</h3>
              <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1">
                <Activity size={10} /> Live sync
              </p>
            </div>
          </div>

          {/* Active Subscribed Companies */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Subscribed Companies</p>
              <h3 className="text-2xl font-black text-[#0a1120] mt-1">{stats.activeCompanies}</h3>
              <p className="text-[10px] text-blue-600 font-extrabold flex items-center gap-0.5 mt-1">
                +12% vs last month
              </p>
            </div>
          </div>

          {/* Monthly Recurring Revenue */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estimated Monthly Revenue</p>
              <h3 className="text-2xl font-black text-[#0a1120] mt-1">
                ₹{stats.monthlyRevenue.toLocaleString("en-IN")}
              </h3>
              <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1">
                <TrendingUp size={10} /> +8.3% compounding
              </p>
            </div>
          </div>

          {/* Most Popular Plan */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
              <Award size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Most Popular Tier</p>
              <h3 className="text-2xl font-black text-[#0a1120] mt-1">{stats.mostPopularPlan.name}</h3>
              <p className="text-[10px] text-purple-600 font-extrabold flex items-center gap-0.5 mt-1">
                {stats.mostPopularPlan.subscribers} companies enrolled
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Plans */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent animate-spin mx-auto rounded-full"></div>
          <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-4">Loading plans workspace...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl">
          <Layers className="text-slate-300 mx-auto mb-4" size={48} />
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">No Plans Indexed</h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Generate a custom plan structure to manage employer memberships.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isPro = plan.plan_type === "pro";
            const detail = planTypeDetails[plan.plan_type] || { label: plan.plan_name, color: "from-slate-500 to-slate-600", border: "border-slate-200" };

            return (
              <div
                key={plan._id}
                className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isPro 
                    ? "border-emerald-500 shadow-xl shadow-emerald-500/5 ring-4 ring-emerald-500/10" 
                    : "border-[#e2e8f0] hover:shadow-xl hover:shadow-slate-100"
                } ${!plan.is_active ? "opacity-75 grayscale bg-slate-50/50" : ""}`}
              >
                {/* Popular Badge */}
                {plan.is_popular && (
                  <span className="absolute top-4 right-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-600/10 z-10 animate-pulse">
                    <Zap size={10} /> Recommended popular
                  </span>
                )}

                {/* Card Header */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${detail.color}`}></span>
                    <h2 className="text-xl font-extrabold text-[#0a1120] uppercase tracking-wide">{plan.plan_name}</h2>
                    {!plan.is_active && (
                      <span className="bg-red-50 text-red-600 border border-red-100 font-extrabold text-[8px] uppercase px-2 py-0.5 rounded-md">
                        Inactive / Disabled
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-black text-[#0a1120]">
                      {plan.price === 0 && plan.plan_type === "enterprise" ? "Custom" : `₹${plan.price.toLocaleString("en-IN")}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-slate-400 font-extrabold uppercase ml-1">
                        / {plan.billing_cycle === "monthly" ? "Month" : plan.billing_cycle}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-wider">
                    {plan.subscribed_companies} Active Corporate Subscribers
                  </p>

                  <div className="border-t border-slate-100 my-5"></div>

                  {/* Limits Section */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Plan limits quota</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Job Posts</p>
                        <p className="text-xs font-extrabold text-[#0a1120] mt-1">
                          {plan.limits?.job_posts === -1 ? "Unlimited" : `${plan.limits?.job_posts ?? 0} Posts`}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Team Size</p>
                        <p className="text-xs font-extrabold text-[#0a1120] mt-1">
                          {plan.limits?.team_members === -1 ? "Unlimited" : `${plan.limits?.team_members ?? 0} Members`}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Applications</p>
                        <p className="text-xs font-extrabold text-[#0a1120] mt-1">
                          {plan.limits?.applications === -1 ? "Unlimited" : `${plan.limits?.applications ?? 0} / Job`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="mt-5 space-y-3">
                    <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Key feature access</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        {plan.features?.analytics ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.analytics ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Live Analytics & Metrics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features?.featured_jobs ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.featured_jobs ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Premium Featured Jobs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features?.priority_support ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.priority_support ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Priority VIP Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features?.custom_branding ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.custom_branding ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Company Brand Portal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features?.api_access ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.api_access ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Developer API Tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features?.dedicated_manager ? (
                          <Check className="text-emerald-500" size={14} />
                        ) : (
                          <X className="text-slate-300" size={14} />
                        )}
                        <span className={plan.features?.dedicated_manager ? "text-slate-800 font-extrabold" : "text-slate-400 font-semibold"}>Dedicated Key Manager</span>
                      </div>
                    </div>
                  </div>

                  {/* Support Desk */}
                  <div className="mt-5 flex items-center gap-2 bg-slate-50 p-2.5 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                    <Info size={14} className="text-emerald-600" />
                    <span>Support Desk Tier: <strong>{supportTypeLabels[plan.support_type] || plan.support_type}</strong></span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 flex gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="flex-1 py-3 px-4 bg-slate-50 hover:bg-[#0a1120] hover:text-white border border-[#e2e8f0] text-[#0a1120] rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Edit size={12} />
                    <span>Configure Plan</span>
                  </button>

                  <button
                    onClick={() => handleOpenToggle(plan)}
                    disabled={plan.plan_type === "free" && plan.is_active}
                    className={`flex-1 py-3 px-4 border text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      plan.is_active
                        ? "bg-amber-50 border-amber-100 hover:bg-amber-500 hover:text-[#0a1120] text-amber-600"
                        : "bg-emerald-50 border-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-600"
                    }`}
                  >
                    {plan.is_active ? (
                      <>
                        <ToggleLeft size={14} />
                        <span>Disable Plan</span>
                      </>
                    ) : (
                      <>
                        <ToggleRight size={14} />
                        <span>Enable Plan</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDeletePlan(plan)}
                    disabled={plan.subscribed_companies > 0}
                    className="py-3 px-3.5 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white border border-red-100 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:hover:bg-red-50 disabled:hover:text-red-500"
                    title={plan.subscribed_companies > 0 ? "Companies are actively subscribed, cannot delete" : "Hard Delete Plan"}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW PLAN MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#0a1120]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] w-full max-w-2xl shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-[#0a1120] uppercase tracking-wider">Configure Subscription Tier</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Define membership pricing and enforce strict quota boundaries.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starter Pack"
                    value={form.plan_name}
                    onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Plan Category Tier *</label>
                  <select
                    value={form.plan_type}
                    onChange={(e) => setForm({ ...form, plan_type: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="free">Free Trial</option>
                    <option value="basic">Basic Plan</option>
                    <option value="pro">Pro Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pricing (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 1999"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Billing Frequency *</label>
                  <select
                    value={form.billing_cycle}
                    onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="monthly">Monthly Recurring</option>
                    <option value="yearly">Yearly Recurring</option>
                    <option value="one_time">One-Time Account Activation</option>
                  </select>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Configure Strict Usage Limits (-1 for Unlimited)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Job Posts Limit</label>
                    <input
                      type="number"
                      required
                      value={form.limits.job_posts}
                      onChange={(e) => handleLimitChange("job_posts", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Team Invitations Limit</label>
                    <input
                      type="number"
                      required
                      value={form.limits.team_members}
                      onChange={(e) => handleLimitChange("team_members", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Apps Limit per Job</label>
                    <input
                      type="number"
                      required
                      value={form.limits.applications}
                      onChange={(e) => handleLimitChange("applications", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Features Toggle Switches */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Toggle Access Gateways</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  {[
                    { key: "analytics", label: "Live performance analytics" },
                    { key: "featured_jobs", label: "Allow premium featured listings" },
                    { key: "priority_support", label: "Priority customer support tier" },
                    { key: "custom_branding", label: "White-labeled corporate branding" },
                    { key: "api_access", label: "Expose developer web API access" },
                    { key: "dedicated_manager", label: "Dedicated key account manager" }
                  ].map((feat) => (
                    <label
                      key={feat.key}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer select-none transition-colors"
                    >
                      <span className="text-slate-600 font-extrabold">{feat.label}</span>
                      <input
                        type="checkbox"
                        checked={form.features[feat.key]}
                        onChange={() => handleCheckboxChange(feat.key)}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 border-slate-200 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Support Type & Priority Flags */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Customer Support Class *</label>
                  <select
                    value={form.support_type}
                    onChange={(e) => setForm({ ...form, support_type: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="basic">Self-Help Basic</option>
                    <option value="email">Email Ticketing Help</option>
                    <option value="priority">Priority Hotline Response</option>
                    <option value="dedicated">Dedicated Executive Account Manager</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Options & Badges</label>
                  <div className="flex gap-4 pt-2.5">
                    <label className="flex items-center gap-2 text-xs font-extrabold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_popular}
                        onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Mark as Recommended Popular</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#16a34a] hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Establish Plan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#0a1120]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] w-full max-w-2xl shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-[#0a1120] uppercase tracking-wider">Configure Subscription Tier</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Modifying: <span className="text-[#0a1120] font-bold">{selectedPlan?.plan_name}</span></p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full bg-transparent border-none cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Subscribed Warning Banner */}
            {selectedPlan?.subscribed_companies > 0 && (
              <div className="bg-amber-50 border-y border-amber-150 p-4 flex items-start gap-3 text-xs text-amber-700 font-semibold">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="font-extrabold">Warning: Plan is actively occupied!</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">
                    There are <strong>{selectedPlan.subscribed_companies} companies</strong> currently subscribed to this plan. Saving modifications will instantly change limit boundaries and feature rules for active workspaces.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Plan Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starter Pack"
                    value={form.plan_name}
                    onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Plan Category Tier *</label>
                  <select
                    value={form.plan_type}
                    onChange={(e) => setForm({ ...form, plan_type: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="free">Free Trial</option>
                    <option value="basic">Basic Plan</option>
                    <option value="pro">Pro Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pricing (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 1999"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Billing Frequency *</label>
                  <select
                    value={form.billing_cycle}
                    onChange={(e) => setForm({ ...form, billing_cycle: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="monthly">Monthly Recurring</option>
                    <option value="yearly">Yearly Recurring</option>
                    <option value="one_time">One-Time Account Activation</option>
                  </select>
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Configure Strict Usage Limits (-1 for Unlimited)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Job Posts Limit</label>
                    <input
                      type="number"
                      required
                      value={form.limits.job_posts}
                      onChange={(e) => handleLimitChange("job_posts", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Team Invitations Limit</label>
                    <input
                      type="number"
                      required
                      value={form.limits.team_members}
                      onChange={(e) => handleLimitChange("team_members", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Apps Limit per Job</label>
                    <input
                      type="number"
                      required
                      value={form.limits.applications}
                      onChange={(e) => handleLimitChange("applications", e.target.value)}
                      className="w-full bg-white border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Features Toggle Switches */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#0a1120] uppercase tracking-widest">Toggle Access Gateways</h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  {[
                    { key: "analytics", label: "Live performance analytics" },
                    { key: "featured_jobs", label: "Allow premium featured listings" },
                    { key: "priority_support", label: "Priority customer support tier" },
                    { key: "custom_branding", label: "White-labeled corporate branding" },
                    { key: "api_access", label: "Expose developer web API access" },
                    { key: "dedicated_manager", label: "Dedicated key account manager" }
                  ].map((feat) => (
                    <label
                      key={feat.key}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer select-none transition-colors"
                    >
                      <span className="text-slate-600 font-extrabold">{feat.label}</span>
                      <input
                        type="checkbox"
                        checked={form.features[feat.key]}
                        onChange={() => handleCheckboxChange(feat.key)}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 border-slate-200 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Support Type & Priority Flags */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Customer Support Class *</label>
                  <select
                    value={form.support_type}
                    onChange={(e) => setForm({ ...form, support_type: e.target.value })}
                    className="w-full bg-slate-50 border border-[#e2e8f0] focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="basic">Self-Help Basic</option>
                    <option value="email">Email Ticketing Help</option>
                    <option value="priority">Priority Hotline Response</option>
                    <option value="dedicated">Dedicated Executive Account Manager</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Options & Badges</label>
                  <div className="flex gap-4 pt-2.5">
                    <label className="flex items-center gap-2 text-xs font-extrabold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.is_popular}
                        onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span>Mark as Recommended Popular</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-[#16a34a] hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Update Plan Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISABLE / TOGGLE PLAN CONFIRMATION POPUP */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-[#0a1120]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2e8f0] w-full max-w-md shadow-2xl rounded-3xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0a1120] uppercase tracking-wider">Confirm Plan Modification</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Are you sure you want to {selectedPlan?.is_active ? "disable" : "enable"} this plan?</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedPlan?.is_active ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase">
                    You are disabling: <span className="text-[#0a1120] font-black">"{selectedPlan?.plan_name}"</span>
                  </p>
                  <p className="text-[11px] text-red-600 bg-red-50/50 p-3.5 rounded-xl border border-red-100 font-semibold leading-relaxed">
                    ⚠️ <strong>Impact Warning:</strong> There are currently <strong>{selectedPlan?.subscribed_companies} companies</strong> subscribed to this plan. They will not be booted off immediately, but <strong>new employers will be blocked</strong> from subscribing, selecting, or upgrading to this plan.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Enabling <strong>"{selectedPlan?.plan_name}"</strong> will immediately publish it to the employer registry and make it available for registration, updates, and subscriptions.
                </p>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowDisableModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border border-[#e2e8f0] text-slate-600 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  No, Retain
                </button>
                <button
                  onClick={handleConfirmToggle}
                  className={`flex-1 font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all border-none cursor-pointer text-white ${
                    selectedPlan?.is_active 
                      ? "bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/10" 
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10"
                  }`}
                >
                  Yes, {selectedPlan?.is_active ? "Disable" : "Enable"} Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
