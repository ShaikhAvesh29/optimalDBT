import { t } from '../i18n/index.js';

export function renderBottomNav(activeRoute = 'home') {
  const isHome = activeRoute === 'home';
  const isExplorer = activeRoute === 'explorer';
  const isWizard = activeRoute === 'wizard';
  const isTracker = activeRoute === 'tracker';
  const isLocker = activeRoute === 'locker';
  const isProfile = activeRoute === 'profile';

  return `
    <!-- Mobile Sticky Bottom Navigation -->
    <nav id="mobile-bottom-nav" class="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 safe-bottom transition-all duration-200">
      <div class="flex items-center justify-around relative">
        
        <!-- 1: Home -->
        <a href="#home" class="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl group transition-all duration-150 ${isHome ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'}">
          <div class="p-1 rounded-lg transition-transform group-active:scale-90 ${isHome ? 'bg-emerald-50 text-emerald-800' : ''}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isHome ? '2.5' : '2'}" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight leading-tight mt-0.5">${t('navHome')}</span>
        </a>

        <!-- 2: Schemes Explorer -->
        <a href="#explorer" class="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl group transition-all duration-150 ${isExplorer ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'}">
          <div class="p-1 rounded-lg transition-transform group-active:scale-90 ${isExplorer ? 'bg-emerald-50 text-emerald-800' : ''}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isExplorer ? '2.5' : '2'}" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight leading-tight mt-0.5">${t('navExplorer')}</span>
        </a>

        <!-- 3: Floating Center Action: Check Eligibility / Optimize -->
        <div class="flex flex-col items-center justify-center flex-1 -mt-5 relative z-10">
          <a href="#wizard" class="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-900 via-emerald-800 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-4 ring-white active:scale-95 transition-all duration-150 group">
            <svg class="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </a>
          <span class="text-[10px] font-extrabold text-emerald-900 tracking-tight leading-tight mt-1">
            ${isWizard ? 'In Progress' : 'Check DBT'}
          </span>
        </div>

        <!-- 4: Tracker (Applications) -->
        <a href="#tracker" class="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl group transition-all duration-150 relative ${isTracker ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'}">
          <div class="p-1 rounded-lg transition-transform group-active:scale-90 ${isTracker ? 'bg-emerald-50 text-emerald-800' : ''}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isTracker ? '2.5' : '2'}" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight leading-tight mt-0.5">${t('navTracker')}</span>
          <span class="absolute top-1 right-2 w-2 h-2 rounded-full bg-blue-500"></span>
        </a>

        <!-- 5: Document Locker -->
        <a href="#locker" class="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl group transition-all duration-150 ${isLocker ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'}">
          <div class="p-1 rounded-lg transition-transform group-active:scale-90 ${isLocker ? 'bg-emerald-50 text-emerald-800' : ''}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${isLocker ? '2.5' : '2'}" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight leading-tight mt-0.5">${t('navLocker')}</span>
        </a>

      </div>
    </nav>
  `;
}
