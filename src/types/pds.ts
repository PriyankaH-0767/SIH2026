export type Language = 'en' | 'kn' | 'hi' | 'ta' | 'te';

export type UserRole = 'citizen' | 'officer' | 'dealer';

export type OfficerTier =
  | 'central_ministry' // Ministry of Consumer Affairs, Food & Public Distribution (Central)
  | 'fci'              // Food Corporation of India Regional Office Bengaluru (Central Base Godowns)
  | 'sec'              // Minister & Principal Secretary, Food, Civil Supplies & Consumer Affairs
  | 'comm'             // Commissioner, Food & Civil Supplies (State Command)
  | 'kfcsc_md'         // Managing Director & District Managers, KFCSC (Wholesale Handler)
  | 'kfcsc_depot'      // KFCSC Depot Manager (Wholesale Depots & Electronic Scales)
  | 'dc'               // Deputy Commissioner (District Supreme Head & FPS Licenses)
  | 'jd_dd'            // Joint Director / Deputy Director (Enforcement & Audits)
  | 'dso'              // District Food & Civil Supplies Officer (Full Operational Control)
  | 'inspector'        // Food Inspector (Field Verification & ePoS Operations)
  | 'nic_fist'         // National Informatics Centre (NIC) FIST Technology Provider
  | 'tahsildar'        // Tahsildar (Taluk Coordination - legacy support)
  | 'supply';          // Supply / Godown Staff (legacy support)

export type CommodityType = 'raw_rice' | 'boiled_rice' | 'wheat' | 'sugar' | 'toor_dal' | 'oil';

export interface CommodityStock {
  id: CommodityType;
  name: string;
  nameKn: string;
  currentKg: number;
  allocatedKg: number;
  monthlyDemandKg: number;
  unit: string;
  unitPriceRs: number;
}

export interface BeneficiaryEntitlement {
  commodity: string;
  quantity: string;
  rate: string;
  subsidy: string;
}

export interface FamilyMember {
  name: string;
  relation: string;
  age: number;
  gender: string;
  aadhaarMasked: string;
}

export interface FpsDistributionSchedule {
  announced: boolean;
  announcedAt?: string;
  totalDays: number;
  distributionDaysLabel: string; // e.g. "Day 11 to Day 25 (15 Distribution Days)"
  operatingHours: string;        // e.g. "08:00 AM - 12:00 PM & 02:00 PM - 06:00 PM"
  dailyShifts: string[];         // e.g. ["08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM"]
  stockReceivedConfirmed: boolean;
  receivedAt?: string;
  quotaAllocatedKg: number;
  announcementNotice?: string;
}

export interface PortabilityLocationHistoryItem {
  id: string;
  fpsId: string;
  shopNumber: string;
  shopName: string;
  dealerName: string;
  address: string;
  ward: string;
  district: string;
  month: string; // e.g. "September 2026", "August 2026"
  selectedAt: string;
  distanceKm?: number;
}

export interface SlotBookingState {
  // 1. User's Selected Shop Location
  selectedShop: {
    fpsId: string;
    shopNumber: string;
    name: string;
    dealerName: string;
    phoneNumber: string;
    address: string;
    ward: string;
    isCustomPreBooked: boolean; // true if pre-booked during 20-25th, false if card default
    isTemporaryPortability?: boolean; // true if portability applied for current month
    temporaryMonth?: string;
    bookedAt?: string;
  };

  // 2. Assigned Time-Slots
  assignedSlot: {
    slotId?: string;
    date?: string; // e.g. "Day 12 (Thursday)"
    timeShift?: string; // e.g. "08:00 AM - 10:00 AM"
    assignedAt?: string;
    distributionWindowLabel?: string;
    status: 'unassigned' | 'reserved' | 'active_shift' | 'shift_elapsed' | 'completed';
  };

  // 3. Token & Expiration Logic for the Monthly Distribution Cycle
  tokenDetails: {
    tokenId?: string;
    issuedAt?: string;
    expiresAt?: string;
    isExpired: boolean;
    expiredReason?: string;
    status: 'idle' | 'locked' | 'expired' | 'cancelled' | 'collected';
    graceRebookingAllowed: boolean; // NFSA Section 3: food grains guaranteed, fresh rebooking permitted
    qrPayload?: string;
    smsSnippet?: string;
  };

