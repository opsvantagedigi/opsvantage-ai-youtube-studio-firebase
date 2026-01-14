"use client"

import React from "react"

export default function DashboardClient({ status }: { status: string | null }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Subscription</h2>
      <p className="text-sm text-slate-300 mt-2">Status: {status ?? "none"}</p>
    </div>
  )
}
