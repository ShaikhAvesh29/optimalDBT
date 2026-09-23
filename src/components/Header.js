import { t, getLanguage, setLanguage } from '../i18n/index.js';
import { getVLEMode, setVLEMode } from '../logic/storage.js';
import { showToast } from './Toast.js';

export function renderHeader(activeRoute = 'home') {
  const currentLang = getLanguage();
  const isVLE = getVLEMode();

  return `
    <header class="w-full bg-gov-darkgreen text-white sticky top-0 z-40 shadow-md">
      <!-- Mobile Top Bar with Emblem & Live Sync Status -->
      <div class="px-3.5 py-1.5 bg-emerald-950/80 border-b border-emerald-900/60 flex justify-between items-center text-[11px]">
        <div class="flex items-center space-x-2">
          <img src="/emblem.svg" alt="Emblem of India" class="h-4 w-auto filter invert brightness-200 opacity-90" />
          <span class="font-medium text-emerald-200 tracking-tight">${t('govIndia')}</span>
        </div>

        <div class="flex items-center space-x-2.5">
          <!-- Online/Offline Sync Indicator -->
          <div id="sync-status-indicator" class="flex items-center space-x-1.5 bg-emerald-900/90 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-700/60 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span id="sync-status-text">${t('online')}</span>
          </div>

          <!-- Quick Language Selector -->
          <div class="flex items-center bg-emerald-900 rounded-lg p-0.5 border border-emerald-700/80">
            <button id="lang-btn-en" class="px-1.5 py-0.5 text-[10px] font-extrabold rounded ${currentLang === 'en' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100'}">
              EN
            </button>
            <button id="lang-btn-hi" class="px-1.5 py-0.5 text-[10px] font-extrabold rounded ${currentLang === 'hi' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-emerald-100'}">
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      <!-- Main Mobile App Bar -->
      <div class="px-3.5 py-2.5 flex justify-between items-center bg-gradient-to-r from-emerald-900 via-gov-emerald to-emerald-900">
        <!-- Logo & Product Identity -->
        <a href="#home" class="flex items-center space-x-2.5 text-decoration-none group">
          <div class="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-amber-400 font-bold border border-emerald-600 shadow-sm group-active:scale-95 transition-transform flex-shrink-0">
            <svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3h12"/>
              <path d="M6 8h12"/>
              <path d="M6 13l8.5 8"/>
              <path d="M6 13h3"/>
              <path d="M9 13c6 0 6-10 0-10H6v10"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-1.5">
              <span class="text-lg font-black text-white tracking-tight">Optimal<span class="text-amber-400">DBT</span></span>
              <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                ${t('hindiTitle')}
              </span>
            </div>
            <p class="text-[10px] text-emerald-200 font-medium leading-none">Smart DBT Optimizer</p>
          </div>
        </a>

        <!-- Right Quick Controls: Notification Bell & Slide-over Menu -->
        <div class="flex items-center space-x-2">
          <!-- Notification Bell -->
          <button id="btn-notifications-drawer" class="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-white transition focus:outline-none">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
          </button>

          <!-- Profile / Menu Drawer Trigger -->
          <button id="btn-open-menu-drawer" class="flex items-center space-x-1.5 p-1 rounded-xl bg-emerald-950/70 border border-emerald-600/70 hover:bg-emerald-900 active:scale-95 transition focus:outline-none">
            <div class="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
              ${isVLE ? '★' : 'RP'}
            </div>
            <svg class="w-4 h-4 text-emerald-300 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Slide-Over App Drawer / Menu -->
      <div id="mobile-app-drawer" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs hidden transition-opacity duration-200">
        <div class="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white text-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-left">
          
          <div>
            <!-- Drawer Header -->
            <div class="p-5 bg-gradient-to-r from-emerald-900 to-gov-emerald text-white flex justify-between items-center">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-base shadow-sm">
                  ${isVLE ? '★' : 'RP'}
                </div>
                <div>
                  <h3 class="font-extrabold text-sm text-white">${isVLE ? 'CSC VLE Operator' : 'Rajesh Patel'}</h3>
                  <p class="text-[11px] text-emerald-200 font-mono">${isVLE ? 'VLE-MP-SEH-01' : 'MP-SEH-8849'}</p>
                </div>
              </div>
              <button id="btn-close-app-drawer" class="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- VLE Mode Toggle Switch in Drawer -->
            <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-slate-900">${t('vleMode')}</p>
                <p class="text-[10px] text-slate-500">Enable CSC rural agent tools</p>
              </div>
              <button id="drawer-toggle-vle" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isVLE ? 'bg-amber-600' : 'bg-slate-300'}">
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isVLE ? 'translate-x-5' : 'translate-x-0'}"></span>
              </button>
            </div>

            <!-- Navigation Links -->
            <div class="p-3 space-y-1 text-sm">
              <a href="#home" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>🏠</span>
                <span>${t('navHome')}</span>
              </a>
              <a href="#wizard" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>⚡</span>
                <span>${t('navCheckEligibility')}</span>
              </a>
              <a href="#dashboard" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>📊</span>
                <span>${t('navDashboard')} (₹2.34L)</span>
              </a>
              <a href="#roadmap" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>📅</span>
                <span>${t('navRoadmap')} (5 Years)</span>
              </a>
              <a href="#locker" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>📁</span>
                <span>${t('navLocker')} (12 Docs)</span>
              </a>
              <a href="#tracker" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>📍</span>
                <span>${t('navTracker')} (4 Active)</span>
              </a>
              <a href="#explorer" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>🏛️</span>
                <span>${t('navExplorer')} (Catalog)</span>
              </a>
              ${isVLE ? `
              <a href="#vle-panel" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200 transition">
                <span>★</span>
                <span>${t('navVlePanel')}</span>
              </a>
              ` : ''}
              <a href="#profile" class="drawer-link flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-semibold transition">
                <span>👤</span>
                <span>${t('navProfile')}</span>
              </a>
            </div>
          </div>

          <!-- Drawer Footer with Help & Sync -->
          <div class="p-4 bg-slate-50 border-t border-slate-200 text-xs space-y-2 safe-bottom">
            <button id="btn-drawer-sync" class="w-full btn-gov-secondary text-xs py-2 flex items-center justify-center space-x-1.5">
              <span>🔄</span>
              <span>Sync Offline Records</span>
            </button>
            <p class="text-[10px] text-center text-slate-400">
              OptimalDBT v2.0 • Digital India Initiative
            </p>
          </div>

        </div>
      </div>

      <!-- Notifications Bottom Sheet / Modal -->
      <div id="notifications-sheet" class="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs hidden flex items-end sm:items-center justify-center">
        <div class="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden animate-slide-up">
          <div class="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="text-base">🔔</span>
              <h3 class="font-bold text-slate-900 text-sm">Notifications & Alerts</h3>
            </div>
            <button id="btn-close-notifications" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="p-4 space-y-3 overflow-y-auto text-xs">
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div class="flex justify-between items-center">
                <span class="font-bold text-emerald-900">PM-KISAN 17th Installment</span>
                <span class="text-[10px] text-emerald-700 font-mono">Today</span>
              </div>
              <p class="text-emerald-800">₹2,000 successfully disbursed to your SBI account ending in 4920.</p>
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <div class="flex justify-between items-center">
                <span class="font-bold text-amber-900">PMKSY Micro-Irrigation</span>
                <span class="text-[10px] text-amber-700 font-mono">Yesterday</span>
              </div>
              <p class="text-amber-800">Water source NOC confirmation pending from District Agri Officer.</p>
            </div>

            <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
              <div class="flex justify-between items-center">
                <span class="font-bold text-blue-900">DigiLocker Synced</span>
                <span class="text-[10px] text-blue-700 font-mono">3 days ago</span>
              </div>
              <p class="text-blue-800">Khatauni land records verified automatically with Revenue Department.</p>
            </div>
          </div>
          
          <div class="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <button id="btn-mark-read" class="text-xs font-bold text-emerald-800 hover:underline">
              Mark all as read
            </button>
          </div>
        </div>
      </div>

    </header>
  `;
}

