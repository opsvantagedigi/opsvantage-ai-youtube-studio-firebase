import { prisma } from "@/lib/prisma";

export type SubscriptionStatusSimple = "none" | "pending" | "active" | "failed";

export async function getUserSubscriptionStatus(userId: string | null | undefined): Promise<SubscriptionStatusSimple> {
  if (!userId) return "none";
  const sub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (!sub) return "none";
  switch (sub.status) {
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

// ...existing code...
