import React, { useState, useEffect } from 'react';
import { MainVoiceBrainLanding } from './components/MainVoiceBrainLanding';
import { ControlHubDrawerModal } from './components/ControlHubDrawerModal';
import { MasterControlHeader } from './components/MasterControlHeader';
import { MasterAutomationOrchestrator } from './components/MasterAutomationOrchestrator';
import { NetworkSentinelDashboard } from './components/NetworkSentinelDashboard';
import { MultiBluetoothReactiveStudio } from './components/MultiBluetoothReactiveStudio';
import { UniversalCameraAutomation } from './components/UniversalCameraAutomation';
import { AdminGlobalAuditPanel } from './components/AdminGlobalAuditPanel';
import { UniversalIntentStudio } from './components/UniversalIntentStudio';
import { HomeAssistantLiveBridge } from './components/HomeAssistantLiveBridge';
import { UnifiedRoomManager } from './components/UnifiedRoomManager';
import { RuleLifecycleManager } from './components/RuleLifecycleManager';
import { VisualNodeCanvas } from './components/VisualNodeCanvas';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';
import { VisitorVisionEngine } from './components/VisitorVisionEngine';
import { LiveSimulator } from './components/LiveSimulator';
import { AutoEvolutionDaemon } from './components/AutoEvolutionDaemon';
import { SystemTelemetryAuditor } from './components/SystemTelemetryAuditor';
import { CodeAuditPanel } from './components/CodeAuditPanel';
import { GitHubRepoExporter } from './components/GitHubRepoExporter';
import { LovelaceCardShowcase } from './components/LovelaceCardShowcase';
import { VoiceChangerStudio } from './components/VoiceChangerStudio';
import { MultiKeyManagerPanel } from './components/MultiKeyManagerPanel';
import { LovelaceAutoInstallerPanel } from './components/LovelaceAutoInstallerPanel';
import { PageVoiceExplainerBar } from './components/PageVoiceExplainerBar';
import { StorageAndFineTuningStudio } from './components/StorageAndFineTuningStudio';
import { HAEnvironmentProvider, useHAEnvironment } from './context/HAEnvironmentContext';
import { VoiceSettingsProvider } from './context/VoiceSettingsContext';
import { ExplainModeProvider } from './context/ExplainModeContext';
import { GlobalTouchExplainer } from './components/GlobalTouchExplainer';
import { HAEnvironmentAdaptiveWrapper } from './components/HAEnvironmentAdaptiveWrapper';
import { ExecutionAuthorityMode, AudioRoutingMode, AutomationRule } from './types';
import { fetchRules, fetchHaStates, fetchHaStatus, fetchGeminiKeys, saveRule, deleteRule, toggleRule } from './services/api';
import { Cpu, ShieldCheck, Zap, Heart, Home, ArrowLeft } from 'lucide-react';

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-01',
    name: 'Evening Living Room Ambient Fade',
    nameBn: 'সন্ধ্যায় ড্রয়িং রুমের লাইট মৃদু উজ্জ্বলতায় চালু',
    rawIntent: 'সন্ধ্যা ৬টায় লিভিং রুমের লাইট ৪০% ব্রাইটনেসে চালু করো এবং এসি ২৬ ডিগ্রিতে রাখো',
    triggerType: 'TEMPORAL',
    triggerDetails: 'Daily at 18:00 (Sunset Sync)',
    actions: [
      { entity_id: 'light.drawing_room', service: 'turn_on', params: { brightness_pct: 40, transition: 5 } },
      { entity_id: 'climate.ac_master_bed', service: 'set_temperature', params: { temperature: 26 } }
    ],
    enabled: true,
    feasibilityScore: 100,
    matchedEntities: ['light.drawing_room', 'climate.ac_master_bed'],
    createdAt: '2026-08-16 19:30:00',
    lastTriggered: '2026-08-17 18:00:00',
    executionCount: 14
  },
  {
    id: 'rule-02',
    name: 'Front Gate Security Motion Alert & PTZ Auto-Track',
    nameBn: 'সামনের গেটে মোশন হলে ক্যামেরা ঘোরানো এবং স্পিকারে ওয়ার্নিং',
    rawIntent: 'গেটে কেউ আসলে ক্যামেরা তার দিকে ঘুরিয়ে স্পিকারে জিজ্ঞেস করো কে এসেছে',
    triggerType: 'VISION',
    triggerDetails: 'YOLOv8 Person Detection on camera.front_gate',
    actions: [
      { entity_id: 'camera.front_gate', service: 'ptz_track_person', params: { auto_center: true } },
      { entity_id: 'media_player.door_speaker', service: 'speak', params: { message: 'হ্যালো! আপনি কার সাথে দেখা করতে এসেছেন?' } }
    ],
    enabled: true,
    feasibilityScore: 95,
    matchedEntities: ['camera.front_gate', 'media_player.door_speaker'],
    createdAt: '2026-08-15 14:12:00',
    lastTriggered: '2026-08-17 12:45:00',
    executionCount: 32
  },
  {
    id: 'rule-03',
    name: 'Night Energy Saver Kill-Switch',
    nameBn: 'রাত ১টায় অপ্রয়োজনীয় ফ্যান ও লাইট বন্ধ করা',
    rawIntent: 'রাত ১টায় যদি ড্রয়িং রুমে কেউ না থাকে তাহলে সব লাইট ও ফ্যান বন্ধ করো',
    triggerType: 'STATE',
    triggerDetails: 'Time == 01:00 AND binary_sensor.drawing_room_motion == OFF for 15m',
    actions: [
      { entity_id: 'light.drawing_room', service: 'turn_off', params: {} },
      { entity_id: 'fan.living_room', service: 'turn_off', params: {} }
    ],
    enabled: true,
    feasibilityScore: 100,
    matchedEntities: ['binary_sensor.drawing_room_motion', 'light.drawing_room', 'fan.living_room'],
    createdAt: '2026-08-14 09:00:00',
    lastTriggered: '2026-08-17 01:00:00',
    executionCount: 45
  }
];

