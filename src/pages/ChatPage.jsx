import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext.jsx';
import { getAppLanguage } from '../i18n/index.js';
import { generateChatbotResponse, SPEECH_LANG_MAP } from '../logic/chatbotEngine.js';

const API_BASE = 'http://127.0.0.1:8000';
import {
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';

export function ChatPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    profile,
    optimization,
    applications,
    documents,
    checklist,
    triggerToast
  } = useApp();

  const currentLang = getAppLanguage() || 'en';
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [aiBackendActive, setAiBackendActive] = useState(false);
  const [lastAiSource, setLastAiSource] = useState(null); // 'backend' | 'local'

  // Speech recognition reference
  const recognitionRef = useRef(null);

  // Initial welcome message
  const getInitialMessages = () => {
    const welcome = generateChatbotResponse({
      query: 'hello',
      language: currentLang,
      profile,
      optimization,
      applications,
      documents,
      checklist
    });

    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('optimaldbt_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return getInitialMessages();
  });

  // Save conversation in session
  useEffect(() => {
    try {
      sessionStorage.setItem('optimaldbt_chat_history', JSON.stringify(messages));
    } catch { }
  }, [messages]);

  // Auto-scroll to bottom when messages update or typing
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_MAP[currentLang] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputQuery(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setSpeechError(t('chat.voiceUnsupported'));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      recognitionRef.current = null;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch { }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentLang, t]);

  // Handle Voice Input Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError(t('chat.voiceUnsupported'));
      triggerToast(t('chat.voiceUnsupported'), 'warning');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch { }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.lang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
        setSpeechError(t('chat.voiceUnsupported'));
      }
    }
  };

  // Handle Text-To-Speech Output
  const toggleSpeak = (messageId, text) => {
    if (!('speechSynthesis' in window)) {
      triggerToast('Speech synthesis not supported on this device', 'warning');
      return;
    }

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for clearer audio reading
    const cleanText = text
      .replace(/[#*_`~>-]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try to find a matched voice for the language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setCurrentlySpeakingId(messageId);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle Message Submission — wired to POST /voice-assistant for mic-triggered queries
  const handleSendMessage = async (textToSend = inputQuery, fromMic = false) => {
    const query = (textToSend || '').trim();
    if (!query || isTyping) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
      setIsListening(false);
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setSpeechError(null);
    setIsTyping(true);

    // ─── Try POST /voice-assistant (backend AI) first — mic queries get Gemini response
    let responseText = null;
    const isMicQuery = fromMic || isListening;

    if (isMicQuery || true) { // always try backend first for demo
      try {
        const res = await fetch(`${API_BASE}/voice-assistant`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            farmer_name: profile.name,
            land_acres: profile.landholdingAcres || 4.5,
            state: profile.state || 'Madhya Pradesh',
            annual_income: profile.annualIncome || 140000,
            language: currentLang
          })
        });
        if (res.ok) {
          const data = await res.json();
          responseText = data.ai_response;
          setAiBackendActive(true);
          setLastAiSource('backend');
        }
      } catch {
        // Backend offline — fall through to local engine
        setLastAiSource('local');
      }
    }

    // Fallback: local chatbot engine
    if (!responseText) {
      responseText = generateChatbotResponse({
        query,
        language: currentLang,
        profile,
        optimization,
        applications,
        documents,
        checklist
      });
      setLastAiSource('local');
    }

    // Natural assistant thinking delay
    setTimeout(() => {
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
    const initial = getInitialMessages();
    setMessages(initial);
    sessionStorage.removeItem('optimaldbt_chat_history');
    triggerToast(t('chat.clearedToast') || 'Chat history cleared', 'info');
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    triggerToast(t('chat.copiedToast') || 'Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Action Buttons
  const quickActions = [
    { key: 'eligibility', text: t('chat.prompts.eligibility') || 'Check my eligibility', icon: Sparkles },
    { key: 'schemes', text: t('chat.prompts.schemes') || 'Find schemes for me', icon: Layers },
    { key: 'whyRejected', text: t('chat.prompts.whyRejected') || 'Why was this scheme rejected?', icon: ShieldCheck },
    { key: 'documents', text: t('chat.prompts.documents') || 'What documents do I need?', icon: FileText },
    { key: 'recommendation', text: t('chat.prompts.recommendation') || 'Explain my recommendation', icon: HelpCircle },
    { key: 'track', text: t('chat.prompts.track') || 'Track my application', icon: ArrowLeft }
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-4.5rem)] bg-slate-50 relative overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-slate-200/90 px-3 py-2.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-900 via-emerald-800 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-black text-slate-900 truncate">
                {t('chat.title') || 'OptimalDBT AI Assistant'}
              </h1>
              {lastAiSource === 'backend' ? (
                <span className="badge-gov-green text-[9px] py-0 px-1.5 animate-pulse">Gemini ✓</span>
              ) : (
                <span className="badge-gov-green text-[9px] py-0 px-1.5">AI</span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              {profile?.name} • {profile?.landholdingAcres || 4.5} Acres
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigate('/language')}
            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 active:scale-95 transition-all"
            aria-label="Change Language"
          >
            {currentLang.toUpperCase()}
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all"
            title={t('chat.clearChat') || 'Clear conversation'}
            aria-label={t('chat.clearChat') || 'Clear conversation'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Voice Listening Pulse Bar (Active when recording) */}
      {isListening && (
        <div className="bg-emerald-700 text-white px-4 py-2 flex items-center justify-between animate-fade-in shadow-md z-10">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1 items-center">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <span className="text-xs font-bold tracking-wide">
              {t('chat.listening') || 'Listening...'} ({currentLang.toUpperCase()})
            </span>
          </div>
          <button
            onClick={toggleListening}
            className="text-[11px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full active:scale-95 transition-all"
          >
            {t('chat.tapToStop') || 'Tap to Stop'}
          </button>
        </div>
      )}

      {/* Voice Unsupported Alert */}
      {speechError && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-amber-900 text-[11px] animate-fade-in">
          <div className="flex items-center space-x-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate">{speechError}</span>
          </div>
          <button
            onClick={() => setSpeechError(null)}
            className="text-amber-800 font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 no-scrollbar">

        {/* Context Banner */}
        <div className="bg-emerald-900/5 border border-emerald-800/15 rounded-2xl p-2.5 flex items-center justify-between text-emerald-950">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold truncate">
                {t('chat.connectedProfile', {
                  name: profile?.name || 'Farmer',
                  land: profile?.landholdingAcres || 4.5,
                  state: profile?.state || 'Madhya Pradesh'
                }) || `Profile: ${profile?.name} (${profile?.landholdingAcres} Acres)`}
              </p>
              <p className="text-[10px] text-emerald-800 truncate">
                {t('chat.dbtPotential', {
                  amount: `₹${(optimization?.totalBenefit || 234500).toLocaleString('en-IN')}`
                }) || `DBT Potential: ₹${(optimization?.totalBenefit || 234500).toLocaleString('en-IN')}/yr`}
              </p>
            </div>
          </div>
          <span className="badge-gov-green text-[9px] shrink-0">
            {profile?.socialCategory || 'OBC'}
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const isSpeaking = currentlySpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 animate-fade-in ${isAssistant ? 'justify-start' : 'justify-end'
                }`}
            >
              {isAssistant && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-900 to-amber-500 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </div>
              )}

              <div
                className={`max-w-[86%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs space-y-2 ${isAssistant
                    ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm'
                    : 'bg-emerald-800 text-white rounded-tr-sm shadow-emerald-900/10'
                  }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-line break-words font-medium">
                  {msg.text}
                </div>

                {/* Footer bar with timestamp & actions */}
                <div
                  className={`flex items-center justify-between pt-1 border-t text-[10px] ${isAssistant
                      ? 'border-slate-100 text-slate-400'
                      : 'border-emerald-700/60 text-emerald-200'
                    }`}
                >
                  <span>{msg.timestamp}</span>

                  <div className="flex items-center space-x-1.5">
                    {isAssistant && (
                      <>
                        {/* Text-to-speech speaker button */}
                        <button
                          onClick={() => toggleSpeak(msg.id, msg.text)}
                          className={`p-1 rounded-md transition-all active:scale-90 ${isSpeaking
                              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400 font-bold'
                              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                            }`}
                          aria-label={
                            isSpeaking
                              ? t('chat.speakerStopAria') || 'Stop speech'
                              : t('chat.speakerAria') || 'Read aloud'
                          }
                          title={
                            isSpeaking
                              ? t('chat.speakerStopAria') || 'Stop speech'
                              : t('chat.speakerAria') || 'Read aloud'
                          }
                        >
                          {isSpeaking ? (
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-700" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all active:scale-90"
                          aria-label={t('chat.copyAria') || 'Copy message'}
                          title={t('chat.copyAria') || 'Copy message'}
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-2 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-900 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        {/* Quick Suggestion Prompts */}
        {messages.length <= 2 && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
              {t('chat.quickPrompts') || 'Suggested Questions'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickActions.map(action => (
                <button
                  key={action.key}
                  onClick={() => handleSendMessage(action.text)}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 text-xs font-semibold shadow-2xs flex items-center space-x-1.5 active:scale-95 transition-all text-left"
                >
                  <action.icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Pinned above bottom navigation with safe-area spacing) */}
      <div className="bg-white border-t border-slate-200/90 p-2 sm:p-3 relative z-20 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end space-x-1.5"
        >
          {/* Voice input button */}
          <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? t('chat.micStop') || 'Stop microphone' : t('chat.micStart') || 'Voice input'}
            title={isListening ? t('chat.micStop') || 'Stop microphone' : t('chat.micStart') || 'Voice input'}
            className={`p-3 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-150 active:scale-90 ${isListening
                ? 'bg-red-600 text-white shadow-md ring-4 ring-red-200 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 animate-bounce" />
            ) : (
              <Mic className="w-5 h-5 text-emerald-800" />
            )}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              rows="1"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder') || 'Ask about schemes, eligibility, documents...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-3.5 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white resize-none max-h-24 transition-all"
              style={{ minHeight: '44px' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            aria-label={t('chat.sendAria') || 'Send message'}
            title={t('chat.sendAria') || 'Send message'}
            className={`p-3 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-150 active:scale-95 ${inputQuery.trim() && !isTyping
                ? 'bg-emerald-800 text-white shadow-md hover:bg-emerald-900 ring-2 ring-emerald-600/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
}

export default ChatPage;
