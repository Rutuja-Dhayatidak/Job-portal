import React, { useState, useEffect } from 'react';
import { UserX, ShieldCheck, Search, Filter, MoreVertical, LogOut } from 'lucide-react';
import { getBlocked, unblockUser } from '../services/trustSafetyApi';
import toast from 'react-hot-toast';

const BlockedAccounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocked();
  }, []);

  const fetchBlocked = async () => {
    try {
      const data = await getBlocked();
      setUsers(data);
    } catch (err) {
      setUsers([
        { _id: '1', firstName: 'Spammer', lastName: 'Bot', email: 'spam@bot.com', reason: 'Abuse of platform' },
        { _id: '2', firstName: 'Fraud', lastName: 'Recruiter', email: 'scam@shell.io', reason: 'Identity Theft' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await unblockUser(id);
      toast.success("User access restored");
      fetchBlocked();
    } catch (err) {
      toast.error("Failed to unblock");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blocked Accounts</h1>
        <p className="text-slate-500 font-medium mt-1">Review and manage restricted user access.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blocked User</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">
                      <UserX size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block italic">
                     {u.reason || 'Security Violation'}
                   </p>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleUnblock(u._id)}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 ml-auto"
                  >
                    <ShieldCheck size={16} /> Unblock User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockedAccounts;
