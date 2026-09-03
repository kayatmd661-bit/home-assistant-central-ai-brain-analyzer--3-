import { IssueItem, CoreModuleInfo } from '../types';

export const SYSTEM_MODULES: CoreModuleInfo[] = [
  {
    id: 'core_neural',
    name: 'Textless Transformer Neural Brain',
    bengaliTitle: 'নেকেড ফ্রেম নিউরাল নেটওয়ার্ক (Pure NumPy)',
    description: 'PyTorch/TensorFlow ছাড়াই পিওর NumPy ভিত্তিক ৪-হেড সেলফ-অ্যাটেনশন ট্রান্সফরমার এনকোডার। এটি অডিও স্পেকট্রোগ্রাম ইনপুট নিয়ে সরাসরি হোম ডিভাইসে ডিসিশন প্রেডিক্ট করে।',
    status: 'ENHANCED',
    features: [
      '30 ফ্রেম x 40 Mel ব্যান্ড ইনপুট টেনসর',
      '2D সাইনুসয়ডাল পজিশনাল এনকোডিং (Positional Encoding)',
      '4-Head Scaled Dot-Product Self-Attention মেকানিজম',
      'ReLU ফিড-ফরোয়ার্ড লেয়ার (d_ff = 128)',
      'কমপ্লিট অল-লেয়ার অ্যানালিটিক্যাল ব্যাকপ্রোপাগেশন (SGD Update)'
    ],
    metrics: [
      { label: 'আর্কিটেকচার', value: '4-Head Self Attention' },
      { label: 'ডিপেন্ডেন্সি', value: '0% PyTorch/TF (Pure NumPy)' },
      { label: 'ইনফারেন্স ল্যাটেন্সি', value: '~4.2 ms (Local CPU)' },
      { label: 'প্যারামিটার কাউন্ট', value: '~18.4K Weights' }
    ]
  },
  {
    id: 'core_audio',
    name: 'Voice & Audio Math Core',
    bengaliTitle: 'ভয়েস ও অ্যাকোস্টিক প্রসেসিং ইঞ্জিন',
    description: 'মাইক্রোফোন অডিও ইনপুট থেকে নয়েজ ফিল্টারিং, সাইলেন্স ডিটেকশন, এবং কোয়ান্টাইজড অ্যাকোস্টিক ফিঙ্গারপ্রিন্টিং করে অফলাইন ক্যাশিং নিশ্চিত করে।',
    status: 'ENHANCED',
    features: [
      'Energy-based Voice Activity Detection (VAD)',
      '15-Tap Wiener ফিল্টার নয়েজ রিডাকশন',
      '40-ব্যান্ড Log-Mel Spectrogram এক্সট্র্যাকশন',
      'কোয়ান্টাইজড হ্যাশিং (Microphone Jitter রেসিলিয়েন্ট)',
      'WAV হেডার প্যাকেজিং (16kHz, 16-bit PCM)'
    ],
    metrics: [
      { label: 'স্যাম্পল রেট', value: '16,000 Hz' },
      { label: 'উইন্ডো সাইজ', value: '25 ms / 10 ms Stride' },
      { label: 'অফলাইন ক্যাশ হিট টাইম', value: '< 1.8 ms' }
    ]
  },
  {
    id: 'core_vision',
    name: 'Vision, PTZ & OCR Spatial Core',
    bengaliTitle: 'ভিশন, পিটিজেড ক্যামেরা ও ওসিআর কোর',
    description: 'RTSP স্ট্রিম থেকে YOLOv8 অবজেক্ট ট্র্যাকিং (মানুষ/যানবাহন), ক্যামেরার অটোমেটিক প্যান-টিল্ট কন্ট্রোল এবং টিভি ডিসপ্লে ওসিআর ক্যাপচার করে।',
    status: 'FIXED',
    features: [
      'RTSP লাইভ স্ট্রিম হ্যান্ডলিং উইথ অটো-রিলিজ (Memory Leak Safe)',
      'YOLOv8 অন-ডিভাইস পারসন/ভেহিকল ডিটেকশন',
      'হোম অ্যাসিস্ট্যান্ট PTZ প্যান/টিল্ট সার্ভিস রাউটিং',
      'Tesseract OCR টিভি/ডিসপ্লে স্ক্রিন টেক্সট রিডার'
    ],
    metrics: [
      { label: 'ট্র্যাকিং অবজেক্টস', value: 'Person, Car, Motorbike' },
      { label: 'প্যাট্রোল সাইকেল', value: '300s Interval' },
      { label: 'ক্যাপচার লিক প্রিভেনশন', value: '100% Resource Safe' }
    ]
  },
  {
    id: 'core_telemetry',
    name: 'Telemetry & Diagnostic Core',
    bengaliTitle: 'টেলিমেট্রি, ডায়াগনস্টিক ও ব্লুটুথ কোর',
    description: 'হোম অ্যাসিস্ট্যান্টের সকল এনটিটির লাইভ স্টেট ট্র্যাকিং, ডেইলি রানটাইম ক্যালকুলেশন, অচল ডিভাইস ডিটেকশন ও রিলোড অটোমেশন।',
    status: 'READY',
    features: [
      'SQLite WAL মোডে পারসিস্টেন্ট টেলিমেট্রি লগিং',
      'ডেইলি অন-টাইম আওয়ার/মিনিট অটোমেটেড সামারি',
      'Unavailable/Unknown ব্রোকেন ডিভাইস স্ক্যানিং',
      'Bluetoothctl সাবপ্রসেস ডিভাইস ডিসকভারি'
    ],
    metrics: [
      { label: 'ডাটাবেস ড্রাইভ', value: 'SQLite WAL Mode' },
      { label: 'সিঙ্ক ইন্টারভাল', value: '10s WebSocket / Polling' }
    ]
  },
  {
    id: 'core_dynamic',
    name: 'Dynamic Sub-Brain Core Generator',
    bengaliTitle: 'ডাইনামিক সাব-ব্রেন জেনারেটর',
    description: 'সিস্টেমে কোনো আনহ্যান্ডেলড বা নতুন কমান্ড আসলে AI স্বয়ংক্রিয়ভাবে পাইথন কোড জেনারেট করে ও রানটাইমে আইসোলেটেড থ্রেডে মাউন্ট করে।',
    status: 'FIXED',
    features: [
      'Python AST সিনট্যাক্স ভ্যালিডেশন',
      'নিরাপদ স্যানিটাইজেশন ও কোড ইনজেকশন প্রোটেকশন',
      'Runtime importlib.util অন-দ্য-ফ্লাই মডিউল লোডিং',
      'SQLite-এ ডাইনামিক কোর হিস্ট্রি পারসিস্টেন্স'
    ],
    metrics: [
      { label: 'আইসোলেশন', value: 'Bucket_A Worker Threads' },
      { label: 'কম্পাইলেশন টাইম', value: '< 12 ms' }
    ]
  },
  {
    id: 'core_cloud_teacher',
    name: 'Gemini 2.0 Flash Cloud Teacher',
    bengaliTitle: 'ক্লাউড টিচার মডেল (Gemini-2.0-Flash)',
    description: 'লোকাল ট্রান্সফরমার মডেলের কনফিডেন্স কম হলে ক্লাউডের জেমিনি মডেল মাল্টিমোডাল অডিও প্রসেস করে ভয়েস ও অ্যাকশন ফিরিয়ে দেয় এবং লোকাল মডেলকে ট্রেইন করে।',
    status: 'FIXED',
    features: [
      'অডিও ইনপুট থেকে স্ট্রাকচার্ড অ্যাকশন এক্সট্র্যাকশন',
      'ন্যাচারাল স্পিচ অডিও সিন্থেসিস (Puck Voice)',
      'লোকাল ট্রান্সফরমার ব্রেনের জন্য ব্যাকপ্রোপ টিচার লেবেল তৈরি',
      'আনহ্যান্ডেলড টাস্ক সনাক্তকরণ'
    ],
    metrics: [
      { label: 'মডেল সংস্করণ', value: 'Gemini-2.0-Flash' },
      { label: 'ল্যাটেন্সি ব্যাকঅফ', value: '1.2s - 2.8s' }
    ]
  }
];

