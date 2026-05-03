import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { useUser } from './UserContext';
import { sendChatMessage } from './geminiService';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const Chat = () => {
  const { profile, todaySchedule } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: `Salam! I'm VoltWatch. Ask me anything about today's load shedding in ${profile?.area || 'your area'} or how to manage your appliances.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !profile) return;

    const userMsg = input.trim();
    setInput('');
    
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    const history = newMessages.map(m => ({ role: m.role, text: m.text }));
    
    const aiResponse = await sendChatMessage(userMsg, history, profile, todaySchedule);
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-volt-panel border border-volt-border rounded-2xl flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-volt-border flex items-center gap-3">
        <div className="bg-yellow-900/30 p-2 rounded-lg">
          <Bot className="w-5 h-5 text-volt-yellow" />
        </div>
        <div>
          <h2 className="text-white font-semibold">VoltWatch AI</h2>
          <p className="text-emerald-400 text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user' 
                    ? 'bg-volt-yellow text-black rounded-tr-sm' 
                    : 'bg-volt-dark border border-volt-border text-volt-text rounded-tl-sm'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-volt-dark border border-volt-border text-volt-muted rounded-2xl rounded-tl-sm px-5 py-3 flex gap-1">
                <span className="animate-bounce">.</span><span className="animate-bounce delay-100">.</span><span className="animate-bounce delay-200">.</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-volt-border">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AC, UPS, or schedule..."
            className="flex-1 bg-volt-dark border border-volt-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-volt-yellow transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-volt-yellow hover:bg-volt-yellowHover disabled:opacity-50 text-black p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
