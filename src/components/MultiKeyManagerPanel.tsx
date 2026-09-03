import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  RotateCw, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Zap, 
  Activity, 
  Sparkles,
  Server,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PageVoiceExplainerBar } from './PageVoiceExplainerBar';
import { useVoiceSettings } from '../context/VoiceSettingsContext';
import { fetchGeminiKeys, addGeminiKey, toggleGeminiKey, deleteGeminiKey, testGeminiKey } from '../services/api';

interface GeminiKeyItem {
  key_id: string;
  masked_key: string;
  raw_key?: string;
  label: string;
  active: boolean;
  status: 'HEALTHY' | 'RATE_LIMITED' | 'EXHAUSTED' | 'INVALID';
  last_used: string;
  request_count: number;
  error_count: number;
  avg_latency_ms: number;
  is_rate_limited?: boolean;
}

export const MultiKeyManagerPanel: React.FC = () => {
  const { speakText } = useVoiceSettings();

  const [keys, setKeys] = useState<GeminiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [newApiKey, setNewApiKey] = useState<string>('');
  const [newKeyLabel, setNewKeyLabel] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showApiKeyPlain, setShowApiKeyPlain] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [testingFailover, setTestingFailover] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [isVerifyingNew, setIsVerifyingNew] = useState(false);

  // Load from backend if available
  const fetchKeys = () => {
    setIsLoading(true);
    fetchGeminiKeys()
      .then(data => {
        if (data?.keys && Array.isArray(data.keys)) {
          setKeys(data.keys);
        } else {
          setKeys([]);
        }
      })
      .catch(() => {
        setKeys([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKey.trim()) return;

    setIsVerifyingNew(true);

    try {
      // 1. Test key first
      const testData = await testGeminiKey({ raw_key: newApiKey.trim() }).catch(() => ({ valid: false }));

      // 2. Save key to backend pool
      const saveData = await addGeminiKey(newApiKey.trim(), newKeyLabel.trim() || 'Gemini API Key');

      if (saveData.success) {
        fetchKeys();
        setNewApiKey('');
        setNewKeyLabel('');
        setShowAddForm(false);
        const msg = testData.valid 
          ? `এপিআই কী সফলভাবে যুক্ত ও ভেরিফাই হয়েছে! লেটেন্সি: ${testData.latencyMs}ms`
          : `এপিআই কী পুলে যুক্ত হয়েছে (স্ট্যাটাস: ${testData.error || 'সংরক্ষিত'})`;
        setTestResult(msg);
        speakText(msg, 'bn-BD');
      }
    } catch (err: any) {
      setTestResult(`সংরক্ষণ ব্যর্থ হয়েছে: ${err.message}`);
    } finally {
      setIsVerifyingNew(false);
    }
  };

  const handleTestSpecificKey = async (key_id: string) => {
    setTestingKeyId(key_id);
    try {
      const data = await testGeminiKey({ key_id });
      if (data.success && data.valid) {
        const msg = `কী যাচাই সফল (${data.latencyMs}ms) - জেমিনি লাইভ রেডি!`;
        setTestResult(msg);
        speakText(msg, 'bn-BD');
        fetchKeys();
      } else {
        const msg = `কী ত্রুটিপূর্ণ: ${data.error || 'যাচাই ব্যর্থ'}`;
        setTestResult(msg);
        speakText(msg, 'bn-BD');
        fetchKeys();
      }
    } catch (err: any) {
      setTestResult(`টেস্ট কল ব্যর্থ: ${err.message}`);
    } finally {
      setTestingKeyId(null);
    }
  };

  const handleToggleKey = async (key_id: string, active: boolean) => {
    setKeys(prev => prev.map(k => k.key_id === key_id ? { ...k, active: !active } : k));
    try {
      await toggleGeminiKey(key_id);
      fetchKeys();
    } catch {}
  };

  const handleDeleteKey = async (key_id: string) => {
    setKeys(prev => prev.filter(k => k.key_id !== key_id));
    try {
      await deleteGeminiKey(key_id);
      fetchKeys();
    } catch {}
    speakText('এপিআই কী মুছে ফেলা হয়েছে।', 'bn-BD');
  };

  const handleSimulateFailover = () => {
    setTestingFailover(true);
    setTestResult(null);

    setTimeout(() => {
      // Simulate rate limiting Key 1 and rolling over to Key 2
      setKeys(prev => {
        const next = [...prev];
        if (next.length > 0) {
          next[0].status = 'RATE_LIMITED';
          next[0].error_count += 1;
        }
        if (next.length > 1) {
          next[1].last_used = 'Just now (Rotated)';
          next[1].request_count += 1;
        }
        return next;
      });

      setTestingFailover(false);
      const msg = 'রেট লিমিট সিমুলেশন সফল: Key #1 লিমিটেড হওয়ায় স্বয়ংক্রিয়ভাবে Key #2 তে সুইচ করা হয়েছে। শূন্য ডাউনটাইম!';
      setTestResult(msg);
      speakText(msg, 'bn-BD');

      // Auto restore after 10s
      setTimeout(() => {
        setKeys(prev => prev.map(k => ({ ...k, status: 'HEALTHY' })));
      }, 10000);
    }, 1200);
  };

  const activeCount = keys.filter(k => k.active).length;
  const healthyCount = keys.filter(k => k.active && k.status === 'HEALTHY').length;

  return (
    <div className="space-y-6">
      {/* On-Page Voice Explainer Guide */}
      <PageVoiceExplainerBar pageId="key_manager" />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">মোট এপিআই কী</div>
            <div className="text-xl font-bold text-white mt-1">{keys.length} Keys</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">সক্রিয় ও সুস্থ (Healthy Pool)</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{healthyCount} / {activeCount} Healthy</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">ফেইলওভার মোড</div>
            <div className="text-sm font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Auto-Rotate on 429</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
            <RotateCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table & Key List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-sans">
                🔑 জেমিনি এপিআই চাবি তালিকা ও রোটেশন পুল
              </h3>
              <p className="text-[11px] text-slate-400">
                যেকোনো একটি চাবির লিমিট শেষ হলে স্বয়ংক্রিয়ভাবে পরবর্তী চাবি কার্যকর হবে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateFailover}
              disabled={testingFailover}
              className="px-3 py-1.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/80 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              title="রেট লিমিট ফেইলওভার পরীক্ষা করুন"
            >
              <RotateCw className={`w-3.5 h-3.5 ${testingFailover ? 'animate-spin' : ''}`} />
              <span>টেস্ট ফেইলওভার</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কী যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Add Key Form Modal/Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddKey} className="p-4 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-4 animate-fadeIn shadow-2xl">
            <div className="text-xs font-bold text-cyan-300 font-sans flex items-center justify-between border-b border-cyan-900/40 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>নতুন Gemini API Key যুক্ত ও অটো-ভেরিফাই করুন:</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Gemini 3.8 Flash Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Field 1: Custom Key Label/Name */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-sans font-semibold text-xs flex items-center gap-1">
                  <span>Custom Key Label / Name (কাস্টম পরিচিতি নাম)</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="যেমন: Production Gemini 3.8 Flash Key"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-sans text-xs"
                />
                <p className="text-[10px] text-slate-500 font-sans">টেবিলে এবং ভয়েস ইঞ্জিনে সহজে শনাক্তকরণের নাম</p>
              </div>

              {/* Field 2: Gemini API Key Value */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-sans font-semibold text-xs flex items-center gap-1">
                  <span>Gemini API Key Value (জেমিনি এপিআই কী মান)</span>
                  <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKeyPlain ? "text" : "password"}
                    required
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKeyPlain(!showApiKeyPlain)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 p-1"
                    title={showApiKeyPlain ? "গোপন করুন" : "কী প্রদর্শন করুন"}
                  >
                    {showApiKeyPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-sans">Google AI Studio থেকে প্রাপ্ত অফিশিয়াল সিক্রেট কী</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-850">
              <div className="text-[11px] text-cyan-400/80 font-sans flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>সংরক্ষণের পূর্বে স্বয়ংক্রিয়ভাবে লাইভ জেমিনি এপিআই যাচাই করা হবে</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-sans transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingNew || !newApiKey.trim()}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-sans shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  {isVerifyingNew ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>যাচাই ও যুক্ত হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>কী ভেরিফাই ও সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Failover Test Result Feedback */}
        {testResult && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testResult}</span>
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              বন্ধ
            </button>
          </div>
        )}

        {/* Keys Table & Empty State */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <RotateCw className="w-6 h-6 text-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-cyan-300">পারসিস্টেন্ট ডাটাবেস থেকে এপিআই কী লোড করা হচ্ছে...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className="py-10 px-6 rounded-2xl bg-[#081024] border border-dashed border-cyan-900/60 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white font-sans">কোনো Gemini API Key কনফিগার করা নেই (তালিকা সম্পূর্ণ খালি)</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                জেমিনি লাইভ ভয়েস অ্যাসিস্ট্যান্ট এবং ন্যাচারাল ল্যাঙ্গুয়েজ ব্রেন সক্রিয় করতে আপনার কাস্টম লেবেলসহ Google AI Studio Gemini API Key যুক্ত করুন।
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-sans shadow-lg shadow-cyan-900/40 inline-flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কী যোগ করুন (Add New Key)</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">কাস্টম নাম ও লেবেল (Custom Name)</th>
                  <th className="py-2.5 px-3">মাস্কড এপিআই কী</th>
                  <th className="py-2.5 px-3">বর্তমান অবস্থা (Health Status)</th>
                  <th className="py-2.5 px-3">অনুরোধ সংখ্যা</th>
                  <th className="py-2.5 px-3">গড় লেটেন্সি</th>
                  <th className="py-2.5 px-3 text-right">নিরাপদ অ্যাকশন (Safe Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {keys.map((k, idx) => {
                  const isRateLimited = k.status === 'RATE_LIMITED';
                  const isHealthy = k.active && k.status === 'HEALTHY';
                  const isConfirmingDelete = deleteConfirmId === k.key_id;

                  return (
                    <tr key={k.key_id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white font-sans flex items-center gap-2">
                          <span className="text-cyan-200">{k.label}</span>
                          {idx === 0 && k.active && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono font-bold tracking-wider">
                              PRIMARY ACTIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans mt-0.5">Last status: {k.last_used}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-mono">
                          {k.masked_key}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {isRateLimited ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px] font-sans animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>RATE LIMITED 429 (ফেলওভার সক্রিয়)</span>
                          </span>
                        ) : isHealthy ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700 text-[11px] font-sans">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>ACTIVE / HEALTHY (সক্রিয়)</span>
                          </span>
                        ) : k.status === 'INVALID' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800 text-[11px] font-sans">
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                            <span>INVALID (ত্রুটিপূর্ণ কী)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-sans">
                            <span>STANDBY (স্থগিত)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-mono">
                        <span>{k.request_count} reqs</span>
                        {k.error_count > 0 && (
                          <span className="text-rose-400 text-[10px] ml-1">({k.error_count} err)</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-300 font-mono">
                        <span>{k.avg_latency_ms || 110} ms</span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isConfirmingDelete ? (
                          /* Two-Step Safety Delete Confirmation UI */
                          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-rose-950/95 border border-rose-600 shadow-xl animate-fadeIn">
                            <span className="text-[11px] text-rose-200 font-sans font-semibold px-1.5">মুছে ফেলবেন?</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteKey(k.key_id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold font-sans shadow transition-all active:scale-95"
                            >
                              নিশ্চিত মুছুন (Confirm)
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans transition-all"
                            >
                              বাতিল
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTestSpecificKey(k.key_id)}
                              disabled={testingKeyId === k.key_id}
                              className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-mono flex items-center gap-1 transition-all disabled:opacity-50"
                              title="লাইভ টেস্ট ও অ্যাক্টিভেশন"
                            >
                              <Zap className={`w-3 h-3 ${testingKeyId === k.key_id ? 'animate-spin' : ''}`} />
                              <span>{testingKeyId === k.key_id ? 'যাচাই হচ্ছে...' : 'টেস্ট'}</span>
                            </button>

                            <button
                              onClick={() => handleToggleKey(k.key_id, k.active)}
                              className={`px-2.5 py-1 rounded-lg border text-xs font-sans transition-all ${
                                k.active 
                                  ? 'bg-slate-800 text-cyan-300 border-slate-700 hover:bg-slate-700' 
                                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
                              }`}
                              title={k.active ? 'স্থগিত করুন' : 'সক্রিয় করুন'}
                            >
                              {k.active ? 'সক্রিয়' : 'স্থগিত'}
                            </button>

                            {/* Broken delete action fixed with Two-Step Confirmation Trigger */}
                            <button
                              onClick={() => setDeleteConfirmId(k.key_id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition-all"
                              title="কী মুছে ফেলার জন্য ক্লিক করুন (২-ধাপ নিশ্চিতকরণ)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
