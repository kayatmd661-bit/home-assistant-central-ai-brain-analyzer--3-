"""Constants for Edge-AI Master Hub integration."""

DOMAIN = "edge_ai_master"

# Configuration options
CONF_HOST = "host"
CONF_PORT = "port"
CONF_API_KEY = "api_key"
CONF_AUTHORITY_MODE = "authority_mode"
CONF_AUDIO_ROUTING = "audio_routing"
CONF_TOUCH_EXPLAIN = "touch_explain_enabled"

# Storage paths
DEFAULT_MODELS_PATH = "/share/edge_ai/models"
DEFAULT_TRAINING_DATA_PATH = "/share/edge_ai/training_data"
DEFAULT_VECTORS_PATH = "/share/edge_ai/vectors"
DEFAULT_FALLBACK_PATH = "/data/edge_ai_fallback"

# Events
EVENT_EDGE_AI_INTENT_EXECUTED = "edge_ai_master_intent_executed"
EVENT_EDGE_AI_STORAGE_FAILOVER = "edge_ai_master_storage_failover"
EVENT_EDGE_AI_FALL_DETECTED = "edge_ai_master_fall_detected"
EVENT_EDGE_AI_VOICE_BROADCAST = "edge_ai_master_voice_broadcast"

# Modes
AUTHORITY_MODES = [
    "AUTONOMOUS_WITH_LOGS",
    "STRICT_HUMAN_IN_THE_LOOP",
    "SIMULATION_ONLY"
]

AUDIO_ROUTING_MODES = [
    "SMART_AUTO_DETECT",
    "LOCAL_HEADLESS_SPEAKER",
    "DASHBOARD_BROWSER",
    "MULTI_ROOM_BROADCAST"
]
