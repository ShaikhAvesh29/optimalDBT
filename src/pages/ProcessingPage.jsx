import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Check } from 'lucide-react';

export function ProcessingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/results');
          }, 350);
          return 100;
        }
        return prev + 18;
      });
    }, 320);

    return () => clearInterval(timer);
  }, [navigate]);

  const stepThresholds = [17, 34, 51, 68, 85, 100];

  return (
    <div className="px-4 py-8 text-center space-y-6 max-w-md mx-auto animate-fade-in pb-20">
      
      {/* Animated Emblem Icon */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-amber-500 animate-spin"></div>
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white flex items-center justify-center shadow-lg font-black text-2xl">
          <Sparkles className="w-7 h-7 text-amber-300" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
          {t('processing.active')}
        </span>
        <h1 className="text-xl font-black text-slate-900 leading-tight">
          {t('processing.title')}
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {t('processing.subtitle')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 max-w-xs mx-auto">
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs font-mono font-bold text-emerald-800">
          {t('processing.completed', { pct: Math.min(progress, 100) })}
        </p>
      </div>

      {/* Vertical Processing Steps Sequence */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov text-left space-y-3 text-xs">
        
        {/* Step 1 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[0] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[0] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[0] ? <Check className="w-3 h-3" /> : '1'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step1')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step1Desc')}</p>
          </div>
        </div>

        <div className="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        {/* Step 2 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[1] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[1] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[1] ? <Check className="w-3 h-3" /> : '2'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step2')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step2Desc')}</p>
          </div>
        </div>

        <div className="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        {/* Step 3 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[2] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[2] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[2] ? <Check className="w-3 h-3" /> : '3'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step3')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step3Desc')}</p>
          </div>
        </div>

        <div className="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        {/* Step 4 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[3] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[3] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[3] ? <Check className="w-3 h-3" /> : '4'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step4')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step4Desc')}</p>
          </div>
        </div>

        <div className="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        {/* Step 5 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[4] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[4] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[4] ? <Check className="w-3 h-3" /> : '5'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step5')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step5Desc')}</p>
          </div>
        </div>

        <div className="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        {/* Step 6 */}
        <div className={`flex items-center space-x-3 transition-all duration-300 ${
          progress >= stepThresholds[5] ? 'text-emerald-950 font-bold' : 'text-slate-400'
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 transition-all ${
            progress >= stepThresholds[5] ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'border border-slate-300'
          }`}>
            {progress >= stepThresholds[5] ? <Check className="w-3 h-3" /> : '6'}
          </span>
          <div>
            <p className="text-[11px]">{t('processing.step6')}</p>
            <p className="text-[10px] text-slate-400 font-normal">{t('processing.step6Desc')}</p>
          </div>
        </div>

      </div>

      {/* Skip Button */}
      <div>
        <button
          onClick={() => navigate('/results')}
          className="text-xs text-slate-400 hover:text-emerald-800 underline font-semibold"
        >
          {t('processing.skip')}
        </button>
      </div>

    </div>
  );
}
