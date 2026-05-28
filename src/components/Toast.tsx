import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastProps {
  key?: React.Key;
  toast: ToastMessage;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  // Dismiss automatically after 5000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/20 shadow-emerald-500/5 bg-[#091510]/95';
      case 'warning':
        return 'border-yellow-500/20 shadow-yellow-500/5 bg-[#151209]/95';
      case 'error':
        return 'border-red-500/20 shadow-red-500/5 bg-[#150a0a]/95';
      default:
        return 'border-blue-500/20 shadow-blue-500/5 bg-[#091015]/95';
    }
  };

  return (
    <div
      className={`max-w-md w-full pointer-events-auto rounded-xl border p-4 shadow-xl flex items-start space-x-3 backdrop-blur-md transition duration-300 ${getBorderColor()}`}
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      
      <div className="flex-1 space-y-0.5">
        <p className="text-sm font-semibold text-white font-sans">{toast.title}</p>
        <p className="text-xs text-slate-300 font-sans leading-relaxed">{toast.message}</p>
      </div>

      <button
        id="dismiss-toast-btn"
        onClick={onClose}
        className="shrink-0 p-1 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
