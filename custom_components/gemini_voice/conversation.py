
"""Conversation entity for Gemini Multimodal Voice Engine."""

from __future__ import annotations

import logging
from typing import Any, Literal

from google import genai
from google.genai import types

from homeassistant.components import conversation
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_API_KEY,
    CONF_MODEL,
    CONF_SYSTEM_PROMPT,
    DEFAULT_MODEL,
    DEFAULT_SYSTEM_PROMPT,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:"""Set up the Gemini Voice conversation entity."""
    async_add_entities([GeminiVoiceConversationEntity(hass, config_entry)])


class GeminiVoiceConversationEntity(
    conversation.ConversationEntity
):
    """Gemini Multimodal Voice Engine Conversation Entity."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:"""Initialize the conversation entity."""
        self.hass = hass
        self._entry = entry
        self._attr_name = "Gemini Voice Engine"
        self._attr_unique_id = f"{entry.entry_id}_conversation"

    @property
    def supported_languages(self) -> list[str] | Literal["*"]:
        """Return supported languages."""
        return ["bn", "en"]

    def _build_context_prompt(self) -> str:
        """Construct prompt with active Home Assistant entities and states."""
        base_prompt = self._entry.options.get(
            CONF_SYSTEM_PROMPT,
            self._entry.data.get(CONF_SYSTEM_PROMPT, DEFAULT_SYSTEM_PROMPT),
        )

        state_lines = []
        for state in self.hass.states.async_all():
            domain = state.domain
            if domain in [
                "light",
                "switch",
                "fan",
                "climate",
                "cover",
                "media_player",
                "sensor",
                "binary_sensor",
            ]:
                friendly_name = state.attributes.get("friendly_name", state.entity_id)
                state_lines.append(
                    f"- {friendly_name} ({state.entity_id}): {state.state}"
                )

        states_summary = "\n".join(state_lines)
        return (
            f"{base_prompt}\n\n"
            f"বর্তমান স্মার্ট হোম ডিভাইসগুলোর অবস্থান নিচে দেওয়া হলো:\n"
            f"{states_summary}\n\n"
            f"ব্যবহারকারীর নির্দেশ শুনুন। প্রয়োজন হলে সঠিক হোম অটোমেশন সার্ভিস ব্যবহার করার পরামর্শ দিন। "
            f"উত্তরে কোনো চিহ্ন বা মার্কডাউন ব্যবহার করবেন না।"
        )

    async def async_process(
        self, user_input: conversation.ConversationInput
    ) -> conversation.ConversationResult:
        """Process user text/voice input via Google Gemini API."""
        api_key = self._entry.data.get(CONF_API_KEY)
        model = self._entry.options.get(
            CONF_MODEL, self._entry.data.get(CONF_MODEL, DEFAULT_MODEL)
        )

        client = genai.Client(api_key=api_key)
        system_instruction = self._build_context_prompt()

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3,
        )

        response_text = ""
        try:
            response = await self.hass.async_add_executor_job(
                client.models.generate_content,
                {
                    "model": model,
                    "contents": user_input.text,
                    "config": config,
                },
            )
            response_text = response.text or "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।"
        except Exception as err:
            _LOGGER.exception("Error communicating with Gemini API")
            response_text = f"Gemini API এর সাথে যোগাযোগ করতে ব্যর্থ হয়েছে: {err}"

        # Clean speech text from markdown artifacts
        clean_text = (
            response_text.replace("*", "")
            .replace("#", "")
            .replace("`", "")
            .strip()
        )

        intent_response = intent.IntentResponse(language=user_input.language)
        intent_response.async_set_speech(clean_text)

        return conversation.ConversationResult(
            response=intent_response,
            conversation_id=user_input.conversation_id,
        )
