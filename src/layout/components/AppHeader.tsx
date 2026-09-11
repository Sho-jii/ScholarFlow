"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sun,
  Moon,
  School,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "../types";
import { createClient } from "@/services/supabase/client";
import Link from "next/link";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { AxiomMark } from "@/components/brand/AxiomLogo";

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
  profile?: UserProfile | null;
}

const PAGE_TITLE_MAP: Record<string, string> = {
  "/": "Overview",
  "/audit": "Structural Alignment Auditor",
  "/synthesis": "Socratic RRL Synthesis Coach",
  "/defense": "Viva-Voce Pre-Defense Panelist",
  "/teacher": "Teacher Advisory & Cohort Intelligence",
  "/login": "Authentication & Registration",
};

export function AppHeader({ onOpenMobileMenu, profile }: AppHeaderProps) {
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setAuthUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setAuthUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const activeTitle =
    PAGE_TITLE_MAP[pathname] ||
    (pathname.startsWith("/audit/")
      ? "Audit Inspection"
      : pathname.startsWith("/teacher/")
      ? "Cohort Review"
      : "AxiomProof");

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-black/10 dark:border-white/10 bg-background/80 px-3 sm:px-6 backdrop-blur-xl transition-colors">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="grid size-9 place-items-center rounded-full border border-border bg-muted/40 text-foreground md:hidden hover:bg-muted cursor-pointer shrink-0 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="size-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <h1 className="font-display text-sm sm:text-base md:text-lg font-bold tracking-tight text-foreground truncate uppercase">
            {activeTitle}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium truncate">
            <School className="size-3 text-primary shrink-0" />
            <span className="truncate">
              {authUser?.user_metadata?.school_name || profile?.school_name || "AxiomProof Academic Workspace"} • Research Suite
            </span>
          </span>
        </div>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Public Website Gateway */}
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-white hover:bg-black dark:bg-[#12161a] dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 shadow-2xs cursor-pointer select-none"
        >
          <AxiomMark size={13} className="text-current" />
          <span>Website</span>
        </Link>

        {/* Aesthetic Theme Toggle (Text/Background Swap) */}
        <ThemeToggle variant="pill" />

        {/* User Auth Pill or Login Link */}
        {authUser ? (
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/50 backdrop-blur-xs py-1 px-2 sm:px-3 shadow-2xs">
            <div className="grid size-6 place-items-center rounded-full bg-[#0d1217] text-white dark:bg-white dark:text-[#0d1217] text-[11px] font-bold shrink-0">
              {authUser.user_metadata?.full_name?.charAt(0) || authUser.email?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-foreground max-w-[120px] truncate">
              {authUser.user_metadata?.full_name || authUser.email?.split("@")[0]}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary shrink-0">
              {authUser.user_metadata?.role === "teacher" ? "Adviser" : "Student"}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 hover:bg-primary/20 py-1.5 px-3 text-xs font-bold text-primary transition-colors cursor-pointer"
          >
            <LogIn className="size-3.5" />
            <span className="hidden xs:inline sm:inline">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
