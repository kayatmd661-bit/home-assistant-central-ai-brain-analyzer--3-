"""
=============================================================================
EDGE-AI MASTER HUB: UNIVERSAL NATURAL LANGUAGE INTENT ENGINE
Bengali (বাংলা) & English Multi-Domain NLU & Cross-System Orchestrator
Thread-safe, Non-blocking, Local-first Python 3.11+ Architecture
=============================================================================
"""

import re
import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] [UniversalIntentEngine] %(message)s")
logger = logging.getLogger("UniversalIntentEngine")


@dataclass
class ParsedIntentResult:
    domain: str # NETWORK | BLUETOOTH | FFT_LIGHTING | CAMERA | CROSS_SYSTEM | HA_DEVICE
    intent_action: str
    target_entities: List[str]
    parameters: Dict[str, Any]
    voice_feedback_bn: str
    voice_feedback_en: str
    execution_plan: List[Dict[str, Any]]
    confidence: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "domain": self.domain,
            "intentAction": self.intent_action,
            "targetEntities": self.target_entities,
            "parameters": self.parameters,
            "voiceFeedbackBn": self.voice_feedback_bn,
            "voiceFeedbackEn": self.voice_feedback_en,
            "executionPlan": self.execution_plan,
            "confidence": self.confidence
        }


