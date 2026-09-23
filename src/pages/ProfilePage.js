import { t, getLanguage, setLanguage } from '../i18n/index.js';
import { getFarmerProfile } from '../logic/storage.js';
import { showToast } from '../components/Toast.js';

export function renderProfilePage() {
  const profile = getFarmerProfile();
  const currentLang = getLanguage();

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Profile Header Card -->
      <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-5 rounded-3xl shadow-gov space-y-3">
        <div class="flex items-center space-x-3.5">
          <div class="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md border-2 border-white flex-shrink-0">
            RP
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-base sm:text-lg font-black text-white">${profile.name}</h1>
              <span class="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-900">
                Verified
              </span>
            </div>
            <p class="text-xs text-emerald-200 font-mono mt-0.5">${profile.id} • ${profile.mobile}</p>
            <p class="text-[11px] text-emerald-100">${profile.village}, ${profile.district} (${profile.state})</p>
          </div>
        </div>

        <div class="pt-1">
          <a href="#wizard" class="w-full btn-gov-accent py-2.5 text-xs font-black flex items-center justify-center space-x-1">
            <span>⚡ Re-calculate DBT Eligibility</span>
          </a>
        </div>
      </div>

      <!-- Quick Language Preference Card -->
      <section class="card-gov p-4 space-y-2 bg-white">
        <div class="flex justify-between items-center">
          <h2 class="font-black text-slate-900 text-sm">App Language / भाषा</h2>
          <span class="text-[10px] text-slate-400 font-mono">Instant Switch</span>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button id="btn-profile-lang-en" class="p-2.5 rounded-xl border text-xs font-bold transition-all ${
            currentLang === 'en' ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
          }">
            English (Default)
          </button>
          <button id="btn-profile-lang-hi" class="p-2.5 rounded-xl border text-xs font-bold transition-all ${
            currentLang === 'hi' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200'
          }">
            हिन्दी (Hindi)
          </button>
        </div>
      </section>

      <!-- Verified Identity & Land Details Cards -->
      <div class="space-y-3 text-xs">
        <!-- Personal Details -->
        <div class="card-gov p-4 space-y-2.5 bg-white">
          <div class="flex justify-between items-center border-b border-slate-100 pb-2">
            <span class="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>👤</span> Personal & Identity
            </span>
            <span class="badge-gov-green text-[9px]">Aadhaar Verified</span>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between">
              <span class="text-slate-500">Father's Name:</span>
              <span class="font-bold text-slate-800">${profile.fatherName}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Social Category:</span>
              <span class="font-bold text-slate-800">${profile.socialCategory}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Age & Gender:</span>
              <span class="font-bold text-slate-800">${profile.age} Yrs, ${profile.gender}</span>
            </div>
          </div>
        </div>

        <!-- Land Records -->
        <div class="card-gov p-4 space-y-2.5 bg-white">
          <div class="flex justify-between items-center border-b border-slate-100 pb-2">
            <span class="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🌾</span> Land & Khatauni
            </span>
            <span class="badge-gov-green text-[9px]">7/12 Synced</span>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between">
              <span class="text-slate-500">Total Landholding:</span>
              <span class="font-bold text-slate-800">${profile.landholdingAcres} Acres</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Assured Irrigated:</span>
              <span class="font-bold text-slate-800">${profile.irrigatedAcres} Acres</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Khatauni No:</span>
              <span class="font-mono font-bold text-slate-800">${profile.khatauniNumber}</span>
            </div>
          </div>
        </div>

        <!-- Banking & NPCI -->
        <div class="card-gov p-4 space-y-2.5 bg-white">
          <div class="flex justify-between items-center border-b border-slate-100 pb-2">
            <span class="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🏦</span> Bank & DBT Seeding
            </span>
            <span class="badge-gov-green text-[9px]">NPCI Active</span>
          </div>
          <div class="space-y-1.5 text-[11px]">
            <div class="flex justify-between">
              <span class="text-slate-500">Bank Name:</span>
              <span class="font-bold text-slate-800">${profile.bankName}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Account (Masked):</span>
              <span class="font-mono font-bold text-slate-800">${profile.accountNumber}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">IFSC Code:</span>
              <span class="font-mono font-bold text-slate-800">${profile.ifscCode}</span>
            </div>
          </div>
        </div>

        <!-- Offline Storage & Cache -->
        <div class="card-gov p-4 space-y-2.5 bg-white">
          <div class="flex justify-between items-center border-b border-slate-100 pb-2">
            <span class="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>⚙️</span> Offline Drafts & Cache
            </span>
            <span class="text-[10px] text-slate-400 font-mono">1.2 MB Cached</span>
          </div>
          <p class="text-[11px] text-slate-500">Manage locally persisted farmer applications and offline draft queue.</p>
          <div class="flex gap-2 pt-1">
            <button id="btn-force-sync" class="btn-gov-primary flex-1 text-xs py-2">
              Force Cloud Sync
            </button>
            <button id="btn-clear-cache" class="btn-gov-secondary text-xs py-2 px-3 text-rose-700 hover:bg-rose-50 border-rose-200">
              Reset Data
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function bindProfileEvents() {
  const btnEn = document.getElementById('btn-profile-lang-en');
  const btnHi = document.getElementById('btn-profile-lang-hi');
  const syncBtn = document.getElementById('btn-force-sync');
  const clearBtn = document.getElementById('btn-clear-cache');

  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));
  if (btnHi) btnHi.addEventListener('click', () => setLanguage('hi'));

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      showToast('All local drafts and offline records synced successfully', 'success');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Reset demo data and clear cached drafts?')) {
        localStorage.clear();
        showToast('Local state reset to default', 'warning');
        setTimeout(() => window.location.reload(), 400);
      }
    });
  }
}
