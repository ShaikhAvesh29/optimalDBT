import { t, getLanguage } from '../i18n/index.js';
import { getFarmerProfile, saveFarmerProfile } from '../logic/storage.js';
import { SCHEMES } from '../data/schemes.js';
import { openSchemeModal } from '../components/SchemeDetailModal.js';

export function renderLandingPage() {
  const profile = getFarmerProfile();
  const isHindi = getLanguage() === 'hi';
  const topRecommended = SCHEMES.filter(s => s.isRecommended).slice(0, 4);

  return `
    <div class="space-y-4 pb-6 animate-fade-in">
      
      <!-- Farmer Mobile Header Banner / Greeting -->
      <section class="bg-gradient-to-b from-emerald-950 via-emerald-900 to-gov-emerald text-white px-4 pt-4 pb-6 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div class="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-amber-400/10 pointer-events-none blur-xl"></div>
        
        <div class="space-y-3 relative z-10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[11px] text-emerald-200 font-medium">Namaste, Farmer 🙏</p>
              <h1 class="text-xl font-black text-white tracking-tight">${profile.name}</h1>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
              🌾 ${profile.landholdingAcres} Acres • ${profile.village}
            </span>
          </div>

          <!-- Hero Claim Potential Card -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3 shadow-inner">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Total DBT Potential</p>
                <p class="text-2xl font-black text-white mt-0.5">₹2,34,500 <span class="text-xs font-semibold text-emerald-200">/ year</span></p>
              </div>
              <span class="badge-gov-green bg-emerald-400/20 text-emerald-300 border-emerald-400/30 text-[10px]">
                0 Conflicts
              </span>
            </div>

            <p class="text-xs text-emerald-100 leading-relaxed font-normal">
              Unlock synchronized central and state subsidies with zero duplicate paperwork and zero disqualifications.
            </p>

            <div class="pt-1">
              <a href="#wizard" class="w-full btn-gov-accent py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-sm font-black shadow-md">
                <span>⚡ ${t('navCheckEligibility')}</span>
                <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Action Grid Buttons -->
      <section class="px-4">
        <div class="grid grid-cols-4 gap-2 text-center">
          <a href="#wizard" class="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-1 shadow-xs">
              ⚡
            </div>
            <span class="text-[10px] font-bold text-slate-700 leading-tight">Check DBT</span>
          </a>

          <a href="#dashboard" class="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-lg mb-1 shadow-xs">
              🎯
            </div>
            <span class="text-[10px] font-bold text-slate-700 leading-tight">Results</span>
          </a>

          <a href="#locker" class="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center text-lg mb-1 shadow-xs">
              📷
            </div>
            <span class="text-[10px] font-bold text-slate-700 leading-tight">Scan Docs</span>
          </a>

          <a href="#tracker" class="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-gov flex flex-col items-center justify-center group active:scale-95 transition">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-1 shadow-xs">
              📍
            </div>
            <span class="text-[10px] font-bold text-slate-700 leading-tight">Track Claim</span>
          </a>
        </div>
      </section>

      <!-- Active Application Alert Card -->
      <section class="px-4">
        <div class="card-gov p-3.5 bg-gradient-to-r from-blue-50/80 to-white border-l-4 border-l-blue-600 flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span class="text-[10px] font-extrabold uppercase text-blue-900">Active Claim In Progress</span>
            </div>
            <p class="font-bold text-slate-900 text-xs">PM Fasal Bima (Kharif 2024)</p>
            <p class="text-[10px] text-slate-500">Patwari crop survey verification in progress</p>
          </div>
          <a href="#tracker" class="btn-gov-secondary text-[11px] py-1.5 px-2.5 font-bold text-blue-900 bg-white shadow-xs">
            Track →
          </a>
        </div>
      </section>

      <!-- Horizontal Scrollable Recommended Schemes -->
      <section class="space-y-2">
        <div class="px-4 flex justify-between items-center">
          <h2 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <span>✨</span> Recommended Schemes for You
          </h2>
          <a href="#explorer" class="text-xs font-bold text-emerald-800 hover:underline">View All (47) →</a>
        </div>

        <div class="flex space-x-3 overflow-x-auto px-4 no-scrollbar pb-1">
          ${topRecommended.map(scheme => `
            <div class="min-w-[240px] max-w-[260px] bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex flex-col justify-between flex-shrink-0 active:scale-[0.99] transition">
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    ${scheme.code}
                  </span>
                  <span class="badge-gov-green text-[10px]">Eligible</span>
                </div>
                
                <h3 class="font-extrabold text-slate-900 text-xs line-clamp-2">
                  ${isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                </h3>
                
                <p class="text-[11px] font-black text-amber-700">
                  ${scheme.payoutFormatted}
                </p>
              </div>

              <div class="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-medium">⚡ ${scheme.estimatedDays} days</span>
                <button class="btn-gov-secondary text-[10px] py-1 px-2.5 font-bold scheme-quick-open-btn" data-scheme-id="${scheme.id}">
                  Details
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Instant Fast Assessment Card -->
      <section class="px-4">
        <div class="card-gov p-4 bg-white border-2 border-amber-400/80 shadow-gov space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span class="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
                Quick Re-assessment
              </span>
              <h2 class="font-extrabold text-slate-900 text-sm mt-1">${t('quickCheckTitle')}</h2>
            </div>
            <span class="text-xl">🌾</span>
          </div>

          <form id="quick-check-form" class="space-y-2.5">
            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                ${t('mobileOrAadhaar')}
              </label>
              <input 
                type="text" 
                id="quick-mobile" 
                value="${profile.mobile || ''}" 
                placeholder="${t('mobilePlaceholder')}"
                class="input-gov text-xs py-2"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  ${t('stateLabel')}
                </label>
                <select id="quick-state" class="input-gov text-xs py-2 bg-white">
                  <option value="Madhya Pradesh" ${profile.state === 'Madhya Pradesh' ? 'selected' : ''}>Madhya Pradesh</option>
                  <option value="Uttar Pradesh" ${profile.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh</option>
                  <option value="Maharashtra" ${profile.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
                  <option value="Rajasthan" ${profile.state === 'Rajasthan' ? 'selected' : ''}>Rajasthan</option>
                  <option value="Bihar" ${profile.state === 'Bihar' ? 'selected' : ''}>Bihar</option>
                  <option value="Punjab" ${profile.state === 'Punjab' ? 'selected' : ''}>Punjab</option>
                  <option value="Gujarat" ${profile.state === 'Gujarat' ? 'selected' : ''}>Gujarat</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                  ${t('landholdingLabel')}
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  id="quick-land" 
                  value="${profile.landholdingAcres || '4.5'}" 
                  class="input-gov text-xs py-2"
                  required
                />
              </div>
            </div>

            <button type="submit" class="w-full btn-gov-primary text-xs py-2.5 font-extrabold bg-emerald-800 hover:bg-emerald-900 shadow-sm mt-1">
              ${t('btnDiscover')} →
            </button>
          </form>
        </div>
      </section>

      <!-- Why OptimalDBT Mobile Highlights -->
      <section class="px-4 pb-2 space-y-2">
        <h3 class="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
          Mobile DBT Guarantees
        </h3>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span class="text-base">🛡️</span>
            <p class="font-bold text-slate-900 text-[11px]">Conflict Shield</p>
            <p class="text-[10px] text-slate-500 leading-tight">Prevents scheme disqualifications</p>
          </div>

          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span class="text-base">📁</span>
            <p class="font-bold text-slate-900 text-[11px]">Single Upload</p>
            <p class="text-[10px] text-slate-500 leading-tight">Aadhaar & Land docs auto-reused</p>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function bindLandingEvents() {
  const form = document.getElementById('quick-check-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const mobile = document.getElementById('quick-mobile').value;
      const state = document.getElementById('quick-state').value;
      const land = document.getElementById('quick-land').value;

      const profile = getFarmerProfile();
      profile.mobile = mobile;
      profile.state = state;
      profile.landholdingAcres = parseFloat(land) || 4.5;
      saveFarmerProfile(profile);

      window.location.hash = '#wizard';
    });
  }

  document.querySelectorAll('.scheme-quick-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.schemeId;
      const s = SCHEMES.find(item => item.id === id);
      if (s) openSchemeModal(s);
    });
  });
}
