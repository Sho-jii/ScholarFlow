"use client";

import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/layout";
import { ContextWarningBanner } from "./components/ContextWarningBanner";
import { SocraticPromptPills } from "./components/SocraticPromptPills";
import { ChatContainer } from "./components/ChatContainer";
import { PastSessionsSidebar } from "./components/PastSessionsSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, History, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { SynthesisMessage, SynthesisSessionItem } from "./types";

const DEFAULT_WELCOME_MESSAGE: SynthesisMessage = {
  id: "welcome",
  sender: "model",
  content:
    "Greetings, researcher! I am your AxiomProof Socratic Literature Synthesis Coach. I guide your literature review through comparative inquiry, conceptual framework alignment, and contextual grounding. Remember: I will never draft or write text for your manuscript. What literature concept or methodological comparison are we investigating today?",
  timestamp: "Just now",
};

export function SynthesisFeaturePage() {
  const [sessions, setSessions] = useState<SynthesisSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionTopic, setActiveSessionTopic] = useState<string>("Socratic Synthesis Inquiry");
  const [messages, setMessages] = useState<SynthesisMessage[]>([DEFAULT_WELCOME_MESSAGE]);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(true);
  const [isLoadingMessage, setIsLoadingMessage] = useState<boolean>(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState<boolean>(false);

  // Load all past sessions
  const fetchSessions = useCallback(async () => {
    try {
      setIsLoadingSessions(true);
      const res = await fetch("/api/synthesis/sessions");
      const data = await res.json();
      if (data.sessions) {
        setSessions(data.sessions);
        return data.sessions as SynthesisSessionItem[];
      }
    } catch (err) {
      console.error("Failed to fetch synthesis sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
    return [];
  }, []);

  // Load messages for a specific session
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      setIsLoadingMessage(true);
      const res = await fetch(`/api/synthesis/sessions/${sessionId}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setActiveSessionId(sessionId);
        if (data.session?.topic) {
          setActiveSessionTopic(data.session.topic);
        }
      } else {
        setMessages([DEFAULT_WELCOME_MESSAGE]);
        setActiveSessionId(sessionId);
      }
    } catch (err) {
      console.error("Failed to load session messages:", err);
      toast.error("Could not load past conversation");
    } finally {
      setIsLoadingMessage(false);
    }
  }, []);

  // Initial load: fetch sessions and load the first active one
  useEffect(() => {
    async function init() {
      const loaded = await fetchSessions();
      if (loaded.length > 0) {
        await loadSessionMessages(loaded[0].id);
      }
    }
    void init();
  }, [fetchSessions, loadSessionMessages]);

  const handleSelectSession = (id: string) => {
    setIsMobileHistoryOpen(false);
    void loadSessionMessages(id);
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setActiveSessionTopic("New Socratic Discussion");
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setIsMobileHistoryOpen(false);
    toast.info("Started a new Socratic discussion. Ask a question to begin recording.");
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/synthesis/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        handleNewSession();
      }
      toast.success("Chat session deleted");
    } catch (err) {
      toast.error("Failed to delete session");
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: SynthesisMessage = {
      id: Date.now().toString(),
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingMessage(true);

    try {
      const res = await fetch("/api/synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.slice(-4),
          sessionId: activeSessionId,
        }),
      });

      const data = await res.json();
      const botReply = data.reply || "Let us examine that methodology from another perspective...";

      const botMsg: SynthesisMessage = {
        id: (Date.now() + 1).toString(),
        sender: "model",
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If a new session was created in Supabase, track it
      if (data.sessionId && data.sessionId !== activeSessionId) {
        setActiveSessionId(data.sessionId);
        if (data.topic) setActiveSessionTopic(data.topic);
        void fetchSessions();
      } else {
        // Update snippet in sessions list
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  lastSnippet: botReply.slice(0, 100) + "...",
                  messageCount: s.messageCount + 2,
                  updatedAt: new Date().toISOString(),
                }
              : s
          )
        );
      }
    } catch {
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
      setIsLoadingMessage(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Socratic RRL Synthesis Coach
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Module 4: Anti-ghostwriting dialogue guiding literature cross-analysis and local context grounding
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMobileHistoryOpen(!isMobileHistoryOpen)}
              className="lg:hidden rounded-full text-xs gap-1.5"
            >
              <History className="size-3.5" />
              <span>Past Chats ({sessions.length})</span>
            </Button>

            <Badge variant="default" className="gap-1.5 py-1 px-3">
              <Sparkles className="size-3 text-primary" />
              <span className="truncate max-w-[200px]">{activeSessionTopic}</span>
            </Badge>
          </div>
        </div>

        {/* Anti-Ghostwriting Integrity Guardrail */}
        <ContextWarningBanner />

        {/* Guided Prompts Pills */}
        <SocraticPromptPills onSelectPrompt={(p) => void handleSendMessage(p)} />

        {/* Main Interface: Two-Column with Past Chats Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Past Socratic Chat Sessions (3 cols on desktop) */}
          <div className={`lg:col-span-4 ${isMobileHistoryOpen ? "block" : "hidden lg:block"}`}>
            <PastSessionsSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              isLoading={isLoadingSessions}
            />
          </div>

          {/* Right Column: Chat Dialogue (8 cols on desktop) */}
          <div className="lg:col-span-8 w-full">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingMessage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
