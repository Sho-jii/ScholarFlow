"use client";

import { MessageSquare, Plus, Trash2, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SynthesisSessionItem } from "../types";

interface PastSessionsSidebarProps {
  sessions: SynthesisSessionItem[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  isLoading: boolean;
}

export function PastSessionsSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isLoading,
}: PastSessionsSidebarProps) {
  return (
    <div className="flex flex-col h-[520px] md:h-[600px] max-h-[75vh] rounded-[28px] sm:rounded-[32px] border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#0d1217]/50 backdrop-blur-xl p-4 space-y-4 overflow-hidden shadow-xs">
      {/* Top Header & New Session Button */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="size-3.5" />
            </div>
            <h3 className="font-display font-bold text-sm text-foreground">
              Past Socratic Chats
            </h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {sessions.length}
          </Badge>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onNewSession}
          className="w-full rounded-full gap-1.5 text-xs font-semibold shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>New Discussion</span>
        </Button>
      </div>

      {/* Sessions Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {sessions.map((s) => {
          const isActive = s.id === activeSessionId;
          const formattedDate = new Date(s.updatedAt).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`group relative flex flex-col p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left space-y-1.5 shadow-xs ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-black/10 dark:border-white/10 bg-white/80 dark:bg-card/40 hover:border-black/30 dark:hover:border-white/30 text-foreground backdrop-blur-xs"
              }`}
            >
              {/* Topic Title */}
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`font-semibold text-xs line-clamp-1 leading-snug ${
                    isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                  }`}
                >
                  {s.topic}
                </h4>
                <button
                  type="button"
                  onClick={(e) => onDeleteSession(s.id, e)}
                  title="Delete chat session"
                  className="opacity-0 group-hover:opacity-100 hover:text-destructive text-muted-foreground transition-opacity p-0.5 rounded"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>

              {/* Last Message Snippet */}
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {s.lastSnippet}
              </p>

              {/* Footer: Date & Message Count */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                <span className="flex items-center gap-1">
                  <Clock className="size-2.5" />
                  {formattedDate}
                </span>
                <span className="font-semibold text-muted-foreground">
                  {s.messageCount} msg{s.messageCount === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          );
        })}

        {sessions.length === 0 && !isLoading && (
          <div className="py-12 text-center text-xs text-muted-foreground px-4 space-y-2">
            <Sparkles className="size-5 mx-auto text-muted-foreground/60" />
            <p>No past synthesis sessions found.</p>
            <p className="text-[10px]">Start an inquiry to begin recording your Socratic journey.</p>
          </div>
        )}

        {isLoading && (
          <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
            Loading past discussions...
          </div>
        )}
      </div>
    </div>
  );
}
