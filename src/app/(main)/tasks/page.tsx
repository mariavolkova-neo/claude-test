"use client";

import React from "react";
import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/tasks";

const statusColumns: {
  key: TaskStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}[] = [
  {
    key: "not_started",
    label: "Not Started",
    icon: <Circle size={16} />,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: <Clock size={16} />,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: <AlertCircle size={16} />,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20",
  },
  {
    key: "completed",
    label: "Completed",
    icon: <CheckCircle2 size={16} />,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20",
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    assetId: "a1",
    assetName: "Introduction to Nuclear Safety Standards",
    assigneeId: "u1",
    assigneeName: "Tamar Lomidze",
    assignedById: "u2",
    assignedByName: "Alex Chen",
    status: "in_progress",
    dueDate: "2024-04-15",
    progress: 65,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-20",
  },
  {
    id: "2",
    assetId: "a2",
    assetName: "Reactor Design Fundamentals",
    assigneeId: "u1",
    assigneeName: "Tamar Lomidze",
    assignedById: "u3",
    assignedByName: "Sarah Johnson",
    status: "not_started",
    dueDate: "2024-05-01",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
  },
  {
    id: "3",
    assetId: "a3",
    assetName: "Environmental Impact Assessment Guide",
    assigneeId: "u4",
    assigneeName: "Marcus Rivera",
    assignedById: "u1",
    assignedByName: "Tamar Lomidze",
    status: "in_progress",
    dueDate: "2024-04-20",
    progress: 30,
    createdAt: "2024-03-10",
    updatedAt: "2024-03-25",
  },
  {
    id: "4",
    assetId: "a5",
    assetName: "Quality Assurance Program Manual",
    assigneeId: "u1",
    assigneeName: "Tamar Lomidze",
    assignedById: "u2",
    assignedByName: "Alex Chen",
    status: "completed",
    dueDate: "2024-03-30",
    progress: 100,
    createdAt: "2024-02-15",
    updatedAt: "2024-03-28",
  },
  {
    id: "5",
    assetId: "a4",
    assetName: "Radiation Protection Handbook",
    assigneeId: "u5",
    assigneeName: "Priya Patel",
    assignedById: "u1",
    assignedByName: "Tamar Lomidze",
    status: "overdue",
    dueDate: "2024-03-10",
    createdAt: "2024-02-01",
    updatedAt: "2024-03-11",
  },
  {
    id: "6",
    assetId: "a6",
    assetName: "Emergency Response Procedures",
    assigneeId: "u6",
    assigneeName: "James Kim",
    assignedById: "u2",
    assignedByName: "Alex Chen",
    status: "not_started",
    dueDate: "2024-05-15",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
];

function KanbanCard({ task }: { task: Task }) {
  const col = statusColumns.find((c) => c.key === task.status)!;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.assetName}</p>
        <button className="shrink-0 rounded-md p-1 hover:bg-accent">
          <MoreHorizontal size={14} className="text-muted-foreground" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Avatar
          fallback={task.assigneeName
            .split(" ")
            .map((n) => n[0])
            .join("")}
          size="sm"
          className="h-6 w-6 text-[10px]"
        />
        <span className="text-xs text-muted-foreground truncate">
          {task.assigneeName}
        </span>
      </div>

      {task.dueDate && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={12} />
          {new Date(task.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}

      {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all",
                col.key === "overdue" ? "bg-red-500" : "bg-primary"
              )}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-4 md:grid md:grid-cols-4 min-w-[800px] md:min-w-0">
        {statusColumns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col min-w-[220px] md:min-w-0 flex-1">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className={col.color}>{col.icon}</span>
                <span className="text-sm font-semibold">{col.label}</span>
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className={cn("flex-1 rounded-xl p-2 space-y-3 min-h-[200px]", col.bg)}>
                {colTasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No tasks
                  </p>
                ) : (
                  colTasks.map((task) => (
                    <KanbanCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const myTasks = mockTasks.filter((t) => t.assigneeId === "u1");
  const assignedByMe = mockTasks.filter((t) => t.assignedById === "u1");

  return (
    <div>
      <PageHeader
        title="Tasks"
        actions={
          <Button size="sm">
            <Plus size={16} />
            New Task
          </Button>
        }
      />

      <Tabs defaultValue="my-tasks" variant="pills" className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <TabsList>
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="assigned-by-me">Assigned by Me</TabsTrigger>
            <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:max-w-[240px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input placeholder="Search tasks..." className="pl-9 h-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter size={14} />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="my-tasks">
          <KanbanBoard tasks={myTasks} />
        </TabsContent>
        <TabsContent value="assigned-by-me">
          <KanbanBoard tasks={assignedByMe} />
        </TabsContent>
        <TabsContent value="all-tasks">
          <KanbanBoard tasks={mockTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
