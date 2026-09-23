import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';

export function ApplicationsPage() {
  const { t } = useTranslation();
  const { applications } = useApp();
  const [filter, setFilter] = useState('all');

  const filtered = applications.filter(app => {
    if (filter === 'approved') return app.stage === 4;
    if (filter === 'active') return app.stage < 4;
    return true;
  });

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Tracker Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            Real-Time DBT Pipeline
          </span>
          <h1 className="text-base sm:text-lg font-black text-slate-900 mt-1">{t('applications.title')}</h1>
          <p className="text-[11px] text-slate-500">{t('applications.subtitle')}</p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('applications.all')} ({applications.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
              filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('applications.active')} (2)
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
              filter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('applications.disbursed')} (2)
          </button>
        </div>
      </div>

      {/* Applications Cards */}
      <div className="space-y-3">
        {filtered.map(app => (
          <div
            key={app.id}
            className={`card-gov p-4 space-y-3 bg-white border-l-4 ${
              app.stage === 4 ? 'border-l-emerald-600' : 'border-l-amber-500'
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {app.id}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1 leading-tight">{app.schemeName}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{t('applications.submittedOn')} {app.submittedDate}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                app.stage === 4 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {app.stage === 4 ? '✓ Disbursed' : 'In Progress'}
              </span>
            </div>

            {/* Vertical Milestone Progress */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className={`flex items-center space-x-2 text-[11px] ${app.stage >= 1 ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full ${app.stage >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]`}>
                  ✓
                </span>
                <span>{t('applications.stage1')}</span>
              </div>

              <div className="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div className={`flex items-center space-x-2 text-[11px] ${app.stage >= 2 ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full ${app.stage >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]`}>
                  ✓
                </span>
                <span>{t('applications.stage2')}</span>
              </div>

              <div className="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div className={`flex items-center space-x-2 text-[11px] ${app.stage >= 3 ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full ${
                  app.stage >= 3 ? (app.stage === 3 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-700 text-white') : 'bg-slate-300'
                } flex items-center justify-center text-[9px]`}>
                  {app.stage > 3 ? '✓' : '●'}
                </span>
                <span>{t('applications.stage3')}</span>
              </div>

              <div className="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div className={`flex items-center space-x-2 text-[11px] ${app.stage >= 4 ? 'text-emerald-950 font-bold' : 'text-slate-400'}`}>
                <span className={`w-4 h-4 rounded-full ${app.stage >= 4 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]`}>
                  {app.stage >= 4 ? '✓' : '○'}
                </span>
                <span>{t('applications.stage4')}</span>
              </div>
            </div>

            {/* Next Step Box */}
            <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 flex justify-between items-center text-[11px]">
              <div>
                <span className="font-bold text-amber-950">{t('applications.nextAction')}</span>
                <p className="text-[10px] text-amber-900">{app.nextStep}</p>
              </div>
              <Link to="/documents" className="btn-gov-secondary text-[10px] py-1 px-2 font-bold text-emerald-800">
                {t('applications.viewDocs')}
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