export function bindHeaderEvents() {
  const btnEn = document.getElementById('lang-btn-en');
  const btnHi = document.getElementById('lang-btn-hi');
  const openMenuBtn = document.getElementById('btn-open-menu-drawer');
  const closeMenuBtn = document.getElementById('btn-close-app-drawer');
  const appDrawer = document.getElementById('mobile-app-drawer');
  const drawerToggleVLE = document.getElementById('drawer-toggle-vle');
  const notifBtn = document.getElementById('btn-notifications-drawer');
  const notifSheet = document.getElementById('notifications-sheet');
  const closeNotifBtn = document.getElementById('btn-close-notifications');
  const markReadBtn = document.getElementById('btn-mark-read');
  const drawerSyncBtn = document.getElementById('btn-drawer-sync');

  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
  if (btnHi) btnHi.addEventListener('click', () => setLanguage('hi'));

  if (openMenuBtn && appDrawer) {
    openMenuBtn.addEventListener('click', () => appDrawer.classList.remove('hidden'));
  }
  if (closeMenuBtn && appDrawer) {
    closeMenuBtn.addEventListener('click', () => appDrawer.classList.add('hidden'));
  }
  if (appDrawer) {
    appDrawer.addEventListener('click', (e) => {
      if (e.target === appDrawer) appDrawer.classList.add('hidden');
    });
    // Close drawer when link clicked
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => appDrawer.classList.add('hidden'));
    });
  }

  if (drawerToggleVLE) {
    drawerToggleVLE.addEventListener('click', () => {
      const current = getVLEMode();
      setVLEMode(!current);
      if (appDrawer) appDrawer.classList.add('hidden');
      if (!current) {
        window.location.hash = '#vle-panel';
      } else {
        window.location.hash = '#home';
      }
    });
  }

  if (notifBtn && notifSheet) {
    notifBtn.addEventListener('click', () => notifSheet.classList.remove('hidden'));
  }
  if (closeNotifBtn && notifSheet) {
    closeNotifBtn.addEventListener('click', () => notifSheet.classList.add('hidden'));
  }
  if (notifSheet) {
    notifSheet.addEventListener('click', (e) => {
      if (e.target === notifSheet) notifSheet.classList.add('hidden');
    });
  }
  if (markReadBtn && notifSheet) {
    markReadBtn.addEventListener('click', () => {
      showToast('All notifications marked as read', 'info');
      notifSheet.classList.add('hidden');
    });
  }

  if (drawerSyncBtn) {
    drawerSyncBtn.addEventListener('click', () => {
      showToast('Syncing all local offline records with Central DBT Server...', 'info');
      setTimeout(() => {
        showToast('All records synced successfully (0 pending)', 'success');
        if (appDrawer) appDrawer.classList.add('hidden');
      }, 700);
    });
  }

  // Network online/offline status handling
  function updateNetworkStatus() {
    const isOnline = navigator.onLine;
    const textEl = document.getElementById('sync-status-text');
    const indicatorEl = document.getElementById('sync-status-indicator');
    if (textEl && indicatorEl) {
      if (isOnline) {
        textEl.textContent = t('online');
        indicatorEl.className = "flex items-center space-x-1.5 bg-emerald-900/90 px-2 py-0.5 rounded-full text-emerald-200 border border-emerald-700/60 font-medium";
      } else {
        textEl.textContent = t('offline');
        indicatorEl.className = "flex items-center space-x-1.5 bg-amber-950 px-2 py-0.5 rounded-full text-amber-200 border border-amber-700/60 font-medium";
      }
    }
  }

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
}
