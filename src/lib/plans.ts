export type PlanId = "starter-monthly" | "pro-monthly";

export const PLANS: Record<
  PlanId,
  { amountCents: number; currency: string; label: string }
> = {
  "starter-monthly": {
    amountCents: 1900,
    currency: "USD",
    label: "Starter Monthly",
  },
  "pro-monthly": {
    amountCents: 4900,
    currency: "USD",
    label: "Pro Monthly",
  },
};
