export type TaskStatus = "not_started" | "in_progress" | "completed" | "overdue";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  assetId: string;
  assetName: string;
  assigneeId: string;
  assigneeName: string;
  assignedById: string;
  assignedByName: string;
  status: TaskStatus;
  dueDate?: string;
  progress?: number;
  priority?: TaskPriority;
  warningPeriodDays?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignTaskPayload {
  assetId: string;
  assetName: string;
  assigneeIds: string[];
  dueDate: string;
  warningPeriodDays?: number;
  priority: TaskPriority;
  notes?: string;
}

export type TaskTab = "my-tasks" | "assigned-by-me" | "all-tasks";
