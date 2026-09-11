"use client";

import { useState } from "react";
import { InsetCard } from "@/components/ui/inset-card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Info, Filter } from "lucide-react";
import type { AlignmentIssue, AlignmentStatus } from "../types";

interface AlignmentMatrixTableProps {
  items: AlignmentIssue[];
}

export function AlignmentMatrixTable({ items }: AlignmentMatrixTableProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "GAPS") return item.status === "CRITICAL_GAP" || item.status === "MISALIGNED";
    if (filter === "ALIGNED") return item.status === "ALIGNED";
    return true;
  });

  const getStatusBadge = (status: AlignmentStatus) => {
    switch (status) {
      case "ALIGNED":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" /> Aligned
          </Badge>
        );
      case "PARTIALLY_ALIGNED":
        return (
          <Badge variant="warning" className="gap-1">
            <Info className="size-3" /> Partial
          </Badge>
        );
      case "CRITICAL_GAP":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" /> Critical Gap
          </Badge>
        );
      case "MISALIGNED":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="size-3" /> Misaligned
          </Badge>
        );
    }
  };

  return (
    <InsetCard className="p-6 md:p-8 space-y-6">
      {/* Header & Filter Pill Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            SOP ↔ Conceptual Framework ↔ Instrument Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-chapter mapping verifying whether all problem statements are measurable in Chapter 3
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[#0d1217] dark:bg-white text-white dark:text-[#0d1217] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("GAPS")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filter === "GAPS"
                ? "bg-destructive text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Gaps Only
          </button>
          <button
            type="button"
            onClick={() => setFilter("ALIGNED")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              filter === "ALIGNED"
                ? "bg-success text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aligned
          </button>
        </div>
      </div>

      {/* Responsive Alignment Cards / Table */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 sm:p-5 transition-all space-y-3 ${
              item.status === "CRITICAL_GAP" || item.status === "MISALIGNED"
                ? "border-destructive/30 bg-destructive/5 dark:bg-destructive/10 shadow-xs"
                : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/40 backdrop-blur-xs shadow-xs"
            }`}
          >
            {/* Top row: SOP Statement & Status */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Statement of the Problem (Chapter 1)
                </span>
                <p className="font-semibold text-xs sm:text-sm text-foreground leading-snug">
                  {item.sopStatement}
                </p>
              </div>
              <div className="shrink-0">{getStatusBadge(item.status)}</div>
            </div>

            {/* Middle row: Variables & Instrument mapping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-black/5 dark:border-white/5 text-xs">
              <div className="rounded-xl bg-background/90 border border-black/10 dark:border-white/10 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                  Conceptual Framework Variable
                </span>
                <p className="text-foreground font-medium">
                  {item.mappedVariable || "Not explicitly operationalized in Chapter 2"}
                </p>
              </div>

              <div className="rounded-xl bg-background/90 border border-black/10 dark:border-white/10 p-3 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-foreground font-semibold">
                  Chapter 3 Gathering Tool / Questionnaire Item
                </span>
                <p className={item.instrumentItem?.includes("MISSING") ? "text-destructive font-bold" : "text-foreground font-medium"}>
                  {item.instrumentItem || "No survey question or sensor protocol assigned"}
                </p>
              </div>
            </div>

            {/* Bottom row: Feedback & Advisory */}
            <div className="rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 p-3 text-xs flex items-start gap-2.5">
              <Info className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">Adviser Action Item: </span>
                {item.feedback}
              </p>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No alignment items match the selected filter.
          </div>
        )}
      </div>
    </InsetCard>
  );
}
