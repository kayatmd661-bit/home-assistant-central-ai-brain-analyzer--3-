import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Volume2, 
  Zap, 
  Save, 
  Play, 
  Layers, 
  HelpCircle, 
  RotateCcw,
  Check,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Info
} from 'lucide-react';
import { FeasibilityAuditResult, ExecutionAuthorityMode, AudioRoutingMode, AutomationRule } from '../types';

interface UniversalIntentStudioProps {
  executionMode: ExecutionAuthorityMode;
  audioRoute: AudioRoutingMode;
  killSwitchActive: boolean;
  onSaveRule: (rule: AutomationRule) => void;
}

const PRESET_INTENT_PROMPTS = [
  'সন্ধ্যায় ড্রয়িং রুমের লাইট ৫০% ব্রাইটনেসে চালু করো এবং এসি ২৬ ডিগ্রিতে রাখো',
  'রান্নাঘরের লাইটের কালার লাল করো এবং ফ্যান ৬০% স্পিডে চালাও',
  'সামনের গেটে কেউ আসলে ক্যামেরা তার দিকে ঘুরিয়ে স্পিকারে জিজ্ঞেস করো কে এসেছে',
  'ব্যাকইয়ার্ডের ক্যামেরা ৩০ ডিগ্রি ডানে ঘোরাও এবং লাইট জ্বালাও',
  'রাত ১২টায় যদি লিভিং রুমে মোশন না থাকে তাহলে সব লাইট ও ফ্যান বন্ধ করো'
];

