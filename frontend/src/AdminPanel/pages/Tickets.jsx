import React, { useState, useEffect } from 'react';
import { getTickets, resolveTicket } from '../../services/adminApi';
import { MessageSquare, CheckCircle, AlertCircle, User, Clock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { hasPermission } from '../../utils/permissionUtils';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await resolveTicket(id);
      toast.success(res.message);
      fetchTickets();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
        <p className="text-slate-500 font-medium text-sm">Resolve candidate and employer complaints and issues.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={ticket._id}
            className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group ${
              ticket.status === 'resolved' ? 'opacity-75 grayscale-[0.5]' : ''
            }`}
          >
            {/* Status Ribbon */}
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest ${
              ticket.status === 'resolved' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-amber-500 text-white'
            }`}>
              {ticket.status}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-100">
                <MessageSquare size={32} />
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 pr-20">{ticket.issue}</h3>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <User size={14} className="text-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">{ticket.user?.firstName} {ticket.user?.lastName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} className="text-indigo-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                    REF: #{ticket._id.slice(-6)}
                  </div>
                  
                  {ticket.status === 'open' ? (
                    hasPermission('Support', 'edit') ? (
                      <button 
                        onClick={() => handleResolve(ticket._id)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 group/btn"
                      >
                        <CheckCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                        Mark as Resolved
                      </button>
                    ) : (
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pending Resolution</div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
                      <Check size={20} /> Resolved by Admin
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tickets.length === 0 && !loading && (
        <div className="p-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto">
            <AlertCircle size={32} />
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No support tickets found</p>
        </div>
      )}
    </div>
  );
};

export default Tickets;
