"use origin";

import React from "react";

interface AxiomLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

/**
 * AxiomMark - Minimalist geometric academic asterisk / axiom compass emblem.
 * Clean, modern, editorial, inspired by prestigious academic design.
 */
export function AxiomMark({ className = "size-5", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Vertical spoke */}
      <rect x="11" y="2" width="2" height="20" rx="1" fill="currentColor" />
      {/* Horizontal spoke */}
      <rect x="2" y="11" width="20" height="2" rx="1" fill="currentColor" />
      {/* Diagonal 45 deg */}
      <rect
        x="11"
        y="2"
        width="2"
        height="20"
        rx="1"
        fill="currentColor"
        transform="rotate(45 12 12)"
      />
      {/* Diagonal -45 deg */}
      <rect
        x="11"
        y="2"
        width="2"
        height="20"
        rx="1"
        fill="currentColor"
        transform="rotate(-45 12 12)"
      />
      {/* Central geometric core */}
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * AxiomLogo - Logo and brand mark combination.
 */
export function AxiomLogo({
  className = "flex items-center gap-2.5",
  size = 20,
  showText = true,
  textClassName = "font-display text-lg font-extrabold tracking-tight text-white",
}: AxiomLogoProps) {
  return (
    <div className={className}>
      <AxiomMark size={size} className="text-white shrink-0" />
      {showText && (
        <span className={textClassName}>
          AxiomProof
        </span>
      )}
    </div>
  );
}
