import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  Cpu, 
  Zap, 
  Archive, 
  Database, 
  Layers, 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  FileText, 
  Volume2, 
  Play, 
  Sliders, 
  Server, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  FileCode2, 
  FolderSync, 
  Usb, 
  AlertTriangle 
} from 'lucide-react';
import { StorageDrive, StorageAssetMapping, CompressedDatasetLog, DecompressBenchmarkResult } from '../types';
import { useVoiceSettings } from '../context/VoiceSettingsContext';

export const StorageAndFineTuningStudio: React.FC = () => {
  const [drives, setDrives] = useState<StorageDrive[]>([]);
  const [assetMapping, setAssetMapping] = useState<StorageAssetMapping>({
    modelsDriveId: 'drive-nvme-1',
    trainingDataDriveId: 'drive-nvme-1',
    memoryVectorsDriveId: 'drive-sata-1',
    audioCacheDriveId: 'drive-internal-data',
    autoFailoverEnabled: true,
    fallbackDriveId: 'drive-internal-data'
  });
  const [logs, setLogs] = useState<CompressedDatasetLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<DecompressBenchmarkResult | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'warn' | 'info'; message: string } | null>(null);

  // Form State for dynamic compression
  const [datasetName, setDatasetName] = useState<string>('household_gemini_finetune');
  const [compressionFormat, setCompressionFormat] = useState<'ZSTD_ZST' | 'GZIP_JSONL' | 'MSGPACK_BIN' | 'TAR_XZ'>('ZSTD_ZST');
  const [targetCategory, setTargetCategory] = useState<'FINE_TUNING_DATASET' | 'MODEL_WEIGHTS' | 'VECTOR_EMBEDDING' | 'AST_ROUTINES'>('FINE_TUNING_DATASET');
  const [sampleCount, setSampleCount] = useState<number>(10000);

  const { speakText } = useVoiceSettings();

  // Load drives and telemetry logs
  const fetchData = async () => {
    try {
      const [drivesRes, logsRes] = await Promise.all([
        fetch('/api/storage/drives'),
        fetch('/api/storage/telemetry-logs')
      ]);

      if (drivesRes.ok) {
        const dData = await drivesRes.json();
        if (dData.drives) setDrives(dData.drives);
        if (dData.assetMapping) setAssetMapping(dData.assetMapping);
      }

      if (logsRes.ok) {
        const lData = await logsRes.json();
        if (lData.logs) setLogs(lData.logs);
      }
    } catch (err) {
      console.warn('Storage fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Drive Target Asset Mapping
  const handleSaveMapping = async (newMapping: Partial<StorageAssetMapping>) => {
    const updated = { ...assetMapping, ...newMapping };
    setAssetMapping(updated);
    try {
      const res = await fetch('/api/storage/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setNotification({ type: 'success', message: data.messageBn || 'টার্গেট ড্রাইভ ম্যাপিং সংরক্ষিত হয়েছে।' });
        speakText('স্টোরেজ ড্রাইভের টার্গেট ম্যাপিং সফলভাবে আপডেট হয়েছে।');
      }
    } catch (err) {
      setNotification({ type: 'warn', message: 'ম্যাপিং আপডেট করতে সমস্যা হয়েছে।' });
    }
  };

  // Perform High-Density Compression & Export
  const handleRunCompression = async () => {
    setIsCompressing(true);
    setNotification({ type: 'info', message: 'জেমিনি টিচার ডেটাসেট কমপ্রেস করা হচ্ছে...' });

    try {
      const res = await fetch('/api/storage/compress-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetName,
          format: compressionFormat,
          targetCategory,
          sampleCount
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setLogs(prev => [data.telemetry, ...prev]);
        }
        await fetchData();
        setNotification({ type: 'success', message: data.messageBn });
        
        // Voice Broadcast in Bengali
        if (data.spokenAudioText) {
          speakText(data.spokenAudioText);
        }
      }
    } catch (err) {
      setNotification({ type: 'warn', message: 'কম্প্রেশন প্রক্রিয়ায় ত্রুটি ঘটেছে।' });
    } finally {
      setIsCompressing(false);
    }
  };

  // Run NumPy Direct-RAM Benchmark
  const handleRunBenchmark = async (fileName?: string, format?: string) => {
    setIsBenchmarking(true);
    try {
      const res = await fetch('/api/storage/decompress-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileName || 'knowledge_distill_v3.jsonl.zst',
          format: format || 'ZSTD_ZST'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBenchmarkResult(data.result);
        if (data.result?.messageBn) {
          speakText(data.result.messageBn);
        }
      }
    } catch (err) {
      console.warn('Benchmark error:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  // Simulate Drive Action (Disconnect / Reconnect / Fill)
  const handleDriveSimulation = async (driveId: string, action: string) => {
    try {
      const res = await fetch('/api/storage/simulate-failover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveId, action })
      });
      if (res.ok) {
        const data = await res.json();
        await fetchData();
        setNotification({ type: data.failoverTriggered ? 'warn' : 'success', message: data.messageBn });
        speakText(data.messageBn);
      }
    } catch (err) {
      console.warn('Simulation error:', err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>মাল্টি-ড্রাইভ স্টোরেজ ও হাই-ডেনসিটি কম্প্রেশন হাব</span>
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Zstandard / Direct-RAM
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                জেমিনি ক্লাউড টিচারের প্রশিক্ষণ ডেটাসেট কম্প্রেশন, ফিজিক্যাল এসএসডি ড্রাইভ কন্ট্রোলার এবং পিওর নাম্পাই মেমোরি স্ট্রিমিং।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
              title="ড্রাইভ ও ডেটাসেট রিফ্রেশ করুন"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>রিফ্রেশ</span>
            </button>
            <button
              onClick={() => speakText('মাল্টি-ড্রাইভ স্টোরেজ ও হাই-ডেনসিটি কম্প্রেশন হাব। এখানে এনভিএমই এসএসডি, জেমিনি ট্রেনিং ডেটা কম্প্রেশন এবং নাম্পাই র‍্যাম স্পিড মনিটর করা হয়।')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>বাংলায় শুনুন</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
            notification.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' :
            notification.type === 'warn' ? 'bg-amber-950/70 border-amber-500/40 text-amber-300' :
            'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
          }`}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{notification.message}</span>
            </span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white text-[11px]">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4 Pillars Grid: Core System Architecture Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold">১. ক্লাউড টিচার ব্রেন</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xs text-slate-300 mb-2">
            পারিবারিক কথোপকথন ও বয়োজ্যেষ্ঠদের অভ্যাস থেকে জটিল মাল্টি-ইউজার ইনটেন্ট শেখে।
          </p>
          <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/40">
            Gemini 3.7 Flash Engine
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-indigo-400 uppercase font-bold">২. হাই-ডেনসিটি কম্প্রেশন</span>
            <Archive className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xs text-slate-300 mb-2">
            হাজার হাজার ডায়ালগ ও এএসটি রুটিনকে Zstandard বা MessagePack বাইনারিতে ৮০%+ সংকুচিত করে।
          </p>
          <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/50 px-2 py-1 rounded border border-indigo-800/40">
            Avg Ratio: 87.1% Space Saved
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-purple-400 uppercase font-bold">৩. মাল্টি-ড্রাইভ ডিস্ক পারসিস্টেন্স</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs text-slate-300 mb-2">
            ইউজার-অ্যাসাইন করা এক্সটার্নাল NVMe/SATA এসএসডিতে ডেটা সেভ ও অটো-ফেইলওভার রক্ষা।
          </p>
          <div className="text-[11px] font-mono text-purple-300 bg-purple-950/50 px-2 py-1 rounded border border-purple-800/40">
            Zero-Loss /data/ Failover
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-amber-400 uppercase font-bold">৪. লোকাল নাম্পাই এক্সিকিউশন</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-300 mb-2">
            ডিস্ক বটলনেক ছাড়া সরাসরি র‍্যামে ডিকম্প্রেস করে ইন্টারনেটহীন সাব-5ms গতিতে কাজ করে।
          </p>
          <div className="text-[11px] font-mono text-amber-300 bg-amber-950/50 px-2 py-1 rounded border border-amber-800/40">
            Pure NumPy Direct-RAM
          </div>
        </div>
      </div>

      {/* Section 1: Multi-Drive Hardware Controller */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>সংযুক্ত ফিজিক্যাল স্টোরেজ ড্রাইভ ও হার্ডওয়্যার টেলিমেট্রি</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              হোস্ট অপারেটিং সিস্টেমে (HAOS/Linux) মাউন্ট করা এসএসডি, এনভিএমই ও ব্যাকআপ ড্রাইভের রিয়েল-টাইম স্বাস্থ্য।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>অটো-ফেইলওভার: </span>
            <span className="text-emerald-400 font-bold">সক্রিয় (/data/ ফলব্যাক)</span>
          </div>
        </div>

        {/* Drives Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {drives.map((d) => {
            const usedPct = Math.round((d.usedBytes / d.totalBytes) * 100);
            const isFull = usedPct >= 90;
            const isDisconnected = d.status === 'DISCONNECTED';

            return (
              <div 
                key={d.id}
                className={`bg-slate-950/90 border rounded-2xl p-4 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isDisconnected
                    ? 'border-rose-900/60 bg-rose-950/10'
                    : isFull 
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20' 
                    : 'border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        d.type === 'NVME_SSD' ? 'bg-purple-500/20 text-purple-300' :
                        d.type === 'SATA_SSD' ? 'bg-cyan-500/20 text-cyan-300' :
                        d.type === 'INTERNAL_EMMC' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {d.isRemovable ? <Usb className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {d.type.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs font-bold text-white leading-tight mt-1 line-clamp-1" title={d.name}>
                          {d.name}
                        </h4>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isDisconnected ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      d.health === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isDisconnected ? 'DISCONNECTED' : d.health}
                    </span>
                  </div>

                  {/* Mount Path & Device Node */}
                  <div className="bg-slate-900/80 p-2 rounded-xl text-[11px] font-mono text-slate-300 space-y-1 mb-3 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mount:</span>
                      <span className="text-cyan-300 font-bold">{d.mountPath}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Device:</span>
                      <span className="text-slate-400">{d.deviceNode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed / Temp:</span>
                      <span className="text-emerald-400">{d.readSpeedMBs} MB/s • {d.temperatureC}°C</span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Used: {formatBytes(d.usedBytes)} ({usedPct}%)</span>
                      <span className="text-slate-300 font-bold">Free: {formatBytes(d.freeBytes)}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isDisconnected ? 'bg-slate-700' :
                          isFull ? 'bg-amber-500' : 
                          d.type === 'NVME_SSD' ? 'bg-gradient-to-r from-purple-500 to-indigo-400' :
                          'bg-gradient-to-r from-cyan-500 to-blue-400'
                        }`}
                        style={{ width: `${Math.min(100, usedPct)}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 text-right">
                      মোট সাইজ: {formatBytes(d.totalBytes)}
                    </div>
                  </div>
                </div>

                {/* Simulation Control Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[10px] font-mono">
                  {isDisconnected ? (
                    <button
                      onClick={() => handleDriveSimulation(d.id, 'RECONNECT')}
                      className="w-full py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-center font-bold"
                    >
                      মাউন্ট করুন (Reconnect)
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDriveSimulation(d.id, 'DISCONNECT')}
                        className="px-2 py-1 rounded bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40"
                        title="ফেইলওভার টেস্ট করতে ডিসকানেক্ট করুন"
                      >
                        ডিসকানেক্ট টেস্ট
                      </button>
                      <button
                        onClick={() => handleDriveSimulation(d.id, isFull ? 'RESET_SPACE' : 'FILL_TO_95')}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                        title="স্পেস ফুল হওয়া টেস্ট করুন"
                      >
                        {isFull ? 'রিসেট' : '৯৬% ফুল টেস্ট'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Target Asset Assignment Matrix */}
        <div className="mt-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <FolderSync className="w-4 h-4 text-cyan-400" />
              <span>টার্গেট ড্রাইভ অ্যাসাইনমেন্ট সিলেক্টর (Asset Location Mapping)</span>
            </h4>
            <span className="text-[11px] text-slate-400">কোন এসেট কোন ড্রাইভে সেভ হবে সিলেক্ট করুন:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Models Drive */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <label className="block text-slate-400 font-mono text-[11px] mb-1.5">
                🧠 লোকাল এআই মডেল ফাইল (/models/)
              </label>
              <select
                value={assetMapping.modelsDriveId}
                onChange={(e) => handleSaveMapping({ modelsDriveId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs font-mono focus:border-cyan-500 outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id} disabled={d.status === 'DISCONNECTED'}>
                    {d.name} ({d.mountPath})
                  </option>
                ))}
              </select>
            </div>

            {/* Training Data Drive */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <label className="block text-slate-400 font-mono text-[11px] mb-1.5">
                📦 কমপ্রেসড ট্রেনিং ডেটাসেট (/training_data/)
              </label>
              <select
                value={assetMapping.trainingDataDriveId}
                onChange={(e) => handleSaveMapping({ trainingDataDriveId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs font-mono focus:border-cyan-500 outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id} disabled={d.status === 'DISCONNECTED'}>
                    {d.name} ({d.mountPath})
                  </option>
                ))}
              </select>
            </div>

            {/* Vector DB */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <label className="block text-slate-400 font-mono text-[11px] mb-1.5">
                🧬 ভেক্টর এমবেডিং ও লং-টার্ম মেমোরি DB
              </label>
              <select
                value={assetMapping.memoryVectorsDriveId}
                onChange={(e) => handleSaveMapping({ memoryVectorsDriveId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs font-mono focus:border-cyan-500 outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id} disabled={d.status === 'DISCONNECTED'}>
                    {d.name} ({d.mountPath})
                  </option>
                ))}
              </select>
            </div>

            {/* Audio Cache & WAL */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <label className="block text-slate-400 font-mono text-[11px] mb-1.5">
                🎙️ SQLite WAL ও লোকাল অডিও ক্যাশ
              </label>
              <select
                value={assetMapping.audioCacheDriveId}
                onChange={(e) => handleSaveMapping({ audioCacheDriveId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 text-xs font-mono focus:border-cyan-500 outline-none"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id} disabled={d.status === 'DISCONNECTED'}>
                    {d.name} ({d.mountPath})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: High-Density Compression Runner & Benchmark Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Compression Pipeline */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  হাই-ডেনসিটি ডেটাসেট কম্প্রেশন এক্সপোর্ট পাইপলাইন
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Low Latency Encoder
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              জেমিনি ক্লাউড টিচারের বিশ্লেষণ করা হাজার হাজার ডায়ালগ পেয়ার ও আচরণগত এএসটি রুটিনকে উচ্চ মাত্রার কম্প্রেশনে সংকুচিত করে নির্বাচিত ড্রাইভে সেভ করুন।
            </p>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  ডেটাসেট বা ফাইলের নাম:
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs font-mono focus:border-indigo-500 outline-none"
                  placeholder="e.g. household_gemini_finetune"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    কম্প্রেশন অ্যালগরিদম:
                  </label>
                  <select
                    value={compressionFormat}
                    onChange={(e) => setCompressionFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs font-mono focus:border-indigo-500 outline-none"
                  >
                    <option value="ZSTD_ZST">Zstandard (.jsonl.zst) - সর্বোচ্চ রেশিও</option>
                    <option value="MSGPACK_BIN">MessagePack (.msgpack.gz) - বাইনারি ম্যাট্রিক্স</option>
                    <option value="GZIP_JSONL">Gzip JSONL (.jsonl.gz) - স্ট্রিম-ফ্রেন্ডলি</option>
                    <option value="TAR_XZ">LZMA Archive (.tar.xz) - চেকপয়েন্ট</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    ডাটা ক্যাটাগরি:
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 text-xs font-mono focus:border-indigo-500 outline-none"
                  >
                    <option value="FINE_TUNING_DATASET">পারিবারিক ডায়ালগ ফাইন-টিউনিং</option>
                    <option value="AST_ROUTINES">বয়োজ্যেষ্ঠ অভ্যাস ও এএসটি রুটিন</option>
                    <option value="MODEL_WEIGHTS">নাম্পাই ট্রান্সফরমার ওয়েটস</option>
                    <option value="VECTOR_EMBEDDING">ভেক্টর এমবেডিং মেমোরি</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>রেকর্ড / ডায়ালগ সংখ্যা:</span>
                  <span className="text-indigo-300 font-bold">{sampleCount.toLocaleString()} টি পেয়ার</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={1000}
                  value={sampleCount}
                  onChange={(e) => setSampleCount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={handleRunCompression}
              disabled={isCompressing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCompressing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>হাই-ডেনসিটি কম্প্রেশন এনকোড হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-cyan-300" />
                  <span>⚡ কমপ্রেস ও টার্গেট ড্রাইভে সেভ করুন (Save to Drive)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* On-the-Fly RAM Streaming Benchmark */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  পিওর নাম্পাই ডিরেক্ট-র‍্যাম অন-দ্য-ফ্লাই ডিকম্প্রেশন টেস্ট
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                Zero Disk Latency
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-sans leading-relaxed">
              ডিস্ক ড্রাইভ থেকে সরাসরি র‍্যামে ডিকম্প্রেস করার গতি ও ইনফারেন্স রিসিভিং ব্যান্ডউইডথ পরীক্ষা করুন।
            </p>

            {benchmarkResult ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">পরীক্ষিত ফাইল:</span>
                  <span className="text-cyan-300 font-bold">{benchmarkResult.fileName}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-300">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">ডিকম্প্রেশন লেটেন্সি:</span>
                    <span className="text-base font-bold text-emerald-400">{benchmarkResult.decompressionTimeMs} ms</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">মেমোরি থ্রুপুট:</span>
                    <span className="text-base font-bold text-cyan-400">{benchmarkResult.throughputMBs} MB/s</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">র‍্যাম এলোকেশন:</span>
                    <span className="text-sm font-bold text-purple-400">{benchmarkResult.ramAllocatedMB} MB</span>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Tensor Shape:</span>
                    <span className="text-sm font-bold text-amber-400">[{benchmarkResult.numpyArrayShape.join(', ')}]</span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ইন্টারনেট ছাড়া সরাসরি অফলাইন মেমোরি থেকে এক্সিকিউট করতে সম্পূর্ণ সক্ষম।</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                <Activity className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p className="text-xs text-slate-400 font-mono">
                  এখনো কোনো ডিকম্প্রেশন বেঞ্চমার্ক চালানো হয়নি। নিচের বাটনে ক্লিক করে স্পিড টেস্ট করুন।
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800">
            <button
              onClick={() => handleRunBenchmark()}
              disabled={isBenchmarking}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isBenchmarking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>নাম্পাই মেমোরি স্পিড বেঞ্চমার্ক চলছে...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>🚀 নাম্পাই ডিরেক্ট-র‍্যাম স্পিড বেঞ্চমার্ক টেস্ট করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Fine-Tuning & Training Data Logging Explainer (Detailed Save Telemetry) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-cyan-400" />
              <span>মডেল ফাইন-টিউনিং ও সেভড ডেটাসেট টেলিমেট্রি লগ (Detailed Save Telemetry)</span>
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              ড্রাইভে সংরক্ষিত প্রতিটি কমপ্রেসড আর্কাইভ, স্থান, সাইজ রেশিও এবং সিকিউরিটি চেকসাম।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>মোট সংরক্ষিত আর্কাইভ: </span>
            <span className="text-cyan-400 font-bold">{logs.length} টি</span>
          </div>
        </div>

        {/* Logs Table / Cards */}
        <div className="space-y-3">
          {logs.map((log) => (
            <div 
              key={log.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white font-mono">{log.fileName}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {log.format}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {log.summaryBn || log.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => speakText(log.audioSpokenMessageBn || log.summaryBn)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] flex items-center gap-1.5 transition-all"
                    title="এই সেভ নোটিফিকেশন বাংলায় শুনুন"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ভয়েস শুনুন</span>
                  </button>
                  <button
                    onClick={() => handleRunBenchmark(log.fileName, log.format)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] flex items-center gap-1.5 transition-all"
                    title="এই ফাইলের ডিকম্প্রেশন স্পিড টেস্ট করুন"
                  >
                    <Play className="w-3 h-3 text-amber-400" />
                    <span>বেঞ্চমার্ক</span>
                  </button>
                </div>
              </div>

              {/* Detailed Telemetry Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-2 mt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block">টার্গেট ড্রাইভ:</span>
                  <span className="text-slate-200 font-bold">{log.targetDriveName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ডিরেক্টরি:</span>
                  <span className="text-cyan-400 truncate block" title={log.targetDirectory}>{log.targetDirectory}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">আরিজিনাল সাইজ:</span>
                  <span className="text-slate-300">{formatBytes(log.originalSizeBytes)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">কমপ্রেসড সাইজ:</span>
                  <span className="text-emerald-400 font-bold">{formatBytes(log.compressedSizeBytes)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">সেভড স্পেস:</span>
                  <span className="text-indigo-400 font-bold">{log.compressionRatioPct}% কম্প্রেশন</span>
                </div>
                <div>
                  <span className="text-slate-500 block">সংরক্ষণ সময়:</span>
                  <span className="text-slate-300">{log.createdAt}</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-2">
                <span>SHA-256:</span>
                <span className="text-slate-400 truncate">{log.sha256Checksum}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
