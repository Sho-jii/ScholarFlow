"use client";

import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuditScoreCard } from "./components/AuditScoreCard";
import { AlignmentMatrixTable } from "./components/AlignmentMatrixTable";
import { UploadDropzone } from "./components/UploadDropzone";
import { HelpCircle, Sparkles, RefreshCw, Upload, FileText, Loader2 } from "lucide-react";
import type { AuditReportData } from "./types";

export function AuditFeaturePage() {
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadLatestAudit = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/audit");
      const json = await res.json();
      if (json.data) {
        setReport(json.data);
      }
    } catch (err) {
      console.error("Failed to load audit from Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLatestAudit();
  }, [loadLatestAudit]);

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

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              className="gap-2 flex-1 sm:flex-initial"
            >
              <Upload className="size-3.5" />
              <span>{showUpload ? "Hide Upload" : "Upload New Draft"}</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void loadLatestAudit()}
              className="gap-1.5 flex-1 sm:flex-initial"
            >
              <RefreshCw className="size-3.5" />
              <span>Refresh Audit</span>
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

        {isLoading && !report ? (
          <InsetCard className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">
              Loading manuscript alignment audit from Supabase...
            </p>
          </InsetCard>
        ) : report ? (
          <>
            {/* Compliance & Score Overview Card */}
            <AuditScoreCard report={report} />

            {/* Alignment Matrix Cross-Map Table */}
            <AlignmentMatrixTable items={report.alignmentMatrix || []} />
          </>
        ) : null}

        {/* Pre-Defense Questions Generated from Detected Weaknesses */}
        {report && report.preDefenseQuestions && report.preDefenseQuestions.length > 0 && (
          <InsetCard className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Viva-Voce Questions Generated from Detected Weaknesses
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Oral defense questions automatically generated to probe the exact gaps detected above
                </p>
              </div>
              <Badge variant="default" className="self-start sm:self-auto">Module 5 Bridge</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {report.preDefenseQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/40 p-5 space-y-3 flex flex-col justify-between backdrop-blur-xs shadow-xs"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                      Targeted Flaw: {q.targetedWeakness}
                    </span>
                    <p className="font-semibold text-xs md:text-sm text-foreground leading-snug">
                      "{q.question}"
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-3 text-[11px] text-muted-foreground">
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