function MainHubApp() {
  const [activeTab, setActiveTab] = useState<string>('voice_landing');
  const [isControlHubOpen, setIsControlHubOpen] = useState<boolean>(false);
  const [executionMode, setExecutionMode] = useState<ExecutionAuthorityMode>('CONFIRMATION_REQUIRED');
  const [audioRoute, setAudioRoute] = useState<AudioRoutingMode>('DASHBOARD_STREAMING');
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);

  // Automatic Backend & HA Synchronization on Mount
  useEffect(() => {
    // 1. Initial multi-subsystem auto-fetch
    const initAppSync = async () => {
      try {
        // Parallel non-blocking requests across subsystems
        const [rulesRes, statesRes, keysRes, statusRes] = await Promise.allSettled([
          fetchRules(),
          fetchHaStates(),
          fetchGeminiKeys(),
          fetchHaStatus()
        ]);

        if (rulesRes.status === 'fulfilled' && rulesRes.value?.rules && Array.isArray(rulesRes.value.rules)) {
          if (rulesRes.value.rules.length > 0) {
            setRules(rulesRes.value.rules);
          }
        }
      } catch (err) {
        console.warn('[HUB APP] Background initial sync completed with fallback:', err);
      }
    };

    initAppSync();

    // Periodic light background heartbeat sync every 25 seconds
    const interval = setInterval(() => {
      fetchRules().then(data => {
        if (data?.rules && Array.isArray(data.rules) && data.rules.length > 0) {
          setRules(data.rules);
        }
      }).catch(() => {});
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveRule = async (newRule: AutomationRule) => {
    try {
      const data = await saveRule(newRule);
      if (data?.rule) {
        setRules(prev => [data.rule, ...prev.filter(r => r.id !== data.rule.id)]);
      } else {
        setRules(prev => [newRule, ...prev.filter(r => r.id !== newRule.id)]);
      }
    } catch {
      setRules(prev => [newRule, ...prev.filter(r => r.id !== newRule.id)]);
    }
  };

  const handleToggleRule = async (ruleId: string, currentEnabled: boolean) => {
    try {
      await toggleRule(ruleId, !currentEnabled);
    } catch {}
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !currentEnabled } : r));
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await deleteRule(ruleId);
    } catch {}
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleUpdateRule = async (updatedRule: AutomationRule) => {
    try {
      await saveRule(updatedRule);
    } catch {}
    setRules(prev => prev.map(r => r.id === updatedRule.id ? updatedRule : r));
  };

  return (
    <HAEnvironmentAdaptiveWrapper
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      killSwitchActive={killSwitchActive}
      setKillSwitchActive={setKillSwitchActive}
      executionMode={executionMode}
      setExecutionMode={setExecutionMode}
      audioRoute={audioRoute}
      setAudioRoute={setAudioRoute}
    >
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* If on Main Voice Brain Landing view */}
        {activeTab === 'voice_landing' ? (
          <MainVoiceBrainLanding
            onOpenControlHub={() => setIsControlHubOpen(true)}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            executionMode={executionMode}
            setExecutionMode={setExecutionMode}
            audioRoute={audioRoute}
            setAudioRoute={setAudioRoute}
            killSwitchActive={killSwitchActive}
            setKillSwitchActive={setKillSwitchActive}
            onSaveRule={handleSaveRule}
          />
        ) : (
          <>
            {/* Top Header & Authority Switcher for Sub-Dashboards */}
            <MasterControlHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              executionMode={executionMode}
              setExecutionMode={setExecutionMode}
              audioRoute={audioRoute}
              setAudioRoute={setAudioRoute}
              killSwitchActive={killSwitchActive}
              setKillSwitchActive={setKillSwitchActive}
              rulesCount={rules.length}
            />

            {/* Main Subsystem Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
              {/* Universal On-Page Voice Explainer Guide for all tabs & interfaces */}
              <PageVoiceExplainerBar 
                pageId={activeTab} 
                onNavigateToVoiceStudio={() => setActiveTab('voice_studio')} 
                onNavigateToHome={() => setActiveTab('voice_landing')}
              />

              {activeTab === 'master_orchestrator' && (
                <MasterAutomationOrchestrator
                  onRuleCreated={handleSaveRule}
                  onNavigateToCanvas={() => setActiveTab('canvas')}
                />
              )}
              {activeTab === 'storage_compression' && (
                <StorageAndFineTuningStudio />
              )}
              {activeTab === 'lovelace_card' && (
                <LovelaceCardShowcase
                  onOpenFullScreenStudio={() => setActiveTab('master_orchestrator')}
                  onNavigateToVoiceStudio={() => setActiveTab('voice_studio')}
                  onNavigateToAutoInstall={() => setActiveTab('auto_install')}
                />
              )}
              {activeTab === 'voice_studio' && (
                <VoiceChangerStudio
                  onNavigateToCard={() => setActiveTab('lovelace_card')}
                />
              )}
              {activeTab === 'key_manager' && (
                <MultiKeyManagerPanel />
              )}
              {activeTab === 'auto_install' && (
                <LovelaceAutoInstallerPanel
                  onNavigateToCardPreview={() => setActiveTab('lovelace_card')}
                />
              )}
              {activeTab === 'network_sentinel' && (
                <NetworkSentinelDashboard />
              )}
              {activeTab === 'multi_bluetooth' && (
                <MultiBluetoothReactiveStudio />
              )}
              {activeTab === 'camera_engine' && (
                <UniversalCameraAutomation
                  onRuleCreated={handleSaveRule}
                  onNavigateToCanvas={() => setActiveTab('canvas')}
                  killSwitchActive={killSwitchActive}
                />
              )}
              {activeTab === 'admin_audit' && (
                <AdminGlobalAuditPanel
                  killSwitchActive={killSwitchActive}
                  onNavigateToCanvas={() => setActiveTab('canvas')}
                />
              )}
              {activeTab === 'intent' && (
                <UniversalIntentStudio
                  executionMode={executionMode}
                  audioRoute={audioRoute}
                  killSwitchActive={killSwitchActive}
                  onSaveRule={handleSaveRule}
                />
              )}
              {activeTab === 'ha_gateway' && (
                <HomeAssistantLiveBridge />
              )}
              {activeTab === 'rooms' && (
                <UnifiedRoomManager
                  killSwitchActive={killSwitchActive}
                />
              )}
              {activeTab === 'rules' && (
                <RuleLifecycleManager
                  rules={rules}
                  onToggleRule={handleToggleRule}
                  onDeleteRule={handleDeleteRule}
                  onUpdateRule={handleUpdateRule}
                  onAddNewRule={handleSaveRule}
                  killSwitchActive={killSwitchActive}
                />
              )}
              {activeTab === 'canvas' && (
                <VisualNodeCanvas
                  rules={rules}
                  onSaveRule={handleSaveRule}
                  killSwitchActive={killSwitchActive}
                />
              )}
              {activeTab === 'neural' && (
                <NeuralNetworkVisualizer />
              )}
              {activeTab === 'visitor' && (
                <VisitorVisionEngine
                  executionMode={executionMode}
                  killSwitchActive={killSwitchActive}
                />
              )}
              {activeTab === 'simulator' && (
                <LiveSimulator />
              )}
              {activeTab === 'evolution' && (
                <AutoEvolutionDaemon />
              )}
              {activeTab === 'telemetry' && (
                <SystemTelemetryAuditor
                  executionMode={executionMode}
                  audioRoute={audioRoute}
                  killSwitchActive={killSwitchActive}
                  rulesCount={rules.length}
                />
              )}
              {activeTab === 'audit' && (
                <CodeAuditPanel />
              )}
              {activeTab === 'repo' && (
                <GitHubRepoExporter />
              )}
            </main>
          </>
        )}

        {/* Global 21-Dashboard Control Hub Drawer Modal */}
        <ControlHubDrawerModal
          isOpen={isControlHubOpen}
          onClose={() => setIsControlHubOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
          rulesCount={rules.length}
        />

        {/* Global Touch & Click Voice Explainer Floating Indicator */}
        <GlobalTouchExplainer />

        {/* Persistent Floating Back to Main Home Button on all sub-dashboards */}
        {activeTab !== 'voice_landing' && (
          <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <button
              id="global-floating-back-home-btn"
              onClick={() => setActiveTab('voice_landing')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-900/40 border border-cyan-300/40 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group ring-2 ring-cyan-400/30"
              title="যেকোনো সাবপেজ থেকে তাৎক্ষণিক মূল বাংলা ভয়েস হোমপেজে ব্যাক যান"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <Home className="w-4 h-4 text-cyan-200" />
              <span className="font-sans">মূল পেজে ফিরে যান</span>
            </button>
          </div>
        )}

        {/* Global Footer */}
        <footer className="bg-[#050912] border-t border-slate-800/80 text-xs text-slate-400 py-6 font-mono mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Auto-Evolving Edge-AI Master Hub for Home Assistant OS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">Author: Humayun Bhai</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span>SQLite WAL Mode</span>
              <span>•</span>
              <span>Pure NumPy Attention Engine</span>
              <span>•</span>
              <span>Gemini Multimodal Suite</span>
            </div>
          </div>
        </footer>
      </div>
    </HAEnvironmentAdaptiveWrapper>
  );
}

export default function App() {
  return (
    <VoiceSettingsProvider>
      <ExplainModeProvider>
        <HAEnvironmentProvider>
          <MainHubApp />
        </HAEnvironmentProvider>
      </ExplainModeProvider>
    </VoiceSettingsProvider>
  );
}

