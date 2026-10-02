import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  ChevronUp,
  ChevronDown,
  Info,
  Radio,
  MousePointer,
  Compass,
  Calendar,
  Lock,
  QrCode,
  Store,
  Shield,
  User,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { speakAloud, stopSpeaking, subscribeSpeechState } from '../../utils/audioSpeech';

export const VoiceAssistantGuidance: React.FC = () => {
  const {
    currentRole,
    language,
    citizen,
    shops,
    slotBookingState,
    slotIntent,
    activeDistrictAuthority,
    isDemandLockedByDso,
  } = usePds();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpokenText, setCurrentSpokenText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [isHoverSpeechMuted, setIsHoverSpeechMuted] = useState(false);
  const [hoverTip, setHoverTip] = useState<{
    title: string;
    desc: string;
    actionPhrase?: string;
  } | null>(null);

  // Synchronize global hover mute state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__pds_voice_hover_muted = isHoverSpeechMuted;
    }
  }, [isHoverSpeechMuted]);

  // Subscribe to global speech state
  useEffect(() => {
    const unsubscribe = subscribeSpeechState((speaking, text) => {
      setIsSpeaking(speaking);
      if (text) setCurrentSpokenText(text);
    });
    return () => unsubscribe();
  }, []);

  // Listen to hover explanation events dispatched across buttons & icons
  useEffect(() => {
    const handleVoiceHover = (e: any) => {
      if (e.detail) {
        setHoverTip({
          title: e.detail.title || 'Guidance',
          desc: e.detail.desc || '',
          actionPhrase: e.detail.actionPhrase || 'What you can do by pressing this',
        });
      }
    };
    const handleVoiceHoverEnd = () => {
      setHoverTip(null);
    };

    window.addEventListener('pds-voice-hover', handleVoiceHover);
    window.addEventListener('pds-voice-hover-end', handleVoiceHoverEnd);

    return () => {
      window.removeEventListener('pds-voice-hover', handleVoiceHover);
      window.removeEventListener('pds-voice-hover-end', handleVoiceHoverEnd);
    };
  }, []);

  // Contextual Guidance Scripts per Role & State
  const getContextualWelcomeScript = (): { kn: string; en: string } => {
    // 1. App Opened / Landing / Login Page
    if (!currentRole) {
      return {
        kn: 'ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ವ್ಯವಸ್ಥೆ (Ahara Demand Sync) ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ. ಇದು ಗೋದಾಮಿನಿಂದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳ ಮೂಲಕ ನಾಗರಿಕರಿಗೆ ಪಾರದರ್ಶಕ ಪಡಿತರ ವಿತರಣೆ ಕಲ್ಪಿಸುವ ತಂತ್ರಜ್ಞಾನ. ನಾಗರಿಕರು ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಮಾಡಲು ಸಿಟಿಜನ್ ಲಾಗಿನ್ ಒತ್ತಿ. ಜಿಲ್ಲಾ ಅಧಿಕಾರಿಗಳು ಡಿಎಸ್‌ಒ ಲಾಗಿನ್, ಮತ್ತು ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಮಾಲೀಕರು ಡೀಲರ್ ಲಾಗಿನ್ ಆಯ್ಕೆಮಾಡಿ.',
        en: 'Welcome to the Public Distribution System PDS Demand Sync portal. This platform connects wholesale FCI grain warehouses directly to Fair Price Shops and citizens for transparent, queue-free ration distribution. If you are a citizen cardholder, press Citizen Login. For District Supply Officers, select DSO Login, and for shop owners, select FPS Dealer Login.',
      };
    }

    // 2. Citizen Beneficiary Flow (Major role in guiding citizen at every step)
    if (currentRole === 'citizen') {
      const shop =
        shops.find((s) => s.id === citizen.assignedFpsId) ||
        shops.find((s) => s.id === (citizen.defaultFpsId || 'KA-BLR-FPS-104')) ||
        shops[0];
      const isDistributionOpen = Boolean(shop?.distributionStarted);
      const isSlotLocked =
        slotBookingState.assignedSlot.status === 'reserved' ||
        slotIntent.status === 'slot_locked';

      // Step 3: Slot already locked with token
      if (isSlotLocked) {
        return {
          kn: `ಅಭಿನಂದನೆಗಳು ${citizen.headOfHousehold} ಅವರೇ! ನಿಮ್ಮ ಸಮಯದ ಸ್ಲಾಟ್ ಯಶಸ್ವಿಯಾಗಿ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ಟೋಕನ್ ಸಂಖ್ಯೆ ${slotBookingState.tokenDetails.tokenId || citizen.activeTokenNumber || 'TKN-2026'}. ನಿಗದಿತ ದಿನ ಮತ್ತು ಸಮಯಕ್ಕೆ ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${shop.name} ಗೆ ತೆರಳಿ ರೇಷನ್ ಪಡೆಯಿರಿ.`,
          en: `Congratulations ${citizen.headOfHousehold}! Your collection time slot is booked. Your confirmed token is ${slotBookingState.tokenDetails.tokenId || citizen.activeTokenNumber || 'TKN-2026'}. Please visit your Fair Price Shop ${shop.name} during your selected shift to collect your grains with zero waiting time.`,
        };
      }

      // Step 2: Distribution Window Open
      if (isDistributionOpen) {
        const sched = shop.distributionSchedule?.distributionDaysLabel || 'Days 11 to 25';
        return {
          kn: `ಶುಭ ಸುದ್ದಿ! ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${shop.name} ಡೀಲರ್ ವಿತರಣಾ ದಿನಾಂಕಗಳನ್ನು (${sched}) ದೃಢಪಡಿಸಿದ್ದಾರೆ. ಹಂತ 2 ರಲ್ಲಿ ನಿಗದಿತ ದಿನಗಳಲ್ಲಿ ಒಂದು ದಿನವನ್ನು ಮತ್ತು 2 ಗಂಟೆಗಳ ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆಯ ಶಿಫ್ಟ್ ಆಯ್ಕೆಮಾಡಿ, ಲಾಕ್ ಬಟನ್ ಒತ್ತಿ ನಿಮ್ಮ ಸಮಯದ ಟೋಕನ್ ಪಡೆಯಿರಿ.`,
          en: `Great news! Your FPS Dealer at ${shop.name} has officially opened the collection window for ${sched}. In Step 2, please select your convenient day from the confirmed schedule, choose a 2-hour morning or evening shift, and press Lock Slot to generate your scheduled time slot token.`,
        };
      }

      // Step 1 & Step 2 Awaiting Dealer
      return {
        kn: `ನಮಸ್ಕಾರ ${citizen.headOfHousehold} ಅವರೇ! ಇದು ನಿಮ್ಮ ನಾಗರಿಕ ಪಡಿತರ ಸೇವಾ ಪೋರ್ಟಲ್. ಹಂತ 1 ರಲ್ಲಿ: ನಿಮ್ಮ ಖಾಯಂ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${shop.name} ಆಯ್ಕೆಯಾಗಿದೆ. ಪ್ರಸಕ್ತ ತಿಂಗಳಿಗೆ ಅಂಗಡಿ ಬದಲಾಯಿಸಬೇಕಿದ್ದರೆ '1. ಈ ತಿಂಗಳಿಗಾಗಿ ಸ್ಥಳ ಬದಲಾವಣೆ' ಒತ್ತಿ ನಕ್ಷೆಯಲ್ಲಿ ಹತ್ತಿರದ ಅಂಗಡಿ ಆರಿಸಿ. ಮೂಲ ಅಂಗಡಿಯಲ್ಲೇ ಮುಂದುವರಿಯಲು '2. ಮೂಲ ಸ್ಥಳ ಬಳಸಿ' ಒತ್ತಿ. ಹಂತ 2 ರಲ್ಲಿ: ಡೀಲರ್ ವಿತರಣಾ ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಿದ ಕೂಡಲೇ ಸ್ಲಾಟ್ ಆಯ್ಕೆ ವಿಂಡೋ ತಾನಾಗಿಯೇ ತೆರೆಯಲ್ಪಡುತ್ತದೆ. ಡಿಎಸ್‌ಒ ರವರಿಂದ ನಿಮ್ಮ ಡೀಫಾಲ್ಟ್ ಟೋಕನ್ ಸಿದ್ಧವಾಗಿದೆ.`,
        en: `Welcome ${citizen.headOfHousehold}! This is your Citizen PDS Guide. In Step 1: Your default depot ${shop.name} is selected. To change shop for this month under portability, press '1. Change the Location for This Month'. To confirm your permanent shop, press '2. Keep Default Location'. In Step 2: As soon as your FPS Dealer confirms distribution dates, the window will unlock for you to pick a time slot. Your default token is already provisioned by DSO.`,
      };
    }

    // 3. FPS Dealer Flow
    if (currentRole === 'dealer') {
      return {
        kn: `ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್ ಇ-ಪಿಒಎಸ್ ಟರ್ಮಿನಲ್‌ಗೆ ಸುಸ್ವಾಗತ. ಇಲ್ಲಿ ನೀವು ಗೋದಾಮಿನಿಂದ ಧಾನ್ಯ ಸ್ವೀಕೃತಿ ಪರಿಶೀಲಿಸಿ, 15 ದಿನಗಳ ವಿತರಣಾ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪ್ರಕಟಿಸಿ ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಿ ಬಟನ್ ಒತ್ತಬೇಕು. ನೀವು ವಿತರಣೆ ಆರಂಭಿಸಿದ ಕೂಡಲೇ ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಆರಿಸಿಕೊಂಡ ಎಲ್ಲಾ ಫಲಾನುಭವಿಗಳಿಗೆ ಆ್ಯಪ್, ಎಸ್‌ಎಂಎಸ್ ಮತ್ತು ಐವಿಆರ್ ಕರೆ ಮೂಲಕ ಸಂದೇಶ ರವಾನೆಯಾಗಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ವಿಂಡೋ ತೆರೆಯುತ್ತದೆ.`,
        en: `Welcome to the FPS Licensed Dealer Terminal. In this suite, verify wholesale stock receipt, review your 15-day distribution schedule, and click Confirm Distribution Days & Broadcast. When you confirm, all citizens who chose this location are immediately notified via App, SMS, and IVR to collect their ration and book their slots.`,
      };
    }

    // 4. District Supply Officer (DSO) Flow
    if (currentRole === 'officer') {
      return {
        kn: `ಜಿಲ್ಲಾ ಸರಬರಾಜು ಅಧಿಕಾರಿ (DSO) ಕಮಾಂಡ್ ಸೆಂಟರ್‌ಗೆ ಸುಸ್ವಾಗತ. ${activeDistrictAuthority.districtName} ಜಿಲ್ಲೆಯ ಎಲ್ಲಾ ಗೋದಾಮು ದಾಸ್ತಾನು ಪರಿಶೀಲಿಸಿ. 'ಮಾಸಿಕ ಬೇಡಿಕೆ ಲಾಕ್ ಮಾಡಿ' ಬಟನ್ ಒತ್ತುವ ಮೂಲಕ ಜಿಲ್ಲೆಯ ಎಲ್ಲಾ ಪಡಿತರ ಚೀಟಿದಾರರಿಗೆ ಡೀಫಾಲ್ಟ್ ಡಿಜಿಟಲ್ ಟೋಕನ್‌ಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಿ ಮತ್ತು ಟ್ರಕ್ ಸರಬರಾಜುಗಳನ್ನು ಅನುಮೋದಿಸಿ.`,
        en: `Welcome to the District Supply Officer (DSO) Command Center for ${activeDistrictAuthority.districtName}. Review taluk grain demands and warehouse buffers. Press Lock Monthly Demand to issue default digital tokens to all cardholders across the district, and approve AI-recommended truck dispatches.`,
      };
    }

    return {
      kn: 'ಕರ್ನಾಟಕ ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ.',
      en: 'Welcome to Karnataka Public Distribution System portal.',
    };
  };

  // Play welcome speech on app open or role change
  useEffect(() => {
    const script = getContextualWelcomeScript();
    const textToSpeak = language === 'kn' ? script.kn : script.en;

    const timer = setTimeout(() => {
      speakAloud(textToSpeak, language);
      setHasWelcomed(true);
    }, 900);

    // If browser blocks autoplay before user gesture, handle first user interaction
    const handleFirstGesture = () => {
      if (!hasWelcomed) {
        speakAloud(textToSpeak, language);
        setHasWelcomed(true);
      }
      document.removeEventListener('click', handleFirstGesture);
    };
    document.addEventListener('click', handleFirstGesture, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleFirstGesture);
      stopSpeaking();
    };
  }, [currentRole, language]);

  const handleReplayVoiceGuide = () => {
    const script = getContextualWelcomeScript();
    const textToSpeak = language === 'kn' ? script.kn : script.en;
    speakAloud(textToSpeak, language);
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  const script = getContextualWelcomeScript();
  const activeScriptText = language === 'kn' ? script.kn : script.en;

  return (
    <aside
      aria-label="Voice Assistant Guidance"
      className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-full px-3 font-sans transition-all duration-200"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-[#6B1870] overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* BANNER HEADER */}
        <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white p-3 sm:p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-xl bg-purple-900 border border-[#FFD700] flex items-center justify-center text-[#FFD700] shadow-sm ${
                  isSpeaking ? 'ring-4 ring-amber-400/40 animate-pulse' : ''
                }`}
              >
                <Bot className="w-5 h-5" />
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-serif text-[#FFD700]">
                  {language === 'kn' ? 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ (Voice Assistant)' : 'AI Voice Assistant & Guide'}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    isSpeaking
                      ? 'bg-emerald-500 text-white animate-pulse'
                      : 'bg-purple-800 text-purple-200'
                  }`}
                >
                  {isSpeaking ? 'Speaking' : 'Ready'}
                </span>
              </div>
              <p className="text-[10px] text-purple-200">
                {currentRole === 'citizen'
                  ? 'Citizen Step-by-Step Task Voice Navigator'
                  : currentRole === 'dealer'
                  ? 'FPS Dealer Distribution Workflow Guide'
                  : currentRole === 'officer'
                  ? 'DSO Command Center Assistant'
                  : 'Welcome & System Audio Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isSpeaking ? (
              <button
                type="button"
                onClick={handleStopSpeaking}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Stop Speaking"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Mute</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReplayVoiceGuide}
                className="p-1.5 bg-[#FFD700] hover:bg-amber-400 text-[#2C0E38] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Listen to step-by-step instructions"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Guide Me</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand transcript'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* INTERACTIVE HOVER EXPLANATION BUBBLE (Fires when hovering on any icon or button in the app) */}
        {hoverTip ? (
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-950 animate-in fade-in duration-150">
            <Sparkles className="w-4 h-4 text-[#6B1870] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2C0E38] block text-[11px] uppercase tracking-wide">
                  {hoverTip.title}
                </span>
                <span className="text-[10px] text-amber-800 bg-amber-200/60 px-1.5 py-0.2 rounded font-semibold">
                  {hoverTip.actionPhrase || 'Role Explanation'}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug mt-1">
                <strong>{language === 'kn' ? 'ಇದರ ಪಾತ್ರ / ಉಪಯೋಗ: ' : 'What you can do by pressing this: '}</strong>
                {hoverTip.desc}
              </p>
            </div>
          </div>
        ) : null}

        {/* EXPANDED SCRIPT TRANSCRIPT & STEP DIRECTIVES */}
        {isExpanded && (
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5 text-xs max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#6B1870] flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn' ? 'ಪ್ರಸ್ತುತ ಹಂತದ ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ' : 'Active Step Guidance Transcript'}
                </span>
              </span>
              <button
                type="button"
                onClick={handleReplayVoiceGuide}
                className="text-[11px] text-purple-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Re-listen</span>
              </button>
            </div>

            <p className="text-slate-700 text-xs leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200 italic">
              "{isSpeaking && currentSpokenText ? currentSpokenText : activeScriptText}"
            </p>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setIsHoverSpeechMuted(!isHoverSpeechMuted)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-[#6B1870] cursor-pointer"
              >
                {isHoverSpeechMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hover Voice: <strong>Muted</strong></span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hover Voice: <strong className="text-emerald-700">Speaking Aloud</strong></span>
                  </>
                )}
              </button>

              <span className="font-mono text-purple-900 font-bold">1967 Helpline</span>
            </div>
          </div>
        )}

        {/* MINIMAL FOOTER TICKER */}
        <div className="px-3 py-1.5 bg-purple-50/80 flex items-center justify-between text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-500 animate-pulse' : 'bg-purple-600'}`} />
            <span className="font-medium">
              {isSpeaking
                ? language === 'kn'
                  ? 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಲಾಗುತ್ತಿದೆ...'
                  : 'Speaking audio instructions...'
                : language === 'kn'
                ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ & ಮಾರ್ಗದರ್ಶಿ ಸಿದ್ಧವಾಗಿದೆ'
                : 'Interactive Audio & Hover Guide Active'}
            </span>
          </div>

          <span className="text-[10px] text-purple-800 font-bold">
            {language.toUpperCase()} · PDS DemandSync
          </span>
        </div>
      </div>
    </aside>
  );
};
