"""Edge-AI Master Hub Integration for Home Assistant."""
import logging
import asyncio
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    EVENT_EDGE_AI_INTENT_EXECUTED,
    EVENT_EDGE_AI_STORAGE_FAILOVER,
    EVENT_EDGE_AI_VOICE_BROADCAST,
    DEFAULT_MODELS_PATH,
    DEFAULT_TRAINING_DATA_PATH
)
from .storage_controller import StorageController

_LOGGER = logging.getLogger(__name__)

PLATFORMS = ["sensor", "switch"]

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Edge-AI Master Hub component from configuration.yaml."""
    hass.data.setdefault(DOMAIN, {})
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Edge-AI Master Hub from a config entry."""
    _LOGGER.info("Setting up Edge-AI Master Hub: %s", entry.title)

    # Initialize Hardware Storage Controller
    storage_ctrl = StorageController(
        models_dir=entry.options.get("models_path", DEFAULT_MODELS_PATH),
        training_dir=entry.options.get("training_data_path", DEFAULT_TRAINING_DATA_PATH)
    )
    await storage_ctrl.async_init()

    hass.data[DOMAIN][entry.entry_id] = {
        "storage": storage_ctrl,
        "entry": entry,
    }

    # Register HA Services
    async def handle_trigger_voice(call: ServiceCall):
        text = call.data.get("message", "স্বাগতম! এজ-এআই মাস্টার সক্রিয় আছে।")
        speaker_target = call.data.get("target", "all")
        _LOGGER.info("Edge-AI Voice Broadcast: %s to %s", text, speaker_target)
        hass.bus.async_fire(EVENT_EDGE_AI_VOICE_BROADCAST, {
            "message": text,
            "target": speaker_target
        })

    async def handle_compress_dataset(call: ServiceCall):
        dataset_name = call.data.get("dataset_name", "household_routines")
        format_type = call.data.get("format", "zstd")
        _LOGGER.info("Triggering Zstandard compression for %s", dataset_name)
        result = await storage_ctrl.async_compress_dataset(dataset_name, format_type)
        return result

    async def handle_ram_benchmark(call: ServiceCall):
        file_name = call.data.get("file_name", "knowledge_distill_v3.jsonl.zst")
        _LOGGER.info("Running Pure NumPy direct-RAM decompression benchmark")
        res = await storage_ctrl.async_benchmark_direct_ram(file_name)
        return res

    hass.services.async_register(DOMAIN, "trigger_voice_broadcast", handle_trigger_voice)
    hass.services.async_register(DOMAIN, "run_compression", handle_compress_dataset)
    hass.services.async_register(DOMAIN, "benchmark_ram_streaming", handle_ram_benchmark)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    return unload_ok
