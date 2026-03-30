import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Clock, AlertTriangle, Mic, MicOff, Globe, Volume2, VolumeX, Play, Square } from 'lucide-react';
import axios from 'axios';
import { cn } from '../../utils/tw';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  isUrgent?: boolean;
  recommendedAction?: string | null;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export default function ChatbotInterface() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [isAutoSpeak, setIsAutoSpeak] = useState(true);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopSpeaking = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setCurrentlySpeaking(null);
  }, []);

  const speak = useCallback((text: string, messageId?: string) => {
    if (!window.speechSynthesis) return;
    
    // If already speaking this message, stop it
    if (currentlySpeaking === messageId && messageId) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any current speech
    
    // Add a short delay to ensure the previous speech is fully cancelled
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Map language to BCP 47 tags
      const langMap: Record<string, string> = {
        'English': 'en-US',
        'Swahili': 'sw-KE',
        'Luo': 'en-KE'
      };
      utterance.lang = langMap[selectedLanguage] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      if (messageId) {
        setCurrentlySpeaking(messageId);
        utterance.onend = () => setCurrentlySpeaking(null);
        utterance.onerror = () => setCurrentlySpeaking(null);
      }

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [currentlySpeaking, selectedLanguage, stopSpeaking]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    setUserInteracted(true);
    const userText = textToSend;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages((prev: Message[]) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.post(`${baseUrl}/chat/message`, 
        {
          message: userText,
          history,
          language: selectedLanguage
        },
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.data.reply || "I'm sorry, I couldn't process that request.",
        timestamp: response.data.timestamp ? new Date(response.data.timestamp) : new Date(),
        isUrgent: response.data.isUrgent,
        recommendedAction: response.data.recommendedAction
      };
      
      setMessages((prev: Message[]) => [...prev, botMsg]);
      if (isAutoSpeak) {
        speak(botMsg.text, botMsg.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
        isUrgent: false
      };
      setMessages((prev: Message[]) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages, token, selectedLanguage, isAutoSpeak, speak]);

  useEffect(() => {
    if (user && messages.length === 0) {
      const initialText = `Hello ${user.name.split(' ')[0]}! I'm your maternal care assistant. How are you feeling today? You can log symptoms, ask questions about your pregnancy, or check your upcoming milestones.`;
      const initialId = '1';
      setMessages([
        {
          id: initialId,
          sender: 'bot',
          text: initialText,
          timestamp: new Date()
        }
      ]);
      
      // Auto-speak initial message only if user has interacted (to comply with browser policy)
      // Since this is mount, we likely don't have interaction yet.
      if (isAutoSpeak && userInteracted) {
        speak(initialText, initialId);
      }
    }
  }, [user, isAutoSpeak, speak, messages.length, userInteracted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const Win = window as unknown as { 
      SpeechRecognition: new () => SpeechRecognition; 
      webkitSpeechRecognition: new () => SpeechRecognition; 
    };
    const SpeechRecognition = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        // Auto-send if it's a clear command
        if (transcript.length > 2) {
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsVoiceSupported(false);
    }
  }, [handleSend]);

  const toggleListening = () => {
    if (!isVoiceSupported) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
      return;
    }

    stopSpeaking(); // Stop bot from talking if user starts talking
    setUserInteracted(true);
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-maternal-200 flex flex-col overflow-hidden max-w-4xl mx-auto w-full h-[calc(100vh-12rem)] min-h-[500px]">
      <div className="p-4 border-b border-maternal-100 bg-maternal-50 flex items-center gap-3">
        <div className="bg-maternal-600 p-2 rounded-xl text-white">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-maternal-900">Care Assistant</h2>
          <p className="text-xs text-maternal-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Online • Powered by AI
          </p>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <button 
            onClick={() => setIsAutoSpeak(!isAutoSpeak)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isAutoSpeak ? "bg-maternal-100 text-maternal-600" : "bg-gray-100 text-gray-400"
            )}
            title={isAutoSpeak ? "Auto-speak enabled" : "Auto-speak disabled"}
          >
            {isAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-2 border-l border-maternal-200 pl-4">
            <Globe className="w-4 h-4 text-maternal-400" />
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white border border-maternal-200 rounded-lg px-2 py-1 text-xs font-semibold text-maternal-700 outline-none focus:ring-1 focus:ring-maternal-500"
            >
              <option value="English">English</option>
              <option value="Swahili">Kiswahili</option>
              <option value="Luo">Dholuo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1",
              msg.sender === 'user' ? "bg-maternal-200 text-maternal-700" : "bg-maternal-600 text-white"
            )}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className="flex flex-col gap-1 w-full">
              <div className={cn(
                "p-4 rounded-2xl shadow-sm leading-relaxed",
                msg.sender === 'user' 
                  ? "bg-maternal-600 text-white rounded-tr-none" 
                  : msg.isUrgent 
                    ? "bg-red-50 text-red-900 border border-red-200 rounded-tl-none font-medium"
                    : "bg-white text-maternal-800 border border-maternal-100 rounded-tl-none"
              )}>
                {msg.isUrgent && (
                  <div className="flex flex-col gap-2 mb-3 border-b border-red-200/50 pb-3">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-bold uppercase tracking-wide">Urgent Medical Alert</span>
                    </div>
                    {msg.recommendedAction && (
                      <div className="bg-red-100 p-3 rounded-lg text-red-900 text-sm font-semibold border border-red-200 shadow-sm animate-pulse">
                        Recommended Action: {msg.recommendedAction}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-between items-start gap-4">
                  <div className="whitespace-pre-wrap flex-1">{msg.text}</div>
                  {msg.sender === 'bot' && (
                    <button 
                      onClick={() => speak(msg.text, msg.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-all flex-shrink-0",
                        currentlySpeaking === msg.id 
                          ? "bg-maternal-100 text-maternal-600" 
                          : "hover:bg-maternal-50 text-maternal-400"
                      )}
                      title={currentlySpeaking === msg.id ? "Stop reading" : "Read aloud"}
                    >
                      {currentlySpeaking === msg.id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    </button>
                  )}
                </div>
              </div>
              <span className={cn(
                "text-[11px] text-maternal-400 flex items-center gap-1 px-1",
                msg.sender === 'user' ? "justify-end" : ""
              )}>
                <Clock className="w-3 h-3" />
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-maternal-100">
        <div className="flex gap-3 max-w-4xl mx-auto items-end">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe your symptoms or ask a question..." 
            className="flex-1 min-h-[3rem] max-h-32 rounded-2xl border border-maternal-200 px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:border-transparent resize-none leading-relaxed text-maternal-900 shadow-sm placeholder:text-maternal-400"
            rows={1}
          />
          <button 
            onClick={toggleListening}
            className={cn(
              "rounded-2xl p-3.5 transition-all shadow-sm mb-0.5",
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-maternal-50 text-maternal-600 hover:bg-maternal-100"
            )}
            title={isListening ? "Stop listening" : "Voice message"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-maternal-600 hover:bg-maternal-700 disabled:bg-maternal-300 disabled:cursor-not-allowed text-white rounded-2xl p-3.5 transition-all shadow-sm mb-0.5"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-xs text-maternal-400 mt-3 font-medium">
           This AI assistant provides general information, not professional medical advice.
        </p>
      </div>
    </div>
  );
}
