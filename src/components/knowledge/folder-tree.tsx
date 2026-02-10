"use client";

import React, { useState } from "react";
import { ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

const mockFolders: FolderNode[] = [
  {
    id: "1",
    name: "Sales",
    children: [
      { id: "1-1", name: "Case Studies" },
      { id: "1-2", name: "Proposals" },
    ],
  },
  {
    id: "2",
    name: "Engineering",
    children: [
      { id: "2-1", name: "Standards" },
      { id: "2-2", name: "Procedures" },
    ],
  },
  {
    id: "3",
    name: "Compliance",
    children: [
      { id: "3-1", name: "Risk Awareness" },
      { id: "3-2", name: "Safety Protocols" },
    ],
  },
  {
    id: "4",
    name: "Training",
    children: [
      { id: "4-1", name: "Onboarding" },
      { id: "4-2", name: "Certifications" },
    ],
  },
];

interface FolderTreeItemProps {
  node: FolderNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function FolderTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
}: FolderTreeItemProps) {
  const [expanded, setExpanded] = useState(depth === 0);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) setExpanded(!expanded);
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors cursor-pointer",
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={cn(
              "shrink-0 transition-transform",
              expanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3.5" />
        )}
        <Folder size={16} className="shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FolderTree({ selectedId, onSelect }: FolderTreeProps) {
  return (
    <nav className="space-y-0.5">
      {mockFolders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          node={folder}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}
