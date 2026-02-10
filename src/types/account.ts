export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
}

export interface CreditUsage {
  date: string;
  creditsUsed: number;
  feature: string;
}
