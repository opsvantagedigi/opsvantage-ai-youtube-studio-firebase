import { prisma } from "@/lib/prisma";

export type SubscriptionStatusSimple = "none" | "pending" | "active" | "failed";

// ...existing code...

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
      return "active";
    case "pending":
      return "pending";
    case "failed":
    case "cancelled":
      return "failed";
    default:
      return "none";
  }
}import { prisma } from "./prisma"

export type SubscriptionStatus = "none" | "pending" | "active" | "failed"

export async function getUserSubscriptionStatus(userId: string | null | undefined): Promise<SubscriptionStatus> {
  if (!userId) return "none"

  const sub = await (prisma as any).subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  if (!sub) return "none"

  switch (sub.status) {
    case "active":
      return "active"
    case "pending":
      return "pending"
    case "failed":
    case "expired":
      return "failed"
    default:
      return "pending"
  }
}
