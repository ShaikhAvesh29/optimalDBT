import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { X, Bell, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export function NotificationsDrawer() {
  const { t } = useTranslation();
  const { notificationsOpen, setNotificationsOpen, triggerToast } = useApp();

  if (!notificationsOpen) return null;

  const handleMarkAllRead = () => {
    setNotificationsOpen(false);
    triggerToast(t('notifications.markRead'), 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-end sm:items-center justify-center animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden animate-slide-up shadow-2xl">
        
        {/* Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-emerald-800" />
            <h3 className="font-extrabold text-slate-900 text-sm">{t('notifications.title')}</h3>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 overflow-y-auto text-xs">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-black text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                PM-KISAN 17th Installment
              </span>
              <span className="text-[10px] text-emerald-700 font-mono">Today</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              ₹2,000 successfully disbursed to your SBI account ending in 4920.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-black text-amber-950 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                PMKSY Micro-Irrigation
              </span>
              <span className="text-[10px] text-amber-700 font-mono">Yesterday</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Water source NOC confirmation pending from District Agri Officer.
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-black text-blue-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                DigiLocker Synced
              </span>
              <span className="text-[10px] text-blue-700 font-mono">3 days ago</span>
            </div>
            <p className="text-blue-800 text-[11px] leading-relaxed">
              Khatauni land records verified automatically with Revenue Department.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center safe-bottom">
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-emerald-800 hover:underline"
          >
            {t('notifications.markRead')}
          </button>
        </div>

      </div>
    </div>
  );
}
