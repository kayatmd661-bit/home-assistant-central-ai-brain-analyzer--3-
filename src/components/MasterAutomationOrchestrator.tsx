import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Copy, 
  Download, 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Layers, 
  Clock, 
  Sliders, 
  CornerDownRight, 
  Repeat, 
  Zap, 
  RefreshCw, 
  ArrowRight,
  ChevronRight,
  Database,
  Radio,
  FileCode2,
  ListTree
} from 'lucide-react';
import { RoomProfile, MasterAutomationPayload, AutomationRule } from '../types';

interface MasterAutomationOrchestratorProps {
  onRuleCreated?: (rule: AutomationRule) => void;
  onNavigateToCanvas?: () => void;
}

export const MasterAutomationOrchestrator: React.FC<MasterAutomationOrchestratorProps> = ({ 
  onRuleCreated,
  onNavigateToCanvas
}) => {
  const [rooms, setRooms] = useState<RoomProfile[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-master-bed');
  const [promptText, setPromptText] = useState<string>(
    'রাত ১১টার পর এই ঘরের লাইট অন করলে সাউন্ড না করে শুধু লাইট অন হবে এবং ৫ মিনিট পর মোশন না থাকলে অটো অফ হবে'
  );
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [compiledPayload, setCompiledPayload] = useState<MasterAutomationPayload | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'yaml' | 'json' | 'pipeline'>('pipeline');
  const [copied, setCopied] = useState<boolean>(false);
  const [deployFeedback, setDeployFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Sample prompt presets
  const samplePresets = [
    {
      title: '🌙 নাইট ডিএনডি ও অটো-অফ (Night Mode)',
      text: 'রাত ১১টার পর এই ঘরের লাইট অন করলে সাউন্ড না করে শুধু লাইট অন হবে এবং ৫ মিনিট পর মোশন না থাকলে অটো অফ হবে',
      room: 'room-master-bed'
    },
    {
      title: '👑 অ্যাডমিন গ্লোবাল ওভাররাইড (Global Admin)',
      text: 'মাস্টার রুম থেকে সম্পূর্ণ বাড়ির সব লাইট ও এসি এক ক্লিকে বন্ধ করে গেট সিকিউর করো',
      room: 'room-master-bed'
    },
    {
      title: '🚫 আউটার জোন ক্রস-রুম চেষ্টা (RBAC Violation Test)',
      text: 'লিভিং রুমের সুইচ চাপলে মাস্টার বেডরুমের এসি ও ক্যামেরা বন্ধ করো',
      room: 'room-living'
    },
    {
      title: '🌡️ মাল্টি-কন্ডিশন থার্মাল ও ফ্যান লুপ (Loop & Math)',
      text: 'যদি ঘরের তাপমাত্রা ২৮ ডিগ্রির বেশি হয় তবে ফ্যান ১০০% স্পিডে চালু হবে এবং তাপমাত্রা ২৫ ডিগ্রিতে না আসা পর্যন্ত প্রতি ১০ মিনিট পর পর চেক করবে',
      room: 'room-master-bed'
    }
  ];

  useEffect(() => {
    fetchRooms();
    // Auto-compile initial preset
    handleCompilePrompt(promptText, selectedRoomId);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        if (data.rooms && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        }
      }
    } catch {}
  };

  const handleCompilePrompt = async (textToCompile = promptText, roomId = selectedRoomId) => {
    if (!textToCompile.trim()) return;
    setIsCompiling(true);
    setDeployFeedback(null);

    try {
      const res = await fetch('/api/orchestrator/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_room_id: roomId,
          user_prompt: textToCompile,
          input_source: 'NATURAL_LANGUAGE_BOX'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.payload) {
          setCompiledPayload(data.payload);
        }
      }
    } catch (e: any) {
      console.error('Compilation failed:', e);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDeployToEngine = async () => {
    if (!compiledPayload) return;
    setIsDeploying(true);
    setDeployFeedback(null);

    try {
      const res = await fetch('/api/orchestrator/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: compiledPayload })
      });

      const data = await res.json();
      if (data.success) {
        setDeployFeedback({
          message: `✅ ${data.message} (${data.liveHaDeployStatus})`,
          type: 'success'
        });
        if (onRuleCreated && data.rule) {
          onRuleCreated(data.rule);
        }
      } else {
        setDeployFeedback({
          message: `❌ ${data.error || 'ডিপ্লয়মেন্ট ব্যর্থ হয়েছে'}`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setDeployFeedback({
        message: `❌ এরর: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadYaml = () => {
    if (!compiledPayload?.generated_yaml) return;
    const blob = new Blob([compiledPayload.generated_yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ha_automation_${Date.now()}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('আপনার ব্রাউজার Web Speech API সাপোর্ট করে না। দয়া করে টেক্সট বক্সে টাইপ করুন।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'bn-BD';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
        handleCompilePrompt(transcript, selectedRoomId);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];
  const isMasterAdmin = selectedRoom?.isAdminRoom || selectedRoomId === 'room-master-bed';

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Orchestrator Capabilities */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 shadow-inner">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
                  Master Rule-Engine & Automation Orchestrator
                </h2>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                  Zero Functional Limitations
                </span>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  HA-Native Hybrid Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">
                বাংলা বা ইংরেজিতে সহজ ভাষায় যেকোনো নিয়ম লিখে দিন। সিস্টেম স্বয়ংক্রিয়ভাবে হোম অ্যাসিস্ট্যান্টের লাইট, ফ্যান, এসি, ক্যামেরা ও স্পিকারের জন্য নিয়ম তৈরি করে দেবে।
              </p>
            </div>
          </div>

          {/* Canvas Bridge button */}
          {onNavigateToCanvas && (
            <button
              id="switch-to-visual-canvas-btn"
              onClick={onNavigateToCanvas}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-2 transition-all self-start md:self-auto shrink-0 shadow-md"
            >
              <ListTree className="w-4 h-4" />
              <span>ফ্লো-চার্ট ক্যানভাসে দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-Interface Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Natural Language Input & Source Zone Control (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Room / Zone Identity Selector Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>যে রুম থেকে কমান্ড দেওয়া হচ্ছে (রুম নির্বাচন):</span>
              </label>

              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isMasterAdmin 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isMasterAdmin ? '👑 মাস্টার অ্যাডমিন রুম' : '🛡️ সাধারণ রুম (লোকাল)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {rooms.map(room => {
                const isAdmin = room.isAdminRoom || room.id === 'room-master-bed';
                const isSelected = selectedRoomId === room.id;

                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      handleCompilePrompt(promptText, room.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                        {room.nameBn || room.name}
                      </span>
                      {isAdmin ? (
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">ADMIN</span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500">LOCAL</span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      {room.associatedEntities.length}টি ডিভাইস যুক্ত
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Scope info footer */}
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isMasterAdmin ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                {isMasterAdmin ? (
                  <span>
                    <strong className="text-emerald-300">মাস্টার অনুমতি:</strong> এই রুম থেকে পুরো বাড়ির যেকোনো ডিভাইসের জন্য একযোগে অটোমেশন তৈরি করা যাবে।
                  </span>
                ) : (
                  <span>
                    <strong className="text-amber-300">লোকাল রুম অনুমতি:</strong> এই রুম থেকে শুধুমাত্র এই রুমের ডিভাইসের নিয়ম সেট করা যাবে।
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Natural Language Prompt Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>আপনার অটোমেশন নির্দেশ লিখুন বা বলুন:</span>
              </label>

              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-[11px] font-mono ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="ভয়েসে বলুন"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{isListening ? 'শুনছি...' : 'ভয়েস ইনপুট'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                id="master-orchestrator-prompt-input"
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="সহজ বাংলায় লিখুন (যেমন: রাত ১১টার পর ড্রয়িং রুমের লাইট অন করলে সাউন্ড অফ থাকবে এবং ৫ মিনিট মোশন না থাকলে লাইট অফ হবে)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-500 font-mono">
                {promptText.length} অক্ষর
              </span>

              <button
                id="compile-orchestrator-btn"
                onClick={() => handleCompilePrompt(promptText, selectedRoomId)}
                disabled={isCompiling || !promptText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isCompiling ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>{isCompiling ? 'তৈরি হচ্ছে...' : 'অটোমেশন তৈরি ও যাচাই করুন'}</span>
              </button>
            </div>
          </div>

          {/* Presets Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              তৈরি করা কিছু জনপ্রিয় নিয়ম (ক্লিক করে টেস্ট করুন):
            </h4>
            <div className="space-y-1.5">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPromptText(preset.text);
                    setSelectedRoomId(preset.room);
                    handleCompilePrompt(preset.text, preset.room);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                    "{preset.text}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Output Schema, Security Status & HA Production Code (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {compiledPayload ? (
            <>
              {/* Security Authorization & Night DND Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Authorization Status Card */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  compiledPayload.authorization.status === 'ALLOWED'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {compiledPayload.authorization.status === 'ALLOWED' ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                      )}
                      <span className="text-xs font-bold font-mono uppercase tracking-wider">
                        {compiledPayload.authorization.status === 'ALLOWED' ? '✅ অনুমোদিত (Allowed)' : '❌ সীমাবদ্ধ (Blocked)'}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      compiledPayload.authorization.target_scope === 'GLOBAL_ADMIN'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : compiledPayload.authorization.target_scope === 'LOCAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}>
                      {compiledPayload.authorization.target_scope === 'GLOBAL_ADMIN' ? 'সকল রুম' : 'শুধু নিজস্ব রুম'}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono leading-relaxed mt-1 text-slate-300">
                    {compiledPayload.authorization.status === 'ALLOWED' ? (
                      compiledPayload.authorization.is_admin_override
                        ? `মাস্টার অনুমতি থাকায় যেকোনো রুমের ডিভাইস কন্ট্রোল করার অনুমোদন দেওয়া হয়েছে।`
                        : `নিজস্ব রুমের ডিভাইসগুলোর জন্য নিয়মটি সফলভাবে অনুমোদিত হয়েছে।`
                    ) : (
                      compiledPayload.authorization.reason_if_denied
                    )}
                  </p>
                </div>

                {/* Night DND Policy Status Card */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  compiledPayload.night_dnd_policy.applied
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {compiledPayload.night_dnd_policy.applied ? (
                        <Moon className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-amber-400" />
                      )}
                      <span className="text-xs font-bold font-mono uppercase tracking-wider">
                        {compiledPayload.night_dnd_policy.applied ? '🌙 রাতের সাইলেন্ট মোড (Night Mode)' : '☀️ দিনের সাধারণ মোড (Day Mode)'}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {compiledPayload.night_dnd_policy.applied ? 'শান্ত ভলিউম' : 'স্বাভাবিক ভলিউম'}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono leading-relaxed mt-1 text-slate-400">
                    {compiledPayload.night_dnd_policy.applied
                      ? `রাত ১০টা থেকে সকাল ৭টা পর্যন্ত স্পিকারের আওয়াজ কমিয়ে ১৫% এর নিচে রাখা হবে যাতে ঘুমের ব্যাঘাত না ঘটে।`
                      : `দিনের বেলা স্পিকারের আওয়াজ ও সাউন্ড স্বাভাবিক থাকবে।`}
                  </p>
                </div>
              </div>

              {/* Natural User Feedback Confirmation Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs font-mono leading-relaxed">
                  <span className="font-bold text-cyan-300">স্মার্ট এআই সারাংশ: </span>
                  {compiledPayload.user_feedback}
                </div>
              </div>

              {/* Multi-Stage Inspector & Code Tabs Container */}
              <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Code Tabs Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveCodeTab('pipeline')}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                        activeCodeTab === 'pipeline'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>কাজের ধাপসমূহ</span>
                    </button>

                    <button
                      onClick={() => setActiveCodeTab('yaml')}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                        activeCodeTab === 'yaml'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Home Assistant কোড (YAML)</span>
                    </button>

                    <button
                      onClick={() => setActiveCodeTab('json')}
                      className={`px-3 py-1 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                        activeCodeTab === 'json'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>JSON ডাটা</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(
                        activeCodeTab === 'yaml' 
                          ? compiledPayload.generated_yaml 
                          : JSON.stringify(compiledPayload, null, 2)
                      )}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700 cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                    </button>

                    <button
                      onClick={handleDownloadYaml}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700 cursor-pointer"
                      title="YAML ফাইল ডাউনলোড করুন"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tab Content Display */}
                <div className="p-4">
                  {activeCodeTab === 'pipeline' && (
                    <div className="space-y-4">
                      {/* Complexity Stats Pill Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] font-mono text-slate-500 uppercase">শুরুর শর্ত (Triggers)</div>
                          <div className="text-sm font-bold font-mono text-cyan-400">
                            {compiledPayload.complexity_metrics.trigger_count}টি
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] font-mono text-slate-500 uppercase">যাচাইয়ের শর্ত (Conditions)</div>
                          <div className="text-sm font-bold font-mono text-purple-400">
                            {compiledPayload.complexity_metrics.condition_count}টি
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] font-mono text-slate-500 uppercase">কাজের ধাপ (Actions)</div>
                          <div className="text-sm font-bold font-mono text-emerald-400">
                            {compiledPayload.complexity_metrics.action_count}টি
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] font-mono text-slate-500 uppercase">টাইমার ডিলে</div>
                          <div className="text-xs font-bold font-mono text-amber-400">
                            {compiledPayload.complexity_metrics.has_delay ? '৫ মিনিট অপেক্ষা' : 'সাথে সাথে'}
                          </div>
                        </div>
                      </div>

                      {/* Triggers Breakdown */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>কখন কাজ শুরু হবে (ট্রিগার):</span>
                        </div>
                        <div className="space-y-1.5">
                          {compiledPayload.automation_config.trigger.map((trig, idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-center justify-between">
                              <span className="text-cyan-400 font-bold">{trig.platform || 'time'}</span>
                              <span className="text-slate-400">{JSON.stringify(trig)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conditions Breakdown */}
                      {compiledPayload.automation_config.condition.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-bold font-mono text-purple-300 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>যাচাই করার শর্তাবলী:</span>
                          </div>
                          <div className="space-y-1.5">
                            {compiledPayload.automation_config.condition.map((cond, idx) => (
                              <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-center justify-between">
                                <span className="text-purple-400 font-bold">{cond.condition || 'time'}</span>
                                <span className="text-slate-400">{JSON.stringify(cond)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions Breakdown */}
                      <div className="space-y-2">
                        <div className="text-xs font-bold font-mono text-emerald-300 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5" />
                          <span>কী কী অ্যাকশন বা কাজ হবে:</span>
                        </div>
                        <div className="space-y-1.5">
                          {compiledPayload.automation_config.action.map((act, idx) => (
                            <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300 flex items-center justify-between">
                              <span className="text-emerald-400 font-bold">
                                {act.service || (act.delay ? 'delay' : 'custom_action')}
                              </span>
                              <span className="text-slate-400 truncate max-w-[280px]">
                                {act.target?.entity_id || JSON.stringify(act.data || act.delay || {})}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeCodeTab === 'yaml' && (
                    <pre className="text-xs font-mono text-cyan-200 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-96 border border-slate-800 scrollbar-thin">
                      {compiledPayload.generated_yaml}
                    </pre>
                  )}

                  {activeCodeTab === 'json' && (
                    <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-96 border border-slate-800 scrollbar-thin">
                      {JSON.stringify(compiledPayload, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Deploy & Execution Action Footer */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>হোম অ্যাসিস্ট্যান্ট ও মেমরিতে সেভ করার জন্য প্রস্তুত</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="deploy-master-automation-btn"
                      onClick={handleDeployToEngine}
                      disabled={isDeploying || compiledPayload.authorization.status === 'DENIED'}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isDeploying ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>
                        {compiledPayload.authorization.status === 'DENIED' 
                          ? 'অনুমতি নেই (Deploy Disabled)' 
                          : 'অটোমেশনটি হোম অ্যাসিস্ট্যান্টে সেভ ও চালু করুন'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Deploy feedback banner */}
              {deployFeedback && (
                <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  deployFeedback.type === 'success'
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                }`}>
                  <span>{deployFeedback.message}</span>
                  <button onClick={() => setDeployFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Cpu className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
              <div className="text-sm font-mono text-slate-400 font-bold">
                এখনো কোনো অটোমেশন তৈরি করা হয়নি
              </div>
              <p className="text-xs font-mono text-slate-500 max-w-sm mx-auto">
                বাম পাশের বক্সে আপনার নিয়ম লিখে বা মুখে বলে "অটোমেশন তৈরি ও যাচাই করুন" বাটনে ক্লিক করুন।
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
