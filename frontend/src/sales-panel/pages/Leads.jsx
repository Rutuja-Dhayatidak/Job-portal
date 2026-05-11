import React, { useState, useEffect } from 'react';
import { 
  getSalesLeads, createLead, updateLead, deleteLead 
} from '../../services/salesApi';
import { 
  Search, Plus, Filter, Trash2, Pencil, 
  ExternalLink, Mail, Phone, Building, DollarSign,
  Briefcase, MessageSquare, PlusCircle, CheckCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await getSalesLeads();
      if (res.success) {
        setLeads(res.leads);
      }
    } catch (err) {
      toast.error("Failed to fetch registered leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;
    try {
      const res = await deleteLead(id);
      if (res.success) {
        toast.success("Lead profile deleted successfully");
        fetchLeads();
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateLead(id, { status });
      if (res.success) {
        toast.success("Lead status updated!");
        fetchLeads();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredLeads = leads.filter(lead => {
    const query = search.toLowerCase();
    const nameMatch = lead.name?.toLowerCase().includes(query);
    const emailMatch = lead.email?.toLowerCase().includes(query);
    const companyMatch = lead.company?.toLowerCase().includes(query);
    const statusMatch = statusFilter === 'all' || lead.status === statusFilter;
    
    return (nameMatch || emailMatch || companyMatch) && statusMatch;
  });

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Upper Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and update all enterprise pipeline leads dynamically.</p>
        </div>
        <button 
          onClick={() => navigate('/sales/add-lead')}
          className="flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={20} />
          Register New Lead
        </button>
      </div>

      {/* Filters Panel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search leads by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-slate-400 shrink-0" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won (Closed)</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/50">
                <th className="px-8 py-5">Lead / Company</th>
                <th className="px-8 py-5">Contact Info</th>
                <th className="px-8 py-5">Deal Value</th>
                <th className="px-8 py-5">Status Indicator</th>
                <th className="px-8 py-5">Next Follow-up</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="group hover:bg-slate-50/20 transition-colors">
                  {/* Lead / Company */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center font-bold text-violet-600 text-sm">
                        {lead.name[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{lead.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Building size={12} />
                          {lead.company || "Enterprise Account"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contacts */}
                  <td className="px-8 py-6 space-y-1">
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Mail size={12} className="text-slate-400" />
                      {lead.email}
                    </p>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Phone size={12} className="text-slate-400" />
                      {lead.phone}
                    </p>
                  </td>

                  {/* Value */}
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-slate-900 flex items-center">
                      ₹{(lead.value || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{lead.source || "Outreach"}</span>
                  </td>

                  {/* Status Select */}
                  <td className="px-8 py-6">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-none outline-none cursor-pointer ${
                        lead.status === 'won' ? 'bg-emerald-50 text-emerald-600' :
                        lead.status === 'proposal' ? 'bg-indigo-50 text-indigo-600' :
                        lead.status === 'new' ? 'bg-blue-50 text-blue-600' : 
                        lead.status === 'lost' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>

                  {/* Next Follow Up */}
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {lead.followUpDate ? (
                      new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    ) : (
                      <span className="text-slate-300 italic">No Follow-up Scheduled</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => navigate(`/sales/add-lead?id=${lead._id}`)}
                        className="p-2 text-slate-300 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                        title="Edit Lead"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="py-20 text-center text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Briefcase size={32} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">No matching leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leads;
