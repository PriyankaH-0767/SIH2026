import { Language } from '../types/pds';

const LANG_CODE_MAP: Record<Language, string> = {
  kn: 'kn-IN',
  hi: 'hi-IN',
  en: 'en-IN',
  ta: 'ta-IN',
  te: 'te-IN',
};

// Global speech state listeners for visual indicators (avatar speaking state)
type SpeechStateListener = (speaking: boolean, text: string) => void;
const listeners: Set<SpeechStateListener> = new Set();

export const subscribeSpeechState = (listener: SpeechStateListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifySpeechState = (speaking: boolean, text: string) => {
  listeners.forEach((l) => l(speaking, text));
};

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
      notifySpeechState(false, '');
    } catch (e) {
      console.warn('Speech cancellation error:', e);
    }
  }
};

export const speakAloud = (text: string, lang: Language = 'kn', onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported on this platform');
    return;
  }

  try {
    window.speechSynthesis.cancel();

    if (!text || !text.trim()) {
      notifySpeechState(false, '');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODE_MAP[lang] || 'en-IN';
    utterance.rate = 0.92; // Natural, clear cadence for accessibility
    utterance.pitch = 1.05;

    // Pick best available voice for language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const langPrefix = utterance.lang.slice(0, 2);
      const match =
        voices.find((v) => v.lang === utterance.lang) ||
        voices.find((v) => v.lang.startsWith(langPrefix)) ||
        voices.find((v) => v.lang.includes('IN')) ||
        voices[0];
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      notifySpeechState(true, text);
    };

    utterance.onend = () => {
      currentUtterance = null;
      notifySpeechState(false, '');
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      currentUtterance = null;
      notifySpeechState(false, '');
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available:', err);
    notifySpeechState(false, '');
  }
};

// Web Speech API Speech Recognition wrapper
export interface SpeechRecognitionResultPayload {
  transcript: string;
  isFinal: boolean;
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResultPayload) => void;

interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class PdsVoiceRecognition {
  private recognition: any = null;
  private isListening = false;

  constructor(private lang: Language = 'kn') {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeech) : null;
    const SpeechRec = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = LANG_CODE_MAP[lang] || 'en-IN';
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  public setLanguage(lang: Language) {
    this.lang = lang;
    if (this.recognition) {
      this.recognition.lang = LANG_CODE_MAP[lang] || 'en-IN';
    }
  }

  public startListening(
    onResult: SpeechRecognitionCallback,
    onError?: (error: any) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      console.warn('SpeechRecognition not supported in this browser environment');
      return false;
    }

    try {
      if (this.isListening) {
        this.recognition.abort();
      }

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        onResult({
          transcript: finalTranscript || interimTranscript,
          isFinal: Boolean(finalTranscript),
        });
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      this.isListening = false;
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public isSupported(): boolean {
    return Boolean(this.recognition);
  }
}
