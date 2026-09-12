"""Constants for the Gemini Multimodal Voice Engine integration."""

DOMAIN = "gemini_voice"
CONF_API_KEY = "api_key"
CONF_MODEL = "model"
CONF_SYSTEM_PROMPT = "system_prompt"

DEFAULT_MODEL = "gemini-2.5-flash"
DEFAULT_SYSTEM_PROMPT = (
    "আপনি একটি স্মার্ট হোম ভয়েস অ্যাসিস্ট্যান্ট। "
    "ব্যবহারকারীর অনুরোধ শুনে হোম অ্যাসিস্ট্যান্টের ডিভাইস নিয়ন্ত্রণ করুন "
    "এবং বাংলা ভাষায় সংক্ষিপ্ত, স্পষ্ট উত্তর দিন। "
    "উত্তরে কোনো মার্কডাউন, অ্যাস্টারিস্ক (*) বা কোড ব্লক ব্যবহার করবেন না।"
)

RECOMMENDED_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
]
