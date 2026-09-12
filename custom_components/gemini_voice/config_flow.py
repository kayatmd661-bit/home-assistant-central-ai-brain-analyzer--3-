"""Config flow for Gemini Multimodal Voice Engine integration."""

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_API_KEY,
    CONF_MODEL,
    CONF_SYSTEM_PROMPT,
    DEFAULT_MODEL,
    DEFAULT_SYSTEM_PROMPT,
    DOMAIN,
    RECOMMENDED_MODELS,
)

_LOGGER = logging.getLogger(__name__)


class GeminiVoiceConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Gemini Multimodal Voice Engine."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors_dict: dict[str, str] = {}

        if user_input is not None:
            try:
                from google import genai
                from google.genai import errors

                client = genai.Client(api_key=user_input[CONF_API_KEY])
                await self.hass.async_add_executor_job(
                    client.models.get,
                    {"model": user_input.get(CONF_MODEL, DEFAULT_MODEL)},
                )
            except Exception as err:
                _LOGGER.error("Error validating Gemini API Key: %s", err)
                errors_dict["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title="Gemini Voice Engine",
                    data=user_input,
                )

        schema = vol.Schema(
            {
                vol.Required(CONF_API_KEY): str,
                vol.Optional(CONF_MODEL, default=DEFAULT_MODEL): vol.In(
                    RECOMMENDED_MODELS
                ),
                vol.Optional(
                    CONF_SYSTEM_PROMPT, default=DEFAULT_SYSTEM_PROMPT
                ): str,
            }
        )

        return self.async_show_form(
            step_id="user", data_schema=schema, errors=errors_dict
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Get the options flow for this handler."""
        return GeminiVoiceOptionsFlowHandler(config_entry)


class GeminiVoiceOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for Gemini Multimodal Voice Engine."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current_model = self.config_entry.options.get(
            CONF_MODEL,
            self.config_entry.data.get(CONF_MODEL, DEFAULT_MODEL),
        )
        current_prompt = self.config_entry.options.get(
            CONF_SYSTEM_PROMPT,
            self.config_entry.data.get(
                CONF_SYSTEM_PROMPT, DEFAULT_SYSTEM_PROMPT
            ),
        )

        schema = vol.Schema(
            {
                vol.Optional(CONF_MODEL, default=current_model): vol.In(
                    RECOMMENDED_MODELS
                ),
                vol.Optional(CONF_SYSTEM_PROMPT, default=current_prompt): str,
            }
        )

        return self.async_show_form(step_id="init", data_schema=schema)
