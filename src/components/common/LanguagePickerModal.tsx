import React from 'react';
import { Globe, Check, ShieldCheck } from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { Language } from '../../types/pds';

export const LanguagePickerModal: React.FC = () => {
  const { language, setLanguage, hasSelectedInitialLanguage } = usePds();

  if (hasSelectedInitialLanguage) return null;

  const languages: { code: Language; name: string; native: string; script: string; region: string }[] = [
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', script: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಅಧಿಕೃತ ಭಾಷೆ', region: 'Karnataka Official' },
    { code: 'en', name: 'English', native: 'English', script: 'Standard Administrative', region: 'All Jurisdictions' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', script: 'सार्वजनिक वितरण प्रणाली', region: 'National NFSA' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', script: 'பொது விநியோக முறை', region: 'Border Districts' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', script: 'ప్రజా పంపిణీ వ్యవస్థ', region: 'Border Districts' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B2A4A]/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0E7C7B] flex items-center justify-center mx-auto mb-3">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Select Your Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            PDS-DemandSync supports multilingual decision-support across Karnataka's Public Distribution System.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                language === lang.code
                  ? 'border-[#0E7C7B] bg-teal-50/50 shadow-xs ring-2 ring-[#0E7C7B]/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                    language === lang.code
                      ? 'bg-[#0E7C7B] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {lang.native.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lang.native}</span>
                    <span className="text-xs text-slate-500">({lang.name})</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{lang.script}</p>
                </div>
              </div>

              {language === lang.code && (
                <div className="text-[#0E7C7B]">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setLanguage(language)}
          className="w-full py-3 bg-[#1B2A4A] hover:bg-[#15213b] text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Proceed / ಮುಂದುವರಿಯಿರಿ</span>
        </button>
      </div>
    </div>
  );
};
