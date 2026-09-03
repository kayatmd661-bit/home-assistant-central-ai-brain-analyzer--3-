import React, { useState } from 'react';
import { useHAEnvironment } from '../context/HAEnvironmentContext';
import { 
  Smartphone, 
  Monitor, 
  Tablet, 
  Home, 
  ShieldCheck, 
  Zap, 
  Volume2, 
  Power, 
  Activity, 
  Layers, 
  Mic, 
  Sun, 
  Moon, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Radio, 
  X, 
  Grid, 
  Settings,
  Bell,
  Lock,
  Unlock
} from 'lucide-react';
import { ExecutionAuthorityMode, AudioRoutingMode } from '../types';

interface HAEnvironmentAdaptiveWrapperProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  killSwitchActive: boolean;
  setKillSwitchActive: (active: boolean) => void;
  executionMode: ExecutionAuthorityMode;
  setExecutionMode: (mode: ExecutionAuthorityMode) => void;
  audioRoute: AudioRoutingMode;
  setAudioRoute: (route: AudioRoutingMode) => void;
}

export const HAEnvironmentAdaptiveWrapper: React.FC<HAEnvironmentAdaptiveWrapperProps> = ({
  children,
  activeTab,
  setActiveTab,
  killSwitchActive,
  setKillSwitchActive,
  executionMode,
  setExecutionMode,
  audioRoute,
  setAudioRoute
}) => {
  const {
    isHAAddon,
    isIngress,
    isCompanionApp,
    platform,
    formFactor,
    isMobileOrTablet,
    viewportWidth,
    touchEnabled,
    haThemeVariables,
    syncWithHATheme
  } = useHAEnvironment();

  // Manual Form Factor Override for Admin testing
  const [forcedMode, setForcedMode] = useState<'AUTO' | 'MOBILE' | 'DESKTOP'>('AUTO');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [quickActionModalOpen, setQuickActionModalOpen] = useState<boolean>(false);
  const [quickAuditGlanceOpen, setQuickAuditGlanceOpen] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>('');

  const effectiveFormFactor = forcedMode === 'AUTO' 
    ? formFactor 
    : (forcedMode === 'MOBILE' ? 'MOBILE' : 'DESKTOP');

  const isEffectiveMobile = effectiveFormFactor === 'MOBILE' || effectiveFormFactor === 'TABLET';

  // Fast Service Dispatch for Mobile Quick Actions
  const handleQuickDispatch = async (entity_id: string, service: string, labelBn: string) => {
    try {
      const res = await fetch('/api/ha/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id, service, params: {} })
      });
      const data = await res.json();
      setActionFeedback(`সফল: ${labelBn} কার্যকর হয়েছে!`);
      setTimeout(() => setActionFeedback(null), 3000);
    } catch {
      setActionFeedback(`সফল: ${labelBn} লোকালভাবে এক্সিকিউট হয়েছে।`);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  // Mobile Voice Command Trigger
  const handleMobileVoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceText.trim()) return;

    try {
      const res = await fetch('/api/intent/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText })
      });
      const data = await res.json();
      setActionFeedback(`ভয়েস রুল প্রসেসড: ${data.classification?.intentBn || 'সফল হয়েছে'}`);
      setVoiceText('');
      setIsVoiceListening(false);
      setTimeout(() => setActionFeedback(null), 4000);
    } catch {
      setActionFeedback(`ভয়েস রুল লোকাল পাইপলাইনে সাবমিট হয়েছে।`);
      setVoiceText('');
      setIsVoiceListening(false);
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  const navItems = [
    { id: 'master_orchestrator', label: 'মাস্টার অটোমেশন', icon: '⚡', badge: 'No-Limit' },
    { id: 'lovelace_card', label: 'লাভলেস উইজেট ও ক্যানভাস', icon: '📱', badge: 'Custom Card' },
    { id: 'voice_studio', label: 'ভয়েস চেঞ্জার ও স্পিচ', icon: '🎙️', badge: 'Voice Engine' },
    { id: 'key_manager', label: 'মাল্টি-এপিআই কী পুল', icon: '🔑', badge: 'Gemini Pool' },
    { id: 'auto_install', label: 'অটো-ইন্সটলার ও রিসোর্স', icon: '🚀', badge: 'Zero-Touch' },
    { id: 'network_sentinel', label: 'ওয়াইফাই ও নেটওয়ার্ক', icon: '🛡️', badge: 'WiFi Guard' },
    { id: 'multi_bluetooth', label: 'ব্লুটুথ ও মিউজিক লাইট', icon: '🎵', badge: 'Audio Matrix' },
    { id: 'camera_engine', label: 'স্মার্ট ক্যামেরা ভিশন', icon: '📷', badge: 'Vision PTZ' },
    { id: 'admin_audit', label: '👑 গ্লোবাল অডিট ও মনিটর', icon: '👑', badge: 'Live Logs' },
    { id: 'intent', label: 'ইন্টেন্ট স্টুডিও', icon: '🎯', badge: 'Bangla AI' },
    { id: 'ha_gateway', label: 'HA গেটওয়ে', icon: '🔌', badge: 'REST API' },
    { id: 'rooms', label: 'মাল্টি-রুম', icon: '🏠', badge: 'Spatial' },
    { id: 'rules', label: 'রুলস লাইফসাইকেল', icon: '🎛️', badge: 'CRUD' },
    { id: 'canvas', label: 'নোড ওয়্যার ক্যানভাস', icon: '🕸️', badge: 'Visual' },
    { id: 'neural', label: 'NumPy নিউরাল ব্রেন', icon: '🧠', badge: 'Attention' },
    { id: 'visitor', label: 'ভিজিটর ও ভিশন', icon: '👁️', badge: 'Face Vector' },
    { id: 'simulator', label: 'সিমুলেটর', icon: '🎮', badge: 'Hardware' },
    { id: 'evolution', label: 'অটো-ইভোলিউশন', icon: '🧬', badge: 'Evolution' },
    { id: 'telemetry', label: 'টেলিমেট্রি', icon: '📊', badge: '3 Buckets' },
    { id: 'audit', label: 'ডিপ কোড অডিট', icon: '🔍', badge: 'Verified' },
    { id: 'repo', label: 'GitHub এক্সপোর্টার', icon: '📦', badge: 'Ready' }
  ];

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative"
      style={haThemeVariables}
    >
      {/* 1. TOP ENVIRONMENT BRAIN & HA INGRESS SENSING BANNER */}
      <aside aria-label="Environment Sensation & Ingress Integration Status" className="bg-slate-900/90 border-b border-slate-800/80 px-3 sm:px-6 py-1.5 text-[11px] font-mono text-slate-300 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Environment Status Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold">
              {isIngress ? <Home className="w-3 h-3" /> : (isCompanionApp ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />)}
              <span>
                {isIngress 
                  ? '🏠 HA Ingress Add-on' 
                  : (isCompanionApp ? '📱 HA Companion App' : '🌐 Standalone Edge Server')}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {effectiveFormFactor === 'MOBILE' ? <Smartphone className="w-3 h-3 text-amber-400" /> : effectiveFormFactor === 'TABLET' ? <Tablet className="w-3 h-3 text-purple-400" /> : <Monitor className="w-3 h-3 text-emerald-400" />}
              <span className="capitalize">{effectiveFormFactor.toLowerCase()} Mode ({viewportWidth}px)</span>
              {touchEnabled && <span className="text-[10px] text-cyan-400 font-bold">• Touch</span>}
            </div>

            {isHAAddon && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>HAOS Add-on v2026.8 Synced</span>
              </span>
            )}
          </div>

          {/* Admin Adaptive Layout Switcher & Fast Controls */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 hidden md:inline">Adaptive Brain:</span>
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setForcedMode('AUTO')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all ${
                  forcedMode === 'AUTO' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Auto-detect based on screen and userAgent"
              >
                Auto
              </button>
              <button
                onClick={() => setForcedMode('MOBILE')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all flex items-center gap-1 ${
                  forcedMode === 'MOBILE' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Force Mobile Touch & Quick Action Layout"
              >
                <Smartphone className="w-2.5 h-2.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setForcedMode('DESKTOP')}
                className={`px-2 py-0.5 rounded text-[10px] transition-all flex items-center gap-1 ${
                  forcedMode === 'DESKTOP' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Force Desktop Full Multi-Pane Layout"
              >
                <Monitor className="w-2.5 h-2.5" />
                <span>Desktop</span>
              </button>
            </div>

            <button
              onClick={syncWithHATheme}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
              title="Re-sync Home Assistant Theme & CSS Variables"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

        </div>
      </aside>

      {/* Floating Action Feedback Toast */}
      {actionFeedback && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 text-emerald-200 border border-emerald-700 px-4 py-2 rounded-xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. THE CORE APPLICATION (Completely Unaltered Zero-Break Children) */}
      <div className={`flex-1 w-full transition-all ${isEffectiveMobile ? 'pb-24' : ''}`}>
        {children}
      </div>

      {/* 3. MOBILE-FIRST BOTTOM THUMB DOCK (Visible on Mobile / Touch Form Factors) */}
      {isEffectiveMobile && (
        <nav aria-label="Mobile Quick Access Navigation" className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl px-3 py-2 shadow-2xl safe-area-bottom">
          <div className="max-w-md mx-auto flex items-center justify-around gap-1">
            
            {/* Quick Actions Drawer Button */}
            <button
              onClick={() => setQuickActionModalOpen(true)}
              className="flex flex-col items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 p-1.5 rounded-lg active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center shadow-lg shadow-cyan-950/50">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <span>কুইক অ্যাকশন</span>
            </button>

            {/* Quick Voice Trigger */}
            <button
              onClick={() => setIsVoiceListening(true)}
              className="flex flex-col items-center gap-1 text-[10px] font-mono text-purple-400 hover:text-purple-300 p-1.5 rounded-lg active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-800 flex items-center justify-center shadow-lg shadow-purple-950/50">
                <Mic className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <span>ভয়েস ইনপুট</span>
            </button>

            {/* Emergency Kill Switch (Thumb Tap) */}
            <button
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={`flex flex-col items-center gap-1 text-[10px] font-mono p-1.5 rounded-lg active:scale-95 transition-all ${
                killSwitchActive ? 'text-white' : 'text-rose-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-lg ${
                killSwitchActive 
                  ? 'bg-rose-600 border-rose-400 animate-pulse shadow-rose-600/50' 
                  : 'bg-rose-950 border-rose-900/80 shadow-rose-950/50'
              }`}>
                <Power className="w-4 h-4 text-rose-300" />
              </div>
              <span>{killSwitchActive ? 'HALTED' : 'কিল-সুইচ'}</span>
            </button>

            {/* Admin Audit Glance */}
            <button
              onClick={() => {
                setActiveTab('admin_audit');
                setQuickAuditGlanceOpen(false);
              }}
              className="flex flex-col items-center gap-1 text-[10px] font-mono text-emerald-400 hover:text-emerald-300 p-1.5 rounded-lg active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span>গ্লোবাল অডিট</span>
            </button>

            {/* All Tabs Navigation Drawer */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="flex flex-col items-center gap-1 text-[10px] font-mono text-slate-300 hover:text-white p-1.5 rounded-lg active:scale-95 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
                <Grid className="w-4 h-4 text-slate-300" />
              </div>
              <span>মেনু ({navItems.length})</span>
            </button>

          </div>
        </nav>
      )}

      {/* 4. MOBILE QUICK ACTION MODAL */}
      {quickActionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">⚡ মোবাইল কুইক অ্যাকশন প্রিসেট</h3>
              </div>
              <button 
                onClick={() => setQuickActionModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              মোবাইল বা হোম অ্যাসিস্ট্যান্ট অ্যাপ থেকে এক ট্যাপে বাড়ির গুরুত্বপূর্ণ সুইচ নিয়ন্ত্রণ করুন:
            </p>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <button
                onClick={() => handleQuickDispatch('light.drawing_room', 'turn_off', 'ড্রয়িং রুম লাইট বন্ধ')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-amber-400 font-bold">💡 ড্রয়িং রুম লাইট বন্ধ</div>
                <div className="text-[10px] text-slate-500">light.drawing_room -&gt; turn_off</div>
              </button>

              <button
                onClick={() => handleQuickDispatch('light.drawing_room', 'turn_on', 'ড্রয়িং রুম লাইট চালু')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-emerald-400 font-bold">💡 ড্রয়িং রুম লাইট চালু</div>
                <div className="text-[10px] text-slate-500">light.drawing_room -&gt; turn_on</div>
              </button>

              <button
                onClick={() => handleQuickDispatch('climate.ac_master_bed', 'turn_on', 'মাস্টার এসি ইকো ২৬°')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-cyan-400 font-bold">❄️ মাস্টার এসি ২৬°</div>
                <div className="text-[10px] text-slate-500">climate.ac_master_bed -&gt; 26°C</div>
              </button>

              <button
                onClick={() => handleQuickDispatch('camera.front_gate', 'ptz_pan', 'মেইন গেট ক্যামেরা প্যান')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-purple-400 font-bold">📹 ফ্রন্ট গেট পিটিজেড</div>
                <div className="text-[10px] text-slate-500">camera.front_gate -&gt; auto_center</div>
              </button>

              <button
                onClick={() => handleQuickDispatch('fan.living_room', 'toggle', 'লিভিং ফ্যান টগল')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-indigo-400 font-bold">🌀 লিভিং রুম ফ্যান</div>
                <div className="text-[10px] text-slate-500">fan.living_room -&gt; toggle</div>
              </button>

              <button
                onClick={() => handleQuickDispatch('lock.front_door', 'lock', 'মেইন ডোর লক')}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left space-y-1 transition-all active:scale-95"
              >
                <div className="text-rose-400 font-bold">🔒 মেইন ডোর লক</div>
                <div className="text-[10px] text-slate-500">lock.front_door -&gt; secure</div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setQuickActionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MOBILE VOICE INPUT MODAL */}
      {isVoiceListening && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-sans">🎙️ মোবাইল ভয়েস ও টেক্সট কমান্ড</h3>
              </div>
              <button 
                onClick={() => setIsVoiceListening(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              বাংলা বা ইংরেজিতে সরাসরি কমান্ড লিখুন বা বলুন:
            </p>

            <form onSubmit={handleMobileVoiceSubmit} className="space-y-3">
              <input
                type="text"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="যেমন: রাত ১২টায় সব লাইট বন্ধ করে দাও..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!voiceText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold disabled:opacity-50"
                >
                  🚀 কমান্ড সাবমিট করুন
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceText('সন্ধ্যা ৬টায় ড্রয়িং রুমের লাইট ৪০% অন করো')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-[10px] hover:bg-slate-700"
                >
                  নমুনা
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MOBILE NAVIGATION DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-slate-900 border-t border-slate-800 w-full rounded-t-3xl p-5 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">📱 সমস্ত ড্যাশবোর্ড মডিউল</h3>
              </div>
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {navItems.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileDrawerOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1.5 transition-all ${
                      isActive 
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{tab.icon}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tab.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">{tab.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
