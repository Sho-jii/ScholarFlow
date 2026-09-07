"use client";

import { useState } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_MANUSCRIPT_AUDIT } from "@/services/mock/fallbackData";
import { AuditScoreCard } from "./components/AuditScoreCard";
import { AlignmentMatrixTable } from "./components/AlignmentMatrixTable";
import { UploadDropzone } from "./components/UploadDropzone";
import { HelpCircle, Sparkles, RefreshCw, Upload, FileText } from "lucide-react";
import type { AuditReportData } from "./types";

export function AuditFeaturePage() {
  const [report, setReport] = useState<AuditReportData>(DEMO_MANUSCRIPT_AUDIT as AuditReportData);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Manuscript Alignment Audit
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Deterministic verification between Chapter 1 problem statements and Chapter 3 gathering tools
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              className="gap-2"
            >
              <Upload className="size-3.5" />
              <span>{showUpload ? "Hide Upload" : "Upload New Draft"}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReport(DEMO_MANUSCRIPT_AUDIT as AuditReportData)}
              className="gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              <span>Reset to Demo</span>
            </Button>
          </div>
        </div>

        {/* Optional Upload Area */}
        {showUpload && (
          <UploadDropzone
            onAuditComplete={(newReport) => {
              setReport(newReport);
              setShowUpload(false);
            }}
          />
        )}

        {/* Compliance & Score Overview Card */}
        <AuditScoreCard report={report} />

        {/* Alignment Matrix Cross-Map Table */}
        <AlignmentMatrixTable items={report.alignmentMatrix} />

        {/* Pre-Defense Questions Generated from Detected Weaknesses */}
        {report.preDefenseQuestions && report.preDefenseQuestions.length > 0 && (
          <InsetCard className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Viva-Voce Questions Generated from Detected Weaknesses
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Oral defense questions automatically generated to probe the exact gaps detected above
                </p>
              </div>
              <Badge variant="default">Module 5 Bridge</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {report.preDefenseQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/70 bg-card/60 p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                      Targeted Flaw: {q.targetedWeakness}
                    </span>
                    <p className="font-semibold text-xs md:text-sm text-foreground leading-snug">
                      "{q.question}"
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground">
                    <span className="font-bold text-foreground">Rubric Guide: </span>
                    {q.rubricGuide}
                  </div>
                </div>
              ))}
            </div>
          </InsetCard>
        )}
      </div>
    </Layout>
  );
}
