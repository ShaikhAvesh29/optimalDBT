import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { Save, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { getAppLanguage } from '../i18n/index.js';

export function EligibilityWizardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfile, draft, saveWizardDraft, triggerToast } = useApp();
  const isHindi = getAppLanguage() === 'hi';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => draft || profile);

  const stepsMeta = [
    { num: 1, title: t('wizard.steps.personal'), sub: t('wizard.steps.personalSub') },
    { num: 2, title: t('wizard.steps.land'), sub: t('wizard.steps.landSub') },
    { num: 3, title: t('wizard.steps.agri'), sub: t('wizard.steps.agriSub') },
    { num: 4, title: t('wizard.steps.financial'), sub: t('wizard.steps.financialSub') },
    { num: 5, title: t('wizard.steps.benefits'), sub: t('wizard.steps.benefitsSub') },
    { num: 6, title: t('wizard.steps.review'), sub: t('wizard.steps.reviewSub') }
  ];

  const currentStepMeta = stepsMeta[step - 1];
  const progressPct = Math.round((step / 6) * 100);

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveDraft = () => {
    saveWizardDraft(formData);
    triggerToast(t('wizard.draftSaved'), 'success');
  };

  const handleNext = () => {
    saveWizardDraft(formData);
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    updateProfile(formData);
    saveWizardDraft(formData);
    navigate('/processing');
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-28 animate-fade-in">
      
      {/* Wizard Header & Stepper */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-gov space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
              {t('wizard.stepOf', { current: step, total: 6 })}
            </span>
            <h1 className="text-base font-black text-slate-900 mt-1">{currentStepMeta.title}</h1>
            <p className="text-[11px] text-slate-500">{currentStepMeta.sub}</p>
          </div>

          <button
            onClick={handleSaveDraft}
            className="btn-gov-secondary text-[10px] py-1.5 px-2.5 font-bold flex items-center space-x-1 text-emerald-800 bg-emerald-50 border-emerald-200"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('wizard.saveDraft')}</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* Step Dots */}
        <div className="flex justify-between px-1">
          {stepsMeta.map(s => (
            <div key={s.num} className="flex flex-col items-center">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s.num === step
                    ? 'bg-amber-500 ring-2 ring-amber-300 scale-125'
                    : s.num < step
                    ? 'bg-emerald-700'
                    : 'bg-slate-200'
                }`}
              ></span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-gov space-y-4">
        
        {/* Step 1: About You */}
        {step === 1 && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.fullName')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Rajesh Kumar Patel"
                className="input-gov"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.fatherName')}
              </label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                placeholder="e.g. Rameshwar Patel"
                className="input-gov"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.mobile')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.mobile || ''}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="10-digit mobile"
                  className="input-gov"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.aadhaar')}
                </label>
                <input
                  type="text"
                  value={formData.aadhaar || 'XXXX-XXXX-8849'}
                  onChange={(e) => handleChange('aadhaar', e.target.value)}
                  className="input-gov font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.gender')}
                </label>
                <select
                  value={formData.gender || 'Male'}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="input-gov bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.age')}
                </label>
                <input
                  type="number"
                  value={formData.age || 42}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 42)}
                  className="input-gov"
                />
              </div>
            </div>

            {/* Social Category Cards */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.socialCategory')} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['General', 'OBC', 'SC', 'ST'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleChange('socialCategory', cat)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      (formData.socialCategory || 'OBC') === cat
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-xs block">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Your Land */}
        {step === 2 && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.landAcres')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.landholdingAcres || 4.5}
                onChange={(e) => handleChange('landholdingAcres', parseFloat(e.target.value) || 0)}
                className="input-gov text-base font-extrabold text-emerald-900"
                required
              />
              
              {/* Land Quick Chips */}
              <div className="flex gap-1.5 mt-2">
                {[1.0, 2.5, 4.5, 6.0, 10.0].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleChange('landholdingAcres', val)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                  >
                    {val} Ac
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.irrigatedAcres')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.irrigatedAcres || 3.0}
                  onChange={(e) => handleChange('irrigatedAcres', parseFloat(e.target.value) || 0)}
                  className="input-gov"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.khatauniNo')}
                </label>
                <input
                  type="text"
                  value={formData.khatauniNumber || 'KH-781/24'}
                  onChange={(e) => handleChange('khatauniNumber', e.target.value)}
                  className="input-gov font-mono"
                />
              </div>
            </div>

            {/* Ownership */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.ownership')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange('ownershipType', 'Self Owned (Individual Khatauni)')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    (formData.ownershipType || '').includes('Self')
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xs">{t('wizard.ownerships.self')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('ownershipType', 'Joint Family Holding')}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    (formData.ownershipType || '').includes('Joint')
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xs">{t('wizard.ownerships.joint')}</span>
                </button>
              </div>
            </div>

            {/* State & District */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.state')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.state || 'Madhya Pradesh'}
                onChange={(e) => handleChange('state', e.target.value)}
                className="input-gov bg-white"
              >
                <option value="Madhya Pradesh">Madhya Pradesh (MP)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (UP)</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Bihar">Bihar</option>
                <option value="Punjab">Punjab</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.district')}
                </label>
                <input
                  type="text"
                  value={formData.district || 'Sehore'}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="input-gov"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.village')}
                </label>
                <input
                  type="text"
                  value={formData.village || 'Bhairunda'}
                  onChange={(e) => handleChange('village', e.target.value)}
                  className="input-gov"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Agriculture */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            {/* Kharif Crops */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.kharifCrops')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Soybean', 'Paddy', 'Maize', 'Cotton', 'Groundnut', 'Pulses'].map(crop => {
                  const selected = (formData.primaryCropsKharif || ['Soybean', 'Maize']).includes(crop);
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => {
                        const current = formData.primaryCropsKharif || ['Soybean', 'Maize'];
                        const updated = selected ? current.filter(c => c !== crop) : [...current, crop];
                        handleChange('primaryCropsKharif', updated);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {crop} {selected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rabi Crops */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.rabiCrops')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Wheat', 'Gram', 'Mustard', 'Barley', 'Vegetables'].map(crop => {
                  const selected = (formData.primaryCropsRabi || ['Wheat', 'Gram']).some(c => c.includes(crop));
                  return (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => {
                        const current = formData.primaryCropsRabi || ['Wheat', 'Gram'];
                        const updated = selected ? current.filter(c => !c.includes(crop)) : [...current, crop];
                        handleChange('primaryCropsRabi', updated);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {crop} {selected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Water Source */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.waterSource')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Borewell & Canal', 'Tube-well (Electric)', 'Diesel Pump Set', 'Rainfed Only'].map(src => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => handleChange('irrigationSource', src)}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      (formData.irrigationSource || 'Borewell & Canal') === src
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{src}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Livestock */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
                {t('wizard.fields.livestock')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Cows</span>
                  <span className="text-sm font-black text-slate-900">{formData.livestockCount?.cows || 3}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Buffaloes</span>
                  <span className="text-sm font-black text-slate-900">{formData.livestockCount?.buffaloes || 2}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold block">Poultry</span>
                  <span className="text-sm font-black text-slate-900">{formData.livestockCount?.poultry || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Financial Info */}
        {step === 4 && (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.bankName')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankName || 'State Bank of India'}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="input-gov"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.accountNo')}
                </label>
                <input
                  type="text"
                  value={formData.accountNumber || 'XXXXXXXX4920'}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className="input-gov font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  {t('wizard.fields.ifsc')}
                </label>
                <input
                  type="text"
                  value={formData.ifscCode || 'SBIN0001234'}
                  onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                  className="input-gov font-mono uppercase"
                />
              </div>
            </div>

            {/* NPCI Active Badge */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="font-black text-emerald-950 text-xs">{t('wizard.fields.npciActive')}</p>
                <p className="text-[10px] text-emerald-800">{t('wizard.fields.npciDesc')}</p>
              </div>
              <span className="badge-gov-green text-xs font-bold px-2 py-1">✓ Active</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                {t('wizard.fields.annualIncome')}
              </label>
              <input
                type="number"
                value={formData.annualIncome || 140000}
                onChange={(e) => handleChange('annualIncome', parseInt(e.target.value) || 0)}
                className="input-gov"
              />
              <p className="text-[10px] text-slate-400 mt-1">{t('wizard.fields.incomeNote')}</p>
            </div>
          </div>
        )}

        {/* Step 5: Existing Benefits */}
        {step === 5 && (
          <div className="space-y-3 text-xs">
            <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
              Select existing active benefits so our rules engine avoids mutual exclusivity penalties.
            </p>

            <div className="space-y-2">
              <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 text-xs">PM-KISAN (₹6,000/yr)</p>
                  <p className="text-[10px] text-slate-500">3 installments of ₹2,000</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.existingBenefits?.pmKisan ?? true}
                  onChange={(e) => handleChange('existingBenefits', { ...formData.existingBenefits, pmKisan: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600"
                />
              </label>

              <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 text-xs">PMFBY Crop Insurance</p>
                  <p className="text-[10px] text-slate-500">Active Kharif/Rabi weather insurance</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.existingBenefits?.pmfby ?? true}
                  onChange={(e) => handleChange('existingBenefits', { ...formData.existingBenefits, pmfby: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600"
                />
              </label>

              <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Kisan Credit Card (KCC 4%)</p>
                  <p className="text-[10px] text-slate-500">Subsidized production credit</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.existingBenefits?.kcc ?? true}
                  onChange={(e) => handleChange('existingBenefits', { ...formData.existingBenefits, kcc: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600"
                />
              </label>

              <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between bg-slate-50 cursor-pointer">
                <div>
                  <p className="font-bold text-slate-900 text-xs">Solar Agri Pump (PM-KUSUM)</p>
                  <p className="text-[10px] text-slate-500">60% capital solar pump grant</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.existingBenefits?.solarPump ?? false}
                  onChange={(e) => handleChange('existingBenefits', { ...formData.existingBenefits, solarPump: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-700 focus:ring-emerald-600"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Review & Run */}
        {step === 6 && (
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Profile Readiness</span>
                <span className="badge-gov-green text-xs font-bold">100% Ready</span>
              </div>
              <p className="font-black text-slate-900 text-sm">{formData.name} ({formData.socialCategory || 'OBC'})</p>
              <p className="text-[11px] text-slate-600">{formData.landholdingAcres || 4.5} Acres • {formData.village || 'Bhairunda'}, {formData.state || 'Madhya Pradesh'}</p>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Bank & DBT</span>
                <span className="font-bold text-slate-900">SBI (Aadhaar Seeded ✓)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Primary Crops</span>
                <span className="font-bold text-slate-900">Soybean, Maize, Wheat</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500 font-medium">Active Schemes</span>
                <span className="font-bold text-slate-900">PM-KISAN, PMFBY, KCC</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-800 text-[11px] space-y-1">
              <p className="font-black text-amber-950 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {t('wizard.reviewGuarantee')}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {t('wizard.reviewGuaranteeDesc')}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Sticky Mobile Bottom Navigation Controls */}
      <div className="fixed bottom-14 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-30 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="btn-gov-secondary text-xs py-3 px-4 font-bold flex-1 flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('wizard.back')}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/home')}
            className="btn-gov-secondary text-xs py-3 px-4 font-bold flex-1"
          >
            {t('wizard.cancel')}
          </button>
        )}

        {step < 6 ? (
          <button
            onClick={handleNext}
            className="btn-gov-primary text-xs py-3 px-4 font-extrabold flex-2 bg-emerald-800 hover:bg-emerald-900 shadow-md flex items-center justify-center space-x-1"
          >
            <span>{t('wizard.continue')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn-gov-accent text-xs py-3 px-4 font-black flex-2 shadow-lg flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t('wizard.runOptimization')}</span>
          </button>
        )}
      </div>

    </div>
  );
}
