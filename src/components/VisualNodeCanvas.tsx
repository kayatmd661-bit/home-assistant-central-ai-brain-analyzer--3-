import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Plus, 
  Play, 
  Save, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Eye, 
  Clock, 
  Radio, 
  Sliders, 
  Move,
  Sparkles,
  Layers,
  History,
  Info,
  Code,
  Copy,
  ChevronRight,
  GitBranch,
  X,
  FileCode2,
  ListTree,
  Flame,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Shield,
  ArrowRight
} from 'lucide-react';
import { CanvasNode, CanvasConnection, AutomationRule } from '../types';

interface VisualNodeCanvasProps {
  onSaveRule: (rule: AutomationRule) => void;
  killSwitchActive: boolean;
  rules?: AutomationRule[];
}

const INITIAL_NODES: CanvasNode[] = [
  {
    id: 'node-trig-1',
    type: 'TRIGGER',
    label: 'Front Gate Camera Person Motion',
    labelBn: 'গেটে মানুষের উপস্থিতি শনাক্ত (YOLOv8)',
    entityId: 'camera.front_gate',
    subType: 'VISION_EVENT',
    x: 60,
    y: 120,
    status: 'IDLE',
    params: { confidence_threshold: 0.85, class: 'person' }
  },
  {
    id: 'node-cond-1',
    type: 'CONDITION',
    label: 'Ambient Light Check (Sunset < 15 Lux)',
    labelBn: 'পর্যাপ্ত অন্ধকার আছে কিনা যাচাই',
    entityId: 'sensor.outdoor_illuminance',
    subType: 'LUX_THRESHOLD',
    x: 380,
    y: 120,
    status: 'IDLE',
    params: { operator: '<', value: 15, unit: 'lux' }
  },
  {
    id: 'node-ai-1',
    type: 'AI_REASONING',
    label: 'Gemini 3.7 Multi-Modal Edge Reasoning',
    labelBn: 'মাল্টি-মোডাল ইনটেনশন ও থ্রেট অ্যানালাইসিস',
    subType: 'LLM_REASONING',
    x: 700,
    y: 120,
    status: 'IDLE',
    params: { model: 'gemini-3.7-flash', intent_parser: true }
  },
  {
    id: 'node-act-1',
    type: 'HARDWARE_ACTION',
    label: 'PTZ Camera Auto-Center & Track',
    labelBn: 'ক্যামেরা মানুষের দিকে প্যান ও জুম করা',
    entityId: 'camera.front_gate',
    subType: 'PTZ_CONTROL',
    x: 1020,
    y: 60,
    status: 'IDLE',
    params: { action: 'ptz_pan_center', speed: 'fast' }
  },
  {
    id: 'node-act-2',
    type: 'HARDWARE_ACTION',
    label: 'Outdoor 2-Way Speaker Bengali Warning',
    labelBn: 'স্পিকারে বাংলায় স্বাগতম/জিজ্ঞাসাবাদ',
    entityId: 'media_player.door_speaker',
    subType: 'TTS_ALSA',
    x: 1020,
    y: 220,
    status: 'IDLE',
    params: { message: 'হ্যালো! আপনি কার সাথে দেখা করতে এসেছেন?', language: 'bn-BD' }
  }
];

const INITIAL_CONNECTIONS: CanvasConnection[] = [
  { id: 'conn-1', fromNodeId: 'node-trig-1', toNodeId: 'node-cond-1', label: 'Signal Out' },
  { id: 'conn-2', fromNodeId: 'node-cond-1', toNodeId: 'node-ai-1', label: 'If True' },
  { id: 'conn-3', fromNodeId: 'node-ai-1', toNodeId: 'node-act-1', label: 'Dispatch PTZ' },
  { id: 'conn-4', fromNodeId: 'node-ai-1', toNodeId: 'node-act-2', label: 'Dispatch TTS' }
];

