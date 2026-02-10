export type TaskStatus = "not_started" | "in_progress" | "completed" | "overdue";

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
  createdAt: string;
  updatedAt: string;
}

export type TaskTab = "my-tasks" | "assigned-by-me" | "all-tasks";
