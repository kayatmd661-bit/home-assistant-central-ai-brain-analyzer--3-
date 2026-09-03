/**
 * VoiceEngineRouter - 3-Tier Dynamic Audio Engine Router
 * 
 * Manages dynamic 3-Tier voice playback for the On-Page Voice Explainer:
 * Tier 1 - Gemini Connected (Live Gemini Native Female Audio generation & streaming)
 * Tier 2 - Gemini Cached Voice Files (Offline playback of pre-stored / cached Gemini Female audio)
 * Tier 3 - Offline Fallback (High-Definition Natural Neural/Browser Female TTS)
 */

import { VoiceCacheManager, CachedVoiceRecord, generateTextHash, buildAudioCacheKey } from './VoiceCacheManager';
import { VoicePersona } from '../context/VoiceSettingsContext';

export type AudioTier = 'TIER_1_GEMINI_LIVE' | 'TIER_2_GEMINI_CACHED' | 'TIER_3_NATURAL_TTS';

export interface PlaybackOptions {
  pageId?: string;
  lang?: string;
  persona?: VoicePersona;
  pitch?: number;
  rate?: number;
  volume?: number;
  onStart?: (tier: AudioTier, voiceLabel: string) => void;
  onProgress?: (percent: number) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface RouterState {
  currentTier: AudioTier;
  activeVoiceLabel: string;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
}

class VoiceEngineRouterService {
  private activeAudio: HTMLAudioElement | null = null;
  private isCancelled: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Stop any current playback across all tiers immediately
   */
  public stop() {
    this.isCancelled = true;

    // Stop HTML Audio (Tier 1 & Tier 2)
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.src = '';
      } catch {}
      this.activeAudio = null;
    }

    // Stop Browser SpeechSynthesis (Tier 3)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  /**
   * Main Entry: Play Voice with 3-Tier fallback
   */
  public async playVoiceExplanation(
    text: string,
    options: PlaybackOptions = {}
  ): Promise<{ tier: AudioTier; success: boolean }> {
    this.stop();
    this.isCancelled = false;

    const pageId = options.pageId || 'general_explainer';
    const lang = options.lang || 'bn-BD';
    const persona = options.persona || 'BANGLA_FEMALE';
    const volume = typeof options.volume === 'number' ? options.volume : 1.0;
    const rate = typeof options.rate === 'number' ? options.rate : 1.0;

    // -------------------------------------------------------------
    // TIER 1: Check Live Gemini Online Audio
    // -------------------------------------------------------------
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (isOnline) {
      try {
        const liveResult = await this.tryTier1GeminiLive(text, pageId, lang, persona, volume, rate, options);
        if (liveResult.success) {
          return { tier: 'TIER_1_GEMINI_LIVE', success: true };
        }
      } catch (err) {
        console.warn('VoiceEngineRouter: Tier 1 Gemini Live unavailable, falling back to Tier 2:', err);
      }
    }

    if (this.isCancelled) return { tier: 'TIER_1_GEMINI_LIVE', success: false };

    // -------------------------------------------------------------
    // TIER 2: Check Pre-stored / Cached Gemini Audio Files
    // -------------------------------------------------------------
    try {
      const cachedRecord = await VoiceCacheManager.findAudioForPage(pageId, lang, persona, text);
      if (cachedRecord && cachedRecord.audioBase64) {
        const cachedPlayResult = await this.playBase64Audio(
          cachedRecord.audioBase64,
          cachedRecord.mimeType || 'audio/mpeg',
          volume,
          rate,
          'TIER_2_GEMINI_CACHED',
          'Gemini Cached Female Voice (সংরক্ষিত জেমিনি নারী কণ্ঠ)',
          options
        );
        if (cachedPlayResult) {
          return { tier: 'TIER_2_GEMINI_CACHED', success: true };
        }
      }
    } catch (cacheErr) {
      console.warn('VoiceEngineRouter: Tier 2 Cache retrieval notice:', cacheErr);
    }

    if (this.isCancelled) return { tier: 'TIER_2_GEMINI_CACHED', success: false };

    // -------------------------------------------------------------
    // TIER 3: High-Definition Natural Female TTS Fallback (Offline)
    // -------------------------------------------------------------
    try {
      await this.playTier3NaturalTTS(text, lang, persona, volume, rate, options);
      return { tier: 'TIER_3_NATURAL_TTS', success: true };
    } catch (ttsErr) {
      console.error('VoiceEngineRouter: Tier 3 TTS failed:', ttsErr);
      if (options.onError) options.onError(ttsErr);
      return { tier: 'TIER_3_NATURAL_TTS', success: false };
    }
  }

