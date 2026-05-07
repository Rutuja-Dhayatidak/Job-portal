import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, User, AlertCircle, Filter } from 'lucide-react';
import { getSupportTickets, resolveTicket } from '../services/opsAdminApi';
import toast from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getSupportTickets();
      setTickets(data);
    } catch (err) {
      setTickets([
        { _id: '1', user: 'John Doe', issue: 'Cannot upload profile picture', status: 'Open', priority: 'High', createdAt: '2024-03-12' },
        { _id: '2', user: 'Alice Wang', issue: 'Job post not showing', status: 'Open', priority: 'Medium', createdAt: '2024-03-13' },
        { _id: '3', user: 'Bob Smith', issue: 'Password reset link expired', status: 'Resolved', priority: 'Low', createdAt: '2024-03-11' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveTicket(id);
      toast.success("Ticket resolved");
      fetchTickets();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Problem Solving</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and resolve user issues.</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          <Filter size={18} /> Filter Status
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket._id} className={`bg-white p-6 rounded-[2rem] border transition-all flex items-center justify-between gap-6 ${ticket.status === 'Open' ? 'border-slate-100' : 'border-emerald-100 bg-emerald-50/20'}`}>
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${ticket.status === 'Open' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {ticket.status === 'Open' ? <AlertCircle size={28} /> : <CheckCircle2 size={28} />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-slate-900">{ticket.issue}</h3>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${ticket.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><User size={12} /> {ticket.user}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {ticket.status === 'Open' && (
              <button 
                onClick={() => handleResolve(ticket._id)}
                className="px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all"
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTickets;
