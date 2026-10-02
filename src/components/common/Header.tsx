import React, { useState, useEffect } from 'react';
import {
  Home,
  ChevronDown,
  LogIn,
  LogOut,
  Volume2,
  Globe,
  Wheat,
  User,
  Store,
  Shield,
  MapPin,
  Sparkles,
  PhoneCall,
  Clock,
  Truck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { Language } from '../../types/pds';
import { OFFICER_PROFILES } from '../../data/mockData';
import { speakAloud } from '../../utils/audioSpeech';

interface HeaderProps {
  onGoToLogin?: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoToLogin,
  activeNavTab = 'home',
  onSelectNavTab,
}) => {
  const {
    language,
    setLanguage,
    currentRole,
    logout,
    officerTier,
    dealerShopId,
    citizen,
    t,
    openMapsModal,
    activeDistrictAuthority,
  } = usePds();

  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted =
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' | ' +
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) +
        ' IST';
      setCurrentDateTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  ];

  const handleAudioHelp = () => {
    const script =
      language === 'kn'
        ? 'ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಇಲಾಖೆಯ ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ಪೋರ್ಟಲ್‌ಗೆ ಸುಸ್ವಾಗತ. ಪಡಿತರ ಕೋಟಾ, ಇ-ಟೋಕನ್ ಬುಕಿಂಗ್ ಮತ್ತು ವಾಹನ ಟ್ರ್ಯಾಕಿಂಗ್ ಸೇವೆಗಳು ಇಲ್ಲಿ ಲಭ್ಯವಿದೆ.'
        : 'Welcome to Food and Civil Supplies PDS Demand Sync portal. Access pre-booking tokens, grain quotas, and fair price shops.';
    speakAloud(script, language);
  };

  const navItems = [
    { id: 'home', labelEn: 'About Dept', labelKn: 'ಇಲಾಖೆಯ ಬಗ್ಗೆ' },
    { id: 'services', labelEn: 'Citizen e-Services', labelKn: 'ನಾಗರಿಕ ಸೇವೆಗಳು', hasDropdown: true },
    { id: 'quota', labelEn: 'Grain Quota (Anna Bhagya)', labelKn: 'ಧಾನ್ಯ ಕೋಟಾ' },
    { id: 'fleet', labelEn: 'Fleet GPS Tracker', labelKn: 'ಲೈವ್ ವಾಹನ ಟ್ರ್ಯಾಕಿಂಗ್' },
    { id: 'shops', labelEn: 'Fair Price Shops', labelKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗಳು' },
    { id: 'orders', labelEn: 'Official Orders & Rules', labelKn: 'ಅಧಿಕೃತ ಆದೇಶಗಳು' },
    { id: 'helpline', labelEn: 'Helpline (1967)', labelKn: 'ಸಹಾಯವಾಣಿ 1967', hasDropdown: true },
  ];

  return (
    <header className="w-full font-serif select-none border-b border-purple-900/30">
      {/* 1. TOP BRANDING ROW - ROYAL PURPLE (#2C0E38) & GOLD ACCENTS */}
      <div className="bg-[#2C0E38] text-white px-3 sm:px-6 py-2.5 sm:py-3 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Emblem Roundel + Food & Civil Supplies Department Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#481656] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
              <Wheat className="w-5 h-5 sm:w-7 sm:h-7 text-[#FFD700]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] sm:text-[10px] text-[#FFD700] uppercase font-sans font-bold tracking-wider truncate">
                  ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು · PDS
                </span>
                <span className="text-[9px] sm:text-[10px] bg-amber-500/20 text-[#FFD700] px-1.5 py-0.2 rounded-full border border-amber-400/30 font-sans font-semibold hidden md:inline">
                  PDS Demand Sync 2.0
                </span>
              </div>
              <h1 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight leading-snug truncate sm:whitespace-normal">
                {language === 'kn'
                  ? 'ಆಹಾರ, ನಾಗರಿಕ ಸರಬರಾಜು ಮತ್ತು ಗ್ರಾಹಕರ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ'
                  : 'Department of Food, Civil Supplies & Consumer Affairs'}
              </h1>
              <p className="text-[10px] sm:text-xs text-purple-200/90 font-serif hidden sm:block">
                {language === 'kn'
                  ? 'ಕೇಂದ್ರೀಯ ಗೋದಾಮುಗಳಿಂದ ನಾಗರಿಕರ ಮನೆಬಾಗಿಲಿಗೆ ಪಾರದರ್ಶಕ ಪಡಿತರ ವಿತರಣಾ ವ್ಯವಸ್ಥೆ'
                  : 'Central FCI Pool to Citizen End-to-End Public Distribution Supply Chain'}
              </p>
            </div>
          </div>

          {/* Center: National Emblem & Motto */}
          <div className="hidden lg:flex items-center gap-4 text-purple-200">
            <div className="w-8 h-8 rounded-full border border-purple-300/40 flex items-center justify-center">
              <Wheat className="w-4 h-4 text-[#FFD700]" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-6 border-x-2 border-white flex items-center justify-center">
                <div className="w-1 h-4 bg-[#D4AF37]" />
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#FFD700] font-sans font-bold mt-0.5">
                SATYAMEVA JAYATE
              </span>
            </div>
            <div className="w-8 h-8 rounded-full border border-purple-300/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#FFD700]" />
            </div>
          </div>

          {/* Right: Audio Reader + Language Selector + Realtime Clock */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider block font-sans">
                {language === 'kn' ? 'ನಾಗರಿಕ ಸಹಾಯವಾಣಿ 1967' : 'Toll-Free Helpline 1967'}
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-serif font-black text-amber-300">
                  {language === 'kn' ? 'ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆ' : 'Anna Bhagya Scheme'}
                </span>
                <button
                  onClick={handleAudioHelp}
                  className="p-1 text-purple-200 hover:text-[#FFD700] cursor-pointer transition-colors"
                  title="Listen aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Voice Assist Icon */}
            <button
              onClick={handleAudioHelp}
              className="sm:hidden p-1.5 text-purple-200 hover:text-[#FFD700] bg-[#481656] rounded-md border border-purple-300/30 cursor-pointer"
              title="Listen aloud"
            >
              <Volume2 className="w-4 h-4 text-[#FFD700]" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#481656] px-2 py-1 rounded-md border border-purple-300/30 text-xs text-purple-100 font-sans">
              <Globe className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-[#FFD700] text-[11px] font-bold cursor-pointer focus:outline-hidden"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#2C0E38] text-[#FFD700]">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR - ROYAL DEEP PURPLE (#481656) */}
      <nav className="bg-[#481656] text-white px-3 sm:px-6 py-2 shadow-sm font-sans text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Active Role Module Title */}
          <div className="flex items-center gap-2 py-0.5 text-xs min-w-0">
            <span className="text-[#FFD700] font-sans font-bold uppercase tracking-wider text-[11px] sm:text-xs truncate">
              {currentRole === 'citizen' && (language === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್ · ಕೋಟಾ' : 'Citizen Beneficiary Window')}
              {currentRole === 'dealer' && (language === 'kn' ? 'ನ್ಯಾಯಬೆಲೆ ಡೀಲರ್ · ಇ-ಪಿಒಎಸ್' : 'FPS Dealer Terminal')}
              {currentRole === 'officer' && (language === 'kn' ? 'ಸರಬರಾಜು ಪ್ರಾಧಿಕಾರ' : 'Civil Supplies Command')}
              {!currentRole && (language === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಪಡಿತರ ವ್ಯವಸ್ಥೆ' : 'Karnataka ePDS Gateway')}
            </span>
          </div>

          {/* Right Action: Role Badge & Log Out / Switch Role */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {currentRole ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Active Role Badge */}
                <div className="flex items-center gap-1.5 bg-[#2C0E38] px-2 sm:px-2.5 py-1 rounded-md border border-[#D4AF37]/50 text-xs">
                  {currentRole === 'citizen' && (
                    <>
                      <User className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                      <span className="font-bold text-white max-w-[85px] sm:max-w-[150px] truncate text-[11px] sm:text-xs">
                        {citizen.headOfHousehold.split(' ')[0]} ({citizen.cardType.split(' ')[0]})
                      </span>
                    </>
                  )}
                  {currentRole === 'dealer' && (
                    <>
                      <Store className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                      <span className="font-bold text-white text-[11px] sm:text-xs">FPS #{dealerShopId.split('-').pop()}</span>
                    </>
                  )}
                  {currentRole === 'officer' && (
                    <>
                      <Shield className="w-3.5 h-3.5 text-[#FFD700] shrink-0" />
                      <span className="font-bold text-white uppercase text-[10px] sm:text-[11px]">
                        {officerTier.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>

                {/* Sign Out / Switch Role Button */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 bg-red-950/90 hover:bg-red-900 text-amber-200 border border-red-700/60 px-2 sm:px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors"
                  title="Return to Login Gateway"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{language === 'kn' ? 'ಲಾಗಿನ್ ಬದಲಿಸಿ' : 'Switch Role'}</span>
                  <span className="sm:hidden text-[11px]">Exit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onGoToLogin}
                className="flex items-center gap-1 bg-[#D4AF37] hover:bg-[#E5C158] text-[#2C0E38] px-3 sm:px-3.5 py-1 rounded-md text-xs font-bold font-sans cursor-pointer transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2C0E38] shrink-0" />
                <span>{language === 'kn' ? 'ಲಾಗಿನ್' : 'Log In'}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 3. MARQUEE ANNOUNCEMENT STRIP (EXACT TICKER FROM REFERENCE UI) */}
      <div className="bg-[#FAF2EB] border-b border-amber-200/80 px-4 py-1.5 flex items-center gap-3 overflow-hidden text-xs text-[#2C0E38] font-sans">
        <div className="flex items-center gap-1.5 shrink-0 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          <Clock className="w-3 h-3 animate-pulse" />
          <span>{language === 'kn' ? 'ಸೂಚನೆ' : 'FLASH NEWS'}</span>
        </div>

        <div className="overflow-x-auto whitespace-nowrap scroll-smooth flex items-center gap-8 text-[11px] font-medium text-slate-800">
          <span>
            {language === 'kn'
              ? 'ಆಹಾರ ಧಾನ್ಯ ವಿತರಣಾ ಚಕ್ರ ಪ್ರಗತಿಯಲ್ಲಿದೆ: ಅನ್ನಭಾಗ್ಯ ಹಾಗೂ ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಭದ್ರತಾ ಕಾಯ್ದೆಯಡಿ ಉಚಿತ ಪಡಿತರ ವಿತರಣೆ. ಮಾಸಿಕ ಮುಂಗಡ ಬುಕಿಂಗ್ ಅವಧಿ: ಪ್ರತಿ ತಿಂಗಳ 20 ರಿಂದ 25 ರವರೆಗೆ. ಸಾರ್ವಜನಿಕ ಸಹಾಯವಾಣಿ: 1967 (ಉಚಿತ ಕರೆ).'
              : 'PDS Grain Distribution Active w.e.f. 25.09.2026, 10:00 AM: 100% Free grain distribution under Anna Bhagya & NFSA. Dual-Phase Pre-Booking window open for 20th–25th. Toll-Free Helpline: 1967.'}
          </span>
          <span className="text-purple-900 font-bold hidden sm:inline">
            • 300+ KFCSC Central Godowns Dispatched • 19,800+ FPS Biometric ePoS Active • Real-time GPS Fleet Monitored
          </span>
        </div>
      </div>
    </header>
  );
};
