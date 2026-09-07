"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  FileCheck2,
  Sparkles,
  Mic,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, type UserRole } from "../types";

export function AppSidebar({ userRole = "student" }: { userRole?: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.teacherOnly && userRole === "student") return false;
    return true;
  });

  const getIcon = (iconName: string, active: boolean) => {
    const props = {
      className: cn("size-5 transition-transform duration-150", active ? "scale-105" : "opacity-80"),
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
        return <ShieldAlert {...props} />;
      default:
        return <GraduationCap {...props} />;
    }
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-border/70 bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out select-none z-30",
        collapsed ? "w-[76px]" : "w-[240px]"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-display font-bold text-base leading-tight tracking-tight">
                ScholarFlow
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
                DepEd SHS Research
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => router.push(item.href)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-full py-2.5 px-3.5 text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-sidebar-foreground/75 hover:bg-black/5 dark:hover:bg-white/5 hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <div className="shrink-0">{getIcon(item.icon, isActive)}</div>

              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap truncate">
                  {item.label}
                </span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-primary/15 text-primary"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Collapse Toggle */}
      <div className="p-3 border-t border-border/40">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-sidebar-foreground transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
