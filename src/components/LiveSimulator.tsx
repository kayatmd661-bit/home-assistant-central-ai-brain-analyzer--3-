import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  Terminal, 
  Cpu, 
  Layers, 
  Activity, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  Camera, 
  Tv, 
  Sparkles, 
  HardDrive,
  Play,
  Volume2,
  Sliders
} from 'lucide-react';
import { HAEntityState, DynamicCoreItem, SimulationLog } from '../types';

const INITIAL_ENTITIES: HAEntityState[] = [
  {
    entity_id: 'light.drawing_room',
    state: 'off',
    friendly_name: 'ড্রয়িং রুম লাইট',
    domain: 'light',
    attributes: { brightness: 0, friendly_name: 'ড্রয়িং রুম লাইট' },
    last_changed: Date.now() - 3600000,
    total_on_time_today: 4800
  },
  {
    entity_id: 'switch.ac_master_bed',
    state: 'off',
    friendly_name: 'মাস্টার বেডরুম এসি',
    domain: 'switch',
    attributes: { current_temperature: 26, friendly_name: 'মাস্টার বেড এসি' },
    last_changed: Date.now() - 7200000,
    total_on_time_today: 7200
  },
  {
    entity_id: 'fan.living_room',
    state: 'on',
    friendly_name: 'লিভিং রুম ফ্যান',
    domain: 'fan',
    attributes: { percentage: 66, friendly_name: 'লিভিং রুম ফ্যান' },
    last_changed: Date.now() - 1800000,
    total_on_time_today: 12400
  },
  {
    entity_id: 'media_player.living_room_tv',
    state: 'playing',
    friendly_name: 'লিভিং রুম টিভি',
    domain: 'media_player',
    attributes: { media_title: 'News Channel HD', volume_level: 0.45 },
    last_changed: Date.now() - 900000,
    total_on_time_today: 5400
  },
  {
    entity_id: 'camera.backyard',
    state: 'idle',
    friendly_name: 'ব্যাকইয়ার্ড PTZ ক্যামেরা',
    domain: 'camera',
    attributes: { pan_angle: 0, tilt_angle: 15 },
    last_changed: Date.now() - 60000,
    total_on_time_today: 86400
  }
];

const PRESET_COMMANDS = [
  {
    label: '💡 ড্রয়িং রুমের লাইট জ্বালাও',
    audioName: 'voice_packet_01_light_on.wav',
    type: 'LOCAL_FAST',
    desc: 'Local Transformer Brain (Confidence > 0.85) -> Fast Action'
  },
  {
    label: '🎥 ব্যাকইয়ার্ড ক্যামেরা ডানে প্যান করো',
    audioName: 'voice_packet_02_ptz_pan.wav',
    type: 'VISION_PTZ',
    desc: 'Vision Spatial Core -> camera.ptz service execution'
  },
  {
    label: '📺 টিভির বর্তমান স্ক্রিন টেক্সট রিড করো',
    audioName: 'voice_packet_03_ocr_read.wav',
    type: 'OCR_SPATIAL',
    desc: 'OCR Core -> Tesseract Frame Text Reader'
  },
  {
    label: '❄️ এসি অন করে তাপমাত্রা ২২°C করো',
    audioName: 'voice_packet_04_climate_set.wav',
    type: 'LOCAL_FAST',
    desc: 'Home Action Core -> climate.set_temperature'
  },
  {
    label: '⚡ অজানা কমান্ড: গার্ডেন স্প্রিংকলার অটোমেট করো',
    audioName: 'voice_packet_05_unknown_task.wav',
    type: 'DYNAMIC_CORE',
    desc: 'Gemini 2.0 Teacher -> Auto Python Core Generator & Mount'
  }
];

