import React, { useState } from 'react';
import {
  Calendar,
  Wheat,
  Truck,
  MapPin,
  Clock,
  QrCode,
  Store,
  Layers,
  Shield,
  PhoneCall,
  Volume2,
  Play,
  X,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  Users,
  Database,
  Building,
  Radio,
  FileText,
  AlertCircle,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { speakAloud } from '../../utils/audioSpeech';
import { SlotBookingComponent } from '../citizen/SlotBookingComponent';
import { CitizenView } from '../citizen/CitizenView';
import { OfficerSuite } from '../officer/OfficerSuite';
import { FpsDealerView } from '../dealer/FpsDealerView';

interface ServiceItem {
  id: string;
  name: string;
  nameKn: string;
  icon: React.ElementType;
  badge?: string;
  featureKey: string;
}

interface PdsDashboardProps {
  onGoToLogin: () => void;
}

export const PdsDashboard: React.FC<PdsDashboardProps> = ({ onGoToLogin }) => {
  const {
    language,
    t,
    currentRole,
    setCurrentRole,
    citizenAuth,
    dealerAuth,
    setDealerAuth,
    officerAuth,
    setOfficerAuth,
    citizen,
    shops,
    openMapsModal,
    activeToken,
    activeBeneficiary,
    openFallbackModal,
  } = usePds();

  // Active feature dialog / sheet
  const [activeModalFeature, setActiveModalFeature] = useState<string | null>(null);

  // Live announcement stream modal
  const [showLiveStreamModal, setShowLiveStreamModal] = useState(false);

  // 18 Authentic PDS Demand Sync Services in Circular Icon Grid
  const services: ServiceItem[] = [
    {
      id: 'pds_slot_booking',
      name: 'Pre-Booking Slots',
      nameKn: 'ಮುಂಗಡ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್',
      icon: Calendar,
      badge: 'e-Token',
      featureKey: 'slot_booking',
    },
    {
      id: 'pds_quota_passbook',
      name: 'Quota Passbook',
      nameKn: 'ಧಾನ್ಯ ಕೋಟಾ ಪಾಸ್‌ಬುಕ್',
      icon: Wheat,
      badge: '26 KG Free',
      featureKey: 'quota_passbook',
    },
    {
      id: 'pds_truck_gps',
      name: 'Live Truck GPS',
      nameKn: 'ಲಾರಿ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
      icon: Truck,
      badge: 'DSO & FPS Only',
      featureKey: 'live_truck_gps',
    },
    {
      id: 'pds_fps_locator',
      name: 'FPS Shop Locator',
      nameKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಶೋಧಕ',
      icon: MapPin,
      badge: 'Google Maps',
      featureKey: 'fps_locator',
    },
    {
      id: 'pds_priority_darshan',
      name: 'Priority Queue Pass\n(Sr. Citizens / PwD)',
      nameKn: 'ಹಿರಿಯ ನಾಗರಿಕರ ಆದ್ಯತೆ',
      icon: Award,
      badge: 'Fast-Track',
      featureKey: 'priority_queue',
    },
    {
      id: 'pds_digital_qr',
      name: 'Digital e-Token QR',
      nameKn: 'ಡಿಜಿಟಲ್ ಇ-ಟೋಕನ್',
      icon: QrCode,
      badge: 'QR Slip',
      featureKey: 'digital_token',
    },
    {
      id: 'pds_kfcsc_godowns',
      name: 'KFCSC Depots',
      nameKn: 'ಕೆಎಫ್‌ಸಿಎಸ್‌ಸಿ ಗೋದಾಮುಗಳು',
      icon: Building,
      badge: 'Wholesale',
      featureKey: 'kfcsc_godowns',
    },
    {
      id: 'pds_ekyc_seeding',
      name: 'Family e-KYC',
      nameKn: 'ಇ-ಕೆವೈಸಿ ಪರಿಶೀಲನೆ',
      icon: User,
      badge: 'Aadhaar',
      featureKey: 'ekyc',
    },
    {
      id: 'pds_fci_central',
      name: 'FCI Central Pool',
      nameKn: 'ಎಫ್‌ಸಿಐ ಕೇಂದ್ರ ಹಂಚಿಕೆ',
      icon: Layers,
      badge: 'Central Stock',
      featureKey: 'fci_pool',
    },
    {
      id: 'pds_nic_fist',
      name: 'NIC FIST Accounting',
      nameKn: 'ಎನ್‌ಐಸಿ ಫಿಸ್ಟ್ ಲೆಕ್ಕಪತ್ರ',
      icon: Database,
      badge: 'DBT Ledger',
      featureKey: 'nic_fist',
    },
    {
      id: 'pds_dso_command',
      name: 'DSO District Suite',
      nameKn: 'ಜಿಲ್ಲಾ ಆಹಾರ ಕಮಾಂಡ್',
      icon: Shield,
      badge: 'Admin Room',
      featureKey: 'dso_command',
    },
    {
      id: 'pds_dealer_pos',
      name: 'Dealer ePoS Machine',
      nameKn: 'ನ್ಯಾಯಬೆಲೆ ಇ-ಪಿಒಎಸ್',
      icon: Store,
      badge: 'Digital Scale',
      featureKey: 'dealer_epos',
    },
    {
      id: 'pds_timetable_broadcast',
      name: '15-Day Timetable',
      nameKn: 'ವಿತರಣಾ ವೇಳಾಪಟ್ಟಿ',
      icon: Clock,
      badge: 'Timetable',
      featureKey: 'timetable_broadcast',
    },
    {
      id: 'pds_toll_free_1967',
      name: 'Helpline 1967',
      nameKn: 'ಸಹಾಯವಾಣಿ 1967',
      icon: PhoneCall,
      badge: 'Toll-Free',
      featureKey: 'grievance_1967',
    },
    {
      id: 'pds_ussd_annavani',
      name: 'USSD & IVR Annavani',
      nameKn: 'ಅನ್ನವಾಣಿ ಐವಿಆರ್ *99#',
      icon: Radio,
      badge: '*99# & Voice',
      featureKey: 'ussd_annavani',
    },
    {
      id: 'pds_offline_mode',
      name: 'Emergency Offline',
      nameKn: 'ತುರ್ತು ಆಫ್‌ಲೈನ್ ವಿತರಣೆ',
      icon: AlertCircle,
      badge: 'Offline Cache',
      featureKey: 'offline_mode',
    },
    {
      id: 'pds_govt_gazettes',
      name: 'Govt Orders & Rules',
      nameKn: 'ಸರ್ಕಾರಿ ಆದೇಶಗಳು',
      icon: FileText,
      badge: 'Gazettes',
      featureKey: 'department_rules',
    },
    {
      id: 'pds_audit_trail',
      name: 'Supply Chain Audit',
      nameKn: 'ಪಾರದರ್ಶಕ ಪರಿಶೋಧನೆ',
      icon: CheckCircle2,
      badge: 'Anti-Pilferage',
      featureKey: 'audit_trail',
    },
  ];

  const handleServiceClick = (service: ServiceItem) => {
    speakAloud(
      language === 'kn' ? service.nameKn : service.name.replace('\n', ' '),
      language
    );

    if (service.featureKey === 'fps_locator') {
      openMapsModal(
        'Karnataka Fair Price Shops Malleshwaram Bangalore',
        { lat: 13.0033, lng: 77.5694 },
        'Malleshwaram Fair Price Shops (Bangalore North)'
      );
      return;
    }

    if (service.featureKey === 'ussd_annavani') {
      openFallbackModal('ussd');
      return;
    }

    setActiveModalFeature(service.featureKey);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F8] pb-16 font-serif select-none">
      {/* ========================================================= */}
      {/* 1. HERO BILLBOARD BANNER: ROUNDED CONTAINER WITH GRADIENT */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white shadow-lg border border-purple-900/40 p-5 sm:p-8 md:p-10">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Column: Official PDS Announcements */}
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-sans font-bold bg-[#D4AF37] text-[#2C0E38] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {language === 'kn' ? 'ಅಧಿಕೃತ ಪಡಿತರ ಪೋರ್ಟಲ್' : 'Official PDS Portal'}
                </span>
                <span className="text-xs text-[#FFD700] font-sans font-semibold">
                  {language === 'kn' ? 'ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆ 2026' : 'Anna Bhagya Scheme 2026'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {language === 'kn'
                  ? 'ಕೇಂದ್ರೀಯ ಗೋದಾಮುಗಳಿಂದ ನಾಗರಿಕರಿಗೆ ನೇರ ಪಡಿತರ ಪೂರೈಕೆ'
                  : 'Zero-Pilferage Public Distribution from FCI to Citizen'}
              </h2>

              <p className="text-xs sm:text-sm text-purple-200/90 font-sans leading-relaxed">
                {language === 'kn'
                  ? 'ಕರ್ನಾಟಕದ 2.45 ಕೋಟಿ ಕುಟುಂಬಗಳಿಗೆ ನೈಜ-ಸಮಯದ ಮುಂಗಡ ಇ-ಟೋಕನ್ ಬುಕಿಂಗ್, ಲೈವ್ ಧಾನ್ಯ ಲಾರಿ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಡಿಜಿಟಲ್ ತೂಕ ಯಂತ್ರ ದೃಢೀಕರಣ.'
                  : 'Real-time dual-phase pre-booking, live GPS grain truck fleet tracking, and biometric ePoS verification for 2.45 Crore eligible households across Karnataka.'}
              </p>

              {/* Quick Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-sans">
                <div className="bg-purple-950/60 border border-purple-400/20 rounded-xl p-2.5">
                  <span className="text-[10px] text-purple-300 block">Monthly Free Quota</span>
                  <strong className="text-sm text-[#FFD700]">26.00 KG</strong>
                </div>
                <div className="bg-purple-950/60 border border-purple-400/20 rounded-xl p-2.5">
                  <span className="text-[10px] text-purple-300 block">KFCSC Godowns</span>
                  <strong className="text-sm text-[#FFD700]">300+ Wholesale</strong>
                </div>
                <div className="bg-purple-950/60 border border-purple-400/20 rounded-xl p-2.5">
                  <span className="text-[10px] text-purple-300 block">Active FPS ePoS</span>
                  <strong className="text-sm text-[#FFD700]">19,800+ Shops</strong>
                </div>
                <div className="bg-purple-950/60 border border-purple-400/20 rounded-xl p-2.5">
                  <span className="text-[10px] text-purple-300 block">Scale Calibration</span>
                  <strong className="text-sm text-[#FFD700]">100% Digital</strong>
                </div>
              </div>
            </div>

            {/* Right Column: Live Stream & Fast Action Card */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              {/* Live Supply Chain Broadcast Card */}
              <div
                onClick={() => setShowLiveStreamModal(true)}
                className="bg-[#3D144A]/90 hover:bg-[#481656] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#FFD700]">
                      Live Broadcast
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {language === 'kn' ? 'ಅನ್ನಭಾಗ್ಯ ನೇರ ಪ್ರಸಾರ' : 'State Supply Broadcast'}
                  </h4>
                  <p className="text-[11px] text-purple-200">
                    {language === 'kn' ? 'ಗೋದಾಮು ಸರಬರಾಜು ಪರಿಶೀಲನೆ' : 'KFCSC Depot Stock Telecast'}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#2C0E38] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Fast Action: Book Slot Button */}
              <button
                onClick={() => setActiveModalFeature('slot_booking')}
                className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#2C0E38] px-5 py-3 rounded-2xl font-bold font-sans text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#2C0E38]" />
                <span>{language === 'kn' ? 'ಮಾಸಿಕ ಇ-ಟೋಕನ್ ಬುಕ್ ಮಾಡಿ' : 'Book Monthly e-Token Slot'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PDS SERVICES TITLE BAR: SIMPLE & ELEGANT               */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 mt-8 sm:mt-10">
        <div className="flex items-center justify-between pb-3 border-b border-purple-200/60 mb-5">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C0E38] tracking-tight">
            {language === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಪಡಿತರ ಸೇವೆಗಳು (PDS Services)' : 'PDS Public Services'}
          </h3>

          <button
            onClick={() => setActiveModalFeature('all_services')}
            className="text-xs sm:text-sm font-sans font-bold text-[#6B1870] hover:text-[#4A104E] underline cursor-pointer transition-colors"
          >
            {language === 'kn' ? 'ಹೆಚ್ಚಿನ ಸೇವೆಗಳು (More Services)' : 'More Services'}
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. ICON GRID: WHITE CIRCLES WITH CRISP PURPLE ICONS       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-7 gap-x-3 sm:gap-x-4 pt-1">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="flex flex-col items-center group cursor-pointer text-center"
              >
                {/* White Circular Button with Soft Shadow */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white shadow-xs border border-purple-100/90 flex items-center justify-center group-hover:scale-105 group-hover:shadow-md group-hover:border-purple-300 transition-all duration-200">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B1870] group-hover:text-[#4A104E] transition-colors" />
                </div>

                {/* Service Label Centered Underneath Circle */}
                <span className="mt-2.5 text-xs font-semibold text-slate-800 leading-tight text-center max-w-[110px] whitespace-pre-line group-hover:text-[#6B1870] transition-colors">
                  {language === 'kn' ? service.nameKn : service.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 4. AUTHENTICATED USER ACTION PANELS (IF LOGGED IN)        */}
        {/* ========================================================= */}
        {currentRole === 'citizen' && citizenAuth && (
          <div className="mt-8 pt-6 border-t border-purple-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-sans font-black text-[#6B1870] uppercase tracking-wider">
                  {language === 'kn' ? 'ದೃಢೀಕೃತ ಫಲಾನುಭವಿ ಕಾರ್ಡ್' : 'Authenticated Beneficiary Card'}
                </span>
                <h4 className="text-xl font-bold font-serif text-[#2C0E38]">
                  {citizen.headOfHousehold} ({citizen.cardType})
                </h4>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                100% Entitlement Active
              </span>
            </div>

            {/* Beneficiary Verified Status Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-xs">
              <div className="space-y-1">
                <span className="text-slate-500">Ration Card No:</span>
                <p className="text-sm font-black font-mono text-[#2C0E38]">{citizen.rationCardNumber}</p>
                <p className="text-slate-600">Assigned Depot: <strong className="text-[#6B1870]">{citizen.assignedFpsId}</strong> (Ward {citizen.ward}, {citizen.district})</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Monthly Entitlement</span>
                  <strong className="text-sm text-[#2C0E38]">26.00 KG Grain</strong>
                </div>
                <button
                  onClick={() => setActiveModalFeature('slot_booking')}
                  className="px-4 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Manage e-Token Slot
                </button>
              </div>
            </div>

            {/* Dual Phase Slot Booking Inline */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-purple-100">
              <SlotBookingComponent />
            </div>
          </div>
        )}

        {currentRole === 'dealer' && dealerAuth && (
          <div className="mt-8 pt-6 border-t border-purple-200/80">
            <FpsDealerView />
          </div>
        )}

        {currentRole === 'officer' && officerAuth && (
          <div className="mt-8 pt-6 border-t border-purple-200/80">
            <OfficerSuite />
          </div>
        )}

        {/* NOT LOGGED IN CALL TO ACTION */}
        {!currentRole && (
          <div className="mt-10 p-6 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-[#2C0E38]">
                {language === 'kn' ? 'ಪಡಿತರ ಚೀಟಿ ಫಲಾನುಭವಿ ಅಥವಾ ಅಧಿಕೃತ ಲಾಗಿನ್' : 'Citizen Beneficiary or Officer Sign In'}
              </h4>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಮಾಸಿಕ ರೇಷನ್ ಕೋಟಾ, ಇ-ಟೋಕನ್ ಬುಕಿಂಗ್ ಮತ್ತು ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ವಿವರಗಳನ್ನು ಪ್ರವೇಶಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.'
                  : 'Sign in with your Ration Card or Official Department ID to unlock personalized e-tokens, slot booking, and supply tracking.'}
              </p>
            </div>

            <button
              onClick={onGoToLogin}
              className="px-6 py-2.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold font-sans shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
            >
              {language === 'kn' ? 'ಲಾಗಿನ್ ಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Go to Login Portal'}
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. INTERACTIVE SERVICE MODAL DIALOGS                     */}
      {/* ========================================================= */}
      {activeModalFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Dialog Top Bar */}
            <div className="bg-gradient-to-r from-[#2C0E38] to-[#481656] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans font-bold text-[#FFD700] uppercase tracking-wider">
                  Official ePDS Service
                </span>
                <h3 className="text-lg font-bold text-white capitalize">
                  {services.find((s) => s.featureKey === activeModalFeature)?.name || 'PDS Service'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalFeature(null)}
                className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-purple-900/60 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dialog Body Content */}
            <div className="p-5 sm:p-6 font-sans text-xs space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Feature: Dual-Phase Slot Booking */}
              {activeModalFeature === 'slot_booking' && (
                <div className="space-y-4">
                  <p className="text-slate-600">
                    Karnataka Food & Civil Supplies Department dual-phase pre-booking ensures zero queues at fair price shops.
                  </p>
                  <SlotBookingComponent />
                </div>
              )}

              {/* Feature: Quota Passbook */}
              {activeModalFeature === 'quota_passbook' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900">
                    <h4 className="font-bold text-sm text-[#2C0E38]">
                      Monthly Entitlement: {activeBeneficiary.cardType}
                    </h4>
                    <p className="text-xs mt-1">
                      Beneficiary: <strong>{activeBeneficiary.headOfHousehold}</strong> ({activeBeneficiary.rationCardNumber})
                    </p>
                  </div>

                  <div className="border border-purple-100 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-purple-50 text-[#2C0E38] font-bold">
                        <tr>
                          <th className="p-3">Commodity</th>
                          <th className="p-3">Monthly Allocation</th>
                          <th className="p-3">Price / KG</th>
                          <th className="p-3">Total Payable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100">
                        <tr>
                          <td className="p-3 font-medium">Fortified Rice (ಅನ್ನಭಾಗ್ಯ)</td>
                          <td className="p-3 font-bold text-[#6B1870]">20.00 KG</td>
                          <td className="p-3 text-emerald-700 font-bold">₹0.00 (Free)</td>
                          <td className="p-3 font-bold">₹0.00</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Wheat (ಗೋಧಿ)</td>
                          <td className="p-3 font-bold text-[#6B1870]">5.00 KG</td>
                          <td className="p-3 text-emerald-700 font-bold">₹0.00 (Free)</td>
                          <td className="p-3 font-bold">₹0.00</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Refined Sugar (ಸಕ್ಕರೆ)</td>
                          <td className="p-3 font-bold text-[#6B1870]">1.00 KG</td>
                          <td className="p-3 text-slate-700">₹13.50 / KG</td>
                          <td className="p-3 font-bold">₹13.50</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-emerald-900">Biometric POS Status:</span>
                    <span className="text-emerald-700 font-bold">Aadhaar Linked & Ready for Collection</span>
                  </div>
                </div>
              )}

              {/* Feature: Live Grain Truck GPS (Internal Logistics: DSO & Dealer Exclusive) */}
              {activeModalFeature === 'live_truck_gps' && (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                        Department Fleet Security Policy
                      </span>
                      <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                        Under National Food Security Act & Karnataka ePDS protocols, live wholesale grain truck GPS feeds, driver mobile communication, and electronic weighbridge waybills are <strong>restricted exclusively to District Supply Officers (DSO) and Authorized Fair Price Shop Dealers</strong>.
                      </p>
                      <p className="text-[11px] text-amber-700 mt-1">
                        Truck tracking is not visible in citizen beneficiary logins to protect secure transit corridors.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-center">
                      Select Authorized Logistics Role to View Assigned Trucks:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setOfficerAuth(true);
                          setCurrentRole('officer');
                          setActiveModalFeature(null);
                        }}
                        className="p-3 bg-[#0E7C7B] hover:bg-[#0A6362] text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span>DSO Command Center</span>
                        <span className="text-[10px] text-teal-100 font-normal">View all district shops & trucks</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDealerAuth(true);
                          setCurrentRole('dealer');
                          setActiveModalFeature(null);
                        }}
                        className="p-3 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Store className="w-5 h-5" />
                        <span>FPS Licensed Dealer</span>
                        <span className="text-[10px] text-purple-200 font-normal">View truck assigned to your depot</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Feature: Digital e-Token */}
              {activeModalFeature === 'digital_token' && (
                <div className="text-center space-y-3 p-4">
                  <div className="w-48 h-48 bg-white border-2 border-[#6B1870] rounded-2xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner">
                    <QrCode className="w-28 h-28 text-[#2C0E38]" />
                    <span className="text-[11px] font-mono font-black text-[#6B1870] mt-1">
                      {activeToken?.tokenId || 'TKN-2026-09-8829'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#2C0E38]">Official ePDS Digital Token</h4>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Show this virtual token at Fair Price Shop <strong>{activeBeneficiary.assignedFpsName}</strong> on your scheduled collection shift.
                  </p>
                </div>
              )}

              {/* Feature: General Details for Other Services */}
              {!['slot_booking', 'quota_passbook', 'live_truck_gps', 'digital_token'].includes(activeModalFeature) && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <h4 className="font-bold text-sm text-[#2C0E38] capitalize">
                      {services.find((s) => s.featureKey === activeModalFeature)?.name || 'PDS Service Feature'}
                    </h4>
                    <p className="text-slate-600 mt-1">
                      This service is integrated with the Karnataka Food & Civil Supplies real-time database. All transactions are logged with anti-pilferage digital safeguards.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white border border-purple-100 rounded-xl">
                      <span className="text-slate-500 block">Department Verification</span>
                      <strong className="text-emerald-700 font-bold">100% Certified</strong>
                    </div>
                    <div className="p-3 bg-white border border-purple-100 rounded-xl">
                      <span className="text-slate-500 block">Toll-Free Grievance</span>
                      <strong className="text-[#6B1870] font-bold">Dial 1967</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="bg-purple-50/60 p-4 border-t border-purple-100 flex items-center justify-end font-sans">
              <button
                onClick={() => setActiveModalFeature(null)}
                className="px-5 py-2 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. LIVE SUPPLY BROADCAST MODAL                            */}
      {/* ========================================================= */}
      {showLiveStreamModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-purple-200 overflow-hidden">
            <div className="bg-[#2C0E38] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h4 className="font-bold text-sm">Karnataka State PDS Live Broadcast</h4>
              </div>
              <button
                onClick={() => setShowLiveStreamModal(false)}
                className="p-1 rounded-full text-purple-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4 font-sans text-xs">
              <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-4">
                <Play className="w-12 h-12 text-[#FFD700] mb-2" />
                <p className="font-bold text-sm">Official Supply Stream: Yeshwanthpur Godown #01</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Transmitting electronic weighbridge logs and grain bag loading in real-time.
                </p>
              </div>

              <p className="text-slate-600">
                Department CCTV and GPS streams are publicly auditable to maintain zero diversion of public grain stocks.
              </p>

              <button
                onClick={() => setShowLiveStreamModal(false)}
                className="px-6 py-2 bg-[#6B1870] text-white rounded-xl font-bold cursor-pointer hover:bg-[#57135C]"
              >
                Done Watching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
