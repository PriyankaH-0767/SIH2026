import React, { useState } from 'react';
import {
  X,
  Phone,
  Smartphone,
  PhoneCall,
  Volume2,
  CheckCircle2,
  Send,
  ArrowRight,
  Hash,
  RotateCcw,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';

export const FallbackChannelModal: React.FC = () => {
  const {
    fallbackModalOpen,
    setFallbackModalOpen,
    fallbackChannel,
    setFallbackChannel,
    bookSlot,
    bookingSlots,
    citizen,
  } = usePds();

  // USSD state
  const [ussdStep, setUssdStep] = useState<number>(1); // 1: dialed, 2: menu, 3: slot pick, 4: confirmed
  const [ussdDialedNumber, setUssdDialedNumber] = useState<string>('*99*104#');
  const [ussdInput, setUssdInput] = useState<string>('');
  const [ussdMessage, setUssdMessage] = useState<string>('');

  // IVR call state
  const [ivrCallState, setIvrCallState] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [ivrStep, setIvrStep] = useState<number>(1);
  const [ivrLanguage, setIvrLanguage] = useState<'kn' | 'en'>('kn');

  if (!fallbackModalOpen) return null;

  const handleUssdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ussdStep === 1) {
      if (ussdDialedNumber.includes('*99')) {
        setUssdStep(2);
      }
    } else if (ussdStep === 2) {
      if (ussdInput === '1') {
        // Book token
        setUssdStep(3);
        setUssdInput('');
      } else if (ussdInput === '2') {
        setUssdMessage(`ePDS: Quota for ${citizen.rationCardNumber}: 20kg Rice, 5kg Wheat, 1kg Sugar at Shop #104.`);
        setUssdStep(4);
      } else if (ussdInput === '3') {
        setUssdMessage(`ePDS: Grace Pass active. Walk into Shop #104 anytime with Aadhaar.`);
        setUssdStep(4);
      }
    } else if (ussdStep === 3) {
      // Picked slot 1, 2, or 3
      const targetSlot = bookingSlots[0];
      bookSlot(targetSlot.id, 'ussd');
      setUssdMessage(`ePDS: Token confirmed for Shop #104! Shift: 08:00-10:00 AM. Total: 26kg grains. SMS dispatched.`);
      setUssdStep(4);
    }
  };

  const handleStartIvr = () => {
    setIvrCallState('calling');
    setTimeout(() => {
      setIvrCallState('connected');
    }, 1500);
  };

  const handleIvrDigit = (digit: string) => {
    if (digit === '1') {
      const targetSlot = bookingSlots[0];
      bookSlot(targetSlot.id, 'ivr_annavani');
      setIvrStep(2);
      setTimeout(() => {
        setIvrCallState('completed');
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1B2A4A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-400">
              {fallbackChannel === 'ussd' ? <Smartphone className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold">
                {fallbackChannel === 'ussd'
                  ? 'USSD Feature Phone Simulator (*99*104#)'
                  : 'Annavani Toll-Free IVR Phone Call'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Inclusive accessibility fallback for non-smartphone beneficiaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFallbackChannel(fallbackChannel === 'ussd' ? 'ivr' : 'ussd')}
              className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 transition-colors"
            >
              Switch to {fallbackChannel === 'ussd' ? 'IVR Call' : 'USSD'}
            </button>
            <button
              onClick={() => setFallbackModalOpen(false)}
              className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
          {/* ======================================================== */}
          {/* USSD Channel Mode */}
          {/* ======================================================== */}
          {fallbackChannel === 'ussd' && (
            <div className="max-w-sm mx-auto bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border-4 border-slate-700 space-y-4">
              {/* Feature Phone Screen */}
              <div className="bg-[#1A3326] text-emerald-300 font-mono p-4 rounded-xl border-2 border-emerald-900/50 min-h-[190px] flex flex-col justify-between text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-emerald-500 border-b border-emerald-800/40 pb-1 mb-2">
                    <span>Aadhaar-ePDS GSM</span>
                    <span>100% Signal</span>
                  </div>

                  {ussdStep === 1 && (
                    <div className="space-y-2">
                      <p className="text-emerald-200 font-bold">Karnataka ePDS USSD Service</p>
                      <p className="text-[11px] text-emerald-400">Dial code to access ration depot services:</p>
                      <div className="text-base font-bold text-white tracking-wider">{ussdDialedNumber}</div>
                    </div>
                  )}

                  {ussdStep === 2 && (
                    <div className="space-y-1.5 text-[11px]">
                      <p className="font-bold text-white">Shri Renuka FPS #104:</p>
                      <p>1. Book 2-Hour Collection Slot</p>
                      <p>2. Check Entitlement Quota</p>
                      <p>3. Grace Pass Walk-in Info</p>
                    </div>
                  )}

                  {ussdStep === 3 && (
                    <div className="space-y-1.5 text-[11px]">
                      <p className="font-bold text-white">Select Slot for Day 12:</p>
                      <p>1. 08:00 AM - 10:00 AM</p>
                      <p>2. 10:00 AM - 12:00 PM</p>
                      <p>3. 02:00 PM - 04:00 PM (Fast)</p>
                    </div>
                  )}

                  {ussdStep === 4 && (
                    <div className="space-y-2">
                      <p className="text-emerald-100 font-bold">Request Processed!</p>
                      <p className="text-[11px] text-emerald-300">{ussdMessage}</p>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-emerald-600 border-t border-emerald-800/40 pt-1 mt-2">
                  Session Encrypted (2G/3G Non-Data)
                </div>
              </div>

              {/* USSD Keypad & Input */}
              {ussdStep < 4 ? (
                <form onSubmit={handleUssdSubmit} className="space-y-3">
                  {ussdStep > 1 && (
                    <div>
                      <input
                        type="text"
                        placeholder="Enter option (1, 2, or 3)..."
                        value={ussdInput}
                        onChange={(e) => setUssdInput(e.target.value)}
                        className="w-full py-2 px-3 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-center text-sm focus:outline-hidden focus:border-emerald-400"
                        autoFocus
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{ussdStep === 1 ? 'Dial USSD' : 'Send'}</span>
                    </button>

                    {ussdStep > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setUssdStep(1);
                          setUssdInput('');
                        }}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                        title="Reset USSD session"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setUssdStep(1);
                    setUssdInput('');
                    setFallbackModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-colors"
                >
                  Close & View Active Token
                </button>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* IVR Phone Call Channel Mode */}
          {/* ======================================================== */}
          {fallbackChannel === 'ivr' && (
            <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 text-[#0E7C7B] flex items-center justify-center mx-auto shadow-xs border border-teal-100">
                <Volume2 className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Karnataka Annavani IVR Helpline (Toll-Free 1967)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Automated interactive voice response phone call for rural citizens
                </p>
              </div>

              {ivrCallState === 'idle' && (
                <div className="space-y-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setIvrLanguage('kn')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        ivrLanguage === 'kn'
                          ? 'border-[#0E7C7B] bg-teal-50 text-[#0E7C7B]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      ಕನ್ನಡ (Kannada)
                    </button>
                    <button
                      onClick={() => setIvrLanguage('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        ivrLanguage === 'en'
                          ? 'border-[#0E7C7B] bg-teal-50 text-[#0E7C7B]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      English
                    </button>
                  </div>

                  <button
                    onClick={handleStartIvr}
                    className="w-full py-3 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Initiate Automated Annavani Call</span>
                  </button>
                </div>
              )}

              {ivrCallState === 'calling' && (
                <div className="py-6 space-y-2">
                  <p className="text-sm font-semibold text-slate-700 animate-pulse">
                    Dialing 1967... Connecting to Annavani Server
                  </p>
                  <div className="flex justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0E7C7B] animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-[#0E7C7B] animate-ping delay-100"></span>
                  </div>
                </div>
              )}

              {ivrCallState === 'connected' && (
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 text-left space-y-4">
                  <div className="flex items-center justify-between text-xs text-teal-900 border-b border-teal-200 pb-2">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Call Connected: 00:24
                    </span>
                    <span className="font-mono text-[11px]">Card: {citizen.rationCardNumber}</span>
                  </div>

                  {ivrStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-700 italic">
                        {ivrLanguage === 'kn'
                          ? '"ನಮಸ್ಕಾರ, ಕರ್ನಾಟಕ ಆಹಾರ ಇಲಾಖೆಯ ಅನ್ನವಾಣಿಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಅಂಗಡಿ #104 ನಲ್ಲಿ 2-ಗಂಟೆಯ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲು 1 ಒತ್ತಿರಿ. ಗ್ರೇಸ್ ಪಾಸ್ ಮಾಹಿತಿಗೆ 2 ಒತ್ತಿರಿ."'
                          : '"Welcome to Karnataka Annavani IVR. Press 1 to book a 2-hour collection slot at Shop #104. Press 2 for Grace Pass info."'}
                      </p>

                      <div className="flex justify-center gap-2 pt-2">
                        <button
                          onClick={() => handleIvrDigit('1')}
                          className="px-5 py-2.5 bg-[#0E7C7B] text-white rounded-xl font-bold text-xs hover:bg-[#0c6b6a] transition-colors"
                        >
                          Press 1 (Book Slot)
                        </button>
                        <button
                          onClick={() => handleIvrDigit('2')}
                          className="px-5 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-300 transition-colors"
                        >
                          Press 2 (Grace Pass)
                        </button>
                      </div>
                    </div>
                  )}

                  {ivrStep === 2 && (
                    <div className="space-y-2 text-center py-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-900">
                        {ivrLanguage === 'kn'
                          ? 'ನಿಮ್ಮ ಟೋಕನ್ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಎಸ್ಎಂಎಸ್ ಕಳುಹಿಸಲಾಗಿದೆ.'
                          : 'Your token is confirmed. Confirmation SMS dispatched.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {ivrCallState === 'completed' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                    Call Ended. Virtual Token #{citizen.activeTokenNumber} active in system.
                  </div>
                  <button
                    onClick={() => {
                      setIvrCallState('idle');
                      setFallbackModalOpen(false);
                    }}
                    className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-700"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
