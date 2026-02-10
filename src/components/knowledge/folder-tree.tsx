"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
}

interface FolderTreeItemProps {
  node: FolderNode;
  depth: number;
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

function FolderTreeItem({
  node,
  depth,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: FolderTreeItemProps) {
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);

  return (
    <div>
      <button
        onClick={() => {
          onSelect(node.id);
          if (hasChildren) onToggle(node.id);
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
              isExpanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3.5" />
        )}
        <Folder size={16} className="shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FolderTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FolderTreeProps {
  folders: FolderNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Collect all ancestor folder IDs for a given folder ID. */
function getAncestorIds(folders: FolderNode[], targetId: string): string[] {
  const path: string[] = [];

  function walk(nodes: FolderNode[], trail: string[]): boolean {
    for (const node of nodes) {
      if (node.id === targetId) {
        path.push(...trail);
        return true;
      }
      if (node.children && walk(node.children, [...trail, node.id])) {
        return true;
      }
    }
    return false;
  }

  walk(folders, []);
  return path;
}

export function FolderTree({ folders, selectedId, onSelect }: FolderTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Auto-expand top-level folders + path to selected
    const initial = new Set(folders.map((f) => f.id));
    if (selectedId) {
      for (const id of getAncestorIds(folders, selectedId)) {
        initial.add(id);
      }
    }
    return initial;
  });

  // When selectedId changes externally, ensure its ancestors are expanded
  useEffect(() => {
    if (!selectedId) return;
    const ancestors = getAncestorIds(folders, selectedId);
    if (ancestors.some((id) => !expandedIds.has(id))) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        for (const id of ancestors) next.add(id);
        return next;
      });
    }
  }, [selectedId, folders]);

  function handleToggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <nav className="space-y-0.5">
      {folders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          node={folder}
          depth={0}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={handleToggle}
        />
      ))}
    </nav>
  );
}
