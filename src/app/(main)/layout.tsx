"use client";

import React from "react";
import { usePathname } from "next/navigation";
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

  // When the assistant panel is docked, offset the main content
  const panelOffset = isOpen && displayMode === "panel" ? panelWidth : 0;

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
      <Sidebar />
      <main
        className="ml-[60px] transition-[margin] duration-200"
        style={{ marginRight: panelOffset }}
      >
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
      <AssistantPanel />
    </div>
  );
}
