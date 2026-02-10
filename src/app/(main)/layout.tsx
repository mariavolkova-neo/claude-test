"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullWidth =
    pathname.startsWith("/knowledge") || pathname.startsWith("/assistant");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[60px]">
        {isFullWidth ? (
          children
        ) : (
          <div className="mx-auto max-w-6xl p-6">{children}</div>
        )}
      </main>
    </div>
  );
}
