"""
Multi-API Key Gemini Manager & Failover Pool
Supports dynamic storage, rotation, rate-limit fallback (HTTP 429), and latency monitoring.
"""

import os
import json
import time
import logging
from typing import List, Dict, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MultiKeyGeminiPool")

CONFIG_PATH = os.environ.get("OPTIONS_JSON_PATH", "/data/options.json")
FALLBACK_STORAGE = "/tmp/gemini_keys_pool.json"

class GeminiKeyEntry:
    def __init__(self, key_id: str, api_key: str, label: str = "", active: bool = True):
        self.key_id = key_id
        self.api_key = api_key
        self.label = label or f"Gemini Key ({key_id[-6:] if len(key_id) > 6 else key_id})"
        self.active = active
        self.status = "HEALTHY" # HEALTHY | RATE_LIMITED | EXHAUSTED | INVALID
        self.last_used_timestamp = 0.0
        self.rate_limit_reset_timestamp = 0.0
        self.request_count = 0
        self.error_count = 0
        self.avg_latency_ms = 120.0

    def to_dict(self, mask_secret: bool = True) -> Dict[str, Any]:
        key_display = self.api_key
        if mask_secret and len(self.api_key) > 8:
            key_display = f"{self.api_key[:4]}...{self.api_key[-4:]}"
        return {
            "key_id": self.key_id,
            "masked_key": key_display,
            "label": self.label,
            "active": self.active,
            "status": self.status,
            "last_used": time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(self.last_used_timestamp)) if self.last_used_timestamp else "Never",
            "request_count": self.request_count,
            "error_count": self.error_count,
            "avg_latency_ms": round(self.avg_latency_ms, 1),
            "is_rate_limited": self.status == "RATE_LIMITED" and time.time() < self.rate_limit_reset_timestamp
        }

class MultiKeyGeminiPool:
    def __init__(self):
        self.keys: List[GeminiKeyEntry] = []
        self.current_index = 0
        self.load_keys()

    def load_keys(self):
        """Loads API keys from options.json or environment variables."""
        loaded_keys = []
        
        # 1. Check primary environment variable
        primary_key = os.environ.get("GEMINI_API_KEY", "")
        if primary_key and primary_key != "MY_GEMINI_API_KEY":
            loaded_keys.append(GeminiKeyEntry("key-primary", primary_key, "Primary Env Key", active=True))

        # 2. Check persistent options.json or fallback storage
        storage_file = CONFIG_PATH if os.path.exists(CONFIG_PATH) else FALLBACK_STORAGE
        if os.path.exists(storage_file):
            try:
                with open(storage_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    saved_pool = data.get("gemini_keys_pool", [])
                    for item in saved_pool:
                        if item.get("api_key") and not any(k.api_key == item["api_key"] for k in loaded_keys):
                            k = GeminiKeyEntry(
                                key_id=item.get("key_id", f"key-{int(time.time()*1000)}"),
                                api_key=item["api_key"],
                                label=item.get("label", ""),
                                active=item.get("active", True)
                            )
                            loaded_keys.append(k)
            except Exception as e:
                logger.warning(f"Could not load persistent keys from {storage_file}: {e}")

        self.keys = loaded_keys
        logger.info(f"Loaded {len(self.keys)} Gemini API keys into Failover Pool.")

    def save_keys(self):
        """Persists keys to JSON storage."""
        storage_file = CONFIG_PATH if os.path.exists(os.path.dirname(CONFIG_PATH)) else FALLBACK_STORAGE
        try:
            pool_data = [
                {
                    "key_id": k.key_id,
                    "api_key": k.api_key,
                    "label": k.label,
                    "active": k.active
                }
                for k in self.keys
            ]
            
            existing = {}
            if os.path.exists(storage_file):
                try:
                    with open(storage_file, "r", encoding="utf-8") as f:
                        existing = json.load(f)
                except Exception:
                    existing = {}

            existing["gemini_keys_pool"] = pool_data
            with open(storage_file, "w", encoding="utf-8") as f:
                json.dump(existing, f, indent=2)
            logger.info("Successfully persisted Gemini Keys Pool.")
        except Exception as e:
            logger.error(f"Failed to persist keys to {storage_file}: {e}")

    def add_key(self, api_key: str, label: str = "") -> Dict[str, Any]:
        """Adds a new key to the pool."""
        clean_key = api_key.strip()
        if not clean_key:
            return {"success": False, "error": "API Key cannot be empty"}

        if any(k.api_key == clean_key for k in self.keys):
            return {"success": False, "error": "This API Key already exists in the pool"}

        new_entry = GeminiKeyEntry(
            key_id=f"key-{int(time.time()*1000)}",
            api_key=clean_key,
            label=label or f"Gemini Pool Key #{len(self.keys) + 1}",
            active=True
        )
        self.keys.append(new_entry)
        self.save_keys()
        return {"success": True, "key": new_entry.to_dict()}

    def remove_key(self, key_id: str) -> bool:
        """Removes a key by ID."""
        initial_len = len(self.keys)
        self.keys = [k for k in self.keys if k.key_id != key_id]
        if len(self.keys) < initial_len:
            self.save_keys()
            return True
        return False

    def toggle_key(self, key_id: str, active: bool) -> bool:
        for k in self.keys:
            if k.key_id == key_id:
                k.active = active
                self.save_keys()
                return True
        return False

    def get_active_key(self) -> Optional[GeminiKeyEntry]:
        """Returns the current operational key, handling automatic failover."""
        now = time.time()
        active_candidates = [k for k in self.keys if k.active]
        if not active_candidates:
            return None

        # Check if rate-limited keys have expired their timeout (60s backoff)
        for k in active_candidates:
            if k.status == "RATE_LIMITED" and now > k.rate_limit_reset_timestamp:
                k.status = "HEALTHY"

        # Find healthy key starting from current index
        for i in range(len(active_candidates)):
            idx = (self.current_index + i) % len(active_candidates)
            candidate = active_candidates[idx]
            if candidate.status == "HEALTHY":
                self.current_index = idx
                candidate.last_used_timestamp = now
                candidate.request_count += 1
                return candidate

        # If all rate limited, return the one with earliest reset timestamp
        return active_candidates[0]

    def report_rate_limit(self, key_id: str, backoff_seconds: int = 60):
        """Marks a key as rate limited and advances to next key."""
        for k in self.keys:
            if k.key_id == key_id:
                k.status = "RATE_LIMITED"
                k.rate_limit_reset_timestamp = time.time() + backoff_seconds
                k.error_count += 1
                logger.warning(f"Key {k.label} marked RATE_LIMITED. Failing over...")
                # Advance index
                self.current_index = (self.current_index + 1) % len(self.keys)
                break

    def report_success(self, key_id: str, latency_ms: float):
        for k in self.keys:
            if k.key_id == key_id:
                k.status = "HEALTHY"
                k.avg_latency_ms = (k.avg_latency_ms * 0.8) + (latency_ms * 0.2)
                break

    def get_pool_status(self) -> Dict[str, Any]:
        return {
            "total_keys": len(self.keys),
            "active_keys": len([k for k in self.keys if k.active]),
            "healthy_keys": len([k for k in self.keys if k.active and k.status == "HEALTHY"]),
            "current_active_index": self.current_index,
            "keys": [k.to_dict(mask_secret=True) for k in self.keys]
        }

# Global singleton
gemini_pool = MultiKeyGeminiPool()
