"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AssistantPanel } from "@/components/assistant/assistant-panel";
import { useAssistantStore } from "@/stores/assistant-store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isKnowledgeCenter = pathname.startsWith("/knowledge");
  const { isOpen, displayMode, panelWidth } = useAssistantStore();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // When the assistant panel is docked, offset the main content
  const panelOffset = isOpen && displayMode === "panel" ? panelWidth : 0;
  const sidebarWidth = sidebarExpanded ? 220 : 60;

  if (isKnowledgeCenter) {
    return (
      <div className="min-h-screen bg-background">
        <Topbar />
        <main
          style={{ marginRight: panelOffset }}
          className="transition-[margin] duration-200"
        >
          {children}
        </main>
        <AssistantPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile header with menu toggle */}
      <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-card px-4 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <main
        className="transition-[margin] duration-300"
        style={{ marginLeft: sidebarWidth, marginRight: panelOffset }}
      >
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
      <AssistantPanel />
    </div>
  );
}
