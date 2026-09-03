import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Router, 
  Activity, 
  Sliders, 
  Ban, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone, 
  Laptop, 
  Tv, 
  Camera, 
  Radio, 
  HelpCircle, 
  RefreshCw, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Lock,
  RadioTower,
  Sparkles
} from 'lucide-react';
import { NetworkClientDevice, RouterProtocolProfile, NetworkSecurityEvent, RouterProtocolType } from '../types';

const INITIAL_CLIENTS: NetworkClientDevice[] = [
  {
    id: 'dev-01',
    mac: '70:85:C2:A1:9F:44',
    ip: '192.168.1.102',
    hostname: 'Humayun-iPhone-15-Pro',
    deviceType: 'SMARTPHONE',
    interfaceType: 'WIFI_5GHZ',
    uploadSpeedKbps: 120.4,
    downloadSpeedKbps: 4200.0,
    totalUploadedMb: 450.2,
    totalDownloadedMb: 8200.5,
    rssiSignalDbm: -52,
    signalQuality: 'EXCELLENT',
    isBlocked: false,
    isGuest: false,
    isKnown: true,
    speedLimitMbps: null,
    vendor: 'Apple Inc.',
    lastSeen: 'Just now',
    firstSeen: '2026-08-01 10:00:00',
    qosPriority: 'HIGH'
  },
  {
    id: 'dev-02',
    mac: '24:4B:FE:8A:11:BC',
    ip: '192.168.1.120',
    hostname: 'Living-Room-Samsung-TV-4K',
    deviceType: 'SMART_TV',
    interfaceType: 'ETHERNET_LAN',
    uploadSpeedKbps: 45.0,
    downloadSpeedKbps: 18500.0,
    totalUploadedMb: 890.0,
    totalDownloadedMb: 45600.0,
    rssiSignalDbm: -38,
    signalQuality: 'EXCELLENT',
    isBlocked: false,
    isGuest: false,
    isKnown: true,
    speedLimitMbps: null,
    vendor: 'Samsung Electronics',
    lastSeen: 'Just now',
    firstSeen: '2026-08-01 10:00:00',
    qosPriority: 'HIGH'
  },
  {
    id: 'dev-03',
    mac: '84:CC:A8:92:4E:01',
    ip: '192.168.1.145',
    hostname: 'ESP32-Bedroom-MultiSensor-BLE',
    deviceType: 'IOT_DEVICE',
    interfaceType: 'WIFI_2_4GHZ',
    uploadSpeedKbps: 4.2,
    downloadSpeedKbps: 1.1,
    totalUploadedMb: 12.4,
    totalDownloadedMb: 4.8,
    rssiSignalDbm: -68,
    signalQuality: 'GOOD',
    isBlocked: false,
    isGuest: false,
    isKnown: true,
    speedLimitMbps: 2.0,
    vendor: 'Espressif Inc.',
    lastSeen: 'Just now',
    firstSeen: '2026-08-05 14:20:00',
    qosPriority: 'NORMAL'
  },
  {
    id: 'dev-04',
    mac: 'DC:4F:22:98:A2:10',
    ip: '192.168.1.150',
    hostname: 'Sonoff-Dual-Switch-Relay',
    deviceType: 'IOT_DEVICE',
    interfaceType: 'WIFI_2_4GHZ',
    uploadSpeedKbps: 1.8,
    downloadSpeedKbps: 0.9,
    totalUploadedMb: 8.1,
    totalDownloadedMb: 2.3,
    rssiSignalDbm: -62,
    signalQuality: 'GOOD',
    isBlocked: false,
    isGuest: false,
    isKnown: true,
    speedLimitMbps: null,
    vendor: 'ITead / Sonoff',
    lastSeen: 'Just now',
    firstSeen: '2026-08-10 16:40:00',
    qosPriority: 'NORMAL'
  },
  {
    id: 'dev-05',
    mac: '3C:06:30:4E:77:88',
    ip: '192.168.1.155',
    hostname: 'MacBook-Pro-M3-Max',
    deviceType: 'LAPTOP',
    interfaceType: 'WIFI_6GHZ',
    uploadSpeedKbps: 240.0,
    downloadSpeedKbps: 8600.0,
    totalUploadedMb: 1840.0,
    totalDownloadedMb: 31200.0,
    rssiSignalDbm: -44,
    signalQuality: 'EXCELLENT',
    isBlocked: false,
    isGuest: false,
    isKnown: true,
    speedLimitMbps: null,
    vendor: 'Apple Inc.',
    lastSeen: 'Just now',
    firstSeen: '2026-08-02 09:15:00',
    qosPriority: 'HIGH'
  },
  {
    id: 'dev-06',
    mac: 'A0:B1:C2:D3:E4:F5',
    ip: '192.168.1.189',
    hostname: 'Guest-Unknown-Xiaomi',
    deviceType: 'UNKNOWN',
    interfaceType: 'WIFI_2_4GHZ',
    uploadSpeedKbps: 8.5,
    downloadSpeedKbps: 34.0,
    totalUploadedMb: 2.4,
    totalDownloadedMb: 18.2,
    rssiSignalDbm: -74,
    signalQuality: 'FAIR',
    isBlocked: false,
    isGuest: true,
    isKnown: false,
    speedLimitMbps: 5.0,
    vendor: 'Xiaomi / BBK Unverified',
    lastSeen: '2 min ago',
    firstSeen: '2026-08-20 11:00:00',
    qosPriority: 'LOW'
  }
];

