import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  Volume2, 
  Radio, 
  Activity, 
  Zap, 
  Power, 
  GitBranch, 
  Terminal, 
  Network, 
  Eye, 
  Sparkles,
  Sliders,
  Settings,
  Database,
  HardDrive,
  HelpCircle,
  Menu,
  X,
  Layers,
  ChevronRight,
  Search,
  CheckCircle2,
  Lock,
  Music,
  Camera,
  Server,
  RefreshCw,
  Home
} from 'lucide-react';
import { ExecutionAuthorityMode, AudioRoutingMode } from '../types';
import { useExplainMode } from '../context/ExplainModeContext';

interface MasterControlHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  executionMode: ExecutionAuthorityMode;
  setExecutionMode: (mode: ExecutionAuthorityMode) => void;
  audioRoute: AudioRoutingMode;
  setAudioRoute: (route: AudioRoutingMode) => void;
  killSwitchActive: boolean;
  setKillSwitchActive: (active: boolean) => void;
  rulesCount: number;
}

export const MasterControlHeader: React.FC<MasterControlHeaderProps> = ({
  activeTab,
  setActiveTab,
  executionMode,
  setExecutionMode,
  audioRoute,
  setAudioRoute,
  killSwitchActive,
  setKillSwitchActive,
  rulesCount
}) => {
  const { isExplainModeActive, toggleExplainMode } = useExplainMode();
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState<boolean>(false);
  const [matrixSearchQuery, setMatrixSearchQuery] = useState<string>('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');

  // Exact 21 Uncompromised Dashboards grouped into 7 Functional Clusters
  const dashboardClusters = [
    {
      clusterId: 'automation_rules',
      clusterNumber: '1-3',
      clusterTitle: 'Automation & Rules Engine',
      clusterTitleBn: 'অটোমেশন ও মাস্টার রুলস',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/40',
      bgColor: 'bg-amber-950/30',
      dashboards: [
        { id: 'master_orchestrator', tabNumber: 1, label: '⚡ মাস্টার অটোমেশন অর্কেস্ট্রেটর', badge: 'Rule Engine', desc: 'Bengali/English to YAML/JSON compiler, RBAC Security (Admin, User, Guest), and execution orchestrator.' },
        { id: 'rules', tabNumber: 2, label: '🎛️ রুলস লাইফসাইকেল ম্যানেজার', badge: `${rulesCount} Rules CRUD`, desc: 'Active hardware rule state management, live triggers, priority overrides & conflict resolution.' },
        { id: 'canvas', tabNumber: 3, label: '🕸️ ভিজ্যুয়াল নোড ওয়্যার ক্যানভাস', badge: 'Flow Graph', desc: 'Drag-and-wire interactive automation builder with live YAML export and topology graph.' }
      ]
    },
    {
      clusterId: 'ha_entities',
      clusterNumber: '4-6',
      clusterTitle: 'HA Integration & Entity State',
      clusterTitleBn: 'হোম অ্যাসিস্ট্যান্ট ও হার্ডওয়্যার প্রোফাইল',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-950/30',
      dashboards: [
        { id: 'ha_gateway', tabNumber: 4, label: '🔌 HA লাইভ ব্রিজ ও ডিভাইস গেটওয়ে', badge: '5L/4F/1M/1S/1TV', desc: 'Direct WebSocket/REST gateway (5 lights, 4 fans, 1 motor, 1 soundbox, 1 TV) with dual-confirmation actuators.' },
        { id: 'rooms', tabNumber: 5, label: '🏠 ইউনিফাইড মাল্টি-রুম ও স্পেশাল অডিও', badge: 'Spatial Routing', desc: 'Multi-room spatial hub, room acoustic boundaries, RBAC permissions, and hardware assignments.' },
        { id: 'simulator', tabNumber: 6, label: '🎮 লাইভ ডিভাইস সিমুলেটর ও ওভাররাইড', badge: 'State Override', desc: 'Real-time sensor telemetry injection, virtual actuator testing, and emergency state override.' }
      ]
    },
    {
      clusterId: 'voice_audio',
      clusterNumber: '7-9',
      clusterTitle: 'Voice & Audio Studio',
      clusterTitleBn: 'ভয়েস ও অডিও স্টুডিও',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/40',
      bgColor: 'bg-indigo-950/30',
      dashboards: [
        { id: 'voice_studio', tabNumber: 7, label: '🎙️ ৩-টায়ার ভয়েস চেঞ্জার ও স্পিচ স্টুডিও', badge: '3-Tier Speech', desc: 'Gemini Live voice persona, cached instant audio, natural formant TTS & wake-word tuning.' },
        { id: 'intent', tabNumber: 8, label: '🎯 ইউনিভার্সাল ইন্টেন্ট ও বাংলা সহকারী', badge: 'Open-Ended AI', desc: 'Real-time open-ended Bengali & English natural language intent extraction and entity mapping.' },
        { id: 'multi_bluetooth', tabNumber: 9, label: '🎵 ব্লুটুথ মিউজিক ও রিঅ্যাক্টিভ লাইটিং', badge: '16-Band FFT', desc: 'Real-time 16-band FFT equalizer, dynamic RGB music sync, and low-latency Bluetooth sink.' }
      ]
    },
    {
      clusterId: 'vision_security',
      clusterNumber: '10-12',
      clusterTitle: 'Vision & Security Matrix',
      clusterTitleBn: 'ভিশন এআই ও ক্যামেরা সিকিউরিটি',
      color: 'text-rose-400',
      borderColor: 'border-rose-500/40',
      bgColor: 'bg-rose-950/30',
      dashboards: [
        { id: 'camera_engine', tabNumber: 10, label: '📷 YOLOv8 স্মার্ট ক্যামেরা ও PTZ ট্র্যাক', badge: 'YOLOv8 & PTZ', desc: 'Autonomous PTZ coordinate tracking, optical motion boundary filters, and multi-camera streams.' },
        { id: 'visitor', tabNumber: 11, label: '👁️ ফেসনেট ফেসিয়াল রিকগনিশন ও ভিজিটর লগ', badge: 'FaceNet Logs', desc: 'Real-time face recognition visitor logs, automated welcome dialogue, and dual-latch gate triggers.' },
        { id: 'admin_audit', tabNumber: 12, label: '👑 অ্যাডমিন গ্লোবাল মাল্টি-রুম অডিট', badge: 'Live Auditor', desc: 'Global multi-room conflict resolver, priority override locks, and cross-room automation pulses.' }
      ]
    },
    {
      clusterId: 'models_fallback',
      clusterNumber: '13-15',
      clusterTitle: 'Autonomous Models & Fallbacks',
      clusterTitleBn: 'ডুয়াল-কোর এআই ও ফলব্যাক ব্রেন',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      bgColor: 'bg-purple-950/30',
      dashboards: [
        { id: 'key_manager', tabNumber: 13, label: '🔑 মাল্টি-কী জেমিনাই ফেইলওভার পুল', badge: 'Gemini 3.7/3.1', desc: 'Dual-core task manager (Gemini 3.7 Flash & 3.1 Flash-Lite) with automatic API health rotation.' },
        { id: 'neural', tabNumber: 14, label: '🧠 পিউর নামপাই ট্রান্সফরমার অফলাইন ব্রেন', badge: '100% Offline', desc: '100% offline naked NumPy 4-head self-attention network with manual inference override.' },
        { id: 'evolution', tabNumber: 15, label: '🧬 অটো-ইভোলিউশন ডেমন ও মডেল সিঙ্ক', badge: 'Auto-Evolve', desc: 'Autonomous self-evolving neural weights synchronization, cloud-to-edge distillation daemon.' }
      ]
    },
    {
      clusterId: 'telemetry_storage',
      clusterNumber: '16-18',
      clusterTitle: 'System Telemetry & Storage',
      clusterTitleBn: 'টেলিমেট্রি ও কম্প্রেশন হাব',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-950/30',
      dashboards: [
        { id: 'storage_compression', tabNumber: 16, label: '💾 মাল্টি-ড্রাইভ NVMe ও Zstd কম্প্রেশন', badge: 'Zstandard & NVMe', desc: 'Multi-drive storage controller, real-time Zstandard compression, and zero-loss failover.' },
        { id: 'telemetry', tabNumber: 17, label: '📊 ৩-বাকেট থ্রেড ও রিসোর্স টেলিমেট্রি', badge: 'CPU/RAM/DB', desc: 'Real-time CPU, RAM, and SQLite thread pool load monitor with hardware telemetry.' },
        { id: 'audit', tabNumber: 18, label: '🔍 কোড অডিট ও SQLite WAL মনিটর', badge: 'WAL & Audit', desc: 'Live AST sandbox verification, SQLite WAL fragmentation tracker, and integrity audit logs.' }
      ]
    },
    {
      clusterId: 'advanced_studios',
      clusterNumber: '19-21',
      clusterTitle: 'Advanced Studios & Networking',
      clusterTitleBn: 'লাভলেস ও ওপেনডব্লিউআরটি গার্ড',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-950/30',
      dashboards: [
        { id: 'lovelace_card', tabNumber: 19, label: '📱 লাভলেস কার্ড শোকেস ও ওয়েব কম্পোনেন্ট', badge: 'Custom Card', desc: 'Auto-deploy Lovelace floating assistant card with live interactive audio visualizer preview.' },
        { id: 'auto_install', tabNumber: 20, label: '🚀 জিরো-টাচ লাভলেস অটো-ইন্সটলার', badge: '1-Click Push', desc: 'One-click automated deployment of edge-ai-voice-card.js directly to Home Assistant Lovelace.' },
        { id: 'network_sentinel', tabNumber: 21, label: '🛡️ OpenWrt/LuCI ওয়াইফাই নেটওয়ার্ক গার্ড', badge: 'OpenWrt Guard', desc: 'Zero-trust WiFi guard, IoT client bandwidth throttling, and rogue MAC address firewall.' },
        { id: 'repo', tabNumber: 22, label: '📦 গিটহাব রেপো ও ফার্মওয়্যার এক্সপোর্টার', badge: 'HAOS Firmware', desc: 'Complete Home Assistant add-on bundle exporter with GitHub continuous delivery sync.' }
      ]
    }
  ];

  // Flattened all dashboards list
  const allDashboards = dashboardClusters.flatMap(c => c.dashboards.map(d => ({ ...d, clusterTitle: c.clusterTitle, clusterId: c.clusterId })));

  // Filtered dashboards for Matrix Modal search
  const filteredDashboards = allDashboards.filter(d => {
    const matchesSearch = d.label.toLowerCase().includes(matrixSearchQuery.toLowerCase()) || 
                          d.badge.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
                          d.desc.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
                          d.id.toLowerCase().includes(matrixSearchQuery.toLowerCase());
    const matchesCluster = selectedClusterFilter === 'all' || d.clusterId === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <header className="bg-slate-950/95 border-b border-slate-800 sticky top-0 z-50 text-white backdrop-blur-xl shadow-2xl">
      {/* Top Status & Authority Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Brand & Ingress Title + Return to Main Page */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('voice_landing')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-all group"
              title="ক্লিক করে মূল হোম পেজে (বাংলা ভয়েস ব্রেন) ফিরে যান"
            >
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center group-hover:bg-cyan-950/60 transition-colors">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse group-hover:text-cyan-300" />
              </div>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('voice_landing')}
                  className="text-left group cursor-pointer"
                  title="মূল পেজে ফিরে যান"
                >
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2 group-hover:text-cyan-300 transition-colors">
                    <span>EDGE-AI MASTER HUB</span>
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/90 px-2 py-0.5 rounded-full border border-cyan-700/60 shadow-sm">
                      21 DASHBOARDS • INGRESS :8099
                    </span>
                  </h1>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Autonomous Multi-Modal Ingress Controller</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Author: Humayun Bhai</span>
              </p>
            </div>
          </div>

          {/* Master Controls & Global Matrix Gear Gateway */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            
            {/* 🏠 Direct Back to Main Page Button */}
            <button
              id="header-back-to-home-btn"
              onClick={() => setActiveTab('voice_landing')}
              className="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-2 border shadow-md bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 border-cyan-400 text-white hover:brightness-110 hover:shadow-cyan-500/30 ring-1 ring-cyan-300/40 active:scale-95 cursor-pointer"
              title="যেকোনো সময় মূল ভয়েস অ্যাসিস্ট্যান্ট হোম স্ক্রিনে ফিরে যান"
            >
              <Home className="w-4 h-4 text-cyan-200" />
              <span className="font-semibold">🏠 মূল পেজে ফিরুন</span>
            </button>

            {/* ⚙️ PERSISTENT GLOBAL SETTINGS / DASHBOARD MATRIX GEAR BUTTON */}
            <button
              id="global-matrix-gear-gateway-btn"
              onClick={() => setIsMatrixModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-2 border shadow-md bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-900 border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-cyan-500/20 ring-1 ring-cyan-500/30 active:scale-95"
              title="Click to trigger Global Settings & 21-Dashboard Matrix Gateway"
            >
              <Settings className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="font-mono tracking-wide">ম্যাট্রিক্স হাব (২১ ড্যাশবোর্ড)</span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-200 px-1.5 py-0.2 rounded border border-cyan-400/40">
                21
              </span>
            </button>

            {/* Interactive Explain Mode Toggle Button */}
            <button
              id="explain-mode-toggle-btn"
              onClick={toggleExplainMode}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                isExplainModeActive
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white border-cyan-400 animate-pulse shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                  : 'bg-slate-900 text-cyan-400 border-cyan-900/60 hover:bg-cyan-950/40'
              }`}
              title="স্পর্শ ভয়েস গাইড মোড চালু বা বন্ধ করুন (যেকোনো বাটনে ক্লিক করলে বাংলায় বিবরণ শোনা যাবে)"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isExplainModeActive ? 'text-cyan-200' : 'text-cyan-400'}`} />
              <span>{isExplainModeActive ? '🎯 ভয়েস গাইড চালু' : '🎯 স্পর্শ ভয়েস গাইড'}</span>
            </button>

            {/* Execution Authority Mode */}
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Authority:</span>
              <button
                id="toggle-authority-mode"
                onClick={() => setExecutionMode(
                  executionMode === 'CONFIRMATION_REQUIRED' 
                    ? 'FULL_AUTONOMOUS_AUTHORITY' 
                    : 'CONFIRMATION_REQUIRED'
                )}
                className={`px-2 py-0.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  executionMode === 'FULL_AUTONOMOUS_AUTHORITY'
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Toggle between Manual Confirmation and Full Autonomous Master Authority"
              >
                {executionMode === 'FULL_AUTONOMOUS_AUTHORITY' ? (
                  <>
                    <Zap className="w-3 h-3 text-purple-400 animate-bounce" />
                    <span>FULL AUTONOMOUS</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>CONFIRMATION REQUIRED</span>
                  </>
                )}
              </button>
            </div>

            {/* Context-Aware Audio Routing Mode */}
            <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <button
                id="toggle-audio-route"
                onClick={() => setAudioRoute(
                  audioRoute === 'DASHBOARD_STREAMING'
                    ? 'LOCAL_HARDWARE_SPEAKER'
                    : 'DASHBOARD_STREAMING'
                )}
                className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
                title="Toggle between Dashboard Web Audio Streaming and Local HA Room Speaker Output"
              >
                <span className="text-slate-500">Audio:</span>
                <span className="text-cyan-300 font-bold">
                  {audioRoute === 'DASHBOARD_STREAMING' ? 'Web Stream' : 'Local 3.5mm/USB'}
                </span>
              </button>
            </div>

            {/* Master Emergency Kill Switch */}
            <button
              id="master-kill-switch"
              onClick={() => setKillSwitchActive(!killSwitchActive)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
                killSwitchActive
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-rose-600/40'
                  : 'bg-slate-900 text-rose-400 border-rose-900/50 hover:bg-rose-950/40'
              }`}
              title="Emergency Master Kill Switch (Instantly halts all autonomous multi-entity execution queues)"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{killSwitchActive ? '🛑 KILL-SWITCH ACTIVE' : 'KILL-SWITCH'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Main Navigation Tabs: 21 Complete Dashboards Scrollable Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 sm:space-x-3 overflow-x-auto py-2.5 scrollbar-none items-center">
          {/* Home Voice Brain Tab Button */}
          <button
            id="tab-btn-voice_landing"
            onClick={() => setActiveTab('voice_landing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
              activeTab === 'voice_landing'
                ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                : 'bg-[#0b142d] border-cyan-900/60 text-cyan-300 hover:text-white hover:border-cyan-500'
            }`}
          >
            <span className="text-sm">🏠</span>
            <span className="font-bold">মূল ভয়েস হাব</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Main Brain
            </span>
          </button>

          {allDashboards.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[11px] opacity-75 font-mono text-cyan-400 font-bold">#{tab.tabNumber}</span>
                <span>{tab.label.split(' ')[0]} {tab.label.split(' ').slice(1, 3).join(' ')}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚀 ADVANCED GLOBAL SETTINGS & 21-DASHBOARD MATRIX MODAL DRAWER */}
      {isMatrixModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsMatrixModalOpen(false)}
          />

          <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900/98 border border-slate-700/80 rounded-2xl text-white shadow-2xl flex flex-col overflow-hidden z-10">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Settings className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                    <span>Global Settings & 21-Dashboard Matrix Gateway</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800 font-bold">
                      INGRESS PORT :8099
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Direct Launch & Full Configuration Matrix for all 21 Core Home Assistant Hub Modules
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search & Cluster Filter Bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="২১টি ড্যাশবোর্ডের নাম, ফিচার বা কিওয়ার্ড দিয়ে সার্চ করুন (যেমন: camera, motor, voice, lovelace, FFT)..."
                  value={matrixSearchQuery}
                  onChange={(e) => setMatrixSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {/* Cluster Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedClusterFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap border transition-all ${
                    selectedClusterFilter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  All (21)
                </button>
                {dashboardClusters.map(c => (
                  <button
                    key={c.clusterId}
                    onClick={() => setSelectedClusterFilter(c.clusterId)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap border transition-all ${
                      selectedClusterFilter === c.clusterId
                        ? `${c.bgColor} ${c.color} ${c.borderColor} font-bold`
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {c.clusterNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Grid of 21 Dashboards grouped by Category */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {dashboardClusters
                .filter(c => selectedClusterFilter === 'all' || c.clusterId === selectedClusterFilter)
                .map((cluster) => {
                  const clusterDashboards = cluster.dashboards.filter(d => 
                    matrixSearchQuery === '' || 
                    d.label.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
                    d.badge.toLowerCase().includes(matrixSearchQuery.toLowerCase()) ||
                    d.desc.toLowerCase().includes(matrixSearchQuery.toLowerCase())
                  );

                  if (clusterDashboards.length === 0) return null;

                  return (
                    <div key={cluster.clusterId} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${cluster.bgColor} ${cluster.color} ${cluster.borderColor}`}>
                            Tabs {cluster.clusterNumber}
                          </span>
                          <h3 className="text-sm font-bold text-white font-mono">
                            {cluster.clusterTitle}
                          </h3>
                          <span className="text-xs text-slate-400 font-sans">
                            ({cluster.clusterTitleBn})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {clusterDashboards.length} Active Modules
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {clusterDashboards.map((item) => {
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              id={`matrix-launch-${item.id}`}
                              onClick={() => {
                                setActiveTab(item.id);
                                setIsMatrixModalOpen(false);
                              }}
                              className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 group relative overflow-hidden ${
                                isActive
                                  ? 'bg-gradient-to-br from-cyan-950/90 to-indigo-950/90 border-cyan-500 text-white ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850/80 hover:border-slate-700'
                              }`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 font-mono">
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                                      #{item.tabNumber}
                                    </span>
                                    <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                                      {item.label}
                                    </h4>
                                  </div>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                    isActive
                                      ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {item.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 group-hover:text-cyan-300">
                                <span>{isActive ? 'CURRENTLY ACTIVE' : 'LAUNCH DASHBOARD'}</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer with Global Ingress Status & Shortcuts */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/95 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ingress: Enabled (Port 8099)</span>
                </span>
                <span className="text-slate-600">•</span>
                <span>Dual-Core Gemini / NumPy 4-Head Synced</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMatrixModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors"
                >
                  Close Matrix
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

