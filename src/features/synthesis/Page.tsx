"use client";

import { useState } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { ContextWarningBanner } from "./components/ContextWarningBanner";
import { SocraticPromptPills } from "./components/SocraticPromptPills";
import { ChatContainer } from "./components/ChatContainer";
import type { SynthesisMessage } from "./types";

const INITIAL_MESSAGES: SynthesisMessage[] = [
  {
    id: "m1",
    sender: "model",
    content:
      "Mabuhay, researchers of Canubing National High School! I am your Socratic RRL Coach for Practical Research. I am here to question your assumptions, compare your reference papers, and help you ground foreign literature into Philippine municipal realities. Remember: I will never write or draft text for you. What literature concept or methodological comparison are we investigating today?",
    timestamp: "Just now",
  },
];

export function SynthesisFeaturePage() {
  const [messages, setMessages] = useState<SynthesisMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMsg: SynthesisMessage = {
      id: Date.now().toString(),
      sender: "user",
      content,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const botMsg: SynthesisMessage = {
        id: (Date.now() + 1).toString(),
        sender: "model",
        content: data.reply || "Let us examine that methodology from another perspective...",
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Graceful fallback response demonstrating Socratic refusal if offline
      const fallbackReply: SynthesisMessage = {
        id: (Date.now() + 1).toString(),
        sender: "model",
        content: content.toLowerCase().includes("write my")
          ? "I must decline this request under DepEd research integrity guidelines. I cannot draft or write literature review sections for you. Instead, let's explore: What specific variables from your Conceptual Framework are you trying to synthesize, and how do your author findings converge or diverge?"
          : "Consider how that author's sampling methodology compares to your target participants in Oriental Mindoro. Did the foreign study account for tropical humidity variations?",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Title */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Socratic RRL Synthesis Coach
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Module 4: Anti-ghostwriting dialogue guiding literature cross-analysis and local context grounding
          </p>
        </div>

        {/* Anti-Ghostwriting Notice */}
        <ContextWarningBanner />

        {/* Guided Prompts */}
        <SocraticPromptPills onSelectPrompt={(p) => void handleSendMessage(p)} />

        {/* Chat Interface */}
        <ChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}
