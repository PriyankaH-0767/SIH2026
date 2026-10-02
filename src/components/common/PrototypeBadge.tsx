import React, { useState } from 'react';
import { Info, X, ShieldAlert } from 'lucide-react';
import { usePds } from '../../context/PdsContext';

export const PrototypeBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { forceWindowOpen, setForceWindowOpen } = usePds();

  return (
    <>
      <div className="bg-[#1B2A4A] text-white text-xs border-b border-white/10 px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide text-amber-300">DEMO PROTOTYPE</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="text-white/80 hidden sm:inline">Karnataka Public Distribution System (PDS) Decision-Support</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Debug Override for Location Choice Window */}
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded text-[11px]">
            <span className="text-white/70">Window Override:</span>
            <button
              onClick={() => setForceWindowOpen(!forceWindowOpen)}
              className={`font-semibold px-1.5 py-0.2 rounded transition-colors ${
                forceWindowOpen ? 'bg-emerald-500 text-white' : 'bg-red-500/80 text-white'
              }`}
            >
              {forceWindowOpen ? 'FORCED OPEN (Days 20-24)' : 'REAL DATE AUTO'}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 text-white/80 hover:text-white underline underline-offset-2 text-[11px]"
          >
            <Info className="w-3.5 h-3.5 text-teal-300" />
            Simulation Scope
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-50 text-[#0E7C7B]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Simulation & Prototype Disclosure</h3>
                  <p className="text-xs text-slate-500">PDS-DemandSync Walkthrough Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-6">
              <p>
                This interactive build is designed for evaluator demonstration of the human-in-the-loop decision-support pattern. The following components are simulated in-app:
              </p>
              <div className="grid grid-cols-1 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 shrink-0">• ePDS Core:</span>
                  <span>Simulated in-memory database reflecting Karnataka BPL beneficiary entitlements and FPS quota allocation.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 shrink-0">• AI Forecasting:</span>
                  <span>Visible rule engine: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Recommend dispatch if stock &lt; demand × 1.1</code>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 shrink-0">• Telephony / SMS:</span>
                  <span>Visual 3-channel blast screen showing in-app push, SMS preview, and IVR broadcast queuing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-800 shrink-0">• Core Rule:</span>
                  <span className="font-semibold text-[#1B2A4A]">The system recommends, a human officer decides — no dispatch fires without explicit approval.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-[#1B2A4A] hover:bg-[#15213b] text-white rounded-lg font-medium text-xs transition-colors"
            >
              Continue to Prototype
            </button>
          </div>
        </div>
      )}
    </>
  );
};
