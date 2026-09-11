import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Award, FileText } from "lucide-react";
import type { AuditReportData } from "../types";

export function AuditScoreCard({ report }: { report: AuditReportData }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-primary border-primary/40 bg-primary/10";
    if (score >= 60) return "text-warning border-warning/40 bg-warning/10";
    return "text-destructive border-destructive/40 bg-destructive/10";
  };

  return (
    <InsetCard className="p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Overall Readiness & Badges */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="gap-1">
              <ShieldCheck className="size-3.5" />
              DepEd Compliance Audit
            </Badge>

            {report.localContextDetected ? (
              <Badge variant="success" className="gap-1">
                <MapPin className="size-3.5" />
                Local Context Grounded
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <MapPin className="size-3.5" />
                Lacks Local Grounding
              </Badge>
            )}

            <Badge variant="secondary" className="gap-1">
              <Award className="size-3.5 text-primary" />
              Synthesis Grade: {report.synthesisGrade}
            </Badge>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">
            Structural Compliance & Alignment Score
          </h2>

          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            {report.summaryCritique}
          </p>
        </div>

        {/* Right: Score Gauge Box */}
        <div className="w-full md:w-auto shrink-0 flex items-center justify-center">
          <div
            className={`w-full sm:w-auto flex flex-col items-center justify-center rounded-[28px] border p-6 min-w-[160px] shadow-xs backdrop-blur-xs ${getScoreColor(
              report.readinessScore
            )}`}
          >
            <div className="font-display text-4xl md:text-5xl font-black text-metric">
              {report.readinessScore}%
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider mt-1.5 text-foreground/85">
              {report.readinessScore >= 80
                ? "Defense Ready"
                : report.readinessScore >= 60
                ? "Moderate Gaps"
                : "Critical Revisions"}
            </span>
          </div>
        </div>
      </div>
    </InsetCard>
  );
}
