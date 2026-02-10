"use client";

import React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const usageData = [
  { month: "Oct", credits: 1200 },
  { month: "Nov", credits: 1800 },
  { month: "Dec", credits: 2400 },
  { month: "Jan", credits: 2100 },
  { month: "Feb", credits: 3200 },
  { month: "Mar", credits: 2800 },
];

const maxCredits = Math.max(...usageData.map((d) => d.credits));

export default function CreditsPage() {
  return (
    <div>
      <PageHeader
        title="Credit Usage"
        backHref="/account"
        backLabel="Account Center"
        actions={
          <Button size="sm">Purchase Credits</Button>
        }
      />

      {/* Balance Card */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <p className="text-3xl font-bold mt-1">4,250</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Used This Month</p>
          <p className="text-3xl font-bold mt-1">2,800</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Monthly Limit</p>
          <p className="text-3xl font-bold mt-1">10,000</p>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-6">Usage Over Time</h2>
        <div className="flex items-end gap-3 h-48">
          {usageData.map((d) => (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">
                {d.credits.toLocaleString()}
              </span>
              <div
                className="w-full rounded-t-md bg-primary/80 transition-all hover:bg-primary"
                style={{
                  height: `${(d.credits / maxCredits) * 100}%`,
                  minHeight: "8px",
                }}
              />
              <span className="text-xs text-muted-foreground">
                {d.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Usage by Feature</h2>
        <div className="space-y-3">
          {[
            { feature: "Knowledge Assistant", credits: 1800, pct: 64 },
            { feature: "Document Analysis", credits: 620, pct: 22 },
            { feature: "Quiz Generation", credits: 280, pct: 10 },
            { feature: "Other", credits: 100, pct: 4 },
          ].map((item) => (
            <div key={item.feature}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{item.feature}</span>
                <span className="text-muted-foreground">
                  {item.credits.toLocaleString()} credits ({item.pct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