  // 4. Monthly Distribution Cycle Context
  cycleMonth: string;
  isWindowOpen: boolean; // Accessible during 20-25th of month
  lastUpdated: string;
}

export interface SlotIntentRecord {
  id: string;
  rationCardNumber: string;
  beneficiaryName: string;
  targetMonth: string; // e.g. "October 2026"
  fpsId: string;
  fpsName: string;
  fpsAddress: string;
  isLocationPreBooked: boolean; // true if explicitly pre-booked; false if card default
  locationPreBookedAt: string;
  
  // Slot selection once dealer announces
  slotId?: string;
  date?: string;
  timeShift?: string;
  tokenId?: string;
  status: 'location_prebooked' | 'slot_locked' | 'collected' | 'missed_expired' | 'rescheduled';
  lockedAt?: string;
  collectedAt?: string;
  missedReason?: string;
}

export interface CitizenProfile {
  rationCardNumber: string;
  cardType: 'PHH (BPL)' | 'AAY (Antyodaya)' | 'NPHH (APL)';
  headOfHousehold: string;
  headOfHouseholdKn: string;
  phoneNumber: string;
  address: string;
  ward: string;
  district: string;
  assignedFpsId: string;
  assignedFpsName: string;
  assignedFpsAddress: string;
  defaultFpsId?: string; // Permanent registered default shop (card address)
  defaultFpsName?: string;
  defaultFpsAddress?: string;
  temporaryPortabilityShopId?: string | null;
  temporaryPortabilityMonth?: string | null;
  portabilityHistory?: PortabilityLocationHistoryItem[];
  members: FamilyMember[];
  entitlements: BeneficiaryEntitlement[];
  currentCycleCollected: boolean;
  activeTokenNumber: string;
  currentIntent?: SlotIntentRecord;
}

export type ReadinessStatus = 'Verified' | 'Discrepancy' | 'Not Ready';

export interface FPSShop {
  id: string;
  shopNumber: string;
  name: string;
  dealerName: string;
  phoneNumber: string;
  ward: string;
  taluk: string;
  district: string;
  address: string;
  coordinates: { lat: number; lng: number; x: number; y: number };
  beneficiaryCount: number;
  readinessStatus: ReadinessStatus;
  lastInspectedAt?: string;
  inspectorNotes?: string;
  distributionStarted: boolean;
  distributionStartedAt?: string;
  distributionSchedule?: FpsDistributionSchedule;
  stock: CommodityStock[];
  lastMonthLeftover: {
    rawRiceKg: number;
    wheatKg: number;
    sugarKg: number;
    dalKg: number;
    reportedAt: string;
  };
}

export type DispatchStatus =
  | 'proposed'
  | 'approved'
  | 'loading'
  | 'in_transit'
  | 'arrived'
  | 'rejected';

export interface DispatchRecommendation {
  id: string;
  fpsId: string;
  fpsName: string;
  ward: string;
  godownId: string;
  godownName: string;
  truckId: string;
  driverName: string;
  driverPhone: string;
  currentStockMetric: string;
  forecastDemandMetric: string;
  ruleExplanation: string;
  recommendedCommodities: {
    name: string;
    quantityKg: number;
  }[];
  status: DispatchStatus;
  statusStep: number; // 1: Confirmed, 2: Loaded, 3: In Transit, 4: Arrived, 5: Ready for Pickup
  etaMinutes: number;
  progressPercent: number;
  officerDecision?: {
    decidedBy: string;
    timestamp: string;
    action: 'approve' | 'modify' | 'reject';
    notes?: string;
  };
}

