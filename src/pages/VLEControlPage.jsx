import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { SAMPLE_VLE_FARMERS } from '../data/farmers.js';
import { VILLAGE_STATS } from '../data/villageStats.js';
import { Search, Plus, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export function VLEControlPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveWizardDraft, triggerToast } = useApp();
  const [vleSearchQuery, setVleSearchQuery] = useState('');

  const filteredFarmers = SAMPLE_VLE_FARMERS.filter(f => 
    !vleSearchQuery ||
    f.name.toLowerCase().includes(vleSearchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(vleSearchQuery.toLowerCase()) ||
    f.mobile.includes(vleSearchQuery) ||
    f.id.includes(vleSearchQuery)
  );

  const handleResumeDraft = (farmer) => {
    saveWizardDraft({
      name: farmer.name,
      mobile: farmer.mobile,
      village: farmer.village,
      landholdingAcres: farmer.landholdingAcres,
      state: 'Madhya Pradesh',
      district: 'Sehore'
    });
    triggerToast(`Resumed draft for ${farmer.name}`, 'success');
    navigate('/eligibility');
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* VLE Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-gov space-y-3 border-2 border-amber-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-950/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-amber-300 border border-amber-600">
              <span>★</span>
              <span>{t('vle.title')}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white mt-1">
              {t('vle.title')}
            </h1>
            <p className="text-[11px] text-amber-100">{t('vle.subtitle')}</p>
          </div>
          
          <Link
            to="/eligibility"
            className="btn-gov-primary bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-md flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('vle.newFarmer')}</span>
          </Link>
        </div>

        {/* 4 Village KPI Metric Cards */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-amber-200">{t('vle.farmersAssisted')}</p>
            <p className="text-lg font-black text-white mt-0.5">{VILLAGE_STATS.totalFarmersAssisted.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-emerald-300">{t('vle.capitalUnlocked')}</p>
            <p className="text-lg font-black text-amber-300 mt-0.5">₹3.42 Cr</p>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-amber-200">{t('vle.pendingReview')}</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">{VILLAGE_STATS.pendingApplications}</p>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p className="text-[9px] uppercase font-bold text-emerald-300">{t('vle.disbursed')}</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{VILLAGE_STATS.approvedApplications}</p>
          </div>
        </div>
      </div>

      {/* Farmer Queue & Search */}
      <section className="card-gov p-4 space-y-3 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-black text-slate-900 text-sm">{t('vle.queueTitle')}</h2>
            <p className="text-[10px] text-slate-500">{t('vle.queueSubtitle')}</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 font-mono">{filteredFarmers.length} Farmers</span>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={vleSearchQuery}
            onChange={(e) => setVleSearchQuery(e.target.value)}
            placeholder={t('vle.searchPlaceholder')}
            className="input-gov text-xs pl-9 py-2 rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Mobile Farmer Cards */}
        <div className="space-y-2.5 pt-1">
          {filteredFarmers.map(f => (
            <div key={f.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 active:border-emerald-600 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{f.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{f.id} • {f.village}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                  f.status === 'Optimized' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  f.status === 'Draft' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {f.status} {f.draftProgress < 100 ? `(${f.draftProgress}%)` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Landholding</span>
                  <span className="font-bold text-slate-800 text-xs">{f.landholdingAcres} Acres</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Optimized Payout</span>
                  <span className="font-black text-emerald-900 text-xs">₹{f.optimizedBenefit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {f.missingDocs > 0 && (
                <p className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded-lg">
                  {t('vle.missingDocs', { count: f.missingDocs })}
                </p>
              )}

              <div className="flex gap-2 pt-1 border-t border-slate-200">
                {f.status === 'Draft' ? (
                  <button
                    onClick={() => handleResumeDraft(f)}
                    className="btn-gov-accent w-full text-xs py-2 font-black flex items-center justify-center space-x-1"
                  >
                    <span>{t('vle.resumeDraft')} ({f.draftProgress}%)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to="/results"
                    className="btn-gov-secondary w-full text-xs py-1.5 font-bold text-center text-emerald-900"
                  >
                    {t('vle.viewResults')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Village Analytics */}
      <section className="card-gov p-4 space-y-3 bg-white">
        <h2 className="font-black text-slate-900 text-sm">{t('vle.villageAnalytics')}</h2>

        <div className="space-y-2 text-xs">
          {VILLAGE_STATS.villageBreakdown.map(v => (
            <div key={v.village} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-extrabold text-slate-900 text-xs">{v.village}</p>
                <p className="text-[10px] text-slate-500">{v.count} Farmers Registered</p>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-800 text-xs">{v.capital}</p>
                <span className="badge-gov-green text-[9px]">{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
