import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Eye, 
  Play, 
  Pause, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Search, 
  Filter, 
  Radio, 
  Zap, 
  Layers, 
  Cpu, 
  Home, 
  Clock, 
  Sliders, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Unlock, 
  Terminal, 
  Maximize2,
  ListFilter,
  BarChart3,
  Network
} from 'lucide-react';
import { GlobalAutomationAuditItem, AutomationExecutionEvent } from '../types';

interface AdminGlobalAuditPanelProps {
  killSwitchActive: boolean;
  onNavigateToCanvas?: () => void;
}

export const AdminGlobalAuditPanel: React.FC<AdminGlobalAuditPanelProps> = ({
  killSwitchActive,
  onNavigateToCanvas
}) => {
  const [automations, setAutomations] = useState<GlobalAutomationAuditItem[]>([]);
  const [events, setEvents] = useState<AutomationExecutionEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRoom, setFilterRoom] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedAuto, setSelectedAuto] = useState<GlobalAutomationAuditItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [overrideMsg, setOverrideMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [livePulseRoom, setLivePulseRoom] = useState<string | null>(null);

  // Fetch initial audit data & events
  const fetchAuditData = async () => {
    try {
      setIsRefreshing(true);
      const [autosRes, eventsRes] = await Promise.all([
        fetch('/api/admin/global-automations').catch(() => null),
        fetch('/api/admin/activity-feed').catch(() => null)
      ]);

      if (autosRes?.ok) {
        const data = await autosRes.json();
        setAutomations(data.automations || []);
      }
      if (eventsRes?.ok) {
        const evData = await eventsRes.json();
        setEvents(evData.events || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
    const interval = setInterval(fetchAuditData, 4000); // Polling real-time stream every 4s
    return () => clearInterval(interval);
  }, []);

  // Admin Override Actions
  const handleAdminOverride = async (automationId: string, action: 'PAUSE' | 'RESUME' | 'DELETE') => {
    try {
      const res = await fetch('/api/admin/automation-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automationId, action })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOverrideMsg({
          text: `অ্যাডমিন ওভাররাইড সফল: ${action === 'PAUSE' ? 'অটোমেশন স্থগিত করা হয়েছে' : action === 'RESUME' ? 'পুনরায় সক্রিয় করা হয়েছে' : 'মুছে ফেলা হয়েছে'}।`,
          type: 'success'
        });
        fetchAuditData();
      } else {
        setOverrideMsg({
          text: data.error || 'ওভাররাইড কার্যকর করা সম্ভব হয়নি',
          type: 'error'
        });
      }
    } catch (err: any) {
      setOverrideMsg({ text: err.message || 'Error communicating with server', type: 'error' });
    }
    setTimeout(() => setOverrideMsg(null), 4000);
  };

  // Filtered automations
  const filteredAutomations = automations.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.entitiesAffected.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRoom = filterRoom === 'ALL' || a.originRoomId === filterRoom;
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;

    return matchesSearch && matchesRoom && matchesStatus;
  });

  // Unique rooms list for filter (guaranteed unique by roomId)
  const roomMap = new Map<string, { id: string; name: string; nameBn: string }>();
  automations.forEach(a => {
    if (a.originRoomId && !roomMap.has(a.originRoomId)) {
      roomMap.set(a.originRoomId, {
        id: a.originRoomId,
        name: a.originRoomName || a.originRoomId,
        nameBn: a.originRoomNameBn || a.originRoomName || a.originRoomId
      });
    }
  });
  const roomList: { id: string; name: string; nameBn: string }[] = Array.from(roomMap.values());

  // Trigger live visual pulse simulation
  const handleSimulatePulse = (roomId: string) => {
    setLivePulseRoom(roomId);
    setTimeout(() => setLivePulseRoom(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Header & Strict Isolation Identity Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>নিরাপত্তা ও কেন্দ্রীয় অডিট কন্ট্রোল</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span>👑 অ্যাডমিন গ্লোবাল অটোমেশন ও অ্যাক্টিভিটি মনিটর</span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                পূর্ণ নিয়ন্ত্রণ
              </span>
            </h2>
            <p className="text-slate-400 text-xs font-mono max-w-3xl">
              বাড়ির সব রুমের সক্রিয় ও বন্ধ থাকা অটোমেশনগুলো একনজরে দেখুন, লাইভ ইভেন্ট মনিটর করুন এবং প্রয়োজন অনুযায়ী যেকোনো রুলস চালু, বন্ধ বা মুছে ফেলুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchAuditData}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'সিঙ্ক হচ্ছে...' : 'রিফ্রেশ করুন'}</span>
            </button>

            {onNavigateToCanvas && (
              <button
                onClick={onNavigateToCanvas}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                <Network className="w-4 h-4" />
                <span>ফ্লো-চার্ট ক্যানভাস দেখুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-mono">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">মোট অটোমেশন</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{automations.length} টি</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">সব রুম মিলিয়ে</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">সক্রিয় অটোমেশন</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              {automations.filter(a => a.status === 'ACTIVE').length} টি
            </div>
            <div className="text-[10px] text-emerald-500 font-mono mt-0.5">বর্তমানে চালু রয়েছে</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">সাময়িক বন্ধ / পজড</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {automations.filter(a => a.status === 'PAUSED').length} টি
            </div>
            <div className="text-[10px] text-amber-500 font-mono mt-0.5">স্থগিত রাখা হয়েছে</div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-mono">লাইভ ইভেন্ট হিস্ট্রি</div>
            <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">{events.length} টি</div>
            <div className="text-[10px] text-purple-300 font-mono mt-0.5">সাম্প্রতিক অ্যাক্টিভিটি</div>
          </div>
        </div>

        {/* Feedback / Override notification */}
        {overrideMsg && (
          <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 border ${
            overrideMsg.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
              : 'bg-rose-950/60 text-rose-300 border-rose-800'
          }`}>
            {overrideMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{overrideMsg.text}</span>
          </div>
        )}
      </div>

      {/* 4. Visual Cross-Room Activity Map (Dynamic Real-Time Glow) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              ভিজ্যুয়াল ক্রস-রুম অ্যাক্টিভিটি ম্যাপ (Live Real-Time Glowing Grid)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            Auto-Sync Pulse Activated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {roomList.map(room => {
            const roomAutos = automations.filter(a => a.originRoomId === room.id);
            const isPulsing = livePulseRoom === room.id;
            const isMaster = room.id === 'room-master-bed';

            return (
              <div
                key={room.id}
                onClick={() => handleSimulatePulse(room.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isPulsing
                    ? 'ring-2 ring-cyan-400 bg-cyan-950/50 border-cyan-500 shadow-xl shadow-cyan-500/30 scale-[1.02]'
                    : isMaster
                    ? 'bg-slate-950/90 border-purple-900/60 hover:border-purple-500/50'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Glowing Indicator for active trigger */}
                {isPulsing && (
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-pulse" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    isMaster 
                      ? 'bg-purple-950 text-purple-300 border-purple-800' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {isMaster ? '👑 Admin Hub' : '🛡️ Isolated Room'}
                  </span>

                  <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{roomAutos.length} রুলস</span>
                  </span>
                </div>

                <div className="text-sm font-bold text-white truncate">{room.nameBn || room.name}</div>
                <div className="text-xs text-slate-400 font-mono truncate mt-0.5">{room.name}</div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>স্ট্যাটাস: <strong className="text-emerald-400">অনলাইন</strong></span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulatePulse(room.id);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    সিগন্যাল পালস
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Left (Global Overview List) & Right (Real-Time Execution Logs) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* 2. Global Automation Overview Dashboard (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  গ্লোবাল অটোমেশন ওভারভিউ ও রিমোট ম্যানেজমেন্ট
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                ফিল্টারকৃত: {filteredAutomations.length} টি
              </span>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="relative sm:col-span-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="খুঁজুন (নাম বা ডিভাইস)..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <select
                  value={filterRoom}
                  onChange={(e) => setFilterRoom(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="ALL">সকল রুম (All Rooms)</option>
                  {roomList.map(r => (
                    <option key={r.id} value={r.id}>{r.nameBn || r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="ALL">সকল স্ট্যাটাস</option>
                  <option value="ACTIVE">সক্রিয় (Active)</option>
                  <option value="PAUSED">স্থগিত (Paused)</option>
                </select>
              </div>
            </div>

            {/* List of Automations with 1-Click Remote Authority */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredAutomations.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-400 text-xs font-mono">
                  কোনো অটোমেশন রুল পাওয়া যায়নি।
                </div>
              ) : (
                filteredAutomations.map(auto => {
                  const isActive = auto.status === 'ACTIVE';

                  return (
                    <div
                      key={auto.id}
                      onClick={() => setSelectedAuto(auto)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer font-mono ${
                        selectedAuto?.id === auto.id
                          ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">
                              {auto.nameBn || auto.name}
                            </h4>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono uppercase ${
                              isActive ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}>
                              {auto.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{auto.name}</p>
                        </div>

                        {/* 5. 1-Click Remote Override Controls */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleAdminOverride(auto.id, isActive ? 'PAUSE' : 'RESUME')}
                            className={`p-2 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                              isActive
                                ? 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border-amber-800/60'
                                : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60'
                            }`}
                            title={isActive ? 'অটোমেশনটি সাময়িক স্থগিত করুন' : 'অটোমেশনটি পুনরায় সক্রিয় করুন'}
                          >
                            {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span className="text-[10px] hidden sm:inline">{isActive ? 'পজ' : 'চালু'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি নিশ্চিত যে '${auto.nameBn || auto.name}' সম্পূর্ণ মুছে ফেলতে চান?`)) {
                                handleAdminOverride(auto.id, 'DELETE');
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-all cursor-pointer"
                            title="অটোমেশন ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Origin Room and Target Entities */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <Home className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-slate-500">উৎস রুম:</span>
                          <span className="text-slate-200 font-bold">{auto.originRoomNameBn || auto.originRoomName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="text-slate-500">ট্রিগার:</span>
                          <span className="text-slate-300 truncate">{auto.triggerDetails || auto.triggerType}</span>
                        </div>
                      </div>

                      {/* Affected Entities Pills */}
                      {auto.entitiesAffected && auto.entitiesAffected.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {auto.entitiesAffected.map(ent => (
                            <span key={ent} className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono">
                              🔌 {ent}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 3. Real-Time Execution Logs & Activity Feed (5 Cols) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  রিয়েল-টাইম এক্সিকিউশন ও অ্যাক্টিভিটি ফিড
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              বাড়ির যে কোনো আউটার রুম বা কমান্ড থেকে তৈরি/ট্রিগার হওয়া প্রতিটি ইভেন্টের রিয়েল-টাইম অডিট ট্রেইল।
            </p>

            {/* Event List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
              {events.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-400 text-xs font-mono">
                  কোনো ইভেন্ট লগ পাওয়া যায়নি।
                </div>
              ) : (
                events.map(evt => {
                  let badgeStyle = 'bg-cyan-950 text-cyan-300 border-cyan-800';
                  if (evt.actionType === 'CREATED') badgeStyle = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                  if (evt.actionType === 'TRIGGERED') badgeStyle = 'bg-indigo-950 text-indigo-300 border-indigo-800';
                  if (evt.actionType === 'PAUSED' || evt.actionType === 'DELETED') badgeStyle = 'bg-rose-950 text-rose-300 border-rose-800';
                  if (evt.actionType === 'ADMIN_OVERRIDE') badgeStyle = 'bg-purple-950 text-purple-300 border-purple-800';

                  return (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-1.5 font-mono text-xs hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <span className={`px-1.5 py-0.2 rounded border font-bold uppercase ${badgeStyle}`}>
                          {evt.actionType}
                        </span>
                        <span className="text-slate-500">{evt.timestamp}</span>
                      </div>

                      <div className="text-xs font-bold text-white font-sans">
                        {evt.detailsBn}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                        <span className="text-cyan-400 font-bold">📍 {evt.originRoomNameBn || evt.originRoomName}</span>
                        <span className="text-slate-500 truncate max-w-[150px]">{evt.automationTitle}</span>
                      </div>

                      {evt.entitiesAffected && evt.entitiesAffected.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {evt.entitiesAffected.map(ent => (
                            <span key={ent} className="text-[8px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {ent}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
