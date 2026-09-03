import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Settings,
  Home,
  Sliders
} from 'lucide-react';

interface DashboardItem {
  id: string;
  tabNumber: number;
  label: string;
  badge: string;
  desc: string;
  clusterTitle?: string;
  clusterId?: string;
}

interface DashboardCluster {
  clusterId: string;
  clusterNumber: string;
  clusterTitle: string;
  clusterTitleBn: string;
  color: string;
  borderColor: string;
  bgColor: string;
  dashboards: DashboardItem[];
}

interface ControlHubDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  rulesCount?: number;
}

export const ControlHubDrawerModal: React.FC<ControlHubDrawerModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  rulesCount = 12
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');

  if (!isOpen) return null;

  const dashboardClusters: DashboardCluster[] = [
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

  const allDashboards = dashboardClusters.flatMap(c => 
    c.dashboards.map(d => ({ ...d, clusterTitle: c.clusterTitle, clusterId: c.clusterId, clusterTitleBn: c.clusterTitleBn }))
  );

  const filteredDashboards = allDashboards.filter(d => {
    const matchesSearch = d.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCluster = selectedCluster === 'all' || d.clusterId === selectedCluster;
    return matchesSearch && matchesCluster;
  });

  const handleSelect = (tabId: string) => {
    onSelectTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0b142d] border border-cyan-900/60 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-cyan-500/20">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-[#080f24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-[#080f24] rounded-[10px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                <span>কন্ট্রোল হাব ও ২১ ড্যাশবোর্ড সুইচিং ম্যাট্রিক্স</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-700 font-bold">
                  21 SUBSYSTEMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                যেকোনো ড্যাশবোর্ডে ক্লিক করে তাৎক্ষণিক প্রবেশ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Home / Voice Landing Quick Jump Button */}
        <div className="px-4 sm:px-6 pt-3 pb-1 bg-[#091128] border-b border-slate-800/50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => handleSelect('voice_landing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              activeTab === 'voice_landing'
                ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                : 'bg-[#060c1e] text-slate-300 border-cyan-900/60 hover:text-white hover:border-cyan-500'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>🏠 মূল স্ক্রিন (বাংলা ভয়েস মাস্টার ব্রেন)</span>
          </button>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
            ● All 21 Subsystems Synced &amp; Active
          </span>
        </div>

        {/* Search & Cluster Filter Bar */}
        <div className="p-4 sm:px-6 bg-[#091128] border-b border-slate-800/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ড্যাশবোর্ড সার্চ করুন (নাম, ফিচার, কীওয়ার্ড বা ট্যাব নম্বর)..."
              className="w-full bg-[#060c1e] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCluster('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCluster === 'all'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-[#060c1e] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              সকল ড্যাশবোর্ড (২১)
            </button>
            {dashboardClusters.map(c => (
              <button
                key={c.clusterId}
                onClick={() => setSelectedCluster(c.clusterId)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCluster === c.clusterId
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-[#060c1e] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.clusterTitleBn}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredDashboards.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              কোনো ড্যাশবোর্ড পাওয়া যায়নি। ভিন্ন কীওয়ার্ড দিয়ে সার্চ করুন।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDashboards.map(d => {
                const isActive = activeTab === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(d.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group relative overflow-hidden ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/10'
                        : 'bg-[#070e22] border-slate-800/90 hover:border-cyan-800/80 hover:bg-[#0a1430]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold bg-slate-900 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-800">
                          ট্যাব #{d.tabNumber}
                        </span>
                        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-800/60 truncate max-w-[120px]">
                          {d.badge}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                        {d.label}
                      </h3>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                        {d.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-cyan-400 transition-colors font-mono">
                      <span>{d.clusterTitleBn || 'Subsystem'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
