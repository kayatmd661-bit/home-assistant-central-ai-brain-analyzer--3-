"""Config flow for Edge-AI Master Hub integration."""
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from .const import DOMAIN, CONF_AUTHORITY_MODE, CONF_AUDIO_ROUTING, AUTHORITY_MODES, AUDIO_ROUTING_MODES

class EdgeAIMasterConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Edge-AI Master Hub."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            return self.async_create_entry(
                title="Edge-AI Master Brain",
                data=user_input,
            )

        schema = vol.Schema({
            vol.Required("host", default="localhost"): str,
            vol.Required("port", default=3000): int,
            vol.Optional(CONF_AUTHORITY_MODE, default="AUTONOMOUS_WITH_LOGS"): vol.In(AUTHORITY_MODES),
            vol.Optional(CONF_AUDIO_ROUTING, default="SMART_AUTO_DETECT"): vol.In(AUDIO_ROUTING_MODES),
            vol.Optional("enable_touch_voice", default=True): bool,
        })

        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )
