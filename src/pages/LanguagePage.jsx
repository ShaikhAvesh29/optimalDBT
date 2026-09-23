import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setAppLanguage, getAppLanguage } from '../i18n/index.js';
import { useApp } from '../context/AppContext.jsx';
import { Check, ArrowLeft, Globe } from 'lucide-react';

export function LanguagePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { triggerToast } = useApp();
  const currentLang = getAppLanguage();

  const languages = [
    { code: 'en', name: 'English', native: 'English', sub: 'Standard English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', sub: 'भारत सरकार मानक हिन्दी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', sub: 'महाराष्ट्र राज्य' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', sub: 'ગુજરાત રાજ્ય' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', sub: 'পশ্চিমবঙ্গ' }
  ];

  const handleSelect = (code) => {
    setAppLanguage(code);
    triggerToast(code === 'hi' ? 'भाषा सफलतापूर्वक बदलकर हिन्दी कर दी गई है' : `Language switched to ${code.toUpperCase()}`, 'success');
  };

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
              {t('language.title')}
            </h1>
            <p className="text-[11px] text-slate-500">{t('language.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Language Options List */}
      <div className="space-y-2.5">
        {languages.map(lang => {
          const isSelected = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-150 ${
                isSelected
                  ? 'bg-emerald-50/90 border-2 border-emerald-600 shadow-sm ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 shadow-gov hover:border-emerald-400 active:scale-[0.99]'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm ${
                  isSelected ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}>
                  {lang.code.toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-sm">{lang.native}</p>
                  <p className="text-[11px] text-slate-500">{lang.name} • {lang.sub}</p>
                </div>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={() => navigate(-1)}
          className="w-full btn-gov-primary py-3 px-4 rounded-2xl font-black text-sm shadow-md"
        >
          {t('language.apply')}
        </button>
      </div>

    </div>
  );
}
