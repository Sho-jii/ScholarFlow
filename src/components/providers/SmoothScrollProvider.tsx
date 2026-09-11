"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * SmoothScrollProvider integrates Lenis smooth inertial scrolling
 * and couples it directly with the browser's requestAnimationFrame loop,
 * ensuring flawless synchronization with Framer Motion scroll hooks (useScroll, useTransform).
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis with refined physics parameters
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential decay curve for inertial feel
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
      autoRaf: false, // We drive RAF manually to ensure tight synchronization
    });

    lenisRef.current = lenis;

    // Attach to global window for accessibility if needed
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function update(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
