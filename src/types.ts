export type ExecutionAuthorityMode = 'CONFIRMATION_REQUIRED' | 'FULL_AUTONOMOUS_AUTHORITY';
export type AudioRoutingMode = 'LOCAL_HARDWARE_SPEAKER' | 'DASHBOARD_STREAMING';

export interface FeasibilityAuditResult {
  ruleName: string;
  ruleNameBn: string;
  feasibilityStatus: 'FULLY_FEASIBLE' | 'PARTIALLY_FEASIBLE' | 'INCOMPATIBLE_MISSING_HARDWARE';
  feasibilityScore: number;
  matchedEntities: string[];
  missingCapabilities: string[];
  suggestedWorkaround: string;
  setupGuidance: string;
  proposedActions: {
    entity_id: string;
    service: string;
    params: Record<string, any>;
    delay_seconds?: number;
  }[];
  triggerType: 'TEMPORAL' | 'EVENT' | 'VISION' | 'STATE' | 'VOICE';
  triggerDetails: string;
  voiceFeedbackBn: string;
  voiceFeedbackEn: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  nameBn: string;
  rawIntent: string;
  triggerType: 'TEMPORAL' | 'EVENT' | 'VISION' | 'STATE' | 'VOICE';
  triggerDetails: string;
  actions: {
    entity_id: string;
    service: string;
    params: Record<string, any>;
    delay_seconds?: number;
  }[];
  enabled: boolean;
  feasibilityScore: number;
  matchedEntities: string[];
  createdAt: string;
  lastTriggered?: string;
  executionCount: number;
}

export interface CanvasNode {
  id: string;
  type: 'TRIGGER' | 'CONDITION' | 'AI_REASONING' | 'HARDWARE_ACTION';
  label: string;
  labelBn: string;
  entityId?: string;
  subType?: string;
  x: number;
  y: number;
  status: 'ACTIVE' | 'IDLE' | 'EXECUTING';
  params: Record<string, any>;
}

export interface CanvasConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
}

export interface FaceProfile {
  id: string;
  name: string;
  role: 'OWNER' | 'FAMILY' | 'TRUSTED' | 'GUEST' | 'BLOCKED';
  confidence: number;
  lastSeen: string;
  registeredAt: string;
  faceEmbeddingVector: number[];
  accessLevel: 'FULL' | 'RESTRICTED' | 'NOTIFY_ONLY';
}

export interface VisitorInteraction {
  id: string;
  timestamp: string;
  faceMatched: boolean;
  matchedName?: string;
  visitorUtterance: string;
  aiResponse: string;
  aiResponseBn: string;
  actionTaken: string;
  approved: boolean;
  cameraSnapshot: string;
}

export interface HardwareEntity {
  entity_id: string;
  name: string;
  domain: string;
  capabilities: string[];
  state: string;
  current_temp?: number;
  speed?: number;
  brightness?: number;
  isHighRiskActuator?: boolean;
  requiresConfirmation?: boolean;
  wattage?: number;
  currentAmperage?: number;
  volume_level?: number;
}

export interface ModelStatus {
  activeModel: string;
  backupModel: string;
  localFallback: string;
  apiKeyConfigured: boolean;
  autoMigrationStatus: string;
  latencyMs: number;
  apiEndpointVersion: string;
  deprecationMonitoring: string;
}

export interface SystemTelemetry {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  localInferenceLatency: number;
  activeThreads: {
    bucketA: number;
    bucketB: number;
    bucketC: number;
  };
  sqliteWalSizeMb: number;
  haWsStatus: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
  audioRoute: AudioRoutingMode;
  executionMode: ExecutionAuthorityMode;
  killSwitchActive: boolean;
}

export interface RepoFile {
  path: string;
  description: string;
  language: string;
  content: string;
}

// -------------------------------------------------------------
// Multi-Drive & High-Density Compression Telemetry Types
// -------------------------------------------------------------
export type DriveVolumeType = 'NVME_SSD' | 'SATA_SSD' | 'EXTERNAL_USB_HDD' | 'INTERNAL_EMMC' | 'SD_CARD';

export interface StorageDrive {
  id: string;
  name: string;
  mountPath: string;
  deviceNode: string;
  type: DriveVolumeType;
  totalBytes: number;
  usedBytes: number;
  freeBytes: number;
  health: 'OPTIMAL' | 'GOOD' | 'WARNING' | 'CRITICAL';
  temperatureC: number;
  readSpeedMBs: number;
  writeSpeedMBs: number;
  isDefaultData: boolean;
  isRemovable: boolean;
  status: 'MOUNTED' | 'DISCONNECTED' | 'READ_ONLY';
}

