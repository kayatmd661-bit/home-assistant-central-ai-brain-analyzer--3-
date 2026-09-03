import React from 'react';
import { Cpu, ShieldCheck, Zap, Activity, HardDrive, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'audit', label: '📊 কোড ও আর্কিটেকচার অডিট', badge: '5 ফিক্স' },
    { id: 'neural', label: '🧠 নেকেড নিউরাল নেটওয়ার্ক', badge: 'Pure NumPy' },
    { id: 'simulator', label: '🚀 লাইভ ভয়েস ও HA সিমুলেটর', badge: 'Interactive' },
    { id: 'code', label: '💻 ১০০% সংশোধিত পাইথন কোড', badge: 'Ready' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100 font-mono">
                  HOME ASSISTANT CENTRAL AI BRAIN
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  2026 Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>মাস্টার কোড আর্কিটেকচার এনালাইসিস ও কমপ্লিট সলিউশন</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-medium">হুমাউন ভাইয়ের স্মার্ট হোম ইকোসিস্টেম</span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Engine: <span className="text-blue-300">Pure NumPy + Gemini 2.0</span></span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status: <span className="text-emerald-300 font-bold">100% Syntax Fixed</span></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                  isActive
                    ? 'bg-indigo-600/30 border-indigo-500 text-cyan-300 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-indigo-500/40 text-cyan-200'
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
    </header>
  );
};
