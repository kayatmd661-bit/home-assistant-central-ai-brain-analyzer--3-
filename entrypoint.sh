#!/usr/bin/env bash
set -e

echo "======================================================="
echo " Starting Auto-Evolving Edge-AI Master Hub (HAOS Add-on)"
echo " Ingress Port: ${INGRESS_PORT:-8099}"
echo " Persistent /data/ and /share/ storage initialization..."
echo "======================================================="

# Set unified Python path for root, backend, and firmware modules
export PYTHONPATH="/app:/app/backend:/app/firmware_github:${PYTHONPATH}"

# Ensure persistent directories exist in /data and /share
mkdir -p /data/dynamic_modules /data/weights /data/audio_cache /data/backups /data/logs
mkdir -p /share/edge_ai/models /share/edge_ai/training_data /share/edge_ai/vectors /share/edge_ai/audio_cache /data/edge_ai_fallback

# Home Assistant OS auto-deployment hooks
if [ -d "/config" ]; then
    echo "[SETUP] Home Assistant /config detected."
    
    # 1. Deploy Lovelace voice cards to /config/www/
    mkdir -p /config/www/community
    if [ -f "/app/lovelace_card/edge-ai-master-card.js" ]; then
        cp -u /app/lovelace_card/edge-ai-master-card.js /config/www/edge-ai-master-card.js 2>/dev/null || true
        echo "[SETUP] Copied /app/lovelace_card/edge-ai-master-card.js -> /config/www/edge-ai-master-card.js"
    fi
    if [ -f "/app/public/edge-ai-voice-card.js" ]; then
        cp -f /app/public/edge-ai-voice-card.js /config/www/community/edge-ai-voice-card.js 2>/dev/null || true
        echo "[SETUP] Copied /app/public/edge-ai-voice-card.js -> /config/www/community/edge-ai-voice-card.js"
    fi

    # 2. Deploy Custom Component to /config/custom_components/edge_ai_master/
    if [ -d "/app/custom_components/edge_ai_master" ]; then
        mkdir -p /config/custom_components/edge_ai_master
        cp -ru /app/custom_components/edge_ai_master/* /config/custom_components/edge_ai_master/ 2>/dev/null || true
        echo "[SETUP] Synced custom component to /config/custom_components/edge_ai_master/"
    fi
fi

# Launch backend FastAPI application with Uvicorn serving both API, Core Engines, and compiled SPA
exec python3 -m uvicorn backend.main:app --host 0.0.0.0 --port "${INGRESS_PORT:-8099}" --log-level info

