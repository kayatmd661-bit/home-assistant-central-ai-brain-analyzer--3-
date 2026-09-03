import React from 'react';
import { useExplainMode } from '../context/ExplainModeContext';
import { useVoiceSettings } from '../context/VoiceSettingsContext';
import { Sparkles, Volume2, X, HelpCircle, Radio, PauseCircle, Play } from 'lucide-react';

export const GlobalTouchExplainer: React.FC = () => {
  const { isExplainModeActive, toggleExplainMode, activeExplainedElement, dismissExplanation } = useExplainMode();
  const { isSpeaking, stopSpeaking } = useVoiceSettings();

  if (!isExplainModeActive && !activeExplainedElement) return null;

  return (
    <div id="explain-mode-floating-bar" className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)]">
      {/* Active Explanation Speech Card */}
      {activeExplainedElement && (
        <div className="mb-3 bg-slate-900/95 border border-cyan-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300 ring-2 ring-cyan-500/20">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold tracking-wider">
                  {activeExplainedElement.category || 'কন্ট্রোল বিবরণ'}
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {activeExplainedElement.title}
                </h4>
              </div>
            </div>
            <button
              onClick={dismissExplanation}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
            {activeExplainedElement.descriptionBn}
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3 h-3 animate-ping" />
              <span>{isSpeaking ? 'বাংলায় কথা বলছে...' : 'শোনা শেষ হয়েছে'}</span>
            </span>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1"
              >
                <PauseCircle className="w-3 h-3" />
                <span>থামুন</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Explain Mode Indicator Pill */}
      {isExplainModeActive && (
        <div id="explain-mode-banner" className="bg-gradient-to-r from-cyan-950/95 via-indigo-950/95 to-purple-950/95 border border-cyan-400/50 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-cyan-200">
              🎯 স্পর্শ ভয়েস গাইড সক্রিয়
            </span>
            <span className="hidden sm:inline text-[11px] text-slate-400">
              (যেকোনো বাটনে ক্লিক করুন)
            </span>
          </div>

          <button
            onClick={toggleExplainMode}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono font-semibold transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      )}
    </div>
  );
};
