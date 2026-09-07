import { GraduationCap, Volume2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PanelistAvatarProps {
  isSpeaking: boolean;
  onReplayQuestion?: () => void;
}

export function PanelistAvatar({ isSpeaking, onReplayQuestion }: PanelistAvatarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-[32px] border border-border/80 bg-muted/30">
      {/* Avatar Icon with Speaking Pulse */}
      <div className="relative">
        <div
          className={`grid size-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-md transition-all ${
            isSpeaking ? "ring-4 ring-primary/40 scale-105" : ""
          }`}
        >
          <GraduationCap className="size-10" />
        </div>
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full size-4 bg-accent"></span>
          </span>
        )}
      </div>

      {/* Persona Details */}
      <div className="space-y-1.5 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Badge variant="default">AI Panel Chair</Badge>
          <Badge variant="secondary">Methodology & Sampling</Badge>
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">
          Dr. Aris Thorne (Research Committee)
        </h3>
        <p className="text-xs text-muted-foreground max-w-md">
          Probing unoperationalized variables, sampling power trade-offs, and local data collection constraints.
        </p>
      </div>

      {/* Audio Playback Pill */}
      {onReplayQuestion && (
        <button
          type="button"
          onClick={onReplayQuestion}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer"
          title="Replay spoken question"
        >
          <Volume2 className="size-3.5 text-primary" />
          <span>{isSpeaking ? "Speaking..." : "Replay Question"}</span>
        </button>
      )}
    </div>
  );
}