// Helper to convert an AutomationRule into visual Canvas nodes and connections
function ruleToCanvasGraph(rule: AutomationRule): { nodes: CanvasNode[]; connections: CanvasConnection[] } {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];

  const raw = rule.rawIntent || rule.name;
  const isNight = raw.toLowerCase().includes('রাত') || raw.toLowerCase().includes('night') || raw.toLowerCase().includes('11') || raw.toLowerCase().includes('22:00');
  const hasMotion = raw.toLowerCase().includes('মোশন') || raw.toLowerCase().includes('motion') || raw.toLowerCase().includes('নড়াচড়া');
  const hasVehicle = raw.toLowerCase().includes('গাড়ি') || raw.toLowerCase().includes('car') || raw.toLowerCase().includes('vehicle');
  const hasPet = raw.toLowerCase().includes('প্রাণী') || raw.toLowerCase().includes('pet') || raw.toLowerCase().includes('কুকুর');
  const hasSound = raw.toLowerCase().includes('শব্দ') || raw.toLowerCase().includes('sound') || raw.toLowerCase().includes('noise');
  const isCameraRule = rule.triggerType === 'VISION' || rule.matchedEntities.some(e => e.startsWith('camera.'));

  // 1. Primary Trigger Node
  const trigId = `node-trig-${rule.id}`;
  let trigLabel = `${rule.triggerType} Trigger`;
  let trigLabelBn = 'ট্রিগার ইভেন্ট সিগন্যাল';
  let trigEntity = rule.matchedEntities[0] || 'binary_sensor.motion';
  let trigSub = 'EVENT';

  if (isCameraRule) {
    if (hasVehicle) {
      trigLabel = 'AI Vehicle Detection (Driveway)';
      trigLabelBn = 'ক্যামেরায় গাড়ি শনাক্তকরণ (Vehicle AI)';
      trigSub = 'CAMERA_VEHICLE_EVENT';
    } else if (hasPet) {
      trigLabel = 'AI Pet / Animal Detection';
      trigLabelBn = 'ক্যামেরায় পোষা প্রাণী শনাক্ত (Pet AI)';
      trigSub = 'CAMERA_PET_EVENT';
    } else if (hasSound) {
      trigLabel = 'Camera Mic Audio Threshold Exceeded';
      trigLabelBn = 'ক্যামেরা মাইকে শব্দ থ্রেশহোল্ড অতিক্রম (>60dB)';
      trigSub = 'CAMERA_AUDIO_EVENT';
    } else {
      trigLabel = 'AI Person / Intruder Detection';
      trigLabelBn = 'ক্যামেরায় মানুষ শনাক্তকরণ (YOLOv8 Person)';
      trigSub = 'CAMERA_PERSON_EVENT';
    }
    trigEntity = rule.matchedEntities.find(e => e.startsWith('camera.')) || 'camera.front_gate';
  } else if (rule.triggerType === 'TEMPORAL' || isNight) {
    trigLabel = 'Time Clock Event (23:00:00)';
    trigLabelBn = 'সময় ঘড়ি ট্রিগার: রাত ১১:০০ টা';
    trigSub = 'TIME_CRON';
    trigEntity = 'sensor.time';
  } else if (hasMotion) {
    trigLabel = 'Motion Sensor Detected (On)';
    trigLabelBn = 'মোশন সেন্সরে নড়াচড়া শনাক্ত';
    trigSub = 'STATE_CHANGE';
    trigEntity = 'binary_sensor.hallway_motion';
  }

  nodes.push({
    id: trigId,
    type: 'TRIGGER',
    label: trigLabel,
    labelBn: trigLabelBn,
    entityId: trigEntity,
    subType: trigSub,
    x: 60,
    y: 120,
    status: 'IDLE',
    params: { trigger_details: rule.triggerDetails || 'Time/State Event' }
  });

  // 2. Condition Node(s)
  const condId = `node-cond-${rule.id}`;
  let condLabel = 'State & Safety Pre-Condition';
  let condLabelBn = 'শর্ত ও নিরাপত্তা ফিল্টার';
  let condEntity = rule.matchedEntities[1] || 'sensor.illuminance';
  let condParams: Record<string, any> = { condition: 'state', expected: 'active' };

  if (isNight) {
    condLabel = 'Night DND Time Range (22:00 - 07:00)';
    condLabelBn = 'নাইট ডিএনডি সময়সীমা (রাত ১০টা - সকাল ৭টা)';
    condEntity = 'sensor.night_mode';
    condParams = { condition: 'time', after: '22:00:00', before: '07:00:00' };
  }

  nodes.push({
    id: condId,
    type: 'CONDITION',
    label: condLabel,
    labelBn: condLabelBn,
    entityId: condEntity,
    subType: 'LOGICAL_FILTER',
    x: 360,
    y: 120,
    status: 'IDLE',
    params: condParams
  });

  connections.push({
    id: `conn-trig-cond-${rule.id}`,
    fromNodeId: trigId,
    toNodeId: condId,
    label: 'Verified Trigger'
  });

  // 3. AI / Logic Core Node
  const aiId = `node-ai-${rule.id}`;
  nodes.push({
    id: aiId,
    type: 'AI_REASONING',
    label: 'Master Automation Decision Core',
    labelBn: 'ডিসিশন লজিক ও ভ্যালিডেশন ইঞ্জিন',
    subType: 'RULE_PARSER',
    x: 660,
    y: 120,
    status: 'IDLE',
    params: {
      feasibilityScore: rule.feasibilityScore || 100,
      mode: 'restart',
      sourceRuleId: rule.id
    }
  });

  connections.push({
    id: `conn-cond-ai-${rule.id}`,
    fromNodeId: condId,
    toNodeId: aiId,
    label: 'Condition Met'
  });

  // 4. Action Nodes
  if (rule.actions && rule.actions.length > 0) {
    rule.actions.forEach((act, idx) => {
      const actId = `node-act-${rule.id}-${idx}`;
      const isDelay = act.delay_seconds && act.delay_seconds > 0;
      
      let actLabel = `${act.service} (${act.entity_id})`;
      let actLabelBn = `অ্যাকশন: ${act.service}`;
      
      if (act.service.includes('turn_on')) actLabelBn = `লাইট/ডিভাইস অন (${act.entity_id})`;
      else if (act.service.includes('turn_off')) actLabelBn = `লাইট/ডিভাইস অফ (${act.entity_id})`;
      else if (act.service.includes('volume')) actLabelBn = `স্পিকার ভলিউম নিঃশব্দ (Night DND)`;
      else if (act.service.includes('speak') || act.service.includes('tts')) actLabelBn = `ভয়েস ও স্পিকার আউটপুট (${act.entity_id})`;
      else if (act.service.includes('ptz')) actLabelBn = `ক্যামেরা PTZ প্যান ও প্রিসেট প্যাট্রোল`;
      else if (act.service.includes('siren')) actLabelBn = `ক্যামেরা সাইরেন অ্যালার্ম সক্রিয়`;
      else if (act.service.includes('spotlight')) actLabelBn = `ক্যামেরা স্পটলাইট / IR টগল`;
      else if (act.service.includes('block') || act.service.includes('firewall')) actLabelBn = `রাউটার ফায়ারওয়াল ব্লক`;
      else if (act.service.includes('speed') || act.service.includes('throttle')) actLabelBn = `ব্যান্ডউইথ স্পিড লিমিট কনফিগার`;
      else if (act.service.includes('bluetooth') || act.service.includes('broadcast')) actLabelBn = `মাল্টি-ব্লুটুথ ব্রডকাস্ট ম্যাট্রিক্স`;
      else if (act.service.includes('reactive') || act.service.includes('fft')) actLabelBn = `এফএফটি মিউজিক লাইটিং সিঙ্ক`;

      const nodeY = rule.actions.length === 1 ? 120 : 60 + idx * 130;

      nodes.push({
        id: actId,
        type: 'HARDWARE_ACTION',
        label: actLabel,
        labelBn: actLabelBn,
        entityId: act.entity_id,
        subType: isDelay ? 'DELAYED_DISPATCH' : 'INSTANT_SERVICE',
        x: 960,
        y: nodeY,
        status: 'IDLE',
        params: {
          service: act.service,
          params: act.params || {},
          delay_seconds: act.delay_seconds || 0
        }
      });

      connections.push({
        id: `conn-ai-act-${rule.id}-${idx}`,
        fromNodeId: aiId,
        toNodeId: actId,
        label: isDelay ? `Delay ${Math.round(act.delay_seconds! / 60)}m` : `Dispatch Step ${idx + 1}`
      });
    });
  } else {
    // Default fallback action node
    const fallbackActId = `node-act-${rule.id}-0`;
    nodes.push({
      id: fallbackActId,
      type: 'HARDWARE_ACTION',
      label: 'Home Assistant Service Call',
      labelBn: 'হোম অ্যাসিস্ট্যান্ট সার্ভিস এক্সিকিউশন',
      entityId: rule.matchedEntities[0] || 'light.master_bedroom',
      subType: 'SERVICE_CALL',
      x: 960,
      y: 120,
      status: 'IDLE',
      params: { service: 'homeassistant.turn_on' }
    });

    connections.push({
      id: `conn-ai-act-${rule.id}-0`,
      fromNodeId: aiId,
      toNodeId: fallbackActId,
      label: 'Dispatch'
    });
  }

  return { nodes, connections };
}

