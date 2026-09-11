"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/layout/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  variant?: "cell" | "pill" | "icon";
}

/**
 * Editorial Eclipse Theme Toggle.
 * Designed specifically for AxiomProof's high-end editorial layout.
 * Features a minimalist celestial syzygy / eclipse aperture glyph that rotates
 * with spring physics, paired with refined monospace micro-typography.
 */
export function ThemeToggle({ className = "", variant = "cell" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted/40 cursor-pointer select-none ${className}`}
        aria-label="Toggle theme mode"
      >
        {/* Editorial Eclipse Glyph */}
        <motion.div
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="size-3.5 rounded-full border border-current overflow-hidden relative grid place-items-center"
        >
          {/* Half filled aperture */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-current" />
        </motion.div>
        <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-foreground/80">
          {isDark ? "Dark" : "Light"}
        </span>
      </button>
    );
  }

  // Bespoke Editorial Grid Header Cell
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`h-full flex items-center gap-2.5 px-5 sm:px-6 border-l border-current/15 hover:bg-current/5 transition-colors cursor-pointer group select-none ${className}`}
      aria-label="Toggle theme mode"
      title={isDark ? "Switch to Editorial Light" : "Switch to Editorial Dark"}
    >
      {/* Bespoke Astronomical Eclipse Glyph */}
      <div className="relative size-6 grid place-items-center rounded-full border border-current/30 bg-transparent text-current transition-transform group-hover:scale-105">
        <motion.div
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="size-3.5 rounded-full border border-current/80 overflow-hidden relative"
        >
          {/* Dynamic Yin-Yang / Phase Fill */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-current" />
        </motion.div>
      </div>

      <span className="hidden sm:inline font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-current/70 group-hover:text-current transition-colors">
        {isDark ? "Night" : "Day"}
      </span>
    </button>
  );
}
