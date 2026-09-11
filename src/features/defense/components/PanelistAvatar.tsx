import { GraduationCap, Volume2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PanelistAvatarProps {
  isSpeaking: boolean;
  onReplayQuestion?: () => void;
}

export function PanelistAvatar({ isSpeaking, onReplayQuestion }: PanelistAvatarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-6 rounded-[28px] sm:rounded-[32px] border border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/40 backdrop-blur-md shadow-xs">
      {/* Avatar Icon with Speaking Pulse */}
      <div className="relative shrink-0">
        <div
          className={`grid size-18 sm:size-20 place-items-center rounded-3xl bg-[#0d1217] text-white dark:bg-white dark:text-[#0d1217] shadow-sm transition-all duration-300 ${
            isSpeaking ? "ring-4 ring-primary/40 scale-105" : ""
          }`}
        >
          <GraduationCap className="size-9 sm:size-10" />
        </div>
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full size-4 bg-accent"></span>
          </span>
        )}
      </div>

      {/* Persona Details */}
      <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
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
          className="flex items-center gap-1.5 rounded-full px-4 py-2 border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 hover:bg-[#0d1217] hover:text-white dark:hover:bg-white dark:hover:text-[#0d1217] text-xs font-semibold text-foreground transition-all duration-300 cursor-pointer shadow-xs shrink-0"
          title="Replay spoken question"
        >
          <Volume2 className="size-3.5" />
          <span>{isSpeaking ? "Speaking..." : "Replay Question"}</span>
        </button>
      )}
    </div>
  );
}