class UniversalIntentEngine:
    """
    Unified Bengali and English Natural Language Processing Engine.
    Translates free-form voice and text utterances into deterministic
    hardware-level execution plans across Network, Bluetooth, Lighting, and HA domains.
    """
    def __init__(self):
        # Bengali regex compilation
        self.re_speed_bn = re.compile(r'(\d+)\s*(?:এমবিপিএস|mbps|মেগাবিট)', re.IGNORECASE)
        self.re_mac_addr = re.compile(r'([0-9a-fA-F]{2}(?::[0-9a-fA-F]{2}){5})')
        self.re_ip_addr = re.compile(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})')

    def parse_utterance(self, text: str) -> ParsedIntentResult:
        raw = text.strip()
        lower = raw.lower()

        # 1. NETWORK MANAGEMENT DOMAIN
        if any(k in lower for k in ["ওয়াইফাই", "রাউটার", "ব্যান্ডউইথ", "স্পিড লিমিট", "ব্লক", "mac", "wifi", "router", "speed limit", "block", "guest network", "গেস্ট"]):
            return self._parse_network_intent(raw, lower)

        # 2. BLUETOOTH & MUSIC-REACTIVE LIGHTING DOMAIN
        if any(k in lower for k in ["ব্লুটুথ", "স্পিকার", "গান", "মিউজিক", "সাউন্ড", "এফএফটি", "লাইটিং সিঙ্ক", "রিঅ্যাক্টিভ", "bluetooth", "speaker", "music", "fft", "reactive", "bass"]):
            return self._parse_bluetooth_intent(raw, lower)

        # 3. CROSS-SYSTEM AUTOMATION PIPELINE (NETWORK + CAMERA + LIGHTING)
        if any(k in lower for k in ["যদি", "তাহলে", "অচেনা", "if", "when", "intruder", "unknown"]):
            return self._parse_cross_system_intent(raw, lower)

        # Default fallback to standard HA device control
        return ParsedIntentResult(
            domain="HA_DEVICE",
            intent_action="GENERIC_HA_SERVICE",
            target_entities=["light.drawing_room"],
            parameters={"text": raw},
            voice_feedback_bn=f"আপনার নির্দেশ '{raw}' হোম অ্যাসিস্ট্যান্ট সিস্টেমে যাচাই করা হচ্ছে।",
            voice_feedback_en=f"Your command '{raw}' is being verified in Home Assistant.",
            execution_plan=[{"entity_id": "light.drawing_room", "service": "turn_on", "params": {}}],
            confidence=0.92
        )

    def _parse_network_intent(self, raw: str, lower: str) -> ParsedIntentResult:
        # Check for block
        if any(k in lower for k in ["ব্লক", "block", "drop"]):
            mac_match = self.re_mac_addr.search(raw)
            ip_match = self.re_ip_addr.search(raw)
            target = mac_match.group(1) if mac_match else (ip_match.group(1) if ip_match else "unknown_client")

            return ParsedIntentResult(
                domain="NETWORK",
                intent_action="BLOCK_CLIENT",
                target_entities=[target],
                parameters={"target": target},
                voice_feedback_bn=f"নেটওয়ার্ক সেন্টিনেল: ডিভাইস '{target}' অবিলম্বে ব্লক করা হয়েছে এবং অ্যাক্সেস বন্ধ করা হলো।",
                voice_feedback_en=f"Network Sentinel: Target {target} blocked from local router firewall.",
                execution_plan=[{
                    "targetDomain": "ROUTER_NETWORK",
                    "service": "block_device",
                    "params": {"macOrIp": target},
                    "descriptionBn": f"রাউটার ফায়ারওয়ালে {target} ব্লক রুল কার্যকর"
                }],
                confidence=0.98
            )

        # Check for speed limit / throttle
        speed_match = self.re_speed_bn.search(lower) or re.search(r'(\d+)\s*mbps', lower)
        if speed_match:
            speed_val = float(speed_match.group(1))
            return ParsedIntentResult(
                domain="NETWORK",
                intent_action="SET_BANDWIDTH_LIMIT",
                target_entities=["all_guests" if "গেস্ট" in lower or "guest" in lower else "targeted_client"],
                parameters={"speedLimitMbps": speed_val},
                voice_feedback_bn=f"রাউটারের গতিসীমা {speed_val} Mbps নির্ধারণ করা হয়েছে।",
                voice_feedback_en=f"Router bandwidth limit set to {speed_val} Mbps.",
                execution_plan=[{
                    "targetDomain": "ROUTER_NETWORK",
                    "service": "set_speed_limit",
                    "params": {"speedLimitMbps": speed_val},
                    "descriptionBn": f"ডায়নামিক QoS রেট {speed_val} Mbps কনফিগারেশন"
                }],
                confidence=0.97
            )

        # Check for guest network toggle
        if any(k in lower for k in ["গেস্ট ওয়াইফাই", "guest wifi", "guest network"]):
            enable = not any(k in lower for k in ["বন্ধ", "অফ", "disable", "turn off"])
            return ParsedIntentResult(
                domain="NETWORK",
                intent_action="TOGGLE_GUEST_NETWORK",
                target_entities=["router.guest_ap"],
                parameters={"enabled": enable},
                voice_feedback_bn=f"গেস্ট ওয়াইফাই নেটওয়ার্ক সফলভাবে {'চালু' if enable else 'বন্ধ'} করা হয়েছে।",
                voice_feedback_en=f"Guest Wi-Fi network {'enabled' if enable else 'disabled'}.",
                execution_plan=[{
                    "targetDomain": "ROUTER_NETWORK",
                    "service": "toggle_guest_network",
                    "params": {"enabled": enable},
                    "descriptionBn": f"ভার্চুয়াল গেস্ট এপি {'আপ' if enable else 'ডাউন'}"
                }],
                confidence=0.99
            )

        # Generic network status
        return ParsedIntentResult(
            domain="NETWORK",
            intent_action="STATUS_QUERY",
            target_entities=["router.gateway"],
            parameters={},
            voice_feedback_bn="নেটওয়ার্ক সেন্টিনেল সক্রিয় রয়েছে। সব সংযোগ ও ব্যান্ডউইথ স্থিতিশীল।",
            voice_feedback_en="Network Sentinel active. All clients and bandwidth stable.",
            execution_plan=[],
            confidence=0.90
        )

    def _parse_bluetooth_intent(self, raw: str, lower: str) -> ParsedIntentResult:
        is_party = any(k in lower for k in ["পার্টি", "সব স্পিকার", "all speaker", "party sync", "পুরো বাড়ি"])
        is_reactive = any(k in lower for k in ["রিঅ্যাক্টিভ", "লাইট", "নাচ", "reactive", "sync light", "bass"])

        plan = []
        if is_party:
            plan.append({
                "targetDomain": "BLUETOOTH_AUDIO",
                "service": "group_broadcast",
                "params": {"groupId": "group-party-all", "active": True},
                "descriptionBn": "পুরো বাড়ি ব্লুটুথ স্পিকার ব্রডকাস্ট ম্যাট্রিক্স চালু"
            })

        if is_reactive:
            plan.append({
                "targetDomain": "HA_ENTITY",
                "entity_id": "light.drawing_room",
                "service": "music_reactive_sync",
                "params": {"palette": "NEON_CYBERPUNK", "bassBoost": True},
                "descriptionBn": "মিউজিক এফএফটি বিট-ড্রপ লাইটিং সিঙ্ক কার্যকর"
            })

        return ParsedIntentResult(
            domain="BLUETOOTH",
            intent_action="AUDIO_ROUTING_AND_LIGHT_SYNC",
            target_entities=["bt-rec-01", "bt-rec-03", "light.drawing_room"],
            parameters={"partySync": is_party, "musicReactive": is_reactive},
            voice_feedback_bn="মাল্টি-ব্লুটুথ অডিও সুইচবোর্ড ও মিউজিক-রিঅ্যাক্টিভ লাইটিং সক্রিয় করা হয়েছে।",
            voice_feedback_en="Multi-Bluetooth audio matrix and music-reactive lights synced.",
            execution_plan=plan or [{
                "targetDomain": "BLUETOOTH_AUDIO",
                "service": "route_audio",
                "params": {"receiverId": "bt-rec-01", "stream": True},
                "descriptionBn": "মার্শাল স্টুডিও স্পিকারে অডিও স্ট্রিম"
            }],
            confidence=0.96
        )

    def _parse_cross_system_intent(self, raw: str, lower: str) -> ParsedIntentResult:
        return ParsedIntentResult(
            domain="CROSS_SYSTEM",
            intent_action="DYNAMIC_CROSS_AUTOMATION",
            target_entities=["network.sentinel", "camera.front_gate", "media_player.door_speaker"],
            parameters={"trigger": "UNKNOWN_MAC_JOINED", "cameraAction": "PTZ_SWEEP"},
            voice_feedback_bn="ক্রস-সিস্টেম ইন্টেন্ট: অজানা ওয়াইফাই ডিভাইস সংযুক্ত হলে সাথে সাথে গেটের ক্যামেরা প্যান ও স্পিকারে সতর্কতা জারি করার রুল প্রস্তুত।",
            voice_feedback_en="Cross-system pipeline: Unknown MAC trigger mapped to PTZ camera sweep and speaker broadcast.",
            execution_plan=[
                {
                    "targetDomain": "CAMERA_VISION",
                    "entity_id": "camera.front_gate",
                    "service": "ptz_preset",
                    "params": {"preset_id": "preset_2_yard"},
                    "descriptionBn": "ক্যামেরা ইয়ার্ড পজিশনে প্যান"
                },
                {
                    "targetDomain": "VOICE_TTS",
                    "entity_id": "media_player.door_speaker",
                    "service": "tts_speak",
                    "params": {"message": "সতর্কতা: নতুন অজানা নেটওয়ার্ক সংযোগ শনাক্ত হয়েছে।"},
                    "descriptionBn": "ক্যামেরা স্পিকারে অডিও ওয়ার্নিং"
                }
            ],
            confidence=0.98
        )
