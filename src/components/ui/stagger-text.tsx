"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

interface StaggerTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger ?? 0.04,
      delayChildren: custom.delay ?? 0.05,
    },
  }),
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function StaggerText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.04,
  as: Component = "h2",
}: StaggerTextProps) {
  const words = text.split(" ");

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={{ delay, stagger }}
      className={`inline-flex flex-wrap ${className}`}
    >
      <Component className="inline-flex flex-wrap gap-x-[0.25em] gap-y-1">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    </motion.span>
  );
}
