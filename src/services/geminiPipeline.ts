/**
 * ==============================================================================
 * UNIFIED GEMINI PIPELINE & ARCHITECTURE MANAGEMENT SERVICE
 * ==============================================================================
 * This module consolidates ALL Gemini communication channels into a single,
 * fault-tolerant pipeline manager:
 * 1. Multimodal Live Bidirectional WebSocket Bridge (Google BidiGenerateContent)
 * 2. Real-time 16kHz PCM Audio Streaming & 24kHz Synthesis Playback
 * 3. Asynchronous Text & Function-Calling Tool Execution (/api/gemini/live-chat)
 * 4. Multi-API Key Pool, Latency Auditing & Failover Rotation (/api/gemini/keys)
 * 5. Live Connection Diagnostic & Local Training Guard Telemetry
 * ==============================================================================
 */

import { apiFetch } from './api';

export interface LiveVoiceCallbacks {
  onConnected?: () => void;
  onAudioChunk?: (base64Pcm: string) => void;
  onTranscript?: (speaker: 'user' | 'model', text: string) => void;
  onActionExecuted?: (action: { entity_id: string; service: string; params?: any }, result: any) => void;
  onInterrupted?: () => void;
  onFallback?: (reason: string, message: string) => void;
  onWarning?: (warning: string) => void;
  onVolume?: (volume: number) => void;
  onError?: (error: string) => void;
  onClosed?: () => void;
}

export interface GeminiKeyItem {
  key_id: string;
  masked_key: string;
  raw_key?: string;
  label: string;
  active: boolean;
  status: 'HEALTHY' | 'RATE_LIMITED' | 'EXHAUSTED' | 'INVALID';
  last_used: string;
  request_count: number;
  error_count: number;
  avg_latency_ms: number;
  is_rate_limited?: boolean;
}

export interface GeminiLiveDiagnostic {
  success: boolean;
  status: 'CONNECTED' | 'AUTH_FAILED' | 'RATE_LIMITED' | 'OFFLINE';
  latencyMs: number;
  activeModel: string;
  keyLabel: string;
  keyMasked: string;
  isLiveAvailable: boolean;
  isLocalModelTrained: boolean;
  mode: 'ORIGINAL_GEMINI_LIVE_CLOUD' | 'HYBRID_LOCAL_EDGE_FALLBACK';
  modeLabelBn: string;
  messageBn: string;
  telemetry?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    sessionTokens: number;
    failoverCount: number;
    lastVerified: string;
    lastLatencyMs: number;
    lastStatus: string;
    activeModel: string;
    activeKeyMasked: string;
    activeKeyLabel: string;
    estimatedCost: string;
  };
  localTrainingStatus?: {
    isTrained: boolean;
    datasetPairs: number;
    checkpointPath: string | null;
    statusLabelBn: string;
    reasonBn: string;
  };
}

/**
 * High-performance, cross-platform client for the Gemini Multimodal Live API
 */
export class GeminiLiveAudioClient {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private nextPlayTime: number = 0;
  private isLive: boolean = false;
  private callbacks: LiveVoiceCallbacks = {};
  private currentSources: AudioBufferSourceNode[] = [];

  constructor(callbacks: LiveVoiceCallbacks = {}) {
    this.callbacks = callbacks;
  }

