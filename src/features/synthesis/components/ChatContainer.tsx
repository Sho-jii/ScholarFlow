"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SynthesisMessage } from "../types";

interface ChatContainerProps {
  messages: SynthesisMessage[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading,
}: ChatContainerProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    await onSendMessage(msg);
  };

  return (
    <div className="flex flex-col h-[520px] md:h-[600px] max-h-[75vh] rounded-[28px] sm:rounded-[32px] border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0d1217]/50 backdrop-blur-xl shadow-xs overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold shadow-xs ${
                msg.sender === "user"
                  ? "bg-[#0d1217] text-white dark:bg-white dark:text-[#0d1217]"
                  : "bg-black/5 dark:bg-white/10 text-foreground border border-black/10 dark:border-white/10"
              }`}
            >
              {msg.sender === "user" ? <User className="size-4" /> : <Bot className="size-4 text-primary" />}
            </div>

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-[24px] px-4 py-3 text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-xs ${
                msg.sender === "user"
                  ? "bg-[#0d1217] text-white dark:bg-white dark:text-[#0d1217] rounded-tr-xs"
                  : "bg-white/90 dark:bg-card/70 border border-black/10 dark:border-white/10 text-foreground rounded-tl-xs backdrop-blur-xs"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-black/5 dark:bg-white/10 text-foreground border border-black/10 dark:border-white/10">
              <Bot className="size-4 text-primary" />
            </div>
            <div className="rounded-[24px] rounded-tl-xs bg-white/90 dark:bg-card/70 border border-black/10 dark:border-white/10 px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground shadow-xs">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>Socratic Coach is deliberating...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 md:p-4 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a synthesis inquiry or test anti-ghostwriting guardrails..."
          disabled={isLoading}
          className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full px-5 py-2.5 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() || isLoading}
          className="gap-1.5 px-5 rounded-full"
        >
          <Send className="size-3.5" />
          <span className="hidden sm:inline">Ask Coach</span>
        </Button>
      </form>
    </div>
  );
}
