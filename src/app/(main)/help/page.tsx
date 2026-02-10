"use client";

import React from "react";
import {
  BookOpen,
  MessageCircle,
  FileQuestion,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const helpCards = [
  {
    title: "Documentation",
    icon: BookOpen,
    description: "Browse guides, tutorials, and API references",
  },
  {
    title: "Contact Support",
    icon: MessageCircle,
    description: "Reach out to our support team for assistance",
  },
  {
    title: "FAQs",
    icon: FileQuestion,
    description: "Find answers to commonly asked questions",
  },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader title="Help & Support" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpCards.map((card) => (
          <div
            key={card.title}
            className="group flex flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <card.icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink size={14} />
              Learn more
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
