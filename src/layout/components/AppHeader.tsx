"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sun,
  Moon,
  DatabaseZap,
  Sparkles,
  School,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";
import type { UserProfile } from "../types";

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
  profile?: UserProfile | null;
}

const PAGE_TITLE_MAP: Record<string, string> = {
  "/": "Research Workspace",
  "/audit": "Structural Alignment Auditor",
  "/synthesis": "Socratic RRL Synthesis Coach",
  "/defense": "Viva-Voce Pre-Defense Panelist",
  "/teacher": "Teacher Advisory & Cohort Intelligence",
};

export function AppHeader({ onOpenMobileMenu, profile }: AppHeaderProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [seeding, setSeeding] = useState(false);

  const activeTitle =
    PAGE_TITLE_MAP[pathname] ||
    (pathname.startsWith("/audit/")
      ? "Audit Inspection"
      : pathname.startsWith("/teacher/")
      ? "Cohort Review"
      : "ScholarFlow");

  const handleSeedDemo = async () => {
    try {
      setSeeding(true);
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to seed demo");
      toast.success("Demo cohort and alignment matrix seeded successfully!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Failed to seed demo");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-background/85 px-4 md:px-6 backdrop-blur-md transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="grid size-9 place-items-center rounded-full border border-border bg-muted/50 text-foreground md:hidden hover:bg-muted cursor-pointer"
          aria-label="Open navigation drawer"
        >
          <Menu className="size-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="font-display text-base md:text-lg font-bold tracking-tight text-foreground truncate uppercase">
            {activeTitle}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <School className="size-3 text-primary shrink-0" />
            <span>Canubing National High School • Senior High Research</span>
          </span>
        </div>
      </div>

      {/* Right: Controls & Demo Seeder */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Instant Demo Seed Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeedDemo}
          disabled={seeding}
          className="hidden sm:inline-flex border-primary/40 hover:border-primary text-foreground hover:bg-primary/10 gap-1.5"
          title="Instant one-click demo data population for hackathon presentation"
        >
          <DatabaseZap className="size-3.5 text-primary animate-pulse" />
          <span className="text-xs">{seeding ? "Seeding..." : "Seed Demo Data"}</span>
        </Button>

        {/* Theme Toggle (Text/Background Swap) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="grid size-9 place-items-center rounded-full border border-border bg-muted/40 text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
          title="Toggle light/dark mode"
        >
          {isDark ? (
            <Sun className="size-4 text-warning" />
          ) : (
            <Moon className="size-4 text-primary" />
          )}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 rounded-full border border-border/80 bg-muted/30 py-1 px-3">
          <div className="grid size-6 place-items-center rounded-full bg-primary text-white text-[11px] font-bold">
            {profile?.full_name?.charAt(0) || "S"}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-foreground">
            {profile?.full_name || "Student Researcher"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-primary/20 text-primary">
            {profile?.role || "PR2"}
          </span>
        </div>
      </div>
    </header>
  );
}
