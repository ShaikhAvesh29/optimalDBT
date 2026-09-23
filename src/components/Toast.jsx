import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed top-12 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-slide-down">
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center space-x-2.5 max-w-sm text-xs font-bold pointer-events-auto">
        {getIcon()}
        <span className="leading-tight">{toast.message}</span>
      </div>
    </div>
  );
}
