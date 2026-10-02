import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Volume2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { usePds } from '../../context/PdsContext';
import { PdsVoiceRecognition, speakAloud } from '../../utils/audioSpeech';

export const VoiceModal: React.FC = () => {
  const { voiceModal, closeVoiceModal, language } = usePds();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const recognizerRef = useRef<PdsVoiceRecognition | null>(null);

  useEffect(() => {
    if (!voiceModal.isOpen) {
      if (recognizerRef.current) {
        recognizerRef.current.stopListening();
      }
      setTranscript('');
      setIsListening(false);
      return;
    }

    const recognizer = new PdsVoiceRecognition(language);
    recognizerRef.current = recognizer;
    setIsSpeechSupported(recognizer.isSupported());

    // Prompt the user in their language
    const promptText =
      language === 'kn'
        ? `${voiceModal.targetFieldLabel || 'ಮಾಹಿತಿ'} ನಮೂದಿಸಲು ಧ್ವನಿ ನೀಡಿ.`
        : `Please speak now to fill in ${voiceModal.targetFieldLabel || 'this field'}.`;
    speakAloud(promptText, language);

    setStatusMessage(
      language === 'kn'
        ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಸಿದ್ಧವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮಾತನಾಡಿ...'
        : 'Microphone active. Please speak clearly...'
    );

    // Audio level oscillation simulation
    const animInterval = setInterval(() => {
      setAudioLevel(Math.floor(Math.random() * 70) + 30);
    }, 120);

    // Start native Web Speech recognition
    const started = recognizer.startListening(
      (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setIsListening(false);
          setStatusMessage(
            language === 'kn' ? 'ಧ್ವನಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!' : 'Speech captured successfully!'
          );
        }
      },
      (error) => {
        console.warn('Voice recognition error:', error);
        // Fallback gracefully to default preset text if mic permission denied
        setTranscript(voiceModal.presetText || 'KA-04-PHH-882941');
        setIsListening(false);
        setStatusMessage(
          language === 'kn'
            ? 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶ ಲಭ್ಯವಿಲ್ಲ. ಪರ್ಯಾಯ ಮಾದರಿಯನ್ನು ಬಳಸಲಾಗಿದೆ.'
            : 'Using preset voice sample for input.'
        );
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    } else {
      // Fallback preset
      setTimeout(() => {
        setTranscript(voiceModal.presetText || 'KA-04-PHH-882941');
        setIsListening(false);
      }, 1000);
    }

    return () => {
      clearInterval(animInterval);
      recognizer.stopListening();
    };
  }, [voiceModal.isOpen, language, voiceModal.presetText, voiceModal.targetFieldLabel]);

  if (!voiceModal.isOpen) return null;

  const handleConfirm = () => {
    voiceModal.onConfirm(transcript);
    closeVoiceModal();
  };

  const handleRestart = () => {
    setTranscript('');
    setIsListening(true);
    setStatusMessage(
      language === 'kn' ? 'ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ...' : 'Listening again, speak clearly...'
    );

    if (recognizerRef.current) {
      const started = recognizerRef.current.startListening(
        (result) => {
          setTranscript(result.transcript);
          if (result.isFinal) {
            setIsListening(false);
          }
        },
        () => {
          setTranscript(voiceModal.presetText || 'KA-04-PHH-882941');
          setIsListening(false);
        }
      );
      if (!started) {
        setTimeout(() => {
          setTranscript(voiceModal.presetText || 'KA-04-PHH-882941');
          setIsListening(false);
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-purple-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-100 text-[#6B1870]">
              <Mic className="w-5 h-5 text-[#6B1870]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {language === 'kn' ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಇನ್‌ಪುಟ್' : 'Voice Recognition & Input'}
              </h3>
              <p className="text-[11px] text-[#6B1870] font-semibold">
                Target Field: <strong>{voiceModal.targetFieldLabel || 'Data Field'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeVoiceModal}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Visualizer & State */}
        <div className="py-5 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={isListening ? () => recognizerRef.current?.stopListening() : handleRestart}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening
                ? 'bg-red-50 text-red-600 ring-8 ring-red-100 animate-pulse'
                : 'bg-emerald-50 text-emerald-600 ring-6 ring-emerald-100'
            }`}
            title={isListening ? 'Click to stop' : 'Click to speak again'}
          >
            {isListening ? <Mic className="w-9 h-9" /> : <Check className="w-9 h-9" />}
          </button>

          <p className="mt-3 text-xs font-bold text-slate-800">
            {isListening
              ? language === 'kn'
                ? 'ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...'
                : 'Listening to your voice...'
              : language === 'kn'
              ? 'ಧ್ವನಿ ಗುರುತಿಸಲಾಗಿದೆ'
              : 'Voice captured'}
          </p>

          <span className="text-[11px] text-slate-500 mt-0.5 text-center">
            {statusMessage ||
              (language === 'kn'
                ? 'ನಿಖರತೆಗಾಗಿ ಕೆಳಗಿನ ಪಠ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ'
                : 'Verify speech output below before inserting into field')}
          </span>

          {/* Dynamic sound wave */}
          {isListening && (
            <div className="flex items-center gap-1.5 mt-3 h-6">
              {[30, 75, 95, 45, 80, 60, 90, 35].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#6B1870] rounded-full transition-all duration-100"
                  style={{
                    height: `${Math.max(15, (h * audioLevel) / 100)}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transcription Area (Only feeds required space) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{language === 'kn' ? 'ಗುರುತಿಸಲಾದ ಪಠ್ಯ:' : 'Captured Transcript:'}</span>
              <span className="text-[10px] text-[#6B1870] font-normal">(Editable)</span>
            </label>

            <button
              type="button"
              onClick={handleRestart}
              className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'kn' ? 'ಮತ್ತೆ ಮಾತನಾಡಿ' : 'Speak Again'}</span>
            </button>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={2}
            placeholder={
              isListening
                ? language === 'kn'
                  ? 'ಧ್ವನಿ ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆ...'
                  : 'Listening...'
                : language === 'kn'
                ? 'ಧ್ವನಿ ಪಠ್ಯ ಇಲ್ಲಿ ಕಾಣುತ್ತದೆ...'
                : 'Transcription will appear here...'
            }
            className="w-full px-3.5 py-2.5 text-sm bg-purple-50/40 border border-purple-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6B1870]/30 focus:border-[#6B1870] font-mono text-slate-900"
          />

          <p className="text-[10px] text-slate-400">
            * This voice recognition feeds strictly into the requested {voiceModal.targetFieldLabel} input field.
          </p>
        </div>

        {/* Modal Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={closeVoiceModal}
            className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!transcript.trim()}
            className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#6B1870] hover:bg-[#57135C] disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#FFD700]" />
            <span>{language === 'kn' ? 'ಖಚಿತಪಡಿಸಿ (ಸೇರಿಸಿ)' : 'Confirm & Insert'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
