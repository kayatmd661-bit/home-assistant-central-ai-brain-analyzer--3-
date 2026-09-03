import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useVoiceSettings } from './VoiceSettingsContext';

interface ExplainModeContextType {
  isExplainModeActive: boolean;
  setExplainModeActive: (active: boolean) => void;
  toggleExplainMode: () => void;
  activeExplainedElement: {
    title: string;
    descriptionBn: string;
    category?: string;
  } | null;
  explainElement: (title: string, descriptionBn: string, category?: string) => void;
  dismissExplanation: () => void;
}

const ExplainModeContext = createContext<ExplainModeContextType | undefined>(undefined);

export const ExplainModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExplainModeActive, setIsExplainModeActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ha_explain_mode_active') === 'true';
    } catch {
      return false;
    }
  });

  const [activeExplainedElement, setActiveExplainedElement] = useState<{
    title: string;
    descriptionBn: string;
    category?: string;
  } | null>(null);

  const { speakText, stopSpeaking } = useVoiceSettings();
  const isInitialMount = React.useRef(true);

  // Synchronize audio feedback safely inside useEffect
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isExplainModeActive) {
      speakText('স্পর্শ ভয়েস গাইড সক্রিয় করা হয়েছে। এবার যেকোনো বাটনে ক্লিক করে এর বিস্তারিত শুনুন।');
    } else {
      stopSpeaking();
      setActiveExplainedElement(null);
    }
  }, [isExplainModeActive, speakText, stopSpeaking]);

  const setExplainModeActive = useCallback((active: boolean) => {
    setIsExplainModeActive(active);
    try {
      localStorage.setItem('ha_explain_mode_active', String(active));
    } catch {}
  }, []);

  const toggleExplainMode = useCallback(() => {
    setIsExplainModeActive(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ha_explain_mode_active', String(next));
      } catch {}
      return next;
    });
  }, []);

  const explainElement = useCallback((title: string, descriptionBn: string, category?: string) => {
    setActiveExplainedElement({ title, descriptionBn, category });
    const fullSpeech = `${title}। ${descriptionBn}`;
    speakText(fullSpeech);
  }, [speakText]);

  const dismissExplanation = useCallback(() => {
    setActiveExplainedElement(null);
    stopSpeaking();
  }, [stopSpeaking]);

  // Global click & touch listener when Explain Mode is active
  useEffect(() => {
    if (!isExplainModeActive) return;

    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Ignore clicks inside the explain mode control banner or close buttons
      if (target.closest('#explain-mode-banner') || target.closest('#explain-mode-toggle-btn') || target.closest('#explain-mode-floating-bar')) {
        return;
      }

      // Check if target or any ancestor has explicit data-voice-explain
      const explainableElement = target.closest('[data-voice-explain]') as HTMLElement | null;
      if (explainableElement) {
        const text = explainableElement.getAttribute('data-voice-explain');
        const title = explainableElement.getAttribute('data-voice-title') || explainableElement.innerText?.slice(0, 30) || 'কন্ট্রোল বাটন';
        if (text) {
          e.preventDefault();
          e.stopPropagation();
          explainElement(title, text, 'ইন্টারেক্টিভ কন্ট্রোল');
          return;
        }
      }

      // Fallback heuristic: check button, card, header, or input
      const btn = target.closest('button, a, input, select, [role="button"]') as HTMLElement | null;
      if (btn) {
        const title = btn.getAttribute('title') || btn.getAttribute('aria-label') || btn.innerText?.trim()?.slice(0, 40) || 'বাটন অপশন';
        let desc = 'এই বাটনটিতে ক্লিক করে নির্দিষ্ট কমান্ড বা ফিচার সক্রিয় করা যায়।';

        const id = btn.id || '';
        if (id.includes('kill-switch')) {
          desc = 'মাস্টার ইমার্জেন্সি কিল সুইচ—এটি চাপলে তাৎক্ষণিকভাবে সিস্টেমের সমস্ত অটোমেশন ও কমান্ড এক্সিকিউশন বন্ধ হয়ে যাবে।';
        } else if (id.includes('authority')) {
          desc = 'মাস্টার অথরিটি মোড—এটি দিয়ে ফুল অটোনোমাস বা প্রতি ধাপে মানুষের অনুমতি নেওয়ার মোড পরিবর্তন করা যায়।';
        } else if (id.includes('audio-route')) {
          desc = 'ভয়েস রাউটিং সুইচ—এটি দিয়ে ড্যাশবোর্ড ওয়েব স্পিকার নাকি ঘরের ব্লুটুথ ও ইউএসবি স্পিকারে কথা শোনা যাবে তা নির্ধারণ করা হয়।';
        } else if (id.includes('tab-btn')) {
          desc = `ন্যাভিগেশন ট্যাব—এই ট্যাবে ক্লিক করে "${title}" প্যানেল খোলা যায়।`;
        } else if (title.includes('কমপ্রেস') || title.includes('Compress')) {
          desc = 'হাই-ডেনসিটি কম্প্রেশন রানার—এটি ডায়ালগ এবং এএসটি রুটিনকে সংকুচিত করে ড্রাইভে সেভ করে।';
        } else if (title.includes('ডাউনলোড') || title.includes('Download') || title.includes('জিপ')) {
          desc = 'ব্যাকআপ ডাউনলোড বাটন—এটি সম্পূর্ণ কোড ও ডেটাবেস অফলাইন জিপ ফাইল হিসেবে সেভ করে।';
        } else if (title.includes('শুনুন') || title.includes('Play') || title.includes('Voice')) {
          desc = 'ভয়েস স্পিকার বাটন—মিষ্টি বাংলা কণ্ঠে পেজের বিবরণ এবং লাইভ স্টেট শোনার জন্য এটি ব্যবহার করা হয়।';
        }

        e.preventDefault();
        e.stopPropagation();
        explainElement(title, desc, 'সিস্টেম বাটন');
        return;
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [isExplainModeActive, explainElement]);

  return (
    <ExplainModeContext.Provider
      value={{
        isExplainModeActive,
        setExplainModeActive,
        toggleExplainMode,
        activeExplainedElement,
        explainElement,
        dismissExplanation
      }}
    >
      {children}
    </ExplainModeContext.Provider>
  );
};

export const useExplainMode = () => {
  const context = useContext(ExplainModeContext);
  if (!context) {
    throw new Error('useExplainMode must be used within an ExplainModeProvider');
  }
  return context;
};
