import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { setAppLanguage, getAppLanguage } from '../i18n/index.js';
import { Bell, Sparkles } from 'lucide-react';

export function MobileHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOnline, setNotificationsOpen, vleMode, profile } = useApp();
  const currentLang = getAppLanguage();

  const handleLangChange = (lang) => {
    setAppLanguage(lang);
  };

  return (
    <header className="w-full bg-gov-darkgreen text-white sticky top-0 z-40 shadow-md">
      {/* Top Official Banner with Emblem & Live Sync */}
      <div className="px-3.5 py-1.5 bg-emerald-950/80 border-b border-emerald-900/60 flex justify-between items-center text-[11px]">
        <div className="flex items-center space-x-2">
          <img src="/emblem.svg" alt="Emblem of India" className="h-4 w-auto filter invert brightness-200 opacity-90" />
          <span className="font-medium text-emerald-200 tracking-tight">{t('app.govIndia')}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Live Online/Offline Sync Indicator */}
          <div className="flex items-center space-x-1.5 bg-emerald-900/90 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-700/60 font-medium">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[10px]">{isOnline ? t('app.online') : t('app.offline')}</span>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center bg-emerald-900 rounded-lg p-0.5 border border-emerald-700/80">
            <button
              onClick={() => handleLangChange('en')}
              className={`px-1.5 py-0.5 text-[10px] font-black rounded transition ${
                currentLang === 'en' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLangChange('hi')}
              className={`px-1.5 py-0.5 text-[10px] font-black rounded transition ${
                currentLang === 'hi' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Mobile App Bar */}
      <div className="px-3.5 py-2.5 flex justify-between items-center bg-gradient-to-r from-emerald-900 via-gov-emerald to-emerald-900">
        {/* Logo & Product Identity */}
        <Link to="/home" className="flex items-center space-x-2.5 text-decoration-none group">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-400 font-bold border border-emerald-600 shadow-sm group-active:scale-95 transition-transform flex-shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg font-black text-white tracking-tight">Optimal<span className="text-amber-400">DBT</span></span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                {t('app.hindiTitle')}
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 font-medium leading-none">{t('app.tagline')}</p>
          </div>
        </Link>

        {/* Right Controls: Notifications Bell & Profile Avatar */}
        <div className="flex items-center space-x-2">
          {/* Notifications Bell */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white transition focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>

          {/* Profile Avatar (Navigates directly to /profile as a full-screen mobile route!) */}
          <Link
            to="/profile"
            className="flex items-center p-0.5 rounded-xl bg-emerald-950/70 border border-emerald-600/70 hover:bg-emerald-900 active:scale-95 transition focus:outline-none"
            aria-label="Profile"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              {vleMode ? '★' : (profile.name?.slice(0, 2).toUpperCase() || 'RP')}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
