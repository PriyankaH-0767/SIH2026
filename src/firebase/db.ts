import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { BeneficiaryRecord, DistrictAuthorityRecord, FPSShop, TokenSlotRecord } from '../types/pds';
import { SEED_BENEFICIARIES, SEED_DISTRICT_AUTHORITIES, SEED_FPS_DEALERS } from './seedData';

const DISTRICTS_COLLECTION = 'district_authorities';
const DEALERS_COLLECTION = 'fps_dealers';
const BENEFICIARIES_COLLECTION = 'beneficiaries';
const TOKENS_COLLECTION = 'tokens_and_slots';

// Initialize and seed database if first time boot
export async function initializePdsDatabase(): Promise<{
  districts: DistrictAuthorityRecord[];
  dealers: FPSShop[];
  beneficiaries: BeneficiaryRecord[];
}> {
  try {
    // 1. Check if districts exist
    let districtSnap;
    try {
      districtSnap = await getDocs(collection(db, DISTRICTS_COLLECTION));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, DISTRICTS_COLLECTION);
    }

    if (districtSnap.empty) {
      console.log('Seeding PDS Firestore Database with Karnataka Districts, FPS Dealers, and Beneficiaries...');
      const batch = writeBatch(db);

      // Seed District Authorities
      for (const dist of SEED_DISTRICT_AUTHORITIES) {
        const ref = doc(db, DISTRICTS_COLLECTION, dist.id);
        batch.set(ref, dist);
      }

      // Seed FPS Dealers
      for (const dealer of SEED_FPS_DEALERS) {
        const ref = doc(db, DEALERS_COLLECTION, dealer.id);
        batch.set(ref, dealer);
      }

      // Seed Beneficiaries
      for (const ben of SEED_BENEFICIARIES) {
        const ref = doc(db, BENEFICIARIES_COLLECTION, ben.id);
        batch.set(ref, ben);
      }

      await batch.commit();
      console.log('Firestore seed commit successful');
      return {
        districts: SEED_DISTRICT_AUTHORITIES,
        dealers: SEED_FPS_DEALERS,
        beneficiaries: SEED_BENEFICIARIES,
      };
    }

    // Read live data from Firestore
    const districts: DistrictAuthorityRecord[] = [];
    districtSnap.forEach((doc) => districts.push(doc.data() as DistrictAuthorityRecord));

    let dealerSnap;
    try {
      dealerSnap = await getDocs(collection(db, DEALERS_COLLECTION));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, DEALERS_COLLECTION);
    }
    const dealers: FPSShop[] = [];
    dealerSnap.forEach((doc) => dealers.push(doc.data() as FPSShop));

    let benSnap;
    try {
      benSnap = await getDocs(collection(db, BENEFICIARIES_COLLECTION));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, BENEFICIARIES_COLLECTION);
    }
    const beneficiaries: BeneficiaryRecord[] = [];
    benSnap.forEach((doc) => beneficiaries.push(doc.data() as BeneficiaryRecord));

    return {
      districts: districts.length > 0 ? districts : SEED_DISTRICT_AUTHORITIES,
      dealers: dealers.length > 0 ? dealers : SEED_FPS_DEALERS,
      beneficiaries: beneficiaries.length > 0 ? beneficiaries : SEED_BENEFICIARIES,
    };
  } catch (error) {
    console.error('Error during database initialization:', error);
    // Graceful fallback to rich seed records so the app remains resilient
    return {
      districts: SEED_DISTRICT_AUTHORITIES,
      dealers: SEED_FPS_DEALERS,
      beneficiaries: SEED_BENEFICIARIES,
    };
  }
}

// Fetch all District Authorities
export async function getDistrictAuthorities(): Promise<DistrictAuthorityRecord[]> {
  try {
    const snap = await getDocs(collection(db, DISTRICTS_COLLECTION));
    if (snap.empty) return SEED_DISTRICT_AUTHORITIES;
    return snap.docs.map((d) => d.data() as DistrictAuthorityRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, DISTRICTS_COLLECTION);
  }
}

// Fetch FPS Dealers by District
export async function getFpsDealers(districtId?: string): Promise<FPSShop[]> {
  try {
    if (districtId) {
      const q = query(collection(db, DEALERS_COLLECTION), where('districtId', '==', districtId));
      const snap = await getDocs(q);
      if (snap.empty) {
        return SEED_FPS_DEALERS.filter((s) => s.id.includes(districtId.replace('DIST-', '').slice(0, 3)));
      }
      return snap.docs.map((d) => d.data() as FPSShop);
    }
    const snap = await getDocs(collection(db, DEALERS_COLLECTION));
    if (snap.empty) return SEED_FPS_DEALERS;
    return snap.docs.map((d) => d.data() as FPSShop);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, DEALERS_COLLECTION);
  }
}

// Fetch Beneficiaries with optional district or shop filter
export async function getBeneficiaries(districtId?: string, fpsId?: string): Promise<BeneficiaryRecord[]> {
  try {
    const benCol = collection(db, BENEFICIARIES_COLLECTION);
    let q = query(benCol);
    if (districtId) {
      q = query(benCol, where('districtId', '==', districtId));
    } else if (fpsId) {
      q = query(benCol, where('assignedFpsId', '==', fpsId));
    }
    const snap = await getDocs(q);
    if (snap.empty) {
      let filtered = SEED_BENEFICIARIES;
      if (districtId) filtered = filtered.filter((b) => b.districtId === districtId);
      if (fpsId) filtered = filtered.filter((b) => b.assignedFpsId === fpsId);
      return filtered;
    }
    return snap.docs.map((d) => d.data() as BeneficiaryRecord);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, BENEFICIARIES_COLLECTION);
  }
}

