import React, { useState, useEffect, useRef } from 'react';
import { 
  Bluetooth, 
  Music, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Zap, 
  Sparkles, 
  Radio, 
  Layers, 
  Disc, 
  Activity, 
  Mic, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  Headphones, 
  Speaker, 
  CheckCircle2, 
  Tv, 
  Flame, 
  Sun, 
  Moon,
  Palette
} from 'lucide-react';
import { 
  BluetoothAudioReceiver, 
  AudioBroadcastGroup, 
  FFTSpectrumData, 
  MusicReactiveConfig, 
  CrossSystemAutomation 
} from '../types';

export const MultiBluetoothReactiveStudio: React.FC = () => {
  const [receivers, setReceivers] = useState<BluetoothAudioReceiver[]>([]);
  const [groups, setGroups] = useState<AudioBroadcastGroup[]>([]);
  const [spectrum, setSpectrum] = useState<FFTSpectrumData>({
    timestamp: Date.now(),
    bassEnergy: 65,
    midEnergy: 45,
    trebleEnergy: 30,
    peakFrequencyHz: 120,
    bpmDetected: 128,
    beatHit: false,
    spectrumBands: Array(16).fill(30),
    recommendedRgb: { r: 0, g: 255, b: 234 },
    recommendedBrightness: 70,
    paletteName: 'NEON_CYBERPUNK'
  });

  const [config, setConfig] = useState<MusicReactiveConfig>({
    enabled: true,
    selectedLightEntities: ['light.drawing_room', 'light.master_bed'],
    colorPalette: 'NEON_CYBERPUNK',
    bassSensitivity: 1.2,
    trebleSensitivity: 1.0,
    fadeTransitionSpeedMs: 80,
    strobeOnHeavyDrop: true,
    silenceFadeTimeoutSec: 3.0,
    activePresetName: 'Cyberpunk Bass Pulsar'
  });

  const [automations, setAutomations] = useState<CrossSystemAutomation[]>([]);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceResponseBn, setVoiceResponseBn] = useState<string | null>(null);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchBluetoothData = async () => {
    try {
      const [rRes, gRes, sRes, aRes] = await Promise.all([
        fetch('/api/bluetooth/receivers').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/bluetooth/groups').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/bluetooth/fft-spectrum').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/cross-system/automations').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (rRes?.receivers && Array.isArray(rRes.receivers)) setReceivers(rRes.receivers);
      if (gRes?.groups && Array.isArray(gRes.groups)) setGroups(gRes.groups);
      if (sRes) setSpectrum(sRes);
      if (aRes?.automations && Array.isArray(aRes.automations)) setAutomations(aRes.automations);
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchBluetoothData();
    const interval = setInterval(fetchBluetoothData, 3000);
    return () => clearInterval(interval);
  }, []);

  // 60FPS Canvas Equalizer Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const numBands = spectrum.spectrumBands.length || 16;
      const barWidth = (width / numBands) - 3;

      for (let i = 0; i < numBands; i++) {
        const val = spectrum.spectrumBands[i] || 10;
        const barHeight = (val / 100) * (height - 20);
        const x = i * (barWidth + 3);
        const y = height - barHeight;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        if (spectrum.beatHit && i < 5) {
          grad.addColorStop(0, '#ff007f');
          grad.addColorStop(1, '#ff00ff');
        } else {
          grad.addColorStop(0, '#00d2ff');
          grad.addColorStop(1, '#00f2fe');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // Top peak dot
        ctx.fillStyle = spectrum.beatHit ? '#ffffff' : '#00ffff';
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, Math.max(5, y - 4), 2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [spectrum]);

  const handleToggleRoute = async (receiver: BluetoothAudioReceiver) => {
    const stream = receiver.status !== 'STREAMING';
    try {
      const res = await fetch('/api/bluetooth/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiver.id, stream })
      });
      const data = await res.json();
      if (data.success) fetchBluetoothData();
    } catch (err) {
      console.error('Route toggle failed:', err);
    }
  };

  const handlePartySyncToggle = async () => {
    const isStreamingParty = groups[0]?.activeStream;
    try {
      const res = await fetch('/api/bluetooth/group-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: 'group-party-all',
          active: !isStreamingParty,
          receiverIds: ['bt-rec-01', 'bt-rec-03']
        })
      });
      const data = await res.json();
      if (data.success) fetchBluetoothData();
    } catch (err) {
      console.error('Party sync failed:', err);
    }
  };

  const handlePaletteChange = async (palette: any) => {
    const newConfig = { ...config, colorPalette: palette };
    setConfig(newConfig);
    try {
      await fetch('/api/bluetooth/reactive-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (err) {
      console.error('Config update failed:', err);
    }
  };

  const handleVoiceIntentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceQuery.trim()) return;

    setIsProcessingVoice(true);
    try {
      const res = await fetch('/api/cross-system/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceQuery })
      });
      const data = await res.json();
      if (data.success) {
        setVoiceResponseBn(data.voiceFeedbackBn);
        fetchBluetoothData();
      }
    } catch (err) {
      console.error('Voice intent failed:', err);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleTriggerAutomation = async (id: string) => {
    try {
      const res = await fetch(`/api/cross-system/automations/${id}/trigger`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setVoiceResponseBn(data.message);
        fetchBluetoothData();
      }
    } catch (err) {
      console.error('Trigger automation failed:', err);
    }
  };

  const ambientRgbString = `rgb(${spectrum.recommendedRgb.r}, ${spectrum.recommendedRgb.g}, ${spectrum.recommendedRgb.b})`;

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      
      {/* Top Banner: Multi-Bluetooth Audio Switchboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Music className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>ব্লুটুথ স্পিকার ও মিউজিক লাইটিং স্টুডিও</span>
                  <span className="text-xs px-2 py-0.5 bg-pink-950 text-pink-400 border border-pink-800/60 rounded">
                    মিউজিক সিনক্রোনাইজেশন
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                একাধিক ব্লুটুথ স্পিকার সিঙ্ক • গানের তালে তালে স্মার্ট লাইটের রঙ ও আলো পরিবর্তন (Music Reactive Sync)
              </p>
            </div>
          </div>

          {/* Master Controls: Party Sync & Playback */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-party-sync-toggle"
              onClick={handlePartySyncToggle}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                groups[0]?.activeStream 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-900/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Disc className={`w-4 h-4 ${groups[0]?.activeStream ? 'animate-spin' : ''}`} />
              <span>{groups[0]?.activeStream ? '🎉 পুরো বাড়ির পার্টি মোড চালু আছে' : '🎉 পুরো বাড়ির পার্টি মোড চালু করুন'}</span>
            </button>
          </div>
        </div>

        {/* Live FFT Spectrum Analyzer & Reactive Room Lighting Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800/80">
          
          {/* Canvas Spectrum Equalizer (2 cols) */}
          <div className="lg:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-2 text-cyan-400">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Zero-Latency 16-Band FFT Equalizer</span>
              </span>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Peak: <strong className="text-white">{spectrum.peakFrequencyHz} Hz</strong></span>
                <span>BPM: <strong className="text-pink-400">{spectrum.bpmDetected}</strong></span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${spectrum.beatHit ? 'bg-pink-600 text-white animate-bounce' : 'bg-slate-800 text-slate-400'}`}>
                  {spectrum.beatHit ? '⚡ BASS HIT' : 'STEADY'}
                </span>
              </div>
            </div>

            <canvas 
              ref={canvasRef} 
              width={600} 
              height={140} 
              className="w-full h-32 bg-slate-900/50 rounded-lg border border-slate-800/60"
            />

            {/* Sub-Bands Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Low-Bass (20-250Hz)</div>
                <div className="text-sm font-bold text-pink-400">{spectrum.bassEnergy}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Mid-Range (250-4kHz)</div>
                <div className="text-sm font-bold text-cyan-400">{spectrum.midEnergy}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">High-Treble (4k-20kHz)</div>
                <div className="text-sm font-bold text-indigo-400">{spectrum.trebleEnergy}%</div>
              </div>
            </div>
          </div>

          {/* HA Ambient Room Lighting Sync Box */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-pink-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> HA Light Entity Sync
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {config.selectedLightEntities.length} Entities
                </span>
              </div>

              {/* Ambient Glowing Bulb Simulator */}
              <div 
                className="w-full h-24 rounded-xl border flex flex-col items-center justify-center transition-all duration-100 shadow-inner relative overflow-hidden"
                style={{
                  backgroundColor: `rgba(${spectrum.recommendedRgb.r}, ${spectrum.recommendedRgb.g}, ${spectrum.recommendedRgb.b}, 0.15)`,
                  borderColor: ambientRgbString,
                  boxShadow: `0 0 35px rgba(${spectrum.recommendedRgb.r}, ${spectrum.recommendedRgb.g}, ${spectrum.recommendedRgb.b}, ${spectrum.beatHit ? '0.6' : '0.25'})`
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-75"
                  style={{
                    backgroundColor: ambientRgbString,
                    transform: spectrum.beatHit ? 'scale(1.25)' : 'scale(1.0)',
                    boxShadow: `0 0 20px ${ambientRgbString}`
                  }}
                >
                  <Sun className="w-5 h-5 text-slate-950" />
                </div>
                <div className="text-[11px] font-mono text-white mt-1 font-bold">
                  Brightness: {spectrum.recommendedBrightness}%
                </div>
              </div>

              {/* Palette Selector */}
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-mono mb-1.5 flex items-center gap-1">
                  <Palette className="w-3 h-3 text-cyan-400" /> Color Palette:
                </div>
                <select
                  value={config.colorPalette}
                  onChange={e => handlePaletteChange(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-pink-300 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-pink-500"
                >
                  <option value="NEON_CYBERPUNK">Cyberpunk Neon (Magenta / Cyan / Violet)</option>
                  <option value="SUNSET_DISCO">Sunset Disco (Amber / Orange / Purple)</option>
                  <option value="AURORA_BOREALIS">Aurora Borealis (Emerald / Aqua / Indigo)</option>
                  <option value="DEEP_FIRE">Deep Fire (Crimson / Flame Gold)</option>
                  <option value="ELECTRIC_VIOLET">Electric Violet (Ultraviolet / Blue)</option>
                </select>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono mt-3">
              Broadcasting 60fps color updates to HA WebSocket state engine.
            </div>
          </div>

        </div>
      </div>

      {/* Bluetooth Audio Receivers Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-cyan-400" />
            <span>CONCURRENT BLUETOOTH RECEIVERS & SINK MATRIX</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{receivers.length} Connected Devices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {receivers.map(rec => (
            <div 
              key={rec.id}
              className={`p-4 rounded-xl border transition-all ${
                rec.status === 'STREAMING' 
                  ? 'bg-purple-950/20 border-purple-800/80 shadow-lg shadow-purple-950/30' 
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${rec.status === 'STREAMING' ? 'bg-purple-900/80 text-pink-300' : 'bg-slate-900 text-slate-400'}`}>
                    {rec.deviceType === 'HEADPHONES' ? <Headphones className="w-4 h-4" /> : <Speaker className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono truncate max-w-[140px]" title={rec.name}>
                      {rec.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">{rec.location}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  rec.status === 'STREAMING' 
                    ? 'bg-pink-950 text-pink-400 border border-pink-800 animate-pulse' 
                    : 'bg-slate-900 text-slate-400'
                }`}>
                  {rec.status}
                </span>
              </div>

              {/* Hardware Metrics: Codec, Latency, Battery */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono space-y-1 mb-3">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Codec:</span>
                  <span className="text-cyan-300 font-semibold">{rec.codec}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-emerald-400">{rec.latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Battery / Signal:</span>
                  <span>{rec.batteryLevel}% • {rec.rssiDbm} dBm</span>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>Volume</span>
                  <span className="text-white font-bold">{rec.volume}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={rec.volume} 
                  onChange={() => {}} 
                  className="w-full accent-pink-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Action Button: Route Stream */}
              <button
                onClick={() => handleToggleRoute(rec)}
                className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  rec.status === 'STREAMING' 
                    ? 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/30' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {rec.status === 'STREAMING' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ACTIVE SINK (MUTE)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>ROUTE AUDIO STREAM</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Universal Cross-System Automations & Voice/Text Intent Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Cross-System Automations List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>ACTIVE CROSS-SYSTEM AUTOMATIONS</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{automations.length} Active Rules</span>
          </div>

          <div className="space-y-3">
            {automations.map(auto => (
              <div key={auto.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{auto.nameBn}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{auto.triggerConditionSummaryBn}</p>
                  </div>
                  <button
                    onClick={() => handleTriggerAutomation(auto.id)}
                    className="px-2.5 py-1 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    TEST RUN
                  </button>
                </div>

                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
                  {auto.actions.map((act, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-cyan-300">
                      <span className="text-slate-500">•</span>
                      <span>{act.descriptionBn} ({act.targetDomain})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bengali & English Voice/Text NLP Intent Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>UNIVERSAL INTENT & CROSS-COMMAND STUDIO</span>
              </h3>
              <span className="text-xs px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded font-mono">
                বাংলা + English
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3">
              যেকোনো মুক্ত ভাষায় নির্দেশ লিখুন বা বলুন (যেমন: <em>"রাউটারের স্পিড লিমিট ১০ এমবিপিএস করো"</em> বা <em>"মিউজিক রিঅ্যাক্টিভ লাইটিং চালু করো"</em> বা <em>"অচেনা ওয়াইফাই যুক্ত হলে গেটের ক্যামেরা প্যান করো"</em>)।
            </p>

            <form onSubmit={handleVoiceIntentSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="উচ্চারণ বা প্রম্পট লিখুন (বাংলা / English)..."
                  value={voiceQuery}
                  onChange={e => setVoiceQuery(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3.5 py-3 pr-10 font-mono focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={isProcessingVoice || !voiceQuery.trim()}
                  className="absolute right-2.5 top-2.5 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sample Prompt Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'রাউটারের স্পিড লিমিট ১০ এমবিপিএস করো',
                  'গেস্ট ওয়াইফাই নেটওয়ার্ক চালু করো',
                  'পার্টি মোডে সব ব্লুটুথ স্পিকার সিঙ্ক করো',
                  'মিউজিক রিঅ্যাক্টিভ লাইটিং চালু করো',
                  'যদি অচেনা ওয়াইফাই যুক্ত হয় তবে ক্যামেরা প্যান করো'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVoiceQuery(chip)}
                    className="px-2.5 py-1 bg-slate-950 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-mono transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Intent Output Result */}
          {voiceResponseBn && (
            <div className="mt-4 p-3.5 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs font-mono text-purple-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Voice Feedback:</span>
              </div>
              <p>{voiceResponseBn}</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
