import { t, getLanguage } from '../i18n/index.js';
import { getFarmerProfile, saveFarmerProfile, getDraftWizard, saveDraftWizard, clearDraftWizard } from '../logic/storage.js';
import { showToast } from '../components/Toast.js';

let currentStep = 1;

export function renderWizardPage() {
  const profile = getFarmerProfile();
  const draft = getDraftWizard() || profile;
  const isHindi = getLanguage() === 'hi';

  const stepTitles = [
    { num: 1, title: isHindi ? "व्यक्तिगत विवरण" : "About You", sub: "Basic Identity & Category" },
    { num: 2, title: isHindi ? "भूमि एवं स्थान" : "Your Land", sub: "Landholding & Khatauni" },
    { num: 3, title: isHindi ? "कृषि एवं फसलें" : "Agriculture", sub: "Crops & Irrigation" },
    { num: 4, title: isHindi ? "वित्तीय जानकारी" : "Financial Info", sub: "Bank & Aadhaar Seeding" },
    { num: 5, title: isHindi ? "विद्यमान लाभ" : "Existing Benefits", sub: "Active Subsidies" },
    { num: 6, title: isHindi ? "समीक्षा एवं अनुकूलन" : "Review & Run", sub: "Confirm & Optimize" }
  ];

  const currentStepInfo = stepTitles[currentStep - 1] || stepTitles[0];
  const progressPct = Math.round((currentStep / 6) * 100);

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Wizard Mobile Header & Progress -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-gov space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
              Step ${currentStep} of 6
            </span>
            <h1 class="text-base font-black text-slate-900 mt-1">${currentStepInfo.title}</h1>
            <p class="text-[11px] text-slate-500">${currentStepInfo.sub}</p>
          </div>
          <button id="btn-save-draft-wizard" class="btn-gov-secondary text-[10px] py-1.5 px-2.5 font-bold flex items-center space-x-1 text-emerald-800 bg-emerald-50 border-emerald-200">
            <span>💾</span>
            <span>${t('btnSaveDraft')}</span>
          </button>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-600 to-amber-500 h-2 rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- 6 Step Indicator Dots -->
        <div class="flex justify-between px-1">
          ${stepTitles.map((s, idx) => `
            <div class="flex flex-col items-center">
              <span class="w-2.5 h-2.5 rounded-full ${
                s.num === currentStep ? 'bg-amber-500 ring-2 ring-amber-300 scale-125' :
                s.num < currentStep ? 'bg-emerald-700' : 'bg-slate-200'
              } transition-all"></span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Step Form Container -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-gov space-y-4">
        ${renderStepContent(currentStep, draft, isHindi)}
      </div>

      <!-- Sticky Mobile Bottom Bar with Navigation Actions -->
      <div class="fixed bottom-14 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-30 flex items-center justify-between gap-3">
        ${currentStep > 1 ? `
          <button id="btn-wizard-prev" class="btn-gov-secondary text-xs py-3 px-4 font-bold flex-1">
            ← ${t('btnBack')}
          </button>
        ` : `
          <a href="#home" class="btn-gov-secondary text-xs py-3 px-4 font-bold flex-1 text-center">
            Cancel
          </a>
        `}

        ${currentStep < 6 ? `
          <button id="btn-wizard-next" class="btn-gov-primary text-xs py-3 px-4 font-extrabold flex-2 bg-emerald-800 hover:bg-emerald-900 shadow-md flex items-center justify-center space-x-1">
            <span>Continue</span>
            <span>→</span>
          </button>
        ` : `
          <button id="btn-wizard-submit" class="btn-gov-accent text-xs py-3 px-4 font-black flex-2 shadow-lg flex items-center justify-center space-x-1.5">
            <span>⚡ ${t('btnRunOptimization')}</span>
          </button>
        `}
      </div>

    </div>
  `;
}

function renderStepContent(step, draft, isHindi) {
  switch (step) {
    case 1:
      return `
        <div class="space-y-3.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Full Name <span class="text-rose-500">*</span>
            </label>
            <input type="text" id="w-name" value="${draft.name || ''}" placeholder="e.g. Rajesh Kumar Patel" class="input-gov" required />
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Father / Husband Name
            </label>
            <input type="text" id="w-fatherName" value="${draft.fatherName || ''}" placeholder="e.g. Rameshwar Patel" class="input-gov" />
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Mobile Number <span class="text-rose-500">*</span>
              </label>
              <input type="tel" id="w-mobile" value="${draft.mobile || ''}" placeholder="10-digit mobile" class="input-gov" required />
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Aadhaar (Last 4 digits)
              </label>
              <input type="text" id="w-aadhaar" value="${draft.aadhaar || 'XXXX-XXXX-8849'}" placeholder="XXXX-XXXX-8849" class="input-gov font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Gender
              </label>
              <select id="w-gender" class="input-gov bg-white">
                <option value="Male" ${draft.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${draft.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="Other" ${draft.gender === 'Other' ? 'selected' : ''}>Other</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Age (Years)
              </label>
              <input type="number" id="w-age" value="${draft.age || 42}" class="input-gov" />
            </div>
          </div>

          <!-- Social Category Radio Cards -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Social Category (Crucial for Top-up Subsidies) <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-4 gap-2">
              ${['General', 'OBC', 'SC', 'ST'].map(cat => `
                <label class="p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  (draft.socialCategory || 'OBC') === cat 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 bg-white text-slate-700 font-medium'
                }">
                  <input type="radio" name="socialCategory" value="${cat}" class="hidden category-radio" ${ (draft.socialCategory || 'OBC') === cat ? 'checked' : '' } />
                  <span class="text-xs block">${cat}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      `;

    case 2:
      return `
        <div class="space-y-3.5 text-xs">
          <!-- Total Landholding -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Total Landholding (in Acres) <span class="text-rose-500">*</span>
            </label>
            <input type="number" step="0.1" id="w-land" value="${draft.landholdingAcres || 4.5}" class="input-gov text-base font-extrabold text-emerald-900" required />
            
            <!-- Quick Chips -->
            <div class="flex gap-1.5 mt-2">
              ${[1.0, 2.5, 4.5, 6.0, 10.0].map(val => `
                <button type="button" class="land-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] font-bold border border-slate-200" data-val="${val}">
                  ${val} Ac
                </button>
              `).join('')}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Assured Irrigated (Acres)
              </label>
              <input type="number" step="0.1" id="w-irrigated" value="${draft.irrigatedAcres || 3.0}" class="input-gov" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Khatauni Number (7/12)
              </label>
              <input type="text" id="w-khatauni" value="${draft.khatauniNumber || 'KH-781/24'}" class="input-gov font-mono" />
            </div>
          </div>

          <!-- Ownership Type Radio Cards -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Land Ownership Type
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label class="p-2.5 rounded-xl border cursor-pointer ${
                (draft.ownershipType || '').includes('Self') ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
              }">
                <input type="radio" name="ownershipType" value="Self Owned (Individual Khatauni)" class="hidden ownership-radio" checked />
                <span class="text-xs">Self Owned (Khatauni)</span>
              </label>
              <label class="p-2.5 rounded-xl border cursor-pointer ${
                (draft.ownershipType || '').includes('Joint') ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
              }">
                <input type="radio" name="ownershipType" value="Joint Family Holding" class="hidden ownership-radio" />
                <span class="text-xs">Joint Holding</span>
              </label>
            </div>
          </div>

          <!-- State, District, Village -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              State of Cultivation <span class="text-rose-500">*</span>
            </label>
            <select id="w-state" class="input-gov bg-white">
              <option value="Madhya Pradesh" ${draft.state === 'Madhya Pradesh' ? 'selected' : ''}>Madhya Pradesh (MP)</option>
              <option value="Uttar Pradesh" ${draft.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh (UP)</option>
              <option value="Maharashtra" ${draft.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
              <option value="Rajasthan" ${draft.state === 'Rajasthan' ? 'selected' : ''}>Rajasthan</option>
              <option value="Bihar" ${draft.state === 'Bihar' ? 'selected' : ''}>Bihar</option>
              <option value="Punjab" ${draft.state === 'Punjab' ? 'selected' : ''}>Punjab</option>
              <option value="Gujarat" ${draft.state === 'Gujarat' ? 'selected' : ''}>Gujarat</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">District</label>
              <input type="text" id="w-district" value="${draft.district || 'Sehore'}" class="input-gov" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Village / Gram</label>
              <input type="text" id="w-village" value="${draft.village || 'Bhairunda'}" class="input-gov" />
            </div>
          </div>
        </div>
      `;

    case 3:
      return `
        <div class="space-y-4 text-xs">
          <!-- Kharif Crops Selection Chips -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Primary Kharif Crops (Monsoon)
            </label>
            <div class="flex flex-wrap gap-1.5">
              ${['Soybean', 'Paddy (Dhan)', 'Maize (Makka)', 'Cotton', 'Groundnut', 'Pulses (Arhar)'].map(crop => {
                const checked = (draft.primaryCropsKharif || ['Soybean', 'Maize']).includes(crop.split(' ')[0]);
                return `
                  <button type="button" class="crop-chip px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    checked ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }" data-crop="${crop.split(' ')[0]}" data-season="kharif">
                    ${crop} ${checked ? '✓' : '+'}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Rabi Crops Selection Chips -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Primary Rabi Crops (Winter)
            </label>
            <div class="flex flex-wrap gap-1.5">
              ${['Wheat (Gehun)', 'Gram (Chana)', 'Mustard (Sarson)', 'Barley', 'Vegetables'].map(crop => {
                const checked = (draft.primaryCropsRabi || ['Wheat', 'Gram (Chana)']).some(c => c.includes(crop.split(' ')[0]));
                return `
                  <button type="button" class="crop-chip px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    checked ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }" data-crop="${crop.split(' ')[0]}" data-season="rabi">
                    ${crop} ${checked ? '✓' : '+'}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Primary Water Source -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Irrigation & Water Source
            </label>
            <div class="grid grid-cols-2 gap-2">
              ${['Borewell & Canal', 'Tube-well (Electric)', 'Diesel Pump Set', 'Rainfed Only'].map(src => `
                <label class="p-2.5 rounded-xl border text-center cursor-pointer ${
                  (draft.irrigationSource || 'Borewell & Canal') === src ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-700'
                }">
                  <input type="radio" name="irrigationSource" value="${src}" class="hidden" ${ (draft.irrigationSource || 'Borewell & Canal') === src ? 'checked' : '' } />
                  <span class="text-xs block">${src}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Livestock -->
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Livestock Holdings
            </label>
            <div class="grid grid-cols-3 gap-2">
              <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span class="text-[10px] text-slate-500 font-bold block">Cows</span>
                <span class="text-sm font-extrabold text-slate-900">${draft.livestockCount?.cows || 3}</span>
              </div>
              <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span class="text-[10px] text-slate-500 font-bold block">Buffaloes</span>
                <span class="text-sm font-extrabold text-slate-900">${draft.livestockCount?.buffaloes || 2}</span>
              </div>
              <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span class="text-[10px] text-slate-500 font-bold block">Poultry</span>
                <span class="text-sm font-extrabold text-slate-900">${draft.livestockCount?.poultry || 0}</span>
              </div>
            </div>
          </div>
        </div>
      `;

    case 4:
      return `
        <div class="space-y-3.5 text-xs">
          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Bank Name for DBT Transfers <span class="text-rose-500">*</span>
            </label>
            <input type="text" id="w-bank" value="${draft.bankName || 'State Bank of India'}" class="input-gov" />
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Account Number (Masked)
              </label>
              <input type="text" id="w-account" value="${draft.accountNumber || 'XXXXXXXX4920'}" class="input-gov font-mono" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                IFSC Code
              </label>
              <input type="text" id="w-ifsc" value="${draft.ifscCode || 'SBIN0001234'}" class="input-gov font-mono uppercase" />
            </div>
          </div>

          <!-- Aadhaar NPCI DBT Seeding Status Toggle -->
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <p class="font-extrabold text-emerald-950 text-xs">Aadhaar NPCI DBT Active</p>
              <p class="text-[10px] text-emerald-800">Account seeded for direct treasury disbursements</p>
            </div>
            <span class="badge-gov-green text-xs font-bold px-2 py-1">✓ Active</span>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Annual Family Farm & Non-Farm Income (₹)
            </label>
            <input type="number" id="w-income" value="${draft.annualIncome || 140000}" class="input-gov" />
            <p class="text-[10px] text-slate-400 mt-1">Under ₹2.5L qualifies for full central priority</p>
          </div>
        </div>
      `;

    case 5:
      return `
        <div class="space-y-3 text-xs">
          <p class="text-[11px] text-slate-500 leading-relaxed mb-1">
            Toggle schemes you are currently receiving so our optimization engine resolves overlaps and claims unlocked top-ups.
          </p>

          <div class="space-y-2">
            <!-- Benefit 1 -->
            <label class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
              <div>
                <p class="font-bold text-slate-900 text-xs">PM-KISAN (₹6,000/yr)</p>
                <p class="text-[10px] text-slate-500">3 installments of ₹2,000</p>
              </div>
              <input type="checkbox" id="w-has-pmkisan" class="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600" checked />
            </label>

            <!-- Benefit 2 -->
            <label class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
              <div>
                <p class="font-bold text-slate-900 text-xs">PMFBY Crop Insurance</p>
                <p class="text-[10px] text-slate-500">Active Kharif/Rabi weather insurance</p>
              </div>
              <input type="checkbox" id="w-has-pmfby" class="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600" checked />
            </label>

            <!-- Benefit 3 -->
            <label class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
              <div>
                <p class="font-bold text-slate-900 text-xs">Kisan Credit Card (KCC 4%)</p>
                <p class="text-[10px] text-slate-500">Subsidized production credit</p>
              </div>
              <input type="checkbox" id="w-has-kcc" class="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600" checked />
            </label>

            <!-- Benefit 4 -->
            <label class="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
              <div>
                <p class="font-bold text-slate-900 text-xs">Solar Agri Pump (PM-KUSUM)</p>
                <p class="text-[10px] text-slate-500">60% capital solar subsidy</p>
              </div>
              <input type="checkbox" id="w-has-kusum" class="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600" />
            </label>
          </div>
        </div>
      `;

    case 6:
      return `
        <div class="space-y-3.5 text-xs">
          <!-- Summary Header -->
          <div class="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div class="flex justify-between items-center">
              <span class="text-[10px] uppercase font-bold text-emerald-800">Profile Readiness</span>
              <span class="badge-gov-green text-xs">100% Ready</span>
            </div>
            <p class="font-black text-slate-900 text-sm">${draft.name} (${draft.socialCategory || 'OBC'})</p>
            <p class="text-[11px] text-slate-600">${draft.landholdingAcres || 4.5} Acres • ${draft.village || 'Bhairunda'}, ${draft.state || 'Madhya Pradesh'}</p>
          </div>

          <!-- Quick Review Items -->
          <div class="space-y-2">
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span class="text-slate-500 font-medium">Bank & DBT</span>
              <span class="font-bold text-slate-900">SBI (Aadhaar Seeded ✓)</span>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span class="text-slate-500 font-medium">Primary Crops</span>
              <span class="font-bold text-slate-900">Soybean, Maize, Wheat</span>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
              <span class="text-slate-500 font-medium">Active Schemes</span>
              <span class="font-bold text-slate-900">PM-KISAN, PMFBY, KCC</span>
            </div>
          </div>

          <!-- Guarantee Badge -->
          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-800 text-[11px] space-y-1">
            <p class="font-extrabold text-amber-950 flex items-center gap-1">
              <span>⚡</span> Multi-Period DBT Optimization Guarantee
            </p>
            <p class="text-slate-700 leading-relaxed">
              Clicking below evaluates 2,847 scheme rules, removes overlapping exclusions, and calculates your maximized payout package.
            </p>
          </div>
        </div>
      `;
  }
}

export function bindWizardEvents() {
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');
  const submitBtn = document.getElementById('btn-wizard-submit');
  const saveDraftBtn = document.getElementById('btn-save-draft-wizard');

  // Chip buttons
  document.querySelectorAll('.land-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const landInput = document.getElementById('w-land');
      if (landInput) landInput.value = chip.dataset.val;
    });
  });

  document.querySelectorAll('.crop-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('bg-emerald-800');
      chip.classList.toggle('text-white');
      chip.classList.toggle('bg-slate-100');
      chip.classList.toggle('text-slate-700');
    });
  });

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      saveCurrentForm();
      showToast(t('draftSavedToast'), 'success');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        window.dispatchEvent(new CustomEvent('render-app'));
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      saveCurrentForm();
      if (currentStep < 6) {
        currentStep++;
        window.dispatchEvent(new CustomEvent('render-app'));
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      saveCurrentForm();
      currentStep = 1;
      window.location.hash = '#processing';
    });
  }
}

function saveCurrentForm() {
  const profile = getFarmerProfile();
  
  const name = document.getElementById('w-name')?.value;
  const fatherName = document.getElementById('w-fatherName')?.value;
  const mobile = document.getElementById('w-mobile')?.value;
  const land = document.getElementById('w-land')?.value;
  const state = document.getElementById('w-state')?.value;
  const district = document.getElementById('w-district')?.value;
  const village = document.getElementById('w-village')?.value;

  if (name) profile.name = name;
  if (fatherName) profile.fatherName = fatherName;
  if (mobile) profile.mobile = mobile;
  if (land) profile.landholdingAcres = parseFloat(land) || 4.5;
  if (state) profile.state = state;
  if (district) profile.district = district;
  if (village) profile.village = village;

  saveFarmerProfile(profile);
  saveDraftWizard(profile);
}
