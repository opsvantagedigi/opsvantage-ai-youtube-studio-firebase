import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminOrSuperuser } from "@/lib/admin";
import AdminBillingClient from "./AdminBillingClient";

export default async function AdminBillingPage() {
  const session = await getServerSession(authOptions);
  // Type guard for session.user.id
  const userId = typeof session?.user?.id === "string" ? session.user.id : undefined;

  if (!userId || !(await isAdminOrSuperuser(userId))) {
    return <div className="p-6 text-red-600">Not authorized.</div>;
  }

  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
    take: 100,
  });

  return <AdminBillingClient subs={subs} />;
}
