import React, { useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { speakAloud, stopSpeaking } from '../../utils/audioSpeech';
import { usePds } from '../../context/PdsContext';

interface VoiceHoverGuideProps {
  title: string;
  description: string;
  descriptionKn?: string;
  children: React.ReactNode;
  className?: string;
  speakOnHover?: boolean;
}

/**
 * VoiceHoverGuide wraps buttons, icons, and input cards.
 * When citizen, DSO, or FPS dealer hovers on it:
 * 1. Dispatches an event to the global Voice Assistant explaining the role and what the user can do by pressing it.
 * 2. Speaks aloud the explanation in the selected language (debounced to prevent audio overlap).
 */
export const VoiceHoverGuide: React.FC<VoiceHoverGuideProps> = ({
  title,
  description,
  descriptionKn,
  children,
  className = '',
  speakOnHover = true,
}) => {
  const { language } = usePds();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getSpokenText = () => {
    if (language === 'kn') {
      const detail = descriptionKn || description;
      return `${title}. ಇದರ ಉಪಯೋಗ: ${detail}`;
    }
    return `${title}. What you can do: ${description}`;
  };

  const handleMouseEnter = () => {
    const textDesc = language === 'kn' && descriptionKn ? descriptionKn : description;

    // Dispatch custom event to notify Voice Assistant overlay
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('pds-voice-hover', {
        detail: {
          title,
          desc: textDesc,
          actionPhrase: language === 'kn' ? 'ಒತ್ತುವುದರಿಂದ ಏನು ಮಾಡಬಹುದು' : 'What you can do by pressing this',
        },
      });
      window.dispatchEvent(event);
    }

    if (speakOnHover) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      // 350ms debounce so rapid mouse movement doesn't cause chaotic audio
      hoverTimerRef.current = setTimeout(() => {
        const isMuted = typeof window !== 'undefined' && (window as any).__pds_voice_hover_muted;
        if (!isMuted) {
          speakAloud(getSpokenText(), language);
        }
      }, 350);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pds-voice-hover-end'));
    }
  };

  const handleManualPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakAloud(getSpokenText(), language);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className}`}
    >
      {children}
      {/* Subtle audio guidance indicator badge on hover */}
      <button
        type="button"
        onClick={handleManualPlay}
        title={`Listen: ${title}`}
        className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 z-20 p-1 bg-[#6B1870] hover:bg-[#521356] text-[#FFD700] rounded-full shadow-md text-[10px] transition-all duration-200 cursor-pointer flex items-center justify-center pointer-events-auto"
      >
        <Volume2 className="w-3 h-3" />
      </button>
    </div>
  );
};

