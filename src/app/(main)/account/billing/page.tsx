"use client";

import React from "react";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: 29,
    features: [
      "Up to 10 users",
      "5 GB storage",
      "Basic Knowledge Assistant",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: 79,
    current: true,
    features: [
      "Up to 50 users",
      "50 GB storage",
      "Advanced Knowledge Assistant",
      "Priority support",
      "Custom commands",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    features: [
      "Unlimited users",
      "Unlimited storage",
      "Full Knowledge Assistant",
      "Dedicated support",
      "SSO / SAML",
      "Custom integrations",
      "SLA guarantees",
    ],
  },
];

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing"
        backHref="/account"
        backLabel="Account Center"
      />

      {/* Current Plan */}
      <div className="mt-6 rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-xl font-semibold mt-1">Professional</p>
            <p className="text-sm text-muted-foreground mt-1">
              $79/month &middot; Renews April 15, 2024
            </p>
          </div>
          <Button variant="outline" size="sm">
            Manage Payment
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 ${
              plan.current ? "border-primary ring-1 ring-primary" : "bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{plan.name}</h3>
              {plan.current && <Badge>Current</Badge>}
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check size={14} className="text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full mt-6"
              variant={plan.current ? "outline" : "default"}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
