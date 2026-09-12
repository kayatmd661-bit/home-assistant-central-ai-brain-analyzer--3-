"""The Gemini Multimodal Voice Engine integration."""

from __future__ import annotations

import logging
from homeassistant.components import panel_custom
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[str] = ["conversation"]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration components."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Gemini Voice Engine from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = entry.data

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register Sidebar Custom Panel
    try:
        await panel_custom.async_register_panel(
            hass,
            webcomponent_name="gemini-voice-panel",
            sidebar_title="Gemini Voice Engine",
            sidebar_icon="mdi:microphone-outline",
            url_path="gemini_voice",
            module_url="/gemini_voice_static/panel.html",
            embed_iframe=False,
            require_admin=False,
        )
    except Exception as err:
        _LOGGER.warning("Could not register custom panel: %s", err)

    entry.async_on_unload(entry.add_update_listener(update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(
        entry, PLATFORMS
    )
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update."""
    await hass.config_entries.async_reload(entry.entry_id)
