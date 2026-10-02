import React, { useState } from 'react';
import {
  User,
  Store,
  Shield,
  Phone,
  CheckCircle2,
  ArrowRight,
  Volume2,
  Lock,
  Globe,
  Wheat,
  Building,
  Check,
  Search,
  LogIn,
  AlertCircle,
  Truck,
  Database,
  Layers,
  FileText,
  Mic,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { Language, OfficerTier, BeneficiaryRecord } from '../../types/pds';
import { OFFICER_PROFILES } from '../../data/mockData';
import { speakAloud } from '../../utils/audioSpeech';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';

interface LoginPageProps {
  onEnterAsGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterAsGuest }) => {
  const {
    language,
    setLanguage,
    t,
    setCurrentRole,
    setCitizenAuth,
    setDealerAuth,
    setOfficerAuth,
    setOfficerTier,
    setDealerShopId,
    beneficiariesList,
    shops,
    activeBeneficiary,
    switchBeneficiary,
    switchDealer,
    districtAuthoritiesList,
    switchDistrictAuthority,
    openVoiceModal,
  } = usePds();

  // Active Login Tab: Citizen, Authority, Dealer
  const [activeTab, setActiveTab] = useState<'citizen' | 'authority' | 'dealer'>('citizen');

  // Citizen Inputs
  const [citizenCardInput, setCitizenCardInput] = useState<string>(activeBeneficiary.rationCardNumber);
  const [citizenPhoneInput, setCitizenPhoneInput] = useState<string>(activeBeneficiary.phoneNumber);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dealer Inputs
  const [selectedShopId, setSelectedShopId] = useState<string>(shops[0]?.id || 'KA-BLR-FPS-104');
  const [dealerPin, setDealerPin] = useState<string>('1040');

  // Authority Inputs (5 Touchpoints)
  const [selectedOfficerTier, setSelectedOfficerTier] = useState<OfficerTier>('dso');

  // Handle Citizen Login
  const handleCitizenLogin = () => {
    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsVerifying(false);
      const cleanCard = citizenCardInput.trim().toUpperCase();
      const cleanPhone = citizenPhoneInput.replace(/\D/g, '');

      const match =
        beneficiariesList.find(
          (b) =>
            b.rationCardNumber.toUpperCase() === cleanCard ||
            (cleanCard.length >= 6 && b.rationCardNumber.toUpperCase().includes(cleanCard))
        ) ||
        beneficiariesList.find(
          (b) => cleanPhone.length >= 5 && b.phoneNumber.replace(/\D/g, '').includes(cleanPhone)
        ) ||
        beneficiariesList[0];

      if (match) {
        switchBeneficiary(match.id);
        setCitizenAuth(true);
        setCurrentRole('citizen');
        speakAloud(
          language === 'kn'
            ? `ಸ್ವಾಗತ ${match.headOfHouseholdKn || match.headOfHousehold}`
            : `Welcome ${match.headOfHousehold}`,
          language
        );
      } else {
        setErrorMessage(
          language === 'kn'
            ? 'ಕೇಂದ್ರೀಯ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ರೇಷನ್ ಕಾರ್ಡ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.'
            : 'No matching record found in Central Database. Please check Ration Card Number.'
        );
      }
    }, 400);
  };

  // Quick Select Preset Beneficiary
  const handleSelectPresetBeneficiary = (record: BeneficiaryRecord) => {
    setCitizenCardInput(record.rationCardNumber);
    setCitizenPhoneInput(record.phoneNumber);
    switchBeneficiary(record.id);
  };

  // Handle Dealer Login
  const handleDealerLogin = () => {
    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (dealerPin.trim() === '1040' || dealerPin.trim() === '1234') {
        switchDealer(selectedShopId);
        setDealerShopId(selectedShopId);
        setDealerAuth(true);
        setCurrentRole('dealer');
        speakAloud(
          language === 'kn'
            ? `ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${selectedShopId} ದೃಢೀಕೃತವಾಗಿದೆ.`
            : `Fair Price Shop ${selectedShopId} authenticated successfully.`,
          language
        );
      } else {
        setErrorMessage(
          language === 'kn'
            ? 'ಅಮಾನ್ಯ ಡೀಲರ್ ಪಿನ್ (ಪ್ರಾಯೋಗಿಕ ಪಿನ್: 1040 ಬಳಸಿ).'
            : 'Invalid Dealer PIN (Use default test PIN: 1040).'
        );
      }
    }, 400);
  };

  // Handle Authority Login
  const handleAuthorityLogin = (tier: OfficerTier) => {
    setSelectedOfficerTier(tier);
    setOfficerTier(tier);
    const authorityProfile = districtAuthoritiesList.find((a) => a.tier === tier);
    if (authorityProfile) {
      switchDistrictAuthority(authorityProfile.id);
    }
    setOfficerAuth(true);
    setCurrentRole('officer');
    speakAloud(
      language === 'kn'
        ? `${OFFICER_PROFILES[tier]?.title} ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ.`
        : `${OFFICER_PROFILES[tier]?.title} logged in successfully.`,
      language
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF6F8] flex flex-col font-serif select-none">
      {/* 1. TOP BRANDING ROW - ROYAL PURPLE (#2C0E38) & GOLD ACCENTS */}
      <div className="bg-[#2C0E38] text-white px-4 sm:px-8 py-3.5 border-b border-[#D4AF37]/40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Emblem Roundel */}
            <div className="w-12 h-12 rounded-full bg-[#481656] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
              <Wheat className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <p className="text-[10px] text-[#FFD700] uppercase font-sans font-bold tracking-wider">
                ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ · Food & Civil Supplies
              </p>
              <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                {language === 'kn'
                  ? 'ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆ · PDS ಡಿಮ್ಯಾಂಡ್ ಸಿಂಕ್'
                  : 'Department of Food, Civil Supplies & Consumer Affairs'}
              </h1>
              <p className="text-[11px] text-purple-200/80 font-sans">
                {language === 'kn'
                  ? 'ಕೇಂದ್ರೀಯ ಗೋದಾಮುಗಳಿಂದ ನಾಗರಿಕರಿಗೆ ಪಾರದರ್ಶಕ ಪಡಿತರ ವಿತರಣಾ ಪೋರ್ಟಲ್'
                  : 'PDS Demand Sync 2.0 · Central FCI Pool to Citizen Supply Chain'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-[#481656] px-2.5 py-1 rounded-sm border border-purple-300/30 text-xs text-purple-100 font-sans">
              <Globe className="w-3.5 h-3.5 text-[#FFD700]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[#FFD700] text-xs font-bold cursor-pointer focus:outline-hidden"
              >
                <option value="kn" className="bg-[#2C0E38] text-[#FFD700]">ಕನ್ನಡ (Kannada)</option>
                <option value="en" className="bg-[#2C0E38] text-[#FFD700]">English</option>
                <option value="hi" className="bg-[#2C0E38] text-[#FFD700]">हिन्दी (Hindi)</option>
                <option value="te" className="bg-[#2C0E38] text-[#FFD700]">తెలుగు (Telugu)</option>
                <option value="ta" className="bg-[#2C0E38] text-[#FFD700]">தமிழ் (Tamil)</option>
              </select>
            </div>

            <button
              onClick={() =>
                speakAloud(
                  language === 'kn'
                    ? 'ನಮಸ್ಕಾರ. ಪಡಿತರ ಚೀಟಿದಾರರು, ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್ ಅಥವಾ ಅಧಿಕೃತ ಲಾಗಿನ್ ಆಯ್ಕೆಮಾಡಿ.'
                    : 'Welcome to Karnataka ePDS. Select Citizen, Dealer, or Authority login to proceed.',
                  language
                )
              }
              className="hidden sm:flex items-center gap-1 bg-[#481656] hover:bg-[#5C1E6E] text-[#FFD700] px-2.5 py-1 rounded-sm border border-[#D4AF37]/50 text-xs font-sans font-bold cursor-pointer transition-colors"
              title="Listen aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.listenAloud || 'Voice Assist'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CENTERED LOGIN CARD */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-purple-100/90 overflow-hidden">
          {/* Card Header with Royal Purple Gradient */}
          <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white p-5 sm:p-6 text-center border-b-2 border-[#D4AF37]/60">
            <span className="inline-block text-[11px] font-sans font-black tracking-widest text-[#FFD700] uppercase bg-[#2C0E38]/80 px-3 py-0.5 rounded-full border border-[#D4AF37]/40 mb-1.5">
              {language === 'kn' ? 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಲಾಗಿನ್' : 'OFFICIAL ACCESS GATEWAY'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {language === 'kn' ? 'PDS ಡಿಮ್ಯಾಂಡ್ ಸಿಂಕ್ ಲಾಗಿನ್' : 'PDS Demand Sync · Secure Sign In'}
            </h2>
            <p className="text-xs text-purple-200 font-sans mt-1">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ'
                : 'Select your role to access food grain entitlements, supply chain, and services'}
            </p>
          </div>

          {/* 3 Role Selection Tabs */}
          <div className="grid grid-cols-3 bg-purple-50/70 border-b border-purple-100 font-sans text-xs">
            <VoiceHoverGuide
              title="Citizen Beneficiary Login"
              description="Access ration pre-booking, check family entitlements, view e-token, and change shop under portability."
              descriptionKn="ಪಡಿತರ ಚೀಟಿದಾರರ ಲಾಗಿನ್: ಮುಂಗಡ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್, ಇ-ಟೋಕನ್ ಮತ್ತು ಕುಟುಂಬ ಕೋಟಾ ಪರಿಶೀಲಿಸಲು ಒತ್ತಿ."
            >
              <button
                onClick={() => {
                  setActiveTab('citizen');
                  setErrorMessage(null);
                }}
                className={`w-full py-3.5 px-2 text-center font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'citizen'
                    ? 'border-[#6B1870] text-[#6B1870] bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-[#6B1870] hover:bg-purple-100/50'
                }`}
              >
                <User className="w-4 h-4 text-[#6B1870]" />
                <span>{language === 'kn' ? '1. ನಾಗರಿಕ ಫಲಾನುಭವಿ' : '1. Citizen Beneficiary'}</span>
              </button>
            </VoiceHoverGuide>

            <VoiceHoverGuide
              title="Supply Authority Login (5 Tiers)"
              description="Access DSO command center, taluk administration, state directors, and food inspectors."
              descriptionKn="ಜಿಲ್ಲಾ ಸರಬರಾಜು ಅಧಿಕಾರಿ, ತಹಶೀಲ್ದಾರ್ ಮತ್ತು ಆಹಾರ ನಿರೀಕ್ಷಕರ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಪ್ರವೇಶಿಸಲು ಒತ್ತಿ."
            >
              <button
                onClick={() => {
                  setActiveTab('authority');
                  setErrorMessage(null);
                }}
                className={`w-full py-3.5 px-2 text-center font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'authority'
                    ? 'border-[#6B1870] text-[#6B1870] bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-[#6B1870] hover:bg-purple-100/50'
                }`}
              >
                <Shield className="w-4 h-4 text-[#6B1870]" />
                <span>{language === 'kn' ? '2. ಸರಬರಾಜು ಪ್ರಾಧಿಕಾರ' : '2. Authority (5 Tiers)'}</span>
              </button>
            </VoiceHoverGuide>

            <VoiceHoverGuide
              title="Fair Price Shop Dealer Login"
              description="Manage depot ePoS terminal, verify wholesale stock receipt, and confirm distribution days to open slot booking."
              descriptionKn="ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್ ಟರ್ಮಿನಲ್: ಧಾನ್ಯ ಸ್ವೀಕೃತಿ ಪರಿಶೀಲಿಸಿ, ವಿತರಣಾ ದಿನಾಂಕ ದೃಢಪಡಿಸಲು ಒತ್ತಿ."
            >
              <button
                onClick={() => {
                  setActiveTab('dealer');
                  setErrorMessage(null);
                }}
                className={`w-full py-3.5 px-2 text-center font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'dealer'
                    ? 'border-[#6B1870] text-[#6B1870] bg-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-[#6B1870] hover:bg-purple-100/50'
                }`}
              >
                <Store className="w-4 h-4 text-[#6B1870]" />
                <span>{language === 'kn' ? '3. ನ್ಯಾಯಬೆಲೆ ಡೀಲರ್' : '3. FPS Dealer'}</span>
              </button>
            </VoiceHoverGuide>
          </div>

          {/* Tab 1: Citizen Beneficiary Login */}
          {activeTab === 'citizen' && (
            <div className="p-5 sm:p-7 space-y-5 font-sans">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
                <Wheat className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  {language === 'kn'
                    ? 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ ಮತ್ತು ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ. ಕೇಂದ್ರೀಯ ಡೇಟಾಬೇಸ್‌ನಿಂದ ನಿಮ್ಮ ಕುಟುಂಬದ ವಿವರಗಳು, ಉಚಿತ ಧಾನ್ಯ ಕೋಟಾ ಮತ್ತು ಮುಂಗಡ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಲಭ್ಯವಾಗುತ್ತದೆ.'
                    : 'Enter your Ration Card Number and Registered Mobile Number to authenticate against the Central ePDS Database. Access your family entitlements and pre-booking slots.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'kn' ? 'ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ (Ration Card Number)' : 'Ration Card Number'}
                    </label>
                    <VoiceHoverGuide
                      title="Speak Ration Card Number"
                      description="Use your voice to dictate your ration card number directly into this field."
                      descriptionKn="ನಿಮ್ಮ ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆಯನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ನಮೂದಿಸಲು ಮೈಕ್ ಒತ್ತಿ."
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openVoiceModal(
                            'Ration Card Number',
                            (text) => setCitizenCardInput(text.replace(/\s+/g, '').toUpperCase()),
                            'KA-BLR-PHH-8829'
                          )
                        }
                        className="text-[11px] text-[#6B1870] hover:text-[#521356] font-bold flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-[#6B1870]" />
                        <span>{language === 'kn' ? 'ಧ್ವನಿ ನೀಡಿ' : 'Voice Input'}</span>
                      </button>
                    </VoiceHoverGuide>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={citizenCardInput}
                      onChange={(e) => setCitizenCardInput(e.target.value)}
                      placeholder="e.g. KA-BLR-PHH-8829"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-purple-200 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-[#6B1870] focus:border-[#6B1870] focus:outline-hidden"
                    />
                    <Wheat className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() =>
                        openVoiceModal(
                          'Ration Card Number',
                          (text) => setCitizenCardInput(text.replace(/\s+/g, '').toUpperCase()),
                          'KA-BLR-PHH-8829'
                        )
                      }
                      title="Dictate Ration Card Number"
                      className="absolute right-2.5 top-2 p-1 text-[#6B1870] hover:bg-purple-50 rounded-lg cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {language === 'kn' ? 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Registered Mobile)' : 'Registered Mobile Number'}
                    </label>
                    <VoiceHoverGuide
                      title="Speak Mobile Number"
                      description="Use your voice to dictate your 10-digit registered mobile number."
                      descriptionKn="ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ನಮೂದಿಸಲು ಮೈಕ್ ಒತ್ತಿ."
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openVoiceModal(
                            'Registered Mobile Number',
                            (text) => setCitizenPhoneInput(text.replace(/\D/g, '')),
                            '9845012345'
                          )
                        }
                        className="text-[11px] text-[#6B1870] hover:text-[#521356] font-bold flex items-center gap-1 cursor-pointer bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition-colors"
                      >
                        <Mic className="w-3.5 h-3.5 text-[#6B1870]" />
                        <span>{language === 'kn' ? 'ಧ್ವನಿ ನೀಡಿ' : 'Voice Input'}</span>
                      </button>
                    </VoiceHoverGuide>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      value={citizenPhoneInput}
                      onChange={(e) => setCitizenPhoneInput(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 border border-purple-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#6B1870] focus:border-[#6B1870] focus:outline-hidden"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() =>
                        openVoiceModal(
                          'Registered Mobile Number',
                          (text) => setCitizenPhoneInput(text.replace(/\D/g, '')),
                          '9845012345'
                        )
                      }
                      title="Dictate Mobile Number"
                      className="absolute right-2.5 top-2 p-1 text-[#6B1870] hover:bg-purple-50 rounded-lg cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Central Database Test Profiles for 1-Click Verification */}
              <div className="border-t border-purple-100 pt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {language === 'kn' ? 'ಕೇಂದ್ರೀಯ ಡೇಟಾಬೇಸ್ ಪ್ರಾಯೋಗಿಕ ಕಾರ್ಡ್‌ಗಳು (1-ಕ್ಲಿಕ್ ಆಯ್ಕೆ):' : 'Central Database Sample Profiles (1-Click Test):'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {beneficiariesList.slice(0, 3).map((ben) => {
                    const isSelected = ben.rationCardNumber === citizenCardInput;
                    return (
                      <button
                        key={ben.id}
                        type="button"
                        onClick={() => handleSelectPresetBeneficiary(ben)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#6B1870] bg-purple-50/80 shadow-xs'
                            : 'border-purple-100 bg-white hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2C0E38] truncate">{ben.headOfHousehold}</span>
                          <span className="text-[10px] text-purple-700 font-mono font-bold">{ben.cardType.split(' ')[0]}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">
                          {ben.district} · {ben.assignedFpsName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Action Button */}
              <button
                type="button"
                onClick={handleCitizenLogin}
                disabled={isVerifying}
                className="w-full py-3 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>{language === 'kn' ? 'ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'Authenticating Central Database...'}</span>
                ) : (
                  <>
                    <span>{language === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ' : 'Authenticate & Enter Citizen Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Tab 2: Authority Login (5 Touchpoints) */}
          {activeTab === 'authority' && (
            <div className="p-5 sm:p-7 space-y-4 font-sans text-xs">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2.5 text-purple-900">
                <Shield className="w-5 h-5 text-[#6B1870] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">5-Touchpoint Public Distribution Administration</p>
                  <p className="text-[11px] text-purple-800 mt-0.5">
                    District Supply Officer (DSO) executes real-time dispatches and inspections. Central FCI, State Leadership, KFCSC Depots, and NIC FIST maintain assigned transparency oversight.
                  </p>
                </div>
              </div>

              {/* 5 Touchpoints Selector Cards */}
              <div className="space-y-2">
                {[
                  {
                    tier: 'fci' as OfficerTier,
                    touchpoint: '1. Central Government Pool',
                    title: 'FCI Regional Office Bengaluru',
                    desc: 'Central pool supplier, releases quotas & orders to Karnataka.',
                    badge: 'Supplier',
                    icon: Layers,
                  },
                  {
                    tier: 'state_secretary' as OfficerTier,
                    touchpoint: '2. State Leadership & Policymakers',
                    title: 'Principal Secretary & Commissioner (F&CS)',
                    desc: 'Manages Anna Bhagya funding, policy, and 31-district quotas.',
                    badge: 'Policy & Quota',
                    icon: Building,
                  },
                  {
                    tier: 'kfcsc_depot' as OfficerTier,
                    touchpoint: '3. State Supply Chain Operators',
                    title: 'KFCSC Managing Director & Depots',
                    desc: 'Wholesale handling, FAQ grain quality testing, electronic scales.',
                    badge: 'Wholesale Hub',
                    icon: Truck,
                  },
                  {
                    tier: 'dso' as OfficerTier,
                    touchpoint: '4. District & Local Administration (Active Command)',
                    title: 'Deputy Commissioner & DSO / Food Inspector',
                    desc: 'Operational command: dispatch approvals, inspections, FPS licensing.',
                    badge: 'Active Command',
                    icon: Shield,
                    isDso: true,
                  },
                  {
                    tier: 'nic_fist' as OfficerTier,
                    touchpoint: '5. Technology Providers (Digital Gatekeepers)',
                    title: 'NIC Karnataka Unit (FIST Software)',
                    desc: 'Digital stock acknowledgments, ePoS audit trail, DBT commissions.',
                    badge: 'Technology',
                    icon: Database,
                  },
                ].map((item) => {
                  const isSelected = selectedOfficerTier === item.tier;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.tier}
                      onClick={() => setSelectedOfficerTier(item.tier)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#6B1870] bg-purple-50/70 shadow-xs ring-1 ring-[#6B1870]'
                          : 'border-purple-100 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          item.isDso ? 'bg-[#6B1870] text-[#FFD700]' : 'bg-purple-100 text-[#6B1870]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-mono font-bold text-slate-500">{item.touchpoint}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              item.isDso ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#2C0E38] truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-600 truncate">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAuthorityLogin(item.tier);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                          item.isDso
                            ? 'bg-[#6B1870] hover:bg-[#57135C] text-white shadow-xs'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {item.isDso ? 'Enter Command' : 'View Scope'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Login Action for selected tier */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleAuthorityLogin(selectedOfficerTier)}
                  className="w-full py-3 bg-[#2C0E38] hover:bg-[#481656] text-[#FFD700] rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Enter as {OFFICER_PROFILES[selectedOfficerTier]?.title || 'Authority'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: FPS Dealer Login */}
          {activeTab === 'dealer' && (
            <div className="p-5 sm:p-7 space-y-4 font-sans text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-emerald-900">
                <Store className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  {language === 'kn'
                    ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಪರವಾನಗಿ ಸಂಖ್ಯೆ ಮತ್ತು ಡೀಲರ್ ಪಿನ್ ಬಳಸಿ ಲಾಗಿನ್ ಮಾಡಿ. ಧಾನ್ಯ ದಾಸ್ತಾನು ಸ್ವೀಕೃತಿ, 15 ದಿನಗಳ ವಿತರಣಾ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಇ-ಪಿಒಎಸ್ ತೂಕ ಯಂತ್ರ ಸಂಪರ್ಕ ಲಭ್ಯವಾಗುತ್ತದೆ.'
                    : 'Licensed Fair Price Shop Dealer Terminal: Verify wholesale stock delivery, broadcast 15-day distribution timetables, and execute biometric ePoS transactions.'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'kn' ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಸಂಖ್ಯೆ (FPS Depot ID)' : 'Select Fair Price Shop (FPS Depot)'}
                  </label>
                  <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#6B1870] focus:border-[#6B1870] focus:outline-hidden bg-white"
                  >
                    {shops.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.id} — {shop.name} ({shop.ward})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'kn' ? 'ಡೀಲರ್ ಸುರಕ್ಷತಾ ಪಿನ್ (4-Digit PIN)' : 'Authorized Dealer PIN (4 Digits)'}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={4}
                      value={dealerPin}
                      onChange={(e) => setDealerPin(e.target.value)}
                      placeholder="1040"
                      className="w-full px-3.5 py-2.5 pl-10 border border-purple-200 rounded-xl text-sm font-mono tracking-widest focus:ring-2 focus:ring-[#6B1870] focus:border-[#6B1870] focus:outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Default demo PIN: <strong className="font-mono text-[#6B1870]">1040</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDealerLogin}
                disabled={isVerifying}
                className="w-full py-3 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>Authenticating Depot Terminal...</span>
                ) : (
                  <>
                    <span>Enter FPS Dealer Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Card Footer: Guest Public Exploration */}
          <div className="p-4 bg-purple-50/50 border-t border-purple-100 flex items-center justify-between text-xs font-sans">
            <span className="text-slate-500">
              {language === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು ಮತ್ತು ಮಾಹಿತಿ:' : 'Public Transparency & Information:'}
            </span>
            <button
              type="button"
              onClick={onEnterAsGuest}
              className="text-[#6B1870] hover:text-[#4A104E] font-bold underline cursor-pointer transition-colors"
            >
              {language === 'kn' ? 'ಲಾಗಿನ್ ಇಲ್ಲದೆ ಸಾರ್ವಜನಿಕ ಸೇವೆ ವೀಕ್ಷಿಸಿ →' : 'Explore Public PDS Services as Guest →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
