"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Layout } from "@/layout";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AxiomMark } from "@/components/brand/AxiomLogo";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function WorkspacePage() {
  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 max-w-[1440px] mx-auto"
      >
        {/* Top Breadcrumb & Website Return Pill */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <AxiomMark size={15} className="text-primary" />
            <span className="font-display font-bold text-foreground uppercase tracking-wider">AxiomProof System</span>
            <span>/</span>
            <span className="font-medium text-foreground/80">Research Workspace</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-white hover:bg-black dark:bg-[#12161a] dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-4 py-1.5 text-xs font-semibold transition-all duration-300 shadow-2xs select-none"
          >
            <Globe className="size-3.5 text-current" />
            <span>Public Website</span>
            <ArrowUpRight className="size-3 text-current" />
          </Link>
        </motion.div>

        {/* ═══ HERO INSET CARD: Research Project Header ═══ */}
        <motion.div variants={itemVariants}>
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-white dark:bg-[#0a0f13] border border-black/10 dark:border-white/10 shadow-xs transition-colors">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="rounded-full text-[11px] font-semibold px-3 py-1">
                    12 - STEM Archimedes
                  </Badge>
                  <Badge variant="secondary" className="rounded-full text-[11px] font-semibold px-3 py-1">
                    PR2 Quantitative
                  </Badge>
                  <Badge variant="success" className="gap-1.5 rounded-full text-[11px] font-semibold px-3 py-1">
                    <ShieldCheck className="size-3.5" />
                    Pre-Defense Eligible
                  </Badge>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                  Automated Solar-Powered Hydroponic Monitoring System in Calapan City
                </h2>

                <p className="text-xs sm:text-sm text-foreground/70 flex flex-wrap items-center gap-x-5 gap-y-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" /> Group 4: John Mark Santos & Alyssa Nicole Ramos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-secondary" /> Academic Year 2026–2027
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="size-3.5 text-accent" /> Chapters 1–3 Complete
                  </span>
                </p>
              </div>

              {/* Overall Readiness Gauge */}
              <div className="flex shrink-0 items-center justify-between sm:justify-start gap-5 rounded-2xl bg-[#f8f9fa] dark:bg-[#12161a] border border-black/10 dark:border-white/10 p-5 sm:p-6 shadow-2xs self-start lg:self-auto w-full sm:w-auto">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                    Defense Readiness
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    High Empirical Rigor
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl sm:text-4xl font-black text-foreground text-metric">
                    84%
                  </div>
                </div>
              </div>
            </div>

            {/* Action Pills with Website Invert Hover Behavior */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 pt-6 border-t border-black/10 dark:border-white/10">
              <Link
                href="/audit"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-black hover:bg-white dark:bg-white dark:hover:bg-black text-white hover:text-black dark:text-black dark:hover:text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none w-full sm:w-auto"
              >
                <FileCheck2 className="size-4 text-current" />
                <span>View Alignment Audit</span>
                <ArrowRight className="size-3.5 text-current transition-transform group-hover/btn:translate-x-1" />
              </Link>

              <Link
                href="/synthesis"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-white hover:bg-black dark:bg-[#12161a] dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none w-full sm:w-auto"
              >
                <Sparkles className="size-4 text-primary group-hover/btn:text-current" />
                <span>Open Socratic Coach</span>
                <ArrowRight className="size-3.5 text-current transition-transform group-hover/btn:translate-x-1" />
              </Link>

              <Link
                href="/defense"
                className="group/btn inline-flex items-center justify-center gap-2 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-white hover:bg-black dark:bg-[#12161a] dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none w-full sm:w-auto"
              >
                <Mic className="size-4 text-accent group-hover/btn:text-current" />
                <span>Launch Viva-Voce Rehearsal</span>
                <ArrowRight className="size-3.5 text-current transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ═══ 3-COLUMN METRIC TILES ═══ */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tile 1: Audit Matrix */}
          <div className="group p-6 sm:p-7 flex flex-col justify-between space-y-6 rounded-2xl bg-white dark:bg-[#0a0f13] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FileCheck2 className="size-5" />
                </div>
                <Badge variant="warning" className="gap-1 rounded-full text-[10px] font-semibold">
                  <AlertTriangle className="size-3" /> 1 Gap Detected
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Structural Alignment
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                3 Statement of the Problem items verified. SOP #3 (EC Sensor Drift) has missing statistical tests in Chapter 3.
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground text-metric">91% Triangulation</span>
              <Link href="/audit" className="group-hover:translate-x-0.5 text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-transform">
                <span>Inspect Audit</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Tile 2: Socratic Coach */}
          <div className="group p-6 sm:p-7 flex flex-col justify-between space-y-6 rounded-2xl bg-white dark:bg-[#0a0f13] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-secondary/20 text-foreground">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <Badge variant="outline" className="rounded-full text-[10px] font-semibold">
                  4 Literature Matrices
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Socratic Literature Coach
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                4 local & international studies synthesized. Anti-ghostwriting guard active with step-by-step critical inquiry.
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground text-metric">0 Ungrounded Claims</span>
              <Link href="/synthesis" className="group-hover:translate-x-0.5 text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-transform">
                <span>Continue Coach</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Tile 3: Viva-Voce Defense */}
          <div className="group p-6 sm:p-7 flex flex-col justify-between space-y-6 rounded-2xl bg-white dark:bg-[#0a0f13] border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-all duration-300 shadow-xs hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-xl bg-accent/20 text-accent-foreground">
                  <Mic className="size-5 text-primary" />
                </div>
                <Badge variant="success" className="rounded-full text-[10px] font-semibold">
                  Last Session: 82%
                </Badge>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground">
                Viva-Voce Mock Defense
              </h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                Rehearse before a 3-agent faculty panel: Subject Matter Expert, Methodologist, and Panel Chair.
              </p>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground text-metric">3 Oral Drill Sessions</span>
              <Link href="/defense" className="group-hover:translate-x-0.5 text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-transform">
                <span>Start Defense</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ═══ RESEARCH MILESTONE ROADMAP ═══ */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-display text-lg font-bold text-foreground">
              Research Defense Milestones
            </h3>
            <span className="text-xs text-muted-foreground font-medium">3 of 4 Completed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">01</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">Manuscript Upload</h4>
              <p className="text-xs text-foreground/60">Chapters 1–3 uploaded and parsed.</p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">02</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">Methodology Audit</h4>
              <p className="text-xs text-foreground/60">Triangulation completed with 1 gap flagged.</p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">03</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">Literature Synthesis</h4>
              <p className="text-xs text-foreground/60">Comparative matrices aligned to SOPs.</p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl border-2 border-primary/40 bg-primary/5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary">04</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-white">
                  Next Step
                </span>
              </div>
              <h4 className="font-display text-sm font-bold text-foreground">Live Mock Defense</h4>
              <p className="text-xs text-foreground/60">Simulate cross-examination before final panel.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}
