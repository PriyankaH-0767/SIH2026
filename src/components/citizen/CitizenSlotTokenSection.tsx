import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Shield,
  Smartphone,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Printer,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  Users,
  Info,
  Layers,
  FileText,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { BookingSlot, VirtualToken } from '../../types/pds';

export const CitizenSlotTokenSection: React.FC = () => {
  const {
    citizen,
    shops,
    bookingSlots,
    activeToken,
    bookSlot,
    claimGracePassWalkin,
    changeCitizenLocation,
    openFallbackModal,
    t,
  } = usePds();

  const [selectedDate, setSelectedDate] = useState<string>('Day 12 (Thursday)');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('SLOT-104-3');
  const [justBooked, setJustBooked] = useState<boolean>(false);
  const [copiedSms, setCopiedSms] = useState<boolean>(false);
  const [showPrintSlip, setShowPrintSlip] = useState<boolean>(false);
  const [showGraceNotice, setShowGraceNotice] = useState<boolean>(false);

  // Available distribution days
  const distributionDays = [
    'Day 11 (Wednesday)',
    'Day 12 (Thursday)',
    'Day 13 (Friday)',
    'Day 14 (Saturday)',
    'Day 15 (Sunday)',
    'Day 16 (Monday)',
    'Day 17 (Tuesday)',
  ];

  // Current shop slots
  const currentSlots = bookingSlots.filter(
    (s) => s.fpsId === citizen.assignedFpsId && s.date === selectedDate
  );

  const selectedSlot = bookingSlots.find((s) => s.id === selectedSlotId) || currentSlots[0];
  const assignedShop = shops.find((s) => s.id === citizen.assignedFpsId) || shops[0];

  // Alternative nearby shop check
  const altShop = shops.find((s) => s.id !== citizen.assignedFpsId && s.ward === assignedShop.ward);

  const handleConfirm = () => {
    if (!selectedSlot) return;
    bookSlot(selectedSlot.id, 'app');
    setJustBooked(true);
    setTimeout(() => setJustBooked(false), 4000);
  };

  const handleGracePass = () => {
    claimGracePassWalkin();
    setShowGraceNotice(true);
    setTimeout(() => setShowGraceNotice(false), 5000);
  };

  const handleCopySms = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Dynamic Slot Balancer Overview */}
      <div className="bg-gradient-to-r from-[#1B2A4A] via-[#0E7C7B] to-teal-800 text-white rounded-3xl p-6 shadow-md border border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                Dynamic Slot Balancer
              </span>
              <span className="text-xs font-mono text-teal-200">
                Paced Distribution · 25 Citizens / Hr Limit
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Pre-Book Collection Shift & Generate Virtual Token
            </h2>
            <p className="text-xs text-white/80 max-w-2xl mt-1 leading-relaxed">
              Select your preferred day and 2-hour collection shift. The dynamic queue engine paces crowd footfall across the month, eliminating 2–4 hour physical wait queues and ensuring your pre-packaged ration is ready on arrival.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => openFallbackModal('ussd')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4 text-teal-300" />
              <span>USSD Dial (*99*104#)</span>
            </button>
            <button
              onClick={() => openFallbackModal('ivr')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Annavani 1967 IVR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Alert after booking */}
      {justBooked && (
        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-400 flex items-center justify-between text-xs text-emerald-900 font-medium animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Slot confirmed successfully!</strong> Your Virtual Token has been registered and scheduled in the dealer's morning manifest.
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
            VT#{activeToken?.tokenId}
          </span>
        </div>
      )}

      {/* Grace Pass Notice */}
      {showGraceNotice && (
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 flex items-center justify-between text-xs text-amber-950 font-medium animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Emergency Grace Pass Issued:</strong> Statutory NFSA rights are guaranteed. You may walk into {assignedShop.name} any time during distribution hours.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT COLUMN: ACTIVE TOKEN DISPLAY OR BOOKING FORM */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Token Card (if user has a booked token) */}
          {activeToken && (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#0E7C7B] shadow-sm relative overflow-hidden space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0E7C7B] flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7C7B]">
                      Confirmed Ration Token
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Token #{activeToken.tokenId}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    activeToken.isGracePass
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {activeToken.isGracePass ? 'Grace Pass (Walk-in)' : 'Scheduled Fast-Lane'}
                </span>
              </div>

              {/* Token Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Collection Date</span>
                  <span className="font-bold text-slate-900">{activeToken.date}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Window</span>
                  <span className="font-bold text-[#0E7C7B]">{activeToken.timeShift}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pre-Packed Weight</span>
                  <span className="font-extrabold text-slate-900">{activeToken.totalGrainKg} kg Total</span>
                </div>
              </div>

              {/* Depot and Entitlement Breakdown */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0E7C7B]" />
                    <span>{assignedShop.name}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Shop #{assignedShop.id.slice(-3)}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  <strong>Grain Breakdown:</strong> {activeToken.commoditiesSummary}
                </p>
              </div>

              {/* Scannable High-Contrast QR Code Block */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                  {/* Generated High-Contrast Visual QR Code Matrix */}
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-0.5 bg-black rounded">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-white'
                            : 'bg-black'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="text-xs space-y-1 text-center sm:text-left flex-1">
                  <span className="font-bold text-teal-300 block">
                    Show QR Slip to Dealer on Arrival
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Dealer verifies your token on their mobile screen to hand over your pre-packaged bag, then prompts the official NIC ePoS terminal for Aadhaar verification.
                  </p>
                  <span className="text-[10px] font-mono text-slate-400 block pt-1">
                    Payload: {activeToken.qrPayload}
                  </span>
                </div>
              </div>

              {/* Actions: Print Slip & Copy SMS */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => setShowPrintSlip(true)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Paper Voucher</span>
                </button>

                <button
                  onClick={() => handleCopySms(activeToken.smsSnippet)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {copiedSms ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">SMS Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copy Offline SMS Format</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Slot Balancer Selection Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeToken ? 'Reschedule Collection Shift' : 'Select Collection Shift'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fair Price Shop: <strong>{assignedShop.name}</strong>
                </p>
              </div>
              <span className="text-xs font-mono text-[#0E7C7B] font-bold">
                Max 25 Tokens / Hour Cap
              </span>
            </div>

            {/* Step 1: Select Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                1. Select Distribution Day (Days 11–25)
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {distributionDays.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedDate === d
                        ? 'bg-[#0E7C7B] text-white border-[#0E7C7B] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select 2-Hour Shift with Color-Coded Capacity Indicator */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                2. Choose 2-Hour Shift (Dynamic Capacity Balancer)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isFull = slot.bookedCount >= slot.capacity;
                  const congestionColor =
                    slot.status === 'green'
                      ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900'
                      : slot.status === 'yellow'
                      ? 'border-amber-300 bg-amber-50/50 text-amber-900'
                      : 'border-rose-300 bg-rose-50/50 text-rose-900';

                  const badgeColor =
                    slot.status === 'green'
                      ? 'bg-emerald-600 text-white'
                      : slot.status === 'yellow'
                      ? 'bg-amber-600 text-white'
                      : 'bg-rose-600 text-white';

                  const percentage = Math.round((slot.bookedCount / slot.capacity) * 100);

                  return (
                    <div
                      key={slot.id}
                      onClick={() => !isFull && setSelectedSlotId(slot.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#0E7C7B] bg-white ring-2 ring-[#0E7C7B]/20 shadow-md'
                          : `${congestionColor} hover:border-slate-400`
                      } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{slot.timeShift}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {slot.status === 'green'
                            ? 'Fast Lane'
                            : slot.status === 'yellow'
                            ? 'Moderate'
                            : 'Peak Rush'}
                        </span>
                      </div>

                      {/* Capacity Meter Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>Booked:</span>
                          <span className="font-bold">
                            {slot.bookedCount} / {slot.capacity} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              slot.status === 'green'
                                ? 'bg-emerald-500'
                                : slot.status === 'yellow'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 block pt-0.5">
                          Est. Wait Time: <strong>{slot.estimatedWaitMinutes} mins</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Nearby Depot Suggestion (if user selects a congested red slot) */}
            {selectedSlot?.status === 'red' && altShop && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900 block">
                      High Congestion Detected at {assignedShop.name.split('(')[0]}
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Nearby <strong>{altShop.name}</strong> (350m away) has Green slots with zero wait time.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => changeCitizenLocation(altShop.id)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition-colors shrink-0"
                >
                  Switch Shop
                </button>
              </div>
            )}

            {/* Booking Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleConfirm}
                className="w-full sm:flex-1 py-3 px-5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {activeToken ? 'Update Slot & Token' : 'Confirm Shift & Generate Smart Token'}
                </span>
              </button>

              <button
                onClick={handleGracePass}
                className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                title="Under NFSA, walk-ins without booking are never rejected"
              >
                Claim Walk-in Grace Pass
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: RATION PACKAGE BREAKDOWN & ACCESSIBILITY */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Family Entitlement Preview Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Beneficiary Card</span>
                <h4 className="font-bold text-slate-900 text-sm">
                  {citizen.headOfHousehold} · {citizen.cardType}
                </h4>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Ration Card ID:</span>
                <span className="font-mono font-bold text-slate-800">{citizen.rationCardNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Family Members:</span>
                <span className="font-bold text-slate-800">{citizen.members.length} Persons</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Portability Status:</span>
                <span className="font-semibold text-blue-700">ONORC Enabled (All India)</span>
              </div>
            </div>

            {/* Grain Allocations */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Pre-Packaged Family Ration Allocation:
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {citizen.entitlements.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">{item.commodity}</span>
                    <span className="text-base font-extrabold text-[#0E7C7B]">
                      {item.quantity}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">{item.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grace Pass Guarantee Box (Statutory NFSA Invariant) */}
          <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Shield className="w-4 h-4 text-amber-700" />
              <span>The "Grace Pass" Legal Safeguard:</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              If you forget to register during the 5-day intent window, <strong>your statutory food grain right is never denied</strong>. You can walk into {assignedShop.name} on any distribution day and authenticate on the official government ePoS terminal.
            </p>
          </div>

          {/* Rural Connectivity Fallback Channels */}
          <div className="bg-indigo-50/70 rounded-3xl p-5 border border-indigo-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold">
              <Smartphone className="w-4 h-4 text-indigo-700" />
              <span>Offline Feature Phone Support:</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              No internet or smartphone? Dial <strong>*99*104#</strong> on any feature phone or call the <strong>Annavani 1967 toll-free helpline</strong> for multilingual voice booking in Kannada.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => openFallbackModal('ussd')}
                className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-colors text-center"
              >
                Dial *99*104#
              </button>
              <button
                onClick={() => openFallbackModal('ivr')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 text-indigo-900 border border-indigo-300 rounded-lg font-bold text-[11px] transition-colors text-center"
              >
                Call Annavani 1967
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Paper Slip Modal */}
      {showPrintSlip && activeToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-300 shadow-2xl space-y-4 font-mono text-xs">
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Department of Food & Civil Supplies · Public Distribution
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                PDS VIRTUAL DISTRIBUTION VOUCHER
              </h3>
              <span className="text-xs font-bold text-[#0E7C7B]">
                Token #{activeToken.tokenId}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-900">{activeToken.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ration Card:</span>
                <span className="font-bold text-slate-900">{activeToken.rationCardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fair Price Shop:</span>
                <span className="font-bold text-slate-900">{assignedShop.name.split('(')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-bold text-slate-900">{activeToken.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Shift:</span>
                <span className="font-bold text-[#0E7C7B]">{activeToken.timeShift}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">Pre-Packaged Grain:</span>
                <span className="font-black text-slate-900">{activeToken.totalGrainKg} kg Total</span>
              </div>
            </div>

            {/* Visual Barcode Graphic */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="h-10 w-full flex items-center justify-center gap-1">
                {[2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 5, 2, 4, 3, 2, 4, 1, 3, 5, 2].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 h-full"
                    style={{ width: `${w * 2}px` }}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">
                * {activeToken.tokenId} *
              </span>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Present this voucher or your registered SMS at the depot. Final grain issuance requires mandatory biometric authentication on the NIC ePoS terminal.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setShowPrintSlip(false);
                }}
                className="flex-1 py-2.5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Confirm & Print</span>
              </button>

              <button
                onClick={() => setShowPrintSlip(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
