import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { generateTemporalRoadmap } from '../logic/temporalRoadmap.js';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { getAppLanguage } from '../i18n/index.js';

export function RoadmapPage() {
  const { t } = useTranslation();
  const { optimization, checklist, toggleChecklistItem, setSchemeModalData, triggerToast } = useApp();
  const isHindi = getAppLanguage() === 'hi';

  const roadmap = generateTemporalRoadmap(optimization.eligibleSchemes);
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalTasks = Object.keys(checklist).length;

  const handleToggle = (taskKey) => {
    toggleChecklistItem(taskKey);
    triggerToast('Action plan progress updated', 'success');
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-4 sm:p-5 rounded-3xl shadow-gov space-y-2">
        <div className="flex justify-between items-start">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
            5-Year Temporal Plan
          </span>
          <span className="text-xs font-mono font-bold text-amber-300">
            {t('roadmap.cumulative')}
          </span>
        </div>
        <h1 className="text-lg sm:text-xl font-black text-white">
          {t('roadmap.title')}
        </h1>
        <p className="text-xs text-emerald-200">
          {t('roadmap.subtitle')}
        </p>
      </div>

      {/* Action Plan Interactive Checklist */}
      <section className="card-gov p-4 space-y-3 bg-white border-2 border-amber-400/80">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h2 className="font-black text-slate-900 text-sm">{t('roadmap.checklistTitle')}</h2>
            <p className="text-[10px] text-slate-500">{t('roadmap.checklistSubtitle')}</p>
          </div>
          <span className="badge-gov-amber text-[10px] font-black">
            {completedCount} of {totalTasks} Completed
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { key: 'step1', title: t('roadmap.step1'), desc: t('roadmap.step1Desc') },
            { key: 'step2', title: t('roadmap.step2'), desc: t('roadmap.step2Desc') },
            { key: 'step3', title: t('roadmap.step3'), desc: t('roadmap.step3Desc') },
            { key: 'step4', title: t('roadmap.step4'), desc: t('roadmap.step4Desc') },
            { key: 'step5', title: t('roadmap.step5'), desc: t('roadmap.step5Desc') }
          ].map((task) => {
            const isDone = !!checklist[task.key];
            return (
              <label
                key={task.key}
                className={`p-2.5 rounded-2xl border flex items-start space-x-2.5 cursor-pointer transition ${
                  isDone ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => handleToggle(task.key)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                />
                <div className="flex-1">
                  <p className={`font-bold text-xs ${isDone ? 'line-through text-emerald-900' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  <p className={`text-[10px] ${isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {task.desc}
                  </p>
                </div>
                {isDone && <span className="text-emerald-700 font-bold text-xs">{t('roadmap.done')}</span>}
              </label>
            );
          })}
        </div>
      </section>

      {/* Vertical 5-Year Timeline */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {t('roadmap.timelineTitle')}
          </h2>
          <span className="text-[10px] text-slate-500 font-bold">{t('roadmap.timelineSubtitle')}</span>
        </div>

        <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-200">
          {roadmap.map(y => (
            <div key={y.year} className="relative pl-11">
              {/* Marker */}
              <div
                className={`absolute left-3 top-4 -translate-x-1/2 w-6 h-6 rounded-full ${
                  y.year === 1 ? 'bg-emerald-700 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-600'
                } flex items-center justify-center font-black text-[10px] shadow-sm`}
              >
                {y.year}
              </div>

              {/* Card */}
              <div
                className={`card-gov p-4 space-y-3 bg-white ${
                  y.year === 1 ? 'border-emerald-600 ring-2 ring-emerald-500/10' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-700">YEAR {y.year}</span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {isHindi ? y.hindiTitle : y.title}
                    </h3>
                  </div>
                  <span className="badge-gov-green font-mono font-extrabold text-xs">
                    ₹{y.totalExpectedBenefit.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {y.description}
                </p>

                {/* Schemes in year */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {y.schemes.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">Recurring benefits continue automatically.</p>
                  ) : (
                    y.schemes.map(s => (
                      <div key={s.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">
                            {isHindi ? (s.hindiName || s.name) : s.name}
                          </p>
                          <p className="text-[10px] text-emerald-800 font-semibold">{s.payoutFormatted}</p>
                        </div>
                        <button
                          onClick={() => setSchemeModalData(s)}
                          className="btn-gov-secondary text-[10px] py-1 px-2 font-bold"
                        >
                          Rules
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
