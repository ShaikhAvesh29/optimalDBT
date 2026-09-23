import { t, getLanguage } from '../i18n/index.js';
import { getFarmerProfile } from '../logic/storage.js';
import { runOptimizationEngine } from '../logic/optimizer.js';
import { generateTemporalRoadmap } from '../logic/temporalRoadmap.js';
import { renderFrictionBadge } from '../components/StatusBadge.js';
import { openSchemeModal } from '../components/SchemeDetailModal.js';
import { showToast } from '../components/Toast.js';

let selectedRoadmapYear = 1;
let checklistState = {
  step1: true,
  step2: true,
  step3: true,
  step4: false,
  step5: false
};

export function renderRoadmapPage() {
  const profile = getFarmerProfile();
  const optimization = runOptimizationEngine(profile);
  const roadmap = generateTemporalRoadmap(optimization.eligibleSchemes);
  const isHindi = getLanguage() === 'hi';

  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalTasks = Object.keys(checklistState).length;

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top Title Banner -->
      <div class="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-4 sm:p-5 rounded-3xl shadow-gov space-y-2">
        <div class="flex justify-between items-start">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
            5-Year Temporal Plan
          </span>
          <span class="text-xs font-mono font-bold text-amber-300">
            5-Year Cumulative: ₹7,85,000
          </span>
        </div>
        <h1 class="text-lg sm:text-xl font-black text-white">
          ${t('roadmapTitle')}
        </h1>
        <p class="text-xs text-emerald-200">
          Sequential multi-year plan to claim recurring subsidies and long-term capital grants.
        </p>
      </div>

      <!-- Action Plan Interactive Checklist (Mobile Checklist) -->
      <section class="card-gov p-4 space-y-3 bg-white border-2 border-amber-400/80">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h2 class="font-black text-slate-900 text-sm">Active Action Plan Checklist</h2>
            <p class="text-[10px] text-slate-500">Immediate Year 1 milestones</p>
          </div>
          <span id="checklist-progress-badge" class="badge-gov-amber text-[10px] font-black">
            ${completedCount} of ${totalTasks} Completed
          </span>
        </div>

        <!-- Interactive Checklist Items -->
        <div class="space-y-2 text-xs">
          <!-- Task 1 -->
          <label class="p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
            checklistState.step1 ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
          }">
            <input type="checkbox" class="checklist-item w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600" data-task="step1" ${checklistState.step1 ? 'checked' : ''} />
            <div class="flex-1">
              <p class="font-bold text-xs ${checklistState.step1 ? 'line-through text-emerald-900' : 'text-slate-900'}">Step 1 — Prepare Land & Identity Records</p>
              <p class="text-[10px] ${checklistState.step1 ? 'text-emerald-700' : 'text-slate-500'}">Khatauni (7/12 extract) & Aadhaar pulled via DigiLocker</p>
            </div>
            ${checklistState.step1 ? '<span class="text-emerald-700 font-bold text-xs">✓ Done</span>' : ''}
          </label>

          <!-- Task 2 -->
          <label class="p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
            checklistState.step2 ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
          }">
            <input type="checkbox" class="checklist-item w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600" data-task="step2" ${checklistState.step2 ? 'checked' : ''} />
            <div class="flex-1">
              <p class="font-bold text-xs ${checklistState.step2 ? 'line-through text-emerald-900' : 'text-slate-900'}">Step 2 — Obtain Crop Sowing Certificate</p>
              <p class="text-[10px] ${checklistState.step2 ? 'text-emerald-700' : 'text-slate-500'}">Patwari sowing endorsement for Kharif Soybean & Maize</p>
            </div>
            ${checklistState.step2 ? '<span class="text-emerald-700 font-bold text-xs">✓ Done</span>' : ''}
          </label>

          <!-- Task 3 -->
          <label class="p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
            checklistState.step3 ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
          }">
            <input type="checkbox" class="checklist-item w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600" data-task="step3" ${checklistState.step3 ? 'checked' : ''} />
            <div class="flex-1">
              <p class="font-bold text-xs ${checklistState.step3 ? 'line-through text-emerald-900' : 'text-slate-900'}">Step 3 — Submit PM-KISAN & PMFBY Package</p>
              <p class="text-[10px] ${checklistState.step3 ? 'text-emerald-700' : 'text-slate-500'}">Filing bundled application on centralized portal</p>
            </div>
            ${checklistState.step3 ? '<span class="text-emerald-700 font-bold text-xs">✓ Done</span>' : ''}
          </label>

          <!-- Task 4 -->
          <label class="p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
            checklistState.step4 ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
          }">
            <input type="checkbox" class="checklist-item w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600" data-task="step4" ${checklistState.step4 ? 'checked' : ''} />
            <div class="flex-1">
              <p class="font-bold text-xs ${checklistState.step4 ? 'line-through text-emerald-900' : 'text-slate-900'}">Step 4 — Complete District Physical Verification</p>
              <p class="text-[10px] ${checklistState.step4 ? 'text-emerald-700' : 'text-slate-500'}">Water source NOC for PMKSY Drip Micro-Irrigation</p>
            </div>
            ${checklistState.step4 ? '<span class="text-emerald-700 font-bold text-xs">✓ Done</span>' : '<span class="badge-gov-amber text-[9px]">Pending</span>'}
          </label>

          <!-- Task 5 -->
          <label class="p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer transition ${
            checklistState.step5 ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
          }">
            <input type="checkbox" class="checklist-item w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600" data-task="step5" ${checklistState.step5 ? 'checked' : ''} />
            <div class="flex-1">
              <p class="font-bold text-xs ${checklistState.step5 ? 'line-through text-emerald-900' : 'text-slate-900'}">Step 5 — Track Direct DBT Bank Payouts</p>
              <p class="text-[10px] ${checklistState.step5 ? 'text-emerald-700' : 'text-slate-500'}">Monitor installment releases via SMS and Claim Tracker</p>
            </div>
            ${checklistState.step5 ? '<span class="text-emerald-700 font-bold text-xs">✓ Done</span>' : '<span class="badge-gov-slate text-[9px]">Upcoming</span>'}
          </label>
        </div>
      </section>

      <!-- Vertical Mobile Multi-Year Timeline -->
      <section class="space-y-3">
        <div class="flex justify-between items-center">
          <h2 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <span>📅</span> Vertical Multi-Year Timeline
          </h2>
          <span class="text-[10px] text-slate-500 font-bold">5-Year Strategy</span>
        </div>

        <!-- Vertical Timeline Items -->
        <div class="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-emerald-200">
          ${roadmap.map(y => `
            <div class="relative pl-11">
              <!-- Timeline Marker Circle -->
              <div class="absolute left-3 top-4 -translate-x-1/2 w-6 h-6 rounded-full ${
                y.year === 1 ? 'bg-emerald-700 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-600'
              } flex items-center justify-center font-black text-[10px] shadow-sm">
                ${y.year}
              </div>

              <!-- Year Card -->
              <div class="card-gov p-4 space-y-3 bg-white ${y.year === 1 ? 'border-emerald-600 ring-2 ring-emerald-500/10' : ''}">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-[10px] font-black uppercase text-amber-700">YEAR ${y.year}</span>
                    <h3 class="font-extrabold text-slate-900 text-sm mt-0.5">
                      ${isHindi ? y.hindiTitle : y.title}
                    </h3>
                  </div>
                  <span class="badge-gov-green font-mono font-extrabold text-xs">
                    ₹${y.totalExpectedBenefit.toLocaleString('en-IN')}
                  </span>
                </div>

                <p class="text-[11px] text-slate-500 leading-relaxed">
                  ${y.description}
                </p>

                <!-- Schemes in this year -->
                <div class="space-y-1.5 pt-2 border-t border-slate-100">
                  ${y.schemes.length === 0 ? `
                    <p class="text-[10px] text-slate-400 italic">Recurring benefits continue automatically.</p>
                  ` : y.schemes.map(s => `
                    <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <p class="font-bold text-slate-900 text-[11px]">${isHindi ? (s.hindiName || s.name) : s.name}</p>
                        <p class="text-[10px] text-emerald-800 font-semibold">${s.payoutFormatted}</p>
                      </div>
                      <button class="btn-gov-secondary text-[10px] py-1 px-2 font-bold scheme-roadmap-open-btn" data-scheme-id="${s.id}">
                        Rules
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

export function bindRoadmapEvents() {
  document.querySelectorAll('.checklist-item').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const task = e.target.dataset.task;
      checklistState[task] = e.target.checked;
      showToast('Action plan progress updated', 'success');
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  });

  document.querySelectorAll('.scheme-roadmap-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.schemeId;
      const profile = getFarmerProfile();
      const optimization = runOptimizationEngine(profile);
      const s = optimization.eligibleSchemes.find(item => item.id === id);
      if (s) openSchemeModal(s);
    });
  });
}
