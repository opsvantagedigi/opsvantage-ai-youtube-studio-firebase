"use client";

import { useState } from "react";
import type { SubscriptionStatusSimple } from "@/lib/subscription-server";

export default function DashboardClient({ status }: { status: SubscriptionStatusSimple }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    try {
      setLoading(true);
      const res = await fetch("/api/billing/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "starter-monthly" }),
      });

      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Failed to create payment");
      }
    } finally {
      setLoading(false);
    }
  }

  const statusLabel =
    status === "active"
      ? "Pro (Active)"
      : status === "pending"
      ? "Payment Pending"
      : status === "failed"
      ? "Payment Failed"
      : "Free Tier";

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="border p-4 rounded-md space-y-2">
        <p>
          Your subscription: <strong>{statusLabel}</strong>
        </p>

        {(status === "none" || status === "failed") && (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Upgrade to Pro"}
          </button>
        )}

        {status === "pending" && (
          <p className="text-yellow-600 text-sm">
            We’re waiting for payment confirmation. If you’ve paid, this will update shortly.
          </p>
        )}

        {status === "active" && (
          <p className="text-green-600 text-sm">Thank you for being a Pro member.</p>
        )}
      </div>
    </div>
  );
}
