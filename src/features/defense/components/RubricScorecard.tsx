import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import type { DefenseEvaluation } from "../types";

export function RubricScorecard({
  evaluation,
  onAcceptFollowup,
}: {
  evaluation: DefenseEvaluation;
  onAcceptFollowup?: (q: string) => void;
}) {
  return (
    <InsetCard className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Oral Defense Evaluation & Feedback
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Graded against DepEd Senior High School viva-voce rubrics
          </p>
        </div>
        <Badge variant="success">Turn Evaluated</Badge>
      </div>

      {/* Two Score Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
            Domain Mastery & Content Grasp
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-primary text-metric">
              {evaluation.masteryScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Fluency in explaining research rationale and variables.
          </p>
        </div>

        <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-accent-foreground font-semibold">
            Methodological Justification
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-accent-foreground text-metric">
              {evaluation.justificationScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ability to defend sampling compromises and instrument validity.
          </p>
        </div>
      </div>

      {/* Constructive Verbal Critique */}
      <div className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          Panelist Constructive Critique
        </span>
        <p className="text-xs md:text-sm text-foreground leading-relaxed">
          {evaluation.evaluatorFeedback}
        </p>
      </div>

      {/* Follow-up Question */}
      {evaluation.nextFollowupQuestion && (
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <MessageSquare className="size-4" />
            <span>Panel Follow-Up Press</span>
          </div>
          <p className="font-semibold text-xs md:text-sm text-foreground">
            "{evaluation.nextFollowupQuestion}"
          </p>
          {onAcceptFollowup && (
            <button
              type="button"
              onClick={() => onAcceptFollowup(evaluation.nextFollowupQuestion)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <span>Take This Follow-Up Question</span>
              <ArrowRight className="size-3" />
            </button>
          )}
        </div>
      )}
    </InsetCard>
  );
}
