import asyncio
import json
import os
import logging
from typing import Optional
from fastapi import WebSocket, WebSocketDisconnect
import websockets

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_WS_URL = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={GEMINI_API_KEY}"

async def handle_gemini_live_websocket(websocket: WebSocket, api_key: Optional[str] = None):
    await websocket.accept()
    logger.info("Frontend connected to local Gemini Live BFF Proxy.")

    key_to_use = api_key or os.getenv("GEMINI_API_KEY", "")
    if not key_to_use:
        await websocket.send_text(json.dumps({"error": "Gemini API Key is missing in add-on configuration."}))
        await websocket.close()
        return

    gemini_ws_url = f"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key={key_to_use}"

    try:
        async with websockets.connect(
            gemini_ws_url,
            extra_headers={"Content-Type": "application/json"}
        ) as google_ws:

            setup_frame = {
                "setup": {
                    "model": "models/gemini-2.0-flash",
                    "generation_config": {
                        "response_modalities": ["TEXT", "AUDIO"]
                    }
                }
            }
            await google_ws.send(json.dumps(setup_frame))
            logger.info("Successfully sent Gemini Setup Frame.")

            async def frontend_to_google():
                try:
                    async for message in websocket.iter_text():
                        await google_ws.send(message)
                except WebSocketDisconnect:
                    logger.info("Frontend client disconnected.")
                except Exception as e:
                    logger.error(f"Error in frontend_to_google relay: {e}")

            async def google_to_frontend():
                try:
                    async for message in google_ws:
                        await websocket.send_text(message)
                except Exception as e:
                    logger.error(f"Error in google_to_frontend relay: {e}")

            await asyncio.gather(frontend_to_google(), google_to_frontend())

    except Exception as e:
        logger.error(f"Failed to connect to Gemini Live API: {e}")
        try:
            await websocket.send_text(json.dumps({"error": str(e)}))
            await websocket.close()
        except Exception:
            pass
