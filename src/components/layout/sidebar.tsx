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
  X,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAssistantStore } from "@/stores/assistant-store";

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
];

const supportNav: NavItem[] = [
  { icon: <CreditCard size={20} />, label: "Billing", href: "/account/billing" },
  { icon: <HelpCircle size={20} />, label: "Help Center", href: "/help" },
];

export interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavLink({
  item,
  expanded,
  isActive,
  onClick,
}: {
  item: NavItem;
  expanded: boolean;
  isActive: boolean;
  onClick?: () => void;
}) {
  const link = (
    <Link
      href={item.href}
      onClick={onClick}
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

function SidebarContent({
  expanded,
  onToggle,
  isMobile,
  onMobileClose,
}: {
  expanded: boolean;
  onToggle: () => void;
  isMobile: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const { isOpen, toggle } = useAssistantStore();

  const showLabels = expanded;
  const isActive = (href: string) => pathname.startsWith(href);
  const handleNavClick = isMobile ? onMobileClose : undefined;

  return (
    <>
      {/* Brand + Toggle */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b h-14",
          showLabels ? "justify-between px-4" : "justify-center"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5" onClick={handleNavClick}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            K
          </div>
          {showLabels && <span className="text-sm font-bold">KMS</span>}
        </Link>
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={onMobileClose}
          >
            <X size={18} />
          </Button>
        ) : expanded ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={onToggle}
          >
            <PanelLeft size={18} />
          </Button>
        ) : null}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {showLabels && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Main
          </p>
        )}
        <div className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              expanded={showLabels}
              isActive={isActive(item.href)}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </nav>

      {/* Assistant toggle */}
      <div className={cn("px-2 mb-2", showLabels ? "" : "flex justify-center")}>
        <Tooltip content="Assistant" side="right">
          <button
            onClick={toggle}
            className={cn(
              "flex items-center gap-3 rounded-lg transition-colors",
              showLabels ? "w-full px-3 py-2" : "h-10 w-10 justify-center",
              isOpen
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Sparkles size={20} />
            {showLabels && (
              <span className="text-sm font-medium">Assistant</span>
            )}
          </button>
        </Tooltip>
      </div>

      {/* Support navigation + User menu */}
      <div className={cn("border-t px-2 py-3", showLabels ? "" : "flex flex-col items-center gap-1")}>
        {supportNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            expanded={showLabels}
            isActive={isActive(item.href)}
            onClick={handleNavClick}
          />
        ))}

        {/* User menu */}
        {showLabels ? (
          <DropdownMenu
            align="start"
            trigger={
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 mt-1 cursor-pointer hover:bg-accent transition-colors">
                <Avatar fallback="MV" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Maria Volkova</p>
                  <p className="text-xs text-muted-foreground truncate">maria@example.com</p>
                </div>
              </div>
            }
          >
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
              <div className="flex justify-center mt-2 cursor-pointer">
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

      {/* Collapsed expand button (desktop only) */}
      {!isMobile && !expanded && (
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
    </>
  );
}

export function Sidebar({ expanded, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col border-r bg-card transition-all duration-300 overflow-hidden",
          expanded ? "w-[220px]" : "w-[60px]"
        )}
      >
        <SidebarContent
          expanded={expanded}
          onToggle={onToggle}
          isMobile={false}
          onMobileClose={onMobileClose}
        />
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex md:hidden h-screen w-[260px] flex-col bg-card shadow-xl transition-transform duration-300 overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          expanded={true}
          onToggle={onToggle}
          isMobile={true}
          onMobileClose={onMobileClose}
        />
      </aside>
    </>
  );
}
