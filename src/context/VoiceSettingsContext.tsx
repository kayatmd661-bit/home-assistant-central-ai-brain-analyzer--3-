import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { VoiceEngineRouter, AudioTier } from '../services/VoiceEngineRouter';
import { VoiceCacheManager } from '../services/VoiceCacheManager';

export type VoicePersona = 
  | 'BANGLA_FEMALE' 
  | 'BANGLA_MALE' 
  | 'GEMINI_NEURAL' 
  | 'FEMALE_ENGLISH' 
  | 'MALE_ENGLISH' 
  | 'ROBOTIC_AI';

export interface VoiceSettings {
  persona: VoicePersona;
  pitch: number; // 0.5 - 1.8 (default 1.0)
  rate: number;  // 0.6 - 1.8 (default 1.0)
  volume: number; // 0.0 - 1.0 (default 1.0)
  autoExplainPages: boolean; // Auto-narrate on page change if enabled
  preferredLang: 'bn-BD' | 'en-US';
  selectedVoiceURI: string | null; // User manually selected voice from browser if desired
}

interface VoiceSettingsContextType {
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  isSpeaking: boolean;
  isAudioLoading: boolean;
  activeScript: string | null;
  audioProgress: number; // 0 to 100
  audioEngineType: 'BROWSER_TTS' | 'GEMINI_NATIVE';
  activeAudioTier: AudioTier;
  activeVoiceLabel: string;
  speakText: (text: string, customLang?: string, onComplete?: () => void, pageId?: string) => Promise<void>;
  speakGeminiNativeAudio: (text: string, customLang?: string, customPersona?: VoicePersona, pageId?: string) => Promise<void>;
  stopSpeaking: () => void;
  availableVoices: SpeechSynthesisVoice[];
  activeVoiceName: string;
  cacheStats: { count: number; totalBytes: number };
  clearVoiceCache: () => Promise<void>;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  persona: 'BANGLA_FEMALE',
  pitch: 1.0, 
  rate: 1.0,  // Standard natural human conversational speed (normal, neither fast nor slow)
  volume: 1.0,
  autoExplainPages: false,
  preferredLang: 'bn-BD',
  selectedVoiceURI: null
};

const VoiceSettingsContext = createContext<VoiceSettingsContextType | undefined>(undefined);

export const VoiceSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem('ha_voice_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.rate === 0.8 || parsed.rate === 0.95 || !parsed.rate) {
          parsed.rate = 1.0;
        }
        if (parsed.pitch === 1.1 || !parsed.pitch) {
          parsed.pitch = 1.0;
        }
        if (!parsed.persona || parsed.persona === 'BANGLA_MALE') {
          parsed.persona = 'BANGLA_FEMALE';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [activeScript, setActiveScript] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('Gemini Native Female Voice');
  const [activeAudioTier, setActiveAudioTier] = useState<AudioTier>('TIER_1_GEMINI_LIVE');
  const [activeVoiceLabel, setActiveVoiceLabel] = useState<string>('Gemini Native Female Voice (লাইভ জেমিনি নারী কণ্ঠ)');
  const [cacheStats, setCacheStats] = useState<{ count: number; totalBytes: number }>({ count: 0, totalBytes: 0 });

  // Refresh cache stats
  const refreshCacheStats = useCallback(async () => {
    try {
      const stats = await VoiceCacheManager.getCacheStats();
      setCacheStats(stats);
    } catch {}
  }, []);

  const clearVoiceCache = useCallback(async () => {
    await VoiceCacheManager.clearCache();
    await refreshCacheStats();
  }, [refreshCacheStats]);

  // Stop any active speech immediately
  const stopSpeaking = useCallback(() => {
    VoiceEngineRouter.stop();
    setIsSpeaking(false);
    setIsAudioLoading(false);
    setActiveScript(null);
    setAudioProgress(0);
  }, []);

  // Load and refresh browser voices for Tier 3 offline fallback
  useEffect(() => {
    refreshCacheStats();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const voices = window.speechSynthesis.getVoices() || [];
          if (voices.length > 0) {
            setAvailableVoices(voices);
          }
        } catch (e) {
          console.warn('SpeechSynthesis getVoices error:', e);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      const timer = setTimeout(loadVoices, 500);
      return () => clearTimeout(timer);
    }
  }, [refreshCacheStats]);

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ha_voice_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Smart 3-Tier Dynamic Audio Engine Router
  const speakText = useCallback(async (
    text: string, 
    customLang?: string, 
    onComplete?: () => void,
    pageId?: string
  ) => {
    stopSpeaking();
    if (!text || !text.trim()) return;

    const targetLang = customLang || (settings.preferredLang === 'bn-BD' ? 'bn-BD' : 'en-US');
    setIsAudioLoading(true);
    setActiveScript(text);
    setAudioProgress(5);

    try {
      await VoiceEngineRouter.playVoiceExplanation(text, {
        pageId: pageId || 'voice_guide',
        lang: targetLang,
        persona: settings.persona,
        pitch: settings.pitch,
        rate: settings.rate,
        volume: settings.volume,
        onStart: (tier, label) => {
          setIsAudioLoading(false);
          setIsSpeaking(true);
          setActiveAudioTier(tier);
          setActiveVoiceLabel(label);
          setActiveVoiceName(label);
        },
        onProgress: (pct) => {
          setAudioProgress(pct);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsAudioLoading(false);
          setActiveScript(null);
          setAudioProgress(100);
          refreshCacheStats();
          if (onComplete) onComplete();
        },
        onError: (err) => {
          console.warn('Voice playback notice:', err);
          setIsSpeaking(false);
          setIsAudioLoading(false);
        }
      });
    } catch (err) {
      console.error('Voice Router error:', err);
      setIsSpeaking(false);
      setIsAudioLoading(false);
    }
  }, [settings, stopSpeaking, refreshCacheStats]);

  const speakGeminiNativeAudio = useCallback(async (
    text: string, 
    customLang?: string, 
    customPersona?: VoicePersona,
    pageId?: string
  ) => {
    await speakText(text, customLang, undefined, pageId);
  }, [speakText]);

  return (
    <VoiceSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isSpeaking,
        isAudioLoading,
        activeScript,
        audioProgress,
        audioEngineType: 'GEMINI_NATIVE',
        activeAudioTier,
        activeVoiceLabel,
        speakText,
        speakGeminiNativeAudio,
        stopSpeaking,
        availableVoices,
        activeVoiceName,
        cacheStats,
        clearVoiceCache
      }}
    >
      {children}
    </VoiceSettingsContext.Provider>
  );
};

export const useVoiceSettings = () => {
  const context = useContext(VoiceSettingsContext);
  if (!context) {
    throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
  }
  return context;
};

