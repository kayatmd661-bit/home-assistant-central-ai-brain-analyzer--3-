import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Mic, 
  Sliders, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  User, 
  Bot, 
  Heart, 
  Radio,
  Music,
  Cpu,
  Settings2
} from 'lucide-react';
import { PageVoiceExplainerBar } from './PageVoiceExplainerBar';
import { useVoiceSettings, VoicePersona } from '../context/VoiceSettingsContext';

interface VoiceChangerStudioProps {
  onNavigateToCard?: () => void;
}

export const VoiceChangerStudio: React.FC<VoiceChangerStudioProps> = ({ onNavigateToCard }) => {
  const { 
    settings, 
    updateSettings, 
    isSpeaking, 
    speakText, 
    stopSpeaking,
    availableVoices,
    activeVoiceName,
    activeAudioTier,
    activeVoiceLabel,
    cacheStats,
    clearVoiceCache
  } = useVoiceSettings();

  const [testText, setTestText] = useState<string>('হ্যালো! আমি আপনার হোম অ্যাসিস্ট্যান্টের এআই সহকারী। ড্রয়িং রুমের লাইট ও এসি প্রস্তুত আছে।');
  const [cacheClearSuccess, setCacheClearSuccess] = useState<boolean>(false);

  const voicePersonas: { id: VoicePersona; labelBn: string; labelEn: string; descBn: string; icon: any; color: string }[] = [
    {
      id: 'BANGLA_FEMALE',
      labelBn: 'বাংলা নারী কণ্ঠ (মিষ্টি ও স্পষ্ট)',
      labelEn: 'Bangla Natural Female Voice',
      descBn: 'মিষ্টি, স্পষ্ট ও স্বাভাবিক ঘরোয়া বাংলা উচ্চারণ।',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'BANGLA_MALE',
      labelBn: 'বাংলা পুরুষ কণ্ঠ (গম্ভীর ও দৃঢ়)',
      labelEn: 'Bangla Natural Male Voice',
      descBn: 'দৃঢ়, স্পষ্ট ও প্রফেশনাল বাংলা কণ্ঠস্বর।',
      icon: User,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'GEMINI_NEURAL',
      labelBn: 'নিউরাল স্মার্ট এআই (আধুনিক)',
      labelEn: 'Neural AI Modern Voice',
      descBn: 'আধুনিক কৃত্রিম বুদ্ধিমত্তা স্টাইলের স্পষ্ট ও দ্রুত উচ্চারণ।',
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'FEMALE_ENGLISH',
      labelBn: 'ইংরেজি নারী কণ্ঠ (Fluent English)',
      labelEn: 'Natural English Female Voice',
      descBn: 'আন্তর্জাতিক ফ্লুয়েন্ট ইংরেজি কণ্ঠস্বর।',
      icon: User,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'MALE_ENGLISH',
      labelBn: 'ইংরেজি পুরুষ কণ্ঠ (Executive English)',
      labelEn: 'Natural English Male Voice',
      descBn: 'ক্লাসিকাল স্পষ্ট ইংরেজি ভয়েস।',
      icon: User,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'ROBOTIC_AI',
      labelBn: 'সাইবার রোবটিক ভয়েস (Sci-Fi Synth)',
      labelEn: 'Retro Futuristic Cyber Voice',
      descBn: 'সাই-ফাই মুভির মতো সাইবারনেটিক সিন্থ কণ্ঠস্বর।',
      icon: Bot,
      color: 'from-fuchsia-500 to-purple-600'
    }
  ];

  const handleTestSpeech = async () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      await speakText(testText, settings.persona.startsWith('BANGLA') ? 'bn-BD' : 'en-US');
    }
  };

  const handleResetDefaults = () => {
    updateSettings({
      persona: 'BANGLA_FEMALE',
      pitch: 1.0,
      rate: 1.0,
      volume: 1.0,
      autoExplainPages: false,
      preferredLang: 'bn-BD',
      selectedVoiceURI: null
    });
    speakText('ভয়েস সেটিংস স্বাভাবিক বাংলা নারী কণ্ঠ ও স্বাভাবিক স্বাভাবিক গতিতে রিসেট করা হয়েছে।', 'bn-BD');
  };

  return (
    <div className="space-y-6">
      {/* On-Page Voice Explainer Guide */}
      <PageVoiceExplainerBar pageId="voice_studio" />

      {/* Main Studio Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Voice Personas & Selection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  🎙️ ভয়েস পারসোনা নির্বাচন (High-Clarity Voice Engine)
                </h3>
              </div>
              <button
                onClick={handleResetDefaults}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                title="ডিফল্ট সেটিংসে ফেরত যান"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিসেট</span>
              </button>
            </div>

            {/* Smart 3-Tier Voice Router & Cache Status Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>স্মার্ট হাইব্রিড ভয়েস রাউটার (3-Tier Dynamic Audio Engine)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tier 1: জেমিনি লাইভ ভয়েস ➔ Tier 2: অফলাইন ক্যাশড অডিও ➔ Tier 3: ন্যাচারাল ফিমেল TTS
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono shrink-0">
                  ৩-টিয়ার সচল
                </span>
              </div>

              {/* 3-Tier Route Visualizer */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
                <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-cyan-300 flex flex-col items-center text-center">
                  <span className="font-bold">1. Gemini Live</span>
                  <span className="text-[9px] text-cyan-400/80">অনলাইন লাইভ স্ট্রিমিং</span>
                </div>
                <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-800/50 text-purple-300 flex flex-col items-center text-center">
                  <span className="font-bold">2. Cached Voice</span>
                  <span className="text-[9px] text-purple-400/80">অফলাইন স্টোর্ড অডিও</span>
                </div>
                <div className="p-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 flex flex-col items-center text-center">
                  <span className="font-bold">3. Natural TTS</span>
                  <span className="text-[9px] text-indigo-400/80">ন্যাচারাল ফিমেল ব্যাকআপ</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              আপনার পছন্দের কণ্ঠস্বর নির্বাচন করুন। এটি সিস্টেমের সকল পেজ নির্দেশিকা এবং হোম অ্যাসিস্ট্যান্ট ভয়েস ফিডব্যাকে ব্যবহৃত হবে:
            </p>

            {/* Persona Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voicePersonas.map((vp) => {
                const isSelected = settings.persona === vp.id;
                const IconComponent = vp.icon;
                return (
                  <button
                    key={vp.id}
                    onClick={() => {
                      updateSettings({ persona: vp.id });
                      speakText(`আপনি নির্বাচন করেছেন: ${vp.labelBn}`, vp.id.startsWith('BANGLA') ? 'bn-BD' : 'en-US');
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all active:scale-98 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500/40'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${vp.color} flex items-center justify-center text-white shadow-md`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700 font-mono flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-purple-300" />
                          <span>সক্রিয়</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white font-sans">{vp.labelBn}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{vp.descBn}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detected System Voices Dropdown */}
            {availableVoices.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
                  <span className="flex items-center gap-1.5 text-purple-300 font-semibold">
                    <Settings2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>ডিভাইসে পাওয়া সিস্টেম ভয়েস ({availableVoices.length}টি সনাক্ত):</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    অটো-ম্যাচ: {activeVoiceName}
                  </span>
                </div>
                <select
                  value={settings.selectedVoiceURI || ''}
                  onChange={(e) => {
                    const val = e.target.value || null;
                    updateSettings({ selectedVoiceURI: val });
                    const chosen = availableVoices.find(v => (v.voiceURI === val || v.name === val));
                    if (chosen) {
                      speakText(`ভয়েস পরিবর্তন করা হয়েছে: ${chosen.name}`, chosen.lang);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-750 text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="">স্বয়ংক্রিয় সেরা বাংলা/ইংরেজি ভয়েস (Auto Recommended)</option>
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.voiceURI || v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Auto-Explain Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">নতুন পেজে স্বয়ংক্রিয়ভাবে অডিও নির্দেশিকা চালু করুন</div>
                <div className="text-[11px] text-slate-400">যেকোনো ট্যাবে ক্লিক করলে সেই পেজের নিয়ম নিজে নিজেই পড়ে শোনাবে</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoExplainPages}
                  onChange={(e) => updateSettings({ autoExplainPages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Local Audio Cache Storage & Tier Manager */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>অফলাইন জেমিনি ভয়েস ক্যাশ (Audio Storage)</span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                  {cacheStats.count} টি রেকর্ড ({Math.round(cacheStats.totalBytes / 1024)} KB)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                অনলাইনে প্লে হওয়া জেমিনির আসল নারী কণ্ঠ স্বয়ংক্রিয়ভাবে ব্রাউজারে ক্যাশ হয়, যাতে পরবর্তীতে ইন্টারনেট ছাড়াও জেমিনির আসল মিষ্টি গলায় প্রতিটি পেজের গাইডলাইন শোনা যায়।
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    await clearVoiceCache();
                    setCacheClearSuccess(true);
                    setTimeout(() => setCacheClearSuccess(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700 transition cursor-pointer"
                >
                  {cacheClearSuccess ? '✓ ক্যাশ খালি করা হয়েছে' : '🗑️ ক্যাশ পরিষ্কার করুন'}
                </button>
                <span className="text-[10px] text-slate-500 font-mono">
                  IndexedDB Persistent
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Speed, Pitch & Live Speech Tester */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-sans">
                  🎚️ সুর ও গতি ফাইন-টিউনিং (Pitch & Speed)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">
                {settings.rate}x • Pitch {settings.pitch}
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs font-mono">
              
              {/* Speaking Speed */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>কথা বলার গতি (Speed / Rate):</span>
                  <span className="text-cyan-400 font-bold">{settings.rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={settings.rate}
                  onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>ধীরে (0.6x)</span>
                  <span>স্বাভাবিক মানুষের গতি (1.0x)</span>
                  <span>দ্রুত (1.5x)</span>
                </div>
              </div>

              {/* Pitch */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>কণ্ঠস্বরের সুর (Pitch / Tone):</span>
                  <span className="text-purple-400 font-bold">{settings.pitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={settings.pitch}
                  onChange={(e) => updateSettings({ pitch: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>গম্ভীর (Low 0.6)</span>
                  <span>স্বাভাবিক (1.0)</span>
                  <span>উচ্চ (High 1.5)</span>
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>ভলিউম (Volume):</span>
                  <span className="text-emerald-400 font-bold">{Math.round(settings.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

            </div>

            {/* Live Interactive Speech Tester */}
            <div className="pt-2 space-y-2.5">
              <label className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-cyan-400" />
                <span>টেস্ট বাক্য (Sample Voice Test):</span>
              </label>

              <textarea
                rows={2}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none font-sans"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestSpeech}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer ${
                    isSpeaking
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-purple-600/20'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>⏹️ কথা থামান</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>🔊 স্পষ্ট কণ্ঠে শুনুন</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setTestText('ড্রয়িং রুমের লাইট চালু করা হয়েছে এবং এসি ২৬ ডিগ্রিতে সেট করা হয়েছে।')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono cursor-pointer"
                >
                  নমুনা ২
                </button>
              </div>

              {/* Active Soundwave Animation */}
              {isSpeaking && (
                <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-between text-purple-300 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>কথা বলা চলছে...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-5 bg-pink-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    <span className="w-1 h-4 bg-purple-300 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
