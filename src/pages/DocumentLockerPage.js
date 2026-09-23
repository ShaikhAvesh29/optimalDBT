import { t } from '../i18n/index.js';
import { getFarmerProfile } from '../logic/storage.js';
import { runOptimizationEngine } from '../logic/optimizer.js';
import { deduplicateDocuments } from '../logic/deduplication.js';
import { renderDocStatusBadge } from '../components/StatusBadge.js';
import { openCameraModal } from '../components/CameraModal.js';
import { showToast } from '../components/Toast.js';

let documentsState = null;

export function renderDocumentLockerPage() {
  const profile = getFarmerProfile();
  const optimization = runOptimizationEngine(profile);
  
  if (!documentsState) {
    documentsState = deduplicateDocuments(optimization.eligibleSchemes);
  }

  const verifiedCount = documentsState.filter(d => d.status === 'verified').length;
  const totalCount = documentsState.length;
  const readinessPct = Math.round((verifiedCount / totalCount) * 100);

  return `
    <div class="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      <!-- Top DigiLocker Status & Readiness Card -->
      <div class="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <div class="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              <span>🔒</span>
              <span>DigiLocker Synced</span>
            </div>
            <h1 class="text-base sm:text-lg font-black text-slate-900 mt-1">${t('lockerTitle')}</h1>
            <p class="text-[11px] text-slate-500">Single upload reused across all 8 schemes</p>
          </div>

          <div class="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200">
            <div class="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
              ${readinessPct}%
            </div>
            <div>
              <p class="text-[9px] uppercase font-bold text-emerald-800">Readiness</p>
              <p class="text-xs font-black text-slate-900">${verifiedCount}/${totalCount}</p>
            </div>
          </div>
        </div>

        <!-- Single Upload Guarantee Callout -->
        <div class="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start space-x-2">
          <span class="text-base">✨</span>
          <p class="leading-relaxed">
            <strong>Zero Duplicate Uploads:</strong> Aadhaar, Khatauni and Bank records are deduplicated across PM-KISAN, PMFBY, and PMKSY.
          </p>
        </div>
      </div>

      <!-- Document Cards List (Mobile Native Cards) -->
      <div class="space-y-3">
        ${documentsState.map(doc => `
          <div class="card-gov p-4 space-y-3 bg-white border border-slate-200 shadow-gov">
            <!-- Header Row -->
            <div class="flex justify-between items-start">
              <div class="flex items-start space-x-2.5">
                <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold border border-slate-200 flex-shrink-0">
                  📄
                </div>
                <div>
                  <h3 class="font-extrabold text-slate-900 text-xs">${doc.name}</h3>
                  <p class="text-[10px] text-slate-500 font-medium mt-0.5">
                    Required by <strong class="text-emerald-800">${doc.schemes.length} schemes</strong> (${doc.schemes.join(', ')})
                  </p>
                </div>
              </div>
              ${renderDocStatusBadge(doc.status)}
            </div>

            <!-- File Metadata & Compression Info -->
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>Size: ${doc.fileSize || '320 KB'}</span>
              <span>Updated: ${doc.uploadedAt || '2024-10-18'}</span>
            </div>

            <!-- Mobile Actions: Camera Capture, DigiLocker & Upload -->
            <div class="flex gap-2 pt-1">
              <button class="btn-gov-primary text-[11px] py-2 px-3 font-bold flex-1 bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center space-x-1.5 btn-camera-capture" data-doc-id="${doc.id}" data-doc-name="${doc.name}">
                <span>📷</span>
                <span>Camera Scan</span>
              </button>

              ${doc.isDigiLockerAvailable && doc.status !== 'verified' ? `
                <button class="btn-gov-secondary text-[11px] py-2 px-3 font-bold bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 btn-pull-digilocker" data-doc-id="${doc.id}">
                  DigiLocker
                </button>
              ` : ''}

              <button class="btn-gov-secondary text-[11px] py-2 px-3 font-bold text-slate-700 btn-upload-doc" data-doc-id="${doc.id}">
                ${doc.status === 'verified' ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

export function bindDocumentLockerEvents() {
  document.querySelectorAll('.btn-camera-capture').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.dataset.docId;
      const docName = btn.dataset.docName;
      openCameraModal(docId, docName);
    });
  });

  document.querySelectorAll('.btn-pull-digilocker').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.dataset.docId;
      const doc = documentsState.find(d => d.id === docId);
      if (doc) {
        doc.status = 'verified';
        doc.fileSize = '380 KB';
        doc.uploadedAt = new Date().toISOString().split('T')[0];
        showToast(`Pulled verified ${doc.name} from DigiLocker`, 'success');
        window.dispatchEvent(new CustomEvent('render-app'));
      }
    });
  });

  document.querySelectorAll('.btn-upload-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.dataset.docId;
      const doc = documentsState.find(d => d.id === docId);
      if (doc) {
        doc.status = 'verified';
        doc.fileSize = '410 KB';
        doc.uploadedAt = new Date().toISOString().split('T')[0];
        showToast(`Uploaded and verified: ${doc.name}`, 'success');
        window.dispatchEvent(new CustomEvent('render-app'));
      }
    });
  });
}
