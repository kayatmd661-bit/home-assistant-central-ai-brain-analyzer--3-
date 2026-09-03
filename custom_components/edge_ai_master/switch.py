"""Switch platform for Edge-AI Master Hub."""
import logging
from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Edge-AI Master Hub switches based on config entry."""
    entities = [
        EdgeAIKillSwitch(entry),
        EdgeAITouchVoiceExplainerSwitch(entry),
        EdgeAIAutoFailoverSwitch(entry),
    ]

    async_add_entities(entities, update_before_add=True)

class EdgeAIKillSwitch(SwitchEntity):
    """Emergency Master Kill Switch."""
    _attr_has_entity_name = True
    _attr_name = "Edge AI Emergency Kill Switch"
    _attr_icon = "mdi:power-cycle"

    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_kill_switch"
        self._is_on = False

    @property
    def is_on(self) -> bool:
        return self._is_on

    async def async_turn_on(self, **kwargs) -> None:
        self._is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self._is_on = False
        self.async_write_ha_state()

class EdgeAITouchVoiceExplainerSwitch(SwitchEntity):
    """Interactive Touch Voice Explainer Mode."""
    _attr_has_entity_name = True
    _attr_name = "Edge AI Touch Voice Explainer Mode"
    _attr_icon = "mdi:account-voice"

    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_touch_voice_mode"
        self._is_on = True

    @property
    def is_on(self) -> bool:
        return self._is_on

    async def async_turn_on(self, **kwargs) -> None:
        self._is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self._is_on = False
        self.async_write_ha_state()

class EdgeAIAutoFailoverSwitch(SwitchEntity):
    """Zero-loss automatic storage failover."""
    _attr_has_entity_name = True
    _attr_name = "Edge AI Storage Auto-Failover"
    _attr_icon = "mdi:shield-sync"

    def __init__(self, entry: ConfigEntry):
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_storage_auto_failover"
        self._is_on = True

    @property
    def is_on(self) -> bool:
        return self._is_on

    async def async_turn_on(self, **kwargs) -> None:
        self._is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self._is_on = False
        self.async_write_ha_state()
