import React, { useState } from 'react';
import {
  User,
  MapPin,
  Calendar,
  Clock,
  QrCode,
  Wheat,
  Scale,
  CheckCircle2,
  Share2,
  Copy,
  Receipt,
  Building,
  ShieldCheck,
  Phone,
  Radio,
  ArrowRight,
  AlertCircle,
  Users,
  Check,
  ChevronRight,
  Volume2,
  Compass,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { SlotBookingComponent } from './SlotBookingComponent';
import { ChangeShopLocationMap } from './ChangeShopLocationMap';
import { PortabilityChoiceModal } from './PortabilityChoiceModal';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';
import { speakAloud } from '../../utils/audioSpeech';

type CitizenSection =
  | 'overview'
  | 'booking'
  | 'token'
  | 'quota'
  | 'change_shop'
  | 'annavani';

export const CitizenView: React.FC = () => {
  const {
    citizen,
    shops,
    slotBookingState,
    activeToken,
    language,
    t,
    openMapsModal,
    openFallbackModal,
    claimGracePassWalkin,
  } = usePds();

  const [activeSection, setActiveSection] = useState<CitizenSection>('overview');
  const [copiedToken, setCopiedToken] = useState(false);
  const [isPortabilityModalOpen, setIsPortabilityModalOpen] = useState(false);

  // Resolved current shop
  const currentShop =
    shops.find((s) => s.id === (slotBookingState.selectedShop.fpsId || citizen.assignedFpsId)) || shops[0];

  const handleCopyToken = () => {
    if (activeToken) {
      navigator.clipboard?.writeText(activeToken.tokenId);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-3 sm:px-6 space-y-6 font-serif select-none">
      {/* 1. CITIZEN BENEFICIARY AUTHENTICATED PROFILE BANNER */}
      <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-[#D4AF37]/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#3D144A] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
              <User className="w-9 h-9 sm:w-11 sm:h-11 text-[#FFD700]" />
            </div>

            <div className="space-y-1 font-sans">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black bg-[#2C0E38] text-[#FFD700] border border-[#D4AF37]/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {citizen.cardType}
                </span>
                <span className="text-xs text-purple-200">
                  Ward {citizen.ward} · {citizen.district}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white">
                {language === 'kn' ? citizen.headOfHouseholdKn || citizen.headOfHousehold : citizen.headOfHousehold}
              </h2>

              <p className="text-xs text-purple-200 font-mono">
                {t.rationCardNo}: <strong className="text-[#FFD700]">{citizen.rationCardNumber}</strong> · Phone: {citizen.phoneNumber}
              </p>
            </div>
          </div>

          {/* Quota Highlights & Voice Assistance */}
          <div className="flex flex-row md:flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-purple-300/20 pt-3 md:pt-0 md:pl-6 font-sans">
            <div>
              <span className="text-[10px] text-purple-200 uppercase tracking-wider block">
                {language === 'kn' ? 'ಮಾಸಿಕ ಉಚಿತ ಧಾನ್ಯ ಕೋಟಾ' : 'Monthly Entitlement'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-[#FFD700] font-mono">26.00</span>
                <span className="text-xs text-purple-200 font-bold">KG (100% Free)</span>
              </div>
            </div>

            <button
              onClick={() =>
                speakAloud(
                  language === 'kn'
                    ? `ನಮಸ್ಕಾರ ${citizen.headOfHousehold}. ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿ ಸಂಖ್ಯೆ ${citizen.rationCardNumber}. ನಿಮ್ಮ ಮಾಸಿಕ ಕೋಟಾ ಇಪ್ಪತ್ತಾರು ಕೆಜಿ ಧಾನ್ಯ.`
                    : `Welcome ${citizen.headOfHousehold}. Your monthly entitlement is 26 kilograms of food grains at Fair Price Shop ${currentShop.name}.`,
                  language
                )
              }
              className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-[#3D144A] hover:bg-[#5C1E6E] text-[#FFD700] rounded-lg border border-[#D4AF37]/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Readout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. CITIZEN FUNCTIONAL NAVIGATION TILES - ONLY THE 5 REAL CITIZEN ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 font-sans text-xs">
        {[
          {
            key: 'booking' as CitizenSection,
            title: language === 'kn' ? 'ಸ್ಲಾಟ್ ಬುಕಿಂಗ್' : '1. Slot Booking',
            sub: currentShop.distributionStarted
              ? (language === 'kn' ? 'ವಿಂಡೋ ತೆರೆದಿದೆ' : 'Window Open')
              : (language === 'kn' ? 'ಡೀಲರ್ ನಿರೀಕ್ಷೆಯಲ್ಲಿದೆ' : 'Awaiting Dealer'),
            icon: Calendar,
            badge: currentShop.distributionStarted ? 'Live' : undefined,
            guideTitle: 'Slot Booking & Location',
            guideDesc: 'Confirm your registered default shop or choose portability, then book a 2-hour collection time slot to take your digital token.',
            guideDescKn: 'ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ದೃಢಪಡಿಸಿ, 2 ಗಂಟೆಗಳ ಸಮಯದ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ ಡಿಜಿಟಲ್ ಟೋಕನ್ ಪಡೆಯಲು ಒತ್ತಿ.',
          },
          {
            key: 'token' as CitizenSection,
            title: language === 'kn' ? 'ನನ್ನ ಇ-ಟೋಕನ್' : '2. My e-Token',
            sub: activeToken ? 'Token Active' : 'View slip & QR',
            icon: QrCode,
            badge: activeToken ? 'Active' : undefined,
            guideTitle: 'Digital e-Token Slip',
            guideDesc: 'View your official QR code and token number provisioned by DSO demand lock or slot booking to show at the shop counter.',
            guideDescKn: 'ಪಡಿತರ ಅಂಗಡಿಯಲ್ಲಿ ಧಾನ್ಯ ಪಡೆಯಲು ತೋರಿಸಬೇಕಾದ ನಿಮ್ಮ ಅಧಿಕೃತ ಇ-ಟೋಕನ್ ಮತ್ತು ಕ್ಯೂಆರ್ ಕೋಡ್ ನೋಡಲು ಒತ್ತಿ.',
          },
          {
            key: 'quota' as CitizenSection,
            title: language === 'kn' ? 'ಕುಟುಂಬ ಕೋಟಾ' : '3. Family Quota',
            sub: 'Entitlements & members',
            icon: Wheat,
            guideTitle: 'Family Quota & Members',
            guideDesc: 'Check your NFSA monthly entitlement of rice, wheat, and sugar along with registered family members under your ration card.',
            guideDescKn: 'ನಿಮ್ಮ ಪಡಿತರ ಚೀಟಿಯಲ್ಲಿರುವ ಕುಟುಂಬ ಸದಸ್ಯರು ಮತ್ತು ಮಾಸಿಕ ಉಚಿತ ಧಾನ್ಯ ಕೋಟಾ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಒತ್ತಿ.',
          },
          {
            key: 'change_shop' as CitizenSection,
            title: language === 'kn' ? 'ಅಂಗಡಿ ಆಯ್ಕೆ' : '4. Change Shop',
            sub: 'Portability choice',
            icon: Building,
            guideTitle: 'Portability Shop Choice',
            guideDesc: 'Pick any Fair Price Shop within 5 km on the map for temporary monthly portability, or review your previous location history.',
            guideDescKn: '5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಯಾವುದೇ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಯನ್ನು ಈ ತಿಂಗಳಿಗಾಗಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ಆಯ್ಕೆಮಾಡಲು ನಕ್ಷೆ ತೆರೆಯಿರಿ.',
          },
          {
            key: 'annavani' as CitizenSection,
            title: language === 'kn' ? 'ಅನ್ನವಾಣಿ IVR' : '5. IVR / USSD',
            sub: '*99# Phone access',
            icon: Radio,
            guideTitle: 'Annavani IVR & USSD',
            guideDesc: 'Access offline automated voice services and toll-free helpline 1967 to book slots and query quota without internet.',
            guideDescKn: 'ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆ ಕೇವಲ ಫೋನ್ ಕರೆ ಅಥವಾ ಯುಎಸ್‌ಎಸ್‌ಡಿ ಮೂಲಕ ಪಡಿತರ ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ಒತ್ತಿ.',
          },
        ].map((item) => {
          const isSelected = activeSection === item.key;
          const Icon = item.icon;
          return (
            <VoiceHoverGuide
              key={item.key}
              title={item.guideTitle}
              description={item.guideDesc}
              descriptionKn={item.guideDescKn}
            >
              <button
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] sm:min-h-[105px] ${
                  isSelected
                    ? 'border-[#6B1870] bg-white shadow-md ring-2 ring-[#6B1870]'
                    : 'border-purple-100 bg-white hover:border-purple-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#6B1870] text-white' : 'bg-purple-50 text-[#6B1870]'
                  }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  {item.badge && (
                    <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p className={`font-bold text-xs sm:text-sm leading-tight ${isSelected ? 'text-[#6B1870]' : 'text-slate-900'}`}>{item.title}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{item.sub}</p>
                </div>
              </button>
            </VoiceHoverGuide>
          );
        })}
      </div>

      {/* 3. DEDICATED CITIZEN CONTENT PANELS */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-purple-100 font-sans">
        {/* SECTION 1: DUAL-PHASE PRE-BOOKING */}
        {(activeSection === 'overview' || activeSection === 'booking') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                  {language === 'kn' ? 'ದ್ವಿ-ಹಂತದ ಮಾಸಿಕ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್' : 'Dual-Phase Monthly Slot Pre-Booking'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'kn'
                    ? '20-25 ನೇ ತಾರೀಖಿನೊಳಗೆ ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಪಾಳಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಕ್ಯೂ ಇಲ್ಲದೆ ಪಡಿತರ ಪಡೆಯಿರಿ.'
                    : 'Select your preferred collection date and time shift (Days 20–25) to avoid standing in long queues.'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#6B1870] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Current Shop: {currentShop.name}
              </span>
            </div>

            <SlotBookingComponent onNavigateToChangeShop={() => setActiveSection('change_shop')} />
          </div>
        )}

        {/* SECTION 2: MY DIGITAL E-TOKEN SLIP */}
        {activeSection === 'token' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                {language === 'kn' ? 'ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಇ-ಟೋಕನ್ ರಸೀದಿ' : 'Official ePDS Digital e-Token Slip'}
              </h3>
              <p className="text-xs text-slate-500">
                Present this virtual token at the Fair Price Shop ePoS terminal during your assigned shift.
              </p>
            </div>

            {activeToken ? (
              <div className="max-w-md mx-auto bg-gradient-to-b from-purple-50/50 to-white border-2 border-[#6B1870] rounded-2xl p-6 shadow-md text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#6B1870] text-white flex items-center justify-center mx-auto shadow-md">
                  <QrCode className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    VIRTUAL TOKEN NUMBER
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-[#2C0E38]">{activeToken.tokenId}</span>
                    <button
                      onClick={handleCopyToken}
                      className="p-1 rounded text-purple-700 hover:bg-purple-100 cursor-pointer"
                      title="Copy Token"
                    >
                      {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left text-xs bg-white p-4 rounded-xl border border-purple-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned Date</span>
                    <strong className="text-slate-900">{activeToken.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Time Shift</span>
                    <strong className="text-[#6B1870]">{activeToken.timeShift}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Fair Price Shop</span>
                    <strong className="text-slate-900 truncate block">{currentShop.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Status</span>
                    <strong className="text-emerald-700 font-bold capitalize">{activeToken.status}</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-left flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">SMS & WhatsApp Confirmation Delivered</p>
                    <p className="text-[11px] text-emerald-800">
                      Sent to registered mobile {citizen.phoneNumber}. No printout required.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center p-8 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-4">
                <AlertCircle className="w-12 h-12 text-[#6B1870] mx-auto opacity-70" />
                <h4 className="font-bold text-slate-800">No Active Token Generated</h4>
                <p className="text-xs text-slate-600">
                  You have not booked an e-token slot for this month yet. Pre-book your slot to generate an instant e-token slip.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => setActiveSection('booking')}
                    className="px-5 py-2.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Go to Slot Booking
                  </button>
                  <button
                    onClick={() => {
                      claimGracePassWalkin('Immediate need walk-in');
                      setActiveSection('token');
                    }}
                    className="px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Claim Emergency Grace Pass
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: RATION CARD & FAMILY ENTITLEMENT QUOTA */}
        {activeSection === 'quota' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                {language === 'kn' ? 'ಕುಟುಂಬ ಸದಸ್ಯರು ಮತ್ತು ಮಾಸಿಕ ಕೋಟಾ' : 'Family Members & Monthly Grain Quota'}
              </h3>
              <p className="text-xs text-slate-500">
                Official entitlement certified under National Food Security Act (NFSA) and Karnataka Anna Bhagya.
              </p>
            </div>

            {/* Quota Breakdown Table */}
            <div className="border border-purple-100 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2C0E38] text-white font-bold">
                  <tr>
                    <th className="p-3.5">Commodity (ಧಾನ್ಯ)</th>
                    <th className="p-3.5">Monthly Entitlement</th>
                    <th className="p-3.5">Price / KG</th>
                    <th className="p-3.5">Total Cost</th>
                    <th className="p-3.5">Quality Certification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  <tr className="hover:bg-purple-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Fortified Rice (ಅಕ್ಕಿ - ಅನ್ನಭಾಗ್ಯ)</td>
                    <td className="p-3.5 font-mono font-bold text-[#6B1870] text-sm">20.00 KG</td>
                    <td className="p-3.5 text-emerald-700 font-bold">₹0.00 (Free)</td>
                    <td className="p-3.5 font-bold text-slate-800">₹0.00</td>
                    <td className="p-3.5 text-slate-600">Grade-A FAQ Lab Tested</td>
                  </tr>
                  <tr className="hover:bg-purple-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Wheat (ಗೋಧಿ)</td>
                    <td className="p-3.5 font-mono font-bold text-[#6B1870] text-sm">5.00 KG</td>
                    <td className="p-3.5 text-emerald-700 font-bold">₹0.00 (Free)</td>
                    <td className="p-3.5 font-bold text-slate-800">₹0.00</td>
                    <td className="p-3.5 text-slate-600">Standard Sharbati Quality</td>
                  </tr>
                  <tr className="hover:bg-purple-50/50">
                    <td className="p-3.5 font-bold text-slate-900">Sugar (ಸಕ್ಕರೆ)</td>
                    <td className="p-3.5 font-mono font-bold text-[#6B1870] text-sm">1.00 KG</td>
                    <td className="p-3.5 text-slate-700">₹13.50 / KG</td>
                    <td className="p-3.5 font-bold text-slate-800">₹13.50</td>
                    <td className="p-3.5 text-slate-600">Refined White Sugar</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Family Members List */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6B1870]" />
                <span>Registered Family Members (Aadhaar e-KYC Linked)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {citizen.members.map((member, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-purple-100 bg-purple-50/40">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{member.name}</span>
                      <span className="text-[10px] text-purple-700 font-bold">{member.relation}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Age: {member.age} yrs · Aadhaar: {member.aadhaarMasked}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Biometric Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CHANGE DISTRIBUTION SHOP (LOCATION CHOICE & 5 KM MAP ANALYSIS) */}
        {activeSection === 'change_shop' && (
          <ChangeShopLocationMap onNavigateToSlotBooking={() => setActiveSection('booking')} />
        )}

        {/* SECTION 5: NON-SMARTPHONE FALLBACK (IVR / USSD) */}
        {activeSection === 'annavani' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                {language === 'kn' ? 'ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇಲ್ಲದವರಿಗಾಗಿ ಅನ್ನವಾಣಿ IVR & USSD' : 'Annavani Non-Smartphone Access (*99# & IVR)'}
              </h3>
              <p className="text-xs text-slate-500">
                Book ration tokens and check stock without internet on basic feature phones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Phone className="w-5 h-5 text-amber-800" />
                  <span>Annavani IVR Voice Dial-in</span>
                </div>
                <p className="text-xs text-amber-800">
                  Dial <strong>1800-425-9333</strong> or <strong>1967</strong> from your registered SIM. An automated voice prompts you to choose slot time in Kannada, Telugu, Tamil, or Hindi.
                </p>
                <button
                  onClick={() => openFallbackModal('ivr')}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Simulate IVR Call
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                <div className="flex items-center gap-2 text-[#2C0E38] font-bold">
                  <Radio className="w-5 h-5 text-[#6B1870]" />
                  <span>USSD Flash Protocol (*99#)</span>
                </div>
                <p className="text-xs text-purple-900">
                  Dial <strong>*99*51#</strong> on any GSM handset. An instant zero-internet text menu lets you select your distribution date and confirms via SMS.
                </p>
                <button
                  onClick={() => openFallbackModal('ussd')}
                  className="px-4 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Simulate *99# USSD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PORTABILITY CHOICE MODAL WITH 5KM RADIUS OPEN-SOURCE MAP & HISTORY */}
      <PortabilityChoiceModal
        isOpen={isPortabilityModalOpen}
        onClose={() => setIsPortabilityModalOpen(false)}
      />
    </div>
  );
};
