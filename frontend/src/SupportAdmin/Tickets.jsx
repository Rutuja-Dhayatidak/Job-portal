import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { getTickets, replyTicket, closeTicket } from '../services/supportAdmin';
import { 
  LifeBuoy, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  User, 
  Send,
  MoreVertical,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    try {
      await replyTicket(selectedTicket._id, reply);
      toast.success("Reply sent successfully");
      setReply('');
      fetchTickets();
      const updatedData = await getTickets();
      setSelectedTicket(updatedData.find(t => t._id === selectedTicket._id));
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  const handleClose = async (id) => {
    try {
      await closeTicket(id);
      toast.success("Ticket resolved");
      fetchTickets();
      if (selectedTicket && selectedTicket._id === id) {
        setSelectedTicket(prev => ({ ...prev, status: 'resolved' }));
      }
    } catch (err) {
      toast.error("Failed to close ticket");
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'All' || t.status === filter.toLowerCase().replace(' ', '-'));

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header title="Ticket Management" subtitle="Track, manage and resolve user support requests." />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Ticket List */}
        <div className="w-[450px] border-r border-slate-100 bg-white flex flex-col overflow-hidden shadow-sm z-10">
          <div className="p-8 border-b border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-widest">Inbox</h3>
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg shadow-indigo-500/20">
                {tickets.filter(t => t.status === 'open').length} New
              </span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Open', 'In Progress', 'Resolved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === f 
                      ? 'bg-slate-900 text-white shadow-xl' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${
                  selectedTicket?._id === ticket._id 
                    ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20 text-white' 
                    : 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                     selectedTicket?._id === ticket._id ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600 border border-slate-100'
                   }`}>
                      <LifeBuoy size={20} />
                   </div>
                   <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                     ticket.status === 'open' ? 'bg-amber-500 text-white' : 
                     ticket.status === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
                   }`}>
                     {ticket.status}
                   </span>
                </div>
                
                <div className="relative z-10">
                   <h4 className={`font-black text-sm mb-1 ${selectedTicket?._id === ticket._id ? 'text-white' : 'text-slate-900'}`}>
                     {ticket.subject}
                   </h4>
                   <p className={`text-[11px] line-clamp-2 ${selectedTicket?._id === ticket._id ? 'text-indigo-100/70' : 'text-slate-500'}`}>
                     {ticket.message}
                   </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {ticket.user?.firstName?.[0] || 'U'}
                      </div>
                      <span className={`text-[10px] font-bold ${selectedTicket?._id === ticket._id ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {ticket.user?.firstName}
                      </span>
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${selectedTicket?._id === ticket._id ? 'text-indigo-200/50' : 'text-slate-300'}`}>
                     {new Date(ticket.createdAt).toLocaleDateString()}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Thread */}
        <div className="flex-1 bg-[#f8fafc] flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.01] to-transparent pointer-events-none" />
          
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between relative z-10 shadow-sm">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                       <LifeBuoy size={28} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-black text-slate-900">{selectedTicket.subject}</h2>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 py-1 border border-slate-100 rounded-md">
                            #{selectedTicket._id.slice(-6)}
                          </span>
                       </div>
                       <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><User size={12} /> {selectedTicket.user?.email}</span>
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    {selectedTicket.status !== 'resolved' && (
                      <button 
                        onClick={() => handleClose(selectedTicket._id)}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                      >
                        RESOLVE ISSUE
                      </button>
                    )}
                    <button className="p-3 bg-white text-slate-400 hover:text-slate-900 rounded-xl border border-slate-100 shadow-sm transition-all">
                       <MoreVertical size={18} />
                    </button>
                 </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-12 space-y-10 relative z-10">
                  {/* User's Original Message */}
                  <div className="flex gap-6 max-w-4xl">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black flex-shrink-0 shadow-sm border border-indigo-100">
                        {selectedTicket.user?.firstName?.[0]}
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-black text-slate-900">{selectedTicket.user?.firstName} {selectedTicket.user?.lastName}</span>
                           <span className="text-[10px] font-bold text-slate-400 tracking-widest">ORIGINAL MESSAGE</span>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 text-slate-600 text-sm leading-relaxed shadow-sm">
                           {selectedTicket.message}
                        </div>
                     </div>
                  </div>

                  {/* Replies Thread */}
                  {selectedTicket.replies?.map((rep, idx) => (
                    <div key={idx} className={`flex gap-6 max-w-4xl ${rep.sender === 'support' ? 'ml-auto flex-row-reverse' : ''}`}>
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-sm ${
                         rep.sender === 'support' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                       }`}>
                          {rep.sender === 'support' ? 'S' : selectedTicket.user?.firstName?.[0]}
                       </div>
                       <div className={`space-y-2 ${rep.sender === 'support' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-3 justify-end">
                             <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                               {new Date(rep.createdAt).toLocaleString()}
                             </span>
                             <span className={`text-xs font-black ${rep.sender === 'support' ? 'text-emerald-600' : 'text-slate-900'}`}>
                               {rep.sender === 'support' ? 'SUPPORT AGENT' : selectedTicket.user?.firstName}
                             </span>
                          </div>
                          <div className={`p-6 rounded-3xl border text-sm leading-relaxed shadow-sm ${
                            rep.sender === 'support' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                              : 'bg-white border-slate-100 text-slate-600'
                          }`}>
                             {rep.message}
                          </div>
                       </div>
                    </div>
                  ))}
              </div>

              {/* Reply Input Area */}
              {selectedTicket.status !== 'resolved' && (
                <div className="p-8 bg-white border-t border-slate-100 relative z-10 shadow-lg">
                   <div className="relative group">
                      <textarea 
                        rows="3"
                        placeholder="Type your official response here..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 pr-40 text-sm text-slate-700 font-medium focus:outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-400"
                      />
                      <div className="absolute right-6 bottom-6 flex items-center gap-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Press CMD + Enter to send</p>
                         <button 
                           onClick={handleReply}
                           className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/30"
                         >
                           <Send size={14} /> SEND REPLY
                         </button>
                      </div>
                   </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-200 space-y-6">
               <LifeBuoy size={80} className="opacity-10 text-slate-900" />
               <div className="text-center">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Helpdesk Select</h3>
                  <p className="text-[10px] font-bold text-slate-300 italic">Select a ticket from the inbox to begin resolution</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