export interface StorageAssetMapping {
  modelsDriveId: string;
  trainingDataDriveId: string;
  memoryVectorsDriveId: string;
  audioCacheDriveId: string;
  autoFailoverEnabled: boolean;
  fallbackDriveId: string;
}

export interface CompressedDatasetLog {
  id: string;
  fileName: string;
  format: 'ZSTD_ZST' | 'GZIP_JSONL' | 'MSGPACK_BIN' | 'TAR_XZ';
  targetDirectory: string;
  targetDriveName: string;
  targetDriveMount: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatioPct: number;
  compressionTimeMs: number;
  decompressionTimeMs: number;
  recordCount: number;
  summary: string;
  summaryBn: string;
  audioSpokenMessageBn: string;
  createdAt: string;
  sha256Checksum: string;
  category: 'FINE_TUNING_DATASET' | 'MODEL_WEIGHTS' | 'VECTOR_EMBEDDING' | 'AST_ROUTINES';
}

export interface DecompressBenchmarkResult {
  fileName: string;
  format: string;
  decompressionTimeMs: number;
  throughputMBs: number;
  ramAllocatedMB: number;
  numpyArrayShape: number[];
  status: 'SUCCESS' | 'ERROR';
  memoryDirectStreaming: boolean;
}

// -------------------------------------------------------------
// Backwards Compatibility & Analysis Suite Types
// -------------------------------------------------------------
export interface HAEntityState {
  entity_id: string;
  state: string;
  friendly_name: string;
  domain: string;
  attributes: Record<string, any>;
  last_changed: number;
  total_on_time_today: number;
}

export interface DynamicCoreItem {
  id?: string;
  name?: string;
  core_name?: string;
  description?: string;
  task_description?: string;
  sourceFile?: string;
  registeredAt?: string;
  registered_at?: string;
  activeThreads?: number;
  invocations?: number;
  status?: string;
  calls?: number;
}

export interface SimulationLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'EXEC' | 'ML' | 'AI' | 'SUCCESS' | 'ERROR';
  bucket: string;
  message: string;
}

export interface IssueItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'OPTIMIZATION';
  location: string;
  description: string;
  cause: string;
  fixDescription: string;
  originalCode: string;
  correctedCode: string;
}

export interface CoreModuleInfo {
  id: string;
  name: string;
  bengaliTitle: string;
  description: string;
  status: 'ENHANCED' | 'VERIFIED' | 'FIXED' | 'READY' | 'OPTIMIZED';
  features: string[];
  metrics: { label: string; value: string }[];
}

// -------------------------------------------------------------
// 🏠 Dynamic Multi-Room Spatial Intelligence & Native Wake-Word Types
// -------------------------------------------------------------
export interface RoomProfile {
  id: string;
  name: string;
  nameBn: string;
  floor: string;
  icon: string;
  color: string;
  associatedEntities: string[];
  microphoneInputId: string;
  speakerOutputId: string;
  wakeWordOverride?: string;
  isAdminRoom: boolean; // Master Admin Room with unrestricted HA-wide execution privileges
  accessScope: 'MASTER_ADMIN' | 'RESTRICTED_LOCAL' | 'CUSTOM_DELEGATED';
  allowedCrossRoomPermissions: string[]; // List of room IDs this room is granted permission to control
  automationsCount: number;
  automations: RoomAutomation[];
  createdAt: string;
  updatedAt: string;
}

export interface HostAudioInterface {
  id: string;
  name: string;
  devicePath: string; // e.g. "hw:0,0 (Realtek ALSA 3.5mm)", "hw:1,0 (USB Microphone Array)", "192.168.1.120 (ESP32 Satellite)"
  type: 'ONBOARD_35MM' | 'USB_SOUNDCARD' | 'ESPHOME_IP' | 'WEBRTC_MOBILE' | 'I2S_ARRAY';
  direction: 'INPUT' | 'OUTPUT' | 'DUPLEX';
  channels: number;
  sampleRate: number;
  active: boolean;
  mappedRoomId?: string;
  driver: string;
}

