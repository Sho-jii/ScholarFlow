"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  FileCheck2,
  Sparkles,
  Mic,
  ShieldAlert,
  X,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, type UserRole } from "../types";

interface AppMobileSidebarProps {
  open: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

export function AppMobileSidebar({
  open,
  onClose,
  userRole = "student",
}: AppMobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (!open) return null;

  const navItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.teacherOnly && userRole === "student") return false;
    return true;
  });

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const getIcon = (iconName: string) => {
    const props = { className: "size-5 shrink-0" };
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
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex w-4/5 max-w-xs flex-1 flex-col bg-background text-foreground border-r border-border p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-2xl bg-primary text-white">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base leading-none">ScholarFlow</h2>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-1">
                DepEd Research
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-full py-3 px-4 text-sm font-semibold transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground"
                )}
              >
                {getIcon(item.icon)}
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
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
      </div>
    </div>
  );
}
