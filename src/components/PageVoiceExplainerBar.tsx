import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, HelpCircle, Sparkles, ChevronDown, ChevronUp, 
  Radio, CheckCircle2, Sliders, Play, Square, Loader2, 
  Cpu, KeyRound, Wifi, ShieldCheck, ListOrdered, ArrowRight, Zap, RefreshCw,
  Home, ArrowLeft
} from 'lucide-react';
import { PAGE_EXPLAINER_DATA, PageExplainerInfo, generateLiveStateVoiceScript } from '../data/pageExplainerData';
import { useVoiceSettings } from '../context/VoiceSettingsContext';

interface PageVoiceExplainerBarProps {
  pageId: string;
  className?: string;
  onNavigateToVoiceStudio?: () => void;
  onNavigateToHome?: () => void;
  liveContext?: {
    activeRulesCount?: number;
    connectedDevices?: number;
    healthyKeys?: number;
  };
}

export const PageVoiceExplainerBar: React.FC<PageVoiceExplainerBarProps> = ({
  pageId,
  className = '',
  onNavigateToVoiceStudio,
  onNavigateToHome,
  liveContext
}) => {
  const { 
    settings, 
    updateSettings, 
    isSpeaking, 
    activeScript, 
    audioProgress,
    speakText, 
    stopSpeaking,
    activeVoiceName,
    activeAudioTier,
    activeVoiceLabel
  } = useVoiceSettings();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [langMode, setLangMode] = useState<'bn' | 'en'>(settings.preferredLang === 'bn-BD' ? 'bn' : 'en');
  const [unabridgedMode, setUnabridgedMode] = useState<boolean>(true);
  const [liveState, setLiveState] = useState<{
    activeRulesCount: number;
    connectedDevices: number;
    healthyKeys: number;
    lastUpdated: string;
  }>({
    activeRulesCount: liveContext?.activeRulesCount ?? 4,
    connectedDevices: liveContext?.connectedDevices ?? 18,
    healthyKeys: liveContext?.healthyKeys ?? 3,
    lastUpdated: 'Just now'
  });

  // Fetch live state from backend
  useEffect(() => {
    let isMounted = true;
    const fetchLiveState = async () => {
      try {
        const res = await fetch('/api/gemini/live-state-summary');
        const data = await res.json();
        if (isMounted && data.success && data.liveState) {
          setLiveState({
            activeRulesCount: data.liveState.activeRulesCount,
            connectedDevices: data.liveState.connectedDevices,
            healthyKeys: data.liveState.healthyKeys,
            lastUpdated: new Date().toLocaleTimeString()
          });
        }
      } catch (err) {
        // use default state
      }
    };
    fetchLiveState();
    return () => { isMounted = false; };
  }, [pageId]);

  const info: PageExplainerInfo = PAGE_EXPLAINER_DATA[pageId] || {
    pageId,
    titleBn: 'স্মার্ট কন্ট্রোল প্যানেল',
    titleEn: 'Smart Control Panel',
    summaryBn: 'এই প্যানেল থেকে আপনার হোম অটোমেশন ফিচার পরিচালনা করুন।',
    summaryEn: 'Manage your home automation features from this panel.',
    voiceScriptBn: 'স্বাগতম। এখান থেকে আপনার হোম অটোমেশন ফিচারগুলো সহজ বাংলায় পরিচালনা করতে পারেন।',
    voiceScriptEn: 'Welcome. Manage your home automation features from this panel with ease.',
    unabridgedVoiceScriptBn: 'স্বাগতম স্মার্ট কন্ট্রোল প্যানেলে। এখানে আপনার সমস্ত সংযুক্ত স্মার্ট ডিভাইস ও সক্রিয় অটোমেশন সহজ বাংলায় পরিচালনা করতে পারেন। প্রতিটি বাটন ও স্লাইডার ব্যবহার করে রিয়েল-টাইমে হোম অ্যাসিস্ট্যান্টের সকল ফিচার নিয়ন্ত্রণ করুন।',
    unabridgedVoiceScriptEn: 'Welcome to the Smart Control Panel. Manage all your connected devices and active automations with ease.',
    featuresBn: ['সহজ কন্ট্রোল', 'রিয়েল-টাইম আপডেট', 'স্বয়ংক্রিয় সুরক্ষা'],
    tipsBn: 'টিপস: যেকোনো অপশন বুঝতে উপরে ক্লিক করুন।',
    detailedControls: [
      {
        nameBn: 'মাস্টার সুইচ',
        nameEn: 'Master Switch',
        type: 'toggle',
        descriptionBn: 'ফিচার সক্রিয় বা বন্ধ করার সুইচ।',
        descriptionEn: 'Toggles the feature on or off.'
      }
    ],
    stepByStepWorkflowBn: [
      '১ম ধাপ: সেটিংস পর্যালোচনা করুন।',
      '২য় ধাপ: প্রয়োজন অনুযায়ী টগল করুন।',
      '৩য় ধাপ: ফলাফল পরীক্ষা করুন।'
    ],
    stepByStepWorkflowEn: [
      'Step 1: Review settings.',
      'Step 2: Adjust switches.',
      'Step 3: Test result.'
    ]
  };

  // Dynamic voice script generation
  const activeVoiceScript = unabridgedMode
    ? generateLiveStateVoiceScript(pageId, {
        activeRulesCount: liveState.activeRulesCount,
        connectedDevices: liveState.connectedDevices,
        healthyKeys: liveState.healthyKeys,
        language: langMode === 'bn' ? 'bn-BD' : 'en-US'
      })
    : (langMode === 'bn' ? info.voiceScriptBn : info.voiceScriptEn);

  const isThisPageSpeaking = isSpeaking && activeScript === activeVoiceScript;

  const handleToggleVoice = async () => {
    if (isThisPageSpeaking || isSpeaking) {
      stopSpeaking();
    } else {
      await speakText(activeVoiceScript, langMode === 'bn' ? 'bn-BD' : 'en-US', undefined, pageId);
    }
  };

  // Auto explain on page transition if setting enabled
  useEffect(() => {
    if (settings.autoExplainPages) {
      speakText(activeVoiceScript, langMode === 'bn' ? 'bn-BD' : 'en-US', undefined, pageId);
    }
  }, [pageId]);

  return (
    <div className={`mb-6 rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-cyan-950/50 border border-slate-800 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md transition-all ${className}`}>
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Icon, Title & Live Status Badges */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-950/50 mt-0.5 sm:mt-0">
            <HelpCircle className="w-5 h-5 text-cyan-300" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span>{langMode === 'bn' ? info.titleBn : info.titleEn}</span>
              </h3>
              
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-700/60 font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                <span>
                  {activeAudioTier === 'TIER_1_GEMINI_LIVE' 
                    ? 'জেমিনি লাইভ ভয়েস (Tier 1)' 
                    : activeAudioTier === 'TIER_2_GEMINI_CACHED' 
                    ? 'জেমিনি ক্যাশড অডিও (Tier 2)' 
                    : 'ন্যাচারাল ফিমেল TTS (Tier 3)'}
                </span>
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-emerald-400" />
                <span>{liveState.activeRulesCount}টি রুলস সচল</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-1">
              {langMode === 'bn' ? info.summaryBn : info.summaryEn}
            </p>
          </div>
        </div>

        {/* Right: Audio Controls & Switchers */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          
          {/* Mode Switcher: Full Unabridged vs Brief */}
          <button
            onClick={() => {
              const nextMode = !unabridgedMode;
              setUnabridgedMode(nextMode);
              if (isSpeaking) {
                const nextScript = nextMode
                  ? generateLiveStateVoiceScript(pageId, {
                      activeRulesCount: liveState.activeRulesCount,
                      connectedDevices: liveState.connectedDevices,
                      healthyKeys: liveState.healthyKeys,
                      language: langMode === 'bn' ? 'bn-BD' : 'en-US'
                    })
                  : (langMode === 'bn' ? info.voiceScriptBn : info.voiceScriptEn);
                speakText(nextScript, langMode === 'bn' ? 'bn-BD' : 'en-US', undefined, pageId);
              }
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all cursor-pointer ${
              unabridgedMode
                ? 'bg-purple-950/80 border-purple-700 text-purple-200 shadow-sm'
                : 'bg-slate-900 border-slate-750 text-slate-400 hover:text-white'
            }`}
            title="সম্পূর্ণ বিস্তারিত গাইড ও সংক্ষিপ্ত সারসংক্ষেপ টগল"
          >
            {unabridgedMode ? '📖 সম্পূর্ণ বিস্তারিত' : '⚡ সংক্ষেপ'}
          </button>

          {/* Language Switcher */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-0.5 flex items-center text-[10px] font-mono">
            <button
              onClick={() => {
                setLangMode('bn');
                updateSettings({ preferredLang: 'bn-BD' });
                if (isSpeaking) {
                  const nextScript = unabridgedMode
                    ? generateLiveStateVoiceScript(pageId, {
                        activeRulesCount: liveState.activeRulesCount,
                        connectedDevices: liveState.connectedDevices,
                        healthyKeys: liveState.healthyKeys,
                        language: 'bn-BD'
                      })
                    : info.voiceScriptBn;
                  speakText(nextScript, 'bn-BD', undefined, pageId);
                }
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                langMode === 'bn' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => {
                setLangMode('en');
                updateSettings({ preferredLang: 'en-US' });
                if (isSpeaking) {
                  const nextScript = unabridgedMode
                    ? generateLiveStateVoiceScript(pageId, {
                        activeRulesCount: liveState.activeRulesCount,
                        connectedDevices: liveState.connectedDevices,
                        healthyKeys: liveState.healthyKeys,
                        language: 'en-US'
                      })
                    : info.voiceScriptEn;
                  speakText(nextScript, 'en-US', undefined, pageId);
                }
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                langMode === 'en' ? 'bg-indigo-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Back to Main Page Quick Button */}
          {onNavigateToHome && (
            <button
              onClick={onNavigateToHome}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="মূল বাংলা ভয়েস মাস্টার পেজে ফিরে যান"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল পেজে ব্যাক</span>
            </button>
          )}

          {/* Master Voice Play/Stop Button */}
          <button
            id={`voice-explain-btn-${pageId}`}
            onClick={handleToggleVoice}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer ${
              isThisPageSpeaking
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/40 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-600/30'
            }`}
            title="স্পষ্ট কণ্ঠস্বরে এই পেজের সম্পূর্ণ বিস্তারিত অডিও শুনুন"
          >
            {isThisPageSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>ভয়েস থামান</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 নিয়মাবলী শুনুন</span>
              </>
            )}
          </button>

          {/* Expand Details Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            title="বিস্তারিত বাটন ও কার্যপ্রণালী দেখুন"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {onNavigateToVoiceStudio && (
            <button
              onClick={onNavigateToVoiceStudio}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 transition-all cursor-pointer"
              title="কণ্ঠস্বর ও গতি পরিবর্তন করতে ভয়েস স্টুডিও খুলুন"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Real-Time Audio Progress & Waveform Visualizer */}
      {isThisPageSpeaking && (
        <div className="mt-3 pt-3 border-t border-cyan-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-mono">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-semibold">
                স্পষ্ট ভয়েস নির্দেশিকা বাজছে ({settings.persona.startsWith('BANGLA') ? 'বাংলা ভয়েস' : 'ইংরেজি ভয়েস'})...
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1 h-6 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            </div>
          </div>

          {/* Audio progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-full transition-all duration-150"
              style={{ width: `${Math.max(4, audioProgress)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Expanded Architectural & Operational Guidance */}
      {expanded && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-800 space-y-3 text-xs animate-fadeIn">
          
          {/* Live System State Audit Row */}
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-slate-400 font-mono text-[11px]">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-cyan-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>সক্রিয় রুলস: {liveState.activeRulesCount}টি</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>সংযুক্ত ডিভাইস: {liveState.connectedDevices}টি</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>স্পিচ ইঞ্জিন: অ্যাক্টিভ ({activeVoiceName})</span>
              </span>
            </div>
            <div className="text-slate-500 text-[10px]">
              আপডেট: {liveState.lastUpdated}
            </div>
          </div>

          {/* Controls Breakdown & Step-by-Step Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            
            {/* Left: Detailed Controls */}
            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              <span className="text-[11px] font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>এই পেজের সমস্ত বাটন ও কন্ট্রোল পরিচিতি:</span>
              </span>
              
              <div className="space-y-1.5">
                {info.detailedControls && info.detailedControls.length > 0 ? (
                  info.detailedControls.map((ctrl, idx) => (
                    <div key={idx} className="bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-[11px]">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{langMode === 'bn' ? ctrl.nameBn : ctrl.nameEn}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5 pl-5">
                        {langMode === 'bn' ? ctrl.descriptionBn : ctrl.descriptionEn}
                      </p>
                    </div>
                  ))
                ) : (
                  info.featuresBn.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Step-by-step Workflow */}
            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
              <span className="text-[11px] font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
                <span>ব্যবহারবিধি (Step-by-Step Workflow):</span>
              </span>
              
              <div className="space-y-1.5">
                {(langMode === 'bn' ? info.stepByStepWorkflowBn : info.stepByStepWorkflowEn)?.map((step, idx) => (
                  <div key={idx} className="bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-[11px] flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200">{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-2 bg-amber-950/20 border border-amber-800/40 rounded-lg text-[11px] text-amber-200">
                💡 {info.tipsBn}
              </div>
            </div>

          </div>

          {/* Unabridged Voice Script Full Text */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
            <div className="text-[11px] font-bold text-purple-300 font-mono flex items-center justify-between">
              <span>🎙️ পূর্ণাঙ্গ ভয়েস স্ক্রিপ্ট (Unabridged Narration Script):</span>
              <span className="text-[10px] text-slate-500">ভয়েস: {settings.persona} • গতি: {settings.rate}x</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
              {langMode === 'bn' ? info.unabridgedVoiceScriptBn : info.unabridgedVoiceScriptEn}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