export interface RoomHardwareMap {
  id: string;
  roomId: string;
  roomName: string;
  micInputId: string;
  micType: 'USB_SOUNDCARD' | 'ESPHOME_SATELLITE' | 'WEBRTC_DASHBOARD' | 'I2S_ARRAY' | 'ONBOARD_35MM';
  hardwarePort?: string;
  isPhysicalHostPort?: boolean;
  speakerOutputId: string;
  speakerType: 'ALSA_35MM' | 'USB_DAC' | 'HA_MEDIA_PLAYER' | 'SNAPCAST';
  activeStatus: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  lastPing: string;
  volumeLevel: number;
  rmsNoiseFloorDb: number;
}

export interface RoomAutomation {
  id: string;
  roomId: string;
  name: string;
  nameBn: string;
  voiceShortcut: string;
  triggerCondition: string;
  actions: {
    entity_id: string;
    service: string;
    params: Record<string, any>;
  }[];
  enabled: boolean;
}

export interface WakeWordConfig {
  wakeWordName: string;
  sensitivityThreshold: number; // 0.0 - 1.0
  audioDriver: 'ALSA' | 'PULSE' | 'ESPHOME_SATELLITE' | 'WEBSOCKET_STREAM';
  sampleRate: number; // 16000
  fftFrameSize: number; // 512
  mfccCoefficients: number; // 13
  energyThresholdDb: number; // -42 dB
  autoGainControl: boolean;
  activeProfilesCount: number;
}

export interface SpatialVoiceEvent {
  id: string;
  timestamp: string;
  originRoomId: string;
  originRoomName: string;
  detectedWakeWord: string;
  commandText: string;
  resolvedIntent: string;
  targetEntities: string[];
  targetSpeakerId: string;
  executionLatencyMs: number;
  isGlobalQuery: boolean;
  status: 'EXECUTED_LOCAL' | 'EXECUTED_CLOUD_LEARNED' | 'BLOCKED_KILLSWITCH' | 'BLOCKED_RBAC_VIOLATION';
  permissionStatus: 'ALLOWED_ADMIN' | 'ALLOWED_LOCAL_ROOM' | 'ALLOWED_DELEGATED' | 'BLOCKED_RBAC_VIOLATION' | 'BLOCKED_KILLSWITCH';
  violationDetails?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  originRoomId: string;
  originRoomName: string;
  attemptedCommand: string;
  targetRoomId?: string;
  targetEntities: string[];
  reason: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL_BLOCK';
}

export interface HomeAssistantConfig {
  haUrl: string;
  accessToken: string;
  connected: boolean;
  version?: string;
  locationName?: string;
  mode: 'LIVE_HA' | 'EDGE_SANDBOX';
  lastSynced?: string;
  entitiesCount: number;
}

export interface MasterAutomationPayload {
  authorization: {
    status: 'ALLOWED' | 'DENIED';
    source_room: string;
    source_room_name?: string;
    target_scope: 'LOCAL' | 'CROSS_ROOM' | 'GLOBAL_ADMIN';
    reason_if_denied?: string;
    is_admin_override?: boolean;
  };
  automation_config: {
    id?: string;
    alias: string;
    description?: string;
    mode?: 'single' | 'restart' | 'queued' | 'parallel';
    trigger: any[];
    condition: any[];
    action: any[];
  };
  night_dnd_policy: {
    applied: boolean;
    window: string;
    speaker_volume_limit: number;
    feedback_style: 'CHIME_ONLY' | 'WHISPER' | 'SILENT_LED' | 'FULL_VOICE';
    audio_muted: boolean;
    reason?: string;
  };
  user_feedback: string;
  generated_yaml: string;
  source_input_type: 'NATURAL_LANGUAGE_BOX' | 'VISUAL_CANVAS_GRAPH';
  complexity_metrics: {
    trigger_count: number;
    condition_count: number;
    action_count: number;
    has_delay: boolean;
    has_repeat_loop: boolean;
    target_entities: string[];
  };
}

export interface GlobalAutomationAuditItem {
  id: string;
  name: string;
  nameBn: string;
  originRoomId: string;
  originRoomName: string;
  originRoomNameBn: string;
  status: 'ACTIVE' | 'PAUSED' | 'SCHEDULED' | 'TRIGGERED_RECENTLY';
  triggerType: string;
  triggerDetails: string;
  entitiesAffected: string[];
  lastTriggered?: string;
  createdAt: string;
  executionCount: number;
  source: 'VOICE' | 'TEXT_BOX' | 'VISUAL_CANVAS' | 'MANUAL_RULE';
  actionsSummary: string;
}

