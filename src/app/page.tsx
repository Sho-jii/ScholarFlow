"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Users,
  Compass,
  Star,
  Sparkles,
  Menu,
  X,
  FileCheck2,
  Brain,
  Layers,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AxiomMark } from "@/components/brand/AxiomLogo";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import { StaggerText } from "@/components/ui/stagger-text";
import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
} from "@/components/ui/text-stagger-hover";
import { HeroMaskReveal } from "@/components/ui/hero-mask-reveal";

// Stagger animation container
const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const textFadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const cardFadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function ModuleExploreButton({ href = "/login", text = "Explore Module" }: { href?: string; text?: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group/btn inline-flex items-center gap-2 rounded-full border border-black/15 hover:border-black dark:border-white/20 dark:hover:border-white bg-white hover:bg-black dark:bg-[#12161a] dark:hover:bg-white text-black hover:text-white dark:text-white dark:hover:text-black px-5 py-2 text-xs font-semibold transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none"
    >
      <TextStaggerHover as="span" isHovered={isHovered}>
        <TextStaggerHoverActive animation="top" className="text-current">
          {text}
        </TextStaggerHoverActive>
        <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
          {text}
        </TextStaggerHoverHidden>
      </TextStaggerHover>
      <ArrowUpRight className="size-3 text-current transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
    </Link>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const heroRef = React.useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 1000], [0, 160]);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // The hero section's bottom edge relative to the top of the viewport.
        // Header height is 64px (h-16). When rect.bottom <= 64, the hero background
        // has scrolled completely behind/past the header, entering the next section.
        setIsPastHero(rect.bottom <= 64);
      } else {
        setIsPastHero(window.scrollY >= window.innerHeight - 64);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#070b0e] text-[#0c1013] dark:text-[#e5edf2] selection:bg-foreground/20 selection:text-foreground font-sans antialiased transition-colors duration-300">
      {/* ════════════════════════════════════════════════════════════════════
          1. EDITORIAL GRID NAVBAR (Full-bleed Edge-to-Edge & Transparent)
      ════════════════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 -mb-16",
          isPastHero
            ? "bg-transparent backdrop-blur-md border-b border-black/10 dark:border-white/10 text-foreground"
            : "bg-transparent border-b border-white/20 text-white"
        )}
      >
        {/* Full-bleed Edge-to-Edge Grid Bar: Zero outer margins/paddings */}
        <div className="w-full flex h-16 items-stretch justify-between">
          {/* Brand Logo Cell (Framed bordered cell flush to left edge) */}
          <div className="flex items-center px-6 sm:px-8 border-r border-current/15">
            <Link href="/" className="flex items-center gap-3 group">
              <AxiomMark size={20} className="text-current group-hover:rotate-45 transition-transform duration-500" />
              <span className="font-display text-lg font-bold tracking-tight text-current">
                AxiomProof
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links with Stagger Text Hover */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wide">
            <a href="#disciplines" className="py-2 transition-colors">
              <TextStaggerHover as="span" className="text-xs font-semibold">
                <TextStaggerHoverActive animation="top" className="text-current/75">
                  Disciplines
                </TextStaggerHoverActive>
                <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                  Disciplines
                </TextStaggerHoverHidden>
              </TextStaggerHover>
            </a>

            <a href="#about" className="py-2 transition-colors">
              <TextStaggerHover as="span" className="text-xs font-semibold">
                <TextStaggerHoverActive animation="top" className="text-current/75">
                  About Platform
                </TextStaggerHoverActive>
                <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                  About Platform
                </TextStaggerHoverHidden>
              </TextStaggerHover>
            </a>

            <a href="#modules" className="py-2 transition-colors">
              <TextStaggerHover as="span" className="text-xs font-semibold">
                <TextStaggerHoverActive animation="top" className="text-current/75">
                  Defense Modules
                </TextStaggerHoverActive>
                <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                  Defense Modules
                </TextStaggerHoverHidden>
              </TextStaggerHover>
            </a>

            <a href="#continuous-rigor" className="py-2 transition-colors">
              <TextStaggerHover as="span" className="text-xs font-semibold">
                <TextStaggerHoverActive animation="top" className="text-current/75">
                  Continuous Rigor
                </TextStaggerHoverActive>
                <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                  Continuous Rigor
                </TextStaggerHoverHidden>
              </TextStaggerHover>
            </a>

            <a href="#faculty" className="py-2 transition-colors">
              <TextStaggerHover as="span" className="text-xs font-semibold">
                <TextStaggerHoverActive animation="top" className="text-current/75">
                  Faculty Panel
                </TextStaggerHoverActive>
                <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                  Faculty Panel
                </TextStaggerHoverHidden>
              </TextStaggerHover>
            </a>
          </nav>

          {/* Right Action Cells: Bespoke Celestial Theme Toggle, Sign In, and Portal Access */}
          <div className="flex items-stretch">
            {/* Bespoke Editorial Eclipse Theme Toggle Cell */}
            <ThemeToggle variant="cell" className="border-current/15 text-current" />

            {/* Direct Login CTA with Stagger Hover */}
            <div className="h-full border-l border-current/15 flex items-center px-5 sm:px-7">
              <Link href="/login" className="py-1">
                <TextStaggerHover as="span" className="text-xs font-semibold uppercase tracking-wider">
                  <TextStaggerHoverActive animation="top" className="text-current/80">
                    Sign In
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                    Sign In
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              </Link>
            </div>

            {/* Portal Action Box with Stagger Hover (Flush to right edge) */}
            <div className="hidden sm:flex h-full border-l border-current/15 items-center px-6 sm:px-8 bg-current/5 hover:bg-current/10 transition-colors">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-current"
              >
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-current font-bold">
                    Access Portal
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-current font-bold">
                    Access Portal
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
                <ArrowUpRight className="size-3.5 text-current/70" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-full border-l border-current/15 px-5 flex items-center justify-center text-current"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-black/10 dark:border-white/10 bg-background px-6 sm:px-10 py-6 lg:hidden space-y-4 shadow-xl text-foreground"
          >
            <div className="flex flex-col gap-4 text-sm font-medium text-foreground/80">
              <a
                href="#disciplines"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground transition-colors"
              >
                Disciplines
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground transition-colors"
              >
                About Platform
              </a>
              <a
                href="#modules"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground transition-colors"
              >
                Defense Modules
              </a>
              <a
                href="#continuous-rigor"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground transition-colors"
              >
                Continuous Rigor
              </a>
              <a
                href="#faculty"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-foreground transition-colors"
              >
                Faculty Panel
              </a>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
              <ThemeToggle variant="pill" />
              <Link
                href="/login"
                className="flex-1 text-center rounded-full bg-foreground text-background py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Sign In to Platform
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <main>
        {/* ════════════════════════════════════════════════════════════════════
            2. HERO SECTION (Day & Night Mask Reveal in Full Viewport Height)
        ════════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative h-screen min-h-screen flex items-center justify-center overflow-hidden border-b border-black/10 dark:border-white/10"
        >
          {/* Parallax Background with Framer-grade Spotlight Mask Reveal */}
          <motion.div
            style={{ y: heroImageY }}
            className="absolute inset-0 z-0 scale-105"
          >
            <HeroMaskReveal
              dayDefaultSrc="/images/campus_panorama.jpg"
              dayRevealSrc="/images/campus_panorama_bright.jpeg"
              nightDefaultSrc="/images/campus_panorama_night.jpeg"
              nightRevealSrc="/images/campus_panorama_night_bright.jpeg"
              alt="AxiomProof university research campus panorama"
              radius={260}
              parentRef={heroRef}
              className="w-full h-full"
            />
          </motion.div>

          {/* Centered Hero Content */}
          <motion.div
            variants={containerStagger}
            initial="hidden"
            animate="visible"
            className="relative z-10 pointer-events-none mx-auto max-w-5xl px-6 pt-28 pb-20 text-center flex flex-col items-center space-y-8"
          >
            {/* Eyebrow / Tag */}
            <motion.div variants={textFadeUp} className="flex items-center gap-2">
              <AxiomMark size={14} className="text-white" />
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white drop-shadow-md">
                Deterministic Academic Verification
              </span>
            </motion.div>

            {/* Giant Monolithic Display Headline (Exact reference typography) */}
            <motion.h1
              variants={textFadeUp}
              className="font-display text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-white uppercase select-none drop-shadow-lg"
            >
              Defend
            </motion.h1>

            {/* Subtitle Statement with Stagger Reveal */}
            <motion.div variants={textFadeUp} className="max-w-2xl">
              <p className="text-base sm:text-lg md:text-xl text-white font-light leading-relaxed tracking-wide drop-shadow-md">
                With purpose. Socratic viva-voce defense, Chapter 1–3 structural audit, and research intelligence in one unified platform.
              </p>
            </motion.div>

            {/* Floating Centered Pill Button with Stagger Text Hover */}
            <motion.div variants={textFadeUp} className="pt-4 pointer-events-auto">
              <Link
                href="/login"
                className="group inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-3.5 text-xs sm:text-sm font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-black font-bold">
                    Access Platform
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-neutral-500 font-bold">
                    Access Platform
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
                <span className="grid size-4 place-items-center rounded-xs bg-black text-white group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="size-3" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            3. SECTION: CATEGORIES / DISCIPLINARY DOMAINS (With StaggerText)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="disciplines" className="py-24 sm:py-32 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#070b0e] transition-colors duration-300">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 space-y-16">
            {/* Section Header with StaggerText scroll animation */}
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2 text-foreground/60 text-xs font-semibold tracking-widest uppercase">
                <AxiomMark size={14} className="text-foreground" />
                <span>Academic Disciplines</span>
              </div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08]">
                <StaggerText
                  text="We've audited and defended research in every scientific domain. See for yourself."
                  as="h2"
                  stagger={0.035}
                />
              </div>
            </div>

            {/* 3-Column Image Cards Grid (Exact reference grid layout) */}
            <motion.div
              variants={containerStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            >
              {/* Card 1: STEM & Experimental */}
              <motion.div variants={cardFadeUp} className="group flex flex-col space-y-4">
                {/* Header row: Title on left, count on right */}
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs tracking-wide">
                  <span className="font-semibold text-foreground">STEM & Quantitative</span>
                  <span className="text-foreground/50">/ 120+ Rubrics</span>
                </div>
                {/* Image Container with zoom */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-muted border border-black/10 dark:border-white/10">
                  <Image
                    src="/images/stem_lab_research.jpg"
                    alt="STEM research laboratory testing samples"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>
                {/* Text summary */}
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Rigorous hypothesis formulation, statistical ANOVA/t-test triangulation, sensor drift calibration, and empirical instrumentation defense.
                </p>
              </motion.div>

              {/* Card 2: Social Sciences & HUMSS */}
              <motion.div variants={cardFadeUp} className="group flex flex-col space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs tracking-wide">
                  <span className="font-semibold text-foreground">Qualitative & Humanities</span>
                  <span className="text-foreground/50">/ 85+ Frameworks</span>
                </div>
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-muted border border-black/10 dark:border-white/10">
                  <Image
                    src="/images/humanities_archive_research.jpg"
                    alt="Humanities researcher analyzing archive documents"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>
                {/* Text summary */}
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Thematic coding veracity, phenomenological inquiry, informant triangulation, and ethical research clearance against institutional standards.
                </p>
              </motion.div>

              {/* Card 3: Applied Innovation & Tech */}
              <motion.div variants={cardFadeUp} className="group flex flex-col space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3 text-xs tracking-wide">
                  <span className="font-semibold text-foreground">Applied Technology & TVL</span>
                  <span className="text-foreground/50">/ 60+ Standards</span>
                </div>
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-muted border border-black/10 dark:border-white/10">
                  <Image
                    src="/images/applied_prototype_tech.jpg"
                    alt="Applied engineering prototype testing with microcontroller"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>
                {/* Text summary */}
                <p className="text-xs text-foreground/70 leading-relaxed">
                  Working prototype stress-testing, microcontroller circuit validation, ergonomic feasibility, and cost-benefit optimization metrics.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            4. SECTION: ABOUT / EDITORIAL SPLIT & STATS (With StaggerText)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="py-24 sm:py-32 border-b border-black/10 dark:border-white/10 bg-[#f1f3f5] dark:bg-[#090f13] transition-colors duration-300">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 space-y-16">
            {/* Header Tag & Main Headline */}
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center gap-2 text-foreground/60 text-xs font-semibold tracking-widest uppercase">
                <AxiomMark size={14} className="text-foreground" />
                <span>About AxiomProof</span>
              </div>
              <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
                <StaggerText
                  text="Not just AI feedback. Rigorous defense simulations that nurture critical scholarship."
                  as="h2"
                  stagger={0.03}
                />
              </div>
            </div>

            {/* Split Content: Large Photo on Left, Paragraphs & Massive Stats on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Photo */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-6"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs border border-black/10 dark:border-white/10 shadow-2xl">
                  <Image
                    src="/images/faculty_panel_review.jpg"
                    alt="Faculty panel deliberating over thesis rubrics"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </motion.div>

              {/* Right Editorial Copy & Big Numbers */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-6 flex flex-col justify-between space-y-12"
              >
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal">
                  AxiomProof is an institutional research integrity engine and viva-voce mock defense platform. We bridge the gap between classroom manuscript drafting and high-stakes panel deliberations through deterministic verification, anti-hallucination cross-checks, and multi-agent Socratic cross-examination.
                </p>

                {/* Big Stat Counters (Exact reference design) */}
                <div className="grid grid-cols-2 gap-8 border-t border-black/10 dark:border-white/10 pt-8">
                  <div>
                    <div className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
                      100+
                    </div>
                    <p className="text-xs text-foreground/50 mt-2 font-medium">
                      Institutions & research tracks evaluated
                    </p>
                  </div>
                  <div>
                    <div className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
                      2,470+
                    </div>
                    <p className="text-xs text-foreground/50 mt-2 font-medium">
                      Oral defense simulations conducted
                    </p>
                  </div>
                </div>

                {/* Partner / Trust Badges */}
                <div className="border-t border-black/10 dark:border-white/10 pt-8 space-y-4">
                  <p className="text-xs text-foreground/50 uppercase tracking-wider font-semibold">
                    Trusted by researchers looking for uncompromising academic rigor
                  </p>
                  <div className="flex flex-wrap items-center gap-8 text-foreground/40 text-xs font-bold tracking-widest">
                    <span>DEPED RESEARCH</span>
                    <span>IEEE STANDARDS</span>
                    <span>DOST FRAMEWORK</span>
                    <span>APA 7TH AUDIT</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            5. SECTION: FEATURED DEFENSE MODULES (With StaggerText & Stagger Hover)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="modules" className="py-24 sm:py-32 border-b border-black/10 dark:border-white/10 bg-[#f1f3f5] dark:bg-[#070b0e] transition-colors duration-300">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 space-y-16">
            {/* Header with Title and Right Description */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground/60 text-xs font-semibold tracking-widest uppercase">
                  <AxiomMark size={14} className="text-foreground" />
                  <span>Curated Modules</span>
                </div>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  <StaggerText
                    text="Featured Defense Modules"
                    as="h2"
                    stagger={0.05}
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-foreground/60 max-w-md leading-relaxed">
                Autonomous panel cross-examination, deterministic Chapter 1–3 alignment matrices, and real-time defense readiness diagnostics.
              </p>
            </div>

            {/* 2x2 Grid of Split Horizontal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Module 1 */}
              <motion.div
                variants={cardFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] flex flex-col sm:flex-row overflow-hidden hover:border-black/30 dark:hover:border-white/30 transition-colors shadow-xs"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Socratic Viva-Voce Defense Simulation
                    </h3>
                    <p className="text-xs font-semibold text-foreground/70">
                      from <span className="text-foreground font-bold">Autonomous Multi-Agent Panel</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-foreground/50">
                    <p>Live Audio & Text Socratic Inquiry</p>
                    <p>Duration: 15–45 min adaptive cross-examination</p>
                    <p>Multi-agent: Methodologist, Statistician, Defense Chair</p>
                    <div className="flex items-center gap-1 text-amber-500 pt-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="text-foreground/60 text-[10px] ml-1">Verified across 300+ cohorts</span>
                    </div>
                  </div>

                  <div>
                    <ModuleExploreButton href="/login" />
                  </div>
                </div>

                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
                  <Image
                    src="/images/hero_defense_hall.jpg"
                    alt="Viva-Voce Oral Defense"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Module 2 */}
              <motion.div
                variants={cardFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] flex flex-col sm:flex-row overflow-hidden hover:border-black/30 dark:hover:border-white/30 transition-colors shadow-xs"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Deterministic Alignment Audit Matrix
                    </h3>
                    <p className="text-xs font-semibold text-foreground/70">
                      from <span className="text-foreground font-bold">Chapter 1–3 Triangulation</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-foreground/50">
                    <p>SOP to Instrument to Statistical Tool Cross-Mapping</p>
                    <p>Zero Hallucination Grounding via Exact Quotes</p>
                    <p>Methodological Red-Flag & Gap Detection</p>
                    <div className="flex items-center gap-1 text-amber-500 pt-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="text-foreground/60 text-[10px] ml-1">99.4% Alignment Precision</span>
                    </div>
                  </div>

                  <div>
                    <ModuleExploreButton href="/login" />
                  </div>
                </div>

                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
                  <Image
                    src="/images/stem_lab_research.jpg"
                    alt="Research Alignment Matrix"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Module 3 */}
              <motion.div
                variants={cardFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] flex flex-col sm:flex-row overflow-hidden hover:border-black/30 dark:hover:border-white/30 transition-colors shadow-xs"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Socratic Coach & Literature Synthesis
                    </h3>
                    <p className="text-xs font-semibold text-foreground/70">
                      from <span className="text-foreground font-bold">Reflective Inquiry Protocol</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-foreground/50">
                    <p>Step-by-step guided manuscript refinement</p>
                    <p>Literature synthesis matrix with citation checks</p>
                    <p>No answers fed: prompts independent critical thinking</p>
                    <div className="flex items-center gap-1 text-amber-500 pt-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="text-foreground/60 text-[10px] ml-1">Rated 4.9/5 by Student Cohorts</span>
                    </div>
                  </div>

                  <div>
                    <ModuleExploreButton href="/login" />
                  </div>
                </div>

                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
                  <Image
                    src="/images/humanities_archive_research.jpg"
                    alt="Socratic Coach and Literature Synthesis"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              {/* Module 4 */}
              <motion.div
                variants={cardFadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0f13] flex flex-col sm:flex-row overflow-hidden hover:border-black/30 dark:hover:border-white/30 transition-colors shadow-xs"
              >
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Advisory Cohort Heatmap & Analytics
                    </h3>
                    <p className="text-xs font-semibold text-foreground/70">
                      from <span className="text-foreground font-bold">Faculty Supervision Suite</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-foreground/50">
                    <p>Cohort-wide blindspot aggregation & tracking</p>
                    <p>DepEd & University rubric standard scoring</p>
                    <p>Early warning detection for ungrounded claims</p>
                    <div className="flex items-center gap-1 text-amber-500 pt-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="text-foreground/60 text-[10px] ml-1">Adopted by Lead Advisers</span>
                    </div>
                  </div>

                  <div>
                    <ModuleExploreButton href="/login" />
                  </div>
                </div>

                <div className="relative sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted">
                  <Image
                    src="/images/faculty_panel_review.jpg"
                    alt="Advisory Cohort Analytics"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            7. SECTION: CONTINUOUS RIGOR / "COMBINE" PROCESS (With StaggerText)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="continuous-rigor" className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden border-b border-black/10 dark:border-white/10">
          {/* Atmospheric Campus Panorama Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/campus_panorama.jpg"
              alt="Atmospheric university campus sunset"
              fill
              className="object-cover object-center brightness-[0.70] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/70" />
          </div>

          {/* Top Big Typography Header */}
          <div className="relative z-10 mx-auto max-w-[1440px] w-full px-6 sm:px-10 lg:px-16 pt-24 sm:pt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <div className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                <StaggerText
                  text="Continuous Rigor"
                  as="h2"
                  stagger={0.06}
                />
              </div>
              <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white/95 tracking-tight space-y-1 drop-shadow-sm">
                <p>+ Socratic Viva Defense</p>
                <p>+ Methodology Audit</p>
                <p>+ Certified Readiness</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom 4 Horizontal Step Cards */}
          <div className="relative z-10 mx-auto max-w-[1440px] w-full px-6 sm:px-10 lg:px-16 pb-16 pt-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/20 pt-8">
              {/* Step 01 */}
              <div className="space-y-3">
                <div className="font-display text-3xl font-extrabold text-white tracking-tight">
                  01
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/60 block">
                  Step
                </span>
                <h4 className="text-sm font-bold text-white">Ingest Manuscript</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Extract Statement of Problem, operational variables, hypotheses, and instruments automatically.
                </p>
              </div>

              {/* Step 02 */}
              <div className="space-y-3">
                <div className="font-display text-3xl font-extrabold text-white tracking-tight">
                  02
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/60 block">
                  Step
                </span>
                <h4 className="text-sm font-bold text-white">Audit Triangulation</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Deterministic cross-checking pins every SOP item to statistical tools with exact excerpt citation.
                </p>
              </div>

              {/* Step 03 */}
              <div className="space-y-3">
                <div className="font-display text-3xl font-extrabold text-white tracking-tight">
                  03
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/60 block">
                  Step
                </span>
                <h4 className="text-sm font-bold text-white">Simulate Defense</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Engage with autonomous multi-turn Socratic panel cross-examining research limitations in real-time.
                </p>
              </div>

              {/* Step 04 */}
              <div className="space-y-3">
                <div className="font-display text-3xl font-extrabold text-white tracking-tight">
                  04
                </div>
                <span className="text-[11px] uppercase tracking-widest text-white/60 block">
                  Step
                </span>
                <h4 className="text-sm font-bold text-white">Certify Mastery</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Export standardized institutional rubrics, cohort readiness scores, and verified defense clearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            8. SECTION: WORKFLOW & FACULTY ADVISORY BOARD (With StaggerText)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="faculty" className="py-24 sm:py-32 border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#070b0e] transition-colors duration-300">
          <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 space-y-24">
            {/* Top 4 Process Items with minimalist icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="size-10 grid place-items-center rounded-xs border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 text-foreground">
                  <Compass className="size-5" />
                </div>
                <div className="text-[11px] text-foreground/40 tracking-wider font-mono">01</div>
                <h3 className="text-sm font-bold text-foreground">Formulate Questions</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Ground problem statements in verifiable scholarly gaps and theoretical frameworks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="size-10 grid place-items-center rounded-xs border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 text-foreground">
                  <FileCheck2 className="size-5" />
                </div>
                <div className="text-[11px] text-foreground/40 tracking-wider font-mono">02</div>
                <h3 className="text-sm font-bold text-foreground">Map Methodology</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Eliminate mismatched statistics, sample size deficiencies, and unvalidated instruments.
                </p>
              </div>

              <div className="space-y-4">
                <div className="size-10 grid place-items-center rounded-xs border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 text-foreground">
                  <Brain className="size-5" />
                </div>
                <div className="text-[11px] text-foreground/40 tracking-wider font-mono">03</div>
                <h3 className="text-sm font-bold text-foreground">Socratic Drill</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Rehearse unexpected panel inquiries without rote memorization or fabricated citations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="size-10 grid place-items-center rounded-xs border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 text-foreground">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="text-[11px] text-foreground/40 tracking-wider font-mono">04</div>
                <h3 className="text-sm font-bold text-foreground">Faculty Endorsement</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  Provide advisers with transparent analytics before students face the live panel.
                </p>
              </div>
            </div>

            {/* Bottom Faculty Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-black/10 dark:border-white/10 pt-16">
              {/* Left Photos: 2 Distinguished Portraits */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-6">
                <div className="group relative aspect-square overflow-hidden rounded-xs border border-black/10 dark:border-white/10 shadow-md">
                  <Image
                    src="/images/faculty_portrait_male.jpg"
                    alt="Dr. Arthur J. Sterling - Senior Academic Dean"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                    <p className="text-xs font-bold text-white">Dr. Arthur J. Sterling</p>
                    <p className="text-[10px] text-white/70">Dean of Research Methodology</p>
                  </div>
                </div>

                <div className="group relative aspect-square overflow-hidden rounded-xs border border-black/10 dark:border-white/10 shadow-md">
                  <Image
                    src="/images/faculty_portrait_female.jpg"
                    alt="Dr. Sarah Vance - Empirical Panel Chair"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
                    <p className="text-xs font-bold text-white">Dr. Sarah Vance</p>
                    <p className="text-[10px] text-white/70">Empirical Panel Chair & Reviewer</p>
                  </div>
                </div>
              </div>

              {/* Right Headline & Statement */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-foreground/60 text-xs font-semibold tracking-widest uppercase">
                  <AxiomMark size={14} className="text-foreground" />
                  <span>Academic Advisory</span>
                </div>
                <div className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                  <StaggerText
                    text="The academic minds behind AxiomProof"
                    as="h2"
                    stagger={0.04}
                  />
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed font-normal">
                  Built in collaboration with veteran dissertation panelists, research coordinators, and educational technologists committed to advancing student scholarship and oral defense rigor.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider hover:underline"
                  >
                    <TextStaggerHover as="span">
                      <TextStaggerHoverActive animation="top" className="text-foreground">
                        Read Advisory Standards
                      </TextStaggerHoverActive>
                      <TextStaggerHoverHidden animation="bottom" className="text-foreground font-bold">
                        Read Advisory Standards
                      </TextStaggerHoverHidden>
                    </TextStaggerHover>
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          9. EDITORIAL FOOTER & PANORAMA BANNER (Screenshot 155730 style)
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-black/10 dark:border-white/10 bg-[#f1f3f5] dark:bg-[#05080a] pt-12 pb-16 transition-colors duration-300">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 space-y-16">
          {/* Panoramic Campus Photo Banner */}
          <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden rounded-xs border border-black/10 dark:border-white/10 shadow-2xl">
            <Image
              src="/images/campus_panorama.jpg"
              alt="AxiomProof Academic Campus Panorama"
              fill
              className="object-cover object-center brightness-[0.85] dark:brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f1f3f5] dark:from-[#05080a] via-transparent to-transparent opacity-85" />
          </div>

          {/* 3-Column Footer Information */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Left Brand */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <AxiomMark size={24} className="text-foreground" />
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  AxiomProof
                </span>
              </div>
              <p className="text-xs text-foreground/60 max-w-sm leading-relaxed">
                Autonomous research verification, Socratic oral defense simulator, and institutional rubric compliance for academic excellence.
              </p>
            </div>

            {/* Middle Big Links with Pluses */}
            <div className="md:col-span-4 space-y-2 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              <Link href="/login" className="block hover:text-foreground/70 transition-colors">
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-foreground">
                    + Faculty Portal
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-foreground/60 font-bold">
                    + Faculty Portal
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              </Link>
              <Link href="/login" className="block hover:text-foreground/70 transition-colors">
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-foreground">
                    + Socratic Engine
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-foreground/60 font-bold">
                    + Socratic Engine
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              </Link>
              <Link href="/login" className="block hover:text-foreground/70 transition-colors">
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-foreground">
                    + Research Ethics
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-foreground/60 font-bold">
                    + Research Ethics
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              </Link>
              <Link href="/login" className="block hover:text-foreground/70 transition-colors">
                <TextStaggerHover as="span">
                  <TextStaggerHoverActive animation="top" className="text-foreground">
                    + Sign In
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden animation="bottom" className="text-foreground/60 font-bold">
                    + Sign In
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              </Link>
            </div>

            {/* Right Contact Details */}
            <div className="md:col-span-4 space-y-3 text-xs text-foreground/70">
              <p className="font-bold text-foreground text-sm">Institutional Coordination</p>
              <p>inquiries@axiomproof.edu</p>
              <p>+1 (800) 294-6677</p>
              <p className="text-foreground/50 pt-2 text-[11px]">
                Authentication required for workspace entry. Unauthorized access prohibited to maintain computational quota limits.
              </p>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-foreground/50">
            <div>
              © All Rights Reserved. AxiomProof 2026
            </div>
            <div>
              Deterministic Socratic Research Suite
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-foreground transition-colors">
                Terms and Conditions
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
