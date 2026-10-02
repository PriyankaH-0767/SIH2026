import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Smartphone,
  PhoneCall,
  Shield,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronRight,
  X,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { BookingSlot, VirtualToken } from '../../types/pds';

interface IntentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntentBookingModal: React.FC<IntentBookingModalProps> = ({ isOpen, onClose }) => {
  const {
    citizen,
    shops,
    bookingSlots,
    activeToken,
    bookSlot,
    claimGracePassWalkin,
    intentCyclePhase,
    setIntentCyclePhase,
    openFallbackModal,
    t,
  } = usePds();

  const [selectedDate, setSelectedDate] = useState<string>('Day 12 (Thursday)');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('SLOT-104-3'); // default to a green slot
  const [justBookedToken, setJustBookedToken] = useState<VirtualToken | null>(null);
  const [showGraceNotice, setShowGraceNotice] = useState<boolean>(false);

  if (!isOpen) return null;

  // Filter slots for selected date and citizen's assigned shop (or surrounding)
  const currentSlots = bookingSlots.filter(
    (s) => s.fpsId === citizen.assignedFpsId && s.date === selectedDate
  );

  const selectedSlot = bookingSlots.find((s) => s.id === selectedSlotId) || currentSlots[0];

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    const token = bookSlot(selectedSlot.id, 'app');
    setJustBookedToken(token);
  };

  const handleClaimGracePass = () => {
    const graceToken = claimGracePassWalkin();
    setJustBookedToken(graceToken);
    setShowGraceNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1B2A4A] text-white flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E7C7B] flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">
                  5-Day Collection Intent Window (Days 1–5)
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  SIH Innovation
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pre-book collection shift · Balances retail footfall & alerts district warehouse before trucks dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Phase Simulation Selector (Allows Evaluators to test all 3 phases) */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <Layers className="w-4 h-4 text-[#0E7C7B]" />
            <span>Monthly Cycle Phase Simulation:</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setIntentCyclePhase('days_1_5')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                intentCyclePhase === 'days_1_5'
                  ? 'bg-[#0E7C7B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phase 1: Days 1–5 (Citizen Pre-Booking)
            </button>
            <button
              onClick={() => setIntentCyclePhase('days_6_10')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                intentCyclePhase === 'days_6_10'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phase 2: Days 6–10 (KFCSC Logistics Reroute)
            </button>
            <button
              onClick={() => setIntentCyclePhase('days_11_25')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                intentCyclePhase === 'days_11_25'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phase 3: Days 11–25 (Paced Distribution)
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Token Callout if already booked */}
          {(justBookedToken || activeToken) && (
            <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        {justBookedToken?.isGracePass || activeToken?.isGracePass ? '🛡️ Grace Pass Active' : '🎟️ Smart Virtual Token Active'}
                      </span>
                      <span className="text-[11px] font-mono font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                        {justBookedToken?.tokenId || activeToken?.tokenId}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {justBookedToken?.date || activeToken?.date} · {justBookedToken?.timeShift || activeToken?.timeShift}
                    </h4>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-xs text-slate-500 block">Pre-Packaged Quota</span>
                  <span className="text-sm font-extrabold text-[#0E7C7B]">
                    {justBookedToken?.totalGrainKg || activeToken?.totalGrainKg || 26} kg Grains
                  </span>
                </div>
              </div>

              {/* QR Code Payload & SMS snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Digital QR Slip (Scan at FPS Counter)
                  </span>
                  <div className="font-mono text-[11px] text-slate-700 break-all bg-slate-50 p-2 rounded border border-slate-100">
                    {justBookedToken?.qrPayload || activeToken?.qrPayload}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Simulated SMS Text Snippet
                  </span>
                  <p className="text-[11px] text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{justBookedToken?.smsSnippet || activeToken?.smsSnippet}"
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-emerald-200 text-xs text-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    When you arrive, the dealer will provide your pre-packed grains. Complete the mandatory <strong>Aadhaar biometric scan on the official state ePoS machine</strong> to conclude.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Phase 1 Booking Interface */}
          <div className="space-y-5">
            <div>
              <h4 className="font-bold text-slate-900 text-base">
                1. Select Estimated Collection Date
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Pick your preferred day during the distribution window (Days 11–25)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {['Day 12 (Thursday)', 'Day 13 (Friday)', 'Day 14 (Saturday)', 'Day 15 (Sunday)'].map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedDate === date
                        ? 'border-[#0E7C7B] bg-teal-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{date.split(' ')[0]}</span>
                    <span className="text-[11px] text-slate-500">{date.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Slot Balancer (Color Coded 2-Hour Shifts) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900 text-base">
                  2. Dynamic Slot Balancer — Choose 2-Hour Shift
                </h4>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Fast (&lt;5m)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate (15m)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Congested (&gt;30m)
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Capped at 30 beneficiaries per shift based on dealer physical weighing and packaging speed
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSlots.map((slot) => {
                  const isCongested = slot.status === 'red';
                  const isModerate = slot.status === 'yellow';
                  const isSelected = selectedSlotId === slot.id;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-[#0E7C7B] bg-teal-50/50 shadow-md ring-2 ring-[#0E7C7B]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span className="font-bold text-sm text-slate-900">{slot.timeShift}</span>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isCongested
                              ? 'bg-rose-100 text-rose-800'
                              : isModerate
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isCongested ? 'Congested' : isModerate ? 'Moderate' : 'Fast Lane'}
                        </span>
                      </div>

                      {/* Capacity Bar */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Capacity Booked: {slot.bookedCount} / {slot.capacity}</span>
                          <span className="font-semibold text-slate-700">
                            Est. Wait: ~{slot.estimatedWaitMinutes} mins
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isCongested ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Smart Alternative Suggestion if Congested */}
                      {isCongested && slot.alternateFpsSuggested && (
                        <div className="mt-2.5 p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900 flex items-center justify-between">
                          <div>
                            <span className="font-bold block">⚠️ High Line Expected!</span>
                            <span>Suggestion: {slot.alternateFpsSuggested.fpsName} ({slot.alternateFpsSuggested.distanceKm} km away) has only ~{slot.alternateFpsSuggested.waitMinutes}m wait.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Slot Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleConfirmBooking}
                className="w-full sm:flex-1 py-3 px-6 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Lock Intent & Generate Virtual Token</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleClaimGracePass}
                className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                title="If you prefer not to schedule"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Use Grace Pass (Unscheduled Walk-in)</span>
              </button>
            </div>
          </div>

          {/* Grace Pass & Fallback Section */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Grace Pass Rule Card */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                <Shield className="w-4 h-4 text-amber-700" />
                <span>The Inviolable "Grace Pass" Invariant</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                If you miss your pre-booked slot or completely forget to register during the 5-day window, you are <strong>NEVER denied your food grains</strong>. You can walk into your shop at any operating hour with standard Aadhaar biometric verification. The app manages convenience; it does not restrict baseline rights.
              </p>
            </div>

            {/* SMS / USSD / IVR Fallback Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                  <Smartphone className="w-4 h-4 text-[#0E7C7B]" />
                  <span>No Smartphone or Mobile Internet?</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Beneficiaries can book the exact same 2-hour virtual tokens via feature phones using quick USSD codes or automated IVR telephone calls.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => openFallbackModal('ussd')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dial *99*104# (USSD)</span>
                </button>

                <button
                  onClick={() => openFallbackModal('ivr')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Annavani IVR Helpline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