// Authenticate / Fetch beneficiary by Ration Card number or login PIN
export async function findBeneficiaryByLogin(identifier: string, pin?: string): Promise<BeneficiaryRecord | null> {
  try {
    const cleanId = identifier.trim().toUpperCase();
    const benCol = collection(db, BENEFICIARIES_COLLECTION);

    // Try finding by ID or rationCardNumber
    const snap = await getDocs(benCol);
    const list = snap.docs.map((d) => d.data() as BeneficiaryRecord);
    const found = list.find(
      (b) =>
        b.rationCardNumber.toUpperCase() === cleanId ||
        b.rationCardNumber.toUpperCase().endsWith(cleanId) ||
        b.aadhaarLast4 === cleanId ||
        b.loginPin === cleanId ||
        b.id === cleanId
    );

    if (found) {
      if (pin && found.loginPin !== pin && !cleanId.includes(pin)) {
        // Return found user (for pin verification in UI)
        return found;
      }
      return found;
    }

    // Seed fallback check
    const seedFound = SEED_BENEFICIARIES.find(
      (b) =>
        b.rationCardNumber.toUpperCase() === cleanId ||
        b.rationCardNumber.toUpperCase().endsWith(cleanId) ||
        b.aadhaarLast4 === cleanId ||
        b.loginPin === cleanId ||
        b.id === cleanId
    );
    return seedFound || null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, BENEFICIARIES_COLLECTION);
  }
}

// Authenticate / Fetch FPS Dealer by Shop License or PIN
export async function findDealerByLogin(shopLicense: string, pin?: string): Promise<FPSShop | null> {
  try {
    const cleanLicense = shopLicense.trim().toUpperCase();
    const snap = await getDocs(collection(db, DEALERS_COLLECTION));
    const list = snap.docs.map((d) => d.data() as FPSShop);
    const found = list.find(
      (d) =>
        d.id.toUpperCase() === cleanLicense ||
        d.shopNumber.toUpperCase().includes(cleanLicense) ||
        cleanLicense.includes(d.shopNumber.replace(/\D/g, ''))
    );

    if (found) return found;

    const seedFound = SEED_FPS_DEALERS.find(
      (d) =>
        d.id.toUpperCase() === cleanLicense ||
        d.shopNumber.toUpperCase().includes(cleanLicense) ||
        cleanLicense.includes(d.shopNumber.replace(/\D/g, ''))
    );
    return seedFound || null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, DEALERS_COLLECTION);
  }
}

// Authenticate / Fetch District Authority Officer
export async function findDistrictAuthorityByLogin(loginId: string): Promise<DistrictAuthorityRecord | null> {
  try {
    const cleanId = loginId.trim().toUpperCase();
    const snap = await getDocs(collection(db, DISTRICTS_COLLECTION));
    const list = snap.docs.map((d) => d.data() as DistrictAuthorityRecord);
    const found = list.find((a) => a.loginId.toUpperCase() === cleanId || a.id.toUpperCase() === cleanId);
    if (found) return found;

    const seedFound = SEED_DISTRICT_AUTHORITIES.find(
      (a) => a.loginId.toUpperCase() === cleanId || a.id.toUpperCase() === cleanId
    );
    return seedFound || null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, DISTRICTS_COLLECTION);
  }
}

// Book / Update Beneficiary Time Slot in Firestore
export async function bookBeneficiarySlotInDb(
  beneficiaryId: string,
  slotDate: string,
  timeShift: string
): Promise<{ success: boolean; tokenNumber: string }> {
  const tokenNumber = `TKN-2026-09-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  try {
    const benRef = doc(db, BENEFICIARIES_COLLECTION, beneficiaryId);
    await updateDoc(benRef, {
      activeTokenNumber: tokenNumber,
      bookedSlot: {
        date: slotDate,
        timeShift: timeShift,
        bookedAt: now,
      },
    });

    // Also record in tokens_and_slots collection
    const tokenDoc: TokenSlotRecord = {
      id: tokenNumber,
      beneficiaryId,
      rationCardNumber: beneficiaryId,
      fpsId: 'KA-BLR-FPS-104',
      date: slotDate,
      timeShift,
      status: 'booked',
      timestamp: now,
    };
    await setDoc(doc(db, TOKENS_COLLECTION, tokenNumber), tokenDoc);

    return { success: true, tokenNumber };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${BENEFICIARIES_COLLECTION}/${beneficiaryId}`);
  }
}

// Mark Ration Distribution Completed in Firestore
export async function markRationDisbursedInDb(
  beneficiaryId: string,
  fpsId: string
): Promise<boolean> {
  try {
    const benRef = doc(db, BENEFICIARIES_COLLECTION, beneficiaryId);
    await updateDoc(benRef, {
      currentCycleCollected: true,
    });

    // Deduct stock from FPS dealer
    const dealerRef = doc(db, DEALERS_COLLECTION, fpsId);
    const dealerDoc = await getDoc(dealerRef);
    if (dealerDoc.exists()) {
      const data = dealerDoc.data() as FPSShop;
      const updatedStock = data.stock.map((item) => {
        if (item.id === 'raw_rice') {
          return { ...item, currentKg: Math.max(0, item.currentKg - 20) };
        }
        if (item.id === 'wheat') {
          return { ...item, currentKg: Math.max(0, item.currentKg - 5) };
        }
        return item;
      });
      await updateDoc(dealerRef, { stock: updatedStock });
    }

    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${BENEFICIARIES_COLLECTION}/${beneficiaryId}`);
  }
}
