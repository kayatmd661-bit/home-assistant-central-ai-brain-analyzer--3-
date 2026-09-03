import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  Copy, 
  Check, 
  Terminal, 
  Code, 
  ExternalLink, 
  Play, 
  ShieldCheck, 
  Radio, 
  Sliders, 
  ChevronRight,
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { PageVoiceExplainerBar } from './PageVoiceExplainerBar';
import { useVoiceSettings } from '../context/VoiceSettingsContext';

interface LovelaceCardShowcaseProps {
  onOpenFullScreenStudio?: () => void;
  onNavigateToVoiceStudio?: () => void;
  onNavigateToAutoInstall?: () => void;
}

export const LovelaceCardShowcase: React.FC<LovelaceCardShowcaseProps> = ({
  onOpenFullScreenStudio,
  onNavigateToVoiceStudio,
  onNavigateToAutoInstall
}) => {
  const { speakText } = useVoiceSettings();

  // Widget State
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastResponseBn, setLastResponseBn] = useState<string>('আপনার আদেশ দিন (যেমন: ড্রয়িং রুমের লাইট জ্বালাও)');
  const [copiedYaml, setCopiedYaml] = useState<boolean>(false);
  const [showFullOverlay, setShowFullOverlay] = useState<boolean>(false);

  // Customization Options
  const [cardTitle, setCardTitle] = useState<string>('Edge-AI Master Hub');
  const [voiceMode, setVoiceMode] = useState<string>('bangla_natural');
  const [accentColor, setAccentColor] = useState<string>('#06b6d4');
  const [isFloating, setIsFloating] = useState<boolean>(true);
  const [showGearOverlay, setShowGearOverlay] = useState<boolean>(true);

  // Web Speech API for the embedded preview
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'bn-BD';

        reco.onstart = () => setIsListening(true);
        reco.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setInputText(text);
        };
        reco.onerror = () => setIsListening(false);
        reco.onend = () => {
          setIsListening(false);
          if (inputText.trim()) {
            handleSendPrompt(inputText.trim());
          }
        };
        recognitionRef.current = reco;
      }
    }
  }, [inputText]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      speakText('মাইক চালু করার জন্য ব্রাউজারে পারমিশন প্রয়োজন। আপনি টাইপ করতে পারেন।', 'bn-BD');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  };

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputText;
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/intent/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      const reply = data.classification?.intentBn 
        ? `সফল: ${data.classification.intentBn} কার্যকর হয়েছে।` 
        : `কমান্ড গৃহীত হয়েছে: "${text}"`;
      setLastResponseBn(reply);
      speakText(reply, 'bn-BD');
      setIsProcessing(false);
      setInputText('');
    } catch {
      const reply = `লোকাল কমান্ড এক্সিকিউট হয়েছে: "${text}"`;
      setLastResponseBn(reply);
      speakText(reply, 'bn-BD');
      setIsProcessing(false);
      setInputText('');
    }
  };

  const lovelaceYaml = `type: custom:edge-ai-voice-card
title: "${cardTitle}"
voice_mode: ${voiceMode}
accent_color: "${accentColor}"
floating: ${isFloating}
show_gear_overlay: ${showGearOverlay}
addon_url: "${typeof window !== 'undefined' ? window.location.origin : 'http://homeassistant.local:8099'}"`;

  const handleCopyYaml = () => {
    navigator.clipboard.writeText(lovelaceYaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* On-Page Voice Explainer Guide Bar */}
      <PageVoiceExplainerBar 
        pageId="lovelace_card" 
        onNavigateToVoiceStudio={onNavigateToVoiceStudio}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Lovelace AI Card Interactive Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  📱 লাভলেস ড্যাশবোর্ড কার্ড লাইভ প্রিভিউ
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Live Element
              </span>
            </div>

            <p className="text-xs text-slate-400">
              নিচে আপনার তৈরি হওয়া কাস্টম লাভলেস কার্ডটি সরাসরি লাইভ কাজ করছে। মাইক চেপে কথা বলুন অথবা গিয়ার আইকনে চাপ দিয়ে ফুল-স্ক্রিন স্টুডিও পরীক্ষা করুন:
            </p>

            {/* Simulating Home Assistant Card Container */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner relative overflow-hidden">
              
              {/* The Rounded AI Studio Widget */}
              <div 
                className="rounded-2xl p-4 sm:p-5 text-white shadow-2xl transition-all border"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 14, 28, 0.98))',
                  borderColor: isListening ? '#06b6d4' : 'rgba(51, 65, 85, 0.8)',
                  boxShadow: isListening ? '0 0 25px rgba(6, 182, 212, 0.3)' : '0 10px 25px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Card Header inside Widget */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${accentColor}, #8b5cf6)` }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white font-sans">{cardTitle}</div>
                      <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>{isProcessing ? 'প্রসেসিং...' : 'সার্বক্ষণিক প্রস্তুত (Active)'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Voice Guide button inside widget */}
                    <button
                      onClick={() => speakText('এটি এজ-এআই মাস্টার ভয়েস কার্ড। মাইকে চাপ দিয়ে সরাসরি বাংলায় বা ইংরেজিতে কমান্ড দিন।', 'bn-BD')}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
                      title="এই কার্ডের ভয়েস টিউটোরিয়াল শুনুন"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    </button>

                    {/* Gear / Full-Screen Overlay Canvas button */}
                    {showGearOverlay && (
                      <button
                        onClick={() => {
                          if (onOpenFullScreenStudio) {
                            onOpenFullScreenStudio();
                          } else {
                            setShowFullOverlay(true);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 transition-all border border-slate-700 hover:border-cyan-500 shadow-md"
                        title="ফুল-স্ক্রিন স্টুডিও ক্যানভাস ওপেন করুন (Full Screen Overlay)"
                      >
                        <Settings className="w-4 h-4 text-cyan-300 animate-spin [animation-duration:8s]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Bar with Mic & Text & Send */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3 flex items-center gap-2 focus-within:border-cyan-500 transition-all">
                  <button
                    onClick={toggleMic}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/50 scale-105'
                        : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white'
                    }`}
                    title={isListening ? 'শোনা বন্ধ করুন' : 'মাইক চালু করে কথা বলুন'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                    placeholder="বাংলায় বলুন বা লিখুন (যেমন: ফ্যান চালু করো)..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />

                  <button
                    onClick={() => handleSendPrompt()}
                    disabled={!inputText.trim()}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-cyan-600 text-cyan-300 hover:text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 cursor-pointer"
                    title="কমান্ড পাঠান"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Audio Waves when mic is recording */}
                {isListening && (
                  <div className="mt-2.5 flex items-center justify-center gap-1 h-4">
                    <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    <span className="w-1 h-4 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  </div>
                )}

                {/* Feedback text display */}
                <div className="mt-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate">💬 {lastResponseBn}</span>
                  <button
                    onClick={() => speakText(lastResponseBn, 'bn-BD')}
                    className="text-cyan-400 hover:text-cyan-300 ml-2 shrink-0 p-1"
                    title="পুনরায় শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* Quick action buttons for testing */}
            <div className="flex items-center gap-2 pt-2 flex-wrap text-xs">
              <button
                onClick={() => handleSendPrompt('সন্ধ্যা ৬টায় ড্রয়িং রুমের লাইট ৪০% অন করো')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
              >
                নমুনা ১: লাইট অটোমেশন
              </button>
              <button
                onClick={() => handleSendPrompt('এসি ২৬ ডিগ্রিতে সেট করো')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
              >
                নমুনা ২: এসি কন্ট্রোল
              </button>
              <button
                onClick={() => handleSendPrompt('রাত ১টায় সব ফ্যান ও লাইট বন্ধ')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
              >
                নমুনা ৩: স্লিপ মোড
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Lovelace Card Customizer & YAML Copier */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  ⚙️ কার্ড কাস্টমাইজেশন ও লাভলেস YAML
                </h3>
              </div>
              <button
                onClick={handleCopyYaml}
                className="px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 active:scale-95 transition-all"
              >
                {copiedYaml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedYaml ? 'কপিকৃত!' : 'YAML কপি করুন'}</span>
              </button>
            </div>

            {/* Customization Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">কার্ডের নাম (Title):</label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">হাইলাইট রঙ (Accent):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[11px]">ভয়েস মোড (Voice Mode):</label>
                <select
                  value={voiceMode}
                  onChange={(e) => setVoiceMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="bangla_natural">প্রাকৃতিক বাংলা কণ্ঠ (Bangla Natural)</option>
                  <option value="gemini_pro">জেমিনি এআই নিউরাল (Gemini Voice)</option>
                  <option value="english_neural">ইংরেজি নিউরাল (English Natural)</option>
                </select>
              </div>

              <div className="space-y-1 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={showGearOverlay}
                    onChange={(e) => setShowGearOverlay(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">ফুল-স্ক্রিন গিয়ার আইকন দেখাও</span>
                </label>
              </div>
            </div>

            {/* Generated YAML Code Block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Home Assistant Lovelace Configuration:</span>
                <span className="text-emerald-400">custom:edge-ai-voice-card</span>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed selection:bg-cyan-800">
                {lovelaceYaml}
              </pre>
            </div>

            {/* Quick Action Links */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              {onNavigateToAutoInstall && (
                <button
                  onClick={onNavigateToAutoInstall}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono flex items-center gap-1.5 transition-all"
                >
                  <span>🚀 অটো-ইন্সটলার পেজে যান</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {onNavigateToVoiceStudio && (
                <button
                  onClick={onNavigateToVoiceStudio}
                  className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800/60 text-purple-300 font-mono flex items-center gap-1.5 transition-all"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ভয়েস চেঞ্জার স্টুডিও</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Standalone Full-Screen Overlay Canvas Simulation Modal */}
      {showFullOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-sans">
                  ⚡ Edge-AI Master Hub - ফুল-স্ক্রিন এআই ক্যানভাস ওভারলে
                </h2>
                <span className="text-[10px] text-cyan-400 font-mono">Full-Screen Mode Active</span>
              </div>
            </div>

            <button
              onClick={() => setShowFullOverlay(false)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Close / Back to Dashboard</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                আপনি এখন লাভলেস কার্ডের গিয়ার আইকন থেকে ফুল-স্ক্রিন ওভারলে মোডে আছেন। এখান থেকে পুরো অ্যাড-অনের সমস্ত মডিউল ব্রাউজ ও কনফিগার করতে পারেন।
              </span>
            </div>

            {/* Simulated mini modules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold text-sm">⚡ মাস্টার অটোমেশন</div>
                <p className="text-xs text-slate-400">সীমাহীন কাস্টম রুলস ও লজিক বিল্ডার。</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold text-sm">🛡️ নেটওয়ার্ক সেন্টিনেল</div>
                <p className="text-xs text-slate-400">ওয়াইফাই রাউটার ও ইন্ট্রুডার ব্লকার。</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-purple-400 font-bold text-sm">🧠 লোকাল এআই ব্রেন</div>
                <p className="text-xs text-slate-400">অফলাইন নিউরাল ট্রান্সফরমার。</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
