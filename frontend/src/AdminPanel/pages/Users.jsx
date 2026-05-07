import React, { useState, useEffect } from 'react';
import { getUsers, blockUser, addCandidate, getCandidateHistory } from '../../services/adminApi';
import { 
  UserX, UserCheck, Search, Filter, Mail, 
  UserPlus, Trash2, ShieldCheck, Loader2, X, Info, History, Clock, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { hasPermission } from '../../utils/permissionUtils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Block Reason States
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // History States
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'password123'
  });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setBlockReason('');
    setIsBlockModalOpen(true);
  };

  const openHistory = async (user) => {
    setSelectedUser(user);
    try {
      // Platform Admin uses the same history logic but backend filters visibility
      const data = await getCandidateHistory(user._id);
      setHistory(data);
      setIsHistoryModalOpen(true);
    } catch (err) {
      toast.error("Failed to fetch history");
    }
  };

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    if (!blockReason.trim()) return toast.error("Reason is mandatory");
    
    setIsSubmitting(true);
    try {
      await blockUser(selectedUser._id, blockReason);
      toast.success(`User ${selectedUser.status === 'blocked' ? 'unblocked' : 'blocked'} successfully`);
      setIsBlockModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCandidate(formData);
      toast.success("Candidate added!");
      setIsModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', password: 'password123' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mr-2" size={24} /> Loading...
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
          <p className="text-sm text-slate-500">Manage all job seeker accounts</p>
        </div>
        
        {hasPermission('Candidates', 'create') && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md shadow-indigo-500/20"
          >
            <UserPlus size={18} />
            Add Candidate
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 bg-white"
          />
        </div>
        <div className="bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">
          Count: {users.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {user.firstName[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                      user.status === 'blocked' ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openHistory(user)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                        title="View Admin Notes"
                      >
                        <History size={18} />
                      </button>
                      
                      {hasPermission('Candidates', 'edit') && (
                        <button 
                          onClick={() => openBlockModal(user)}
                          className={`p-2 rounded-lg transition-all ${
                            user.status === 'blocked' ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={user.status === 'blocked' ? 'Unblock' : 'Block'}
                        >
                          {user.status === 'blocked' ? <UserCheck size={18} /> : <UserX size={18} />}
                        </button>
                      )}

                      {hasPermission('Candidates', 'delete') && (
                        <button 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Delete Candidate"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal (Platform Admin View) */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 italic uppercase tracking-tight flex items-center gap-2">
                <History size={20} className="text-indigo-600" />
                Administrative Notes
              </h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto space-y-6">
              {history.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-medium italic">No notes found for this user.</p>
                </div>
              ) : (
                history.map((item, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${item.role === 'SUPER_ADMIN' ? 'bg-amber-400 ring-4 ring-amber-50' : 'bg-slate-200'}`} />
                      <div className="w-0.5 flex-1 bg-slate-100 group-last:hidden" />
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-slate-900">{item.adminName}</span>
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{item.role}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-2">
                        <p className="text-sm text-slate-700 font-medium italic">"{item.reason}"</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                        <Clock size={10} />
                        {format(new Date(item.createdAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase text-center italic">
                Notes from Super Admins are confidential and visible only to authorized personnel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 italic uppercase tracking-tight">
                {selectedUser?.status === 'blocked' ? 'Unblock Confirmation' : 'Block Confirmation'}
              </h3>
              <button onClick={() => setIsBlockModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleBlockSubmit} className="p-6 space-y-6">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <Info className="text-amber-500 shrink-0" size={20} />
                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                  {selectedUser?.status === 'blocked' 
                    ? "Explain why this account is being restored."
                    : "Reason is mandatory. This will be visible ONLY to Super Admins."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                <textarea 
                  required
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Explain your action..."
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 min-h-[100px] text-sm font-medium"
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isSubmitting || !blockReason.trim()} className={`flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-widest text-white shadow-lg ${selectedUser?.status === 'blocked' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'} disabled:opacity-50`}>
                  {isSubmitting ? "Wait..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold">Add Candidate</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCandidate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                  <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                  <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input required type="email" className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <button disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
                {isSubmitting ? "Adding..." : "Add Candidate"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
