import React, { useState } from 'react';
import {
  Store,
  Calendar,
  Truck,
  Scale,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
  Send,
  Users,
  Check,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Building,
  Phone,
  MapPin,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { ParallelValidationQueue } from './ParallelValidationQueue';
import { speakAloud } from '../../utils/audioSpeech';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';

type DealerSection = 'timetable' | 'inward_stock' | 'epos_counter' | 'stock_ledger';

export const FpsDealerView: React.FC = () => {
  const {
    shops,
    dealerShopId,
    dispatches,
    startDistribution,
    closeDistribution,
    announceDistributionSchedule,
    confirmTruckArrival,
    submitMonthEndLeftover,
    language,
    t,
  } = usePds();

  // Selected shop (with ability for dealer to switch between authorized shops)
  const [chosenShopId, setChosenShopId] = useState<string>(dealerShopId);
  const currentShop = shops.find((s) => s.id === chosenShopId) || shops[0];

  // Active section
  const [activeSection, setActiveSection] = useState<DealerSection>('epos_counter');

  // Relevant truck dispatch for this chosen shop
  const shopDispatch = dispatches.find((d) => d.fpsId === currentShop.id);

  // Timetable broadcast state
  const [distributionDates, setDistributionDates] = useState('1st to 15th of the month');
  const [shiftHours, setShiftHours] = useState('Morning: 8:00 AM - 12:30 PM | Afternoon: 2:00 PM - 6:30 PM');
  const [timetableBroadcasted, setTimetableBroadcasted] = useState(false);

  // Inward stock manifest checklist
  const [inwardChecked, setInwardChecked] = useState({
    weighbridgeGrossTareNet: false,
    faqMoistureBelow14: false,
    sealIntact: false,
    electronicScaleCalibrated: false,
  });
  const [inwardConfirmed, setInwardConfirmed] = useState(shopDispatch?.status === 'arrived');

  // Month-end leftover stock form
  const [leftoverForm, setLeftoverForm] = useState({
    rawRiceKg: currentShop.lastMonthLeftover.rawRiceKg,
    wheatKg: currentShop.lastMonthLeftover.wheatKg,
    sugarKg: currentShop.lastMonthLeftover.sugarKg,
    dalKg: currentShop.lastMonthLeftover.dalKg,
  });
  const [leftoverSubmitted, setLeftoverSubmitted] = useState(false);

  const handleBroadcastTimetable = () => {
    // 1. Announce schedule to FPS and update shop distribution state
    announceDistributionSchedule(currentShop.id, {
      announced: true,
      totalDays: 15,
      distributionDaysLabel: distributionDates,
      operatingHours: shiftHours,
      stockReceivedConfirmed: true,
    });

    // 2. Open distribution window directly & trigger 3-channel blast (In-App Push, SMS, and IVR)
    startDistribution(currentShop.id);

    setTimetableBroadcasted(true);
    speakAloud(
      language === 'kn'
        ? 'ಪಡಿತರ ವಿತರಣಾ ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಲಾಗಿದೆ! ಎಲ್ಲಾ ಫಲಾನುಭವಿಗಳಿಗೆ ಎಸ್‌ಎಂಎಸ್ ಮತ್ತು ಐವಿಆರ್ ಕರೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ವಿಂಡೋ ತೆರೆಯಲಾಗಿದೆ.'
        : 'Distribution dates confirmed! All citizens who chose this location have been notified via In-App, SMS, and IVR to collect their ration and book slots.',
      language
    );
    setTimeout(() => setTimetableBroadcasted(false), 5000);
  };

  const handleConfirmInwardArrival = () => {
    if (shopDispatch) {
      confirmTruckArrival(shopDispatch.id);
    }
    setInwardConfirmed(true);
    speakAloud(
      language === 'kn'
        ? 'ಗೋದಾಮು ಧಾನ್ಯ ಸ್ವೀಕೃತಿ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ತೂಕ ದೃಢೀಕರಿಸಲಾಗಿದೆ.'
        : 'Wholesale grain consignment and electronic weighbridge manifest verified.',
      language
    );
  };

  const handleLeftoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMonthEndLeftover(currentShop.id, leftoverForm);
    setLeftoverSubmitted(true);
    speakAloud(
      language === 'kn'
        ? 'ತಿಂಗಳ ಅಂತ್ಯದ ಉಳಿಕೆ ಧಾನ್ಯ ವರದಿ ಡಿಎಸ್‌ಒ ಕಚೇರಿಗೆ ಸಲ್ಲಿಸಲಾಗಿದೆ.'
        : 'Month-end leftover stock ledger submitted to District Supply Officer.',
      language
    );
    setTimeout(() => setLeftoverSubmitted(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-3 sm:px-6 space-y-6 font-serif select-none">
      {/* 1. LICENSED FAIR PRICE SHOP TERMINAL HEADER */}
      <div className="bg-gradient-to-r from-[#2C0E38] via-[#481656] to-[#2C0E38] text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-[#D4AF37]/50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#3D144A] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-inner">
              <Store className="w-7 h-7 text-[#FFD700]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-[#2C0E38] text-[#FFD700] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full uppercase">
                  FPS Licensed Dealer Terminal
                </span>
                <span className="text-xs text-purple-200 font-mono font-bold">
                  Depot #{currentShop.id}
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white tracking-tight mt-0.5">
                {currentShop.name} ({currentShop.shopNumber})
              </h2>
              <p className="text-xs text-purple-200">
                Dealer: <strong className="text-white">{currentShop.dealerName}</strong> · Phone: {currentShop.phoneNumber} · Ward {currentShop.ward}
              </p>

              {/* Authorized Depot Switcher */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-purple-200 font-semibold shrink-0">Switch FPS Depot:</span>
                <select
                  value={chosenShopId}
                  onChange={(e) => {
                    setChosenShopId(e.target.value);
                    setInwardConfirmed(false);
                  }}
                  className="bg-[#2C0E38] text-white text-xs font-bold rounded-lg px-2.5 py-1 border border-purple-400/50 focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shopNumber} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-purple-300 block uppercase">ePoS Machine Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Scale Connected (0.00 KG)
              </span>
            </div>
            {currentShop.distributionStarted ? (
              <button
                type="button"
                onClick={() => closeDistribution(currentShop.id)}
                className="px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                title="Distribution is live. Click to close."
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Distribution Live (Open)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startDistribution(currentShop.id)}
                className="px-3.5 sm:px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#2C0E38] font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <span>Open Distribution Window</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Assigned Delivery Truck Status Banner (Core Feature) */}
        {shopDispatch && (
          <div className="mt-3 pt-2.5 border-t border-purple-500/40 flex items-center justify-between gap-3 text-xs bg-purple-950/60 p-3 rounded-xl border border-purple-400/30 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#FFD700] text-purple-950 flex items-center justify-center shrink-0 font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider block">
                  Truck Assigned to This Shop:
                </span>
                <span className="font-bold text-white truncate block">
                  {shopDispatch.truckId} · Driver: <strong className="text-[#FFD700]">{shopDispatch.driverName}</strong> ({shopDispatch.driverPhone})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                shopDispatch.status === 'arrived'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-purple-950 font-black'
              }`}>
                {shopDispatch.status === 'arrived' ? 'Arrived at Shop' : `In Transit · ETA ${shopDispatch.etaMinutes} mins`}
              </span>

              <button
                type="button"
                onClick={() => setActiveSection('inward_stock')}
                className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-[#FFD700] font-bold rounded-lg border border-[#D4AF37]/50 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Truck Details & Gate Pass →</span>
              </button>
            </div>
          </div>
        )}

        {/* STATUTORY AUTHORITY AFFIRMATION */}
        <div className="mt-3 pt-2.5 border-t border-purple-500/40 flex items-center justify-between gap-3 text-xs text-purple-100 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FFD700] shrink-0" />
            <span>
              <strong>Statutory Distributive Authority:</strong> The legal mandate to open and close this shop's distribution window lies exclusively in your hands as the licensed FPS Dealer.
            </span>
          </div>
          <span className="text-[11px] bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-400/30 text-[#FFD700] font-mono">
            License: {currentShop.id} · Exclusively Authorized
          </span>
        </div>
      </div>

      {/* 2. DEALER 4 FUNCTIONAL NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-sans text-xs">
        {[
          {
            key: 'epos_counter' as DealerSection,
            title: language === 'kn' ? 'ಇ-ಪಿಒಎಸ್ ಕೌಂಟರ್' : '1. ePoS Terminal Counter',
            desc: 'Token verify & weigh scale',
            icon: Scale,
            active: activeSection === 'epos_counter',
            guideTitle: 'ePoS Counter & Biometric Dispensing',
            guideDesc: 'Scan beneficiary QR code or enter token number to authenticate biometric and dispense pre-weighed grain bags.',
            guideDescKn: 'ಫಲಾನುಭವಿಯ ಟೋಕನ್ ಪರಿಶೀಲಿಸಿ, ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಿಸಿ ಧಾನ್ಯ ವಿತರಿಸಲು ಒತ್ತಿ.',
          },
          {
            key: 'timetable' as DealerSection,
            title: language === 'kn' ? 'ವಿತರಣಾ ವೇಳಾಪಟ್ಟಿ' : '2. 15-Day Timetable',
            desc: 'Broadcast SMS to cards',
            icon: Calendar,
            active: activeSection === 'timetable',
            guideTitle: 'Distribution Timetable & Broadcast',
            guideDesc: 'Confirm operating days and shifts to open the collection window and broadcast SMS/IVR alerts to all cardholders.',
            guideDescKn: '15 ದಿನಗಳ ವಿತರಣಾ ದಿನಾಂಕಗಳನ್ನು ನಿಗದಿಪಡಿಸಿ ಎಲ್ಲಾ ನಾಗರಿಕರಿಗೆ ಎಸ್‌ಎಂಎಸ್ ಕಳುಹಿಸಲು ಮತ್ತು ವಿಂಡೋ ತೆರೆಯಲು ಒತ್ತಿ.',
          },
          {
            key: 'inward_stock' as DealerSection,
            title: language === 'kn' ? 'ನಿಯೋಜಿತ ಲಾರಿ & ಇನ್‌ವರ್ಡ್' : '3. Assigned Truck & Inward',
            desc: 'Assigned truck transit & gate pass',
            icon: Truck,
            active: activeSection === 'inward_stock',
            guideTitle: 'Assigned Supply Truck & Inward Consignment',
            guideDesc: 'Inspect delivery truck assigned to your FPS shop depot, track live GPS ETA, verify electronic weighbridge certificate, and sign digital gate pass.',
            guideDescKn: 'ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗೆ ನಿಯೋಜಿಸಲಾದ ಲಾರಿ, ಲೈವ್ ಜಿಪಿಎಸ್ ಸ್ಥಿತಿ ಮತ್ತು ತೂಕ ಪತ್ರ ಪರಿಶೀಲಿಸಿ ಸ್ವೀಕೃತಿ ಅನುಮೋದಿಸಲು ಒತ್ತಿ.',
          },
          {
            key: 'stock_ledger' as DealerSection,
            title: language === 'kn' ? 'ದಾಸ್ತಾನು ಲೆಕ್ಕಪತ್ರ' : '4. Stock Ledger & Leftover',
            desc: 'Month-end reconciliation',
            icon: FileSpreadsheet,
            active: activeSection === 'stock_ledger',
            guideTitle: 'Stock Ledger & Leftover Reconciliation',
            guideDesc: 'Submit closing leftover foodgrains to DSO to balance opening stock ledger for next month quota.',
            guideDescKn: 'ತಿಂಗಳ ಅಂತ್ಯದ ಉಳಿಕೆ ಧಾನ್ಯ ವರದಿಯನ್ನು ಡಿಎಸ್‌ಒ ಕಚೇರಿಗೆ ಸಲ್ಲಿಸಲು ಒತ್ತಿ.',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <VoiceHoverGuide
              key={tab.key}
              title={tab.guideTitle}
              description={tab.guideDesc}
              descriptionKn={tab.guideDescKn}
            >
              <button
                type="button"
                onClick={() => setActiveSection(tab.key)}
                className={`w-full p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] sm:min-h-[105px] ${
                  tab.active
                    ? 'border-[#6B1870] bg-white shadow-md ring-2 ring-[#6B1870]'
                    : 'border-purple-100 bg-white hover:border-purple-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 sm:mb-2 shrink-0 ${
                  tab.active ? 'bg-[#6B1870] text-white' : 'bg-purple-50 text-[#6B1870]'
                }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <p className={`font-bold text-xs sm:text-sm leading-tight ${tab.active ? 'text-[#6B1870]' : 'text-slate-900'}`}>{tab.title}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">{tab.desc}</p>
                </div>
              </button>
            </VoiceHoverGuide>
          );
        })}
      </div>

      {/* 3. FUNCTIONAL SECTION PANELS */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-purple-100 font-sans">
        {/* TAB 1: EPOS BIOMETRIC & TOKEN DISTRIBUTION TERMINAL */}
        {activeSection === 'epos_counter' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                  {language === 'kn' ? 'ಇ-ಪಿಒಎಸ್ ವಿತರಣಾ ಕೌಂಟರ್ ಮತ್ತು ಡಿಜಿಟಲ್ ತೂಕ ಯಂತ್ರ' : 'Biometric ePoS Terminal & Digital Scale Counter'}
                </h3>
                <p className="text-xs text-slate-500">
                  Dual-queue architecture: fast-track pre-booked e-token holders in Parallel Queue A; manage walk-in cardholders in Queue B.
                </p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                Point of Sale V3.4 · Active
              </span>
            </div>

            <ParallelValidationQueue />
          </div>
        )}

        {/* TAB 2: 15-DAY TIMETABLE BROADCAST */}
        {activeSection === 'timetable' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                {language === 'kn' ? '15 ದಿನಗಳ ಸಾರ್ವಜನಿಕ ಪಡಿತರ ವೇಳಾಪಟ್ಟಿ ಪ್ರಸಾರ' : '15-Day Timetable & Distribution Schedule Broadcast'}
              </h3>
              <p className="text-xs text-slate-500">
                As per Karnataka Food & Civil Supplies regulations, FPS dealers must broadcast open operating dates and shift timings to cardholders.
              </p>
            </div>

            {timetableBroadcasted && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">Timetable Successfully Broadcasted to 482 Cardholders</p>
                  <p className="text-[11px] text-emerald-700">
                    Automated SMS sent via NIC Department Gateway. Board display updated.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Operating Period
                  </label>
                  <input
                    type="text"
                    value={distributionDates}
                    onChange={(e) => setDistributionDates(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-[#6B1870] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Operating Shifts (Morning / Afternoon)
                  </label>
                  <input
                    type="text"
                    value={shiftHours}
                    onChange={(e) => setShiftHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm focus:ring-2 focus:ring-[#6B1870] focus:outline-hidden"
                  />
                </div>

                <VoiceHoverGuide
                  title="Confirm Distribution Days & Open Window"
                  description="Confirms your distribution schedule, unlocks Step 2 Slot Booking for all citizens assigned to this depot, and broadcasts real-time alerts via In-App Push, SMS, and IVR."
                  descriptionKn="ವಿತರಣಾ ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಿ, ನಾಗರಿಕರಿಗೆ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ವಿಂಡೋ ತೆರೆಯಲು ಮತ್ತು ಎಸ್‌ಎಂಎಸ್/ಐವಿಆರ್ ಸಂದೇಶ ರವಾನಿಸಲು ಒತ್ತಿ."
                >
                  <button
                    type="button"
                    onClick={handleBroadcastTimetable}
                    className="w-full py-3.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <Radio className="w-4 h-4 text-[#FFD700]" />
                    <span>
                      {language === 'kn'
                        ? 'ದಿನಾಂಕಗಳನ್ನು ದೃಢಪಡಿಸಿ ಮತ್ತು ನಾಗರಿಕರಿಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ (ವಿಂಡೋ ತೆರೆಯಿರಿ)'
                        : 'Confirm Distribution Days & Broadcast (Open Step 2 for Citizens)'}
                    </span>
                  </button>
                </VoiceHoverGuide>
              </div>

              {/* Notice Board Preview */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3 text-xs text-amber-950">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold uppercase tracking-wider text-amber-900">
                    Shop Notice Board (ಅಧಿಕೃತ ಸೂಚನಾ ಫಲಕ)
                  </span>
                  <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                    FPS #{currentShop.shopNumber}
                  </span>
                </div>
                <p><strong>Fair Price Shop:</strong> {currentShop.name}</p>
                <p><strong>Distribution Dates:</strong> {distributionDates}</p>
                <p><strong>Working Shifts:</strong> {shiftHours}</p>
                <p><strong>Entitlements:</strong> Rice (Free), Wheat (Free), Sugar (₹13.50/kg)</p>
                <p><strong>Grievance Officer:</strong> DSO Bengaluru Urban · Dial 1967</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED SUPPLY TRUCK & INWARD GATE PASS */}
        {activeSection === 'inward_stock' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#6B1870] px-2.5 py-0.5 rounded-full">
                    Dealer Fleet Logistics Portal
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">
                    Depot: {currentShop.shopNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#2C0E38] font-serif mt-1">
                  {language === 'kn'
                    ? 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿಗೆ ನಿಯೋಜಿಸಲಾದ ಸರಬರಾಜು ಲಾರಿ ಮತ್ತು ಗುಣಮಟ್ಟ ತಪಾಸಣೆ'
                    : `Supply Truck Assigned to ${currentShop.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Track wholesale delivery vehicle dispatch from KFCSC godown, monitor live GPS transit, and verify electronic weighbridge certificate.
                </p>
              </div>

              {/* Depot Selector for Multi-Depot Dealers */}
              <div className="flex items-center gap-2 shrink-0">
                <label htmlFor="dealer-shop-select" className="text-xs font-bold text-slate-700">
                  Depot:
                </label>
                <select
                  id="dealer-shop-select"
                  value={chosenShopId}
                  onChange={(e) => {
                    setChosenShopId(e.target.value);
                    setInwardConfirmed(false);
                  }}
                  className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-[#6B1870] cursor-pointer"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shopNumber} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {shopDispatch ? (
              <div className="space-y-5">
                {/* 1. ASSIGNED TRUCK PRIMARY FLEET CARD */}
                <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50/40 border-2 border-[#6B1870]/30 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-purple-100">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#6B1870] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Truck className="w-6 h-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#6B1870] uppercase tracking-wider block">
                          ASSIGNED FLEET DELIVERY VEHICLE
                        </span>
                        <h4 className="text-lg font-bold text-[#2C0E38] font-mono">
                          {shopDispatch.truckId}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Assigned Driver: <strong className="text-slate-900">{shopDispatch.driverName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        inwardConfirmed || shopDispatch.status === 'arrived'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : shopDispatch.status === 'in_transit'
                          ? 'bg-purple-100 text-[#6B1870] border border-purple-300 font-black animate-pulse'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {inwardConfirmed
                          ? '✓ Stock Inwarded to ePoS'
                          : shopDispatch.status.replace('_', ' ')}
                      </span>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2C0E38]">
                          {shopDispatch.status === 'arrived'
                            ? 'Vehicle at Counter'
                            : `ETA: ${shopDispatch.etaMinutes} mins (~${(shopDispatch.etaMinutes * 0.28).toFixed(1)} km)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Truck Driver Call & Waybill Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Direct Driver Mobile</span>
                        <strong className="text-slate-900 font-mono text-xs">{shopDispatch.driverPhone}</strong>
                      </div>
                      <a
                        href={`tel:${shopDispatch.driverPhone}`}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-100">
                      <span className="text-slate-500 block text-[11px]">Origin Wholesale Godown</span>
                      <strong className="text-slate-900 text-xs truncate block">{shopDispatch.godownName}</strong>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-100">
                      <span className="text-slate-500 block text-[11px]">Electronic Waybill ID</span>
                      <strong className="text-[#6B1870] font-mono text-xs">WB-{shopDispatch.id}</strong>
                    </div>
                  </div>

                  {/* 4-Stage Live Waybill Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                      Live Waybill Transit Milestones:
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                        1. Godown Weighed
                      </div>
                      <div className={`p-2 rounded-xl font-bold border ${
                        shopDispatch.statusStep >= 2
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        2. Gate Pass Issued
                      </div>
                      <div className={`p-2 rounded-xl font-bold border ${
                        shopDispatch.status === 'in_transit'
                          ? 'bg-purple-100 text-[#6B1870] border-purple-300 ring-2 ring-[#6B1870]/30'
                          : shopDispatch.statusStep >= 3
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        3. In Transit (GPS)
                      </div>
                      <div className={`p-2 rounded-xl font-bold border ${
                        inwardConfirmed || shopDispatch.status === 'arrived'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        4. Unloading at FPS
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. REPLENISHMENT CARGO PAYLOAD MANIFEST */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#6B1870]" />
                      <span>Electronic Manifest Commodity Load (Assigned to {currentShop.shopNumber}):</span>
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#6B1870]">
                      Total: {shopDispatch.recommendedCommodities.reduce((acc, c) => acc + c.quantityKg, 0).toLocaleString()} KG
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {shopDispatch.recommendedCommodities.map((item, idx) => (
                      <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
                        <span className="text-[11px] text-slate-500 block">{item.name}</span>
                        <strong className="text-sm font-mono text-[#2C0E38] block mt-0.5">
                          {item.quantityKg.toLocaleString()} KG
                        </strong>
                        <span className="text-[10px] text-purple-700 font-medium">
                          ~{Math.round(item.quantityKg / 50)} Stitched Bags
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. MANDATORY DEALER DELIVERY VERIFICATION CHECKLIST */}
                <div className="space-y-3 border border-slate-200 rounded-2xl p-5 bg-slate-50/60 shadow-xs">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Mandatory Dealer Delivery Verification Checklist:
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      {
                        key: 'weighbridgeGrossTareNet' as const,
                        label: 'Electronic Weighbridge Gross & Tare weights match manifest certificate.',
                      },
                      {
                        key: 'faqMoistureBelow14' as const,
                        label: 'Fair Average Quality (FAQ) grain check: Moisture < 14%, zero pests, fresh smell.',
                      },
                      {
                        key: 'sealIntact' as const,
                        label: 'Gunny bag tamper-evident barcode tags and stitching intact.',
                      },
                      {
                        key: 'electronicScaleCalibrated' as const,
                        label: 'ePoS digital weighing scale calibrated with certified 5kg test weight.',
                      },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                        <input
                          type="checkbox"
                          checked={inwardChecked[item.key]}
                          onChange={(e) =>
                            setInwardChecked((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="w-4 h-4 text-[#6B1870] rounded border-slate-300 focus:ring-[#6B1870] cursor-pointer"
                        />
                        <span className="text-slate-700 font-medium">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Inward Arrival & ePoS Sync Action */}
                <button
                  type="button"
                  onClick={handleConfirmInwardArrival}
                  disabled={inwardConfirmed}
                  className="w-full py-3.5 bg-[#6B1870] hover:bg-[#57135C] disabled:bg-emerald-600 disabled:opacity-90 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
                  <span>
                    {inwardConfirmed
                      ? '✓ Consignment Acknowledged & Inwarded to ePoS Database'
                      : 'Sign Digital Gate Pass & Confirm Stock Delivery'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <Truck className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Active Truck Delivery for {currentShop.name}</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Current store inventory is within safe operational levels. Next scheduled wholesale buffer dispatch is pending DSO cycle demand lock.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STOCK RECONCILIATION & MONTH-END LEFTOVER REPORT */}
        {activeSection === 'stock_ledger' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#2C0E38] font-serif">
                {language === 'kn' ? 'ದಾಸ್ತಾನು ಲೆಕ್ಕಪತ್ರ ಮತ್ತು ತಿಂಗಳ ಅಂತ್ಯದ ಉಳಿಕೆ' : 'Live Stock Ledger & Month-End Leftover Submission'}
              </h3>
              <p className="text-xs text-slate-500">
                Reconcile physical stock against ePoS transactions and submit closing balances to District Supply Officer (DSO).
              </p>
            </div>

            {leftoverSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Month-end leftover stock ledger verified and filed with DSO Bengaluru Urban.</span>
              </div>
            )}

            {/* Current Stock Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                <span className="text-slate-500 block text-[11px]">Rice Inward Stock</span>
                <strong className="text-sm text-[#2C0E38] font-mono">
                  {currentShop.stock.find((s) => s.id === 'raw_rice')?.allocatedKg || 6000} KG
                </strong>
              </div>
              <div className="p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
                <span className="text-slate-500 block text-[11px]">Wheat Inward Stock</span>
                <strong className="text-sm text-[#2C0E38] font-mono">
                  {currentShop.stock.find((s) => s.id === 'wheat')?.allocatedKg || 1500} KG
                </strong>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-slate-500 block text-[11px]">Total Dispensed</span>
                <strong className="text-sm text-emerald-700 font-mono">6,840 KG</strong>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-slate-500 block text-[11px]">Closing Balance</span>
                <strong className="text-sm text-amber-900 font-mono">1,160 KG</strong>
              </div>
            </div>

            {/* Submit Leftover Form */}
            <form onSubmit={handleLeftoverSubmit} className="space-y-4 border border-purple-100 p-5 rounded-2xl bg-purple-50/20">
              <h4 className="font-bold text-xs text-[#2C0E38]">
                Report Physical Month-End Leftover to DSO:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Leftover Rice (KG)</label>
                  <input
                    type="number"
                    value={leftoverForm.rawRiceKg}
                    onChange={(e) => setLeftoverForm({ ...leftoverForm, rawRiceKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Leftover Wheat (KG)</label>
                  <input
                    type="number"
                    value={leftoverForm.wheatKg}
                    onChange={(e) => setLeftoverForm({ ...leftoverForm, wheatKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Leftover Sugar (KG)</label>
                  <input
                    type="number"
                    value={leftoverForm.sugarKg}
                    onChange={(e) => setLeftoverForm({ ...leftoverForm, sugarKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Leftover Dal (KG)</label>
                  <input
                    type="number"
                    value={leftoverForm.dalKg}
                    onChange={(e) => setLeftoverForm({ ...leftoverForm, dalKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-purple-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#6B1870] hover:bg-[#57135C] text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                Submit Leftover Report to DSO
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
