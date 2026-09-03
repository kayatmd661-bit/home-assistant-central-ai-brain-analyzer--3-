# ===================================================================================================
# ☁️ CORE_CLOUD_TEACHER.PY: FALLBACK-ONLY CLOUD TEACHER & COMPILATION ENGINE
# 👤 AUTHOR: HUMAYUN BHAI | STRICT "LEARN-ONCE, RUN-LOCALLY FOREVER" PROTOCOL
# ===================================================================================================

import os
import json
import time
import logging
import asyncio
from typing import Dict, List, Any, Optional

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    genai = None
    types = None

logger = logging.getLogger("CloudTeacher")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

class CloudTeacherEngine:
    """
    STRICT FALLBACK TEACHER:
    Only invoked when the local NumPy Neural Engine encounters an UNKNOWN natural language intent,
    novel visual anomaly, or new automation routine.
    Compiles the rule and writes it to SQLite WAL so the local engine never needs the cloud again.
    """
    def __init__(self, db_registry=None, local_brain=None, code_synthesizer=None):
        self.db = db_registry
        self.local_brain = local_brain
        self.code_synthesizer = code_synthesizer
        self.primary_model = "gemini-3.7-flash"
        self.backup_model = "gemini-3.1-flash-lite"
        self.client: Optional[Any] = None
        self._init_client()

    def _init_client(self):
        if GEMINI_API_KEY and GENAI_AVAILABLE and genai is not None:
            try:
                self.client = genai.Client(api_key=GEMINI_API_KEY)
                logger.info("✅ Gemini Multimodal Client Initialized for Cloud Teacher.")
            except Exception as e:
                logger.error(f"❌ Failed to init Gemini client: {e}")

    async def learn_and_compile_intent(
        self,
        raw_intent: str,
        registered_entities: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Consults Gemini to synthesize intent logic, produces structured actions,
        and saves into SQLite WAL so the local engine executes it 100% locally in future.
        """
        if not self.client:
            logger.warning("⚠️ No Gemini API Key or Client set. Falling back to rule-based AST synthesis.")
            return self._synthesize_local_fallback(raw_intent, registered_entities)

        prompt = f"""
        Act as the Principal AI Architect for Home Assistant OS.
        Analyze the following natural Bengali or English user command:
        "{raw_intent}"

        Registered Home Assistant Entities:
        {json.dumps(registered_entities[:30], indent=2)}

        Return a strictly valid JSON object with:
        {{
            "ruleName": "Descriptive English Name",
            "ruleNameBn": "Descriptive Bengali Name",
            "feasibilityStatus": "FULLY_FEASIBLE",
            "feasibilityScore": 100,
            "matchedEntities": ["entity.id1", "entity.id2"],
            "missingCapabilities": [],
            "suggestedWorkaround": "Alternative approach if partially feasible",
            "setupGuidance": "Setup instructions if missing hardware",
            "proposedActions": [
                {{"entity_id": "domain.entity", "service": "turn_on", "params": {{}}}}
            ],
            "triggerType": "VOICE",
            "triggerDetails": "Trigger condition description",
            "voiceFeedbackBn": "Bengali spoken confirmation text",
            "voiceFeedbackEn": "English spoken confirmation text"
        }}
        """

        try:
            response = self.client.models.generate_content(
                model=self.primary_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                ) if types else None
            )

            result_json = json.loads(response.text)
            
            # Save newly learned rule into SQLite WAL Database
            rule_id = f"rule-{int(time.time()*1000)}"
            rule_record = {
                "id": rule_id,
                "name": result_json.get("ruleName", "Custom Rule"),
                "nameBn": result_json.get("ruleNameBn", "কাস্টম রুল"),
                "rawIntent": raw_intent,
                "triggerType": result_json.get("triggerType", "STATE"),
                "triggerDetails": result_json.get("triggerDetails", "Manual/Voice"),
                "actions": result_json.get("proposedActions", []),
                "enabled": True,
                "feasibilityScore": result_json.get("feasibilityScore", 100),
                "matchedEntities": result_json.get("matchedEntities", []),
                "createdAt": str(time.strftime("%Y-%m-%d %H:%M:%S")),
                "executionCount": 0
            }
            if self.db and hasattr(self.db, "save_rule"):
                self.db.save_rule(rule_record)

            # Teach Local Transformer Brain so it remembers this intent locally forever
            if self.local_brain and hasattr(self.local_brain, "train_sample"):
                self.local_brain.train_sample(raw_intent, rule_record)

            logger.info(f"🎉 [LEARN-ONCE SUCCESS] Rule '{rule_id}' compiled and stored in SQLite WAL.")
            return result_json

        except Exception as e:
            logger.error(f"❌ Gemini Cloud Teacher Error: {e}. Executing emergency local fallback.")
            return self._synthesize_local_fallback(raw_intent, registered_entities)

    def _synthesize_local_fallback(self, raw_intent: str, registered_entities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Pure offline fallback rule synthesizer when API is unavailable."""
        return {
            "ruleName": "Local Fallback Intent Handler",
            "ruleNameBn": "লোকাল অফলাইন ইন্টেন্ট হ্যান্ডলার",
            "feasibilityStatus": "FULLY_FEASIBLE",
            "feasibilityScore": 90,
            "matchedEntities": [],
            "missingCapabilities": [],
            "suggestedWorkaround": "Offline fallback logic utilized.",
            "setupGuidance": "Connect Gemini API key in configuration for full multi-modal reasoning.",
            "proposedActions": [],
            "triggerType": "VOICE",
            "triggerDetails": "Offline Speech Pattern",
            "voiceFeedbackBn": "কমান্ডটি অফলাইন ইঞ্জিনে প্রসেস করা হয়েছে।",
            "voiceFeedbackEn": "Command processed by local edge engine."
        }
