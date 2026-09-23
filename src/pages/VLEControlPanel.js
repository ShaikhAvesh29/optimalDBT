import { t } from '../i18n/index.js';
import { SAMPLE_VLE_FARMERS } from '../data/farmers.js';
import { VILLAGE_STATS } from '../data/villageStats.js';
import { saveDraftWizard } from '../logic/storage.js';
import { showToast } from '../components/Toast.js';

let vleSearchQuery = '';

export function renderVLEControlPanel() {
  const filteredFarmers = SAMPLE_VLE_FARMERS.filter(f => 
    !vleSearchQuery ||
    f.name.toLowerCase().includes(vleSearchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(vleSearchQuery.toLowerCase()) ||
    f.mobile.includes(vleSearchQuery) ||
    f.id.includes(vleSearchQuery)
  );

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top VLE Header Card -->
      <div class="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-gov space-y-3 border-2 border-amber-500">
        <div class="flex justify-between items-start">
          <div>
            <div class="inline-flex items-center space-x-1.5 bg-amber-950/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-amber-300 border border-amber-600">
              <span>★</span>
              <span>CSC VLE Console</span>
            </div>
            <h1 class="text-base sm:text-lg font-black text-white mt-1">
              ${t('vleDashboardTitle')}
            </h1>
            <p class="text-[11px] text-amber-100">Sehore District • Operator Portal</p>
          </div>
          
          <a href="#wizard" id="btn-vle-new-applicant" class="btn-gov-primary bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2 px-3 rounded-xl shadow-md flex items-center space-x-1">
            <span>+</span>
            <span>New Farmer</span>
          </a>
        </div>

        <!-- 4 Village KPI Metric Cards -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <div class="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p class="text-[9px] uppercase font-bold text-amber-200">Farmers Assisted</p>
            <p class="text-lg font-black text-white mt-0.5">${VILLAGE_STATS.totalFarmersAssisted.toLocaleString('en-IN')}</p>
          </div>
          <div class="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p class="text-[9px] uppercase font-bold text-emerald-300">Capital Unlocked</p>
            <p class="text-lg font-black text-amber-300 mt-0.5">₹3.42 Cr</p>
          </div>
          <div class="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p class="text-[9px] uppercase font-bold text-amber-200">Pending Review</p>
            <p class="text-lg font-black text-amber-400 mt-0.5">${VILLAGE_STATS.pendingApplications}</p>
          </div>
          <div class="bg-black/30 p-2.5 rounded-xl border border-white/10">
            <p class="text-[9px] uppercase font-bold text-emerald-300">Disbursed</p>
            <p class="text-lg font-black text-emerald-400 mt-0.5">${VILLAGE_STATS.approvedApplications}</p>
          </div>
        </div>
      </div>

      <!-- Farmer Search & Queue -->
      <section class="card-gov p-4 space-y-3 bg-white">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-black text-slate-900 text-sm">Farmer Queue & Drafts</h2>
            <p class="text-[10px] text-slate-500">Tap to resume or audit claims</p>
          </div>
          <span class="text-[10px] font-bold text-slate-400 font-mono">${filteredFarmers.length} Farmers</span>
        </div>

        <!-- Search Bar -->
        <div class="relative">
          <input 
            type="text" 
            id="vle-search-input" 
            value="${vleSearchQuery}" 
            placeholder="Search farmer name, village, mobile..."
            class="input-gov text-xs pl-9 py-2 rounded-xl"
          />
          <span class="absolute left-3 top-2 text-slate-400 text-sm">🔍</span>
        </div>

        <!-- Mobile Farmer Cards (NOT Table) -->
        <div class="space-y-2.5 pt-1">
          ${filteredFarmers.map(f => `
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 active:border-emerald-600 transition">
              <!-- Row 1: Name & Status Badge -->
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-extrabold text-slate-900 text-sm">${f.name}</h3>
                  <p class="text-[10px] text-slate-500 font-mono">${f.id} • ${f.village}</p>
                </div>
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                  f.status === 'Optimized' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  f.status === 'Draft' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-blue-100 text-blue-800'
                }">
                  ${f.status} ${f.draftProgress < 100 ? `(${f.draftProgress}%)` : ''}
                </span>
              </div>

              <!-- Row 2: Metrics -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 bg-white rounded-xl border border-slate-100">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">Landholding</span>
                  <span class="font-bold text-slate-800 text-xs">${f.landholdingAcres} Acres</span>
                </div>
                <div class="p-2 bg-white rounded-xl border border-slate-100">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">Optimized Payout</span>
                  <span class="font-black text-emerald-900 text-xs">₹${f.optimizedBenefit.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <!-- Missing docs alert if any -->
              ${f.missingDocs > 0 ? `
                <p class="text-[10px] text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded-lg">
                  ⚠ Missing: ${f.missingDocs} Verification Document(s)
                </p>
              ` : ''}

              <!-- Row 3: Action Buttons -->
              <div class="flex gap-2 pt-1 border-t border-slate-200">
                ${f.status === 'Draft' ? `
                  <button class="btn-gov-accent w-full text-xs py-2 font-black vle-resume-draft-btn" data-farmer-id="${f.id}">
                    Resume Draft (${f.draftProgress}%) →
                  </button>
                ` : `
                  <a href="#dashboard" class="btn-gov-secondary w-full text-xs py-1.5 font-bold text-center text-emerald-900">
                    View Results Bundle →
                  </a>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Village Analytics Breakdown Cards -->
      <section class="card-gov p-4 space-y-3 bg-white">
        <h2 class="font-black text-slate-900 text-sm">Village-wise Analytics</h2>

        <div class="space-y-2 text-xs">
          ${VILLAGE_STATS.villageBreakdown.map(v => `
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p class="font-extrabold text-slate-900 text-xs">${v.village}</p>
                <p class="text-[10px] text-slate-500">${v.count} Farmers Registered</p>
              </div>
              <div class="text-right">
                <p class="font-black text-emerald-800 text-xs">${v.capital}</p>
                <span class="badge-gov-green text-[9px]">${v.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

export function bindVLEEvents() {
  const searchInput = document.getElementById('vle-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      vleSearchQuery = e.target.value;
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  }

  document.querySelectorAll('.vle-resume-draft-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const farmerId = btn.dataset.farmerId;
      const farmer = SAMPLE_VLE_FARMERS.find(f => f.id === farmerId);
      if (farmer) {
        saveDraftWizard({
          name: farmer.name,
          mobile: farmer.mobile,
          village: farmer.village,
          landholdingAcres: farmer.landholdingAcres,
          state: 'Madhya Pradesh',
          district: 'Sehore'
        });
        showToast(`Resumed draft for ${farmer.name}`, 'success');
        window.location.hash = '#wizard';
      }
    });
  });
}