// Generate Home Assistant YAML from canvas nodes & connections
function generateHaYamlFromNodes(nodes: CanvasNode[], connections: CanvasConnection[], ruleTitle: string): string {
  const triggers = nodes.filter(n => n.type === 'TRIGGER');
  const conditions = nodes.filter(n => n.type === 'CONDITION');
  const actions = nodes.filter(n => n.type === 'HARDWARE_ACTION');

  let yaml = `# Home Assistant OS - Visual Canvas Compiled Automation\n`;
  yaml += `id: "${ruleTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}"\n`;
  yaml += `alias: "${ruleTitle}"\n`;
  yaml += `description: "স্বয়ংক্রিয়ভাবে তৈরি ভিজ্যুয়াল নোড গ্রাফ অটোমেশন পাইপলাইন।"\n`;
  yaml += `mode: restart\n\n`;

  yaml += `trigger:\n`;
  if (triggers.length > 0) {
    triggers.forEach(t => {
      yaml += `  - platform: ${t.subType === 'TIME_CRON' ? 'time' : 'state'}\n`;
      if (t.subType === 'TIME_CRON') {
        yaml += `    at: "23:00:00"\n`;
      } else {
        yaml += `    entity_id: ${t.entityId || 'binary_sensor.motion'}\n`;
        yaml += `    to: "on"\n`;
      }
    });
  } else {
    yaml += `  - platform: state\n    entity_id: light.drawing_room\n    to: "on"\n`;
  }

  yaml += `\ncondition:\n`;
  if (conditions.length > 0) {
    conditions.forEach(c => {
      if (c.subType === 'TIME_RANGE' || c.label.includes('Night') || c.labelBn.includes('নাইট')) {
        yaml += `  - condition: time\n    after: "22:00:00"\n    before: "07:00:00"\n`;
      } else {
        yaml += `  - condition: state\n    entity_id: ${c.entityId || 'sensor.illuminance'}\n    state: "active"\n`;
      }
    });
  } else {
    yaml += `  []\n`;
  }

  yaml += `\naction:\n`;
  if (actions.length > 0) {
    actions.forEach(a => {
      if (a.params?.delay_seconds && a.params.delay_seconds > 0) {
        yaml += `  - delay:\n      minutes: ${Math.round(a.params.delay_seconds / 60)}\n`;
      }
      yaml += `  - service: ${a.params?.service || 'light.turn_on'}\n`;
      yaml += `    target:\n      entity_id: ${a.entityId || 'light.master_bedroom'}\n`;
      if (a.params?.params && Object.keys(a.params.params).length > 0) {
        yaml += `    data:\n`;
        Object.entries(a.params.params).forEach(([k, v]) => {
          yaml += `      ${k}: ${JSON.stringify(v)}\n`;
        });
      }
    });
  } else {
    yaml += `  - service: light.turn_on\n    target:\n      entity_id: light.drawing_room\n`;
  }

  return yaml;
}

