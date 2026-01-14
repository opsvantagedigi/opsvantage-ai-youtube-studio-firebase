"use client";

export default function AdminBillingClient({ subs }: { subs: any[] }) {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Billing Overview</h1>

      {subs.length === 0 && (
        <p className="text-gray-500 text-sm">No subscriptions found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subs.map((s) => {
          const statusColor =
            s.status === "active"
              ? "text-green-600"
              : s.status === "pending"
              ? "text-yellow-600"
              : "text-red-600";

          return (
            <div
              key={s.id}
              className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">{s.planId}</p>
                <span className={`text-sm font-semibold ${statusColor}`}>
                  {s.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                User: <strong>{s.user?.name ?? "—"}</strong>
              </p>

              <p className="text-sm text-gray-600">
                Email: {s.user?.email ?? "—"}
              </p>

              <p className="text-sm text-gray-600">
                Amount: {(s.amountCents / 100).toFixed(2)} {s.currency}
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
