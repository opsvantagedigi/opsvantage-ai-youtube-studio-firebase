"use client";

import React from "react";
import OrgSwitcher from "@/components/layout/OrgSwitcher";
import WorkspaceSwitcher from "@/components/layout/WorkspaceSwitcher";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <OrgSwitcher />
            <WorkspaceSwitcher />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Ajay ▾</div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
