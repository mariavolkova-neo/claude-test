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
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Task, TaskStatus } from "@/types/tasks";

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  not_started: {
    label: "Not Started",
    icon: <Circle size={14} />,
    color: "text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock size={14} />,
    color: "text-blue-600",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={14} />,
    color: "text-green-600",
  },
  overdue: {
    label: "Overdue",
    icon: <AlertCircle size={14} />,
    color: "text-red-600",
  },
};

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

function TaskCard({ task }: { task: Task }) {
  const config = statusConfig[task.status];

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md">
      <div className={`shrink-0 ${config.color}`}>{config.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{task.assetName}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User size={12} />
            {task.assigneeName}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        {task.progress !== undefined && (
          <div className="mt-2 h-1.5 w-full max-w-[200px] rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        )}
      </div>
      <Badge
        variant="secondary"
        className={`shrink-0 text-xs ${config.color}`}
      >
        {config.label}
      </Badge>
      <button className="shrink-0 p-1 rounded-md hover:bg-accent">
        <MoreHorizontal size={16} className="text-muted-foreground" />
      </button>
    </div>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2
          size={48}
          className="text-muted-foreground/30 mb-4"
        />
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
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

      <Tabs defaultValue="my-tasks" className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="assigned-by-me">Assigned by Me</TabsTrigger>
            <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative max-w-[240px]">
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
          <TaskList tasks={myTasks} />
        </TabsContent>
        <TabsContent value="assigned-by-me">
          <TaskList tasks={assignedByMe} />
        </TabsContent>
        <TabsContent value="all-tasks">
          <TaskList tasks={mockTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