export interface AutomationExecutionEvent {
  id: string;
  timestamp: string;
  originRoomId: string;
  originRoomName: string;
  originRoomNameBn: string;
  actionType: 'CREATED' | 'TRIGGERED' | 'MODIFIED' | 'PAUSED' | 'RESUMED' | 'DELETED' | 'ADMIN_OVERRIDE';
  automationTitle: string;
  entitiesAffected: string[];
  detailsBn: string;
  detailsEn: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

export interface CameraCapabilityProfile {
  cameraId: string;
  name: string;
  nameBn: string;
  location: string;
  streamUrl: string;
  supportsPtz: boolean;
  supportsTtsBroadcast: boolean;
  supportsAiVision: boolean;
  supportsSiren: boolean;
  supportsSpotlight: boolean;
  activeTriggers: CameraTriggerType[];
  activeActions: CameraActionType[];
}

export type CameraTriggerType = 
  | 'MOTION_DETECTED'
  | 'PERSON_DETECTED'
  | 'VEHICLE_DETECTED'
  | 'PET_DETECTED'
  | 'FACE_RECOGNIZED'
  | 'UNKNOWN_FACE'
  | 'LINE_CROSSING'
  | 'TAMPER_ALERT'
  | 'SOUND_THRESHOLD_EXCEEDED';

export type CameraActionType =
  | 'TTS_VOICE_BROADCAST'
  | 'PTZ_PRESET_PATROL'
  | 'PTZ_PAN_CENTER'
  | 'SIREN_BUZZER_ACTIVATE'
  | 'SPOTLIGHT_IR_TOGGLE'
  | 'SNAPSHOT_TELEGRAM_DASHBOARD'
  | 'RECORD_CLIP_START'
  | 'DYNAMIC_AUDIO_INTERCEPT';

export interface UnrestrictedCameraAutomation {
  id: string;
  name: string;
  nameBn: string;
  cameraId: string;
  cameraName: string;
  triggerEvent: CameraTriggerType;
  triggerDetails: string;
  conditions: {
    timeAfter?: string;
    timeBefore?: string;
    ambientLuxBelow?: number;
    homeMode?: string;
    zonePresence?: string;
  };
  crossDeviceActions: {
    entity_id: string;
    service: string;
    params: Record<string, any>;
    delay_seconds?: number;
    descriptionBn: string;
  }[];
  enabled: boolean;
  lastFired?: string;
  createdAt: string;
  executionCount: number;
}

export type DeviceFormFactor = 'MOBILE' | 'TABLET' | 'DESKTOP';
export type PlatformEnvironment = 'HA_INGRESS_ADDON' | 'HA_COMPANION_APP' | 'STANDALONE_WEB';

export interface HAEnvironmentContextType {
  isHAAddon: boolean;
  isIngress: boolean;
  isCompanionApp: boolean;
  platform: PlatformEnvironment;
  formFactor: DeviceFormFactor;
  isMobileOrTablet: boolean;
  theme: 'dark' | 'light' | 'auto';
  haThemeVariables: Record<string, string>;
  viewportWidth: number;
  viewportHeight: number;
  touchEnabled: boolean;
  defaultMode: 'QUICK_ACTIONS' | 'AUDIT_AND_CONFIG';
  ingressPath: string;
  syncWithHATheme: () => void;
  toggleTheme: () => void;
}

// -------------------------------------------------------------
// 14. UNIVERSAL NETWORK SENTINEL TYPES
// -------------------------------------------------------------
export type DeviceNetworkCategory = 'SMARTPHONE' | 'LAPTOP' | 'IOT_DEVICE' | 'SMART_TV' | 'CAMERA' | 'SPEAKER' | 'UNKNOWN';
export type NetworkInterfaceType = 'WIFI_2_4GHZ' | 'WIFI_5GHZ' | 'WIFI_6GHZ' | 'ETHERNET_LAN';
export type RouterProtocolType = 'OPENWRT_RPC' | 'MIKROTIK_ROS_API' | 'ASUSWRT_SSH' | 'TPLINK_HTTP' | 'GENERIC_SNMP' | 'DDWRT_REST';

export interface NetworkClientDevice {
  id: string;
  mac: string;
  ip: string;
  hostname: string;
  deviceType: DeviceNetworkCategory;
  interfaceType: NetworkInterfaceType;
  uploadSpeedKbps: number;
  downloadSpeedKbps: number;
  totalUploadedMb: number;
  totalDownloadedMb: number;
  rssiSignalDbm: number;
  signalQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'WEAK';
  isBlocked: boolean;
  isGuest: boolean;
  isKnown: boolean;
  speedLimitMbps: number | null;
  vendor: string;
  lastSeen: string;
  firstSeen: string;
  qosPriority: 'HIGH' | 'NORMAL' | 'LOW';
  associatedRoomId?: string;
  associatedRoomNameBn?: string;
}

export interface RouterProtocolProfile {
  protocol: RouterProtocolType;
  name: string;
  routerIp: string;
  status: 'ONLINE' | 'CONNECTED' | 'AUTHENTICATING';
  uptime: string;
  cpuLoad: number;
  memoryUsage: number;
  activeClientsCount: number;
  wanUploadMbps: number;
  wanDownloadMbps: number;
  guestNetworkEnabled: boolean;
  primarySsid: string;
  guestSsid: string;
  wifiChannel24: number;
  wifiChannel5: number;
}

export interface NetworkSecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'UNKNOWN_MAC_JOINED' | 'BANDWIDTH_SPIKE' | 'ROGUE_AP_DETECTED' | 'MAC_BLOCKED' | 'THROTTLE_APPLIED' | 'GUEST_TOGGLED';
  mac: string;
  ip: string;
  hostname: string;
  detailsBn: string;
  detailsEn: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  automatedActionTaken: string;
}

