import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToPuter, PuterResponse } from '../services/puterService';

interface ExtendedChatMessage extends ChatMessage {
  isError?: boolean;
}

interface ChatBubbleProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClose, isOpen }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    { role: 'model', text: "Ready to design systems. Ask me anything." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setIsLoading(true);

    const newHistory: ExtendedChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);

    // Convert to ChatMessage format for the service (without isError)
    const historyForService: ChatMessage[] = messages.map(m => ({ role: m.role, text: m.text }));
    const response: PuterResponse = await sendMessageToPuter(historyForService, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response.text, isError: response.isError }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed sm:absolute bottom-16 sm:bottom-full mb-0 sm:mb-4 right-0 left-0 sm:left-auto w-full sm:w-80 md:w-96 mx-auto sm:mx-0 max-w-[95vw] sm:max-w-none bg-black/95 sm:bg-black/80 backdrop-blur-xl border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[200] animate-in fade-in slide-in-from-bottom-5 duration-200 h-[60vh] sm:h-auto">
      
      {/* Header */}
      <div className="bg-white/5 p-3 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <Bot size={12} className="text-black" />
          </div>
          <span className="text-white font-bold text-xs tracking-wide">SYSTEM AI</span>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 h-48 sm:h-64 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white text-black' 
                : msg.isError 
                  ? 'bg-red-900/50 text-red-300 border border-red-700'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700">
              <Loader2 size={12} className="animate-spin text-zinc-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-black/20 border-t border-white/5">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};