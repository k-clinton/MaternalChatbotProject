import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { cn } from '../../utils/tw';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  isUrgent?: boolean;
}

export default function ChatbotInterface() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user) {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: `Hello ${user.name.split(' ')[0]}! I'm your maternal care assistant. How are you feeling today? You can log symptoms, ask questions about your pregnancy, or check your upcoming milestones.`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
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
          history
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
        isUrgent: response.data.isUrgent
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having trouble connecting to the server. Please try again later.",
        timestamp: new Date(),
        isUrgent: false
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
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
                  <div className="flex items-center gap-2 text-red-700 mb-2 border-b border-red-200/50 pb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wide">Urgent Medical Alert</span>
                  </div>
                )}
                {msg.text}
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
            onClick={handleSend}
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
