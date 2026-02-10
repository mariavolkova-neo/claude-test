"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Building2,
  Sparkles,
  CreditCard,
  HelpCircle,
  LogOut,
  Globe,
  PanelLeft,
  PanelRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const mainNav: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
  { icon: <ClipboardList size={20} />, label: "Tasks", href: "/tasks" },
  { icon: <BookOpen size={20} />, label: "Knowledge Center", href: "/knowledge" },
  { icon: <Building2 size={20} />, label: "Admin", href: "/admin" },
  { icon: <Sparkles size={20} />, label: "Assistant", href: "/assistant" },
];

const supportNav: NavItem[] = [
  { icon: <CreditCard size={20} />, label: "Billing", href: "/account/billing" },
  { icon: <HelpCircle size={20} />, label: "Help Center", href: "/help" },
];

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

function NavLink({
  item,
  expanded,
  isActive,
}: {
  item: NavItem;
  expanded: boolean;
  isActive: boolean;
}) {
  const link = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg transition-colors",
        expanded ? "px-3 py-2" : "mx-auto h-10 w-10 justify-center",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <span className="shrink-0">{item.icon}</span>
      {expanded && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}
    </Link>
  );

  if (expanded) return link;

  return (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  );
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin" || (pathname.startsWith("/admin/") && !mainNav.some(
        (n) => n.href !== "/admin" && pathname.startsWith(n.href)
      ));
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300 overflow-hidden",
        expanded ? "w-[220px]" : "w-[60px]"
      )}
    >
      {/* Brand + Toggle */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b h-14",
          expanded ? "justify-between px-4" : "justify-center"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            K
          </div>
          {expanded && <span className="text-sm font-bold">KMS</span>}
        </Link>
        {expanded && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={onToggle}
          >
            <PanelLeft size={18} />
          </Button>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {expanded && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </p>
        )}
        <div className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              expanded={expanded}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Support navigation */}
      <div className="px-2 pb-4">
        {expanded && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </p>
        )}
        <div className="flex flex-col gap-1">
          {supportNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              expanded={expanded}
              isActive={isActive(item.href)}
            />
          ))}
        </div>
      </div>

      {/* User section */}
      <div className="border-t px-2 py-3">
        {expanded ? (
          <DropdownMenu
            align="start"
            trigger={
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent cursor-pointer">
                <Avatar fallback="MV" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Maria Volkova</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Premium Plan
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
              </button>
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
        ) : (
          <DropdownMenu
            align="start"
            trigger={
              <div className="flex justify-center">
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
        )}
      </div>

      {/* Collapsed expand button */}
      {!expanded && (
        <div className="flex justify-center pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onToggle}
          >
            <PanelRight size={18} />
          </Button>
        </div>
      )}
    </aside>
  );
}
