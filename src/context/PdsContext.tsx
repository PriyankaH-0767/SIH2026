import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  OfficerTier,
  CitizenProfile,
  FPSShop,
  DispatchRecommendation,
  InspectionTask,
  AppNotification,
  GrievanceTicket,
  BookingSlot,
  VirtualToken,
  MigrantPortabilitySpike,
  IntentCyclePhase,
  SlotIntentRecord,
  FpsDistributionSchedule,
  SlotBookingState,
  DistrictAuthorityRecord,
  BeneficiaryRecord,
  PortabilityLocationHistoryItem,
} from '../types/pds';
import {
  INITIAL_CITIZEN,
  INITIAL_SHOPS,
  INITIAL_DISPATCHES,
  INITIAL_INSPECTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_GRIEVANCES,
  INITIAL_BOOKING_SLOTS,
  INITIAL_VIRTUAL_TOKENS,
  INITIAL_MIGRANT_SPIKES,
} from '../data/mockData';
import { TRANSLATIONS, TranslationStrings } from '../data/translations';
import {
  auth,
  testConnection,
  signInWithGoogle,
  logOutUser,
} from '../firebase/config';
import {
  initializePdsDatabase,
  bookBeneficiarySlotInDb,
  markRationDisbursedInDb,
} from '../firebase/db';
import {
  SEED_BENEFICIARIES,
  SEED_DISTRICT_AUTHORITIES,
  SEED_FPS_DEALERS,
} from '../firebase/seedData';
import { onAuthStateChanged, User } from 'firebase/auth';

interface VoiceInputState {
  isOpen: boolean;
  targetFieldLabel: string;
  onConfirm: (text: string) => void;
  presetText?: string;
}

interface BlastModalState {
  isOpen: boolean;
  fpsName: string;
  beneficiaryCount: number;
}

interface PdsContextType {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  hasSelectedInitialLanguage: boolean;
  setHasSelectedInitialLanguage: (val: boolean) => void;
  t: TranslationStrings;

  // Active Role & Auth
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;
  citizenAuth: boolean;
  setCitizenAuth: (auth: boolean) => void;
  dealerAuth: boolean;
  setDealerAuth: (auth: boolean) => void;
  officerAuth: boolean;
  setOfficerAuth: (auth: boolean) => void;
  logout: () => void;
  officerTier: OfficerTier;
  setOfficerTier: (tier: OfficerTier) => void;
  dealerShopId: string;
  setDealerShopId: (id: string) => void;

  // Core Data
  citizen: CitizenProfile;
  shops: FPSShop[];
  dispatches: DispatchRecommendation[];
  inspections: InspectionTask[];
  notifications: AppNotification[];
  grievances: GrievanceTicket[];

  // Intelligent PDS Optimization Framework (SIH Innovation)
  bookingSlots: BookingSlot[];
  virtualTokens: VirtualToken[];
  migrantSpikes: MigrantPortabilitySpike[];
  intentCyclePhase: IntentCyclePhase;
  setIntentCyclePhase: (phase: IntentCyclePhase) => void;
  activeToken: VirtualToken | null;
  bookSlot: (slotId: string, channel?: 'app' | 'ussd' | 'ivr_annavani') => VirtualToken;
  claimGracePassWalkin: (reason?: string) => VirtualToken;
  updateTokenStatus: (tokenId: string, status: VirtualToken['status']) => void;
  approveReroute: (spikeId: string) => void;
  
  // SIH Pitch Modal
  sihPitchModalOpen: boolean;
  setSihPitchModalOpen: (open: boolean) => void;

  // Fallback Channel Modal (USSD / Annavani IVR)
  fallbackModalOpen: boolean;
  setFallbackModalOpen: (open: boolean) => void;
  fallbackChannel: 'ussd' | 'ivr';
  setFallbackChannel: (ch: 'ussd' | 'ivr') => void;
  openFallbackModal: (channel: 'ussd' | 'ivr') => void;

  // Location Choice Window Logic & Debug Override
  forceWindowOpen: boolean;
  setForceWindowOpen: (open: boolean) => void;
  isWindowOpen: boolean;
  currentDayOfMonth: number;
  changeCitizenLocation: (fpsId: string, reason?: string) => void;
  setTemporaryPortabilityShop: (fpsId: string, distanceKm?: number) => void;
  revertToDefaultLocation: () => void;
  portabilityHistory: PortabilityLocationHistoryItem[];

  // 20-25th Monthly Slot Booking Lifecycle Framework
  slotIntent: SlotIntentRecord;
  saveLocationIntent: (fpsId: string, isExplicitPreBooking?: boolean) => void;
  announceDistributionSchedule: (fpsId: string, schedule: Partial<FpsDistributionSchedule>) => void;
  saveSlotIntent: (slotId: string, date: string, timeShift: string) => SlotIntentRecord;
  simulateMissedSlot: (reason?: string) => void;
  resetSlotForRebooking: () => void;
  collectRationWithToken: (tokenId?: string) => void;
  simulatedDayOfMonth: number;
  setSimulatedDayOfMonth: (day: number) => void;
  isBookingWindowAccessible: boolean;

  // Dedicated Monthly Distribution Cycle Slot Booking State
  slotBookingState: SlotBookingState;
  setSlotBookingState: React.Dispatch<React.SetStateAction<SlotBookingState>>;
  updateSelectedShop: (fpsId: string, isExplicitPreBooking?: boolean) => void;
  assignTimeSlot: (slotId: string, date: string, timeShift: string) => void;
  expireCurrentToken: (reason?: string) => void;
  checkTokenExpiration: () => boolean;
  resetExpiredTokenForRebooking: () => void;
  markTokenRationCollected: (tokenId?: string) => void;

  // DSO Monthly Demand Allocation Lock
  isDemandLockedByDso: boolean;
  lockMonthlyDemandByDso: () => void;

  // Core Interactive Cross-Role Actions
  startDistribution: (fpsId: string) => void;
  closeDistribution: (fpsId: string) => void;
  approveDispatch: (dispatchId: string, notes?: string) => void;
  modifyDispatch: (dispatchId: string, newCommodities: { name: string; quantityKg: number }[], notes?: string) => void;
  rejectDispatch: (dispatchId: string, reason: string) => void;
  advanceDispatchProgress: (dispatchId: string) => void;
  confirmTruckArrival: (dispatchId: string) => void;
  submitMonthEndLeftover: (
    fpsId: string,
    leftover: { rawRiceKg: number; wheatKg: number; sugarKg: number; dalKg: number }
  ) => void;
  submitInspectionReport: (
    taskId: string,
    report: {
      status: 'Completed' | 'Escalated';
      checklist: InspectionTask['checklist'];
      notes: string;
      audioNoteTranscript?: string;
      photoUrl?: string;
      escalatedToDso?: boolean;
      escalationReason?: string;
    }
  ) => void;
  submitGrievance: (category: string, description: string) => void;

  // Voice Input Helper
  voiceModal: VoiceInputState;
  openVoiceModal: (targetFieldLabel: string, onConfirm: (text: string) => void, presetText?: string) => void;
  closeVoiceModal: () => void;

  // 3-Channel Distribution Modal
  blastModal: BlastModalState;
  closeBlastModal: () => void;

  // Reset System State
  resetToDefault: () => void;

  // Firestore Persistent Multi-District Entities
  districtAuthoritiesList: DistrictAuthorityRecord[];
  beneficiariesList: BeneficiaryRecord[];
  activeDistrictAuthority: DistrictAuthorityRecord;
  activeBeneficiary: BeneficiaryRecord;
  switchBeneficiary: (benId: string) => void;
  switchDistrictAuthority: (distId: string) => void;
  switchDealer: (dealerId: string) => void;
  firebaseUser: User | null;
  handleGoogleSignIn: () => Promise<void>;
  isDbConnected: boolean;

