import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import {
  ArrowLeft,
  UserPlus,
  Phone,
  User,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogIn
} from 'lucide-react';

export function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfile, triggerToast } = useApp();

  const [isSignInMode, setIsSignInMode] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [mobile, setMobile] = useState(profile?.mobile || '');
  const [fullName, setFullName] = useState(profile?.name || '');
  const [state, setState] = useState(profile?.state || 'Madhya Pradesh');
  const [landholding, setLandholding] = useState(profile?.landholdingAcres?.toString() || '4.5');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [otp, setOtp] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const stateOptions = [
    'Madhya Pradesh',
    'Maharashtra',
    'Uttar Pradesh',
    'Rajasthan',
    'Gujarat',
    'Punjab',
    'Haryana',
    'Bihar',
    'Karnataka',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Telangana',
    'West Bengal',
    'Odisha'
  ];

  const handleRequestOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!mobile || mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg(t('signup.invalidMobile') || 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!isSignInMode && !fullName.trim()) {
      setErrorMsg(t('signup.fillRequired') || 'Please enter your full name');
      return;
    }

    // Advance to OTP verification
    setStep(2);
    triggerToast(`OTP sent to +91 ${mobile.slice(-4).padStart(10, '•')}`, 'info');
  };

  const handleVerifyAndSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp || otp.length < 4) {
      setErrorMsg(t('signup.invalidOtp') || 'Please enter a valid 4-digit OTP');
      return;
    }

    // Update global farmer profile
    updateProfile({
      name: isSignInMode ? profile.name : fullName.trim(),
      mobile: mobile.replace(/\D/g, ''),
      state: state,
      landholdingAcres: parseFloat(landholding) || 4.5,
      aadhaar: aadhaarLast4 ? `XXXX-XXXX-${aadhaarLast4.slice(-4)}` : profile.aadhaar,
      aadhaarSeeded: true
    });

    const successMsg = isSignInMode
      ? (t('signup.signInSuccess') || 'Signed in successfully!')
      : (t('signup.accountCreated') || 'Account created successfully! Welcome to OptimalDBT.');

    triggerToast(successMsg, 'success');
    navigate('/chat');
  };

  return (
    <div className="px-4 py-4 space-y-4 pb-24 animate-fade-in">
      
      {/* Top Header Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-gov flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5">
              {isSignInMode
                ? (t('signup.signInTitle') || 'Sign In to OptimalDBT')
                : (t('signup.title') || 'Create Your Account')}
            </h1>
            <p className="text-[11px] text-slate-500">
              {isSignInMode
                ? (t('signup.signInSubtitle') || 'Access your synchronized farmer benefits')
                : (t('signup.subtitle') || 'Zero duplicate paperwork for all government schemes')}
            </p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
          {isSignInMode ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
        </div>
      </div>

      {/* Error Message banner */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2.5 rounded-2xl flex items-center justify-between animate-fade-in">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-gov space-y-4">
        
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            
            {/* Mode Switch Toggle */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setIsSignInMode(false); setErrorMsg(''); }}
                className={`py-2 rounded-xl transition-all ${
                  !isSignInMode
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('signup.signUp') || 'Sign Up'}
              </button>
              <button
                type="button"
                onClick={() => { setIsSignInMode(true); setErrorMsg(''); }}
                className={`py-2 rounded-xl transition-all ${
                  isSignInMode
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('signup.signIn') || 'Sign In'}
              </button>
            </div>

            {/* Mobile Number Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('signup.mobileLabel') || 'Mobile Number'}</span>
              </label>
              <div className="flex rounded-2xl border border-slate-300 focus-within:ring-2 focus-within:ring-emerald-700 focus-within:border-emerald-700 overflow-hidden bg-slate-50/50">
                <span className="px-3.5 py-3 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-700 flex items-center">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('signup.mobilePlaceholder') || 'Enter 10-digit mobile number'}
                  className="w-full py-3 px-3 text-sm text-slate-900 bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Registration Fields (When in Sign Up mode) */}
            {!isSignInMode && (
              <>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('signup.nameLabel') || 'Farmer Full Name (as per Aadhaar)'}</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('signup.namePlaceholder') || 'e.g. Rajesh Kumar Patel'}
                    className="input-gov"
                    required
                  />
                </div>

                {/* State of Cultivation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('signup.stateLabel') || 'State of Cultivation'}</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-gov bg-white"
                  >
                    {stateOptions.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Landholding in Acres & Aadhaar Last 4 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      {t('signup.landLabel') || 'Land (Acres)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={landholding}
                      onChange={(e) => setLandholding(e.target.value)}
                      placeholder="4.5"
                      className="input-gov"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      {t('signup.aadhaarLabel') || 'Aadhaar Last 4'}
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      value={aadhaarLast4}
                      onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                      placeholder="8849"
                      className="input-gov"
                    />
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start space-x-2.5 pt-1 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>
                    {t('signup.termsCheck') || 'I agree to verify my farmer identity via Aadhaar & Land records'}
                  </span>
                </label>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isSignInMode && !agreed}
                className="w-full btn-gov-primary py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-md text-sm font-black"
              >
                <span>{t('signup.getOtpBtn') || 'Continue & Get OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyAndSubmit} className="space-y-4 animate-fade-in">
            <div className="text-center py-2 space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-slate-900">
                {t('signup.verifyTitle') || 'Enter Verification Code'}
              </h2>
              <p className="text-xs text-slate-500">
                {t('signup.verifySubtitle', { mobile: mobile || '9876543210' }) || `Sent 4-digit code to +91 ${mobile}`}
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 text-center block">
                {t('signup.otpLabel') || 'One-Time Password (OTP)'}
              </label>
              <input
                type="text"
                maxLength="4"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                className="input-gov text-center text-2xl tracking-[0.5em] font-black py-3"
                required
              />
              <p className="text-[10px] text-center text-slate-400">
                💡 Demo Mode: Enter any 4 digits (e.g. 1234)
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full btn-gov-primary py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-md text-sm font-black"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('signup.createAccountBtn') || 'Verify & Continue'}</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← {t('signup.backBtn') || 'Change Number'}
                </button>

                <button
                  type="button"
                  onClick={() => triggerToast('New OTP sent: 1234', 'info')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                >
                  {t('signup.resendCode') || 'Resend Code'}
                </button>
              </div>
            </div>
          </form>
        )}

      </div>

      {/* Trust & Guarantee Badge */}
      <div className="bg-emerald-950 text-white p-4 rounded-3xl space-y-2.5 shadow-md">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs font-black text-amber-300">
            Digital India & DBT Bharat Security
          </p>
        </div>
        <p className="text-[11px] text-emerald-100 leading-relaxed">
          Your farmer profile is encrypted and connected to official state land records (Khatauni 7/12) and Aadhaar NPCI DBT servers.
        </p>
      </div>

    </div>
  );
}

export default SignUpPage;
