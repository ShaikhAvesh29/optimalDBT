import { t } from '../i18n/index.js';

export function renderFrictionBadge(friction) {
  if (friction === 'low') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
      ${t('effortLow')}
    </span>`;
  }
  if (friction === 'medium') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
      ${t('effortMed')}
    </span>`;
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
    ${t('effortHigh')}
  </span>`;
}

export function renderDocStatusBadge(status) {
  if (status === 'verified') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
      ✓ ${t('verified')}
    </span>`;
  }
  if (status === 'pending') {
    return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
      ⏳ ${t('pending')}
    </span>`;
  }
  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
    ✕ ${t('missing')}
  </span>`;
}
