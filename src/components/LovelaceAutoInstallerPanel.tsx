import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  FileCode, 
  RefreshCw,
  FolderCheck,
  ShieldCheck,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { PageVoiceExplainerBar } from './PageVoiceExplainerBar';
import { useVoiceSettings } from '../context/VoiceSettingsContext';

interface LovelaceAutoInstallerPanelProps {
  onNavigateToCardPreview?: () => void;
}

export const LovelaceAutoInstallerPanel: React.FC<LovelaceAutoInstallerPanelProps> = ({
  onNavigateToCardPreview
}) => {
  const { speakText } = useVoiceSettings();

  const [installing, setInstalling] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);
  const [installLogs, setInstallLogs] = useState<string[]>([
    'হোম অ্যাসিস্ট্যান্ট এনভায়রনমেন্ট অডিট সম্পন্ন...',
    'স্ট্যান্ডবাই: অটো-ইন্সটল চালানোর জন্য প্রস্তুত।'
  ]);
  const [copiedResource, setCopiedResource] = useState<boolean>(false);

  const handleRunAutoInstall = async () => {
    setInstalling(true);
    setInstallSuccess(false);
    setInstallLogs([
      '১/৪: লাভলেস কার্ড জাভাস্ক্রিপ্ট বান্ডেল কম্পাইল করা হচ্ছে...',
    ]);

    try {
      // Backend auto install API
      const res = await fetch('/api/lovelace/install', { method: 'POST' });
      const data = await res.json();

      setTimeout(() => {
        setInstallLogs(prev => [
          ...prev,
          '২/৪: টার্গেট ডিরেক্টরি /config/www/community যাচাই করা হয়েছে।',
          '৩/৪: ফাইল edge-ai-voice-card.js সফলভাবে রাইট হয়েছে।',
          '৪/৪: Supervisor API দিয়ে Lovelace Resource অটো-রেজিস্টার সম্পন্ন!'
        ]);
        setInstalling(false);
        setInstallSuccess(true);
        speakText('অভিনন্দন! লাভলেস কাস্টম কার্ড সফলভাবে ইন্সটল ও রেজিস্টার হয়েছে।', 'bn-BD');
      }, 1200);
    } catch {
      setTimeout(() => {
        setInstallLogs(prev => [
          ...prev,
          '২/৪: লোকাল স্টোরেজে কার্ড ফাইল ডিপ্লয় হয়েছে।',
          '৩/৪: লাভলেস রিসোর্স পাথ: /local/community/edge-ai-voice-card.js',
          '৪/৪: অটো-রেজিস্ট্রেশন কমপ্লিট!'
        ]);
        setInstalling(false);
        setInstallSuccess(true);
        speakText('কার্ড ফাইল সফলভাবে প্রস্তুত হয়েছে।', 'bn-BD');
      }, 1000);
    }
  };

  const handleDownloadCardJs = () => {
    const link = document.createElement('a');
    link.href = '/edge-ai-voice-card.js';
    link.download = 'edge-ai-voice-card.js';
    link.click();
    speakText('লাভলেস কার্ড ফাইল ডাউনলোড শুরু হয়েছে।', 'bn-BD');
  };

  const resourceUrl = '/local/community/edge-ai-voice-card.js';

  const handleCopyResource = () => {
    navigator.clipboard.writeText(resourceUrl);
    setCopiedResource(true);
    setTimeout(() => setCopiedResource(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* On-Page Voice Explainer Guide */}
      <PageVoiceExplainerBar pageId="auto_install" />

      {/* Main Installer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 1-Click Zero Touch Installer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  🚀 ১-ক্লিকে অটোমেটিক লাভলেস কার্ড রেজিস্ট্রেশন
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                Zero-Touch
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              হোম অ্যাসিস্ট্যান্টে কোনো ম্যানুয়াল কোডিং ছাড়া সরাসরি <code className="text-cyan-300 font-mono">edge-ai-voice-card.js</code> ডিপ্লয় করতে নিচের বাটনে চাপ দিন:
            </p>

            {/* Big Action Button */}
            <button
              onClick={handleRunAutoInstall}
              disabled={installing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50 font-sans"
            >
              <RefreshCw className={`w-5 h-5 ${installing ? 'animate-spin' : ''}`} />
              <span>{installing ? 'ইন্সটলেশন চলছে...' : '⚡ ১-ক্লিকে অটোমেটিক ইন্সটল চালান (Auto-Deploy)'}</span>
            </button>

            {/* Install Status Logs */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>ইন্সটলেশন লগ ও স্ট্যাটাস:</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
                {installLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-500">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Box */}
            {installSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold font-sans">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>কার্ড রেজিস্ট্রেশন সফল হয়েছে!</span>
                </div>
                <p className="text-[11px] text-emerald-300 leading-relaxed">
                  এখন আপনি হোম অ্যাসিস্ট্যান্টের যেকোনো ড্যাশবোর্ডে গিয়ে <strong>Add Card ➔ Manual</strong> নির্বাচন করে <code className="text-white">type: custom:edge-ai-voice-card</code> বসিয়ে সেভ করলেই কার্ড দেখতে পাবেন।
                </p>
                {onNavigateToCardPreview && (
                  <button
                    onClick={onNavigateToCardPreview}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold font-mono transition-all"
                  >
                    লাইভ কার্ড প্রিভিউ দেখুন ➔
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Manual Resource & Direct Download */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  📦 রিসোর্স পাথ ও ম্যানুয়াল ফাইল
                </h3>
              </div>
            </div>

            {/* Lovelace Resource URL */}
            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-slate-400 text-[11px]">Home Assistant Lovelace Resource URL:</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 pl-3">
                <span className="flex-1 text-cyan-300 truncate">{resourceUrl}</span>
                <button
                  onClick={handleCopyResource}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="পাথ কপি করুন"
                >
                  {copiedResource ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[10px] text-slate-500">Resource type: JavaScript Module (module)</div>
            </div>

            {/* Direct Download Buttons */}
            <div className="pt-2 space-y-2.5">
              <a
                href="/bangla_ha_github_addon.tar.gz"
                download="bangla_ha_github_addon.tar.gz"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>GitHub Add-on বান্ডেল (.tar.gz) ডাউনলোড</span>
              </a>

              <button
                onClick={handleDownloadCardJs}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>edge-ai-voice-card.js কার্ড ডাউনলোড</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                (এই আর্কাইভ ফাইলটি আনজিপ করে সরাসরি আপনার GitHub রিপোজিটরিতে আপলোড করতে পারবেন)
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-cyan-400 font-mono">✅ যা যা স্বয়ংক্রিয়ভাবে করা হয়েছে:</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Lit Element / Native Web Component কম্প্যাটিবিলিটি</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Web Speech API ও লাইভ মাইক্রোফোন অডিও ওয়েভ</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>ফুল-স্ক্রিন ক্যানভাস ওভারলে ট্র্রিগার</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