  public setCallbacks(callbacks: LiveVoiceCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public async start(): Promise<boolean> {
    if (this.isLive) return true;

    try {
      // 1. Resolve WebSocket URL with full Home Assistant Ingress prefix support
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      
      let ingressPrefix = '';
      if (typeof window !== 'undefined' && window.location.pathname) {
        const ingressMatch = window.location.pathname.match(/(\/api\/hassio_ingress\/[^/]+)/);
        if (ingressMatch) {
          ingressPrefix = ingressMatch[1];
        }
      }

      const wsUrl = `${protocol}//${host}${ingressPrefix}/api/gemini/live-ws`;
      console.log('[UnifiedGemini] Initializing Live Session via:', wsUrl);

      // 2. Initialize AudioContext on user click gesture
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        throw new Error('আপনার ব্রাউজারে Web Audio API সমর্থিত নয়।');
      }

      try {
        this.outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
      } catch {
        this.outputAudioCtx = new AudioCtxClass();
      }

      if (this.outputAudioCtx.state === 'suspended') {
        await this.outputAudioCtx.resume();
      }
      this.nextPlayTime = this.outputAudioCtx.currentTime;

      // 3. Safe Microphone Permission Request
      let micAcquired = false;
      let micWarningMsg: string | null = null;

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            this.micStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            });
            micAcquired = true;
          } catch (micErr: any) {
            console.warn('[UnifiedGemini] Direct mic permission notice:', micErr.name, micErr.message);
            micWarningMsg = micErr.name === 'NotAllowedError' 
              ? 'মাইক্রোফোন পারমিশন ব্লকড। অনুগ্রহ করে ব্রাউজার সেটিংসে অনুমতি দিন।'
              : 'মাইক্রোফোন অ্যাক্সেস সাময়িক বিঘ্নিত হয়েছে।';
          }
        }
      } catch (e: any) {
        console.warn('[UnifiedGemini] MediaDevices check notice:', e);
      }

      // 4. Connect to server-side bi-directional WebSocket bridge
      return new Promise<boolean>((resolve) => {
        try {
          this.ws = new WebSocket(wsUrl);

          this.ws.onopen = () => {
            console.log('[UnifiedGemini] Bridge WebSocket Connected. Waiting for Gemini Upstream handshake...');
            if (micAcquired && this.micStream) {
              this.startMicProcessing(this.micStream);
            } else if (micWarningMsg) {
              this.callbacks.onWarning?.(micWarningMsg);
            }
          };

          this.ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);

              if (data.type === 'live_ready' || data.setupComplete) {
                console.log('[UnifiedGemini] Live Ready / Setup Complete:', data);
                this.isLive = true;
                this.callbacks.onConnected?.();
                resolve(true);
                return;
              }

              // Raw Gemini BidiGenerateContent stream parser
              if (data.serverContent?.modelTurn?.parts) {
                for (const part of data.serverContent.modelTurn.parts) {
                  if (part.inlineData?.data) {
                    this.playAudioChunk(part.inlineData.data);
                    this.callbacks.onAudioChunk?.(part.inlineData.data);
                  }
                  if (part.text) {
                    this.callbacks.onTranscript?.('model', part.text);
                  }
                }
              }

              if (data.serverContent?.interrupted) {
                this.stopCurrentAudioPlayback();
                this.callbacks.onInterrupted?.();
              }

              if (data.type === 'fallback_mode') {
                console.warn('[UnifiedGemini] Server requested fallback mode:', data.reason);
                this.callbacks.onFallback?.(data.reason || 'UNAVAILABLE', data.message || 'লোকাল ইঞ্জিন সক্রিয়');
                resolve(false);
                return;
              }

              if (data.type === 'audio' && data.audio) {
                this.playAudioChunk(data.audio);
                this.callbacks.onAudioChunk?.(data.audio);
              }

              if (data.type === 'transcript' && data.text) {
                this.callbacks.onTranscript?.(data.speaker || 'model', data.text);
              }

              if (data.type === 'action_executed') {
                this.callbacks.onActionExecuted?.(data.action, data.result);
              }

              if (data.type === 'interrupted') {
                this.stopCurrentAudioPlayback();
                this.callbacks.onInterrupted?.();
              }

              if (data.type === 'error') {
                console.error('[UnifiedGemini] Server Error:', data.error);
                this.callbacks.onError?.(data.message || data.error);
              }
            } catch (err) {
              console.warn('[UnifiedGemini] Message parsing notice:', err);
            }
          };

          this.ws.onerror = (err) => {
            console.error('[UnifiedGemini] Bridge WebSocket Error:', err);
            this.callbacks.onError?.('জেমিনি লাইভ ওয়েবসকেট ব্রিজ সংযোগে ত্রুটি।');
            resolve(false);
          };

          this.ws.onclose = () => {
            console.log('[UnifiedGemini] Bridge WebSocket Closed');
            this.isLive = false;
            this.callbacks.onClosed?.();
          };

          // Timeout guard: 12 seconds
          setTimeout(() => {
            if (!this.isLive) {
              console.warn('[UnifiedGemini] Live connection timeout - using cloud chat as active fallback');
              resolve(false);
            }
          }, 12000);

        } catch (e: any) {
          console.error('[UnifiedGemini] WebSocket connection failed:', e);
          this.callbacks.onError?.(e.message);
          resolve(false);
        }
      });

    } catch (e: any) {
      console.error('[UnifiedGemini] Start failed:', e);
      this.callbacks.onError?.(e.message);
      return false;
    }
  }

  private startMicProcessing(stream: MediaStream) {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioCtxClass();

      const source = this.inputAudioCtx.createMediaStreamSource(stream);
      const bufferSize = 2048;
      this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(bufferSize, 1, 1);

      this.scriptProcessor.onaudioprocess = (e) => {
        if (!this.isLive || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate audio volume for UI visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        this.callbacks.onVolume?.(Math.min(1, rms * 5));

        // Downsample input to 16000Hz PCM
        const pcm16 = this.downsampleTo16k(inputData, this.inputAudioCtx?.sampleRate || 44100);
        const base64 = this.pcmToBase64(pcm16);

        // Send PCM media chunk frame
        this.ws.send(JSON.stringify({
          type: 'audio',
          audio: base64
        }));
      };

      source.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.inputAudioCtx.destination);
      console.log('[UnifiedGemini] Microphone audio capture pipeline active');
    } catch (err) {
      console.error('[UnifiedGemini] Mic processing failed:', err);
    }
  }

  private downsampleTo16k(buffer: Float32Array, inputSampleRate: number): Int16Array {
    if (inputSampleRate === 16000) {
      const result = new Int16Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        const s = Math.max(-1, Math.min(1, buffer[i]));
        result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return result;
    }

    const ratio = inputSampleRate / 16000;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      const s = Math.max(-1, Math.min(1, count > 0 ? accum / count : 0));
      result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  private pcmToBase64(pcmData: Int16Array): string {
    const bytes = new Uint8Array(pcmData.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private playAudioChunk(base64Pcm: string) {
    if (!this.outputAudioCtx) return;

    try {
      const binaryString = window.atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16Array = new Int16Array(bytes.buffer);

      const sampleRate = 24000; // Gemini Live standard output sample rate
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.outputAudioCtx.createBuffer(1, float32Array.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioCtx.destination);

      const currentTime = this.outputAudioCtx.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime;
      }

      source.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;

      this.currentSources.push(source);
      source.onended = () => {
        this.currentSources = this.currentSources.filter(s => s !== source);
      };
    } catch (e) {
      console.warn('[UnifiedGemini] Audio chunk decode error:', e);
    }
  }

  public stopCurrentAudioPlayback() {
    for (const src of this.currentSources) {
      try {
        src.stop();
      } catch {}
    }
    this.currentSources = [];
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  public sendTextMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'text',
        text: text
      }));
    }
  }

  public stop() {
    this.isLive = false;
    this.stopCurrentAudioPlayback();

    if (this.scriptProcessor) {
      try {
        this.scriptProcessor.disconnect();
      } catch {}
      this.scriptProcessor = null;
    }

    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach(track => track.stop());
      } catch {}
      this.micStream = null;
    }

    if (this.inputAudioCtx) {
      try {
        this.inputAudioCtx.close();
      } catch {}
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      try {
        this.outputAudioCtx.close();
      } catch {}
      this.outputAudioCtx = null;
    }

    if (this.ws) {
      try {
        this.ws.send(JSON.stringify({ type: 'end' }));
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }

  public isActive(): boolean {
    return this.isLive;
  }
}

