import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Volume2, 
  Radio, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Clock, 
  CheckCircle2, 
  HardDrive,
  Network
} from 'lucide-react';
import { SystemTelemetry, ExecutionAuthorityMode, AudioRoutingMode } from '../types';

interface SystemTelemetryAuditorProps {
  executionMode: ExecutionAuthorityMode;
  audioRoute: AudioRoutingMode;
  killSwitchActive: boolean;
  rulesCount: number;
}

export const SystemTelemetryAuditor: React.FC<SystemTelemetryAuditorProps> = ({
  executionMode,
  audioRoute,
  killSwitchActive,
  rulesCount
}) => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    cpuUsage: 14.8,
    gpuUsage: 8.2,
    ramUsage: 28.5,
    localInferenceLatency: 4.2,
    activeThreads: {
      bucketA: 4, // High compute (YOLO, RTSP, Sub-brains)
      bucketB: 6, // Telemetry & HAOS WebSockets
      bucketC: 8  // Fast Action & Audio VAD
    },
    sqliteWalSizeMb: 1.84,
    haWsStatus: 'CONNECTED',
    audioRoute,
    executionMode,
    killSwitchActive
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        cpuUsage: Number((12 + Math.random() * 5).toFixed(1)),
        gpuUsage: Number((6 + Math.random() * 4).toFixed(1)),
        ramUsage: Number((28 + Math.random() * 1.5).toFixed(1)),
        localInferenceLatency: Number((4.1 + Math.random() * 0.3).toFixed(1))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Telemetry, 3-Bucket Threading Topology & Hardware Hardening</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              সিস্টেম টেলিমেট্রি ও হার্ডওয়্যার অডিট ট্রেইল
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              মাল্টি-টাস্কিং ৩-লেয়ার থ্রেডিং পুল (Bucket A: High Compute, Bucket B: Telemetry I/O, Bucket C: Fast Action) এবং কনটেক্সট-অ্যাওয়ার অডিও রাউটিংয়ের লাইভ পারফরম্যান্স মনিটর।
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 self-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Home Assistant WebSocket: <strong className="text-emerald-300">LIVE SYNC</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>CPU লোড:</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{telemetry.cpuUsage}%</div>
          <div className="text-[10px] text-slate-500">Quad-Core ARM64 / x86</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>অন-ডিভাইস ইনফারেন্স:</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{telemetry.localInferenceLatency} ms</div>
          <div className="text-[10px] text-slate-500">Pure NumPy Self-Attention</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>SQLite WAL ডাটাবেস:</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{telemetry.sqliteWalSizeMb} MB</div>
          <div className="text-[10px] text-slate-500">{rulesCount} টি রুলস সংরক্ষিত</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>RAM মেমোরি কনসাম্পশন:</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300">{telemetry.ramUsage}%</div>
          <div className="text-[10px] text-slate-500">512MB Capped Footprint</div>
        </div>

      </div>

      {/* 3-Bucket Threading Topology Section */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-2 font-bold text-white text-sm">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>৩-লেয়ার থ্রেডিং আইসোলেশন পুল (Async Multitasking Topology)</span>
          </span>
          <span className="text-emerald-400">১৮টি সক্রিয় ব্যাকগ্রাউন্ড থ্রেড</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
          
          {/* Bucket A */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                BUCKET A: HIGH COMPUTE
              </span>
              <span className="text-purple-400 font-bold">{telemetry.activeThreads.bucketA} Threads</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              RTSP ভিডিও ডিকোডিং, YOLOv8 পারসন ট্র্যাকিং, ফেস ভেক্টর এক্সট্র্যাকশন ও ডাইনামিক সাব-ব্রেন জেনারেশন।
            </p>
            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2">
              আইসোলেটেড সিপিইউ কোর: Core 2, 3
            </div>
          </div>

          {/* Bucket B */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                BUCKET B: TELEMETRY & I/O
              </span>
              <span className="text-cyan-400 font-bold">{telemetry.activeThreads.bucketB} Threads</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Home Assistant Core WebSocket ইভেন্ট বাস, SQLite WAL পারসিস্টেন্স ও ক্লাউড Gemini API হ্যান্ডশেক।
            </p>
            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2">
              Asyncio Event Loop Daemon
            </div>
          </div>

          {/* Bucket C */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                BUCKET C: FAST ACTION
              </span>
              <span className="text-emerald-400 font-bold">{telemetry.activeThreads.bucketC} Threads</span>
            </div>
            <p className="text-slate-300 font-sans text-xs">
              UDP Port 50005 ভয়েস প্যাকেট VAD, সাব-১০ms হার্ডওয়্যার রিলে সুইচিং ও ALSA ডিরেক্ট স্পিকার আউটপুট।
            </p>
            <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2">
              Zero-Latency Prioritized Queue
            </div>
          </div>

        </div>
      </div>

      {/* Context-Aware Audio Routing Indicator */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="flex items-center gap-2 font-bold text-white text-sm">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>কনটেক্সট-অ্যাওয়ার অডিও ও স্পিকার রাউটিং মোড</span>
          </span>
          <span className="text-cyan-300 font-bold">
            {audioRoute === 'DASHBOARD_STREAMING' ? 'DASHBOARD BROWSER STREAM' : 'LOCAL 3.5mm/USB HARDWARE'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${
            audioRoute === 'LOCAL_HARDWARE_SPEAKER'
              ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
              : 'bg-slate-950 border-slate-800 opacity-60'
          }`}>
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span>🔊 লোকাল হার্ডওয়্যার মোড (Local 3.5mm / USB)</span>
            </h4>
            <p className="text-slate-400 text-xs font-sans">
              রুমে বা দরজায় ফিজিক্যাল ইভেন্ট ঘটলে সরাসরি Raspberry Pi / HAOS ডিভাইসের সাথে সংযুক্ত স্পিকারে অডিও প্লে হয়।
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${
            audioRoute === 'DASHBOARD_STREAMING'
              ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
              : 'bg-slate-950 border-slate-800 opacity-60'
          }`}>
            <h4 className="font-bold text-white mb-1 flex items-center gap-1.5">
              <span>📱 ড্যাশবোর্ড স্ট্রিমিং মোড (Web / Mobile App)</span>
            </h4>
            <p className="text-slate-400 text-xs font-sans">
              যে ব্রাউজার বা মোবাইল সেশন থেকে ইউজার নির্দেশ দিয়েছেন, সরাসরি সেই ডিভাইসে অডিও স্ট্রিম ব্যাক করে শোনানো হয়।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
