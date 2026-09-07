"use client";

import Link from "next/link";
import {
  FileCheck2,
  Sparkles,
  Mic,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
} from "lucide-react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WorkspacePage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* ═══ HERO INSET CARD: Research Project Header ═══ */}
        <InsetCard className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default">12 - STEM Copernicus</Badge>
                <Badge variant="secondary">PR2 Quantitative</Badge>
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="size-3" />
                  Pre-Defense Eligible
                </Badge>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Development & Performance Evaluation of an Automated Solar-Powered
                Hydroponic Monitoring System in Calapan City
              </h2>

              <p className="text-xs md:text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" /> Group 4 (5 Members)
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-secondary" /> Submitted: Oct 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="size-3.5 text-accent" /> Chapters 1–3 Complete
                </span>
              </p>
            </div>

            {/* Overall Readiness Gauge */}
            <div className="flex shrink-0 items-center gap-4 rounded-3xl bg-muted/40 border border-border/70 p-4 md:p-5">
              <div className="text-center">
                <div className="font-display text-3xl md:text-4xl font-black text-primary text-metric">
                  84%
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-0.5">
                  Readiness Score
                </div>
              </div>
            </div>
          </div>

          {/* Action Pills */}
          <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-border/50">
            <Button asChild size="default" className="gap-2">
              <Link href="/audit">
                <FileCheck2 className="size-4" />
                <span>View Alignment Audit</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" size="default" className="gap-2">
              <Link href="/synthesis">
                <Sparkles className="size-4 text-primary" />
                <span>Open Socratic Coach</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="default" className="gap-2">
              <Link href="/defense">
                <Mic className="size-4 text-accent" />
                <span>Launch Viva-Voce</span>
              </Link>
            </Button>
          </div>
        </InsetCard>

        {/* ═══ 3-COLUMN METRIC TILES ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tile 1: Audit Matrix */}
          <InsetCard className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <FileCheck2 className="size-5" />
                </div>
                <Badge variant="warning" className="gap-1">
                  <AlertTriangle className="size-3" /> 1 Gap Detected
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Structural Alignment
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                4 Statement of the Problem items verified. SOP #3 (Water Salinity Level)
                lacks a corresponding question in Chapter 3 Survey Tool.
              </p>
            </div>

            <div className="pt-5 border-t border-border/40 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">SOP Cross-Map</span>
              <Link
                href="/audit"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Inspect Matrix <ArrowRight className="size-3" />
              </Link>
            </div>
          </InsetCard>

          {/* Tile 2: Socratic Literature Synthesis */}
          <InsetCard className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-2xl bg-secondary/25 text-foreground">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="size-3" /> Synthesis Grade: A
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Chapter 2 Synthesis
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Comparative synthesis detected across 6 reference studies. Grounded in
                Philippine local municipal climate data (Calapan City, Oriental Mindoro).
              </p>
            </div>

            <div className="pt-5 border-t border-border/40 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Anti-Ghostwriting</span>
              <Link
                href="/synthesis"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Chat Session <ArrowRight className="size-3" />
              </Link>
            </div>
          </InsetCard>

          {/* Tile 3: Viva-Voce Defense Simulation */}
          <InsetCard className="p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-2xl bg-accent/20 text-accent-foreground">
                  <Mic className="size-5 text-accent" />
                </div>
                <Badge variant="default">3 Mock Turns Completed</Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Oral Defense Readiness
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluated on Mastery (88/100) and Methodological Justification (82/100).
                Panelist challenged group on purposive sampling limitations.
              </p>
            </div>

            <div className="pt-5 border-t border-border/40 mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">AI Panelist</span>
              <Link
                href="/defense"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Start Rehearsal <ArrowRight className="size-3" />
              </Link>
            </div>
          </InsetCard>
        </div>

        {/* ═══ RESEARCH MILESTONES ═══ */}
        <InsetCard className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                DepEd SHS Research Milestones
              </h3>
              <p className="text-xs text-muted-foreground">
                Practical Research 2 timeline and teacher sign-off criteria
              </p>
            </div>
            <Badge variant="outline">Semester 1 • Cycle 2</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-muted/30 border border-border/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Milestone 1
                </span>
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">
                Title & SOP Defense
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Approved by Advisory Committee
              </p>
            </div>

            <div className="rounded-2xl bg-muted/30 border border-border/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Milestone 2
                </span>
                <CheckCircle2 className="size-4 text-success" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">
                Chapter 2 RRL Synthesis
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Anti-ghostwriting cleared (Grade A)
              </p>
            </div>

            <div className="rounded-2xl bg-primary/10 border border-primary/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Milestone 3 (Active)
                </span>
                <Badge variant="default" className="text-[9px] px-1.5 py-0">In Review</Badge>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">
                Structural Audit (Ch 1–3)
              </h4>
              <p className="text-[11px] text-muted-foreground">
                1 Instrument item to align
              </p>
            </div>

            <div className="rounded-2xl bg-muted/20 border border-dashed border-border/80 p-4 space-y-2 opacity-60">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Milestone 4
                </span>
                <span className="text-xs">🔒</span>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">
                Formal Proposal Defense
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Unlocks after clearance badge
              </p>
            </div>
          </div>
        </InsetCard>
      </div>
    </Layout>
  );
}
