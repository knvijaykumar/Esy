"""
Backend Configuration Module
=============================
Loads environment settings from backend/.env using python-dotenv.
Never hardcodes secrets. HF_TOKEN is optional.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Locate backend/.env
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
else:
    load_dotenv()

# Environment settings
HF_TOKEN = os.getenv("HF_TOKEN", "").strip() or None
PRICE_MODEL = os.getenv("PRICE_MODEL", "amazon/chronos-2").strip()
DEMAND_MODEL = os.getenv("DEMAND_MODEL", "amazon/chronos-2").strip()
ML_API_HOST = os.getenv("ML_API_HOST", "0.0.0.0").strip()
ML_API_PORT = int(os.getenv("ML_API_PORT", "8000"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip() or None

# Apply HF_TOKEN to environment for huggingface_hub if present
if HF_TOKEN:
    os.environ["HF_TOKEN"] = HF_TOKEN

# Apply GEMINI_API_KEY to environment if present
if GEMINI_API_KEY:
    os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY

