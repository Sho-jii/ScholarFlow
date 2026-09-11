"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

interface HeroMaskRevealProps {
  dayDefaultSrc: string;
  dayRevealSrc: string;
  nightDefaultSrc: string;
  nightRevealSrc: string;
  alt: string;
  radius?: number;
  className?: string;
  parentRef?: React.RefObject<HTMLElement | null>;
}

/**
 * HeroMaskReveal - Framer-grade cursor-following spotlight mask reveal.
 * Implements the full-screen editorial specification from docs/guide_mask_reveal.md:
 * - 260px cursor-following radial CSS mask
 * - 0% to 40% fully opaque center, feathered through 60%, 75%, 88% to 100%
 * - Eased pointer position (0.1) and radius (0.14) with rAF idle-settle loop
 * - Instant initialization under pointer (no sweep from center)
 * - Automatic collapse on pointer exit, cancel, or window blur
 * - Recalculates local coordinates during scroll and window resize
 * - Fully synchronized dual-theme architecture (Day & Night image pairs with GPU crossfade)
 * - Respects coarse pointers (touch) and reduced-motion preferences
 */
export function HeroMaskReveal({
  dayDefaultSrc,
  dayRevealSrc,
  nightDefaultSrc,
  nightRevealSrc,
  alt,
  radius = 260,
  className = "",
  parentRef,
}: HeroMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealLayerRef = useRef<HTMLDivElement>(null);

  // Animation physics state (Lerp)
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const currentRadiusRef = useRef(0);
  const isHoveringRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastClientXRef = useRef(0);
  const lastClientYRef = useRef(0);

  // Animation loop
  const animate = () => {
    const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const easePos = isReducedMotion ? 1 : 0.10;
    const easeRadius = isReducedMotion ? 1 : 0.14;

    currentXRef.current += (targetXRef.current - currentXRef.current) * easePos;
    currentYRef.current += (targetYRef.current - currentYRef.current) * easePos;
    currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * easeRadius;

    const r = currentRadiusRef.current;
    const x = currentXRef.current;
    const y = currentYRef.current;

    if (revealLayerRef.current) {
      if (r <= 0.5 && targetRadiusRef.current === 0) {
        currentRadiusRef.current = 0;
        const emptyMask = "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)";
        revealLayerRef.current.style.webkitMaskImage = emptyMask;
        revealLayerRef.current.style.maskImage = emptyMask;
        rafIdRef.current = null;
        return; // Settle idle loop when fully collapsed
      }

      // Exact multi-stop feathered gradient from guide_mask_reveal.md:
      // Fully opaque through 40%, feathered through 60%, 75%, 88%, transparent at 100%
      const mask = `radial-gradient(circle ${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #000 0%, #000 40%, rgba(0, 0, 0, 0.85) 60%, rgba(0, 0, 0, 0.45) 75%, rgba(0, 0, 0, 0.12) 88%, transparent 100%)`;
      revealLayerRef.current.style.webkitMaskImage = mask;
      revealLayerRef.current.style.maskImage = mask;
      revealLayerRef.current.style.webkitMaskRepeat = "no-repeat";
      revealLayerRef.current.style.maskRepeat = "no-repeat";
    }

    // Check if physics have settled idle
    const dx = Math.abs(targetXRef.current - currentXRef.current);
    const dy = Math.abs(targetYRef.current - currentYRef.current);
    const dr = Math.abs(targetRadiusRef.current - currentRadiusRef.current);

    if (dx < 0.1 && dy < 0.1 && dr < 0.1) {
      currentXRef.current = targetXRef.current;
      currentYRef.current = targetYRef.current;
      currentRadiusRef.current = targetRadiusRef.current;
      rafIdRef.current = null;
      return; // Stop animation loop when idle
    }

    rafIdRef.current = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const targetElement = (parentRef && parentRef.current) ? parentRef.current : containerRef.current;
    if (!targetElement) return;

    const onPointerMove = (e: PointerEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const container = containerRef.current;
      if (!container) return;

      lastClientXRef.current = e.clientX;
      lastClientYRef.current = e.clientY;

      const rect = container.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      targetXRef.current = localX;
      targetYRef.current = localY;
      targetRadiusRef.current = radius;

      if (!isHoveringRef.current) {
        // Begin reveal directly under pointer without sweeping from center
        currentXRef.current = localX;
        currentYRef.current = localY;
        currentRadiusRef.current = 0;
        isHoveringRef.current = true;
      }

      startAnimation();
    };

    const onPointerLeave = () => {
      isHoveringRef.current = false;
      targetRadiusRef.current = 0;
      startAnimation();
    };

    const handleScrollOrResize = () => {
      if (!isHoveringRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetXRef.current = lastClientXRef.current - rect.left;
      targetYRef.current = lastClientYRef.current - rect.top;
      startAnimation();
    };

    const handleWindowBlur = () => {
      isHoveringRef.current = false;
      targetRadiusRef.current = 0;
      startAnimation();
    };

    targetElement.addEventListener("pointermove", onPointerMove);
    targetElement.addEventListener("pointerleave", onPointerLeave);
    targetElement.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      targetElement.removeEventListener("pointermove", onPointerMove);
      targetElement.removeEventListener("pointerleave", onPointerLeave);
      targetElement.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("blur", handleWindowBlur);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [radius, parentRef]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden ${className}`}
    >
      {/* ════════════════════════════════════════════════════════════════════
          LAYER 1: PERMANENTLY VISIBLE BASE IMAGE (Day / Night Crossfade)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        {/* Day Default Image */}
        <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-0 opacity-100">
          <Image
            src={dayDefaultSrc}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.82] contrast-[1.08] saturate-[1.12]"
          />
        </div>

        {/* Night Default Image */}
        <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-100 opacity-0">
          <Image
            src={nightDefaultSrc}
            alt={`${alt} - night`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.85] contrast-[1.12] saturate-[1.15]"
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          LAYER 2: STACKED REVEAL IMAGE LAYER (Masked via Radial CSS Gradient)
      ════════════════════════════════════════════════════════════════════ */}
      <div
        ref={revealLayerRef}
        className="absolute inset-0 z-10 pointer-events-none will-change-[mask-image]"
        style={{
          WebkitMaskImage: "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)",
          maskImage: "radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)",
        }}
      >
        {/* Day Reveal Image (Bright Sunlit Campus) */}
        <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-0 opacity-100">
          <Image
            src={dayRevealSrc}
            alt={`${alt} - daylight bright reveal`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[1.04] contrast-[1.08] saturate-[1.18]"
          />
        </div>

        {/* Night Reveal Image (Glowing Illuminated Campus) */}
        <div className="absolute inset-0 transition-opacity duration-700 dark:opacity-100 opacity-0">
          <Image
            src={nightRevealSrc}
            alt={`${alt} - illuminated night reveal`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[1.12] contrast-[1.14] saturate-[1.22]"
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          LAYER 3: SOFT CINEMATIC OVERLAYS (Preserves typography readability)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
      <div className="absolute inset-0 z-20 pointer-events-none bg-radial-gradient from-transparent via-black/15 to-black/40" />
    </div>
  );
}
