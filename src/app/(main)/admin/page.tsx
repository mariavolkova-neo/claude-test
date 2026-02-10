"use client";

import React from "react";
import Link from "next/link";
import { Users, Sparkles, BookOpen, ChevronDown, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const adminCards = [
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    description: "Manage team members, roles, and permissions",
  },
  {
    title: "Knowledge AI",
    icon: Sparkles,
    href: "/admin/knowledge-ai",
    description: "Configure AI assistant and knowledge settings",
  },
  {
    title: "Knowledge Center",
    icon: BookOpen,
    href: "/knowledge",
    description: "Manage content and learning resources",
    comingSoon: true,
  },
];

export default function AdminCenterPage() {
  return (
    <div>
      <PageHeader
        title="Admin Center"
        actions={
          <DropdownMenu
            trigger={
              <Button variant="outline" size="sm">
                Options
                <ChevronDown size={16} />
              </Button>
            }
          >
            <DropdownMenuItem>
              <Settings size={16} />
              Settings
            </DropdownMenuItem>
          </DropdownMenu>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link
            key={card.title}
            href={card.comingSoon ? "#" : card.href}
            className={`group relative flex flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center transition-all ${
              card.comingSoon
                ? "cursor-default opacity-70"
                : "hover:border-primary/20 hover:shadow-md"
            }`}
          >
            {card.comingSoon && (
              <span className="absolute right-3 top-3 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Coming Soon
              </span>
            )}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <card.icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
