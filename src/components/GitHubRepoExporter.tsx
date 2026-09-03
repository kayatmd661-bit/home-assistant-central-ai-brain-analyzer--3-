import React, { useState } from 'react';
import { 
  GitBranch, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Code
} from 'lucide-react';
import { GITHUB_REPO_FILES } from '../data/repoCodeData';
import { RepoFile } from '../types';

export const GitHubRepoExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RepoFile>(GITHUB_REPO_FILES[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleCopyCode = (content: string, path: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(path);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadFile = (file: RepoFile) => {
    const element = document.createElement('a');
    const fileBlob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = file.path;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAllFiles = () => {
    GITHUB_REPO_FILES.forEach(file => {
      handleDownloadFile(file);
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Production-Ready GitHub Repository Codebase for Humayun Bhai</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              GitHub রিপোজিটরি এক্সপোর্ট ও কোড স্যুট
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              সম্পূর্ণ আর্কিটেকচারটি একটি স্ট্যান্ডার্ড Home Assistant Add-on রিপোজিটরি হিসেবে তৈরি করা হয়েছে। ফাইলগুলো কপি বা ডাউনলোড করে সরাসরি আপনার GitHub অ্যাকাউন্টে পুশ করে হোম অ্যাসিস্ট্যান্টে অ্যাড-অন হিসেবে ব্যবহার করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleCopyCode(selectedFile.content, selectedFile.path)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              {copiedFile === selectedFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === selectedFile.path ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
            </button>

            <button
              onClick={handleDownloadAllFiles}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>সকল ফাইল ডাউনলোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Setup Instructions Card */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>কীভাবে GitHub রিপোজিটরি তৈরি ও Home Assistant-এ যুক্ত করবেন:</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-cyan-400 font-mono font-bold block">ধাপ ১: GitHub Repo তৈরি</span>
            <p className="text-slate-300">
              GitHub-এ একটি নতুন পাবলিক বা প্রাইভেট রিপোজিটরি তৈরি করুন (যেমন: <code className="text-cyan-300 font-mono">edge-ai-master-hub</code>)।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-indigo-400 font-mono font-bold block">ধাপ ২: ফাইলগুলো আপলোড / পুশ</span>
            <p className="text-slate-300">
              ডাউনলোডকৃত <code className="text-indigo-300 font-mono">main.py</code>, <code className="text-indigo-300 font-mono">config.yaml</code>, <code className="text-indigo-300 font-mono">Dockerfile</code> ইত্যাদি ফাইলগুলো আপনার রিপোজিটরির রুট ডিরেক্টরিতে পুশ করুন।
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold block">ধাপ ৩: Home Assistant-এ অ্যাড</span>
            <p className="text-slate-300">
              Home Assistant OS-এর <strong>Settings → Add-ons → Add-on Store → Repositories</strong>-এ গিয়ে আপনার GitHub Repo URL যুক্ত করুন এবং এক ক্লিকে ইনস্টল করুন।
            </p>
          </div>
        </div>
      </div>

      {/* File Tree Explorer & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: File Tree Explorer (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-300 font-bold">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Repository File Tree</span>
          </div>

          <div className="space-y-1.5">
            {GITHUB_REPO_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="font-bold truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] uppercase text-slate-500 shrink-0">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Code Preview (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">{selectedFile.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase">
                  {selectedFile.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyCode(selectedFile.content, selectedFile.path)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                {copiedFile === selectedFile.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFile === selectedFile.path ? 'কপি হয়েছে' : 'কপি'}</span>
              </button>

              <button
                onClick={() => handleDownloadFile(selectedFile)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Box */}
          <div className="relative">
            <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800/90 text-slate-200 overflow-x-auto max-h-[550px] leading-relaxed text-[11px] font-mono scrollbar-thin">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
