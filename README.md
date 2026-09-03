# Auto-Evolving Edge-AI Master Hub

![Version](https://img.shields.io/badge/version-3.14.0-blue.svg)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Add--on-orange.svg)
![Ingress](https://img.shields.io/badge/Ingress-Supported-green.svg)
![Permissions](https://img.shields.io/badge/Permissions-Admin%20%7C%20Full%20Access-red.svg)

Autonomous, self-evolving, multi-modal Edge-AI Master Controller for Home Assistant OS with Ingress, Gemini Cloud Teacher multi-key failover pool, Native Bengali & English Voice Engine, Multi-Room Spatial Audio routing, and 21 interactive subsystems.

---

## 🚀 Features

- **Full Supervisor API Integration**: Native auto-discovery of Home Assistant entities, services, and core state using `SUPERVISOR_TOKEN`.
- **Full Admin Privileges**: Configured with `hassio_role: "admin"`, `full_access: true`, full Linux capabilities (`SYS_ADMIN`, `NET_ADMIN`, `SYS_RAWIO`), and host network integration.
- **Ingress Support**: Secure single-click access directly from your Home Assistant sidebar without port forwarding.
- **Bengali & English Voice Intelligence**: Real-time conversational AI voice assistant with on-device formant synthesis and Cloud Gemini fallback.
- **Multi-Key Gemini Failover Pool**: Resilient, latency-aware API key rotation preventing quota lockouts.
- **Zero-Loss Data Persistence**: Persistent model weights, training vectors, rules, and configuration stored in `/data/`.

---

## 📦 Installation & Setup

1. In your Home Assistant dashboard, navigate to **Settings** → **Add-ons** → **Add-on Store**.
2. Click the three dots (top right) → **Repositories**.
3. Add this repository URL:
   ```
   https://github.com/kayatmd5/edge-ai-master-hub
   ```
4. Click **Add** and then **Close**.
5. Refresh the Add-on Store or search for **Auto-Evolving Edge-AI Master Hub**.
6. Click **Install**.
7. In the Configuration tab, optionally configure your Gemini API Key or voice settings.
8. Start the add-on and enable **Show in sidebar**.

---

## 🔒 Permissions & Security

- **Hass.io Role**: `admin`
- **Home Assistant API**: `true`
- **Hass.io API**: `true`
- **Privileged**: `["ALL"]`
- **Full Access**: `true`
- **Host Network**: `true`
- **Shared Volumes**: `share:rw`, `media:rw`, `config:rw`, `ssl:rw`, `addon_config:rw`