const INITIAL_EVENTS: NetworkSecurityEvent[] = [
  {
    id: 'sec-ev-01',
    timestamp: '2026-08-20 11:00:00',
    eventType: 'UNKNOWN_MAC_JOINED',
    mac: 'A0:B1:C2:D3:E4:F5',
    ip: '192.168.1.189',
    hostname: 'Guest-Unknown-Xiaomi',
    detailsBn: 'অজানা MAC ঠিকানা থেকে গেস্ট ওয়াইফাইতে সংযোগ শনাক্ত হয়েছে। ৫ Mbps স্পিড লিমিট প্রয়োগ করা হলো।',
    detailsEn: 'Unknown MAC connected to Guest Wi-Fi. 5 Mbps QoS throttle applied automatically.',
    severity: 'WARNING',
    automatedActionTaken: 'Camera Sweep & Rate Limit Enforced'
  }
];

export const NetworkSentinelDashboard: React.FC = () => {
  const [profile, setProfile] = useState<RouterProtocolProfile>({
    protocol: 'OPENWRT_RPC',
    name: 'Edge-AI Core Gateway (OpenWrt / Multi-Protocol)',
    routerIp: '192.168.1.1',
    status: 'ONLINE',
    uptime: '18d 14h 22m',
    cpuLoad: 14.2,
    memoryUsage: 38.6,
    activeClientsCount: 6,
    wanUploadMbps: 5.4,
    wanDownloadMbps: 52.8,
    guestNetworkEnabled: true,
    primarySsid: 'Humayun_SmartHome_5G',
    guestSsid: 'Humayun_Guest_IoT',
    wifiChannel24: 6,
    wifiChannel5: 149
  });

  const [clients, setClients] = useState<NetworkClientDevice[]>(INITIAL_CLIENTS);
  const [events, setEvents] = useState<NetworkSecurityEvent[]>(INITIAL_EVENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'KNOWN' | 'GUEST' | 'BLOCKED'>('ALL');
  const [selectedProtocol, setSelectedProtocol] = useState<RouterProtocolType>('OPENWRT_RPC');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes, eRes] = await Promise.all([
        fetch('/api/network/profile').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/network/clients').then(r => r.ok ? r.json() : null).catch(() => null),
        fetch('/api/network/events').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (pRes?.profile) setProfile(pRes.profile);
      if (cRes?.clients && Array.isArray(cRes.clients)) setClients(cRes.clients);
      if (eRes?.events && Array.isArray(eRes.events)) setEvents(eRes.events);
    } catch {
      // Graceful fallback to existing state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBlockToggle = async (client: NetworkClientDevice) => {
    const endpoint = client.isBlocked ? '/api/network/unblock' : '/api/network/block';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macOrIp: client.mac })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(client.isBlocked 
          ? `ডিভাইস '${client.hostname}' আনব্লক করা হয়েছে।` 
          : `ডিভাইস '${client.hostname}' সফলভাবে ব্লক করা হলো।`
        );
        fetchNetworkData();
      }
    } catch (err) {
      console.error('Block toggle failed:', err);
    }
  };

  const handleSetSpeedLimit = async (client: NetworkClientDevice, speedMbps: number | null) => {
    try {
      const res = await fetch('/api/network/speed-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ macOrIp: client.mac, speedLimitMbps: speedMbps })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`'${client.hostname}' স্পিড লিমিট: ${speedMbps ? speedMbps + ' Mbps' : 'আনলিমিটেড'}`);
        fetchNetworkData();
      }
    } catch (err) {
      console.error('Speed limit failed:', err);
    }
  };

  const handleGuestToggle = async () => {
    try {
      const res = await fetch('/api/network/guest-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !profile.guestNetworkEnabled })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, guestNetworkEnabled: data.guestNetworkEnabled }));
        setFeedbackMsg(`গেস্ট ওয়াইফাই ${data.guestNetworkEnabled ? 'চালু' : 'বন্ধ'} করা হয়েছে।`);
      }
    } catch (err) {
      console.error('Guest toggle failed:', err);
    }
  };

  const handleSimulateUnknownMac = async () => {
    try {
      const res = await fetch('/api/network/simulate-unknown-mac', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(data.message || 'অজানা MAC শনাক্ত ও সিকিউরিটি সুইপ ট্রিগার হয়েছে!');
        fetchNetworkData();
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'SMARTPHONE': return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'LAPTOP': return <Laptop className="w-4 h-4 text-indigo-400" />;
      case 'SMART_TV': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'CAMERA': return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'SPEAKER': return <Radio className="w-4 h-4 text-amber-400" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.hostname.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          c.ip.includes(filterQuery) ||
                          c.mac.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          c.vendor.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTabFilter === 'KNOWN') return c.isKnown && !c.isBlocked;
    if (activeTabFilter === 'GUEST') return c.isGuest;
    if (activeTabFilter === 'BLOCKED') return c.isBlocked;
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      
      {/* Top Banner & Multi-Router Protocol Status */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span>ওয়াইফাই ও নেটওয়ার্ক সিকিউরিটি গার্ড</span>
                  <span className="text-xs px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
                    ফায়ারওয়াল সক্রিয়
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                সকল ব্র্যান্ডের রাউটার নিয়ন্ত্রণ • অচেনা ডিভাইস শনাক্ত ও ইন্টারনেটের গতি (Speed Limit) কন্ট্রোল
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-simulate-unknown-mac"
              onClick={handleSimulateUnknownMac}
              className="px-3.5 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-lg shadow-rose-950/30 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>🚨 অচেনা ডিভাইস টেস্ট করুন</span>
            </button>

            <button
              id="btn-refresh-network"
              onClick={fetchNetworkData}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="তথ্য রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Router Protocol Switcher & WAN Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 pt-5 border-t border-slate-800/80">
          
          {/* Protocol Adapter Box */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span className="flex items-center gap-1.5"><Router className="w-3.5 h-3.5 text-cyan-400" /> রাউটার প্রোটোকল</span>
              <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> সচল (ONLINE)</span>
            </div>
            <select
              id="select-router-protocol"
              value={selectedProtocol}
              onChange={e => setSelectedProtocol(e.target.value as RouterProtocolType)}
              className="w-full bg-slate-900 text-xs text-cyan-300 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="OPENWRT_RPC">OpenWrt / LuCI (ubus RPC)</option>
              <option value="MIKROTIK_ROS_API">MikroTik RouterOS API</option>
              <option value="ASUSWRT_SSH">ASUSWRT / Merlin SSH</option>
              <option value="TPLINK_HTTP">TP-Link HTTP / Omada API</option>
              <option value="GENERIC_SNMP">Generic Router SNMP v2/v3</option>
              <option value="DDWRT_REST">DD-WRT REST Daemon</option>
            </select>
          </div>

          {/* WAN Bandwidth Rates */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>ইন্টারনেট গতি (লাইভ ট্রাফিক)</span>
              <span className="text-slate-500">আইপি: {profile.routerIp}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" /> {profile.wanDownloadMbps} Mbps
              </span>
              <span className="text-indigo-400 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> {profile.wanUploadMbps} Mbps
              </span>
            </div>
          </div>

          {/* Connected Clients & Resource Load */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Active Clients / Hardware</span>
              <span className="text-cyan-400 font-bold">{clients.length} Devices</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>CPU: {profile.cpuLoad}%</span>
              <span>RAM: {profile.memoryUsage}%</span>
              <span>Uptime: {profile.uptime}</span>
            </div>
          </div>

          {/* Guest Network AP Control */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Guest Wi-Fi Isolation</div>
              <div className="text-[11px] text-slate-300 truncate max-w-[130px]">{profile.guestSsid}</div>
            </div>
            <button
              id="btn-toggle-guest-wifi"
              onClick={handleGuestToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                profile.guestNetworkEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {profile.guestNetworkEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="mt-3 p-2.5 bg-cyan-950/90 border border-cyan-800/80 rounded-xl text-xs text-cyan-300 font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {feedbackMsg}
            </span>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
        )}
      </div>

      {/* Main Clients Table & Access Control Suite */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        
        {/* Table Filter Tabs and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          
          <div className="flex items-center gap-2">
            {(['ALL', 'KNOWN', 'GUEST', 'BLOCKED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeTabFilter === tab 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab === 'ALL' && `All (${clients.length})`}
                {tab === 'KNOWN' && `Known Trusted (${clients.filter(c => c.isKnown && !c.isBlocked).length})`}
                {tab === 'GUEST' && `Guest IoT (${clients.filter(c => c.isGuest).length})`}
                {tab === 'BLOCKED' && `Blocked (${clients.filter(c => c.isBlocked).length})`}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Hostname, MAC, IP, Vendor..."
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl px-3 py-2 pl-8 font-mono w-full md:w-64 focus:outline-none focus:border-cyan-500"
            />
            <Eye className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

        </div>

        {/* Clients Grid / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className={`p-4 rounded-xl border transition-all ${
                client.isBlocked 
                  ? 'bg-rose-950/20 border-rose-900/60 shadow-lg shadow-rose-950/20' 
                  : client.isGuest
                  ? 'bg-slate-950/80 border-amber-900/40 hover:border-amber-700/60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-800/60'
              }`}
            >
              {/* Header: Icon, Hostname & Block Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    {getDeviceIcon(client.deviceType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono truncate max-w-[170px]" title={client.hostname}>
                      {client.hostname}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">{client.vendor}</p>
                  </div>
                </div>

                {client.isBlocked ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800 rounded">
                    BLOCKED
                  </span>
                ) : client.isGuest ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded">
                    GUEST
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                    TRUSTED
                  </span>
                )}
              </div>

              {/* Network Details: IP, MAC, Interface, RSSI */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">IP:</span>
                  <span className="text-cyan-300 font-semibold">{client.ip}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">MAC:</span>
                  <span className="text-slate-400">{client.mac}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Interface:</span>
                  <span className="text-indigo-300">{client.interfaceType}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Signal (RSSI):</span>
                  <span className={`${client.rssiSignalDbm > -60 ? 'text-emerald-400' : client.rssiSignalDbm > -75 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {client.rssiSignalDbm} dBm ({client.signalQuality})
                  </span>
                </div>
              </div>

              {/* Bandwidth Usage & Speed Meter */}
              <div className="flex items-center justify-between text-xs font-mono mb-3 px-1">
                <div className="text-emerald-400 flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>{client.downloadSpeedKbps > 1000 ? `${(client.downloadSpeedKbps / 1024).toFixed(1)} MB/s` : `${client.downloadSpeedKbps} KB/s`}</span>
                </div>
                <div className="text-indigo-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{client.uploadSpeedKbps > 1000 ? `${(client.uploadSpeedKbps / 1024).toFixed(1)} MB/s` : `${client.uploadSpeedKbps} KB/s`}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  QoS: <span className="text-cyan-400 font-bold">{client.qosPriority}</span>
                </div>
              </div>

              {/* Dynamic Speed Throttling Buttons */}
              <div className="mb-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                  <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-cyan-400" /> Speed Limit:</span>
                  <span className="text-cyan-300 font-semibold">{client.speedLimitMbps ? `${client.speedLimitMbps} Mbps` : 'Unlimited'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[2, 5, 10, 20].map(mbps => (
                    <button
                      key={mbps}
                      onClick={() => handleSetSpeedLimit(client, mbps)}
                      className={`flex-1 py-1 rounded text-[10px] font-mono font-medium transition-colors ${
                        client.speedLimitMbps === mbps 
                          ? 'bg-cyan-500 text-slate-950 font-bold' 
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {mbps}M
                    </button>
                  ))}
                  <button
                    onClick={() => handleSetSpeedLimit(client, null)}
                    className={`flex-1 py-1 rounded text-[10px] font-mono font-medium transition-colors ${
                      client.speedLimitMbps === null 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' 
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Action Buttons: Block / Unblock */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleBlockToggle(client)}
                  className={`w-full py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    client.isBlocked 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30' 
                      : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 shadow-lg shadow-rose-950/20'
                  }`}
                >
                  {client.isBlocked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>UNBLOCK & RESTORE</span>
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>BLOCK IP / MAC</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No devices matched the selected filter criteria.
          </div>
        )}
      </div>

      {/* Real-time Threat Sweeps & Network Security Event Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>REAL-TIME THREAT SWEEPS & AUDIT STREAM</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">{events.length} Events Logged</span>
        </div>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 font-mono text-xs">
          {events.map(ev => (
            <div 
              key={ev.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                ev.severity === 'CRITICAL' 
                  ? 'bg-rose-950/30 border-rose-900/60 text-rose-200' 
                  : ev.severity === 'WARNING'
                  ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    ev.severity === 'CRITICAL' ? 'bg-rose-900 text-rose-200' : 'bg-amber-900 text-amber-200'
                  }`}>
                    {ev.eventType}
                  </span>
                  <span className="text-slate-400 text-[11px]">{ev.timestamp}</span>
                </div>
                <p className="text-xs">{ev.detailsBn}</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800/60">
                  {ev.automatedActionTaken}
                </span>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs">
              No recent security sweep events. Network is operating under nominal parameters.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
