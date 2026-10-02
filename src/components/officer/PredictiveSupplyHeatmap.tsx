import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  MapPin,
  CheckCircle2,
  Calendar,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Check,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { MigrantPortabilitySpike } from '../../types/pds';

export const PredictiveSupplyHeatmap: React.FC = () => {
  const { migrantSpikes, approveReroute, intentCyclePhase, setIntentCyclePhase, dispatches } = usePds();
  const [selectedSpikeId, setSelectedSpikeId] = useState<string>(migrantSpikes[0]?.id || '');
  const [simulationAddedSpike, setSimulationAddedSpike] = useState(false);

  const selectedSpike = migrantSpikes.find((s) => s.id === selectedSpikeId) || migrantSpikes[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Explaining the 5-Day Intent Window to Predictive Logistics Link */}
      <div className="bg-gradient-to-r from-[#1B2A4A] to-[#0E7C7B] text-white rounded-3xl p-6 shadow-md border border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                Phase 2: Days 6–10 Predictive Logistics
              </span>
              <span className="text-xs font-mono text-teal-200">
                KFCSC Pre-Wholesale Dispatch Optimization
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Predictive Portability Supply Heatmap & ONORC Spike Detection
            </h3>
            <p className="text-xs text-white/80 max-w-3xl mt-1.5 leading-relaxed">
              Consolidates grassroots 5-day intent selections (Days 1–5). Automatically identifies sudden migrant worker clusters under One Nation One Ration Card (ONORC) and recommends warehouse buffer re-routing <strong>before grain trucks lock and depart on Day 11</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono">
              Engine: Python Time-Series & PostGIS Spatial
            </span>
          </div>
        </div>
      </div>

      {/* Anomaly Detection KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Migrant Spikes</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {migrantSpikes.filter((s) => s.rerouteStatus === 'reroute_proposed').length} Detected
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Depots exhibiting &gt;25% abnormal inflow over historical baseline
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Migrant Families Protected</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">530 Households</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Portability claims mapped from North Karnataka & inter-state clusters
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pre-Emptive Buffer Grain</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">+5,560 kg Rice</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Rerouted directly from Yeshwanthpur Buffer Godown
          </p>
        </div>
      </div>

      {/* Main Analysis Console: Left List of Spikes, Right Decision Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Detected Anomaly Spikes */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>ONORC Migrant Inflow Anomaly Queue</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Real-time Intent Feed</span>
          </div>

          {migrantSpikes.map((spike) => {
            const isSelected = selectedSpike.id === spike.id;
            const isApproved = spike.rerouteStatus === 'approved_by_dc';

            return (
              <div
                key={spike.id}
                onClick={() => setSelectedSpikeId(spike.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0E7C7B] bg-white shadow-md ring-2 ring-[#0E7C7B]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{spike.fpsName.split('(')[0]}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {spike.ward}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800 animate-pulse'
                    }`}
                  >
                    {isApproved ? 'Reroute Approved' : `+${spike.spikePercentage}% Surge`}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Historical Avg Demand:</span>
                    <span className="font-semibold text-slate-700">{spike.historicalDemandKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Logged 5-Day Intent:</span>
                    <span className="font-bold text-rose-600">{spike.intentLoggedDemandKg.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Migrant Workers Claiming:</span>
                    <span className="font-semibold text-blue-700">{spike.migrantWorkersCount} families</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-amber-800 font-medium">
                    ⚠️ Stockout without fix: <strong>Day {spike.projectedStockoutDay}</strong>
                  </span>
                  <span className="text-[#0E7C7B] font-bold">Review Route →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Decision-Support Console */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-[#0E7C7B] uppercase tracking-wider">
                Deputy Commissioner (DC) & DSO Command Action
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedSpike.fpsName}
              </h4>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedSpike.rerouteStatus === 'approved_by_dc'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {selectedSpike.rerouteStatus === 'approved_by_dc'
                ? '✓ Pre-Dispatch Reroute Authorized'
                : 'Pending Officer Verification'}
            </span>
          </div>

          {/* Root Cause Diagnosis */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block">Identified ONORC Inflow Vector:</span>
            <p className="text-slate-600 leading-relaxed">
              {selectedSpike.sourceRegion}. Beneficiaries exercised their legal portability rights during the Days 1–5 Intent Window. Because physical collection begins on Day 11, the administration possesses a <strong>5-day operational headstart</strong> to divert grain buffers.
            </p>
          </div>

          {/* Predictive Stockout Timeline Visualizer */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-slate-800">Projected Inventory Horizon (Current vs Demand)</span>
              <span className="text-[11px] text-slate-500 font-mono">Consumption Simulation</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-28 text-slate-500 shrink-0">Unmitigated Run-rate:</span>
                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-[45%]"></div>
                </div>
                <span className="font-bold text-rose-700 shrink-0">Depleted on Day {selectedSpike.projectedStockoutDay}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-28 text-slate-500 shrink-0">With Reroute Truck:</span>
                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-[100%]"></div>
                </div>
                <span className="font-bold text-emerald-700 shrink-0">100% Full Month Coverage (30 Days)</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Reroute Action */}
          <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0E7C7B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Logistics Engine Recommendation</span>
              </span>
              <span className="font-mono text-[11px] text-teal-800 font-semibold">
                Truck: {selectedSpike.recommendedTruckId}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Divert <strong>+{selectedSpike.recommendedAdditionalGrainKg.toLocaleString()} kg Raw Rice (Grade A)</strong> from Yeshwanthpur Central Godown directly to {selectedSpike.fpsName.split('(')[0]}. Grain is loaded onto morning dispatch convoy.
            </p>
          </div>

          {/* The Human-In-The-Loop Decision Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {selectedSpike.rerouteStatus !== 'approved_by_dc' ? (
              <>
                <button
                  onClick={() => approveReroute(selectedSpike.id)}
                  className="w-full sm:flex-1 py-3 px-5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Authorize Pre-Dispatch Reroute (Officer Decision)</span>
                </button>

                <button
                  onClick={() => approveReroute(selectedSpike.id)}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  Modify +15% Buffer
                </button>
              </>
            ) : (
              <div className="w-full p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    Reroute authorized by Sri M. Ramesh Kumar, KSCS (DSO Bengaluru Urban). Truck manifest updated.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700">{selectedSpike.actionTakenAt || 'Just now'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
