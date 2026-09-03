import React, { useState } from 'react';
import { 
  Eye, 
  UserCheck, 
  ShieldAlert, 
  MessageSquare, 
  Unlock, 
  UserPlus, 
  Volume2, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers,
  AlertTriangle,
  Play,
  Send
} from 'lucide-react';
import { FaceProfile, VisitorInteraction, ExecutionAuthorityMode } from '../types';

interface VisitorVisionEngineProps {
  executionMode: ExecutionAuthorityMode;
  killSwitchActive: boolean;
}

export const VisitorVisionEngine: React.FC<VisitorVisionEngineProps> = ({
  executionMode,
  killSwitchActive
}) => {
  const [profiles, setProfiles] = useState<FaceProfile[]>([
    {
      id: 'face-01',
      name: 'হুমায়ুন ভাই (Humayun Bhai)',
      role: 'OWNER',
      confidence: 0.99,
      lastSeen: 'আজ দুপুর ১২:৪৫',
      registeredAt: '2026-08-01',
      faceEmbeddingVector: [0.12, 0.89, -0.45, 0.67, -0.11, 0.34],
      accessLevel: 'FULL'
    },
    {
      id: 'face-02',
      name: 'তানভীর (Family Member)',
      role: 'FAMILY',
      confidence: 0.96,
      lastSeen: 'গতকাল রাত ৮:১০',
      registeredAt: '2026-08-05',
      faceEmbeddingVector: [-0.32, 0.44, 0.78, -0.15, 0.52, -0.09],
      accessLevel: 'FULL'
    },
    {
      id: 'face-03',
      name: 'কুরিয়ার ডেলিভারি পারসন (Regular Guest)',
      role: 'GUEST',
      confidence: 0.88,
      lastSeen: '৩ দিন আগে',
      registeredAt: '2026-08-10',
      faceEmbeddingVector: [0.45, -0.22, 0.19, 0.81, -0.63, 0.27],
      accessLevel: 'NOTIFY_ONLY'
    }
  ]);

  const [interactions, setInteractions] = useState<VisitorInteraction[]>([
    {
      id: 'vis-101',
      timestamp: '2026-08-17 12:45:12',
      faceMatched: false,
      visitorUtterance: 'আমি দারাজ থেকে পার্সেল নিয়ে এসেছি হুমায়ুন ভাইয়ের জন্য।',
      aiResponse: 'Thank you. I have notified Humayun Bhai on his dashboard. Please place the parcel in the safe drop box.',
      aiResponseBn: 'ধন্যবাদ। আমি হুমায়ুন ভাইয়ের ড্যাশবোর্ডে নোটিফিকেশন পাঠিয়েছি। অনুগ্রহ করে পার্সেলটি গেটের ড্রপ বক্সে রাখুন।',
      actionTaken: 'NOTIFY_OWNER_OVERLAY',
      approved: true,
      cameraSnapshot: 'snapshot_gate_101.jpg'
    },
    {
      id: 'vis-102',
      timestamp: '2026-08-17 09:20:00',
      faceMatched: true,
      matchedName: 'হুমায়ুন ভাই (Humayun Bhai)',
      visitorUtterance: 'গেট খোলো',
      aiResponse: 'Welcome home Humayun Bhai! Opening front gate and unlocking door.',
      aiResponseBn: 'স্বাগতম হুমায়ুন ভাই! সামনের গেট খোলা হচ্ছে এবং দরজা আনলক করা হয়েছে।',
      actionTaken: 'UNLOCK_FRONT_GATE',
      approved: true,
      cameraSnapshot: 'snapshot_gate_owner.jpg'
    }
  ]);

  const [selectedVisitorScenario, setSelectedVisitorScenario] = useState<string>('UNKNOWN_DELIVERY');
  const [isProcessingDialogue, setIsProcessingDialogue] = useState<boolean>(false);
  const [customUtterance, setCustomUtterance] = useState<string>('');
  const [gateUnlocked, setGateUnlocked] = useState<boolean>(false);
  const [newPersonName, setNewPersonName] = useState<string>('');
  const [isAddingPerson, setIsAddingPerson] = useState<boolean>(false);

  const handleSimulateVisitor = async (scenario: string, customText?: string) => {
    setIsProcessingDialogue(true);
    let utterance = customText || '';
    let matchedId: string | undefined = undefined;

    if (scenario === 'OWNER_ARRIVAL') {
      utterance = 'আমি বাসায় এসেছি, গেট খোলো।';
      matchedId = 'face-01';
    } else if (scenario === 'UNKNOWN_DELIVERY') {
      utterance = 'আমি দারাজ এক্সপ্রেস থেকে একটি পার্সেল ডেলিভারি দিতে এসেছি।';
    } else if (scenario === 'UNKNOWN_STRANGER') {
      utterance = 'এখানে কি কেউ আছেন? আমি একটু কথা বলতে চাই।';
    }

    try {
      const response = await fetch('/api/faces/visitor-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorUtterance: utterance,
          matchedFaceId: matchedId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInteractions(prev => [data.interaction, ...prev]);

        if (data.interaction.actionTaken === 'UNLOCK_GATE') {
          setGateUnlocked(true);
          setTimeout(() => setGateUnlocked(false), 5000);
        }

        // Bengali speech feedback
        if ('speechSynthesis' in window && data.interaction.aiResponseBn) {
          const u = new SpeechSynthesisUtterance(data.interaction.aiResponseBn);
          u.lang = 'bn-BD';
          window.speechSynthesis.speak(u);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingDialogue(false);
    }
  };

  const handleRegisterNewFace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    const newProfile: FaceProfile = {
      id: `face-${Date.now().toString(36)}`,
      name: newPersonName,
      role: 'TRUSTED',
      confidence: 0.97,
      lastSeen: 'Just Now',
      registeredAt: new Date().toISOString().split('T')[0],
      faceEmbeddingVector: Array.from({ length: 6 }, () => Number((Math.random() * 2 - 1).toFixed(3))),
      accessLevel: 'FULL'
    };

    setProfiles(prev => [newProfile, ...prev]);
    setNewPersonName('');
    setIsAddingPerson(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Edge Vision RTSP Face Recognition & Autonomous Visitor Dialogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              ফেস রিকগনিশন ও ভিজিটর ইন্টারেকশন ইঞ্জিন
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              RTSP ক্যামেরা ফিড থেকে ফেস ভেক্টর এক্সট্র্যাক্ট করে লোকাল SQLite ডাটাবেসে ম্যাচিং। পরিচিতদের স্বাগতম জানিয়ে গেট আনলক এবং অপরিচিত ভিজিটরদের সাথে ২-ওয়ে স্পিকারে স্বয়ংক্রিয় কথোপকথন।
            </p>
          </div>

          <button
            onClick={() => setIsAddingPerson(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer self-start"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন ফেস প্রোফাইল যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Camera Stream Simulation + Autonomous Dialogue Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Live Camera Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 font-bold text-white">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>RTSP Live Stream: camera.front_gate</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>YOLOv8 & FaceNet 30 FPS</span>
            </span>
          </div>

          {/* Video Mock Canvas with Bounding Boxes */}
          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Background Simulated Camera Feed */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950 flex items-center justify-center">
              <div className="text-center space-y-2 text-slate-500 font-mono text-xs">
                <Camera className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                <p>Front Gate HD Stream (1080p RTSP/ONVIF)</p>
              </div>
            </div>

            {/* Bounding Box 1: Owner Humayun Bhai */}
            <div className="absolute top-12 left-16 border-2 border-emerald-400 bg-emerald-500/10 rounded-lg p-2 font-mono text-xs shadow-lg shadow-emerald-500/20">
              <div className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-4 -ml-2 w-max flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                <span>হুমায়ুন ভাই (Owner: 99.4%)</span>
              </div>
              <div className="text-[10px] text-emerald-300 mt-1">Vector: [0.12, 0.89, -0.45...]</div>
            </div>

            {/* Bounding Box 2: Visitor at Door */}
            <div className="absolute bottom-10 right-16 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg p-2 font-mono text-xs shadow-lg shadow-cyan-500/20">
              <div className="bg-cyan-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded -mt-4 -ml-2 w-max flex items-center gap-1">
                <span>Person Detected (YOLOv8)</span>
              </div>
              <div className="text-[10px] text-cyan-300 mt-1">Door Distance: 1.2m</div>
            </div>

            {/* Gate Unlocked Live Overlay */}
            {gateUnlocked && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-300 font-mono animate-fade-in">
                <Unlock className="w-12 h-12 text-emerald-400 animate-bounce mb-2" />
                <h3 className="text-lg font-bold">FRONT GATE UNLOCKED</h3>
                <p className="text-xs text-emerald-400">স্বাগতম হুমায়ুন ভাই! গেট খোলা হয়েছে।</p>
              </div>
            )}
          </div>

          {/* Quick Scenario Trigger Buttons */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-slate-400">ভিজিটর সিমুলেশন ট্রিগার:</span>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                onClick={() => handleSimulateVisitor('OWNER_ARRIVAL')}
                disabled={isProcessingDialogue}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/60 cursor-pointer"
              >
                👤 ১. বাড়ি ফেরা (হুমায়ুন ভাই)
              </button>
              <button
                onClick={() => handleSimulateVisitor('UNKNOWN_DELIVERY')}
                disabled={isProcessingDialogue}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 cursor-pointer"
              >
                📦 ২. পার্সেল ডেলিভারি পারসন
              </button>
              <button
                onClick={() => handleSimulateVisitor('UNKNOWN_STRANGER')}
                disabled={isProcessingDialogue}
                className="px-3 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/60 hover:bg-amber-900/60 cursor-pointer"
              >
                ❓ ৩. অপরিচিত ভিজিটর
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Registered Face Profiles (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 font-bold text-white">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>নিবন্ধিত ফেস প্রোফাইল ({profiles.length})</span>
            </span>
            <span className="text-slate-500">SQLite Vector DB</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 font-mono text-xs">
            {profiles.map((p) => (
              <div key={p.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{p.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    p.role === 'OWNER' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                    p.role === 'FAMILY' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {p.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>লাস্ট সিন: {p.lastSeen}</span>
                  <span className="text-cyan-400">ম্যাচ একিউরেসি: {(p.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visitor Dialogue History Log */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-300 pb-2 border-b border-slate-800">
          <span className="flex items-center gap-2 font-bold text-white text-sm">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>স্বয়ংক্রিয় ভিজিটর কথোপকথন ও সিদ্ধান্ত লগ (Audit Logs)</span>
          </span>
          <span className="text-slate-500">{interactions.length} টি কথোপকথন সংরক্ষিত</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {interactions.map((int) => (
            <div key={int.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="text-cyan-400 font-bold">
                  {int.faceMatched ? `✅ চেনা মুখ: ${int.matchedName}` : '⚠️ অপরিচিত ব্যক্তি'}
                </span>
                <span>{int.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block mb-1 text-[10px]">ভিজিটর বলেছেন:</span>
                  "{int.visitorUtterance}"
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-cyan-300">
                  <span className="text-slate-500 block mb-1 text-[10px]">AI স্পিকার রেসপন্স:</span>
                  "{int.aiResponseBn}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-emerald-400">গৃহীত অ্যাকশন: <strong className="text-white">{int.actionTaken}</strong></span>
                <span className="text-slate-500 font-mono">Snapshot: {int.cameraSnapshot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Face Modal */}
      {isAddingPerson && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRegisterNewFace} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              নতুন ফেস প্রোফাইল তৈরি
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">ব্যক্তির নাম:</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আবির (Family Member)"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingPerson(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold"
              >
                নিবন্ধন করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
