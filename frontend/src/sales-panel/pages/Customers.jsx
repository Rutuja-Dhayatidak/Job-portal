import React, { useState, useEffect } from 'react';
import { getSalesLeads } from '../../services/salesApi';
import { ShieldAlert, Award, Search, Sparkles, Building2, TrendingUp, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getSalesLeads();
      if (res.success) {
        // filter status = "won"
        setCustomers(res.leads.filter(l => l.status === 'won'));
      }
    } catch (err) {
      toast.error("Failed to load customer list");
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Customers</h1>
        <p className="text-slate-500 font-medium mt-1">Check verified, fully converted won accounts currently active on NextHire.</p>
      </div>

      {/* Customer summary card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Award className="text-yellow-400" size={24} />
            Excellent Work, Partner!
          </h3>
          <p className="text-violet-100 text-sm max-w-md font-medium">
            You've successfully converted {customers.length} high-value enterprise relationships. Keep up the hustle.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h4 className="text-3xl font-black">{customers.length}</h4>
            <span className="text-[10px] text-violet-200 font-black tracking-wider uppercase">Paying Clients</span>
          </div>
          <div className="text-center">
            <h4 className="text-3xl font-black">₹{customers.reduce((sum, c) => sum + (c.value || 0), 0).toLocaleString('en-IN')}</h4>
            <span className="text-[10px] text-violet-200 font-black tracking-wider uppercase">Revenue Value</span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search corporate customer accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:border-violet-500 outline-none transition-all text-sm font-semibold shadow-sm"
        />
      </div>

      {/* Corporate list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((client) => (
          <div key={client._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-56">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full"></div>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center font-bold text-emerald-600 text-sm">
                  {client.company ? client.company[0] : client.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{client.company || "Enterprise client"}</h4>
                  <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <Sparkles size={10} /> Active Client
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-1.5 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-slate-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 mt-2 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Account Rep: {client.name}</span>
              <span className="text-slate-900">₹{(client.value || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <Building2 size={32} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest">No active corporate clients</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