export interface InspectionTask {
  id: string;
  fpsId: string;
  fpsName: string;
  ward: string;
  scheduledDate: string;
  status: 'Pending' | 'Completed' | 'Escalated';
  checklist: {
    biometricPosWorking: boolean;
    digitalWeighingScaleCalibrated: boolean;
    stockRateBoardDisplayed: boolean;
    cleanStorageSpace: boolean;
    cleanDrinkingWaterAvail: boolean;
  };
  notes?: string;
  audioNoteTranscript?: string;
  photoUrl?: string;
  escalatedToDso?: boolean;
  escalationReason?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleKn: string;
  message: string;
  messageKn: string;
  timestamp: string;
  isUrgent: boolean;
  category: 'distribution' | 'location_window' | 'dispatch' | 'reminder';
  read: boolean;
}

export interface GrievanceTicket {
  id: string;
  category: string;
  description: string;
  createdAt: string;
  status: 'Received' | 'Assigned to Inspector' | 'Resolved';
  rationCardNumber: string;
  fpsId: string;
}

// ==========================================
// Intelligent PDS Optimization Framework (SIH)
// ==========================================

export type IntentCyclePhase = 'days_1_5' | 'days_6_10' | 'days_11_25';

export interface BookingSlot {
  id: string;
  fpsId: string;
  date: string;
  timeShift: string; // e.g. "08:00 AM - 10:00 AM"
  capacity: number;
  bookedCount: number;
  status: 'green' | 'yellow' | 'red'; // Green: <50%, Yellow: 50-85%, Red: >85% (Congested)
  estimatedWaitMinutes: number;
  alternateFpsSuggested?: {
    fpsId: string;
    fpsName: string;
    distanceKm: number;
    waitMinutes: number;
  };
}

export interface VirtualToken {
  tokenId: string;
  rationCardNumber: string;
  beneficiaryName: string;
  headOfHouseholdKn?: string;
  fpsId: string;
  fpsName: string;
  date: string;
  timeShift: string;
  membersCount: number;
  totalGrainKg: number;
  commoditiesSummary: string;
  bookedVia: 'app' | 'ussd' | 'ivr_annavani' | 'walkin_grace_pass';
  status: 'booked' | 'pre_packed' | 'biometric_verified' | 'collected' | 'expired_cancelled';
  isGracePass: boolean;
  qrPayload: string;
  smsSnippet: string;
  createdAt: string;
}

export interface MigrantPortabilitySpike {
  id: string;
  fpsId: string;
  fpsName: string;
  ward: string;
  historicalDemandKg: number;
  intentLoggedDemandKg: number;
  spikePercentage: number; // e.g. +28%
  migrantWorkersCount: number;
  sourceRegion: string;
  projectedStockoutDay: number; // e.g. Day 14 of month
  recommendedTruckId: string;
  recommendedAdditionalGrainKg: number;
  rerouteStatus: 'detected' | 'reroute_proposed' | 'approved_by_dc' | 'in_transit';
  actionTakenAt?: string;
}

export interface DistrictAuthorityRecord {
  id: string;
  districtName: string;
  officerName: string;
  loginId: string;
  passcode: string;
  tier: OfficerTier;
  division: string;
  officeAddress: string;
  email: string;
  phone: string;
  fpsCount: number;
  beneficiaryCount: number;
  bufferGodown: string;
  activeDispatchesCount: number;
}

export interface BeneficiaryRecord {
  id: string;
  rationCardNumber: string;
  cardType: 'PHH (BPL)' | 'AAY (Antyodaya)' | 'NPHH (APL)';
  headOfHousehold: string;
  headOfHouseholdKn: string;
  districtId: string;
  district: string;
  ward: string;
  taluk: string;
  assignedFpsId: string;
  assignedFpsName: string;
  assignedFpsAddress: string;
  phoneNumber: string;
  totalQuotaKg: number;
  currentCycleCollected: boolean;
  activeTokenNumber?: string;
  bookedSlot?: {
    date: string;
    timeShift: string;
    bookedAt: string;
  };
  members: FamilyMember[];
  entitlements: BeneficiaryEntitlement[];
  loginPin: string;
  aadhaarLast4: string;
}

export interface TokenSlotRecord {
  id: string;
  beneficiaryId: string;
  rationCardNumber: string;
  fpsId: string;
  date: string;
  timeShift: string;
  status: 'booked' | 'collected' | 'expired';
  timestamp: string;
}

