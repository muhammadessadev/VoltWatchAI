import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { UserProfile, ScheduleSlot, ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface Props {
  profile: UserProfile;
  schedule: ScheduleSlot[];
  upsHours: number;
}

export const AIChat: React.FC<Props> = ({ profile, schedule, upsHours }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Salam! I'm VoltWatch. Ask me anything about today's load shedding in ${profile.area || profile.city} or how to manage your appliances.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendChatMessage(userMsg.text, profile, schedule, upsHours);
    
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-dark-900 rounded-2xl border border-dark-700 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-dark-800 p-4 border-b border-dark-700 flex items-center">
        <div className="bg-electric-500/20 p-2 rounded-full mr-3">
          <Bot className="w-5 h-5 text-electric-400" />
        </div>
        <div>
          <h2 className="text-white font-medium">VoltWatch AI</h2>
          <p className="text-xs text-emerald-400">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              msg.role === 'user' 
                ? 'bg-electric-600 text-white rounded-tr-sm' 
                : 'bg-dark-800 border border-dark-700 text-slate-200 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl rounded-tl-sm p-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-electric-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-800 border-t border-dark-700">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AC, UPS, or schedule..."
            className="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-electric-500 hover:bg-electric-400 disabled:bg-dark-700 disabled:text-slate-500 text-dark-950 p-3 rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
