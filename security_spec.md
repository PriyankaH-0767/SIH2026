# Security Specification & Test Suite for Karnataka ePDS Firestore

## 1. Data Invariants
1. `district_authorities`: Read access is permitted for authenticated administrative staff, fair price dealers, and beneficiaries checking their jurisdiction. District authorities can update administrative oversight metrics.
2. `fps_dealers`: Dealers can update their stock disbursement, inspection checklist, and distribution status for their own licensed FPS. Read access is open to authenticated users to find their assigned FPS depot.
3. `beneficiaries`: Beneficiaries can read their own ration entitlement and update their booked slot. FPS dealers can read beneficiaries mapped to their shop to verify tokens and mark collection. District authorities can read and audit all beneficiaries in their district.
4. `tokens_and_slots`: A token must have a valid beneficiary ID, ration card, and shop ID. A beneficiary or dealer can create/update the slot status (e.g. from 'booked' to 'collected').
5. All documents require non-empty IDs matching `^[a-zA-Z0-9_\-]+$` and length <= 128 characters.

## 2. The "Dirty Dozen" Payloads
1. **Ghost Field Attack**: Injecting `{ isSystemAdmin: true }` into an FPS dealer stock update.
2. **Identity Spoofing**: Beneficiary attempting to modify another citizen's card entitlement quota.
3. **Invalid Card Type**: Setting card type to `"GOLD_VIP"` instead of standard `"PHH (BPL)"`, `"AAY (Antyodaya)"`, `"NPHH (APL)"`.
4. **Huge String Injection**: Injecting 2MB payload into `headOfHousehold` field.
5. **Path Poisoning**: Document ID with malicious characters (`../../root_admin`).
6. **Negative Foodgrain Quota**: Submitting `totalQuotaKg: -50`.
7. **Cross-District Tampering**: Kalaburagi dealer modifying Mysuru FPS inventory.
8. **Unauthenticated Write**: An unauthenticated anonymous request attempting to delete district authority documents.
9. **Orphaned Token Creation**: Creating a token slot for a non-existent shop ID.
10. **Terminal State Bypass**: Attempting to revert a token from `collected` back to `booked` with manipulated timestamps.
11. **Email Spoofing Attack**: Claiming admin status without verified email (`email_verified: false`).
12. **Blanket Query Scraping**: Unauthorized broad list query without district scoping.

## 3. Test Runner
Refer to `firestore.rules.test.ts` for automated security validation assertions against the Dirty Dozen payloads.
