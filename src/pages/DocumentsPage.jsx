import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { Camera, Download, FileText, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export function DocumentsPage() {
  const { t } = useTranslation();
  const { documents, updateDocStatus, setCameraModalDoc, triggerToast } = useApp();

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const totalCount = documents.length;
  const readinessPct = Math.round((verifiedCount / totalCount) * 100);

  const handleDigiLockerPull = (doc) => {
    updateDocStatus(doc.id, 'verified', { fileSize: '380 KB' });
    triggerToast(`Pulled verified ${doc.name} from DigiLocker`, 'success');
  };

  const handleManualUpload = (doc) => {
    updateDocStatus(doc.id, 'verified', { fileSize: '420 KB' });
    triggerToast(`Uploaded and verified: ${doc.name}`, 'success');
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* DigiLocker Status & Readiness Card */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('documents.digiLockerSynced')}</span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 mt-1">{t('documents.title')}</h1>
            <p className="text-[11px] text-slate-500">{t('documents.subtitle')}</p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-2xl border border-emerald-200">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
              {readinessPct}%
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-emerald-800">{t('documents.readiness')}</p>
              <p className="text-xs font-black text-slate-900">{verifiedCount}/{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Deduplication Guarantee */}
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t('documents.guarantee')}
          </p>
        </div>
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {documents.map(doc => (
          <div key={doc.id} className="card-gov p-4 space-y-3 bg-white border border-slate-200 shadow-gov">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-base font-bold border border-slate-200 flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs">{doc.name}</h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {t('documents.requiredBy', { count: doc.schemes.length })} ({doc.schemes.join(', ')})
                  </p>
                </div>
              </div>
              <StatusBadge type={doc.status} label={doc.status === 'verified' ? t('documents.verified') : t('documents.missing')} />
            </div>

            {/* Metadata */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>{t('documents.size')} {doc.fileSize || '320 KB'}</span>
              <span>{t('documents.updated')} {doc.uploadedAt || '2024-10-18'}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setCameraModalDoc(doc)}
                className="btn-gov-primary text-[11px] py-2 px-3 font-bold flex-1 bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center space-x-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t('documents.cameraScan')}</span>
              </button>

              {doc.isDigiLockerAvailable && doc.status !== 'verified' && (
                <button
                  onClick={() => handleDigiLockerPull(doc)}
                  className="btn-gov-secondary text-[11px] py-2 px-3 font-bold bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100"
                >
                  {t('documents.digiLocker')}
                </button>
              )}

              <button
                onClick={() => handleManualUpload(doc)}
                className="btn-gov-secondary text-[11px] py-2 px-3 font-bold text-slate-700"
              >
                {doc.status === 'verified' ? t('documents.update') : t('documents.upload')}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
