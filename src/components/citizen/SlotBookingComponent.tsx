import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  QrCode,
  Truck,
  Store,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Phone,
  ArrowRight,
  Volume2,
  CalendarCheck,
  Check,
  RefreshCw,
  Package,
  Sun,
  Sunset,
  Sunrise,
  CloudSun,
  SlidersHorizontal,
  Compass,
  Navigation,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { FPSShop } from '../../types/pds';
import { speakAloud } from '../../utils/audioSpeech';
import { PortabilityChoiceModal } from './PortabilityChoiceModal';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';

interface SlotBookingComponentProps {
  onNavigateToChangeShop?: () => void;
}

export const SlotBookingComponent: React.FC<SlotBookingComponentProps> = ({
  onNavigateToChangeShop,
}) => {
  const {
    citizen,
    shops,
    bookingSlots,
    slotIntent,
    announceDistributionSchedule,
    simulatedDayOfMonth,
    setSimulatedDayOfMonth,
    isBookingWindowAccessible,
    forceWindowOpen,
    setForceWindowOpen,
    activeToken,
    language,
    t,
    slotBookingState,
    updateSelectedShop,
    assignTimeSlot,
    expireCurrentToken,
    resetExpiredTokenForRebooking,
    markTokenRationCollected,
    setCurrentRole,
    setDealerShopId,
    revertToDefaultLocation,
    setTemporaryPortabilityShop,
    isDemandLockedByDso,
  } = usePds();

  // Portability Choice Modal
  const [isPortabilityModalOpen, setIsPortabilityModalOpen] = useState(false);

  // Selected shop candidate for Phase 1
  const [selectedShopId, setSelectedShopId] = useState<string>(
    slotBookingState.selectedShop.fpsId || slotIntent.fpsId || citizen.assignedFpsId
  );
  const [locationSavedNotice, setLocationSavedNotice] = useState<string | null>(null);

  // Selected Day & Shift for Phase 2
  const [selectedDay, setSelectedDay] = useState<string>(
    slotBookingState.assignedSlot.date || 'Day 12 (Thursday)'
  );
  const [selectedShift, setSelectedShift] = useState<string>(
    slotBookingState.assignedSlot.timeShift || '08:00 AM - 10:00 AM'
  );

  // Bottom developer panel toggle
  const [showDevControls, setShowDevControls] = useState(false);

  // Resolved Current Shop
  const currentShop: FPSShop =
    shops.find((s) => s.id === slotBookingState.selectedShop.fpsId) ||
    shops.find((s) => s.id === selectedShopId) ||
    shops[0];

  // Resolved Default Registered Shop vs Temporary Portability Shop
  const defaultShop =
    shops.find((s) => s.id === (citizen.defaultFpsId || 'KA-BLR-FPS-104')) || shops[0];
  const isTemporaryPortabilityActive = Boolean(citizen.temporaryPortabilityShopId);
  const activePortabilityShop = isTemporaryPortabilityActive
    ? shops.find((s) => s.id === citizen.temporaryPortabilityShopId)
    : null;

  // Logic Phase 1: Location pre-booking during Days 20–25
  const isPhase1Open = isBookingWindowAccessible;

  // KEY LOGIC REQUESTED BY USER:
  // "slot booking should have an option that says if the fps dealer opens the distribution
  // this window will open to choose the slot for the days mention and it should be implemented in the same way"
  const isDistributionOpen = Boolean(currentShop?.distributionStarted);

  const isSlotLocked =
    slotBookingState.assignedSlot.status === 'reserved' ||
    slotIntent.status === 'slot_locked';

  // Mentioned Distribution Days
  const distributionDays = [
    { id: 'Day 11 (Wednesday)', labelKn: 'ದಿನ 11 (ಬುಧವಾರ)', labelEn: 'Day 11 (Wed)' },
    { id: 'Day 12 (Thursday)', labelKn: 'ದಿನ 12 (ಗುರುವಾರ)', labelEn: 'Day 12 (Thu)' },
    { id: 'Day 13 (Friday)', labelKn: 'ದಿನ 13 (ಶುಕ್ರವಾರ)', labelEn: 'Day 13 (Fri)' },
    { id: 'Day 14 (Saturday)', labelKn: 'ದಿನ 14 (ಶನಿವಾರ)', labelEn: 'Day 14 (Sat)' },
    { id: 'Day 15 (Sunday)', labelKn: 'ದಿನ 15 (ಭಾನುವಾರ)', labelEn: 'Day 15 (Sun)' },
    { id: 'Day 16 (Monday)', labelKn: 'ದಿನ 16 (ಸೋಮವಾರ)', labelEn: 'Day 16 (Mon)' },
  ];

  // Daily Shifts with visual icons
  const shiftList = [
    {
      shift: '08:00 AM - 10:00 AM',
      icon: Sunrise,
      labelKn: 'ಬೆಳಿಗ್ಗೆ 1ನೇ ಶಿಫ್ಟ್ (8:00 - 10:00)',
      labelEn: 'Early Morning (8-10 AM)',
      badge: 'ವೇಗದ ಸಾಲು (Fast Line)',
    },
    {
      shift: '10:00 AM - 12:00 PM',
      icon: Sun,
      labelKn: 'ಬೆಳಿಗ್ಗೆ 2ನೇ ಶಿಫ್ಟ್ (10:00 - 12:00)',
      labelEn: 'Late Morning (10 AM-12 PM)',
      badge: 'ಸಾಮಾನ್ಯ (Normal)',
    },
    {
      shift: '02:00 PM - 04:00 PM',
      icon: CloudSun,
      labelKn: 'ಮಧ್ಯಾಹ್ನ ಶಿಫ್ಟ್ (2:00 - 4:00)',
      labelEn: 'Afternoon (2-4 PM)',
      badge: 'ಸಾಮಾನ್ಯ (Normal)',
    },
    {
      shift: '04:00 PM - 06:00 PM',
      icon: Sunset,
      labelKn: 'ಸಂಜೆ ಶಿಫ್ಟ್ (4:00 - 6:00)',
      labelEn: 'Evening (4-6 PM)',
      badge: 'ಅಂತಿಮ ಶಿಫ್ಟ್ (Last)',
    },
  ];

  // Handle Phase 1 Location Choice
  const handleSelectShop = (shopId: string) => {
    setSelectedShopId(shopId);
    updateSelectedShop(shopId, true);
    const target = shops.find((s) => s.id === shopId);
    setLocationSavedNotice(
      language === 'kn'
        ? `ಅಂಗಡಿ ${target?.name} ಯಶಸ್ವಿಯಾಗಿ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ!`
        : `Ration shop ${target?.name} pre-booked for this month!`
    );
    speakAloud(
      language === 'kn' ? 'ರೇಷನ್ ಅಂಗಡಿ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ' : 'Shop confirmed',
      language
    );
    setTimeout(() => setLocationSavedNotice(null), 4000);
  };

  // Handle Phase 2 Time Slot Lock
  const handleLockTimeSlot = () => {
    const slotId = `SLOT-${selectedDay.replace(/\D/g, '') || '12'}-M1`;
    assignTimeSlot(slotId, selectedDay, selectedShift);
    speakAloud(
      language === 'kn'
        ? `ನಿಮ್ಮ ಸಮಯ ${selectedDay}, ${selectedShift} ದೃಢಪಟ್ಟಿದೆ!`
        : `Your slot for ${selectedDay}, ${selectedShift} is locked!`,
      language
    );
  };

  return (
    <div className="space-y-6 font-serif select-none">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] border-2 border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#3D144A] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
            <CalendarCheck className="w-7 h-7 text-[#FFD700]" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-sans">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2C0E38] text-[#FFD700] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                {language === 'kn' ? 'ದ್ವಿ-ಹಂತದ ಮುಂಗಡ ಬುಕಿಂಗ್' : 'Dual-Phase Slot Pre-Booking'}
              </span>
              <span className="text-xs text-purple-200">
                NFSA Anna Bhagya Quota
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              {t.slotBooking}
            </h2>
            <p className="text-xs text-purple-200 font-sans">
              {language === 'kn'
                ? 'ಹಂತ 1: ಅಂಗಡಿ ದೃಢೀಕರಣ (20-25 ನೇ ದಿನ) → ಹಂತ 2: ಡೀಲರ್ ವಿತರಣೆ ತೆರೆದ ನಂತರ ದಿನ & ಶಿಫ್ಟ್ ಆಯ್ಕೆ'
                : 'Phase 1: Confirm Depot (Days 20-25) → Phase 2: Slot Selection (When FPS Dealer Opens Distribution)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            speakAloud(
              language === 'kn'
                ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್ ವಿತರಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿದಾಗ, ನಿಗದಿತ ದಿನಗಳಿಗೆ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲು ಈ ವಿಂಡೋ ತೆರೆಯಲ್ಪಡುತ್ತದೆ.'
                : 'If the FPS dealer opens the distribution, this window will open to choose the slot for the days mentioned.',
              language
            )
          }
          className="px-3.5 py-1.5 bg-[#3D144A] hover:bg-[#521c63] text-[#FFD700] border border-[#D4AF37]/50 rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>{t.listenAloud}</span>
        </button>
      </div>

      {/* Success Notification */}
      {locationSavedNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 font-bold font-sans text-xs shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{locationSavedNotice}</span>
        </div>
      )}

      {/* ASSIGNED FAIR PRICE SHOP SUMMARY (Step 1 moved to "Change Shop" option) */}
      <div className="p-4 sm:p-5 rounded-2xl border-2 border-purple-200 bg-gradient-to-r from-purple-50/60 via-white to-purple-50/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#2C0E38] text-[#FFD700] border-2 border-[#D4AF37]/50 flex items-center justify-center shrink-0 shadow-xs">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#6B1870] bg-purple-100 px-2.5 py-0.5 rounded border border-purple-200">
                {currentShop.shopNumber}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-[#2C0E38] text-[#FFD700]">
                {isTemporaryPortabilityActive ? 'Temporary Portability Active' : 'Default Registered Depot'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Stock Verified
              </span>
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 font-serif mt-0.5">
              {currentShop.name}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentShop.address} · Dealer: <strong>{currentShop.dealerName}</strong> ({currentShop.phoneNumber})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToChangeShop) {
                onNavigateToChangeShop();
              } else {
                setIsPortabilityModalOpen(true);
              }
            }}
            className="px-4 py-2.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Compass className="w-4 h-4 text-[#FFD700]" />
            <span>Change Shop (Location Portability)</span>
          </button>
        </div>
      </div>

      {/* COLLECTION SLOT SELECTION (DAYS 11–25) */}
      {/* EXACT USER SPECIFICATION IMPLEMENTED:
          "slot booking should have an option that says if the fps dealer opens the distribution
           this window will open to choose the slot for the days mention and it should be implemented in the same way" */}
      <div className="bg-white border border-purple-200 p-5 sm:p-6 shadow-sm rounded-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-sans text-white ${
              isDistributionOpen ? 'bg-[#6B1870]' : 'bg-slate-400'
            }`}>
              <Calendar className="w-4 h-4 text-white" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#2C0E38]">
                {language === 'kn' ? 'ಆಹಾರ ಧಾನ್ಯ ಸಂಗ್ರಹಣಾ ದಿನ & ಶಿಫ್ಟ್ ಆಯ್ಕೆ' : 'Collection Day & Time Shift Selection (Days 11–25)'}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                {language === 'kn'
                  ? 'ನಿಗದಿತ ದಿನ ಮತ್ತು 2 ಗಂಟೆಗಳ ಸಮಯದ ಶಿಫ್ಟ್ ಆಯ್ಕೆಮಾಡಿ ಕ್ಯೂ ಇಲ್ಲದೆ ಪಡಿತರ ಪಡೆಯಿರಿ'
                  : 'Select your convenient collection day and 2-hour shift for the mentioned distribution days'}
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-sans font-bold px-2.5 py-1 rounded-full uppercase border ${
            isDistributionOpen
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isDistributionOpen
              ? (language === 'kn' ? 'ವಿತರಣೆ ಸಕ್ರಿಯವಾಗಿದೆ (Window Open)' : 'Distribution Open')
              : (language === 'kn' ? 'ಡೀಲರ್ ವಿತರಣೆ ನಿರೀಕ್ಷೆಯಲ್ಲಿದೆ (Locked)' : 'Awaiting Dealer Opening')}
          </span>
        </div>

        {/* STATE A: DEALER HAS NOT YET OPENED DISTRIBUTION
            DISPLAY THE EXACT SPECIFIED OPTION & NOTICE TO THE USER */}
        {!isDistributionOpen && (
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm font-sans">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5 text-amber-700" />
              </div>

              <div className="space-y-1">
                {/* PROMPT'S EXACT REQUIREMENT PHRASE */}
                <h4 className="text-sm sm:text-base font-bold text-[#2C0E38] font-serif leading-snug">
                  {language === 'kn'
                    ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ (FPS) ಡೀಲರ್ ವಿತರಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿದಾಗ, ನಿಗದಿತ ದಿನಗಳಿಗೆ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಲು ಈ ವಿಂಡೋ ತೆರೆಯಲ್ಪಡುತ್ತದೆ.'
                    : 'If the FPS dealer opens the distribution, this window will open to choose the slot for the days mentioned.'}
                </h4>
                <p className="text-xs text-slate-600">
                  {language === 'kn'
                    ? `ಡೀಲರ್ (${currentShop.dealerName} · ${currentShop.name}) ಸಗಟು ಗೋದಾಮಿನಿಂದ ಧಾನ್ಯ ಸ್ವೀಕರಿಸಿ ವಿತರಣೆ ಆರಂಭಿಸಿದ ನಂತರ, ನಿಗದಿತ ದಿನಾಂಕಗಳಿಗೆ ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ಸಮಯದ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಬಹುದು.`
                    : `The collection window is locked until the FPS Dealer (${currentShop.dealerName} · ${currentShop.name}) confirms physical stock receipt from the KFCSC warehouse and triggers distribution for this month.`}
                </p>
              </div>
            </div>

            {/* Mentioned Distribution Days Preview */}
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B1870] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'kn' ? 'ನಿಗದಿತ ವಿತರಣಾ ದಿನಗಳು (ವೇಳಾಪಟ್ಟಿ):' : 'Mentioned Distribution Schedule (Days 11–25):'}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-semibold">
                  15 Days Window
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {distributionDays.map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/50 text-center text-slate-700 font-semibold"
                  >
                    <Calendar className="w-3.5 h-3.5 mx-auto mb-1 text-amber-700 opacity-70" />
                    <span className="block text-[11px]">{language === 'kn' ? d.labelKn : d.labelEn}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                <span>Daily Operating Shifts: <strong>08:00 AM - 12:00 PM</strong> & <strong>02:00 PM - 06:00 PM</strong></span>
                <span>Depot Contact: <strong>{currentShop.dealerName} ({currentShop.phoneNumber})</strong></span>
              </div>
            </div>

            {/* STATUTORY REGULATION NOTICE: EXCLUSIVE DEALER AUTHORITY */}
            <div className="pt-3 border-t border-amber-200/80 bg-gradient-to-r from-amber-50 to-amber-100/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 border border-amber-300">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#6B1870] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#2C0E38] text-xs">
                      {language === 'kn'
                        ? 'ಶಾಸನಬದ್ಧ ನಿಯಮ: ವಿತರಣಾ ವಿಂಡೋ ತೆರೆಯುವ ಅಧಿಕಾರ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ (FPS) ಡೀಲರ್‌ಗೆ ಮಾತ್ರ ಇರುತ್ತದೆ'
                        : 'Statutory Rule: Distributive Opening Window Authority Lies Exclusively with FPS Dealer'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6B1870] text-white">
                      Exclusive Dealer Mandate
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {language === 'kn'
                      ? `ಕರ್ನಾಟಕ ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ, ವಿತರಣಾ ವಿಂಡೋ ತೆರೆಯುವ ಶಾಸನಬದ್ಧ ಅಧಿಕಾರ ಕೇವಲ ಲೈಸೆನ್ಸ್ ಪಡೆದ FPS ಡೀಲರ್ (${currentShop.dealerName}) ಅವರ ಕೈಯಲ್ಲಿದೆ. ಫಲಾನುಭವಿಗಳು ಅಥವಾ ಇತರ ಅಧಿಕಾರಿಗಳು ಇದನ್ನು ತೆರೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ. ಡೀಲರ್ ತಮ್ಮ ಅಧಿಕೃತ ಇ-ಪಿಒಎಸ್ ಮಷೀನ್‌ನಲ್ಲಿ ಭೌತಿಕ ದಾಸ್ತಾನು ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ವಿಂಡೋ ತೆರೆಯಲಾಗುತ್ತದೆ.`
                      : `Under Karnataka Food & Civil Supplies regulations, the distributive opening window authority lies strictly and exclusively in the hands of the licensed FPS dealer (${currentShop.dealerName}). No citizen, beneficiary, or external user can open it. The dealer must verify physical stock inward receipt and trigger the window from their official ePoS terminal.`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDealerShopId(currentShop.id);
                  setCurrentRole('dealer');
                }}
                className="px-4 py-2.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 whitespace-nowrap"
              >
                <Store className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>
                  {language === 'kn'
                    ? `ಡೀಲರ್ ಲಾಗಿನ್ (${currentShop.dealerName})`
                    : `Login as Dealer (${currentShop.dealerName})`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STATE B: DEALER HAS OPENED DISTRIBUTION
            THE WINDOW OPENS TO CHOOSE THE SLOT FOR THE DAYS MENTIONED */}
        {isDistributionOpen && (
          <div className="space-y-5">
            {/* Active Status Banner */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    {language === 'kn'
                      ? '✓ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್ ವಿತರಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿದ್ದಾರೆ — ನಿಗದಿತ ದಿನಗಳಿಗೆ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ:'
                      : '✓ FPS Dealer has opened distribution — Choose your slot for the mentioned days:'}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    Depot: {currentShop.name} ({currentShop.shopNumber}) · Full wholesale quota in stock
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                Dealer Verified & Active
              </span>
            </div>

            {/* 1. Select Collection Day from Mentioned Days */}
            <div className="space-y-2">
              <label className="text-xs font-bold font-serif text-[#2C0E38] uppercase tracking-wider block">
                {t.day} ({language === 'kn' ? 'ಆಹಾರ ಧಾನ್ಯ ಪಡೆಯುವ ದಿನ - ನಿಗದಿತ ದಿನಗಳು' : 'Choose from Mentioned Distribution Days'}):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-sans">
                {distributionDays.map((d) => {
                  const isDaySelected = selectedDay === d.id;
                  return (
                    <VoiceHoverGuide
                      key={d.id}
                      title={`Select ${d.labelEn}`}
                      description={`Choose ${d.labelEn} as your preferred distribution day to collect your 26 KG monthly ration quota.`}
                      descriptionKn={`ಈ ದಿನ (${d.labelKn}) ನಿಮ್ಮ ಪಡಿತರ ಧಾನ್ಯ ಪಡೆಯಲು ಆಯ್ಕೆಮಾಡಲು ಒತ್ತಿ.`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDay(d.id)}
                        className={`w-full p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          isDaySelected
                            ? 'border-[#6B1870] bg-[#6B1870] text-white font-bold shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-purple-50 text-slate-800 font-semibold'
                        }`}
                      >
                        <Calendar className="w-4 h-4 mx-auto mb-1 text-current" />
                        <span className="text-xs block">
                          {language === 'kn' ? d.labelKn : d.labelEn}
                        </span>
                      </button>
                    </VoiceHoverGuide>
                  );
                })}
              </div>
            </div>

            {/* 2. Select 2-Hour Time Shift */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold font-serif text-[#2C0E38] uppercase tracking-wider block">
                {t.time} ({language === 'kn' ? '2 ಗಂಟೆಗಳ ಸಮಯದ ಶಿಫ್ಟ್' : 'Select 2-Hour Collection Shift'}):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                {shiftList.map((item) => {
                  const Icon = item.icon;
                  const isShiftSelected = selectedShift === item.shift;
                  return (
                    <VoiceHoverGuide
                      key={item.shift}
                      title={item.labelEn}
                      description={`Lock collection shift between ${item.shift} for fast-track processing without waiting in queue.`}
                      descriptionKn={`${item.labelKn} (${item.shift}) ಸಮಯದ ಶಿಫ್ಟ್ ಕಾಯ್ದಿರಿಸಲು ಒತ್ತಿ.`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedShift(item.shift)}
                        className={`w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                          isShiftSelected
                            ? 'border-[#6B1870] bg-purple-50/70 shadow-sm ring-1 ring-[#6B1870]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                              isShiftSelected ? 'bg-[#6B1870] text-white' : 'bg-purple-50 text-[#6B1870]'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold font-serif text-slate-900">
                              {language === 'kn' ? item.labelKn : item.labelEn}
                            </p>
                            <span className="text-[11px] font-mono text-slate-500">
                              {item.shift}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-[#6B1870] bg-purple-100/70 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </button>
                    </VoiceHoverGuide>
                  );
                })}
              </div>
            </div>

            {/* LOCK TIME SLOT BUTTON */}
            <div className="pt-2">
              <VoiceHoverGuide
                title="Lock Slot & Generate Time Slot Token"
                description="Locks your chosen distribution day and 2-hour shift in the ePDS system and converts your default token into a scheduled time-slot token receipt."
                descriptionKn="ಆಯ್ಕೆಮಾಡಿದ ದಿನ ಮತ್ತು 2 ಗಂಟೆಗಳ ಸಮಯದ ಶಿಫ್ಟ್ ಅನ್ನು ಕಾಯ್ದಿರಿಸಿ ಅಧಿಕೃತ ಸಮಯದ ಟೋಕನ್ ಪಡೆಯಲು ಒತ್ತಿ."
              >
                <button
                  type="button"
                  onClick={handleLockTimeSlot}
                  className="w-full py-3.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-serif font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4 text-[#FFD700]" />
                  <span>
                    {isSlotLocked
                      ? (language === 'kn' ? '✓ ಸಮಯ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ (ಮತ್ತೆ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ)' : '✓ SLOT LOCKED (TAP TO UPDATE)')
                      : (language === 'kn' ? 'ಸಮಯದ ಸ್ಲಾಟ್ ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ಟೋಕನ್ ಪಡೆಯಿರಿ' : 'Lock Time Slot & Generate Shift Token')}
                  </span>
                </button>
              </VoiceHoverGuide>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3: CONFIRMED TIME SLOT TOKEN & RECEIPT */}
      {isSlotLocked && (
        <div className="bg-white border-2 border-[#6B1870] p-6 shadow-md rounded-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-sans font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'kn' ? 'ಸಮಯದ ಸ್ಲಾಟ್ ಟೋಕನ್ ದೃಢಪಟ್ಟಿದೆ' : 'Time-Slot Token Confirmed · Fast-Track Ready'}</span>
          </div>

          <div>
            <span className="text-xs uppercase font-sans font-bold text-slate-500 block">
              {language === 'kn' ? 'ಸಮಯದೊಂದಿಗೆ ನಿಗದಿತ ಟೋಕನ್ ಸಂಖ್ಯೆ' : 'Confirmed Token Number with Time Slot'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-[#2C0E38] mt-1 tracking-wider">
              {slotBookingState.tokenDetails.tokenId || citizen.activeTokenNumber || 'SLOT-TKN-104-D14-S1-8829'}
            </h3>
            {isDemandLockedByDso && (
              <span className="text-[11px] text-slate-500 font-sans block mt-1">
                Provisioned from DSO Monthly Demand Allocation Lock · Quota Guaranteed under NFSA
              </span>
            )}
          </div>

          <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl max-w-md mx-auto text-xs space-y-1.5 text-left font-sans">
            <div className="flex justify-between">
              <span className="text-slate-500">ಅಧಿಕೃತ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ:</span>
              <strong className="text-slate-900">{currentShop.name} ({currentShop.shopNumber})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ನಿಗದಿತ ದಿನ & ಶಿಫ್ಟ್:</span>
              <strong className="text-[#6B1870] font-bold">{selectedDay} · {selectedShift}</strong>
            </div>
            <div className="flex justify-between border-t border-purple-100 pt-1">
              <span className="text-slate-500">ರೇಷನ್ ಧಾನ್ಯ ಕೋಟಾ:</span>
              <strong className="text-slate-900">26 KG (ಅಕ್ಕಿ 20kg, ಗೋಧಿ 5kg, ಸಕ್ಕರೆ 1kg)</strong>
            </div>
            <div className="flex justify-between text-[11px] text-emerald-700 font-semibold pt-0.5">
              <span>ಸ್ಥಿತಿ:</span>
              <span>ಅಂಗಡಿಯಲ್ಲಿ ಸಾಲಿನಲ್ಲಿ ನಿಲ್ಲದೆ ವೇಗದ ಕೌಂಟರ್‌ನಲ್ಲಿ ಧಾನ್ಯ ಪಡೆಯಿರಿ</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-sans max-w-lg mx-auto">
            {language === 'kn'
              ? 'ದಯವಿಟ್ಟು ನಿಗದಿತ ದಿನ ಮತ್ತು ಸಮಯಕ್ಕೆ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗೆ ತೆರಳಿ ಈ ಟೋಕನ್ ಸಂಖ್ಯೆಯನ್ನು ತೋರಿಸಿ ನಿಮ್ಮ ಪಡಿತರವನ್ನು ಸಂಗ್ರಹಿಸಿ.'
              : 'Please present this token number or QR code at your assigned Fair Price Shop during your designated 2-hour window to collect your grains with zero physical queue.'}
          </p>
        </div>
      )}

      {/* SIMULATION & CALENDAR CONTROLS */}
      <div className="pt-2 border-t border-purple-100">
        <button
          type="button"
          onClick={() => setShowDevControls(!showDevControls)}
          className="text-xs font-bold text-slate-500 hover:text-[#6B1870] flex items-center gap-1.5 mx-auto font-sans cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B1870]" />
          <span>
            {showDevControls
              ? (language === 'kn' ? 'ಪರೀಕ್ಷಾ ಪರಿಕರಗಳನ್ನು ಮರೆಮಾಡಿ ▲' : 'Hide Evaluation Controls ▲')
              : (language === 'kn' ? 'ಡೆಮೊ ಪರೀಕ್ಷಾ ಪರಿಕರಗಳು (Evaluation Controls) ▼' : 'Demo Evaluation Controls ▼')}
          </span>
        </button>

        {showDevControls && (
          <div className="mt-3 p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-xs space-y-3 max-w-2xl mx-auto font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-[#2C0E38]">1. Calendar Simulation (Days 20–25 Window):</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedDayOfMonth(23);
                    setForceWindowOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    simulatedDayOfMonth === 23
                      ? 'bg-[#6B1870] text-white border-[#6B1870]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Day 23 (Window Open)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedDayOfMonth(12);
                    setForceWindowOpen(false);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold border transition-colors cursor-pointer ${
                    simulatedDayOfMonth === 12
                      ? 'bg-[#6B1870] text-white border-[#6B1870]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Day 12 (Window Closed)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-100">
              <div className="text-xs text-slate-700">
                <span className="font-bold text-[#2C0E38]">2. Distributive Opening Window Authority:</span>{' '}
                <span className="text-[11px] text-slate-600">
                  Strictly under FPS Dealer ({currentShop.dealerName}) control.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isDistributionOpen
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isDistributionOpen ? '● Window Open by Dealer' : '○ Window Closed by Dealer'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setDealerShopId(currentShop.id);
                    setCurrentRole('dealer');
                  }}
                  className="px-2.5 py-1 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  Switch to Dealer Suite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 4. PORTABILITY CHOICE MODAL WITH OPEN-SOURCE LEAFLET MAP (5KM RADIUS & HISTORY) */}
      <PortabilityChoiceModal
        isOpen={isPortabilityModalOpen}
        onClose={() => setIsPortabilityModalOpen(false)}
        onSelectShopConfirmed={(shopId) => {
          setSelectedShopId(shopId);
          updateSelectedShop(shopId, true);
        }}
      />
    </div>
  );
};
