import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, ShieldCheck, ShieldAlert, User, Mail, Shield } from 'lucide-react';
import { getUsers } from '../services/opsAdminApi';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      // Mock data
      setUsers([
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'candidate', status: 'active' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@company.com', role: 'employer', status: 'blocked' },
        { _id: '3', firstName: 'Mike', lastName: 'Ross', email: 'mike@law.com', role: 'candidate', status: 'active' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = (id, status) => {
    toast.success(`User ${status === 'active' ? 'blocked' : 'unblocked'} successfully`);
    // API call would go here
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidates & Companies</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage all platform participants.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center font-bold">
                      {u.firstName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'employer' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${u.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {u.status === 'active' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {u.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleBlock(u._id, u.status)}
                      className={`p-2 rounded-xl transition-all ${u.status === 'active' ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      {u.status === 'active' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
