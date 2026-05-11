import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createLead, updateLead, getSalesLeads } from '../../services/salesApi';
import { 
  Plus, Save, ArrowLeft, User, Mail, Phone, 
  Building, DollarSign, Calendar, FileText, Globe 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AddLead = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    value: "",
    source: "Direct Outreach",
    followUpDate: "",
    notes: ""
  });

  useEffect(() => {
    if (leadId) {
      loadLeadDetails();
    }
  }, [leadId]);

  const loadLeadDetails = async () => {
    try {
      const res = await getSalesLeads();
      if (res.success) {
        const found = res.leads.find(l => l._id === leadId);
        if (found) {
          // Format date for html input (YYYY-MM-DD)
          let dateStr = "";
          if (found.followUpDate) {
            dateStr = new Date(found.followUpDate).toISOString().split('T')[0];
          }

          setFormData({
            name: found.name || "",
            email: found.email || "",
            phone: found.phone || "",
            company: found.company || "",
            status: found.status || "new",
            value: found.value || "",
            source: found.source || "Direct Outreach",
            followUpDate: dateStr,
            notes: found.notes || ""
          });
        }
      }
    } catch (err) {
      toast.error("Failed to load lead details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      return toast.error("Name, email, and phone fields are mandatory!");
    }

    setLoading(true);
    try {
      if (leadId) {
        const res = await updateLead(leadId, formData);
        if (res.success) {
          toast.success("Lead details updated successfully!");
          navigate('/sales/leads');
        }
      } else {
        const res = await createLead(formData);
        if (res.success) {
          toast.success("New lead registered successfully!");
          navigate('/sales/leads');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save lead information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      {/* Header wrapper */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/sales/leads')}
          className="p-3 bg-white hover:bg-slate-50 text-slate-500 rounded-2xl border border-slate-100 shadow-sm transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {leadId ? "Update Lead Profile" : "Register Enterprise Lead"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {leadId ? "Edit pipeline details for active enterprise candidate." : "Enter enterprise partner contact information."}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Rahul Sharma"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="rahul@enterprise.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company / Organization</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Google Inc."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Deal Value */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deal Value (INR)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                placeholder="75000"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Follow-Up Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
          </div>

          {/* Source Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lead Source</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="Direct Outreach">Direct Outreach</option>
                <option value="Cold Email">Cold Email</option>
                <option value="LinkedIn">LinkedIn Campaign</option>
                <option value="Inbound Request">Inbound Form</option>
                <option value="Referral">Client Referral</option>
              </select>
            </div>
          </div>

          {/* Status Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
            <div className="relative">
              <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won (Closed)</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Internal Log Notes</label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 text-slate-300" size={18} />
            <textarea 
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Record comments, meeting dates, or pending questions discussed..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold resize-none"
            ></textarea>
          </div>
        </div>

        {/* Submit Wrapper */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "Saving information..." : leadId ? "Update Lead Details" : "Register CRM Lead"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLead;
