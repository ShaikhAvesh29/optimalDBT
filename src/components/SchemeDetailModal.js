import { t, getLanguage } from '../i18n/index.js';
import { renderFrictionBadge } from './StatusBadge.js';

export function renderSchemeDetailModal() {
  return `
    <div id="scheme-detail-modal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs hidden transition-opacity duration-200">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-slide-up">
        
        <!-- Bottom Sheet Handle -->
        <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-5 flex justify-between items-start">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span id="modal-scheme-code" class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950">PM-KISAN</span>
              <span id="modal-scheme-level" class="text-[11px] text-emerald-200 font-medium">Central Sector</span>
            </div>
            <h3 id="modal-scheme-name" class="text-base sm:text-lg font-black mt-1 text-white leading-snug">Pradhan Mantri Kisan Samman Nidhi</h3>
            <p id="modal-scheme-payout" class="text-sm font-extrabold text-amber-300 mt-0.5">₹6,000 / year</p>
          </div>
          <button id="btn-close-scheme-modal" class="text-emerald-200 hover:text-white p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable content -->
        <div class="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-700 text-xs">
          <!-- Overview -->
          <div>
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">About Scheme</h4>
            <p id="modal-scheme-desc" class="text-slate-700 leading-relaxed text-xs"></p>
          </div>

          <!-- Payout Structure & Frequency -->
          <div class="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <p class="text-[10px] text-slate-500 font-medium">Payout Schedule</p>
              <p id="modal-scheme-freq" class="font-extrabold text-slate-900 mt-0.5 text-xs">Thrice a year</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-500 font-medium">Approval Timeline</p>
              <p id="modal-scheme-days" class="font-extrabold text-emerald-800 mt-0.5 text-xs">15 days</p>
            </div>
          </div>

          <!-- Verification Documents Required -->
          <div>
            <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Documents (Deduplicated)</h4>
            <div id="modal-scheme-docs" class="space-y-1.5"></div>
          </div>

          <!-- Synergies & Conflict Rules -->
          <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <h4 class="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>✨</span> OptimalDBT Synergy Rules
            </h4>
            <p class="text-[11px] text-emerald-800 leading-relaxed">
              This scheme seamlessly combines with other verified schemes in your bundle. Uploaded Aadhaar & Khatauni will be shared automatically without duplicate scanning.
            </p>
          </div>
        </div>

        <!-- Sticky Footer Action -->
        <div class="p-3.5 bg-slate-50 border-t border-slate-200 flex gap-2 safe-bottom">
          <button id="btn-close-scheme-modal-bottom" class="btn-gov-secondary text-xs py-2.5 px-4 font-bold flex-1">
            Close
          </button>
          <a href="#tracker" id="btn-apply-direct" class="btn-gov-primary text-xs py-2.5 px-4 font-bold bg-emerald-800 hover:bg-emerald-900 flex-2 text-center">
            Start Application →
          </a>
        </div>
      </div>
    </div>
  `;
}

export function openSchemeModal(scheme) {
  if (!scheme) return;
  const isHindi = getLanguage() === 'hi';
  const modal = document.getElementById('scheme-detail-modal');
  if (!modal) return;

  document.getElementById('modal-scheme-code').textContent = scheme.code || scheme.id;
  document.getElementById('modal-scheme-level').textContent = scheme.level || "Government Scheme";
  document.getElementById('modal-scheme-name').textContent = isHindi ? (scheme.hindiName || scheme.name) : scheme.name;
  document.getElementById('modal-scheme-payout').textContent = scheme.payoutFormatted || `₹${scheme.payoutAnnual.toLocaleString('en-IN')}`;
  document.getElementById('modal-scheme-desc').textContent = isHindi ? (scheme.hindiDescription || scheme.description) : scheme.description;
  document.getElementById('modal-scheme-freq').textContent = scheme.frequency || "Annual";
  document.getElementById('modal-scheme-days').textContent = `${scheme.estimatedDays || 15} days`;

  const docsContainer = document.getElementById('modal-scheme-docs');
  docsContainer.innerHTML = (scheme.documents || []).map(d => `
    <div class="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
      <div class="flex items-center space-x-2">
        <span class="text-emerald-700 text-sm">📄</span>
        <span class="text-xs font-bold text-slate-800">${d.name}</span>
      </div>
      <span class="text-[10px] px-2 py-0.5 rounded font-bold ${d.required ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'}">
        ${d.required ? 'Mandatory' : 'Optional'}
      </span>
    </div>
  `).join('');

  modal.classList.remove('hidden');
}

export function closeSchemeModal() {
  const modal = document.getElementById('scheme-detail-modal');
  if (modal) modal.classList.add('hidden');
}
