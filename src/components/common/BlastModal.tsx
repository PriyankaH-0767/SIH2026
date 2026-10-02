import React, { useState, useEffect } from 'react';
import {
  Radio,
  Bell,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  X,
  ExternalLink,
  Users,
  AlertCircle,
} from 'lucide-react';
import { usePds } from '../../context/PdsContext';

export const BlastModal: React.FC = () => {
  const { blastModal, closeBlastModal, setCurrentRole } = usePds();
  const [channelsActive, setChannelsActive] = useState({
    push: false,
    sms: false,
    ivr: false,
  });

  useEffect(() => {
    if (!blastModal.isOpen) {
      setChannelsActive({ push: false, sms: false, ivr: false });
      return;
    }

    // Sequentially fire each simulated channel for visual punch
    const t1 = setTimeout(() => setChannelsActive((prev) => ({ ...prev, push: true })), 300);
    const t2 = setTimeout(() => setChannelsActive((prev) => ({ ...prev, sms: true })), 700);
    const t3 = setTimeout(() => setChannelsActive((prev) => ({ ...prev, ivr: true })), 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [blastModal.isOpen]);

  if (!blastModal.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  3-Channel Beneficiary Broadcast
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Distribution Commenced
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatching real-time pickup alerts to {blastModal.beneficiaryCount.toLocaleString()} locked cardholders at {blastModal.fpsName}
              </p>
            </div>
          </div>
          <button
            onClick={closeBlastModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Parallel Channels */}
        <div className="py-5 space-y-3.5">
          {/* Channel 1: In-App Push (Real in Prototype) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              channelsActive.push
                ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-xs text-slate-900">
                  Channel 1: In-App Push Notification
                </span>
                <span className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Live Active
                </span>
              </div>
              {channelsActive.push ? (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered to App Inbox</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Firing socket...</span>
              )}
            </div>
            <p className="text-xs text-slate-600 pl-6">
              "🚨 Your FPS ({blastModal.fpsName}) has started distribution — your ration is ready for pickup."
            </p>
          </div>

          {/* Channel 2: SMS Gateway (Simulated) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              channelsActive.sms
                ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-xs text-slate-900">
                  Channel 2: SMS Gateway Broadcast
                </span>
                <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                  Simulated
                </span>
              </div>
              {channelsActive.sms ? (
                <div className="flex items-center gap-1 text-[11px] font-medium text-blue-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sent to {blastModal.beneficiaryCount.toLocaleString()} Phones</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Connecting gateway...</span>
              )}
            </div>
            <div className="pl-6 text-xs text-slate-600 bg-white/80 p-2 rounded border border-blue-100 font-mono text-[11px]">
              KRPDS: Namaskara. Malleshwaram Shop #104 has opened monthly distribution for September. Your BPL quota of 20kg Rice + 5kg Wheat is ready. Bring your ration card & biometric.
            </div>
          </div>

          {/* Channel 3: IVR Voice Call Broadcast (Simulated) */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              channelsActive.ivr
                ? 'bg-purple-50/60 border-purple-300 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-xs text-slate-900">
                  Channel 3: Automated IVR Voice Broadcast
                </span>
                <span className="text-[10px] font-medium bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                  Simulated
                </span>
              </div>
              {channelsActive.ivr ? (
                <div className="flex items-center gap-1 text-[11px] font-medium text-purple-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>IVR Calls Queued ({blastModal.beneficiaryCount} lines)</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400">Queuing SIP trunk...</span>
              )}
            </div>
            <p className="text-xs text-slate-600 pl-6">
              Kannada/English automated synthesized voice campaign scheduled across elderly and rural phone lines with active tokens.
            </p>
          </div>
        </div>

        {/* Action Controls for Demo Review */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Switch to Citizen role to verify instant notification arrival</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                closeBlastModal();
                setCurrentRole('citizen');
              }}
              className="flex-1 sm:flex-none py-2 px-3.5 text-xs font-semibold text-white bg-[#0E7C7B] hover:bg-[#0c6b6a] rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View in Citizen View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={closeBlastModal}
              className="flex-1 sm:flex-none py-2 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
