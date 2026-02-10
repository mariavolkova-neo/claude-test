"use client";

import React from "react";
import {
  Sparkles,
  Database,
  Sliders,
  MessageSquare,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const aiConfigs = [
  {
    title: "AI Model",
    icon: Sparkles,
    description: "Select and configure the AI model used for knowledge queries",
    status: "Active",
    fields: [
      { label: "Model", placeholder: "GPT-4o" },
      { label: "Temperature", placeholder: "0.7" },
    ],
  },
  {
    title: "Knowledge Sources",
    icon: Database,
    description: "Manage which knowledge bases the AI can access",
    status: "3 sources",
    fields: [
      { label: "Default Collection", placeholder: "All Documents" },
    ],
  },
  {
    title: "Response Settings",
    icon: Sliders,
    description: "Fine-tune response behavior and formatting",
    status: "Default",
    fields: [
      { label: "Max Response Length", placeholder: "2048" },
      { label: "Citation Style", placeholder: "Inline" },
    ],
  },
  {
    title: "Chat Interface",
    icon: MessageSquare,
    description: "Customize the assistant chat experience for users",
    status: "Enabled",
    fields: [
      { label: "Welcome Message", placeholder: "How can I help you today?" },
    ],
  },
];

export default function KnowledgeAIPage() {
  return (
    <div>
      <PageHeader
        title="Knowledge AI"
        backHref="/admin"
        backLabel="Admin Center"
      />

      <div className="mt-8 space-y-6">
        {aiConfigs.map((config) => (
          <div
            key={config.title}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <config.icon size={20} />
                </div>
                <div>
                  <h2 className="font-semibold">{config.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{config.status}</Badge>
            </div>
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.label}>
                  <label className="text-sm font-medium">
                    {field.label}
                  </label>
                  <Input
                    placeholder={field.placeholder}
                    className="mt-1 max-w-md"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button>Save Configuration</Button>
        </div>
      </div>
    </div>
  );
}
