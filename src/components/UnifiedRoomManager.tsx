import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Mic, 
  MicOff,
  Volume2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sliders, 
  Zap, 
  Activity, 
  Radio, 
  Cpu, 
  Server, 
  ShieldCheck, 
  ShieldAlert,
  Shield,
  Lock, 
  Unlock,
  Layers, 
  Sparkles, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Sofa,
  Bed,
  Utensils,
  DoorOpen,
  Bath,
  Tv,
  Thermometer,
  Lightbulb,
  Fan,
  Camera,
  CornerDownRight,
  Send,
  AudioLines,
  Key,
  Users,
  CheckSquare,
  Square,
  SlidersHorizontal,
  VolumeX
} from 'lucide-react';
import { 
  RoomProfile, 
  RoomHardwareMap, 
  RoomAutomation, 
  WakeWordConfig, 
  SpatialVoiceEvent, 
  HardwareEntity, 
  HostAudioInterface, 
  SecurityAuditLog 
} from '../types';

interface UnifiedRoomManagerProps {
  killSwitchActive: boolean;
}

const AVAILABLE_ICONS: { [key: string]: any } = {
  Sofa,
  Bed,
  Utensils,
  DoorOpen,
  Bath,
  Tv,
  Home,
  Camera
};

const COLOR_OPTIONS = [
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Indigo', hex: '#6366f1' }
];

