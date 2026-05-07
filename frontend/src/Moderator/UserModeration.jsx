import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getUsers, banUser, unbanUser, warnUser } from '../services/moderator';
import { User, ShieldAlert, ShieldCheck, Search, MoreVertical, MessageSquare, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

const UserModeration = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await unbanUser(user._id);
        toast.success("User Unblocked");
      } else {
        await banUser(user._id);
        toast.success("User Banned");
      }
      fetchUsers();
    } catch (err) {
      toast.error("Block action failed");
    }
  };

  const handleWarn = async (id) => {
    const reason = window.prompt("Enter warning reason:");
    if (!reason) return;
    try {
      await warnUser(id, reason);
      toast.success("Warning sent");
    } catch (err) {
      toast.error("Warning failed");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1">
      <Header title="User Management" subtitle="Audit user accounts and manage platform access." />
      
      <div className="p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates by name or email..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Candidate</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-zinc-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
                            {user.firstName ? user.firstName[0] : 'U'}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-zinc-500 text-[10px] font-medium">{user.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-black text-zinc-400 bg-white/5 px-3 py-1 rounded-lg uppercase">
                         {user.role}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          {user.isBlocked ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                               <ShieldAlert size={12} /> Banned
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
                               <ShieldCheck size={12} /> Active
                            </span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <button 
                          onClick={() => handleWarn(user._id)}
                          className="p-2.5 bg-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-white/5"
                          title="Issue Warning"
                         >
                           <MessageSquare size={18} />
                         </button>
                         <button 
                          onClick={() => toggleBlock(user)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            user.isBlocked 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                              : 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                          }`}
                         >
                           {user.isBlocked ? 'Restore' : 'Ban Access'}
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default UserModeration;
