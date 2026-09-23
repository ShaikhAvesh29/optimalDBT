import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { setAppLanguage, getAppLanguage } from '../i18n/index.js';
import { User, Globe, FileText, Settings, HelpCircle, RefreshCw, Trash2, ArrowRight, ShieldCheck, ChevronRight, Check } from 'lucide-react';

export function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, vleMode, toggleVle, triggerToast } = useApp();
  const currentLang = getAppLanguage();

  const handleForceSync = () => {
    triggerToast('All local drafts and offline records synced with Central DBT server', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data and restore defaults?')) {
      localStorage.clear();
      triggerToast('Local state reset to defaults', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-gov-emerald text-white p-5 rounded-3xl shadow-gov space-y-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md border-2 border-white flex-shrink-0">
            {vleMode ? '★' : (profile.name?.slice(0, 2).toUpperCase() || 'RP')}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-white">{profile.name}</h1>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-900">
                {t('profile.verifiedFarmer')}
              </span>
            </div>
            <p className="text-xs text-emerald-200 font-mono mt-0.5">{profile.id} • {profile.mobile}</p>
            <p className="text-[11px] text-emerald-100">{profile.village}, {profile.district} ({profile.state})</p>
          </div>
        </div>

        <div className="pt-1">
          <Link
            to="/eligibility"
            className="w-full btn-gov-accent py-2.5 text-xs font-black flex items-center justify-center space-x-1"
          >
            <span>{t('profile.recalculate')}</span>
          </Link>
        </div>
      </div>

      {/* Navigation Options List (App-like Settings & Options) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-gov divide-y divide-slate-100 text-xs overflow-hidden">
        
        {/* Language Selection Route */}
        <Link
          to="/language"
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs">{t('profile.language')}</p>
              <p className="text-[10px] text-slate-500">
                {currentLang === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </Link>

        {/* Saved Drafts Route */}
        <Link
          to="/drafts"
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs">{t('profile.savedDrafts')}</p>
              <p className="text-[10px] text-slate-500">Resume saved farmer eligibility applications</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </Link>

        {/* VLE Operator Mode Switch */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs">{t('profile.vleMode')}</p>
              <p className="text-[10px] text-slate-500">{t('profile.vleDesc')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              toggleVle();
              if (!vleMode) navigate('/vle');
            }}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              vleMode ? 'bg-amber-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                vleMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></span>
          </button>
        </div>

        {/* Help & Support Route */}
        <Link
          to="/help"
          className="p-4 flex items-center justify-between hover:bg-slate-50 transition group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-xs">{t('profile.helpSupport')}</p>
              <p className="text-[10px] text-slate-500">{t('profile.kisanHelpline')}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
        </Link>
      </div>

      {/* Verified Data Details */}
      <div className="space-y-3 text-xs">
        {/* Personal Details */}
        <div className="card-gov p-4 space-y-2.5 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>👤</span> {t('profile.personalIdentity')}
            </span>
            <span className="badge-gov-green text-[9px]">{t('profile.aadhaarVerified')}</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.fatherName')}</span>
              <span className="font-bold text-slate-800">{profile.fatherName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.socialCategory')}</span>
              <span className="font-bold text-slate-800">{profile.socialCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.ageGender')}</span>
              <span className="font-bold text-slate-800">{profile.age} Yrs, {profile.gender}</span>
            </div>
          </div>
        </div>

        {/* Land Details */}
        <div className="card-gov p-4 space-y-2.5 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🌾</span> {t('profile.landKhatauni')}
            </span>
            <span className="badge-gov-green text-[9px]">{t('profile.synced712')}</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.totalLand')}</span>
              <span className="font-bold text-slate-800">{profile.landholdingAcres} Acres</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.irrigated')}</span>
              <span className="font-bold text-slate-800">{profile.irrigatedAcres} Acres</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.khatauniNo')}</span>
              <span className="font-mono font-bold text-slate-800">{profile.khatauniNumber}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="card-gov p-4 space-y-2.5 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🏦</span> {t('profile.bankDbt')}
            </span>
            <span className="badge-gov-green text-[9px]">{t('profile.npciActive')}</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.bankName')}</span>
              <span className="font-bold text-slate-800">{profile.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.accountNo')}</span>
              <span className="font-mono font-bold text-slate-800">{profile.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('profile.ifsc')}</span>
              <span className="font-mono font-bold text-slate-800">{profile.ifscCode}</span>
            </div>
          </div>
        </div>

        {/* Offline Cache & Reset */}
        <div className="card-gov p-4 space-y-2.5 bg-white">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>⚙️</span> {t('profile.offlineCache')}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1.2 MB</span>
          </div>
          <p className="text-[11px] text-slate-500">{t('profile.offlineDesc')}</p>
          <div className="flex gap-2 pt-1">
            <button onClick={handleForceSync} className="btn-gov-primary flex-1 text-xs py-2">
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              {t('profile.forceSync')}
            </button>
            <button onClick={handleResetData} className="btn-gov-secondary text-xs py-2 px-3 text-rose-700 hover:bg-rose-50 border-rose-200">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              {t('profile.resetData')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
