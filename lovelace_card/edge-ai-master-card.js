/**
 * Edge-AI Master Hub Lovelace Card
 * Self-Evolving Edge-AI Brain, Natural Bengali Voice & Storage Controller
 */
class EdgeAIMasterCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.style.cssText = `
        background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
        border: 1px solid #1e293b;
        border-radius: 16px;
        color: #f8fafc;
        padding: 16px;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      `;
      this.content = document.createElement('div');
      card.appendChild(this.content);
      this.appendChild(card);
    }
    this.render();
  }

  render() {
    this.content.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #06b6d4, #6366f1); display: flex; align-items: center; justify-content: center; font-size: 18px;">
            ⚡
          </div>
          <div>
            <div style="font-weight: bold; font-size: 14px; color: #fff;">Edge-AI Master Brain</div>
            <div style="font-size: 11px; color: #94a3b8;">Gemini 3.7 + Pure NumPy RAM Engine</div>
          </div>
        </div>
        <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.3);">
          ● ACTIVE
        </span>
      </div>

      <!-- Quick Telemetry Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; padding: 10px; border-radius: 10px;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Inference Latency</div>
          <div style="font-size: 16px; font-weight: bold; color: #38bdf8;">11.2 ms</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; padding: 10px; border-radius: 10px;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase;">Storage Compression</div>
          <div style="font-size: 16px; font-weight: bold; color: #a855f7;">87.2% Zstd</div>
        </div>
      </div>

      <!-- Bengali Voice Command Quick Bar -->
      <div style="background: rgba(2, 6, 23, 0.9); border: 1px solid #1e293b; border-radius: 12px; padding: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #cbd5e1;">
          <span>🎙️</span>
          <span>"লিভিং রুমের ফ্যান অন করো"</span>
        </div>
        <button id="edge-ai-voice-trigger-btn" style="background: #06b6d4; color: #020617; border: none; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 11px; cursor: pointer;">
          শুনুন
        </button>
      </div>
    `;

    const btn = this.content.querySelector('#edge-ai-voice-trigger-btn');
    if (btn) {
      btn.onclick = () => {
        if (this._hass) {
          this._hass.callService('edge_ai_master', 'trigger_voice_broadcast', {
            message: 'এজ-এআই মাস্টার হোম অ্যাসিস্ট্যান্টে সক্রিয়ভাবে কাজ করছে।'
          });
        }
      };
    }
  }

  setConfig(config) {
    this._config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('edge-ai-master-card', EdgeAIMasterCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'edge-ai-master-card',
  name: 'Edge-AI Master Card',
  preview: true,
  description: 'Self-Evolving Hybrid Edge-AI Brain, Bengali Voice & Storage Controller card.'
});
