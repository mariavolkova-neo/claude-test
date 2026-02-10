"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Settings,
  ChevronDown,
  Plus,
  ArrowUpDown,
  Eye,
  LayoutGrid,
  List,
  MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/admin";

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
    firstName: "Priya",
    lastName: "Patel",
    displayName: "Priya Patel",
    email: "priya@example.com",
    title: "Data Scientist",
    status: "pending",
    role: "member",
    division: "Data",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-03-10",
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Kim",
    displayName: "James Kim",
    email: "james@example.com",
    title: "DevOps Engineer",
    status: "active",
    role: "member",
    division: "Infrastructure",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-03-15",
  },
  {
    id: "7",
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
  {
    id: "8",
    firstName: "David",
    lastName: "Brown",
    displayName: "David Brown",
    email: "david@example.com",
    title: "Frontend Developer",
    status: "inactive",
    role: "viewer",
    division: "Engineering",
    preferredLanguages: [],
    contentLicenses: [],
    tags: [],
    createdAt: "2024-04-10",
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = mockUsers.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Users"
        backHref="/admin"
        backLabel="Admin center"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings size={18} />
            </Button>
            <DropdownMenu
              trigger={
                <Button variant="outline" size="sm">
                  Options
                  <ChevronDown size={16} />
                </Button>
              }
            >
              <DropdownMenuItem>Import users</DropdownMenuItem>
              <DropdownMenuItem>Export users</DropdownMenuItem>
            </DropdownMenu>
            <Button size="sm">
              <Plus size={16} />
              New
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <ArrowUpDown size={16} />
          </Button>
          <Button variant="ghost" size="icon">
            <Eye size={16} />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* User Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((user) => (
          <Link
            key={user.id}
            href={`/admin/users/${user.id}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <Avatar
              fallback={`${user.firstName[0]}${user.lastName[0]}`}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.displayName}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.title}
              </p>
            </div>
            <DropdownMenu
              trigger={
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-accent"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal size={16} />
                </button>
              }
            >
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenu>
          </Link>
        ))}
      </div>
    </div>
  );
}
