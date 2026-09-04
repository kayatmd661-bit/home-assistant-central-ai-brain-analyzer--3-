class GeminiLiveClient {
    constructor(onMessageCallback, onErrorCallback) {
        this.ws = null;
        this.isConnected = false;
        this.onMessageCallback = onMessageCallback;
        this.onErrorCallback = onErrorCallback;
        this.micStream = null;
    }

    checkSecureContext() {
        if (typeof window !== 'undefined' && window.isSecureContext === false) {
            const warnMsg = "Security Warning: window.isSecureContext is false. HTTPS/SSL is required for microphone usage in mobile browsers.";
            console.warn("[GeminiLiveClient]", warnMsg);
            if (this.onErrorCallback) {
                this.onErrorCallback(warnMsg);
            }
            return false;
        }
        return true;
    }

    async requestMicrophone() {
        this.checkSecureContext();
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                return this.micStream;
            } else {
                console.error("[GeminiLiveClient] Microphone Error: getUserMedia not supported or InsecureContextError.");
            }
        } catch (err) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                console.error("[GeminiLiveClient] Microphone Permission Rejected (NotAllowedError):", err);
            } else if (err.name === 'InsecureContextError' || (typeof window !== 'undefined' && !window.isSecureContext)) {
                console.error("[GeminiLiveClient] InsecureContextError: HTTPS/SSL required for microphone access in browser.", err);
            } else {
                console.error(`[GeminiLiveClient] Microphone Access Error (${err.name}):`, err);
            }
            if (this.onErrorCallback) {
                this.onErrorCallback(`Microphone error: ${err.message || err.name}`);
            }
        }
        return null;
    }

    connect() {
        this.checkSecureContext();

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : ':8099';
        const wsUrl = `${protocol}//${hostname}${port.includes(':') && port !== ':80' && port !== ':443' ? port : ':8099'}/api/gemini/live-ws`;

        console.log("[GeminiLiveClient] Connecting to Direct WebSocket Proxy:", wsUrl);
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log("Connected to Local BFF Gemini Proxy successfully.");
            this.isConnected = true;
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.onMessageCallback) {
                    this.onMessageCallback(data);
                }
            } catch (err) {
                console.error("[GeminiLiveClient] Error parsing message:", err);
            }
        };

        this.ws.onclose = () => {
            console.log("Disconnected from Gemini Proxy.");
            this.isConnected = false;
        };

        this.ws.onerror = (error) => {
            console.error("Gemini Proxy WebSocket Error:", error);
            if (this.onErrorCallback) {
                this.onErrorCallback("Gemini Proxy WebSocket connection error.");
            }
        };
    }

    sendText(text) {
        if (!this.isConnected || !this.ws) return;
        const payload = {
            client_content: {
                turns: [{ role: "user", parts: [{ text: text }] }],
                turn_complete: true
            }
        };
        this.ws.send(JSON.stringify(payload));
    }

    sendAudioChunk(base64AudioData) {
        if (!this.isConnected || !this.ws) return;
        const payload = {
            realtime_input: {
                media_chunks: [{ mime_type: "audio/pcm;rate=16000", data: base64AudioData }]
            }
        };
        this.ws.send(JSON.stringify(payload));
    }

    disconnect() {
        if (this.micStream) {
            try {
                this.micStream.getTracks().forEach(track => track.stop());
            } catch (e) {}
            this.micStream = null;
        }
        if (this.ws) this.ws.close();
    }
}

export default GeminiLiveClient;