  /**
   * Helper: Play Tier 1 Live Gemini Native Voice & Cache the Audio
   */
  private async tryTier1GeminiLive(
    text: string,
    pageId: string,
    lang: string,
    persona: VoicePersona,
    volume: number,
    rate: number,
    options: PlaybackOptions
  ): Promise<{ success: boolean }> {
    return new Promise(async (resolve, reject) => {
      let isResolved = false;
      const safeResolve = (res: { success: boolean }) => {
        if (!isResolved) {
          isResolved = true;
          resolve(res);
        }
      };

      const safeReject = (err: any) => {
        if (!isResolved) {
          isResolved = true;
          reject(err);
        }
      };

      try {
        // Fetch synthesized audio via POST to support long/unabridged text without query limits
        const res = await fetch('/api/tts/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang, persona })
        });

        if (!res.ok) {
          throw new Error(`TTS server responded with ${res.status}`);
        }

        const data = await res.json();
        if (!data || !data.success || !data.audioBase64) {
          throw new Error(data?.error || 'Failed to synthesize audio');
        }

        if (this.isCancelled) {
          safeResolve({ success: false });
          return;
        }

        const audioSrc = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
        const audio = new Audio(audioSrc);
        this.activeAudio = audio;
        audio.preload = 'auto';
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));

        let hasStarted = false;

        audio.oncanplay = () => {
          if (this.isCancelled) {
            safeResolve({ success: false });
            return;
          }
          if (!hasStarted) {
            hasStarted = true;
            if (options.onStart) {
              options.onStart('TIER_1_GEMINI_LIVE', 'Gemini Native Female Voice (লাইভ জেমিনি নারী কণ্ঠ)');
            }
          }
        };

        audio.ontimeupdate = () => {
          if (this.isCancelled) return;
          if (audio.duration && options.onProgress) {
            const pct = Math.round((audio.currentTime / audio.duration) * 100);
            options.onProgress(Math.min(99, Math.max(5, pct)));
          }
        };

        audio.onended = () => {
          if (this.isCancelled) {
            safeResolve({ success: false });
            return;
          }
          if (options.onProgress) options.onProgress(100);
          if (options.onEnd) options.onEnd();
          safeResolve({ success: true });
        };

        audio.onerror = (e) => {
          safeReject(e);
        };

        // Cache in background for Tier 2 offline reuse
        const textHash = generateTextHash(text);
        const cacheKey = buildAudioCacheKey(pageId, lang, persona, textHash);
        VoiceCacheManager.saveAudio({
          cacheKey,
          pageId,
          lang,
          persona,
          audioBase64: data.audioBase64,
          mimeType: data.mimeType || 'audio/mpeg',
          textHash,
          source: 'GEMINI_LIVE',
          timestamp: Date.now()
        }).catch(() => {});

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play failed or was prevented:', err);
            safeReject(err);
          });
        }
      } catch (err) {
        safeReject(err);
      }
    });
  }

  /**
   * Helper: Play Base64 Audio data for Tier 2 Cached Gemini Voice
   */
  private async playBase64Audio(
    base64: string,
    mimeType: string,
    volume: number,
    rate: number,
    tier: AudioTier,
    voiceLabel: string,
    options: PlaybackOptions
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audioSrc = `data:${mimeType};base64,${base64}`;
        const audio = new Audio(audioSrc);
        this.activeAudio = audio;
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));

        let hasStarted = false;

        audio.oncanplay = () => {
          if (this.isCancelled) return;
          if (!hasStarted) {
            hasStarted = true;
            if (options.onStart) options.onStart(tier, voiceLabel);
          }
        };

        audio.ontimeupdate = () => {
          if (this.isCancelled) return;
          if (audio.duration && options.onProgress) {
            const pct = Math.round((audio.currentTime / audio.duration) * 100);
            options.onProgress(Math.min(99, Math.max(5, pct)));
          }
        };

        audio.onended = () => {
          if (this.isCancelled) return;
          if (options.onProgress) options.onProgress(100);
          if (options.onEnd) options.onEnd();
          resolve(true);
        };

        audio.onerror = () => {
          resolve(false);
        };

        audio.play().catch(() => resolve(false));
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Helper: Play Tier 3 Natural Female TTS synthesis
   */
  private async playTier3NaturalTTS(
    text: string,
    lang: string,
    persona: VoicePersona,
    volume: number,
    rate: number,
    options: PlaybackOptions
  ): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('SpeechSynthesis not available');
    }

    try {
      window.speechSynthesis.cancel();
    } catch {}

    const voices = window.speechSynthesis.getVoices() || [];
    const isBn = lang.startsWith('bn');

    // Find highest quality female voice
    let bestFemaleVoice: SpeechSynthesisVoice | undefined;
    if (isBn) {
      const bnVoices = voices.filter(v => (v.lang || '').toLowerCase().includes('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali'));
      bestFemaleVoice = bnVoices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('tanishaa') || n.includes('nabanita') || n.includes('female') || n.includes('google') || (!n.includes('bashkar') && !n.includes('pradeep') && !n.includes('male'));
      }) || bnVoices[0];
    } else {
      bestFemaleVoice = voices.find(v => {
        const n = v.name.toLowerCase();
        const l = (v.lang || '').toLowerCase();
        return l.startsWith('en') && (n.includes('zira') || n.includes('samantha') || n.includes('jenny') || n.includes('aria') || n.includes('female') || n.includes('natural'));
      });
    }

    const voiceLabel = bestFemaleVoice 
      ? `Offline Natural Female TTS (${bestFemaleVoice.name})`
      : 'Offline Natural Female Voice (অফলাইন প্রাকৃতিক নারী কণ্ঠ)';

    if (options.onStart) {
      options.onStart('TIER_3_NATURAL_TTS', voiceLabel);
    }

    // Split text into natural chunks
    const chunks = text.split(/(?<=[।!?\.\n])/g).map(s => s.trim()).filter(Boolean);
    const validChunks = chunks.length > 0 ? chunks : [text];

    return new Promise((resolve) => {
      let currentIndex = 0;
      let keepAliveInterval: any = null;

      const cleanup = () => {
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
          keepAliveInterval = null;
        }
      };

      // Keep speech synthesis active in Chrome for long texts
      keepAliveInterval = setInterval(() => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      const playNext = (index: number) => {
        if (this.isCancelled || index >= validChunks.length) {
          cleanup();
          if (options.onProgress) options.onProgress(100);
          if (options.onEnd) options.onEnd();
          resolve();
          return;
        }

        currentIndex = index;
        const chunkText = validChunks[index];
        const utterance = new SpeechSynthesisUtterance(chunkText);
        this.activeUtterance = utterance;

        utterance.lang = lang;
        if (bestFemaleVoice) {
          utterance.voice = bestFemaleVoice;
        }

        // Female pitch modulation
        const isMatchedMale = bestFemaleVoice && (
          bestFemaleVoice.name.toLowerCase().includes('bashkar') || 
          bestFemaleVoice.name.toLowerCase().includes('male')
        );
        utterance.pitch = isMatchedMale ? 1.25 : 1.15;
        utterance.rate = Math.max(0.7, Math.min(1.4, rate));
        utterance.volume = Math.max(0, Math.min(1, volume));

        utterance.onstart = () => {
          if (!this.isCancelled && options.onProgress) {
            const pct = Math.round((index / validChunks.length) * 100);
            options.onProgress(Math.max(5, pct));
          }
        };

        utterance.onend = () => {
          if (!this.isCancelled) {
            const pct = Math.round(((index + 1) / validChunks.length) * 100);
            if (options.onProgress) options.onProgress(pct);
            playNext(index + 1);
          } else {
            cleanup();
            resolve();
          }
        };

        utterance.onerror = () => {
          if (!this.isCancelled) {
            playNext(index + 1);
          } else {
            cleanup();
            resolve();
          }
        };

        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          cleanup();
          resolve();
        }
      };

      playNext(0);
    });
  }
}

export const VoiceEngineRouter = new VoiceEngineRouterService();
