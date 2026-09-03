# ==============================================================================
# Multi-Stage Dockerfile for Auto-Evolving Edge-AI Master Hub
# Stage 1: Build React + Vite SPA with Relative Ingress Pathing (base: './')
# Stage 2: Python 3.11 FastAPI / Uvicorn Ingress Server on Port 8099
# ==============================================================================

# ----------------- STAGE 1: Frontend Build -----------------
FROM node:20-slim AS frontend-builder
WORKDIR /build

COPY package.json ./
# Install npm dependencies
RUN npm install --no-audit --no-fund

COPY . .
# Compile React Vite distribution into /build/dist
RUN npm run build

# ----------------- STAGE 2: Python HAOS Runtime -----------------
FROM python:3.11-slim-bookworm

LABEL maintainer="Humayun Bhai <kayatmd5@gmail.com>"
LABEL description="Auto-Evolving Edge-AI Master Hub for Home Assistant OS (Zero-Loss /data/ Storage & Ingress Support)"

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    DATA_DIR="/data" \
    APP_DIR="/app" \
    INGRESS_PORT=8099 \
    CONFIG_PATH="/data/options.json" \
    PYTHONPATH="/app:/app/backend:/app/firmware_github:${PYTHONPATH}"

# Install System Dependencies (ALSA, Audio, SQLite3, FFmpeg, Curl, Git)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libasound2-dev \
    libportaudio2 \
    portaudio19-dev \
    alsa-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    sqlite3 \
    ffmpeg \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python Requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Project Files
COPY . .

# Copy Compiled React Single-Page Application from Stage 1 into /app/dist
COPY --from=frontend-builder /build/dist /app/dist

# Set up Persistent Volume Directories
RUN mkdir -p /data/dynamic_modules /data/weights /data/audio_cache /data/backups /data/logs \
    && chmod +x /app/entrypoint.sh

# Expose HAOS Ingress Port and UDP Realtime Audio Port
EXPOSE 8099 50005/udp

ENTRYPOINT ["/app/entrypoint.sh"]
