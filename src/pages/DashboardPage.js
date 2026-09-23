import { t, getLanguage } from '../i18n/index.js';
import { getFarmerProfile } from '../logic/storage.js';
import { runOptimizationEngine } from '../logic/optimizer.js';
import { renderFrictionBadge } from '../components/StatusBadge.js';
import { openSchemeModal } from '../components/SchemeDetailModal.js';
import { openConflictWarningModal } from '../components/WarningModal.js';
import confetti from 'canvas-confetti';

let currentOptimizationResult = null;

export function renderDashboardPage() {
  const profile = getFarmerProfile();
  const optimization = runOptimizationEngine(profile);
  currentOptimizationResult = optimization;
  const isHindi = getLanguage() === 'hi';

  // Subtle confetti trigger
  setTimeout(() => {
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, 150);

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top Mobile Hero: Your Optimized Benefit -->
      <section class="bg-gradient-to-br from-emerald-950 via-emerald-900 to-gov-emerald text-white p-5 rounded-3xl shadow-xl space-y-3 relative overflow-hidden border border-emerald-700/60">
        <div class="flex justify-between items-start">
          <span class="inline-flex items-center space-x-1 bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide shadow-xs">
            <span>✨</span>
            <span>Optimized Result</span>
          </span>
          <span class="badge-gov-green bg-emerald-400/20 text-emerald-200 border-emerald-400/30 text-[10px]">
            0 Conflicts Detected
          </span>
        </div>

        <div>
          <p class="text-xs text-emerald-200 font-medium">Your Optimized Annual Benefit</p>
          <p class="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
            ₹${optimization.totalBenefit.toLocaleString('en-IN')}
          </p>
        </div>

        <p class="text-xs text-emerald-100 leading-relaxed">
          You could unlock <strong class="text-amber-300">₹${optimization.totalBenefit.toLocaleString('en-IN')}</strong> through a synergistic combination of ${optimization.eligibleSchemes.length} central and state schemes.
        </p>

        <!-- Quick 3-Metric Mobile Pills -->
        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-800/80 text-center">
          <div class="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p class="text-base font-black text-amber-400">${optimization.eligibleSchemes.length}</p>
            <p class="text-[9px] text-emerald-200 uppercase font-bold">Schemes</p>
          </div>
          <div class="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p class="text-base font-black text-white">${optimization.resolvedConflictsCount}</p>
            <p class="text-[9px] text-emerald-200 uppercase font-bold">Conflicts 0</p>
          </div>
          <div class="bg-emerald-900/60 p-2 rounded-xl border border-emerald-700/50">
            <p class="text-base font-black text-amber-400">12</p>
            <p class="text-[9px] text-emerald-200 uppercase font-bold">Docs (1x)</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-1 flex gap-2">
          <a href="#roadmap" class="btn-gov-accent flex-1 text-xs py-2.5 font-black text-center shadow-md">
            Start Applications →
          </a>
          <button id="btn-print-mobile-report" class="btn-gov-secondary text-xs py-2.5 px-3 font-bold bg-white/10 hover:bg-white/20 text-white border-white/20">
            📄 PDF
          </button>
        </div>
      </section>

      <!-- Status Quo vs Optimal Mobile Comparison (Vertical Flow) -->
      <section class="card-gov p-4 space-y-3.5 bg-white border-2 border-emerald-600/60">
        <div class="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h2 class="font-black text-slate-900 text-sm">Status Quo vs Optimal</h2>
            <p class="text-[10px] text-slate-500">Why coordinated optimization unlocks more</p>
          </div>
          <button id="btn-trigger-conflict-demo" class="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded-lg hover:bg-rose-100 active:scale-95">
            ⚠️ Test Conflict
          </button>
        </div>

        <!-- Vertical Comparison Layout -->
        <div class="space-y-2 text-xs">
          <!-- Step 1: Status Quo -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <p class="text-[10px] font-bold text-slate-500 uppercase">What you might choose (Default)</p>
              <p class="text-xs font-bold text-slate-700 mt-0.5">Uncoordinated individual applications</p>
            </div>
            <p class="text-base font-extrabold text-slate-600 font-mono">₹84,000</p>
          </div>

          <div class="text-center text-slate-400 text-xs font-bold">
            ↓ <em>OptimalDBT Coordination</em> ↓
          </div>

          <!-- Step 2: OptimalDBT Recommendation -->
          <div class="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-600 flex justify-between items-center">
            <div>
              <span class="badge-gov-green text-[9px] mb-0.5">Recommended</span>
              <p class="text-xs font-extrabold text-emerald-950">OptimalDBT Full Bundle</p>
            </div>
            <p class="text-lg font-black text-emerald-900 font-mono">₹${optimization.totalBenefit.toLocaleString('en-IN')}</p>
          </div>

          <div class="text-center text-emerald-700 text-xs font-bold">
            ↓ <em>Net Financial Advantage</em> ↓
          </div>

          <!-- Step 3: Potential Difference -->
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-300 flex justify-between items-center">
            <div>
              <p class="text-[10px] font-bold text-amber-900 uppercase">Surplus Benefit Unlocked</p>
              <p class="text-[10px] text-amber-800">Extra capital in your bank account</p>
            </div>
            <p class="text-base font-black text-amber-700 font-mono">+₹${optimization.surplusBenefit.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <!-- Expandable "Why is this better?" Accordion -->
        <div class="pt-1">
          <details class="group bg-slate-50 rounded-xl border border-slate-200 p-3 text-xs cursor-pointer">
            <summary class="font-bold text-emerald-900 flex justify-between items-center select-none">
              <span>💡 Why is this combination better?</span>
              <span class="text-emerald-700 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div class="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-600 space-y-2 text-[11px] leading-relaxed">
              <p>
                <strong>1. Mutual Exclusivity Resolved:</strong> Standard state drought relief (₹12,000) cancels PMFBY crop insurance (₹1,24,000). OptimalDBT ensures PMFBY remains active.
              </p>
              <p>
                <strong>2. Synergistic Top-Ups:</strong> PM-KISAN unlocks Madhya Pradesh Kalyan Yojana (MMKY) giving an extra ₹6,000 top-up automatically.
              </p>
              <p>
                <strong>3. Document Deduplication:</strong> Verified Aadhaar and Khatauni land records are automatically reused across all 8 scheme portals.
              </p>
            </div>
          </details>
        </div>
      </section>

      <!-- Recommended Schemes Swipeable/Stacked Cards -->
      <section class="space-y-3">
        <div class="flex justify-between items-center">
          <h2 class="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <span>🏛️</span> Recommended Scheme Bundle
          </h2>
          <span class="text-[11px] text-slate-500 font-bold">${optimization.eligibleSchemes.length} Compatible</span>
        </div>

        <div class="space-y-3">
          ${optimization.eligibleSchemes.map((scheme, idx) => `
            <div class="card-gov p-4 space-y-3 border-l-4 ${idx === 0 ? 'border-l-amber-500 bg-amber-50/20' : 'border-l-emerald-600'}">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center space-x-1.5">
                    <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                      ${scheme.code}
                    </span>
                    <span class="badge-gov-green text-[10px]">✓ Recommended</span>
                  </div>
                  <h3 class="font-extrabold text-slate-900 text-sm mt-1">
                    ${isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                  </h3>
                </div>
                <div class="text-right">
                  <p class="text-sm font-black text-emerald-900">${scheme.payoutFormatted}</p>
                  <p class="text-[9px] text-slate-400 uppercase font-medium mt-0.5">${scheme.frequency || 'Annual'}</p>
                </div>
              </div>

              <!-- Compact Friction & Processing Row -->
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                <div class="flex items-center space-x-2">
                  <span class="text-slate-500 font-medium">Effort:</span>
                  ${renderFrictionBadge(scheme.friction)}
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-slate-500 font-medium">Approval:</span>
                  <span class="font-bold text-slate-800">~${scheme.estimatedDays} days</span>
                </div>
              </div>

              <!-- Bottom Action -->
              <div class="flex justify-between items-center pt-1">
                <span class="text-[10px] text-emerald-800 font-bold">
                  📄 ${(scheme.documents || []).length} Verified Docs
                </span>
                <button class="btn-gov-secondary text-[11px] py-1.5 px-3 font-bold scheme-card-open-btn" data-scheme-id="${scheme.id}">
                  View Details →
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Friction Matrix Mobile Cards -->
      <section class="card-gov p-4 space-y-3 bg-white">
        <div>
          <h2 class="font-black text-slate-900 text-sm">Bureaucratic Friction Matrix</h2>
          <p class="text-[10px] text-slate-500">Effort, document counts & processing complexity</p>
        </div>

        <div class="space-y-2 text-xs">
          <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <p class="font-bold text-emerald-950 text-xs">Low Effort (Fast Track)</p>
                <p class="text-[10px] text-emerald-800">PM-KISAN, SHC, MMKY (10–15 days)</p>
              </div>
            </div>
            <span class="font-black text-emerald-900">3 Schemes</span>
          </div>

          <div class="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <div>
                <p class="font-bold text-amber-950 text-xs">Medium Effort (Verification)</p>
                <p class="text-[10px] text-amber-800">PMFBY, PMKSY, KCC (14–30 days)</p>
              </div>
            </div>
            <span class="font-black text-amber-900">3 Schemes</span>
          </div>

          <div class="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-rose-500"></span>
              <div>
                <p class="font-bold text-rose-950 text-xs">High Effort (Capital Asset)</p>
                <p class="text-[10px] text-rose-800">PM-KUSUM Solar Pump (45–60 days)</p>
              </div>
            </div>
            <span class="font-black text-rose-900">1 Scheme</span>
          </div>
        </div>
      </section>

      <!-- Next Steps Call to Action Bar -->
      <section class="space-y-2">
        <a href="#roadmap" class="w-full btn-gov-primary py-3.5 px-4 rounded-2xl flex items-center justify-center space-x-2 text-sm font-black shadow-lg">
          <span>📅 View 5-Year Application Roadmap</span>
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
        </a>
        <a href="#locker" class="w-full btn-gov-secondary py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold">
          <span>📁 Manage Document Locker (12 Files)</span>
        </a>
      </section>

    </div>
  `;
}

export function bindDashboardEvents() {
  const conflictBtn = document.getElementById('btn-trigger-conflict-demo');
  const printBtn = document.getElementById('btn-print-mobile-report');

  if (conflictBtn) {
    conflictBtn.addEventListener('click', openConflictWarningModal);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.querySelectorAll('.scheme-card-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.schemeId;
      if (currentOptimizationResult) {
        const s = currentOptimizationResult.eligibleSchemes.find(item => item.id === id);
        if (s) openSchemeModal(s);
      }
    });
  });
}
