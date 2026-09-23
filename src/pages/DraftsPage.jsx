import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { ArrowLeft, FileText, Trash2, ArrowRight } from 'lucide-react';
import { SAMPLE_VLE_FARMERS } from '../data/farmers.js';

export function DraftsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { draft, saveWizardDraft, clearWizardDraft, triggerToast } = useApp();

  const draftsList = [
    ...(draft ? [{
      id: "DRAFT-LOCAL-CURRENT",
      name: draft.name || "Your Current Application",
      village: draft.village || "Bhairunda",
      landholdingAcres: draft.landholdingAcres || 4.5,
      progress: 65,
      missingDocs: 1,
      isCurrent: true,
      data: draft
    }] : []),
    ...SAMPLE_VLE_FARMERS.filter(f => f.status === 'Draft').map(f => ({
      id: f.id,
      name: f.name,
      village: f.village,
      landholdingAcres: f.landholdingAcres,
      progress: f.draftProgress,
      missingDocs: f.missingDocs,
      isCurrent: false,
      data: {
        name: f.name,
        mobile: f.mobile,
        village: f.village,
        landholdingAcres: f.landholdingAcres,
        state: 'Madhya Pradesh',
        district: 'Sehore'
      }
    }))
  ];

  const handleResume = (item) => {
    saveWizardDraft(item.data);
    triggerToast(`Resumed draft for ${item.name}`, 'success');
    navigate('/eligibility');
  };

  const handleDelete = (item) => {
    if (item.isCurrent) {
      clearWizardDraft();
      triggerToast('Draft cleared', 'info');
    }
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {t('profile.savedDrafts')}
            </h1>
            <p className="text-[11px] text-slate-500">Locally stored offline applications</p>
          </div>
        </div>
      </div>

      {/* Drafts List */}
      <div className="space-y-3">
        {draftsList.length === 0 ? (
          <div className="card-gov p-8 text-center text-slate-400 text-xs space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p>No saved drafts found. You can start a new eligibility assessment anytime.</p>
          </div>
        ) : (
          draftsList.map(item => (
            <div key={item.id} className="card-gov p-4 space-y-3 bg-white border border-slate-200 shadow-gov">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{item.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.village}</p>
                </div>
                <span className="badge-gov-amber text-[10px] font-black">
                  {item.progress}% Complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
              </div>

              {item.missingDocs > 0 && (
                <p className="text-[10px] text-rose-700 font-bold bg-rose-50 px-2.5 py-1 rounded-lg">
                  ⚠ Missing: {item.missingDocs} Verification Document(s)
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleResume(item)}
                  className="btn-gov-accent flex-1 text-xs py-2 font-black flex items-center justify-center space-x-1"
                >
                  <span>Resume Application ({item.progress}%)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {item.isCurrent && (
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
