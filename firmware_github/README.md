# ⚡ EDGE-AI MASTER HUB: Home Assistant Firmware & Repository
### Self-Evolving Hybrid Edge-AI Brain, Multi-Drive NVMe/SSD Storage & Zstandard Compression, Pure NumPy Offline Inference & Bengali Voice Studio

[![Home Assistant Add-on](https://img.shields.io/badge/Home%20Assistant-Add--on-blue.svg)](https://github.com/kayatmd5/firmware-github)
[![Pure NumPy Inference](https://img.shields.io/badge/Inference-Sub--15ms%20NumPy-brightgreen.svg)]()
[![Zstandard Compression](https://img.shields.io/badge/Zstandard-87.2%25%20Saved-purple.svg)]()
[![Gemini Cloud Teacher](https://img.shields.io/badge/Cloud%20Teacher-Gemini%203.7%20Flash-orange.svg)]()
[![Bengali Voice](https://img.shields.io/badge/Voice%20Engine-3--Tier%20Natural%20Bengali-cyan.svg)]()

---

## 📖 বাংলায় পরিচিতি ও সারসংক্ষেপ (Overview in Bengali)
**EDGE-AI MASTER HUB** হলো হোম অ্যাসিস্ট্যান্ট (Home Assistant OS / Supervised / Container)-এর জন্য তৈরি একটি সম্পূর্ণ অফলাইন-রেডি, সেলফ-ইভলভিং এআই আর্কিটেকচার। এটি ক্লাউড টিচার (Gemini 3.7 Flash) এর মাধ্যমে পারিবারিক কথোপকথন ও অভ্যাস শিখে নেয় এবং লোকাল হোম সার্ভারে থাকা **Pure NumPy Self-Attention Transformer** দিয়ে ইন্টারনেট ছাড়াই মাত্র ১১-১৫ মিলিসেকেন্ড গতিতে সম্পূর্ণ ঘরের কাজ, অটোমেশন এবং ভয়েস রেসপন্স পরিচালনা করে।

---

## 🏛️ সম্পূর্ণ সিস্টেম আর্কিটেকচার (Architecture Tree)

```
firmware_github/
├── README.md                               # সম্পূর্ণ ডকুমেন্টেশন ও ইন্সটলেশন গাইড
├── repository.yaml                         # Home Assistant Add-on রিপোজিটরি ডিক্লারেশন
├── config.yaml                             # Add-on কনফিগারেশন ও হার্ডওয়্যার পারমিশন
├── Dockerfile                              # Alpine Linux + Python 3.11 + Node + C++ Zstd বিল্ড
├── requirements.txt                        # কোর পাইথন লাইব্রেরি ডিপেনডেন্সি
├── entrypoint.sh                           # অটো-ইন্সটলার ও কাস্টম কম্পোনেন্ট সিঙ্ক স্ক্রিপ্ট
│
├── custom_components/                      # 🔌 হোম অ্যাসিস্ট্যান্ট কাস্টম ইন্টিগ্রেশন
│   └── edge_ai_master/
│       ├── __init__.py                     # ইন্টিগ্রেশন লাইফসাইকেল ও সার্ভিস হ্যান্ডলার
│       ├── manifest.json                   # HA Integration মেটাডাটা ও ডিপেনডেন্সি
│       ├── config_flow.py                  # UI সেটআপ উইজার্ড (UI Config Flow)
│       ├── const.py                        # গ্লোবাল কনস্ট্যান্ট ও ডিফল্ট পাথ
│       ├── sensor.py                       # স্পিড, মেমোরি, ড্রাইভ ও এপিআই সেন্সর
│       ├── switch.py                       # কিল সুইচ, টাচ ভয়েস ও অটো-ফেইলওভার সুইচ
│       ├── services.yaml                   # এক্সপোজড HA সার্ভিস ডিক্লারেশন
│       └── storage_controller.py           # মাল্টি-ড্রাইভ হার্ডওয়্যার ও কম্প্রেশন কন্ট্রোলার
│
├── lovelace_card/                          # 📱 ড্যাশবোর্ড কার্ড
│   ├── edge-ai-master-card.js              # স্ট্যান্ডঅ্যালোন লাভলেস কাস্টম কার্ড
│   └── lovelace-config.yaml                # কার্ড কনফিগারেশন উদাহরণ
│
├── core_python/                            # 🧠 ব্যাকএন্ড কোর ইঞ্জিন
│   ├── pure_numpy_transformer.py           # পিওর নাম্পাই সেলফ-অ্যাটেনশন ইঞ্জিন (অফলাইন)
│   ├── gemini_cloud_teacher.py             # জেমিনি ৩.৭ ফ্ল্যাশ ক্লাউড টিচার
│   ├── zstd_storage_streamer.py            # ডিরেক্ট-র‍্যাম Zstandard মেমোরি স্ট্রিমার
│   ├── universal_intent_engine.py          # বাংলা ন্যাচারাল ল্যাঙ্গুয়েজ ইনটেন্ট পার্সার
│   ├── multi_bluetooth_audio_core.py       # মাল্টি-রুম ব্লুটুথ স্পিকার ও ৩-টায়ার ভয়েস
│   ├── multi_key_gemini_pool.py            # অটো-ফেইলওভার মাল্টি-এপিআই কী পুল
│   └── network_sentinel_core.py            # ফল ডিটেকশন ও সেন্সর ডিসকভারি
│
└── automation_blueprints/                  # 📑 অটোমেশন ব্লুপ্রিন্ট
    ├── bengali_voice_assistant_blueprint.yaml  # ভয়েস অ্যাসিস্ট্যান্ট অটোমেশন
    ├── elderly_care_fall_detection_blueprint.yaml # বয়োজ্যেষ্ঠ ফল ডিটেকশন গার্ডিয়ান
    └── storage_failover_alert_blueprint.yaml   # স্টোরেজ ফেইলওভার নোটিফায়ার
```

---

## 🚀 কীভাবে হোম অ্যাসিস্ট্যান্টে ইনস্টল করবেন (Step-by-Step Installation)

### পদ্ধতি ১: Home Assistant Add-on স্টোর থেকে (সবচেয়ে সহজ)
1. আপনার হোম অ্যাসিস্ট্যান্টের **Settings -> Add-ons -> Add-on Store**-এ যান।
2. উপরে ডানদিকের তিনটি ডটে ক্লিক করে **Repositories** সিলেক্ট করুন।
3. আপনার গিটহাব রিপোজিটরির লিঙ্ক যুক্ত করুন: `https://github.com/kayatmd5/firmware-github`
4. **Edge-AI Master Brain & Storage Controller** অ্যাড-অনটি দেখতে পাবেন। **Install**-এ ক্লিক করুন।
5. **Start** চাপুন এবং **Show in sidebar** অন করুন।

### পদ্ধতি ২: Custom Component হিসেবে ম্যানুয়াল ইন্সটল
1. `firmware_github/custom_components/edge_ai_master/` ফোল্ডারটি আপনার হোম অ্যাসিস্ট্যান্টের `/config/custom_components/` ডিরেক্টরিতে কপি করুন।
2. হোম অ্যাসিস্ট্যান্ট রিস্টার্ট দিন।
3. **Settings -> Devices & Services -> Add Integration**-এ গিয়ে **Edge-AI Master Brain** সার্চ করে যুক্ত করুন।

### পদ্ধতি ৩: Lovelace Card যোগ করা
1. `firmware_github/lovelace_card/edge-ai-master-card.js` ফাইলটি `/config/www/` ফোল্ডারে রাখুন।
2. **Settings -> Dashboards -> Resources**-এ গিয়ে URL দিন: `/local/edge-ai-master-card.js` (JavaScript Module)।
3. যেকোনো ড্যাশবোর্ডে গিয়ে `custom:edge-ai-master-card` যুক্ত করুন।

---

## 🎯 প্রধান ৫টি প্রযুক্তিগত বৈশিষ্ট্য (Core Innovations)

| ফিচার | বিবরণ | প্রযুক্তি |
|---|---|---|
| **১. ক্লাউড টিচার** | মানুষের জটিল ভাষা ও আচরণ বিশ্লেষণ | Gemini 3.7 Flash & 3.1 Flash-Lite |
| **২. অফলাইন ইনফারেন্স** | ইন্টারনেট ছাড়া সাব-১৫ms লেটেন্সিতে কাজ | Pure NumPy Self-Attention |
| **৩. হাই-ডেনসিটি কম্প্রেশন** | ৮৭%+ স্পেস সেভিংস ও ডিরেক্ট-র‍্যাম স্ট্রিমিং | Zstandard (`.zst`) & MessagePack |
| **৪. মাল্টি-ড্রাইভ কন্ট্রোলার** | NVMe, SATA SSD পর্যবেক্ষণ ও জিরো-লস ফলব্যাক | Python psutil, SMART Telemetry |
| **৫. স্পর্শ ভয়েস গাইড** | যেকোনো বাটনে চাপ দিলে বাংলায় মুখে বিবরণ দেওয়া | Web Speech API + 3-Tier Offline TTS |

---

## 🛡️ লাইসেন্স ও মেইনটেইনার
- **মেইনটেইনার:** Edge-AI Autonomous Engineering Team (`kayatmd5@gmail.com`)
- **লাইসেন্স:** Apache 2.0 Open-Source License.
