import os
import base64
import json
from dotenv import load_dotenv

load_dotenv("backend/.env")
key = os.getenv("GEMINI_API_KEY")

from google import genai
from google.genai import types

client = genai.Client(api_key=key)

# 1x1 green png
tiny_png = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")

prompt = """You are an expert agricultural crop quality analyst.
Analyze the provided crop photo and output strictly a single valid JSON object:
{
  "crop": "Identified crop name or 'Unable to determine from this image'",
  "crop_confidence": 0.95,
  "disease_or_issue": "Detected issue or 'No visible issue'",
  "disease_confidence": 0.90,
  "condition": "Healthy",
  "quality_warning": "No obvious visible quality issue detected.",
  "recommendation": "Recommendation for farmer"
}
"""

for model_name in ["gemini-3.6-flash", "gemini-flash-latest"]:
    try:
        res = client.models.generate_content(
            model=model_name,
            contents=[
                types.Part.from_bytes(data=tiny_png, mime_type="image/png"),
                prompt
            ]
        )
        print(f"Model {model_name} result:")
        print(res.text)
        break
    except Exception as e:
        print(f"Model {model_name} failed: {e}")
