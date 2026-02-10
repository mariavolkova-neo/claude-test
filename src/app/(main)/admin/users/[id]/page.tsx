"use client";

import React, { useState } from "react";
import { MoreHorizontal, X, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const timezones = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
];

const statusOptions = ["Active", "Inactive", "Pending"];

export default function UserDetailPage() {
  const [form, setForm] = useState({
    firstName: "Tamar",
    lastName: "Lomidze",
    displayName: "Tamar Lomidze",
    title: "Senior Engineer",
    division: "Engineering",
    pronouns: "She/Her",
    timezone: "America/New_York",
    preferredLanguages: ["English", "Georgian"],
    status: "Active",
    about: "",
    email: "tamar@example.com",
    loginId: "tamar@example.com",
    password: "••••••••",
    contentLicenses: ["Standard", "Premium"],
    tags: ["Engineering", "Leadership", "Onboarding"],
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const removeTag = (field: "preferredLanguages" | "contentLicenses" | "tags", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((t) => t !== value),
    }));
  };

  return (
    <div>
      <PageHeader
        title="Tamar Lomidze"
        backHref="/admin/users"
        backLabel="All Users"
        actions={
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        }
      />

      <Tabs defaultValue="details" className="mt-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <X size={18} />
            </Button>
            <Button size="icon">
              <Check size={18} />
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-muted-foreground">
              User overview and activity will be displayed here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-8">
            {/* Basic Info Section */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Basic Info
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  label="First Name"
                  value={form.firstName}
                  onChange={(v) => updateField("firstName", v)}
                />
                <FormField
                  label="Last Name"
                  value={form.lastName}
                  onChange={(v) => updateField("lastName", v)}
                />
                <FormField
                  label="Display Name"
                  value={form.displayName}
                  onChange={(v) => updateField("displayName", v)}
                />
                <FormField
                  label="Title"
                  value={form.title}
                  onChange={(v) => updateField("title", v)}
                />
                <FormField
                  label="Division"
                  value={form.division}
                  onChange={(v) => updateField("division", v)}
                />
                <FormField
                  label="Pronouns"
                  value={form.pronouns}
                  onChange={(v) => updateField("pronouns", v)}
                />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Timezone
                  </label>
                  <select
                    value={form.timezone}
                    onChange={(e) => updateField("timezone", e.target.value)}
                    className="mt-1 flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Preferred Language(s)
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1.5 rounded-lg border border-input p-2 min-h-9">
                    {form.preferredLanguages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="gap-1">
                        {lang}
                        <button
                          onClick={() =>
                            removeTag("preferredLanguages", lang)
                          }
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="mt-1 flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">
                  About
                </label>
                <textarea
                  value={form.about}
                  onChange={(e) => updateField("about", e.target.value)}
                  rows={3}
                  className="mt-1 flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Tell us about this user..."
                />
              </div>
            </section>

            {/* Account Section */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Account
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  label="Email"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  type="email"
                />
                <FormField
                  label="Login ID"
                  value={form.loginId}
                  onChange={(v) => updateField("loginId", v)}
                />
                <FormField
                  label="Password"
                  value={form.password}
                  onChange={(v) => updateField("password", v)}
                  type="password"
                />
              </div>
            </section>

            {/* Tags & Licenses Section */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Assignments
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Content License(s)
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1.5 rounded-lg border border-input p-2 min-h-9">
                    {form.contentLicenses.map((lic) => (
                      <Badge key={lic} variant="secondary" className="gap-1">
                        {lic}
                        <button
                          onClick={() => removeTag("contentLicenses", lic)}
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tags
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1.5 rounded-lg border border-input p-2 min-h-9">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag("tags", tag)}
                          className="ml-0.5 hover:text-destructive"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
}
