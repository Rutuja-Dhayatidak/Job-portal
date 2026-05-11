import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[75vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="p-4 bg-violet-50 text-violet-600 rounded-full animate-bounce">
        <Compass size={48} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Resource Not Found</h2>
        <p className="text-slate-500 font-medium max-w-sm text-sm">We couldn't locate this page or CRM resource parameters inside the Sales portal.</p>
      </div>
      <button 
        onClick={() => navigate('/sales/dashboard')}
        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all text-xs"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