/**
 * Unified API Communication Helpers for Gemini
 */
export async function fetchGeminiDiagnostic(): Promise<GeminiLiveDiagnostic> {
  return apiFetch('/api/gemini/verify-connection');
}

export async function sendGeminiChatMessage(message: string, room?: string): Promise<any> {
  return apiFetch('/api/gemini/live-chat', {
    method: 'POST',
    body: JSON.stringify({ message, room })
  });
}

export async function fetchGeminiKeyPool(): Promise<{ success: boolean; keys: GeminiKeyItem[] }> {
  return apiFetch('/api/gemini/keys');
}

export async function addGeminiKeyToPool(raw_key: string, label: string): Promise<any> {
  return apiFetch('/api/gemini/keys', {
    method: 'POST',
    body: JSON.stringify({ api_key: raw_key, raw_key, label })
  });
}

export async function toggleGeminiKeyActive(key_id: string): Promise<any> {
  return apiFetch(`/api/gemini/keys/${key_id}/toggle`, {
    method: 'POST'
  });
}

export async function deleteGeminiKeyFromPool(key_id: string): Promise<any> {
  return apiFetch(`/api/gemini/keys/${key_id}`, {
    method: 'DELETE'
  });
}

export async function testGeminiKeyLatency(params: { raw_key?: string; key_id?: string }): Promise<any> {
  return apiFetch('/api/gemini/test-key', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
