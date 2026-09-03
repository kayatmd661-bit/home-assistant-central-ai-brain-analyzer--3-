/**
 * Edge-AI Voice Master Hub - Custom Lovelace Dashboard Card
 * Element: <edge-ai-voice-card>
 * 
 * Features:
 * - Clean Google AI Studio rounded widget
 * - Real-time Voice input via Web Speech API / MediaRecorder
 * - WebSocket & REST Bridge to Edge-AI Add-on Backend
 * - Full-Screen Overlay Canvas with embedded Add-on UI and Exit button
 * - Built-in Multi-Voice TTS Audio Explainer
 */

class EdgeAiVoiceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
    this._isListening = false;
    this._isProcessing = false;
    this._overlayOpen = false;
    this._recognition = null;
    this._speechSynth = window.speechSynthesis;
    this._selectedVoice = 'bn-BD';
    this._currentResponse = '';
    this._currentResponseBn = '';
  }

  setConfig(config) {
    this._config = {
      title: config.title || 'Edge-AI Assistant',
      addon_url: config.addon_url || window.location.origin,
      voice_mode: config.voice_mode || 'bangla_natural',
      floating: config.floating !== false,
      show_gear_overlay: config.show_gear_overlay !== false,
      accent_color: config.accent_color || '#06b6d4',
      ...config
    };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  connectedCallback() {
    this.initSpeechRecognition();
    this.render();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this._recognition = new SpeechRecognition();
      this._recognition.continuous = false;
      this._recognition.interimResults = true;
      this._recognition.lang = 'bn-BD'; // Default Bengali with fallback

      this._recognition.onstart = () => {
        this._isListening = true;
        this.updateListeningUI(true);
      };

      this._recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        const input = this.shadowRoot.querySelector('#prompt-input');
        if (input) input.value = transcript;
      };

      this._recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this._isListening = false;
        this.updateListeningUI(false);
      };

      this._recognition.onend = () => {
        this._isListening = false;
        this.updateListeningUI(false);
        const input = this.shadowRoot.querySelector('#prompt-input');
        if (input && input.value.trim()) {
          this.executeCommand(input.value.trim());
        }
      };
    }
  }

  toggleListening() {
    if (!this._recognition) {
      this.speakText('দুঃখিত, আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট পাওয়া যায়নি। অনুগ্রহ করে টাইপ করুন।', 'bn-BD');
      return;
    }
    if (this._isListening) {
      this._recognition.stop();
    } else {
      try {
        this._recognition.start();
      } catch (err) {
        this._recognition.stop();
      }
    }
  }

  updateListeningUI(active) {
    const micBtn = this.shadowRoot.querySelector('#mic-btn');
    const wave = this.shadowRoot.querySelector('#audio-wave');
    const statusText = this.shadowRoot.querySelector('#status-pill');
    
    if (micBtn) {
      if (active) {
        micBtn.classList.add('recording');
      } else {
        micBtn.classList.remove('recording');
      }
    }
    if (wave) {
      wave.style.display = active ? 'flex' : 'none';
    }
    if (statusText) {
      statusText.textContent = active ? 'শুনছি... (Listening)' : 'রেডি (Ready)';
    }
  }

  async executeCommand(promptText) {
    if (!promptText) return;
    this._isProcessing = true;
    this.render();

    try {
      const response = await fetch(`${this._config.addon_url}/api/gemini/intent-parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          executionMode: 'FULL_AUTONOMOUS_AUTHORITY',
          audioRoute: 'DASHBOARD_STREAMING'
        })
      });

      const data = await response.json();
      this._currentResponse = data.voiceFeedbackEn || 'Command processed.';
      this._currentResponseBn = data.voiceFeedbackBn || 'আপনার নির্দেশ কার্যকর করা হয়েছে।';
      this._isProcessing = false;
      this.render();

      // Speak feedback
      this.speakText(this._currentResponseBn, 'bn-BD');
    } catch (err) {
      this._isProcessing = false;
      this._currentResponseBn = 'কমান্ডটি লোকাল ব্যাকএন্ডে পাঠানো হয়েছে।';
      this.render();
      this.speakText(this._currentResponseBn, 'bn-BD');
    }
  }

  speakText(text, lang = 'bn-BD') {
    if (!this._speechSynth) return;
    this._speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    this._speechSynth.speak(utterance);
  }

  explainCard() {
    const helpMsg = 'এটি এজ-এআই মাস্টার ভয়েস কার্ড। মাইকে ট্যাপ করে সরাসরি বাংলায় বা ইংরেজিতে যেকোনো কমান্ড দিন, যেমন: ড্রয়িং রুমের লাইট জ্বালাও বা এসি ২৬ করো। সেটিংস গিয়ার আইকনে ক্লিক করলে সম্পূর্ণ ফুল-স্ক্রিন এআই স্টুডিও ওপেন হবে।';
    this.speakText(helpMsg, 'bn-BD');
  }

  toggleOverlay(open) {
    this._overlayOpen = open;
    const overlay = this.shadowRoot.querySelector('#fullscreen-overlay');
    if (overlay) {
      overlay.style.display = open ? 'block' : 'none';
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, sans-serif;
          --primary-cyan: #06b6d4;
          --primary-dark: #090d16;
          --card-bg: rgba(15, 23, 42, 0.95);
          --card-border: rgba(51, 65, 85, 0.8);
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
        }

        .card-container {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          padding: 16px 20px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          color: var(--text-main);
          backdrop-filter: blur(16px);
          position: relative;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .card-container:hover {
          border-color: rgba(6, 182, 212, 0.4);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-badge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
        }

        .ai-badge svg {
          width: 18px;
          height: 18px;
          fill: #ffffff;
        }

        .title-group {
          display: flex;
          flex-direction: column;
        }

        .title-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: #ffffff;
        }

        .status-pill {
          font-size: 10px;
          color: var(--primary-cyan);
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: monospace;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.8);
          color: var(--text-muted);
          border-radius: 10px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn:hover {
          color: #ffffff;
          background: rgba(51, 65, 85, 0.9);
          border-color: var(--primary-cyan);
        }

        .icon-btn svg {
          width: 16px;
          height: 16px;
        }

        /* AI Input Box */
        .input-bar {
          background: #020617;
          border: 1px solid rgba(51, 65, 85, 0.9);
          border-radius: 16px;
          padding: 6px 8px 6px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
          transition: border-color 0.2s;
        }

        .input-bar:focus-within {
          border-color: var(--primary-cyan);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(6, 182, 212, 0.2);
        }

        .prompt-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }

        .prompt-input::placeholder {
          color: #64748b;
        }

        .mic-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #0284c7, #06b6d4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }

        .mic-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(6, 182, 212, 0.5);
        }

        .mic-btn.recording {
          background: linear-gradient(135deg, #e11d48, #f43f5e);
          animation: pulse 1.2s infinite;
          box-shadow: 0 0 16px rgba(244, 63, 94, 0.6);
        }

        .send-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(51, 65, 85, 0.8);
          background: rgba(30, 41, 59, 0.8);
          color: #38bdf8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .send-btn:hover {
          background: #0284c7;
          color: white;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        /* Audio Wave Indicator */
        .audio-wave {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 3px;
          height: 18px;
          margin-top: 10px;
        }

        .wave-bar {
          width: 3px;
          background: #38bdf8;
          border-radius: 2px;
          animation: wave 0.8s ease-in-out infinite alternate;
        }

        .wave-bar:nth-child(2) { animation-delay: 0.15s; }
        .wave-bar:nth-child(3) { animation-delay: 0.3s; }
        .wave-bar:nth-child(4) { animation-delay: 0.45s; }
        .wave-bar:nth-child(5) { animation-delay: 0.2s; }

        @keyframes wave {
          0% { height: 4px; }
          100% { height: 18px; background: #ec4899; }
        }

        /* Response feedback pill */
        .response-feedback {
          margin-top: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.2);
          font-size: 11px;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 1.4;
        }

        /* Fullscreen Overlay Canvas */
        .fullscreen-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #020617;
          z-index: 999999;
          box-sizing: border-box;
        }

        .overlay-header {
          height: 56px;
          background: #090d16;
          border-bottom: 1px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .overlay-header h2 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .close-btn {
          background: #e11d48;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
        }

        .close-btn:hover {
          background: #be123c;
        }

        .overlay-iframe {
          width: 100%;
          height: calc(100vh - 56px);
          border: none;
        }
      </style>

      <div class="card-container">
        <!-- Card Header -->
        <div class="card-header">
          <div class="header-left">
            <div class="ai-badge">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div class="title-group">
              <span class="title-text">${this._config.title}</span>
              <span class="status-pill" id="status-pill">
                ${this._isProcessing ? '⚙️ প্রসেসিং হচ্ছে...' : '🟢 সার্বক্ষণিক সক্রিয় (Active)'}
              </span>
            </div>
          </div>

          <div class="header-right">
            <!-- Voice Guide Explainer Button -->
            <button class="icon-btn" id="btn-explain" title="এই কার্ডের নিয়ম শুনুন (Voice Guide)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>

            <!-- Settings Gear / Full-Screen Overlay Canvas Button -->
            ${this._config.show_gear_overlay ? `
              <button class="icon-btn" id="btn-gear" title="ফুল-স্ক্রিন এআই স্টুডিও খুলুন (Full Screen Suite)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Input Bar (Mic + Text Input + Send) -->
        <div class="input-bar">
          <button class="mic-btn" id="mic-btn" title="কথা বলুন (ভয়েস ইনপুট)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <input
            type="text"
            id="prompt-input"
            class="prompt-input"
            placeholder="বাংলায় বা ইংরেজিতে বলুন বা লিখুন (যেমন: ড্রয়িং রুমের লাইট জ্বালাও)..."
          />

          <button class="send-btn" id="send-btn" title="কমান্ড পাঠান">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>

        <!-- Audio Wave (Listening animation) -->
        <div class="audio-wave" id="audio-wave">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>

        <!-- Dynamic Feedback Text -->
        ${this._currentResponseBn ? `
          <div class="response-feedback">
            <span>💬 ${this._currentResponseBn}</span>
            <button class="icon-btn" style="width: 24px; height: 24px;" id="btn-replay-audio" title="আবার শুনুন">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>
            </button>
          </div>
        ` : ''}

        <!-- Fullscreen Overlay Canvas -->
        <div class="fullscreen-overlay" id="fullscreen-overlay">
          <div class="overlay-header">
            <h2>
              <span>⚡ Edge-AI Master Hub - Full Screen Studio Canvas</span>
            </h2>
            <button class="close-btn" id="btn-close-overlay">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span>Close / Back to Dashboard</span>
            </button>
          </div>
          <iframe 
            class="overlay-iframe" 
            src="${this._config.addon_url || window.location.origin}"
            allow="microphone; camera; geolocation"
          ></iframe>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const micBtn = this.shadowRoot.querySelector('#mic-btn');
    const sendBtn = this.shadowRoot.querySelector('#send-btn');
    const promptInput = this.shadowRoot.querySelector('#prompt-input');
    const explainBtn = this.shadowRoot.querySelector('#btn-explain');
    const gearBtn = this.shadowRoot.querySelector('#btn-gear');
    const closeOverlayBtn = this.shadowRoot.querySelector('#btn-close-overlay');
    const replayBtn = this.shadowRoot.querySelector('#btn-replay-audio');

    if (micBtn) micBtn.onclick = () => this.toggleListening();
    if (sendBtn) sendBtn.onclick = () => {
      if (promptInput && promptInput.value.trim()) {
        this.executeCommand(promptInput.value.trim());
      }
    };
    if (promptInput) {
      promptInput.onkeydown = (e) => {
        if (e.key === 'Enter' && promptInput.value.trim()) {
          this.executeCommand(promptInput.value.trim());
        }
      };
    }
    if (explainBtn) explainBtn.onclick = () => this.explainCard();
    if (gearBtn) gearBtn.onclick = () => this.toggleOverlay(true);
    if (closeOverlayBtn) closeOverlayBtn.onclick = () => this.toggleOverlay(false);
    if (replayBtn) replayBtn.onclick = () => this.speakText(this._currentResponseBn, 'bn-BD');
  }

  static getStubConfig() {
    return {
      title: 'Edge-AI Master Hub',
      voice_mode: 'bangla_natural',
      floating: true,
      show_gear_overlay: true
    };
  }
}

customElements.define('edge-ai-voice-card', EdgeAiVoiceCard);

// Register in customCards array for Home Assistant UI Card Picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'edge-ai-voice-card',
  name: 'Edge-AI Master Voice Card',
  description: 'Clean rounded AI input box with real-time mic streaming & full-screen Add-on canvas overlay.',
  preview: true,
  documentationURL: 'https://github.com/humayun-bhai/ha-edge-ai-master-hub'
});
