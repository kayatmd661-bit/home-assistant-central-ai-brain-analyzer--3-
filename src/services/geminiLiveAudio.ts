/**
 * Gemini Multimodal Live Audio Client & Hybrid Local Routing Bridge
 * Cross-platform AudioContext & Microphone Permissions handling
 * Supports PC Browsers (Chrome, Edge, Safari) and Home Assistant Companion App (Android/iOS WebView)
 * over HTTP/HTTPS Ingress Proxies with seamless live voice streaming and fallback resilience.
 */

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
      console.log('[GeminiLiveAudio] Initializing Live Session via:', wsUrl);

      // 2. Initialize AudioContext on user click gesture (resumes audio context immediately)
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

      // 3. Safe Microphone Permission Request (Cross-Platform & WebView/iFrame Ingress safe)
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
          } catch (strictMicErr) {
            console.warn('[GeminiLiveAudio] Strict audio constraints failed, trying relaxed audio: true', strictMicErr);
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micAcquired = true;
          }
        } else {
          // Vendor-prefixed getUserMedia fallback for older WebViews / Android HA Companion
          const legacyGUM = (
            (navigator as any).getUserMedia ||
            (navigator as any).webkitGetUserMedia ||
            (navigator as any).mozGetUserMedia ||
            (navigator as any).msGetUserMedia
          );
          if (legacyGUM) {
            this.micStream = await new Promise<MediaStream>((resolve, reject) => {
              legacyGUM.call(navigator, { audio: true }, resolve, reject);
            });
            micAcquired = true;
          } else {
            micWarningMsg = 'মাইক্রোফোন এপিআই অনুপলব্ধ (ইনগ্রেস আইফ্রেম বা এইচটিটিপি নীতি)। তবে লাইভ অডিও স্পিকার সক্রিয় থাকবে।';
          }
        }
      } catch (micErr: any) {
        console.warn('[GeminiLiveAudio] Microphone permission notice:', micErr);
        const errName = micErr?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          micWarningMsg = 'মাইক্রোফোন ব্যবহারের অনুমতি বাতিল করা হয়েছে। অ্যাপ বা ব্রাউজারের পারমিশন দিন।';
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          micWarningMsg = 'ডিভাইসে কার্যকর কোনো মাইক্রোফোন পাওয়া যায়নি।';
        } else {
          micWarningMsg = 'মাইক্রোফোন অ্যাক্সেস সীমাবদ্ধ (ইনগ্রেস আইফ্রেম)। টেক্সট দিয়ে কথা বলতে পারেন।';
        }
      }

      // 4. Initialize Input AudioContext if microphone is available
      if (micAcquired && this.micStream) {
        try {
          this.inputAudioCtx = new AudioCtxClass({ sampleRate: 16000 });
        } catch {
          this.inputAudioCtx = new AudioCtxClass();
        }

        if (this.inputAudioCtx.state === 'suspended') {
          await this.inputAudioCtx.resume();
        }

        // 5. Connect Microphone Source to ScriptProcessor for 16kHz PCM streaming
        const micSource = this.inputAudioCtx.createMediaStreamSource(this.micStream);
        this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(2048, 1, 1);

        this.scriptProcessor.onaudioprocess = (event) => {
          if (!this.isLive || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
          const inputData = event.inputBuffer.getChannelData(0);
          
          // Calculate volume level for visualizer
          let sumSquares = 0;
          for (let i = 0; i < inputData.length; i++) {
            sumSquares += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sumSquares / inputData.length);
          this.callbacks.onVolume?.(Math.min(1, rms * 5));

          const pcmBase64 = this.floatTo16BitPCMBase64(inputData);
          if (pcmBase64) {
            this.ws.send(JSON.stringify({ type: 'audio', audio: pcmBase64 }));
          }
        };

        micSource.connect(this.scriptProcessor);
        this.scriptProcessor.connect(this.inputAudioCtx.destination);
      } else if (micWarningMsg) {
        this.callbacks.onWarning?.(micWarningMsg);
      }

      // 6. Connect WebSocket Bridge to Server
      this.ws = new WebSocket(wsUrl);

      return new Promise<boolean>((resolve) => {
        if (!this.ws) return resolve(false);

        const connectionTimeout = setTimeout(() => {
          if (!this.isLive) {
            console.warn('[GeminiLiveAudio] WebSocket connection timeout, triggering fallback');
            this.callbacks.onFallback?.('TIMEOUT', 'লাইভ অডিও সংযোগ বিলম্বিত হওয়ায় লোকাল টেক্সটলেস ইঞ্জিনে রুট করা হয়েছে।');
            resolve(false);
          }
        }, 10000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('[GeminiLiveAudio] Live WebSocket connected successfully');
          this.isLive = true;
          this.callbacks.onConnected?.();
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'live_ready') {
              console.log('[GeminiLiveAudio] Live Ready:', data);
              this.isLive = true;
              this.callbacks.onConnected?.();
              return;
            }

            if (data.type === 'fallback_mode') {
              console.warn('[GeminiLiveAudio] Server requested fallback mode:', data.reason);
              this.callbacks.onFallback?.(data.reason || 'UNAVAILABLE', data.message || 'লোকাল টেক্সটলেস ইঞ্জিন সক্রিয়');
              return;
            }

            if (data.type === 'audio' && data.audio) {
              this.playAudioChunk(data.audio);
              this.callbacks.onAudioChunk?.(data.audio);
            }

            if (data.type === 'transcript') {
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
              console.error('[GeminiLiveAudio] Server message error:', data.error);
              if (data.fallback_available) {
                this.callbacks.onFallback?.('ERROR', data.error);
              } else {
                this.callbacks.onError?.(data.error);
              }
            }
          } catch (e: any) {
            console.error('[GeminiLiveAudio] JSON parse error on WS message:', e);
          }
        };

        this.ws.onerror = (err) => {
          clearTimeout(connectionTimeout);
          console.warn('[GeminiLiveAudio] WebSocket error encountered:', err);
          this.callbacks.onFallback?.('CONNECTION_ERROR', 'জেমিনি ক্লাউড সংযোগ ব্যর্থ। লোকাল টেক্সটলেস ট্রান্সফরমার ইঞ্জিন সক্রিয়।');
          resolve(false);
        };

        this.ws.onclose = () => {
          clearTimeout(connectionTimeout);
          console.log('[GeminiLiveAudio] WebSocket session closed');
          this.isLive = false;
          this.callbacks.onClosed?.();
        };
      });

    } catch (err: any) {
      console.warn('[GeminiLiveAudio] Initialization notice:', err.message || err);
      this.callbacks.onFallback?.('PERMISSION_DENIED', err.message || 'মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি');
      this.stop();
      return false;
    }
  }

  public isMicActive(): boolean {
    return !!(this.micStream && this.micStream.active);
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
        this.micStream.getTracks().forEach(t => t.stop());
      } catch {}
      this.micStream = null;
    }

    if (this.inputAudioCtx) {
      try {
        this.inputAudioCtx.close().catch(() => {});
      } catch {}
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      try {
        this.outputAudioCtx.close().catch(() => {});
      } catch {}
      this.outputAudioCtx = null;
    }

    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'end' }));
        }
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    this.callbacks.onClosed?.();
  }

  public sendTextMessage(text: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', text }));
    }
  }

  public isActive(): boolean {
    return this.isLive;
  }

  private stopCurrentAudioPlayback() {
    for (const source of this.currentSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {}
    }
    this.currentSources = [];
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  private playAudioChunk(base64Pcm: string) {
    if (!this.outputAudioCtx) return;

    try {
      const binaryString = atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM little-endian to Float32 [-1.0, 1.0]
      const int16Array = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.length / 2);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.outputAudioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioCtx.destination);

      const now = this.outputAudioCtx.currentTime;
      const startTime = Math.max(now, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      this.currentSources.push(source);
      source.onended = () => {
        const index = this.currentSources.indexOf(source);
        if (index !== -1) {
          this.currentSources.splice(index, 1);
        }
      };
    } catch (err) {
      console.warn('[GeminiLiveAudio] Audio chunk playback warning:', err);
    }
  }

  private floatTo16BitPCMBase64(input: Float32Array): string {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}
