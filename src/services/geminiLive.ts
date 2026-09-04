/**
 * Gemini Multimodal Live Audio Client & Ingress WebAudio Bridge
 * Cross-platform AudioContext & Microphone Permissions handling
 * Enforces secure wss:// protocol and AudioContext.resume() for Home Assistant Ingress iframes.
 */

export * from './geminiLiveAudio';
export { GeminiLiveAudioClient } from './geminiLiveAudio';

/**
 * Ensures AudioContext is safely initialized and resumed upon user gesture
 * inside Home Assistant Ingress iframes.
 */
export async function ensureAudioContextResumed(ctx?: AudioContext | null): Promise<AudioContext> {
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) {
    throw new Error('Web Audio API is not supported in this environment');
  }

  const audioContext = ctx || new AudioCtxClass();
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  return audioContext;
}

/**
 * Resolves secure wss:// or ws:// WebSocket endpoint with dynamic Ingress path prefix
 */
export function getLiveWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname;
  const currentPort = window.location.port;
  const portSuffix = (currentPort && currentPort !== '80' && currentPort !== '443') ? `:${currentPort}` : ':8099';

  let ingressPrefix = '';
  if (typeof window !== 'undefined' && window.location.pathname) {
    const ingressMatch = window.location.pathname.match(/(\/api\/hassio_ingress\/[^/]+)/);
    if (ingressMatch) {
      ingressPrefix = ingressMatch[1];
    }
  }

  return `${protocol}//${hostname}${portSuffix}${ingressPrefix}/api/gemini/live-ws`;
}
