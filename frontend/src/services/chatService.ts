/**
 * AI Chat Assistant Service
 * 
 * Connects frontend to the FastAPI backend POST /api/chat endpoint.
 * Includes direct Gemini REST API fallback so farmer questions are answered
 * even when the local backend server is not running.
 */

export interface ChatRequest {
  message: string;
  language: 'en' | 'kn';
}

export interface ChatResponse {
  reply: string;
}

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6LPXw0jHJXmcH3xqHZYMaT8xiOVYWlPQOHekOI0IiGbYw';

const SYSTEM_INSTRUCTION_EN =
  'You are the Esy FARM Assistant, a helpful and respectful AI guide for farmers using the Esy FARM procurement platform.\n' +
  'Your purpose is to help farmers understand Minimum Support Price (MSP), procurement slot booking, digital tokens, ' +
  'procurement centres, and the overall procurement journey.\n' +
  'Rules:\n' +
  '1. Speak in simple, warm, polite, and farmer-friendly language.\n' +
  '2. Respond in English.\n' +
  '3. Do NOT invent specific false MSP values or fake personal bookings.\n' +
  '4. Keep answers concise, actionable, and clear.';

const SYSTEM_INSTRUCTION_KN =
  'ನೀವು Esy FARM ಸಹಾಯಕ (Esy FARM Assistant). ರೈತರಿಗೆ ಬೆಂಬಲ ಬೆಲೆ (MSP), ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್, ಡಿಜಿಟಲ್ ಟೋಕನ್‌ಗಳು, ' +
  'ಖರೀದಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಧಾನ್ಯ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಸರಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮಾರ್ಗದರ್ಶನ ನೀಡುವ AI ಸಹಾಯಕ.\n' +
  'ಕಡ್ಡಾಯ ನಿಯಮಗಳು:\n' +
  '1. ಸರಳ, ವಿನಮ್ರ ಹಾಗೂ ರೈತಸ್ನೇಹಿ ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರಿಸಿ.\n' +
  '2. ಕಡ್ಡಾಯವಾಗಿ ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರಿಸಿ.\n' +
  '3. ಕಾಲ್ಪನಿಕ ದರಗಳು ಅಥವಾ ಸುಳ್ಳು ಖಾಸಗಿ ದಾಖಲೆಗಳನ್ನು ಸೃಷ್ಟಿಸಬೇಡಿ.\n' +
  '4. ಸ್ಪಷ್ಟ, ಸರಳ ಮತ್ತು ನೇರ ಉತ್ತರ ನೀಡಿ.';

class ChatService {
  private readonly baseUrl: string =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  /**
   * Sends user prompt to the FastAPI AI chat assistant endpoint (POST /api/chat).
   * Falls back to direct Gemini API if backend is unavailable.
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // 1. Try Backend endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: ChatResponse = await response.json();
        if (data.reply && data.reply.trim().length > 0) {
          return data;
        }
      }
    } catch {
      // Backend not running or timeout; proceed to direct fallback
    }

    // 2. Direct Gemini REST API Fallback
    try {
      const systemInstruction =
        request.language === 'kn' ? SYSTEM_INSTRUCTION_KN : SYSTEM_INSTRUCTION_EN;
      const models = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash'];

      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemInstruction}\n\nFarmer question: ${request.message}` }],
                },
              ],
            }),
          });

          if (res.ok) {
            const resJson = await res.json();
            const reply = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return { reply: reply.trim() };
            }
          }
        } catch {
          // Try next model
        }
      }
    } catch (err) {
      console.warn('Direct Gemini chat fallback error:', err);
    }

    // Default friendly response
    return {
      reply:
        request.language === 'kn'
          ? 'ನಮಸ್ಕಾರ! Esy FARM ಪೋರ್ಟಲ್‌ನಲ್ಲಿ MSP ದರಗಳು, ಸ್ಲಾಟ್ ಬುಕಿಂಗ್ ಅಥವಾ ಕೇಂದ್ರದ ವಿವರಗಳಿಗಾಗಿ ನೀವು ಮೆನುವಿನ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಬಹುದು ಅಥವಾ ಸ್ಥಳೀಯ ಖರೀದಿ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.'
          : 'Hello! You can use the Esy FARM portal to check MSP prices, book delivery slots, and track procurement tokens. Please feel free to ask any questions about the process!',
    };
  }

  getEndpoint(): string {
    return `${this.baseUrl}/api/chat`;
  }
}

export const chatService = new ChatService();
