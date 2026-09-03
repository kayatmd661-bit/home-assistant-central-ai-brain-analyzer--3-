import React, { useState } from 'react';
import { 
  Sliders, 
  Trash2, 
  Play, 
  Edit3, 
  Plus, 
  Power, 
  Check, 
  Copy, 
  Download, 
  Upload, 
  Sparkles, 
  Clock, 
  Activity, 
  Layers, 
  CheckCircle2,
  X,
  Save
} from 'lucide-react';
import { AutomationRule } from '../types';

interface RuleLifecycleManagerProps {
  rules: AutomationRule[];
  onToggleRule: (ruleId: string, currentEnabled: boolean) => void;
  onDeleteRule: (ruleId: string) => void;
  onUpdateRule: (updatedRule: AutomationRule) => void;
  onAddNewRule: (newRule: AutomationRule) => void;
  killSwitchActive: boolean;
}

export const RuleLifecycleManager: React.FC<RuleLifecycleManagerProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onUpdateRule,
  onAddNewRule,
  killSwitchActive
}) => {
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [executingId, setExecutingId] = useState<string | null>(null);

  // New Rule Form State
  const [newName, setNewName] = useState('');
  const [newNameBn, setNewNameBn] = useState('');
  const [newRawIntent, setNewRawIntent] = useState('');
  const [newTriggerType, setNewTriggerType] = useState<AutomationRule['triggerType']>('TEMPORAL');
  const [newTriggerDetails, setNewTriggerDetails] = useState('');

  const filteredRules = rules.filter(r => {
    const matchesFilter = filterType === 'ALL' || r.triggerType === filterType;
    const matchesSearch = !searchQuery || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rawIntent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExecuteRuleNow = async (rule: AutomationRule) => {
    if (killSwitchActive) {
      alert('মাস্টার কিল-সুইচ সক্রিয় থাকায় রুটিন রান করা সম্ভব নয়।');
      return;
    }
    setExecutingId(rule.id);
    for (const act of rule.actions) {
      await fetch('/api/ha/service-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: act.entity_id,
          service: act.service,
          params: act.params
        })
      });
    }
    setTimeout(() => setExecutingId(null), 1000);
  };

  const handleSaveEditedRule = () => {
    if (!editingRule) return;
    onUpdateRule(editingRule);
    setEditingRule(null);
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() && !newNameBn.trim()) return;

    const newRule: AutomationRule = {
      id: `rule-${Date.now().toString(36)}`,
      name: newName || 'Custom Automated Routine',
      nameBn: newNameBn || 'কাস্টম স্বয়ংক্রিয় রুল',
      rawIntent: newRawIntent || 'User manual created routine',
      triggerType: newTriggerType,
      triggerDetails: newTriggerDetails || 'Manual user configuration',
      actions: [
        { entity_id: 'light.drawing_room', service: 'turn_on', params: { brightness_pct: 70 } }
      ],
      enabled: true,
      feasibilityScore: 100,
      matchedEntities: ['light.drawing_room'],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      executionCount: 0
    };

    onAddNewRule(newRule);
    setIsAddingNew(false);
    setNewName('');
    setNewNameBn('');
    setNewRawIntent('');
    setNewTriggerDetails('');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rules, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'haos_automation_rules_registry.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Persistent State Registry & Complete Rule Lifecycle (CRUD)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              অটোমেশন রুলস লাইফসাইকেল কন্ট্রোল
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mt-1">
              SQLite WAL ডাটাবেসে সংরক্ষিত সকল স্বয়ংক্রিয় রুটিন পরিচালনা করুন। যেকোনো রুল অন/অফ টগল করুন, প্যারামিটার লাইভ এডিট করুন, অথবা স্থায়ীভাবে ডিলিট করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="add-new-rule-btn"
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন রুল যোগ করুন</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title="JSON ফরম্যাটে ব্যাকআপ ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON এক্সপোর্ট</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {['ALL', 'TEMPORAL', 'EVENT', 'VISION', 'STATE', 'VOICE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="রুল সার্চ করুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Rules List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRules.map((rule) => {
          const isExec = executingId === rule.id;
          return (
            <div
              key={rule.id}
              className={`bg-slate-900 rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between space-y-4 ${
                rule.enabled 
                  ? 'border-slate-800 hover:border-slate-700 shadow-xl' 
                  : 'border-slate-900 opacity-60 bg-slate-950/60'
              }`}
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {rule.triggerType}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Feasibility: {rule.feasibilityScore}%
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {rule.nameBn}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {rule.name}
                    </p>
                  </div>

                  {/* Toggle Enable/Disable Switch */}
                  <button
                    onClick={() => onToggleRule(rule.id, rule.enabled)}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                      rule.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{rule.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>
                </div>

                {/* Intent & Trigger breakdown */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs font-mono">
                  <div className="text-slate-300">
                    <span className="text-slate-500">ইন্টেন্ট:</span> "{rule.rawIntent}"
                  </div>
                  <div className="text-cyan-400 text-[11px]">
                    <span className="text-slate-500">ট্রিগার লজিক:</span> {rule.triggerDetails}
                  </div>
                </div>

                {/* Actions Table */}
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-500">এক্সিকিউশন অ্যাকশনসমূহ:</div>
                  <div className="space-y-1">
                    {rule.actions.map((act, aIdx) => (
                      <div key={aIdx} className="bg-slate-950 px-2.5 py-1.5 rounded text-[11px] font-mono flex items-center justify-between text-slate-300 border border-slate-900">
                        <span>{act.entity_id} → <strong className="text-cyan-300">{act.service}</strong></span>
                        <span className="text-slate-500">{JSON.stringify(act.params)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Metadata & Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>রান হয়েছে: <strong className="text-slate-300">{rule.executionCount} বার</strong></span>
                  <span>•</span>
                  <span>{rule.createdAt.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExecuteRuleNow(rule)}
                    disabled={!rule.enabled || isExec}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-40 cursor-pointer"
                    title="এখনই রান করুন"
                  >
                    <Play className={`w-3.5 h-3.5 ${isExec ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    title="এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Rule Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                রুল প্যারামিটার এডিট
              </h3>
              <button onClick={() => setEditingRule(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">বাংলা শিরোনাম:</label>
                <input
                  type="text"
                  value={editingRule.nameBn}
                  onChange={(e) => setEditingRule({ ...editingRule, nameBn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ট্রিগার বিবরণ (Trigger Details):</label>
                <input
                  type="text"
                  value={editingRule.triggerDetails}
                  onChange={(e) => setEditingRule({ ...editingRule, triggerDetails: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingRule(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveEditedRule}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>পরিবর্তন সংরক্ষণ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Rule Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateRuleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                নতুন অটোমেশন রুটিন তৈরি
              </h3>
              <button type="button" onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">রুলের নাম (বাংলা):</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সন্ধ্যায় লাইট অন ও এসি সমন্বয়"
                  value={newNameBn}
                  onChange={(e) => setNewNameBn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">English Identifier:</label>
                <input
                  type="text"
                  placeholder="e.g. Evening Ambient Light Setup"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ট্রিগার টাইপ:</label>
                <select
                  value={newTriggerType}
                  onChange={(e) => setNewTriggerType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="TEMPORAL">TEMPORAL (Time / Sunset / Delay)</option>
                  <option value="EVENT">EVENT (Motion Sensor / Switch)</option>
                  <option value="VISION">VISION (YOLO Camera Tracking)</option>
                  <option value="STATE">STATE (Entity State Change)</option>
                  <option value="VOICE">VOICE (Natural Speech Trigger)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">ট্রিগার লজিক বিবরণ:</label>
                <input
                  type="text"
                  placeholder="যেমন: Daily at 18:30 or PIR Motion == ON"
                  value={newTriggerDetails}
                  onChange={(e) => setNewTriggerDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SQLite-এ সংরক্ষণ</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
