import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  Radio, 
  Zap, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  Mic, 
  Send, 
  Layers, 
  Clock, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ArrowRight, 
  Maximize2, 
  Bell, 
  UserCheck, 
  Compass, 
  Crosshair, 
  Activity,
  Flame,
  VolumeX,
  Lock,
  ThermometerSnowflake,
  Sun,
  Moon
} from 'lucide-react';
import { CameraCapabilityProfile, CameraTriggerType, CameraActionType, UnrestrictedCameraAutomation, AutomationRule } from '../types';

interface UniversalCameraAutomationProps {
  onRuleCreated?: (rule: AutomationRule) => void;
  onNavigateToCanvas?: () => void;
  killSwitchActive: boolean;
}

export const UniversalCameraAutomation: React.FC<UniversalCameraAutomationProps> = ({
  onRuleCreated,
  onNavigateToCanvas,
  killSwitchActive
}) => {
  const [cameras, setCameras] = useState<CameraCapabilityProfile[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('camera.front_gate');
  const [automations, setAutomations] = useState<UnrestrictedCameraAutomation[]>([]);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Natural Language & Freeform prompt input
  const [cameraPrompt, setCameraPrompt] = useState<string>(
    'রাত ১১টার পর গেটে মানুষ আসলে ইয়ার্ড লাইট অন করো, ক্যামেরা প্রিসেট ২-তে প্যান করো, ক্যামেরা স্পিকারে ওয়ার্নিং বলো এবং রুমের এসি ফ্রিজ করো'
  );

  // Visual Form Builder State for Zero-Restriction Pipeline
  const [builderCameraId, setBuilderCameraId] = useState<string>('camera.front_gate');
  const [builderTrigger, setBuilderTrigger] = useState<CameraTriggerType>('PERSON_DETECTED');
  const [builderTimeCondition, setBuilderTimeCondition] = useState<boolean>(true);
  const [builderTimeAfter, setBuilderTimeAfter] = useState<string>('23:00:00');
  const [builderActions, setBuilderActions] = useState<{
    entity_id: string;
    service: string;
    params: Record<string, any>;
    delay_seconds: number;
    descriptionBn: string;
  }[]>([
    { entity_id: 'light.drawing_room', service: 'turn_on', params: { brightness_pct: 100 }, delay_seconds: 0, descriptionBn: 'ইয়ার্ড / ড্রয়িং রুম লাইট ১০০% অন' },
    { entity_id: 'camera.front_gate', service: 'ptz_preset', params: { preset_id: 'preset_2_yard' }, delay_seconds: 0, descriptionBn: 'ক্যামেরা PTZ প্রিসেট ২ (ইয়ার্ড পয়েন্ট)' },
    { entity_id: 'media_player.door_speaker', service: 'tts_speak', params: { message: 'সাবধান! সংরক্ষিত এলাকায় অনুপ্রবেশ শনাক্ত হয়েছে।' }, delay_seconds: 1, descriptionBn: 'ক্যামেরা স্পিকারে সতর্কবার্তা প্রচার' },
    { entity_id: 'climate.ac_master_bed', service: 'turn_off', params: {}, delay_seconds: 0, descriptionBn: 'মাস্টার রুম এসি ফ্রিজ / অফ' }
  ]);

  // PTZ Control Simulation State
  const [ptzStatus, setPtzStatus] = useState<{ pan: number; tilt: number; zoom: number; activePreset: string }>({
    pan: 0,
    tilt: 15,
    zoom: 1,
    activePreset: 'Home'
  });
  const [cameraSpeakerStatus, setCameraSpeakerStatus] = useState<string>('IDLE');

  // Pre-configured unrestricted camera recipes
  const sampleCameraRecipes = [
    {
      title: '🚨 রাতে মানুষ শনাক্ত ও সতর্কবার্তা (Night Security Alert)',
      prompt: 'রাত ১১টার পর গেটে মানুষ আসলে ইয়ার্ড লাইট অন করো, ক্যামেরা প্রিসেট ২-তে প্যান করো, ক্যামেরা স্পিকারে ওয়ার্নিং বলো এবং রুমের এসি ফ্রিজ করো',
      camera: 'camera.front_gate'
    },
    {
      title: '🚗 গাড়ি প্রবেশ ও স্বয়ংক্রিয় গেটের লাইট (Vehicle Entry Light)',
      prompt: 'ড্রাইভওয়ে ক্যামেরায় গাড়ি শনাক্ত হলে গেটের ফ্লাডলাইট অন করো, ক্যামেরা জুম ২X করো এবং লিভিং রুমে ভয়েস নোটিফিকেশন পাঠাও',
      camera: 'camera.front_gate'
    },
    {
      title: '🐕 ব্যাকইয়ার্ড পোষা প্রাণী বা মুভমেন্ট গার্ড (Backyard Patrol)',
      prompt: 'রাত ১২টার পর ব্যাকইয়ার্ড ক্যামেরায় কোনো প্রাণী বা মুভমেন্ট দেখলে সফট সাইরেন ও স্পটলাইট জ্বালিয়ে রেকর্ড শুরু করো',
      camera: 'camera.backyard'
    },
    {
      title: '🎤 উচ্চ শব্দ ও সাথে সাথে ক্যামেরার ফোকাস (Sound Triggered PTZ)',
      prompt: 'গেটের ক্যামেরার মাইক্রোফোনে উচ্চ শব্দ (শব্দ সীমা > ৬০dB) হলে সাথে সাথে ক্যামেরা শব্দের উৎসে প্যান করো এবং টেলিগ্রামে স্ন্যাপশট পাঠাও',
      camera: 'camera.front_gate'
    }
  ];

  useEffect(() => {
    fetchCameraProfiles();
    fetchCameraAutomations();
  }, []);

  const fetchCameraProfiles = async () => {
    try {
      const res = await fetch('/api/cameras/profiles');
      if (res.ok) {
        const data = await res.json();
        if (data.cameras) setCameras(data.cameras);
      }
    } catch {}
  };

  const fetchCameraAutomations = async () => {
    try {
      const res = await fetch('/api/cameras/automations');
      if (res.ok) {
        const data = await res.json();
        if (data.automations) setAutomations(data.automations);
      }
    } catch {}
  };

  const handleCompileAndDeployPrompt = async (promptToUse = cameraPrompt) => {
    if (!promptToUse.trim()) return;
    setIsCompiling(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/cameras/compile-automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          cameraId: selectedCameraId
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
        if (data.automation) {
          setAutomations(prev => [data.automation, ...prev.filter(a => a.id !== data.automation.id)]);
          if (onRuleCreated && data.rule) {
            onRuleCreated(data.rule);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleTestTrigger = async (automation: UnrestrictedCameraAutomation) => {
    setIsDeploying(true);
    try {
      const res = await fetch('/api/cameras/trigger-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automationId: automation.id })
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(data);

        // Simulate local PTZ move and Speaker Broadcast
        setPtzStatus(prev => ({ ...prev, activePreset: 'Preset 2 (Yard Focused)', pan: 45 }));
        setCameraSpeakerStatus('BROADCASTING_WARNING');
        setTimeout(() => setCameraSpeakerStatus('IDLE'), 4000);

        // Voice playback if available
        if ('speechSynthesis' in window && data.voiceFeedbackBn) {
          const u = new SpeechSynthesisUtterance(data.voiceFeedbackBn);
          u.lang = 'bn-BD';
          window.speechSynthesis.speak(u);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleToggleAutomation = async (id: string, currentEnabled: boolean) => {
    try {
      await fetch(`/api/cameras/automations/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentEnabled })
      });
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, enabled: !currentEnabled } : a));
    } catch {}
  };

  const handleDeleteAutomation = async (id: string) => {
    try {
      await fetch(`/api/cameras/automations/${id}`, { method: 'DELETE' });
      setAutomations(prev => prev.filter(a => a.id !== id));
    } catch {}
  };

  const handleAddBuilderAction = () => {
    setBuilderActions(prev => [
      ...prev,
      {
        entity_id: 'light.drawing_room',
        service: 'turn_on',
        params: {},
        delay_seconds: 0,
        descriptionBn: 'নতুন ডিভাইস সার্ভিস অ্যাকশন'
      }
    ]);
  };

  const handleRemoveBuilderAction = (idx: number) => {
    setBuilderActions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveVisualBuilder = async () => {
    setIsCompiling(true);
    try {
      const selectedCam = cameras.find(c => c.cameraId === builderCameraId);
      const newAuto: Partial<UnrestrictedCameraAutomation> = {
        name: `Visual Camera Routine: ${builderTrigger}`,
        nameBn: `ক্যামেরা অটোমেশন: ${builderTrigger}`,
        cameraId: builderCameraId,
        cameraName: selectedCam?.name || builderCameraId,
        triggerEvent: builderTrigger,
        triggerDetails: `Trigger: ${builderTrigger} on ${builderCameraId}`,
        conditions: {
          timeAfter: builderTimeCondition ? builderTimeAfter : undefined
        },
        crossDeviceActions: builderActions,
        enabled: true
      };

      const res = await fetch('/api/cameras/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAuto)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.automation) {
          setAutomations(prev => [data.automation, ...prev]);
          if (onRuleCreated && data.rule) {
            onRuleCreated(data.rule);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompiling(false);
    }
  };

  const activeCamera = cameras.find(c => c.cameraId === selectedCameraId) || cameras[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Architectural Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Camera className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/40">
                <Camera className="w-5 h-5 text-indigo-400" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight flex items-center gap-2">
                <span>স্মার্ট ক্যামেরা ও অটোমেশন ইঞ্জিন</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-mono">
                  ফুল কন্ট্রোল
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              হোম অ্যাসিস্ট্যান্টের ক্যামেরা দিয়ে মানুষ, গাড়ি, পোষা প্রাণী বা শব্দ শনাক্ত করে স্বয়ংক্রিয়ভাবে লাইট অন, সাইরেন বাজানো, ক্যামেরার স্পিকারে কথা বলা এবং পিটিজেড (ঘোরানো) নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToCanvas && (
              <button
                id="btn-nav-canvas-camera"
                onClick={onNavigateToCanvas}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>ফ্লো-চার্ট ক্যানভাসে দেখুন</span>
              </button>
            )}
            <button
              id="btn-refresh-camera-data"
              onClick={() => { fetchCameraProfiles(); fetchCameraAutomations(); }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left = Freeform NLP Compiler & Visual Builder, Right = Live Camera Feed & PTZ Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 Cols): Natural Language Freeform Compiler & Visual Rule Builder */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Freeform Multi-Entity Natural Language Prompt Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  বাংলা/ইংরেজি ফ্রি-ফর্ম ক্যামেরা অটোমেশন প্রম্পট
                </h3>
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
                Gemini Multi-Modal AI + HA Engine
              </span>
            </div>

            {/* Prompt Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">তাত্ক্ষণিক ক্যামেরা রেসিপি প্রিসেট (Click to Load):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sampleCameraRecipes.map((recipe, idx) => (
                  <button
                    key={idx}
                    id={`btn-camera-recipe-${idx}`}
                    onClick={() => {
                      setCameraPrompt(recipe.prompt);
                      setSelectedCameraId(recipe.camera);
                      handleCompileAndDeployPrompt(recipe.prompt);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 text-left border border-slate-800/90 hover:border-indigo-500/50 transition-all text-xs font-mono text-slate-200 group"
                  >
                    <div className="font-semibold text-indigo-300 group-hover:text-indigo-200 truncate">
                      {recipe.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {recipe.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-2">
              <textarea
                id="input-camera-prompt"
                value={cameraPrompt}
                onChange={e => setCameraPrompt(e.target.value)}
                rows={3}
                placeholder="যেমন: রাত ১১টার পর গেটে মানুষ আসলে ইয়ার্ড লাইট অন করো, ক্যামেরা প্রিসেট ২-তে প্যান করো, ক্যামেরা স্পিকারে ওয়ার্নিং বলো এবং রুমের এসি ফ্রিজ করো"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans transition-all"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">টার্গেট ক্যামেরা:</span>
                  <select
                    id="select-target-camera"
                    value={selectedCameraId}
                    onChange={e => setSelectedCameraId(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  >
                    {cameras.map(c => (
                      <option key={c.cameraId} value={c.cameraId}>
                        {c.nameBn || c.name} ({c.cameraId})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  id="btn-compile-camera-automation"
                  onClick={() => handleCompileAndDeployPrompt()}
                  disabled={isCompiling || killSwitchActive}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                    killSwitchActive
                      ? 'bg-red-950 text-red-400 border border-red-800/60 cursor-not-allowed'
                      : isCompiling
                      ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20'
                  }`}
                >
                  {isCompiling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>রুলস কম্পাইল ও সিন্থেসিস হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>কম্পাইল ও মাউন্ট করুন (Zero-Limit)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test / Execution Feedback */}
            {testResult && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-indigo-300 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>অটোমেশন পাইপলাইন প্রস্তুত: {testResult.automation?.nameBn || testResult.message}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50">
                    Active & Mounted
                  </span>
                </div>
                {testResult.feedbackBn && (
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {testResult.feedbackBn}
                  </p>
                )}
                {testResult.automation?.crossDeviceActions && (
                  <div className="pt-1.5 border-t border-indigo-900/60 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold">এক্সিকিউটেড অ্যাকশন সিকোয়েন্স ({testResult.automation.crossDeviceActions.length} Devices):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {testResult.automation.crossDeviceActions.map((act: any, idx: number) => (
                        <div key={idx} className="bg-slate-950/80 p-1.5 rounded border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
                          <span className="font-medium text-cyan-300">{act.entity_id}</span>
                          <span className="text-slate-400 text-[10px]">{act.service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Visual Multi-Entity Form Builder (Zero-Restriction UI) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  ভিজ্যুয়াল ক্যামেরা রুলস কনফিগারেটর (Visual Form Builder)
                </h3>
              </div>
              <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
                Dynamic Trigger/Action Matrix
              </span>
            </div>

            {/* Row 1: Camera & Trigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">ক্যামেরা ডিভাইস নির্বাচন:</label>
                <select
                  id="builder-camera-select"
                  value={builderCameraId}
                  onChange={e => setBuilderCameraId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                >
                  {cameras.map(c => (
                    <option key={c.cameraId} value={c.cameraId}>
                      {c.nameBn || c.name} ({c.cameraId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">ইনপুট ট্রিগার ইভেন্ট (Camera Trigger):</label>
                <select
                  id="builder-trigger-select"
                  value={builderTrigger}
                  onChange={e => setBuilderTrigger(e.target.value as CameraTriggerType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-purple-300 font-mono font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="PERSON_DETECTED">👤 মানুষ শনাক্তকরণ (AI Person Detection)</option>
                  <option value="VEHICLE_DETECTED">🚗 গাড়ি বা বাহন শনাক্ত (Vehicle Detection)</option>
                  <option value="PET_DETECTED">🐕 পোষা প্রাণী / প্রাণী উপস্থিতি (Pet Detection)</option>
                  <option value="FACE_RECOGNIZED">👑 পরিচিত মুখ ভেরিফাইড (Authorized Face)</option>
                  <option value="UNKNOWN_FACE">❓ অপরিচিত মুখ (Unknown Visitor)</option>
                  <option value="LINE_CROSSING">🚧 লাইন ক্রসিং অনুপ্রবেশ (Virtual Tripwire)</option>
                  <option value="TAMPER_ALERT">⚠️ ক্যামেরা টেম্পার অ্যালার্ট (Camera Blind/Move)</option>
                  <option value="SOUND_THRESHOLD_EXCEEDED">🎤 মাইক্রোফোন শব্দ থ্রেশহোল্ড (&gt;60dB Noise)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Condition Filter */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderTimeCondition}
                    onChange={e => setBuilderTimeCondition(e.target.checked)}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900"
                  />
                  <span className="text-xs text-slate-300 font-mono font-semibold">
                    সময় ফিল্টার ও নাইট মোড শর্ত (Condition Filter)
                  </span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">DND Safe</span>
              </div>

              {builderTimeCondition && (
                <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                  <span className="text-slate-400">নির্দিষ্ট সময়ের পরে (Time After):</span>
                  <input
                    type="time"
                    value={builderTimeAfter.substring(0, 5)}
                    onChange={e => setBuilderTimeAfter(`${e.target.value}:00`)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-slate-500 text-[11px]">(যেমন রাত ১১:০০ টা)</span>
                </div>
              )}
            </div>

            {/* Row 3: Action List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-400 font-semibold">
                  ক্রস-ডিভাইস অ্যাকশন চেইনিং (Cross-Device Actions):
                </label>
                <button
                  id="btn-add-action-step"
                  onClick={handleAddBuilderAction}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/40 text-[11px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>অ্যাকশন স্টেপ যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {builderActions.map((act, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-[10px] text-purple-400 font-bold w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={act.entity_id}
                        onChange={e => {
                          const val = e.target.value;
                          setBuilderActions(prev => prev.map((a, i) => i === idx ? { ...a, entity_id: val } : a));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 w-44 text-[11px] focus:outline-none focus:border-purple-500"
                        placeholder="entity_id"
                      />
                      <input
                        type="text"
                        value={act.service}
                        onChange={e => {
                          const val = e.target.value;
                          setBuilderActions(prev => prev.map((a, i) => i === idx ? { ...a, service: val } : a));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 w-32 text-[11px] focus:outline-none focus:border-purple-500"
                        placeholder="service"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={act.descriptionBn}
                        onChange={e => {
                          const val = e.target.value;
                          setBuilderActions(prev => prev.map((a, i) => i === idx ? { ...a, descriptionBn: val } : a));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 flex-1 sm:w-48 text-[11px] focus:outline-none focus:border-purple-500 font-sans"
                        placeholder="বিবরণ"
                      />
                      <button
                        onClick={() => handleRemoveBuilderAction(idx)}
                        disabled={builderActions.length <= 1}
                        className="p-1 text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                id="btn-save-builder-rule"
                onClick={handleSaveVisualBuilder}
                disabled={isCompiling || killSwitchActive}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ভিজ্যুয়াল কনফিগারেশন সেভ ও চালু করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live PTZ Camera Simulation, Speaker Intercom & Active Automation List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Simulated Camera Video Card & PTZ Control Console */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {activeCamera?.nameBn || 'লাইভ ক্যামেরা ফিড ও PTZ কনসোল'}
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-700/50 px-2 py-0.5 rounded font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE STREAM
              </span>
            </div>

            {/* Video Viewport Simulated Frame */}
            <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
              {/* Grid Overlays */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-cyan-500/30">
                <div className="border-r border-b border-cyan-500/30" />
                <div className="border-r border-b border-cyan-500/30" />
                <div className="border-b border-cyan-500/30" />
                <div className="border-r border-b border-cyan-500/30" />
                <div className="border-r border-b border-cyan-500/30" />
                <div className="border-b border-cyan-500/30" />
                <div className="border-r border-cyan-500/30" />
                <div className="border-r border-cyan-500/30" />
                <div />
              </div>

              {/* Crosshair Target Centering */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Crosshair className="w-10 h-10 text-cyan-400/40 animate-pulse" />
              </div>

              {/* PTZ Status Info Overlay */}
              <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-300 space-y-0.5">
                <div>PTZ Pan: {ptzStatus.pan}° | Tilt: {ptzStatus.tilt}° | Zoom: {ptzStatus.zoom}x</div>
                <div className="text-slate-400">Preset: <strong className="text-amber-300">{ptzStatus.activePreset}</strong></div>
              </div>

              {/* Camera Speaker Broadcast Indicator */}
              {cameraSpeakerStatus === 'BROADCASTING_WARNING' && (
                <div className="absolute bottom-3 inset-x-3 bg-red-950/90 border border-red-500/80 p-2 rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-red-200 animate-pulse shadow-lg">
                  <Volume2 className="w-4 h-4 text-red-400" />
                  <span>ক্যামেরা ২-ওয়ে স্পিকারে সতর্কবার্তা প্রচার হচ্ছে...</span>
                </div>
              )}

              {/* Center Simulation Graphic */}
              <div className="text-center space-y-1 z-10">
                <Camera className="w-8 h-8 text-indigo-400 mx-auto opacity-70" />
                <span className="text-[11px] font-mono text-slate-400 block">
                  {activeCamera?.name} ({activeCamera?.location})
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  YOLOv8 Real-time Vision Guard Active
                </span>
              </div>
            </div>

            {/* Quick PTZ Preset & Patrol Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block">কুইক PTZ প্রিসেট প্যাট্রোল (Instant Move):</span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => setPtzStatus({ pan: 0, tilt: 15, zoom: 1, activePreset: 'Home / Gate Front' })}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-center transition-colors"
                >
                  🏠 গেট মেইন (Home)
                </button>
                <button
                  onClick={() => setPtzStatus({ pan: 45, tilt: 10, zoom: 2, activePreset: 'Preset 2 (Yard Area)' })}
                  className="p-2 bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-indigo-300 text-center transition-colors"
                >
                  🌿 প্রিসেট ২ (ইয়ার্ড)
                </button>
                <button
                  onClick={() => setPtzStatus({ pan: -50, tilt: 25, zoom: 1.5, activePreset: 'Preset 3 (Driveway)' })}
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 text-center transition-colors"
                >
                  🚗 প্রিসেট ৩ (ড্রাইভওয়ে)
                </button>
              </div>
            </div>
          </div>

          {/* Active Camera Automations Registry List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  সক্রিয় ক্যামেরা অটোমেশনসমূহ ({automations.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Live Ingress Synced</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {automations.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-mono">
                  কোনো ক্যামেরা অটোমেশন নেই। উপরে প্রম্পট দিয়ে তৈরি করুন।
                </div>
              ) : (
                automations.map((auto) => (
                  <div
                    key={auto.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-slate-200 truncate flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{auto.nameBn || auto.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTestTrigger(auto)}
                          disabled={isDeploying || killSwitchActive}
                          className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/50 text-[10px] font-bold transition-colors flex items-center gap-1"
                          title="ট্রিগার টেস্ট রান করুন"
                        >
                          <Play className="w-2.5 h-2.5" />
                          <span>টেস্ট রান</span>
                        </button>
                        <button
                          onClick={() => handleToggleAutomation(auto.id, auto.enabled)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            auto.enabled 
                              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50' 
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {auto.enabled ? 'Active' : 'Paused'}
                        </button>
                        <button
                          onClick={() => handleDeleteAutomation(auto.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>ট্রিগার: <strong className="text-purple-300">{auto.triggerEvent}</strong></span>
                      <span>ক্যামেরা: <strong className="text-cyan-300">{auto.cameraId}</strong></span>
                      {auto.conditions?.timeAfter && (
                        <span>সময়: <strong className="text-amber-300">&gt; {auto.conditions.timeAfter}</strong></span>
                      )}
                    </div>

                    {/* Actions summary */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {auto.crossDeviceActions.map((act, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          {act.descriptionBn || `${act.service} -> ${act.entity_id}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
