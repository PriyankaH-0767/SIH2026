import React from 'react';
import { User, Shield, Store, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { UserRole } from '../../types/pds';

export const LandingPage: React.FC = () => {
  const { setCurrentRole, setOfficerTier, t, language } = usePds();

  const roleTiles = [
    {
      id: 'citizen' as UserRole,
      title: t.citizen,
      titleAlt: 'ಫಲಾನುಭವಿ ನಾಗರಿಕ',
      tagline: 'Check Entitlement, Track Ration Truck, Change Location Window',
      icon: User,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500',
      accentBg: 'bg-emerald-600',
      badge: 'BPL / PHH Cardholder',
      metrics: 'KA-04-PHH-882941 · Malleshwaram',
    },
    {
      id: 'officer' as UserRole,
      title: t.officer,
      titleAlt: 'ಇಲಾಖಾ ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್',
      tagline: '7-Tier Jurisdiction Suite: DSO Full Control, Ward Inspector, State Rollup',
      icon: Shield,
      color: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-600',
      accentBg: 'bg-blue-600',
      badge: 'AI Decision-Support System',
      metrics: '7 Scoped Tiers · DSO & Field Ward Primary',
    },
    {
      id: 'dealer' as UserRole,
      title: t.dealer,
      titleAlt: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್',
      tagline: 'Shop Stock, Truck Arrival, 3-Channel Start Distribution, Month-End Leftover',
      icon: Store,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-600',
      accentBg: 'bg-amber-600',
      badge: 'Depot Depot Terminal',
      metrics: 'Shop #104 · 1,420 Beneficiaries',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col justify-between py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Centered Hero Wordmark & Core Tagline */}
      <div className="text-center pt-4 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Karnataka Food, Civil Supplies & Consumer Affairs Department</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1B2A4A] mb-3">
          PDS-DemandSync
        </h1>

        <p className="text-lg sm:text-xl font-medium text-[#0E7C7B] tracking-tight">
          It recommends. The officer decides.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-2 leading-relaxed">
          Dynamic decision-support prototype balancing grassroots beneficiary demand with predictive buffer logistics. Every automated recommendation requires explicit human officer verification.
        </p>
      </div>

      {/* Three Equal-Weight Icon Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {roleTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => {
                if (tile.id === 'officer') {
                  setOfficerTier('dso'); // default to primary demo role
                }
                setCurrentRole(tile.id);
              }}
              className={`flex flex-col justify-between p-6 rounded-2xl border-2 bg-white text-left transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden ${tile.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                    {tile.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1B2A4A] transition-colors">
                  {tile.title}
                </h3>
                {language !== 'en' && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{tile.titleAlt}</p>
                )}

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {tile.tagline}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {tile.metrics}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#1B2A4A] group-hover:text-[#0E7C7B] transition-colors">
                  <span>Enter Role</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Human-In-The-Loop Principle Footer Banner */}
      <div className="bg-[#1B2A4A] rounded-2xl p-5 sm:p-6 text-white text-xs sm:text-sm flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/50">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-teal-300 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              Core Administrative Invariant: Zero Autonomous Dispatches
            </h4>
            <p className="text-white/70 text-xs mt-0.5 leading-relaxed">
              PDS-DemandSync evaluates grain consumption run-rates against warehouse buffer inventory and recommends targeted routes. In adherence to administrative mandate, zero dispatches fire without explicit authorization from the District Food & Civil Supplies Officer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-white/60 font-mono">Build Scope: v2.4 Prototype</span>
        </div>
      </div>
    </div>
  );
};
