import type { ReactNode } from "react";

export type UserRole = "student" | "teacher" | "admin";

export type LayoutProps = {
  children: ReactNode;
  currentPage?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_name?: string;
  group_id?: string;
  group_title?: string;
};

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: string;
  badge?: string;
  teacherOnly?: boolean;
};

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    key: "workspace",
    label: "Workspace",
    href: "/workspace",
    icon: "FolderKanban",
  },
  {
    key: "audit",
    label: "Alignment Audit",
    href: "/audit",
    icon: "FileCheck2",
    badge: "Core",
  },
  {
    key: "synthesis",
    label: "Socratic Coach",
    href: "/synthesis",
    icon: "Sparkles",
  },
  {
    key: "defense",
    label: "Viva-Voce Mock",
    href: "/defense",
    icon: "Mic",
    badge: "Voice",
  },
  {
    key: "teacher",
    label: "Advisory Heatmap",
    href: "/teacher",
    icon: "ShieldAlert",
    teacherOnly: true,
  },
];
