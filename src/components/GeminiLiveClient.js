class GeminiLiveClient {
    constructor(onMessageCallback) {
        this.ws = null;
        this.isConnected = false;
        this.onMessageCallback = onMessageCallback;
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let ingressPrefix = '';
        if (typeof window !== 'undefined' && window.location.pathname) {
            const ingressMatch = window.location.pathname.match(/(\/api\/hassio_ingress\/[^/]+)/);
            if (ingressMatch) {
                ingressPrefix = ingressMatch[1];
            }
        }
        const wsUrl = `${protocol}//${window.location.host}${ingressPrefix}/api/gemini/live-ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log("Connected to Local BFF Gemini Proxy successfully.");
            this.isConnected = true;
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (this.onMessageCallback) {
                this.onMessageCallback(data);
            }
        };

        this.ws.onclose = () => {
            console.log("Disconnected from Gemini Proxy.");
            this.isConnected = false;
        };

        this.ws.onerror = (error) => {
            console.error("Gemini Proxy WebSocket Error:", error);
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
        if (this.ws) this.ws.close();
    }
}

export default GeminiLiveClient;
