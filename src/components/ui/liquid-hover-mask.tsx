"use client";

import React, { useRef, useState, useId } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidHoverMaskProps extends React.HTMLAttributes<HTMLDivElement> {
  revealImageSrc: string;
  revealImageAlt?: string;
  children: React.ReactNode;
  maskRadius?: number;
  distortionScale?: number;
}

/**
 * LiquidHoverMask - React/Tailwind component for a liquid hover mask reveal.
 * When the pointer moves over the card, it reveals a hidden background image
 * using an organic, fluid distortion mask powered by SVG turbulence and physics springs.
 */
export function LiquidHoverMask({
  revealImageSrc,
  revealImageAlt = "Revealed research telemetry",
  children,
  className,
  maskRadius = 180,
  distortionScale = 28,
  ...props
}: LiquidHoverMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const filterId = useId().replace(/:/g, "_");

  // Track raw cursor coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics-based spring interpolation for buttery inertial liquid lag
  const springConfig = { damping: 26, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl border border-black/10 dark:border-white/10 select-none group",
        className
      )}
      {...props}
    >
      {/* ─── SVG Organic Liquid Distortion Filter ─── */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={`liquid-${filterId}`}>
            {/* Fractal noise for organic wave displacement */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              result="noise"
            />
            {/* Fluid displacement mapping */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Liquid Mask definition */}
          <mask id={`mask-${filterId}`}>
            {/* Black background hides revealed content */}
            <rect width="100%" height="100%" fill="black" />
            {/* White distorted circle reveals underlying content */}
            <motion.circle
              cx={smoothX}
              cy={smoothY}
              r={isHovered ? maskRadius : 0}
              fill="white"
              filter={`url(#liquid-${filterId})`}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </mask>
        </defs>
      </svg>

      {/* ─── Base Content Layer (Default Visible) ─── */}
      <div className="relative z-10 w-full h-full transition-opacity duration-300">
        {children}
      </div>

      {/* ─── Hidden Revealed Background Image Layer ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
        style={{
          mask: `url(#mask-${filterId})`,
          WebkitMask: `url(#mask-${filterId})`,
          opacity: isHovered ? 1 : 0,
        }}
      >
        <Image
          src={revealImageSrc}
          alt={revealImageAlt}
          fill
          className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
        />
        {/* Subtle luminous refraction overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* ─── Luminous Cursor Specular Fluid Ring ─── */}
      <motion.div
        className="pointer-events-none absolute z-30 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-white/10 blur-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          left: smoothX,
          top: smoothY,
        }}
      />
    </div>
  );
}
