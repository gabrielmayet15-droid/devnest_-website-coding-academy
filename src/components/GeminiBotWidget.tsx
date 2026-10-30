import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Code2, 
  HelpCircle, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  RotateCcw,
  Loader2
} from 'lucide-react';

interface GeminiBotWidgetProps {
  currentPlaygroundCode?: string;
  onNavigateTab: (tab: string) => void;
  externalPrompt?: { prompt: string; code?: string; timestamp: number } | null;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How do I rank up to Silver League?',
  'How do I join a Google Meet class?',
  'Explain Flexbox justify-content',
  'Review my current Playground code',
  'How do I add hover effects in CSS?',
];

export const GeminiBotWidget: React.FC<GeminiBotWidgetProps> = ({
  currentPlaygroundCode,
  onNavigateTab,
  externalPrompt,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I'm **Byte**, your DevNest coding assistant! 🚀\n\nAsk me anything about building websites, debugging HTML/CSS/JS, joining Google Meet live workshops, or leveling up your league rank!",
      timestamp: 'Just now',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle external prompt requests (e.g. from "Ask Byte AI Review" button in Playground)
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      sendQuery(externalPrompt.prompt, externalPrompt.code);
    }
  }, [externalPrompt]);

  const sendQuery = async (queryText: string, codeContext?: string) => {
    if (!queryText.trim() && !codeContext) return;

    const userMsg: MessageItem = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          contextCode: codeContext || currentPlaygroundCode,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "I'm here to help you code! Could you clarify your question?";

      const botMsg: MessageItem = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: MessageItem = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: "Here is your quick coding tip: ensure all HTML container tags are closed properly, class names in CSS match your elements, and test in the live playground! What would you like to build next? 🚀",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendQuery(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Byte Gemini AI Coding Assistant"
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all group focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div className="text-left">
            <div className="font-extrabold text-xs flex items-center gap-1">
              <span>Ask Byte AI</span>
              <Sparkles className="w-3 h-3 text-yellow-300 animate-spin" />
            </div>
            <div className="text-[10px] text-indigo-100 font-medium">
              Coding Support & Guide
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 border-2 border-white dark:border-slate-900 animate-pulse" />
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div 
          role="region"
          aria-label="Byte AI Chatbot"
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-[360px] sm:w-[420px] h-[560px] flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>Byte AI Tutor</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                    Gemini 3.8
                  </span>
                </div>
                <div className="text-[11px] text-indigo-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Instant Coding & Site Support</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Byte AI Chat"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendQuery(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30 dark:bg-slate-900/30 text-xs">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';

              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    isBot ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}>
                    {isBot ? '🤖' : '👤'}
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 max-w-[85%] leading-relaxed ${
                      isBot
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none shadow-sm'
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    <div className={`text-[9px] mt-1.5 ${isBot ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Byte is typing coding advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about HTML, CSS, JavaScript, or DevNest..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
