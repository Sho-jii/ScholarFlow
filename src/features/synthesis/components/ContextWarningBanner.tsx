import { ShieldAlert, Sparkles } from "lucide-react";

export function ContextWarningBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-foreground">
      <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <span className="font-bold text-primary">DepEd Anti-Ghostwriting Guardrail Active:</span>
        <p className="text-muted-foreground leading-relaxed">
          The Socratic Coach guides critical inquiry, thematic comparisons, and local Philippine
          grounding. It will politely refuse prompts requesting generated literature reviews or
          written paragraphs on your behalf.
        </p>
      </div>
    </div>
  );
}
