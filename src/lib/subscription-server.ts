import { prisma } from "@/lib/prisma";

export type SubscriptionStatusSimple = "none" | "pending" | "active" | "failed";

export async function getLatestSubscriptionForUser(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function mapStatus(status: string | null | undefined): SubscriptionStatusSimple {
  switch (status) {
    case "active":
      return "active";
    case "pending":
      return "pending";
    case "failed":
    case "cancelled":
      return "failed";
    default:
      return "none";
  }
}
