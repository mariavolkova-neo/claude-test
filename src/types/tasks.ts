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
  acceptanceDeadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AssignmentMode = "absolute" | "relative";

export interface AssignmentConfig {
  mode: AssignmentMode;
  priority: TaskPriority;
  notes?: string;
  // Absolute mode fields
  dueDate?: string;
  warningDate?: string;
  acceptanceDeadline?: string;
  // Relative mode fields
  dueInDays?: number;
  warningInDays?: number;
  acceptWithinHours?: number;
}

export interface AssetAssignment {
  assetId: string;
  assetName: string;
  useGlobalConfig: boolean;
  overrideConfig?: AssignmentConfig;
}

export interface AssignTaskPayload {
  assigneeIds: string[];
  globalConfig: AssignmentConfig;
  assets: AssetAssignment[];
}

export type TaskTab = "my-tasks" | "assigned-by-me" | "all-tasks";
