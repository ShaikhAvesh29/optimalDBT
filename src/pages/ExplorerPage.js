import { t, getLanguage } from '../i18n/index.js';
import { SCHEMES } from '../data/schemes.js';
import { renderFrictionBadge } from '../components/StatusBadge.js';
import { openSchemeModal } from '../components/SchemeDetailModal.js';

let searchQuery = '';
let selectedCategory = 'all';

export function renderExplorerPage() {
  const isHindi = getLanguage() === 'hi';

  const filteredSchemes = SCHEMES.filter(s => {
    const matchQuery = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.hindiName && s.hindiName.includes(searchQuery)) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'all' || s.category === selectedCategory;

    return matchQuery && matchCategory;
  });

  const categories = [
    { id: 'all', label: 'All (47)' },
    { id: 'incomeSupport', label: 'Direct Income' },
    { id: 'cropInsurance', label: 'Insurance' },
    { id: 'irrigation', label: 'Irrigation' },
    { id: 'solarMachinery', label: 'Solar Pump' },
    { id: 'creditKCC', label: 'KCC Credit' }
  ];

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top Search Header -->
      <div class="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
            National Catalog
          </span>
          <h1 class="text-base sm:text-lg font-black text-slate-900 mt-1">${t('explorerTitle')}</h1>
          <p class="text-[11px] text-slate-500">Discover 2,847+ agricultural welfare programs</p>
        </div>

        <!-- Sticky Search Input -->
        <div class="relative">
          <input 
            type="text" 
            id="explorer-search-input" 
            value="${searchQuery}" 
            placeholder="Search scheme name, crop, solar..."
            class="input-gov text-xs pl-9 py-2.5 rounded-xl"
          />
          <span class="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          ${searchQuery ? `
            <button id="btn-clear-search" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs">
              ✕
            </button>
          ` : ''}
        </div>

        <!-- Category Horizontal Filter Rail -->
        <div class="flex space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          ${categories.map(cat => `
            <button 
              class="cat-filter-btn px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-800 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }"
              data-category="${cat.id}"
            >
              ${cat.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Scheme Cards List (Mobile Layout) -->
      <div class="space-y-3">
        <div class="flex justify-between items-center px-1">
          <span class="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Showing ${filteredSchemes.length} Schemes
          </span>
        </div>

        ${filteredSchemes.map(scheme => `
          <div class="card-gov p-4 space-y-3 bg-white border border-slate-200 shadow-gov hover:border-emerald-600 active:scale-[0.99] transition">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center space-x-1.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 uppercase">
                    ${scheme.code}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium">
                    ${scheme.level}
                  </span>
                </div>
                <h3 class="font-extrabold text-slate-900 text-sm mt-1 leading-snug">
                  ${isHindi ? (scheme.hindiName || scheme.name) : scheme.name}
                </h3>
              </div>
              <div class="text-right">
                <span class="text-sm font-black text-emerald-900 font-mono">${scheme.payoutFormatted}</span>
              </div>
            </div>

            <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
              ${isHindi ? (scheme.hindiDescription || scheme.description) : scheme.description}
            </p>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-[10px] text-slate-400 font-medium">Effort:</span>
                ${renderFrictionBadge(scheme.friction)}
              </div>

              <button class="btn-gov-secondary text-[10px] py-1.5 px-3 font-bold scheme-explorer-open-btn" data-scheme-id="${scheme.id}">
                Eligibility & Rules →
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

export function bindExplorerEvents() {
  const searchInput = document.getElementById('explorer-search-input');
  const clearBtn = document.getElementById('btn-clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  }

  document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.category;
      window.dispatchEvent(new CustomEvent('render-app'));
    });
  });

  document.querySelectorAll('.scheme-explorer-open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const schemeId = btn.dataset.schemeId;
      const scheme = SCHEMES.find(s => s.id === schemeId);
      if (scheme) openSchemeModal(scheme);
    });
  });
}
