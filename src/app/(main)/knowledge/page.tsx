"use client";

import React, { useState } from "react";
import {
  Info,
  Plus,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Tag,
  LayoutGrid,
  List,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderTree } from "@/components/knowledge/folder-tree";
import { AssetCard } from "@/components/knowledge/asset-card";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Asset } from "@/types/knowledge";
import type { User } from "@/types/admin";
import type { AssignTaskPayload } from "@/types/tasks";

const mockAssets: Asset[] = [
  {
    id: "1",
    name: "Introduction to Nuclear Safety Standards",
    description:
      "Comprehensive overview of nuclear safety protocols and international standards compliance requirements.",
    type: "flexdoc",
    tags: ["Safety", "Compliance"],
    progress: 65,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-01",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "Reactor Design Fundamentals",
    description:
      "Core principles of reactor design including thermal hydraulics and neutronics.",
    type: "upload",
    tags: ["Engineering", "Design"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-15",
    createdBy: "admin",
  },
  {
    id: "3",
    name: "Environmental Impact Assessment Guide",
    description:
      "Step-by-step guide for conducting environmental impact assessments for nuclear facilities.",
    type: "google",
    tags: ["Environment", "Compliance"],
    progress: 30,
    createdAt: "2024-02-10",
    updatedAt: "2024-03-05",
    createdBy: "admin",
  },
  {
    id: "4",
    name: "Radiation Protection Handbook",
    description:
      "Essential radiation protection measures, dosimetry, and ALARA principles.",
    type: "upload",
    tags: ["Safety", "Health"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
    createdBy: "admin",
  },
  {
    id: "5",
    name: "Quality Assurance Program Manual",
    description:
      "Organization-wide QA program documentation including audit procedures.",
    type: "onedrive",
    tags: ["Quality", "Management"],
    progress: 100,
    createdAt: "2024-03-15",
    updatedAt: "2024-04-01",
    createdBy: "admin",
  },
  {
    id: "6",
    name: "Emergency Response Procedures",
    description:
      "Emergency preparedness and response procedures for various incident scenarios.",
    type: "flexdoc",
    tags: ["Safety", "Emergency"],
    createdAt: "2024-04-01",
    updatedAt: "2024-04-10",
    createdBy: "admin",
  },
];

const mockFolders = [
  { id: "f1", name: "Case Studies" },
  { id: "f2", name: "Risk Awareness" },
];

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Tamar",
    lastName: "Lomidze",
    displayName: "Tamar Lomidze",
    email: "tamar@example.com",
    title: "Senior Engineer",
    status: "active",
    role: "admin",
    division: "Engineering",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Alex",
    lastName: "Chen",
    displayName: "Alex Chen",
    email: "alex@example.com",
    title: "Product Manager",
    status: "active",
    role: "manager",
    division: "Product",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    firstName: "Sarah",
    lastName: "Johnson",
    displayName: "Sarah Johnson",
    email: "sarah@example.com",
    title: "Designer",
    status: "active",
    role: "member",
    division: "Design",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-02-15",
  },
  {
    id: "4",
    firstName: "Marcus",
    lastName: "Rivera",
    displayName: "Marcus Rivera",
    email: "marcus@example.com",
    title: "QA Lead",
    status: "active",
    role: "member",
    division: "Engineering",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-03-01",
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Williams",
    displayName: "Emma Williams",
    email: "emma@example.com",
    title: "Content Strategist",
    status: "active",
    role: "member",
    division: "Marketing",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-04-01",
  },
];

export default function KnowledgeCenterPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>("1");

  function handleAssignTask(payload: AssignTaskPayload) {
    console.log("Assign task:", payload);
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-60" />
      </div>

      {/* Breadcrumb + Title */}
      <div className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs text-muted-foreground">
            Knowledge Center / PMI Delta Engineering / Introduction to Nuclear
          </p>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Introduction to Nuclear</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Info size={18} />
              </Button>
              <DropdownMenu
                trigger={
                  <Button size="sm">
                    <Plus size={16} />
                    New
                    <ChevronDown size={14} />
                  </Button>
                }
              >
                <DropdownMenuItem>Upload File</DropdownMenuItem>
                <DropdownMenuItem>New FlexDoc</DropdownMenuItem>
                <DropdownMenuItem>Link from Google Drive</DropdownMenuItem>
                <DropdownMenuItem>Link from OneDrive</DropdownMenuItem>
                <DropdownMenuItem>New Folder</DropdownMenuItem>
              </DropdownMenu>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl flex gap-0">
        {/* Folder Sidebar */}
        <aside className="w-56 shrink-0 border-r p-4">
          <FolderTree
            selectedId={selectedFolder}
            onSelect={setSelectedFolder}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {/* Folders Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Folders
              </h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowUpDown size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Tag size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <LayoutGrid size={14} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {mockFolders.map((folder) => (
                <button
                  key={folder.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md text-left cursor-pointer"
                >
                  <FolderOpen
                    size={20}
                    className="shrink-0 text-primary"
                  />
                  <span className="text-sm font-medium truncate">
                    {folder.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Items Section */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Items
              </h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ArrowUpDown size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Tag size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <LayoutGrid size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <List size={14} />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  users={mockUsers}
                  onAssignTask={handleAssignTask}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
