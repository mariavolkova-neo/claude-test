"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardList,
  BookOpen,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const statCards = [
  {
    title: "Active Tasks",
    value: "12",
    icon: ClipboardList,
    href: "/tasks",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Knowledge Assets",
    value: "48",
    icon: BookOpen,
    href: "/knowledge",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Team Members",
    value: "24",
    icon: Users,
    href: "/admin/users",
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "AI Queries Today",
    value: "156",
    icon: Sparkles,
    href: "/assistant",
    color: "text-amber-600 bg-amber-50",
  },
];

const recentActivity = [
  {
    label: "Nuclear Safety Standards updated",
    time: "2 hours ago",
    done: false,
  },
  {
    label: "Reactor Design Fundamentals reviewed",
    time: "4 hours ago",
    done: true,
  },
  {
    label: "New team member added",
    time: "Yesterday",
    done: true,
  },
  {
    label: "Emergency Response Procedures assigned",
    time: "Yesterday",
    done: false,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group flex items-center gap-4 rounded-xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
            >
              <card.icon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border bg-card p-4"
            >
              {item.done ? (
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-green-600"
                />
              ) : (
                <Clock size={16} className="shrink-0 text-blue-600" />
              )}
              <span className="flex-1 text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