export const UniversalIntentStudio: React.FC<UniversalIntentStudioProps> = ({
  executionMode,
  audioRoute,
  killSwitchActive,
  onSaveRule
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<FeasibilityAuditResult | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [executedLive, setExecutedLive] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleAnalyzeIntent = async (overridePrompt?: string) => {
    const textToAnalyze = overridePrompt || prompt;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setSavedSuccess(false);
    setExecutedLive(false);

    try {
      const response = await fetch('/api/gemini/intent-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToAnalyze,
          executionMode,
          audioRoute
        })
      });

      if (response.ok) {
        const data: FeasibilityAuditResult = await response.json();
        setAuditResult(data);

        // Auto execute if Full Autonomous Authority is active and kill switch is not on
        if (executionMode === 'FULL_AUTONOMOUS_AUTHORITY' && !killSwitchActive && data.feasibilityStatus === 'FULLY_FEASIBLE') {
          setExecutedLive(true);
        }

        // Play Bengali TTS voice feedback if requested
        if (data.voiceFeedbackBn && 'speechSynthesis' in window) {
          playSpeech(data.voiceFeedbackBn);
        }
      }
    } catch (err) {
      console.error('Intent analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 1.0;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('আপনার ব্রাউজারে Web Speech API সাপোর্ট নেই। অনুগ্রহ করে ক্রোম ব্রাউজার বা টাইপ করে কমান্ড লিখুন।');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
      setIsListening(false);
      handleAnalyzeIntent(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleSaveToPersistentRules = () => {
    if (!auditResult) return;

    const newRule: AutomationRule = {
      id: `rule-${Date.now().toString(36)}`,
      name: auditResult.ruleName,
      nameBn: auditResult.ruleNameBn,
      rawIntent: prompt || 'Universal User Intent',
      triggerType: auditResult.triggerType,
      triggerDetails: auditResult.triggerDetails,
      actions: auditResult.proposedActions,
      enabled: true,
      feasibilityScore: auditResult.feasibilityScore,
      matchedEntities: auditResult.matchedEntities,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      executionCount: executedLive ? 1 : 0
    };

    onSaveRule(newRule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleManualApproveExecute = async () => {
    if (!auditResult || killSwitchActive) return;

    for (const act of auditResult.proposedActions) {
      await fetch('/api/ha/service-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: act.entity_id,
          service: act.service,
          params: act.params
        })
      });
    }
    setExecutedLive(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Studio Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>সহজ এআই ভয়েস ও টেক্সট সহকারী</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ভয়েস কমান্ড ও এআই সহকারী
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              মুখে বলে বা লিখে যেকোনো কাজের নির্দেশ দিন (যেমন: "সন্ধ্যায় ড্রয়িং রুমের লাইট ৫০% করো এবং এসি ২৬ ডিগ্রিতে রাখো")। সিস্টেম আপনার কথা বুঝে প্রয়োজনীয় ডিভাইসে নির্দেশ পাঠিয়ে দেবে।
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>মোড: <strong className="text-cyan-300">{executionMode === 'FULL_AUTONOMOUS_AUTHORITY' ? 'সরাসরি কার্যকর (Auto)' : 'অনুমতি নিয়ে কার্যকর (Approval)'}</strong></span>
          </div>
        </div>

        {/* Input Terminal & Voice Bar */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <input
              type="text"
              id="universal-intent-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeIntent()}
              placeholder="যেকোনো নির্দেশ বাংলায় বা ইংরেজিতে লিখুন... (যেমন: ড্রয়িং রুমের লাইট জ্বালাও এবং এসি ২৬ করো)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-4 pr-28 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans shadow-inner"
            />
            
            <div className="absolute right-2 top-2 flex items-center gap-1.5">
              <button
                id="voice-mic-btn"
                type="button"
                onClick={handleVoiceInput}
                disabled={isAnalyzing}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300'
                }`}
                title="ভয়েসে বলুন (বাংলা / English)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                id="submit-intent-btn"
                type="button"
                onClick={() => handleAnalyzeIntent()}
                disabled={isAnalyzing || !prompt.trim()}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>পাঠান ও চালু করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Prompts Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-xs">
            <span className="text-slate-500 font-mono text-[11px] shrink-0">উদাহরণ:</span>
            {PRESET_INTENT_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(sample);
                  handleAnalyzeIntent(sample);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700 whitespace-nowrap transition-colors text-[11px]"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Feasibility Audit Results Box */}
      {auditResult && (
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          
          {/* Header Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                  auditResult.feasibilityStatus === 'FULLY_FEASIBLE'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : auditResult.feasibilityStatus === 'PARTIALLY_FEASIBLE'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}>
                  {auditResult.feasibilityStatus === 'FULLY_FEASIBLE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {auditResult.feasibilityStatus === 'PARTIALLY_FEASIBLE' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {auditResult.feasibilityStatus === 'INCOMPATIBLE_MISSING_HARDWARE' && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{auditResult.feasibilityStatus} ({auditResult.feasibilityScore}%)</span>
                </span>
                <h3 className="text-lg font-bold text-white">
                  {auditResult.ruleNameBn}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                English Identifier: {auditResult.ruleName} | Trigger: {auditResult.triggerType} ({auditResult.triggerDetails})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playSpeech(auditResult.voiceFeedbackBn)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                title="ভয়েস অডিও শুনুন"
              >
                <Volume2 className={`w-3.5 h-3.5 text-cyan-400 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>ভয়েস শুনুন</span>
              </button>

              <button
                onClick={handleSaveToPersistentRules}
                disabled={savedSuccess}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'সংরক্ষিত হয়েছে' : 'রুল সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </div>

          {/* Feasibility 3-Tier Dynamic Communication Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Voice / Dialogue Feedback */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                <span>ভয়েস ও ইউজার কমিউনিকেশন:</span>
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                "{auditResult.voiceFeedbackBn}"
              </p>
              <div className="text-[11px] text-slate-500 font-mono italic">
                "{auditResult.voiceFeedbackEn}"
              </div>
            </div>

            {/* Box 2: Missing Capability & Workarounds (if partially feasible) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>হার্ডওয়্যার ক্যাপাবিলিটি অডিট:</span>
              </span>
              {auditResult.missingCapabilities.length > 0 ? (
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-rose-300/90 font-mono text-[11px]">
                    অনুপস্থিত: {auditResult.missingCapabilities.join(', ')}
                  </div>
                  <div className="text-slate-300 text-xs bg-amber-950/20 p-2 rounded border border-amber-800/30">
                    <strong className="text-amber-300">বিকল্প সমাধান:</strong> {auditResult.suggestedWorkaround}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-300/90 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সকল টার্গেট ডিভাইসের প্রয়োজনীয় হার্ডওয়্যার ক্যাপাবিলিটি সক্রিয় ও সামঞ্জস্যপূর্ণ।</span>
                </p>
              )}
            </div>

            {/* Box 3: Setup & Hardware Guidance */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>সেটআপ ও ইন্টিগ্রেশন গাইডেন্স:</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {auditResult.setupGuidance || 'হোম অ্যাসিস্ট্যান্ট ওভেন/ইন্টিগ্রেশনে কোনো বাড়তি কনফিগারেশনের প্রয়োজন নেই। সরাসরি এক্সিকিউট করা সম্ভব।'}
              </p>
              <div className="text-[11px] font-mono text-slate-500 pt-1">
                ম্যাচকৃত ডিভাইস: {auditResult.matchedEntities.join(', ') || 'Auto Mesh'}
              </div>
            </div>

          </div>

          {/* Proposed Execution Pipeline Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                প্রস্তাবিত এক্সিকিউশন সিকোয়েন্স (Action Pipeline)
              </span>
              <span className="text-slate-500">{auditResult.proposedActions.length} টি অ্যাকশন স্টেপ</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {auditResult.proposedActions.map((act, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-slate-200 font-bold">{act.entity_id}</span>
                      <span className="text-cyan-400 ml-2">→ {act.service}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    প্যারামিটার: {JSON.stringify(act.params)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Confirmation / Status */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300 font-mono">
              {executedLive ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>কমান্ড সফলভাবে হোম অ্যাসিস্ট্যান্টে এক্সিকিউট করা হয়েছে!</span>
                </span>
              ) : killSwitchActive ? (
                <span className="text-rose-400 font-bold">
                  🛑 মাস্টার কিল-সুইচ অন থাকায় কোনো কমান্ড এক্সিকিউট হবে না।
                </span>
              ) : (
                <span>
                  বর্তমান মোড: <strong className="text-cyan-300">{executionMode === 'FULL_AUTONOMOUS_AUTHORITY' ? 'ফুল অটোমেটিক' : 'অনুমোদন সাপেক্ষ'}</strong>
                </span>
              )}
            </div>

            {!executedLive && !killSwitchActive && (
              <button
                id="manual-confirm-btn"
                onClick={handleManualApproveExecute}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>অনুমোদন দিন ও এক্সিকিউট করুন (Approve & Run)</span>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
