import React, { useState } from 'react';
import {
  Wheat,
  User,
  Store,
  Shield,
  Fingerprint,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Globe,
  Lock,
  Check,
  Building,
  Database,
  MapPin,
  Calendar,
  Layers,
  Truck,
  Scale,
  Cpu,
  Award,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { Language, OfficerTier, BeneficiaryRecord } from '../../types/pds';
import { OFFICER_PROFILES } from '../../data/mockData';
import { speakAloud } from '../../utils/audioSpeech';
import { TtdFeatureServiceGrid } from '../common/TtdFeatureServiceGrid';

export const AuthPortal: React.FC = () => {
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
    districtAuthoritiesList,
    shops,
    activeBeneficiary,
    activeDistrictAuthority,
    switchBeneficiary,
    switchDistrictAuthority,
    switchDealer,
    firebaseUser,
    handleGoogleSignIn,
    logout,
    isDbConnected,
    openMapsModal,
  } = usePds();

  // Selected entry point: Option 1 (citizen), Option 2 (authority), Option 3 (dealer)
  const [selectedOption, setSelectedOption] = useState<'citizen' | 'authority' | 'dealer' | null>(null);

  // ----------------------------------------------------
  // OPTION 1: CITIZEN AUTH STATE & VERIFIED WINDOW
  // ----------------------------------------------------
  const [citizenCardInput, setCitizenCardInput] = useState<string>(activeBeneficiary.rationCardNumber);
  const [citizenPhoneInput, setCitizenPhoneInput] = useState<string>(activeBeneficiary.phoneNumber);
  const [verifiedBeneficiary, setVerifiedBeneficiary] = useState<BeneficiaryRecord | null>(null);
  const [citizenAuthError, setCitizenAuthError] = useState<string | null>(null);
  const [isVerifyingCitizen, setIsVerifyingCitizen] = useState(false);

  // ----------------------------------------------------
  // OPTION 2: AUTHORITY AUTH STATE
  // ----------------------------------------------------
  const [selectedAuthorityTier, setSelectedAuthorityTier] = useState<OfficerTier>('dso');
  const [selectedTouchpointFilter, setSelectedTouchpointFilter] = useState<number | 'all'>('all');
  const [authorityLoginId, setAuthorityLoginId] = useState<string>(OFFICER_PROFILES['dso'].loginId);
  const [authorityPasscode, setAuthorityPasscode] = useState<string>(OFFICER_PROFILES['dso'].passcode);
  const [authorityAuthSuccess, setAuthorityAuthSuccess] = useState(false);

  // ----------------------------------------------------
  // OPTION 3: DEALER AUTH STATE
  // ----------------------------------------------------
  const [selectedShopId, setSelectedShopId] = useState<string>(shops[0]?.id || 'KA-BLR-FPS-104');
  const [dealerPhoneInput, setDealerPhoneInput] = useState<string>(shops[0]?.phoneNumber || '+91 94481 22910');
  const [dealerPinInput, setDealerPinInput] = useState<string>('1040');

  // General Notification
  const [authSuccessNotice, setAuthSuccessNotice] = useState<string | null>(null);

  // ----------------------------------------------------
  // 1. CITIZEN HANDLERS: AUTHENTICATE TO CENTRAL DB & SHOW VERIFIED WINDOW
  // ----------------------------------------------------
  const handleSelectPreloadedCitizen = (ben: BeneficiaryRecord) => {
    setCitizenCardInput(ben.rationCardNumber);
    setCitizenPhoneInput(ben.phoneNumber);
    setCitizenAuthError(null);
  };

  const handleVerifyCitizenRecord = () => {
    setIsVerifyingCitizen(true);
    setCitizenAuthError(null);

    setTimeout(() => {
      setIsVerifyingCitizen(false);
      const cleanCard = citizenCardInput.trim().toUpperCase();
      const cleanPhone = citizenPhoneInput.replace(/\D/g, '');

      // Search in central database
      const match =
        beneficiariesList.find(
          (b) =>
            b.rationCardNumber.toUpperCase() === cleanCard ||
            (cleanCard.length >= 6 && b.rationCardNumber.toUpperCase().includes(cleanCard))
        ) ||
        beneficiariesList.find(
          (b) =>
            cleanPhone.length >= 5 && b.phoneNumber.replace(/\D/g, '').includes(cleanPhone)
        ) ||
        beneficiariesList[0];

      if (match) {
        setVerifiedBeneficiary(match);
        switchBeneficiary(match.id);
        speakAloud(
          language === 'kn'
            ? `ಸ್ವಾಗತ ${match.headOfHouseholdKn}! ನಿಮ್ಮ ರೇಷನ್ ಕಾರ್ಡ್ ವಿವರಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.`
            : `Welcome ${match.headOfHousehold}! Your ration card details have been authenticated.`,
          language
        );
      } else {
        setCitizenAuthError('No matching record found in Karnataka ePDS Central Database. Please check Ration Card Number or Phone Number.');
      }
    }, 500);
  };

  const handleProceedToCitizenDashboard = () => {
    if (!verifiedBeneficiary) return;
    setAuthSuccessNotice(
      language === 'kn'
        ? `ಸ್ವಾಗತ ${verifiedBeneficiary.headOfHouseholdKn}! (${verifiedBeneficiary.district}) ರೇಷನ್ ಮುಂಗಡ ಬುಕಿಂಗ್ ಪೋರ್ಟಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ.`
        : `Authenticated as ${verifiedBeneficiary.headOfHousehold} (${verifiedBeneficiary.district}). Opening pre-booking portal.`
    );
    setTimeout(() => {
      setCitizenAuth(true);
      setCurrentRole('citizen');
    }, 500);
  };

  // ----------------------------------------------------
  // 2. AUTHORITY HANDLERS: 5 TOUCHPOINTS AUTHENTICATION
  // ----------------------------------------------------
  const handleSelectAuthority = (tier: OfficerTier) => {
    setSelectedAuthorityTier(tier);
    const p = OFFICER_PROFILES[tier];
    if (p) {
      setAuthorityLoginId(p.loginId);
      setAuthorityPasscode(p.passcode);
    }
  };

  const handleAuthorityLoginConfirm = () => {
    const prof = OFFICER_PROFILES[selectedAuthorityTier];
    setAuthorityAuthSuccess(true);
    setOfficerTier(selectedAuthorityTier);

    if (prof.scopeLevel === 'District' || selectedAuthorityTier === 'dso' || selectedAuthorityTier === 'dc' || selectedAuthorityTier === 'jd_dd') {
      const match = districtAuthoritiesList.find((d) => d.districtName.includes('Bengaluru')) || districtAuthoritiesList[0];
      if (match) switchDistrictAuthority(match.id);
    }

    setAuthSuccessNotice(
      language === 'kn'
        ? `${prof.title} - ಅಧಿಕೃತ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ.`
        : `Authenticated as ${prof.title} (${prof.touchpointName}).`
    );

    setTimeout(() => {
      setOfficerAuth(true);
      setCurrentRole('officer');
    }, 500);
  };

  // ----------------------------------------------------
  // 3. FPS DEALER HANDLERS: AUTHENTICATE TO SHOP
  // ----------------------------------------------------
  const handleDealerLoginConfirm = () => {
    switchDealer(selectedShopId);
    const dealer = shops.find((s) => s.id === selectedShopId) || shops[0];

    setAuthSuccessNotice(
      language === 'kn'
        ? `ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${dealer.shopNumber} (${dealer.district}) ಡೀಲರ್ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ.`
        : `FPS Dealer ${dealer.shopNumber} (${dealer.district}) authenticated with database.`
    );
    setTimeout(() => {
      setDealerAuth(true);
      setCurrentRole('dealer');
    }, 500);
  };

  // Authority profiles grouped by touchpoint
  const authorityTiersList: OfficerTier[] = [
    'central_ministry',
    'fci',
    'sec',
    'comm',
    'kfcsc_md',
    'kfcsc_depot',
    'dc',
    'jd_dd',
    'dso',
    'inspector',
    'nic_fist',
  ];

  const filteredAuthorities = authorityTiersList.filter((tier) => {
    if (selectedTouchpointFilter === 'all') return true;
    return OFFICER_PROFILES[tier]?.touchpoint === selectedTouchpointFilter;
  });

  return (
    <div className="bg-[#FFFDF7] min-h-screen text-[#2A1608] py-6 px-3 sm:px-6 font-serif">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Global Notification Banner */}
        {authSuccessNotice && (
          <div className="bg-[#58080A] text-[#FFD700] border-2 border-[#D4AF37] p-3 text-xs sm:text-sm font-bold flex items-center gap-2 rounded-xs shadow-md">
            <CheckCircle2 className="w-5 h-5 text-[#FFD700] shrink-0" />
            <span>{authSuccessNotice}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* VIEW 1: HOME PAGE WITH FEATURES IN ICONS & 3 LOGINS  */}
        {/* ==================================================== */}
        {!selectedOption ? (
          <div className="space-y-8">
            {/* TTD PORTAL OFFICIAL CALLOUT HEADER */}
            <div className="bg-[#7B1113] border-2 border-[#D4AF37] text-white p-5 rounded-xs shadow-md text-center space-y-2">
              <span className="inline-block bg-[#58080A] text-[#FFD700] border border-[#D4AF37] px-4 py-1 text-[11px] font-sans font-black tracking-widest uppercase rounded-xs">
                {language === 'kn' ? 'ಕರ್ನಾಟಕ ಆಹಾರ ಧಾನ್ಯ ವಿತರಣಾ ಪೋರ್ಟಲ್' : 'KARNATAKA PUBLIC DISTRIBUTION SYSTEM'}
              </span>
              <h2 className="text-xl sm:text-3xl font-black font-serif tracking-tight text-[#FFD700]">
                {language === 'kn'
                  ? 'ಅಧಿಕೃತ ಪಡಿತರ ಸೇವೆಗಳು ಮತ್ತು ಲಾಗಿನ್ ಪೋರ್ಟಲ್'
                  : 'OFFICIAL E-PDS SERVICES & VERIFIED LOGIN PORTAL'}
              </h2>
              <p className="text-xs sm:text-sm text-amber-200 max-w-3xl mx-auto font-sans">
                {language === 'kn'
                  ? 'ನಾಗರಿಕರು, ಆಹಾರ ಇಲಾಖೆ ಅಧಿಕಾರಿಗಳು ಮತ್ತು ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್‌ಗಳಿಗಾಗಿ ಮೀಸಲಾದ ವ್ಯವಸ್ಥೆ. ಕೆಳಗಿನ ಸೇವಾ ಐಕಾನ್‌ಗಳು ಅಥವಾ ಲಾಗಿನ್ ಕಾರ್ಡ್‌ಗಳನ್ನು ಬಳಸಿ.'
                  : 'Official portal for Ration Cardholders, Civil Supplies Authorities across 5 Touchpoints, and Licensed Fair Price Shop Dealers.'}
              </p>
            </div>

            {/* ==================================================== */}
            {/* 3 OFFICIAL TTD LOGIN OPTION CARDS (CITIZEN / AUTHORITY / DEALER) */}
            {/* ==================================================== */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-[#D4AF37] pb-1">
                <h3 className="text-sm sm:text-base font-black font-serif text-[#7B1113] uppercase tracking-wider">
                  {language === 'kn' ? 'ಅಧಿಕೃತ ಲಾಗಿನ್ ವಿಭಾಗಗಳು' : 'CHOOSE OFFICIAL PORTAL TO LOGIN'}
                </h3>
                <span className="text-[11px] text-[#7A5023] font-sans font-bold">
                  {language === 'kn' ? '3 ಪ್ರತ್ಯೇಕ ವಿಭಾಗಗಳು' : '3 Dedicated Entry Points'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* OPTION 1: CITIZEN BENEFICIARY CARD */}
                <div
                  onClick={() => {
                    setSelectedOption('citizen');
                    setVerifiedBeneficiary(null);
                    setCitizenAuthError(null);
                  }}
                  className="bg-[#FFFDF7] hover:bg-[#FFF9E6] border-2 border-[#D4AF37] hover:border-[#7B1113] rounded-xs p-5 cursor-pointer transition-all duration-150 flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EAD5A0] pb-2">
                      <span className="text-[11px] font-sans font-black uppercase text-[#FFD700] bg-[#7B1113] px-2.5 py-0.5 rounded-xs border border-[#D4AF37]">
                        OPTION 1
                      </span>
                      <span className="text-[10px] font-sans font-bold text-[#7B1113]">
                        {beneficiariesList.length} Seeded Accounts
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <User className="w-7 h-7 text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="text-base font-black font-serif text-[#5C080A] group-hover:text-[#7B1113]">
                          1. Citizen Login
                        </h4>
                        <p className="text-xs font-bold text-[#DAA520]">
                          {language === 'kn' ? 'ನಾಗರಿಕ ರೇಷನ್ ಫಲಾನುಭವಿ' : 'Ration Cardholder (AAY / PHH)'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A2609] font-sans leading-relaxed">
                      Authenticate with your <strong>Ration Card Number</strong> & <strong>Registered Mobile</strong> against Karnataka Central ePDS to inspect verified quota and book distribution tokens.
                    </p>

                    <div className="p-2.5 bg-[#FFF8E7] border border-[#D4AF37] rounded-xs text-[11px] text-[#5C080A] font-sans space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Fingerprint className="w-3.5 h-3.5 text-[#7B1113]" />
                        <span>Card & Phone Auth · Pre-Booking · e-Token</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAD5A0] flex items-center justify-between">
                    <span className="text-xs font-bold font-sans text-[#7B1113] uppercase tracking-wider">
                      Open Citizen Portal
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 bg-[#7B1113] group-hover:bg-[#5C080A] text-[#FFD700] text-xs font-bold uppercase rounded-xs border border-[#D4AF37] flex items-center gap-1"
                    >
                      <span>Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                    </button>
                  </div>
                </div>

                {/* OPTION 2: OPERATIONAL AUTHORITY CARD */}
                <div
                  onClick={() => setSelectedOption('authority')}
                  className="bg-[#FFFDF7] hover:bg-[#FFF9E6] border-2 border-[#D4AF37] hover:border-[#7B1113] rounded-xs p-5 cursor-pointer transition-all duration-150 flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EAD5A0] pb-2">
                      <span className="text-[11px] font-sans font-black uppercase text-[#FFD700] bg-[#7B1113] px-2.5 py-0.5 rounded-xs border border-[#D4AF37]">
                        OPTION 2
                      </span>
                      <span className="text-[10px] font-sans font-bold text-[#7B1113]">
                        5 Touchpoints Hierarchy
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Shield className="w-7 h-7 text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="text-base font-black font-serif text-[#5C080A] group-hover:text-[#7B1113]">
                          2. Authority Login
                        </h4>
                        <p className="text-xs font-bold text-[#DAA520]">
                          {language === 'kn' ? 'ಆಹಾರ ಸರಬರಾಜು ಅಧಿಕಾರಿಗಳು' : 'Supply Chain Operational Authorities'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A2609] font-sans leading-relaxed">
                      5-Touchpoint official hierarchy from Central Ministry & FCI to State Leadership, KFCSC Depots, and District Administration (DSO active operational command & live fleet GPS).
                    </p>

                    <div className="p-2.5 bg-[#FFF8E7] border border-[#D4AF37] rounded-xs text-[11px] text-[#5C080A] font-sans space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Layers className="w-3.5 h-3.5 text-[#7B1113]" />
                        <span>Central · State · KFCSC · DSO Control · NIC</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAD5A0] flex items-center justify-between">
                    <span className="text-xs font-bold font-sans text-[#7B1113] uppercase tracking-wider">
                      Open Authority Suite
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 bg-[#7B1113] group-hover:bg-[#5C080A] text-[#FFD700] text-xs font-bold uppercase rounded-xs border border-[#D4AF37] flex items-center gap-1"
                    >
                      <span>Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                    </button>
                  </div>
                </div>

                {/* OPTION 3: FPS DEALER CARD */}
                <div
                  onClick={() => setSelectedOption('dealer')}
                  className="bg-[#FFFDF7] hover:bg-[#FFF9E6] border-2 border-[#D4AF37] hover:border-[#7B1113] rounded-xs p-5 cursor-pointer transition-all duration-150 flex flex-col justify-between shadow-xs hover:shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EAD5A0] pb-2">
                      <span className="text-[11px] font-sans font-black uppercase text-[#FFD700] bg-[#7B1113] px-2.5 py-0.5 rounded-xs border border-[#D4AF37]">
                        OPTION 3
                      </span>
                      <span className="text-[10px] font-sans font-bold text-[#7B1113]">
                        8 Licensed Shops
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        <Store className="w-7 h-7 text-[#FFD700]" />
                      </div>
                      <div>
                        <h4 className="text-base font-black font-serif text-[#5C080A] group-hover:text-[#7B1113]">
                          3. FPS Dealer Login
                        </h4>
                        <p className="text-xs font-bold text-[#DAA520]">
                          {language === 'kn' ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್' : 'Fair Price Shop Operator'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A2609] font-sans leading-relaxed">
                      Authenticate with shop code & PIN. Verify incoming truck receipts, announce statutory 15-day opening timetables, and execute ePoS biometric distributions.
                    </p>

                    <div className="p-2.5 bg-[#FFF8E7] border border-[#D4AF37] rounded-xs text-[11px] text-[#5C080A] font-sans space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Store className="w-3.5 h-3.5 text-[#7B1113]" />
                        <span>ePoS Dispensation · 15-Day Timetable · Receipt Log</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAD5A0] flex items-center justify-between">
                    <span className="text-xs font-bold font-sans text-[#7B1113] uppercase tracking-wider">
                      Open Dealer Depot
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1 bg-[#7B1113] group-hover:bg-[#5C080A] text-[#FFD700] text-xs font-bold uppercase rounded-xs border border-[#D4AF37] flex items-center gap-1"
                    >
                      <span>Proceed</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================== */}
            {/* TTD SIGNATURE FEATURE ICON GRID ("FEATURES IN THE ICONS") */}
            {/* ==================================================== */}
            <div className="pt-2">
              <TtdFeatureServiceGrid />
            </div>

            {/* TTD OFFICIAL FOOTER / HELPDESK BANNER */}
            <div className="bg-[#58080A] border-2 border-[#D4AF37] text-white p-4 rounded-xs text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Wheat className="w-6 h-6 text-[#FFD700] shrink-0" />
                <div>
                  <span className="font-bold text-[#FFD700] block">
                    PUBLIC DISTRIBUTION SYSTEM · FOOD & CIVIL SUPPLIES
                  </span>
                  <span className="text-[11px] text-amber-200">
                    Content Owned, Maintained and Updated by Department of Food, Civil Supplies & Consumer Affairs.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-sans text-[11px] text-amber-200">
                <span>Toll-Free Helpline: <strong>1967</strong></span>
                <span>|</span>
                <span>FIST Portal Version 2026.4</span>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* VIEW 2: DEDICATED OFFICIAL LOGIN VIEW                */
          /* ==================================================== */
          <div className="max-w-4xl mx-auto space-y-6">
            <button
              onClick={() => {
                setSelectedOption(null);
                setVerifiedBeneficiary(null);
                setCitizenAuthError(null);
              }}
              className="inline-flex items-center gap-1.5 bg-[#58080A] hover:bg-[#450406] text-[#FFD700] border border-[#D4AF37] px-3.5 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#FFD700]" />
              <span>Back to Main Portal & Online Services</span>
            </button>

            {/* ---------------------------------------------------- */}
            {/* OPTION 1: CITIZEN BENEFICIARY AUTHENTICATION         */}
            {/* ---------------------------------------------------- */}
            {selectedOption === 'citizen' && (
              <div className="bg-[#FFFDF7] border-4 border-[#7B1113] rounded-xs shadow-xl p-5 sm:p-8 space-y-6">
                {!verifiedBeneficiary ? (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="border-b-2 border-[#D4AF37] pb-4 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0">
                        <User className="w-7 h-7 text-[#FFD700]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-[#7B1113] text-[#FFD700] border border-[#D4AF37] px-2 py-0.5 text-[10px] font-sans font-black uppercase rounded-xs">
                            OPTION 1
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black font-serif text-[#5C080A]">
                            Citizen Beneficiary Authentication
                          </h3>
                        </div>
                        <p className="text-xs text-[#7A5023] font-sans mt-0.5">
                          Enter your Ration Card Number and Registered Phone Number to verify credentials against Karnataka ePDS Central Database.
                        </p>
                      </div>
                    </div>

                    {citizenAuthError && (
                      <div className="p-3 bg-[#FFF3CD] border border-[#7B1113] text-[#7B1113] text-xs font-bold font-sans flex items-center gap-2 rounded-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{citizenAuthError}</span>
                      </div>
                    )}

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                      <div>
                        <label className="text-xs font-bold text-[#5C080A] uppercase tracking-wider block mb-1">
                          Ration Card Number <span className="text-red-700">*</span>
                        </label>
                        <input
                          type="text"
                          value={citizenCardInput}
                          onChange={(e) => setCitizenCardInput(e.target.value)}
                          placeholder="e.g. KA-04-PHH-882941"
                          className="w-full px-3 py-2.5 bg-white border-2 border-[#D4AF37] rounded-xs font-mono text-sm font-bold text-[#2A1608] focus:outline-hidden focus:border-[#7B1113]"
                        />
                        <span className="text-[10px] text-[#7A5023] mt-1 block">
                          Standard Format: KA-[Dist]-PHH/AAY-[ID]
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#5C080A] uppercase tracking-wider block mb-1">
                          Registered Phone Number <span className="text-red-700">*</span>
                        </label>
                        <input
                          type="text"
                          value={citizenPhoneInput}
                          onChange={(e) => setCitizenPhoneInput(e.target.value)}
                          placeholder="e.g. 98450 12345"
                          className="w-full px-3 py-2.5 bg-white border-2 border-[#D4AF37] rounded-xs font-mono text-sm font-bold text-[#2A1608] focus:outline-hidden focus:border-[#7B1113]"
                        />
                        <span className="text-[10px] text-[#7A5023] mt-1 block">
                          Aadhaar-linked Mobile Number for OTP & e-Token SMS
                        </span>
                      </div>
                    </div>

                    {/* 1-Tap Central Database Fill (10 Beneficiaries) */}
                    <div className="p-4 bg-[#FFF8E7] border-2 border-[#D4AF37] rounded-xs space-y-2 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#5C080A] uppercase tracking-wider flex items-center gap-1.5">
                          <Database className="w-3.5 h-3.5 text-[#7B1113]" />
                          <span>1-Tap Fill from Central Database (10 Beneficiaries):</span>
                        </span>
                        <span className="text-[10px] text-[#7A5023]">Select any cardholder to auto-fill</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                        {beneficiariesList.map((ben) => {
                          const isSelected = citizenCardInput === ben.rationCardNumber;
                          return (
                            <button
                              key={ben.id}
                              type="button"
                              onClick={() => handleSelectPreloadedCitizen(ben)}
                              className={`p-2 rounded-xs border text-left transition-all ${
                                isSelected
                                  ? 'border-[#7B1113] bg-[#7B1113] text-[#FFD700]'
                                  : 'border-[#D4AF37] bg-white hover:bg-[#FFF9E6] text-[#2A1608]'
                              }`}
                            >
                              <span className="text-xs font-bold font-serif block truncate">
                                {ben.headOfHousehold.split(' ')[0]}
                              </span>
                              <span className="text-[10px] block truncate opacity-80">
                                {ben.district}
                              </span>
                              <span className="text-[9px] font-mono block truncate opacity-60">
                                {ben.rationCardNumber}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      disabled={isVerifyingCitizen}
                      onClick={handleVerifyCitizenRecord}
                      className="w-full py-3.5 bg-[#7B1113] hover:bg-[#5C080A] text-[#FFD700] border-2 border-[#D4AF37] font-serif font-black text-sm uppercase tracking-widest rounded-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      {isVerifyingCitizen ? (
                        <span>Authenticating with Karnataka Central Database...</span>
                      ) : (
                        <>
                          <Fingerprint className="w-5 h-5 text-[#FFD700]" />
                          <span>AUTHENTICATE & VIEW VERIFIED RECORD</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* ------------------------------------------------ */
                  /* STEP 1B: OFFICIAL BENEFICIARY VERIFIED WINDOW    */
                  /* ------------------------------------------------ */
                  <div className="space-y-6">
                    {/* Status Ribbon */}
                    <div className="bg-[#58080A] border-2 border-[#D4AF37] text-white p-3.5 rounded-xs flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 text-[#FFD700] shrink-0" />
                        <div>
                          <span className="text-[10px] font-sans font-black uppercase text-[#FFD700] tracking-wider block">
                            EPDS CENTRAL DATABASE VERIFIED
                          </span>
                          <h4 className="text-base font-black font-serif text-white">
                            Authenticated Beneficiary Record
                          </h4>
                        </div>
                      </div>
                      <button
                        onClick={() => setVerifiedBeneficiary(null)}
                        className="text-xs font-sans font-bold text-[#FFD700] underline hover:text-white"
                      >
                        Change Citizen
                      </button>
                    </div>

                    {/* Official Certificate Box */}
                    <div className="border-2 border-[#D4AF37] bg-[#FFF8E7] p-5 rounded-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#D4AF37] pb-3">
                        <div>
                          <span className="text-[10px] font-sans uppercase font-bold text-[#7A5023] block">
                            Head of Household:
                          </span>
                          <h3 className="text-xl font-black font-serif text-[#5C080A]">
                            {verifiedBeneficiary.headOfHousehold}
                          </h3>
                          <p className="text-sm font-bold text-[#7B1113]">
                            {verifiedBeneficiary.headOfHouseholdKn}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 font-sans">
                          <span className="px-3 py-1 bg-[#7B1113] text-[#FFD700] border border-[#D4AF37] text-xs font-bold rounded-xs">
                            {verifiedBeneficiary.cardType}
                          </span>
                          <span className="px-3 py-1 bg-white border border-[#D4AF37] text-[#5C080A] text-xs font-bold rounded-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            UIDAI Aadhaar Verified
                          </span>
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
                        <div className="p-2.5 bg-white border border-[#D4AF37] rounded-xs">
                          <span className="text-[#7A5023] block text-[10px] uppercase font-bold">Ration Card No.</span>
                          <span className="font-mono font-bold text-[#5C080A] text-xs mt-0.5 block">
                            {verifiedBeneficiary.rationCardNumber}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white border border-[#D4AF37] rounded-xs">
                          <span className="text-[#7A5023] block text-[10px] uppercase font-bold">Linked Mobile</span>
                          <span className="font-mono font-bold text-[#5C080A] text-xs mt-0.5 block">
                            {verifiedBeneficiary.phoneNumber}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white border border-[#D4AF37] rounded-xs">
                          <span className="text-[#7A5023] block text-[10px] uppercase font-bold">District / Taluk</span>
                          <span className="font-bold text-[#5C080A] text-xs mt-0.5 block">
                            {verifiedBeneficiary.district} · {verifiedBeneficiary.taluk}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white border border-[#D4AF37] rounded-xs">
                          <span className="text-[#7A5023] block text-[10px] uppercase font-bold">Jurisdiction Ward</span>
                          <span className="font-bold text-[#5C080A] text-xs mt-0.5 block">
                            {verifiedBeneficiary.ward}
                          </span>
                        </div>
                      </div>

                      {/* Assigned FPS and Quota Details */}
                      <div className="p-3.5 bg-white border border-[#D4AF37] rounded-xs space-y-2 font-sans">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#5C080A] flex items-center gap-1.5">
                            <Store className="w-4 h-4 text-[#7B1113]" />
                            <span>Assigned Fair Price Shop:</span>
                          </span>
                          <span className="font-mono font-black text-[#7B1113]">
                            {verifiedBeneficiary.assignedFpsId}
                          </span>
                        </div>
                        <p className="text-xs text-[#4A2609]">
                          {verifiedBeneficiary.assignedFpsName}
                        </p>
                        <div className="pt-2 border-t border-[#EAD5A0] flex items-center justify-between text-xs font-bold">
                          <span className="text-[#7A5023]">Monthly Free Grain Entitlement:</span>
                          <span className="text-[#7B1113] font-mono text-sm">
                            {verifiedBeneficiary.totalQuotaKg} kg (Rice, Wheat, Sugar)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proceed Button */}
                    <button
                      onClick={handleProceedToCitizenDashboard}
                      className="w-full py-4 bg-[#7B1113] hover:bg-[#5C080A] text-[#FFD700] border-2 border-[#D4AF37] font-serif font-black text-sm uppercase tracking-widest rounded-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Calendar className="w-5 h-5 text-[#FFD700]" />
                      <span>PROCEED TO PRE-BOOKING & TOKEN MANAGEMENT</span>
                      <ArrowRight className="w-5 h-5 text-[#FFD700]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* OPTION 2: OPERATIONAL AUTHORITY LOGIN                */}
            {/* ---------------------------------------------------- */}
            {selectedOption === 'authority' && (
              <div className="bg-[#FFFDF7] border-4 border-[#7B1113] rounded-xs shadow-xl p-5 sm:p-8 space-y-6">
                <div className="border-b-2 border-[#D4AF37] pb-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0">
                    <Shield className="w-7 h-7 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#7B1113] text-[#FFD700] border border-[#D4AF37] px-2 py-0.5 text-[10px] font-sans font-black uppercase rounded-xs">
                        OPTION 2
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black font-serif text-[#5C080A]">
                        Operational Authority Login (5 Touchpoints)
                      </h3>
                    </div>
                    <p className="text-xs text-[#7A5023] font-sans mt-0.5">
                      Supply chain command hierarchy. DSO provides full active operational control; all other roles provide transparency views with executable touchpoint tasks.
                    </p>
                  </div>
                </div>

                {/* Touchpoint Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FFF8E7] border border-[#D4AF37] rounded-xs font-sans text-xs">
                  <button
                    onClick={() => setSelectedTouchpointFilter('all')}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 'all'
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    All 5 Touchpoints
                  </button>
                  <button
                    onClick={() => setSelectedTouchpointFilter(1)}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 1
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    1. Central & FCI
                  </button>
                  <button
                    onClick={() => setSelectedTouchpointFilter(2)}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 2
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    2. State Policymakers
                  </button>
                  <button
                    onClick={() => setSelectedTouchpointFilter(3)}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 3
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    3. KFCSC Wholesale
                  </button>
                  <button
                    onClick={() => setSelectedTouchpointFilter(4)}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 4
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    4. District (DSO)
                  </button>
                  <button
                    onClick={() => setSelectedTouchpointFilter(5)}
                    className={`px-3 py-1.5 rounded-xs transition-colors font-bold ${
                      selectedTouchpointFilter === 5
                        ? 'bg-[#7B1113] text-[#FFD700]'
                        : 'text-[#5C080A] hover:bg-[#EAD5A0]'
                    }`}
                  >
                    5. NIC FIST
                  </button>
                </div>

                {/* Profiles List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {filteredAuthorities.map((tier) => {
                    const prof = OFFICER_PROFILES[tier];
                    const isSelected = selectedAuthorityTier === tier;
                    const isDso = tier === 'dso';

                    return (
                      <div
                        key={tier}
                        onClick={() => handleSelectAuthority(tier)}
                        className={`p-3 rounded-xs border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'border-[#7B1113] bg-[#FFF8E7]'
                            : 'border-[#D4AF37] bg-white hover:bg-[#FFF9E6]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black font-serif text-[#5C080A]">{prof.title}</span>
                            <span
                              className={`text-[9px] font-sans font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                                isDso
                                  ? 'bg-[#7B1113] text-[#FFD700]'
                                  : 'bg-white text-[#7B1113] border border-[#D4AF37]'
                              }`}
                            >
                              {isDso ? 'Full Control' : 'Transparency View'}
                            </span>
                            <span className="text-[9px] font-mono text-[#7A5023]">
                              Touchpoint {prof.touchpoint}
                            </span>
                          </div>
                          <p className="text-xs font-sans text-[#4A2609]">
                            {prof.name} · {prof.jurisdiction}
                          </p>
                          <p className="text-[11px] font-sans text-[#7A5023] leading-snug">
                            {prof.operationalRole}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center">
                          <input
                            type="radio"
                            name="authority_selection"
                            checked={isSelected}
                            onChange={() => handleSelectAuthority(tier)}
                            className="w-4 h-4 accent-[#7B1113]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit */}
                <button
                  onClick={handleAuthorityLoginConfirm}
                  className="w-full py-3.5 bg-[#7B1113] hover:bg-[#5C080A] text-[#FFD700] border-2 border-[#D4AF37] font-serif font-black text-sm uppercase tracking-widest rounded-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Shield className="w-5 h-5 text-[#FFD700]" />
                  <span>
                    LOGIN AS {OFFICER_PROFILES[selectedAuthorityTier].badgeLabel.toUpperCase()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                </button>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* OPTION 3: FAIR PRICE SHOP DEALER LOGIN               */}
            {/* ---------------------------------------------------- */}
            {selectedOption === 'dealer' && (
              <div className="bg-[#FFFDF7] border-4 border-[#7B1113] rounded-xs shadow-xl p-5 sm:p-8 space-y-6">
                <div className="border-b-2 border-[#D4AF37] pb-4 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center shrink-0">
                    <Store className="w-7 h-7 text-[#FFD700]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#7B1113] text-[#FFD700] border border-[#D4AF37] px-2 py-0.5 text-[10px] font-sans font-black uppercase rounded-xs">
                        OPTION 3
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black font-serif text-[#5C080A]">
                        Fair Price Shop (FPS) Dealer Login
                      </h3>
                    </div>
                    <p className="text-xs text-[#7A5023] font-sans mt-0.5">
                      Select your licensed Fair Price Shop and enter dealer PIN to access ePoS distribution terminal and dispatch logs.
                    </p>
                  </div>
                </div>

                {/* Select Shop */}
                <div className="space-y-4 font-sans">
                  <div>
                    <label className="text-xs font-bold text-[#5C080A] uppercase tracking-wider block mb-1">
                      Select Licensed Fair Price Shop (8 Verified Shops):
                    </label>
                    <select
                      value={selectedShopId}
                      onChange={(e) => {
                        const sid = e.target.value;
                        setSelectedShopId(sid);
                        const sh = shops.find((s) => s.id === sid);
                        if (sh) setDealerPhoneInput(sh.phoneNumber);
                      }}
                      className="w-full px-3 py-2.5 bg-white border-2 border-[#D4AF37] rounded-xs font-mono text-sm font-bold text-[#2A1608] focus:outline-hidden focus:border-[#7B1113]"
                    >
                      {shops.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shopNumber} - {s.dealerName} ({s.ward}, {s.district})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#5C080A] uppercase tracking-wider block mb-1">
                        Dealer Registered Mobile
                      </label>
                      <input
                        type="text"
                        value={dealerPhoneInput}
                        onChange={(e) => setDealerPhoneInput(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border-2 border-[#D4AF37] rounded-xs font-mono text-sm font-bold text-[#2A1608] focus:outline-hidden focus:border-[#7B1113]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C080A] uppercase tracking-wider block mb-1">
                        4-Digit Dealer ePoS PIN
                      </label>
                      <input
                        type="password"
                        value={dealerPinInput}
                        onChange={(e) => setDealerPinInput(e.target.value)}
                        placeholder="PIN: 1040"
                        className="w-full px-3 py-2.5 bg-white border-2 border-[#D4AF37] rounded-xs font-mono text-sm font-bold text-[#2A1608] focus:outline-hidden focus:border-[#7B1113]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleDealerLoginConfirm}
                  className="w-full py-3.5 bg-[#7B1113] hover:bg-[#5C080A] text-[#FFD700] border-2 border-[#D4AF37] font-serif font-black text-sm uppercase tracking-widest rounded-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Store className="w-5 h-5 text-[#FFD700]" />
                  <span>LOGIN TO FAIR PRICE SHOP DEPOT</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
