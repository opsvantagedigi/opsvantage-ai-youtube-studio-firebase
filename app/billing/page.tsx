import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapStatus } from "@/lib/subscription-server";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return null;

  const subs = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const latest = subs[0] ?? null;
  const status = mapStatus(latest?.status);

  return (
    <BillingClient
      latest={latest}
      history={subs}
      status={status}
    />
  );
}
