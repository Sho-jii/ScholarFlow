"use client";

import { useState } from "react";
import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Mic,
  Award,
  Users,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { CohortGroup } from "../types";

interface SectionRiskHeatmapProps {
  groups: CohortGroup[];
  onSelectGroup: (group: CohortGroup) => void;
}

export function SectionRiskHeatmap({ groups, onSelectGroup }: SectionRiskHeatmapProps) {
  const [cohort, setCohort] = useState<CohortGroup[]>(groups);

  const handleIssueClearance = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCohort((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, clearanceIssued: true } : g
      )
    );
    toast.success("Digital Defense Clearance Badge successfully issued!");
  };

  const readyCount = cohort.filter((g) => g.status === "DEFENSE_READY").length;
  const moderateCount = cohort.filter((g) => g.status === "MODERATE_GAPS").length;
  const criticalCount = cohort.filter((g) => g.status === "CRITICAL_GAPS").length;

  return (
    <div className="space-y-6">
      {/* 3-Column Cohort Health Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InsetCard className="p-5 border-primary/40 bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Defense Ready (80–100%)
            </span>
            <ShieldCheck className="size-4 text-primary" />
          </div>
          <div className="font-display text-3xl font-black text-primary text-metric mt-2">
            {readyCount} <span className="text-xs font-normal text-muted-foreground">Groups</span>
          </div>
        </InsetCard>

        <InsetCard className="p-5 border-warning/40 bg-warning/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-warning">
              Moderate Gaps (60–79%)
            </span>
            <AlertTriangle className="size-4 text-warning" />
          </div>
          <div className="font-display text-3xl font-black text-warning text-metric mt-2">
            {moderateCount} <span className="text-xs font-normal text-muted-foreground">Groups</span>
          </div>
        </InsetCard>

        <InsetCard className="p-5 border-destructive/40 bg-destructive/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-destructive">
              Critical Gaps (&lt;60%)
            </span>
            <XCircle className="size-4 text-destructive" />
          </div>
          <div className="font-display text-3xl font-black text-destructive text-metric mt-2">
            {criticalCount} <span className="text-xs font-normal text-muted-foreground">Groups</span>
          </div>
        </InsetCard>
      </div>

      {/* Cohort Groups Table / Cards */}
      <InsetCard className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Active Section Research Groups (12 - STEM Copernicus)
            </h3>
            <p className="text-xs text-muted-foreground">
              Click any research team to inspect detected misalignment matrices and oral transcripts
            </p>
          </div>
          <Badge variant="outline">DepEd Adviser Portal</Badge>
        </div>

        <div className="space-y-3">
          {cohort.map((group) => (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="text-[10px]">
                    Group {group.groupNumber}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {group.strand}
                  </Badge>
                  {group.clearanceIssued && (
                    <Badge variant="success" className="gap-1 text-[10px]">
                      <CheckCircle className="size-3" />
                      Clearance Issued
                    </Badge>
                  )}
                </div>

                <h4 className="font-display font-bold text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {group.title}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5 text-muted-foreground" /> {group.membersCount} Students
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck2 className="size-3.5 text-primary" /> {group.unalignedItemsCount} Gaps
                  </span>
                  <span className="flex items-center gap-1">
                    <Mic className="size-3.5 text-accent" /> {group.mockTurnsCount} Mock Turns
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="size-3.5 text-secondary" /> RRL: {group.synthesisGrade}
                  </span>
                </div>
              </div>

              {/* Right: Score & Clearance Action */}
              <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                <div className="text-right">
                  <div className="font-display text-2xl md:text-3xl font-black text-metric text-primary">
                    {group.readinessScore}%
                  </div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Readiness
                  </span>
                </div>

                {!group.clearanceIssued ? (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={(e) => handleIssueClearance(group.id, e)}
                    className="rounded-full text-xs gap-1.5"
                  >
                    <ShieldCheck className="size-3.5" />
                    <span>Issue Clearance</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="rounded-full text-xs text-success border-success/40 bg-success/10 gap-1.5"
                  >
                    <CheckCircle className="size-3.5 text-success" />
                    <span>Cleared for Defense</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </InsetCard>
    </div>
  );
}
