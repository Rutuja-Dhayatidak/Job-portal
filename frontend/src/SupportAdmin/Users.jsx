import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getAllUsers } from '../services/supportAdmin';
import { 
  Users as UsersIcon, 
  Search, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert,
  ExternalLink,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1">
      <Header title="User Help Panel" subtitle="Audit accounts and assist users with platform issues." />
      
      <div className="p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates by name or email..." 
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 text-xs font-bold focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
               <HelpCircle className="text-indigo-600" size={18} />
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Support Session</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Care Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-100">
                            {user.firstName ? user.firstName[0] : 'U'}
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-slate-500 text-[10px] font-medium">{user.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
                          <Calendar size={14} />
                          {new Date(user.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          {user.isBlocked ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-100">
                               <ShieldAlert size={12} /> Banned
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                               <ShieldCheck size={12} /> Active
                            </span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-3">
                         <button 
                          className="p-3 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                          title="Message User"
                         >
                           <Mail size={18} />
                         </button>
                         <button 
                          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                         >
                           <MessageCircle size={14} /> HELP USER
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

export default Users;
