import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { FrictionBadge } from '../components/StatusBadge.jsx';
import { Sparkles, AlertTriangle, ChevronDown, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getAppLanguage } from '../i18n/index.js';

export function ResultsPage() {
  const { t } = useTranslation();
  const { optimization, setSchemeModalData, setConflictModalOpen } = useApp();
  const [whyBetterOpen, setWhyBetterOpen] = useState(false);
  const isHindi = getAppLanguage() === 'hi';

  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Top Hero: Your Optimized Benefit Card */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gov-emerald text-white p-5 rounded-3xl shadow-xl space-y-3 relative overflow-hidden border border-emerald-700/60">
        <div className="flex justify-between items-start">
          <span className="inline-flex items-center space-x-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide shadow-xs">
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>{t('results.badge')}</span>
          </span>
          <span className="badge-gov-green bg-emerald-400/20 text-emerald-200 border-emerald-400/30 text-[10px]">
            {t('results.zeroConflicts')}
          </span>
        </div>

        <div>
          <p className="text-xs text-emerald-200 font-medium">{t('results.optimizedBenefit')}</p>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
            ₹{optimization.totalBenefit.toLocaleString('en-IN')}
          </p>
        </div>

        <p className="text-xs text-emerald-100 leading-relaxed">
          {t('results.unlockMessage', {
            amount: `₹${optimization.totalBenefit.toLocaleString('en-IN')}`,
            count: optimization.eligibleSchemes.length
          })}
        </p>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/80 text-center">
          <div className="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p className="text-base font-black text-amber-400">{optimization.eligibleSchemes.length}</p>
            <p className="text-[9px] text-emerald-200 uppercase font-bold">{t('results.schemesCount')}</p>
          </div>
          <div className="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p className="text-base font-black text-white">{optimization.resolvedConflictsCount}</p>
            <p className="text-[9px] text-emerald-200 uppercase font-bold">{t('results.conflictsResolved')}</p>
          </div>
          <div className="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p className="text-base font-black text-amber-400">12</p>
            <p className="text-[9px] text-emerald-200 uppercase font-bold">{t('results.docsCount')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex gap-2">
          <Link
            to="/applications"
            className="btn-gov-accent flex-1 text-xs py-2.5 font-black text-center shadow-md flex items-center justify-center space-x-1"
          >
            <span>{t('results.startApplications')}</span>
          </Link>
          <button
            onClick={handlePrint}
            className="btn-gov-secondary text-xs py-2.5 px-3 font-bold bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            {t('results.downloadPdf')}
          </button>
        </div>
      </section>

      {/* Status Quo vs Optimal Mobile Comparison (Vertical Flow) */}
      <section className="card-gov p-4 space-y-3.5 bg-white border-2 border-emerald-600/60">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h2 className="font-black text-slate-900 text-sm">{t('results.statusQuoVsOptimal')}</h2>
            <p className="text-[10px] text-slate-500">{t('results.whyBetterSubtitle')}</p>
          </div>
          <button
            onClick={() => setConflictModalOpen(true)}
            className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-100 active:scale-95 flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>{t('results.testConflict')}</span>
          </button>
        </div>

        {/* Vertical Comparison Steps */}
        <div className="space-y-2 text-xs">
          {/* Default */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">{t('results.whatYouMightChoose')}</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{t('results.uncoordinated')}</p>
            </div>
            <p className="text-base font-extrabold text-slate-600 font-mono">
              ₹{optimization.statusQuoBenefit?.toLocaleString('en-IN') || '84,000'}
            </p>
          </div>

          <div className="text-center text-slate-400 text-xs font-bold">
            ↓ <em>OptimalDBT Coordination</em> ↓
          </div>

          {/* OptimalDBT */}
          <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-600 flex justify-between items-center">
            <div>
              <span className="badge-gov-green text-[9px] mb-0.5">✓ Recommended</span>
              <p className="text-xs font-extrabold text-emerald-950">{t('results.optimalRecommendation')}</p>
            </div>
            <p className="text-lg font-black text-emerald-900 font-mono">
              ₹{optimization.totalBenefit.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="text-center text-emerald-700 text-xs font-bold">
            ↓ <em>Net Financial Advantage</em> ↓
          </div>

          {/* Surplus */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-amber-900 uppercase">{t('results.surplusBenefit')}</p>
              <p className="text-[10px] text-amber-800">{t('results.extraCapital')}</p>
            </div>
            <p className="text-base font-black text-amber-700 font-mono">
              +₹{optimization.surplusBenefit.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Expandable "Why is this better?" */}
        <div className="pt-1">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 text-xs">
            <button
              onClick={() => setWhyBetterOpen(!whyBetterOpen)}
              className="w-full font-extrabold text-emerald-950 flex justify-between items-center text-left"
            >
              <span>{t('results.whyBetterAccordion')}</span>
              <ChevronDown className={`w-4 h-4 text-emerald-700 transition-transform ${whyBetterOpen ? 'rotate-180' : ''}`} />
            </button>

            {whyBetterOpen && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-600 space-y-2 text-[11px] leading-relaxed animate-slide-down">
                <p>{t('results.reason1')}</p>
                <p>{t('results.reason2')}</p>
                <p>{t('results.reason3')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Schemes Cards */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {t('results.recommendedBundle')}
          </h2>
          <span className="text-[11px] text-slate-500 font-bold">
            {optimization.eligibleSchemes.length} {t('results.compatible')}
          </span>
        </div>

        <div className="space-y-3">
          {optimization.eligibleSchemes.map((scheme, idx) => (
            <div
              key={scheme.id}
              className={`card-gov p-4 space-y-3 border-l-4 ${
                idx === 0 ? 'border-l-amber-500 bg-amber-50/20' : 'border-l-emerald-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                      {scheme.code}
                    </span>
                    <span className="badge-gov-green text-[10px]">✓ Recommended</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-1">
                    {isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-900">{scheme.payoutFormatted}</p>
                  <p className="text-[9px] text-slate-400 uppercase font-medium mt-0.5">{scheme.frequency || 'Annual'}</p>
                </div>
              </div>

              {/* Friction & Timeline */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-medium">Effort:</span>
                  <FrictionBadge friction={scheme.friction} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-medium">Approval:</span>
                  <span className="font-bold text-slate-800">~{scheme.estimatedDays} days</span>
                </div>
              </div>

              {/* Bottom Details Button */}
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {(scheme.documents || []).length} Verified Docs
                </span>
                <button
                  onClick={() => setSchemeModalData(scheme)}
                  className="btn-gov-secondary text-[11px] py-1.5 px-3 font-bold"
                >
                  {t('results.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Friction Matrix Cards */}
      <section className="card-gov p-4 space-y-3 bg-white">
        <div>
          <h2 className="font-black text-slate-900 text-sm">{t('results.frictionMatrix')}</h2>
          <p className="text-[10px] text-slate-500">{t('results.frictionSubtitle')}</p>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <p className="font-bold text-emerald-950 text-xs">{t('results.lowEffort')}</p>
                <p className="text-[10px] text-emerald-800">{t('results.lowEffortDesc')}</p>
              </div>
            </div>
            <span className="font-black text-emerald-900">3 Schemes</span>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <div>
                <p className="font-bold text-amber-950 text-xs">{t('results.medEffort')}</p>
                <p className="text-[10px] text-amber-800">{t('results.medEffortDesc')}</p>
              </div>
            </div>
            <span className="font-black text-amber-900">3 Schemes</span>
          </div>

          <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <div>
                <p className="font-bold text-rose-950 text-xs">{t('results.highEffort')}</p>
                <p className="text-[10px] text-rose-800">{t('results.highEffortDesc')}</p>
              </div>
            </div>
            <span className="font-black text-rose-900">1 Scheme</span>
          </div>
        </div>
      </section>

      {/* Direct Nav Buttons */}
      <section className="space-y-2">
        <Link
          to="/applications"
          className="w-full btn-gov-primary py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm font-black shadow-lg"
        >
          <span>{t('results.startApplications')}</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
        <Link
          to="/documents"
          className="w-full btn-gov-secondary py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold"
        >
          <span>{t('results.manageDocsBtn')}</span>
        </Link>
      </section>

    </div>
  );
}
