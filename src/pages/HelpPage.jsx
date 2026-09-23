import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, PhoneCall, HelpCircle, ShieldCheck } from 'lucide-react';

export function HelpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {t('help.title')}
            </h1>
            <p className="text-[11px] text-slate-500">{t('help.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Emergency Helplines */}
      <div className="space-y-2.5">
        <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-2">
          <div className="flex items-center space-x-2.5 text-emerald-950 font-black text-xs">
            <PhoneCall className="w-4 h-4 text-emerald-700" />
            <span>Kisan Call Centre (Toll-Free)</span>
          </div>
          <p className="text-xs text-emerald-900 font-extrabold font-mono">📞 1800-180-1551 / 1551</p>
          <p className="text-[10px] text-emerald-700">Available in 22 regional languages (6 AM to 10 PM)</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-3xl border border-blue-200 space-y-2">
          <div className="flex items-center space-x-2.5 text-blue-950 font-black text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>PM-KISAN Helpdesk</span>
          </div>
          <p className="text-xs text-blue-900 font-extrabold font-mono">📞 011-24300606 / 155261</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="card-gov p-4 space-y-3 bg-white">
        <h2 className="font-black text-slate-900 text-sm">Frequently Asked Questions</h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <p className="font-extrabold text-slate-900 text-xs">Q: {t('help.faq1Q')}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{t('help.faq1A')}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <p className="font-extrabold text-slate-900 text-xs">Q: {t('help.faq2Q')}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{t('help.faq2A')}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <p className="font-extrabold text-slate-900 text-xs">Q: {t('help.faq3Q')}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{t('help.faq3A')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
