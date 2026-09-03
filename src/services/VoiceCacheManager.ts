/**
 * VoiceCacheManager - Tier 2 Local Audio Cache for Gemini Native & High-Definition Spoken Guidance
 * 
 * Stores pre-synthesized and live-generated audio files in IndexedDB / localStorage
 * so that offline page explanations can play Gemini's original female voice recordings seamlessly.
 */

const DB_NAME = 'ha_gemini_voice_cache_db';
const STORE_NAME = 'audio_recordings';
const DB_VERSION = 1;

export interface CachedVoiceRecord {
  cacheKey: string;      // e.g. "gemini_voice_master_orchestrator_bn-BD_BANGLA_FEMALE"
  pageId: string;
  lang: string;
  persona: string;
  audioBase64: string;   // Full audio data Base64
  mimeType: string;      // 'audio/mpeg' or 'audio/wav'
  textHash: string;      // Short hash of source script
  source: 'GEMINI_LIVE' | 'GEMINI_PRESTORED' | 'NEURAL_TTS';
  timestamp: number;
}

// Open IndexedDB safely with fallback
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generate deterministic hash for script text
export function generateTextHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Build standard cache key
export function buildAudioCacheKey(pageId: string, lang: string, persona: string, textHash: string): string {
  return `gemini_audio_${pageId}_${lang}_${persona}_${textHash}`;
}

export const VoiceCacheManager = {
  /**
   * Save audio record to cache
   */
  async saveAudio(record: CachedVoiceRecord): Promise<boolean> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      // Fallback to localStorage if small or DB unavailable
      try {
        if (record.audioBase64 && record.audioBase64.length < 500000) {
          localStorage.setItem(`vcache_${record.cacheKey}`, JSON.stringify(record));
          return true;
        }
      } catch {}
      return false;
    }
  },

  /**
   * Retrieve cached audio record by key
   */
  async getAudio(cacheKey: string): Promise<CachedVoiceRecord | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(cacheKey);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      try {
        const item = localStorage.getItem(`vcache_${cacheKey}`);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    }
  },

  /**
   * Find cached audio for pageId and persona
   */
  async findAudioForPage(pageId: string, lang: string, persona: string, text: string): Promise<CachedVoiceRecord | null> {
    const textHash = generateTextHash(text);
    const primaryKey = buildAudioCacheKey(pageId, lang, persona, textHash);
    
    // Check primary key first
    const primaryRecord = await this.getAudio(primaryKey);
    if (primaryRecord) return primaryRecord;

    // Check general key if exact hash not found
    const looseKey = `gemini_audio_${pageId}_${lang}_${persona}`;
    const looseRecord = await this.getAudio(looseKey);
    return looseRecord;
  },

  /**
   * Pre-warm default cache with pre-stored Gemini female voices if empty
   */
  async getCacheStats(): Promise<{ count: number; totalBytes: number }> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const items: CachedVoiceRecord[] = req.result || [];
          let bytes = 0;
          items.forEach(it => { bytes += (it.audioBase64?.length || 0); });
          resolve({ count: items.length, totalBytes: bytes });
        };
        req.onerror = () => resolve({ count: 0, totalBytes: 0 });
      });
    } catch {
      return { count: 0, totalBytes: 0 };
    }
  },

  /**
   * Clear all cached audio files
   */
  async clearCache(): Promise<boolean> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }
};
