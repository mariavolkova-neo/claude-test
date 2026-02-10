"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

const accountCards = [
  {
    title: "Billing",
    icon: CreditCard,
    href: "/account/billing",
    description: "Manage your subscription, payment methods, and invoices",
  },
  {
    title: "Credit Usage",
    icon: BarChart3,
    href: "/account/credits",
    description: "Monitor AI credit consumption and purchase additional credits",
  },
];

export default function AccountPage() {
  return (
    <div>
      <PageHeader title="Account Center" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accountCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
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
          </Link>
        ))}
      </div>
    </div>
  );
}
