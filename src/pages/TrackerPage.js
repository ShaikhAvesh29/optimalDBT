import { t } from '../i18n/index.js';
import { getApplications } from '../logic/storage.js';

let trackerFilter = 'all';

export function renderTrackerPage() {
  const applications = getApplications();

  const filtered = applications.filter(app => {
    if (trackerFilter === 'approved') return app.stage === 4;
    if (trackerFilter === 'in_progress') return app.stage < 4;
    return true;
  });

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top Title & Filter Chips -->
      <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
            Real-Time DBT Pipeline
          </span>
          <h1 class="text-base sm:text-lg font-black text-slate-900 mt-1">${t('trackerTitle')}</h1>
          <p class="text-[11px] text-slate-500">Live disbursement milestones & inspection stages</p>
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button class="tracker-filter-btn flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
            trackerFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }" data-filter="all">
            All (${applications.length})
          </button>
          <button class="tracker-filter-btn flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
            trackerFilter === 'in_progress' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }" data-filter="in_progress">
            Active (2)
          </button>
          <button class="tracker-filter-btn flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center ${
            trackerFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }" data-filter="approved">
            Disbursed (2)
          </button>
        </div>
      </div>

      <!-- Application Tracking Cards -->
      <div class="space-y-3">
        ${filtered.map(app => `
          <div class="card-gov p-4 space-y-3.5 bg-white border-l-4 ${app.stage === 4 ? 'border-l-emerald-600' : 'border-l-amber-500'}">
            <!-- Top Header -->
            <div class="flex justify-between items-start">
              <div>
                <span class="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ${app.id}
                </span>
                <h3 class="font-extrabold text-slate-900 text-sm mt-1 leading-tight">${app.schemeName}</h3>
                <p class="text-[10px] text-slate-400 mt-0.5">Submitted: ${app.submittedDate}</p>
              </div>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                app.stage === 4 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }">
                ${app.stage === 4 ? '✓ Disbursed' : 'In Progress'}
              </span>
            </div>

            <!-- Vertical Timeline Stages for Mobile -->
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div class="flex items-center space-x-2 text-[11px] ${app.stage >= 1 ? 'text-emerald-900 font-bold' : 'text-slate-400'}">
                <span class="w-4 h-4 rounded-full ${app.stage >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]">✓</span>
                <span>1. Application Submitted Online</span>
              </div>

              <div class="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div class="flex items-center space-x-2 text-[11px] ${app.stage >= 2 ? 'text-emerald-900 font-bold' : 'text-slate-400'}">
                <span class="w-4 h-4 rounded-full ${app.stage >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]">✓</span>
                <span>2. Land & Aadhaar Auto-Verified</span>
              </div>

              <div class="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div class="flex items-center space-x-2 text-[11px] ${app.stage >= 3 ? 'text-emerald-900 font-bold' : 'text-slate-400'}">
                <span class="w-4 h-4 rounded-full ${app.stage >= 3 ? (app.stage === 3 ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-700 text-white') : 'bg-slate-300'} flex items-center justify-center text-[9px]">
                  ${app.stage > 3 ? '✓' : '●'}
                </span>
                <span>3. Field Scrutiny & Patwari Survey</span>
              </div>

              <div class="w-0.5 h-1.5 bg-slate-300 ml-2"></div>

              <div class="flex items-center space-x-2 text-[11px] ${app.stage >= 4 ? 'text-emerald-900 font-bold' : 'text-slate-400'}">
                <span class="w-4 h-4 rounded-full ${app.stage >= 4 ? 'bg-emerald-700 text-white' : 'bg-slate-300'} flex items-center justify-center text-[9px]">
                  ${app.stage >= 4 ? '✓' : '○'}
                </span>
                <span>4. Payout Disbursed via NPCI / Aadhaar DBT</span>
              </div>
            </div>

            <!-- Next Step Alert Box -->
            <div class="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 flex justify-between items-center text-[11px]">
              <div>
                <span class="font-bold text-amber-950">Next Action:</span>
                <p class="text-[10px] text-amber-900">${app.nextStep}</p>
              </div>
              <a href="#locker" class="btn-gov-secondary text-[10px] py-1 px-2 font-bold text-emerald-800">
                Docs →
              </a>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

export function bindTrackerEvents() {
  document.querySelectorAll('.tracker-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      trackerFilter = btn.dataset.filter;
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  });
}
