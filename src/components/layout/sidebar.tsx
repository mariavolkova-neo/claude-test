"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  ClipboardList,
  BookOpen,
  Building2,
  Settings,
  FileText,
  HelpCircle,
  LogOut,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAssistantStore } from "@/stores/assistant-store";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const topNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <Home size={20} />, label: "Home", href: "/admin" },
  { icon: <ClipboardList size={20} />, label: "Tasks", href: "/tasks" },
  { icon: <BookOpen size={20} />, label: "Knowledge", href: "/knowledge" },
  { icon: <Building2 size={20} />, label: "Admin", href: "/admin" },
  { icon: <Settings size={20} />, label: "Settings", href: "/admin/settings" },
];

const bottomNav: NavItem[] = [
  { icon: <FileText size={20} />, label: "Documents", href: "/knowledge" },
  { icon: <HelpCircle size={20} />, label: "Help", href: "/help" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useAssistantStore();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[60px] flex-col items-center border-r bg-card py-4">
      {/* Top navigation */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {topNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Tooltip key={item.href} content={item.label} side="right">
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.icon}
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* Assistant toggle */}
      <Tooltip content="Assistant" side="right">
        <button
          onClick={toggle}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors mb-2",
            isOpen
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Sparkles size={20} />
        </button>
      </Tooltip>

      {/* Bottom navigation */}
      <div className="flex flex-col items-center gap-1">
        {bottomNav.map((item) => (
          <Tooltip key={item.label} content={item.label} side="right">
            <Link
              href={item.href}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.icon}
            </Link>
          </Tooltip>
        ))}

        {/* User menu */}
        <DropdownMenu
          align="start"
          trigger={
            <div className="mt-2">
              <Avatar fallback="MV" size="sm" />
            </div>
          }
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium">Maria Volkova</p>
            <p className="text-xs text-muted-foreground">maria@example.com</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Globe size={16} />
            Language
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut size={16} />
            Logout
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </aside>
  );
}
