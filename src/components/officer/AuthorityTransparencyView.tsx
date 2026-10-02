import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Truck,
  Scale,
  Cpu,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  RefreshCw,
  Award,
} from 'lucide-react';
import { OfficerProfile, OFFICER_PROFILES } from '../../data/mockData';
import { OfficerTier } from '../../types/pds';

interface AuthorityTransparencyViewProps {
  currentTier: OfficerTier;
  onSwitchTier: (tier: OfficerTier) => void;
  openMapsModal: (query?: string, location?: { lat: number; lng: number }, title?: string) => void;
}

export const AuthorityTransparencyView: React.FC<AuthorityTransparencyViewProps> = ({
  currentTier,
  onSwitchTier,
  openMapsModal,
}) => {
  const profile = OFFICER_PROFILES[currentTier] || OFFICER_PROFILES['sec'];

  // State to simulate execution of specific operational tasks
  const [taskExecuted, setTaskExecuted] = useState<Record<string, boolean>>({});
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const handleExecuteTask = (taskId: string, successNote: string) => {
    setTaskExecuted((prev) => ({ ...prev, [taskId]: true }));
    setExecutionMessage(successNote);
    setTimeout(() => {
      setExecutionMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Touchpoint Chain Navigation Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
              Karnataka PDS Complete Supply Chain Architecture
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              {profile.touchpointName}
            </h3>
            <p className="text-xs text-slate-300">
              Role: <strong className="text-amber-300">{profile.title}</strong> · {profile.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Switch Touchpoint:</span>
            <select
              value={currentTier}
              onChange={(e) => onSwitchTier(e.target.value as OfficerTier)}
              className="bg-slate-800 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer focus:outline-hidden"
            >
              <optgroup label="1. Central Government Authority">
                <option value="central_ministry">Ministry of Consumer Affairs, Food & Public Distribution</option>
                <option value="fci">Food Corporation of India (FCI) Regional Office (Bengaluru)</option>
              </optgroup>
              <optgroup label="2. State-Level Leadership & Policymakers">
                <option value="sec">Minister & Principal Secretary (F&CS)</option>
                <option value="comm">The Commissioner (F&CS) - State Command</option>
              </optgroup>
              <optgroup label="3. State Supply Chain Operators">
                <option value="kfcsc_md">Managing Director & District Managers (KFCSC)</option>
                <option value="kfcsc_depot">KFCSC Wholesale Depot Manager (Electronic Scales)</option>
              </optgroup>
              <optgroup label="4. District & Local Administration (The Oversight System)">
                <option value="dc">Deputy Commissioner (DC) - District Head & Licenses</option>
                <option value="jd_dd">Joint Director (JD) / Deputy Director (DD) - Enforcement</option>
                <option value="dso">District Supply Officer (DSO) - Full Operational Control</option>
                <option value="inspector">Food Inspector (FI) - Field Verification & ePoS</option>
              </optgroup>
              <optgroup label="5. Technology Providers (The Digital Gatekeepers)">
                <option value="nic_fist">National Informatics Centre (NIC) - FIST Platform</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Operational Mandate Banner */}
        <div className="mt-3.5 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs leading-relaxed flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 uppercase tracking-wide block text-[11px]">
              Assigned Operational Mandate:
            </span>
            <p className="text-slate-200 mt-0.5">{profile.operationalRole}</p>
          </div>
        </div>
      </div>

      {/* Task Execution Feedback */}
      {executionMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-400 text-emerald-950 rounded-2xl flex items-center gap-3 font-bold shadow-md animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm">{executionMessage}</span>
        </div>
      )}

      {/* TOUCHPOINT 1: CENTRAL MINISTRY */}
      {currentTier === 'central_ministry' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">National Foodgrain Reserve</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">56.8 Million MT</span>
              <span className="text-[11px] text-emerald-600 font-bold">Adequate Buffer (NFSA Mandate)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Karnataka NFSA State Allocation</span>
              <span className="text-2xl font-black text-[#0E7C7B] font-mono mt-1 block">2,17,400 MT/mo</span>
              <span className="text-[11px] text-slate-500">100% Subsidized (Zero Cost to BPL/AAY)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Central Subsidy Outlay (Q3)</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">₹2,520 Crore</span>
              <span className="text-[11px] text-emerald-600 font-bold">Budget Cleared by Ministry</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Central Allocation Mandates & Execution</span>
            </h4>
            <p className="text-xs text-slate-600">
              The Ministry sets the macro allocation for all states and computes the central food subsidy budget.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Annual Allocation Order: GOI-FPD-2026-KA-Q3</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  ACTIVE ALLOTMENT
                </span>
              </div>
              <p className="text-slate-600">
                Mandates 5 kg free foodgrains per person per month under NFSA for Karnataka's 4.12 crore beneficiaries.
              </p>
            </div>

            <button
              disabled={taskExecuted['central_alloc']}
              onClick={() =>
                handleExecuteTask(
                  'central_alloc',
                  'Central NFSA Monthly Allocation of 2,17,400 MT successfully reaffirmed & dispatched to FCI Base Silos!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['central_alloc']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['central_alloc'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Allocation Sanctioned (Ref #GOI-2026-OK)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Authorize Central NFSA Grain Pool Allotment to Karnataka (2,17,400 MT)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 1: FCI REGIONAL OFFICE */}
      {currentTier === 'fci' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Yeshwanthpur Base</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">18,400 MT</span>
              <span className="text-[11px] text-emerald-600 font-bold">Railway Siding Active</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Belagavi Base Silo</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">14,200 MT</span>
              <span className="text-[11px] text-emerald-600 font-bold">Stock Verified</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Hubballi Base Depot</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">12,800 MT</span>
              <span className="text-[11px] text-emerald-600 font-bold">Stock Verified</span>
            </div>
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Mysuru Central Base</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">9,600 MT</span>
              <span className="text-[11px] text-emerald-600 font-bold">Stock Verified</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>FCI Release Orders (RO) Administration</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  FCI issues digital Release Orders to the Karnataka Food & Civil Supplies Corporation (KFCSC) once quotas and paper clearances are confirmed.
                </p>
              </div>
              <button
                onClick={() => openMapsModal('FCI Central Base Godown Yeshwanthpur Bengaluru')}
                className="px-3 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>Locate Base Depots</span>
              </button>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <span>Release Order Clearance File: FCI/RO/KAR/2026/09/SEP</span>
                <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-800 font-mono">
                  READY FOR ISSUANCE
                </span>
              </div>
              <p className="text-amber-800">
                Authorizes KFCSC to lift 42,000 MT Raw Rice and 11,500 MT Wheat from Bengaluru Yeshwanthpur Base Depot for Bengaluru Urban & Rural districts.
              </p>
            </div>

            <button
              disabled={taskExecuted['fci_ro']}
              onClick={() =>
                handleExecuteTask(
                  'fci_ro',
                  'Official FCI Release Order #RO-FCI-KAR-2026-09 signed digitally. KFCSC transport contractors notified to begin lifting!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['fci_ro']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              }`}
            >
              {taskExecuted['fci_ro'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Release Order Signed & Dispatched</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Issue Official FCI Release Order #RO-FCI-KAR-2026-09 to KFCSC</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 2: PRINCIPAL SECRETARY */}
      {currentTier === 'sec' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Statewide PDS Coverage</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">31 Districts</span>
              <span className="text-[11px] text-emerald-600 font-bold">1.12 Crore Ration Cards Active</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Anna Bhagya State Scheme Budget</span>
              <span className="text-2xl font-black text-[#0E7C7B] font-mono mt-1 block">₹468 Cr/Month</span>
              <span className="text-[11px] text-slate-500">Karnataka State Direct Funding</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Monthly Release Status</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">100% Authorized</span>
              <span className="text-[11px] text-emerald-600 font-bold">Cabinet Directives Met</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" />
              <span>State Policy, Budgeting & Monthly Release Directive</span>
            </h4>
            <p className="text-xs text-slate-600">
              Directs state budgets (like funding for Anna Bhagya scheme) and authorizes the monthly release schedules for all 31 districts.
            </p>

            <button
              disabled={taskExecuted['sec_schedule']}
              onClick={() =>
                handleExecuteTask(
                  'sec_schedule',
                  'State Monthly Release Schedule for all 31 Karnataka Districts authorized with Anna Bhagya state funding!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['sec_schedule']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['sec_schedule'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>31-District Release Schedule Authorized</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Authorize State Monthly Release Schedules across all 31 Districts</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 2: COMMISSIONER (STATE COMMAND) */}
      {currentTier === 'comm' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total State Grain Quota</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">2,84,000 MT</span>
              <span className="text-[11px] text-slate-500">NFSA Central + Anna Bhagya</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Slicing Allocation Precision</span>
              <span className="text-2xl font-black text-[#0E7C7B] font-mono mt-1 block">31 / 31</span>
              <span className="text-[11px] text-emerald-600 font-bold">Districts Sliced & Balanced</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">State Logistics Fleet Active</span>
              <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">1,480 Trucks</span>
              <span className="text-[11px] text-emerald-600 font-bold">GPS Tracking Active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>District Quota Slicing Manifest (31 Districts Breakdown)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Bengaluru Urban</span>
                <span className="font-mono text-slate-600">28,400 MT</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Mysuru</span>
                <span className="font-mono text-slate-600">18,200 MT</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Belagavi</span>
                <span className="font-mono text-slate-600">24,100 MT</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Kalaburagi</span>
                <span className="font-mono text-slate-600">16,800 MT</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Dakshina Kannada</span>
                <span className="font-mono text-slate-600">11,500 MT</span>
              </div>
            </div>

            <button
              disabled={taskExecuted['comm_slice']}
              onClick={() =>
                handleExecuteTask(
                  'comm_slice',
                  'Central allocation sliced into exact district monthly quotas and issued to KFCSC wholesale depots!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['comm_slice']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['comm_slice'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>31 District Quotas Sliced & Pushed</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Execute District Quota Slicing Manifest across 31 Districts</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 3: KFCSC MD & DISTRICT MANAGERS */}
      {currentTier === 'kfcsc_md' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Wholesale Godowns Managed</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">312 Depots</span>
              <span className="text-[11px] text-emerald-600 font-bold">100% Stock Accounting Synced</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Contracted Fleet Trucks</span>
              <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">1,480 Fleet</span>
              <span className="text-[11px] text-slate-500">Pulling stock from FCI Bases</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Fair Average Quality (FAQ) Rate</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">99.8% Pass</span>
              <span className="text-[11px] text-slate-500">Moisture & Grain Quality Verified</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Fair Average Quality (FAQ) Grain Testing & Fleet Oversight</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Lab Quality Certificate: Batch #FAQ-KAR-9941 (Raw Rice)</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  PASSED LAB TESTING
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
                <div>Moisture: <strong className="text-slate-900 font-mono">12.1%</strong> (Max: 14.0%)</div>
                <div>Foreign Matter: <strong className="text-slate-900 font-mono">0.4%</strong> (Max: 1.0%)</div>
                <div>Broken Grains: <strong className="text-slate-900 font-mono">3.8%</strong> (Max: 5.0%)</div>
              </div>
            </div>

            <button
              disabled={taskExecuted['kfcsc_faq']}
              onClick={() =>
                handleExecuteTask(
                  'kfcsc_faq',
                  'Fair Average Quality (FAQ) Batch #FAQ-KAR-9941 certified for acceptance and wholesale distribution!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['kfcsc_faq']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {taskExecuted['kfcsc_faq'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>FAQ Quality Batch Certified</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Fair Average Quality (FAQ) Batch Quality Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 3: KFCSC DEPOT MANAGERS */}
      {currentTier === 'kfcsc_depot' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Electronic Weighbridge Status</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">Calibrated</span>
              <span className="text-[11px] text-slate-500">Weights & Measures Stamped</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Truck Gross/Tare Accuracy</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">99.89%</span>
              <span className="text-[11px] text-emerald-600 font-bold">Zero-Theft Protocol Active</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Today's Inward Receipts</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">482 MT</span>
              <span className="text-[11px] text-slate-500">12 Trucks Weighed & Logged</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Electronic Weighbridge Telemetry & Pilferage Prevention</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Truck Inward Weighing: KA-04-E-4910 (Driver: Sri Somanna)</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                  WITHIN TOLERANCE
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-600">
                <div>Gross Weight: <strong className="text-slate-900 font-mono">42.45 MT</strong></div>
                <div>Tare Weight: <strong className="text-slate-900 font-mono">14.10 MT</strong></div>
                <div>Net Weight: <strong className="text-slate-900 font-mono">28.35 MT</strong></div>
                <div>Central Manifest: <strong className="text-slate-900 font-mono">28.40 MT (-0.17%)</strong></div>
              </div>
            </div>

            <button
              disabled={taskExecuted['kfcsc_scale']}
              onClick={() =>
                handleExecuteTask(
                  'kfcsc_scale',
                  'Electronic weighbridge tally verified against central manifest. Zero-pilferage digital gate pass issued!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['kfcsc_scale']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {taskExecuted['kfcsc_scale'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Weighbridge Tally Reconciled</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Verify Electronic Weighbridge Tally & Acknowledge Stock Inward</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 4: DEPUTY COMMISSIONER */}
      {currentTier === 'dc' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">District Jurisdiction</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">Bengaluru Urban</span>
              <span className="text-[11px] text-slate-500">4 Taluks · 842 Fair Price Shops</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Sub-Allotments Signed</span>
              <span className="text-2xl font-black text-[#0E7C7B] font-mono mt-1 block">4 / 4 Taluks</span>
              <span className="text-[11px] text-emerald-600 font-bold">100% Taluk Coverage</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">FPS Licenses Active</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">842 Licenses</span>
              <span className="text-[11px] text-emerald-600 font-bold">0 Violations Pending</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-700" />
              <span>District Supreme Food Administration & FPS Licensing</span>
            </h4>
            <p className="text-xs text-slate-600">
              The DC signs off on the sub-allotment of grain down to individual taluks, finalizes transport logistics, and issues or terminates Fair Price Shop operating licenses.
            </p>

            <button
              disabled={taskExecuted['dc_license']}
              onClick={() =>
                handleExecuteTask(
                  'dc_license',
                  'Taluk sub-allotments signed & Fair Price Shop License renewals approved for Malleshwaram jurisdiction!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['dc_license']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['dc_license'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Taluk Allotment & Licenses Signed</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Sign Taluk Sub-Allotment & Approve FPS License Renewal (#KA-BLR-FPS-104)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 4: JOINT DIRECTOR / DEPUTY DIRECTOR */}
      {currentTier === 'jd_dd' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Surprise Inspections Conducted</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">18 Audits</span>
              <span className="text-[11px] text-emerald-600 font-bold">This Month (Zero Diversion)</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Warehouse Quality Compliance</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">99.4%</span>
              <span className="text-[11px] text-slate-500">Zero Pest / Zero Spoilage</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">GPS Transit Route Audits</span>
              <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">142 Waybills</span>
              <span className="text-[11px] text-emerald-600 font-bold">100% Geofence Matched</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Enforcement & Physical Warehouse Inspection Audit</span>
            </h4>
            <button
              disabled={taskExecuted['dd_audit']}
              onClick={() =>
                handleExecuteTask(
                  'dd_audit',
                  'Surprise inspection audit on Yeshwanthpur Wholesale Hub logged: Physical bags reconciled with digital FIST ledger!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['dd_audit']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['dd_audit'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enforcement Audit Logged</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Log Surprise Inspection Audit on Yeshwanthpur Wholesale Hub</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 4: FOOD INSPECTORS */}
      {currentTier === 'inspector' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Ward 42 Cards Managed</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">1,180 Cards</span>
              <span className="text-[11px] text-emerald-600 font-bold">100% Aadhaar Biometric Seeded</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Duplicate Cards Detected</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">0 Ghost Cards</span>
              <span className="text-[11px] text-slate-500">De-duplication Algorithm Verified</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">ePoS Terminal Calibrations</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">6 Terminals</span>
              <span className="text-[11px] text-emerald-600 font-bold">Firmware & Sensor Verified</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ground-Level Field Audit, Duplicate Card Scanning & ePoS Operations</span>
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={taskExecuted['fi_dedup']}
                onClick={() =>
                  handleExecuteTask(
                    'fi_dedup',
                    'Aadhaar biometric de-duplication scan executed across 1,180 cards: 0 duplicate cards found, database verified pristine!'
                  )
                }
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  taskExecuted['fi_dedup']
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {taskExecuted['fi_dedup'] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>De-Duplication Scan Complete</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Run Biometric De-Duplication Scan</span>
                  </>
                )}
              </button>

              <button
                disabled={taskExecuted['fi_epos']}
                onClick={() =>
                  handleExecuteTask(
                    'fi_epos',
                    'ePoS terminal #POS-BLR-104 and calibrated electronic weighing scale inspected: Firmware v4.2 verified tamper-free!'
                  )
                }
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  taskExecuted['fi_epos']
                    ? 'bg-blue-700 text-white cursor-default'
                    : 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                }`}
              >
                {taskExecuted['fi_epos'] ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ePoS Audit Verified</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Audit ePoS Terminal Firmware #POS-BLR-104</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOUCHPOINT 5: NIC KARNATAKA (FIST PLATFORM) */}
      {currentTier === 'nic_fist' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">FIST Transaction Throughput</span>
              <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">1,48,290/hr</span>
              <span className="text-[11px] text-emerald-600 font-bold">Peak ePoS Sync Active</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Aadhaar Auth Latency</span>
              <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">410 ms</span>
              <span className="text-[11px] text-slate-500">Direct UIDAI Lease Line</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Digital Supply Chain Trail</span>
              <span className="text-2xl font-black text-[#0E7C7B] font-mono mt-1 block">100% Tracked</span>
              <span className="text-[11px] text-emerald-600 font-bold">FCI to Citizen Verified</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Automated Dealer DBT</span>
              <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">₹1.42 Lakh</span>
              <span className="text-[11px] text-slate-500">Retail Commission Batch</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              <span>National Informatics Centre (NIC) FIST Architecture & Dealer DBT Automation</span>
            </h4>
            <p className="text-xs text-slate-600">
              Developed and runs FIST (Financial and Stock Accounting – Food and Civil Supplies) software. FIST maps the entire data trail of the supply chain, manages digital stock acknowledgments, records outward distributions, and automates commission payouts directly to wholesale and retail operators.
            </p>

            <button
              disabled={taskExecuted['nic_dbt']}
              onClick={() =>
                handleExecuteTask(
                  'nic_dbt',
                  'Automated DBT commission payout batch of ₹1,42,800 credited directly to licensed Fair Price Shop dealers bank accounts!'
                )
              }
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                taskExecuted['nic_dbt']
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
              }`}
            >
              {taskExecuted['nic_dbt'] ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dealer Commissions Disbursed via DBT</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Trigger Automated DBT Commission Payout Batch to 8 Licensed FPS Dealers (₹1,42,800)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Switch to Full Operational DSO Role Button */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-blue-900 block">
              Need to perform real-time AI dispatch approvals or route rerouting?
            </span>
            <span className="text-slate-600">
              The District Food & Civil Supplies Officer (DSO) role provides full interactive control over AI recommendations, predictive heatmaps, and GIS maps.
            </span>
          </div>
        </div>

        <button
          onClick={() => onSwitchTier('dso')}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Open DSO Active Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
