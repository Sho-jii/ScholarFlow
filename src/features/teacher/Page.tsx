"use client";

import { useState, useEffect } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionRiskHeatmap } from "./components/SectionRiskHeatmap";
import { AlignmentMatrixTable } from "@/features/audit/components/AlignmentMatrixTable";
import { X, Loader2 } from "lucide-react";
import type { CohortGroup } from "./types";

export function TeacherFeaturePage() {
  const [cohort, setCohort] = useState<CohortGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<CohortGroup | null>(null);

  useEffect(() => {
    async function loadCohort() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/teacher/cohort");
        const data = await res.json();
        if (data.cohort) {
          setCohort(data.cohort);
        }
      } catch (err) {
        console.error("Failed to load teacher cohort:", err);
      } finally {
        setIsLoading(false);
      }
    }
    void loadCohort();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Teacher Advisory & Cohort Risk Heatmap
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Module 6: Manage research section cohorts, audit detected misalignments, and issue digital defense clearances
            </p>
          </div>

          <Badge variant="default">Research Adviser Portal</Badge>
        </div>

        {/* Section Risk Heatmap Component */}
        {isLoading ? (
          <InsetCard className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">
              Loading research cohort risk metrics from Supabase...
            </p>
          </InsetCard>
        ) : (
          <SectionRiskHeatmap
            groups={cohort}
            onSelectGroup={(g) => setSelectedGroup(g)}
          />
        )}

        {/* Inspection Panel for Selected Group */}
        {selectedGroup && (
          <div className="space-y-4 pt-4 border-t border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Audit Inspection: Group {selectedGroup.groupNumber} ({selectedGroup.strand})
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedGroup.title}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedGroup(null)}
                className="rounded-full"
              >
                <X className="size-4 mr-1" /> Close Inspection
              </Button>
            </div>

            <AlignmentMatrixTable items={selectedGroup.alignmentMatrix || []} />
          </div>
        )}
      </div>
    </Layout>
  );
}

