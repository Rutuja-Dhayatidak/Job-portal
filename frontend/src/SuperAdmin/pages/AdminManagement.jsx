import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Mail, User, Shield, 
  Send, Trash2, Clock, CheckCircle2, 
  AlertCircle, Loader2, Search, Copy, 
  ExternalLink, Check, Pencil, Ban 
} from 'lucide-react';
import { getAdmins, createAdminInvite, revokeAdmin, updateAdmin, suspendAdmin } from '../../services/superAdminApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Platform Admin' });
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const roles = [
    'Platform Admin',
    'Finance Admin',
    'Ops Admin',
    'Support Admin',
    'Trust & Safety',
    'Content Reviewer',
    'Moderator'
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error("Failed to load administrators");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return toast.error("Please fill all fields");
    
    setSubmitting(true);
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin._id, formData);
        toast.success(`Admin updated successfully!`);
      } else {
        await createAdminInvite(formData);
        toast.success(`Invitation sent successfully!`);
      }
      setShowInviteForm(false);
      setEditingAdmin(null);
      setFormData({ name: '', email: '', role: 'Platform Admin' });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save administrator");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: `${admin.firstName} ${admin.lastName}`,
      email: admin.email,
      role: admin.role
    });
    setShowInviteForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSuspend = async (id) => {
    try {
      await suspendAdmin(id);
      toast.success("Admin status updated");
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to update admin status");
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this admin's access?")) return;
    try {
      await revokeAdmin(id);
      toast.success("Admin access revoked");
      fetchAdmins();
    } catch (err) {
      toast.error("Failed to revoke access");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Management</h1>
          <p className="text-slate-500 font-medium mt-1">Create roles and manage platform administrators.</p>
        </div>
        <button 
          onClick={() => {
            if (showInviteForm) {
              setEditingAdmin(null);
              setFormData({ name: '', email: '', role: 'Platform Admin' });
            }
            setShowInviteForm(!showInviteForm);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <UserPlus size={20} />
          {showInviteForm ? "Close Form" : "Invite New Admin"}
        </button>
      </div>

      <AnimatePresence>
        {showInviteForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl max-w-2xl"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              {editingAdmin ? (
                <><Pencil size={20} className="text-emerald-500" /> Edit Administrator</>
              ) : (
                <><Send size={20} className="text-emerald-500" /> Send Invitation</>
              )}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="admin@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assign Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button 
                  disabled={submitting}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                    editingAdmin ? <><Check size={18} /> Update Admin</> : <><Send size={18} /> Send Invite</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900">Platform Administrators</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] bg-slate-50/50">
                <th className="px-8 py-5">Name & Email</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status / Link</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {admins.map((admin) => (
                <tr key={admin._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm">
                        {admin.firstName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{admin.firstName} {admin.lastName}</p>
                        <p className="text-xs text-slate-400 font-medium">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {(() => {
                      const roleColors = {
                        'superAdmin': 'bg-slate-900 text-white',
                        'Platform Admin': 'bg-indigo-50 text-indigo-600',
                        'Finance Admin': 'bg-emerald-50 text-emerald-600',
                        'Ops Admin': 'bg-blue-50 text-blue-600',
                        'Support Admin': 'bg-purple-50 text-purple-600',
                        'Trust & Safety': 'bg-rose-50 text-rose-600',
                        'Moderator': 'bg-amber-50 text-amber-700',
                        'Content Reviewer': 'bg-zinc-100 text-zinc-600'
                      };
                      const colorClass = roleColors[admin.role] || 'bg-slate-50 text-slate-500';
                      return (
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${colorClass}`}>
                          {admin.role}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {admin.status === 'active' ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 size={14} /> Active
                          </span>
                        ) : admin.status === 'pending' ? (
                          <span className="flex items-center gap-1.5 text-orange-500 text-xs font-bold uppercase tracking-wider">
                            <Clock size={14} /> Pending
                          </span>
                        ) : admin.status === 'suspended' ? (
                          <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider">
                            <Ban size={14} /> Suspended
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider">
                            <AlertCircle size={14} /> Blocked
                          </span>
                        )}
                      </div>
                      {admin.status === 'pending' && admin.inviteLink && (
                        <button 
                          onClick={() => copyToClipboard(admin.inviteLink, admin._id)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md w-fit transition-all"
                        >
                          {copiedId === admin._id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Invite Link</>}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400">
                    {new Date(admin.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(admin)}
                      className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Edit Admin"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleSuspend(admin._id)}
                      disabled={admin.role === 'superAdmin' || admin.role === 'SUPER_ADMIN'}
                      className={`p-2 rounded-lg transition-all ${admin.status === 'suspended' ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
                      title={admin.status === 'suspended' ? "Unsuspend Admin" : "Suspend Admin"}
                    >
                      <Ban size={18} />
                    </button>
                    <button 
                      onClick={() => handleRevoke(admin._id)}
                      disabled={admin.role === 'superAdmin' || admin.role === 'SUPER_ADMIN'}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-0"
                      title="Revoke Access"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {admins.length === 0 && !loading && (
            <div className="py-20 text-center text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Shield size={32} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">No Administrators Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
