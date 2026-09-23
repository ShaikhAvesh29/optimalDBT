import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { X, Camera, Zap, Image } from 'lucide-react';

export function CameraModal() {
  const { t } = useTranslation();
  const { cameraModalDoc, setCameraModalDoc, updateDocStatus, triggerToast } = useApp();

  if (!cameraModalDoc) return null;

  const handleCapture = () => {
    updateDocStatus(cameraModalDoc.id, 'verified', { fileSize: '320 KB' });
    setCameraModalDoc(null);
    triggerToast(`Document captured & verified (320 KB): ${cameraModalDoc.name}`, 'success');
  };

  const handleGalleryUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      updateDocStatus(cameraModalDoc.id, 'verified', { fileSize: '410 KB' });
      setCameraModalDoc(null);
      triggerToast(`Uploaded and verified: ${cameraModalDoc.name}`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/85 backdrop-blur-xs animate-fade-in">
      <div className="bg-slate-950 text-white rounded-t-3xl sm:rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[600px] animate-slide-up">
        
        {/* Camera Top Bar */}
        <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-200">
              {t('documents.camera.title')}: {cameraModalDoc.name}
            </span>
          </div>
          <button
            onClick={() => setCameraModalDoc(null)}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Frame */}
        <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden p-6">
          <div className="w-full h-full max-h-[380px] border-2 border-dashed border-emerald-400/80 rounded-2xl relative flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/60 via-slate-800/40 to-slate-900/60 p-4">
            
            {/* Corner Reticles */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-amber-400"></div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-2xl text-emerald-400 shadow-inner">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-xs font-black text-slate-200">{t('documents.camera.positionHint')}</p>
              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                {t('documents.camera.daylightHint')}
              </p>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-600/50 px-2.5 py-1 rounded-full text-[10px] font-mono">
                <span>{t('documents.camera.compression')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-around safe-bottom">
          <label className="cursor-pointer flex flex-col items-center text-slate-400 hover:text-white transition">
            <Image className="w-6 h-6" />
            <span className="text-[10px] mt-1">{t('documents.camera.gallery')}</span>
            <input type="file" accept="image/*,.pdf" onChange={handleGalleryUpload} className="hidden" />
          </label>

          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-white border-4 border-slate-400 active:scale-90 active:bg-emerald-400 transition-all flex items-center justify-center shadow-lg"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 border-2 border-white"></div>
          </button>

          <button
            onClick={() => triggerToast('Camera flash set to Auto', 'info')}
            className="flex flex-col items-center text-slate-400 hover:text-amber-400 transition"
          >
            <Zap className="w-6 h-6" />
            <span className="text-[10px] mt-1">{t('documents.camera.flash')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
