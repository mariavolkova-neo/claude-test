"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const isFullWidth =
    pathname.startsWith("/knowledge") || pathname.startsWith("/assistant");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((prev) => !prev)}
      />
      <main
        className="transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? 220 : 60 }}
      >
        {isFullWidth ? (
          children
        ) : (
          <div className="mx-auto max-w-6xl p-6">{children}</div>
        )}
      </main>
    </div>
  );
}
