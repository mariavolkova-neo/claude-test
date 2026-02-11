"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFullWidth =
    pathname.startsWith("/knowledge") || pathname.startsWith("/assistant");

  const desktopMargin = sidebarExpanded ? 220 : 60;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex md:hidden h-14 items-center justify-between border-b bg-card px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
              K
            </div>
            <span className="text-sm font-bold">KMS</span>
          </Link>
        </div>
        <Avatar fallback="MV" size="sm" />
      </header>

      <main
        className="transition-[margin] duration-300"
        style={{ marginLeft: desktopMargin }}
      >
        {/* Reset margin on mobile via a wrapper — inline style sets desktop, CSS overrides mobile */}
        <style>{`@media (max-width: 767px) { main { margin-left: 0 !important; } }`}</style>
        {isFullWidth ? (
          children
        ) : (
          <div className="mx-auto max-w-6xl p-4 md:p-6">{children}</div>
        )}
      </main>
    </div>
  );
}
