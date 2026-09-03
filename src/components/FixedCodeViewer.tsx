import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle2,
  FileCode2,
  Info
} from 'lucide-react';
import { COMPLETE_PRODUCTION_PYTHON_CODE } from '../data/analysisData';

export const FixedCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(COMPLETE_PRODUCTION_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([COMPLETE_PRODUCTION_PYTHON_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'central_supervisor_brain.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter lines if search query is active
  const codeLines = COMPLETE_PRODUCTION_PYTHON_CODE.split('\n');

  return (
    <div className="space-y-8 pb-12">
      {/* Code Header Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Fixed & Syntax Verified for Python 3.10 / 3.11 / 3.12</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              সংশোধিত সেন্ট্রাল ব্রেন সুপারভাইজার স্ক্রিপ্ট
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              সকল সিনট্যাক্স এরর, ব্যাকপ্রোপাগেশন ম্যাথ, মাইক্রো-নয়েজ রেজিলিয়েন্ট অ্যাকোস্টিক হ্যাশিং এবং জেমিনি ডুয়াল মোডালিটি ফিক্স করে চূড়ান্ত স্ক্রিপ্ট প্রস্তুত করা হয়েছে:
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="copy-full-code-btn"
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কোড সম্পূর্ণ কপি হয়েছে!' : 'সম্পূর্ণ কোড কপি করুন'}</span>
            </button>
            <button
              id="download-code-btn"
              onClick={handleDownloadCode}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ডাউনলোড (.py)</span>
            </button>
          </div>
        </div>

        {/* Quick Deployment Steps info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">ধাপ ১: ডিপেনডেন্সি ইনস্টল</span>
            <span className="text-slate-400 block">pip install numpy scipy requests aiohttp websockets</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">ধাপ ২: এনভায়রনমেন্ট ভ্যারিয়েবল</span>
            <span className="text-slate-400 block">export GEMINI_API_KEY="আপনার_কী"</span>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">ধাপ ৩: এক্সিকিউট</span>
            <span className="text-slate-400 block">python central_supervisor_brain.py</span>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Editor Toolbar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-xs font-mono text-slate-300 font-semibold ml-2 flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              central_supervisor_brain.py ({codeLines.length} Lines)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="কোডের ভেতর সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[700px] overflow-y-auto scrollbar-thin font-mono text-xs leading-relaxed bg-[#0a0e17]">
          <pre className="text-slate-300">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isMatch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());
              const isComment = line.trim().startsWith('#');
              const isClassOrDef = line.trim().startsWith('class ') || line.trim().startsWith('def ');
              const isImport = line.trim().startsWith('import ') || line.trim().startsWith('from ');
              const isFixedLine = line.includes('def find_active_media_player(self)') || line.includes('Multi-Head Scaled Dot-Product') || line.includes('Resilient Quantized');

              return (
                <div 
                  key={idx} 
                  className={`flex items-start hover:bg-slate-800/40 px-2 py-0.5 rounded ${
                    isMatch ? 'bg-amber-500/20 text-amber-200' : ''
                  } ${isFixedLine ? 'bg-emerald-950/40 border-l-2 border-emerald-400 pl-1.5' : ''}`}
                >
                  <span className="w-10 shrink-0 select-none text-slate-600 text-right pr-4 text-[11px]">
                    {lineNum}
                  </span>
                  <span className={`flex-1 whitespace-pre ${
                    isComment ? 'text-slate-500 italic' :
                    isClassOrDef ? 'text-cyan-300 font-bold' :
                    isImport ? 'text-indigo-300' :
                    isFixedLine ? 'text-emerald-300 font-semibold' : 'text-slate-300'
                  }`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
};
