"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsVariant = "default" | "pills";

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
  variant?: TabsVariant;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = React.createContext<TabsContextType>({
  activeTab: "",
  setActiveTab: () => {},
  variant: "default",
});

function Tabs({ defaultValue, children, className, variant = "default" }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { variant } = React.useContext(TabsContext);

  return (
    <div
      className={cn(
        "inline-flex items-center",
        variant === "default" && "gap-1 border-b border-border",
        variant === "pills" && "gap-2",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { activeTab, setActiveTab, variant } = React.useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors cursor-pointer",
        variant === "default" && [
          "px-4 py-2.5 -mb-px",
          isActive
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground hover:text-foreground",
        ],
        variant === "pills" && [
          "rounded-full px-4 py-1.5",
          isActive
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        ],
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return <div className={cn("mt-4", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
