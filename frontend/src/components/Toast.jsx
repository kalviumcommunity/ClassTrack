import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl transition-all duration-300 transform animate-fade-in-up glass border-l-4 ${
      isSuccess ? 'border-l-emerald-500 text-slate-800' : 'border-l-rose-500 text-slate-800'
    }`}>
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
      )}
      <span className="text-sm font-semibold pr-3">{message}</span>
      <button 
        onClick={onClose} 
        className="p-1 hover:bg-slate-100/80 rounded-full transition-colors text-slate-400 hover:text-slate-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
