"use client";

import { useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { AppHeader } from "./components/AppHeader";
import { AppMobileSidebar } from "./components/AppMobileSidebar";
import type { LayoutProps, UserProfile } from "./types";

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // In production, loaded from active Supabase session
  const defaultProfile: UserProfile = {
    id: "demo-user-id",
    email: "researcher@axiomproof.org",
    full_name: "Research Cohort Alpha",
    role: "student",
    school_name: "Academic Research Division",
    group_title: "Automated Sensor & Empirical Research Manuscript",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Mobile Drawer */}
      <AppMobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        userRole={defaultProfile.role}
      />

      {/* Desktop App Sidebar */}
      <div className="hidden md:block shrink-0">
        <AppSidebar userRole={defaultProfile.role} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          profile={defaultProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-[1440px] w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
