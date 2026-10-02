import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Package,
  QrCode,
  Shield,
  Clock,
  Search,
  Filter,
  Users,
  AlertCircle,
  Radio,
  Check,
  ChevronRight,
  TrendingDown,
  Printer,
  X,
  Fingerprint,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { VirtualToken } from '../../types/pds';

export const ParallelValidationQueue: React.FC = () => {
  const {
    virtualTokens,
    updateTokenStatus,
    claimGracePassWalkin,
    dealerShopId,
    shops,
  } = usePds();

  const currentShop = shops.find((s) => s.id === dealerShopId) || shops[0];
  const [activeShiftFilter, setActiveShiftFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<VirtualToken | null>(null);
  const [biometricPromptOpen, setBiometricPromptOpen] = useState<boolean>(false);
  const [biometricScanState, setBiometricScanState] = useState<'idle' | 'scanning' | 'matched'>('idle');
  const [showSimulatedQrScan, setShowSimulatedQrScan] = useState<boolean>(false);
  const [bagLabelModalToken, setBagLabelModalToken] = useState<VirtualToken | null>(null);

  // Filter tokens for this shop
  const shopTokens = virtualTokens.filter((t) => t.fpsId === currentShop.id);

  const filteredTokens = shopTokens.filter((token) => {
    const matchesSearch =
      token.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.rationCardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.tokenId.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeShiftFilter === 'all') return matchesSearch;
    if (activeShiftFilter === 'grace') return matchesSearch && token.isGracePass;
    return matchesSearch && token.timeShift.includes(activeShiftFilter);
  });

  const handleVerifyAndPromptBiometric = (token: VirtualToken) => {
    setSelectedToken(token);
    setBiometricScanState('idle');
    setBiometricPromptOpen(true);
  };

  const handleTriggerBiometricScan = () => {
    setBiometricScanState('scanning');
    setTimeout(() => {
      setBiometricScanState('matched');
      setTimeout(() => {
        if (selectedToken) {
          updateTokenStatus(selectedToken.tokenId, 'collected');
        }
      }, 1200);
    }, 1500);
  };

  const handlePrePack = (token: VirtualToken) => {
    updateTokenStatus(token.tokenId, 'pre_packed');
    setBagLabelModalToken(token);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hardware-Free Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-amber-600/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                Parallel Validation Layer
              </span>
              <span className="text-xs text-amber-200 font-mono">
                Runs on Dealer's Normal Smartphone · Zero Extra Cost
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Hardware-Free Queue Pacing & Pre-Packaging Terminal
            </h3>
            <p className="text-xs text-amber-100/80 max-w-2xl mt-1 leading-relaxed">
              Dealers pull pre-packaged grain bags in advance for today's paced shifts and verify digital tokens on their smartphone before directing citizens to the official NIC state ePoS machine.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSimulatedQrScan(true)}
              className="py-2.5 px-4 bg-white text-slate-900 hover:bg-amber-50 rounded-xl font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-amber-700" />
              <span>Scan Citizen QR Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Crowd Pacing Heatmap (Dealer's Today Shifts) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveShiftFilter('all')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            activeShiftFilter === 'all'
              ? 'border-amber-600 bg-amber-50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase block">All Day Manifest</span>
          <span className="text-xl font-black text-slate-900">{shopTokens.length} Tokens</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Paced footfall today</p>
        </div>

        <div
          onClick={() => setActiveShiftFilter('08:00')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            activeShiftFilter === '08:00'
              ? 'border-amber-600 bg-amber-50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">08:00 - 10:00 AM</span>
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          </div>
          <span className="text-xl font-black text-rose-600">
            {shopTokens.filter((t) => t.timeShift.includes('08:00')).length} Tokens
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Peak morning shift</p>
        </div>

        <div
          onClick={() => setActiveShiftFilter('02:00')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            activeShiftFilter === '02:00'
              ? 'border-amber-600 bg-amber-50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">02:00 - 04:00 PM</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-xl font-black text-emerald-700">
            {shopTokens.filter((t) => t.timeShift.includes('02:00')).length} Tokens
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Smooth flow (Fast)</p>
        </div>

        <div
          onClick={() => setActiveShiftFilter('grace')}
          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
            activeShiftFilter === 'grace'
              ? 'border-amber-600 bg-amber-50 shadow-xs'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Grace Pass Walk-ins</span>
            <Shield className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-xl font-black text-amber-700">
            {shopTokens.filter((t) => t.isGracePass).length} Tokens
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Statutory walk-in queue</p>
        </div>
      </div>

      {/* Manifest Table & Pre-Packing Workflow */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Shift Manifest & Pre-Packaging Queue ({filteredTokens.length} Beneficiaries)
            </h4>
            <p className="text-xs text-slate-500">
              Pre-weigh and bag grain in advance: cuts per-beneficiary service time from <strong>12 mins down to 2.5 mins</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search token, name, RC-ID..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 w-52 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table of Queue Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-2.5 px-4">Token & Channel</th>
                <th className="py-2.5 px-4">Beneficiary & Card</th>
                <th className="py-2.5 px-4">Allocated Shift</th>
                <th className="py-2.5 px-4">Pre-Packed Weight</th>
                <th className="py-2.5 px-4">Packaging Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No tokens match the selected shift filter.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => {
                  const isPrePacked = token.status === 'pre_packed';
                  const isCollected = token.status === 'collected';

                  return (
                    <tr key={token.tokenId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">#{token.tokenId}</span>
                          {token.isGracePass && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                              Grace Pass
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">({token.bookedVia})</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{token.beneficiaryName}</span>
                        <span className="text-[10px] font-mono text-slate-500">{token.rationCardNumber}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{token.date}</span>
                        <p className="text-[10px] text-slate-500">{token.timeShift}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0E7C7B]">{token.totalGrainKg} kg</span>
                        <p className="text-[10px] text-slate-500 leading-tight">{token.commoditiesSummary}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            isCollected
                              ? 'bg-slate-100 text-slate-600'
                              : isPrePacked
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCollected ? 'Collected' : isPrePacked ? 'Pre-Packed in Bags' : 'Waiting for Prep'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {!isCollected ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {!isPrePacked ? (
                              <button
                                onClick={() => handlePrePack(token)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold text-[11px] transition-colors"
                              >
                                Pre-Pack Grains
                              </button>
                            ) : (
                              <button
                                onClick={() => setBagLabelModalToken(token)}
                                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 text-[10px] font-medium"
                                title="Print / View Bag Tag"
                              >
                                View Bag Tag
                              </button>
                            )}

                            <button
                              onClick={() => handleVerifyAndPromptBiometric(token)}
                              className="px-3 py-1.5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs flex items-center gap-1"
                            >
                              <span>Prompt ePoS</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Biometric Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bag Allocation Label / Slip Modal */}
      {bagLabelModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-300 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-slate-300">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block">
                  Karnataka PDS · Packaging Label
                </span>
                <h4 className="text-base font-black text-slate-900">
                  BAG TAG #{bagLabelModalToken.tokenId}
                </h4>
              </div>
              <button
                onClick={() => setBagLabelModalToken(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-950 space-y-1">
              <span className="font-bold text-sm block">{bagLabelModalToken.beneficiaryName}</span>
              <span className="text-[11px] text-slate-600 block">{bagLabelModalToken.rationCardNumber}</span>
              <span className="text-[11px] font-bold text-[#0E7C7B] block pt-1">
                Net Weighed Grain: {bagLabelModalToken.totalGrainKg} kg
              </span>
              <span className="text-[10px] text-slate-500 block">
                Breakdown: {bagLabelModalToken.commoditiesSummary}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="h-8 w-full flex items-center justify-center gap-1">
                {[3, 1, 4, 2, 5, 2, 4, 1, 3, 2, 5, 1, 4, 2, 3].map((w, idx) => (
                  <div key={idx} className="bg-slate-900 h-full" style={{ width: `${w * 2.5}px` }}></div>
                ))}
              </div>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest block">
                * PRE-PACKED · SEAL #KA-{bagLabelModalToken.tokenId} *
              </span>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Affix this tag to the weighed grain sacks. Fast handover on beneficiary arrival.
            </p>

            <button
              onClick={() => setBagLabelModalToken(null)}
              className="w-full py-2.5 bg-[#1B2A4A] text-white hover:bg-[#15213b] font-bold rounded-xl text-xs transition-colors"
            >
              Done & Tagged
            </button>
          </div>
        </div>
      )}

      {/* Mandatory State Biometric Scan ePoS Prompt Modal with Live Fingerprint Simulator */}
      {biometricPromptOpen && selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0E7C7B] flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">State ePoS Terminal Interface</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Terminal #KA-BLR-EPOS-104</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricPromptOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-900">{selectedToken.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ration Card:</span>
                <span className="font-mono font-medium text-slate-700">{selectedToken.rationCardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hand-off Weight:</span>
                <span className="font-bold text-[#0E7C7B]">{selectedToken.totalGrainKg} kg (Pre-Packaged)</span>
              </div>
            </div>

            {/* Interactive Biometric Fingerprint Scanner */}
            <div className="p-6 bg-slate-900 rounded-2xl text-center space-y-3 text-white relative overflow-hidden">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-teal-500/40 flex items-center justify-center relative">
                {biometricScanState === 'scanning' && (
                  <div className="absolute inset-0 rounded-full border-4 border-teal-400 animate-ping opacity-60"></div>
                )}
                <Fingerprint
                  className={`w-10 h-10 transition-colors ${
                    biometricScanState === 'matched'
                      ? 'text-emerald-400'
                      : biometricScanState === 'scanning'
                      ? 'text-teal-400 animate-pulse'
                      : 'text-slate-400'
                  }`}
                />
              </div>

              {biometricScanState === 'idle' && (
                <div>
                  <span className="font-bold text-xs block text-slate-200">
                    Awaiting Citizen Thumbprint Scan
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Direct beneficiary to place finger on optical sensor of state ePoS machine.
                  </p>
                </div>
              )}

              {biometricScanState === 'scanning' && (
                <div>
                  <span className="font-bold text-xs block text-teal-300 animate-pulse">
                    Connecting to NIC UIDAI Gateway...
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Matching Aadhaar biometric template...
                  </p>
                </div>
              )}

              {biometricScanState === 'matched' && (
                <div>
                  <span className="font-bold text-xs block text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Biometric Match: 99.8% (Authenticated)</span>
                  </span>
                  <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                    NIC Central Registry Transaction #TRX-2026-98104 Logged
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {biometricScanState === 'idle' ? (
                <button
                  onClick={handleTriggerBiometricScan}
                  className="flex-1 py-3 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Scan Citizen Fingerprint</span>
                </button>
              ) : biometricScanState === 'matched' ? (
                <button
                  onClick={() => setBiometricPromptOpen(false)}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Hand-off Completed & Stock Updated</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl font-bold text-xs cursor-wait"
                >
                  Verifying with UIDAI...
                </button>
              )}

              <button
                onClick={() => setBiometricPromptOpen(false)}
                className="py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Camera QR Scanner Modal */}
      {showSimulatedQrScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Simulated Camera QR Reader</h4>
            <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl relative flex items-center justify-center border-4 border-amber-500 overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-amber-400 animate-bounce"></div>
              <QrCode className="w-24 h-24 text-white/40" />
              <span className="absolute bottom-2 text-[10px] text-amber-300 font-mono">Align Citizen QR</span>
            </div>

            <p className="text-xs text-slate-500">
              Scanning citizen Basavaraj Patil's token #0412...
            </p>

            <button
              onClick={() => {
                setShowSimulatedQrScan(false);
                const target = shopTokens.find((t) => t.beneficiaryName.includes('Basavaraj')) || shopTokens[0];
                handleVerifyAndPromptBiometric(target);
              }}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Simulate Instant QR Match →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
