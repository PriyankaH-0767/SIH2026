import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Cpu,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Server,
  Database,
  ArrowRight,
  Users,
  QrCode,
  Radio,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';

export const SihPitchDeckModal: React.FC = () => {
  const { sihPitchModalOpen, setSihPitchModalOpen, setCurrentRole, setIntentCyclePhase } = usePds();
  const [activeSlide, setActiveSlide] = useState<1 | 2 | 3>(1);

  if (!sihPitchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Pitch Deck Top Navigation Bar */}
        <div className="px-6 py-4 bg-[#1B2A4A] text-white flex items-center justify-between border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-md bg-[#0E7C7B] text-[11px] font-bold tracking-wider uppercase">
              SIH Screening Round
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Intelligent PDS Optimization Framework
              </h2>
              <p className="text-[11px] text-slate-300">
                Official 3-Slide Architecture Pitch Deck · Problem ID: Dynamic PDS Pacing & Logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-xs">
              <button
                onClick={() => setActiveSlide(1)}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  activeSlide === 1 ? 'bg-white text-[#1B2A4A] shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                1. Problem
              </button>
              <button
                onClick={() => setActiveSlide(2)}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  activeSlide === 2 ? 'bg-white text-[#1B2A4A] shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                2. Solution
              </button>
              <button
                onClick={() => setActiveSlide(3)}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
                  activeSlide === 3 ? 'bg-white text-[#1B2A4A] shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
              >
                3. Tech Stack
              </button>
            </div>

            <button
              onClick={() => setSihPitchModalOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F8FAFC]">
          {/* ======================================================== */}
          {/* SLIDE 1: Problem Statement & Ground Reality */}
          {/* ======================================================== */}
          {activeSlide === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0E7C7B] uppercase tracking-wider">
                    Slide 1 of 3 · Problem Statement Definition
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    The Ground Reality: Peak Queue Congestion & Reactive ONORC Stockouts
                  </h3>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-400 block">Root Inefficiency</span>
                  <span className="text-sm font-bold text-rose-600">Reactive Allocation</span>
                </div>
              </div>

              {/* The Core Pitch Sentences */}
              <div className="p-4 sm:p-5 bg-rose-50/80 rounded-2xl border-2 border-rose-200 text-rose-950">
                <h4 className="font-bold text-sm flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>The High-Friction Government PDS Bottleneck:</span>
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                  Fair Price Shops (FPS) operate on a purely <strong>reactive, first-come-first-served basis</strong>. 
                  During the first week of every month, beneficiaries endure <strong>2 to 4-hour queues</strong> leading to citizen fatigue, daily wage losses, and retail chaos. Simultaneously, under <strong>One Nation One Ration Card (ONORC)</strong>, fluid migration patterns cause sudden local demand surges that deplete shop inventory days before central warehouses realize a shortage exists.
                </p>
              </div>

              {/* Grid of Key Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Retail Queue Whiplash</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    65% of monthly footfall rushes into shops in Days 1–7. Dealers cannot balance customer throughput, causing server timeouts on ePoS machines and citizen agitation.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">ONORC Blind Spots</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Current government supply chains allocate grain strictly based on previous months' historical quotas. When 200 migrant families arrive for a construction project, the local shop experiences acute stockouts.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Hardware Fatigue</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Past hackathon ideas attempted to replace existing government biometric scanners with expensive proprietary IoT devices, making them legally non-compliant and impossible to deploy at state scale.
                  </p>
                </div>
              </div>

              {/* The Static vs Predictive Flowchart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Current Reactive Government Model vs Innovation Opportunity
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="font-bold text-slate-500 block mb-1">Step 1: Month T-1 History</span>
                    <span className="text-[11px] text-slate-400">Fixed quota allocated blindly</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                  <div className="w-full sm:w-1/3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                    <span className="font-bold text-rose-700 block mb-1">Step 2: Unannounced Influx</span>
                    <span className="text-[11px] text-rose-600">Migrant rush creates stockout</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                  <div className="w-full sm:w-1/3 p-3 bg-red-100 border border-red-300 rounded-xl text-center">
                    <span className="font-bold text-red-900 block mb-1">Step 3: Late Emergency Fix</span>
                    <span className="text-[11px] text-red-700">Days of delays & public outcry</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SLIDE 2: Proposed Solution Architecture */}
          {/* ======================================================== */}
          {activeSlide === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0E7C7B] uppercase tracking-wider">
                    Slide 2 of 3 · Proposed Solution Architecture
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    The 5-Day "Intent Capture Window" & Parallel Validation Layer
                  </h3>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-400 block">The Innovation</span>
                  <span className="text-sm font-bold text-emerald-600">Intent Pre-Allocation</span>
                </div>
              </div>

              {/* The SIH Pitch in 3 Sentences Box */}
              <div className="p-4 sm:p-5 bg-teal-50/80 rounded-2xl border-2 border-teal-200 text-teal-950">
                <span className="text-[11px] font-bold text-[#0E7C7B] uppercase tracking-wider block mb-1">
                  The SIH Architecture Pitch (How It Works in 3 Sentences)
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-800">
                  Our application introduces a <strong>5-day pre-booking intent window</strong> at the start of the month to capture citizen collection plans before distribution begins. It processes this data through an analytics engine to <strong>predict regional shortages and optimize government truck routes</strong>, while generating <strong>virtual tokens for citizens</strong> to eliminate physical wait lines. The solution acts as an optimization layer that runs alongside existing Aadhaar biometric laws without requiring changes to central databases.
                </p>
              </div>

              {/* The 3-Phase Monthly Pipeline Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-2xl border-2 border-teal-500 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#0E7C7B] bg-teal-50 px-2 py-0.5 rounded-md">
                      Days 1–5
                    </span>
                    <Users className="w-4 h-4 text-[#0E7C7B]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Citizen Intent Input</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Families use the app (or USSD / IVR) to select estimated collection day, shop, and 2-hour shift. Dynamic Slot Balancer shows Green/Yellow/Red wait times and suggests alternative nearby shops when full.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border-2 border-blue-500 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      Days 6–10
                    </span>
                    <TrendingUp className="w-4 h-4 text-blue-700" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Predictive Logistics</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Demand engine aggregates intents. If 200 migrant workers flag collection at Shop B, system predicts stockout and alerts the Deputy Commissioner / DSO to reroute buffer trucks <strong>before wholesale grain locks</strong>.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-2xl border-2 border-emerald-500 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Days 11–25
                    </span>
                    <QrCode className="w-4 h-4 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Dynamic Token & Pickup</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Citizens arrive with Virtual Token (QR code / SMS snippet). Dealer sees today's crowd heatmap, pre-packs grain bags, and directs citizen to mandatory ePoS biometric scan.
                  </p>
                </div>
              </div>

              {/* Dual Critical Highlights: Grace Pass & Rural Fallback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-bold">
                    <Shield className="w-4 h-4 text-amber-700" />
                    <span>The "Grace Pass" Invariant Rule:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    If a user misses their pre-booked slot or forgets to register during the 5-day window, they can <strong>still walk into any shop</strong> and collect their ration via standard biometric authentication. Our app paces crowd traffic; it <strong>never blocks a citizen's baseline legal access rights</strong>.
                  </p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-indigo-900 font-bold">
                    <Smartphone className="w-4 h-4 text-indigo-700" />
                    <span>100% Rural SMS & IVR Fallback:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Beneficiaries without smartphones or data connectivity can book tokens via simple <strong>USSD codes (*99*104#)</strong> or automated <strong>Annavani IVR voice phone calls</strong>, delivering equal digital empowerment to rural Karnataka.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SLIDE 3: Tech Stack & Non-Intrusive Integration */}
          {/* ======================================================== */}
          {activeSlide === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0E7C7B] uppercase tracking-wider">
                    Slide 3 of 3 · Recommended Tech Stack & Compliance Path
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    Lightweight, Non-Intrusive Architecture
                  </h3>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-slate-400 block">Integration Compliance</span>
                  <span className="text-sm font-bold text-teal-600">Zero Core DB Disruption</span>
                </div>
              </div>

              {/* 3 Pillars of Technology */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0E7C7B] flex items-center justify-center font-bold mb-3">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Frontend Layer</h4>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1.5 leading-relaxed">
                    <li>• <strong>React SPA / Flutter</strong> cross-platform target for budget Android smartphones.</li>
                    <li>• Voice-first input in Kannada, English, Hindi, Tamil, Telugu.</li>
                    <li>• Offline-first token caching with high-contrast QR display.</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-3">
                    <Server className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Backend & Analytics Engine</h4>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1.5 leading-relaxed">
                    <li>• <strong>Python (Flask/Django)</strong> time-series demand forecasting model.</li>
                    <li>• Dynamic Slot Balancer balancing footfall against dealer speed (25 beneficiaries/hr).</li>
                    <li>• Anomaly detection triggering DC alerts on +25% migrant spikes.</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-3">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Database & Spatial Mapping</h4>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1.5 leading-relaxed">
                    <li>• <strong>PostgreSQL + PostGIS</strong> extensions for dealer geospatial proximity calculations.</li>
                    <li>• Real-time truck route tracking between KFCSC depots and FPS retail stores.</li>
                    <li>• Encrypted token registry running in parallel with central NIC ePDS.</li>
                  </ul>
                </div>
              </div>

              {/* The Hardware-Free Dealer Interface Highlight */}
              <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">
                    The Parallel Validation Layer: Zero New Hardware for Dealers
                  </h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Dealers do not need expensive scanning hardware. They open a lightweight web dashboard on their <strong>existing smartphone</strong>, verify the citizen's token to pull pre-bagged grains, and then direct them to perform the mandatory Aadhaar biometric validation on the official state ePoS terminal.
                  </p>
                </div>
              </div>

              {/* Interactive Demo Shortcuts for Evaluators */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-700">Test Live Capabilities in Prototype:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSihPitchModalOpen(false);
                      setCurrentRole('citizen');
                      setIntentCyclePhase('days_1_5');
                    }}
                    className="px-3 py-1.5 bg-[#0E7C7B] hover:bg-[#0c6b6a] text-white rounded-lg font-bold transition-colors"
                  >
                    Launch 5-Day Intent Booking →
                  </button>
                  <button
                    onClick={() => {
                      setSihPitchModalOpen(false);
                      setCurrentRole('officer');
                      setIntentCyclePhase('days_6_10');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                  >
                    View DC Predictive Reroute Map →
                  </button>
                  <button
                    onClick={() => {
                      setSihPitchModalOpen(false);
                      setCurrentRole('dealer');
                      setIntentCyclePhase('days_11_25');
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                  >
                    View Hardware-Free Dealer Queue →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pitch Deck Bottom Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSlide((prev) => (prev === 1 ? 1 : ((prev - 1) as 1 | 2 | 3)))}
              disabled={activeSlide === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <button
              onClick={() => setActiveSlide((prev) => (prev === 3 ? 3 : ((prev + 1) as 1 | 2 | 3)))}
              disabled={activeSlide === 3}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1B2A4A] text-white hover:bg-[#15213b] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right text-[11px] text-slate-400 font-mono">
            Smart India Hackathon 2026 Presentation Model
          </div>
        </div>
      </div>
    </div>
  );
};
