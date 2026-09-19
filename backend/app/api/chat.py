"""
FastAPI Chat Assistant Router
==============================
Exposes POST /api/chat endpoint powered by Google GenAI SDK.
Enables farmers to ask questions about MSP, slot booking, procurement centres,
digital tokens, and tracking their procurement journey.
"""

from typing import Literal
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

from backend.app.config import GEMINI_API_KEY

router = APIRouter(prefix="/api", tags=["Chat Assistant"])

# Current official Gemini model
GEMINI_MODEL = "gemini-3.6-flash"

SYSTEM_INSTRUCTION_EN = (
    "You are the Esy FARM Assistant, a helpful and respectful AI guide for farmers using the Esy FARM procurement platform.\n"
    "Your purpose is to help farmers understand Minimum Support Price (MSP), procurement slot booking, digital tokens, "
    "procurement centres, and the overall procurement journey.\n"
    "Rules to follow strictly:\n"
    "1. Speak in simple, warm, polite, and farmer-friendly language.\n"
    "2. Respond in English.\n"
    "3. Do NOT invent specific MSP values, government schemes, live procurement data, centre availability, bookings, tokens, or farmer records.\n"
    "4. Do NOT claim Esy FARM is an official government website; it is an intelligent procurement facilitation system.\n"
    "5. If specific live data, personal booking details, or rates are unknown, state so clearly and advise the farmer to consult their local procurement centre officer or check their portal records."
)

SYSTEM_INSTRUCTION_KN = (
    "ನೀವು Esy FARM ಸಹಾಯಕ (Esy FARM Assistant). ರೈತರಿಗೆ ಬೆಂಬಲ ಬೆಲೆ (MSP), ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್, ಡಿಜಿಟಲ್ ಟೋಕನ್‌ಗಳು, "
    "ಖರೀದಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಧಾನ್ಯ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮಾರ್ಗದರ್ಶನ ನೀಡುವ AI ಸಹಾಯಕ.\n"
    "ಕಡ್ಡಾಯ ನಿಯಮಗಳು:\n"
    "1. ಸರಳ, ವಿನಮ್ರ ಹಾಗೂ ರೈತಸ್ನೇಹಿ ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸಿ.\n"
    "2. ಕಡ್ಡಾಯವಾಗಿ ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರಿಸಿ.\n"
    "3. ಯಾವುದೇ ಕಾಲ್ಪನಿಕ MSP ದರಗಳು, ಸುಳ್ಳು ಯೋಜನೆಗಳು, ಲೈವ್ ಬುಕಿಂಗ್ ವಿವರಗಳು ಅಥವಾ ಖಾಸಗಿ ದಾಖಲೆಗಳನ್ನು ಸೃಷ್ಟಿಸಬೇಡಿ.\n"
    "4. Esy FARM ಒಂದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಎಂದು ಹೇಳಬೇಡಿ; ಇದು ರೈತರಿಗೆ ನೆರವಾಗುವ ಸ್ಮಾರ್ಟ್ ಪೋರ್ಟಲ್.\n"
    "5. ನಿರ್ದಿಷ್ಟ ಮಾಹಿತಿ ಅಥವಾ ಲೈವ್ ಡೇಟಾ ತಿಳಿದಿಲ್ಲದಿದ್ದರೆ, ಅದನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ ಸ್ಥಳೀಯ ಖರೀದಿ ಕೇಂದ್ರದ ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಲಹೆ ನೀಡಿ."
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Farmer user message")
    language: Literal["en", "kn"] = Field("en", description="Language preference ('en' or 'kn')")


class ChatResponse(BaseModel):
    reply: str = Field(..., description="Assistant response text")


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Farmer AI Chat Assistant",
    description="Conversational assistant endpoint for farmer procurement inquiries powered by Gemini.",
)
async def chat_endpoint(payload: ChatRequest):
    # Validate API key presence
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GEMINI_API_KEY is not configured on the backend server.",
        )

    try:
        # Initialize Google GenAI client
        client = genai.Client(api_key=GEMINI_API_KEY)

        # Select system instruction based on requested language
        system_instruction = (
            SYSTEM_INSTRUCTION_KN if payload.language == "kn" else SYSTEM_INSTRUCTION_EN
        )

        # Create chat session with configured model and system instructions
        chat_session = client.chats.create(
            model=GEMINI_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
            ),
        )

        response = chat_session.send_message(payload.message)
        reply_text = response.text or ""

        if not reply_text.strip():
            fallback_text = (
                "ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
                if payload.language == "kn"
                else "I apologize, I could not generate a response. Please try again."
            )
            return ChatResponse(reply=fallback_text)

        return ChatResponse(reply=reply_text.strip())

    except Exception as exc:
        # Safe error handling: never expose the API key in the response or traceback
        err_str = str(exc)
        if GEMINI_API_KEY and GEMINI_API_KEY in err_str:
            err_str = err_str.replace(GEMINI_API_KEY, "[REDACTED]")

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini AI Assistant error: {err_str}",
        )
