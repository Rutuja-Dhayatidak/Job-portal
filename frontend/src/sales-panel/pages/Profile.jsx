import React, { useState, useEffect } from 'react';
import { getSalesProfile, updateSalesProfile } from '../../services/salesApi';
import { User, Phone, Mail, ShieldCheck, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getSalesProfile();
      if (res.success && res.profile) {
        setProfile({
          firstName: res.profile.firstName || "",
          lastName: res.profile.lastName || "",
          email: res.profile.email || "",
          phone: res.profile.phone || ""
        });
      }
    } catch (err) {
      toast.error("Failed to load representative profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateSalesProfile(profile);
      if (res.success) {
        toast.success("Profile saved successfully!");
      }
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your personal contact signature details as shown on corporate communication logs.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">First Name</label>
            <input 
              type="text"
              required
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
            <input 
              type="text"
              required
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Corporate Email</label>
          <input 
            type="email"
            disabled
            value={profile.email}
            className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl outline-none text-sm font-semibold text-slate-400 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
          <input 
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({...profile, phone: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
          />
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
