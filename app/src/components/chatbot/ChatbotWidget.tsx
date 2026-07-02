'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Droplet } from 'lucide-react';
import axios from 'axios';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: 'Welcome to Zamra Water Plant Portal. How can I assist you with inventory, sales, or operational data today?',
      isBot: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const cleanInput = textToSend.trim();
    if (!cleanInput) return;

    setMessages((prev) => [...prev, { text: cleanInput, isBot: false }]);
    if (textToSend === input) setInput('');

    setIsTyping(true);
    try {
      const response = await axios.post('/api/chatbot', {
        message: cleanInput,
      });
      const replyText =
        response.data?.text ||
        'Response profile linked with NestJS /rag/query inference.';

      setMessages((prev) => [...prev, { text: replyText, isBot: true }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Failed to connect to the server. Please try again.',
          isBot: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans antialiased selection:bg-blue-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer focus:ring-4 focus:ring-blue-500/40 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-85 sm:w-[400px] h-[550px] bg-white border border-slate-200/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          <div className="bg-blue-900 px-5 py-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-blue-600/10 rounded-xl border border-blue-500/20">
                <Droplet className="h-5 w-5 text-blue-400 fill-blue-400/20" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm tracking-wide text-slate-100">
                  Zamra Water Plant
                </h4>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  AI Assistant Copilot
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2.5 ${msg.isBot ? 'justify-start' : 'justify-end space-x-reverse'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    msg.isBot
                      ? 'bg-white text-slate-800 border border-slate-200/60 rounded-tl-xs'
                      : 'bg-blue-600 text-white rounded-tr-xs font-medium'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start justify-start space-x-2.5">
                <div className="bg-white border border-slate-200/60 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-200/60 flex items-center space-x-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder="Ask anything about business records..."
              className="flex-1 bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-xs rounded-xl px-4 py-3 border border-slate-200/80 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all duration-200"
            />
            <button
              onClick={() => handleSendMessage(input)}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 focus:outline-none cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
