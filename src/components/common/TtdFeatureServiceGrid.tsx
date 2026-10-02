import React, { useState } from 'react';
import {
  Calendar,
  Wheat,
  MapPin,
  Fingerprint,
  Cpu,
  Receipt,
  Truck,
  Award,
  Database,
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { speakAloud } from '../../utils/audioSpeech';

interface FeatureService {
  id: string;
  titleKn: string;
  titleEn: string;
  subtitleKn: string;
  subtitleEn: string;
  icon: React.ReactNode;
  statusTextKn: string;
  statusTextEn: string;
  category: 'citizen' | 'authority' | 'dealer' | 'general';
  actionType: 'open_modal' | 'route_role' | 'maps' | 'info';
  targetRole?: 'citizen' | 'officer' | 'dealer';
  details: {
    descriptionKn: string;
    descriptionEn: string;
    keyPoints: string[];
  };
}

export const TtdFeatureServiceGrid: React.FC = () => {
  const {
    language,
    setCurrentRole,
    setCitizenAuth,
    setOfficerAuth,
    setDealerAuth,
    setOfficerTier,
    openMapsModal,
  } = usePds();

  const [selectedFeature, setSelectedFeature] = useState<FeatureService | null>(null);

  const features: FeatureService[] = [
    {
      id: 'prebooking_token',
      titleKn: 'ಮುಂಗಡ ಇ-ಟೋಕನ್ ಬುಕಿಂಗ್',
      titleEn: 'Ration Pre-Booking Token',
      subtitleKn: 'ದಿನ ಮತ್ತು 2 ಗಂಟೆಗಳ ಸಮಯ ಆಯ್ಕೆ',
      subtitleEn: 'Pick Date & 2-Hour Time Slot',
      icon: <Calendar className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಸಕ್ರಿಯವಾಗಿದೆ',
      statusTextEn: 'ACTIVE & LIVE',
      category: 'citizen',
      actionType: 'route_role',
      targetRole: 'citizen',
      details: {
        descriptionKn: 'ಪಡಿತರ ಚೀಟಿದಾರರು ಸರತಿ ಸಾಲನ್ನು ತಪ್ಪಿಸಲು ತಮ್ಮ ಅನುಕೂಲಕರ ದಿನ ಮತ್ತು ಸಮಯದ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ ಇ-ಟೋಕನ್ ಪಡೆಯಬಹುದು.',
        descriptionEn: 'Beneficiaries can pre-book their distribution date and 2-hour collection time slot to completely eliminate queues at Fair Price Shops.',
        keyPoints: [
          'Choose convenient 2-hour window (9AM-11AM, 11AM-1PM, 2PM-4PM, 4PM-6PM)',
          'Instant QR Code Virtual Token generated on phone',
          'Priority counter access with guaranteed grain bag allocation',
        ],
      },
    },
    {
      id: 'quota_stock',
      titleKn: 'ಮಾಸಿಕ ಧಾನ್ಯ ಕೋಟಾ & ದಾಸ್ತಾನು',
      titleEn: 'Monthly Quota & Stock Balance',
      subtitleKn: '100% ಉಚಿತ ಅಕ್ಕಿ ಮತ್ತು ಗೋಧಿ',
      subtitleEn: 'NFSA & Anna Bhagya 100% Free',
      icon: <Wheat className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಲಭ್ಯವಿದೆ',
      statusTextEn: 'ALLOCATED',
      category: 'citizen',
      actionType: 'route_role',
      targetRole: 'citizen',
      details: {
        descriptionKn: 'ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಭದ್ರತಾ ಕಾಯ್ದೆ ಮತ್ತು ಕರ್ನಾಟಕ ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆಯಡಿಯಲ್ಲಿ ಬಿಡುಗಡೆಯಾದ ಮಾಸಿಕ ಆಹಾರ ಧಾನ್ಯ ಕೋಟಾ ಪರಿಶೀಲನೆ.',
        descriptionEn: 'Check statutory monthly grain entitlement under NFSA and Karnataka Anna Bhagya scheme for BPL / AAY households.',
        keyPoints: [
          '5 kg free rice per beneficiary under NFSA Central Pool',
          'Additional 5 kg rice / equivalent cash subsidy under Karnataka Anna Bhagya',
          'Live shop inventory balance with electronic scale verification',
        ],
      },
    },
    {
      id: 'fps_locator',
      titleKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಹುಡುಕಾಟ',
      titleEn: 'Fair Price Shop (FPS) Locator',
      subtitleKn: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಮೂಲಕ ಅಧಿಕೃತ ವಿಳಾಸ',
      subtitleEn: 'Google Maps Verified Geolocation',
      icon: <MapPin className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಜಿಪಿಎಸ್ ಸಕ್ರಿಯ',
      statusTextEn: 'GPS GROUNDED',
      category: 'general',
      actionType: 'maps',
      details: {
        descriptionKn: 'ನಿಮ್ಮ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಅಧಿಕೃತ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ, ವಿಳಾಸ, ಸಂಪರ್ಕ ಸಂಖ್ಯೆ ಮತ್ತು ತೆರೆಯುವ ಸಮಯವನ್ನು ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ನೋಡಿ.',
        descriptionEn: 'Find nearest authorized Fair Price Shops, operating hours, dealer contact details, and driving directions on Google Maps.',
        keyPoints: [
          'Verified GPS coordinates for all 842 Bengaluru Urban FPS locations',
          'Operating hours: 8:00 AM to 12:00 PM & 4:00 PM to 8:00 PM',
          'Direct navigation and contact info for fair price dealers',
        ],
      },
    },
    {
      id: 'aadhaar_ekyc',
      titleKn: 'ಆಧಾರ್ ಇ-ಕೆವೈಸಿ ಬಯೋಮೆಟ್ರಿಕ್',
      titleEn: 'Aadhaar Biometric e-KYC',
      subtitleKn: 'ನಕಲಿ ಕಾರ್ಡ್ ರದ್ದತಿ ಮತ್ತು ದೃಢೀಕರಣ',
      subtitleEn: 'Anti-Duplication & UIDAI Verification',
      icon: <Fingerprint className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: '99.4% ಮುಕ್ತಾಯ',
      statusTextEn: 'UIDAI SEEDED',
      category: 'citizen',
      actionType: 'info',
      details: {
        descriptionKn: 'ಎಲ್ಲಾ ಕುಟುಂಬ ಸದಸ್ಯರ ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಸೀಡಿಂಗ್ ಮತ್ತು ವಾರ್ಡ್ ಮಟ್ಟದ ಆಹಾರ ನಿರೀಕ್ಷಕರ ಪರಿಶೀಲನೆ.',
        descriptionEn: '100% Aadhaar biometric de-duplication linking to eliminate ghost ration cards and authenticate genuine family beneficiaries.',
        keyPoints: [
          'UIDAI lease line direct verification with 410ms response latency',
          'Instant biometric verification at any Fair Price Shop ePoS',
          'Nominee addition available for senior citizens & disabled members',
        ],
      },
    },
    {
      id: 'epos_dispense',
      titleKn: 'ಇ-ಪಿಒಎಸ್ ಬಯೋಮೆಟ್ರಿಕ್ ವಿತರಣೆ',
      titleEn: 'ePoS Biometric Dispensation',
      subtitleKn: 'ವಿದ್ಯುನ್ಮಾನ ತೂಕ ಮಾಪಕ ಸಂಯೋಜನೆ',
      subtitleEn: 'Electronic Weigh Scale Integration',
      icon: <Cpu className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಆನ್‌ಲೈನ್',
      statusTextEn: 'ONLINE POS',
      category: 'dealer',
      actionType: 'route_role',
      targetRole: 'dealer',
      details: {
        descriptionKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಯಲ್ಲಿ ಇ-ಪಿಒಎಸ್ ಮಷಿನ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ವೇಯಿಂಗ್ ಸ್ಕೇಲ್ ಮೂಲಕ ನಿಖರ ಧಾನ್ಯ ವಿತರಣೆ.',
        descriptionEn: 'Point of Sale (ePoS) terminal paired with electronic weighing scales ensures zero-shortage distribution upon biometric thumbprint.',
        keyPoints: [
          'Direct Bluetooth pairing with electronic weighing scales',
          'Instant printed receipt and SMS confirmation to cardholder',
          'Offline buffering support during network latency',
        ],
      },
    },
    {
      id: 'dbt_ledger',
      titleKn: 'ಅನ್ನಭಾಗ್ಯ ಡಿಬಿಟಿ ಜಮೆ ವಿವರ',
      titleEn: 'Anna Bhagya DBT Subsidy Ledger',
      subtitleKn: 'ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಲೆಕ್ಕಪತ್ರ',
      subtitleEn: 'Direct Benefit Transfer Accounting',
      icon: <Receipt className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಖಾತೆಗೆ ಜಮೆ',
      statusTextEn: 'DIRECT TO BANK',
      category: 'citizen',
      actionType: 'info',
      details: {
        descriptionKn: 'ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆಯ ಹೆಚ್ಚುವರಿ 5 ಕೆಜಿ ಅಕ್ಕಿಯ ಮೊತ್ತವು ಕುಟುಂಬದ ಯಜಮಾನಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆಯಾಗುವ ವಿವರ.',
        descriptionEn: 'Direct Benefit Transfer (DBT) transfer logs credited directly to the woman head of household bank account under Karnataka Anna Bhagya.',
        keyPoints: [
          '₹170 per person transferred monthly via PFMS / NPCI gateway',
          'Direct credit SMS sent to linked Aadhaar mobile number',
          'Zero intermediary deduction with automated bank reconciliation',
        ],
      },
    },
    {
      id: 'fci_allocation',
      titleKn: 'ಕೇಂದ್ರ ಎಫ್‌ಸಿಐ ಸರಬರಾಜು & ಆರ್‌ಒ',
      titleEn: 'Central FCI Allocation & Release Orders',
      subtitleKn: 'ಕೇಂದ್ರ ಗೋದಾಮುಗಳಿಂದ ಧಾನ್ಯ ಬಿಡುಗಡೆ',
      subtitleEn: 'Bulk Rail Rakes & Release Orders',
      icon: <Truck className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: '2.17 ಲಕ್ಷ ಮೆ.ಟನ್',
      statusTextEn: 'CENTRAL POOL',
      category: 'authority',
      actionType: 'route_role',
      targetRole: 'officer',
      details: {
        descriptionKn: 'ಭಾರತೀಯ ಆಹಾರ ನಿಗಮ (ಎಫ್‌ಸಿಐ) ಬೆಂಗಳೂರು ಪ್ರಾದೇಶಿಕ ಕಚೇರಿಯಿಂದ ಕರ್ನಾಟಕಕ್ಕೆ ಬಿಡುಗಡೆಯಾಗುವ ಡಿಜಿಟಲ್ ರಿಲೀಸ್ ಆರ್ಡರ್ (ಆರ್‌ಒ).',
        descriptionEn: 'Food Corporation of India (FCI) Regional Office bulk releases from 24 base godowns across Karnataka to state wholesale depots.',
        keyPoints: [
          '2,17,400 Metric Tonnes monthly NFSA allocation from FCI Base silos',
          'Railway siding mechanized unloading at Yeshwanthpur & Hubballi hubs',
          'Digital Release Order (RO) workflow with paperless state clearance',
        ],
      },
    },
    {
      id: 'faq_testing',
      titleKn: 'ಧಾನ್ಯ ಗುಣಮಟ್ಟ ಪ್ರಮಾಣೀಕರಣ (FAQ)',
      titleEn: 'Fair Average Quality (FAQ) Testing',
      subtitleKn: 'ಪ್ರಯೋಗಾಲಯ ತಪಾಸಣೆ ಪ್ರಮಾಣಪತ್ರ',
      subtitleEn: 'Lab Moisture & Purity Certification',
      icon: <Award className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: '99.8% ಉತ್ತೀರ್ಣ',
      statusTextEn: 'FAQ CERTIFIED',
      category: 'authority',
      actionType: 'info',
      details: {
        descriptionKn: 'ಕೆಎಫ್‌ಸಿಎಸ್‌ಸಿ ಗೋದಾಮುಗಳಲ್ಲಿ ಧಾನ್ಯ ಸ್ವೀಕರಿಸುವ ಮುನ್ನ ತೇವಾಂಶ, ಮುರಿದ ಕಾಳುಗಳು ಮತ್ತು ಕಸದ ಪ್ರಮಾಣವನ್ನು ಪರೀಕ್ಷಿಸುವ ಕಡ್ಡಾಯ ಪ್ರಕ್ರಿಯೆ.',
        descriptionEn: 'Mandatory Fair Average Quality (FAQ) testing before grain is accepted into state godowns: moisture <= 14%, broken grains <= 5%.',
        keyPoints: [
          'Batch #FAQ-KAR-9941 raw rice certified at Yeshwanthpur quality lab',
          'Strict ban on sub-standard, discolored, or infested grain stocks',
          'Digital quality certificate stamped onto dispatch gate pass',
        ],
      },
    },
    {
      id: 'nic_fist',
      titleKn: 'ಎನ್‌ಐಸಿ ಫಿಸ್ಟ್ ಡಿಜಿಟಲ್ ಲೆಕ್ಕಪತ್ರ',
      titleEn: 'NIC FIST Financial & Stock Platform',
      subtitleKn: 'ಸರಬರಾಜು ಸರಪಳಿಯ ನೈಜ ಸಮಯದ ಟ್ರಯಲ್',
      subtitleEn: 'End-to-End Accounting & DBT',
      icon: <Database className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: '100% ಟ್ರ್ಯಾಕಿಂಗ್',
      statusTextEn: 'NIC GATEKEEPER',
      category: 'authority',
      actionType: 'route_role',
      targetRole: 'officer',
      details: {
        descriptionKn: 'ರಾಷ್ಟ್ರೀಯ ಮಾಹಿತಿ ಕೇಂದ್ರ (ಎನ್‌ಐಸಿ) ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ ಫಿಸ್ಟ್ ಸಾಫ್ಟ್‌ವೇರ್ ಮೂಲಕ ಸಂಪೂರ್ಣ ಆಹಾರ ಧಾನ್ಯ ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ.',
        descriptionEn: 'National Informatics Centre (NIC) FIST platform logs every quintal of grain from FCI base godown to citizen ePoS and automates dealer commissions.',
        keyPoints: [
          '1,48,290 transactions per hour peak ePoS processing speed',
          'Automated Direct Benefit Transfer (DBT) commission payout to FPS dealers',
          'Complete audit trail compliant with Comptroller and Auditor General standards',
        ],
      },
    },
    {
      id: 'tollfree_help',
      titleKn: 'ಆಹಾರ ಸಹಾಯವಾಣಿ 1967 (ಉಚಿತ)',
      titleEn: 'Toll-Free Citizen Helpline 1967',
      subtitleKn: 'ದೂರು, ಸಲಹೆ ಮತ್ತು ಬೆಂಬಲ ಸೇವೆ',
      subtitleEn: 'Grievance Redressal & Support',
      icon: <PhoneCall className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: '24x7 ಸಕ್ರಿಯ',
      statusTextEn: 'TOLL-FREE 1967',
      category: 'general',
      actionType: 'info',
      details: {
        descriptionKn: 'ಪಡಿತರ ವಿತರಣೆಯಲ್ಲಿ ಯಾವುದೇ ಲೋಪ, ತೂಕದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಅಥವಾ ತೊಂದರೆಗಳಿದ್ದಲ್ಲಿ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ ದೂರು ದಾಖಲಿಸಿ.',
        descriptionEn: 'Official Department toll-free helpline 1967 / 1800-425-9333 for immediate grievance registration and query redressal.',
        keyPoints: [
          'Toll-Free Helpline: 1967 (Direct Department Helpline)',
          'State Control Room: 1800-425-9333 (Toll-Free)',
          'SMS Grievance Tracking with 48-hour resolution mandate',
        ],
      },
    },
    {
      id: 'shop_timetable',
      titleKn: '15 ದಿನಗಳ ವಿತರಣಾ ವೇಳಾಪಟ್ಟಿ',
      titleEn: '15-Day Distribution Timetable',
      subtitleKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ತೆರೆಯುವ ವೇಳಾಪಟ್ಟಿ',
      subtitleEn: 'Pre-Notified FPS Working Hours',
      icon: <Clock className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಪ್ರಕಟಿಸಲಾಗಿದೆ',
      statusTextEn: 'TIMETABLE PUBLISHED',
      category: 'dealer',
      actionType: 'route_role',
      targetRole: 'dealer',
      details: {
        descriptionKn: 'ಪ್ರತಿ ತಿಂಗಳ 1 ರಿಂದ 20 ನೇ ತಾರೀಖಿನವರೆಗೆ ಕಡ್ಡಾಯವಾಗಿ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ತೆರೆದಿರುವ ದಿನ ಮತ್ತು ಸಮಯದ ಅಧಿಕೃತ ಪ್ರಕಟಣೆ.',
        descriptionEn: 'Statutory 15-day distribution roster pre-notified by fair price dealers so cardholders can collect grains without rush.',
        keyPoints: [
          'Daily working hours: 8:00 AM - 12:00 PM and 4:00 PM - 8:00 PM',
          'Dedicated senior citizen hours: 8:00 AM - 9:30 AM',
          'Notice board display at every licensed fair price shop',
        ],
      },
    },
    {
      id: 'officer_command',
      titleKn: 'ಜಿಲ್ಲಾ ಆಹಾರ ನಿಯಂತ್ರಣ ಕೊಠಡಿ (DSO)',
      titleEn: 'District Supply Officer (DSO) Command',
      subtitleKn: 'ಎಐ ಹಂಚಿಕೆ ಅನುಮೋದನೆ ಮತ್ತು ಫ್ಲೀಟ್',
      subtitleEn: 'AI Dispatch Sign-Off & Fleet GPS',
      icon: <ShieldCheck className="w-8 h-8 text-[#DAA520]" />,
      statusTextKn: 'ಪೂರ್ಣ ನಿಯಂತ್ರಣ',
      statusTextEn: 'FULL OPS COMMAND',
      category: 'authority',
      actionType: 'route_role',
      targetRole: 'officer',
      details: {
        descriptionKn: 'ಜಿಲ್ಲಾ ಆಹಾರ ಮತ್ತು ನಾಗರಿಕ ಸರಬರಾಜು ಅಧಿಕಾರಿ (ಡಿಎಸ್‌ಒ) ಮೂಲಕ ಎಐ ಶಿಫಾರಸು ಮಾಡಿದ ಧಾನ್ಯ ಸರಬರಾಜು ಅನುಮೋದನೆ ಮತ್ತು ಲಾರಿಗಳ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್.',
        descriptionEn: 'District Supply Officer (DSO) full operational control room for AI-driven buffer godown dispatch sign-offs and live GPS fleet monitoring.',
        keyPoints: [
          'Predictive supply heatmap forecasting rush and migrant surges',
          'Real-time GPS tracking of food grain transport trucks with geofencing',
          'Immediate emergency quota releases to deficit fair price shops',
        ],
      },
    },
  ];

  const handleFeatureClick = (feat: FeatureService) => {
    if (feat.actionType === 'maps') {
      openMapsModal('Authorized Fair Price Shops and Food & Civil Supplies Offices Bengaluru Karnataka');
      return;
    }

    if (feat.actionType === 'route_role' && feat.targetRole) {
      if (feat.targetRole === 'citizen') {
        setCitizenAuth(true);
        setCurrentRole('citizen');
      } else if (feat.targetRole === 'dealer') {
        setDealerAuth(true);
        setCurrentRole('dealer');
      } else if (feat.targetRole === 'officer') {
        setOfficerTier('dso');
        setOfficerAuth(true);
        setCurrentRole('officer');
      }
      return;
    }

    // Default: Show detailed official modal
    setSelectedFeature(feat);
    speakAloud(
      language === 'kn'
        ? `${feat.titleKn}. ${feat.subtitleKn}. ವಿವರಗಳಿಗಾಗಿ ಕೆಳಗೆ ನೋಡಿ.`
        : `${feat.titleEn}. ${feat.subtitleEn}.`,
      language
    );
  };

  return (
    <div className="space-y-4">
      {/* TTD-Style Section Banner */}
      <div className="text-center py-2 border-b-2 border-[#D4AF37] relative">
        <div className="inline-block bg-[#7B1113] text-[#FFD700] px-6 py-1.5 rounded-sm font-serif font-black tracking-widest text-sm sm:text-base uppercase shadow-xs border border-[#D4AF37]">
          {language === 'kn' ? 'ಆಹಾರ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು' : 'OFFICIAL E-PDS ONLINE SERVICES'}
        </div>
        <p className="text-xs text-[#5C080A] font-medium mt-1">
          {language === 'kn'
            ? 'ಕೆಳಗಿನ ಸೇವಾ ಐಕಾನ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯಾ ಸೇವೆಯನ್ನು ತಕ್ಷಣ ಪಡೆಯಿರಿ'
            : 'Select any official service icon below to directly access features'}
        </p>
      </div>

      {/* TTD Signature Grid: Pure, Crisp, High-Contrast Service Icon Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((feat) => {
          return (
            <div
              key={feat.id}
              onClick={() => handleFeatureClick(feat)}
              className="bg-[#FFFDF7] hover:bg-[#FFF9E6] border-2 border-[#D4AF37] hover:border-[#7B1113] rounded-sm p-4 text-center cursor-pointer transition-all duration-150 hover:shadow-md flex flex-col items-center justify-between group relative"
            >
              {/* Top Status Pill */}
              <div className="w-full flex items-center justify-between text-[10px] mb-2 pb-1 border-b border-[#EAD5A0]">
                <span className="font-bold text-[#7B1113] tracking-wider uppercase font-mono">
                  {feat.category.toUpperCase()}
                </span>
                <span className="font-bold bg-[#7B1113] text-[#FFD700] px-1.5 py-0.5 rounded-xs font-mono text-[9px]">
                  {language === 'kn' ? feat.statusTextKn : feat.statusTextEn}
                </span>
              </div>

              {/* Core Feature Icon inside TTD Sacred Gold Roundel */}
              <div className="w-16 h-16 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center my-2 shadow-inner group-hover:scale-105 transition-transform">
                {feat.icon}
              </div>

              {/* Feature Titles */}
              <div className="mt-1 space-y-1 w-full">
                <h4 className="text-xs sm:text-sm font-black text-[#5C080A] font-serif leading-snug group-hover:text-[#7B1113]">
                  {language === 'kn' ? feat.titleKn : feat.titleEn}
                </h4>
                <p className="text-[11px] text-[#7A5023] font-medium leading-tight">
                  {language === 'kn' ? feat.subtitleKn : feat.subtitleEn}
                </p>
              </div>

              {/* Action Button Strip */}
              <div className="w-full mt-3 pt-2 border-t border-[#EAD5A0]">
                <button
                  type="button"
                  className="w-full py-1.5 bg-[#7B1113] group-hover:bg-[#5C080A] text-[#FFD700] text-[11px] font-black uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>{language === 'kn' ? 'ಪ್ರವೇಶಿಸಿ' : 'ACCESS'}</span>
                  <ArrowRight className="w-3 h-3 text-[#FFD700]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Details Modal (TTD Temple Scroll Aesthetic) */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFFDF7] border-4 border-[#7B1113] rounded-sm max-w-lg w-full p-6 text-left shadow-2xl relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-[#D4AF37] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#7B1113] border-2 border-[#D4AF37] flex items-center justify-center">
                  {selectedFeature.icon}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-serif text-[#5C080A]">
                    {language === 'kn' ? selectedFeature.titleKn : selectedFeature.titleEn}
                  </h3>
                  <p className="text-xs font-bold text-[#DAA520]">
                    {language === 'kn' ? selectedFeature.subtitleKn : selectedFeature.subtitleEn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1 rounded-sm text-[#7B1113] hover:bg-[#7B1113] hover:text-[#FFD700] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="py-4 space-y-3 text-xs leading-relaxed text-[#2A1608]">
              <p className="font-medium">
                {language === 'kn'
                  ? selectedFeature.details.descriptionKn
                  : selectedFeature.details.descriptionEn}
              </p>

              <div className="p-3 bg-[#FFF8E7] rounded-sm border border-[#D4AF37] space-y-1.5">
                <span className="font-black text-[#5C080A] uppercase tracking-wider block text-[11px]">
                  {language === 'kn' ? 'ಪ್ರಮುಖ ಮುಖ್ಯಾಂಶಗಳು:' : 'KEY SPECIFICATIONS:'}
                </span>
                <ul className="space-y-1 text-[#4A2609]">
                  {selectedFeature.details.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7B1113] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 border-t-2 border-[#D4AF37] pt-3">
              <button
                onClick={() => setSelectedFeature(null)}
                className="px-4 py-2 border border-[#7B1113] text-[#7B1113] font-black text-xs uppercase tracking-wider rounded-xs hover:bg-[#FFF3CD]"
              >
                {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'CLOSE'}
              </button>
              {selectedFeature.targetRole && (
                <button
                  onClick={() => {
                    const r = selectedFeature.targetRole!;
                    setSelectedFeature(null);
                    if (r === 'citizen') {
                      setCitizenAuth(true);
                      setCurrentRole('citizen');
                    } else if (r === 'dealer') {
                      setDealerAuth(true);
                      setCurrentRole('dealer');
                    } else if (r === 'officer') {
                      setOfficerTier('dso');
                      setOfficerAuth(true);
                      setCurrentRole('officer');
                    }
                  }}
                  className="px-4 py-2 bg-[#7B1113] text-[#FFD700] border border-[#D4AF37] font-black text-xs uppercase tracking-wider rounded-xs hover:bg-[#5C080A] flex items-center gap-1.5"
                >
                  <span>{language === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ ಮುಂದುವರಿಯಿರಿ' : 'PROCEED TO MODULE'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD700]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