export const UnifiedRoomManager: React.FC<UnifiedRoomManagerProps> = ({ killSwitchActive }) => {
  // Navigation View Tab within Unified Room Manager
  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'rbac-security' | 'hardware-audio' | 'live-stream'>('rooms');

  // Core Data States
  const [rooms, setRooms] = useState<RoomProfile[]>([]);
  const [hardwareMaps, setHardwareMaps] = useState<RoomHardwareMap[]>([]);
  const [hostInterfaces, setHostInterfaces] = useState<HostAudioInterface[]>([]);
  const [entities, setEntities] = useState<HardwareEntity[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);
  const [wakeConfig, setWakeConfig] = useState<WakeWordConfig>({
    wakeWordName: 'Hey Brain (হেই ব্রেইন)',
    sensitivityThreshold: 0.85,
    audioDriver: 'ALSA',
    sampleRate: 16000,
    fftFrameSize: 512,
    mfccCoefficients: 13,
    energyThresholdDb: -42.0,
    autoGainControl: true,
    activeProfilesCount: 4
  });
  const [spatialEvents, setSpatialEvents] = useState<SpatialVoiceEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  
  // Room Edit / Creation State
  const [isEditingRoom, setIsEditingRoom] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Partial<RoomProfile>>({
    name: '',
    nameBn: '',
    floor: '1st Floor',
    icon: 'Sofa',
    color: '#06b6d4',
    associatedEntities: [],
    microphoneInputId: '',
    speakerOutputId: '',
    wakeWordOverride: '',
    isAdminRoom: false,
    accessScope: 'RESTRICTED_LOCAL',
    allowedCrossRoomPermissions: [],
    automations: []
  });

  // Room Automation Editor State
  const [activeAutomationRoomId, setActiveAutomationRoomId] = useState<string | null>(null);
  const [newAuto, setNewAuto] = useState<{ name: string; nameBn: string; voiceShortcut: string; entityId: string; service: string }>({
    name: '',
    nameBn: '',
    voiceShortcut: '',
    entityId: '',
    service: 'turn_on'
  });

  // Live Spatial Voice Simulator & Security Tester State
  const [simOriginRoomId, setSimOriginRoomId] = useState<string>('room-living');
  const [simCommandText, setSimCommandText] = useState<string>('লাইট অন করো');
  const [isSimulatingVoice, setIsSimulatingVoice] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);
  const [liveAudioWave, setLiveAudioWave] = useState<number[]>([15, 30, 48, 85, 98, 62, 35, 20, 45, 75, 90, 42, 25]);

  // Live Web/Mobile Microphone Streamer (WebAudio API)
  const [isLiveMicStreaming, setIsLiveMicStreaming] = useState<boolean>(false);
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micStreamError, setMicStreamError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [roomsRes, hwRes, entRes, wakeRes, eventsRes, hostRes, logsRes] = await Promise.all([
        fetch('/api/rooms').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/rooms/hardware-map').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/ha/entities').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/wakeword/config').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/rooms/spatial-events').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/host/audio-interfaces').then(r => r.ok ? r.json() : null).catch(() => ({ interfaces: [] })),
        fetch('/api/security/audit-logs').then(r => r.ok ? r.json() : null).catch(() => ({ logs: [] }))
      ]);

      if (roomsRes?.rooms) {
        setRooms(roomsRes.rooms);
        if (roomsRes.rooms.length > 0 && !selectedRoomId) {
          setSelectedRoomId(roomsRes.rooms[0].id);
        }
      }
      if (hwRes?.hardwareMaps) setHardwareMaps(hwRes.hardwareMaps);
      if (entRes?.entities) setEntities(entRes.entities);
      if (wakeRes?.config) setWakeConfig(wakeRes.config);
      if (eventsRes?.events) setSpatialEvents(eventsRes.events);
      if (hostRes?.interfaces) setHostInterfaces(hostRes.interfaces);
      if (logsRes?.logs) setSecurityLogs(logsRes.logs);
    } catch {
      // Safe fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // WebAudio API Microphone Streaming
  const startLiveMicStreaming = async () => {
    try {
      setMicStreamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsLiveMicStreaming(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setMicAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));

        // Update animated waveform with actual frequency bins
        const wave = Array.from(dataArray.slice(0, 13)).map(val => Math.max(10, Math.round((val / 255) * 100)));
        setLiveAudioWave(wave);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setMicStreamError(err?.message || 'মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে। ব্রাউজার পারমিশন চেক করুন।');
      setIsLiveMicStreaming(false);
    }
  };

  const stopLiveMicStreaming = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsLiveMicStreaming(false);
    setMicAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopLiveMicStreaming();
    };
  }, []);

  // Save or Update Room Profile
  const handleSaveRoom = async () => {
    if (!editingRoom.name?.trim()) return;

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRoom)
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => {
          const idx = prev.findIndex(r => r.id === data.room.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = data.room;
            return copy;
          }
          return [...prev, data.room];
        });
        setIsEditingRoom(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving room:', err);
    }
  };

  // Toggle Admin Status for Room
  const handleToggleAdminStatus = async (roomId: string, currentAdmin: boolean) => {
    const newAdmin = !currentAdmin;
    try {
      const res = await fetch('/api/security/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          isAdminRoom: newAdmin,
          accessScope: newAdmin ? 'MASTER_ADMIN' : 'RESTRICTED_LOCAL'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRooms(data.roomProfiles);
      }
    } catch (err) {
      console.error('Error toggling admin status:', err);
    }
  };

  // Toggle Cross-Room Permission
  const handleToggleCrossRoomPermission = async (sourceRoomId: string, targetRoomId: string) => {
    const sourceRoom = rooms.find(r => r.id === sourceRoomId);
    if (!sourceRoom) return;

    const currentAllowed = sourceRoom.allowedCrossRoomPermissions || [];
    const newAllowed = currentAllowed.includes(targetRoomId)
      ? currentAllowed.filter(id => id !== targetRoomId)
      : [...currentAllowed, targetRoomId];

    try {
      const res = await fetch('/api/security/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: sourceRoomId,
          allowedCrossRoomPermissions: newAllowed,
          accessScope: sourceRoom.isAdminRoom ? 'MASTER_ADMIN' : (newAllowed.length > 0 ? 'CUSTOM_DELEGATED' : 'RESTRICTED_LOCAL')
        })
      });
      const data = await res.json();
      if (data.success) {
        setRooms(data.roomProfiles);
      }
    } catch (err) {
      console.error('Error updating permissions:', err);
    }
  };

  // Delete Room Profile
  const handleDeleteRoom = async (roomId: string) => {
    try {
      await fetch(`/api/rooms/${roomId}`, { method: 'DELETE' });
      setRooms(prev => prev.filter(r => r.id !== roomId));
      setHardwareMaps(prev => prev.filter(h => h.roomId !== roomId));
      if (selectedRoomId === roomId) {
        const remaining = rooms.filter(r => r.id !== roomId);
        if (remaining.length > 0) setSelectedRoomId(remaining[0].id);
      }
    } catch (err) {
      console.error('Error deleting room:', err);
    }
  };

  // Add in-page room automation
  const handleAddRoomAutomation = async (roomId: string) => {
    if (!newAuto.name || !newAuto.voiceShortcut || !newAuto.entityId) return;

    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const createdAuto: RoomAutomation = {
      id: `ra-${Date.now().toString(36)}`,
      roomId,
      name: newAuto.name,
      nameBn: newAuto.nameBn || newAuto.name,
      voiceShortcut: newAuto.voiceShortcut,
      triggerCondition: `Spoken in ${targetRoom.name}`,
      actions: [{ entity_id: newAuto.entityId, service: newAuto.service, params: {} }],
      enabled: true
    };

    const updatedRoom: RoomProfile = {
      ...targetRoom,
      automations: [...(targetRoom.automations || []), createdAuto],
      automationsCount: (targetRoom.automations?.length || 0) + 1
    };

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom)
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
        setNewAuto({ name: '', nameBn: '', voiceShortcut: '', entityId: '', service: 'turn_on' });
        setActiveAutomationRoomId(null);
      }
    } catch (err) {
      console.error('Error adding room automation:', err);
    }
  };

  // Delete room automation
  const handleDeleteRoomAutomation = async (roomId: string, autoId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    const updatedRoom: RoomProfile = {
      ...targetRoom,
      automations: targetRoom.automations.filter(a => a.id !== autoId),
      automationsCount: targetRoom.automations.length - 1
    };

    try {
      await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom)
      });
      setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
    } catch (err) {}
  };

  // Save Wake-Word Config
  const handleSaveWakeConfig = async () => {
    try {
      const res = await fetch('/api/wakeword/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wakeConfig)
      });
      const data = await res.json();
      if (data.success) {
        alert('ওয়েক-ওয়ার্ড কনফিগারেশন সফলভাবে আপডেট হয়েছে!');
      }
    } catch (err) {
      console.error('Error updating wake config:', err);
    }
  };

  // Dispatch Spatial Voice Simulation / Permission Test
  const handleRunSpatialSimulation = async () => {
    if (!simCommandText.trim()) return;

    setIsSimulatingVoice(true);
    setSimResult(null);

    const origin = rooms.find(r => r.id === simOriginRoomId);

    try {
      const res = await fetch('/api/rooms/spatial-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originRoomId: simOriginRoomId,
          commandText: simCommandText,
          detectedWakeWord: origin?.wakeWordOverride || wakeConfig.wakeWordName.split(' ')[0]
        })
      });

      const data = await res.json();
      setSimResult(data);
      if (data.event) {
        setSpatialEvents(prev => [data.event, ...prev.slice(0, 49)]);
      }
      fetchData(); // Refresh security logs
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulatingVoice(false);
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  return (
    <div id="unified-room-manager-container" className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>RBAC Room Isolation & Native NumPy Wake-Word Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>ইউনিফাইড মাল্টি-রুম ও আরবিএসি সিকিউরিটি ম্যানেজার</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl">
              হোস্ট হার্ডওয়্যার অডিও ইন্টারফেস (3.5mm জ্যাক, USB মাইক্রোফোন অ্যারে), WebRTC/Mobile লাইভ স্ট্রিম, অন-ডিভাইস পিউর NumPy ওয়েক-ওয়ার্ড ডিটেকশন এবং কঠোর <strong className="text-cyan-300">Role-Based Access Control (RBAC)</strong> সিকিউরিটি আইসোলেশন।
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-slate-400 text-[10px]">মোট রুম প্রোফাইল</div>
                <div className="text-white font-bold">{rooms.length} Rooms</div>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-slate-400 text-[10px]">মেইন অ্যাডমিন রুম</div>
                <div className="text-purple-300 font-bold">{rooms.filter(r => r.isAdminRoom).length} Admin Hub</div>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-slate-400 text-[10px]">হার্ডওয়্যার নোড</div>
                <div className="text-emerald-400 font-bold">{hardwareMaps.filter(h => h.activeStatus === 'ONLINE').length} Online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <button
            id="tab-btn-rooms"
            onClick={() => setActiveSubTab('rooms')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'rooms'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>১. রুম প্রোফাইল ও ডিভাইস ম্যাপিং</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-950/40 text-[10px]">{rooms.length}</span>
          </button>

          <button
            id="tab-btn-rbac"
            onClick={() => setActiveSubTab('rbac-security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'rbac-security'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>২. আরবিএসি সিকিউরিটি ও ক্রস-রুম ম্যাট্রিক্স</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 text-[10px]">
              {securityLogs.length} Logs
            </span>
          </button>

          <button
            id="tab-btn-hardware"
            onClick={() => setActiveSubTab('hardware-audio')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'hardware-audio'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>৩. হোস্ট হার্ডওয়্যার অডিও পোর্টস (3.5mm/USB)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-950/40 text-[10px]">{hostInterfaces.length}</span>
          </button>

          <button
            id="tab-btn-stream"
            onClick={() => setActiveSubTab('live-stream')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'live-stream'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
            }`}
          >
            <AudioLines className="w-4 h-4" />
            <span>৪. লাইভ ভয়েস স্ট্রিমিং ও স্পেশিয়াল সিমুলেটর</span>
            {isLiveMicStreaming && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: ROOM PROFILES & HARDWARE MAPPING */}
      {/* ========================================================================= */}
      {activeSubTab === 'rooms' && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-cyan-400" />
                <span>রুম প্রোফাইলসমূহ ও এসোসিয়েটেড এনটিটি</span>
              </h2>
              <p className="text-xs text-slate-400">প্রতিটি রুমের জন্য মাইক্রোফোন, স্পিকার, কাস্টম ওয়েক-ওয়ার্ড এবং ভয়েস শর্টকাট কনফিগার করুন।</p>
            </div>

            <button
              id="create-room-btn"
              onClick={() => {
                setEditingRoom({
                  id: `room-${Date.now().toString(36)}`,
                  name: '',
                  nameBn: '',
                  floor: '1st Floor',
                  icon: 'Sofa',
                  color: '#06b6d4',
                  associatedEntities: [],
                  microphoneInputId: 'mic_usb_new',
                  speakerOutputId: 'media_player.default',
                  wakeWordOverride: 'Hey Brain',
                  isAdminRoom: false,
                  accessScope: 'RESTRICTED_LOCAL',
                  allowedCrossRoomPermissions: [],
                  automations: []
                });
                setIsEditingRoom(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন রুম তৈরি করুন</span>
            </button>
          </div>

          {/* Room Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rooms.map(room => {
              const IconComp = AVAILABLE_ICONS[room.icon] || Home;
              const isSelected = selectedRoomId === room.id;
              const isMasterAdmin = room.isAdminRoom;

              return (
                <div
                  key={room.id}
                  id={`room-card-${room.id}`}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: room.color || '#06b6d4' }}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isMasterAdmin ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>MAIN ADMIN</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                            ISOLATED
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {room.floor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{room.name}</h3>
                      <p className="text-xs text-slate-400">{room.nameBn}</p>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1"><Mic className="w-3 h-3" /> Mic:</span>
                        <span className="text-cyan-400 truncate max-w-[130px]">{room.microphoneInputId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1"><Volume2 className="w-3 h-3" /> Speaker:</span>
                        <span className="text-indigo-300 truncate max-w-[130px]">{room.speakerOutputId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Wake:</span>
                        <span className="text-amber-300 font-bold">{room.wakeWordOverride || 'Hey Brain'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      {room.associatedEntities?.length || 0} Entities | {room.automations?.length || 0} Autos
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRoom(room);
                          setIsEditingRoom(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="রুম এডিট করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`আপনি কি '${room.name}' রুমটি ডিলিট করতে চান?`)) {
                            handleDeleteRoom(room.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        title="রুম ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Room Details Panel */}
          {selectedRoom && (
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: selectedRoom.color || '#06b6d4' }}
                  >
                    {React.createElement(AVAILABLE_ICONS[selectedRoom.icon] || Home, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{selectedRoom.name}</h3>
                      {selectedRoom.isAdminRoom ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                          👑 MASTER ADMIN ROOM
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                          🛡️ STRICT ISOLATED ROOM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedRoom.nameBn} • ফ্লোর: {selectedRoom.floor} • আইডি: {selectedRoom.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAdminStatus(selectedRoom.id, selectedRoom.isAdminRoom)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      selectedRoom.isAdminRoom
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-slate-800 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{selectedRoom.isAdminRoom ? 'অ্যাডমিন অধিকার প্রত্যাহার' : 'মেইন অ্যাডমিন নির্ধারণ করুন'}</span>
                  </button>

                  <button
                    onClick={() => setActiveAutomationRoomId(selectedRoom.id)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>ভয়েস শর্টকাট যুক্ত করুন</span>
                  </button>
                </div>
              </div>

              {/* Two Column Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Associated Home Assistant Entities */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>রুমের এসোসিয়েটেড এনটিটিসমূহ ({selectedRoom.associatedEntities?.length || 0})</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">HA Auto-Binding</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedRoom.associatedEntities?.map(entId => {
                      const ent = entities.find(e => e.entity_id === entId);
                      return (
                        <div key={entId} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            <div>
                              <div className="font-mono text-slate-200">{entId}</div>
                              <div className="text-[10px] text-slate-500">{ent?.name || 'Local Controller Node'}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ent?.state === 'on' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {ent?.state?.toUpperCase() || 'IDLE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Room Voice Automations */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>রুম-স্পেসিফিক ভয়েস অটোমেশন শর্টকাট ({selectedRoom.automations?.length || 0})</span>
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400">&lt;50ms Fast Execution</span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selectedRoom.automations?.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        এই রুমে এখনো কোনো কাস্টম ভয়েস শর্টকাট নেই।
                      </div>
                    ) : (
                      selectedRoom.automations?.map(auto => (
                        <div key={auto.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white text-xs">{auto.name} ({auto.nameBn})</div>
                            <button
                              onClick={() => handleDeleteRoomAutomation(selectedRoom.id, auto.id)}
                              className="text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              🗣️ "{auto.voiceShortcut}"
                            </span>
                            <CornerDownRight className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400">{auto.actions?.[0]?.service} on {auto.actions?.[0]?.entity_id}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: RBAC SECURITY & CROSS-ROOM PERMISSION MATRIX */}
      {/* ========================================================================= */}
      {activeSubTab === 'rbac-security' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              <span>Role-Based Access Control (RBAC) ও রুম সিকিউরিটি ম্যাট্রিক্স</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              মেইন অ্যাডমিন ছাড়া সাধারণ রুমের মাইক্রোফোন থেকে অন্য রুমের ডিভাইস নিয়ন্ত্রণ সম্পূর্ণ ব্লক থাকে। প্রয়োজন অনুযায়ী নির্দিষ্ট রুমকে ক্রস-রুম অ্যাক্সেস পারমিশন ডেলিগেট করুন।
            </p>
          </div>

          {/* Cross-Room Permission Matrix Table */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>ক্রস-রুম অ্যাক্সেস পলিসি ও ডেলিগেশন ম্যাট্রিক্স (Interactive Grid)</span>
              </h3>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                🔒 Default Policy: STRICT ROOM ISOLATION
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">উৎপত্তিস্থল রুম (Source Room)</th>
                    <th className="py-3 px-4">রোল ও অধিকার (Scope)</th>
                    {rooms.map(target => (
                      <th key={target.id} className="py-3 px-4 text-center">
                        <span className="text-slate-300">{target.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {rooms.map(source => {
                    const isMasterAdmin = source.isAdminRoom;

                    return (
                      <tr key={source.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white font-sans">{source.name}</div>
                          <div className="text-[10px] text-slate-500">{source.nameBn}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {isMasterAdmin ? (
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                              👑 MASTER ADMIN (FULL ACCESS)
                            </span>
                          ) : (source.allowedCrossRoomPermissions?.length || 0) > 0 ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                              ⚡ CUSTOM DELEGATED
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                              🛡️ STRICT LOCAL ISOLATED
                            </span>
                          )}
                        </td>

                        {rooms.map(target => {
                          const isSelf = source.id === target.id;
                          const isAllowed = isMasterAdmin || isSelf || (source.allowedCrossRoomPermissions || []).includes(target.id);

                          return (
                            <td key={target.id} className="py-3.5 px-4 text-center">
                              {isSelf ? (
                                <span className="inline-flex items-center px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px]">
                                  Local
                                </span>
                              ) : isMasterAdmin ? (
                                <span className="inline-flex items-center text-purple-400 font-bold gap-1 text-[11px]" title="Master Admin possesses universal unrestricted permission">
                                  <Check className="w-4 h-4 text-purple-400 inline" /> Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleCrossRoomPermission(source.id, target.id)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    isAllowed
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                                      : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                                  }`}
                                  title={isAllowed ? 'পারমিশন বাতিল করতে ক্লিক করুন' : 'পারমিশন মঞ্জুর করতে ক্লিক করুন'}
                                >
                                  {isAllowed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Violation Audit Logs */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>রিয়েল-টাইম আরবিএসি সিকিউরিটি অডিট লগ (Security Violation Interceptions)</span>
              </h3>
              <button 
                onClick={fetchData}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {securityLogs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 font-mono">
                  কোনো সিকিউরিটি ভায়োলেশন লগ রেকর্ড হয়নি। সিস্টেম ১০০% নিরাপদ ও আইসোলেটেড।
                </div>
              ) : (
                securityLogs.map(log => (
                  <div 
                    key={log.id} 
                    className={`p-3.5 rounded-xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      log.severity === 'CRITICAL_BLOCK'
                        ? 'bg-red-950/30 border-red-500/30 text-red-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'CRITICAL_BLOCK' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {log.severity}
                        </span>
                        <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                        <span className="text-cyan-400 font-bold">{log.originRoomName}</span>
                      </div>
                      <div className="text-slate-200 font-sans font-medium">
                        কমান্ড: <span className="font-mono text-amber-300">"{log.attemptedCommand}"</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{log.reason}</div>
                    </div>

                    <div className="text-[10px] text-slate-500 self-start sm:self-center">
                      ID: {log.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: HOST HARDWARE & AUDIO INTERFACES */}
      {/* ========================================================================= */}
      {activeSubTab === 'hardware-audio' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>হোস্ট হার্ডওয়্যার ও অডিও পোর্টস ম্যানেজার (3.5mm Jack, USB & IP Satellites)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ডিভাইসের অনবোর্ড ৩.৫মিমি জ্যাক (`hw:0,0`), USB মাইক্রোফোন অ্যারে (`hw:1,0`), I2S বাস এবং ESPHome স্যাটেলাইট নোডগুলোকে নির্দিষ্ট রুমে বাইন্ড করুন।
            </p>
          </div>

          {/* Enumerated Host Hardware Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hostInterfaces.map(hw => (
              <div key={hw.id} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      {hw.type}
                    </span>
                    <h3 className="text-sm font-bold text-white">{hw.name}</h3>
                  </div>

                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Device Path:</span>
                    <span className="text-cyan-400 truncate max-w-[170px]">{hw.devicePath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Direction:</span>
                    <span className="text-indigo-300 font-bold">{hw.direction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sample Rate:</span>
                    <span className="text-amber-300">{hw.sampleRate} Hz ({hw.channels} Ch)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver:</span>
                    <span className="text-slate-400 text-[10px] truncate max-w-[170px]">{hw.driver}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">ম্যাপ করা রুম:</span>
                  <span className="text-cyan-300 font-bold">
                    {rooms.find(r => r.id === hw.mappedRoomId)?.name || 'Unassigned'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Wake-Word Engine Audio Parameters Tuner */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-400" />
                  <span>নেটিভ পিউর NumPy ওয়েক-ওয়ার্ড স্পেকট্রাল প্যারামিটার টিউনার</span>
                </h3>
                <p className="text-xs text-slate-400">Zero External Dependencies • Pure NumPy FFT/MFCC Feature Extraction</p>
              </div>

              <button
                onClick={handleSaveWakeConfig}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>সেটিংস সংরক্ষণ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-slate-400">টার্গেট ওয়েক-ওয়ার্ড (Wake Phrase)</label>
                <input
                  type="text"
                  value={wakeConfig.wakeWordName}
                  onChange={(e) => setWakeConfig({ ...wakeConfig, wakeWordName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-slate-400">সেনসিটিভিটি থ্রেশহোল্ড</label>
                  <span className="text-cyan-400 font-bold">{wakeConfig.sensitivityThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={wakeConfig.sensitivityThreshold}
                  onChange={(e) => setWakeConfig({ ...wakeConfig, sensitivityThreshold: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400">অডিও ড্রাইভ ও বাফার</label>
                <select
                  value={wakeConfig.audioDriver}
                  onChange={(e) => setWakeConfig({ ...wakeConfig, audioDriver: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="ALSA">ALSA Direct (/dev/snd)</option>
                  <option value="ESPHOME_SATELLITE">ESPHome UDP Satellite</option>
                  <option value="PULSE">PulseAudio RingBuffer</option>
                  <option value="WEBSOCKET_STREAM">WebSocket Browser Stream</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400">FFT Frame & MFCC Coeffs</label>
                <div className="px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 flex items-center justify-between">
                  <span>512 STFT Frame</span>
                  <span className="text-amber-400">13 MFCCs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: LIVE VOICE STREAMING & SPATIAL SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'live-stream' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AudioLines className="w-5 h-5 text-cyan-400" />
              <span>লাইভ ভয়েস স্ট্রিমিং ও স্পেশিয়াল আরবিএসি সিমুলেটর</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ব্রাউজার / মোবাইল মাইক্রোফোন থেকে সরাসরি অডিও স্ট্রিম করুন অথবা যেকোনো রুম থেকে ভয়েস কমান্ড সিমুলেট করে RBAC পারমিশন ইন্টারসেপশন টেস্ট করুন।
            </p>
          </div>

          {/* Web/Mobile Real-Time Microphone Streaming Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>WebAudio API Live Mic Stream</span>
                </div>
                <h3 className="text-lg font-bold text-white">ব্রাউজার / মোবাইল সরাসরি লাইভ ভয়েস স্ট্রিমিং</h3>
              </div>

              <div>
                {!isLiveMicStreaming ? (
                  <button
                    id="start-live-mic-btn"
                    onClick={startLiveMicStreaming}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>লাইভ মাইক্রোফোন অন করুন</span>
                  </button>
                ) : (
                  <button
                    id="stop-live-mic-btn"
                    onClick={stopLiveMicStreaming}
                    className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/25 cursor-pointer"
                  >
                    <MicOff className="w-4 h-4 animate-pulse" />
                    <span>মাইক্রোফোন বন্ধ করুন ({micAudioLevel}%)</span>
                  </button>
                )}
              </div>
            </div>

            {micStreamError && (
              <div className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-xs text-red-300 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{micStreamError}</span>
              </div>
            )}

            {/* Live Audio Visualizer Waveform */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>অন-ডিভাইস পিউর NumPy FFT ওয়েক-ওয়ার্ড ডিটেকশন বাফার</span>
                </span>
                <span className="text-amber-300 font-bold">
                  {isLiveMicStreaming ? `Active PCM Stream: ${micAudioLevel}% RMS` : 'Standby Mode'}
                </span>
              </div>

              <div className="flex items-end justify-center gap-2 sm:gap-3 h-24 pt-4 px-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
                {liveAudioWave.map((height, i) => (
                  <div
                    key={i}
                    className={`w-3 sm:w-4 rounded-t-full transition-all duration-150 ${
                      isLiveMicStreaming
                        ? 'bg-gradient-to-t from-cyan-500 to-indigo-400 shadow-md shadow-cyan-500/40'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Spatial RBAC Permission Tester & Voice Simulator */}
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-400" />
                <span>স্পেশিয়াল ভয়েস কমান্ড ও আরবিএসি ইন্টারসেপশন সিমুলেটর</span>
              </h3>
              <p className="text-xs text-slate-400">বিভিন্ন রুম নির্বাচন করে বৈধ লোকাল কমান্ড বনাম অবৈধ ক্রস-রুম কমান্ড টেস্ট করুন।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400">কমান্ডের উৎপত্তিস্থল (Origin Room)</label>
                <select
                  value={simOriginRoomId}
                  onChange={(e) => setSimOriginRoomId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.isAdminRoom ? '👑 [MASTER ADMIN]' : '🛡️ [ISOLATED]'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-mono text-slate-400">ভয়েস কমান্ড (বাংলা বা ইংরেজি)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simCommandText}
                    onChange={(e) => setSimCommandText(e.target.value)}
                    placeholder="যেমন: লাইট অন করো, অথবা মাস্টার বেডরুমের এসি বন্ধ করো"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    id="run-spatial-sim-btn"
                    onClick={handleRunSpatialSimulation}
                    disabled={isSimulatingVoice}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    {isSimulatingVoice ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>টেস্ট রান</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="text-slate-500 text-[11px]">টেস্ট প্রিসেট:</span>
              <button
                onClick={() => {
                  setSimOriginRoomId('room-living');
                  setSimCommandText('লাইট অন করো');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800"
              >
                ✅ বৈধ লোকাল কমান্ড (লিভিং রুম লাইট)
              </button>
              <button
                onClick={() => {
                  setSimOriginRoomId('room-kitchen');
                  setSimCommandText('মাস্টার বেডরুমের এসি বন্ধ করো');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-red-500/20 text-red-400 border border-red-500/30"
              >
                🚫 অবৈধ ক্রস-রুম কমান্ড (কিচেন -&gt; বেডরুম)
              </button>
              <button
                onClick={() => {
                  setSimOriginRoomId('room-master-bed');
                  setSimCommandText('ড্রয়িং রুমের লাইট বন্ধ করো');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30"
              >
                👑 অ্যাডমিন ক্রস-রুম কমান্ড (বেডরুম -&gt; লিভিং)
              </button>
            </div>

            {/* Simulation Result Output */}
            {simResult && (
              <div className={`p-5 rounded-xl border font-mono text-xs space-y-3 ${
                simResult.permissionStatus === 'BLOCKED_RBAC_VIOLATION'
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-slate-950 border-cyan-500/40 text-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    simResult.permissionStatus === 'BLOCKED_RBAC_VIOLATION'
                      ? 'bg-red-500 text-white'
                      : simResult.permissionStatus === 'ALLOWED_ADMIN'
                      ? 'bg-purple-500 text-white'
                      : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {simResult.permissionStatus}
                  </span>
                  <span className="text-cyan-400 font-bold">{simResult.event?.executionLatencyMs} ms</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-sans font-bold text-white">{simResult.voiceFeedbackBn}</div>
                  <div className="text-slate-400">{simResult.voiceFeedbackEn}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-4">
                  <span>টার্গেট স্পিকার: <strong className="text-indigo-300">{simResult.targetSpeakerId}</strong></span>
                  <span>ইনটেন্ট: <strong className="text-cyan-300">{simResult.event?.resolvedIntent}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROOM EDIT / CREATION MODAL */}
      {/* ========================================================================= */}
      {isEditingRoom && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-cyan-400" />
                <span>{editingRoom.id ? 'রুম প্রোফাইল এডিট করুন' : 'নতুন রুম তৈরি করুন'}</span>
              </h3>
              <button 
                onClick={() => setIsEditingRoom(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400">ইংরেজি নাম (English Name)</label>
                <input
                  type="text"
                  value={editingRoom.name || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  placeholder="e.g. Master Bedroom"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">বাংলা নাম (Bengali Name)</label>
                <input
                  type="text"
                  value={editingRoom.nameBn || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, nameBn: e.target.value })}
                  placeholder="যেমন: মাস্টার বেডরুম"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">ফ্লোর লেভেল (Floor Level)</label>
                <input
                  type="text"
                  value={editingRoom.floor || '1st Floor'}
                  onChange={(e) => setEditingRoom({ ...editingRoom, floor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">মাইক্রোফোন আইডি (Mic Input ID)</label>
                <input
                  type="text"
                  value={editingRoom.microphoneInputId || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, microphoneInputId: e.target.value })}
                  placeholder="mic_usb_room1"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">স্পিকার আউটপুট (Speaker Entity)</label>
                <input
                  type="text"
                  value={editingRoom.speakerOutputId || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, speakerOutputId: e.target.value })}
                  placeholder="media_player.bedroom_speaker"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">কাস্টম ওয়েক-ওয়ার্ড (Wake-Word)</label>
                <input
                  type="text"
                  value={editingRoom.wakeWordOverride || ''}
                  onChange={(e) => setEditingRoom({ ...editingRoom, wakeWordOverride: e.target.value })}
                  placeholder="Hey Brain / Jarvis"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Admin Room Toggle */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-purple-200 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>মেইন অ্যাডমিন রুম (Full Access Master Hub)</span>
                </div>
                <p className="text-xs text-slate-400">এই রুমের মাইক্রোফোন থেকে পুরো বাড়ির যেকোনো ডিভাইস সরাসরি কন্ট্রোল করার অনুমতি থাকবে।</p>
              </div>

              <input
                type="checkbox"
                checked={editingRoom.isAdminRoom || false}
                onChange={(e) => setEditingRoom({ ...editingRoom, isAdminRoom: e.target.checked })}
                className="w-5 h-5 accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Entities Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400">এই রুমের এসোসিয়েটেড ডিভাইসসমূহ নির্বাচন করুন:</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                {entities.map(e => {
                  const isChecked = (editingRoom.associatedEntities || []).includes(e.entity_id);
                  return (
                    <label key={e.entity_id} className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white cursor-pointer p-1 rounded hover:bg-slate-900">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const current = editingRoom.associatedEntities || [];
                          const updated = isChecked
                            ? current.filter(id => id !== e.entity_id)
                            : [...current, e.entity_id];
                          setEditingRoom({ ...editingRoom, associatedEntities: updated });
                        }}
                        className="accent-cyan-400"
                      />
                      <span className="truncate">{e.entity_id}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 font-mono text-xs">
              <button
                onClick={() => setIsEditingRoom(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROOM AUTOMATION CREATION MODAL */}
      {/* ========================================================================= */}
      {activeAutomationRoomId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>নতুন রুম ভয়েস শর্টকাট তৈরি করুন</span>
              </h3>
              <button onClick={() => setActiveAutomationRoomId(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">রুটিনের নাম (Routine Name)</label>
                <input
                  type="text"
                  value={newAuto.name}
                  onChange={(e) => setNewAuto({ ...newAuto, name: e.target.value })}
                  placeholder="e.g. Cinema Mode"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">ভয়েস শর্টকাট ট্রিগার (Spoken Phrase)</label>
                <input
                  type="text"
                  value={newAuto.voiceShortcut}
                  onChange={(e) => setNewAuto({ ...newAuto, voiceShortcut: e.target.value })}
                  placeholder="যেমন: সিনেমা মোড অন করো"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">টার্গেট এনটিটি (Target Device)</label>
                <select
                  value={newAuto.entityId}
                  onChange={(e) => setNewAuto({ ...newAuto, entityId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                >
                  <option value="">-- ডিভাইস নির্বাচন করুন --</option>
                  {entities.map(e => (
                    <option key={e.entity_id} value={e.entity_id}>{e.entity_id} ({e.name})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">অ্যাকশন সার্ভিস (Action Service)</label>
                <select
                  value={newAuto.service}
                  onChange={(e) => setNewAuto({ ...newAuto, service: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white cursor-pointer"
                >
                  <option value="turn_on">turn_on (চালু করো)</option>
                  <option value="turn_off">turn_off (বন্ধ করো)</option>
                  <option value="set_temperature">set_temperature (তাপমাত্রা পরিবর্তন)</option>
                  <option value="unlock">unlock (আনলক)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveAutomationRoomId(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleAddRoomAutomation(activeAutomationRoomId)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                অ্যাড করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
