"use client";

import { useState } from "react";
import type { SubscriptionStatusSimple } from "@/lib/subscription-server";

export default function BillingClient({
  latest,
  history,
  status,
}: {
  latest: any;
  history: any[];
  status: SubscriptionStatusSimple;
}) {
  const [loading, setLoading] = useState(false);

  async function retryPayment(planId: string) {
    try {
      setLoading(true);
      const res = await fetch("/api/billing/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
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
      ? "Active"
      : status === "pending"
      ? "Pending Confirmation"
      : status === "failed"
      ? "Payment Failed"
      : "No Active Subscription";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage Subscription</h1>

      {/* Current Subscription Card */}
      <div className="border rounded-lg p-5 shadow-sm bg-white space-y-3">
        <h2 className="text-lg font-medium">Current Subscription</h2>

        <p className="text-gray-700">
          Status: <strong>{statusLabel}</strong>
        </p>

        {latest && (
          <p className="text-gray-600 text-sm">
            Plan: <strong>{latest.planId}</strong> —{" "}
            {(latest.amountCents / 100).toFixed(2)} {latest.currency}
          </p>
        )}

        {(status === "none" || status === "failed") && (
          <button
            onClick={() => retryPayment("starter-monthly")}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Upgrade to Pro"}
          </button>
        )}

        {status === "pending" && (
          <button
            onClick={() => retryPayment(latest.planId)}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Retry Payment"}
          </button>
        )}

        {status === "active" && (
          <p className="text-green-600 text-sm">
            Your subscription is active. Thank you for supporting OpsVantage.
          </p>
        )}
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Billing History</h2>

        {history.length === 0 && (
          <p className="text-gray-500 text-sm">
            No billing history yet. Upgrade to get started.
          </p>
        )}

        {history.map((s) => {
          const simple =
            s.status === "active"
              ? "Active"
              : s.status === "pending"
              ? "Pending"
              : s.status === "failed" || s.status === "cancelled"
              ? "Failed"
              : "None";

          return (
            <div
              key={s.id}
              className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <p className="text-sm text-gray-700">
                <strong>{s.planId}</strong> —{" "}
                {(s.amountCents / 100).toFixed(2)} {s.currency}
              </p>

              <p className="text-sm text-gray-600">
                Status: <strong>{simple}</strong>
              </p>

              <p className="text-xs text-gray-500">
                Created: {new Date(s.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
