import { t } from '../i18n/index.js';

export function renderFooter() {
  return `
    <footer class="bg-slate-900 text-slate-300 mt-auto border-t-4 border-amber-600">
      <!-- Main Footer Info -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Col 1: Government Branding & Mission -->
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center space-x-3">
              <img src="/emblem.svg" alt="Emblem of India" class="h-10 w-auto filter invert brightness-200" />
              <div>
                <h3 class="font-bold text-white text-base leading-snug">OptimalDBT</h3>
                <p class="text-xs text-amber-400 font-medium">योजना सुदृढ़ीकरण मंच</p>
              </div>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              An AI-assisted multi-period subsidy optimizer and eligibility pipeline designed for Indian farmers, CSC / VLE operators, and grassroots agricultural officers.
            </p>
            <div class="text-[11px] text-slate-400">
              <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              Platform Status: <strong class="text-emerald-400">Operational & DigiLocker Connected</strong>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1.5">
              Agricultural Portals
            </h4>
            <ul class="space-y-2 text-xs">
              <li><a href="https://pmkisan.gov.in" target="_blank" class="hover:text-amber-400 transition">PM-KISAN Samman Portal ↗</a></li>
              <li><a href="https://pmfby.gov.in" target="_blank" class="hover:text-amber-400 transition">PM Fasal Bima Yojana (PMFBY) ↗</a></li>
              <li><a href="https://pmksy.gov.in" target="_blank" class="hover:text-amber-400 transition">PM Krishi Sinchayee Yojana ↗</a></li>
              <li><a href="https://pmkusum.mnre.gov.in" target="_blank" class="hover:text-amber-400 transition">PM-KUSUM Solar Component ↗</a></li>
              <li><a href="https://soilhealth.dac.gov.in" target="_blank" class="hover:text-amber-400 transition">Soil Health Card Portal ↗</a></li>
            </ul>
          </div>

          <!-- Col 3: Assistance & Helplines -->
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1.5">
              Toll-Free Helplines
            </h4>
            <div class="space-y-3 text-xs">
              <div class="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <p class="text-[11px] text-slate-400">Kisan Call Centre (Toll Free)</p>
                <p class="text-base font-bold text-amber-400 tracking-wide">1800-180-1551</p>
                <p class="text-[10px] text-slate-500">Available 24x7 in 22 Regional Languages</p>
              </div>
              <div class="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                <p class="text-[11px] text-slate-400">PM-KISAN Helpdesk</p>
                <p class="text-sm font-bold text-white">155261 / 011-24300606</p>
              </div>
            </div>
          </div>

          <!-- Col 4: Digital India & VLE Assistance -->
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-1.5">
              VLE / Operator Support
            </h4>
            <p class="text-xs text-slate-400 leading-relaxed mb-3">
              Common Service Centre (CSC) operators can sync offline farmer batches and download combined application kits.
            </p>
            <div class="space-y-2">
              <a href="#vle-panel" class="inline-flex items-center justify-center w-full px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition">
                Open VLE Control Panel
              </a>
              <a href="#locker" class="inline-flex items-center justify-center w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition border border-slate-700">
                Access DigiLocker Vault
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Copyright -->
        <div class="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2024-2026 OptimalDBT. Ministry of Agriculture & Farmers Welfare, Government of India. Designed for National DBT Integration.</p>
          <div class="flex space-x-4">
            <span class="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span class="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span class="hover:text-slate-400 cursor-pointer">Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
