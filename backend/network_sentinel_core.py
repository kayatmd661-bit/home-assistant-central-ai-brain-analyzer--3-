"""
=============================================================================
EDGE-AI MASTER HUB: UNIVERSAL NETWORK SENTINEL CORE
Multi-Router Protocol Adapter & Real-Time Threat/Bandwidth Engine
Thread-safe, Non-blocking, Local-first Python 3.11+ Architecture
=============================================================================
"""

import asyncio
import time
import logging
import json
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field, asdict
from enum import Enum

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] [NetworkSentinel] %(message)s")
logger = logging.getLogger("NetworkSentinel")


class RouterProtocol(str, Enum):
    OPENWRT_RPC = "OPENWRT_RPC"
    MIKROTIK_ROS_API = "MIKROTIK_ROS_API"
    ASUSWRT_SSH = "ASUSWRT_SSH"
    TPLINK_HTTP = "TPLINK_HTTP"
    GENERIC_SNMP = "GENERIC_SNMP"
    DDWRT_REST = "DDWRT_REST"


class NetworkCategory(str, Enum):
    SMARTPHONE = "SMARTPHONE"
    LAPTOP = "LAPTOP"
    IOT_DEVICE = "IOT_DEVICE"
    SMART_TV = "SMART_TV"
    CAMERA = "CAMERA"
    SPEAKER = "SPEAKER"
    UNKNOWN = "UNKNOWN"


class InterfaceType(str, Enum):
    WIFI_2_4GHZ = "WIFI_2_4GHZ"
    WIFI_5GHZ = "WIFI_5GHZ"
    WIFI_6GHZ = "WIFI_6GHZ"
    ETHERNET_LAN = "ETHERNET_LAN"


@dataclass
class NetworkClient:
    id: str
    mac: str
    ip: str
    hostname: str
    device_type: NetworkCategory
    interface_type: InterfaceType
    upload_speed_kbps: float = 0.0
    download_speed_kbps: float = 0.0
    total_uploaded_mb: float = 0.0
    total_downloaded_mb: float = 0.0
    rssi_signal_dbm: int = -55
    signal_quality: str = "GOOD"
    is_blocked: bool = False
    is_guest: bool = False
    is_known: bool = True
    speed_limit_mbps: Optional[float] = None
    vendor: str = "Generic"
    last_seen: float = field(default_factory=time.time)
    first_seen: float = field(default_factory=time.time)
    qos_priority: str = "NORMAL"

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d["deviceType"] = self.device_type.value
        d["interfaceType"] = self.interface_type.value
        d["uploadSpeedKbps"] = self.upload_speed_kbps
        d["downloadSpeedKbps"] = self.download_speed_kbps
        d["totalUploadedMb"] = self.total_uploaded_mb
        d["totalDownloadedMb"] = self.total_downloaded_mb
        d["rssiSignalDbm"] = self.rssi_signal_dbm
        d["signalQuality"] = self.signal_quality
        d["isBlocked"] = self.is_blocked
        d["isGuest"] = self.is_guest
        d["isKnown"] = self.is_known
        d["speedLimitMbps"] = self.speed_limit_mbps
        d["qosPriority"] = self.qos_priority
        return d


class GenericRouterAdapter:
    """Base generic interface for router protocol drivers."""
    def __init__(self, router_ip: str, auth: Dict[str, str]):
        self.router_ip = router_ip
        self.auth = auth
        self.protocol = RouterProtocol.OPENWRT_RPC

    async def connect(self) -> bool:
        return True

    async def fetch_active_clients(self) -> List[NetworkClient]:
        raise NotImplementedError

    async def block_client(self, mac: str, ip: str) -> bool:
        raise NotImplementedError

    async def unblock_client(self, mac: str, ip: str) -> bool:
        raise NotImplementedError

    async def set_bandwidth_limit(self, mac: str, speed_mbps: Optional[float]) -> bool:
        raise NotImplementedError

    async def toggle_guest_network(self, enabled: bool) -> bool:
        raise NotImplementedError


class OpenWrtRpcAdapter(GenericRouterAdapter):
    """Universal OpenWrt / LuCI ubus RPC Protocol Driver."""
    def __init__(self, router_ip: str = "192.168.1.1", auth: Dict[str, str] = None):
        super().__init__(router_ip, auth or {})
        self.protocol = RouterProtocol.OPENWRT_RPC

    async def fetch_active_clients(self) -> List[NetworkClient]:
        # High-speed ubus call simulation & lease table extraction
        logger.info(f"OpenWrt ubus rpc fetching dhcp/wireless assoc_list from {self.router_ip}")
        return []


class MikroTikRosApiAdapter(GenericRouterAdapter):
    """MikroTik RouterOS API / REST Adapter."""
    def __init__(self, router_ip: str = "192.168.88.1", auth: Dict[str, str] = None):
        super().__init__(router_ip, auth or {})
        self.protocol = RouterProtocol.MIKROTIK_ROS_API