export const LiveSimulator: React.FC = () => {
  const [entities, setEntities] = useState<HAEntityState[]>(INITIAL_ENTITIES);
  const [dynamicCores, setDynamicCores] = useState<DynamicCoreItem[]>([
    {
      core_name: 'garden_sprinkler_auto',
      task_description: 'Auto core for garden irrigation control',
      registered_at: '2026-08-16 18:24:10',
      status: 'ACTIVE',
      calls: 1
    }
  ]);
  const [logs, setLogs] = useState<SimulationLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'SUCCESS',
      bucket: 'SYSTEM',
      message: '🏛️ Central Master Brain Supervisor initialized (UDP Port 50005)'
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'INFO',
      bucket: 'Bucket_B_TelemetryIO',
      message: '🗄️ SQLite WAL Database schema verified and loaded'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<string | null>(null);

  const addLog = (level: SimulationLog['level'], bucket: SimulationLog['bucket'], message: string) => {
    setLogs(prev => [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        level,
        bucket,
        message
      },
      ...prev
    ]);
  };

  const executeCommand = async (cmd: typeof PRESET_COMMANDS[0]) => {
    setIsProcessing(true);
    addLog('INFO', 'Bucket_C_FastAction', `📡 [UDP_SOCKET] অডিও প্যাকেট গ্রহণ: '${cmd.audioName}' from 192.168.1.155:50005`);

    // Step 1: VAD + Log-Mel extraction
    setActivePipelineStep('AUDIO_VAD');
    await new Promise(r => setTimeout(r, 400));
    addLog('INFO', 'Bucket_C_FastAction', `🧮 [VOICE_CORE] Energy VAD (Voiced Frames Detected) -> 40 Log-Mel Bands Extracted`);

    // Step 2: Hash & Cache check
    setActivePipelineStep('HASH_CHECK');
    await new Promise(r => setTimeout(r, 400));

    if (cmd.type === 'LOCAL_FAST') {
      setActivePipelineStep('TRANSFORMER_INFER');
      addLog('AI', 'Bucket_C_FastAction', `🧠 [TRANSFORMER] On-Device Transformer Brain Forward Pass (Confidence: 0.94)`);
      await new Promise(r => setTimeout(r, 400));

      setActivePipelineStep('HA_SERVICE');
      if (cmd.label.includes('লাইট')) {
        setEntities(prev => prev.map(e => e.entity_id === 'light.drawing_room' ? { ...e, state: e.state === 'on' ? 'off' : 'on' } : e));
        addLog('SUCCESS', 'Bucket_C_FastAction', `🚀 [ACTION_CORE] Home Assistant Service Executed -> light.toggle (light.drawing_room)`);
      } else if (cmd.label.includes('এসি')) {
        setEntities(prev => prev.map(e => e.entity_id === 'switch.ac_master_bed' ? { ...e, state: 'on', attributes: { ...e.attributes, temperature: 22 } } : e));
        addLog('SUCCESS', 'Bucket_C_FastAction', `🚀 [ACTION_CORE] Home Assistant Service Executed -> climate.turn_on (switch.ac_master_bed at 22°C)`);
      }
    } else if (cmd.type === 'VISION_PTZ') {
      setActivePipelineStep('VISION_CORE');
      addLog('AI', 'Bucket_A_HighCompute', `🎥 [VISION_CORE] RTSP Camera stream analysis + PTZ Command -> camera.backyard pan_right (10°)`);
      setEntities(prev => prev.map(e => e.entity_id === 'camera.backyard' ? { ...e, attributes: { ...e.attributes, pan_angle: (e.attributes.pan_angle || 0) + 10 } } : e));
      await new Promise(r => setTimeout(r, 500));
      addLog('SUCCESS', 'Bucket_A_HighCompute', `✅ [VISION_CORE] PTZ কমান্ড সফলভাবে ব্যাকইয়ার্ড ক্যামেরায় ডেলিভারড হয়েছে।`);
    } else if (cmd.type === 'OCR_SPATIAL') {
      setActivePipelineStep('OCR_CORE');
      addLog('INFO', 'Bucket_A_HighCompute', `👁️ [OCR_CORE] Tesseract OCR TV Stream Capture: "Live Premier League 2-1"`);
      await new Promise(r => setTimeout(r, 500));
      addLog('SUCCESS', 'Bucket_B_TelemetryIO', `📺 [TELEMETRY] ডিসপ্লে টেক্সট আপডেট: 'Live Premier League 2-1'`);
    } else if (cmd.type === 'DYNAMIC_CORE') {
      setActivePipelineStep('GEMINI_TEACHER');
      addLog('AI', 'Bucket_A_HighCompute', `🌐 [MASTER_BRAIN] আনহ্যান্ডেলড টাস্ক -> জেমিনি ক্লাউড টিচার কল করা হচ্ছে...`);
      await new Promise(r => setTimeout(r, 600));

      setActivePipelineStep('DYNAMIC_GEN');
      const coreName = `sprinkler_ctrl_${Math.floor(Math.random() * 900 + 100)}`;
      addLog('AI', 'Bucket_A_HighCompute', `⚡ [DYNAMIC_CORE_GENERATOR] নতুন পাইথন সাব-ব্রেন তৈরি: 'dynamic_${coreName}_core.py' (AST Verified)`);
      
      setDynamicCores(prev => [
        {
          core_name: coreName,
          task_description: 'Auto irrigation dynamic valve controller',
          registered_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          status: 'ACTIVE',
          calls: 1
        },
        ...prev
      ]);
      await new Promise(r => setTimeout(r, 500));
      addLog('SUCCESS', 'Bucket_A_HighCompute', `✨ [DYNAMIC_CORE] সাব-ব্রেন কোর সফলভাবে আইসোলেটেড থ্রেডে মাউন্ট হয়েছে!`);
    }

    setActivePipelineStep(null);
    setIsProcessing(false);
  };

  const toggleEntity = (entityId: string) => {
    setEntities(prev => prev.map(e => {
      if (e.entity_id === entityId) {
        const nextState = e.state === 'on' ? 'off' : e.state === 'off' ? 'on' : 'playing';
        addLog('INFO', 'Bucket_B_TelemetryIO', `🔄 [HA_WS_EVENT] Entity ${entityId} state changed to '${nextState}'`);
        return { ...e, state: nextState };
      }
      return e;
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Simulator Hero & Preset Commands */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Full Hybrid Pipeline Live Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              লাইভ ভয়েস ও হোম অ্যাসিস্ট্যান্ট সিমুলেটর
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              মাইক্রোফোনের বিভিন্ন অডিও প্যাকেট পাঠিয়ে সেন্ট্রাল ব্রেনের রাউটিং, ট্রান্সফরমার ইনফারেন্স, ক্যামেরা পিটিজেড এবং ডাইনামিক সাব-ব্রেন জেনারেশন লাইভ টেস্ট করুন:
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 self-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>UDP Port: 50005 (Listening)</span>
          </div>
        </div>

        {/* Command Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_COMMANDS.map((cmd, idx) => (
            <button
              key={idx}
              id={`cmd-btn-${idx}`}
              onClick={() => executeCommand(cmd)}
              disabled={isProcessing}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all text-left group disabled:opacity-50 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {cmd.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {cmd.desc}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{cmd.audioName}</span>
                <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <Play className="w-3 h-3 fill-current" /> টেস্ট রান
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Home Assistant State Table + Right Live Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Home Assistant Live Device Telemetry */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                হোম অ্যাসিস্ট্যান্ট লাইভ ডিভাইস ও টেলিমেট্রি
              </h3>
              <p className="text-xs text-slate-400">
                SQLite ডাটাবেস ও WebSocket দ্বারা সিঙ্ককৃত রিয়েল-টাইম স্টেট
              </p>
            </div>
            <span className="text-[11px] font-mono bg-slate-950 text-slate-400 px-2.5 py-1 rounded border border-slate-800">
              {entities.length} এনটিটি
            </span>
          </div>

          <div className="space-y-2.5">
            {entities.map((ent) => {
              const isOn = ent.state === 'on' || ent.state === 'playing';
              return (
                <div
                  key={ent.entity_id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {ent.friendly_name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ({ent.entity_id})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                      <span>আজকের মোট রানটাইম: <strong className="text-cyan-400">{(ent.total_on_time_today! / 3600).toFixed(1)} ঘণ্টা</strong></span>
                      {ent.attributes.brightness !== undefined && (
                        <span>উজ্জ্বলতা: {ent.attributes.brightness}%</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleEntity(ent.entity_id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isOn 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {ent.state.toUpperCase()}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dynamic Sub-Brains Registry */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ডাইনামিক সাব-ব্রেন রেজিস্ট্রি (Dynamic Cores Active)
              </span>
              <span className="text-[10px] font-mono text-slate-500">{dynamicCores.length} টি কোর</span>
            </div>

            <div className="space-y-2">
              {dynamicCores.map((core, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800/90 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-cyan-300 font-bold">{core.core_name}.py</div>
                    <div className="text-[10px] text-slate-400">{core.task_description}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    MOUNTED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Execution Logs & Pipeline Animation */}
        <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-base font-bold text-white font-mono">
                  সুপারভাইজার লাইভ এক্সিকিউশন কনসোল
                </h4>
              </div>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> ক্লিয়ার লগ
              </button>
            </div>

            {/* Pipeline Stage Badges */}
            <div className="grid grid-cols-3 gap-2 my-3 font-mono text-[10px]">
              <div className={`p-2 rounded border text-center transition-all ${
                activePipelineStep === 'AUDIO_VAD' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                1. VAD & Mel Audio
              </div>
              <div className={`p-2 rounded border text-center transition-all ${
                activePipelineStep === 'TRANSFORMER_INFER' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                2. NumPy Transformer
              </div>
              <div className={`p-2 rounded border text-center transition-all ${
                activePipelineStep === 'GEMINI_TEACHER' || activePipelineStep === 'DYNAMIC_GEN' ? 'bg-purple-500/20 text-purple-300 border-purple-500' : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}>
                3. Gemini Teacher
              </div>
            </div>

            {/* Log Stream Area */}
            <div className="h-96 overflow-y-auto space-y-2 font-mono text-xs pr-2 scrollbar-thin">
              {logs.map((log) => {
                const color = 
                  log.level === 'SUCCESS' ? 'text-emerald-400' :
                  log.level === 'AI' ? 'text-cyan-300' :
                  log.level === 'WARN' ? 'text-amber-400' :
                  log.level === 'ERROR' ? 'text-rose-400' : 'text-slate-300';

                return (
                  <div key={log.id} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>[{log.timestamp}]</span>
                      <span className="text-indigo-400">{log.bucket}</span>
                    </div>
                    <div className={`${color} leading-relaxed break-words`}>
                      {log.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Thread Topology: 3 Worker Pools</span>
            <span className="text-emerald-400">Zero Blocking on Main Loop</span>
          </div>
        </div>

      </div>
    </div>
  );
};
