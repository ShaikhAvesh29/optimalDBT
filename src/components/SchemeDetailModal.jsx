import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { X, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { getAppLanguage } from '../i18n/index.js';

export function SchemeDetailModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { schemeModalData, setSchemeModalData } = useApp();
  const isHindi = getAppLanguage() === 'hi';

  if (!schemeModalData) return null;

  const scheme = schemeModalData;

  const handleStartApplication = () => {
    setSchemeModalData(null);
    navigate('/applications');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        
        {/* Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-4 sm:p-5 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
                {scheme.code}
              </span>
              <span className="text-[11px] text-emerald-200 font-medium">{scheme.level}</span>
            </div>
            <h3 className="text-base font-black text-white leading-snug mt-1">
              {isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
            </h3>
            <p className="text-sm font-extrabold text-amber-300 mt-0.5">
              {scheme.payoutFormatted || `₹${scheme.payoutAnnual?.toLocaleString('en-IN')}`}
            </p>
          </div>
          <button
            onClick={() => setSchemeModalData(null)}
            className="text-emerald-200 hover:text-white p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-slate-700 text-xs">
          {/* Description */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('schemes.aboutScheme')}
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              {isHindi ? (scheme.hindiDescription || scheme.description) : scheme.description}
            </p>
          </div>

          {/* Schedule and Processing time */}
          <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[10px] text-slate-500 font-medium">{t('schemes.payoutSchedule')}</p>
              <p className="font-extrabold text-slate-900 mt-0.5 text-xs">{scheme.frequency || 'Annual'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">{t('schemes.approvalTimeline')}</p>
              <p className="font-extrabold text-emerald-800 mt-0.5 text-xs">~{scheme.estimatedDays || 15} days</p>
            </div>
          </div>

          {/* Deduplicated Required Documents */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t('schemes.requiredDocs')}
            </h4>
            <div className="space-y-1.5">
              {(scheme.documents || []).map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">{doc.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black ${
                    doc.required ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.required ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Synergy Box */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <h4 className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              {t('schemes.synergyRules')}
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              {t('schemes.synergyDesc')}
            </p>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex gap-2 safe-bottom">
          <button
            onClick={() => setSchemeModalData(null)}
            className="btn-gov-secondary text-xs py-2.5 px-4 font-bold flex-1"
          >
            {t('schemes.close')}
          </button>
          <button
            onClick={handleStartApplication}
            className="btn-gov-primary text-xs py-2.5 px-4 font-black bg-emerald-800 hover:bg-emerald-900 flex-2 shadow-md"
          >
            {t('schemes.startApp')}
          </button>
        </div>

      </div>
    </div>
  );
}