  // Google Maps Grounding Modal
  mapsModal: {
    isOpen: boolean;
    query: string;
    location: { lat: number; lng: number };
    title: string;
  };
  openMapsModal: (query?: string, location?: { lat: number; lng: number }, title?: string) => void;
  closeMapsModal: () => void;
}

const PdsContext = createContext<PdsContextType | undefined>(undefined);

const STORAGE_KEY = 'pds_demandsync_state_v2';

export const PdsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [hasSelectedInitialLanguage, setHasSelectedInitialLanguage] = useState<boolean>(() => {
    return localStorage.getItem('pds_initial_lang_selected') === 'true';
  });

  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [citizenAuth, setCitizenAuth] = useState<boolean>(false);
  const [dealerAuth, setDealerAuth] = useState<boolean>(false);
  const [officerAuth, setOfficerAuth] = useState<boolean>(false);
  const [officerTier, setOfficerTier] = useState<OfficerTier>('dso');
  const [dealerShopId, setDealerShopId] = useState<string>('KA-BLR-FPS-104');

  const [districtAuthoritiesList, setDistrictAuthoritiesList] = useState<DistrictAuthorityRecord[]>(SEED_DISTRICT_AUTHORITIES);
  const [beneficiariesList, setBeneficiariesList] = useState<BeneficiaryRecord[]>(SEED_BENEFICIARIES);
  const [activeDistrictAuthority, setActiveDistrictAuthority] = useState<DistrictAuthorityRecord>(SEED_DISTRICT_AUTHORITIES[0]);
  const [activeBeneficiary, setActiveBeneficiary] = useState<BeneficiaryRecord>(SEED_BENEFICIARIES[0]);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  const [mapsModal, setMapsModal] = useState<{
    isOpen: boolean;
    query: string;
    location: { lat: number; lng: number };
    title: string;
  }>({
    isOpen: false,
    query: 'Fair Price Shop and Food & Civil Supplies Office near Malleshwaram Bengaluru',
    location: { lat: 13.0031, lng: 77.5701 },
    title: 'Karnataka PDS Verified Maps Grounding',
  });

  const openMapsModal = (
    query = 'Fair Price Shop and Food & Civil Supplies Office near Malleshwaram Bengaluru',
    location = { lat: 13.0031, lng: 77.5701 },
    title = 'Karnataka PDS Verified Maps Grounding'
  ) => {
    setMapsModal({ isOpen: true, query, location, title });
  };

  const closeMapsModal = () => {
    setMapsModal((prev) => ({ ...prev, isOpen: false }));
  };

  const logout = () => {
    setCurrentRole(null);
    setCitizenAuth(false);
    setDealerAuth(false);
    setOfficerAuth(false);
    logOutUser().catch(console.error);
  };

  useEffect(() => {
    testConnection().then((connected) => {
      setIsDbConnected(connected);
    });

    initializePdsDatabase().then((res) => {
      if (res.districts && res.districts.length > 0) {
        setDistrictAuthoritiesList(res.districts);
        setActiveDistrictAuthority(res.districts[0]);
      }
      if (res.dealers && res.dealers.length > 0) {
        setShops(res.dealers);
      }
      if (res.beneficiaries && res.beneficiaries.length > 0) {
        setBeneficiariesList(res.beneficiaries);
        setActiveBeneficiary(res.beneficiaries[0]);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  const switchBeneficiary = (benId: string) => {
    const found = beneficiariesList.find((b) => b.id === benId || b.rationCardNumber === benId) || SEED_BENEFICIARIES[0];
    setActiveBeneficiary(found);
    setCitizen({
      rationCardNumber: found.rationCardNumber,
      cardType: found.cardType,
      headOfHousehold: found.headOfHousehold,
      headOfHouseholdKn: found.headOfHouseholdKn,
      phoneNumber: found.phoneNumber,
      address: found.assignedFpsAddress,
      ward: found.ward,
      district: found.district,
      assignedFpsId: found.assignedFpsId,
      assignedFpsName: found.assignedFpsName,
      assignedFpsAddress: found.assignedFpsAddress,
      members: found.members,
      entitlements: found.entitlements,
      currentCycleCollected: found.currentCycleCollected,
      activeTokenNumber: found.activeTokenNumber || '',
    });
  };

  const switchDistrictAuthority = (distId: string) => {
    const found = districtAuthoritiesList.find((d) => d.id === distId || d.loginId === distId) || SEED_DISTRICT_AUTHORITIES[0];
    setActiveDistrictAuthority(found);
    setOfficerTier(found.tier);
  };

  const switchDealer = (dealerId: string) => {
    const found = shops.find((s) => s.id === dealerId) || shops[0];
    setDealerShopId(found.id);
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setFirebaseUser(user);
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const [citizen, setCitizen] = useState<CitizenProfile>(INITIAL_CITIZEN);
  const [shops, setShops] = useState<FPSShop[]>(INITIAL_SHOPS);
  const [dispatches, setDispatches] = useState<DispatchRecommendation[]>(INITIAL_DISPATCHES);
  const [inspections, setInspections] = useState<InspectionTask[]>(INITIAL_INSPECTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);

  // Intelligent PDS Optimization Framework State
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(INITIAL_BOOKING_SLOTS);
  const [virtualTokens, setVirtualTokens] = useState<VirtualToken[]>(INITIAL_VIRTUAL_TOKENS);
  const [migrantSpikes, setMigrantSpikes] = useState<MigrantPortabilitySpike[]>(INITIAL_MIGRANT_SPIKES);
  const [intentCyclePhase, setIntentCyclePhase] = useState<IntentCyclePhase>('days_1_5');
  const [sihPitchModalOpen, setSihPitchModalOpen] = useState<boolean>(false);
  const [fallbackModalOpen, setFallbackModalOpen] = useState<boolean>(false);
  const [fallbackChannel, setFallbackChannel] = useState<'ussd' | 'ivr'>('ussd');

  // Find active token for current citizen
  const activeToken = virtualTokens.find((vt) => vt.rationCardNumber === citizen.rationCardNumber) || null;

  const openFallbackModal = (channel: 'ussd' | 'ivr') => {
    setFallbackChannel(channel);
    setFallbackModalOpen(true);
  };

  // Book slot action (App / USSD / IVR)
  const bookSlot = (slotId: string, channel: 'app' | 'ussd' | 'ivr_annavani' = 'app') => {
    const slot = bookingSlots.find((s) => s.id === slotId) || bookingSlots[0];
    const shop = shops.find((s) => s.id === slot.fpsId) || shops[0];
    const tokenNumber = `TKN-2026-09-${Math.floor(1000 + Math.random() * 9000)}`;

    const newToken: VirtualToken = {
      tokenId: tokenNumber,
      rationCardNumber: citizen.rationCardNumber,
      beneficiaryName: citizen.headOfHousehold,
      headOfHouseholdKn: citizen.headOfHouseholdKn,
      fpsId: shop.id,
      fpsName: `${shop.name} (${shop.shopNumber})`,
      date: slot.date,
      timeShift: slot.timeShift,
      membersCount: citizen.members.length,
      totalGrainKg: 26,
      commoditiesSummary: '20kg Raw Rice, 5kg Wheat, 1kg Refined Sugar',
      bookedVia: channel,
      status: 'booked',
      isGracePass: false,
      qrPayload: `KAR-PDS-${tokenNumber}|${citizen.rationCardNumber}|26KG|${slot.id}|CONFIRMED`,
      smsSnippet: `ePDS-KA: Token #${tokenNumber.slice(-4)} confirmed for ${shop.shopNumber} on ${slot.date}, ${slot.timeShift}. 26kg grain. Mandatory Aadhaar ePoS scan required upon arrival.`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Update slots capacity
    setBookingSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const nextCount = s.bookedCount + 1;
          const status = nextCount >= s.capacity ? 'red' : nextCount >= s.capacity * 0.7 ? 'yellow' : 'green';
          return { ...s, bookedCount: nextCount, status };
        }
        return s;
      })
    );

    // Upsert token in virtual tokens list
    setVirtualTokens((prev) => [
      newToken,
      ...prev.filter((t) => t.rationCardNumber !== citizen.rationCardNumber),
    ]);

    // Update citizen profile active token number
    setCitizen((prev) => ({
      ...prev,
      activeTokenNumber: tokenNumber,
      assignedFpsId: shop.id,
      assignedFpsName: `${shop.name} (${shop.shopNumber})`,
      assignedFpsAddress: shop.address,
    }));

    // Add in-app notification
    const bookingNotif: AppNotification = {
      id: `NOTIF-BOOK-${Date.now()}`,
      title: '🎟️ Virtual Token & QR Confirmed',
      titleKn: '🎟️ ವರ್ಚುವಲ್ ಟೋಕನ್ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
      message: `Your 2-hour slot (${slot.date}, ${slot.timeShift}) at ${shop.shopNumber} is locked. Virtual token #${tokenNumber} issued. Physical line wait avoided!`,
      messageKn: `ನಿಮ್ಮ ಸ್ಲಾಟ್ (${slot.date}, ${slot.timeShift}) ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಟೋಕನ್ #${tokenNumber} ನೀಡಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [bookingNotif, ...prev]);

    return newToken;
  };

  // Claim Grace Pass Walk-in (NFSA Invariant)
  const claimGracePassWalkin = (reason?: string) => {
    const shop = shops.find((s) => s.id === citizen.assignedFpsId) || shops[0];
    const graceTokenNumber = `GRACE-2026-09-${Math.floor(1000 + Math.random() * 9000)}`;

    const graceToken: VirtualToken = {
      tokenId: graceTokenNumber,
      rationCardNumber: citizen.rationCardNumber,
      beneficiaryName: citizen.headOfHousehold,
      headOfHouseholdKn: citizen.headOfHouseholdKn,
      fpsId: shop.id,
      fpsName: `${shop.name} (${shop.shopNumber})`,
      date: 'Walk-in Active (Any Date)',
      timeShift: 'Walk-in Any Time (Grace Pass)',
      membersCount: citizen.members.length,
      totalGrainKg: 26,
      commoditiesSummary: '20kg Raw Rice, 5kg Wheat, 1kg Refined Sugar',
      bookedVia: 'walkin_grace_pass',
      status: 'booked',
      isGracePass: true,
      qrPayload: `KAR-PDS-GRACE|${citizen.rationCardNumber}|26KG|UNSCHEDULED_WALKIN|LEGAL_RIGHT_HONORED`,
      smsSnippet: `ePDS-KA: Grace Pass active for card ${citizen.rationCardNumber}. You can walk into ${shop.shopNumber} any time during working hours. Your legal NFSA ration is 100% protected. Complete biometric on ePoS.`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setVirtualTokens((prev) => [
      graceToken,
      ...prev.filter((t) => t.rationCardNumber !== citizen.rationCardNumber),
    ]);

    setCitizen((prev) => ({
      ...prev,
      activeTokenNumber: graceTokenNumber,
    }));

    const graceNotif: AppNotification = {
      id: `NOTIF-GRACE-${Date.now()}`,
      title: '🛡️ Grace Pass Active — Ration Protected',
      titleKn: '🛡️ ಗ್ರೇಸ್ ಪಾಸ್ ಸಕ್ರಿಯ — ನಿಮ್ಮ ರೇಷನ್ ಹಕ್ಕು ಸುರಕ್ಷಿತ',
      message: 'Missed pre-booking window? No problem! Your NFSA entitlement is inviolable. Walk into your fair price shop anytime with standard Aadhaar authentication.',
      messageKn: 'ಮುಂಗಡ ನೋಂದಣಿ ತಪ್ಪಿಹೋಗಿದೆಯೇ? ಪರವಾಗಿಲ್ಲ! ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನಿಮ್ಮ ರೇಷನ್ ಪಡೆಯಬಹುದು.',
      timestamp: 'Just now',
      isUrgent: false,
      category: 'reminder',
      read: false,
    };
    setNotifications((prev) => [graceNotif, ...prev]);

    return graceToken;
  };

  // Update token status (pre_packed, biometric_verified, collected)
  const updateTokenStatus = (tokenId: string, status: VirtualToken['status']) => {
    setVirtualTokens((prev) =>
      prev.map((t) => (t.tokenId === tokenId ? { ...t, status } : t))
    );
  };

  // Approve buffer reroute for migrant spike
  const approveReroute = (spikeId: string) => {
    setMigrantSpikes((prev) =>
      prev.map((sp) => {
        if (sp.id === spikeId) {
          return {
            ...sp,
            rerouteStatus: 'approved_by_dc',
            actionTakenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return sp;
      })
    );

    // Also inject/update the dispatch list with the rerouted truck
    const targetSpike = migrantSpikes.find((s) => s.id === spikeId);
    if (targetSpike) {
      const newDispatch: DispatchRecommendation = {
        id: `DSP-REROUTE-${Date.now()}`,
        fpsId: targetSpike.fpsId,
        fpsName: targetSpike.fpsName,
        ward: targetSpike.ward,
        godownId: 'GDN-BLR-YESH-01',
        godownName: 'Yeshwanthpur Central Buffer Godown (Hub 1)',
        truckId: targetSpike.recommendedTruckId,
        driverName: 'Basavaraj Hiremath',
        driverPhone: '+91 99801 88442',
        currentStockMetric: `ONORC Migrant Inflow: +${targetSpike.spikePercentage}% intent demand spike detected`,
        forecastDemandMetric: `${targetSpike.intentLoggedDemandKg.toLocaleString()} kg projected cycle demand`,
        ruleExplanation: `ONORC Portability Rule: 5-Day Intent Window registered ${targetSpike.migrantWorkersCount} migrant workers. Buffer truck rerouted prior to wholesale warehouse lock.`,
        recommendedCommodities: [
          { name: 'Raw Rice (Buffer Reroute)', quantityKg: targetSpike.recommendedAdditionalGrainKg },
          { name: 'Wheat (Buffer Reroute)', quantityKg: Math.round(targetSpike.recommendedAdditionalGrainKg * 0.25) },
        ],
        status: 'approved',
        statusStep: 2,
        etaMinutes: 18,
        progressPercent: 35,
        officerDecision: {
          decidedBy: 'Sri M. Ramesh Kumar, KSCS (DSO Bengaluru Urban)',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'approve',
          notes: `Reroute approved under ONORC Predictive Portability Protocol. Extra +${targetSpike.recommendedAdditionalGrainKg} kg dispatched.`,
        },
      };

      setDispatches((prev) => [newDispatch, ...prev]);
    }
  };

  // Debug override for location choice window
  const [forceWindowOpen, setForceWindowOpen] = useState<boolean>(true); // default true for convenient demoing

  // Voice simulation state
  const [voiceModal, setVoiceModal] = useState<VoiceInputState>({
    isOpen: false,
    targetFieldLabel: '',
    onConfirm: () => {},
  });

  // 3-Channel blast confirmation state
  const [blastModal, setBlastModal] = useState<BlastModalState>({
    isOpen: false,
    fpsName: '',
    beneficiaryCount: 0,
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setHasSelectedInitialLanguage(true);
    localStorage.setItem('pds_initial_lang_selected', 'true');
  };

  // Real device date window logic
  const now = new Date();
  const currentDayOfMonth = now.getDate();
  // Window is naturally open between day 20 and 24, auto-lock on day 25
  const isNaturallyOpen = currentDayOfMonth >= 20 && currentDayOfMonth <= 24;
  const isWindowOpen = forceWindowOpen || isNaturallyOpen;

  // 20-25th Monthly Slot Booking Lifecycle Framework State
  const [simulatedDayOfMonth, setSimulatedDayOfMonth] = useState<number>(() => {
    const today = new Date().getDate();
    return today >= 1 && today <= 31 ? today : 23;
  });

  const isBookingWindowAccessible =
    (simulatedDayOfMonth >= 20 && simulatedDayOfMonth <= 25) || forceWindowOpen;

  // Dedicated Monthly Distribution Cycle Slot Booking State
  const [slotBookingState, setSlotBookingState] = useState<SlotBookingState>(() => {
    const defaultShop =
      INITIAL_SHOPS.find((s) => s.id === INITIAL_CITIZEN.assignedFpsId) || INITIAL_SHOPS[0];
    return {
      selectedShop: {
        fpsId: defaultShop.id,
        shopNumber: defaultShop.shopNumber,
        name: defaultShop.name,
        dealerName: defaultShop.dealerName,
        phoneNumber: defaultShop.phoneNumber,
        address: defaultShop.address,
        ward: defaultShop.ward,
        isCustomPreBooked: false, // Default card address
        bookedAt: '2026-09-20 09:00',
      },
      assignedSlot: {
        slotId: undefined,
        date: undefined,
        timeShift: undefined,
        assignedAt: undefined,
        distributionWindowLabel:
          defaultShop.distributionSchedule?.distributionDaysLabel || 'Day 11 to Day 25 (15 Days)',
        status: 'unassigned',
      },
      tokenDetails: {
        tokenId: undefined,
        issuedAt: undefined,
        expiresAt: undefined,
        isExpired: false,
        expiredReason: undefined,
        status: 'idle',
        graceRebookingAllowed: true, // NFSA Section 3: food grains guaranteed, fresh rebooking permitted
        qrPayload: undefined,
        smsSnippet: undefined,
      },
      cycleMonth: 'October 2026',
      isWindowOpen: (simulatedDayOfMonth >= 20 && simulatedDayOfMonth <= 25) || forceWindowOpen,
      lastUpdated: new Date().toISOString(),
    };
  });

  // Keep slotBookingState.isWindowOpen in sync with simulated calendar window
  useEffect(() => {
    setSlotBookingState((prev) => ({
      ...prev,
      isWindowOpen: (simulatedDayOfMonth >= 20 && simulatedDayOfMonth <= 25) || forceWindowOpen,
      lastUpdated: new Date().toISOString(),
    }));
  }, [simulatedDayOfMonth, forceWindowOpen]);

  const [slotIntent, setSlotIntent] = useState<SlotIntentRecord>(() => {
    const defaultShop =
      INITIAL_SHOPS.find((s) => s.id === INITIAL_CITIZEN.assignedFpsId) || INITIAL_SHOPS[0];
    return {
      id: 'INTENT-KA-2026-10-0412',
      rationCardNumber: INITIAL_CITIZEN.rationCardNumber,
      beneficiaryName: INITIAL_CITIZEN.headOfHousehold,
      targetMonth: 'October 2026',
      fpsId: defaultShop.id,
      fpsName: `${defaultShop.name} (${defaultShop.shopNumber})`,
      fpsAddress: defaultShop.address,
      isLocationPreBooked: false, // Default card address
      locationPreBookedAt: '2026-09-20 09:00',
      status: 'location_prebooked',
    };
  });

  // 1. Save location pre-booking intent (or maintain card default)
  const saveLocationIntent = (fpsId: string, isExplicitPreBooking = true) => {
    const targetShop = shops.find((s) => s.id === fpsId);
    if (!targetShop) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedIntent: SlotIntentRecord = {
      ...slotIntent,
      fpsId: targetShop.id,
      fpsName: `${targetShop.name} (${targetShop.shopNumber})`,
      fpsAddress: targetShop.address,
      isLocationPreBooked: isExplicitPreBooking,
      locationPreBookedAt: timeStr,
      status: 'location_prebooked',
    };

    setSlotIntent(updatedIntent);

    // Sync into slotBookingState.selectedShop
    setSlotBookingState((prev) => ({
      ...prev,
      selectedShop: {
        fpsId: targetShop.id,
        shopNumber: targetShop.shopNumber,
        name: targetShop.name,
        dealerName: targetShop.dealerName,
        phoneNumber: targetShop.phoneNumber,
        address: targetShop.address,
        ward: targetShop.ward,
        isCustomPreBooked: isExplicitPreBooking,
        bookedAt: timeStr,
      },
      assignedSlot: {
        ...prev.assignedSlot,
        distributionWindowLabel:
          targetShop.distributionSchedule?.distributionDaysLabel || prev.assignedSlot.distributionWindowLabel,
      },
      lastUpdated: new Date().toISOString(),
    }));

    // Update citizen profile assigned FPS
    setCitizen((prev) => ({
      ...prev,
      assignedFpsId: targetShop.id,
      assignedFpsName: `${targetShop.name} (${targetShop.shopNumber})`,
      assignedFpsAddress: targetShop.address,
      currentIntent: updatedIntent,
    }));

    const locNotif: AppNotification = {
      id: `NOTIF-LOC-${Date.now()}`,
      title: isExplicitPreBooking ? '📍 FPS Pre-Booked for Next Cycle' : '📍 Default Card FPS Confirmed',
      titleKn: '📍 ಮುಂದಿನ ತಿಂಗಳಿಗೆ ರೇಷನ್ ಅಂಗಡಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      message: `Your ration supply location is locked at ${targetShop.name} (${targetShop.shopNumber}). When dealer confirms wholesale intake, slot booking will open for you.`,
      messageKn: `ನಿಮ್ಮ ರೇಷನ್ ಅಂಗಡಿಯನ್ನು ${targetShop.name} ಗೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [locNotif, ...prev]);
  };

  // 2. Dealer announces distribution schedule & sends notification to registered/default citizens
  const announceDistributionSchedule = (fpsId: string, schedule: Partial<FpsDistributionSchedule>) => {
    const shop = shops.find((s) => s.id === fpsId);
    const shopName = shop ? shop.name : 'Depot';

    setShops((prev) =>
      prev.map((s) => {
        if (s.id === fpsId) {
          const currentSched = s.distributionSchedule || {
            announced: false,
            totalDays: 15,
            distributionDaysLabel: 'Day 11 to Day 25 (15 Days)',
            operatingHours: '08:00 AM - 12:00 PM & 02:00 PM - 06:00 PM',
            dailyShifts: [
              '08:00 AM - 10:00 AM',
              '10:00 AM - 12:00 PM',
              '02:00 PM - 04:00 PM',
              '04:00 PM - 06:00 PM',
            ],
            stockReceivedConfirmed: true,
            receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quotaAllocatedKg: 14200,
            announcementNotice:
              'Stock verified at depot. Slot booking is now active for all registered beneficiaries.',
          };

          return {
            ...s,
            distributionStarted: true,
            distributionSchedule: {
              ...currentSched,
              ...schedule,
              announced: true,
              announcedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stockReceivedConfirmed: true,
            },
          };
        }
        return s;
      })
    );

    // Also mark dispatches to this shop as arrived/ready
    setDispatches((prev) =>
      prev.map((d) =>
        d.fpsId === fpsId
          ? { ...d, statusStep: 5, progressPercent: 100, status: 'arrived' as const }
          : d
      )
    );

    // Broadcast notification to citizens
    const schedNotif: AppNotification = {
      id: `NOTIF-SCHED-${Date.now()}`,
      title: '📢 Distribution Schedule & Time Slot Booking Live!',
      titleKn: '📢 ರೇಷನ್ ವಿತರಣಾ ದಿನಗಳು ಮತ್ತು ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಪ್ರಾರಂಭವಾಗಿದೆ!',
      message: `${shopName} has received stock and announced distribution (${schedule.distributionDaysLabel || 'Days 11–25'}). Pre-book your preferred 2-hour time slot now to avoid physical queue!`,
      messageKn: `${shopName} ಸ್ಟಾಕ್ ಸ್ವೀಕರಿಸಿದೆ. ನಿಮ್ಮ 2 ಗಂಟೆಯ ಸಮಯದ ಸ್ಲಾಟ್ ಅನ್ನು ಈಗಲೇ ಬುಕ್ ಮಾಡಿ.`,
      timestamp: 'Just now',
      isUrgent: true,
      category: 'distribution',
      read: false,
    };
    setNotifications((prev) => [schedNotif, ...prev]);
  };

  // 3. Save Time-Slot Intent (Locked temporarily in the system till ration is collected)
  const saveSlotIntent = (slotId: string, date: string, timeShift: string): SlotIntentRecord => {
    const slot = bookingSlots.find((s) => s.id === slotId) || bookingSlots[0];
    const shop = shops.find((s) => s.id === slotIntent.fpsId) || shops[0];
    const dayDigits = date.replace(/\D/g, '') || '14';
    const shiftTag = timeShift.includes('08:00') ? 'S1-08AM' : timeShift.includes('10:00') ? 'S2-10AM' : timeShift.includes('02:00') ? 'S3-02PM' : 'S4-04PM';
    const tokenNumber = `SLOT-TKN-${shop.shopNumber.replace(/\D/g, '') || '104'}-D${dayDigits}-${shiftTag}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create locked virtual token with time slot details
    const newToken: VirtualToken = {
      tokenId: tokenNumber,
      rationCardNumber: citizen.rationCardNumber,
      beneficiaryName: citizen.headOfHousehold,
      headOfHouseholdKn: citizen.headOfHouseholdKn,
      fpsId: shop.id,
      fpsName: `${shop.name} (${shop.shopNumber})`,
      date,
      timeShift,
      membersCount: citizen.members.length,
      totalGrainKg: 26,
      commoditiesSummary: '20kg Raw Rice (Anna Bhagya), 5kg Wheat, 1kg Refined Sugar',
      bookedVia: 'app',
      status: 'booked',
      isGracePass: false,
      qrPayload: `KAR-PDS-SLOT|${tokenNumber}|${citizen.rationCardNumber}|${date}|${timeShift}|26KG|LOCKED`,
      smsSnippet: `ePDS-KA: Priority Time-Slot Token ${tokenNumber} confirmed for ${citizen.headOfHousehold} at ${shop.name}. Date: ${date}, Shift: ${timeShift}. Show QR at counter to collect 26KG grains.`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Update slots booked count
    setBookingSlots((prev) =>
      prev.map((s) => {
        if (s.id === slotId) {
          const nextCount = s.bookedCount + 1;
          const status = nextCount >= s.capacity ? 'red' : nextCount >= s.capacity * 0.7 ? 'yellow' : 'green';
          return { ...s, bookedCount: nextCount, status };
        }
        return s;
      })
    );

    // Save token
    setVirtualTokens((prev) => [
      newToken,
      ...prev.filter((t) => t.rationCardNumber !== citizen.rationCardNumber),
    ]);

    const updatedIntent: SlotIntentRecord = {
      ...slotIntent,
      slotId,
      date,
      timeShift,
      tokenId: tokenNumber,
      status: 'slot_locked',
      lockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      missedReason: undefined,
    };

    setSlotIntent(updatedIntent);

    // Sync into slotBookingState
    const shiftParts = timeShift.split('-');
    const shiftEndTime = shiftParts.length > 1 ? shiftParts[1].trim() : '18:00';
    const expiresAtStr = `${date}, ${shiftEndTime}`;

    setSlotBookingState((prev) => ({
      ...prev,
      assignedSlot: {
        slotId,
        date,
        timeShift,
        assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        distributionWindowLabel:
          shop.distributionSchedule?.distributionDaysLabel || prev.assignedSlot.distributionWindowLabel,
        status: 'reserved',
      },
      tokenDetails: {
        tokenId: tokenNumber,
        issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiresAt: expiresAtStr,
        isExpired: false,
        expiredReason: undefined,
        status: 'locked',
        graceRebookingAllowed: true,
        qrPayload: newToken.qrPayload,
        smsSnippet: newToken.smsSnippet,
      },
      lastUpdated: new Date().toISOString(),
    }));

    setCitizen((prev) => ({
      ...prev,
      activeTokenNumber: tokenNumber,
      currentIntent: updatedIntent,
    }));

    const slotNotif: AppNotification = {
      id: `NOTIF-SLOT-${Date.now()}`,
      title: '🔒 Time Slot Locked in System',
      titleKn: '🔒 ಸಮಯದ ಸ್ಲಾಟ್ ಸಿಸ್ಟಂನಲ್ಲಿ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
      message: `Your shift (${date} · ${timeShift}) is temporarily locked at ${shop.shopNumber}. Your ration package will be pre-weighed and held till your arrival.`,
      messageKn: `ನಿಮ್ಮ ಸ್ಲಾಟ್ (${date} · ${timeShift}) ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [slotNotif, ...prev]);

    return updatedIntent;
  };

  // 4. Missed Slot Simulation / Detection
  // If citizen does not come in that time slot, their turn won't get cancelled!
  // Old token is cancelled, and they do entire fresh slot booking again.
  const simulateMissedSlot = (reason?: string) => {
    const expiredTokenId = slotIntent.tokenId || citizen.activeTokenNumber;

    // Invalidate old token
    if (expiredTokenId) {
      setVirtualTokens((prev) =>
        prev.map((t) =>
          t.tokenId === expiredTokenId ? { ...t, status: 'expired_cancelled' as const } : t
        )
      );
    }

    const updatedIntent: SlotIntentRecord = {
      ...slotIntent,
      status: 'missed_expired',
      missedReason: reason || 'Scheduled 2-hour window elapsed without depot ePoS check-in',
    };

    setSlotIntent(updatedIntent);

    // Sync into slotBookingState
    setSlotBookingState((prev) => ({
      ...prev,
      assignedSlot: {
        ...prev.assignedSlot,
        status: 'shift_elapsed',
      },
      tokenDetails: {
        ...prev.tokenDetails,
        isExpired: true,
        status: 'expired',
        expiredReason: reason || 'Scheduled 2-hour window elapsed without depot ePoS check-in',
        graceRebookingAllowed: true,
      },
      lastUpdated: new Date().toISOString(),
    }));

    setCitizen((prev) => ({
      ...prev,
      currentIntent: updatedIntent,
    }));

    const missedNotif: AppNotification = {
      id: `NOTIF-MISSED-${Date.now()}`,
      title: '⚠️ Shift Elapsed · Food Right Safe! Rebook Fresh Slot',
      titleKn: '⚠️ ಸ್ಲಾಟ್ ಸಮಯ ಮೀರಿದೆ · ನಿಮ್ಮ ಹಕ್ಕು ಸುರಕ್ಷಿತ, ಮರು-ಬುಕಿಂಗ್ ಮಾಡಿ',
      message: `Your scheduled shift at ${slotIntent.fpsName} elapsed. Under statutory NFSA Section 3, food grain entitlements are never denied. Token #${expiredTokenId} cancelled. Please book a fresh time slot now.`,
      messageKn: `ನಿಮ್ಮ ಸ್ಲಾಟ್ ಸಮಯ ಮೀರಿದೆ. ರೇಷನ್ ಹಕ್ಕು ರದ್ದಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೊಸ ಸ್ಲಾಟ್ ಅನ್ನು ಮತ್ತೆ ಬುಕ್ ಮಾಡಿ.`,
      timestamp: 'Just now',
      isUrgent: true,
      category: 'distribution',
      read: false,
    };
    setNotifications((prev) => [missedNotif, ...prev]);
  };

  // 5. Reset Slot for Fresh Re-booking
  const resetSlotForRebooking = () => {
    const freshIntent: SlotIntentRecord = {
      ...slotIntent,
      slotId: undefined,
      date: undefined,
      timeShift: undefined,
      tokenId: undefined,
      status: 'location_prebooked',
      missedReason: undefined,
    };

    setSlotIntent(freshIntent);

    // Sync into slotBookingState
    setSlotBookingState((prev) => ({
      ...prev,
      assignedSlot: {
        slotId: undefined,
        date: undefined,
        timeShift: undefined,
        assignedAt: undefined,
        distributionWindowLabel: prev.assignedSlot.distributionWindowLabel,
        status: 'unassigned',
      },
      tokenDetails: {
        tokenId: undefined,
        issuedAt: undefined,
        expiresAt: undefined,
        isExpired: false,
        expiredReason: undefined,
        status: 'idle',
        graceRebookingAllowed: true,
        qrPayload: undefined,
        smsSnippet: undefined,
      },
      lastUpdated: new Date().toISOString(),
    }));

    setCitizen((prev) => ({
      ...prev,
      currentIntent: freshIntent,
    }));
  };

  // 6. Complete Ration Collection with Token
  const collectRationWithToken = (tokenId?: string) => {
    const idToUse = tokenId || slotIntent.tokenId;
    if (idToUse) {
      setVirtualTokens((prev) =>
        prev.map((t) => (t.tokenId === idToUse ? { ...t, status: 'collected' as const } : t))
      );
    }

    const collectedIntent: SlotIntentRecord = {
      ...slotIntent,
      status: 'collected',
      collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSlotIntent(collectedIntent);

    // Sync into slotBookingState
    setSlotBookingState((prev) => ({
      ...prev,
      assignedSlot: {
        ...prev.assignedSlot,
        status: 'completed',
      },
      tokenDetails: {
        ...prev.tokenDetails,
        status: 'collected',
      },
      lastUpdated: new Date().toISOString(),
    }));

    setCitizen((prev) => ({
      ...prev,
      currentCycleCollected: true,
      currentIntent: collectedIntent,
    }));

    const colNotif: AppNotification = {
      id: `NOTIF-COLLECT-${Date.now()}`,
      title: '✅ Ration Handover Completed',
      titleKn: '✅ ರೇಷನ್ ವಿತರಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ',
      message: `26 kg pre-packaged grains collected at ${slotIntent.fpsName}. UIDAI ePoS Biometric receipt logged. Temporary lock released.`,
      messageKn: `ರೇಷನ್ ಪಡೆಯಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'distribution',
      read: false,
    };
    setNotifications((prev) => [colNotif, ...prev]);
  };

  // Dedicated Slot Booking State Helper Functions
  const updateSelectedShop = (fpsId: string, isExplicitPreBooking = true) => {
    saveLocationIntent(fpsId, isExplicitPreBooking);
  };

  const assignTimeSlot = (slotId: string, date: string, timeShift: string) => {
    saveSlotIntent(slotId, date, timeShift);
  };

  const expireCurrentToken = (reason?: string) => {
    simulateMissedSlot(reason);
  };

  const checkTokenExpiration = (): boolean => {
    if (slotBookingState.tokenDetails.isExpired) return true;
    if (
      slotBookingState.tokenDetails.status === 'expired' ||
      slotBookingState.tokenDetails.status === 'cancelled'
    ) {
      return true;
    }
    return false;
  };

  const resetExpiredTokenForRebooking = () => {
    resetSlotForRebooking();
  };

  const markTokenRationCollected = (tokenId?: string) => {
    collectRationWithToken(tokenId);
  };

  // Change location action
  const changeCitizenLocation = (fpsId: string) => {
    const targetShop = shops.find((s) => s.id === fpsId);
    if (!targetShop) return;

    setCitizen((prev) => ({
      ...prev,
      assignedFpsId: targetShop.id,
      assignedFpsName: `${targetShop.name} (${targetShop.shopNumber})`,
      assignedFpsAddress: targetShop.address,
    }));

    // Add confirmation notification
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'FPS Location Updated',
      titleKn: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಬದಲಾವಣೆ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      message: `Your ration allocation for the next cycle is confirmed at ${targetShop.name} (${targetShop.shopNumber}). Choice auto-locked.`,
      messageKn: `ಮುಂದಿನ ತಿಂಗಳಿಗೆ ನಿಮ್ಮ ರೇಷನ್ ಅಂಗಡಿಯನ್ನು ${targetShop.name} ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Temporary Portability for Current Month (reverts to default next month)
  const setTemporaryPortabilityShop = (fpsId: string, distanceKm?: number) => {
    const targetShop = shops.find((s) => s.id === fpsId);
    if (!targetShop) return;

    const currentMonth = slotBookingState.cycleMonth || 'October 2026';
    const timeStr = new Date().toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newHistoryItem: PortabilityLocationHistoryItem = {
      id: `HIST-PORT-${Date.now()}`,
      fpsId: targetShop.id,
      shopNumber: targetShop.shopNumber,
      shopName: targetShop.name,
      dealerName: targetShop.dealerName,
      address: targetShop.address,
      ward: targetShop.ward,
      district: targetShop.district,
      month: currentMonth,
      selectedAt: timeStr,
      distanceKm: distanceKm !== undefined ? Number(distanceKm.toFixed(1)) : undefined,
    };

    setCitizen((prev) => {
      const existingHistory = prev.portabilityHistory || [];
      const updatedHistory = [
        newHistoryItem,
        ...existingHistory.filter((h) => h.fpsId !== targetShop.id || h.month !== currentMonth),
      ];
      return {
        ...prev,
        assignedFpsId: targetShop.id,
        assignedFpsName: `${targetShop.name} (${targetShop.shopNumber})`,
        assignedFpsAddress: targetShop.address,
        temporaryPortabilityShopId: targetShop.id,
        temporaryPortabilityMonth: currentMonth,
        portabilityHistory: updatedHistory,
      };
    });

    setSlotBookingState((prev) => ({
      ...prev,
      selectedShop: {
        fpsId: targetShop.id,
        shopNumber: targetShop.shopNumber,
        name: targetShop.name,
        dealerName: targetShop.dealerName,
        phoneNumber: targetShop.phoneNumber,
        address: targetShop.address,
        ward: targetShop.ward,
        isCustomPreBooked: true,
        isTemporaryPortability: true,
        temporaryMonth: currentMonth,
        bookedAt: timeStr,
      },
      lastUpdated: new Date().toISOString(),
    }));

    const portNotif: AppNotification = {
      id: `NOTIF-PORT-${Date.now()}`,
      title: '🔄 Temporary Portability Locked for Current Month',
      titleKn: '🔄 ಪ್ರಸಕ್ತ ತಿಂಗಳಿಗೆ ತಾತ್ಕಾಲಿಕ ಪೋರ್ಟಬಿಲಿಟಿ ಆಯ್ಕೆ ದೃಢಪಟ್ಟಿದೆ',
      message: `Ration shop temporarily set to ${targetShop.name} (${targetShop.shopNumber}) for ${currentMonth}. Under ONORC rules, this allocation is for this month only; next month your ration distribution will automatically restore to your permanent default location.`,
      messageKn: `ಈ ತಿಂಗಳಿಗೆ ರೇಷನ್ ಅಂಗಡಿಯನ್ನು ${targetShop.name} ಗೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ. ಮುಂದಿನ ತಿಂಗಳು ನಿಮ್ಮ ಖಾಯಂ ಅಂಗಡಿಗೆ ತಾನಾಗಿಯೇ ಹಿಂತಿರುಗುತ್ತದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [portNotif, ...prev]);
  };

  const revertToDefaultLocation = () => {
    const defaultShopId = citizen.defaultFpsId || INITIAL_CITIZEN.defaultFpsId || 'KA-BLR-FPS-104';
    const defaultShop = shops.find((s) => s.id === defaultShopId) || shops[0];

    setCitizen((prev) => ({
      ...prev,
      assignedFpsId: defaultShop.id,
      assignedFpsName: `${defaultShop.name} (${defaultShop.shopNumber})`,
      assignedFpsAddress: defaultShop.address,
      temporaryPortabilityShopId: null,
      temporaryPortabilityMonth: null,
    }));

    setSlotBookingState((prev) => ({
      ...prev,
      selectedShop: {
        fpsId: defaultShop.id,
        shopNumber: defaultShop.shopNumber,
        name: defaultShop.name,
        dealerName: defaultShop.dealerName,
        phoneNumber: defaultShop.phoneNumber,
        address: defaultShop.address,
        ward: defaultShop.ward,
        isCustomPreBooked: false,
        isTemporaryPortability: false,
        temporaryMonth: undefined,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      lastUpdated: new Date().toISOString(),
    }));

    const revertNotif: AppNotification = {
      id: `NOTIF-REVERT-${Date.now()}`,
      title: '🏠 Restored to Default Ration Depot',
      titleKn: '🏠 ಮೂಲ ನಿಗದಿತ ರೇಷನ್ ಅಂಗಡಿಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ',
      message: `Your active location is reset to your permanent card depot: ${defaultShop.name} (${defaultShop.shopNumber}).`,
      messageKn: `ನಿಮ್ಮ ರೇಷನ್ ಅಂಗಡಿಯನ್ನು ಮೂಲ ನಿಗದಿತ ${defaultShop.name} ಗೆ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: false,
      category: 'location_window',
      read: false,
    };
    setNotifications((prev) => [revertNotif, ...prev]);
  };

  // DSO Demand Lock state
  const [isDemandLockedByDso, setIsDemandLockedByDso] = useState<boolean>(true);

  // DSO Locks Monthly Demand Allocation
  const lockMonthlyDemandByDso = () => {
    setIsDemandLockedByDso(true);

    // Auto-generate or re-affirm default e-tokens for cardholders at their default location
    const defaultShop =
      shops.find((s) => s.id === (citizen.defaultFpsId || 'KA-BLR-FPS-104')) || shops[0];
    const defaultTokenNumber = `DEF-TKN-${slotBookingState.cycleMonth.slice(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Set default token details in slotBookingState if not explicitly locked with specific shift yet
    setSlotBookingState((prev) => {
      if (prev.tokenDetails.status === 'locked' && prev.tokenDetails.tokenId) {
        return prev; // already has time-slot token
      }
      return {
        ...prev,
        tokenDetails: {
          ...prev.tokenDetails,
          tokenId: prev.tokenDetails.tokenId || defaultTokenNumber,
          status: 'idle',
          issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          qrPayload: `KAR-PDS-DEFAULT|${citizen.rationCardNumber}|${defaultShop.id}|${slotBookingState.cycleMonth}`,
          smsSnippet: `ePDS-KA: Monthly demand locked by DSO for ${slotBookingState.cycleMonth}. Default token ${defaultTokenNumber} provisioned. Please book a collection shift.`,
        },
      };
    });

    const dsoLockNotif: AppNotification = {
      id: `NOTIF-DSO-LOCK-${Date.now()}`,
      title: '📋 Monthly Demand Allocation Locked by DSO',
      titleKn: '📋 ಜಿಲ್ಲಾ ಸರಬರಾಜು ಅಧಿಕಾರಿ (DSO) ಬೇಡಿಕೆಯನ್ನು ಲಾಕ್ ಮಾಡಿದ್ದಾರೆ',
      message: `District Supply Officer has locked the foodgrain demand allocation for ${slotBookingState.cycleMonth}. Default tokens have been provisioned to all registered cardholders. Once the FPS dealer confirms distribution dates, you can choose your collection time slot.`,
      messageKn: `ಜಿಲ್ಲಾ ಸರಬರಾಜು ಅಧಿಕಾರಿ ಈ ತಿಂಗಳ ಧಾನ್ಯ ಬೇಡಿಕೆಯನ್ನು ಲಾಕ್ ಮಾಡಿದ್ದಾರೆ. ಡೀಲರ್ ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಿದ ನಂತರ ನಿಮ್ಮ ಸಮಯದ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ.`,
      timestamp: 'Just now',
      isUrgent: true,
      category: 'distribution',
      read: false,
    };
    setNotifications((prev) => [dsoLockNotif, ...prev]);
  };

  // FPS Dealer taps "Start Distribution"
  const startDistribution = (fpsId: string) => {
    const shop = shops.find((s) => s.id === fpsId);
    const shopName = shop ? shop.name : 'Your FPS';
    const beneficiaryCount = shop ? shop.beneficiaryCount : 1420;

    // 1. Mark shop distribution started
    setShops((prev) =>
      prev.map((s) =>
        s.id === fpsId
          ? {
              ...s,
              distributionStarted: true,
              distributionStartedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : s
      )
    );

    // 2. Push urgent live notification to Citizen per prompt specification
    const urgentNotif: AppNotification = {
      id: `NOTIF-DISTRIB-${Date.now()}`,
      title: '🚨 Ration Ready for Pickup!',
      titleKn: '🚨 ನಿಮ್ಮ ರೇಷನ್ ವಿತರಣೆ ಪ್ರಾರಂಭವಾಗಿದೆ!',
      message: `Your FPS ${shopName} has started distribution — your monthly quota is ready for pickup. Digital POS token #${citizen.activeTokenNumber} active.`,
      messageKn:`ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ${shopName} ವಿತರಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿದೆ — ನಿಮ್ಮ ಮಾಸಿಕ ಕೋಟಾ ಪಡೆಯಲು ಸಿದ್ಧವಾಗಿದೆ. ಟೋಕನ್ #${citizen.activeTokenNumber} ಸಕ್ರಿಯವಾಗಿದೆ.`,
      timestamp: 'Just now',
      isUrgent: true,
      category: 'distribution',
      read: false,
    };

    setNotifications((prev) => [urgentNotif, ...prev]);

    // 3. If there is a dispatch for this shop, advance its status to ready for pickup
    setDispatches((prev) =>
      prev.map((d) => (d.fpsId === fpsId ? { ...d, statusStep: 5, progressPercent: 100 } : d))
    );

    // 4. Trigger the visible 3-channel blast confirmation modal
    setBlastModal({
      isOpen: true,
      fpsName: shopName,
      beneficiaryCount,
    });
  };

  // Close / Reset Distribution (for testing and simulation)
  const closeDistribution = (fpsId: string) => {
    setShops((prev) =>
      prev.map((s) =>
        s.id === fpsId
          ? {
              ...s,
              distributionStarted: false,
              distributionStartedAt: undefined,
            }
          : s
      )
    );
  };

  // DSO Approves dispatch
  const approveDispatch = (dispatchId: string, notes?: string) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status: 'approved',
            statusStep: 2, // Loaded & Verified
            officerDecision: {
              decidedBy: 'Sri M. Ramesh Kumar, KSCS (DSO Bengaluru Urban)',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: 'approve',
              notes: notes || 'Dispatch approved per AI inventory demand recommendation.',
            },
          };
        }
        return d;
      })
    );
  };

  // DSO Modifies dispatch
  const modifyDispatch = (
    dispatchId: string,
    newCommodities: { name: string; quantityKg: number }[],
    notes?: string
  ) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status: 'approved',
            statusStep: 2,
            recommendedCommodities: newCommodities,
            officerDecision: {
              decidedBy: 'Sri M. Ramesh Kumar, KSCS (DSO Bengaluru Urban)',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: 'modify',
              notes: notes || 'Quantities adjusted to accommodate local buffer requirements.',
            },
          };
        }
        return d;
      })
    );
  };

  // DSO Rejects dispatch
  const rejectDispatch = (dispatchId: string, reason: string) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status: 'rejected',
            officerDecision: {
              decidedBy: 'Sri M. Ramesh Kumar, KSCS (DSO Bengaluru Urban)',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: 'reject',
              notes: reason || 'Deferred to subsequent procurement allotment cycle.',
            },
          };
        }
        return d;
      })
    );
  };

  // Manually advance dispatch step (for live demoing transit)
  const advanceDispatchProgress = (dispatchId: string) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          const nextStep = d.statusStep >= 5 ? 1 : d.statusStep + 1;
          const statusMap: Record<number, DispatchRecommendation['status']> = {
            1: 'approved',
            2: 'loading',
            3: 'in_transit',
            4: 'arrived',
            5: 'arrived',
          };
          const progressMap: Record<number, number> = {
            1: 15,
            2: 35,
            3: 70,
            4: 95,
            5: 100,
          };
          return {
            ...d,
            statusStep: nextStep,
            status: statusMap[nextStep] || 'in_transit',
            progressPercent: progressMap[nextStep] || 50,
          };
        }
        return d;
      })
    );
  };

  // FPS Dealer confirms truck arrival
  const confirmTruckArrival = (dispatchId: string) => {
    const dispatch = dispatches.find((d) => d.id === dispatchId);
    if (!dispatch) return;

    // Update dispatch status
    setDispatches((prev) =>
      prev.map((d) => (d.id === dispatchId ? { ...d, status: 'arrived', statusStep: 4, progressPercent: 100 } : d))
    );

    // Replenish FPS stock
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === dispatch.fpsId) {
          const updatedStock = s.stock.map((item) => {
            const added = dispatch.recommendedCommodities.find(
              (c) => c.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])
            );
            return {
              ...item,
              currentKg: added ? item.currentKg + added.quantityKg : item.currentKg,
            };
          });
          return {
            ...s,
            stock: updatedStock,
            readinessStatus: 'Verified',
          };
        }
        return s;
      })
    );
  };

  // Month-end leftover submitted by FPS Dealer
  const submitMonthEndLeftover = (
    fpsId: string,
    leftover: { rawRiceKg: number; wheatKg: number; sugarKg: number; dalKg: number }
  ) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === fpsId) {
          return {
            ...s,
            lastMonthLeftover: {
              ...leftover,
              reportedAt: new Date().toISOString().split('T')[0],
            },
          };
        }
        return s;
      })
    );
  };

  // Food Inspector submits inspection
  const submitInspectionReport = (
    taskId: string,
    report: {
      status: 'Completed' | 'Escalated';
      checklist: InspectionTask['checklist'];
      notes: string;
      audioNoteTranscript?: string;
      photoUrl?: string;
      escalatedToDso?: boolean;
      escalationReason?: string;
    }
  ) => {
    setInspections((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            ...report,
          };
        }
        return task;
      })
    );

    // Update the shop's readiness status
    const currentTask = inspections.find((t) => t.id === taskId);
    if (currentTask) {
      setShops((prev) =>
        prev.map((s) => {
          if (s.id === currentTask.fpsId) {
            return {
              ...s,
              readinessStatus: report.status === 'Escalated' ? 'Discrepancy' : 'Verified',
              lastInspectedAt: new Date().toISOString().split('T')[0],
              inspectorNotes: report.notes,
            };
          }
          return s;
        })
      );
    }
  };

  // Submit Grievance
  const submitGrievance = (category: string, description: string) => {
    const newGrievance: GrievanceTicket = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Received',
      rationCardNumber: citizen.rationCardNumber,
      fpsId: citizen.assignedFpsId,
    };
    setGrievances((prev) => [newGrievance, ...prev]);
  };

  // Voice Modal Controls
  const openVoiceModal = (targetFieldLabel: string, onConfirm: (text: string) => void, presetText?: string) => {
    setVoiceModal({
      isOpen: true,
      targetFieldLabel,
      onConfirm,
      presetText,
    });
  };

  const closeVoiceModal = () => {
    setVoiceModal({
      isOpen: false,
      targetFieldLabel: '',
      onConfirm: () => {},
    });
  };

  const closeBlastModal = () => {
    setBlastModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Reset Demo Data
  const resetToDefault = () => {
    setCitizen(INITIAL_CITIZEN);
    setShops(INITIAL_SHOPS);
    setDispatches(INITIAL_DISPATCHES);
    setInspections(INITIAL_INSPECTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setGrievances(INITIAL_GRIEVANCES);
    setBookingSlots(INITIAL_BOOKING_SLOTS);
    setVirtualTokens(INITIAL_VIRTUAL_TOKENS);
    setMigrantSpikes(INITIAL_MIGRANT_SPIKES);
    setIntentCyclePhase('days_1_5');
    setForceWindowOpen(true);
    setCitizenAuth(false);
  };

  const t = TRANSLATIONS[language];

  return (
    <PdsContext.Provider
      value={{
        language,
        setLanguage,
        hasSelectedInitialLanguage,
        setHasSelectedInitialLanguage,
        t,
        currentRole,
        setCurrentRole,
        citizenAuth,
        setCitizenAuth,
        dealerAuth,
        setDealerAuth,
        officerAuth,
        setOfficerAuth,
        logout,
        officerTier,
        setOfficerTier,
        dealerShopId,
        setDealerShopId,
        citizen,
        shops,
        dispatches,
        inspections,
        notifications,
        grievances,
        bookingSlots,
        virtualTokens,
        migrantSpikes,
        intentCyclePhase,
        setIntentCyclePhase,
        activeToken,
        bookSlot,
        claimGracePassWalkin,
        updateTokenStatus,
        approveReroute,
        sihPitchModalOpen,
        setSihPitchModalOpen,
        fallbackModalOpen,
        setFallbackModalOpen,
        fallbackChannel,
        setFallbackChannel,
        openFallbackModal,
        forceWindowOpen,
        setForceWindowOpen,
        isWindowOpen,
        currentDayOfMonth,
        changeCitizenLocation,
        setTemporaryPortabilityShop,
        revertToDefaultLocation,
        portabilityHistory: citizen.portabilityHistory || [],
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
        slotBookingState,
        setSlotBookingState,
        updateSelectedShop,
        assignTimeSlot,
        expireCurrentToken,
        checkTokenExpiration,
        resetExpiredTokenForRebooking,
        markTokenRationCollected,
        isDemandLockedByDso,
        lockMonthlyDemandByDso,
        startDistribution,
        closeDistribution,
        approveDispatch,
        modifyDispatch,
        rejectDispatch,
        advanceDispatchProgress,
        confirmTruckArrival,
        submitMonthEndLeftover,
        submitInspectionReport,
        submitGrievance,
        voiceModal,
        openVoiceModal,
        closeVoiceModal,
        blastModal,
        closeBlastModal,
        resetToDefault,
        districtAuthoritiesList,
        beneficiariesList,
        activeDistrictAuthority,
        activeBeneficiary,
        switchBeneficiary,
        switchDistrictAuthority,
        switchDealer,
        firebaseUser,
        handleGoogleSignIn,
        isDbConnected,
        mapsModal,
        openMapsModal,
        closeMapsModal,
      }}
    >
      {children}
    </PdsContext.Provider>
  );
};

export const usePds = () => {
  const context = useContext(PdsContext);
  if (!context) {
    throw new Error('usePds must be used within a PdsProvider');
  }
  return context;
};
