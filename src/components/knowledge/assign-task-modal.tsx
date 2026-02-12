"use client";

import React, { useReducer, useEffect } from "react";
import { Search, X, Check, FileText, Plus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { Asset } from "@/types/knowledge";
import type { User } from "@/types/admin";
import type {
  TaskPriority,
  AssignmentMode,
  AssignmentConfig,
  AssetAssignment,
  AssignTaskPayload,
} from "@/types/tasks";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface AssignTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAsset: Asset;
  allAssets: Asset[];
  users: User[];
  onSubmit: (payload: AssignTaskPayload) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-muted-foreground" },
  { value: "medium", label: "Medium", color: "text-blue-600 dark:text-blue-400" },
  { value: "high", label: "High", color: "text-amber-600 dark:text-amber-400" },
  { value: "urgent", label: "Urgent", color: "text-red-600 dark:text-red-400" },
];

function defaultConfig(): AssignmentConfig {
  return { mode: "absolute", priority: "medium" };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

interface ModalFormState {
  recipients: User[];
  recipientSearch: string;
  globalConfig: AssignmentConfig;
  assets: AssetAssignment[];
  assetSearch: string;
  errors: string[];
}

type ModalFormAction =
  | { type: "TOGGLE_RECIPIENT"; user: User }
  | { type: "REMOVE_RECIPIENT"; userId: string }
  | { type: "SET_RECIPIENT_SEARCH"; query: string }
  | { type: "SET_MODE"; mode: AssignmentMode }
  | { type: "SET_GLOBAL_FIELD"; field: keyof AssignmentConfig; value: string | number | undefined }
  | { type: "SET_GLOBAL_PRIORITY"; priority: TaskPriority }
  | { type: "SET_GLOBAL_NOTES"; notes: string }
  | { type: "TOGGLE_ASSET_OVERRIDE"; assetId: string }
  | { type: "SET_ASSET_MODE"; assetId: string; mode: AssignmentMode }
  | { type: "SET_ASSET_FIELD"; assetId: string; field: keyof AssignmentConfig; value: string | number | undefined }
  | { type: "SET_ASSET_PRIORITY"; assetId: string; priority: TaskPriority }
  | { type: "ADD_ASSET"; asset: Asset }
  | { type: "REMOVE_ASSET"; assetId: string }
  | { type: "SET_ASSET_SEARCH"; query: string }
  | { type: "SET_ERRORS"; errors: string[] }
  | { type: "RESET"; initialAsset: Asset };

function clearTimingFields(config: AssignmentConfig): AssignmentConfig {
  return {
    ...config,
    dueDate: undefined,
    warningDate: undefined,
    acceptanceDeadline: undefined,
    dueInDays: undefined,
    warningInDays: undefined,
    acceptWithinHours: undefined,
  };
}

function formReducer(state: ModalFormState, action: ModalFormAction): ModalFormState {
  switch (action.type) {
    case "TOGGLE_RECIPIENT": {
      const exists = state.recipients.some((u) => u.id === action.user.id);
      return {
        ...state,
        recipients: exists
          ? state.recipients.filter((u) => u.id !== action.user.id)
          : [...state.recipients, action.user],
        errors: [],
      };
    }
    case "REMOVE_RECIPIENT":
      return {
        ...state,
        recipients: state.recipients.filter((u) => u.id !== action.userId),
        errors: [],
      };
    case "SET_RECIPIENT_SEARCH":
      return { ...state, recipientSearch: action.query };
    case "SET_MODE":
      return {
        ...state,
        globalConfig: { ...clearTimingFields(state.globalConfig), mode: action.mode },
        errors: [],
      };
    case "SET_GLOBAL_FIELD":
      return {
        ...state,
        globalConfig: { ...state.globalConfig, [action.field]: action.value },
        errors: [],
      };
    case "SET_GLOBAL_PRIORITY":
      return {
        ...state,
        globalConfig: { ...state.globalConfig, priority: action.priority },
        errors: [],
      };
    case "SET_GLOBAL_NOTES":
      return {
        ...state,
        globalConfig: { ...state.globalConfig, notes: action.notes },
        errors: [],
      };
    case "TOGGLE_ASSET_OVERRIDE": {
      return {
        ...state,
        assets: state.assets.map((a) => {
          if (a.assetId !== action.assetId) return a;
          if (a.useGlobalConfig) {
            // Switching to override → copy global config as starting point
            return { ...a, useGlobalConfig: false, overrideConfig: { ...state.globalConfig } };
          }
          // Switching back to global
          return { ...a, useGlobalConfig: true, overrideConfig: undefined };
        }),
        errors: [],
      };
    }
    case "SET_ASSET_MODE": {
      return {
        ...state,
        assets: state.assets.map((a) => {
          if (a.assetId !== action.assetId || !a.overrideConfig) return a;
          return {
            ...a,
            overrideConfig: { ...clearTimingFields(a.overrideConfig), mode: action.mode },
          };
        }),
        errors: [],
      };
    }
    case "SET_ASSET_FIELD": {
      return {
        ...state,
        assets: state.assets.map((a) => {
          if (a.assetId !== action.assetId || !a.overrideConfig) return a;
          return { ...a, overrideConfig: { ...a.overrideConfig, [action.field]: action.value } };
        }),
        errors: [],
      };
    }
    case "SET_ASSET_PRIORITY": {
      return {
        ...state,
        assets: state.assets.map((a) => {
          if (a.assetId !== action.assetId || !a.overrideConfig) return a;
          return { ...a, overrideConfig: { ...a.overrideConfig, priority: action.priority } };
        }),
        errors: [],
      };
    }
    case "ADD_ASSET":
      return {
        ...state,
        assets: [
          ...state.assets,
          { assetId: action.asset.id, assetName: action.asset.name, useGlobalConfig: true },
        ],
        assetSearch: "",
        errors: [],
      };
    case "REMOVE_ASSET":
      return {
        ...state,
        assets: state.assets.filter((a) => a.assetId !== action.assetId),
        errors: [],
      };
    case "SET_ASSET_SEARCH":
      return { ...state, assetSearch: action.query };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET":
      return {
        recipients: [],
        recipientSearch: "",
        globalConfig: defaultConfig(),
        assets: [
          {
            assetId: action.initialAsset.id,
            assetName: action.initialAsset.name,
            useGlobalConfig: true,
          },
        ],
        assetSearch: "",
        errors: [],
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(state: ModalFormState): string[] {
  const errors: string[] = [];
  if (state.recipients.length === 0) errors.push("Select at least one recipient");
  if (state.assets.length === 0) errors.push("Select at least one asset");

  for (const asset of state.assets) {
    const config = asset.useGlobalConfig ? state.globalConfig : asset.overrideConfig;
    if (!config) continue;

    if (config.mode === "absolute") {
      if (!config.dueDate) {
        errors.push(`Due date required for "${asset.assetName}"`);
      } else {
        if (config.warningDate && config.warningDate >= config.dueDate) {
          errors.push(`Warning date must be before due date for "${asset.assetName}"`);
        }
        if (config.acceptanceDeadline && config.acceptanceDeadline >= config.dueDate) {
          errors.push(`Acceptance deadline must be before due date for "${asset.assetName}"`);
        }
      }
    } else {
      if (!config.dueInDays || config.dueInDays <= 0) {
        errors.push(`Due period required for "${asset.assetName}"`);
      } else if (config.warningInDays && config.warningInDays >= config.dueInDays) {
        errors.push(`Warning period must be less than due period for "${asset.assetName}"`);
      }
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Sub-components (inline — single-use helpers)
// ---------------------------------------------------------------------------

function ConfigFields({
  config,
  onModeChange,
  onFieldChange,
  onPriorityChange,
}: {
  config: AssignmentConfig;
  onModeChange: (mode: AssignmentMode) => void;
  onFieldChange: (field: keyof AssignmentConfig, value: string | number | undefined) => void;
  onPriorityChange: (priority: TaskPriority) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Time mode</label>
        <div className="flex gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={() => onModeChange("absolute")}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              config.mode === "absolute"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Specific Dates
          </button>
          <button
            type="button"
            onClick={() => onModeChange("relative")}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              config.mode === "relative"
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Relative Duration
          </button>
        </div>
      </div>

      {/* Conditional date/duration fields */}
      {config.mode === "absolute" ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Due date</label>
            <Input
              type="date"
              value={config.dueDate ?? ""}
              onChange={(e) => onFieldChange("dueDate", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Warning date <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              type="date"
              value={config.warningDate ?? ""}
              onChange={(e) => onFieldChange("warningDate", e.target.value || undefined)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Acceptance deadline <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              type="date"
              value={config.acceptanceDeadline ?? ""}
              onChange={(e) => onFieldChange("acceptanceDeadline", e.target.value || undefined)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Due in</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={365}
                className="w-20"
                value={config.dueInDays ?? ""}
                onChange={(e) =>
                  onFieldChange("dueInDays", e.target.value ? Number(e.target.value) : undefined)
                }
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Warn before <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={365}
                className="w-20"
                value={config.warningInDays ?? ""}
                onChange={(e) =>
                  onFieldChange("warningInDays", e.target.value ? Number(e.target.value) : undefined)
                }
              />
              <span className="text-sm text-muted-foreground">days before due</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Accept within <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={720}
                className="w-20"
                value={config.acceptWithinHours ?? ""}
                onChange={(e) =>
                  onFieldChange(
                    "acceptWithinHours",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
              <span className="text-sm text-muted-foreground">hours of assignment</span>
            </div>
          </div>
        </>
      )}

      {/* Priority */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Priority</label>
        <div className="flex flex-wrap gap-1.5">
          {priorities.map((p) => (
            <Button
              key={p.value}
              type="button"
              variant={config.priority === p.value ? "secondary" : "outline"}
              size="sm"
              className={config.priority === p.value ? p.color : ""}
              onClick={() => onPriorityChange(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AssignTaskModal({
  open,
  onOpenChange,
  initialAsset,
  allAssets,
  users,
  onSubmit,
}: AssignTaskModalProps) {
  const [state, dispatch] = useReducer(formReducer, {
    recipients: [],
    recipientSearch: "",
    globalConfig: defaultConfig(),
    assets: [{ assetId: initialAsset.id, assetName: initialAsset.name, useGlobalConfig: true }],
    assetSearch: "",
    errors: [],
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) dispatch({ type: "RESET", initialAsset });
  }, [open, initialAsset]);

  // Filtered user list for recipient search
  const filteredUsers = users.filter((user) => {
    if (user.status !== "active") return false;
    const query = state.recipientSearch.toLowerCase();
    if (!query) return true;
    return (
      user.displayName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const isRecipientSelected = (user: User) =>
    state.recipients.some((u) => u.id === user.id);

  // Filtered asset list for "Add Asset" search
  const selectedAssetIds = new Set(state.assets.map((a) => a.assetId));
  const filteredAssets = allAssets.filter((asset) => {
    if (selectedAssetIds.has(asset.id)) return false;
    if (!state.assetSearch) return false;
    return asset.name.toLowerCase().includes(state.assetSearch.toLowerCase());
  });

  function handleSubmit() {
    const errors = validate(state);
    if (errors.length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    onSubmit({
      assigneeIds: state.recipients.map((u) => u.id),
      globalConfig: state.globalConfig,
      assets: state.assets,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Assign as Task</DialogTitle>
          <DialogDescription>
            Configure assignment settings and select assets
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ============================================================ */}
            {/* LEFT COLUMN — Master Control                                  */}
            {/* ============================================================ */}
            <div className="lg:w-[340px] shrink-0 space-y-5">
              {/* Recipients */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Assign to</label>

                {/* Selected chips */}
                {state.recipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {state.recipients.map((user) => (
                      <span
                        key={user.id}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {user.displayName}
                        <button
                          type="button"
                          onClick={() => dispatch({ type: "REMOVE_RECIPIENT", userId: user.id })}
                          className="rounded-sm p-0.5 transition-colors hover:bg-accent cursor-pointer"
                          aria-label={`Remove ${user.displayName}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search users..."
                    value={state.recipientSearch}
                    onChange={(e) =>
                      dispatch({ type: "SET_RECIPIENT_SEARCH", query: e.target.value })
                    }
                    className="pl-8"
                  />
                </div>

                {/* User list */}
                <div className="max-h-[140px] overflow-y-auto rounded-lg border">
                  {filteredUsers.length === 0 ? (
                    <p className="p-3 text-center text-sm text-muted-foreground">
                      No users found
                    </p>
                  ) : (
                    filteredUsers.map((user) => {
                      const selected = isRecipientSelected(user);
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => dispatch({ type: "TOGGLE_RECIPIENT", user })}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent cursor-pointer"
                        >
                          <Avatar
                            fallback={`${user.firstName[0]}${user.lastName[0]}`}
                            src={user.avatarUrl}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.title}</p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-[10px]">
                            {user.role}
                          </Badge>
                          {selected && <Check size={16} className="shrink-0 text-primary" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Global config fields */}
              <ConfigFields
                config={state.globalConfig}
                onModeChange={(mode) => dispatch({ type: "SET_MODE", mode })}
                onFieldChange={(field, value) =>
                  dispatch({ type: "SET_GLOBAL_FIELD", field, value })
                }
                onPriorityChange={(priority) =>
                  dispatch({ type: "SET_GLOBAL_PRIORITY", priority })
                }
              />

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Textarea
                  placeholder="Add instructions or context..."
                  value={state.globalConfig.notes ?? ""}
                  onChange={(e) => dispatch({ type: "SET_GLOBAL_NOTES", notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* ============================================================ */}
            {/* RIGHT COLUMN — Asset List                                     */}
            {/* ============================================================ */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold mb-3">
                Selected Assets ({state.assets.length})
              </h3>

              {/* Asset cards */}
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {state.assets.map((assetAssignment) => (
                  <div
                    key={assetAssignment.assetId}
                    className="rounded-lg border bg-card p-3"
                  >
                    {/* Asset header row */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        <FileText size={14} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {assetAssignment.assetName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox
                            checked={assetAssignment.useGlobalConfig}
                            onCheckedChange={() =>
                              dispatch({
                                type: "TOGGLE_ASSET_OVERRIDE",
                                assetId: assetAssignment.assetId,
                              })
                            }
                          />
                          <span className="text-xs text-muted-foreground">Global</span>
                        </label>
                        {state.assets.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ASSET",
                                assetId: assetAssignment.assetId,
                              })
                            }
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                            aria-label={`Remove ${assetAssignment.assetName}`}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Override config (expanded when useGlobalConfig is false) */}
                    {!assetAssignment.useGlobalConfig && assetAssignment.overrideConfig && (
                      <div className="mt-3 pt-3 border-t">
                        <ConfigFields
                          config={assetAssignment.overrideConfig}
                          onModeChange={(mode) =>
                            dispatch({
                              type: "SET_ASSET_MODE",
                              assetId: assetAssignment.assetId,
                              mode,
                            })
                          }
                          onFieldChange={(field, value) =>
                            dispatch({
                              type: "SET_ASSET_FIELD",
                              assetId: assetAssignment.assetId,
                              field,
                              value,
                            })
                          }
                          onPriorityChange={(priority) =>
                            dispatch({
                              type: "SET_ASSET_PRIORITY",
                              assetId: assetAssignment.assetId,
                              priority,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add asset search */}
              <div className="mt-3 space-y-1">
                <div className="relative">
                  <Plus
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Search to add asset..."
                    value={state.assetSearch}
                    onChange={(e) =>
                      dispatch({ type: "SET_ASSET_SEARCH", query: e.target.value })
                    }
                    className="pl-8"
                  />
                </div>
                {filteredAssets.length > 0 && (
                  <div className="max-h-[120px] overflow-y-auto rounded-lg border">
                    {filteredAssets.map((asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => dispatch({ type: "ADD_ASSET", asset })}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-accent cursor-pointer"
                      >
                        <FileText size={14} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{asset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex-col items-stretch sm:flex-row sm:items-center">
          {/* Validation errors */}
          {state.errors.length > 0 && (
            <div className="flex-1 space-y-1 mb-3 sm:mb-0">
              {state.errors.map((error, i) => (
                <p key={i} className="text-sm text-destructive">
                  {error}
                </p>
              ))}
            </div>
          )}
          <div className="flex items-center justify-end gap-2 sm:ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Assign Task</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
