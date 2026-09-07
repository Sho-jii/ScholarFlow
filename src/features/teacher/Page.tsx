"use client";

import { useState } from "react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionRiskHeatmap } from "./components/SectionRiskHeatmap";
import { DEMO_MANUSCRIPT_AUDIT } from "@/services/mock/fallbackData";
import { AlignmentMatrixTable } from "@/features/audit/components/AlignmentMatrixTable";
import { X, ExternalLink } from "lucide-react";
import type { CohortGroup } from "./types";

const INITIAL_COHORT: CohortGroup[] = [
  {
    id: "g1",
    groupNumber: 4,
    title: "Automated Solar-Powered Hydroponic Monitoring System in Calapan City",
    strand: "STEM",
    membersCount: 5,
    readinessScore: 84,
    synthesisGrade: "A",
    status: "DEFENSE_READY",
    unalignedItemsCount: 1,
    mockTurnsCount: 3,
    clearanceIssued: false,
  },
  {
    id: "g2",
    groupNumber: 2,
    title: "Lived Experiences of Senior High Students Balancing Academic Demands & Gig Work",
    strand: "HUMSS",
    membersCount: 4,
    readinessScore: 92,
    synthesisGrade: "A",
    status: "DEFENSE_READY",
    unalignedItemsCount: 0,
    mockTurnsCount: 5,
    clearanceIssued: true,
  },
  {
    id: "g3",
    groupNumber: 7,
    title: "Synthesizing Banana Pseudostem Fibers for Public Market Biodegradable Packaging",
    strand: "TVL-IA",
    membersCount: 4,
    readinessScore: 58,
    synthesisGrade: "C",
    status: "CRITICAL_GAPS",
    unalignedItemsCount: 3,
    mockTurnsCount: 1,
    clearanceIssued: false,
  },
];

export function TeacherFeaturePage() {
  const [selectedGroup, setSelectedGroup] = useState<CohortGroup | null>(null);

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

          <Badge variant="default">Adviser: Mrs. Carmela Reyes</Badge>
        </div>

        {/* Section Risk Heatmap Component */}
        <SectionRiskHeatmap
          groups={INITIAL_COHORT}
          onSelectGroup={(g) => setSelectedGroup(g)}
        />

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

            <AlignmentMatrixTable items={DEMO_MANUSCRIPT_AUDIT.alignmentMatrix} />
          </div>
        )}
      </div>
    </Layout>
  );
}
