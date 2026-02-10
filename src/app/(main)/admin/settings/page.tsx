"use client";

import React from "react";
import {
  Globe,
  Bell,
  Shield,
  Palette,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const settingsSections = [
  {
    title: "General",
    icon: Globe,
    description: "Organization name, timezone, and language preferences",
    fields: [
      { label: "Organization Name", placeholder: "PMI Delta Engineering" },
      { label: "Default Language", placeholder: "English (US)" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    description: "Configure email and in-app notification preferences",
    fields: [
      { label: "Admin Email", placeholder: "admin@example.com" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    description: "Authentication, SSO, and access control settings",
    fields: [
      { label: "Session Timeout (minutes)", placeholder: "30" },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    description: "Branding, theme, and display customization",
    fields: [
      { label: "Primary Color", placeholder: "#3b82f6" },
    ],
  },
];

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        backHref="/admin"
        backLabel="Admin Center"
      />

      <div className="mt-8 space-y-6">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <section.icon size={20} />
              </div>
              <div>
                <h2 className="font-semibold">{section.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {section.fields.map((field) => (
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
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
