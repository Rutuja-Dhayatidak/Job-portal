import React from 'react';
import Header from './components/Header';
import { MessageCircle, Zap } from 'lucide-react';

const ChatSupport = () => {
  return (
    <div className="flex-1">
      <Header title="Live Chat Support" subtitle="Real-time communication with active platform users." />
      <div className="p-20 flex flex-col items-center justify-center text-center space-y-8">
         <div className="w-32 h-32 bg-indigo-50 border border-indigo-100 rounded-[3rem] flex items-center justify-center text-indigo-600 animate-pulse shadow-sm">
            <MessageCircle size={64} />
         </div>
         <div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Live Chat Module</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
               Socket.io integration for real-time customer care is scheduled for the next deployment phase. 
               Stay tuned for instant messaging capabilities.
            </p>
         </div>
         <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <Zap size={14} className="animate-bounce" /> Coming Soon to NextHire
         </div>
      </div>
    </div>
  );
};

export default ChatSupport;
