"use client";

import React, { useState } from "react";
import { useTenant } from "@/components/providers/TenantProvider";

export default function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace, activeOrg } = useTenant();
  const [open, setOpen] = useState(false);

  const filtered = activeOrg ? workspaces.filter((w) => w.organizationId === activeOrg.id) : workspaces;

  return (
    <div className="relative">
      <button onClick={() => setOpen(true)} className="px-2 py-1 font-medium">
        {activeWorkspace?.name ?? "Select workspace"} ▾
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-24" onClick={() => setOpen(false)}>
          <div className="bg-white rounded shadow-lg w-full max-w-md p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Switch workspace</h2>
            <ul className="space-y-2">
              {filtered.map((ws) => (
                <li key={ws.id}>
                  <button
                    className="w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setActiveWorkspace(ws);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{ws.name}</span>
                      <span className="text-sm text-gray-500">{ws.role}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
