'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, MessageSquare, Send, Sparkles, X } from 'lucide-react';
import axios from 'axios';

type ChatMessage = {
  id: number;
  text: string;
  isBot: boolean;
  failed?: boolean;
};

const GREETING: ChatMessage = {
  id: 0,
  isBot: true,
  text: 'Hi — I can answer questions about your inventory, pricing, sales and operational records. What would you like to know?',
};

/** Starter prompts so the empty panel suggests what it is actually good for. */
const SUGGESTIONS = [
  'How much stock did we produce today?',
  'What is our current profit margin?',
  'Which bottle size sells the most?',
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [isOpen, close]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;

    setMessages((current) => [
      ...current,
      { id: nextId.current++, text: question, isBot: false },
    ]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(
        '/api/chatbot',
        { message: question },
        { headers: { 'x-skip-api-toast': 'true' } }
      );

      const reply =
        response.data?.answer ||
        response.data?.message ||
        'I could not find an answer for that.';

      setMessages((current) => [
        ...current,
        { id: nextId.current++, text: reply, isBot: true },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          isBot: true,
          failed: true,
          text: 'I could not reach the assistant service. Please check your connection and try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const showSuggestions = messages.length === 1 && !isTyping;

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Zamra assistant"
          className="mb-3 flex h-[min(32rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] animate-fade-in-up flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-pop sm:w-[23rem]"
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-line bg-marine-950 px-4 py-3">
            <span className="relative flex size-9 items-center justify-center rounded-field bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25">
              <Bot className="size-[1.1rem]" />
              <span
                className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-success ring-2 ring-marine-950"
                aria-hidden
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                Zamra Assistant
              </p>
              <p className="truncate text-2xs text-marine-300">
                Answers from your plant records
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              className="flex size-8 items-center justify-center rounded-md text-marine-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-canvas px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-card px-3.5 py-2.5 text-xs leading-relaxed ${
                    message.isBot
                      ? message.failed
                        ? 'border border-danger/25 bg-danger-soft text-danger-ink'
                        : 'border border-line bg-surface text-ink-soft'
                      : 'bg-brand-600 text-brand-fg'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <span
                  className="flex items-center gap-1 rounded-card border border-line bg-surface px-3.5 py-3"
                  aria-label="Assistant is typing"
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-1.5 animate-bounce rounded-full bg-ink-faint"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            ) : null}

            {showSuggestions ? (
              <div className="space-y-1.5 pt-1">
                <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wide text-ink-faint">
                  <Sparkles className="size-3" /> Try asking
                </p>
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="block w-full rounded-field border border-line bg-surface px-3 py-2 text-left text-xs text-ink-soft transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex shrink-0 items-center gap-2 border-t border-line bg-surface p-3"
          >
            <label htmlFor="chatbot-input" className="sr-only">
              Ask the assistant
            </label>
            <div className="field-shell h-10 min-h-0">
              <input
                id="chatbot-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about stock, sales, profit…"
                autoComplete="off"
                className="field-input py-0 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
              className="btn btn-primary size-10 shrink-0 p-0"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        className={`flex size-14 items-center justify-center rounded-full shadow-pop transition-all duration-200 hover:scale-105 active:scale-95 ${
          isOpen
            ? 'bg-marine-950 text-white'
            : 'bg-brand-600 text-brand-fg hover:bg-brand-700'
        }`}
      >
        {isOpen ? (
          <X className="size-5" />
        ) : (
          <MessageSquare className="size-5" />
        )}
      </button>
    </div>
  );
}
