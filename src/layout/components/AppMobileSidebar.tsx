"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FolderKanban,
  FileCheck2,
  Sparkles,
  Mic,
  ShieldCheck,
  ChevronLeft,
  GraduationCap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, type UserRole } from "../types";
import { AxiomMark } from "@/components/brand/AxiomLogo";

interface AppMobileSidebarProps {
  open: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const overlayVariants = {
  closed: {
    opacity: 0,
    x: "-100%",
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  },
  open: {
    opacity: 1,
    x: "0%",
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 8 },
  open: { opacity: 1, y: 0 },
};

export function AppMobileSidebar({
  open,
  onClose,
  userRole = "student",
}: AppMobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredNav = useMemo(() => {
    return NAVIGATION_ITEMS.filter((item) => {
      if (item.teacherOnly && userRole === "student") return false;
      return true;
    });
  }, [userRole]);

  const activeIndex = useMemo(() => {
    const idx = filteredNav.findIndex(
      (item) =>
        pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    );
    return idx >= 0 ? idx : 0;
  }, [pathname, filteredNav]);

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  const getIcon = (iconName: string, active: boolean) => {
    const props = {
      className: cn("size-[18px] shrink-0 transition-colors", active ? "text-primary" : "text-foreground"),
    };
    switch (iconName) {
      case "FolderKanban":
        return <FolderKanban {...props} />;
      case "FileCheck2":
        return <FileCheck2 {...props} />;
      case "Sparkles":
        return <Sparkles {...props} />;
      case "Mic":
        return <Mic {...props} />;
      case "ShieldAlert":
      case "ShieldCheck":
        return <ShieldCheck {...props} />;
      default:
        return <GraduationCap {...props} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          variants={overlayVariants as any}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 flex h-full w-full flex-col bg-background text-foreground pt-3 pb-6 md:hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Header Row: Title & Circular Back Button (HITOVIS design) */}
          <div className="flex h-[48px] shrink-0 items-center justify-between px-6 border-b border-border/40">
            <span className="font-display text-[12px] font-bold uppercase tracking-[1.5px] text-foreground flex items-center gap-2">
              <AxiomMark size={16} className="text-primary" />
              AxiomProof
            </span>

            {/* Circular Back Button pill */}
            <button
              type="button"
              onClick={onClose}
              className="grid size-[32px] place-items-center rounded-full bg-[#0d1217] dark:bg-[#f6f7f9] text-[#f6f7f9] dark:text-[#0d1217] outline-none transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              aria-label="Close navigation"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>

          {/* Nav List spanning full height with HITOVIS full-width banner highlight */}
          <nav className="mt-4 flex flex-1 flex-col justify-between py-2 overflow-y-auto">
            {filteredNav.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <div key={item.key} className="relative w-full overflow-hidden">
                  <motion.button
                    variants={itemVariants as any}
                    type="button"
                    onClick={() => handleNavigate(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex h-[52px] w-full items-center px-8 outline-none transition-colors duration-200 cursor-pointer",
                      isActive
                        ? "bg-[#0d1217] dark:bg-[#f6f7f9] text-[#f6f7f9] dark:text-[#0d1217] shadow-xs"
                        : "text-foreground hover:bg-foreground/5"
                    )}
                  >
                    {/* Left Icon (18x18) */}
                    <span
                      aria-hidden="true"
                      className="absolute left-8 grid size-[18px] place-items-center"
                    >
                      {getIcon(item.icon, isActive)}
                    </span>

                    {/* Centered Uppercase Label in Syne/Display font (22px, weight 700) */}
                    <span
                      className={cn(
                        "w-full text-center font-display text-[20px] sm:text-[22px] font-bold uppercase tracking-[0.5px]",
                        isActive ? "font-extrabold" : "opacity-90"
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </div>
              );
            })}

            {/* Return to Public Site Link */}
            <div className="px-8 mt-2">
              <button
                type="button"
                onClick={() => handleNavigate("/")}
                className="flex h-[44px] w-full items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-semibold text-foreground hover:bg-[#0d1217] hover:text-white dark:hover:bg-white dark:hover:text-[#0d1217] transition-all duration-300 cursor-pointer shadow-xs"
              >
                <Globe className="size-4" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </nav>

          {/* Footer Logo & Copyright matching HITOVIS */}
          <div className="mt-auto flex shrink-0 flex-col items-center justify-center pt-4 pb-2 gap-2 border-t border-border/40">
            <div className="overflow-hidden">
              <motion.div
                variants={itemVariants as any}
                className="relative flex items-center justify-center size-[48px] rounded-full bg-primary/15 text-primary border border-primary/20 shadow-sm"
              >
                <AxiomMark size={24} className="text-primary" />
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.span
                variants={itemVariants as any}
                className="block font-display text-[11px] font-bold uppercase tracking-[1px] text-muted-foreground"
              >
                AXIOMPROOF@2026 • ACADEMIC VERIFICATION
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
