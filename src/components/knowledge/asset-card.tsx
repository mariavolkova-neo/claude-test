"use client";

import React, { useState } from "react";
import {
  FileText,
  Globe,
  Upload,
  MoreHorizontal,
  FileImage,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AssignTaskModal } from "@/components/knowledge/assign-task-modal";
import type { Asset } from "@/types/knowledge";
import type { User } from "@/types/admin";
import type { AssignTaskPayload } from "@/types/tasks";

const typeIcons: Record<string, React.ReactNode> = {
  upload: <Upload size={14} />,
  flexdoc: <FileText size={14} />,
  google: <Globe size={14} />,
  onedrive: <FileImage size={14} />,
};

const typeColors: Record<string, string> = {
  upload: "bg-blue-100 text-blue-700",
  flexdoc: "bg-purple-100 text-purple-700",
  google: "bg-green-100 text-green-700",
  onedrive: "bg-sky-100 text-sky-700",
};

interface AssetCardProps {
  asset: Asset;
  allAssets?: Asset[];
  users?: User[];
  onAssignTask?: (payload: AssignTaskPayload) => void;
}

export function AssetCard({ asset, allAssets, users, onAssignTask }: AssetCardProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  return (
    <>
      <div className="group rounded-xl border bg-card overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
        {/* Thumbnail */}
        <div className="relative h-36 bg-muted">
          {asset.thumbnailUrl ? (
            <img
              src={asset.thumbnailUrl}
              alt={asset.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText size={32} className="text-muted-foreground/40" />
            </div>
          )}
          {/* Type badge */}
          <div
            className={`absolute left-3 top-3 flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${typeColors[asset.type]}`}
          >
            {typeIcons[asset.type]}
            {asset.type === "flexdoc"
              ? "FlexDoc"
              : asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight line-clamp-2">
              {asset.name}
            </h3>
            <DropdownMenu
              trigger={
                <button className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-accent">
                  <MoreHorizontal size={16} />
                </button>
              }
            >
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAssignModalOpen(true)}>
                Assign as Task
              </DropdownMenuItem>
              <DropdownMenuItem>Move to Folder</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
          {asset.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {asset.description}
            </p>
          )}
          {asset.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {asset.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {asset.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{asset.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${asset.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {users && onAssignTask && (
        <AssignTaskModal
          open={assignModalOpen}
          onOpenChange={setAssignModalOpen}
          initialAsset={asset}
          allAssets={allAssets ?? []}
          users={users}
          onSubmit={onAssignTask}
        />
      )}
    </>
  );
}
