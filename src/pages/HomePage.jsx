import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { SCHEMES } from '../data/schemes.js';
import { Sparkles, ArrowRight, ShieldCheck, FileCheck, Zap, AlertCircle, Bot, CheckCircle2, Loader2, TrendingUp, Activity } from 'lucide-react';
import { getAppLanguage } from '../i18n/index.js';

const API_BASE = 'http://127.0.0.1:8000';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfile, setSchemeModalData, optimization, triggerToast } = useApp();
  const isHindi = getAppLanguage() === 'hi';

  const [quickMobile, setQuickMobile] = useState(profile.mobile || '');
  const [quickState, setQuickState] = useState(profile.state || 'Madhya Pradesh');
  const [quickLand, setQuickLand] = useState(profile.landholdingAcres || 4.5);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState(null);

  // ML Forecast widget state
  const [mlForecast, setMlForecast] = useState(null);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);

  const handleMLForecast = async () => {
    setIsForecastLoading(true);
    setForecastError(null);
    setMlForecast(null);
    try {
      const res = await fetch(`${API_BASE}/predict-future-income`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          land_acres: profile.landholdingAcres || 4.5,
          cattle: profile.cattle || 3,
          soil_quality: profile.soilQuality || 7,
          current_income: profile.annualIncome || 140000
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMlForecast(data);
        triggerToast('🤖 ML Forecast complete — income trajectory computed!', 'success');
      } else {
        setForecastError('ML engine returned an error. Try again.');
      }
    } catch {
      setForecastError('Backend offline. Start the ML server at port 8000.');
    } finally {
      setIsForecastLoading(false);
    }
  };

  const topRecommended = SCHEMES.filter(s => s.isRecommended).slice(0, 4);

  // ─── POST /optimize – wired to the Discover DBT Schemes button ───────────────
  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    updateProfile({
      mobile: quickMobile,
      state: quickState,
      landholdingAcres: parseFloat(quickLand) || 4.5
    });

    setIsOptimizing(true);
    setOptimizeResult(null);

    try {
      const res = await fetch(`${API_BASE}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          annual_income: profile.annualIncome || 140000
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOptimizeResult(data);
        const benefit = data.total_benefit_inr
          ? `₹${Number(data.total_benefit_inr).toLocaleString('en-IN')}`
          : 'optimized portfolio';
        triggerToast(`⚡ AI Engine: ${benefit} optimal portfolio computed!`, 'success');
        setTimeout(() => navigate('/results'), 800);
      } else {
        triggerToast('AI Engine returned an error — using local optimizer', 'warning');
        setTimeout(() => navigate('/eligibility'), 400);
      }
    } catch {
      // Backend offline — fall back to local optimizer gracefully
      triggerToast('Backend offline — running local optimization engine', 'info');
      setTimeout(() => navigate('/eligibility'), 400);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-4 pb-6 animate-fade-in">

      {/* ── DEMO AUTH BANNER: Field Agent Pre-Authenticated ── */}
      <div className="mx-4 mt-2 bg-gradient-to-r from-slate-900 to-emerald-950 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between shadow-lg border border-emerald-800/40">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Field Agent Portal • Pre-Authenticated</p>
            <p className="text-[11px] text-emerald-200">Assuming field agent is already authenticated into the portal</p>
          </div>
        </div>
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      </div>

      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-gov-emerald text-white px-4 pt-4 pb-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-amber-400/10 pointer-events-none blur-xl"></div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-emerald-200 font-medium">{t('home.greeting')}</p>
              <h1 className="text-xl font-black text-white tracking-tight">{profile.name}</h1>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
              🌾 {profile.landholdingAcres} Acres • {profile.village}
            </span>
          </div>

          {/* Hero Claim Potential Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3 shadow-inner">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {t('home.totalDbtPotential')}
                </p>
                <p className="text-2xl font-black text-white mt-0.5">
                  ₹{optimization.totalBenefit.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-semibold text-emerald-200">{t('home.perYear')}</span>
                </p>
              </div>
              <span className="badge-gov-green bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-[10px]">
                {t('home.zeroConflicts')}
              </span>
            </div>

            <p className="text-xs text-emerald-100 leading-relaxed font-normal">
              {t('home.heroExplanation')}
            </p>

            <div className="pt-1">
              <Link
                to="/eligibility"
                className="w-full btn-gov-accent py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-black shadow-md"
              >
                <span>⚡ {t('home.checkEligibilityBtn')}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="px-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <Link
            to="/eligibility"
            className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-1 shadow-xs">
              ⚡
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t('nav.checkEligibility')}
            </span>
          </Link>

          <Link
            to="/results"
            className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg mb-1 shadow-xs">
              🎯
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t('home.results')}
            </span>
          </Link>

          <Link
            to="/documents"
            className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center text-lg mb-1 shadow-xs">
              📷
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t('home.scanDocs')}
            </span>
          </Link>

          <Link
            to="/applications"
            className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-1 shadow-xs">
              📍
            </div>
            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              {t('home.trackClaim')}
            </span>
          </Link>
        </div>
      </section>

      {/* ── ML FORECAST WIDGET ─────────────────────────────────────── */}
      <section className="px-4">
        <div className="card-gov p-4 bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-700/40 shadow-lg space-y-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">ML Engine • Live</p>
                <p className="text-xs font-black text-white">Income Trajectory Forecast</p>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-300">Random Forest</span>
            </span>
          </div>

          {/* Input summary */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Land', value: `${profile.landholdingAcres || 4.5} ac` },
              { label: 'Cattle', value: profile.cattle || 3 },
              { label: 'Soil', value: `${profile.soilQuality || 7}/10` },
              { label: 'Income', value: `₹${((profile.annualIncome || 140000)/1000).toFixed(0)}K` }
            ].map(item => (
              <div key={item.label} className="bg-white/10 rounded-lg p-1.5 text-center">
                <p className="text-[9px] text-emerald-300 font-semibold">{item.label}</p>
                <p className="text-[11px] font-black text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Result panel */}
          {mlForecast && (
            <div className="bg-white/10 rounded-xl p-3 space-y-2 border border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-emerald-300 font-bold uppercase">Forecasted Next Year</p>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xl font-black text-white">
                ₹{Number(mlForecast.forecasted_income_next_year).toLocaleString('en-IN')}
              </p>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                mlForecast.predictive_routing_flag.startsWith('HIGH')
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {mlForecast.predictive_routing_flag.startsWith('HIGH') ? '⚠️' : '✅'}{' '}
                {mlForecast.predictive_routing_flag}
              </div>
            </div>
          )}

          {forecastError && (
            <p className="text-[11px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              ⚠️ {forecastError}
            </p>
          )}

          <button
            id="ml-forecast-btn"
            onClick={handleMLForecast}
            disabled={isForecastLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-xl text-slate-950 font-black text-xs shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isForecastLoading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Running ML Engine...</span></>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /><span>{mlForecast ? 'Re-run Forecast' : 'Run ML Forecast →'}</span></>
            )}
          </button>
        </div>
      </section>

      {/* Active Application Alert Card */}
      <section className="px-4">
        <div className="card-gov p-3.5 bg-gradient-to-r from-blue-50/80 to-white border-l-4 border-l-blue-600 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase text-blue-900">
                {t('home.activeClaim')}
              </span>
            </div>
            <p className="font-bold text-slate-900 text-xs">PM Fasal Bima (Kharif 2024)</p>
            <p className="text-[10px] text-slate-500">Patwari crop survey verification in progress</p>
          </div>
          <Link
            to="/applications"
            className="btn-gov-secondary text-[11px] py-1.5 px-2.5 font-bold text-blue-900 bg-white shadow-xs"
          >
            {t('home.track')}
          </Link>
        </div>
      </section>

      {/* Horizontal Recommended Schemes Rail */}
      <section className="space-y-2">
        <div className="px-4 flex justify-between items-center">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {t('home.recommendedSchemes')}
          </h2>
          <Link to="/schemes" className="text-xs font-bold text-emerald-800 hover:underline">
            {t('home.viewAll')} (47) →
          </Link>
        </div>

        <div className="flex space-x-3 overflow-x-auto px-4 no-scrollbar pb-1">
          {topRecommended.map(scheme => (
            <div
              key={scheme.id}
              className="min-w-[240px] max-w-[260px] bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col justify-between flex-shrink-0 active:scale-[0.99] transition"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    {scheme.code}
                  </span>
                  <span className="badge-gov-green text-[10px]">Eligible</span>
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-xs line-clamp-2">
                  {isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                </h3>
                
                <p className="text-[11px] font-black text-amber-700">
                  {scheme.payoutFormatted}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">⚡ ~{scheme.estimatedDays} days</span>
                <button
                  onClick={() => setSchemeModalData(scheme)}
                  className="btn-gov-secondary text-[10px] py-1 px-2.5 font-bold"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fast Assessment Form */}
      <section className="px-4">
        <div className="card-gov p-4 bg-white border-2 border-amber-400/80 shadow-gov space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
                {t('home.quickReassessment')}
              </span>
              <h2 className="font-extrabold text-slate-900 text-sm mt-1">{t('home.quickReassessment')}</h2>
            </div>
            <span className="text-xl">🌾</span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                {t('home.mobileOrAadhaar')}
              </label>
              <input 
                type="text" 
                value={quickMobile} 
                onChange={(e) => setQuickMobile(e.target.value)}
                placeholder={t('home.mobilePlaceholder')}
                className="input-gov text-xs py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  {t('home.stateLabel')}
                </label>
                <select
                  value={quickState}
                  onChange={(e) => setQuickState(e.target.value)}
                  className="input-gov text-xs py-2 bg-white"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  {t('home.landholdingLabel')}
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={quickLand} 
                  onChange={(e) => setQuickLand(e.target.value)}
                  className="input-gov text-xs py-2"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isOptimizing}
              className="w-full btn-gov-primary text-xs py-2.5 font-extrabold bg-emerald-800 hover:bg-emerald-900 shadow-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Engine Optimizing...</span>
                </>
              ) : (
                <span>{t('home.discoverBtn')} →</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Guarantees */}
      <section className="px-4 pb-2 space-y-2">
        <h3 className="font-extrabold text-slate-400 text-xs uppercase tracking-wider">
          {t('home.guarantees')}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <p className="font-bold text-slate-900 text-[11px]">{t('home.conflictShield')}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{t('home.conflictShieldDesc')}</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <FileCheck className="w-5 h-5 text-blue-700" />
            <p className="font-bold text-slate-900 text-[11px]">{t('home.singleUpload')}</p>
            <p className="text-[10px] text-slate-500 leading-tight">{t('home.singleUploadDesc')}</p>
          </div>
        </div>
      </section>

    </div>
  );
}
