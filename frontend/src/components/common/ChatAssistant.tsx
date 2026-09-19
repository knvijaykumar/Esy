import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, RotateCcw, Sparkles } from 'lucide-react';
import { chatService } from '../../services/chatService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isFallback?: boolean;
}

const SUGGESTED_QUESTIONS_EN = [
  'What is MSP?',
  'How do I book a slot?',
  'How does the digital token work?',
  'How do I find my procurement centre?',
  'What is the MSP for my crop?',
];

const SUGGESTED_QUESTIONS_KN = [
  'ಬೆಂಬಲ ಬೆಲೆ (MSP) ಎಂದರೇನು?',
  'ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡುವುದು ಹೇಗೆ?',
  'ಡಿಜಿಟಲ್ ಟೋಕನ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?',
  'ನನ್ನ ಖರೀದಿ ಕೇಂದ್ರವನ್ನು ಹೇಗೆ ಹುಡುಕುವುದು?',
  'ನನ್ನ ಬೆಳೆಗೆ MSP ದರ ಎಷ್ಟು?',
];

const WELCOME_EN =
  "Namaste! 👋\nI'm the Esy FARM Assistant. I can help you understand MSP rates, procurement slot booking, tokens, procurement centres, and your procurement journey.";

const WELCOME_KN =
  "ನಮಸ್ಕಾರ! 👋\nನಾನು Esy FARM ಸಹಾಯಕ. ಬೆಂಬಲ ಬೆಲೆ (MSP) ದರಗಳು, ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್, ಟೋಕನ್‌ಗಳು, ಖರೀದಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ನಿಮ್ಮ ಧಾನ್ಯ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.";

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getInitialMessages = (lang: 'en' | 'kn'): ChatMessage[] => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: lang === 'kn' ? WELCOME_KN : WELCOME_EN,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages('en'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on message change or loading state change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleLanguageToggle = (newLang: 'en' | 'kn') => {
    if (newLang === language) return;
    setLanguage(newLang);
    // If only the welcome message exists, update it to the selected language
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages(getInitialMessages(newLang));
    }
  };

  const handleClearChat = () => {
    setMessages(getInitialMessages(language));
    setInputMessage('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === undefined) {
      setInputMessage('');
    }
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: query,
        language,
      });

      const assistantMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: false,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'kn'
            ? 'AI ಸಹಾಯಕ ಸಂಪರ್ಕಗೊಳ್ಳುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.'
            : 'AI Assistant is being connected. Please try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = language === 'kn' ? SUGGESTED_QUESTIONS_KN : SUGGESTED_QUESTIONS_EN;

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        id="esy-farm-chat-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="esy-farm-chat-panel"
        aria-label="Ask Esy FARM"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 990,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          backgroundColor: 'var(--color-primary, #15803d)',
          color: '#ffffff',
          border: '1.5px solid #166534',
          borderRadius: '9999px',
          padding: '0.75rem 1.25rem',
          fontSize: '0.95rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary-dark, #166534)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-primary, #15803d)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Bot size={16} color="#ffffff" />
        </span>
        <span>Ask Esy FARM</span>
      </button>

      {/* Modern Responsive Chat Panel */}
      {isOpen && (
        <div
          id="esy-farm-chat-panel"
          role="dialog"
          aria-label="Esy FARM Assistant"
          className="esy-chat-panel"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.5rem',
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '540px',
            maxHeight: 'calc(100vh - 7rem)',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
            border: '1px solid var(--color-border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 995,
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              backgroundColor: 'var(--color-primary, #15803d)',
              color: '#ffffff',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #166534',
            }}
          >
            {/* Header Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.2 }}>
                  Esy FARM Assistant
                </div>
                <div style={{ fontSize: '0.75rem', color: '#dcfce7', fontWeight: 500 }}>
                  Your procurement guide
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {/* Language Switcher: English | ಕನ್ನಡ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '2px',
                }}
              >
                <button
                  onClick={() => handleLanguageToggle('en')}
                  style={{
                    border: 'none',
                    background: language === 'en' ? '#ffffff' : 'transparent',
                    color: language === 'en' ? '#15803d' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="Switch to English"
                >
                  English
                </button>
                <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.7rem' }}>|</span>
                <button
                  onClick={() => handleLanguageToggle('kn')}
                  style={{
                    border: 'none',
                    background: language === 'kn' ? '#ffffff' : 'transparent',
                    color: language === 'kn' ? '#15803d' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.85,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
                title={language === 'kn' ? 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ' : 'Clear chat'}
                aria-label="Clear chat"
              >
                <RotateCcw size={16} />
              </button>

              {/* Close/Minimize Button */}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.85,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 0.95rem',
                    borderRadius:
                      msg.sender === 'user'
                        ? '14px 14px 3px 14px'
                        : '14px 14px 14px 3px',
                    backgroundColor: msg.sender === 'user' ? '#15803d' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                  }}
                >
                  {/* Separate Fallback Label for Transparency */}
                  {msg.isFallback && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#d97706',
                        backgroundColor: '#fffbeb',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        marginBottom: '0.4rem',
                        border: '1px solid #fef3c7',
                      }}
                    >
                      <Sparkles size={11} />
                      <span>{language === 'kn' ? 'ಗಮನಿಸಿ' : 'System Notice'}</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#94a3b8',
                    marginTop: '0.2rem',
                    padding: '0 0.3rem',
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Suggested Question Chips (Show when only initial message is present) */}
            {messages.length === 1 && !isLoading && (
              <div style={{ marginTop: '0.25rem' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#64748b',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {language === 'kn' ? 'ಸಲಹೆ ನೀಡಲಾದ ಪ್ರಶ್ನೆಗಳು:' : 'Suggested Questions:'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {suggestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(question)}
                      style={{
                        textAlign: 'left',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        color: '#1e293b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#15803d';
                        e.currentTarget.style.backgroundColor = '#f0fdf4';
                        e.currentTarget.style.color = '#15803d';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#1e293b';
                      }}
                    >
                      💬 {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0' }}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px 14px 14px 3px',
                    padding: '0.6rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <span className="esy-dot" style={{ animationDelay: '0ms' }} />
                  <span className="esy-dot" style={{ animationDelay: '180ms' }} />
                  <span className="esy-dot" style={{ animationDelay: '360ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div
            style={{
              padding: '0.75rem 0.85rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                language === 'kn'
                  ? 'ಖರೀದಿ ಬಗ್ಗೆ ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...'
                  : 'Ask a question about procurement...'
              }
              aria-label="Type your message"
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                fontSize: '0.88rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#15803d')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              aria-label="Send message"
              style={{
                backgroundColor: !inputMessage.trim() || isLoading ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (inputMessage.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Typing animation style */}
      <style>{`
        .esy-dot {
          width: 7px;
          height: 7px;
          background-color: #64748b;
          border-radius: 50%;
          display: inline-block;
          animation: esy-bounce 1.2s infinite ease-in-out;
        }
        @keyframes esy-bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 480px) {
          .esy-chat-panel {
            width: calc(100vw - 1.5rem) !important;
            right: 0.75rem !important;
            bottom: 4.8rem !important;
            height: calc(100vh - 6.5rem) !important;
          }
        }
      `}</style>
    </>
  );
};
