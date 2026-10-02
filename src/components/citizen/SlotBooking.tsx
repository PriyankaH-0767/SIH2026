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
  Smartphone,
  Phone,
  ArrowRight,
  Info,
  Sparkles,
  Users,
  Package,
  CalendarCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { FPSShop } from '../../types/pds';

export const SlotBooking: React.FC = () => {
  const {
    citizen,
    shops,
    bookingSlots,
    slotIntent,
    saveLocationIntent,
    announceDistributionSchedule,
    saveSlotIntent,
    simulateMissedSlot,
    resetSlotForRebooking,
    collectRationWithToken,
    simulatedDayOfMonth,
    setSimulatedDayOfMonth,
    isBookingWindowAccessible,
    forceWindowOpen,
    setForceWindowOpen,
    virtualTokens,
    activeToken,
    t,
    slotBookingState,
    updateSelectedShop,
    assignTimeSlot,
    expireCurrentToken,
    checkTokenExpiration,
    resetExpiredTokenForRebooking,
    markTokenRationCollected,
  } = usePds();

  // Active step in the slot booking workflow
  // 1: Location Pre-Booking (FPS Selection)
  // 2: Wholesale Dispatch & Dealer Announcement
  // 3: Time Slot Selection & System Lock
  // 4: Locked Token & Lifecycle Management (Missed Slot / Re-booking / Collection)
  const [selectedFpsId, setSelectedFpsId] = useState<string>(slotIntent.fpsId || citizen.assignedFpsId);
  const [selectedDay, setSelectedDay] = useState<string>('Day 12 (Thursday)');
  const [selectedShift, setSelectedShift] = useState<string>('08:00 AM - 10:00 AM');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [locationSuccessNotice, setLocationSuccessNotice] = useState<string | null>(null);
  const [showSimulateScheduleForm, setShowSimulateScheduleForm] = useState(false);
  const [customDays, setCustomDays] = useState('15');
  const [copiedToken, setCopiedToken] = useState(false);

  // Selected shop
  const currentShop: FPSShop =
    shops.find((s) => s.id === (slotIntent.fpsId || selectedFpsId)) ||
    shops.find((s) => s.id === citizen.assignedFpsId) ||
    shops[0];

  // Default card shop
  const defaultCardShop =
    shops.find((s) => s.id === 'KA-BLR-FPS-104') || shops[0];

  const hasCustomPreBooking = slotIntent.isLocationPreBooked;
  const isDealerAnnounced = !!currentShop.distributionSchedule?.announced;
  const isSlotLocked = slotIntent.status === 'slot_locked';
  const isMissedExpired = slotIntent.status === 'missed_expired';
  const isCollected = slotIntent.status === 'collected' || citizen.currentCycleCollected;

  // Available distribution days
  const distributionDays = [
    'Day 11 (Wednesday)',
    'Day 12 (Thursday)',
    'Day 13 (Friday)',
    'Day 14 (Saturday)',
    'Day 15 (Sunday)',
    'Day 16 (Monday)',
    'Day 17 (Tuesday)',
    'Day 18 (Wednesday)',
  ];

  // Current shop slots for selected day
  const shopSlots = bookingSlots.filter(
    (s) => s.fpsId === currentShop.id && s.date === selectedDay
  );

  // Fallback shifts if specific date doesn't match mock slot
  const defaultShifts = currentShop.distributionSchedule?.dailyShifts || [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const handleConfirmLocation = (explicitChoice: boolean) => {
    updateSelectedShop(selectedFpsId, explicitChoice);
    const target = shops.find((s) => s.id === selectedFpsId);
    setLocationSuccessNotice(
      explicitChoice
        ? `Successfully pre-booked ${target?.name} for next month's distribution cycle.`
        : `Confirmed default ration card depot (${defaultCardShop.name}).`
    );
    setTimeout(() => setLocationSuccessNotice(null), 4000);
  };

  const handleSimulateDealerAnnouncement = () => {
    announceDistributionSchedule(currentShop.id, {
      announced: true,
      totalDays: parseInt(customDays) || 15,
      distributionDaysLabel: `Day 11 to Day ${10 + (parseInt(customDays) || 15)} (${customDays} Distribution Days)`,
      operatingHours: '08:00 AM - 12:00 PM & 02:00 PM - 06:00 PM',
      dailyShifts: defaultShifts,
      stockReceivedConfirmed: true,
      quotaAllocatedKg: 14200,
      announcementNotice: `Wholesale buffer stock received and verified at Depot. Paced distribution begins on schedule. Pre-book your 2-hour shift.`,
    });
    setShowSimulateScheduleForm(false);
  };

  const handleLockSlot = () => {
    const matchedSlot = shopSlots.find((s) => s.timeShift === selectedShift) || shopSlots[0];
    const slotIdToLock = matchedSlot ? matchedSlot.id : `SLOT-${currentShop.shopNumber.replace('Shop #', '')}-${Date.now().toString().slice(-4)}`;
    
    assignTimeSlot(slotIdToLock, selectedDay, selectedShift);
  };

  const handleSimulateMissed = () => {
    expireCurrentToken('Beneficiary was unable to attend during scheduled 08:00 - 10:00 AM window');
  };

  const handleStartFreshRebooking = () => {
    resetExpiredTokenForRebooking();
  };

  const handleSimulateCollection = () => {
    markTokenRationCollected();
  };

  const currentLockedToken =
    virtualTokens.find((t) => t.tokenId === slotIntent.tokenId) ||
    activeToken ||
    virtualTokens[0];

  // Inaccessible Window View (Outside 20-25th of month)
  if (!isBookingWindowAccessible) {
    return (
      <div className="space-y-6">
        {/* Date Simulation Bar */}
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600 font-medium">Calendar Simulation Controller:</span>
            <span className="font-bold text-slate-800">
              Current Date: Day {simulatedDayOfMonth} of Month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatedDayOfMonth(23)}
              className="px-3 py-1 bg-[#0E7C7B] text-white rounded-lg font-bold hover:bg-[#0c6b6a] transition-all"
            >
              Simulate Day 23 (Open Window: 20–25th)
            </button>
            <button
              onClick={() => setForceWindowOpen(true)}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-all"
            >
              Force Window Open
            </button>
          </div>
        </div>

        {/* Locked Access Notice */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-xs space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Window Currently Inactive (Outside 20–25th)
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Monthly Slot Booking Window is Closed
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In accordance with Karnataka PDS regulations, grassroots location pre-booking and time-slot selection is <strong>strictly active between the 20th and 25th of each month</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Next Booking Cycle:</strong> Opens on the 20th at 00:00 IST and auto-locks on the 25th at 23:59 IST.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Store className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Default Allocation:</strong> If no pre-booking is submitted during the window, your ration card default depot (<strong>{citizen.assignedFpsName}</strong>) is automatically used.
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setSimulatedDayOfMonth(23)}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0E7C7B] text-white font-bold rounded-xl text-sm hover:bg-[#0c6b6a] shadow-xs"
            >
              Open Slot Booking Window (Simulate Day 23)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 20-25th Window Active Status Banner */}
      <div className="bg-gradient-to-r from-[#0E7C7B]/10 via-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#0E7C7B] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ● 20th–25th Window Active
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                Simulated Day: {simulatedDayOfMonth}th of Month
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
              PDS Citizen Slot Booking & Location Pre-Booking
            </h2>
            <p className="text-xs text-slate-600">
              Select your FPS depot for next month, view dealer announcement, and lock your 2-hour collection time slot.
            </p>
          </div>
        </div>

        {/* Date Simulation Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs">
            <span className="px-2 text-slate-500 font-medium">Day:</span>
            <button
              onClick={() => setSimulatedDayOfMonth(23)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                simulatedDayOfMonth === 23
                  ? 'bg-[#0E7C7B] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Day 23 (Open)
            </button>
            <button
              onClick={() => setSimulatedDayOfMonth(12)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                simulatedDayOfMonth === 12
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Day 12 (Locked)
            </button>
          </div>
        </div>
      </div>

      {/* Progress Stepper Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            hasCustomPreBooking || slotIntent.status !== 'location_prebooked'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-white border-[#0E7C7B] ring-2 ring-[#0E7C7B]/20 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase text-slate-500">Step 1</span>
            <MapPin className="w-3.5 h-3.5 text-[#0E7C7B]" />
          </div>
          <div className="font-bold text-xs">Location Pre-Booking</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {hasCustomPreBooking ? 'Pre-booked Depot' : 'Card Default Set'}
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            isDealerAnnounced
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase text-slate-500">Step 2</span>
            <Truck className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="font-bold text-xs">Dealer Intake & Notice</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isDealerAnnounced ? '15 Days Announced' : 'Pending Intake'}
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            isSlotLocked
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : isMissedExpired
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase text-slate-500">Step 3</span>
            <Clock className="w-3.5 h-3.5 text-[#0E7C7B]" />
          </div>
          <div className="font-bold text-xs">Time Slot Booking</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isSlotLocked
              ? 'Temporarily Locked'
              : isMissedExpired
              ? 'Missed · Rebook'
              : 'Select Free Time'}
          </div>
        </div>

        <div
          className={`p-3.5 rounded-xl border transition-all ${
            isCollected
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : isSlotLocked
              ? 'bg-white border-slate-300 text-slate-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[10px] uppercase text-slate-500">Step 4</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="font-bold text-xs">Depot Handover</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isCollected ? 'Ration Collected' : 'Hold till arrival'}
          </div>
        </div>
      </div>

      {/* Missed Slot Alert Banner (if citizen missed their previous slot) */}
      {isMissedExpired && (
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 text-amber-950 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                  Shift Expired Without Arrival
                </span>
                <span className="text-xs font-mono text-amber-800">
                  Previous Token #{slotIntent.tokenId} Invalidated
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-amber-950">
                Your Ration Entitlement is 100% Safeguarded under NFSA!
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                You did not check in during your previous scheduled time slot. Per statutory policy, your turn is <strong>never cancelled</strong>. The previous expired token has been invalidated. Please choose a fresh time slot from the remaining distribution dates below.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleStartFreshRebooking}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Book Fresh Time Slot Now</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Location Pre-Booking (FPS Selection for Next Month) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#0E7C7B] text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Book Fair Price Shop Location for Next Month ({slotIntent.targetMonth})
              </h3>
              <p className="text-xs text-slate-500">
                Choose where you want your monthly grains allocated. If no change is made, your ration card address is kept as default.
              </p>
            </div>
          </div>

          <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 self-start sm:self-auto">
            Target Month: {slotIntent.targetMonth}
          </div>
        </div>

        {/* Current Location Selection Status Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0E7C7B] shrink-0 mt-0.5">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {currentShop.name}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {currentShop.shopNumber}
                </span>
                {hasCustomPreBooking ? (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Pre-Booked Choice
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                    Default Card Address
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{currentShop.address}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dealer: <strong>{currentShop.dealerName}</strong> ({currentShop.phoneNumber}) · Ward: {currentShop.ward}
              </p>
            </div>
          </div>

          <div className="text-xs shrink-0 self-end sm:self-center text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Intent Status</span>
            <span className="font-bold text-emerald-700">
              {hasCustomPreBooking ? 'Custom Depot Locked' : 'Card Address Confirmed (Default)'}
            </span>
          </div>
        </div>

        {locationSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{locationSuccessNotice}</span>
          </div>
        )}

        {/* Change / Select Shop Section */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-700 block">
            Change or Pre-Book Different FPS Depot in Bengaluru Urban (ONORC Portability):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shops.map((s) => {
              const isSelected = selectedFpsId === s.id;
              const isCardDefault = s.id === 'KA-BLR-FPS-104';

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedFpsId(s.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0E7C7B] bg-[#0E7C7B]/5 ring-1 ring-[#0E7C7B]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        {isCardDefault && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.address}</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {s.shopNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span>Dealer: {s.dealerName}</span>
                    <span className="text-[#0E7C7B] font-bold">
                      {isSelected ? '✓ Selected' : 'Tap to select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-500">
              *If you do not change anything, your registered card address depot is automatically locked.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedFpsId('KA-BLR-FPS-104');
                  handleConfirmLocation(false);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Use Card Default (Shop #104)
              </button>
              <button
                onClick={() => handleConfirmLocation(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Pre-Booked Location</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 2: Wholesale Dispatch & Dealer Announcement */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Wholesale Dispatch & Dealer Stock Intake Notification
              </h3>
              <p className="text-xs text-slate-500">
                Visible for beneficiaries who selected {currentShop.name} (either by pre-booking or default card address).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isDealerAnnounced ? (
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stock Received & Schedule Announced</span>
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending Dealer Stock Announcement</span>
              </span>
            )}
          </div>
        </div>

        {/* Dealer Announcement Details */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Depot Dealer: {currentShop.dealerName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {currentShop.shopNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {currentShop.distributionSchedule?.announcementNotice ||
                    'Wholesale truck dispatches verified from Yeshwanthpur Godown. Stock accepted and digital POS synced.'}
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-600 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Intake Confirmation</span>
              <span className="font-bold text-emerald-700">14,200 kg Grains Accepted</span>
            </div>
          </div>

          {/* Schedule specifics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">
                Distribution Days
              </span>
              <span className="font-extrabold text-slate-900 text-sm">
                {currentShop.distributionSchedule?.distributionDaysLabel || 'Day 11 to Day 25 (15 Days)'}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                Active for your card
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">
                Daily Operating Hours
              </span>
              <span className="font-extrabold text-slate-900 text-sm">
                {currentShop.distributionSchedule?.operatingHours || '08:00 AM - 12:00 PM & 02:00 PM - 06:00 PM'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Morning & Afternoon Shifts</span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] font-bold block uppercase">
                2-Hour Token Capacity
              </span>
              <span className="font-extrabold text-[#0E7C7B] text-sm">
                25 Beneficiaries / Hour
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Physical wait capped &lt; 5 mins</span>
            </div>
          </div>

          {/* Simulate Announcement button if not announced or for testing */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80">
            <span className="text-[11px] text-slate-500">
              Notification automatically dispatched to all registered beneficiaries of {currentShop.shopNumber}.
            </span>
            <button
              onClick={() => setShowSimulateScheduleForm(!showSimulateScheduleForm)}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 underline flex items-center gap-1"
            >
              <span>{showSimulateScheduleForm ? 'Close Simulation' : 'Adjust / Test Dealer Announcement'}</span>
            </button>
          </div>

          {showSimulateScheduleForm && (
            <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-3 mt-2">
              <h5 className="font-bold text-xs text-slate-900">
                Dealer Distribution Announcement Form:
              </h5>
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-600">Distribution Duration (Days):</label>
                <input
                  type="number"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  min="5"
                  max="25"
                  className="w-20 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                />
              </div>
              <button
                onClick={handleSimulateDealerAnnouncement}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Broadcast Announcement & Open Time Slot Window
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3: Time Slot Booking Window (Locked Temporarily in System) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Time Slot Booking Window (Select When You Are Free)
              </h3>
              <p className="text-xs text-slate-500">
                Your selected shift is temporarily locked in the system till you collect the ration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSlotLocked ? (
              <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full flex items-center gap-1.5 border border-emerald-300">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Slot Temporarily Locked in Store</span>
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-[#0E7C7B] rounded-full flex items-center gap-1.5 border border-teal-200">
                <Unlock className="w-3.5 h-3.5" />
                <span>Window Open · Select Time Shift</span>
              </span>
            )}
          </div>
        </div>

        {/* Day Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>1. Select Collection Date ({currentShop.distributionSchedule?.distributionDaysLabel || 'Days 11–25'}):</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {distributionDays.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  disabled={isSlotLocked}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-[#0E7C7B] text-white shadow-xs'
                      : isSlotLocked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Hour Time Shift Selector with Capacity Indicators */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>2. Select 2-Hour Time Shift:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {defaultShifts.map((shift, idx) => {
              const isSelected = selectedShift === shift;
              // Mock congestion indicator
              const congestion =
                idx === 0
                  ? { status: 'green', label: 'Fast Lane (<50%)', wait: '3 mins', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
                  : idx === 1
                  ? { status: 'yellow', label: 'Moderate (65%)', wait: '6 mins', color: 'text-amber-700 bg-amber-50 border-amber-200' }
                  : idx === 2
                  ? { status: 'green', label: 'Fast Lane (<40%)', wait: '2 mins', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
                  : { status: 'red', label: 'Peak Rush (88%)', wait: '11 mins', color: 'text-rose-700 bg-rose-50 border-rose-200' };

              return (
                <div
                  key={shift}
                  onClick={() => {
                    if (!isSlotLocked) {
                      setSelectedShift(shift);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0E7C7B] bg-[#0E7C7B]/5 ring-2 ring-[#0E7C7B] shadow-xs'
                      : isSlotLocked
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-900">{shift}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${congestion.color}`}>
                        {congestion.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Est. Queue Wait: <strong>{congestion.wait}</strong>
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Cap: 25/hr</span>
                    <span className="text-xs font-bold text-[#0E7C7B]">
                      {isSelected ? '✓ Selected' : 'Choose Shift'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lock / Unlock Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {isSlotLocked ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>
                  Currently locked for {slotIntent.date} · {slotIntent.timeShift} at {currentShop.shopNumber}.
                </span>
              </span>
            ) : (
              <span>
                Shift is held in memory. Click below to commit temporary lock to the PdsContext store.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {!isSlotLocked ? (
              <button
                onClick={handleLockSlot}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Lock Time Slot in System</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartFreshRebooking}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Slot</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STEP 4: Locked Virtual Token & Turn Safety Lifecycle */}
      {isSlotLocked && (
        <div className="bg-white rounded-2xl p-5 border-2 border-emerald-400 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Active Token #{slotIntent.tokenId}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">
                    Locked at {slotIntent.lockedAt}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                  Your Slot is Temporarily Locked in the System
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(slotIntent.tokenId || '');
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 2000);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{copiedToken ? 'Copied!' : 'Copy Token'}</span>
              </button>
            </div>
          </div>

          {/* Voucher Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Beneficiary Name
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {citizen.headOfHousehold} ({citizen.headOfHouseholdKn})
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Card #{citizen.rationCardNumber} · {citizen.cardType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Scheduled Depot
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {currentShop.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {currentShop.address}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Locked Shift
                  </span>
                  <span className="font-extrabold text-[#0E7C7B] text-sm">
                    {slotIntent.date}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {slotIntent.timeShift}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Pre-Packaged Grain Quota
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    26.0 kg Total
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    20kg Rice, 5kg Wheat, 1kg Sugar
                  </span>
                </div>
              </div>

              {/* Monthly Cycle & Token Expiration Metadata */}
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200 bg-slate-100/70 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Monthly Cycle & Window
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    {slotBookingState.cycleMonth} · Days 11–25
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    {slotBookingState.selectedShop.isCustomPreBooked ? 'Pre-Booked FPS Depot' : 'Default Card Address Depot'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold block uppercase">
                    Token Expiration Logic
                  </span>
                  <span className="font-bold text-amber-700 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Expires: {slotBookingState.tokenDetails.expiresAt || `${slotIntent.date}, End of Shift`}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Statutory Rule: Turn protected if expired
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Locked in System:</strong> Your bag allocation is pre-tagged. Bring any family Aadhaar for contactless biometric ePoS verification.
                </span>
              </div>
            </div>

            {/* Scannable QR & SMS preview */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-32 h-32 bg-white p-2 rounded-xl border border-slate-300 shadow-2xs flex flex-col items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
                <span className="text-[9px] font-mono text-slate-400 font-bold">
                  {slotIntent.tokenId}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Scan at Fair Price Shop terminal upon arrival
              </span>
            </div>
          </div>

          {/* Statutory Turn Protection & Missed Slot Simulation */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    Statutory Rule (NFSA Section 3 Safeguard):
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Turn Never Cancelled
                  </span>
                </div>
                <p className="text-slate-600 text-xs">
                  If you are unable to arrive during this time shift, your food grain entitlement is <strong>never revoked</strong>. The system will prompt you to pick a fresh time slot, invalidate this token, and lock a new slot.
                </p>
              </div>

              {/* Action Buttons to Test Lifecycle */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={handleSimulateMissed}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Simulates citizen not showing up during the slot"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Simulate Missed Slot</span>
                </button>
                <button
                  onClick={handleSimulateCollection}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simulate Depot Collection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Completed Banner */}
      {isCollected && (
        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-emerald-950">
                Monthly Ration Successfully Collected!
              </h4>
              <p className="text-xs text-emerald-800">
                26 kg grains collected at {currentShop.name} via ePoS Biometric verification. System temporary lock released.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SlotBookingComponent } from './SlotBookingComponent';
