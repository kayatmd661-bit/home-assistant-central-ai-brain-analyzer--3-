"""
Gemini Cloud Teacher & Fine-Tuning Dataset Generator
Uses Gemini 3.7 Flash & 3.1 Flash-Lite to extract household behavioural routines,
convert them into compact AST format, and produce fine-tuning datasets for local Edge-AI.
"""
import os
import json
import logging
from google import genai
from google.genai import types

_LOGGER = logging.getLogger(__name__)

class GeminiCloudTeacher:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    async def extract_behavioral_patterns(self, household_logs: list):
        """Analyze raw Home Assistant state transitions and generate compact AST automation rules."""
        if not self.client:
            return {"status": "error", "message": "Gemini API Key missing"}

        prompt = f"""
        You are the Master AI Teacher for an Edge-AI Smart Home Hub.
        Analyze these recent household events and output JSON rules for offline Pure NumPy execution:
        {json.dumps(household_logs[:20])}

        Output Schema:
        {{
            "intent": "string",
            "condition": "string",
            "action": "string",
            "bengali_voice_feedback": "string",
            "confidence": 0.98
        }}
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-3.7-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return json.loads(response.text)
        except Exception as err:
            _LOGGER.error("Gemini Teacher Error: %s", err)
            return {"status": "error", "error": str(err)}
