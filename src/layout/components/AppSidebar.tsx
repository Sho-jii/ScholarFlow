"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  FileCheck2,
  Sparkles,
  Mic,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, type UserRole } from "../types";
import { AxiomMark } from "@/components/brand/AxiomLogo";

export function AppSidebar({ userRole = "student" }: { userRole?: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorTop, setIndicatorTop] = useState(73);

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

  /* Animate the active indicator */
  useEffect(() => {
    const menu = menuRef.current;
    const activeButton = menuButtonRefs.current[activeIndex];
    if (!menu || !activeButton) return;

    const positionIndicator = () =>
      setIndicatorTop(
        menu.offsetTop +
        activeButton.offsetTop +
        activeButton.offsetHeight / 2 -
        25
      );

    positionIndicator();

    const observer = new ResizeObserver(positionIndicator);
    observer.observe(menu);
    observer.observe(activeButton);
    window.addEventListener("resize", positionIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", positionIndicator);
    };
  }, [activeIndex, expanded]);

  const getIcon = (iconName: string, active: boolean) => {
    const props = {
      className: cn(
        "size-[18px] shrink-0 transition-colors",
        active ? "text-primary" : "text-white/70 group-hover:text-white"
      ),
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
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 self-start transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)] z-30 select-none",
        expanded ? "w-64" : "w-24"
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-screen w-full px-3.5 py-4">
        <nav
          className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[60px] bg-[#0d1217] dark:bg-[#070b0e] border border-black/15 dark:border-white/10 shadow-[0px_8px_32px_rgba(0,0,0,0.25)]"
          aria-label="AxiomProof areas"
        >
          <div className="relative flex min-h-0 flex-1 flex-col items-center pt-4">
            {/* ── Solid Animated Active Indicator Pill (Signature HITOVIS style) ── */}
            <div
              className={cn(
                "pointer-events-none absolute top-0 z-0 h-[50px] rounded-[71px] bg-white text-[#0a0f13] shadow-md transition-transform duration-300 ease-out",
                expanded ? "inset-x-[8px]" : "left-[8px] w-[50px]"
              )}
              style={{ transform: `translateY(${indicatorTop}px)` }}
            />

            {/* ── Logo Frame ── */}
            <div
              onClick={() => router.push("/workspace")}
              className="flex h-12 w-full shrink-0 flex-col items-center justify-center cursor-pointer pb-1"
              title="AxiomProof Workspace"
            >
              <div className="grid size-11 place-items-center rounded-full bg-white text-[#0a0f13] shadow-md hover:scale-105 transition-transform">
                <AxiomMark size={22} className="text-[#0a0f13]" />
              </div>
            </div>

            {/* ── Navigation items with generous HITOVIS gap-5 spacing ── */}
            <section
              ref={menuRef}
              className="relative mt-6 flex w-full shrink-0 flex-col items-start gap-5 px-2"
            >
              {filteredNav.map((item, index) => {
                const active = activeIndex === index;
                return (
                  <button
                    key={item.key}
                    ref={(el) => {
                      menuButtonRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => router.push(item.href)}
                    aria-current={active ? "page" : undefined}
                    title={expanded ? undefined : item.label}
                    className={cn(
                      "group relative z-10 flex w-full items-center gap-4 rounded-[5px] py-3 pl-[16px] text-left outline-none transition-colors duration-200 cursor-pointer",
                      active ? "text-primary" : "text-white/70 hover:text-white"
                    )}
                  >
                    <span aria-hidden="true" className="block shrink-0">
                      {getIcon(item.icon, active)}
                    </span>
                    <span
                      className={cn(
                        "overflow-hidden whitespace-nowrap font-display text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-300",
                        active ? "text-[#0a0f13]" : "text-white/70 group-hover:text-white",
                        expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </section>

            {/* ── Spacer ── */}
            <div className="mt-auto h-8 w-full shrink-0" aria-hidden="true" />

            {/* ── Return to Website Link ── */}
            <div className="flex w-full shrink-0 items-center justify-center pb-2">
              <button
                type="button"
                onClick={() => router.push("/")}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1.5 px-2.5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer",
                  !expanded && "justify-center px-0 size-8"
                )}
                title="Return to Public Website"
              >
                <Globe className="size-4 shrink-0 text-white/70" />
                {expanded && <span className="text-[11px] font-semibold whitespace-nowrap">Public Site</span>}
              </button>
            </div>

            {/* ── Collapse / Expand toggle button ── */}
            <div className="flex w-full shrink-0 items-center justify-center pb-8 pt-1">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="grid size-[30px] place-items-center rounded-full bg-white text-[#0a0f13] shadow-md outline-none transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                title={expanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {expanded ? (
                  <ChevronLeft className="size-4 text-[#0a0f13]" />
                ) : (
                  <ChevronRight className="size-4 text-[#0a0f13]" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}
