import { t } from '../i18n/index.js';

export function renderProcessingPage() {
  return `
    <div class="px-4 py-8 text-center space-y-6 max-w-md mx-auto animate-fade-in pb-20">
      
      <!-- Animated Emblem Icon with Pulse Ring -->
      <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div class="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-amber-500 animate-spin"></div>
        <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-900 to-emerald-700 text-white flex items-center justify-center shadow-lg font-black text-2xl">
          ⚡
        </div>
      </div>

      <!-- Title & Progress Bar -->
      <div class="space-y-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
          Optimization Pipeline Active
        </span>
        <h1 class="text-xl font-black text-slate-900 leading-tight">
          ${t('evaluatingRules')}
        </h1>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">
          Evaluating 2,847 scheme rules & state eligibility matrices
        </p>
      </div>

      <!-- Progress Meter -->
      <div class="space-y-1.5 max-w-xs mx-auto">
        <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div id="processing-progress-bar" class="bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300 w-0"></div>
        </div>
        <p id="processing-pct" class="text-xs font-mono font-bold text-emerald-800">0% Completed</p>
      </div>

      <!-- Vertical Mobile Processing Steps Sequence -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov text-left space-y-3 text-xs">
        
        <div id="p-step-1" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">1</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Your Information</p>
            <p class="text-[10px] text-slate-400">Aadhaar, landholding & category verified</p>
          </div>
        </div>

        <div class="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        <div id="p-step-2" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">2</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Eligibility Check</p>
            <p class="text-[10px] text-slate-400">Land criteria & crop zoning confirmed</p>
          </div>
        </div>

        <div class="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        <div id="p-step-3" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">3</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Scheme Matching</p>
            <p class="text-[10px] text-slate-400">Matched 8 Central & State programs</p>
          </div>
        </div>

        <div class="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        <div id="p-step-4" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">4</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Conflict Check</p>
            <p class="text-[10px] text-slate-400">Eliminated mutual exclusion penalties</p>
          </div>
        </div>

        <div class="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        <div id="p-step-5" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">5</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Benefit Optimization</p>
            <p class="text-[10px] text-slate-400">Maximizing multi-period treasury yield</p>
          </div>
        </div>

        <div class="w-0.5 h-2 bg-slate-200 ml-2.5"></div>

        <div id="p-step-6" class="flex items-center space-x-3 text-slate-400 transition-all duration-300">
          <span class="step-icon w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0">6</span>
          <div>
            <p class="font-bold text-slate-800 text-[11px]">Your Result Ready</p>
            <p class="text-[10px] text-slate-400">Personalized application roadmap generated</p>
          </div>
        </div>

      </div>

      <!-- Skip link -->
      <div>
        <button id="btn-skip-processing" class="text-xs text-slate-400 hover:text-emerald-800 underline font-semibold">
          Skip to Results Dashboard →
        </button>
      </div>

    </div>
  `;
}

export function bindProcessingEvents() {
  const progressBar = document.getElementById('processing-progress-bar');
  const pctEl = document.getElementById('processing-pct');
  const skipBtn = document.getElementById('btn-skip-processing');

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      window.location.hash = '#dashboard';
    });
  }

  let progress = 0;
  const interval = setInterval(() => {
    progress += 18;
    if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
    if (pctEl) pctEl.textContent = `${Math.min(progress, 100)}% Completed`;

    // Activate Step checklist items
    const stepIdx = Math.floor(progress / 17) + 1;
    for (let i = 1; i <= Math.min(stepIdx, 6); i++) {
      const stepEl = document.getElementById(`p-step-${i}`);
      if (stepEl) {
        stepEl.className = "flex items-center space-x-3 text-emerald-900";
        const icon = stepEl.querySelector('.step-icon');
        if (icon) {
          icon.className = "step-icon w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-xs";
          icon.textContent = "✓";
        }
      }
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        window.location.hash = '#dashboard';
      }, 400);
    }
  }, 350);
}
