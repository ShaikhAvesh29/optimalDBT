import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Layers, UserPlus, Sparkles, User } from 'lucide-react';

export function BottomNavigation() {
  const { t } = useTranslation();
  const location = useLocation();

  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isSchemes = location.pathname.startsWith('/schemes');
  const isSignUp = location.pathname.startsWith('/signup');
  const isChat = location.pathname.startsWith('/chat');
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 safe-bottom transition-all duration-200"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around relative pt-1">
        
        {/* 1: Home */}
        <NavLink
          to="/home"
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl group transition-all duration-150 ${
            isHome ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label={t('nav.home') || 'Home'}
        >
          <div className={`p-1 rounded-lg transition-transform group-active:scale-90 ${isHome ? 'bg-emerald-50 text-emerald-800' : ''}`}>
            <Home className="w-5 h-5" strokeWidth={isHome ? 2.5 : 2} />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {t('nav.home') || 'Home'}
          </span>
        </NavLink>

        {/* 2: Schemes */}
        <NavLink
          to="/schemes"
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl group transition-all duration-150 ${
            isSchemes ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label={t('nav.schemes') || 'Schemes'}
        >
          <div className={`p-1 rounded-lg transition-transform group-active:scale-90 ${isSchemes ? 'bg-emerald-50 text-emerald-800' : ''}`}>
            <Layers className="w-5 h-5" strokeWidth={isSchemes ? 2.5 : 2} />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {t('nav.schemes') || 'Schemes'}
          </span>
        </NavLink>

        {/* 3: Chat (Center position - existing Active logo visually preserved, labeled Chat) */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-5 relative z-10">
          <NavLink
            to="/chat"
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-900 via-emerald-800 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-4 ring-white active:scale-95 transition-all duration-150 group ${
              isChat ? 'ring-amber-400' : ''
            }`}
            aria-label={t('nav.chat') || 'Chat'}
          >
            <Sparkles className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
          </NavLink>
          <span className="text-[10px] font-black text-emerald-900 tracking-tight leading-tight mt-1 text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {t('nav.chat') || 'Chat'}
          </span>
        </div>

        {/* 4: Sign Up (Immediately to the RIGHT of Chat) */}
        <NavLink
          to="/signup"
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl group transition-all duration-150 ${
            isSignUp ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label={t('nav.signUp') || 'Sign Up'}
        >
          <div className={`p-1 rounded-lg transition-transform group-active:scale-90 ${isSignUp ? 'bg-emerald-50 text-emerald-800' : ''}`}>
            <UserPlus className="w-5 h-5" strokeWidth={isSignUp ? 2.5 : 2} />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {t('nav.signUp') || 'Sign Up'}
          </span>
        </NavLink>

        {/* 5: Profile */}
        <NavLink
          to="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl group transition-all duration-150 ${
            isProfile ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label={t('nav.profile') || 'Profile'}
        >
          <div className={`p-1 rounded-lg transition-transform group-active:scale-90 ${isProfile ? 'bg-emerald-50 text-emerald-800' : ''}`}>
            <User className="w-5 h-5" strokeWidth={isProfile ? 2.5 : 2} />
          </div>
          <span className="text-[10px] tracking-tight leading-tight mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
            {t('nav.profile') || 'Profile'}
          </span>
        </NavLink>

      </div>
    </nav>
  );
}

export default BottomNavigation;