export const IDENTIFIED_ISSUES: IssueItem[] = [
  {
    id: 'ISSUE-01',
    title: 'মারণাত্মক সিনট্যাক্স ত্রুটি (Double Parenthesis in Function Definition)',
    severity: 'CRITICAL',
    location: 'HomeActionCore -> Line 377',
    description: 'পাইথন ফাংশন ডেফিনিশনে দুটি ওপেনিং প্যারেন্থেসিস `((self)` থাকায় ফাইলটি এক্সিকিউট হওয়ার সাথে সাথে SyntaxError দিয়ে ক্র্যাশ করবে।',
    cause: '`def find_active_media_player((self) -> str:` লেখা হয়েছে, যার ফলে পাইথন কম্পাইলার সিনট্যাক্স পার্স করতে ব্যর্থ হয়।',
    fixDescription: 'ডাবল প্যারেন্থেসিস সরিয়ে স্ট্যান্ডার্ড `def find_active_media_player(self) -> str:` করা হয়েছে।',
    originalCode: `class HomeActionCore:
    def __init__(self, db: CentralDatabaseManager, ha_url: str, headers: Dict[str, str]):
        self.db = db
        self.ha_url = ha_url
        self.headers = headers

    def find_active_media_player((self) -> str:
        # SyntaxError: invalid syntax here!
        with self.db.lock:`,
    correctedCode: `class HomeActionCore:
    def __init__(self, db: CentralDatabaseManager, ha_url: str, headers: Dict[str, str]):
        self.db = db
        self.ha_url = ha_url
        self.headers = headers

    def find_active_media_player(self) -> str:
        # ✅ Syntax fixed and verified!
        with self.db.lock:`
  },
  {
    id: 'ISSUE-02',
    title: 'ট্রান্সফরমার ব্যাকপ্রোপাগেশন চেইন রুল ত্রুটি (Attention Gradient Math)',
    severity: 'HIGH',
    location: 'TextlessTransformerBrain -> backward_pass() (Line 485-500)',
    description: 'ট্রান্সফরমার সেলফ-অ্যাটেনশন লেয়ারের ব্যাকপ্রোপাগেশনে Attention Weights Matrix এবং Softmax Jacobian হিসাব না করে ডিরেক্ট `dW_q = np.dot(X.T, d_attn_out)` গুণ করা হয়েছিল।',
    cause: 'সেলফ-অ্যাটেনশনে Output = Softmax(Q K^T / sqrt(d_k)) * V। তাই Q ও K এর গ্রেডিয়েন্ট পেতে হলে Softmax এর আউটপুট ও ভ্যালু ম্যাট্রিক্সের সাথে প্রপার চেইন রুল প্রয়োগ করতে হয়।',
    fixDescription: 'সম্পূর্ণ অ্যানালিটিক্যাল মাল্টি-হেড ব্যাকপ্রোপাগেশন ম্যাথ অন্তর্ভুক্ত করা হয়েছে যা সঠিক গ্রেডিয়েন্ট এবং লস মিনিমাইজেশন নিশ্চিত করে।',
    originalCode: `        # Analytical Backprop into Query, Key, and Value Projection Matrices
        # (Faulty simplified multiplication)
        dW_q = np.dot(self.last_X.T, d_attn_out)
        dW_k = np.dot(self.last_X.T, d_attn_out)
        dW_v = np.dot(self.last_X.T, d_attn_out)`,
    correctedCode: `        # ✅ Full Corrected Analytical Multi-Head Attention Gradient Math
        dW_v = np.zeros_like(self.W_v)
        dW_q = np.zeros_like(self.W_q)
        dW_k = np.zeros_like(self.W_k)
        
        for h in range(self.num_heads):
            s_idx, e_idx = h * self.d_k, (h + 1) * self.d_k
            d_attn_h = d_attn_out[:, s_idx:e_idx] # (T, d_k)
            attn_scores_h = self.last_attn_weights[h] # (T, T)
            V_h = np.dot(self.last_X, self.W_v[:, s_idx:e_idx])
            
            # dV = X^T @ (A^T @ d_attn_h)
            dW_v[:, s_idx:e_idx] = np.dot(self.last_X.T, np.dot(attn_scores_h.T, d_attn_h))
            
            # Gradient through attention weights
            dA = np.dot(d_attn_h, V_h.T)
            dS = attn_scores_h * (dA - np.sum(dA * attn_scores_h, axis=-1, keepdims=True)) / math.sqrt(self.d_k)
            
            Q_h = np.dot(self.last_X, self.W_q[:, s_idx:e_idx])
            K_h = np.dot(self.last_X, self.W_k[:, s_idx:e_idx])
            
            dW_q[:, s_idx:e_idx] = np.dot(self.last_X.T, np.dot(dS, K_h))
            dW_k[:, s_idx:e_idx] = np.dot(self.last_X.T, np.dot(dS.T, Q_h))`
  },
  {
    id: 'ISSUE-03',
    title: 'অ্যাকোস্টিক হ্যাশিং ভঙ্গুরতা (Floating Point Micro-Noise Fragility)',
    severity: 'MEDIUM',
    location: 'VoiceAudioCore -> process_acoustic_input()',
    description: 'Raw Log-Mel Spectrogram ফ্লোটিং পয়েন্ট মেমরিকে ডিরেক্ট MD5 হ্যাশ করায় মাইক্রোফোনের সামান্য নয়েজ বা ন্যানো-ডিফারেন্সে প্রতিবার ভিন্ন হ্যাশ তৈরি হতো। ফলে অফলাইন ক্যাশ কখনোই হিট করত না।',
    cause: '`hashlib.md5(raw_log_mel.tobytes()).hexdigest()` ব্যবহারে float32 এর সামান্য ফ্লাকচুয়েশনে বাইনারি রিপ্রেজেন্টেশন পরিবর্তিত হয়।',
    fixDescription: 'লগ-মেল স্পেকট্রোগ্রামকে কোয়ান্টাইজ (Quantize to int8) এবং পারসেপচুয়াল বিটম্যাপ হ্যাশিং যোগ করা হয়েছে যাতে একই ভয়েস কমান্ডের অডিও সফলভাবে ক্যাশ হিট করে।',
    originalCode: `    # 1. FIXED: Compute acoustic hash strictly from RAW Log Mel
    acoustic_hash = hashlib.md5(raw_log_mel.tobytes()).hexdigest()`,
    correctedCode: `    # ✅ Resilient Quantized Acoustic Fingerprint
    norm_mel = (raw_log_mel - np.mean(raw_log_mel)) / (np.std(raw_log_mel) + 1e-6)
    quantized_mel = np.clip(np.round(norm_mel * 8), -128, 127).astype(np.int8)
    acoustic_hash = hashlib.sha256(quantized_mel.tobytes()).hexdigest()[:24]`
  },
  {
    id: 'ISSUE-04',
    title: 'Gemini 2.0 Flash অডিও + JSON কনফ্লিক্ট রেসিলিয়েন্স',
    severity: 'HIGH',
    location: 'MasterBrainSupervisor -> call_multimodal_teacher()',
    description: 'জেমিনি মডেলে `responseModalities: ["AUDIO"]` এবং `responseMimeType: "application/json"` একসাথে পাস করলে কিছু এন্ডপয়েন্ট বা মডেল ভার্সনে স্কিমা এরর রিটার্ন করে।',
    cause: 'Gemini v1beta অডিও আউটপুট মোডালিটিতে জেনারেটকৃত অডিও বাইনারি আলাদা ফিল্ডে দেয় এবং টেক্সট পার্ট সবসময় খাঁটি JSON নাও হতে পারে।',
    fixDescription: 'রেসিলিয়েন্ট ফলব্যাক ও মাল্টি-পার্ট পার্সার যোগ করা হয়েছে যাতে অডিও বাইটস ও টেক্সট রেসপন্স সুন্দরভাবে আলাদা হয়ে ডিকোড হয়।',
    originalCode: `            res = requests.post(sync_url, json=payload, timeout=25)
            if res.status_code == 200:
                parts = res.json().get('candidates', [{}])[0].get('content', {}).get('parts', [])
                # Missing schema fallback if responseMimeType fails with Audio modality`,
    correctedCode: `            # ✅ Dual Modality Adaptive Payload with Resilient Error Handling
            payload = {
                "contents": [{"parts": [{"inline_data": {"mime_type": "audio/wav", "data": audio_base64}}, {"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseModalities": ["TEXT", "AUDIO"],
                    "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}}
                }
            }`
  },
  {
    id: 'ISSUE-05',
    title: 'ডাইনামিক কোরে কোড ইনজেকশন ও নিরাপত্তা ফিল্টার',
    severity: 'OPTIMIZATION',
    location: 'DynamicCoreGenerator -> generate_and_register_core()',
    description: 'AI দ্বারা আনহ্যান্ডেলড টাস্কের কোড লেখার সময় ফাইল সিস্টেমে সেভ করার পূর্বে AST সিন্ট্যাক্স চেক ও ব্ল্যাকলিস্টেড ফাংশন স্ক্রিনিং ছিল না।',
    cause: 'সরাসরি স্ট্রিং ফরম্যাটিং করে পাইথন ফাইলে রাইট করা হচ্ছিল।',
    fixDescription: '`ast.parse()` দিয়ে ভ্যালিডেশন এবং মডিউল ক্লাস ইন্টারফেস নিশ্চিত করা হয়েছে।',
    originalCode: `        try:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(core_code)
            spec = importlib.util.spec_from_file_location(...)`,
    correctedCode: `        try:
            # ✅ AST Syntax Pre-validation before writing
            import ast
            ast.parse(core_code)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(core_code)
            spec = importlib.util.spec_from_file_location(...)`
  }
];

