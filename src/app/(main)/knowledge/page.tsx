"use client";

import React, { useState, useMemo } from "react";
import {
  Info,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  Tag,
  LayoutGrid,
  List,
  FolderOpen,
  Home,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FolderTree } from "@/components/knowledge/folder-tree";
import type { FolderNode } from "@/components/knowledge/folder-tree";
import { AssetCard } from "@/components/knowledge/asset-card";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Asset } from "@/types/knowledge";
import type { User } from "@/types/admin";
import type { AssignTaskPayload } from "@/types/tasks";

// ---------------------------------------------------------------------------
// Mock data – single source of truth
// ---------------------------------------------------------------------------

const folderTree: FolderNode[] = [
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

const mockAssets: Asset[] = [
  {
    id: "a1",
    name: "Introduction to Nuclear Safety Standards",
    description:
      "Comprehensive overview of nuclear safety protocols and international standards compliance requirements.",
    type: "flexdoc",
    folderId: "3-2",
    tags: ["Safety", "Compliance"],
    progress: 65,
    createdAt: "2024-01-15",
    updatedAt: "2024-03-01",
    createdBy: "admin",
  },
  {
    id: "a2",
    name: "Reactor Design Fundamentals",
    description:
      "Core principles of reactor design including thermal hydraulics and neutronics.",
    type: "upload",
    folderId: "2-1",
    tags: ["Engineering", "Design"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-15",
    createdBy: "admin",
  },
  {
    id: "a3",
    name: "Environmental Impact Assessment Guide",
    description:
      "Step-by-step guide for conducting environmental impact assessments for nuclear facilities.",
    type: "google",
    folderId: "3",
    tags: ["Environment", "Compliance"],
    progress: 30,
    createdAt: "2024-02-10",
    updatedAt: "2024-03-05",
    createdBy: "admin",
  },
  {
    id: "a4",
    name: "Radiation Protection Handbook",
    description:
      "Essential radiation protection measures, dosimetry, and ALARA principles.",
    type: "upload",
    folderId: "2-2",
    tags: ["Safety", "Health"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
    createdBy: "admin",
  },
  {
    id: "a5",
    name: "Quality Assurance Program Manual",
    description:
      "Organization-wide QA program documentation including audit procedures.",
    type: "onedrive",
    folderId: "1-1",
    tags: ["Quality", "Management"],
    progress: 100,
    createdAt: "2024-03-15",
    updatedAt: "2024-04-01",
    createdBy: "admin",
  },
  {
    id: "a6",
    name: "Emergency Response Procedures",
    description:
      "Emergency preparedness and response procedures for various incident scenarios.",
    type: "flexdoc",
    folderId: "4-1",
    tags: ["Safety", "Emergency"],
    createdAt: "2024-04-01",
    updatedAt: "2024-04-10",
    createdBy: "admin",
  },
  {
    id: "a7",
    name: "Client Pitch Deck – Q1 2024",
    description: "Quarterly pitch deck for prospective engineering clients.",
    type: "google",
    folderId: "1-2",
    tags: ["Sales", "Presentation"],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-05",
    createdBy: "admin",
  },
  {
    id: "a8",
    name: "Risk Assessment Methodology",
    description:
      "Standard methodology for performing risk assessments across facility operations.",
    type: "flexdoc",
    folderId: "3-1",
    tags: ["Risk", "Compliance"],
    progress: 80,
    createdAt: "2024-02-20",
    updatedAt: "2024-03-15",
    createdBy: "admin",
  },
  {
    id: "a9",
    name: "New Hire Training Schedule",
    description: "Week-by-week training plan for new engineering hires.",
    type: "upload",
    folderId: "4-1",
    tags: ["Training", "Onboarding"],
    createdAt: "2024-03-05",
    updatedAt: "2024-03-20",
    createdBy: "admin",
  },
  {
    id: "a10",
    name: "Professional Certification Guide",
    description:
      "Overview of required professional certifications and renewal processes.",
    type: "flexdoc",
    folderId: "4-2",
    tags: ["Training", "Certifications"],
    progress: 45,
    createdAt: "2024-04-10",
    updatedAt: "2024-04-20",
    createdBy: "admin",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface FlatFolder {
  id: string;
  name: string;
  parentId: string | null;
  children: FolderNode[];
}

/** Build a flat map from the tree so we can look up any folder by id. */
function buildFolderMap(
  nodes: FolderNode[],
  parentId: string | null = null
): Map<string, FlatFolder> {
  const map = new Map<string, FlatFolder>();
  for (const node of nodes) {
    map.set(node.id, {
      id: node.id,
      name: node.name,
      parentId,
      children: node.children ?? [],
    });
    if (node.children) {
      for (const [k, v] of buildFolderMap(node.children, node.id)) {
        map.set(k, v);
      }
    }
  }
  return map;
}

/** Walk up from a folder to root, returning the breadcrumb path. */
function getBreadcrumbPath(
  folderMap: Map<string, FlatFolder>,
  folderId: string | null
): { id: string | null; name: string }[] {
  const trail: { id: string | null; name: string }[] = [];
  let current = folderId;
  while (current) {
    const folder = folderMap.get(current);
    if (!folder) break;
    trail.unshift({ id: folder.id, name: folder.name });
    current = folder.parentId;
  }
  return [{ id: null, name: "Knowledge Center" }, ...trail];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folderSidebarOpen, setFolderSidebarOpen] = useState(false);

  const folderMap = useMemo(() => buildFolderMap(folderTree), []);

  const breadcrumbs = useMemo(
    () => getBreadcrumbPath(folderMap, selectedFolderId),
    [folderMap, selectedFolderId]
  );

  // Subfolders of the currently selected folder
  const subfolders = useMemo(() => {
    if (!selectedFolderId) return folderTree;
    const folder = folderMap.get(selectedFolderId);
    return folder?.children ?? [];
  }, [folderMap, selectedFolderId]);

  // Assets that belong to the current folder
  const visibleAssets = useMemo(() => {
    if (!selectedFolderId) return mockAssets;
    return mockAssets.filter((a) => a.folderId === selectedFolderId);
  }, [selectedFolderId]);

  const currentName = selectedFolderId
    ? (folderMap.get(selectedFolderId)?.name ?? "Knowledge Center")
    : "Knowledge Center";

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
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id ?? "root"}>
                  {i > 0 && <ChevronRight size={12} className="shrink-0" />}
                  {isLast ? (
                    <span className="font-medium text-foreground">
                      {crumb.name}
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedFolderId(crumb.id)}
                      className="hover:text-foreground transition-colors cursor-pointer"
                    >
                      {i === 0 ? (
                        <span className="flex items-center gap-1">
                          <Home size={12} />
                          {crumb.name}
                        </span>
                      ) : (
                        crumb.name
                      )}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{currentName}</h1>
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
      <div className="mx-auto max-w-7xl flex gap-0 relative">
        {/* Mobile folder sidebar backdrop */}
        {folderSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={() => setFolderSidebarOpen(false)}
          />
        )}

        {/* Folder Sidebar — always visible on md+, drawer on mobile */}
        <aside
          className={cn(
            "fixed md:relative z-30 md:z-auto top-0 left-0 h-full md:h-auto w-64 md:w-56 shrink-0 border-r bg-card md:bg-transparent p-4 transition-transform duration-300 md:translate-x-0",
            folderSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-3 md:hidden">
            <p className="text-sm font-semibold">Folders</p>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setFolderSidebarOpen(false)}
            >
              <PanelLeftClose size={16} />
            </Button>
          </div>
          <FolderTree
            folders={folderTree}
            selectedId={selectedFolderId}
            onSelect={(id) => {
              setSelectedFolderId(id);
              setFolderSidebarOpen(false);
            }}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6">
          {/* Mobile folder toggle */}
          <Button
            variant="outline"
            size="sm"
            className="mb-4 md:hidden"
            onClick={() => setFolderSidebarOpen(true)}
          >
            <PanelLeft size={14} />
            Folders
          </Button>
          {/* Folders Section */}
          {subfolders.length > 0 && (
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
                {subfolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
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
          )}

          {/* Items Section */}
          <section className={subfolders.length > 0 ? "mt-8" : ""}>
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
            {visibleAssets.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleAssets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen
                  size={48}
                  className="text-muted-foreground/30 mb-4"
                />
                <p className="text-muted-foreground">
                  No items in this folder
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
