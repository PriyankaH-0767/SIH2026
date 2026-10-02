import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  MapPin,
  Truck,
  AlertTriangle,
  FileText,
  BarChart3,
  Building,
  Users,
  Search,
  Check,
  Camera,
  Mic,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Eye,
  AlertCircle,
  TrendingUp,
  Phone,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { OfficerTier, FPSShop, DispatchRecommendation, InspectionTask } from '../../types/pds';
import { OFFICER_PROFILES } from '../../data/mockData';
import { PredictiveSupplyHeatmap } from './PredictiveSupplyHeatmap';
import { AuthorityTransparencyView } from './AuthorityTransparencyView';
import { VoiceHoverGuide } from '../common/VoiceHoverGuide';

export const OfficerSuite: React.FC = () => {
  const {
    officerTier,
    setOfficerTier,
    shops,
    dispatches,
    inspections,
    approveDispatch,
    modifyDispatch,
    rejectDispatch,
    submitInspectionReport,
    openVoiceModal,
    t,
    districtAuthoritiesList,
    activeDistrictAuthority,
    switchDistrictAuthority,
    openMapsModal,
    isDemandLockedByDso,
    lockMonthlyDemandByDso,
  } = usePds();

  // Active sub-tab for DSO
  const [dsoTab, setDsoTab] = useState<'kpi_ai' | 'heatmap' | 'map' | 'report' | 'escalations'>('kpi_ai');

  // Modify dispatch modal state
  const [modifyingDispatch, setModifyingDispatch] = useState<DispatchRecommendation | null>(null);
  const [modifiedQty, setModifiedQty] = useState<number>(7500);
  const [modifyNotes, setModifyNotes] = useState<string>('');

  // Selected shop for map details
  const [selectedMapShopId, setSelectedMapShopId] = useState<string>('KA-BLR-FPS-104');

  // Ward Inspector inspection form state
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null);
  const [inspChecklist, setInspChecklist] = useState<InspectionTask['checklist']>({
    biometricPosWorking: true,
    digitalWeighingScaleCalibrated: true,
    stockRateBoardDisplayed: true,
    cleanStorageSpace: true,
    cleanDrinkingWaterAvail: true,
  });
  const [inspNotes, setInspNotes] = useState<string>('');
  const [inspEscalate, setInspEscalate] = useState<boolean>(false);
  const [inspEscalationReason, setInspEscalationReason] = useState<string>('');

  const currentProfile = OFFICER_PROFILES[officerTier];

  // Jurisdiction-based scoped data filtering
  // Rule: user only ever sees their own jurisdiction and below!
  const getScopedShops = (): FPSShop[] => {
    switch (officerTier) {
      case 'inspector':
        // Ward 42 only!
        return shops.filter((s) => s.ward.includes('42'));
      case 'tahsildar':
        // Bengaluru North taluk only
        return shops.filter((s) => s.taluk.includes('North'));
      case 'supply':
        // Central godown hub linked shops
        return shops.filter((s) => s.taluk.includes('North'));
      case 'dc':
      case 'dso':
        // Bengaluru Urban district (all shops in mock)
        return shops.filter((s) => s.district.includes('Bengaluru'));
      case 'sec':
      case 'comm':
      default:
        return shops;
    }
  };

  const scopedShops = getScopedShops();
  const selectedShop = scopedShops.find((s) => s.id === selectedMapShopId) || scopedShops[0];
  const selectedShopDispatch = dispatches.find((d) => d.fpsId === selectedShop.id);

  // Scoped dispatches
  const scopedDispatches = dispatches.filter((d) =>
    officerTier === 'inspector' ? d.ward.includes('42') : true
  );

  // Scoped inspections
  const scopedInspections = inspections.filter((i) =>
    officerTier === 'inspector' ? i.ward.includes('42') : true
  );

  // Open inspection modal
  const handleOpenInspection = (task: InspectionTask) => {
    setActiveInspectionId(task.id);
    setInspChecklist(task.checklist);
    setInspNotes(task.notes || '');
    setInspEscalate(task.escalatedToDso || false);
    setInspEscalationReason(task.escalationReason || '');
  };

  // Submit inspection report
  const handleSaveInspection = () => {
    if (!activeInspectionId) return;
    submitInspectionReport(activeInspectionId, {
      status: inspEscalate ? 'Escalated' : 'Completed',
      checklist: inspChecklist,
      notes: inspNotes || 'On-site compliance audit conducted.',
      audioNoteTranscript: 'Audited physical premises, weighing scale accuracy certificate, and POS network response.',
      escalatedToDso: inspEscalate,
      escalationReason: inspEscalationReason,
    });
    setActiveInspectionId(null);
  };

  // Handle Modify Dispatch
  const handleSaveModify = () => {
    if (!modifyingDispatch) return;
    const updatedCommodities = modifyingDispatch.recommendedCommodities.map((c, i) =>
      i === 0 ? { ...c, quantityKg: modifiedQty } : c
    );
    modifyDispatch(modifyingDispatch.id, updatedCommodities, modifyNotes);
    setModifyingDispatch(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Jurisdiction Profile & Tier Switcher Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-base border border-blue-200">
            {currentProfile.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {currentProfile.name}
              </h2>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {currentProfile.badgeLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentProfile.title} · <strong className="text-slate-700">{currentProfile.jurisdiction}</strong>
            </p>
          </div>
        </div>

        {/* District Authority and Tier Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-700">District:</span>
            <select
              value={activeDistrictAuthority.id}
              onChange={(e) => switchDistrictAuthority(e.target.value)}
              aria-label="Select District Authority"
              className="bg-transparent font-bold text-blue-900 focus:outline-hidden cursor-pointer"
            >
              {districtAuthoritiesList.map((da) => (
                <option key={da.id} value={da.id}>
                  {da.districtName} ({da.officerName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              openMapsModal(
                `Department of Food and Civil Supplies office near ${activeDistrictAuthority.districtName} Karnataka`,
                undefined,
                `Google Maps Grounding · ${activeDistrictAuthority.districtName}`
              )
            }
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Locate offices on Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Maps Grounding</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 shrink-0 font-medium">Touchpoint & Role:</span>
            <select
              value={officerTier}
              onChange={(e) => setOfficerTier(e.target.value as OfficerTier)}
              aria-label="Select Authority Role"
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 cursor-pointer max-w-[280px]"
            >
              <optgroup label="Touchpoint 4: District Operations (Primary Demo)">
                <option value="dso">DSO (District Supply Officer - Full Active Ops)</option>
                <option value="dc">Deputy Commissioner (District Head & Licenses)</option>
                <option value="jd_dd">Joint/Deputy Director (Enforcement & Audit)</option>
                <option value="inspector">Food Inspector (Field & ePoS Audit)</option>
              </optgroup>
              <optgroup label="Touchpoint 1: Central Government Authority">
                <option value="central_ministry">Ministry of Consumer Affairs (National Allocation)</option>
                <option value="fci">FCI Regional Office Bengaluru (Release Orders)</option>
              </optgroup>
              <optgroup label="Touchpoint 2: State-Level Leadership">
                <option value="sec">Principal Secretary (State Policy & Budget)</option>
                <option value="comm">Commissioner (State Quota Slicing)</option>
              </optgroup>
              <optgroup label="Touchpoint 3: State Supply Chain Operators">
                <option value="kfcsc_md">KFCSC Managing Director (Wholesale Handler)</option>
                <option value="kfcsc_depot">KFCSC Depot Manager (Electronic Scales)</option>
              </optgroup>
              <optgroup label="Touchpoint 5: Technology Providers">
                <option value="nic_fist">NIC Karnataka Unit (FIST Digital Gatekeeper)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Scope Enforcement Banner */}
      <div className="px-4 py-2 bg-slate-100 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>
            <strong>Enforced Scope:</strong> Only records within{' '}
            <span className="text-blue-900 font-semibold">{currentProfile.jurisdiction}</span> are accessible. Sideways or unauthorized upward jurisdiction data is excluded.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {scopedShops.length} Fair Price Depots in Scope
        </span>
      </div>

      {/* VIEW A: DISTRICT FOOD & CIVIL SUPPLIES OFFICER (DSO) - PRIMARY DEMO ROLE */}
      {officerTier === 'dso' && (
        <div className="space-y-6">
          {/* DSO Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setDsoTab('kpi_ai')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                dsoTab === 'kpi_ai'
                  ? 'bg-[#1B2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>KPIs & AI Dispatch Recommendations</span>
            </button>

            <button
              onClick={() => setDsoTab('heatmap')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                dsoTab === 'heatmap'
                  ? 'bg-[#0E7C7B] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              <span>Predictive Supply Heatmap (SIH)</span>
              <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                Spike Alert
              </span>
            </button>

            <button
              onClick={() => setDsoTab('map')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                dsoTab === 'map'
                  ? 'bg-[#1B2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>Assigned Truck Fleet by FPS Shop & GIS Map</span>
            </button>

            <button
              onClick={() => setDsoTab('report')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                dsoTab === 'report'
                  ? 'bg-[#1B2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Monthly Allocation & Leftover Report</span>
            </button>

            <button
              onClick={() => setDsoTab('escalations')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                dsoTab === 'escalations'
                  ? 'bg-[#1B2A4A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Escalations & Field Alerts</span>
              {inspections.some((i) => i.escalatedToDso) && (
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              )}
            </button>
          </div>

          {/* TAB 1: KPIs & AI RECOMMENDATION PANEL */}
          {dsoTab === 'kpi_ai' && (
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Cycle Total Demand
                  </span>
                  <div className="text-2xl font-extrabold text-[#1B2A4A] font-mono">
                    4,820 <span className="text-xs font-normal text-slate-500">MT</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    ↑ 4.2% from Aug cycle
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Stock Position
                  </span>
                  <div className="text-2xl font-extrabold text-[#0E7C7B] font-mono">
                    3,910 <span className="text-xs font-normal text-slate-500">MT (81%)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Safe operational buffer
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Active Delivery Fleet
                  </span>
                  <div className="text-2xl font-extrabold text-blue-700 font-mono">
                    24 / 28 <span className="text-xs font-normal text-slate-500">Active</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    4 trucks on standby at godown
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Pending Dispatches
                  </span>
                  <div className="text-2xl font-extrabold text-amber-600 font-mono">
                    {dispatches.filter((d) => d.status === 'proposed').length}
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                    Requires DSO Authorization
                  </span>
                </div>
              </div>

              {/* DSO MONTHLY DEMAND ALLOCATION LOCK ACTION BANNER */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#2C0E38] to-purple-950 text-white rounded-2xl border-2 border-[#D4AF37] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFD700] text-[#2C0E38] px-2.5 py-0.5 rounded-full">
                      Statutory Demand Finalization
                    </span>
                    <span className="text-xs text-purple-200 font-mono">
                      NFSA & Anna Bhagya Monthly Cycle
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-serif">
                    Lock Monthly District Demand & Provision Default Tokens
                  </h3>
                  <p className="text-xs text-purple-100 leading-relaxed">
                    Under Karnataka PDS statutory workflows, once the District Supply Officer locks the monthly grain demand allocation, default digital tokens are automatically provisioned to all registered cardholders at their active/default depots. Citizens can then book their specific collection time slots as soon as the dealer confirms distribution dates.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <VoiceHoverGuide
                    title="Lock Monthly Demand Allocation (DSO)"
                    description="Locks foodgrain quota demand for the cycle and issues default digital tokens to all cardholders across the district."
                    descriptionKn="ಜಿಲ್ಲೆಯ ಎಲ್ಲಾ ಪಡಿತರ ಚೀಟಿದಾರರಿಗೆ ಡೀಫಾಲ್ಟ್ ಟೋಕನ್‌ಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಲು ಮತ್ತು ಮಾಸಿಕ ಬೇಡಿಕೆಯನ್ನು ಲಾಕ್ ಮಾಡಲು ಒತ್ತಿ."
                  >
                    <button
                      type="button"
                      onClick={lockMonthlyDemandByDso}
                      className="px-5 py-3 bg-[#FFD700] hover:bg-amber-400 active:scale-98 text-[#2C0E38] font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2C0E38]" />
                      <span>
                        {isDemandLockedByDso
                          ? 'Demand Locked & Default Tokens Active (Re-affirm)'
                          : 'Lock Demand Allocation for This Month'}
                      </span>
                    </button>
                  </VoiceHoverGuide>
                </div>
              </div>

              {/* Core Principle Banner */}
              <div className="p-4 bg-[#1B2A4A] text-white rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      Automated Decision-Support Engine: Buffer Optimization
                    </h3>
                    <p className="text-xs text-white/80">
                      Rule formula:{' '}
                      <code className="bg-black/30 px-1.5 py-0.5 rounded text-teal-300 font-mono">
                        Recommend dispatch if current_stock &lt; 1.1 × forecast_demand
                      </code>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-amber-300 font-semibold block">
                    Invariant Enforced:
                  </span>
                  <span className="text-xs font-medium text-white/90">
                    No order dispatches without human click
                  </span>
                </div>
              </div>

              {/* Proposed Dispatch Recommendations List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Pending AI Dispatch Proposals</span>
                  <span className="text-xs font-semibold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800">
                    {dispatches.filter((d) => d.status === 'proposed').length} Awaiting Approval
                  </span>
                </h3>

                {dispatches.map((dispatch) => {
                  const isPending = dispatch.status === 'proposed';
                  const isApproved = dispatch.status === 'approved' || dispatch.status === 'in_transit' || dispatch.status === 'arrived';
                  const isRejected = dispatch.status === 'rejected';

                  return (
                    <div
                      key={dispatch.id}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isPending
                          ? 'bg-white border-amber-300/80 shadow-xs'
                          : isApproved
                          ? 'bg-emerald-50/30 border-emerald-300'
                          : 'bg-slate-50 border-slate-300 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {dispatch.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">·</span>
                            <span className="text-xs font-bold text-slate-900">
                              {dispatch.fpsName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Source: {dispatch.godownName} · Assigned: {dispatch.truckId} (Driver: {dispatch.driverName})
                          </p>
                        </div>

                        {/* Status Label */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {dispatch.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Rule Justification */}
                      <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#0E7C7B] mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-800">{dispatch.ruleExplanation}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span>{dispatch.currentStockMetric}</span>
                              <span>·</span>
                              <span>{dispatch.forecastDemandMetric}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Line Item Commodities Table */}
                      <div className="mb-4">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5 uppercase tracking-wider">
                          Proposed Replenishment Manifest:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {dispatch.recommendedCommodities.map((item, idx) => (
                            <div
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 font-mono"
                            >
                              <span>{item.name}: </span>
                              <strong className="text-[#0E7C7B]">{item.quantityKg.toLocaleString()} kg</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Officer Decision Record if already decided */}
                      {dispatch.officerDecision && (
                        <div className="p-3 bg-emerald-100/50 rounded-xl border border-emerald-200 text-xs text-emerald-900 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">
                              Decision Logged: {dispatch.officerDecision.action.toUpperCase()}
                            </span>
                            <span className="font-mono text-[11px] text-slate-600">
                              {dispatch.officerDecision.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 mt-0.5">
                            By {dispatch.officerDecision.decidedBy} — "{dispatch.officerDecision.notes}"
                          </p>
                        </div>
                      )}

                      {/* Action Buttons for Pending Proposal */}
                      {isPending && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => approveDispatch(dispatch.id)}
                            className="flex-1 sm:flex-none py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.approve}</span>
                          </button>

                          <button
                            onClick={() => {
                              setModifyingDispatch(dispatch);
                              setModifiedQty(dispatch.recommendedCommodities[0]?.quantityKg || 7500);
                              setModifyNotes('Adjustment for Malleshwaram festive demand.');
                            }}
                            className="flex-1 sm:flex-none py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Edit3 className="w-4 h-4 text-blue-600" />
                            <span>{t.modify}</span>
                          </button>

                          <button
                            onClick={() =>
                              rejectDispatch(
                                dispatch.id,
                                'Sufficient local buffer confirmed by Field Inspector.'
                              )
                            }
                            className="flex-1 sm:flex-none py-2 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>{t.reject}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PREDICTIVE PORTABILITY HEATMAP (SIH INNOVATION) */}
          {dsoTab === 'heatmap' && <PredictiveSupplyHeatmap />}

          {/* TAB 3: ASSIGNED TRUCK FLEET BY FPS SHOP & GIS MAP */}
          {dsoTab === 'map' && (
            <div className="space-y-5">
              {/* FPS Shop & Assigned Truck Selector Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0E7C7B] flex items-center justify-center shrink-0 border border-teal-200">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-[#0E7C7B] px-2 py-0.5 rounded">
                        FPS Depot Fleet Inspector
                      </span>
                      <span className="text-xs text-slate-400 font-mono">DSO Jurisdiction: Bengaluru Urban</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      Choose Fair Price Shop to Inspect Assigned Delivery Truck & Real-time Waybill
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <label htmlFor="fps-shop-select" className="text-xs font-bold text-slate-700 shrink-0">
                    Chosen FPS Shop:
                  </label>
                  <select
                    id="fps-shop-select"
                    value={selectedMapShopId}
                    onChange={(e) => setSelectedMapShopId(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0E7C7B] focus:border-[#0E7C7B] cursor-pointer shadow-2xs"
                  >
                    {scopedShops.map((s) => {
                      const sDisp = dispatches.find((d) => d.fpsId === s.id);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.shopNumber} - {s.name} ({sDisp ? `🚚 Truck ${sDisp.truckId.split(' ')[0]}` : 'No Truck'})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Quick Hub Pills for Instant Switching */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Quick Select Depot:
                </span>
                {scopedShops.map((s) => {
                  const isChosen = selectedMapShopId === s.id;
                  const sDisp = dispatches.find((d) => d.fpsId === s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedMapShopId(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isChosen
                          ? 'bg-[#0E7C7B] text-white shadow-xs ring-2 ring-[#0E7C7B]/30'
                          : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>{s.shopNumber}</span>
                      {sDisp && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isChosen ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          🚚 {sDisp.truckId.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Map Canvas (7 Cols) */}
                <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-4 text-white border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0E7C7B]" />
                      <span className="text-xs font-bold">Bengaluru Urban District Fleet GIS Transit Corridors</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Verified Shop
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Transit Active
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Buffer Hub
                      </span>
                    </div>
                  </div>

                  {/* Interactive SVG Map with Transit Route */}
                  <div className="relative h-88 bg-slate-950/90 rounded-xl overflow-hidden border border-slate-800">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Zone Boundary Outline */}
                      <path
                        d="M 10 10 L 80 15 L 90 85 L 15 90 Z"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />

                      {/* Godown Hub Icon */}
                      <circle cx="15" cy="20" r="4.5" fill="#3B82F6" stroke="#93C5FD" strokeWidth="0.8" />
                      <text x="17" y="16" fill="#93C5FD" fontSize="3" fontWeight="bold">
                        Central Godown (Yeshwanthpur Hub 1)
                      </text>

                      {/* Dynamic Transit Route from Godown (15, 20) to Chosen Shop */}
                      <line
                        x1="15"
                        y1="20"
                        x2={selectedShop.coordinates.x}
                        y2={selectedShop.coordinates.y}
                        stroke="#0E7C7B"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                        className="animate-pulse"
                      />

                      {/* Shops on Map */}
                      {scopedShops.map((shop) => {
                        const isSelected = selectedShop.id === shop.id;
                        const sDisp = dispatches.find((d) => d.fpsId === shop.id);
                        const color =
                          shop.readinessStatus === 'Verified'
                            ? '#10B981'
                            : shop.readinessStatus === 'Discrepancy'
                            ? '#F59E0B'
                            : '#EF4444';

                        return (
                          <g
                            key={shop.id}
                            className="cursor-pointer"
                            onClick={() => setSelectedMapShopId(shop.id)}
                          >
                            {isSelected && (
                              <circle
                                cx={shop.coordinates.x}
                                cy={shop.coordinates.y}
                                r="5.5"
                                fill="none"
                                stroke="#38BDF8"
                                strokeWidth="1"
                                className="animate-ping"
                              />
                            )}
                            <circle
                              cx={shop.coordinates.x}
                              cy={shop.coordinates.y}
                              r={isSelected ? '3.8' : '3'}
                              fill={isSelected ? '#38BDF8' : color}
                              stroke={isSelected ? '#FFFFFF' : '#1E293B'}
                              strokeWidth="0.8"
                            />
                            <text
                              x={shop.coordinates.x + 4}
                              y={shop.coordinates.y + 1}
                              fill={isSelected ? '#38BDF8' : '#E2E8F0'}
                              fontSize={isSelected ? '3.2' : '2.8'}
                              fontWeight={isSelected ? 'bold' : 'normal'}
                            >
                              {shop.shopNumber}
                            </text>
                            {sDisp && isSelected && (
                              <text
                                x={shop.coordinates.x + 4}
                                y={shop.coordinates.y + 5}
                                fill="#FDE047"
                                fontSize="2.3"
                                fontStyle="italic"
                              >
                                🚚 {sDisp.truckId.split(' ')[0]}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Animated In-Transit Truck Marker on the Route */}
                      {selectedShopDispatch && (
                        <g>
                          <circle
                            cx={(15 + selectedShop.coordinates.x) / 2}
                            cy={(20 + selectedShop.coordinates.y) / 2}
                            r="3"
                            fill="#F59E0B"
                            stroke="#FFFFFF"
                            strokeWidth="0.8"
                          />
                          <text
                            x={(15 + selectedShop.coordinates.x) / 2 + 3.5}
                            y={(20 + selectedShop.coordinates.y) / 2 + 1}
                            fill="#FDE047"
                            fontSize="2.7"
                            fontWeight="bold"
                          >
                            🚚 {selectedShopDispatch.truckId.split(' ')[0]} (ETA {selectedShopDispatch.etaMinutes}m)
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Click any shop depot to view assigned delivery truck</span>
                    <span className="font-mono text-emerald-400">KSWAN Live Transponder Linked</span>
                  </div>
                </div>

                {/* Shop & Assigned Truck Inspection Sidebar (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  {/* Shop Header Details */}
                  <div className="pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500 font-bold block">
                        {selectedShop.shopNumber} · {selectedShop.ward}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          selectedShop.readinessStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedShop.readinessStatus}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{selectedShop.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedShop.address}</p>
                  </div>

                  {/* ASSIGNED SUPPLY TRUCK FOR CHOSEN FPS SHOP (USER SPECIFIED CORE REQUIREMENT) */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 via-slate-50 to-purple-50 rounded-2xl border-2 border-[#6B1870]/30 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#6B1870] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-[#6B1870] uppercase tracking-wider block">
                            Assigned Supply Truck
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            Chosen Depot: {selectedShop.shopNumber}
                          </h4>
                        </div>
                      </div>

                      {selectedShopDispatch ? (
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          selectedShopDispatch.status === 'arrived'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : selectedShopDispatch.status === 'in_transit'
                            ? 'bg-purple-100 text-[#6B1870] border border-purple-300 font-black animate-pulse'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {selectedShopDispatch.status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">No Active Truck</span>
                      )}
                    </div>

                    {selectedShopDispatch ? (
                      <div className="space-y-2.5 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Assigned Vehicle:</span>
                            <span className="font-mono font-bold text-[#2C0E38] text-xs">
                              {selectedShopDispatch.truckId}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Assigned Driver:</span>
                            <span className="font-bold text-slate-900">
                              {selectedShopDispatch.driverName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-medium">Driver Phone:</span>
                            <a
                              href={`tel:${selectedShopDispatch.driverPhone}`}
                              className="font-mono font-bold text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-blue-500" />
                              {selectedShopDispatch.driverPhone}
                            </a>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="text-slate-500 font-medium">Transit ETA:</span>
                            <strong className="text-[#0E7C7B] font-mono text-xs">
                              {selectedShopDispatch.status === 'arrived'
                                ? '✓ Consignment Arrived at Depot'
                                : `${selectedShopDispatch.etaMinutes} mins remaining (~${(selectedShopDispatch.etaMinutes * 0.28).toFixed(1)} km)`}
                            </strong>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Origin Godown:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[190px]">
                              {selectedShopDispatch.godownName}
                            </span>
                          </div>
                        </div>

                        {/* 4-Stage Waybill Progress Tracker */}
                        <div className="p-2.5 bg-white rounded-xl border border-purple-100 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                            GPS Waybill Transit Stages:
                          </span>
                          <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                            <div className="p-1 rounded-md bg-emerald-100 text-emerald-900 font-bold">
                              1. Weighed
                            </div>
                            <div className={`p-1 rounded-md font-bold ${
                              selectedShopDispatch.statusStep >= 2 ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-500'
                            }`}>
                              2. Gate Pass
                            </div>
                            <div className={`p-1 rounded-md font-bold ${
                              selectedShopDispatch.status === 'in_transit'
                                ? 'bg-purple-100 text-[#6B1870] ring-1 ring-[#6B1870]'
                                : selectedShopDispatch.statusStep >= 3
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              3. In Transit
                            </div>
                            <div className={`p-1 rounded-md font-bold ${
                              selectedShopDispatch.status === 'arrived'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              4. Unloaded
                            </div>
                          </div>
                        </div>

                        {/* Cargo Payload Manifest */}
                        <div className="p-2.5 bg-white rounded-xl border border-purple-100 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            <span>Replenishment Cargo:</span>
                            <strong className="text-[#0E7C7B]">
                              {selectedShopDispatch.recommendedCommodities.reduce((a, c) => a + c.quantityKg, 0).toLocaleString()} kg Total
                            </strong>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {selectedShopDispatch.recommendedCommodities.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-800"
                              >
                                {item.name.split(' ')[0]}: <strong>{item.quantityKg.toLocaleString()}kg</strong>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* DSO Direct Fleet Management Controls */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={`tel:${selectedShopDispatch.driverPhone}`}
                            className="py-2 px-3 bg-[#1B2A4A] hover:bg-[#131f37] text-white rounded-xl font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Driver</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              alert(`Priority Green Corridor Signal broadcast to Truck ${selectedShopDispatch.truckId} via KSWAN dispatch relay.`);
                            }}
                            className="py-2 px-3 bg-[#0E7C7B] hover:bg-[#0A6362] text-white rounded-xl font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Priority Signal</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                        <Truck className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-500">
                          No wholesale replenishment truck currently in transit for {selectedShop.name}. On-hand inventory is within standard buffer threshold.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Real-time On-Hand Stock */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Real-time Foodgrain Stock at Counter:
                    </span>
                    <div className="space-y-1.5">
                      {selectedShop.stock.map((item) => (
                        <div
                          key={item.id}
                          className="p-2 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800">{item.name}</span>
                          <div className="text-right font-mono">
                            <strong className="text-slate-900">{item.currentKg.toLocaleString()}</strong>
                            <span className="text-slate-400 text-[11px]"> / {item.monthlyDemandKg.toLocaleString()} kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-slate-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#0E7C7B]">Dealer in Charge:</span>
                      <span className="font-bold text-slate-900">{selectedShop.dealerName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Beneficiaries Registered:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedShop.beneficiaryCount} cards</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY ALLOCATION & LEFTOVER REPORT */}
          {dsoTab === 'report' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    September 2026 Monthly Allocation & Stock Reconciliation Report
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated across all fair price shops under Bengaluru Urban District jurisdiction.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">Ref: KA-DSO-RPT-2026-09</span>
              </div>

              {/* Month-End Leftover Rollup (Cross-reactive from Dealer's input!) */}
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0E7C7B]" />
                    <span>Cross-Role Reactive Leftover Stock (Feeding from FPS Dealer Submissions)</span>
                  </h4>
                  <span className="text-[11px] text-[#0E7C7B] font-semibold">
                    Live Database Linked
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-teal-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Raw Rice Carryover</span>
                    <span className="text-base font-bold font-mono text-[#0E7C7B]">
                      {scopedShops.reduce((acc, s) => acc + s.lastMonthLeftover.rawRiceKg, 0).toLocaleString()} kg
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-teal-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Wheat Carryover</span>
                    <span className="text-base font-bold font-mono text-[#0E7C7B]">
                      {scopedShops.reduce((acc, s) => acc + s.lastMonthLeftover.wheatKg, 0).toLocaleString()} kg
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-teal-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Sugar Carryover</span>
                    <span className="text-base font-bold font-mono text-[#0E7C7B]">
                      {scopedShops.reduce((acc, s) => acc + s.lastMonthLeftover.sugarKg, 0).toLocaleString()} kg
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-teal-100">
                    <span className="text-[10px] text-slate-500 block uppercase">Dal Carryover</span>
                    <span className="text-base font-bold font-mono text-[#0E7C7B]">
                      {scopedShops.reduce((acc, s) => acc + s.lastMonthLeftover.dalKg, 0).toLocaleString()} kg
                    </span>
                  </div>
                </div>
              </div>

              {/* District Table breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Shop Depot</th>
                      <th className="py-2.5 px-3">Ward</th>
                      <th className="py-2.5 px-3">Beneficiaries</th>
                      <th className="py-2.5 px-3">Current Stock</th>
                      <th className="py-2.5 px-3">Reported Leftover</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scopedShops.map((shop) => (
                      <tr key={shop.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3 font-semibold text-slate-900">{shop.name} ({shop.shopNumber})</td>
                        <td className="py-3 px-3 text-slate-600">{shop.ward}</td>
                        <td className="py-3 px-3 font-mono text-slate-800">{shop.beneficiaryCount}</td>
                        <td className="py-3 px-3 font-mono text-[#0E7C7B] font-semibold">
                          {shop.stock[0].currentKg.toLocaleString()} kg Rice
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">
                          {shop.lastMonthLeftover.rawRiceKg} kg Rice
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              shop.distributionStarted
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {shop.distributionStarted ? 'Distribution Active' : 'Pre-Distribution'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ESCALATIONS & FIELD ALERTS */}
          {dsoTab === 'escalations' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Field Officer Escalations & Hardware Reports</span>
              </h3>

              <div className="space-y-3">
                {inspections
                  .filter((i) => i.escalatedToDso)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-amber-50/60 rounded-xl border border-amber-300 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          Escalated by Ward 42 Food Inspector (Pratibha N. Rao)
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">{task.scheduledDate}</span>
                      </div>
                      <p className="font-semibold text-slate-800">Depot: {task.fpsName}</p>
                      <p className="text-slate-700 bg-white p-2.5 rounded border border-amber-200">
                        {task.escalationReason}
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => alert('Emergency backup POS reader dispatched via KSWAN Vendor.')}
                          className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs"
                        >
                          Dispatch Replacement POS Reader
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: FOOD INSPECTOR / FIELD OFFICER (WARD HEAD) - FULLY BUILT */}
      {officerTier === 'inspector' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider block">
                Ward Head Field Terminal
              </span>
              <h3 className="text-lg font-bold">
                Ward 42 (Malleshwaram) Assigned Fair Price Depots
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                First point of escalation before DSO. Inspect digital weighing scales, POS connectivity & submit voice audit.
              </p>
            </div>
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 font-mono">
              4 FPS under Ward 42
            </span>
          </div>

          {/* Assigned Inspection Task List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              Assigned Field Audit Tasks & FPS Readiness Status:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scopedInspections.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-slate-400">{task.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'Escalated'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900">{task.fpsName}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">Audit Scheduled: {task.scheduledDate}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Biometric POS:</span>
                        <span className={task.checklist.biometricPosWorking ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                          {task.checklist.biometricPosWorking ? 'Working' : 'Failure'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Weighing Scale:</span>
                        <span className={task.checklist.digitalWeighingScaleCalibrated ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {task.checklist.digitalWeighingScaleCalibrated ? 'Calibrated' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenInspection(task)}
                      className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Audit & Submit Report</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Inspection Modal */}
          {activeInspectionId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Conduct On-Site Compliance Audit
                    </h4>
                    <p className="text-xs text-slate-500">
                      Task ID: {activeInspectionId} (Ward 42 Malleshwaram)
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveInspectionId(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Checklist */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block">Mandatory Checkpoints:</span>
                    {[
                      { key: 'biometricPosWorking', label: 'Biometric POS Terminal Operational & Online' },
                      { key: 'digitalWeighingScaleCalibrated', label: 'Digital Weighing Scale Stamped by Weights & Measures Dept' },
                      { key: 'stockRateBoardDisplayed', label: 'Mandatory Commodity Rate Board Displayed in Kannada' },
                      { key: 'cleanStorageSpace', label: 'Storage Area Dry & Pest-Free' },
                      { key: 'cleanDrinkingWaterAvail', label: 'Clean Drinking Water Facility for Beneficiaries' },
                    ].map((chk) => (
                      <label key={chk.key} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(inspChecklist as any)[chk.key]}
                          onChange={(e) =>
                            setInspChecklist((prev) => ({ ...prev, [chk.key]: e.target.checked }))
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-slate-800">{chk.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Photo & Voice Note */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Photo & Voice Verification:</span>
                      <button
                        type="button"
                        onClick={() =>
                          openVoiceModal(
                            'Inspector Voice Note',
                            (txt) => setInspNotes(txt),
                            'All five mandatory compliance checks verified on-site. Biometric POS machine connected to KSWAN server.'
                          )
                        }
                        className="text-[#0E7C7B] font-bold flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Dictate Voice Note</span>
                      </button>
                    </div>

                    <div className="p-2 bg-white rounded border border-dashed border-slate-300 text-center text-slate-500 py-3">
                      <Camera className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                      <span className="text-[11px]">Simulated Photo Attachment: scale_stamp_cert_2026.jpg</span>
                    </div>

                    <textarea
                      value={inspNotes}
                      onChange={(e) => setInspNotes(e.target.value)}
                      placeholder="Add field inspection observations..."
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  {/* Escalate to DSO Option */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                    <label className="flex items-center gap-2 font-bold text-amber-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspEscalate}
                        onChange={(e) => setInspEscalate(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded"
                      />
                      <span>Escalate Discrepancy Directly to DSO</span>
                    </label>

                    {inspEscalate && (
                      <input
                        type="text"
                        value={inspEscalationReason}
                        onChange={(e) => setInspEscalationReason(e.target.value)}
                        placeholder="Reason for immediate DSO intervention (e.g. Hardware failure)..."
                        className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs"
                      />
                    )}
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveInspectionId(null)}
                      className="py-2 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveInspection}
                      className="py-2 px-5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow-xs"
                    >
                      Submit Audit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW C: ALL OTHER OPERATIONAL TIERS - COMPLETE TRANSPARENCY & TASK EXECUTION DASHBOARD */}
      {officerTier !== 'dso' && (
        <AuthorityTransparencyView
          currentTier={officerTier}
          onSwitchTier={(tier) => setOfficerTier(tier)}
          openMapsModal={openMapsModal}
        />
      )}

      {/* Modify Dispatch Modal */}
      {modifyingDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1">
              Modify Allocation Proposal: {modifyingDispatch.fpsName}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Adjust commodity kilogram dispatch quantities before signing approval.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Raw Rice Allocation (kg)
                </label>
                <input
                  type="number"
                  value={modifiedQty}
                  onChange={(e) => setModifiedQty(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg font-mono focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reason / Officer Notes
                </label>
                <input
                  type="text"
                  value={modifyNotes}
                  onChange={(e) => setModifyNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setModifyingDispatch(null)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModify}
                className="py-2 px-4 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-lg font-bold text-xs shadow-xs"
              >
                Save & Approve Modified Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