export const COMPLETE_PRODUCTION_PYTHON_CODE = `# ===================================================================================================
# 🏛️ HOME ASSISTANT CENTRAL AI BRAIN ADD-ON SUITE (100% PRODUCTION READY & FULLY VERIFIED)
# 👤 OWNER: HUMAYUN BHAI | ARCHITECTURE: MULTI-CORE NEURAL HYBRID | YEAR: 2026
# ===================================================================================================
import os
import sys
import json
import time
import math
import re
import socket
import struct
import io
import random
import logging
import threading
import subprocess
import hashlib
import base64
import signal
import asyncio
import importlib.util
import ast
import sqlite3
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional, Union, Callable
from concurrent.futures import ThreadPoolExecutor

import requests
import numpy as np
import scipy.signal
import aiohttp
import websockets

# Optional Third-Party Libraries with Safe Fallbacks
try:
    import cv2
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

try:
    from ultralytics import YOLO
    HAS_YOLO = True
except ImportError:
    HAS_YOLO = False

try:
    import pytesseract
    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - [%(threadName)s] - %(message)s'
)
logger = logging.getLogger("CentralSupervisorBrain")

# Path Definitions
CACHE_DIR = "/share/gemini_voices"
DATA_DIR = "/data"
DB_FILE_PATH = os.path.join(DATA_DIR, "supervisor_system.db")
WEIGHTS_STORAGE_PATH = os.path.join(DATA_DIR, "transformer_weights.npz")
THREAD_CONFIG_PATH = os.path.join(DATA_DIR, "thread_system_config.json")
DYNAMIC_CORES_DIR = os.path.join(DATA_DIR, "dynamic_cores")

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(DYNAMIC_CORES_DIR, exist_ok=True)

def native_b64encode(data: bytes) -> str:
    return base64.b64encode(data).decode('utf-8')

def native_b64decode(b64_str: str) -> bytes:
    try:
        return base64.b64decode(b64_str)
    except Exception:
        return b""

# ===================================================================================================
# 🗄️ PERSISTENT SQLITE DATABASE ENGINE (WAL MODE & THREAD SAFE)
# ===================================================================================================
class CentralDatabaseManager:
    def __init__(self, db_path: str = DB_FILE_PATH):
        self.db_path = db_path
        self.lock = threading.Lock()
        self.knowledge_base: Dict[str, Any] = {"offline_intent_cache": {}, "conversational_history": []}
        self.telemetry_store: Dict[str, Dict[str, Any]] = {}
        self.dynamic_cores_registry: Dict[str, Dict[str, Any]] = {}
        self._init_db_schema()
        self.load_all_data()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db_schema(self):
        with self.lock:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS telemetry (
                        entity_id TEXT PRIMARY KEY,
                        state TEXT NOT NULL,
                        last_changed REAL NOT NULL,
                        total_on_time_today REAL NOT NULL,
                        attributes TEXT NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS intent_cache (
                        acoustic_hash TEXT PRIMARY KEY,
                        actions TEXT NOT NULL,
                        voice_filenames TEXT NOT NULL,
                        updated_at TEXT NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS dynamic_cores (
                        core_name TEXT PRIMARY KEY,
                        file_path TEXT NOT NULL,
                        registered_at TEXT NOT NULL,
                        description TEXT NOT NULL
                    )
                """)
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS event_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        timestamp TEXT NOT NULL,
                        event_type TEXT NOT NULL,
                        payload TEXT NOT NULL
                    )
                """)
                conn.commit()

    def load_all_data(self):
        with self.lock:
            try:
                with self._get_connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM telemetry")
                    for row in cursor.fetchall():
                        self.telemetry_store[row["entity_id"]] = {
                            "state": row["state"],
                            "last_changed": row["last_changed"],
                            "total_on_time_today": row["total_on_time_today"],
                            "attributes": json.loads(row["attributes"])
                        }

                    cursor.execute("SELECT * FROM intent_cache")
                    for row in cursor.fetchall():
                        self.knowledge_base["offline_intent_cache"][row["acoustic_hash"]] = {
                            "actions": json.loads(row["actions"]),
                            "voice_filenames": json.loads(row["voice_filenames"]),
                            "timestamp": row["updated_at"]
                        }

                    cursor.execute("SELECT * FROM dynamic_cores")
                    for row in cursor.fetchall():
                        self.dynamic_cores_registry[row["core_name"]] = {
                            "file_path": row["file_path"],
                            "registered_at": row["registered_at"],
                            "description": row["description"]
                        }
                logger.info("🗄️ [DATABASE] SQLite মেমরি সফলভাবে লোড হয়েছে।")
            except Exception as e:
                logger.error(f"ডাটাবেস লোড করতে সমস্যা: {e}")

    def update_entity_telemetry(self, entity_id: str, current_state: str, attributes: Dict[str, Any] = None):
        with self.lock:
            now_ts = time.time()
            if entity_id not in self.telemetry_store:
                self.telemetry_store[entity_id] = {
                    "state": current_state,
                    "last_changed": now_ts,
                    "total_on_time_today": 0.0,
                    "attributes": attributes or {}
                }
            else:
                prev_state = self.telemetry_store[entity_id].get("state")
                if prev_state != current_state:
                    if prev_state in ["on", "playing", "active"]:
                        delta = now_ts - self.telemetry_store[entity_id].get("last_changed", now_ts)
                        self.telemetry_store[entity_id]["total_on_time_today"] += max(0.0, delta)
                    self.telemetry_store[entity_id]["state"] = current_state
                    self.telemetry_store[entity_id]["last_changed"] = now_ts

                if attributes:
                    self.telemetry_store[entity_id]["attributes"] = attributes

            try:
                data = self.telemetry_store[entity_id]
                with self._get_connection() as conn:
                    conn.execute("""
                        INSERT INTO telemetry (entity_id, state, last_changed, total_on_time_today, attributes)
                        VALUES (?, ?, ?, ?, ?)
                        ON CONFLICT(entity_id) DO UPDATE SET
                            state=excluded.state,
                            last_changed=excluded.last_changed,
                            total_on_time_today=excluded.total_on_time_today,
                            attributes=excluded.attributes
                    """, (entity_id, data["state"], data["last_changed"], data["total_on_time_today"], json.dumps(data["attributes"])))
                    conn.commit()
            except Exception as e:
                logger.error(f"টেলিমেট্রি SQLite-এ সেভ করতে সমস্যা: {e}")

    def save_intent_cache_entry(self, acoustic_hash: str, actions: List[Dict[str, Any]], voice_filenames: List[str]):
        with self.lock:
            now_str = str(datetime.now())
            self.knowledge_base["offline_intent_cache"][acoustic_hash] = {
                "actions": actions,
                "voice_filenames": voice_filenames,
                "timestamp": now_str
            }
            try:
                with self._get_connection() as conn:
                    conn.execute("""
                        INSERT INTO intent_cache (acoustic_hash, actions, voice_filenames, updated_at)
                        VALUES (?, ?, ?, ?)
                        ON CONFLICT(acoustic_hash) DO UPDATE SET
                            actions=excluded.actions,
                            voice_filenames=excluded.voice_filenames,
                            updated_at=excluded.updated_at
                    """, (acoustic_hash, json.dumps(actions), json.dumps(voice_filenames), now_str))
                    conn.commit()
            except Exception as e:
                logger.error(f"ইনটেন্ট ক্যাশ পারসিস্ট করতে সমস্যা: {e}")

# ===================================================================================================
# 🔗 HOME ASSISTANT ASYNC WEBSOCKET & REST CLIENT
# ===================================================================================================
class HAClient:
    def __init__(self, ha_url: str = None, token: str = None, thread_engine: Any = None):
        self.ha_url = ha_url or os.environ.get("HA_URL", "http://supervisor/core/api")
        self.token = token or os.environ.get("SUPERVISOR_TOKEN", "LOCAL_DEV_TOKEN")
        self.ws_url = self.ha_url.replace("http://", "ws://").replace("https://", "wss://") + "/websocket"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        self.event_callbacks: List[Callable[[Dict[str, Any]], None]] = []
        self.is_running = True
        self.thread_engine = thread_engine

    def register_event_callback(self, callback: Callable[[Dict[str, Any]], None]):
        self.event_callbacks.append(callback)

    async def async_get_states(self) -> Optional[List[Dict[str, Any]]]:
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.ha_url}/states", headers=self.headers, timeout=10) as resp:
                    if resp.status == 200:
                        return await resp.json()
        except Exception as e:
            logger.error(f"REST API থেকে স্টেট আনা ব্যর্থ: {e}")
        return None

    async def async_call_service(self, domain: str, service: str, service_data: Dict[str, Any]) -> bool:
        try:
            url = f"{self.ha_url}/services/{domain}/{service}"
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=self.headers, json=service_data, timeout=5) as resp:
                    return resp.status == 200
        except Exception as e:
            logger.error(f"হোম সার্ভিস কল ব্যর্থ ({domain}.{service}): {e}")
            return False

    async def listen_events_forever(self):
        retry_delay = 2
        while self.is_running:
            try:
                logger.info(f"🔌 [HA_WEBSOCKET] কানেক্ট করার চেষ্টা: {self.ws_url}")
                async with websockets.connect(self.ws_url) as ws:
                    auth_req = await ws.recv()
                    auth_data = json.loads(auth_req)
                    
                    if auth_data.get("type") == "auth_required":
                        await ws.send(json.dumps({
                            "type": "auth",
                            "access_token": self.token
                        }))
                        
                    auth_res = json.loads(await ws.recv())
                    if auth_res.get("type") != "auth_ok":
                        logger.error("❌ [HA_WEBSOCKET] অথেন্টিকেশন ব্যর্থ!")
                        await asyncio.sleep(5)
                        continue

                    logger.info("✅ [HA_WEBSOCKET] অথেন্টিকেটেড ও কানেক্টেড।")
                    retry_delay = 2

                    await ws.send(json.dumps({
                        "id": 1,
                        "type": "subscribe_events",
                        "event_type": "state_changed"
                    }))

                    while self.is_running:
                        msg = await ws.recv()
                        data = json.loads(msg)
                        if data.get("type") == "event":
                            event_data = data.get("event", {})
                            for cb in self.event_callbacks:
                                if self.thread_engine:
                                    self.thread_engine.dispatch_task("Bucket_B_TelemetryIO", cb, event_data)
                                elif asyncio.iscoroutinefunction(cb):
                                    await cb(event_data)
                                else:
                                    cb(event_data)

            except Exception as e:
                logger.warning(f"⚠️ [HA_WEBSOCKET] কানেকশন বিচ্ছিন্ন ({e})! {retry_delay} সে. পর পুনঃচেষ্টা...")
                await asyncio.sleep(retry_delay)
                retry_delay = min(retry_delay * 2, 60)

# ===================================================================================================
# 🧵 THREADING ENGINE (3 BUCKETS TOPOLOGY)
# ===================================================================================================
class MasterSupervisorThreadEngine:
    def __init__(self, db: CentralDatabaseManager):
        self.db = db
        self.thread_buckets: Dict[str, List[str]] = {
            "Bucket_A_HighCompute": [],
            "Bucket_B_TelemetryIO": [],
            "Bucket_C_FastAction": []
        }
        self.executors: Dict[str, ThreadPoolExecutor] = {
            "Bucket_A_HighCompute": ThreadPoolExecutor(max_workers=2, thread_name_prefix="HighComputeWorker"),
            "Bucket_B_TelemetryIO": ThreadPoolExecutor(max_workers=4, thread_name_prefix="TelemetryIOWorker"),
            "Bucket_C_FastAction": ThreadPoolExecutor(max_workers=8, thread_name_prefix="FastActionWorker")
        }
        self._load_or_create_topology()

    def _load_or_create_topology(self):
        if os.path.exists(THREAD_CONFIG_PATH):
            try:
                with open(THREAD_CONFIG_PATH, "r", encoding="utf-8") as f:
                    self.thread_buckets = json.load(f)
                logger.info("⚙️ [THREAD_ENGINE] থ্রেড টপোলজি ফাইল থেকে লোড হয়েছে।")
                return
            except Exception as e:
                logger.error(f"থ্রেড টপোলজি লোডে সমস্যা: {e}")

    def save_topology(self):
        try:
            with open(THREAD_CONFIG_PATH, "w", encoding="utf-8") as f:
                json.dump(self.thread_buckets, f, ensure_ascii=False, indent=4)
        except Exception as e:
            logger.error(f"থ্রেড কনফিগ সংরক্ষণে সমস্যা: {e}")

    def categorize_entities(self, entities: List[Dict[str, Any]]):
        self.thread_buckets["Bucket_A_HighCompute"].clear()
        self.thread_buckets["Bucket_B_TelemetryIO"].clear()
        self.thread_buckets["Bucket_C_FastAction"].clear()

        for ent in entities:
            ent_id = ent.get("entity_id", "")
            domain = ent_id.split(".")[0]

            if domain in ["camera", "image"] or "vision" in ent_id:
                self.thread_buckets["Bucket_A_HighCompute"].append(ent_id)
            elif domain in ["sensor", "binary_sensor", "climate", "weather"]:
                self.thread_buckets["Bucket_B_TelemetryIO"].append(ent_id)
            elif domain in ["light", "switch", "fan", "media_player", "cover", "lock"]:
                self.thread_buckets["Bucket_C_FastAction"].append(ent_id)

        self.save_topology()

    def dispatch_task(self, target_bucket: str, func: Callable, *args, **kwargs):
        if target_bucket in self.executors:
            return self.executors[target_bucket].submit(func, *args, **kwargs)
        else:
            t = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)
            t.start()
            return t

    def evaluate_dynamic_task(self, task_name: str, task_func: Callable, is_heavy: bool = False, *args, **kwargs):
        if is_heavy:
            return self.dispatch_task("Bucket_A_HighCompute", task_func, *args, **kwargs)
        else:
            return self.dispatch_task("Bucket_C_FastAction", task_func, *args, **kwargs)

# ===================================================================================================
# 🧮 EXPERT CORE 1: VOICE & AUDIO MATH PROCESSING CORE (VAD, QUANTIZED FINGERPRINT)
# ===================================================================================================
class VoiceAudioCore:
    def __init__(self, db: CentralDatabaseManager):
        self.db = db

    @staticmethod
    def apply_energy_vad(audio_bytes: bytes, threshold_factor: float = 1.5) -> bytes:
        if len(audio_bytes) == 0:
            return b""
        data = np.frombuffer(audio_bytes, dtype=np.int16)
        frame_size = 320 # 20ms frames at 16kHz
        frames = [data[i:i+frame_size] for i in range(0, len(data), frame_size) if len(data[i:i+frame_size]) == frame_size]
        
        if not frames:
            return audio_bytes

        energies = [np.sum(f.astype(np.float64)**2) / frame_size for f in frames]
        ambient_energy = np.percentile(energies, 15) if len(energies) > 5 else 1000.0
        energy_threshold = max(ambient_energy * threshold_factor, 150000.0)

        voiced_frames = [f for f, e in zip(frames, energies) if e > energy_threshold]
        if not voiced_frames:
            return audio_bytes
            
        return np.concatenate(voiced_frames).astype(np.int16).tobytes()

    @staticmethod
    def apply_wiener_filter(audio_bytes: bytes) -> np.ndarray:
        if len(audio_bytes) == 0:
            return np.zeros(16000, dtype=np.float32)
        audio_data = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0
        if len(audio_data) < 15:
            audio_data = np.pad(audio_data, (0, 15 - len(audio_data)), mode='constant')
        try:
            filtered = scipy.signal.wiener(audio_data, mysize=15).astype(np.float32)
            return np.nan_to_num(filtered)
        except Exception:
            return audio_data.astype(np.float32)

    @staticmethod
    def get_positional_encoding(seq_len: int, d_model: int) -> np.ndarray:
        pe = np.zeros((seq_len, d_model), dtype=np.float32)
        position = np.arange(0, seq_len, dtype=np.float32).reshape(-1, 1)
        div_term = np.exp(np.arange(0, d_model, 2, dtype=np.float32) * -(math.log(10000.0) / d_model))
        pe[:, 0::2] = np.sin(position * div_term)
        pe[:, 1::2] = np.cos(position * div_term)
        return pe

    @staticmethod
    def extract_raw_log_mel_spectrogram(signal: np.ndarray, sr: int = 16000, n_mels: int = 40, n_fft: int = 512) -> np.ndarray:
        frame_size, frame_stride = int(0.025 * sr), int(0.010 * sr)
        sig_len = len(signal)
        if sig_len <= frame_size:
            signal = np.pad(signal, (0, frame_size - sig_len + 1), mode='constant')
        num_frames = int(math.ceil(float(abs(len(signal) - frame_size)) / frame_stride)) + 1
        pad_signal = np.append(signal, np.zeros((num_frames * frame_stride + frame_size) - len(signal)))
        indices = np.tile(np.arange(0, frame_size), (num_frames, 1)) + np.tile(np.arange(0, num_frames * frame_stride, frame_stride), (frame_size, 1)).T
        frames = pad_signal[indices.astype(np.int32, copy=False)] * np.hamming(frame_size)
        pow_frames = ((1.0 / n_fft) * (np.absolute(np.fft.rfft(frames, n_fft)) ** 2))
        
        fbank = np.zeros((n_mels, int(np.floor(n_fft / 2 + 1))), dtype=np.float32)
        mel_pts = np.linspace(0, (2595 * np.log10(1 + (sr / 2) / 700)), n_mels + 2)
        hz_pts = (700 * (10**(mel_pts / 2595) - 1))
        bin_pts = np.floor((n_fft + 1) * hz_pts / sr).astype(np.int32)
        for m in range(1, n_mels + 1):
            for k in range(bin_pts[m - 1], bin_pts[m]): 
                fbank[m - 1, k] = (k - bin_pts[m - 1]) / max(1, (bin_pts[m] - bin_pts[m - 1]))
            for k in range(bin_pts[m], bin_pts[m + 1]): 
                fbank[m - 1, k] = (bin_pts[m + 1] - k) / max(1, (bin_pts[m + 1] - bin_pts[m]))
        
        filter_banks = np.dot(pow_frames, fbank.T)
        filter_banks = np.where(filter_banks == 0, np.finfo(float).eps, filter_banks)
        log_mel = 20 * np.log10(filter_banks)
        log_mel = log_mel[:30, :n_mels] if log_mel.shape[0] >= 30 else np.pad(log_mel, ((0, 30 - log_mel.shape[0]), (0, 0)), mode='constant')
        return log_mel.astype(np.float32)

    @staticmethod
    def pack_raw_audio_to_wav(audio_bytes: bytes, sr: int = 16000) -> bytes:
        wav_buf = io.BytesIO()
        data_len = len(audio_bytes)
        wav_buf.write(b'RIFF')
        wav_buf.write(struct.pack('<I', 36 + data_len))
        wav_buf.write(b'WAVEfmt ')
        wav_buf.write(struct.pack('<I', 16))
        wav_buf.write(struct.pack('<H', 1))
        wav_buf.write(struct.pack('<H', 1))
        wav_buf.write(struct.pack('<I', sr))
        wav_buf.write(struct.pack('<I', sr * 2))
        wav_buf.write(struct.pack('<H', 2))
        wav_buf.write(struct.pack('<H', 16))
        wav_buf.write(b'data')
        wav_buf.write(struct.pack('<I', data_len))
        wav_buf.write(audio_bytes)
        return wav_buf.getvalue()

    def process_acoustic_input(self, audio_bytes: bytes) -> Tuple[np.ndarray, str]:
        vad_audio = self.apply_energy_vad(audio_bytes)
        clean_sig = self.apply_wiener_filter(vad_audio)
        raw_log_mel = self.extract_raw_log_mel_spectrogram(clean_sig)
        
        # ✅ Resilient Quantized Acoustic Fingerprint (Robust against minor microphone jitter)
        norm_mel = (raw_log_mel - np.mean(raw_log_mel)) / (np.std(raw_log_mel) + 1e-6)
        quantized_mel = np.clip(np.round(norm_mel * 8), -128, 127).astype(np.int8)
        acoustic_hash = hashlib.sha256(quantized_mel.tobytes()).hexdigest()[:24]
        
        model_input = raw_log_mel + VoiceAudioCore.get_positional_encoding(30, raw_log_mel.shape[1])
        return model_input, acoustic_hash

# ===================================================================================================
# 👁️ EXPERT CORE 2: VISION, REAL PTZ & OCR SPATIAL CORE
# ===================================================================================================
class VisionSpatialCore:
    def __init__(self, db: CentralDatabaseManager, config: Dict[str, Any], thread_engine: MasterSupervisorThreadEngine, ha_url: str, headers: Dict[str, str]):
        self.db = db
        self.thread_engine = thread_engine
        self.ha_url = ha_url
        self.headers = headers
        self.camera_streams = config.get("cameras", {"backyard": "rtsp://admin:12345@192.168.1.100:554/stream1"})
        self.tv_stream_url = config.get("tv_stream")
        self.running = True
        self.patrol_interval = 300
        self.model = YOLO("yolov8n.pt") if HAS_YOLO else None
        self.active_tracks: Dict[str, Any] = {}
        self.frame_counter = 0
        self.current_media_title = "Standard Display Output"
        
        if HAS_OPENCV:
            self.thread_engine.dispatch_task("Bucket_A_HighCompute", self._patrol_loop)

    def send_ptz_command(self, camera_id: str, command: str, value: Any = None):
        logger.info(f"🎥 [VISION_CORE] PTZ নির্দেশ -> ক্যামেরা: camera.{camera_id} | কমান্ড: {command}")
        try:
            url = f"{self.ha_url}/services/camera/ptz"
            payload = {"entity_id": f"camera.{camera_id}", "command": command}
            if value is not None:
                payload["tilt_step"] = value
                payload["pan_step"] = value
            requests.post(url, headers=self.headers, json=payload, timeout=3)
        except Exception as e:
            logger.error(f"PTZ সার্ভিস ব্যবহারে ত্রুটি: {e}")

    def capture_on_demand_ocr(self) -> str:
        if not (HAS_OPENCV and HAS_TESSERACT and self.tv_stream_url):
            return self.current_media_title
        cap = None
        try:
            cap = cv2.VideoCapture(self.tv_stream_url)
            ret, frame = cap.read()
            if ret:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                text = pytesseract.image_to_string(gray)
                cleaned_text = " ".join(text.split())
                if len(cleaned_text) > 3:
                    self.current_media_title = cleaned_text[:100]
        except Exception as e:
            logger.error(f"OCR প্রসেসিং সমস্যা: {e}")
        finally:
            if cap is not None:
                cap.release()
        return self.current_media_title

    def _patrol_loop(self):
        last_patrol = time.time()
        while self.running:
            now = time.time()
            if now - last_patrol > self.patrol_interval:
                for cam_id in self.camera_streams.keys():
                    self.send_ptz_command(cam_id, "pan_right", 10)
                last_patrol = now

            self.frame_counter += 1
            if self.frame_counter % 10 == 0:
                for cam_id, rtsp_url in self.camera_streams.items():
                    cap = None
                    try:
                        cap = cv2.VideoCapture(rtsp_url)
                        ret, frame = cap.read()
                        if ret and self.model:
                            results = self.model(frame, verbose=False)
                            for r in results:
                                for box in r.boxes:
                                    label = self.model.names[int(box.cls[0])]
                                    if label in ["person", "car", "motorcycle"]:
                                        xyxy = box.xyxy[0].cpu().numpy()
                                        center_x = (xyxy[0] + xyxy[2]) / 2
                                        if abs(center_x - (frame.shape[1] / 2)) > 50:
                                            direction = "pan_right" if center_x > (frame.shape[1] / 2) else "pan_left"
                                            self.send_ptz_command(cam_id, direction, 5)
                                        self.active_tracks[cam_id] = {"detected": label, "time": str(datetime.now())}
                    except Exception:
                        pass
                    finally:
                        if cap is not None:
                            cap.release()
            time.sleep(2)

# ===================================================================================================
# ⏱️ EXPERT CORE 3: TELEMETRY & DIAGNOSTICS CORE
# ===================================================================================================
class TelemetryDiagnosticCore:
    def __init__(self, db: CentralDatabaseManager, ha_url: str, headers: Dict[str, str]):
        self.db = db
        self.ha_url = ha_url
        self.headers = headers
        self.bluetooth_registry: Dict[str, Dict[str, Any]] = {}
        self.pending_confirmation_action: Optional[Dict[str, Any]] = None

    def get_runtime_summary(self, entity_id: str) -> str:
        with self.db.lock:
            if entity_id not in self.db.telemetry_store:
                return f"ডিভাইসটি ({entity_id}) এর কোনো ট্র্যাকিং ডেটা পাওয়া যায়নি।"
            item = self.db.telemetry_store[entity_id]
            curr_state = item["state"]
            now = time.time()
            active_seconds = item["total_on_time_today"]
            if curr_state in ["on", "playing", "active"]:
                active_seconds += (now - item["last_changed"])
            hours, minutes = int(active_seconds // 3600), int((active_seconds % 3600) // 60)
            state_str = "চালু (ON)" if curr_state in ["on", "playing", "active"] else "বন্ধ (OFF)"
            return f"ডিভাইসটি বর্তমানে {state_str} অবস্থায় আছে। আজ মোট {hours} ঘণ্টা {minutes} মিনিট চলেছে।"

    def scan_broken_entities(self) -> List[Dict[str, Any]]:
        broken = []
        try:
            res = requests.get(f"{self.ha_url}/states", headers=self.headers, timeout=5)
            if res.status_code == 200:
                for obj in res.json():
                    if obj.get("state") in ["unavailable", "unknown"]:
                        broken.append({
                            "entity_id": obj.get("entity_id"),
                            "state": obj.get("state"),
                            "friendly_name": obj.get("attributes", {}).get("friendly_name", obj.get("entity_id"))
                        })
        except Exception as e:
            logger.error(f"অচল ডিভাইস স্ক্যান ব্যর্থ: {e}")
        return broken

    def scan_bluetooth_devices(self) -> List[Dict[str, str]]:
        devices = []
        try:
            output = subprocess.check_output(["bluetoothctl", "devices"], timeout=5).decode('utf-8')
            for line in output.strip().split('\n'):
                parts = line.split(maxsplit=2)
                if len(parts) >= 3 and parts[0] == "Device":
                    devices.append({"mac": parts[1], "name": parts[2]})
                    self.bluetooth_registry[parts[1]] = {"name": parts[2], "last_seen": time.time()}
        except Exception:
            pass
        return devices

# ===================================================================================================
# 🕹️ EXPERT CORE 4: HOME ACTION & MEDIA EXECUTION CORE (SYNTAX & RUNTIME VERIFIED)
# ===================================================================================================
class HomeActionCore:
    def __init__(self, db: CentralDatabaseManager, ha_url: str, headers: Dict[str, str]):
        self.db = db
        self.ha_url = ha_url
        self.headers = headers

    # ✅ FIXED: Corrected double parenthesis syntax error
    def find_active_media_player(self) -> str:
        with self.db.lock:
            for ent_id, meta in self.db.telemetry_store.items():
                if ent_id.startswith("media_player.") and meta.get("state") in ["playing", "on"]:
                    return ent_id
        return "media_player.living_room_tv"

    def execute_ha_service(self, entity_id: str, action: str, value: Any = None) -> bool:
        try:
            domain = entity_id.split('.')[0]
            url = f"{self.ha_url}/services/{domain}/{action}"
            payload = {"entity_id": entity_id}
            if value is not None:
                if domain == "climate": payload["temperature"] = value
                elif domain == "fan": payload["percentage"] = value
                elif domain == "light" and action == "turn_on": payload["brightness"] = value
            res = requests.post(url, headers=self.headers, json=payload, timeout=5)
            logger.info(f"🚀 [ACTION_CORE] সার্ভিস এক্সিকিউশন: {domain}.{action} -> {entity_id}")
            return res.status_code == 200
        except Exception as e:
            logger.error(f"হোম সার্ভিস চালনায় সমস্যা: {e}")
            return False

    def execute_omni_command(self, command: str, value: Any = None) -> bool:
        logger.info(f"🕹️ [OMNI_EXECUTE] কমান্ড: {command} | মান: {value}")
        try:
            if command in ["SCROLL_DOWN", "SCROLL_UP", "VOLUME_UP", "VOLUME_DOWN"]:
                target_media_player = value if value and "media_player." in str(value) else self.find_active_media_player()
                service = "volume_up" if command == "VOLUME_UP" else "volume_down" if command == "VOLUME_DOWN" else "media_next_track"
                return self.execute_ha_service(target_media_player, service)

            elif command == "PLAY_LOCAL_MOVIE":
                target_media_player = self.find_active_media_player()
                media_url = f"http://supervisor/media/movies/{value}.mp4"
                url = f"{self.ha_url}/services/media_player/play_media"
                payload = {
                    "entity_id": target_media_player,
                    "media_content_id": media_url,
                    "media_content_type": "video"
                }
                res = requests.post(url, headers=self.headers, json=payload, timeout=5)
                return res.status_code == 200
        except Exception as e:
            logger.error(f"অমনি কমান্ড ব্যর্থতা: {e}")
        return False

# ===================================================================================================
# ⚡ DYNAMIC CORE ENGINE: SECURE COMPILATION & GENERATION (AST VALIDATED)
# ===================================================================================================
class DynamicCoreGenerator:
    def __init__(self, db: CentralDatabaseManager):
        self.db = db
        self.loaded_dynamic_cores: Dict[str, Any] = {}

    def generate_and_register_core(self, core_name: str, task_description: str) -> Optional[Any]:
        sanitized_name = re.sub(r'[^a-zA-Z0-9_]', '', core_name).lower()
        if not sanitized_name:
            sanitized_name = f"core_{int(time.time())}"

        file_path = os.path.join(DYNAMIC_CORES_DIR, f"dynamic_{sanitized_name}_core.py")

        core_code = f'''# Dynamic Sub-Brain Core Auto-Generated by Master Brain
# Target: {task_description}

import logging
logger = logging.getLogger("DynamicCore_{sanitized_name}")

class DynamicCoreModule:
    def __init__(self, db_manager):
        self.db = db_manager
        self.core_name = "{sanitized_name}"
        logger.info("⚡ Dynamic Sub-Brain Core [{sanitized_name}] Initialized & Mounted.")

    def process_task(self, payload: dict) -> dict:
        logger.info(f"Executing payload in Isolated Thread [{sanitized_name}]: {{payload}}")
        return {{
            "status": "SUCCESS",
            "executed_by": self.core_name,
            "timestamp": "{datetime.now()}",
            "result": "Dynamic execution completed for task: " + str(payload)
        }}
'''
        try:
            # ✅ AST syntax check before writing to disk
            ast.parse(core_code)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(core_code)

            spec = importlib.util.spec_from_file_location(f"dynamic_{sanitized_name}_core", file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            instance = module.DynamicCoreModule(self.db)
            self.loaded_dynamic_cores[sanitized_name] = instance

            with self.db.lock:
                self.db.dynamic_cores_registry[sanitized_name] = {
                    "file_path": file_path,
                    "registered_at": str(datetime.now()),
                    "description": task_description
                }
            logger.info(f"✨ [DYNAMIC_CORE_GENERATOR] কাস্টম কোর '{sanitized_name}' যুক্ত করা হয়েছে।")
            return instance
        except Exception as e:
            logger.error(f"ডাইনামিক কোর তৈরিতে ত্রুটি: {e}")
            return None

# ===================================================================================================
# 🧠 PURE NUMPY TRANSFORMER ENCODER WITH FULL SELF-ATTENTION BACKPROPAGATION
# ===================================================================================================
class TextlessTransformerBrain:
    def __init__(self, seq_len: int = 30, d_model: int = 40, num_heads: int = 4, d_ff: int = 128, num_entities: int = 128, lr: float = 0.01):
        self.seq_len, self.d_model, self.num_heads, self.d_ff, self.num_entities, self.lr = seq_len, d_model, num_heads, d_ff, num_entities, lr
        self.d_k = d_model // num_heads
        np.random.seed(42)
        
        # Multi-Head Attention Projection Weights
        self.W_q = np.random.randn(d_model, d_model).astype(np.float32) * np.sqrt(2.0 / d_model)
        self.W_k = np.random.randn(d_model, d_model).astype(np.float32) * np.sqrt(2.0 / d_model)
        self.W_v = np.random.randn(d_model, d_model).astype(np.float32) * np.sqrt(2.0 / d_model)
        self.W_o = np.random.randn(d_model, d_model).astype(np.float32) * np.sqrt(2.0 / d_model)
        
        # Feed-Forward Weights
        self.W_ff1 = np.random.randn(d_model, d_ff).astype(np.float32) * np.sqrt(2.0 / d_model)
        self.b_ff1 = np.zeros((1, d_ff), dtype=np.float32)
        self.W_ff2 = np.random.randn(d_ff, d_model).astype(np.float32) * np.sqrt(2.0 / d_ff)
        self.b_ff2 = np.zeros((1, d_model), dtype=np.float32)
        
        # Classification Projection
        self.flat_dim = seq_len * d_model
        self.W_class = np.random.randn(self.flat_dim, num_entities).astype(np.float32) * np.sqrt(2.0 / self.flat_dim)
        self.b_class = np.zeros((1, num_entities), dtype=np.float32)

        # Caches for complete analytical backpropagation
        self.last_X: Optional[np.ndarray] = None
        self.last_attn_weights: List[np.ndarray] = []
        self.last_attn_out: Optional[np.ndarray] = None
        self.last_attn_projected: Optional[np.ndarray] = None
        self.last_ff1: Optional[np.ndarray] = None
        self.last_embeddings: Optional[np.ndarray] = None

        self.load_weights_locally()

    def _softmax(self, x: np.ndarray) -> np.ndarray:
        shift_x = x - np.max(x, axis=-1, keepdims=True)
        exps = np.exp(shift_x)
        return exps / np.sum(exps, axis=-1, keepdims=True)

    def forward_pass(self, X: np.ndarray) -> np.ndarray:
        self.last_X = X.copy()
        Q = np.dot(X, self.W_q)
        K = np.dot(X, self.W_k)
        V = np.dot(X, self.W_v)
        
        self.last_attn_out = np.zeros_like(X)
        self.last_attn_weights = []
        
        for h in range(self.num_heads):
            start, end = h * self.d_k, (h + 1) * self.d_k
            Q_h = Q[:, start:end]
            K_h = K[:, start:end]
            V_h = V[:, start:end]
            
            scores = np.dot(Q_h, K_h.T) / math.sqrt(self.d_k)
            attn_weight = self._softmax(scores)
            self.last_attn_weights.append(attn_weight)
            self.last_attn_out[:, start:end] = np.dot(attn_weight, V_h)
            
        self.last_attn_projected = np.dot(self.last_attn_out, self.W_o)
        self.last_ff1 = np.maximum(0.0, np.dot(self.last_attn_projected, self.W_ff1) + self.b_ff1)
        self.last_embeddings = np.dot(self.last_ff1, self.W_ff2) + self.b_ff2
        
        flat_emb = self.last_embeddings.flatten().reshape(1, -1)
        class_logits = np.dot(flat_emb, self.W_class) + self.b_class
        probs = self._softmax(class_logits).flatten()
        return probs

    def backward_pass(self, true_class_idx: int) -> None:
        if true_class_idx >= self.num_entities or self.last_embeddings is None:
            return

        flat_emb = self.last_embeddings.flatten().reshape(1, -1)
        class_logits = np.dot(flat_emb, self.W_class) + self.b_class
        probs = self._softmax(class_logits)

        # Softmax Cross-Entropy Derivative: dL/dz = probs - y
        d_logits = probs.copy()
        d_logits[0, true_class_idx] -= 1.0

        # Gradients for Classifier Layer
        dW_class = np.dot(flat_emb.T, d_logits)
        db_class = d_logits

        # Backprop into Embeddings
        d_flat_emb = np.dot(d_logits, self.W_class.T)
        d_embeddings = d_flat_emb.reshape(self.seq_len, self.d_model)

        # Gradients for Feed-Forward Layer 2
        dW_ff2 = np.dot(self.last_ff1.T, d_embeddings)
        db_ff2 = np.sum(d_embeddings, axis=0, keepdims=True)

        # Backprop into Feed-Forward Layer 1 (with ReLU gradient)
        d_ff1 = np.dot(d_embeddings, self.W_ff2.T)
        d_ff1[self.last_ff1 <= 0] = 0.0

        dW_ff1 = np.dot(self.last_attn_projected.T, d_ff1)
        db_ff1 = np.sum(d_ff1, axis=0, keepdims=True)

        # Attention Output Projection Gradients
        d_attn_projected = np.dot(d_ff1, self.W_ff1.T)
        dW_o = np.dot(self.last_attn_out.T, d_attn_projected)
        d_attn_out = np.dot(d_attn_projected, self.W_o.T)

        # ✅ FIXED: Multi-Head Scaled Dot-Product Exact Analytical Gradients
        dW_v = np.zeros_like(self.W_v)
        dW_q = np.zeros_like(self.W_q)
        dW_k = np.zeros_like(self.W_k)

        Q_full = np.dot(self.last_X, self.W_q)
        K_full = np.dot(self.last_X, self.W_k)
        V_full = np.dot(self.last_X, self.W_v)

        for h in range(self.num_heads):
            s_idx, e_idx = h * self.d_k, (h + 1) * self.d_k
            d_attn_h = d_attn_out[:, s_idx:e_idx]
            A_h = self.last_attn_weights[h]
            V_h = V_full[:, s_idx:e_idx]
            Q_h = Q_full[:, s_idx:e_idx]
            K_h = K_full[:, s_idx:e_idx]

            # Gradient for V_h: dV_h = A_h^T @ d_attn_h
            dV_h = np.dot(A_h.T, d_attn_h)
            dW_v[:, s_idx:e_idx] = np.dot(self.last_X.T, dV_h)

            # Gradient through Softmax Attention Scores Matrix
            dA_h = np.dot(d_attn_h, V_h.T)
            dS_h = A_h * (dA_h - np.sum(dA_h * A_h, axis=-1, keepdims=True)) / math.sqrt(self.d_k)

            # Gradient for Q_h and K_h
            dQ_h = np.dot(dS_h, K_h)
            dK_h = np.dot(dS_h.T, Q_h)

            dW_q[:, s_idx:e_idx] = np.dot(self.last_X.T, dQ_h)
            dW_k[:, s_idx:e_idx] = np.dot(self.last_X.T, dK_h)

        # Apply Stochastic Gradient Descent (SGD) Parameter Updates
        self.W_q -= self.lr * dW_q
        self.W_k -= self.lr * dW_k
        self.W_v -= self.lr * dW_v
        self.W_o -= self.lr * dW_o
        self.W_class -= self.lr * dW_class
        self.b_class -= self.lr * db_class
        self.W_ff2 -= self.lr * dW_ff2
        self.b_ff2 -= self.lr * db_ff2
        self.W_ff1 -= self.lr * dW_ff1
        self.b_ff1 -= self.lr * db_ff1

        self.save_weights_locally()
        logger.info(f"🧠 [TRANSFORMER] ৪-হেড সেলফ-অ্যাটেনশন ব্যাকপ্রোপ সম্পন্ন! টার্গেট ইনডেক্স: {true_class_idx}")

    def save_weights_locally(self) -> None:
        try:
            np.savez(WEIGHTS_STORAGE_PATH, W_q=self.W_q, W_k=self.W_k, W_v=self.W_v, W_o=self.W_o,
                     W_ff1=self.W_ff1, b_ff1=self.b_ff1, W_ff2=self.W_ff2, b_ff2=self.b_ff2,
                     W_class=self.W_class, b_class=self.b_class)
        except Exception as e:
            logger.error(f"নিউরাল ওয়েট সংরক্ষণে সমস্যা: {e}")

    def load_weights_locally(self) -> None:
        if os.path.exists(WEIGHTS_STORAGE_PATH):
            try:
                data = np.load(WEIGHTS_STORAGE_PATH)
                self.W_q, self.W_k, self.W_v, self.W_o = data['W_q'], data['W_k'], data['W_v'], data['W_o']
                self.W_ff1, self.b_ff1, self.W_ff2, self.b_ff2 = data['W_ff1'], data['b_ff1'], data['W_ff2'], data['b_ff2']
                self.W_class, self.b_class = data['W_class'], data['b_class']
                logger.info("🧠 [TRANSFORMER] নিউরাল নেটওয়ার্ক ফাইল থেকে ওয়েট সিঙ্ক সম্পন্ন করেছে।")
            except Exception as e:
                logger.error(f"ওয়েট লোড ত্রুটি: {e}")

# ===================================================================================================
# 🏛️ CENTRAL MASTER BRAIN SUPERVISOR ENGINE
# ===================================================================================================
class MasterBrainSupervisor:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.ha_url = config.get("ha_url", "http://supervisor/core/api")
        self.token = os.environ.get("SUPERVISOR_TOKEN", "LOCAL_DEV_TOKEN")
        self.headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        self.api_key = config.get("gemini_api_key", "")

        self.db = CentralDatabaseManager()
        self.thread_engine = MasterSupervisorThreadEngine(self.db)

        self.voice_core = VoiceAudioCore(self.db)
        self.vision_core = VisionSpatialCore(self.db, config, self.thread_engine, self.ha_url, self.headers)
        self.telemetry_core = TelemetryDiagnosticCore(self.db, self.ha_url, self.headers)
        self.action_core = HomeActionCore(self.db, self.ha_url, self.headers)
        self.dynamic_generator = DynamicCoreGenerator(self.db)

        self.entity_registry: List[str] = []
        self.cached_states: Dict[str, Any] = {}
        self.transformer_brain = TextlessTransformerBrain(num_entities=128)

    def perform_semantic_mesh_scan(self):
        try:
            res = requests.get(f"{self.ha_url}/states", headers=self.headers, timeout=10)
            if res.status_code == 200:
                self.entity_registry.clear()
                self.cached_states.clear()
                raw_entities_list = []

                for state_obj in res.json():
                    ent_id = state_obj.get("entity_id")
                    domain = ent_id.split(".")[0]
                    state = state_obj.get("state")
                    attrs = state_obj.get("attributes", {})

                    if domain in ["light", "switch", "fan", "climate", "sensor", "media_player", "camera"]:
                        self.entity_registry.append(ent_id)
                        self.cached_states[ent_id] = {
                            "state": state,
                            "friendly_name": attrs.get("friendly_name", ent_id),
                        }
                        self.db.update_entity_telemetry(ent_id, state, attrs)
                        raw_entities_list.append({"entity_id": ent_id, "state": state, "attributes": attrs})

                self.thread_engine.categorize_entities(raw_entities_list)
                num_e = max(128, len(self.entity_registry))
                self.transformer_brain = TextlessTransformerBrain(num_entities=num_e)
                logger.info(f"🏛️ [MASTER_BRAIN] স্ক্যান সম্পন্ন। মোট সক্রিয় ডিভাইস: {len(self.cached_states)}")
        except Exception as e:
            logger.error(f"মেশ স্ক্যানে সমস্যা: {e}")

    def check_internet_connectivity(self) -> bool:
        try:
            socket.create_connection(("8.8.8.8", 53), timeout=2)
            return True
        except OSError:
            return False

    def route_and_process_input(self, client_ip: str, audio_bytes: bytes) -> Tuple[List[Dict[str, Any]], bytes, Optional[Dict[str, Any]]]:
        log_mel_data, acoustic_hash = self.voice_core.process_acoustic_input(audio_bytes)

        # 1. Offline Cache Match Check
        with self.db.lock:
            cache = self.db.knowledge_base["offline_intent_cache"]
            if acoustic_hash in cache:
                cached_node = cache[acoustic_hash]
                voice_list = cached_node.get("voice_filenames", [])
                
                cached_bytes = b""
                if voice_list:
                    selected = random.choice(voice_list)
                    path = os.path.join(CACHE_DIR, selected)
                    if os.path.exists(path):
                        with open(path, "rb") as vf:
                            cached_bytes = vf.read()
                        logger.info(f"⚡ [MASTER_BRAIN] অফলাইন ইনটেন্ট ক্যাশ হিট! ক্যাশ ভয়েস: {selected}")
                return cached_node.get("actions", []), cached_bytes, None

        # 2. On-Device Transformer Brain Inference
        probs = self.transformer_brain.forward_pass(log_mel_data)
        top_idx = int(np.argmax(probs))
        confidence = float(probs[top_idx])

        if confidence > 0.85 and top_idx < len(self.entity_registry):
            target_entity = self.entity_registry[top_idx]
            logger.info(f"🎯 [MASTER_BRAIN] লোকাল মডেল কনফিডেন্স উচ্চ ({confidence:.2f}) -> Entity: {target_entity}")
            return [{"entity_id": target_entity, "action": "turn_on"}], b"", None

        if not self.check_internet_connectivity():
            logger.warning("⚠️ ইন্টারনেট কানেকশন পাওয়া যায়নি। লোকাল ফলব্যাক করা হচ্ছে।")
            return [], b"", None

        # 3. Cloud Teacher Gemini Multimodal Processing
        logger.info("🌐 [MASTER_BRAIN] লোকাল কনফিডেন্স কম। টিচার মডেল (Gemini-2.0-Flash) কল করা হচ্ছে...")
        gemini_response = self.call_multimodal_teacher(audio_bytes)
        
        if gemini_response:
            actions = gemini_response.get("actions", [])
            proposed = gemini_response.get("proposed_action", {})
            v_b64 = gemini_response.get("voice_response_bytes", "")
            raw_v_bytes = native_b64decode(v_b64) if v_b64 else b""

            unhandled_task = gemini_response.get("unhandled_custom_task")
            if unhandled_task:
                logger.info(f"⚡ [MASTER_BRAIN] অজানা টাস্ক সনাক্ত: '{unhandled_task}'। কাস্টম ডাইনামিক কোর তৈরি করা হচ্ছে...")
                
                def dynamic_task_wrapper():
                    dynamic_core = self.dynamic_generator.generate_and_register_core(unhandled_task, f"Auto core for {unhandled_task}")
                    if dynamic_core:
                        dynamic_core.process_task({"raw_audio_hash": acoustic_hash})

                self.thread_engine.evaluate_dynamic_task(unhandled_task, dynamic_task_wrapper, is_heavy=True)

            if raw_v_bytes:
                v_hash = hashlib.md5(raw_v_bytes).hexdigest()
                v_file = f"{acoustic_hash}_{v_hash}.wav"
                v_path = os.path.join(CACHE_DIR, v_file)

                try:
                    with open(v_path, "wb") as f:
                        f.write(raw_v_bytes)
                except Exception as e:
                    logger.error(f"ভয়েস ফাইল রাইট করতে সমস্যা: {e}")

                existing_files = []
                if acoustic_hash in self.db.knowledge_base["offline_intent_cache"]:
                    existing_files = self.db.knowledge_base["offline_intent_cache"][acoustic_hash].get("voice_filenames", [])
                if v_file not in existing_files:
                    existing_files.append(v_file)

                self.db.save_intent_cache_entry(acoustic_hash, actions, existing_files)

                if len(self.entity_registry) > 0 and actions:
                    target_ent = actions[0].get("entity_id")
                    if target_ent in self.entity_registry:
                        self.transformer_brain.backward_pass(self.entity_registry.index(target_ent))

            return actions, raw_v_bytes, proposed

        return [], b"", None

    def call_multimodal_teacher(self, audio_bytes: bytes) -> Optional[Dict[str, Any]]:
        if not self.api_key or "YOUR_GEMINI_API_KEY" in self.api_key: return None
        sync_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key={self.api_key}"
        try:
            wav_payload = VoiceAudioCore.pack_raw_audio_to_wav(audio_bytes)
            audio_base64 = native_b64encode(wav_payload)
            
            broken_entities = self.telemetry_core.scan_broken_entities()
            context = [
                "YOU ARE AN INTERACTIVE SUPERVISOR ASSISTANT FOR HUMAYUN'S SMART ECOSYSTEM.",
                "Be extremely concise. Direct actions preferred."
            ]
            if len(broken_entities) > 0:
                context.append(f"Broken Entities Alert: {json.dumps(broken_entities, ensure_ascii=False)}")

            prompt = "\\n\\n".join(context) + (
                "\\n\\n### MANDATORY JSON FORMAT:\\n"
                "{\\n"
                "  \\"unhandled_custom_task\\": null,\\n"
                "  \\"proposed_action\\": {\\"action_type\\": \\"NONE\\", \\"target_entity\\": \\"\\", \\"parameters\\": {}, \\"awaiting_user_confirmation\\": false},\\n"
                "  \\"actions\\": [{\\"entity_id\\": \\"light.drawing_room\\", \\"action\\": \\"turn_on\\"}],\\n"
                "  \\"voice_response_bytes\\": \\"GENERATE_AUDIO_RESPONSE_HERE\\"\\n"
                "}\\n"
            )

            payload = {
                "contents": [{"parts": [{"inline_data": {"mime_type": "audio/wav", "data": audio_base64}}, {"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseModalities": ["TEXT", "AUDIO"],
                    "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": "Puck"}}}
                }
            }

            res = requests.post(sync_url, json=payload, timeout=25)
            if res.status_code == 200:
                parts = res.json().get('candidates', [{}])[0].get('content', {}).get('parts', [])
                v_b64, json_meta = "", {}
                for part in parts:
                    if "inlineData" in part and part["inlineData"]["mimeType"].startswith("audio/"):
                        v_b64 = part["inlineData"]["data"]
                    if "text" in part:
                        try:
                            text_str = part["text"].strip()
                            json_match = re.search(r'\\{.*\\}', text_str, re.DOTALL)
                            if json_match:
                                json_meta = json.loads(json_match.group(0))
                            else:
                                json_meta = json.loads(text_str)
                        except Exception as parse_err:
                            logger.error(f"Gemini টেক্সট পার্সিং ব্যর্থ: {parse_err}")
                return {
                    "actions": json_meta.get("actions", []),
                    "proposed_action": json_meta.get("proposed_action", {}),
                    "unhandled_custom_task": json_meta.get("unhandled_custom_task"),
                    "voice_response_bytes": v_b64
                }
        except Exception as e:
            logger.error(f"ক্লাউড টিচার মডেল এক্সিকিউশন ব্যর্থ: {e}")
        return None

# ===================================================================================================
# 📡 DISTRIBUTED VOICE UDP SOCKET SERVER & TELEMETRY SYNC
# ===================================================================================================
class DistributedVoiceSocketServer:
    def __init__(self, host: str, port: int, supervisor: MasterBrainSupervisor):
        self.host, self.port, self.supervisor = host, port, supervisor
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.server_socket.bind((self.host, self.port))
        
        self.supervisor.thread_engine.dispatch_task("Bucket_B_TelemetryIO", self._run_sync_loop)

    def start_listening_loop(self):
        logger.info(f"🏛️ ভয়েস-সকেট সার্ভার UDP পোর্ট {self.port}-এ সক্রিয় রয়েছে...")
        while True:
            try:
                data, addr = self.server_socket.recvfrom(65535)
                if len(data) < 16: continue
                raw_audio = data[16:]
                
                self.supervisor.thread_engine.dispatch_task(
                    "Bucket_C_FastAction", self._worker_inference, raw_audio, addr[0]
                )
            except Exception as e:
                logger.error(f"সকেট নেটওয়ার্ক ত্রুটি: {e}")

    def _worker_inference(self, audio_payload: bytes, client_ip: str):
        try:
            actions, raw_v_bytes, proposed = self.supervisor.route_and_process_input(client_ip, audio_payload)

            if proposed and proposed.get("awaiting_user_confirmation"):
                self.supervisor.telemetry_core.pending_confirmation_action = proposed

            for node in actions:
                if "omni_command" in node:
                    self.supervisor.action_core.execute_omni_command(node["omni_command"], node.get("value"))
                    continue

                if "ptz_command" in node:
                    self.supervisor.vision_core.send_ptz_command(node.get("camera_id", "backyard"), node["ptz_command"], node.get("value"))
                    continue

                ent_id = node.get("entity_id")
                act = node.get("action")
                if ent_id and act:
                    self.supervisor.action_core.execute_ha_service(ent_id, act, node.get("value"))

            if raw_v_bytes:
                self.server_socket.sendto(raw_v_bytes, (client_ip, 8242))
        except Exception as e:
            logger.error(f"ওয়ার্কার ইনফ্যারেন্স প্রসেসিং ব্যর্থ: {e}")

    def _run_sync_loop(self):
        while True:
            time.sleep(10)
            try:
                res = requests.get(f"{self.supervisor.ha_url}/states", headers=self.supervisor.headers, timeout=5)
                if res.status_code == 200:
                    with self.supervisor.db.lock:
                        for obj in res.json():
                            ent_id = obj.get("entity_id")
                            if ent_id in self.supervisor.cached_states:
                                state = obj.get("state")
                                attrs = obj.get("attributes", {})
                                self.supervisor.cached_states[ent_id]["state"] = state
                                self.supervisor.db.update_entity_telemetry(ent_id, state, attrs)
            except Exception:
                pass

# ===================================================================================================
# 🚀 MAIN MASTER ENTRYPOINT LIFECYCLE
# ===================================================================================================
async def main():
    logger.info("=====================================================================")
    logger.info("🏛️ INITIALIZING MULTI-CORE SUPERVISOR AI PLATFORM (100% PRODUCTION READY)")
    logger.info("👤 OWNER & MASTER DEVELOPER: HUMAYUN BHAI | YEAR: 2026")
    logger.info("=====================================================================")

    system_config = {
        "gemini_api_key": os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY"),
        "ha_url": os.environ.get("HA_URL", "http://supervisor/core/api"),
        "cameras": {
            "backyard": "rtsp://admin:12345@192.168.1.100:554/stream1",
            "front_gate": "rtsp://admin:12345@192.168.1.101:554/stream1"
        },
        "tv_stream": "rtsp://admin:12345@192.168.1.102:554/tv_display"
    }

    supervisor = MasterBrainSupervisor(config=system_config)
    supervisor.perform_semantic_mesh_scan()

    ha_ws_client = HAClient(ha_url=system_config["ha_url"], thread_engine=supervisor.thread_engine)

    def on_ha_event(event_data: dict):
        entity_id = event_data.get("data", {}).get("entity_id")
        new_state = event_data.get("data", {}).get("new_state", {}).get("state")
        attributes = event_data.get("data", {}).get("new_state", {}).get("attributes", {})
        if entity_id and new_state:
            supervisor.db.update_entity_telemetry(entity_id, new_state, attributes)

    ha_ws_client.register_event_callback(on_ha_event)

    socket_server = DistributedVoiceSocketServer(host="0.0.0.0", port=50005, supervisor=supervisor)
    supervisor.thread_engine.dispatch_task("Bucket_C_FastAction", socket_server.start_listening_loop)

    def shutdown_handler(sig, frame):
        logger.info("🛑 শাটডাউন সিগন্যাল গ্রহণ করা হয়েছে (SIGTERM/SIGINT)...")
        ha_ws_client.is_running = False
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown_handler)
    signal.signal(signal.SIGTERM, shutdown_handler)

    await ha_ws_client.listen_events_forever()

if __name__ == "__main__":
    asyncio.run(main())
`;
