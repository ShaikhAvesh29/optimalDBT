import { t } from '../i18n/index.js';

export function renderWarningModal() {
  return `
    <div id="conflict-warning-modal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs hidden transition-opacity duration-200">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full border-t-4 sm:border-2 border-rose-500 shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        
        <!-- Mobile Bottom Sheet Handle -->
        <div class="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-3 mb-1 sm:hidden"></div>

        <!-- Header Banner -->
        <div class="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-start space-x-3.5">
          <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-lg">
            ⚠️
          </div>
          <div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase tracking-wide">
              Disqualification Cascade Alert
            </span>
            <h3 class="text-base font-extrabold text-slate-900 mt-0.5 leading-snug">
              ${t('conflictModalTitle')}
            </h3>
          </div>
        </div>

        <!-- Conflict Breakdown Body -->
        <div class="p-4 sm:p-6 space-y-3.5 text-xs overflow-y-auto">
          <!-- Comparison Cards Stacked on Mobile -->
          <div class="space-y-2">
            <div class="p-3 bg-rose-50/80 rounded-xl border border-rose-200">
              <p class="text-[10px] font-bold text-rose-700 uppercase">You Selected</p>
              <div class="flex justify-between items-center mt-0.5">
                <p class="font-extrabold text-slate-900 text-sm">State Uninsurable Drought Relief</p>
                <span class="font-bold text-rose-700 text-xs">₹12,000 Payout</span>
              </div>
            </div>

            <div class="text-center font-bold text-slate-400 text-xs py-0.5">
              ⚡ CONFLICTS & DISQUALIFIES ⚡
            </div>

            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p class="text-[10px] font-bold text-emerald-700 uppercase">Existing Active Recommended Benefit</p>
              <div class="flex justify-between items-center mt-0.5">
                <p class="font-extrabold text-slate-900 text-sm">PM Fasal Bima Yojana (PMFBY)</p>
                <span class="font-bold text-emerald-800 text-xs">₹1,24,000 Cover</span>
              </div>
            </div>
          </div>

          <!-- Reason Alert Box -->
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p class="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <span>📜</span> Legal Disqualification Rule
            </p>
            <p class="text-slate-600 leading-relaxed text-[11px]">
              Under Clause 4.2 of State Disaster Manual, claiming uninsurable emergency relief automatically cancels PMFBY crop insurance claims for the entire season.
            </p>
          </div>

          <!-- Impact Math -->
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
            <span class="text-amber-900 font-bold">Net Financial Loss if Selected:</span>
            <span class="text-sm font-black text-rose-700">-₹1,12,000 Deficit</span>
          </div>

          <!-- Recommendation -->
          <p class="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            💡 <strong>OptimalDBT Recommendation:</strong> Retain PMFBY in your bundle for comprehensive coverage and maximum financial yield.
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="bg-slate-50 px-4 py-3.5 border-t border-slate-200 flex flex-col gap-2 safe-bottom">
          <button id="btn-keep-optimal-modal" class="btn-gov-primary w-full text-xs sm:text-sm py-3 bg-emerald-800 hover:bg-emerald-900">
            ✓ ${t('btnKeepOptimal')}
          </button>
          <button id="btn-cancel-conflict-modal" class="btn-gov-secondary w-full text-xs sm:text-sm py-2 text-slate-600">
            ${t('btnProceedAnyway')}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function openConflictWarningModal() {
  const el = document.getElementById('conflict-warning-modal');
  if (el) el.classList.remove('hidden');
}

export function closeConflictWarningModal() {
  const el = document.getElementById('conflict-warning-modal');
  if (el) el.classList.add('hidden');
}
