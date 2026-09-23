import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { AlertTriangle } from 'lucide-react';

export function WarningModal() {
  const { t } = useTranslation();
  const { conflictModalOpen, setConflictModalOpen, triggerToast } = useApp();

  if (!conflictModalOpen) return null;

  const handleKeepOptimal = () => {
    setConflictModalOpen(false);
    triggerToast(t('results.zeroConflicts'), 'success');
  };

  const handleProceedAnyway = () => {
    setConflictModalOpen(false);
    triggerToast('Custom selection applied with warning', 'warning');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full border-t-4 sm:border-2 border-rose-500 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wide">
              {t('conflict.alert')}
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-snug">
              {t('conflict.title')}
            </h3>
          </div>
        </div>

        {/* Breakdown Body */}
        <div className="p-4 space-y-3 text-xs overflow-y-auto">
          {/* Stacked comparison */}
          <div className="space-y-2">
            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-200">
              <p className="text-[10px] font-bold text-rose-700 uppercase">{t('conflict.youSelected')}</p>
              <div className="flex justify-between items-center mt-0.5">
                <p className="font-extrabold text-slate-900 text-xs">State Drought Relief</p>
                <span className="font-bold text-rose-700 text-xs font-mono">₹12,000 Payout</span>
              </div>
            </div>

            <div className="text-center font-bold text-slate-400 text-[10px] py-0.5">
              {t('conflict.conflictsWith')}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-[10px] font-bold text-emerald-700 uppercase">{t('conflict.existingBenefit')}</p>
              <div className="flex justify-between items-center mt-0.5">
                <p className="font-extrabold text-slate-900 text-xs">PM Fasal Bima (PMFBY)</p>
                <span className="font-bold text-emerald-800 text-xs font-mono">₹1,24,000 Cover</span>
              </div>
            </div>
          </div>

          {/* Legal rule */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="text-[10px] font-bold text-slate-800 uppercase flex items-center gap-1">
              <span>📜</span> {t('conflict.legalRule')}
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {t('conflict.legalDesc')}
            </p>
          </div>

          {/* Impact Math */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <span className="text-amber-900 font-bold text-xs">{t('conflict.financialLoss')}</span>
            <span className="text-sm font-black text-rose-700 font-mono">-₹1,12,000 Deficit</span>
          </div>

          {/* Recommendation */}
          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
            💡 {t('conflict.recommendation')}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col gap-2 safe-bottom">
          <button
            onClick={handleKeepOptimal}
            className="btn-gov-primary w-full text-xs py-3 bg-emerald-800 hover:bg-emerald-900 font-black shadow-md"
          >
            {t('conflict.keepOptimal')}
          </button>
          <button
            onClick={handleProceedAnyway}
            className="btn-gov-secondary w-full text-xs py-2 text-slate-600 font-medium"
          >
            {t('conflict.proceedAnyway')}
          </button>
        </div>

      </div>
    </div>
  );
}
