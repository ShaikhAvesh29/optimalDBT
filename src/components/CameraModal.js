import { t } from '../i18n/index.js';
import { showToast } from './Toast.js';

let activeCameraDocId = null;
let activeCameraDocName = '';

export function renderCameraModal() {
  return `
    <div id="camera-modal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs hidden">
      <div class="bg-slate-950 text-white rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[600px] animate-slide-up">
        
        <!-- Camera Top Bar -->
        <div class="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            <span id="camera-doc-title" class="text-xs font-bold text-slate-200">Scan Document</span>
          </div>
          <button id="btn-close-camera" class="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Camera Viewport with Crop Reticle -->
        <div class="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden p-6">
          <!-- Live Viewfinder Frame -->
          <div class="w-full h-full max-h-[380px] border-2 border-dashed border-emerald-400/80 rounded-2xl relative flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/60 via-slate-800/40 to-slate-900/60 p-4">
            
            <!-- Corner Reticles -->
            <div class="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400"></div>
            <div class="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400"></div>
            <div class="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400"></div>
            <div class="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400"></div>

            <div id="camera-preview-content" class="text-center space-y-3">
              <div class="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-2xl text-emerald-400 shadow-inner">
                📷
              </div>
              <p class="text-xs font-bold text-slate-200">Position document inside yellow corners</p>
              <p class="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                Ensure good daylight lighting. Document edges and text will be auto-straightened.
              </p>
              <div class="inline-flex items-center space-x-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 px-2.5 py-1 rounded-full text-[10px] font-mono">
                <span>⚡ Auto-Compression: ~320 KB (Rural 3G Ready)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Camera Action Controls -->
        <div class="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-around safe-bottom">
          <label class="cursor-pointer flex flex-col items-center text-slate-400 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-[10px] mt-1">Gallery</span>
            <input type="file" accept="image/*,.pdf" id="camera-file-input" class="hidden" />
          </label>

          <!-- Primary Shutter Button -->
          <button id="btn-shutter-capture" class="w-16 h-16 rounded-full bg-white border-4 border-slate-400 active:scale-90 active:bg-emerald-400 transition-all flex items-center justify-center shadow-lg">
            <div class="w-12 h-12 rounded-full bg-emerald-600 border-2 border-white"></div>
          </button>

          <button id="btn-toggle-flash" class="flex flex-col items-center text-slate-400 hover:text-amber-400 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span class="text-[10px] mt-1">Flash Auto</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

export function openCameraModal(docId, docName) {
  activeCameraDocId = docId;
  activeCameraDocName = docName;
  const modal = document.getElementById('camera-modal');
  const title = document.getElementById('camera-doc-title');
  if (title) title.textContent = `Capture: ${docName || 'Document'}`;
  if (modal) modal.classList.remove('hidden');
}

export function closeCameraModal() {
  const modal = document.getElementById('camera-modal');
  if (modal) modal.classList.add('hidden');
}

export function bindCameraModalEvents(onCaptureSuccess) {
  const closeBtn = document.getElementById('btn-close-camera');
  const shutterBtn = document.getElementById('btn-shutter-capture');
  const fileInput = document.getElementById('camera-file-input');
  const flashBtn = document.getElementById('btn-toggle-flash');

  if (closeBtn) closeBtn.addEventListener('click', closeCameraModal);
  
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      // Simulate capture animation
      shutterBtn.classList.add('scale-75');
      setTimeout(() => {
        shutterBtn.classList.remove('scale-75');
        closeCameraModal();
        showToast(`Document captured & compressed (310 KB): ${activeCameraDocName}`, 'success');
        if (onCaptureSuccess) onCaptureSuccess(activeCameraDocId);
      }, 350);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        closeCameraModal();
        showToast(`Uploaded & verified: ${activeCameraDocName}`, 'success');
        if (onCaptureSuccess) onCaptureSuccess(activeCameraDocId);
      }
    });
  }

  if (flashBtn) {
    flashBtn.addEventListener('click', () => {
      showToast('Camera flash toggled to ON', 'info');
    });
  }
}
