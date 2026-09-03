#!/usr/bin/env bashio
set -e

bashio::log.info "Starting Edge-AI Master Hub & Storage Controller..."

# Ensure target directories exist
mkdir -p /share/edge_ai/models
mkdir -p /share/edge_ai/training_data
mkdir -p /share/edge_ai/vectors
mkdir -p /share/edge_ai/audio_cache
mkdir -p /data/edge_ai_fallback

# Auto-install custom Lovelace Card to /config/www/
if [ -d "/config/www" ]; then
    bashio::log.info "Installing Lovelace Card into /config/www/edge-ai-master-card.js..."
    cp -u /app/lovelace_card/edge-ai-master-card.js /config/www/edge-ai-master-card.js || true
fi

# Auto-install custom component into /config/custom_components/
if [ -d "/config/custom_components" ]; then
    bashio::log.info "Syncing Custom Component to /config/custom_components/edge_ai_master/..."
    mkdir -p /config/custom_components/edge_ai_master
    cp -ru /app/custom_components/edge_ai_master/* /config/custom_components/edge_ai_master/ || true
fi

export PORT=${PORT:-8099}
export INGRESS_PORT=${INGRESS_PORT:-8099}

bashio::log.info "Launching Edge-AI Master Hub & Ingress Server on port ${PORT}..."
if [ -f "/app/dist/server.cjs" ] && command -v node >/dev/null 2>&1; then
    bashio::log.info "Starting compiled full-stack runtime with Node..."
    exec node /app/dist/server.cjs
else
    bashio::log.info "Starting native Python Ingress Master Engine (main.py)..."
    exec python3 /app/main.py
fi