export const VisualNodeCanvas: React.FC<VisualNodeCanvasProps> = ({ onSaveRule, killSwitchActive, rules = [] }) => {
  const [nodes, setNodes] = useState<CanvasNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<CanvasConnection[]>(INITIAL_CONNECTIONS);
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<CanvasConnection | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string>('custom_canvas');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'details' | 'yaml' | 'json'>('details');
  const [copied, setCopied] = useState<boolean>(false);
  const [branchingFromNodeId, setBranchingFromNodeId] = useState<string | null>(null);

  // Dragging state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load selected rule into canvas
  const handleSelectRuleToRender = (rule: AutomationRule) => {
    setSelectedRuleId(rule.id);
    const { nodes: reconstructedNodes, connections: reconstructedConns } = ruleToCanvasGraph(rule);
    setNodes(reconstructedNodes);
    setConnections(reconstructedConns);
    setSelectedNode(reconstructedNodes[0] || null);
    setSelectedConnection(null);
  };

  const handleResetToCustom = () => {
    setSelectedRuleId('custom_canvas');
    setNodes(INITIAL_NODES);
    setConnections(INITIAL_CONNECTIONS);
    setSelectedNode(INITIAL_NODES[0]);
    setSelectedConnection(null);
  };

  const handleMouseDown = (node: CanvasNode, e: React.MouseEvent) => {
    setDraggedNodeId(node.id);
    setSelectedNode(node);
    setSelectedConnection(null);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId) return;
    setNodes(prev => prev.map(n => {
      if (n.id === draggedNodeId) {
        return {
          ...n,
          x: Math.max(20, Math.min(1100, e.clientX - dragOffset.x)),
          y: Math.max(20, Math.min(480, e.clientY - dragOffset.y))
        };
      }
      return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleRunSimulationPulse = () => {
    if (killSwitchActive) {
      alert('মাস্টার কিল-সুইচ সক্রিয় থাকায় ক্যানভাস সিমুলেশন স্থগিত রাখা হয়েছে।');
      return;
    }

    setIsSimulating(true);
    setActiveStep(0);

    const orderedNodeIds = nodes.map(n => n.id);

    orderedNodeIds.forEach((nodeId, idx) => {
      setTimeout(() => {
        setActiveStep(idx);
        setNodes(prev => prev.map(n => ({
          ...n,
          status: n.id === nodeId ? 'EXECUTING' : prev.find(p => p.id === n.id)?.status || 'IDLE'
        })));

        if (idx === orderedNodeIds.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setActiveStep(-1);
            setNodes(prev => prev.map(n => ({ ...n, status: 'IDLE' })));
          }, 1200);
        }
      }, (idx + 1) * 700);
    });
  };

  const handleCompileToRule = () => {
    const triggers = nodes.filter(n => n.type === 'TRIGGER');
    const actions = nodes.filter(n => n.type === 'HARDWARE_ACTION');

    const compiledRule: AutomationRule = {
      id: `rule-canvas-${Date.now().toString(36)}`,
      name: `Visual Flow: ${triggers[0]?.label || 'Automation'}`,
      nameBn: `ভিজ্যুয়াল ওয়্যার অটোমেশন: ${triggers[0]?.labelBn || 'নোড গ্রাফ'}`,
      rawIntent: `Visual Canvas Flow: ${nodes.map(n => n.label).join(' -> ')}`,
      triggerType: (triggers[0]?.subType === 'TIME_CRON' ? 'TEMPORAL' : 'EVENT') as any,
      triggerDetails: triggers.map(t => `${t.labelBn} (${t.entityId || 'Global'})`).join(', '),
      actions: actions.map(act => ({
        entity_id: act.entityId || 'light.master_bedroom',
        service: act.params?.service || 'turn_on',
        params: act.params?.params || {},
        delay_seconds: act.params?.delay_seconds || 0
      })),
      enabled: true,
      feasibilityScore: 100,
      matchedEntities: Array.from(new Set(nodes.map(n => n.entityId).filter(Boolean) as string[])),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      executionCount: 1
    };

    onSaveRule(compiledRule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddNode = (type: CanvasNode['type'], customLabel?: string, customLabelBn?: string, customEntity?: string) => {
    const id = `node-${type.toLowerCase()}-${Date.now().toString(36)}`;
    let label = customLabel || 'New Node';
    let labelBn = customLabelBn || 'নতুন নোড';
    let subType = 'GENERIC';
    let entityId = customEntity || '';

    if (type === 'TRIGGER') {
      label = 'Voice Trigger Keyword';
      labelBn = 'ভয়েস কমান্ড ট্রিগার';
      subType = 'VOICE_VAD';
    } else if (type === 'CONDITION') {
      label = 'Time Schedule Check (22:00 - 07:00)';
      labelBn = 'নাইট ডিএনডি সময় ফিল্টার';
      subType = 'TIME_RANGE';
    } else if (type === 'AI_REASONING') {
      label = 'Master Dynamic Reasoning Engine';
      labelBn = 'অন-ডিভাইস নিউরাল ডিসিশন কোর';
      subType = 'NUMPY_TRANSFORMER';
    } else {
      label = 'Living Room Light Control';
      labelBn = 'ড্রয়িং রুম লাইট কন্ট্রোল';
      entityId = 'light.drawing_room';
      subType = 'DIMMER';
    }

    const newNode: CanvasNode = {
      id,
      type,
      label,
      labelBn,
      subType,
      entityId,
      x: 150 + Math.random() * 400,
      y: 100 + Math.random() * 200,
      status: 'IDLE',
      params: {}
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    setSelectedConnection(null);

    // If branching from a node, automatically create connection
    if (branchingFromNodeId) {
      const newConn: CanvasConnection = {
        id: `conn-branch-${Date.now().toString(36)}`,
        fromNodeId: branchingFromNodeId,
        toNodeId: id,
        label: 'Branch Next Step'
      };
      setConnections(prev => [...prev, newConn]);
      setBranchingFromNodeId(null);
    }
  };

  const handleBranchNewActionFromNode = (node: CanvasNode) => {
    setBranchingFromNodeId(node.id);
    const newActId = `node-act-branch-${Date.now().toString(36)}`;
    const newActNode: CanvasNode = {
      id: newActId,
      type: 'HARDWARE_ACTION',
      label: 'Branched Extra Hardware Action',
      labelBn: 'ব্রাঞ্চ করা অতিরিক্ত অ্যাকশন স্টেপ',
      entityId: 'media_player.master_speaker',
      subType: 'CHIME_NOTIFY',
      x: Math.min(1050, node.x + 260),
      y: Math.min(450, node.y + (Math.random() > 0.5 ? 80 : -80)),
      status: 'IDLE',
      params: { service: 'media_player.play_media', media_type: 'sound_chime' }
    };

    const newConn: CanvasConnection = {
      id: `conn-branch-${Date.now().toString(36)}`,
      fromNodeId: node.id,
      toNodeId: newActId,
      label: 'Branched Step'
    };

    setNodes(prev => [...prev, newActNode]);
    setConnections(prev => [...prev, newConn]);
    setSelectedNode(newActNode);
  };

  const handleDeleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes(prev => prev.filter(n => n.id !== selectedNode.id));
    setConnections(prev => prev.filter(c => c.fromNodeId !== selectedNode.id && c.toNodeId !== selectedNode.id));
    setSelectedNode(null);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentRuleTitle = selectedRuleId !== 'custom_canvas'
    ? (rules.find(r => r.id === selectedRuleId)?.nameBn || 'Reconstructed Visual Flow')
    : 'Custom Interactive Canvas Pipeline';

  const compiledYaml = generateHaYamlFromNodes(nodes, connections, currentRuleTitle);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Mode Controller */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20 mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>Previously Saved Automation Visualizer & Detailed Flow Inspector</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>ভিজ্যুয়াল ওয়্যার নোড ক্যানভাস ও হিস্ট্রি ফ্লোচার্ট ইন্সপেক্টর</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-normal">
                Multi-Rule Mapping
              </span>
            </h2>
            <p className="text-slate-300 text-xs font-mono max-w-3xl mt-1 leading-relaxed">
              পূর্বে তৈরি করা যেকোনো অটোমেশনের পূর্ণ ফ্লোচার্ট তাৎক্ষণিক রেন্ডার করুন, নোড লেবেল ও ডিভাইস প্যারামিটার পরীক্ষা করুন এবং যেকোনো নোড থেকে নতুন ব্রাঞ্চ বা অ্যাকশন যুক্ত করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunSimulationPulse}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-bounce text-amber-300' : ''}`} />
              <span>{isSimulating ? 'সিগন্যাল প্রবাহিত হচ্ছে...' : 'লাইভ ওয়্যার পালস টেস্ট'}</span>
            </button>

            <button
              onClick={handleCompileToRule}
              disabled={savedSuccess}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'সংরক্ষণ সম্পন্ন' : 'রুল হিসেবে সেভ করুন'}</span>
            </button>
          </div>
        </div>

        {/* 1. Existing & History Automation Selector Tray */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>সংরক্ষিত ও হিস্ট্রি অটোমেশন তালিকা (Select to Reconstruct Visual Graph):</span>
            </span>
            <span className="text-[11px] text-slate-500">
              মোট {rules.length} টি অটোমেশন রুল সক্রিয়
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={handleResetToCustom}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedRuleId === 'custom_canvas'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md font-bold'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>🌟 ডিফল্ট ইন্টারেক্টিভ ক্যানভাস</span>
            </button>

            {rules.map(rule => {
              const isSelected = selectedRuleId === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => handleSelectRuleToRender(rule)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400 shadow-md shadow-indigo-500/20 font-bold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <ListTree className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate max-w-[180px]">{rule.nameBn || rule.name}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {rule.triggerType}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Drawer Palette */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none text-xs font-mono">
          <span className="text-slate-500 text-[11px] shrink-0">নতুন নোড যুক্ত করুন:</span>
          <button
            onClick={() => handleAddNode('TRIGGER')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ট্রিগার নোড</span>
          </button>
          <button
            onClick={() => handleAddNode('CONDITION')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 hover:bg-amber-900/50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ কন্ডিশন নোড</span>
          </button>
          <button
            onClick={() => handleAddNode('AI_REASONING')}
            className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-800/50 hover:bg-purple-900/50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ AI ডিসিশন কোর</span>
          </button>
          <button
            onClick={() => handleAddNode('HARDWARE_ACTION')}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/50 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ আউটপুট অ্যাকশন</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Workspace with Side Inspector Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left/Center: Visual Node Canvas (8 or 12 Cols) */}
        <div className={`${selectedNode || selectedConnection ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-3 transition-all`}>
          
          <div 
            className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden select-none min-h-[520px]"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#38bdf8 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Active Rendered Automation Tag */}
            <div className="absolute top-3 left-3 z-30 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">অ্যাক্টিভ গ্রাফ:</span>
              <span className="text-white font-bold">{currentRuleTitle}</span>
              <span className="text-[10px] text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {nodes.length} Nodes | {connections.length} Wires
              </span>
            </div>

            {/* SVG Connection Lines / Wires with Interactive Click & Glow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="activeSelectedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {connections.map((conn) => {
                const fromNode = nodes.find(n => n.id === conn.fromNodeId);
                const toNode = nodes.find(n => n.id === conn.toNodeId);
                if (!fromNode || !toNode) return null;

                const fromX = fromNode.x + 240;
                const fromY = fromNode.y + 55;
                const toX = toNode.x;
                const toY = toNode.y + 55;
                const dx = Math.abs(toX - fromX) * 0.5;

                const pathData = `M ${fromX} ${fromY} C ${fromX + dx} ${fromY}, ${toX - dx} ${toY}, ${toX} ${toY}`;
                const isConnSelected = selectedConnection?.id === conn.id;

                return (
                  <g 
                    key={conn.id} 
                    className="pointer-events-auto cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedConnection(conn);
                      setSelectedNode(null);
                    }}
                  >
                    {/* Background Wide Line for Easy Hover & Click */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isConnSelected ? "#10b981" : "#1e293b"}
                      strokeWidth={isConnSelected ? "8" : "6"}
                      strokeLinecap="round"
                    />
                    {/* Active Glowing Wire */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isConnSelected ? "url(#activeSelectedGrad)" : "url(#wireGrad)"}
                      strokeWidth={isSimulating || isConnSelected ? "3.5" : "2"}
                      strokeDasharray={isSimulating ? "6 6" : "none"}
                      className={isSimulating ? "animate-[dash_1s_linear_infinite]" : ""}
                      filter="url(#wireGlow)"
                    />
                    {/* Midpoint Wire Label Chip */}
                    <text
                      x={(fromX + toX) / 2}
                      y={(fromY + toY) / 2 - 8}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-slate-900 px-1 select-none"
                    >
                      {conn.label || 'Wire Signal'}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Draggable HTML Canvas Nodes with Explicit Bengali/English Identifiers */}
            <div className="relative z-20 w-full h-full min-h-[520px]">
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isExec = node.status === 'EXECUTING';

                let typeBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                let typeBorder = 'border-slate-800';
                if (node.type === 'TRIGGER') {
                  typeBadgeColor = 'bg-emerald-950/90 text-emerald-300 border-emerald-700';
                  typeBorder = 'hover:border-emerald-500/50';
                }
                if (node.type === 'CONDITION') {
                  typeBadgeColor = 'bg-amber-950/90 text-amber-300 border-amber-700';
                  typeBorder = 'hover:border-amber-500/50';
                }
                if (node.type === 'AI_REASONING') {
                  typeBadgeColor = 'bg-purple-950/90 text-purple-300 border-purple-700';
                  typeBorder = 'hover:border-purple-500/50';
                }
                if (node.type === 'HARDWARE_ACTION') {
                  typeBadgeColor = 'bg-cyan-950/90 text-cyan-300 border-cyan-700';
                  typeBorder = 'hover:border-cyan-500/50';
                }

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(node, e)}
                    style={{
                      transform: `translate(${node.x}px, ${node.y}px)`
                    }}
                    className={`absolute w-[240px] rounded-xl p-3.5 cursor-grab active:cursor-grabbing border backdrop-blur-md transition-all font-mono ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 border-cyan-500 shadow-2xl shadow-cyan-500/30 bg-slate-900/95 scale-[1.02]'
                        : `bg-slate-900/85 ${typeBorder} shadow-lg`
                    } ${isExec ? 'ring-2 ring-amber-400 bg-amber-950/50 animate-pulse' : ''}`}
                  >
                    {/* Node Top Header: Type & SubType */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${typeBadgeColor}`}>
                        {node.type}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono truncate max-w-[90px]">
                        {node.subType || 'NODE'}
                      </span>
                      <Move className="w-3 h-3 text-slate-500" />
                    </div>

                    {/* 2. Detailed Bengali Label */}
                    <div className="text-xs font-bold text-white font-sans line-clamp-1">
                      {node.labelBn}
                    </div>

                    {/* Detailed English Description */}
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {node.label}
                    </div>

                    {/* Device Identifier & Parameters Pill */}
                    <div className="mt-2 space-y-1">
                      {node.entityId && (
                        <div className="text-[10px] text-cyan-300 font-mono bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800 truncate flex items-center justify-between">
                          <span className="truncate">🔌 {node.entityId}</span>
                        </div>
                      )}

                      {/* Explicit Trigger / Action parameter display */}
                      {node.params?.operator && (
                        <div className="text-[9px] text-amber-300 font-mono bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-800/40 truncate">
                          Check: {node.params.operator} {node.params.value} {node.params.unit || ''}
                        </div>
                      )}
                      {node.params?.service && (
                        <div className="text-[9px] text-emerald-300 font-mono bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-800/40 truncate">
                          ⚡ Service: {node.params.service}
                        </div>
                      )}
                      {node.params?.delay_seconds !== undefined && node.params.delay_seconds > 0 && (
                        <div className="text-[9px] text-purple-300 font-mono bg-purple-950/30 px-1.5 py-0.5 rounded border border-purple-800/40 truncate">
                          ⏱️ Delay: {Math.round(node.params.delay_seconds / 60)} Minutes
                        </div>
                      )}
                    </div>

                    {/* Branching Quick Button on Node */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBranchNewActionFromNode(node);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono font-bold"
                        title="এই নোড থেকে নতুন স্টেপ বা অ্যাকশন ব্রাঞ্চ করুন"
                      >
                        <GitBranch className="w-3 h-3" />
                        <span>+ ব্রাঞ্চ অ্যাকশন</span>
                      </button>

                      <span className="text-slate-600 text-[8px]">ID: {node.id.split('-')[1]}</span>
                    </div>

                    {/* Wire Snap Anchors */}
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950 shadow" />
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-purple-400 border-2 border-slate-950 shadow" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Interactive Rule Inspector Side Panel (4 Cols when active) */}
        {(selectedNode || selectedConnection) && (
          <div className="xl:col-span-4 bg-slate-900/95 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-4 font-mono text-xs backdrop-blur-xl">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  {selectedNode ? 'নোড ইন্সপেক্টর ও লজিক' : 'ওয়্যার কানেকশন ইন্সপেক্টর'}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedNode(null);
                  setSelectedConnection(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveInspectorTab('details')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeInspectorTab === 'details'
                    ? 'bg-slate-800 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বিস্তারিত লজিক
              </button>
              <button
                onClick={() => setActiveInspectorTab('yaml')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeInspectorTab === 'yaml'
                    ? 'bg-slate-800 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HA YAML
              </button>
              <button
                onClick={() => setActiveInspectorTab('json')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeInspectorTab === 'json'
                    ? 'bg-slate-800 text-cyan-300 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON Schema
              </button>
            </div>

            {/* Tab 1: Details & Human-Readable Bengali Summaries */}
            {activeInspectorTab === 'details' && selectedNode && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-bold uppercase">বাংলা সারাংশ ও টাইটেল</div>
                  <div className="text-sm font-bold text-white font-sans">{selectedNode.labelBn}</div>
                  <div className="text-xs text-slate-400">{selectedNode.label}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Node Type</div>
                    <div className="text-xs font-bold text-cyan-400 mt-0.5">{selectedNode.type}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">SubType</div>
                    <div className="text-xs font-bold text-purple-400 mt-0.5">{selectedNode.subType || 'DEFAULT'}</div>
                  </div>
                </div>

                {selectedNode.entityId && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase">সংযুক্ত হার্ডওয়্যার / এনটিটি ID</div>
                    <div className="text-xs text-emerald-300 font-mono break-all">{selectedNode.entityId}</div>
                  </div>
                )}

                {/* Node Parameters Object */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-slate-500 uppercase">কাস্টম প্যারামিটার ও শর্তাবলী</div>
                  <pre className="text-[11px] text-amber-300 font-mono overflow-x-auto scrollbar-thin max-h-36 p-1">
                    {JSON.stringify(selectedNode.params, null, 2)}
                  </pre>
                </div>

                {/* Action Buttons inside Drawer */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleBranchNewActionFromNode(selectedNode)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>এই নোড থেকে নতুন অ্যাকশন ব্রাঞ্চ করুন</span>
                  </button>

                  <button
                    onClick={handleDeleteSelectedNode}
                    className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 text-rose-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>নোড ও এর কানেকশন মুছুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* If Connection is selected */}
            {activeInspectorTab === 'details' && selectedConnection && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">ওয়্যার সিগন্যাল লেবেল</div>
                  <div className="text-xs font-bold text-cyan-300">{selectedConnection.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">ID: {selectedConnection.id}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-500 uppercase">সিগন্যাল প্রবাহ পথ (Data Flow):</div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-emerald-400">
                      {selectedConnection.fromNodeId}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-cyan-400">
                      {selectedConnection.toNodeId}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Home Assistant YAML */}
            {activeInspectorTab === 'yaml' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Home Assistant OS Automation YAML:</span>
                  <button
                    onClick={() => handleCopyCode(compiledYaml)}
                    className="p-1 rounded bg-slate-800 text-slate-300 text-[10px] flex items-center gap-1 border border-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'কপি হয়েছে!' : 'Copy YAML'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-cyan-200 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-72 border border-slate-800 scrollbar-thin">
                  {compiledYaml}
                </pre>
              </div>
            )}

            {/* Tab 3: JSON Schema */}
            {activeInspectorTab === 'json' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Active Visual Graph JSON:</span>
                  <button
                    onClick={() => handleCopyCode(JSON.stringify({ nodes, connections }, null, 2))}
                    className="p-1 rounded bg-slate-800 text-slate-300 text-[10px] flex items-center gap-1 border border-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'কপি হয়েছে!' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-emerald-300 bg-slate-950 p-3 rounded-xl overflow-x-auto max-h-72 border border-slate-800 scrollbar-thin">
                  {JSON.stringify({ nodes, connections }, null, 2)}
                </pre>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
