import React, { useState, useEffect } from 'react';
import { 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sliders, 
  Globe, 
  Key, 
  Eye, 
  EyeOff, 
  Radio, 
  Cpu, 
  Lightbulb, 
  Fan, 
  Thermometer, 
  Lock, 
  Camera, 
  Power, 
  Volume2, 
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Activity,
  Plus,
  Trash2,
  Tv,
  Edit3,
  X
} from 'lucide-react';
import { HomeAssistantConfig, HardwareEntity } from '../types';
import { fetchHaStates, fetchHaStatus, fetchHaDiagnostic, runHaDiagnostic, discoverHa, updateHaConfig, syncHa, callHaService } from '../services/api';

interface HomeAssistantLiveBridgeProps {
  onClose?: () => void;
}

export const HomeAssistantLiveBridge: React.FC<HomeAssistantLiveBridgeProps> = ({ onClose }) => {
  const [config, setConfig] = useState<HomeAssistantConfig>({
    haUrl: 'http://homeassistant.local:8123',
    accessToken: '',
    connected: false,
    version: '3.14.0',
    locationName: 'Home Assistant OS (Humayun Residence)',
    mode: 'EDGE_SANDBOX',
    lastSynced: 'Just now',
    entitiesCount: 12
  });

  const [entities, setEntities] = useState<HardwareEntity[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showToken, setShowToken] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Dual-State Actuator Confirmation Modal State
  const [pendingHighRiskAction, setPendingHighRiskAction] = useState<{
    entity: HardwareEntity;
    service: string;
    requestedState: string;
  } | null>(null);
  const [confirmAuthToken, setConfirmAuthToken] = useState<string>('DUAL_CONFIRM_APPROVED_2026');

  // Add Entity Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newEntityForm, setNewEntityForm] = useState({
    entity_id: '',
    name: '',
    domain: 'light',
    capabilities: 'on_off,brightness',
    isHighRiskActuator: false
  });

  const [supervisorStatus, setSupervisorStatus] = useState<{
    supervisorTokenPresent?: boolean;
    connected?: boolean;
    locationName?: string;
    entitiesCount?: number;
    diagnostic?: any;
  }>({});

  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState<boolean>(false);
  const [showDiagnosticDetails, setShowDiagnosticDetails] = useState<boolean>(true);

  // Load current config & entities on mount
  useEffect(() => {
    fetchConfig();
    fetchEntities();
    fetchSupervisorStatus();
    fetchDiagnostic();
  }, []);

  const fetchDiagnostic = async () => {
    try {
      const data = await fetchHaDiagnostic();
      if (data?.diagnostic) {
        setDiagnosticReport(data.diagnostic);
      }
    } catch {}
  };

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const data = await runHaDiagnostic();
      if (data) {
        if (data.diagnostic) {
          setDiagnosticReport(data.diagnostic);
        }
        if (data.config) {
          setConfig(data.config);
        }
        if (data.entities) {
          setEntities(data.entities);
        }
        await fetchSupervisorStatus();
      }
    } catch (err: any) {
      setStatusMessage({ text: `Diagnostic failed: ${err.message}`, type: 'error' });
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const fetchSupervisorStatus = async () => {
    try {
      const data = await fetchHaStatus();
      if (data) {
        setSupervisorStatus(data);
      }
    } catch {}
  };

  const handleAutoDiscover = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const data = await discoverHa();
      if (data.success) {
        if (data.config) setConfig(data.config);
        if (data.entities) setEntities(data.entities);
        await fetchSupervisorStatus();

        if (data.result?.connected) {
          setStatusMessage({
            text: `🎉 Auto-Discovered Home Assistant! Connected via ${data.result.source} at ${data.result.haUrl} (${data.result.discoveredCount} live entities loaded).`,
            type: 'success'
          });
        } else {
          setStatusMessage({
            text: `ℹ️ Supervisor scan completed: Operating in Edge Sandbox mode (${data.result?.error || 'Local Fallback'}).`,
            type: 'info'
          });
        }
      }
    } catch (err: any) {
      setStatusMessage({ text: `Auto-Discovery Error: ${err.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const data = await fetchHaStatus();
      if (data) {
        setConfig(prev => ({
          ...prev,
          haUrl: data.haUrl || prev.haUrl,
          connected: data.connected ?? prev.connected,
          version: data.version || prev.version,
          locationName: data.locationName || prev.locationName,
          mode: (data.mode as any) || prev.mode,
          lastSynced: data.lastSynced || prev.lastSynced,
          entitiesCount: data.entitiesCount || prev.entitiesCount
        }));
      }
    } catch {}
  };

  const fetchEntities = async () => {
    try {
      const data = await fetchHaStates();
      if (data?.entities && Array.isArray(data.entities)) {
        setEntities(data.entities);
      } else if (data?.states && Array.isArray(data.states)) {
        setEntities(data.states);
      }
    } catch {}
  };

  const handleSaveAndTest = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const data = await updateHaConfig({
        haUrl: config.haUrl,
        accessToken: config.accessToken,
        mode: config.mode
      });

      if (data.success) {
        if (data.config) setConfig(data.config);
        if (data.testSuccess) {
          setStatusMessage({
            text: `✅ ${data.testMessage || 'Connected successfully!'} (HA ${data.config?.version || 'v2026.8'})`,
            type: 'success'
          });
        } else {
          setStatusMessage({
            text: `ℹ️ ${data.testMessage || 'Saved in Edge Sandbox mode.'}`,
            type: 'info'
          });
        }
        await fetchEntities();
      } else {
        setStatusMessage({
          text: `❌ ${data.error || 'Failed to update HA configuration'}`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        text: `❌ Connection error: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncEntities = async () => {
    setIsSyncing(true);
    try {
      const data = await syncHa();
      if (data.success && Array.isArray(data.entities)) {
        setEntities(data.entities);
        setConfig(prev => ({
          ...prev,
          entitiesCount: data.entities.length,
          lastSynced: new Date().toLocaleTimeString()
        }));
        setStatusMessage({
          text: `⚡ Synced ${data.syncedCount || data.entities.length} entities from ${data.source === 'LIVE_HOME_ASSISTANT_API' ? 'Live Home Assistant OS' : 'Edge Hardware Registry'}.`,
          type: 'success'
        });
      }
    } catch (e: any) {
      setStatusMessage({ text: `Sync failed: ${e.message}`, type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExecuteService = async (entity_id: string, service: string, params: Record<string, any> = {}) => {
    const target = entities.find(e => e.entity_id === entity_id);
    
    // Check if entity is marked as a high-risk actuator (e.g. water pump motor)
    if (target?.isHighRiskActuator || (target as any)?.requiresConfirmation) {
      const requestedState = service === 'turn_on' ? 'on' : service === 'turn_off' ? 'off' : 'toggle';
      setPendingHighRiskAction({
        entity: target,
        service,
        requestedState
      });
      return;
    }

    setActionFeedback(`Dispatching ${service} to ${entity_id}...`);
    try {
      const res = await fetch('/api/ha/service-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id, service, params })
      });
      const data = await res.json();
      if (data.success) {
        setActionFeedback(`✅ Executed ${service} on ${entity_id}`);
        // Optimistic UI state refresh
        setEntities(prev => prev.map(e => {
          if (e.entity_id === entity_id) {
            let newState = e.state;
            let newTemp = e.current_temp;
            let newSpeed = e.speed;
            if (service === 'turn_on') newState = 'on';
            if (service === 'turn_off') newState = 'off';
            if (service === 'toggle') newState = e.state === 'on' ? 'off' : 'on';
            if (service === 'set_temperature') newTemp = params.temperature;
            if (service === 'set_percentage') newSpeed = params.percentage;
            if (service === 'lock') newState = 'locked';
            if (service === 'unlock') newState = 'unlocked';
            return { ...e, state: newState, current_temp: newTemp, speed: newSpeed };
          }
          return e;
        }));
      }
    } catch (e: any) {
      setActionFeedback(`❌ Error: ${e.message}`);
    } finally {
      setTimeout(() => setActionFeedback(null), 3000);
    }
  };

  // Dispatch High-Risk Actuator Dual Confirmation Execution
  const handleConfirmHighRiskActuator = async () => {
    if (!pendingHighRiskAction) return;

    setActionFeedback(`Executing dual-state confirmed command for ${pendingHighRiskAction.entity.name}...`);
    try {
      const res = await fetch('/api/ha/actuator-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: pendingHighRiskAction.entity.entity_id,
          service: pendingHighRiskAction.service,
          confirmationToken: confirmAuthToken,
          requestedState: pendingHighRiskAction.requestedState
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionFeedback(`🛡️ Actuator confirmed: ${pendingHighRiskAction.entity.name} is now ${data.entity?.state || pendingHighRiskAction.requestedState}`);
        setEntities(prev => prev.map(e => {
          if (e.entity_id === pendingHighRiskAction.entity.entity_id) {
            return { ...e, state: data.entity?.state || pendingHighRiskAction.requestedState };
          }
          return e;
        }));
        setPendingHighRiskAction(null);
      } else {
        setActionFeedback(`❌ Actuator Lock: ${data.error}`);
      }
    } catch (err: any) {
      setActionFeedback(`❌ Error: ${err.message}`);
    } finally {
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Create new entity
  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityForm.entity_id || !newEntityForm.name) return;

    try {
      const res = await fetch('/api/ha/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: newEntityForm.entity_id,
          name: newEntityForm.name,
          domain: newEntityForm.domain,
          capabilities: newEntityForm.capabilities.split(',').map(c => c.trim()),
          state: 'off',
          isHighRiskActuator: newEntityForm.isHighRiskActuator
        })
      });

      const data = await res.json();
      if (data.success) {
        await fetchEntities();
        setIsAddModalOpen(false);
        setNewEntityForm({
          entity_id: '',
          name: '',
          domain: 'light',
          capabilities: 'on_off,brightness',
          isHighRiskActuator: false
        });
        setStatusMessage({ text: `Entity ${newEntityForm.entity_id} registered successfully!`, type: 'success' });
      }
    } catch (err: any) {
      setStatusMessage({ text: `Failed to create entity: ${err.message}`, type: 'error' });
    }
  };

  // Delete entity
  const handleDeleteEntity = async (entity_id: string) => {
    if (!confirm(`Are you sure you want to remove '${entity_id}' from the active hardware registry?`)) return;
    try {
      const res = await fetch(`/api/ha/entities/${encodeURIComponent(entity_id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setEntities(prev => prev.filter(e => e.entity_id !== entity_id));
        setActionFeedback(`🗑️ Removed entity ${entity_id}`);
      }
    } catch (err: any) {
      setActionFeedback(`❌ Delete failed: ${err.message}`);
    }
  };

  const filteredEntities = selectedDomain === 'all' 
    ? entities 
    : selectedDomain === 'profile_strict'
    ? entities.filter(e => ['light', 'fan', 'switch', 'media_player'].includes(e.domain))
    : entities.filter(e => e.domain === selectedDomain);

  const domainsList = ['all', 'profile_strict', ...Array.from(new Set(entities.map(e => e.domain)))];

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${config.connected && config.mode === 'LIVE_HA' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                Home Assistant Live Controller & Gateway
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                config.connected && config.mode === 'LIVE_HA'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}>
                {config.connected && config.mode === 'LIVE_HA' ? '🟢 LIVE HA CONNECTED' : '🔵 EDGE HARDWARE PROFILE (5L / 4F / 1M / 1S / 1TV)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Hardware Profile: 5 Lights, 4 Fans, 1 Water Motor (1.5 HP Actuator), 1 Soundbox, 1 Smart TV with Dual-State Safety Confirmations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ha-auto-discover-btn"
            onClick={handleAutoDiscover}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            title="Auto-Discover via SUPERVISOR_TOKEN / Add-on Ingress"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Scanning HA...' : '⚡ Auto-Discover HA'}</span>
          </button>

          <button
            id="add-custom-ha-entity-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entity</span>
          </button>

          <button
            id="sync-ha-entities-btn"
            onClick={handleSyncEntities}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live Entities'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Connection & Auth Credentials Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* URL Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home Assistant Base URL</span>
          </label>
          <input
            id="ha-base-url-input"
            type="text"
            value={config.haUrl}
            onChange={(e) => setConfig({ ...config, haUrl: e.target.value })}
            placeholder="http://homeassistant.local:8123"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Long-Lived Token Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Long-Lived Access Token</span>
            </span>
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showToken ? 'Hide' : 'Show'}
            </button>
          </label>
          <input
            id="ha-access-token-input"
            type={showToken ? 'text' : 'password'}
            value={config.accessToken}
            onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
            placeholder="Paste your Home Assistant Long-Lived Token here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Action Button & Live Mode Toggle */}
        <div className="flex flex-col justify-end space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              id="ha-connect-test-btn"
              onClick={handleSaveAndTest}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>{isLoading ? 'Verifying...' : 'Save & Test Connection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
          statusMessage.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' :
          statusMessage.type === 'error' ? 'bg-rose-950/40 border-rose-500/40 text-rose-300' :
          'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
        }`}>
          {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
          {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />}
          {statusMessage.type === 'info' && <Radio className="w-4 h-4 flex-shrink-0 text-cyan-400" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* HA REAL-TIME CONNECTIVITY DIAGNOSTIC & TELEMETRY PANEL */}
      {diagnosticReport && (
        <div className={`rounded-2xl border p-4 font-mono transition-all ${
          diagnosticReport.overallStatus === 'LIVE_CONNECTED'
            ? 'bg-emerald-950/20 border-emerald-500/40'
            : diagnosticReport.overallStatus === 'TOKEN_AUTH_FAILED_401'
            ? 'bg-rose-950/30 border-rose-500/50'
            : diagnosticReport.overallStatus === 'SUPERVISOR_UNREACHABLE'
            ? 'bg-amber-950/30 border-amber-500/50'
            : 'bg-slate-900/60 border-cyan-500/30'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl border ${
                diagnosticReport.overallStatus === 'LIVE_CONNECTED'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : diagnosticReport.overallStatus === 'TOKEN_AUTH_FAILED_401'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : diagnosticReport.overallStatus === 'SUPERVISOR_UNREACHABLE'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    HA Connectivity Diagnostic: {diagnosticReport.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    diagnosticReport.overallStatus === 'LIVE_CONNECTED'
                      ? 'bg-emerald-500 text-slate-950'
                      : diagnosticReport.overallStatus === 'TOKEN_AUTH_FAILED_401'
                      ? 'bg-rose-500 text-white'
                      : diagnosticReport.overallStatus === 'SUPERVISOR_UNREACHABLE'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-cyan-500 text-slate-950'
                  }`}>
                    {diagnosticReport.overallStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {diagnosticReport.titleBn} • {diagnosticReport.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                id="run-ha-diag-btn"
                onClick={handleRunDiagnostic}
                disabled={isRunningDiagnostic}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-cyan-300 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostic ? 'animate-spin text-cyan-400' : ''}`} />
                <span>{isRunningDiagnostic ? 'Probing Network...' : 'Run Network Diagnostic'}</span>
              </button>
              <button
                onClick={() => setShowDiagnosticDetails(!showDiagnosticDetails)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                {showDiagnosticDetails ? 'Hide Details' : 'Show Probes'}
              </button>
            </div>
          </div>

          {showDiagnosticDetails && (
            <div className="mt-3 space-y-3 pt-1">
              {/* Probe log entries */}
              {diagnosticReport.probes && diagnosticReport.probes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Endpoint Probing Telemetry:</span>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60">
                    {diagnosticReport.probes.map((probe: any, idx: number) => (
                      <div key={idx} className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${probe.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span className="text-white font-mono font-semibold truncate">{probe.url}/api/</span>
                          <span className="text-slate-400 text-[10px] truncate">({probe.tokenSource})</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            probe.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {probe.statusCode || (probe.success ? '200 OK' : 'FAILED')}
                          </span>
                          <span className="text-slate-500 text-[10px] font-mono">{probe.latencyMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Troubleshooting Instructions */}
              {diagnosticReport.troubleshootingSteps && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1.5">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>হোম অ্যাসিস্ট্যান্ট কানেকশন গাইডলাইন ও সমাধান:</span>
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 pl-1">
                    {diagnosticReport.troubleshootingSteps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center justify-between shadow-lg">
          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            {actionFeedback}
          </span>
        </div>
      )}

      {/* Real-time Hardware Entities Control Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Hardware Profile & Operational Actuators</span>
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              {filteredEntities.length} Total Devices
            </span>
          </div>

          {/* Domain Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {domainsList.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all capitalize whitespace-nowrap ${
                  selectedDomain === domain
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {domain === 'profile_strict' ? '5L/4F/1M/1S/1TV' : domain}
              </button>
            ))}
          </div>
        </div>

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEntities.map((entity) => {
            const isLight = entity.domain === 'light';
            const isSwitch = entity.domain === 'switch';
            const isClimate = entity.domain === 'climate';
            const isFan = entity.domain === 'fan';
            const isCamera = entity.domain === 'camera';
            const isLock = entity.domain === 'lock';
            const isMediaPlayer = entity.domain === 'media_player';
            const isSensor = entity.domain === 'sensor' || entity.domain === 'binary_sensor';
            const isTV = entity.entity_id.includes('tv') || entity.name.toLowerCase().includes('tv');
            const isMotor = entity.isHighRiskActuator || entity.entity_id.includes('motor');

            const isOn = entity.state === 'on' || entity.state === 'cool' || entity.state === 'playing' || entity.state === 'streaming';
            const isLocked = entity.state === 'locked';

            return (
              <div
                key={entity.entity_id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isMotor
                    ? 'bg-slate-950/90 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/20'
                    : isOn 
                    ? 'bg-slate-950/80 border-cyan-500/40 shadow-sm shadow-cyan-500/5' 
                    : 'bg-slate-950/50 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      isMotor ? 'bg-amber-500/20 text-amber-300' :
                      isOn ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isLight && <Lightbulb className="w-4 h-4" />}
                      {isFan && <Fan className="w-4 h-4" />}
                      {isClimate && <Thermometer className="w-4 h-4" />}
                      {isLock && <Lock className="w-4 h-4" />}
                      {isCamera && <Camera className="w-4 h-4" />}
                      {isTV && <Tv className="w-4 h-4" />}
                      {!isTV && isMediaPlayer && <Volume2 className="w-4 h-4" />}
                      {isSensor && <Radio className="w-4 h-4" />}
                      {!isLight && !isFan && !isClimate && !isLock && !isCamera && !isMediaPlayer && !isSensor && !isTV && (
                        <Power className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[150px] flex items-center gap-1.5" title={entity.name}>
                        <span>{entity.name}</span>
                        {isMotor && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono font-bold">
                            1.5HP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]" title={entity.entity_id}>
                        {entity.entity_id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      isOn 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {entity.state}
                    </span>
                    <button
                      onClick={() => handleDeleteEntity(entity.entity_id)}
                      className="p-1 rounded text-slate-600 hover:text-rose-400 transition-colors"
                      title="Remove entity from registry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Specific Entity Controls */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {/* High Risk Actuator Notice & Dual Confirm Toggle */}
                  {isMotor ? (
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 bg-amber-950/40 p-1.5 rounded border border-amber-500/30">
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                          <span>High-Risk Dual Confirm</span>
                        </span>
                        <span className="font-bold">{entity.state === 'on' ? '5.2A Active' : '0.0A Standby'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 w-full">
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'turn_on')}
                          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-mono font-bold transition-all ${
                            entity.state === 'on'
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                              : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                          }`}
                        >
                          START MOTOR
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'turn_off')}
                          className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-mono font-bold transition-all ${
                            entity.state === 'off'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          STOP MOTOR
                        </button>
                      </div>
                    </div>
                  ) : (isLight || isSwitch || isTV) ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        onClick={() => handleExecuteService(entity.entity_id, 'turn_on')}
                        className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-mono font-medium transition-all ${
                          entity.state === 'on' 
                            ? 'bg-cyan-500 text-slate-950 font-bold' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        ON
                      </button>
                      <button
                        onClick={() => handleExecuteService(entity.entity_id, 'turn_off')}
                        className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-mono font-medium transition-all ${
                          entity.state === 'off' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        OFF
                      </button>
                      <button
                        onClick={() => handleExecuteService(entity.entity_id, 'toggle')}
                        className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-mono"
                      >
                        Toggle
                      </button>
                    </div>
                  ) : null}

                  {isFan && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono text-slate-300">
                        Speed: {entity.speed !== undefined ? `${entity.speed}%` : '66%'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'set_percentage', { percentage: 33 })}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded"
                        >
                          33%
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'set_percentage', { percentage: 66 })}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded"
                        >
                          66%
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'set_percentage', { percentage: 100 })}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono rounded"
                        >
                          100%
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, entity.state === 'on' ? 'turn_off' : 'turn_on')}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono rounded"
                        >
                          {entity.state === 'on' ? 'Off' : 'On'}
                        </button>
                      </div>
                    </div>
                  )}

                  {isLock && (
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-mono ${isLocked ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isLocked ? '🔒 Secure' : '🔓 Unlocked'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'lock')}
                          className="px-2.5 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono rounded-lg hover:bg-emerald-600/40"
                        >
                          Lock
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'unlock')}
                          className="px-2.5 py-1 bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-mono rounded-lg hover:bg-rose-600/40"
                        >
                          Unlock
                        </button>
                      </div>
                    </div>
                  )}

                  {isMediaPlayer && !isTV && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-mono text-slate-400">Audio Node</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'speak', { message: 'হ্যালো হুমায়ুন ভাই! সিস্টেম সক্রিয় আছে।' })}
                          className="px-2 py-0.5 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono rounded hover:bg-cyan-600/30"
                        >
                          TTS Test
                        </button>
                        <button
                          onClick={() => handleExecuteService(entity.entity_id, 'volume_set', { volume_level: 0.7 })}
                          className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded"
                        >
                          Vol 70%
                        </button>
                      </div>
                    </div>
                  )}

                  {isSensor && (
                    <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
                      <span>Telemetry Telecast</span>
                      <span className="text-cyan-400 font-bold">{entity.state}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🛡️ DUAL-STATE CONFIRMATION SAFETY MODAL FOR HIGH-RISK ACTUATORS */}
      {pendingHighRiskAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-amber-500 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  DUAL-STATE CONFIRMATION PROTOCOL
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  High-Risk Heavy Actuator Protection
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Actuator:</span>
                <span className="text-white font-bold">{pendingHighRiskAction.entity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entity ID:</span>
                <span className="text-cyan-300">{pendingHighRiskAction.entity.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Action:</span>
                <span className="text-amber-400 font-bold uppercase">{pendingHighRiskAction.service || pendingHighRiskAction.requestedState}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Dual-Confirmation Token:</span>
              </label>
              <input
                type="text"
                value={confirmAuthToken}
                onChange={(e) => setConfirmAuthToken(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setPendingHighRiskAction(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                id="execute-confirmed-actuator-btn"
                onClick={handleConfirmHighRiskActuator}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-mono font-bold text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>CONFIRM & EXECUTE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD CUSTOM ENTITY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono font-bold text-sm">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Register Custom HA Hardware Entity</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntity} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300">Entity ID (e.g. light.kitchen_counter):</label>
                <input
                  type="text"
                  required
                  value={newEntityForm.entity_id}
                  onChange={(e) => setNewEntityForm({ ...newEntityForm, entity_id: e.target.value })}
                  placeholder="light.kitchen_counter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Friendly Name:</label>
                <input
                  type="text"
                  required
                  value={newEntityForm.name}
                  onChange={(e) => setNewEntityForm({ ...newEntityForm, name: e.target.value })}
                  placeholder="Kitchen Counter Light"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">Domain:</label>
                <select
                  value={newEntityForm.domain}
                  onChange={(e) => setNewEntityForm({ ...newEntityForm, domain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="light">Light</option>
                  <option value="fan">Fan</option>
                  <option value="switch">Switch / Actuator</option>
                  <option value="media_player">Media Player / TV / Soundbox</option>
                  <option value="lock">Lock</option>
                  <option value="climate">Climate</option>
                  <option value="camera">Camera</option>
                  <option value="sensor">Sensor</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="high-risk-checkbox"
                  checked={newEntityForm.isHighRiskActuator}
                  onChange={(e) => setNewEntityForm({ ...newEntityForm, isHighRiskActuator: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="high-risk-checkbox" className="text-amber-300 cursor-pointer">
                  Require Dual-State Confirmation (High-Risk Actuator)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