// -------------------------------------------------------------
// 15. MULTI-BLUETOOTH & MUSIC-REACTIVE LIGHTING TYPES
// -------------------------------------------------------------
export type BluetoothDeviceType = 'A2DP_SPEAKER' | 'HEADPHONES' | 'SOUNDBAR' | 'BLE_SMART_RECEIVER';
export type BluetoothConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'STREAMING' | 'PAIRING';

export interface BluetoothAudioReceiver {
  id: string;
  mac: string;
  name: string;
  nameBn: string;
  location: string;
  deviceType: BluetoothDeviceType;
  status: BluetoothConnectionStatus;
  batteryLevel: number;
  codec: 'LDAC' | 'aptX_HD' | 'AAC' | 'SBC';
  latencyMs: number;
  volume: number;
  assignedGroup: string | null;
  isMaster: boolean;
  rssiDbm: number;
}

export interface AudioBroadcastGroup {
  id: string;
  name: string;
  nameBn: string;
  receiverIds: string[];
  syncDelayMs: number;
  activeStream: boolean;
  masterVolume: number;
}

export interface FFTSpectrumData {
  timestamp: number;
  bassEnergy: number;
  midEnergy: number;
  trebleEnergy: number;
  peakFrequencyHz: number;
  bpmDetected: number;
  beatHit: boolean;
  spectrumBands: number[];
  recommendedRgb: { r: number; g: number; b: number };
  recommendedBrightness: number;
  paletteName: string;
}

export interface MusicReactiveConfig {
  enabled: boolean;
  selectedLightEntities: string[];
  colorPalette: 'NEON_CYBERPUNK' | 'SUNSET_DISCO' | 'AURORA_BOREALIS' | 'DEEP_FIRE' | 'ELECTRIC_VIOLET';
  bassSensitivity: number;
  trebleSensitivity: number;
  fadeTransitionSpeedMs: number;
  strobeOnHeavyDrop: boolean;
  silenceFadeTimeoutSec: number;
  activePresetName: string;
}

// -------------------------------------------------------------
// 16. UNIVERSAL CROSS-SYSTEM AUTOMATION TYPES
// -------------------------------------------------------------
export type CrossSystemTriggerSource = 
  | 'NETWORK_SENTINEL'
  | 'BLUETOOTH_AUDIO'
  | 'FFT_BEAT_DROP'
  | 'CAMERA_AI_VISION'
  | 'HA_STATE'
  | 'VOICE_INTENT';

export interface CrossSystemActionStep {
  targetDomain: 'HA_ENTITY' | 'ROUTER_NETWORK' | 'BLUETOOTH_AUDIO' | 'CAMERA_VISION' | 'VOICE_TTS';
  entity_id?: string;
  service: string;
  params: Record<string, any>;
  descriptionBn: string;
}

export interface CrossSystemAutomation {
  id: string;
  name: string;
  nameBn: string;
  enabled: boolean;
  triggerSource: CrossSystemTriggerSource;
  triggerConditionSummary: string;
  triggerConditionSummaryBn: string;
  conditions: Record<string, any>;
  actions: CrossSystemActionStep[];
  lastFired?: string;
  executionCount: number;
  createdAt: string;
}




