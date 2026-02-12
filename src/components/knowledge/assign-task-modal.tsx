"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/types/knowledge";
import type { User } from "@/types/admin";
import type { TaskPriority, AssignTaskPayload } from "@/types/tasks";

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset;
  users: User[];
  onSubmit: (payload: AssignTaskPayload) => void;
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", color: "text-blue-600 dark:text-blue-400" },
  { value: "high", label: "High", color: "text-amber-600 dark:text-amber-400" },
  { value: "urgent", label: "Urgent", color: "text-red-600 dark:text-red-400" },
];

export function AssignTaskModal({
  open,
  onOpenChange,
  asset,
  users,
  onSubmit,
}: AssignTaskModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [warningDays, setWarningDays] = useState<number | "">(3);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [notes, setNotes] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedUsers([]);
      setUserSearch("");
      setDueDate("");
      setWarningDays(3);
      setPriority("medium");
      setNotes("");
    }
  }, [open]);

  const filteredUsers = users.filter((user) => {
    if (user.status !== "active") return false;
    const query = userSearch.toLowerCase();
    if (!query) return true;
    return (
      user.displayName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const isSelected = (user: User) =>
    selectedUsers.some((u) => u.id === user.id);

  function toggleUser(user: User) {
    setSelectedUsers((prev) =>
      isSelected(user) ? prev.filter((u) => u.id !== user.id) : [...prev, user]
    );
  }

  function removeUser(userId: string) {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  const canSubmit = selectedUsers.length > 0 && dueDate !== "";

  function handleSubmit() {
    const payload: AssignTaskPayload = {
      assetId: asset.id,
      assetName: asset.name,
      assigneeIds: selectedUsers.map((u) => u.id),
      dueDate,
      warningPeriodDays: warningDays === "" ? undefined : warningDays,
      priority,
      notes: notes.trim() || undefined,
    };
    onSubmit(payload);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign as Task</DialogTitle>
          <DialogDescription>
            Assign &ldquo;{asset.name}&rdquo; to team members
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* User multi-select */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Assign to
            </label>

            {/* Selected user chips */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {user.displayName}
                    <button
                      onClick={() => removeUser(user.id)}
                      className="rounded-sm p-0.5 transition-colors hover:bg-accent cursor-pointer"
                      aria-label={`Remove ${user.displayName}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* User list */}
            <div className="max-h-[160px] overflow-y-auto rounded-lg border">
              {filteredUsers.length === 0 ? (
                <p className="p-3 text-center text-sm text-muted-foreground">
                  No users found
                </p>
              ) : (
                filteredUsers.map((user) => {
                  const selected = isSelected(user);
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleUser(user)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent cursor-pointer"
                    >
                      <Avatar
                        fallback={`${user.firstName[0]}${user.lastName[0]}`}
                        src={user.avatarUrl}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.title}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {user.role}
                      </Badge>
                      {selected && (
                        <Check size={16} className="shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Due date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Warning period */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Warning period
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={90}
                className="w-20"
                value={warningDays}
                onChange={(e) =>
                  setWarningDays(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <span className="text-sm text-muted-foreground">
                days before due date
              </span>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <Button
                  key={p.value}
                  type="button"
                  variant={priority === p.value ? "secondary" : "outline"}
                  size="sm"
                  className={priority === p.value ? p.color : ""}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Notes (optional)
            </label>
            <Textarea
              placeholder="Add instructions or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
