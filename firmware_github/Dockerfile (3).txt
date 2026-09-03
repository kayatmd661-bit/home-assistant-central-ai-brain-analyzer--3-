ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base-python:3.11-alpine3.18
FROM ${BUILD_FROM}

# System environment variables
ENV LANG=C.UTF-8 \
    PORT=8099 \
    INGRESS_PORT=8099

# Install runtime system packages and hardware tools
RUN apk add --no-cache \
    git \
    nodejs \
    npm \
    alsa-lib-dev \
    alsa-utils \
    bluez \
    eudev \
    ffmpeg \
    smartmontools \
    hdparm \
    nvme-cli \
    zstd \
    gcc \
    musl-dev \
    linux-headers \
    python3-dev

# Install Python requirements
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source assets
COPY . ./

# Expose WebUI and Ingress ports
EXPOSE 8099 3000 8080

# Make launch script executable
RUN chmod a+x /app/entrypoint.sh

CMD [ "/app/entrypoint.sh" ]