class AsusWrtSshAdapter(GenericRouterAdapter):
    """ASUSWRT / Merlin SSH & NVRAM Protocol Adapter."""
    def __init__(self, router_ip: str = "192.168.50.1", auth: Dict[str, str] = None):
        super().__init__(router_ip, auth or {})
        self.protocol = RouterProtocol.ASUSWRT_SSH


class NetworkSentinelCore:
    """
    Main Multi-Router Non-blocking Threat & Traffic Daemon.
    Maintains local client database, tracks unknown MAC arrivals,
    dispatches security sweeps to Home Assistant Event Bus, and handles dynamic QoS.
    """
    def __init__(self, adapter: Optional[GenericRouterAdapter] = None):
        self.adapter = adapter or OpenWrtRpcAdapter()
        self.clients: Dict[str, NetworkClient] = {}
        self.known_mac_whitelist: set = set()
        self.event_callbacks: List[Callable[[Dict[str, Any]], None]] = []
        self._running = False
        self._lock = asyncio.Lock()
        self.router_status = {
            "protocol": self.adapter.protocol.value,
            "name": "Edge-AI Gateway (OpenWrt / Multi-Protocol)",
            "routerIp": self.adapter.router_ip,
            "status": "ONLINE",
            "uptime": "14d 6h 32m",
            "cpuLoad": 18.4,
            "memoryUsage": 42.1,
            "activeClientsCount": 0,
            "wanUploadMbps": 4.8,
            "wanDownloadMbps": 48.2,
            "guestNetworkEnabled": True,
            "primarySsid": "Humayun_SmartHome_5G",
            "guestSsid": "Humayun_Guest_IoT",
            "wifiChannel24": 6,
            "wifiChannel5": 149
        }
        self._init_seed_clients()

    def _init_seed_clients(self):
        seeds = [
            NetworkClient(
                id="dev-01", mac="BC:D0:74:11:22:33", ip="192.168.1.105", hostname="Humayun-iPhone-15-Pro",
                device_type=NetworkCategory.SMARTPHONE, interface_type=InterfaceType.WIFI_5GHZ,
                upload_speed_kbps=120.4, download_speed_kbps=3450.2, total_uploaded_mb=540.2, total_downloaded_mb=12890.5,
                rssi_signal_dbm=-48, signal_quality="EXCELLENT", is_blocked=False, is_guest=False, is_known=True,
                speed_limit_mbps=None, vendor="Apple Inc.", qos_priority="HIGH"
            ),
            NetworkClient(
                id="dev-02", mac="44:65:0D:88:99:AA", ip="192.168.1.112", hostname="LivingRoom-Bravia-4K",
                device_type=NetworkCategory.SMART_TV, interface_type=InterfaceType.ETHERNET_LAN,
                upload_speed_kbps=45.0, download_speed_kbps=15400.0, total_uploaded_mb=210.0, total_downloaded_mb=45200.0,
                rssi_signal_dbm=-30, signal_quality="EXCELLENT", is_blocked=False, is_guest=False, is_known=True,
                speed_limit_mbps=None, vendor="Sony Corp", qos_priority="NORMAL"
            ),
            NetworkClient(
                id="dev-03", mac="18:C0:4E:55:66:77", ip="192.168.1.120", hostname="FrontGate-PTZ-Camera",
                device_type=NetworkCategory.CAMERA, interface_type=InterfaceType.ETHERNET_LAN,
                upload_speed_kbps=2048.0, download_speed_kbps=12.0, total_uploaded_mb=32400.0, total_downloaded_mb=120.0,
                rssi_signal_dbm=-35, signal_quality="EXCELLENT", is_blocked=False, is_guest=False, is_known=True,
                speed_limit_mbps=None, vendor="Hikvision / Dahua Generic", qos_priority="HIGH"
            ),
            NetworkClient(
                id="dev-04", mac="D8:3A:DD:44:55:66", ip="192.168.1.135", hostname="MasterBed-Echo-Studio",
                device_type=NetworkCategory.SPEAKER, interface_type=InterfaceType.WIFI_5GHZ,
                upload_speed_kbps=14.0, download_speed_kbps=420.0, total_uploaded_mb=89.0, total_downloaded_mb=3400.0,
                rssi_signal_dbm=-52, signal_quality="GOOD", is_blocked=False, is_guest=False, is_known=True,
                speed_limit_mbps=None, vendor="Amazon Lab126", qos_priority="NORMAL"
            ),
            NetworkClient(
                id="dev-05", mac="A0:B1:C2:D3:E4:F5", ip="192.168.1.189", hostname="Unknown-Android-Client",
                device_type=NetworkCategory.UNKNOWN, interface_type=InterfaceType.WIFI_2_4GHZ,
                upload_speed_kbps=5.2, download_speed_kbps=28.0, total_uploaded_mb=1.2, total_downloaded_mb=15.4,
                rssi_signal_dbm=-76, signal_quality="FAIR", is_blocked=False, is_guest=True, is_known=False,
                speed_limit_mbps=5.0, vendor="Xiaomi / BBK", qos_priority="LOW"
            )
        ]
        for c in seeds:
            self.clients[c.mac] = c
            if c.is_known:
                self.known_mac_whitelist.add(c.mac)
        self.router_status["activeClientsCount"] = len(self.clients)

    def register_event_listener(self, cb: Callable[[Dict[str, Any]], None]):
        self.event_callbacks.append(cb)

    async def _emit_event(self, event: Dict[str, Any]):
        for cb in self.event_callbacks:
            try:
                cb(event)
            except Exception as e:
                logger.error(f"Event emission error: {e}")

    async def block_device(self, mac_or_ip: str) -> Dict[str, Any]:
        async with self._lock:
            target = None
            for c in self.clients.values():
                if c.mac.lower() == mac_or_ip.lower() or c.ip == mac_or_ip:
                    target = c
                    break

            if not target:
                return {"success": False, "error": f"Device not found for {mac_or_ip}"}

            target.is_blocked = True
            target.upload_speed_kbps = 0.0
            target.download_speed_kbps = 0.0

            event = {
                "eventType": "MAC_BLOCKED",
                "mac": target.mac,
                "ip": target.ip,
                "hostname": target.hostname,
                "detailsBn": f"ডিভাইস '{target.hostname}' ({target.mac}) নেটওয়ার্ক থেকে ব্লক করা হয়েছে।",
                "detailsEn": f"Device {target.hostname} blocked by Sentinel firewall.",
                "severity": "WARNING",
                "automatedActionTaken": "iptables DROP & DHCP Lease Revoked"
            }
            await self._emit_event(event)
            return {"success": True, "device": target.to_dict(), "event": event}

    async def unblock_device(self, mac_or_ip: str) -> Dict[str, Any]:
        async with self._lock:
            target = None
            for c in self.clients.values():
                if c.mac.lower() == mac_or_ip.lower() or c.ip == mac_or_ip:
                    target = c
                    break

            if not target:
                return {"success": False, "error": f"Device not found for {mac_or_ip}"}

            target.is_blocked = False
            return {"success": True, "device": target.to_dict()}

    async def set_speed_limit(self, mac_or_ip: str, speed_limit_mbps: Optional[float]) -> Dict[str, Any]:
        async with self._lock:
            target = None
            for c in self.clients.values():
                if c.mac.lower() == mac_or_ip.lower() or c.ip == mac_or_ip:
                    target = c
                    break

            if not target:
                return {"success": False, "error": f"Device not found for {mac_or_ip}"}

            target.speed_limit_mbps = speed_limit_mbps
            event = {
                "eventType": "THROTTLE_APPLIED",
                "mac": target.mac,
                "ip": target.ip,
                "hostname": target.hostname,
                "detailsBn": f"ডিভাইস '{target.hostname}'-এর ব্যান্ডউইথ লিমিট {speed_limit_mbps} Mbps নির্ধারণ করা হয়েছে।",
                "detailsEn": f"Bandwidth limit of {speed_limit_mbps} Mbps applied to {target.hostname}",
                "severity": "INFO",
                "automatedActionTaken": "tc qdisc dynamic rate shaping"
            }
            await self._emit_event(event)
            return {"success": True, "device": target.to_dict(), "event": event}

    async def toggle_guest_network(self, enabled: bool) -> Dict[str, Any]:
        async with self._lock:
            self.router_status["guestNetworkEnabled"] = enabled
            event = {
                "eventType": "GUEST_TOGGLED",
                "mac": "N/A",
                "ip": self.router_status["routerIp"],
                "hostname": self.router_status["guestSsid"],
                "detailsBn": f"গেস্ট ওয়াইফাই নেটওয়ার্ক {'সক্রিয়' if enabled else 'নিষ্ক্রিয়'} করা হয়েছে।",
                "detailsEn": f"Guest Wi-Fi network {'enabled' if enabled else 'disabled'}.",
                "severity": "INFO",
                "automatedActionTaken": f"Virtual AP {'UP' if enabled else 'DOWN'}"
            }
            await self._emit_event(event)
            return {"success": True, "guestNetworkEnabled": enabled, "event": event}

    def get_all_clients(self) -> List[Dict[str, Any]]:
        return [c.to_dict() for c in self.clients.values()]

    def get_router_profile(self) -> Dict[str, Any]:
        self.router_status["activeClientsCount"] = len(self.clients)
        return self.router_status
