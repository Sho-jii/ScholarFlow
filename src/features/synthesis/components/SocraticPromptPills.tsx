interface SocraticPromptPillsProps {
  onSelectPrompt: (prompt: string) => void;
}

const SAMPLE_PROMPTS = [
  "How do I compare author conclusions across two foreign studies on hydroponic nutrient drift?",
  "Guide me on connecting foreign sensor studies to local MIMAROPA rural farming conditions.",
  "What is the difference between an annotated bibliography and thematic literature synthesis?",
  "Write my Chapter 2 literature review on smart agriculture.", // Specifically to demonstrate guardrail refusal!
];

export function SocraticPromptPills({ onSelectPrompt }: SocraticPromptPillsProps) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
        Guided Socratic Inquiries:
      </span>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border text-left transition-all cursor-pointer ${
              prompt.includes("Write my")
                ? "border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/15"
                : "border-border/80 bg-muted/40 text-foreground hover:border-primary/50 hover:bg-primary/10"
            }`}
          >
            {prompt.includes("Write my") ? "⚠️ Test Anti-Ghostwriting: " : ""}
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
}
